import jwt from "jsonwebtoken";
import { User } from "../models/users.model.js";

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies?.jwt;

        if (!token) {
            return res.status(401).json({ error: "Not authorised, no token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ error: "Not authorised, user not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: "Not authorised, invalid token" });
    }
};

export default authMiddleware;