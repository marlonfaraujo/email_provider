FROM node:22

WORKDIR /app

COPY kafkaExporter/package*.json kafkaExporter/tsconfig.json ./

RUN npm ci

COPY kafkaExporter/ .

RUN npm run build

EXPOSE 3502

WORKDIR /workspace

ENTRYPOINT ["node"]
CMD ["/app/dist/server.js"]
