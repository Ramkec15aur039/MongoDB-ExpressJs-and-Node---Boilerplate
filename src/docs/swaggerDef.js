/*
   docs Name : swaggerDef
*/
const gitCommitInfo = require('git-commit-info');
const { version } = require('../../package.json');
const config = require('../config/index');

const info = gitCommitInfo();
let description;
if (config.env === 'production') description = '11/27/2021';
else description = `Last Commit: ${info.commit}\n\n Commit Message: ${info.message}\n\n Last Update On: ${info.date}`;
// console.log(path);

// console.log(info);
const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'MongoDB, ExpressJs and NodeJs - Boilerplate',
    description,
    version,
  },

  // change url based on (local/production)
  servers: [
    {
      url: 'http://localhost:5030/v1',
    }
  ],
};

module.exports = swaggerDef;
