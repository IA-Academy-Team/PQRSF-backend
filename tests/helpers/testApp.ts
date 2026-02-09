import express from "express";
import routes from "../../src/routes/indexRoutes";
import { errorHandler } from "../../src/middlewares/error.middleware";

export const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api", routes);
  app.use(errorHandler);
  return app;
};

export const startTestServer = async () => {
  const app = createTestApp();
  return new Promise<{ baseUrl: string; close: () => Promise<void> }>((resolve) => {
    const server = app.listen(0, () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        throw new Error("Failed to start test server");
      }
      const baseUrl = `http://127.0.0.1:${address.port}/api`;
      resolve({
        baseUrl,
        close: () =>
          new Promise((res) => {
            server.close(() => res());
          }),
      });
    });
  });
};
