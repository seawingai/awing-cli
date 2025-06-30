import path from "path";

export class Config {
  static readonly CONFIG_FILE = path.resolve(process.cwd(), 'awing.json');
}
