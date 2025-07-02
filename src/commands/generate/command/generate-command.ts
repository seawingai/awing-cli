// npx create-nx-workspace@latest
import { GenerateLibCommandOption, GenerateLibRunner, GenerateSaasCommandOption, GenerateSaasRunner, GenerateServiceCommandOption, GenerateServiceRunner } from "@/commands/generate";
import { Command } from 'commander';

export function GenerateCommand(): Command {
  const command = new Command(`g`)
    .description(`generate related commands`);

    command
    .command(`saas <name>`)
    .description(`Creates a SaaS with specified name`)
    .action(async (name: string) => {
      const options = new GenerateSaasCommandOption(name);
      const runner = new GenerateSaasRunner(options);
      await runner.run();
    });

    command
    .command(`service <name>`)
    .description(`Creates a service with specified name`)
    .action(async (name: string) => {
      const options = new GenerateServiceCommandOption(name);
      const runner = new GenerateServiceRunner(options);
      await runner.run();
    });

    command
    .command(`lib <name>`)
    .option(`--dir <dir>`, `Directory in which lib will be created`)
    .description(`Creates a lib with specified name`)
    .action(async (name: string, opt: {dir: string}) => {
      const options = new GenerateLibCommandOption(name, opt.dir);
      const runner = new GenerateLibRunner(options);
      await runner.run();
    });
    
  return command;
}
