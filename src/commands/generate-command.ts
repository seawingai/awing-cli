// npx create-nx-workspace@latest
import { GenerateCommandOption, GenerateRunner } from "@/runners/generate/generate-runner";
import { Command } from 'commander';

export function GenerateCommand(): Command {
  const command = new Command(`g`)
    .description(`generate related commands`);

    command
    .command(`saas <name>`)
    .option(`--baseDir <baseDir>`, `Base directory for the SaaS`)
    .description(`Creates a SaaS with specified name`)
    .action(async (name: string, opt: {baseDir?: string}) => {
      const options = new GenerateCommandOption(`saas`, name, { baseDir: opt.baseDir });
      const runner = new GenerateRunner(options);
      await runner.run();
    });

    addCommand(`service`, command);
    addCommand(`lib`, command);

  return command;
}

function addCommand(type: string, command: Command) {
  command
  .command(`${type} <name>`)
  .option(`--saasName <saasName>`, `Name of SaaS in which ${type} will be created`)
  .option(`--baseDir <baseDir>`, `Base directory for the ${type}`)
  .description(`Creates a ${type} with specified name`)
  .action(async (name: string, opt: {saasName: string, baseDir: string}) => {
    const options = new GenerateCommandOption(type, name, opt);
    const runner = new GenerateRunner(options);
    await runner.run();
  });
}