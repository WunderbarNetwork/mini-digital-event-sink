import type AuthenticationType from "../types/AuthenticationType.js";
import type { RequestHandler, Request, Response, NextFunction } from "express";

/**
 * Used to bind an async function to an `express` handler.
 */
export function asyncHandler(asyncFunction: (request: Request, response: Response) => Promise<void>): RequestHandler {
  return function (request: Request, response: Response, next: NextFunction): void {
    Promise.resolve(asyncFunction(request, response)).catch((err: any) => {
      next(err);
    });
  };
}

/**
 * Used to bind a function to an `express` handler, with an added `AuthenticationType` parameter
 */
export function authenticationTypeHandler(
  handlerFunction: (request: Request, response: Response, authenticationType: AuthenticationType) => void,
  authenticationType: AuthenticationType
): RequestHandler {
  return function (request: Request, response: Response, next: NextFunction): void {
    try {
      handlerFunction(request, response, authenticationType);
    } catch (error: any) {
      next(error);
    }
  };
}

/**
 * Used to bind an async function to an `express` handler, with an added `AuthenticationType` parameter
 */
export function authenticationTypeAsyncHandler(
  asyncFunction: (request: Request, response: Response, authenticationType: AuthenticationType) => Promise<void>,
  authenticationType: AuthenticationType
): RequestHandler {
  return function (request: Request, response: Response, next: NextFunction): void {
    Promise.resolve(asyncFunction(request, response, authenticationType)).catch((err: any) => {
      next(err);
    });
  };
}
