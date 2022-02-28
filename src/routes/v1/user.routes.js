/** ***************** package Import ******************************************************** */

const express = require("express");

/** ***************** auth , validate from middleware Import ******************************** */

const auth = require("../../middleware/auth");
const validate = require("../../middleware/validate");

/** ***************** user Validation from validation Import ******************************** */

const userValidation = require("../../validations/user.validation");

/** ***************** userController from controller Import ********************************* */

const userController = require("../../controllers/user.controller");

const router = express.Router();

/*
path - v1/users
router to create user and get user
post - to create user from getting user inputs
get - to show the gathered user details to admin or user
function validate - This function is to validate the user input
function userController - This function is to create the user after the auth and validation completed
*/

router
  .route("/")
  .post(
    auth("manageUsers"),
    validate(userValidation.createUser),
    userController.createUser
  )
  .get(
    auth("getUsers"),
    validate(userValidation.getUsers),
    userController.getUsers
  );

/*
path - /:userId
router to get user by id , update user by id and to delete user by id
post - to create user from getting user inputs
get - to show the gathered user details to admin or user
put - to update the collection
delete - the delete is used to delete the user based on id given
function auth - This function is to authenticate the valid user by tokens
function validate - This function is to validate the user input
function userController - This function is to create the user after the auth and validation completed

*/

router
  .route("/totalUsers")
  .get(
    auth("getUser"),
    validate(userValidation.getTotalUsers),
    userController.getTotalUsers
  );

router
  .route("/:userId")
  .get(
    auth("getUser"),
    validate(userValidation.getUser),
    userController.getUser
  )
  .put(
    auth("manageUsers"),
    validate(userValidation.updateUser),
    userController.updateUser
  )
  .delete(
    auth("manageUsers"),
    validate(userValidation.deleteUser),
    userController.deleteUser
  );

// Get Total users Based On Queries
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and retrieval
 */

