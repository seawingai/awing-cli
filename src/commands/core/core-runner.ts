import { Process } from "@/common/process/process";
import { CoreOptions } from "@/commands/core/core-options";
import * as fs from 'fs';

export class CoreRunner {
    protected options: CoreOptions;
    protected process = new Process();
  
    constructor(options: CoreOptions) {
      this.options = options;
    }
  
    protected ensureDir(dir: string) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.info(`Creating dir: ${dir}`);
      }
    }
  
    async run() {
      console.info(`Started Generating\n${this.options}`);
      console.info(`Generating ${this.options.type} in: ${this.options.targetDir}`);
  
      this.generate();
  
      console.info(`Finished generating ${this.options.type} in: ${this.options.targetDir}`);
    }
  
    generate() {}
  }
  