import fs from 'fs'
import { Process } from '@/common/process/process';
import { SaasFolder } from '@/common/app/saas-folder';

export class GenerateCommandOption {
  type: string;
  name: string;
  saasFolder: SaasFolder;
  
  constructor(type: string, name: string, options: { saasName?: string; baseDir?: string}) {
    this.type = type;
    this.name = name;
    this.saasFolder = new SaasFolder(options.saasName, options.baseDir)
  }

  get targetDir(): string {
    return this.saasFolder.targetDir(this.type);
  }

  get command(): string {
    let command: string;

    switch (this.type) {
      case 'saas':
        command = [
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
        break;
      case 'service':
        command = [
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
        break;
      case 'lib':
        command = [
          `npx nx g @nx/js:lib ./common/${this.name}`,
          '--unitTestRunner=jest',
          '--eslint=false',
          '--prettier=false',
          '--ci=skip',
          '--cache=true',
          '--packageManager=pnpm',
          '--no-interactive',
          `--tags=lib`
        ].join(' ');
        break;
      default:
        throw new Error(`Unknown type: ${this.type}`);
    }

    return command;
  }

  toString(): string {
    return `${this.constructor.name} {
        type: ${this.type},
        name: ${this.name},
        saasFolder: ${this.saasFolder}
      }`;
  }
}

export class GenerateRunner {
  private options: GenerateCommandOption;
  private process = new Process();
  
  constructor(options: GenerateCommandOption) {
    this.options = options;
  }

  private ensureDir(dir: string) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.info(`Creating dir: ${dir}`);
    }
  }

  public async run() {
    console.info(`Started Generating\n${this.options}`);
    console.info(`Generating ${this.options.type} in: ${this.options.targetDir}`);

    switch (this.options.type) {
      case 'saas':
        this.createSaas();
        break;
      case 'service':
      case 'lib':
        this.createPreset();
        break;
      default:
        console.error(`Invalid ${this.options.type}`);
        break;
    }

    console.info(`Finished generating ${this.options.type} in: ${this.options.targetDir}`);
  }

  createSaas() {
    this.process.exec(this.options.command, true, this.options.saasFolder.baseDir);

    this.process.exec(`pnpm add -D @nx/node`, true, this.options.targetDir);

    this.ensureDir(this.options.saasFolder.apps);
    this.ensureDir(this.options.saasFolder.libs);
  }

  createPreset() {
    this.ensureDir(this.options.targetDir)
    this.process.exec(this.options.command, true, this.options.targetDir);
  }
}