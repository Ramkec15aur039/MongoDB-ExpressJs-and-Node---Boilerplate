/*
   controller Name : Auth
*/

/** ******************  Import httpStatus and catchAsync(from utils) ******************************************************** */
const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
/** *****************  Import Services required for Auth api ******************************************************** */
const { authService, tokenService, emailService } = require("../services");

// Login function is used to logIn the registered user
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(
    email,
    password,
    req.ipInfo
  );
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

// Logout is to logout the logged user
const logout = catchAsync(async (req, res) => {
  const result = await authService.logout(req.body.refreshToken, req.ipInfo);
  if (result) res.status(200).send({ message: "logged out successfully" });
});

// RefreshTokens is to create the auth token if token expires
const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

// RefreshTokens is to create the auth token if token expires
const candidateRefreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.candidateRefreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});
// forgot password is used to change the password with resetPasswordTokens
const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    req.body.email
  );
  await emailService
    .sendResetPasswordEmail(req.body.email, resetPasswordToken)
    .then(() => res.status(200).send("email sent successfully"));
});

// resetPassword with resetPasswordToken
const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.CREATED).send("password reset successfully");
});

// remove access for temporaryAccess
const removeAccess = catchAsync(async (req, res) => {
  await authService.removeAccess(req.body.accessToken, req.body.refreshToken);
  res.status(httpStatus.OK).send("Access Removed Successfully");
});

// export all the controller to use in routes
module.exports = {
  login,
  logout,
  refreshTokens,
  candidateRefreshTokens,
  forgotPassword,
  resetPassword,
  removeAccess,
};
