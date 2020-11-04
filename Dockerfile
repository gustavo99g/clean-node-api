FROM node:12
WORKDIR /usr/src/clean-node-api
COPY ./package.json .
RUN yarn --only=prod
COPY ./dist ./dist
EXPOSE 3333
CMD yarn start