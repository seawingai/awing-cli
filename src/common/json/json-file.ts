import * as fs from 'fs';
import { Config } from '../types/constants';

export class JsonFile {
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

  private static _instance: JsonFile | null = null;

  public static get instance(): JsonFile {
    if (!JsonFile._instance) {
      JsonFile._instance = new JsonFile(Config.CONFIG_FILE);
    }
    return JsonFile._instance;
  }
} 