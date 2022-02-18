This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Preview

You can view this website on Vercel [https://vercel.com/](here).

## Installation

First, configure absolute URL in .env.local
```
NEXT_PUBLIC_URL=http://localhost:3000/
```

Second, migrate prisma schema.
In this project, SQLite is used. 
Please change database specification in .env and prisma.schema

```bash
npx prisma migrate dev
```

Second, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

API routes can be accessed on [http://localhost:3000/api/](http://localhost:3000/api/). Please refer to API section below.

## Summary of Main Features

1. Home Page
![Home Page](https://i.ibb.co/kDRBTpM/image.png)
Home page are located in `/` and redirected to `/product/index`. This page contain gallery view of all product store in database.


2. Detail Page
![Detail Page](https://ibb.co/3zXVgXd)
Detail page are located in `/product/[productId]`. This page contain detail view of all product store in database. Static site rendering are used to load detail page. However, frequently change item is fetch from hook via api. This enable *Live* bedding.

3. Bid Now Functionality
![Detail Page](https://ibb.co/3zXVgXd)
Bid now are located in `/product/[productId]`. This function enable user to bid with spesific value. Before value is updated to database, it will be checked to ensure that it's value is higher that current highest bid. Below bid now button, users are able to switch autobid for spesific product

4. Auto-Bidding Functionality
Auto Bidding enable user to automaticly rise their bid. Actually there are several way to achive this. However, for simplicity and low number of user and product, I trigger auto-bidding function for specific via API whenever other user bid product. Please note, for real case scenario, you would consider using either cron job or other similar method.

## What to be done

This application offer the most basic thing according to the requirement documents


Thank you. :)
