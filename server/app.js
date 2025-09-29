import express from "express"
import cors from "cors";
import session from "express-session";
import bodyParser from "body-parser";

import tokenrouter from "./routes/token.routes.js";
import channelrouter from "./routes/channel.routes.js";
import qrrouter from "./routes/qrpay.routes.js";
import webhookrouter from "./routes/webhook.routes.js";
import sessionrouter from "./routes/session.routes.js";
import transrouter from "./routes/transaction.routes.js";
import roomrouter from "./routes/room.routes.js";

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://bobette-membranous-supervoluminously.ngrok-free.dev"
  ],
  credentials: true,               // cho phép gửi cookie/session
}));
app.use(express.json())
app.use(bodyParser.json());
app.use(session({
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, httpOnly: true } // true nếu dùng HTTPS, httponly = true để chặn js độc hại nhằm đánh cắp cookies, nâng cấp bằng csrf hoặc samesitepolicy
}));

app.use("/token", tokenrouter);
app.use("/services", channelrouter)
app.use("/pay", qrrouter)
app.use("/webhook", webhookrouter)
app.use("/sessions", sessionrouter)
app.use("/transaction", transrouter)
app.use("/room", roomrouter)

app.use((err, req, res, next) => {
  console.error("Error middleware:", err.message);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;