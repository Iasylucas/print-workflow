import { app } from "./app.js";
import { Request, Response } from "express";

const PORT = process.env.PORT || 5050;

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});