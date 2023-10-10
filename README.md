# sensAI_API

Project in development

## Description

adopet API.

## Getting Started

### Prerequisites

- Node
- Express
- PostgresSQL
- Prisma ORM

### Installing dependencies

Paste into terminal

```
npm i
```

### Environment Variables

#### Database

We need to create environment variables for our database.

Create a file called `.env` in the base of the repository.

Paste inside the `.env` file:

```
DATABASE_URL=
```

Populate the `DATABASE_URL` variable with your own MongoDB URL.

The URL will be in the format of `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`.

See more about connection details [PostgreSQL](https://www.prisma.io/docs/concepts/database-connectors/postgresql).

### Setting up and Seeding Database

We need to create the database and tables in the database then seed the database with data.

Paste in the terminal:

```
npx prisma migrate dev
```

To reset the data in the database.

Paste in the terminal:

```
npx prisma migrate reset -f
```

[Database schema](https://whimsical.com/adopet-RrxjyDRcVHzmjPcm9gQq8d)
