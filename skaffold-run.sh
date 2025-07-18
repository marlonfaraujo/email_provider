#!/bin/bash

set -e

# env
KAFKA_POD_NAME="email-provider-kafka-0"
KAFKA_SERVICE_NAME="email-provider-kafka-service"
KAFKA_NAMESPACE="default"
KAFKA_PORT=29092
KAFKA_HOST="${KAFKA_POD_NAME}.${KAFKA_SERVICE_NAME}.${KAFKA_NAMESPACE}.svc.cluster.local"

echo "Starting Kafka..."
skaffold run -f ./k8s/kafka/skaffold.yaml

echo "Waiting Kafka response in ${KAFKA_HOST}:${KAFKA_PORT}..."

# Waiting Kafka available (max 60 retries)
for i in {1..60}; do
  if kubectl run tmp-kafka-check --rm -it --restart=Never --image=busybox -- \
      sh -c "nc -z ${KAFKA_HOST} ${KAFKA_PORT}" >/dev/null 2>&1; then
    echo "✅ Kafka ready!"
    break
  else
    echo "🔁 Try $i: Kafka not response. Waiting 2s..."
    sleep 2
  fi
done

# If it is still not responding after 60 attempts, it fails.
if [[ $i -eq 60 ]]; then
  echo "❌ Kafka did not respond after 60 attempts. Aborting."
  exit 1
fi

echo "🚀 Starting the other Skaffold modules..."
skaffold run -f skaffold.yaml
