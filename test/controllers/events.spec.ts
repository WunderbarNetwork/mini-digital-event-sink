import { agent as request } from "supertest";
import { describe, expect, it } from "vitest";

import app from "../../src/app.js";
import { API_KEY_HEADER, AUTH_PATH_API_KEY, AUTH_PATH_JWT, VALID_API_KEY, VALID_EVENT, getValidJwtToken } from "../util/testUtil.js";

describe(`Testing the reverseProxy capability`, () => {
  it("Returns 200 for a valid event", async () => {
    const apiKeyResponse = await request(app).post(AUTH_PATH_API_KEY).send(VALID_EVENT).set(API_KEY_HEADER, VALID_API_KEY);
    expect(apiKeyResponse.statusCode).toBe(200);

    const jwtResponse = await request(app).post(AUTH_PATH_JWT).send(VALID_EVENT).set("Authorization", getValidJwtToken());
    expect(jwtResponse.statusCode).toBe(200);
  });

  it("Returns 401 for invalid AUTH", async () => {
    const apiKeyResponse = await request(app).post(AUTH_PATH_API_KEY).send(VALID_EVENT);
    expect(apiKeyResponse.statusCode).toBe(401);

    const jwtResponse = await request(app).post(AUTH_PATH_JWT).send(VALID_EVENT);
    expect(jwtResponse.statusCode).toBe(401);
  });

  it("Returns 401 for expired/invalid JWT Auth (then succeeds)", async () => {
    const firstResponse = await request(app).post(AUTH_PATH_JWT).send(VALID_EVENT).set("Authorization", "SomethingRandom");
    expect(firstResponse.statusCode).toBe(401);
    expect(firstResponse.headers["authorization"]).not.toBeNull();
    expect(firstResponse.headers["authorization"]).toBe(getValidJwtToken());

    const secondResponse = await request(app)
      .post(AUTH_PATH_JWT)
      .send(VALID_EVENT)
      .set("Authorization", firstResponse.headers["authorization"]);
    expect(secondResponse.statusCode).toBe(200);
  });

  it("Returns 405 for invalid method", async () => {
    const apiKeyResponse = await request(app).get(AUTH_PATH_API_KEY);
    expect(apiKeyResponse.statusCode).toBe(405);

    const jwtResponse = await request(app).get(AUTH_PATH_JWT);
    expect(jwtResponse.statusCode).toBe(405);
  });

  it("Returns 400 for any missing required property", async () => {
    [
      "eventId",
      "eventName",
      "eventCategory",
      "timestamp",
      "eventSource",
      "trackingId",
      "primaryIdentifier",
      "anonymousUser",
      "sdkVersion",
      "schemaVersion",
    ].forEach(async (field) => {
      const event = { ...VALID_EVENT };
      event[field] = undefined;

      const apiKeyResponse = await request(app).post(AUTH_PATH_API_KEY).send(event).set(API_KEY_HEADER, VALID_API_KEY);
      expect(apiKeyResponse.statusCode).toBe(400);

      const jwtResponse = await request(app).post(AUTH_PATH_JWT).send(event).set("Authorization", getValidJwtToken());
      expect(jwtResponse.statusCode).toBe(400);
    });
  });

  it("Returns 400 when the eventId doesn't match the URL", async () => {
    const event = { ...VALID_EVENT };
    event.eventId = "somethingDifferent";

    const apiKeyResponse = await request(app).post(AUTH_PATH_API_KEY).send(event).set(API_KEY_HEADER, VALID_API_KEY);
    expect(apiKeyResponse.statusCode).toBe(400);

    const jwtResponse = await request(app).post(AUTH_PATH_JWT).send(event).set("Authorization", getValidJwtToken());
    expect(jwtResponse.statusCode).toBe(400);
  });

  it("Returns 400 when the eventCategory is invalid", async () => {
    const event: any = { ...VALID_EVENT };
    event["eventCategory"] = "somethingDifferent";

    const apiKeyResponse = await request(app).post(AUTH_PATH_API_KEY).send(event).set(API_KEY_HEADER, VALID_API_KEY);
    expect(apiKeyResponse.statusCode).toBe(400);

    const jwtResponse = await request(app).post(AUTH_PATH_JWT).send(event).set("Authorization", getValidJwtToken());
    expect(jwtResponse.statusCode).toBe(400);
  });

  it("Returns 400 when the anonymousUser is invalid", async () => {
    const event = { ...VALID_EVENT };
    event.anonymousUser = "somethingDifferent";

    const apiKeyResponse = await request(app).post(AUTH_PATH_API_KEY).send(event).set(API_KEY_HEADER, VALID_API_KEY);
    expect(apiKeyResponse.statusCode).toBe(400);

    const jwtResponse = await request(app).post(AUTH_PATH_JWT).send(event).set("Authorization", getValidJwtToken());
    expect(jwtResponse.statusCode).toBe(400);
  });

  it("Returns 400 when the schemaVersion is invalid", async () => {
    const event = { ...VALID_EVENT };
    event.schemaVersion = "somethingDifferent";

    const apiKeyResponse = await request(app).post(AUTH_PATH_API_KEY).send(event).set(API_KEY_HEADER, VALID_API_KEY);
    expect(apiKeyResponse.statusCode).toBe(400);

    const jwtResponse = await request(app).post(AUTH_PATH_JWT).send(event).set("Authorization", getValidJwtToken());
    expect(jwtResponse.statusCode).toBe(400);
  });

  it("Returns 400 when the timestamp is invalid", async () => {
    const event = { ...VALID_EVENT };
    event.timestamp = "somethingDifferent";

    const apiKeyResponse = await request(app).post(AUTH_PATH_API_KEY).send(event).set(API_KEY_HEADER, VALID_API_KEY);
    expect(apiKeyResponse.statusCode).toBe(400);

    const jwtResponse = await request(app).post(AUTH_PATH_JWT).send(event).set("Authorization", getValidJwtToken());
    expect(jwtResponse.statusCode).toBe(400);
  });

  it("Returns 404 when path not specified", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(404);
  });

  it("Returns 404 for an invalid path", async () => {
    const response = await request(app).get("/invalid");
    expect(response.statusCode).toBe(404);
  });
});
