import { CoreOptions, Preset } from "@/commands/core/core-options";
 
export class GenerateLibCommandOption extends CoreOptions {
  directory: string;

  constructor(name: string, dir: string) {
    super(name);
    this.directory = dir;
  }

  get type(): string {
    return Preset.LIB;
  }

  get command(): string {
    return [
      `npx nx g @nx/js:lib ${this.directory}/${this.name}`,
      '--unitTestRunner=jest',
      '--eslint=false',
      '--prettier=false',
      '--ci=skip',
      '--cache=true',
      '--packageManager=pnpm',
      '--no-interactive',
      `--tags=lib`
    ].join(' ');
  }

  toString(): string {
    return `${super.toString()}
      ${this.constructor.name} {
        name: ${this.name}
        dir: ${this.dir}
      }`;
  }
}
