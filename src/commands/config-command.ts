import { Command } from 'commander';
import { Config } from '@/common/app/config';

export function ConfigCommand(): Command {
  const command = new Command('cfg')
    .description('config related commands');

  command
    .command('set <key> <value>')
    .description('Set a key-value pair in awing-config.json')
    .action((key: string, value: string) => {
      const config = new Config(Config.CONFIG_FILE);
      config.set(key, value);
      console.log(`Set ${key} = ${value}`);
    });

  command
    .command('get <key>')
    .description('Get the value of a key from awing-config.json')
    .action((key: string) => {
      const config = new Config(Config.CONFIG_FILE);
      const value = config.get(key);
      if (value === undefined) {
        console.log(`Key '${key}' not found.`);
      } else {
        console.log(value);
      }
    });

  command
    .command('list')
    .description('List all key-value pairs in awing-config.json')
    .action(() => {
      const config = new Config(Config.CONFIG_FILE);
      const all = config.list();
      if (Object.keys(all).length === 0) {
        console.log('No config set.');
      } else {
        for (const [key, value] of Object.entries(all)) {
          console.log(`${key}: ${value}`);
        }
      }
    });

  return command;
} 