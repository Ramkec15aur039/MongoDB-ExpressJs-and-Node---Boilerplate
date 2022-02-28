/** ***************** package Import ******************************************************** */

const express = require('express');

/** ***************** auth , validate from middleware Import ******************************************************** */

// const auth = require("../../middleware/auth");

/** ***************** logs Validation from validation Import ******************************************************** */

/** ***************** logsController from controller Import ******************************************************** */

const updateLogsController = require('../../controllers/updateLogger.controller');

const router = express.Router();

/*
path - /
router to create logs and get logs
post - to create logs from getting logs inputs
get - to show the gathered logs details to admin or user
function auth - This function is to authenticate the valid logs by tokens
function validate - This function is to validate the logs input
function logsController - This function is to create the logs after the auth and validation completed

*/

router.route('/').get(updateLogsController.getUpdateLogger);
router.route('/undo').get(updateLogsController.getUndoLogger);

/*
path - /:logsId
router to get logs by id , update logs by id and to delete logs by id
post - to create logs from getting logs inputs
get - to show the gathered logs details to admin or logs
put - to update the collection
delete - the delete is used to delete the logs based on id given
function auth - This function is to authenticate the valid logs by tokens
function validate - This function is to validate the logs input
function logsController - This function is to create the logs after the auth and validation completed

*/
// router
//   .route("/:logsId")
//   .get(
//     auth("getLogs"),
//     logsController.getLogs
//   )
//   .put(
//     auth("manageLogs"),
//     logsController.updateLogs
//   )
//   .delete(
//     auth("manageLogs"),
//     logsController.deleteLogs
//   );

module.exports = router;

/**
 * swagger
 * name
 */
