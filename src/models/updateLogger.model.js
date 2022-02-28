/** ***************** package Import ******************************************************** */

const mongoose = require('mongoose');

/** ***************** toJson and paginate from plugins folder ******************************************************** */

const { toJSON, paginate } = require('./plugins');

/*
 logsSchema  - It is the schema for our logs module
*/
const updateLogsSchema = mongoose.Schema(
  {
    action: {
      type: String,
    },
    userId: {
      type: String,
    },
    orgId: {
      type: String,
    },
    collectionName: {
      type: String,
    },
    route: {
      type: String,
    },
    oldData: {
      type: Object,
    },
    data: {
      type: Object,
    },
  },
  {
    timestamps: true,
  },
);

// add plugin that converts mongoose to json
updateLogsSchema.plugin(toJSON);
updateLogsSchema.plugin(paginate);

updateLogsSchema.pre('save', async (next) => {
  next();
});

/**
 * @typedef logs
 */
const updateLogs = mongoose.model('updateLog', updateLogsSchema);

module.exports = updateLogs;
