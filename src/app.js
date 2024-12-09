import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import { errorHandler } from "./middlewares/errorHanlder.js";

async function app() {
  const app = express();

  // Middleware
  app.use(bodyParser.json());
  app.use(express.json());
  app.use(morgan("dev"));
  app.use(errorHandler);

  //Handle 404 errors
  app.use((req, res, next) => {
    res.status(404).json({ success: false, message: "Resource not found" });
  });
}

export default app;
