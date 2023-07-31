import HttpError from "../types/HttpError.js";
import type { Response } from "express";

interface ErrorWithMessage {
  message: string;
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === "object" && error !== null && "message" in error && typeof (error as Record<string, unknown>).message === "string"
  );
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) {
    return maybeError;
  }

  return new Error(String(maybeError));
}

/**
 * (Try to) Figure out the type of the error and return it's `message` as a `string`.
 */
export function getErrorMessage(error: unknown): string {
  return toErrorWithMessage(error).message;
}

/**
 * Write an error `Response` from any generic error
 */
export function writeErrorResponse(error: any, response: Response): void {
  console.error(error);
  let statusCodeNumber: number = 500;
  let errorMessage: string = "An error has occurred, check the logs for details.";
  if (error instanceof HttpError) {
    errorMessage = error.message; // "Consumer-friendly" errors, overwrite the default message
    statusCodeNumber = error.statusCode;
  }
  response.status(statusCodeNumber).json({
    message: errorMessage,
  });
}
