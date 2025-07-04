import * as fs from 'fs';
import * as path from 'path';
import { CoreOptions } from '../core';

export class TokenManager {
  options: CoreOptions;

  constructor(options: CoreOptions) {
    this.options = options;
  }

  public async process(): Promise<void> {
    await this.copyAndReplace(this.options.template.target, this.options.target);
  }

  private async copyAndReplace(src: string, dest: string): Promise<void> {
    const stats = await fs.promises.stat(src);
    if (stats.isDirectory()) {
      // Replace tokens in folder name
      const replacedDest = this.replaceTokensInString(dest);
      await fs.promises.mkdir(replacedDest, { recursive: true });
      const entries = await fs.promises.readdir(src);
      for (const entry of entries) {
        const srcPath = path.join(src, entry);
        const replacedEntry = this.replaceTokensInString(entry);
        const destPath = path.join(replacedDest, replacedEntry);
        await this.copyAndReplace(srcPath, destPath);
      }
    } else {
      // Replace tokens in file name
      const replacedDest = this.replaceTokensInString(dest);
      let content = await fs.promises.readFile(src, 'utf8');
      content = this.replaceTokensInString(content);
      await fs.promises.writeFile(replacedDest, content, 'utf8');
    }
  }

  private replaceTokensInString(input: string): string {
    let result = input;
    for (const [token, value] of this.options.tokens.entries()) {
      result = result.split(token).join(value);
    }
    return result;
  }
}
