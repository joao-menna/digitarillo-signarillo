FROM oven/bun:1-slim AS build

WORKDIR /app

# Cache packages installation
COPY package.json bun.lock ./

RUN bun install

COPY . .

ENV NODE_ENV=production

RUN bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--target bun \
	--outfile server \
	./src/index.ts


FROM debian:bookworm-slim AS runner

WORKDIR /app

COPY --from=build /app/node_modules/bcrypt /app/node_modules/bcrypt

COPY --from=build /app/server server

RUN chmod +x ./server

ENV NODE_ENV=production

EXPOSE 8080

CMD ["./server"]
