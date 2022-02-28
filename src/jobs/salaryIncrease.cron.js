const cron = require('node-cron');
const logger = require('../config/logger');

const {
  Organization, User, Tasks, Counter,
} = require('../models');
const {
  updateSalaryIncreaseAction,
} = require('../common/updatedSalaryIncrease');
const { counter, emailService } = require('../services');
const { TASKS } = require('../config/constants');
const { findOneAndReplace } = require('../models/token.model');

const getTaskCount = async () => Tasks.count().then(async (e) => {
  if (!e) {
    // await counter.getCount(TASKS);
    return 0;
  }
  return e;
});

const taskDataArray = async (userData, hrUsers, counterId) => {
  const data = {
    _id: counterId,
    orgId: userData.orgId,
    category: 'salary',
    taskType: 'salaryIncreaseActionHr',
    assignTo: hrUsers._id,
    userId: userData._id,
    description:
      'This user is eligible for salary increase action kindly review it.',
  };
  return data;
};
const createTask = async (userData, hrUsers, counterId) => taskDataArray(userData, hrUsers, counterId);
const salaryIncreaseAction = async () => {
  console.log('salary increase cron started');
  const filter = { isDeleted: false, salaryIncreaseAction: true };
  const today = new Date();
  const startOfDay = new Date(today.setUTCHours(0, 0, 0, 0)).toISOString();
  const endOfDay = new Date(today.setUTCHours(23, 59, 59, 999)).toISOString();
  let taskCount = await getTaskCount();
  try {
    const organizationCount = await Organization.find(filter);
    if (organizationCount) {
      const taskData = [];
      await Promise.all(
        organizationCount.map(async (data) => updateSalaryIncreaseAction({
          orgId: data._id,
          salaryIncreaseInterval: data.salaryIncreaseInterval,
        }).then(async () => User.find({
          orgId: data._id,
          nextSalaryIncreaseDate: { $gte: startOfDay, $lt: endOfDay },
          isDeleted: false,
        }).then((usersData) => Promise.all(
          usersData.map(async (user) => {
            await updateSalaryIncreaseAction({
              orgId: user._id,
              salaryIncreaseInterval: data.salaryIncreaseInterval,
              existing: true,
            });

            return User.find(
              { role: 'hr', orgId: data._id, isDeleted: false },
              { _id: 1 },
            ).then((hrUsers) => Promise.all(
              hrUsers.map(async (hr) => {
                createTask(user, hr, ++taskCount).then((res) => {
                  taskData.push(res);
                  return res;
                });
              }),
            ));
          }),
        )))),
      );
      await Tasks.insertMany(taskData)
        .then(async (res) => {
          await Counter.countDocuments({ key_name: TASKS }).then(async (e) => {
            if (!e) {
              if (taskData.length) {
                const insert = new Counter({
                  key_name: TASKS,
                  value: taskCount,
                });
                insert.save((err) => {
                  if (err) console.log(err);
                });
              }
              // await counter.getCount(TASKS);
              return 1;
            }
            if (taskData.length) {
              await Counter.updateOne(
                { key_name: TASKS },
                { $inc: { value: taskData.length } },
              );
            }
            return e;
          });
          await Promise.all(taskData.map(async (items) => {
            await User.findById(items.assignTo).then((user) => emailService.taskNotificationMail(user, 'salaryIncreaseAction').then(() => logger.info('Task notification send'))).catch((err) => logger.error(err));
          }));
        })
        .then(async (count) => {
        })
        .catch((err) => console.log(err, 'err'));
    } else {
      console.log('no organization has enable salary increase action');
    }
  } catch (e) {
    logger.error(e);
  }
};

// const accrualCron = cron.schedule('0 0 * * 0', accrualSchedule);
const salaryIncreaseCron = async () => {
  cron.schedule('0 1 * * *', salaryIncreaseAction).start();
  // cron.schedule("*/1 * * * *", salaryIncreaseAction).start();
};
// accrualSchedule()
// export all the service to use in location.controller.js

module.exports = {
  salaryIncreaseCron,
  salaryIncreaseAction,
};
