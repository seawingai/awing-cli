import { FastifyInstance } from 'fastify';
import { agent } from '@marketing-service/sdk/marketing-agent';

export default async function (fastify: FastifyInstance) {
  fastify.get('/', async function () {
    return { message: 'Hello marketing-service API' };
  });

  fastify.post('/content/generate', async (req, reply) => {
    try {
      await agent.generateContent();
      const result = true;
      reply.send({ status: 'success', result });
    } catch (err) {
      console.error('Error generating content:', err);
      reply.code(500).send({ status: 'error', message: err.message });
    }
  });
}

