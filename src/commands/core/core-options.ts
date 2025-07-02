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
    return join(this.baseDir, this.name);
  }

  get apps(): string {
    return join(this.baseDir, this.name, 'apps');
  }

  get services(): string {
    return join(this.apps, this.name, 'services');
  }

  get schema(): string {
    return join(this.services, 'db', 'schema.prisma');
  }

  get seeder(): string {
    return join(this.services, 'db', 'seed', 'db-seeder.ts');
  }

  get libs(): string {
    return join(this.baseDir, this.name, 'libs');
  }

  app(name: string): string {
    return join(this.apps, name);
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
    return `SaasFolder {
      baseDir: ${this.baseDir},
      saasName: ${this.name},
      saasDir: ${this.saasDir},
      apps: ${this.apps},
      libs: ${this.libs}
    }`;
  }
}
