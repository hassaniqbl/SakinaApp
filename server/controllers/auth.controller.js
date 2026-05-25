const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { HttpError } = require("../utils/httpError");
const asyncHandler = require("../config/asyncHandler");
const { getUserByEmail, getUserById, invalidateUserSession, createPasswordResetRequest } = require("../modules/auth/auth.model");


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

const logout = asyncHandler(async (req, res) => {
  // Project currently has auth middleware disabled (public testing mode).
  // We still accept USER_ID from the request body to match provided example.
  const { USER_ID } = req.body || {};

  if (!USER_ID) throw new HttpError(400, "USER_ID is required");

  const db = req.app.locals.db;
  const user = await getUserById(db, USER_ID);
  if (!user) throw new HttpError(401, "Unauthorized");

  // Best-effort invalidation. If DB/session blacklist doesn't exist, this is a logical no-op.
  await invalidateUserSession(db, USER_ID);


  return res.status(200).json({
    success: true,
    message: "User logged out successfully",
    pagination: {},
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { EMAIL_ADDRESS } = req.body || {};


  if (!EMAIL_ADDRESS) throw new HttpError(400, "EMAIL_ADDRESS is required");

  const db = req.app.locals.db;
  const user = await getUserByEmail(db, EMAIL_ADDRESS);
  if (!user) throw new HttpError(404, "Email address not found");


  await createPasswordResetRequest(db, user.USER_ID, EMAIL_ADDRESS);

  return res.status(200).json({

    success: true,
    message: "Password reset instructions sent successfully",
    pagination: {},
  });
});

module.exports = { login, logout, forgotPassword };


