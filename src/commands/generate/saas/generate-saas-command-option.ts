import { CoreOptions, Preset } from "@/commands/core/core-options";
import { join } from "path";
 
export class GenerateSaasCommandOption extends CoreOptions {
    constructor(name: string, template: string = 'default') {
      super(name, null, template);
    }
  
    override get type(): string {
      return Preset.SAAS;
    }
  
    override get target(): string {
      return this.dir.base;
    }

    override get saas(): string {
      return join(this.dir.base, this.name);
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
        '--defaultBase=main',
        '--useProjectJson=true',
        '--workspaces=true',
        '--workspaceType=integrated',
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
  