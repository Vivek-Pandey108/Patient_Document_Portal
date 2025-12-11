import express from "express"
import cors from "cors"
import documentRoutes from './routes/documentRoutes.js'
const app = express()


// Middlewares
app.use(cors())
app.use(express.json())

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is healthy boss" });
});

// Documents API
app.use("/api/documents", documentRoutes);

export default app;