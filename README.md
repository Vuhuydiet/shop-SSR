
1. Create database 'shop_ssr_db'

2. Set up .env:

```env
DATABASE_URL="postgresql://<USER>:<PASSWORD>@<HOST>:<PORT>/<DB_NAME>?schema=public"
```

3. run 'npm install'
4. run 'npm run prisma:gen'
5. run 'npm run prisma:migrate:dev' 
6. run 'npm run seed' (to create mock data)