# Angular Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# NGINX Static Hosting
FROM nginx:stable-alpine-perl
# COPY --from=builder /app/dist/* /usr/share/nginx/html/
COPY --from=builder /app/dist/tec-test/browser /usr/share/nginx/html
# COPY frontend/inventory-management-ui/nginx.conf /etc/nginx/nginx.conf
# COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
