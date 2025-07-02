import { CoreOptions } from "@/commands/core/core-options";

export class DbMigrateCommandOptions extends CoreOptions {
  service: string | undefined;
  table: string | undefined;
  env: string;

  constructor(options: { service?: string; table?: string; env?: string }) {
    super();
    this.service = options.service;
    this.table = options.table;
    this.env = options.env ?? 'dev';
  }

  toString(): string {
    return `${super.toString()}
      ${this.constructor.name} {
        service: ${this.service ?? 'undefined'},
        table: ${this.table ?? 'undefined'},
        env: ${this.env}
      }`;
  }
} 