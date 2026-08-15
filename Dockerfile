FROM node:22-bookworm-slim AS builder
WORKDIR /usr/src/app
COPY package*.json ./
COPY packages ./packages
RUN npm ci
RUN npm run build
RUN npm ci --omit=dev 

FROM node:22-bookworm-slim AS runner
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
USER node
EXPOSE 3000
ENTRYPOINT ["node", "./dist/index.js"]
