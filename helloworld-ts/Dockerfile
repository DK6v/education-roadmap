FROM node:20.9.0-slim
WORKDIR /app

# Install dependencies
COPY package.json .
COPY tsconfig.json .

RUN \
# Install TypeScript execution engine
npm install ts-node && \
# Install type declaration files
npm install -D @types/node

COPY entrypoint.sh /usr/bin
ENTRYPOINT [ "entrypoint.sh" ]
