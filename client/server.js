import path from "path";
import express from "express";
import uploadRoutes from "./routes/uploadRoutes.js";
const port = process.env.PORT || 3000;
const app = express();

const __dirname = path.resolve(); // set __dirname to current directory

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "/frontend/build")));

// Make /loads directory static
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Upload Image Route
app.use("/api/upload", uploadRoutes); // api/upload is the prefix for whatever is inside the uploadRoutes

// Catch-all handler: return React's index.html for any non-API route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

app.listen(port, () => console.log(`Frontend server running on port ${port}`));
