FROM node:20-alpine
WORKDIR /app
RUN npm install -g pnpm
COPY package.json ./
RUN pnpm install --ignore-scripts || true
COPY . .
EXPOSE 3000
CMD ["pnpm", "dev"]
