import axios from 'axios';

test("Check endpoints", async () => {
    const baseUrl = process.env.BASE_URL || 'http://app-email-provider:8080';
    const apiResponse = await axios.get(`${baseUrl}/api/metrics`);
    expect(apiResponse.status).toBe(200);
    const brokerPublisherResponse = await axios.get(`${baseUrl}/broker-publisher/custom-tracer`);
    expect(brokerPublisherResponse.status).toBe(200);
    const kafkaExporterResponse = await axios.get(`${baseUrl}/kafka-exporter/metrics`);
    expect(kafkaExporterResponse.status).toBe(200);
});