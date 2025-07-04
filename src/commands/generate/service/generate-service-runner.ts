import { CoreRunner } from '@/commands/core/core-runner';
import { GenerateServiceCommandOption } from '@/commands/generate/service/generate-service-command-option';

export class GenerateServiceRunner extends CoreRunner {
    constructor(options: GenerateServiceCommandOption) {
      super(options);
    }
    
    override generateNx() {
      this.ensureDir(this.options.parent)
      this.process.exec(this.options.command, true, this.options.parent);
    }
  }
  