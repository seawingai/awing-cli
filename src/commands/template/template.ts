import { toString } from "@/common/types/str";
import { fileURLToPath } from "url";
import { join } from "path";

export class Template {
    type: string;
    name: string;
    base: string;

    constructor(type: string, name: string, dir?: string) {
        this.type = type;
        this.name = name;
        this.base = dir || this.baseDefault;
    }

    get baseDefault(): string {
        return 'C:/data/seawingai/git/awing-cli/src/assets/templates';
    }

    get baseNormalized(): string {
        return this.base.replace(/[\\\/]+$/, '');
    }

    get target(): string {
        return join(this.base, this.type, this.name);
    }

    toString(): string {
        return toString(this);
    }
}