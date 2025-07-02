import { CoreRunner } from '@/commands/core/core-runner';
import { GenerateSaasCommandOption } from '@/commands/generate/saas/generate-saas-command-option';

export class GenerateSaasRunner extends CoreRunner {
  constructor(options: GenerateSaasCommandOption) {
    super(options);
  }
  
  override generate() {
    this.process.exec(this.options.command, true, this.options.baseDir);

    this.process.exec(`pnpm add -D @nx/node`, true, this.options.targetDir);

    this.ensureDir(this.options.apps);
    this.ensureDir(this.options.libs);
  }
}
