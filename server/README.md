# Practical Microservices SLC DevOps Days 2018

## App layout

* Parts we will be working in:

  * `src/aggregators` - Aggregation side of CQRS, we'll be editing these
  * `src/services` - Where services will go, we'll be editing these
  * `src/index.js` - Sets up the app, wires dependencies
  * `src/controllers.js` - Request handlers call into these, we'll need to modify them
  * `src/queries.js` - Functions for interacting with the database

* Parts we won't be working in (but might be interesting):
  * `migrations` - Modifies the PostgreSQL schema
  * `src/db.js` - Configures the database client
  * `src/event-store.js` - We won't need to edit it, but we will look at it
  * `src/messages.js` - ditto
  * `templates` - Pug templates for rendering UI

## NOTES!

Exclamation point, because these are really important.

* You'll notice that passwords are not encrypted in this system. That is because the focus of this repo is supposed to be on microservices, event sourcing, and CQRS, and I've tried to keep the rest to a minimum.
