import type { Request, Response } from "express";

import { validateEventSchema } from "../util/validation.js";
import { writeErrorResponse } from "../util/errors.js";

import type AuthenticationType from "../types/AuthenticationType.js";
import HttpError from "../util/HttpError.js";

import _ from "lodash";

/**
 * POST /events/jwt/:id (AuthenticationType = JWT)
 * POST /events/key/:id (AuthenticationType = API_KEY)
 */
export async function postEvent(request: Request, response: Response, authenticationType: AuthenticationType): Promise<void> {
  try {
    console.log(`Received event (${authenticationType}):\n${JSON.stringify(request.body, null, 2)}`);

    const rawBody = request.body;

    if (_.isEmpty(rawBody)) {
      throw new HttpError(`Event payload must be provided.`, 400);
    }

    validateEventSchema(request.params.id, rawBody);

    // Returning a 200 OK response
    response.status(200).json({
      message: "ok",
    });
  } catch (error: any) {
    writeErrorResponse(error, response);
  }
}

/**
 * ALL /events/jwt/:id (AuthenticationType = JWT)
 * ALL /events/key/:id (AuthenticationType = API_KEY)
 *
 * ALL = (any HTTP Method not explicitly allocated)
 *
 * Write a 405 (Method Not Allowed) response
 */
export function methodNotAllowedEvent(request: Request, response: Response, authenticationType: AuthenticationType): void {
  try {
    response.status(405).json({
      message: "Method Not Allowed",
    });
  } catch (error) {
    writeErrorResponse(error, response);
  }
}
