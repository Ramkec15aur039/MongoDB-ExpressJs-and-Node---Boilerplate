/*
   validation Name : user
*/

/** ***************** package  Import ******************************************************** */

const Joi = require("joi");

/** ***************** validation Import ******************************************************** */
const { password } = require("./custom.validation");

/*
function createUser - This function is used to validate user inputs
*/
const createUser = {
  body: Joi.object().keys({
    _id: Joi.string(),
    name: Joi.string(),
    email: Joi.string()
      .email({ tlds: { allow: false } }),
    password: Joi.string().custom(password),
    mobileNumber: Joi.string(),
    isActive: Joi.boolean(),
    createdAt: Joi.date(),
  }),
};

/*
function getUser - This function is used to validate user inputs

*/
const getUsers = {
  query: Joi.object().keys({
    _id: Joi.string(),
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    search: Joi.string().allow("")
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string(),
  }),
};

/*
function updateUser - This function is used to validate user id and inputs  for updating

*/

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required(),
  }),
  body: Joi.object()
    .keys({
      _id: Joi.string(),
      name: Joi.string(),
      email: Joi.string()
        .email({ tlds: { allow: false } }),
      password: Joi.string().custom(password),
      mobileNumber: Joi.string(),
      isActive: Joi.boolean(),
      createdAt: Joi.date(),
      updatedAt: Joi.date().allow(""),
    })
    .min(1),
};

/*
function deleteUser - This function is used to validate the id to delete user

*/
const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string(),
  }),
};

// exporting all the functions

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
