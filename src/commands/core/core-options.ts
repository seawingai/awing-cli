import { join } from "path";

export enum Preset {
  SAAS = 'saas',
  SERVICE = 'service',
  LIB = 'lib'
}

export class CoreOptions {
  baseDir: string;
  name: string;

  constructor(name?: string, baseDir?: string) {
    if (!baseDir) {
      baseDir = this.baseDirDefault;
    }

    if (!name) {
      name = this.nameDefault;
    }

    this.baseDir = baseDir;
    this.name = name; 
  }

  get baseDirDefault(): string {
    return process.cwd();
  }

  get nameDefault(): string {
    const normalizedBaseDir = this.baseDir.replace(/[\\\/]+$/, '');
    return normalizedBaseDir.split(/[\\\/]/).pop() || '';
  }

  get saasDir(): string {
    return this.baseDir;
  }

  get apps(): string {
    return join(this.saasDir, 'apps');
  }

  get libs(): string {
    return join(this.saasDir, 'libs');
  }

  get services(): string {
    return join(this.apps, 'services');
  }

  get web(): string {
    return join(this.apps, 'web');
  }
  
  schema(serviceName: string): string {
    return join(this.services, serviceName, 'db', 'schema.prisma');
  }

  seeder(serviceName: string): string {
    return join(this.services, serviceName, 'db', 'seed', 'db-seeder.ts');
  }

  serviceApp(name: string): string {
    return join(this.services, name);
  }

  webApp(name: string): string {
    return join(this.web, name);
  }

  lib(name: string): string {
    return join(this.libs, name);
  }

  get targetDir(): string {
    return '';
  }

  get type(): string {
    return '';
  }

  get command(): string {
    return '';
  }

  toString(): string {
    return `${this.constructor.name} {
      baseDir: ${this.baseDir},
      saasName: ${this.name},
      saasDir: ${this.saasDir},
      apps: ${this.apps},
      libs: ${this.libs}
    }`;
  }
}
