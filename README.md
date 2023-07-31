# Mini Digital Event Sink / API Sandbox

[![CI](https://github.com/WunderbarNetwork/mini-digital-event-sink/actions/workflows/ci.yaml/badge.svg)](https://github.com/WunderbarNetwork/mini-digital-event-sink/actions/workflows/ci.yaml)

This **developer tool** is intended to be a companion while developing your integration to [Mini.Digital](https://mini.digital). Whether you are using an [SDK](https://github.com/WunderbarNetwork/mini-digital-sdk-js) or the [Mini Digital HTTP API](https://docs.mini.digital), this Event Sink / API Sandbox is meant to behave exactly the same way as the Mini.Digital production endpoints would - except that all events sent here get completely discarded after being validated (they are only printed out in the console).

While ideally you'd like to get analytics value by sending event data to the production endpoint, this tool can be handy in different situations:

1. While you are developing the integration, to make sure you craft your events properly.
2. When running your application's tests or while it's used by test users (to not dilute "real" events in production).
3. In CI/CD environments.

Note that, at least if using a Mini Digital SDK, event tracking could also be _paused_. See the [docs](https://docs.mini.digital) for more info on our SDKs.

## Setup

To setup the project after cloning the repository, run:

```shell
npm install
```

or if using yarn:

```shell
yarn install
```

## Start the Dev server

To start the app in development mode, run the following command:

```sh
npm run dev
```

or if using yarn:

```shell
yarn dev
```

This starts the server in localhost using the default port (`http://localhost:3333`). The port can be customized by editing the `ENV_LOCAL_HTTP_PORT` value in the `.env` file.

## Sending Events

The sink / sandbox will validate the events the same way the production server will, so if the event gets accepted here (`HTTP 200 Ok` returned), chances are it will be accepted by the production server as well.

Otherwise, the sink might return a range of `HTTP 4xx` error codes:

- `400 Bad Request` - if the payload is not right (the `message` field in the HTTP response will provide more detail as to what to correct)
- `401 Unauthorized` - Only if using the HTTP API (see the HTTP API section below)
- `404 Not Found` - if a invalid URL is requested, also only if using the HTTP API
- `405 Method Not Allowed` - if using any HTTP Method other than `OPTIONS` or `POST` - also when using the HTTP API

We will not be covering what a valid payload for the Event Schema looks like here, see the [docs](https://docs.mini.digital) to get a better understanding.

The only situation the sink does not cover (compared to the production environment) is returning a `403 Forbidden` for invalid API Keys, as it considers any API Key sent in the header to be valid.

### Using a Mini Digital SDK

When using an SDK, the SDK will handle everything for you, so long as it is "pointed" to this locally running instance instead of the production one. To point the [TypeScript/JavaScript Mini Digital SDK](https://github.com/WunderbarNetwork/mini-digital-sdk-js) to the sink, do the following:

```typescript
import { EventTrackingConfig } from "@wunderbar-network/mini-digital-sdk";

EventTrackingConfig.miniDigitalUrl = "http://localhost:3333";
```

Once that is set, all subsequent events sent using the `EventTrackingService.postEvent()` method will end up in the sink.

### Using HTTP POST requests

Based on the desired **Authentication Type** (JWT or API Keys), you can use the following endpoints:

- **JWT Authentication**

```txt
POST http://localhost:3333/events/jwt/v1/{id}
```

- **API Key Authentication**

```txt
POST http://localhost:3333/events/key/v1/{id}
```

The sink will consider **any** provided API Key as a valid key. It will also simulate a **JWT Token** exchange the same way the production server would. See the [docs](https://docs.mini.digital) for more information on the HTTP API and authentication types.

## Building a Docker image

Should you wish to use Docker rather than starting the project using npm/yarn, there is a provided `Dockerfile` in the repo. To build it, run:

```shell
docker build -t mini-digital-event-sink:latest -f Dockerfile .
```
