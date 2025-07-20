import axios from 'axios';

test("Check endpoints", async () => {
    const baseUrl = process.env.BASE_URL || 'http://app-email-provider:8080';
    const response = await axios.get(`${baseUrl}/api/metrics`);
    expect(response.status).toBe(200);
});