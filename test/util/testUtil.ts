import { EnrichedAnalyticsEvent } from "@wunderbar-network/mini-digital-sdk";

const EVENT_ID = "b5b046a2-80cc-474f-b945-aff681a57c35";

export const AUTH_PATH_JWT = `/events/jwt/v1/${EVENT_ID}`;
export const AUTH_PATH_API_KEY = `/events/key/v1/${EVENT_ID}`;

export const VALID_EVENT: EnrichedAnalyticsEvent = {
  eventId: EVENT_ID,
  timestamp: "2023-07-27T11:44:00.655Z",
  eventName: "test_event_parsed",
  eventCategory: "system_outcome_event",
  eventSource: "MiniDigitalSdk.Test",
  entityId: "1234",
  entityType: "test_event",
  action: "parsed",
  trackingId: "82d21361-ce5a-4ce0-bdc8-a32a29341e76",
  primaryIdentifier: "82d21361-ce5a-4ce0-bdc8-a32a29341e76",
  additionalIdentifiers: {},
  anonymousUser: "1",
  sdkVersion: "MiniDigitalEventSink.Test",
  schemaVersion: "1.0.0",
};

export const API_KEY_HEADER = "X-Api-Key";
export const VALID_API_KEY = "FAKE_API_KEY";

export function getValidJwtToken(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const todayDate = `${year}-${month}-${day}`;

  return `FAKE_JWT_TOKEN_${todayDate}`;
}
