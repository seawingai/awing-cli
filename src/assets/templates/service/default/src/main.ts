import Fastify from 'fastify';
import { app } from './app/app';
import { agent } from '@marketing-service/sdk/marketing-agent';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

// Instantiate Fastify with some config
const server = Fastify({
  logger: true,
});

// Register your application as a normal plugin.
server.register(app);

// Start listening.
server.listen({ port, host }, (err) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  } else {
    console.log(`[ ready ] http://${host}:${port}`);

    agent.start().catch((err) => {
      console.error('Failed to start agent:', err);
    });
  }
});
