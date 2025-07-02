import { toString } from "@/common/types/str";
import { join } from "path";

export class Dir {
    base: string;

    constructor(dir: string) {
        this.base = dir || this.baseDefault;
    }

    get baseDefault(): string {
        return process.cwd();
    }

    get baseNormalized(): string {
        return this.base.replace(/[\\\/]+$/, '');
    }

    get saas(): string {
        return this.base;
    }

    get apps(): string {
        return join(this.saas, 'apps');
    }

    get libs(): string {
        return join(this.saas, 'libs');
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

    get target(): string {
        return '';
    }

    toString(): string {
        return toString(this);
    }
}