import fs from 'fs'
import { Process } from '@/common/process/process';
import { SaasFolder } from '@/common/app/saas-folder';

export class GenerateCommandOption {
  type: string;
  name: string;
  saasFolder: SaasFolder;
  
  constructor(type: string, name: string, options: { saasName?: string, baseDir?: string }) {
    this.type = type;
    this.name = name;
    this.saasFolder = new SaasFolder(options.saasName, options.baseDir)
  }

  get targetDir(): string {
    return this.saasFolder.targetDir(this.type);
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
    console.info(`Started Generating ${this.options}`);
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

    this.process.exec(command, true, this.options.saasFolder.baseDir);

    this.process.exec(`pnpm add -D @nx/node`, true, this.options.targetDir);

    this.ensureDir(this.options.saasFolder.apps);
    this.ensureDir(this.options.saasFolder.libs);
  }

  createService(name: string) {
    let command = [
      `npx nx g @nx/node:app ./${name}`,
      '--framework=fastify',
      '--unitTestRunner=jest',
      '--eslint=false',
      '--prettier=false',
      '--ci=skip',
      '--cache=true',
      '--packageManager=pnpm',
      '--no-interactive'
    ].join(' ');

    this.ensureDir(this.options.targetDir)
    this.process.exec(command, true, this.options.targetDir);
  }
}