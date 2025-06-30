import { join } from 'path';
import { Process } from '@/common/process/process';

export class GenerateCommandOption {
  type: string;
  name: string;
  baseDir: string;
  
  constructor(type: string, name: string, options: { baseDir?: string}) {
    this.type = type;
    this.name = name;
    this.baseDir = options.baseDir ?? this.defaultBaseDir;
  }

  get defaultBaseDir(): string {
    return process.env.BASE_DIR || process.cwd();
  }

  get targetDir(): string {
    switch (this.type) {
      case 'saas':
        return join(this.baseDir, this.name);
      case 'service':
        return join(this.baseDir, 'services', this.name);
      default:
        return join(this.baseDir, this.name);
    }
  }

  toString(): string {
    return `${this.constructor.name} {
        name: ${this.name},
        baseDir: ${this.baseDir},
        targetDir: ${this.targetDir}
      }`;
  }
}

export class GenerateRunner {
  private options: GenerateCommandOption;
  private process = new Process();
  
  constructor(options: GenerateCommandOption) {
    this.options = options;
  }

  public async run() {
    console.info(`Generating ${this.options.type} in: ${this.options.targetDir}`);

    switch (this.options.type) {
      case 'saas':
        this.createWorkspace(this.options.name);
        break;
      case 'service':
        this.createService(this.options.name);
        break;
      default:
        console.error(`Invalid ${this.options.type}`);
        break;
    }

    console.info(`Finished generating ${this.options.type} in: ${this.options.targetDir}`);
  }

  createWorkspace(name: string) {
    let command = [
      `npx create-nx-workspace@latest ${name}`,
      `--name=${name}`,
      '--preset=apps',
      '--unitTestRunner=none',
      '--eslint=false',
      '--prettier=false',
      '--ci=skip',
      '--cache=true',
      '--packageManager=pnpm',
      '--no-interactive'
    ].join(' ');

    this.process.exec(command, true, this.options.baseDir);

    this.process.exec(`pnpm add -D @nx/node`, true, this.options.targetDir);
  }

  createService(name: string) {
    let command = [
      `npx nx g @nx/node:app ./services/${name}`,
      '--framework=fastify',
      '--unitTestRunner=jest',
      '--eslint=false',
      '--prettier=false',
      '--ci=skip',
      '--cache=true',
      '--packageManager=pnpm',
      '--no-interactive'
    ].join(' ');

    this.process.exec(command, true, this.options.targetDir);
  }
}