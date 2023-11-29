<p align="center">
<img loading="lazy" src="https://img.shields.io/static/v1?label=STATUS&message=project%20in%20development&color=GREEN&style=for-the-badge"/>
</p>

# Adopet REST API

Project in development

## Description

Adopet, a REST API for a platform to connect people who want to adopt pets and shelters.

## Getting Started

### Prerequisites

- Node
- Express
- PostgreSQL
- Prisma ORM
- Redis

### Installing dependencies

Paste into terminal the command below to install all project dependencies.

```
npm i
```

### Environment Variables

#### Databases

We need to create environment variables for our PostgreSQL and Redis databases.

Create a file called `.env` in the base of the repository.

Paste inside the `.env` file:

#### Redis environment variables config:

```
REDIS_URL=
```

Populate the `REDIS_URL` variable with your own Redis URL.

If you are running the Redis database locally the URL should be `redis://localhost:6379`

#### PostgreSQL environment variables config:

```
DATABASE_URL=
```

Populate the `DATABASE_URL` variable with your own PostgreSQL URL.

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

### JWT config

Before starting our API service, we need to configure the JWT Token secret keys.

We need to create environment variables for our JWT Token.

In the same `.env` file we need to create the environment variables below.

```
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
TOKEN_ISSUER=

```

Populate the `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` variables with some random keys. For example:

```
ACCESS_TOKEN_SECRET=Ajt3udOZgum4eFLctSoAA8cZJVTyZzmw
REFRESH_TOKEN_SECRET=Vob0otvJHAp0PN2enqcWVkfEzl4okGL8
```

And populate the `TOKEN_ISSUER` variable with the name of issuer. For example:

```
TOKEN_ISSUER=adopet.com
```

If you want, you can use this website to generate random keys [randomkeygen](https://randomkeygen.com/)

### Hosting

Paste in the terminal:

```
npm run start
```

## Things to do

- Implement documentation with [swagger.io](https://swagger.io/docs/open-source-tools/swagger-editor/)
- Create the front end to use the adoptet API

## Author

👤 **Gilberto Silva**

- Github: [@gilbertouk](https://github.com/gilbertouk)
- LinkedIn: [@gilbertoantonio](https://linkedin.com/in/gilbertoantonio)

## Show your support

Give a ⭐️ if this project helped you!
