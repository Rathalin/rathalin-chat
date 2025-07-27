FROM node:22-alpine
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
WORKDIR /opt/
COPY ./package.json ./package-lock.json  ./
ENV PATH=/opt/node_modules/.bin:$PATH
RUN npm ci
WORKDIR /opt/app
COPY ./ .
RUN npm run build
ENV SOCKET_IO_PORT=5001
ENV CORS_PORT=*
EXPOSE 5001
CMD [ "npm", "run", "start" ]
