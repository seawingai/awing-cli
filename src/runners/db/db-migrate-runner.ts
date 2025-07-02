import { readdirSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { Process } from '@/common/process/process';

export class DbMigrateCommandOptions {
  servicesDir: string; 
  service: string | undefined;
  table: string | undefined;
  env: string;

  constructor(options: { service?: string; table?: string; env?: string }) {
    this.servicesDir = "";
    this.service = options.service;
    this.table = options.table;
    this.env = options.env ?? 'dev';
  }

  toString(): string {
    return `${this.constructor.name} {
        baseDir: ${this.servicesDir},
        service: ${this.service ?? 'undefined'},
        table: ${this.table ?? 'undefined'},
        env: ${this.env}
      }`;
  }
}

export class DbMigrateRunner {
  private options: DbMigrateCommandOptions;
  private process = new Process();

  constructor(options: DbMigrateCommandOptions) {
    this.options = options;
  }

  private logConfiguration(): void {
    console.log(`Running migrations in ${this.options.env} mode...`);

    if (this.options.service) {
      console.log(`Running migration only for service: [${this.options.service}]`);
    }

    if (this.options.table) {
      console.log(`Running migration only for table: [${this.options.table}]`);
    }
  }

  private shouldSkipService(service: string): boolean {
    // If serviceName is specified, skip other services
    if (this.options.service && service !== this.options.service) {
      console.log(`Skipping ${service} - not the target service: ${this.options.service}`);
      return true;
    }
    return false;
  }

  private shouldSkipSchema(schemaPath: string): boolean {
    // If tableName is specified, check if the schema contains that table
    if (this.options.table) {
      try {
        const schemaContent = readFileSync(schemaPath, 'utf-8');
        if (!schemaContent.includes(`model ${this.options.table}`)) {
          console.log(`Skipping schema - does not contain table: ${this.options.table}`);
          return true;
        }
      } catch (error) {
        console.error(`Error reading schema file ${schemaPath}:`, error);
        return true;
      }
    }
    return false;
  }

  private runMigration(schemaPath: string): void {
    console.log(`Deploying migration for: ${schemaPath}`);

    if (this.options.env === 'dev') {
      // Development mode: creates and applies new migrations
      try {
        const command = `npx prisma migrate dev --schema=${schemaPath}`;
        console.log(`Running: ${command}`);
        this.process.exec(command, true, this.options.servicesDir);
      } catch (error) {
        console.error(`\n❌ Migration failed for ${schemaPath}`);
        console.error(`Error details:`, error);
        
        // Ask user if they want to reset the database
        console.log(`\n🔄 The migration failed. You can try one of these options:`);
        console.log(`1. Run 'npx prisma migrate reset --schema=${schemaPath}' manually to reset the database`);
        console.log(`2. Fix the migration issues and run this script again`);
        console.log(`3. Check the Prisma schema for syntax errors`);
        
        // Don't automatically reset - let user decide
        throw new Error(`Migration failed for ${schemaPath}. Please resolve the issues manually.`);
      }
    } else if (this.options.env === 'prod') {
      // Production mode: applies existing migrations only
      try {
        const command = `npx prisma migrate deploy --schema=${schemaPath}`;
        console.log(`Running: ${command}`);
        this.process.exec(command, true, this.options.servicesDir);
      } catch (error) {
        console.error(`\n❌ Production migration failed for ${schemaPath}`);
        console.error(`Error details:`, error);
        throw new Error(`Production migration failed for ${schemaPath}. Please check the migration history and resolve conflicts.`);
      }
    } else {
      console.error(`Invalid environment: ${this.options.env}. Use 'dev' or 'prod'`);
      process.exit(1);
    }
  }

  private processService(service: string): void {
    const schemaPath = join(this.options.servicesDir, service, 'db', 'schema.prisma');

    if (existsSync(schemaPath)) {
      if (this.shouldSkipSchema(schemaPath)) {
        return;
      }
      this.runMigration(schemaPath);
    } else {
      console.error(`[ERROR] Path does not exist: ${schemaPath}`);
    }
  }

  public run(): void {
    this.options.servicesDir = 'C:\\data\\seawingai\\git\\awing-cli\\src\\runners\\db';
    
    if (!existsSync(this.options.servicesDir)) {
      throw new Error(`Services directory does not exist: ${this.options.servicesDir}`);
    }

    this.logConfiguration();

    const results: { service: string; success: boolean; error?: string }[] = [];

    for (const service of readdirSync(this.options.servicesDir)) {
      if (this.shouldSkipService(service)) {
        continue;
      }
      
      try {
        this.processService(service);
        results.push({ service, success: true });
        console.log(`✅ Successfully processed service: ${service}\n`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        results.push({ service, success: false, error: errorMessage });
        console.error(`❌ Failed to process service: ${service}`);
        console.error(`Error: ${errorMessage}\n`);
      }
    }

    // Summary
    console.log('\n📊 Migration Summary:');
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log(`✅ Successful: ${successful.length}`);
    console.log(`❌ Failed: ${failed.length}`);
    
    if (failed.length > 0) {
      console.log('\nFailed services:');
      failed.forEach(result => {
        console.log(`  - ${result.service}: ${result.error}`);
      });
      process.exit(1);
    } else {
      console.log('\n🎉 All migrations completed successfully!');
    }
  }
}

