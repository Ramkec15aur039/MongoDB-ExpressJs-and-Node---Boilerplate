const { USER_LEAVES } = require("../config/constants");
const { UserLeaves } = require("../models");
const PolicyAssigned = require("../models/policyAssigned.model");
const { counter } = require("../services");

module.exports.assignLocationPolicy = async (
  userId,
  locationId,
  orgId,
  createdBy
) => {
  const policy = await PolicyAssigned.findOne({
    locationId,
    isActive: true,
    orgId,
  });
  console.log(policy, "policy");
  if (policy) {
    const userLeavesId = await counter.getCount(USER_LEAVES);
    const userLeavesData = {
      _id: userLeavesId.toString(),
      userId: userId,
      locationId: locationId,
      locationPolicy: true,
      individualPolicy: false,
      timeOffTypeId: policy.timeOffTypeId,
      timeOffPolicyId: policy._id,
      createdBy: createdBy,
    };

    return await UserLeaves.create(userLeavesData).then((res) => {
      console.log(res, "response");
      return res;
    });
  }
  return 0;
};
