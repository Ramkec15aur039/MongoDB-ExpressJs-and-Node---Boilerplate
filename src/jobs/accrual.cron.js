const cron = require('node-cron');
const logger = require('../config/logger');

const { UserLeaves, TimeCard } = require('../models');

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const accrualSchedule = async () => {
  console.log('cron started');
  const filter = { isDeleted: false };
  try {
    const userLeavesCount = await UserLeaves?.countDocuments();
    if (userLeavesCount) {
      const userLeaves = await UserLeaves.find(filter).populate([{
        path: 'timeOffPolicyId',
        model: 'timeOffPolicies',
        select: 'accrualSchedule policyName',
      }, {
        path: 'timeOffTypeId',
        model: 'timeOffTypes',
        select: 'typeName orgId',
      }]);
      Promise.all(userLeaves.map(async (data) => {
        // console.log(data, "data");
        // console.log(new Date(data?.timeOffPolicyId?.accrualSchedule?.startDate) >= Date.now(),new Date(data?.timeOffPolicyId?.accrualSchedule?.startDate), Date.now())
        // if(data?.timeOffPolicyId?.accrualSchedule?.startDate >= Date.now()){
        if (data?.timeOffPolicyId?.accrualSchedule?.maxAccrual > data.totalLeaves) {
          const hourlyRate = data?.timeOffPolicyId?.accrualSchedule?.frequency / data?.timeOffPolicyId?.accrualSchedule?.accrualAmount;
          const userTimeCard = await TimeCard.find({ userId: data.userId, status: 'approved', isAccrued: false });
          let totalHours = 0;
          userTimeCard.forEach((time) => {
            const hoursToDecimal = (time.hours + (time.minutes / 60));
            console.log(hoursToDecimal, 'hours to decimal');
            totalHours += hoursToDecimal;
          });
          if (totalHours) {
            const accrualHour = parseFloat(totalHours / hourlyRate, 10).toFixed(2);
            await UserLeaves.findByIdAndUpdate(data._id, { $inc: { totalLeaves: accrualHour, remainingLeaves: accrualHour } });
          }
        }
        return data?.userId;
        // } else {
        //   logger.error("Accrual for this policy not started");
        // }
      })).then((res) => {
        // console.log(res, "response");
        TimeCard.updateMany({ userId: { $in: res }, status: 'approved', isAccrued: false }, { isAccrued: true }).then((result) => console.log(result, 'after update'));
      });
      // await TimeCard.find({userId: data.userId, status: "approved", isAccrued: false});
      return UserLeaves;
    }
    console.log('no user has assigned an policy');
  } catch (e) {
    logger.error(e);
  }
};

// const accrualCron = cron.schedule('0 0 * * 0', accrualSchedule);
const accrualCron = async () => {
  cron.schedule('0 1 * * *', accrualSchedule).start();
};
// accrualSchedule()
// export all the service to use in location.controller.js

module.exports = {
  accrualSchedule,
  accrualCron,
};
