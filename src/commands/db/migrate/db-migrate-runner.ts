import { readdirSync, existsSync, readFileSync } from 'fs';
import { Process } from '@/common/process/process';
import { DbMigrateCommandOptions } from './db-migrate-command-options';

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
    if (this.options.service && service !== this.options.service) {
      console.log(`Skipping ${service} - not the target service: ${this.options.service}`);
      return true;
    }
    return false;
  }

  private shouldSkipSchema(schemaPath: string): boolean {
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
      try {
        const command = `npx prisma migrate dev --schema=${schemaPath}`;
        console.log(`Running: ${command}`);
        this.process.exec(command, true, this.options.dir.services);
      } catch (error) {
        console.error(`\nMigration failed for ${schemaPath}`);
        console.error(`Error details:`, error);
        console.log(`\nThe migration failed. You can try one of these options:`);
        console.log(`\n1. Run 'npx prisma migrate reset --schema=${schemaPath}' manually to reset the database`);
        console.log(`\n2. Fix the migration issues and run this script again`);
        console.log(`\n3. Check the Prisma schema for syntax errors`);
        throw new Error(`Migration failed for ${schemaPath}. Please resolve the issues manually.`);
      }
    } else if (this.options.env === 'prod') {
      try {
        const command = `npx prisma migrate deploy --schema=${schemaPath}`;
        console.log(`Running: ${command}`);
        this.process.exec(command, true, this.options.dir.services);
      } catch (error) {
        console.error(`Production migration failed for ${schemaPath}`);
        console.error(`Error details:`, error);
        throw new Error(`Production migration failed for ${schemaPath}. Please check the migration history and resolve conflicts.`);
      }
    } else {
      console.error(`Invalid environment: ${this.options.env}. Use 'dev' or 'prod'`);
      process.exit(1);
    }
  }

  private processService(service: string): void {
    const schemaPath = this.options.dir.schema(service);

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
    if (!existsSync(this.options.dir.services)) {
      throw new Error(`Services directory does not exist: ${this.options.dir.services}`);
    }

    this.logConfiguration();

    const results: { service: string; success: boolean; error?: string }[] = [];

    for (const service of readdirSync(this.options.dir.services)) {
      if (this.shouldSkipService(service)) {
        continue;
      }
      
      try {
        this.processService(service);
        results.push({ service, success: true });
        console.log(`Successfully processed service: ${service}\n`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        results.push({ service, success: false, error: errorMessage });
        console.error(`Failed to process service: ${service}`);
        console.error(`Error: ${errorMessage}\n`);
      }
    }

    // Summary
    console.log('\nMigration Summary:');
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log(`Successful: ${successful.length}`);
    console.log(`Failed: ${failed.length}`);
    
    if (failed.length > 0) {
      console.log('\nFailed services:');
      failed.forEach(result => {
        console.log(`  - ${result.service}: ${result.error}`);
      });
      process.exit(1);
    } else {
      console.log('\nAll migrations completed successfully!');
    }
  }
} 