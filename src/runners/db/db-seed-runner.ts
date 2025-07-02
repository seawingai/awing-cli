import { readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { Process } from '@/common/process/process';

export class DbSeedCommandOption {
  command: string;
  servicesDir: string;
  table: string | undefined;

  constructor(options: { table?: string; }) {
    this.command = "";
    this.servicesDir = "";
    this.table = options.table;
  }

  toString(): string {
    return `${this.constructor.name} {
        servicesDir: ${this.servicesDir},
        table: ${this.table ?? 'undefined'},
      }`;
  }
}

export class DbSeedRunner {
  private options: DbSeedCommandOption;
  private process = new Process();

  constructor(options: DbSeedCommandOption) {
    this.options = options;
  }

  async runSeederForService(serviceName: string, command: string, tableArg?: string): Promise<void> {
    const servicePath = join(this.options.servicesDir, serviceName);
    const seederPath = join(servicePath, 'db', 'seed', 'db-seeder.ts');
    if (!existsSync(seederPath)) {
      console.log(`⚠️  No seeder found for service: ${serviceName}`);
      return;
    }
    try {
      console.log(`🌱 Running seeder for service: ${serviceName}`);
      const seederModule = require(seederPath);
      const SeederClass = seederModule.DbSeeder || seederModule.default?.DbSeeder || seederModule.default;
      if (!SeederClass) {
        console.error(`❌ No DbSeeder class found in ${serviceName}/db/seed/db-seeder.ts`);
        return;
      }
      const seeder = new SeederClass();
      if (command === 'up') {
        const cmd = `npx ts-node --transpile-only ${seederPath} up ${tableArg ?? ''}`;
        this.process.exec(cmd, true, this.options.servicesDir);
        console.log(`✅ Seed up completed for service: ${serviceName}`);
      } else if (command === 'down') {
        const cmd = `npx ts-node --transpile-only ${seederPath} down ${tableArg ?? ''}`;
        this.process.exec(cmd, true, this.options.servicesDir);
        console.log(`✅ Seed down completed for service: ${serviceName}`);
      }
    } catch (error) {
      console.error(`❌ Error running seeder for service ${serviceName}:`, error);
      throw error;
    }
  }

  async runSeeders(command: string, tableArg?: string): Promise<void> {
    try {
      console.log(`🚀 Starting seed ${command} for all services...`);
      const serviceDirs = readdirSync(this.options.servicesDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
      if (serviceDirs.length === 0) {
        console.log('📁 No services found in src/services/');
        return;
      }
      console.log(`📋 Found ${serviceDirs.length} service(s): ${serviceDirs.join(', ')}`);
      for (const serviceName of serviceDirs) {
        await this.runSeederForService(serviceName, command, tableArg);
      }
      console.log(`🎉 Seed ${command} completed for all services!`);
    } catch (error) {
      console.error(`💥 Seed ${command} failed:`, error);
      throw error;
    }
  }

  async run() {
    try {
      await this.runSeeders(this.options.command, this.options.table);
    }
    catch (error) {
      console.error('💥 Seed up failed:', error);
      throw error;
    }
  }
}
