FROM node:18-alpine as base

WORKDIR /usr/src/app
EXPOSE 3000

FROM base as builder
COPY ["package.json", "package-lock.json*", "./"]
COPY ./tsconfig.json ./tsconfig.json
COPY ./src ./src
RUN npm ci --only-production
RUN npm run compile
RUN npm prune --production

FROM base as release
ENV NODE_ENV=production
USER node
COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/build ./build
COPY --chown=node:node . /usr/src/app
CMD ["node", "./build/src/bin/server"]
