import { CoreRunner } from '@/commands/core/core-runner';
import { GenerateSaasCommandOption } from '@/commands/generate/saas/generate-saas-command-option';

export class GenerateSaasRunner extends CoreRunner {
  constructor(options: GenerateSaasCommandOption) {
    super(options);
  }
  
  override generate() {
    this.process.exec(this.options.command, true, this.options.dir.base);

    this.process.exec(`pnpm add -D @nx/node`, true, this.options.dir.target);

    this.ensureDir(this.options.dir.apps);
    this.ensureDir(this.options.dir.libs);
  }
}
