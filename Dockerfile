FROM node:8-alpine

COPY . /var/www/

WORKDIR /var/www
RUN yarn &&\
    yarn run tsc --project tsconfig.json

##

FROM node:8-alpine
COPY --from=0 /var/www/dist /var/www

ENV ADD.ENVS=1 \
    PORT= \
    BOT_TOKEN= \
    CLIENT_ID= \
    CLIENT_SECRET= \
    STATE_PASSWORD= \
    SCOPES= \
    ORIGINS= \
    APP_ROOT= \
    USER_AGENT=

WORKDIR /var/www
CMD node index.js
