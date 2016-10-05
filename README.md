# node-postgresql-api-boilerplate
> a simple api boilerplate

This is a basic boilerplate for spinning up a non-hypermedia API with a minimum
of abstractions. It relies heavily on [pg-promise] and uses json schema for
input validation (via [is-my-json-valid]).

## Setup Instructions

Install node 6x+ and postgresql (this should be in vagrant or docker).

1. Run `npm install` to install local dependencies.
2. Create database `createdb api-boilerplate`.
3. Run `npm run migrate:up` to initialize the database schema.
3. Run `npm run seed:up` to populate database with seed data.
4. Run `npm run start-dev` to start the api.
5. Browse to <http://localhost:8080/>
6. Edit files in `src/api` (the server will automatically restart on changes).

## Database Migrations

1. Run `npm run migrate` to check the status of migrations.
2. Run `npm run migrate:up` to migrate to the most recent migration.
3. Run `npm run migrate:down` to roll back one migration.
4. Run `npm run migrate:create` to create a new migration file.

## Database Seeds

1. Run `npm run seed` to check the status of seeds.
2. Run `npm run seed:up` to load to the most recent seed.
3. Run `npm run seed:down` to roll back one seed.
4. Run `npm run seed:create` to create a new seed file.


### Creating Resources
```
// one
POST /v1/state
Content-Type: application/json
{
  "data": {
    "name": "Minnesota",
    "abbr": "MN"
  }
}

// many
POST /v1/state
Content-Type: application/json
{
  "data": [{
    "name": "Minnesota",
    "abbr": "MN"
  }, {
    "name": "Vermont",
    "abbr": "VT"
  }]
}
```

### Reading Resources
```
// many
GET /v1/state

// one
GET /v1/state/1
```

### Updating Resources
```
PATCH /v1/state/1
Content-Type: application/json
{
  "data": {
    "name": "Minnesota"
  }
}
```

### Destroying Resources
```
DELETE /v1/state/1
```

[pg-promise]: https://github.com/vitaly-t/pg-promise
[is-my-json-valid]: https://github.com/mafintosh/is-my-json-valid
