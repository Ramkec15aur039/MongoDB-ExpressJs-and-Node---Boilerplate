/*
   Service Name : Auth
*/

/** ***************** Models Import ******************************************************** */
const httpStatus = require("http-status");

/** ***************** Import token and user service  from service ************************** */
const tokenService = require("./token.service");
const userService = require("./user.service");

/** ***************** Import Token model from model **************************************** */
const Token = require("../models/token.model");
const User = require("../models/user.model");

/** ***************** ApiError from utils ************************************************** */
const ApiError = require("../utils/ApiError");

/** ***************** tokenTypes from config/tokens *************************************** */
const { tokenTypes } = require("../config/tokens");

/**
 * Login with corematicaName and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password, ip) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  const loginLogsBodyData = {
    userId: user._id,
    orgId: user.organizationAccessIds,
    ip,
    data: {
      email,
    },
  };
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({
    token: refreshToken,
    type: tokenTypes.REFRESH,
    blacklisted: false,
  });
  // const logBodyData = {
  //   action: 'logout',
  //   userId: refreshTokenDoc.user,
  //   organization: config.mongoose.DbName,
  //   ip,
  //   data: refreshTokenDoc,
  // };
  // await loginLogsService.createloginLogs(logBodyData);
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not found");
  }
  return refreshTokenDoc.remove().then((res) => res);
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(
      refreshToken,
      tokenTypes.REFRESH
    );
    let user;
    if (!refreshTokenDoc.candidate)
      user = await User.findById(refreshTokenDoc.user);
    else return refreshTokenDoc.tokens;
    console.log(user, "user..");
    if (!user) {
      throw new Error(user);
    }
    // const logBodyData = {
    //   action: "refresh",
    //   userId: "",
    //   collectionName: "users",
    //   data: user,
    // };
    // await logsService.createlogs(logBodyData);
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
};


/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(
      resetPasswordToken,
      tokenTypes.RESET_PASSWORD
    );
    const user = await User.findById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });

    await userService
      .updateUserById(user.id, { password: newPassword })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password reset failed");
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword
};
