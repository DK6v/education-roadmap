FROM node:21.7.1-slim as build
WORKDIR /app

# Install dependencies
RUN \
# - Update package index
apt-get update && \
# - Install procps tools to monitor system processes
apt-get install --assume-yes procps && \
# Remove temporary files
apt-get autoremove --assume-yes && apt-get clean && rm -rf /var/lib/apt/lists/* && rm -rf /tmp/*

# Install dependencies
COPY package*.json .
COPY tsconfig*.json .

# Bundle app source
COPY . .

# Install app dependencies
RUN npm install

# Creates a "dist" folder with the production build
RUN npm run build

COPY --chmod=755 entrypoint.sh /usr/bin

ENTRYPOINT [ "entrypoint.sh" ]
