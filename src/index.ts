#!/usr/bin/env node

import { Cli } from "@/commands/core/cli";

const cli = new Cli();
cli.run(process.argv);
