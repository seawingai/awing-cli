import { readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { Process } from '@/common/process/process';

export class DbSeedCommandOption {
  servicesDir: string;

  constructor(options: { servicesDir: string; }) {
    this.servicesDir = options.servicesDir;
  }

  toString(): string {
    return `${this.constructor.name} {
        servicesDir: ${this.servicesDir}
      }`;
  }
}

export class DbSchemaRunner {
  private options: DbSeedCommandOption;
  private process = new Process();

  constructor(options: DbSeedCommandOption) {
    this.options = options;
  }

  public async run() {
    console.info('Running prisma-generate');

    for (const service of readdirSync(this.options.servicesDir)) {
      const schemaPath = join(this.options.servicesDir, service, 'db', 'schema.prisma');
      if (existsSync(schemaPath)) {
        console.info(`prisma-generate for: ${schemaPath}`);
        this.process.exec(`npx prisma generate --schema=${schemaPath}`, true, this.options.servicesDir);
      } else {
        console.error(`[ERROR] Path does not exist: ${schemaPath}`);
      }
    }
  }
}