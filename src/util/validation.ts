import type { EnrichedAnalyticsEvent } from "@wunderbar-network/mini-digital-sdk-js";
import HttpError from "./HttpError.js";

import _ from "lodash";

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
