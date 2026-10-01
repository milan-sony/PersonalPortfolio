// Vercel serverless function behind POST /api/contact
import { getClientIp, handleContact } from "../server/contact.js";

export default async function handler(req, res) {
    const { status, body } = await handleContact({
        method: req.method,
        body: req.body,
        ip: getClientIp(req.headers, req.socket?.remoteAddress),
        env: process.env,
    });

    res.setHeader("Cache-Control", "no-store");
    res.status(status).json(body);
}
