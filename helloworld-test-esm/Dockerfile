FROM node:21.7.1-slim
WORKDIR /app

# Install dependencies
COPY package.json .
COPY tsconfig.json .

# Install execution engine
RUN npm install

COPY entrypoint.sh /usr/bin
ENTRYPOINT [ "entrypoint.sh" ]
