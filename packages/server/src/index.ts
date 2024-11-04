import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { errorHandler } from "./middleware/errorHandler";
import { main as addresso } from "./addresso";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

app.get("/api/addresso", async (req, res) => {
  const records = await addresso();
  res.json(records);
});

app.use(express.static(path.join(__dirname, "../../public")));

app.use("*", (req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
