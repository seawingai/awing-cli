import { join } from "path";
import { Config } from "./config";

export class SaasFolder {
  baseDir: string;
  saasName: string;
  private config: Config;

  constructor(baseDir?: string, saasName?: string) {
    this.config = new Config(Config.CONFIG_FILE);
    this.baseDir = baseDir ?? this.config.baseDir;
    this.saasName = saasName ?? this.config.saasName;
  }

  get saasDir(): string {
    return join(this.baseDir, this.saasName);
  }

  get apps(): string {
    return join(this.baseDir, this.saasName, 'apps');
  }

  get libs(): string {
    return join(this.baseDir, this.saasName, 'libs');
  }

  app(name: string): string {
    return join(this.apps, name);
  }

  lib(name: string): string {
    return join(this.libs, name);
  }

  targetDir(type: string): string {
    switch (type) {
      case 'saas':
        return this.saasDir;
      case 'service':
        return this.apps;
      case 'lib':
          return this.libs;
      default:
        throw Error(`Invalid type: ${type}`)
    }
  }

  toString(): string {
    return `SaasFolder {
      baseDir: ${this.baseDir},
      saasName: ${this.saasName},
      saasDir: ${this.saasDir},
      apps: ${this.apps},
      libs: ${this.libs}
    }`;
  }
}
