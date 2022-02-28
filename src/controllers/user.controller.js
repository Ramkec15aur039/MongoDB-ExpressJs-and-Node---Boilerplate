/*
   controller Name : User
*/

/** ********************************  Import httpStatus **************************************** */
const httpStatus = require("http-status");

/** ********************************  Import Services ****************************************** */
const { userService } = require("../services");

/** ********************************  Import Utils ******************************************** */
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

/*
function createUser  -  This function is used to create an user
*/
const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body, req); // send to createUser request before create
  res.status(httpStatus.CREATED).send(user);
});

/*
function getUser  -  This function is used to get an user based on query
*/
const getUsers = catchAsync(async (req, res) => {
  const result = await userService.queryUser(req);
  res.send(result);
});

/*
function getUser  -  This function is used to get an user  based on id
*/
const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId, req);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  res.send(user);
});

/*
function updateUser  -  This function is used to update an user  based on id
*/
const updateUser = catchAsync(async (req, res) => {
  const userData = await userService.updateUserById(
    req.params.userId,
    req.body,
    req
  );
  console.log("User updated data from controller:", userData);
  res.send(userData);
});

/*
function deleteUser  -  This function is used to delete an user  based on id
*/
const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId, req);
  res.status(200).send({ success: true });
});

/*
exporting all the function using module exports
*/
module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser
};
