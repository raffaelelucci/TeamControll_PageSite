FROM node:20-alpine AS build

WORKDIR /app

ENV NODE_ENV=development

COPY package*.json ./
RUN npm install typescript
RUN npm install --include=dev --no-audit --no-fund

COPY . .

ARG PUBLIC_SITE_URL=https://teamcontrolcenter.it
ENV PUBLIC_SITE_URL=$PUBLIC_SITE_URL

RUN npx tsc -b && npx vite build && node scripts/postbuild-seo.mjs

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]