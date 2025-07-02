import { toString } from "@/common/types/str";
import { Dir } from "./dir";

export enum Preset {
  SAAS = 'saas',
  SERVICE = 'service',
  LIB = 'lib'
}

export class CoreOptions {
  dir: Dir;
  name: string;
  template: string;

  constructor(name?: string, baseDir?: string, template: string = 'default') {
    if (!name) {
      name = this.nameDefault;
    }

    this.dir = new Dir(baseDir);
    this.name = name;
    this.template = template;
  }

  get saas(): string {
    return this.dir.base;
  }

  get target(): string {
    return this.dir.target;
  }

  get nameDefault(): string {
    return this.dir.baseNormalized.split(/[\\\/]/).pop() || '';
  }

  get type(): string {
    return '';
  }

  get command(): string {
    return '';
  }

  toString(): string {
    return toString(this);
  }
}
