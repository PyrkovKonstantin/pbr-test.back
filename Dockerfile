FROM node:20-bookworm-slim AS base

WORKDIR /app

ARG APP_USER=node
ARG APP_GROUP=node
ARG APP_USER_UID=1001

FROM base AS manifests

COPY .yarn ./.yarn

COPY package.json yarn.lock .yarnrc.yml ./

FROM manifests as installer-dev

RUN yarn --frozen-lockfile

FROM installer-dev as installer-prod

ENV NODE_ENV production

RUN yarn workspaces focus --all --production && yarn cache clean --all

FROM installer-dev AS builder

COPY . .

RUN yarn build

FROM base as runner

# Копируем package.json
COPY --from=manifests /app /app
# Копируем продакшен-зависимости
COPY --from=installer-prod /app /app

COPY --from=builder /app/dist /app/dist

CMD [ "node", "./dist/main.js" ]
