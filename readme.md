# NodeJS Worker Example

This is just a proof of concept that uses Node.js and [Redis](https://redis.io/) as a queue to manage requests that should perform as background jobs: e.g: To buy something.

![App Preview](assets/app-preview.jpeg)

One good practice to have communication between services/queues is by using an origin(where to reply) correlation identifier (initial job reference) sending across queues.

## Env Variables

- QUEUE_NAME - The queue to use on the app.
- REDIS_URL - Self explanatory (Default: localhost)
- TIMEOUT - The timeout to wait before check the queue again (Default: 1000 = 1s).
- CONCURRENCY - Number of workers in concurrency (Default: 1).

## Stack

- Node >= 8.x
- Express + Handlebars - Display the form and handle the HTTP requests
- [Bull](https://github.com/OptimalBits/bull) - Redis based queue
- [Bull Arena](https://github.com/bee-queue/arena) - UI for Bull queues

## TODO

- [ ] Add Unit Tests
- [ ] Avoid DRY and put some SOLID
- [ ] Refactor using Typescript?
- [ ] Improve dockerfile/docker-compose.