/**
 * @swagger
 *  /users:
 *    post:
 *      summary: Create a user
 *      description: Only admin can create other users.
 *      tags: [Users]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - workEmail
 *                - password
 *                - role
 *                - firstName
 *                - lastName
 *                - mobileNumber
 *                - street
 *                - city
 *                - location
 *                - isActive
 *                - isDeleted
 *                - createdBy
 *                - updatedBy
 *                - role
 *              properties:
 *                 _id:
 *                   type: string
 *                 orgId:
 *                   type: string
 *                 organizationAccessIds:
 *                   type: array
 *                 personalEmail:
 *                   type: string
 *                   format: email
 *                 workEmail:
 *                   type: string
 *                   format: email
 *                 password:
 *                   type: string
 *                 role:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 middleName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 preferredName:
 *                   type: string
 *                 clinicalTitle:
 *                   type: string
 *                 dob:
 *                   type: string
 *                 payrollId:
 *                   type: string
 *                 employmentStatus:
 *                   type: string
 *                 terminationDate:
 *                   type: date
 *                 mobileNumber:
 *                   type: string
 *                 telmediqNumber:
 *                   type: string
 *                 preferredPhone:
 *                   type: string
 *                 street:
 *                   type: string
 *                 city:
 *                   type: string
 *                 state:
 *                   type: string
 *                 isActive:
 *                   type: boolean
 *                 isDeleted:
 *                   type: boolean
 *                 createdBy:
 *                   type: boolean
 *                 updatedBy:
 *                   type: boolean
 *              example:
 *                  orgId: "1"
 *                  organizationAccessIds: ["1","2"]
 *                  personalEmail: praveen@example.com
 *                  workEmail: praveen@applogiq.com
 *                  password: password1
 *                  role: user
 *                  firstName: praveen
 *                  middleName: kumar
 *                  lastName: s
 *                  preferredName: praveen
 *                  clinicalTitle: MD
 *                  payrollId: "1"
 *                  employmentStatus: active
 *                  terminationDate: 08/04/2020
 *                  mobileNumber: "1234567890"
 *                  telmediqNumber: "1234567890"
 *                  preferredPhone: "1234567890"
 *                  homeAddress: {
 *                    address1: "87 Texsas colony",
 *                    address2: "A Zone",
 *                    city: "Texas valley",
 *                    state: "Calefornia",
 *                    zipCode: "641652"
 *                   }
 *      responses:
 *        "201":
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  user:
 *                    $ref: '#/components/schemas/User'
 *        "400":
 *          $ref: '#/components/responses/DuplicateEmail'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *
 *    get:
 *      summary: Get all users
 *      description: Only admins can retrieve all users.
 *      tags: [Users]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: query
 *          name: search
 *          schema:
 *            type: string
 *          description: advanced search option with name ,mail
 *        - in: query
 *          name: locationId
 *          schema:
 *            type: string
 *          description: search based on location
 *        - in: query
 *          name: orgId
 *          schema:
 *            type: string
 *          description: search based on organization id
 *        - in: query
 *          name: role
 *          schema:
 *            type: string
 *          description: search based on role
 *        - in: query
 *          name: sortBy
 *          schema:
 *            type: string
 *          description: sort by query in the form of field:desc/asc (ex. name:asc)
 *        - in: query
 *          name: limit
 *          schema:
 *            type: integer
 *            minimum: 1
 *          default: 10
 *          description: Maximum number of users
 *        - in: query
 *          name: page
 *          schema:
 *            type: integer
 *            minimum: 1
 *            default: 1
 *          description: Page number
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  results:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/User'
 *                  page:
 *                    type: integer
 *                    example: 1
 *                  limit:
 *                    type: integer
 *                    example: 10
 *                  totalPages:
 *                    type: integer
 *                    example: 1
 *                  totalResults:
 *                    type: integer
 *                    example: 1
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 *  /users/{id}:
 *    get:
 *      summary: Get a user by Id
 *      description: Logged in users can fetch only their own user information. Only admins can fetch other users.
 *      tags: [Users]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: User id
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/User'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 *
 *    put:
 *      summary: Update a user
 *      description: Logged in users can only update their own information. Only admins can update other users.
 *      tags: [Users]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: User id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - name
 *                - workEmail
 *                - password
 *                - role
 *                - firstName
 *                - lastName
 *                - mobileNumber
 *                - street
 *                - city
 *                - location
 *                - isActive
 *                - isDeleted
 *                - createdBy
 *                - updatedBy
 *              properties:
 *                 _id:
 *                   type: string
 *                 personalEmail:
 *                   type: string
 *                   format: email
 *                 workEmail:
 *                   type: string
 *                   format: email
 *                 password:
 *                   type: string
 *                 role:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 middleName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 preferredName:
 *                   type: string
 *                 professionalTitle:
 *                   type: string
 *                 dob:
 *                   type: string
 *                 prgEmployeeId:
 *                   type: string
 *                 employmentStatus:
 *                   type: string
 *                 terminationDate:
 *                   type: date
 *                 mobileNumber:
 *                   type: string
 *                 telmediqNumber:
 *                   type: string
 *                 preferredPhone:
 *                   type: string
 *                 street:
 *                   type: string
 *                 city:
 *                   type: string
 *                 state:
 *                   type: string
 *                 location:
 *                   type: string
 *                 pager:
 *                   type: string
 *                 isActive:
 *                   type: boolean
 *                 isDeleted:
 *                   type: boolean
 *                 createdBy:
 *                   type: boolean
 *                 updatedBy:
 *                   type: boolean
 *              example:
 *                  orgId: "1"
 *                  organizationAccessIds: ["1","2"]
 *                  personalEmail: praveen@example.com
 *                  workEmail: praveen@applogiq.com
 *                  password: password1
 *                  role: user
 *                  firstName: praveen
 *                  middleName: kumar
 *                  lastName: s
 *                  preferredName: praveen
 *                  clinicalTitle: MD
 *                  payrollId: "1"
 *                  employmentStatus: active
 *                  terminationDate: 08/04/2020
 *                  mobileNumber: "1234567890"
 *                  telmediqNumber: "1234567890"
 *                  preferredPhone: "1234567890"
 *                  homeAddress: {
 *                    address1: "87 Texsas colony",
 *                    address2: "A Zone",
 *                    city: "Texas valley",
 *                    state: "Calefornia",
 *                    zipCode: "641652"
 *                   }
 *
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/User'
 *        "400":
 *          $ref: '#/components/responses/DuplicateEmail'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 *    delete:
 *      summary: Delete a user
 *      description: Logged in users can delete only themselves. Only admins can delete other users.
 *      tags: [Users]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: User id
 *      responses:
 *        "200":
 *          description: No content
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 *  /users/totalUsers:
 *    get:
 *      summary: Get total users.
 *      description: Get all users based on query excluding pagination.
 *      tags: [Users]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: query
 *          name: search
 *          schema:
 *            type: string
 *          description: advanced search option with name ,mail
 *        - in: query
 *          name: location
 *          schema:
 *            type: string
 *          description: search based on location
 *        - in: query
 *          name: orgId
 *          schema:
 *            type: string
 *          description: search based on organization id
 *        - in: query
 *          name: role
 *          schema:
 *            type: string
 *          description: search based on role
 *        - in: query
 *          name: sortBy
 *          schema:
 *            type: string
 *          description: sort by query in the form of field:desc/asc (ex. name:asc)
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  results:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/User'
 *                  totalResults:
 *                    type: integer
 *                    example: 1
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 */
