import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(toolsDir, '..');
const browserDir = path.join(projectRoot, 'dist', 'frontend', 'browser');
const indexPath = path.join(browserDir, 'index.html');
const routesPath = path.join(projectRoot, 'src', 'app', 'seo.routes.json');
const sitemapPath = path.join(projectRoot, 'public', 'sitemap.xml');
const prerenderManifestPath = path.join(projectRoot, 'dist', 'frontend', 'prerendered-routes.json');
const seoBlockPattern = /<!-- SEO_META_START -->[\s\S]*?<!-- SEO_META_END -->/;

const seoConfig = JSON.parse(await readFile(routesPath, 'utf8'));
const sourceHtml = await readFile(indexPath, 'utf8');

if (!seoBlockPattern.test(sourceHtml)) {
  throw new Error('Could not find SEO_META_START/SEO_META_END markers in the built index.html.');
}

const site = seoConfig.site;
const routes = Object.values(seoConfig.routes);
const sitemapPaths = await readSitemapPaths();
const routesByPath = new Map(routes.map((route) => [normalizePath(route.canonicalPath), route]));
const missingRoutes = sitemapPaths.filter((canonicalPath) => !routesByPath.has(canonicalPath));
const extraRoutes = routes
  .map((route) => normalizePath(route.canonicalPath))
  .filter((canonicalPath) => !sitemapPaths.includes(canonicalPath));

if (missingRoutes.length || extraRoutes.length) {
  throw new Error(
    [
      'SEO routes and sitemap.xml are out of sync.',
      missingRoutes.length ? `Missing SEO config for: ${missingRoutes.join(', ')}` : '',
      extraRoutes.length ? `Missing sitemap entries for: ${extraRoutes.join(', ')}` : ''
    ]
      .filter(Boolean)
      .join(' ')
  );
}

for (const route of sitemapPaths.map((canonicalPath) => routesByPath.get(canonicalPath))) {
  const html = sourceHtml.replace(seoBlockPattern, renderSeoBlock(route));
  const outputPath = routeOutputPath(route.canonicalPath);

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html);
}

await writeFile(
  prerenderManifestPath,
  `${JSON.stringify(sitemapPaths, null, 2)}\n`
);

console.log(`[seo-prerender] Wrote ${sitemapPaths.length} route HTML files to ${browserDir}.`);

async function readSitemapPaths() {
  const sitemapXml = await readFile(sitemapPath, 'utf8');
  const locs = [...sitemapXml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((match) => match[1]);

  if (!locs.length) {
    throw new Error(`No <loc> entries found in ${sitemapPath}.`);
  }

  return locs.map((loc) => normalizePath(loc));
}

function renderSeoBlock(route) {
  const title = route.title ?? site.name;
  const description = route.description ?? site.defaultDescription;
  const robots = route.robots ?? 'index, follow';
  const ogType = route.ogType ?? 'website';
  const canonicalUrl = absoluteUrl(route.canonicalPath);
  const imageUrl = absoluteUrl(route.image ?? site.defaultImagePath);
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@id': `${site.url}/#organization`,
        '@type': 'Organization',
        name: site.name,
        url: `${site.url}/`,
        logo: absoluteUrl('/img/logo.png'),
        sameAs: site.sameAs
      },
      {
        '@id': `${site.url}/#website`,
        '@type': 'WebSite',
        name: site.name,
        publisher: { '@id': `${site.url}/#organization` },
        url: `${site.url}/`
      },
      {
        '@id': `${canonicalUrl}#webpage`,
        '@type': 'WebPage',
        description,
        image: imageUrl,
        isPartOf: { '@id': `${site.url}/#website` },
        name: title,
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: imageUrl
        },
        url: canonicalUrl
      }
    ]
  };

  return [
    '<!-- SEO_META_START -->',
    `  <title>${escapeHtml(title)}</title>`,
    `  <meta name="description" content="${escapeHtml(description)}">`,
    `  <meta name="robots" content="${escapeHtml(robots)}">`,
    `  <link rel="canonical" href="${escapeHtml(canonicalUrl)}">`,
    `  <meta property="og:title" content="${escapeHtml(title)}">`,
    `  <meta property="og:description" content="${escapeHtml(description)}">`,
    `  <meta property="og:type" content="${escapeHtml(ogType)}">`,
    `  <meta property="og:url" content="${escapeHtml(canonicalUrl)}">`,
    `  <meta property="og:site_name" content="${escapeHtml(site.name)}">`,
    `  <meta property="og:image" content="${escapeHtml(imageUrl)}">`,
    `  <meta property="og:image:alt" content="${escapeHtml(site.imageAlt)}">`,
    '  <meta name="twitter:card" content="summary_large_image">',
    `  <meta name="twitter:site" content="${escapeHtml(site.socialHandle)}">`,
    `  <meta name="twitter:title" content="${escapeHtml(title)}">`,
    `  <meta name="twitter:description" content="${escapeHtml(description)}">`,
    `  <meta name="twitter:image" content="${escapeHtml(imageUrl)}">`,
    `  <meta name="twitter:image:alt" content="${escapeHtml(site.imageAlt)}">`,
    '  <script id="seo-structured-data" type="application/ld+json">',
    indentJson(structuredData),
    '  </script>',
    '  <!-- SEO_META_END -->'
  ].join('\n');
}

function routeOutputPath(canonicalPath) {
  const trimmedPath = normalizePath(canonicalPath).replace(/^\/+|\/+$/g, '');

  if (!trimmedPath) {
    return indexPath;
  }

  const segments = trimmedPath.split('/');

  if (segments.some((segment) => segment === '..' || segment === '.')) {
    throw new Error(`Unsafe route path: ${canonicalPath}`);
  }

  return path.join(browserDir, ...segments, 'index.html');
}

function absoluteUrl(pathOrUrl) {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  const normalizedPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${site.url}${normalizedPath}`;
}

function normalizePath(pathOrUrl) {
  let rawPath = pathOrUrl;

  if (/^https?:\/\//i.test(pathOrUrl)) {
    const url = new URL(pathOrUrl);

    if (url.origin !== site.url) {
      throw new Error(`Unexpected sitemap origin: ${url.origin}`);
    }

    rawPath = url.pathname;
  }

  const pathWithSlash = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
  return pathWithSlash.length > 1 ? pathWithSlash.replace(/\/+$/g, '') : '/';
}

function indentJson(value) {
  return JSON.stringify(value, null, 2)
    .split('\n')
    .map((line) => `    ${line}`)
    .join('\n');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
