ARG NODE_VERSION=16.5.0
FROM gcr.io/unfederalreserve-dev/yarn:27102021 as builder

WORKDIR /app

COPY . /app

RUN yarn install

RUN yarn build --mode hardhat

FROM nginx:1.16.0-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./configs/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
