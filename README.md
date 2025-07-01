# awing-cli

aWing CLI is the command-line tool for the [aWing framework](../awing/README.md), designed to streamline the development and management of AI SaaS applications, services, and libraries in a monorepo environment. It provides powerful code generation, database management, and configuration utilities tailored for scalable, modular AI and SaaS projects.

## Overview

- **Project:** Awing CLI (`awing`)
- **Purpose:** Rapidly scaffold SaaS apps, services, and libraries; manage database migrations and seeds; and handle project configuration from the command line.
- **Ecosystem:** Integrates with Nx workspaces and the broader Awing framework for full-stack, modular development.

## Features

- **Code Generation:**
  - Scaffold new SaaS applications, services, and libraries with a single command.
- **Database Management:**
  - Run migrations, generate schemas, and seed or rollback data for all or specific services.
- **Configuration Management:**
  - Set, get, and list project configuration values in `awing-config.json`.

## Installation

Clone the repository and install dependencies:

```sh
pnpm install
pnpm build
```

## Usage

Run the CLI using:

```sh
npx awing <command> [options]
```

Or, if installed globally:

```sh
awing <command> [options]
```

## Commands

### Generate (`g`)

Scaffold new SaaS, service, or library modules.

- **SaaS:**

  ```sh
  awing g saas <name> [--baseDir <baseDir>]
  ```

  Creates a new SaaS application.

- **Service:**
  
  ```sh
  awing g service <name> [--saasName <saasName>] [--baseDir <baseDir>]
  ```
  
  Creates a new service within a SaaS.

- **Library:**

  ```sh
  awing g lib <name> [--saasName <saasName>] [--baseDir <baseDir>]
  ```
  
  Creates a new library module.

### Database (`db`)

Manage database migrations, schemas, and seeds for all or specific services.

- **Migrate:**

  ```sh
  awing db migrate [--service <service>] [--table <table>] [--env <env>]
  ```

  Run database migrations.

- **Schema:**

  ```sh
  awing db schema
  ```

  Generate Prisma schemas for all services.

- **Seed:**

  - Apply seeds:

    ```sh
    awing db seed up [table]
    ```

  - Rollback seeds:

    ```sh
    awing db seed down [table]
    ```

### Config (`cfg`)

Manage project configuration values in `awing-config.json`.

- **Set a value:**

  ```sh
  awing cfg set <key> <value>
  ```

- **Get a value:**

  ```sh
  awing cfg get <key>
  ```

- **List all values:**

  ```sh
  awing cfg list
  ```

## Example Workflows

- Scaffold a new SaaS app:

  ```sh
  awing g saas my-saas
  ```

- Add a service to a SaaS:

  ```sh
  awing g service auth-service --saasName my-saas
  ```

- Run all database migrations in development:

  ```sh
  awing db migrate --env dev
  ```

- Set a configuration value:

  ```sh
  awing cfg set apiKey 123456
  ```

## License

[ISC](./LICENSE)
