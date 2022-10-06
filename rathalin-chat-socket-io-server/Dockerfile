FROM node:16

WORKDIR /usr/src/rathalin-chat-socket-io-server
COPY package*.json ./
RUN npm ci

COPY . .
RUN npx tsc

# VOLUME [ "/usr/src/rathalin-chat-socket-io-server/data" ]

ENV SOCKET_IO_PORT=5001
ENV CORS_PORT=*
EXPOSE 5001

CMD [ "npm", "run", "start" ]
