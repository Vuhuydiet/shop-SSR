# shop-ssr

## Dependencies

- Node.js
- PostgreSQL
- Prisma

## Setup

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

4. Start the server:

```zsh
npm run dev
```
