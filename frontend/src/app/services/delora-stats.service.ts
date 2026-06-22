import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';

export interface DeloraPerformanceStats {
  supportedBlockchains: number;
  protocolsIntegrated: number;
}

interface DeloraChainsResponse {
  chains?: unknown[];
}

interface DeloraTool {
  key?: string;
}

interface DeloraToolsResponse {
  exchanges?: DeloraTool[];
  bridges?: DeloraTool[];
}

@Injectable({
  providedIn: 'root'
})
export class DeloraStatsService {
  private readonly apiBaseUrl = 'https://api.delora.build/v1';

  constructor(private http: HttpClient) {}

  getPerformanceStats(): Observable<DeloraPerformanceStats> {
    return forkJoin({
      chains: this.http.get<DeloraChainsResponse>(`${this.apiBaseUrl}/chains`),
      tools: this.http.get<DeloraToolsResponse>(`${this.apiBaseUrl}/tools`)
    }).pipe(
      map(({ chains, tools }) => ({
        supportedBlockchains: this.getSupportedBlockchainsCount(chains),
        protocolsIntegrated: this.getProtocolsIntegratedCount(tools)
      }))
    );
  }

  private getSupportedBlockchainsCount(response: DeloraChainsResponse): number {
    if (!Array.isArray(response.chains)) {
      throw new Error('Delora chains response is missing the chains array.');
    }

    return response.chains.length;
  }

  private getProtocolsIntegratedCount(response: DeloraToolsResponse): number {
    const exchanges = this.getToolsArray(response.exchanges, 'exchanges');
    const bridges = this.getToolsArray(response.bridges, 'bridges');
    const protocolKeys = new Set<string>();

    [...exchanges, ...bridges].forEach((tool) => {
      const key = tool.key?.trim();

      if (key) {
        protocolKeys.add(key);
      }
    });

    return protocolKeys.size;
  }

  private getToolsArray(tools: DeloraTool[] | undefined, fieldName: string): DeloraTool[] {
    if (!Array.isArray(tools)) {
      throw new Error(`Delora tools response is missing the ${fieldName} array.`);
    }

    return tools;
  }
}
