import * as fs from 'fs';
import { SaasFolder } from './saas-folder';
import path from "path";

export class Config {
  static readonly CONFIG_FILE = path.resolve(process.cwd(), 'awing.json');
  private filePath: string;
  private data: Record<string, any> = {};

  constructor(filePath: string) {
    this.filePath = filePath;
    this.load();
  }

  private load() {
    if (fs.existsSync(this.filePath)) {
      const content = fs.readFileSync(this.filePath, 'utf-8');
      try {
        this.data = JSON.parse(content);
      } catch {
        this.data = {};
      }
    } else {
      this.data = {};
    }
  }

  private save() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
  }

  public get(key: string): any {
    try {
      return this.data[key];
    } catch {
      return null;
    }
  }

  public set(key: string, value: any): void {
    this.data[key] = value;
    this.save();
  }

  public list(): Record<string, any> {
    return { ...this.data };
  }

  public get baseDir(): string {
    let baseDir = this.get('baseDir');

    if (baseDir) {
      return baseDir
    }

    return process.env.BASE_DIR ?? process.cwd();
  }

  public get saasName(): string {
    return this.get('saasName') ?? "saas";
  }
} 