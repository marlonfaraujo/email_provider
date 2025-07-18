FROM node:22

WORKDIR /app

COPY emailProvider/package*.json emailProvider/tsconfig*.json ./

RUN npm ci

COPY emailProvider/ .

RUN npm run test && npm run build

EXPOSE 3500

# Set `DEVCONTAINER` environment variable to help with orientation
ENV DEVCONTAINER=true

WORKDIR /workspace

ENTRYPOINT ["node", "/app/dist/main.js"]
#ENTRYPOINT ["tail", "-f", "/dev/null"]
