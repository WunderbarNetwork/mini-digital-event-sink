import type { EnrichedAnalyticsEvent } from "@wunderbar-network/mini-digital-sdk";
import HttpError from "../types/HttpError.js";

import type { Request } from "express";

import _ from "lodash";

/** Header API Key param name */
export const X_API_KEY: string = "X-Api-Key";

/**
 * Parse a JSON payload into a valid `AnalyticsEvent` and validate contents
 */
export function validateEventSchema(eventId: string, rawBody: any): EnrichedAnalyticsEvent {
  // Parse into valid type
  const event: EnrichedAnalyticsEvent = eventFromJson(rawBody);

  // Make sure IDs match
  if (!_.isEqual(event.eventId, eventId)) {
    throw new HttpError(`The event ID in the payload must match the one in the request.`, 400);
  }

  return event;
}

/**
 * Parse (deserialize) an incoming JSON object as an `EnrichedAnalyticsEvent`
 */
function eventFromJson(jsonObject: any): EnrichedAnalyticsEvent {
  // Pretty basic validation. Note that this is only suitable for validating strings,
  // not other types (i.e. integers) - currently all properties are strings.
  // Values are also not validated, only if the field is present or not.
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
  ].forEach((field) => {
    if (_.isEmpty(jsonObject[field] as string)) {
      throw new HttpError(`Event must have the ${field} field provided.`, 400);
    }
  });

  // Validate the `eventCategory` property
  switch (jsonObject.eventCategory as string) {
    case "screen_view_event":
    case "user_outcome_event":
    case "system_outcome_event":
    case "content_event":
    case "interaction_event":
      break;
    default:
      throw new HttpError(`Event category is not valid.`, 400);
  }

  // Validate the `anonymousUser` property
  switch (jsonObject.anonymousUser as string) {
    case "0":
    case "1":
      break;
    default:
      throw new HttpError(`Anonymous user needs to be either 0 or 1.`, 400);
  }

  // Validate the `schemaVersion` property
  switch (jsonObject.schemaVersion as string) {
    case "1.0.0":
      break;
    default:
      throw new HttpError(`The provided schema version is not supported.`, 400);
  }

  // Validate that the timestamp is in the ISO 8601 format
  if (!isTimestampValid(jsonObject.timestamp as string)) {
    throw new HttpError("The timestamp should be in ISO 8601 format.", 400);
  }

  // All fields, including optional, are copied over
  const event: EnrichedAnalyticsEvent = {
    eventId: jsonObject.eventId,
    eventName: jsonObject.eventName,
    eventCategory: jsonObject.eventCategory,
    eventSource: jsonObject.eventSource,
    entityId: jsonObject.entityId,
    entityType: jsonObject.entityType,
    action: jsonObject.action,
    trackingId: jsonObject.trackingId,
    primaryIdentifier: jsonObject.userId,
    additionalIdentifiers: {
      ...jsonObject.additionalIdentifiers,
    },
    anonymousUser: jsonObject.anonymousUser,
    timestamp: jsonObject.timestamp,
    eventProperties: {
      ...jsonObject.eventProperties,
    },
    sdkVersion: jsonObject.sdkVersion,
    schemaVersion: jsonObject.schemaVersion,
  };

  return event;
}

/**
 * Validate that the timestamp is in the ISO 8601 format
 */
function isTimestampValid(timestamp: string): boolean {
  // ISO 8601 format regex pattern
  const iso8601Pattern = new RegExp(
    /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[0-1])T([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(\.\d{1,3})?(Z|[+-]([01]\d|2[0-3]):([0-5]\d))$/,
  );

  return iso8601Pattern.test(timestamp);
}

/**
 * Validate that a "valid" JWT token is present for browser-based requests
 *
 * @returns `null` if token is present and "valid", a new token otherwise (to be returned with a 401)
 */
export function validateJwtAuth(request: Request): string | null {
  const headerToken: string = request.headers.authorization ?? "";

  // Get a new "valid" token
  const validToken = getValidJwtToken();

  if (_.isEmpty(headerToken) || !_.isEqual(headerToken, validToken)) {
    return validToken;
  }

  return null;
}

/**
 * To simulate token expiry, we will dynamically generate a fake token, containing today's date in it.
 */
function getValidJwtToken(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const todayDate = `${year}-${month}-${day}`;

  return `FAKE_JWT_TOKEN_${todayDate}`;
}

/**
 * Validate than an API Key is present for API Key validation
 */
export function validateApiKey(request: Request): void {
  const apiKey: string = request.get(X_API_KEY) ?? "";

  if (_.isEmpty(apiKey)) {
    throw new HttpError(`${X_API_KEY} is missing from the request.`, 401);
  }
}
