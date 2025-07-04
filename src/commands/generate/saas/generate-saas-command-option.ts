import { CoreOptions, Preset } from "@/commands/core/core-options";
import { join } from "path";
 
export class GenerateSaasCommandOption extends CoreOptions {
    constructor(name: string, template: string = 'default') {
      super(name, null, template);
    }
  
    override get type(): string {
      return Preset.SAAS;
    }
  
    override get parent(): string {
      return this.dir.base;
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
        '--defaultBase=main',
        '--useProjectJson=true',
        '--workspaces=true',
        '--workspaceType=integrated',
        `--tags=saas`,
        '--no-interactive'
      ].join(' ');
    }
  
    toString(): string {
      return `${super.toString()}
        ${this.constructor.name} {
          name: ${this.name}
        }`;
    }
  }
  