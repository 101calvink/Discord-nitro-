import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const app = express();
app.set("trust proxy", true); // IMPORTANT for correct IPs

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Store IP hashes in memory (simple)
const entries = new Set();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function hashIp(ip) {
  return crypto.createHash("sha256").update(ip).digest("hex");
}

app.post("/enter", (req, res) => {
  const ip = req.ip;
  const ipHash = hashIp(ip);
  const discord = (req.body.discord || "").trim();

  if (!discord) {
    return res.status(400).json({ ok: false, message: "Enter your Discord username." });
  }

  if (entries.has(ipHash)) {
    return res.status(403).json({
      ok: false,
      message: "You already entered from this IP."
    });
  }

  entries.add(ipHash);
  console.log(`NEW ENTRY: ${discord} | IP: ${ip}`);

  res.json({ ok: true, message: "Entry successful! 🎉" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});
