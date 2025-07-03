export const RABBIT_CONFIG = {
  EXCHANGES: {
    SEND_EMAIL: 'exchange.email.send',
    DLX: 'exchange.dlx'
  },
  ROUTING_KEYS: {
    SEND_EMAIL: 'routing.email.send',
    DLX: 'routing.dlx'
  },
  QUEUES: {
    SEND_EMAIL: 'queue.email.send',
    DLX: 'queue.dlx'
  }
}
