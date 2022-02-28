const express = require('express');
const docsRoute = require('./docs.routes');
const logsRoute = require('./logs.routes');
const updateLogsRoute = require('./updateLogger.routes');
const userRoute = require('./user.routes');
const authRoute = require('./auth.routes');

const router = express.Router();

router.use('/docs', docsRoute);
router.use('/logs', logsRoute);
router.use('/updateLogs', updateLogsRoute);
router.use('/users', userRoute);
router.use('/auth', authRoute);

module.exports = router;
