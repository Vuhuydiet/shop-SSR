# shop-ssr

## Dependencies

- Node.js
- PostgreSQL
- Prisma

## Setup - Docker

1. Setup the environment `.env` file as the structure in [`.env.sample`](./.env.sample).
2. Build docker image:

```zsh
docker build -t shop-ssr .
```

3. Run the container, pass in the environment variables:

```zsh
docker run -p 3000:3000 --env-file .env shop-ssr
```

## Setup - Local

1. Create database 'shop_ssr_db'

2. Set up the environment `.env` file:

```env
DATABASE_URL="postgresql://<USER>:<PASSWORD>@<HOST>:<PORT>/<DB_NAME>?schema=public"
```

3. Install dependencies and run migrations:

```zsh
npm install
npm run prisma:gen
npm run prisma:migrate:dev
npm run seed                 # For seeding data

psql -U <username> -d <db name> < node_modules/connect-pg-simple/table.sql
```

4. Generate JWT key pairs

```zsh
npm run genkey
```

5. Start the server:

```zsh
npm run dev
```
