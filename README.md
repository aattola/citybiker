<img src="./apps/web/public/bike.png" width="30%" align="right"></img>
# Citybiker

Demo app hosted at https://citybiker.jeffe.co

#### Stack: TypeScript Next.JS React tRPC Prisma MongoDB TailwindCSS ChakraUI Jest Cypress GitHub Actions Vercel Turborepo

### Why Prisma

Prisma provides typesafe database access. It also provides a way to generate the database schema from the models. This means that the database schema is always up to date with the models. 

### Why Next.JS

Next.JS provides a way to easily create a server side rendered React app. It also provides a way to easily pre-render pages. This means that the app is fast and SEO friendly.

### Why tRPC

Type Safety: TypeScript provides type safety and makes it easier to catch errors during development.

End-to-end type safety: tRPC provides end-to-end type safety, meaning that the client and server share the same types. This means that the client can't send invalid data to the server, and the server can't send invalid data to the client.

If this project was bigger I would probably use GraphQL instead of tRPC. GraphQL is more popular and has more tools around it. But for the typesafety I wanted to use tRPC.

I tought about using GraphQL and my first commits were using GraphQL. But I decided to use tRPC instead because fully typesafe GraphQL required a lot of codegen. If this app needed like mobile clients I would have used GraphQL.

### Why Turborepo

Turborepo is a monorepo tool that makes it easy to work with a monorepo.

It also makes it easy to work with multiple packages in the same repo.

### CI/CD

CI/CD is done with GitHub Actions. The CI/CD pipeline is defined in .github/workflows/ci.yml

Basically for every push to main branch the following happens:

1. Run tests
2. Lint code
3. Deploy the app to vercel

If tests do not pass or code linting does not succeed the deployment will not happen.


## Running locally (the easy way)

To run locally (setups db and seeds with demo data):

Search will not work with local db setup

First rename .env.example to .env

then
```bash
docker-compose up -d

yarn install
# or
npm install
# and
yarn start
# or
npm run start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.


### Running tests

e2e tests will not succeed with this setup because of the db setup
for e2e to pass you need to host all the real data in mongodb atlas.
This is because the e2e tests are testing search functionality and it only works with mongodb atlas

Unit and integration tests:
```bash
yarn test
# or
npm run test
```

e2e tests:
```bash
yarn test:e2e
# or
npm run test:e2e
```

Importing all the data from the csv files to the db is not possible with local hosting because mongodb transactions only work with replica set clusters and it is possible (but very difficult) to host with docker

## Running locally (the way that takes a while)

Demo app hosted at https://citybiker.jeffe.co is hosted with this setup in vercel

### Prerequisites
* MongoDB Atlas DB

1. First rename .env.example to .env and replace DATABASE_URL with your own mongodb atlas url

2. Run `yarn install` or `npm install`
3. Run `yarn run importDB` or `npm run importDB` this will take the csv files and import everything to the db. This will take +20 minutes.
4. Run `yarn start` or `npm run start` to start the app
5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.
 
### Things that I wanted to work on but didn't get to work

* Ordering by columns and pagination don't work at the same time.

### Things that I would probably do differently next time.

* Use a different database. I chose MongoDB because I knew how the aggregation pipeline worked and I wanted to try it out. I think that a relational database would have been better for this project. Especially for hosting database locally
* Not rely on mongodb atlas for search.
