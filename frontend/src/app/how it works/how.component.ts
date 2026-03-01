import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TypingAnimationService } from '../services/typing-animation.service';
import { TitleAnimationService } from '../services/title-animation.service';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'app-how',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    HeaderComponent
  ],
  templateUrl: './how.component.html',
  styleUrls: ['./how.component.scss',
		'./how.component.adaptives.scss'
	],
})
export class HowComponent implements AfterViewInit, OnDestroy {
  private performanceObserver?: IntersectionObserver;
  private demoObserver?: IntersectionObserver;
  private menuItems: { element: HTMLElement; originalText: string }[] = [];
  private activeAnimations: Set<HTMLElement> = new Set();

  @ViewChild('demoVideo') demoVideoRef?: ElementRef<HTMLVideoElement>;

  constructor(
    private renderer: Renderer2,
    private typingAnimation: TypingAnimationService,
    private titleAnimationService: TitleAnimationService
  ) {}

  ngAfterViewInit(): void {
    
    this.initializeMenuAnimation();
    this.initializeDemoVideoObserver();
  }

  private initializePerformanceCounter(): void {
    const performanceSection = document.querySelector('.perfomance');
    if (!performanceSection) return;

    this.performanceObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateCounter('.perfomance-container .perfomance-item:nth-child(1) h1', 24, 0);
            this.animateCounter('.perfomance-container .perfomance-item:nth-child(2) h1', 700, 0, '<', 'ms');
            this.animateCounter('.perfomance-container .perfomance-item:nth-child(3) h1', 8, 0);
            this.animateCounter('.perfomance-container .perfomance-item:nth-child(4) h1', 99.98, 0, '', '%', true);
            
            
            this.performanceObserver?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.3
      }
    );

    this.performanceObserver.observe(performanceSection);
  }

  private initializeDemoVideoObserver(): void {
    const videoElement = this.demoVideoRef?.nativeElement;
    const container = document.querySelector('.demo .demo-container');
    if (!videoElement || !container) return;

    const tryPlay = () => {
      const playPromise = videoElement.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.catch(() => {
          
        });
      }
    };

    this.demoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            tryPlay();
          } else {
            videoElement.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    this.demoObserver.observe(container);

    const handleVisibility = () => {
      if (document.hidden) {
        videoElement.pause();
      } else {
        const rect = container.getBoundingClientRect();
        const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
        if (inViewport) {
          tryPlay();
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const cleanup = () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
    
    setTimeout(() => {
      const originalDestroy = this.ngOnDestroy?.bind(this);
      this.ngOnDestroy = () => {
        cleanup();
        if (originalDestroy) originalDestroy();
      };
    });
  }

  private animateCounter(
    selector: string, 
    target: number, 
    start: number = 0, 
    prefix: string = '', 
    suffix: string = '',
    isDecimal: boolean = false
  ): void {
    const element = document.querySelector(selector) as HTMLElement;
    if (!element) return;

    const duration = 2000; 
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      
      const current = start + (target - start) * easeProgress;
      
      if (isDecimal) {
        element.textContent = prefix + current.toFixed(2) + suffix;
      } else {
        element.textContent = prefix + Math.floor(current) + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  private initializeMenuAnimation(): void {
    
    const menuLinks = document.querySelectorAll('.menu a');
    
    menuLinks.forEach((link) => {
      const element = link as HTMLElement;
      const originalText = element.textContent || '';
      
      
      this.menuItems.push({ element, originalText });
      
      
      element.addEventListener('mouseenter', () => {
        
        this.titleAnimationService.clearAnimationForElement(element);
        
        
        element.textContent = originalText;
        
        
        this.activeAnimations.add(element);
        this.titleAnimationService.startTitleAnimation(
          element,
          originalText,
          {
            animationFrames: 30,
            animationSpeed: 25,
            glitchChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
            cyberChars: '01',
            possibleChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
          }
        );
      });
      
      
      element.addEventListener('mouseleave', () => {
        
        
      });
    });

    
    const tagElements = document.querySelectorAll('.tag');
    
    tagElements.forEach((tag) => {
      const element = tag as HTMLElement;
      const originalText = element.textContent || '';
      
      
      this.menuItems.push({ element, originalText });
      
      
      element.addEventListener('mouseenter', () => {
        
        this.titleAnimationService.clearAnimationForElement(element);
        
        
        element.textContent = originalText;
        
        
        this.activeAnimations.add(element);
        this.titleAnimationService.startTitleAnimation(
          element,
          originalText,
          {
            animationFrames: 30,
            animationSpeed: 25,
            glitchChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
            cyberChars: '01',
            possibleChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
          }
        );
      });
      
      
      element.addEventListener('mouseleave', () => {
        
        
      });
    });

    
    const postElements = document.querySelectorAll('.post p');
    
    postElements.forEach((postElement) => {
      const element = postElement as HTMLElement;
      const originalText = element.textContent || '';
      
      
      this.menuItems.push({ element, originalText });
      
      
      element.addEventListener('mouseenter', () => {
        
        this.titleAnimationService.clearAnimationForElement(element);
        
        
        element.textContent = originalText;
        
        
        this.activeAnimations.add(element);
        this.titleAnimationService.startTitleAnimation(
          element,
          originalText,
          {
            animationFrames: 30,
            animationSpeed: 25,
            glitchChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
            cyberChars: '01',
            possibleChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
          }
        );
      });
      
      
      element.addEventListener('mouseleave', () => {
        
        
      });
    });

    
    const bottomLinkElements = document.querySelectorAll('.bottom-link');
    
    bottomLinkElements.forEach((bottomLink) => {
      const element = bottomLink as HTMLElement;
      const originalText = element.textContent || '';
      
      
      this.menuItems.push({ element, originalText });
      
      
      element.addEventListener('mouseenter', () => {
        
        this.titleAnimationService.clearAnimationForElement(element);
        
        
        element.textContent = originalText;
        
        
        this.activeAnimations.add(element);
        this.titleAnimationService.startTitleAnimation(
          element,
          originalText,
          {
            animationFrames: 30,
            animationSpeed: 25,
            glitchChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
            cyberChars: '01',
            possibleChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
          }
        );
      });
      
      
      element.addEventListener('mouseleave', () => {
        
        
      });
    });

    
    const buttonElements = document.querySelectorAll('.button');
    
    buttonElements.forEach((button) => {
      const buttonElement = button as HTMLElement;
      const textElement = buttonElement.querySelector('p') as HTMLElement;
      
      if (textElement) {
        const originalText = textElement.textContent || '';
        
        
        this.menuItems.push({ element: textElement, originalText });
        
        
        buttonElement.addEventListener('mouseenter', () => {
          
          this.titleAnimationService.clearAnimationForElement(textElement);
          
          
          textElement.textContent = originalText;
          
          
          this.activeAnimations.add(textElement);
          this.titleAnimationService.startTitleAnimation(
            textElement,
            originalText,
            {
              animationFrames: 30,
              animationSpeed: 25,
              glitchChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
              cyberChars: '01',
              possibleChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
            }
          );
        });
        
        
        buttonElement.addEventListener('mouseleave', () => {
          
          
        });
      }
    });
  }

  private stopAllAnimations(): void {
    
    this.titleAnimationService.clearAnimation();
    
    
    this.menuItems.forEach(({ element, originalText }) => {
      element.textContent = originalText;
    });
    
    
    this.activeAnimations.clear();
  }

  ngOnDestroy(): void {
    this.typingAnimation.destroy();
    this.stopAllAnimations();
    
    
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
    if (this.demoObserver) {
      this.demoObserver.disconnect();
    }
    
    
    document.body.style.overflow = '';
    const pageContainer = document.querySelector('.page-container') as HTMLElement;
    if (pageContainer) {
      pageContainer.style.overflow = '';
      pageContainer.style.height = '';
    }
  }
} 
