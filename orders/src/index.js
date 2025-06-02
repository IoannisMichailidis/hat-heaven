import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import {
  connectDB,
  notFound,
  errorHandler,
  loadYamlFile,
} from "@hat-heaven/common";
import { connectNATS } from "./config/nats.js";
import orderRoutes from "./routes/orderRoutes.js";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// --------------------------------
// Initialization
// --------------------------------
// Check if all of the env variables have been set on pod level
const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;
const NATS_CLUSTER_ID = process.env.NATS_CLUSTER_ID;
const NATS_CLIENT_ID = process.env.NATS_CLIENT_ID;
const NATS_URL = process.env.NATS_URL;
const PORT = process.env.PORT || 5000;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET must be defined");
}

if (
  !process.env.PAYPAL_CLIENT_ID ||
  !process.env.PAYPAL_APP_SECRET ||
  !process.env.PAYPAL_API_URL
) {
  throw new Error("PAYPAL env variables must be defined");
}

if (!MONGO_URI) {
  throw new Error("MONGO_URI must be defined");
}

if (!NATS_CLUSTER_ID) {
  throw new Error("NATS_CLUSTER_ID must be defined");
}

if (!NATS_CLIENT_ID) {
  throw new Error("NATS_CLIENT_ID must be defined");
}

if (!NATS_URL) {
  throw new Error("NATS_URL must be defined");
}

// Connect to MongoDB
connectDB(MONGO_URI);

// Connect to NATS
connectNATS(NATS_CLUSTER_ID, NATS_CLIENT_ID, NATS_URL);

// Initialize the app
const app = express();

// --------------------------------
// Open API - Swagger
// --------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const absolutePath = path.resolve(
  __dirname,
  "./api-docs/Orders-1.0-swagger.yaml"
);
// Load your Swagger document
const swaggerDocument = loadYamlFile(absolutePath);

// --------------------------------
// Middleware
// --------------------------------
// Body parser middleware (parse body data)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser moddleware (parse the cookie from the request)
app.use(cookieParser());

// --------------------------------
// Routes
// --------------------------------
// Serve the API documentation if the document is successfully loaded
console.log("swaggerDocument", swaggerDocument);
if (swaggerDocument) {
  app.use("/swagger/orders", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log(
    `Swagger UI available at http://hat-heaven.local:${PORT}/swagger/orders`
  );
} else {
  console.error("Swagger document could not be loaded.");
}

app.use("/api/orders", orderRoutes); // api/orders is the prefix for whatever is inside the productRoutes

// PayPal Route
app.get("/api/config/paypal", (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

// If none of the above routers was hit then we go for the following handlers
app.use(notFound);

// General error handler
app.use(errorHandler);

// --------------------------------
// Listener
// --------------------------------
app.listen(PORT, () =>
  console.log(`Orders Micro-Server running on port ${PORT}`)
);
