declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /** Port to use when starting the server locally (default is 3333) */
      ENV_LOCAL_HTTP_PORT?: string;
    }
  }
}

// Convert to module with an empty export statement.
export {};
