import { CoreRunner } from '@/commands/core/core-runner';
import { GenerateLibCommandOption } from '@/commands/generate/lib/generate-lib-command-option';
import { TokenManager } from '@/commands/template/token-manager';


export class GenerateLibRunner extends CoreRunner {
  constructor(options: GenerateLibCommandOption) {
    super(options);
  }

  override generateNx() {
    this.ensureDir(this.options.parent);
    this.process.exec(this.options.command, true, this.options.parent);
  }
}