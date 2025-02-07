import jwt from "jsonwebtoken";

export const genrateAccessToken = ({ id, role }) => {
  return jwt.sign({ id, role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" })
}

export const genrateRefreshToken = ({ id, role }) => {
  return jwt.sign({ id, role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" })
}

export const verifyRefreshToken = (refreshToken) => {
  return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err) => {
    if (err)
      return null;
  })
}