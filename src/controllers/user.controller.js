/*
   controller Name : User
*/

/** ******************  Import httpStatus ******************************************************** */

const httpStatus = require('http-status');
/** ******************  Import pick,ApiError and catchAsync ******************************************************** */
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
/** ******************  Import Services ******************************************************** */
const { userService } = require('../services');

/*
function createUser  -  This function is used to create an user
*/
const createUser = catchAsync(async (req, res) => {
  const reqData = {
    loggedUserId: req.user._id,
    originUrl: req.originUrl,
  };
  const user = await userService.createUser(req.body, reqData); // send to createUser request before create
  res.status(httpStatus.CREATED).send(user);
});

/*
function getUser  -  This function is used to get an user  based on specifie corematicaName and role
*/

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['role', 'locationId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options, req);
  res.send(result);
});

/*
function getTotalUser  -  This function is used to get total users without pagination based on queries
*/

const getTotalUsers = catchAsync(async (req, res) => {
  console.log('Total user controller--');
  const filter = pick(req.query, ['role', 'location', '_id']);
  const options = pick(req.query, ['sortBy']);
  const result = await userService.queryTotalUsers(filter, options, req);
  res.send(result);
});

/*
function getUser  -  This function is used to get an user  based on id
*/
const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId, req);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

/*
function updateUser  -  This function is used to update an user  based on id
*/

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(
    req.params.userId,
    req.body,
    req,
  );
  res.send(user);
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
  getTotalUsers,
  getUser,
  updateUser,
  deleteUser,
};
