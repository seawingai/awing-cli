// npx create-nx-workspace@latest
import { Command, CommandOptions } from 'commander';
import { GenerateCommandOption as GenerateCommandOption, GenerateRunner as GenerateRunner } from '@/runners/generate/generate-runner';

export function GenerateCommand(): Command {
  const command = new Command('g')
    .description('generate related commands');

    command
    .command('saas <name>')
    .option('--baseDir <baseDir>', 'Base directory for the SaaS')
    .description('Creates a SaaS with specified name')
    .action(async (name: string, opt: {baseDir?: string}) => {
      const options = new GenerateCommandOption('saas', name, opt);
      const runner = new GenerateRunner(options);
      await runner.run();
    });

    command
    .command('service <name>')
    .option('--saasName <saasName>', 'Name of SaaS in which service will be created')
    .option('--baseDir <baseDir>', 'Base directory for the SaaS')
    .description('Creates a service with specified name')
    .action(async (name: string, opt: {saasName?: string, baseDir?: string}) => {
      const options = new GenerateCommandOption('service', name, opt);
      const runner = new GenerateRunner(options);
      await runner.run();
    });

  return command;
}
