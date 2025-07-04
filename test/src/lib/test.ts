export function lib(): string {
  return 'test';
}

import { NodeCronPlugin } from '@awing/node-cron-plugin';

export class MarketingAgent {
  private static instance: MarketingAgent;
  scheduler: NodeCronPlugin;

  constructor(scheduleFilePath: string) {
    this.scheduler = new NodeCronPlugin(scheduleFilePath);
  }

  async start() {
    await this.scheduler.load();
  }

  async restart() {
    await this.scheduler.restart();
  }

  async stop() {
    await this.scheduler.stop();
  }

  async generateContent() {
    console.log('content generated successfully');
  }

  static getInstance(configPath: string) {
    if (!MarketingAgent.instance) {
      MarketingAgent.instance = new MarketingAgent(configPath);
    }
    return MarketingAgent.instance;
  }
}
