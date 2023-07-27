import express, { json, urlencoded } from "express";
import morgan from "morgan";

import { config } from "dotenv";
import type { Express, NextFunction, Request, Response } from "express";

import eventRoutes from "./routes/events.js";
import HttpError from "./types/HttpError.js";

import { writeErrorResponse } from "./util/errors.js";

// Load variables from the .env file
config();

// Create the Express server
const app: Express = express();

// Logging using Morgan
// 'combined', 'common', 'dev', 'short', 'tiny' or anything custom: https://github.com/expressjs/morgan
app.use(morgan("dev"));

// Parse the request
app.use(urlencoded({ extended: false }));
app.use(json());

app.use((request: Request, response: Response, next: NextFunction) => {
  // Enable CORS
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "origin, X-Requested-With, Content-Type, Accept, Authorization");

  // Security headers
  response.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  response.header("X-Frame-Options", "DENY");
  response.header("Content-Security-Policy", `default-src 'none';`);

  if (request.method === "OPTIONS") {
    response.header("Access-Control-Allow-Methods", "GET");

    // The OPTIONS request will "terminate" immediately
    return response.status(200).json({});
  }
  // If not OPTIONS, then handle route
  next();
});

// Routes
app.use("/", eventRoutes);

// Any other route will 404
app.use((request: Request, response: Response) => {
  const error: HttpError = new HttpError("Not found", 404);
  writeErrorResponse(error, response);
});

export default app;
