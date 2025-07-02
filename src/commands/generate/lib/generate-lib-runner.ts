import { CoreRunner } from '@/commands/core/core-runner';
import { GenerateLibCommandOption } from '@/commands/generate/lib/generate-lib-command-option';

 
export class GenerateLibRunner extends CoreRunner {
    constructor(options: GenerateLibCommandOption) {
      super(options);
    }
    
    override generate() {
      this.ensureDir(this.options.targetDir)
      this.process.exec(this.options.command, true, this.options.targetDir);
    }
  }