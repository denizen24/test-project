FROM node:18.3.0-alpine3.14 as development

WORKDIR /app

COPY package*.json ./

RUN npm install --only=development

COPY ./env ./env
COPY ./public ./public
COPY ./src ./src
COPY ./tsconfig*.json ./

RUN npm run build

FROM node:18.3.0-alpine3.14 as production

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY --from=development /app .
COPY --from=development /app/dist ./dist

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

EXPOSE 4400

CMD ["npm", "run", "start:prod"]