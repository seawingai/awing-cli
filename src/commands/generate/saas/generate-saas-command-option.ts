import { CoreOptions, Preset } from "@/commands/core/core-options";
 
export class GenerateSaasCommandOption extends CoreOptions {
    constructor(name: string) {
      super(name);
    }
  
    get type(): string {
      return Preset.SAAS;
    }
  
    get command(): string {
      return [
        `npx create-nx-workspace@latest ${this.name}`,
        `--name=${this.name}`,
        '--preset=apps',
        '--unitTestRunner=none',
        '--eslint=false',
        '--prettier=false',
        '--ci=skip',
        '--cache=true',
        '--packageManager=pnpm',
        '--no-interactive',
        `--tags=saas`,
      ].join(' ');
    }
  
    toString(): string {
      return `${super.toString()}
        ${this.constructor.name} {
          name: ${this.name}
        }`;
    }
  }
  