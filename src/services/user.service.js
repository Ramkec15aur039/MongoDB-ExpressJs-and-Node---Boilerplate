/*
   Service Name : Users
*/
/** *************************** Models Import *************************************** */
const { User } = require("../models");
const logger = require("../config/logger");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBodyData, req) => {
  console.log("Request body for create User ->", userBodyData);
  const userBody = userBodyData;
  try {
    const user = await User.create(userBody);
    return user;
  } catch (err) {
    logger.error(err);
  }
};

/**
 * Query for users
 * @returns {Promise<QueryResult>}
 */
const queryUser = async (req) => {
  console.log("Get User");
  try {
    const getUser = await User.find();
    return getUser;
  } catch (err) {
    logger.error(err);
  }
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id, req) => {
  console.log("Get User by ID");
  try {
    console.log("Req id ->", id);
    const user = await User.findById(id);
    console.log("Result", user);
    return user;
  } catch (err) {
    logger.error(err);
  }
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBodyData, req) => {
  const Id = userId;
  const updateData = updateBodyData;
  const userData = await User.findById(Id);
  console.log("Requested user data", userData);
  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  try {
    console.log("user data Found");
    Object.assign(userData, updateData);
    console.log("Modified user data", userData);
    return userData.save().then((data) => {
      console.log("Data from service response:", data);
      return data;
    });
  } catch (err) {
    logger.error(err);
  }
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId, req) => {
  console.log("delete user by ID");
  const user = await User.findById(userId);
  if (!user) {
    console.log("Throw new api error block running...");
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  await user.remove();
  // user.isDeleted = true;
  // await user.save();
  return user;
};

// exporting all the methods
module.exports = {
  createUser,
  queryUser,
  getUserById,
  updateUserById,
  deleteUserById,
};
