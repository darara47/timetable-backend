# Timetable - back-end

Mobile application to check school timetable.

## Description

An application was created in NestJS with TypeORM. Data are scrapped from [ZST Rybnik](https://www.zstrybnik.pl/html), store in PostgreSQL database at [ElephantSQL](https://www.elephantsql.com) and updates every day. User can check all sections and get lessons for specific one.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Database

```bash
# generate migration
$ npm run migrations:generate

# run migration
$ npm run migrations:run
```

### [Checkout app on vercel here!](https://timetable-backend-git-develop-darara47.vercel.app/api)
