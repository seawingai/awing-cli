import { Command } from 'commander';
import { DbCommand } from '@/commands/db-command';
import { GenerateCommand } from '@/commands/generate-command';
import { ConfigCommand } from '@/commands/config-command';

export class Cli {
  private program: Command;

  constructor() {
    this.program = new Command();
    this.program
      .name('awing')
      .description('awing Framework CLI')
      .version('1.0.0');

    this.program.addCommand(GenerateCommand());
    this.program.addCommand(DbCommand());
    this.program.addCommand(ConfigCommand());
  }

  public run(argv: string[]): void {
    this.program.parseAsync(argv).catch((err) => {
      console.error('CLI error', err);
      process.exit(1);
    });
  }
}

  new Cli().run(process.argv);

