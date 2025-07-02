// npx create-nx-workspace@latest
import { GenerateLibCommandOption, GenerateLibRunner, GenerateSaasCommandOption, GenerateSaasRunner, GenerateServiceCommandOption, GenerateServiceRunner } from "@/commands/generate";
import { Command } from 'commander';

export function GenerateCommand(): Command {
  const command = new Command(`g`)
    .description(`generate related commands`);

    command
    .command(`saas <name>`)
    .option(`--template [template]`, `Template to use for the lib`)
    .description(`Creates a SaaS with specified name`)
    .action(async (name: string, opt: {template: string}) => {
      const options = new GenerateSaasCommandOption(name, opt.template);
      const runner = new GenerateSaasRunner(options);
      await runner.run();
    });

    command
    .command(`service <name>`)
    .option(`--template [template]`, `Template to use for the lib`)
    .description(`Creates a service with specified name`)
    .action(async (name: string, opt: {template: string}) => {
      const options = new GenerateServiceCommandOption(name, opt.template);
      const runner = new GenerateServiceRunner(options);
      await runner.run();
    });

    command
    .command(`lib <name>`)
    .option(`--dir [dir]`, `Directory in which lib will be created`)
    .option(`--template [template]`, `Template to use for the lib`)
    .description(`Creates a lib with specified name`)
    .action(async (name: string, opt: {dir: string, template: string}) => {
      const options = new GenerateLibCommandOption(name, opt.dir, opt.template);
      const runner = new GenerateLibRunner(options);
      await runner.run();
    });
    
  return command;
}
