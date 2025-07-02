import { readdirSync, existsSync } from 'fs';
import { CoreRunner } from '@/commands/core';
import { DbSchemaCommandOption } from '@/commands/db/schema/db-schema-command-option';

export class DbSchemaRunner extends CoreRunner {
  constructor(options: DbSchemaCommandOption) {
    super(options);
    this.options = options;
  }

  async run() {
    console.info('Running prisma-generate');

    for (const service of readdirSync(this.options.services)) {
      const schemaPath = this.options.schema;
      if (existsSync(schemaPath)) {
        console.info(`prisma-generate for: ${schemaPath}`);
        this.process.exec(`npx prisma generate --schema=${schemaPath}`, true, this.options.services);
      } else {
        console.error(`[ERROR] Path does not exist: ${schemaPath}`);
      }
    }
  }
} 