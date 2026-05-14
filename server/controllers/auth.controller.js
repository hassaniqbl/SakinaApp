const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { HttpError } = require("../utils/httpError");
const asyncHandler = require("../config/asyncHandler");
const { getUserByEmail } = require("../modules/auth/auth.model");

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};

  if (!email) throw new HttpError(400, "email is required");
  if (!password) throw new HttpError(400, "password is required");

  const user = await getUserByEmail(req.app.locals.db, email);
  if (!user) throw new HttpError(401, "Invalid credentials");

  const ok = await bcrypt.compare(password, user.PASS);
  if (!ok) throw new HttpError(401, "Invalid credentials");

  const token = jwt.sign(
    { user_id: user.USER_ID, user_role: user.USER_ROLE },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: { token },
    pagination: {},
  });
});

module.exports = { login };

