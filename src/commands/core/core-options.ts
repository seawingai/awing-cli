import { toString } from "@/common/types/str";
import { Template } from "@/commands/template/template";
import { Dir } from "@/commands/core/dir";

export enum Preset {
  SAAS = 'saas',
  SERVICE = 'service',
  LIB = 'lib'
}

export class CoreOptions {
  dir: Dir;
  name: string;
  template: Template;

  constructor(name?: string, baseDir?: string, template: string = 'default') {
    if (!name) {
      name = this.nameDefault;
    }

    this.dir = new Dir(baseDir);
    this.name = name;
    this.template = new Template(this.type, template);
  }

  get saas(): string {
    return this.dir.base;
  }

  get parent(): string {
    return this.dir.parent;
  }

  get target(): string {
    return this.dir.target(this.dir.parent, this.name);
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

  get tokens(): Map<string, string> {
    const tokens = new Map<string, string>();

    tokens.set('__name__', this.name);
    tokens.set('__target__', this.target);
    
    return tokens;
  } 

  toString(): string {
    return toString(this);
  }
}
