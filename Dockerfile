FROM node:22

WORKDIR /workspace

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# Set `DEVCONTAINER` environment variable to help with orientation
ENV DEVCONTAINER=true

#ENTRYPOINT ["node", "main.ts"]

ENTRYPOINT ["tail", "-f", "/dev/null"]
