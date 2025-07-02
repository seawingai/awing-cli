import { CoreOptions, Preset } from "@/commands/core/core-options";

 export class GenerateServiceCommandOption extends CoreOptions {
    constructor(name: string) {
      super(name);
    }
  
    get type(): string {
      return Preset.SERVICE;
    }
  
    get command(): string {
      return [
        `npx nx g @nx/node:app ./services/${this.name}`,
        '--framework=fastify',
        '--unitTestRunner=none',
        '--eslint=false',
        '--prettier=false',
        '--ci=skip',
        '--cache=true',
        '--packageManager=pnpm',
        '--no-interactive',
        `--tags=service`
      ].join(' ');
    }
  
    toString(): string {
      return `${super.toString()}
        ${this.constructor.name} {
          name: ${this.name}
        }`;
    }
  }
  