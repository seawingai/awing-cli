import { CoreOptions } from "@/commands/core/core-options";

export class DbSeedCommandOption extends CoreOptions {
  table: string | undefined;
  direction: string;

  constructor(direction: string, table?: string) {
    super();
    this.table = table;
    this.direction = direction;
  }

  toString(): string {
    return `${super.toString()}
      ${this.constructor.name} {
        table: ${this.table}
      }`;
  }
} 