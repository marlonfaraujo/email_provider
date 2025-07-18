import Fastify, { FastifyInstance } from "fastify";
import KafkaBroker from "./KafkaBroker";
import PrometheusMetricsService from "./PrometheusMetricsService";
import PrometheusKafkaMetrics from "./PrometheusKafkaMetrics";

const fastify: FastifyInstance = Fastify({ logger: true });
const kafkaBroker = new KafkaBroker('kafka-exporter');
const metricsService = new PrometheusMetricsService();

fastify.get('/metrics', {}, async (request, reply) => {
  try {
    const metricsData = await PrometheusKafkaMetrics.getMetrics(kafkaBroker);
    metricsService.updateMetrics(metricsData);
    return reply
      .header('Content-Type', metricsService.getContentType())
      .code(200)
      .send(await metricsService.getMetrics());
  } catch (err) {
    console.error('Error expose metrics:', err);
    return reply.status(500);
  } finally {
    await kafkaBroker.close();
  }
});

const start = async () => {
  try {
    await fastify.listen({ port: 3502, host: '0.0.0.0' });
    const address = fastify.server.address();
    const port = typeof address === 'string' ? address : address?.port;
    fastify.log.info(`Server listening at ${address}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();