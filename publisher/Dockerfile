FROM node:22

WORKDIR /app

COPY publisher/package*.json publisher/tsconfig.json ./

RUN npm ci

COPY publisher/ .

RUN npm run build

EXPOSE 9464
EXPOSE 3501

# Set `DEVCONTAINER` environment variable to help with orientation
ENV DEVCONTAINER=true

WORKDIR /workspace

ENTRYPOINT ["node"]
CMD ["/app/dist/api.js"]

#ENTRYPOINT ["tail", "-f", "/dev/null"]
