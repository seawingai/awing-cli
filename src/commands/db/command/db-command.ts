import { Command } from 'commander';
import { DbSeedCommandOption, DbSeedRunner, DbMigrateCommandOptions, DbMigrateRunner, DbSchemaCommandOption, DbSchemaRunner } from '@/commands/db';

export function DbCommand(): Command {
  const command = new Command('db')
    .description('db related commands');

  const seed = command
    .command('seed')
    .description('Seed or rollback seeds for all services');

  seed
    .command('up [table]')
    .description('Apply seeds for all services, optionally for a specific table')
    .action(async (table: string | undefined) => {
      const options = new DbSeedCommandOption('up', table);
      const runner = new DbSeedRunner(options);
      await runner.run();
    });

  seed
    .command('down [table]')
    .description('Rollback seeds for all services, optionally for a specific table')
    .action(async (table: string | undefined) => {
      const options = new DbSeedCommandOption('down', table);
      const runner = new DbSeedRunner(options);
      await runner.run();
    });

  command 
    .command('migrate')
    .description('Run database migrations for all or a specific service')
    .option('--service <service>', 'Run migration only for a specific service')
    .option('--table <table>', 'Run migration only for a specific table')
    .option('--env <env>', 'Environment (dev or prod)', 'dev')
    .action(async (opt: {service?: string, table?: string, env?: string}) => {
      const options = new DbMigrateCommandOptions(opt)
      const runner = new DbMigrateRunner(options);
      runner.run();
    });

  command 
    .command('schema')
    .description('Run prisma generate for all service schemas')
    .action(async () => {
      const options = new DbSchemaCommandOption();
      const runner = new DbSchemaRunner(options);
      await runner.run();
    });

  return command;
}

