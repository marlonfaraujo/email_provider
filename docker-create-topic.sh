#!/bin/bash

docker exec -it email_provider_kafka \
  ./opt/kafka/bin/kafka-topics.sh \
  --create \
  --if-not-exists \
  --bootstrap-server localhost:9092 \
  --replication-factor 1 \
  --partitions 1 \
  --topic queue.email.send
