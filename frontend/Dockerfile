# Stage 1 — build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# Stage 2 — serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Proxy /tasks and /health to backend (replace default nginx config)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
