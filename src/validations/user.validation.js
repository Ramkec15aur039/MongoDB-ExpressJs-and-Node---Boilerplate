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
    orgId: Joi.string(),
    organizationAccessIds: Joi.array().required(),
    personalEmail: Joi.string()
      .email({ tlds: { allow: false } })
      .allow(""),
    workEmail: Joi.string()
      .email({ tlds: { allow: false } })
      .allow(""),
    password: Joi.string().custom(password),
    isPasswordChanged: Joi.boolean(),
    role: Joi.string().allow(""),
    primaryHr: Joi.boolean(),
    firstName: Joi.string(),
    middleName: Joi.string().allow(""),
    lastName: Joi.string(),
    preferredName: Joi.string().allow(""),
    clinicalTitle: Joi.string().allow(""),
    // dob: Joi.date(),
    terminationDate: Joi.date(),
    hireDate: Joi.date(),
    payrollId: Joi.string().allow(""),
    employmentStatus: Joi.string(),
    mobileNumber: Joi.string().allow(""),
    telmediqNumber: Joi.string().allow(""),
    preferredPhone: Joi.string().allow(""),
    profileImage: Joi.string(),
    homeAddress: Joi.object({
      address1: Joi.string().allow(""),
      address2: Joi.string().allow(""),
      city: Joi.string(),
      state: Joi.string(),
      zipCode: Joi.string(),
    }),
    locationId: Joi.string(),
    lastVisitedRoute: Joi.object(),
    lastOrganization: Joi.string(),
    isActive: Joi.boolean().allow(""),
    createdAt: Joi.date().allow(""),
  }),
};

/*
function getUser - This function is used to validate user inputs

*/
const getUsers = {
  query: Joi.object().keys({
    _id: Joi.string(),
    orgId: Joi.string(),
    locationId: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    search: Joi.string().allow(""),
    location: Joi.string().allow(""),
  }),
};

const getTotalUsers = {
  query: Joi.object().keys({
    _id: Joi.string(),
    orgId: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    search: Joi.string().allow(""),
    location: Joi.string().allow(""),
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
      orgId: Joi.string(),
      organizationAccessIds: Joi.array(),
      personalEmail: Joi.string()
        .email({ tlds: { allow: false } })
        .allow(""),
      workEmail: Joi.string()
        .email({ tlds: { allow: false } })
        .allow(""),
      password: Joi.string().custom(password),
      isPasswordChanged: Joi.boolean(),
      profileImage: Joi.string(),
      role: Joi.string().allow(""),
      primaryHr: Joi.boolean(),
      firstName: Joi.string(),
      middleName: Joi.string().allow(""),
      lastName: Joi.string(),
      preferredName: Joi.string().allow(""),
      clinicalTitle: Joi.string().allow(""),
      // dob: Joi.date(),
      terminationDate: Joi.date(),
      hireDate: Joi.date(),
      payrollId: Joi.string().allow(""),
      employmentStatus: Joi.string(),
      mobileNumber: Joi.string().allow(""),
      telmediqNumber: Joi.string().allow(""),
      preferredPhone: Joi.string().allow(""),
      homeAddress: Joi.object({
        address1: Joi.string().allow(""),
        address2: Joi.string().allow(""),
        city: Joi.string(),
        state: Joi.string(),
        zipCode: Joi.string(),
      }),
      locationId: Joi.string(),
      lastVisitedRoute: Joi.object(),
      lastOrganization: Joi.string(),
      isActive: Joi.boolean().allow(""),
      createdAt: Joi.date().allow(""),
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
  getTotalUsers,
  getUser,
  updateUser,
  deleteUser,
};
