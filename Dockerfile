FROM node:22-bookworm-slim

WORKDIR /app

COPY package*.json ./
COPY packages ./packages

RUN npm ci
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000

USER node

EXPOSE 3000

CMD ["npm", "run", "start", "--workspace", "@cally/server"]
