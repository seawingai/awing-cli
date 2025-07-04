import { CoreRunner } from '@/commands/core/core-runner';
import { GenerateSaasCommandOption } from '@/commands/generate/saas/generate-saas-command-option';

export class GenerateSaasRunner extends CoreRunner {
  constructor(options: GenerateSaasCommandOption) {
    super(options);
  }
  
  override generateNx() {
    this.process.exec(this.options.command, true, this.options.dir.base);

    this.process.exec(`pnpm add -D @nx/node`, true, this.options.dir.parent);

    this.ensureDir(this.options.dir.apps);
    this.ensureDir(this.options.dir.libs);
  }
}
