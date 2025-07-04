import { Process } from "@/common/process/process";
import { CoreOptions } from "@/commands/core/core-options";
import * as fs from 'fs';
import { TokenManager } from "../template/token-manager";

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
      console.info(`Started Generating ${this.options.type}...\n\n${this.options}`);
  
      this.generate();
  
      console.info(`Finished Generating ${this.options.type}`);
    }
  

    generate() {
      switch (this.options.template.name) {
        case 'nx`':
          this.generateNx();
          break;
        default:
          this.generateTemplate();
          break;
      }
    }
  
    generateNx() {

    }
  
    generateTemplate() {
      const manager = new TokenManager(this.options);
      manager.process();
    }
  }
  