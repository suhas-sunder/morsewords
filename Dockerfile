FROM node:22-alpine AS dependencies

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM dependencies AS builder

COPY . ./
ARG VITE_MORSE_BOOK_CONTENT_BASE_URL
ARG VITE_ENABLE_LOCAL_BOOK_CONTENT_ROUTE
ENV VITE_MORSE_BOOK_CONTENT_BASE_URL=$VITE_MORSE_BOOK_CONTENT_BASE_URL \
    VITE_ENABLE_LOCAL_BOOK_CONTENT_ROUTE=$VITE_ENABLE_LOCAL_BOOK_CONTENT_ROUTE
# The existing Netlify build uses this heap allocation. Keep the same headroom
# while producing the regular React Router SSR server bundle.
ENV NODE_OPTIONS=--max-old-space-size=6144
RUN npm run build

FROM node:22-alpine AS runtime

ENV NODE_ENV=production \
    PORT=3000
LABEL org.opencontainers.image.title="MorseWords" \
      org.opencontainers.image.source="https://github.com/suhas-sunder/morsewords"

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --chown=node:node server.js ./server.js
COPY --from=builder --chown=node:node /app/build ./build
# This JSON is read directly by server-side book loaders and was explicitly
# included in the former Netlify function bundle.
COPY --from=builder --chown=node:node /app/app/client/assets/books/seo-summaries/book-seo-summaries.json ./app/client/assets/books/seo-summaries/book-seo-summaries.json

USER node
EXPOSE 3000

CMD ["node", "server.js"]
