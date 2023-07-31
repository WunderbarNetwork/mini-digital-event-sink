import http from "http";
import app from "./app.js";

// Local Server
const httpServer = http.createServer(app);
const port: string = process.env.ENV_LOCAL_HTTP_PORT ?? "3333";

httpServer.listen(port, () => {
  console.log(`Mini Digital API Event Sink / Sandbox Server is running on port ${port}`);
});
