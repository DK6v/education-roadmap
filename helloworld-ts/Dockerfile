FROM node:20.9.0-slim
WORKDIR /app

# Install dependencies
COPY package.json .
COPY tsconfig.json .
COPY .eslintrc.* .

RUN npm install

COPY entrypoint.sh /usr/bin
ENTRYPOINT [ "entrypoint.sh" ]
