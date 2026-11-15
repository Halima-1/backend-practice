import jwt from "jsonwebtoken";

export const generateTOken = (userId, res) => {
    const payLoad = { id: userId }
    const token = jwt.sign(payLoad, process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    )
    res.cookie("jwt", token,
        {
            httpOnly: true,
            secure: process.env.NODE_ENV === "Production",
            sameSite: "strict",
            maxAge: (1000 * 60 * 60 * 24) * 7,
        }
    )
    return token;
}