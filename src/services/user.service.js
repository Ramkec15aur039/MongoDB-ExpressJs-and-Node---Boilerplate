/*
   Service Name : Users
*/

/** ***************** Models Import ****************************************************** */
const httpStatus = require("http-status");
const {
  USER,
  ORGANIZATION,
  USER_PROFILE_INFO,
  TEMPLATES,
  ROLES,
  LOCATIONS,
  EMPLOYMENT_TYPE,
  EMPLOYEE_FOLDER,
  ROLES_AND_ACCESS,
  SPECIALTY,
  TIME_OFF_TYPE,
  TIME_OFF_POLICY,
  ORGANIZATION_FOLDER,
  TEAM_INFO,
} = require("../config/constants");
const logger = require("../config/logger");
const {
  User,
  Organization,
  Counter,
  UserProfile,
  Templates,
  Roles,
  Location,
  EmploymentType,
  EmployeeFolder,
  RolesAndAccess,
  Specialty,
  TimeOffPolicy,
  TimeOffType,
  OrganizationFolder,
  TeamInfo,
} = require("../models");
const testData = require("../../TestData.json");
/* ****************** package Import ****************************************************** */

/** ***************** ApiError Import ***************************************************** */
const ApiError = require("../utils/ApiError");

/** ***************** Counter services Import ********************************************* */
const counter = require("./counter.service");
const logsService = require("./logs.service");
const TimeOffPolicies = require("../models/timeOffPolicy.model");
const { mkdir } = require("fs").promises;
const path = require("path");
const { assignLocationPolicy } = require("../common/assignLocationPolicy");

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBodyData, reqData) => {
  const userBody = userBodyData;
  const userProfileBody = { ...userBodyData };
  let routePath = "";
  if (reqData) routePath = reqData.originalUrl;
  try {
    if (await User.isEmailTaken(userBody.workEmail)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
    }
    const id = await counter.getCount(USER); // passing users id to get counter value to autoIncrement _id
    userBody._id = id.toString();
    userBody.createdBy = reqData.loggedUserId;
    const user = await User.create(userBody).then(async (res) => {
      const userProfileId = await counter.getCount(USER_PROFILE_INFO); // passing users id to get counter value to autoIncrement _id

      const userProfileData = {
        userId: id,
        personalInfo: {
          ...userProfileBody,
        },
      };
      userProfileData._id = userProfileId.toString();
      UserProfile.create({
        ...userProfileData,
      }).catch((err) => console.log(err));
      // assignLocationPolicy(id, res.locationId, res.orgId, reqData.loggedUserId); // need to pass userId, locationId, orgId, createdBy
      return res;
    });

    const logBodyData = {
      action: "create",
      userId: reqData.loggedUserId,
      route: routePath,
      collectionName: "users",
      data: userBody,
    };
    logsService.createlogs(logBodyData);
    return user;
  } catch (e) {
    logger.error(e);
  }
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
const queryUsers = async (filterData, options, req) => {
  const filter = filterData;
  const routePath = req.originalUrl;
  if (req.query.search) {
    filter["$or"] = [
      {
        $expr: {
          $regexMatch: {
            input: { $concat: ["$firstName", "$lastName"] },
            regex: `${escapeRegExp(req.query.search)}`, //Your text search here
            options: "i",
          },
        },
      },
      {
        firstName: {
          $regex: `${escapeRegExp(req.query.search)}`,
          $options: "i",
        },
      },
      {
        lastName: {
          $regex: `${escapeRegExp(req.query.search)}`,
          $options: "i",
        },
      },
      {
        workEmail: {
          $regex: `${escapeRegExp(req.query.search)}`,
          $options: "i",
        },
      },
    ];
  }
  if (req.query.orgId) {
    filter.organizationAccessIds = { $in: [req.query.orgId] };
  }
  filter.isDeleted = false;
  console.log(filter);
  const join = [
    {
      path: "orgId",
      model: "organizations",
    },
  ];
  // const join = "organizations";
  try {
    const users = await User.paginate(
      filter,
      options,
      {
        createdBy: 0,
        updatedBy: 0,
        isDeleted: 0,
      },
      join
    ); //This third argument is to remove the field from response  return users;

    const logBodyData = {
      action: "get",
      userId: req.user._id,
      route: routePath,
      collectionName: "users",
      data: filter,
    };
    logsService.createlogs(logBodyData);
    return users;
  } catch (e) {
    logger.error(e);
  }
};

/**
 * Query for total users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @returns {Promise<QueryResult>}
 */
function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
const queryTotalUsers = async (filterData, options, req) => {
  const filter = filterData;
  const routePath = req.originalUrl;
  if (req.query.search) {
    filter["$or"] = [
      {
        $expr: {
          $regexMatch: {
            input: { $concat: ["$firstName", "$lastName"] },
            regex: `${escapeRegExp(req.query.search)}`, //Your text search here
            options: "i",
          },
        },
      },
      {
        firstName: {
          $regex: `${escapeRegExp(req.query.search)}`,
          $options: "i",
        },
      },
      {
        lastName: {
          $regex: `${escapeRegExp(req.query.search)}`,
          $options: "i",
        },
      },
      {
        workEmail: {
          $regex: `${escapeRegExp(req.query.search)}`,
          $options: "i",
        },
      },
    ];
  }
  if (req.query.orgId) {
    filter.organizationAccessIds = { $in: [req.query.orgId] };
  }
  filter.isDeleted = false;
  console.log(filter);
  const usersListData = await User.aggregate([
    {
      $match: filter,
    },
    {
      $lookup: {
        from: "teamInfo",
        localField: "_id",
        foreignField: "userId",
        as: "teamInformation",
      },
    },
    {
      $unwind: {
        path: "$teamInformation",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "teamInformation.reportingManager.userId",
        foreignField: "_id",
        as: "reportingManager",
      },
    },

    {
      $unwind: {
        path: "$reportingManager",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "locations",
        localField: "location",
        foreignField: "_id",
        as: "location",
      },
    },

    {
      $unwind: {
        path: "$reportingManager",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        "reportingManager.__v": 0,
        "teamInformation.__v": 0,
        // "id": "$location._id",
        __v: 0,
      },
    },
  ]);
  console.log(usersListData, "users list data");

  // {
  //   $project: {
  //     filterData: {
  //       $filter: {
  //         input: '$teamInformation.reportingManager',
  //         as: 'data',
  //         cond: {
  //           $eq: [true, '$$data.isActive'],
  //         },
  //       },
  //     },
  //     userId: 1,
  //     usedLeaves: 1,
  //     timeOffTypeId: 1,
  //     remainingLeaves: 1,
  //     totalLeaves: 1,
  //     isActive: 1,
  //     isDeleted: 1,
  //   },
  // },
  // {
  //   $lookup: {
  //     from: 'users',
  //     localField: 'filterData.userId',
  //     foreignField: '_id',
  //     as: 'reportingManager',
  //   },
  // },
  // { $addFields: { reportingManager: '$reportingManager' } },

  // {
  //   $lookup: {
  //     from: 'timeOffTypes',
  //     localField: 'timeOffTypeId',
  //     foreignField: '_id',
  //     as: 'timeOffTypeId',
  //   },
  // },
  // {
  //   $lookup: {
  //     from: 'users',
  //     localField: 'userId',
  //     foreignField: '_id',
  //     as: 'requestor',
  //   },
  // },
  // {
  //   $unwind: '$filterData',
  // },

  // {
  //   $unwind: '$timeOffTypeId',
  // },
  // {
  //   $unwind: '$reportingManager',
  // },
  // {
  //   $unwind: '$requestor',
  // },

  // {
  //   $project: {
  //     userId: 1,
  //     usedLeaves: 1,
  //     timeOffTypeId: 1,
  //     remainingLeaves: 1,
  //     totalLeaves: 1,
  //     'reportingManager.workEmail': 1,
  //     'reportingManager.firstName': 1,
  //     'requestor.firstName': 1,
  //     'requestor.middleName': 1,
  //     'requestor.lastName': 1,
  //     'requestor.orgId': 1,
  //     isActive: 1,
  //     isDeleted: 1,
  //   },
  // },
  // console.log(usersListData, "userlistdata");
  const join = [
    {
      path: "orgId",
      model: "organizations",
    },
    {
      path: "locationId",
      model: "locations",
    },
  ];
  // const join = "organizations";
  try {
    const users = await User.find(filter, {
      createdBy: 0,
      updatedBy: 0,
      isDeleted: 0,
    }).populate(join); // This third argument is to remove the field from response  return users;

    const logBodyData = {
      action: "get",
      userId: req.user._id,
      route: routePath,
      collectionName: "users",
      data: filter,
    };
    logsService.createlogs(logBodyData);
    const totalUsers = await User.countDocuments(filter);
    // console.log("Total Users check:", users);
    const result = {
      results: usersListData,
      totalUsers,
    };
    return result;
  } catch (e) {
    logger.error(e);
  }
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id, req) => {
  const routePath = req.originalUrl;
  try {
    const logBodyData = {
      action: "getById",
      userId: req.user._id,
      route: routePath,
      collectionName: "users",
      data: { _id: id },
    };
    await logsService.createlogs(logBodyData);
    return User.find({ _id: id, isDeleted: false }, { isDeleted: 0 });
  } catch (e) {
    logger.error(e);
  }
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) =>
  User.findOne({ workEmail: email, isDeleted: false });

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBodyData, req) => {
  let routePath = "";
  if (req) routePath = req.originalUrl;

  const updateBody = updateBodyData;
  try {
    const user = await User.findById(userId);
    const logBodyData = {
      action: "update",
      userId: req.user._id,
      route: routePath,
      collectionName: "users",
      data: updateBody,
    };
    logsService.createlogs(logBodyData);

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    if (
      updateBody.workEmail &&
      (await User.isEmailTaken(updateBody.workEmail, userId))
    ) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
    }
    updateBody.updatedBy = userId;
    Object.assign(user, updateBody);
    return await user
      .save()
      .then(async (res) => {
        console.log(res, "from user");
        UserProfile.findOne({ userId: res._id, isDeleted: false })
          .then(async (profile) => {
            console.log(profile, "from the inside");
            profile.personalInfo = res;
            UserProfile.updateOne({ userId: profile._id }, profile)
              .then((updateProfile) => console.log(updateProfile, "file"))
              .catch((err) => console.log(err, "from outside"));
          })
          .catch((err) => logger.error(err));
        return res;
      })
      .catch((e) => {
        if (e.code === 11000) {
          logger.error(`${JSON.stringify(e.keyValue)} duplicate error`);
          const duplicates = Object.keys(e.keyValue);
          throw new Error(`${duplicates} duplicates details`);
        } else {
          throw new Error(e);
        }
      });
  } catch (e) {
    if (e.toString().includes("duplicates")) {
      throw new ApiError(httpStatus.CONFLICT, e);
    } else throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, e);
  }
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId, req) => {
  const routePath = req.originalUrl;
  const user = await User.findById(userId);
  const logBodyData = {
    action: "delete",
    userId: req.user._id,
    collectionName: "users",
    route: routePath,
    data: {
      isDeleted: true,
      deletedId: userId,
    },
  };
  await logsService.createlogs(logBodyData);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  // await user.remove();
  user.isDeleted = true;
  await user.save();
  return user;
};

const defaultTestData = async () => {
  const userCount = await User.count().then(async (e) => {
    if (!e) await counter.getCount(USER);
    return e;
  });
  const organizationCount = await Organization.count().then(async (e) => {
    if (!e) await counter.getCount(ORGANIZATION);
    return e;
  });
  await UserProfile.count().then(async (e) => {
    if (!e) await counter.getCount(USER_PROFILE_INFO);
    return e;
  });
  await Templates.count().then(async (e) => {
    if (!e) await counter.getCount(TEMPLATES);
    return e;
  });
  await Roles.count().then(async (e) => {
    if (!e) await counter.getCount(ROLES);
    return e;
  });
  await RolesAndAccess.count().then(async (e) => {
    if (!e) await counter.getCount(ROLES_AND_ACCESS);
    return e;
  });
  await Location.count().then(async (e) => {
    if (!e) await counter.getCount(LOCATIONS);
    return e;
  });
  await EmploymentType.count().then(async (e) => {
    if (!e) await counter.getCount(EMPLOYMENT_TYPE);
    return e;
  });
  await Specialty.count().then(async (e) => {
    if (!e) await counter.getCount(SPECIALTY);
    return e;
  });
  await EmployeeFolder.count().then(async (e) => {
    if (!e) await counter.getCount(EMPLOYEE_FOLDER);
    return e;
  });
  await OrganizationFolder.count().then(async (e) => {
    if (!e) await counter.getCount(ORGANIZATION_FOLDER);
    return e;
  });
  await TimeOffType.count().then(async (e) => {
    if (!e) await counter.getCount(TIME_OFF_TYPE);
    return e;
  });
  await TimeOffPolicy.count().then(async (e) => {
    if (!e) await counter.getCount(TIME_OFF_POLICY);
    return e;
  });
  await TeamInfo.count().then(async (e) => {
    if (!e) await counter.getCount(TEAM_INFO);
    return e;
  });
  if (!organizationCount || !userCount) {
    // testData.TestOrganization.map(async (e) => {
    //   const userBody = e;
    //   const id = e._id; // passing users id to get counter value to autoIncrement _id
    //   userBody._id = id.toString();
    //   userBody.createdBy = userBody._id;
    //   try {
    //     await Organization.create(userBody);
    //   } catch (err) {
    //     logger.error(err);
    //   }
    // });
    await Organization.insertMany(testData.TestOrganization);
    // await User.insertMany(testData.TestUser);
    // await UserProfile.insertMany()

    await testData.TestUser.map(async (e) => {
      const userBody = e;
      const id = e._id; // passing users id to get counter value to autoIncrement _id
      userBody._id = id.toString();
      userBody.createdBy = userBody._id;
      try {
        await User.create(userBody).then(() => {
          UserProfile.create({
            _id: e._id,
            userId: id,
            personalInfo: {
              firstName: userBody.firstName || "",
              middleName: userBody.lastName || "",
              lastName: userBody.middleName || "",
              personalEmail: userBody.personalEmail || "",
              workEmail: userBody.workEmail || "",
              dob: userBody.dob || "",
              telmediqNumber: userBody.telmediqNumber || "",
              preferredName: userBody.preferredName || "",
              preferredPhone: userBody.preferredPhone || "",
              clinicalTitle: userBody.clinicalTitle || "",
              pager: userBody.pager || "",
              homeAddress: {
                address1: userBody.address1 || "",
                address2: userBody.address2 || "",
                city: userBody.city || "",
                state: userBody.state || "",
                zipCode: userBody.zipCode || "",
              },
            },
          });
        });
      } catch (err) {
        logger.error(err);
      }
    });
    Templates.insertMany(testData.Templates);
    Roles.insertMany(testData.Roles);
    Location.insertMany(testData.Location);
    EmploymentType.insertMany(testData.EmploymentType);
    RolesAndAccess.insertMany(testData.RolesAndAccess);
    Specialty.insertMany(testData.Specialty);
    TeamInfo.insertMany(testData.TeamInfo);
    await EmployeeFolder.insertMany(testData.EmployeeFolder).then(
      async (res) => {
        console.log(res, "response");

        try {
          const dirnames = res.map((data) => data.name);

          await Promise.all(
            dirnames.map((dirname) =>
              mkdir(path.join(__dirname, `../public/common/${dirname}`), {
                recursive: true,
              }).catch(console.error)
            )
          );

          // All dirs are created here or errors reported.
        } catch (err) {
          console.error(err);
        }
      }
    );
    await OrganizationFolder.insertMany(testData.OrganizationFolder).then(
      async (res) => {
        console.log(res, "response");

        try {
          const dirnames = res.map((data) => {
            return { name: data.name, orgId: data.orgId };
          });

          await Promise.all(
            dirnames.map((dirname) =>
              mkdir(
                path.join(
                  __dirname,
                  `../public/orgFolder/${dirname.orgId}/${dirname.name}`
                ),
                {
                  recursive: true,
                }
              ).catch(console.error)
            )
          );

          // All dirs are created here or errors reported.
        } catch (err) {
          console.error(err);
        }
      }
    );
    TimeOffType.insertMany(testData.TimeOffTypes);
    TimeOffPolicy.insertMany(testData.TimeOffPolicy);
    const userDataLength = testData.TestUser.length;
    const organizationDataLength = testData.TestOrganization.length;
    const templatesDataLength = testData.Templates.length;
    const rolesLength = testData.Roles.length;
    const locationLength = testData.Location.length;
    const employmentTypeLength = testData.EmploymentType.length;
    const rolesAndAceessLength = testData.RolesAndAccess.length;
    const specialtyLength = testData.Specialty.length;
    const employeeFolder = testData.EmployeeFolder.length;
    const organizationFolder = testData.OrganizationFolder.length;
    const timeOffTypeLength = testData.TimeOffTypes.length;
    const timeOffPolicyLength = testData.TimeOffPolicy.length;
    const teamInfoLength = testData.TeamInfo.length;
    await Counter.updateOne(
      { key_name: USER },
      { value: userDataLength },
      (err) => {
        console.log(err);
      }
    ).then((res) => {
      console.log(res);
    });
    await Counter.updateOne(
      { key_name: ORGANIZATION },
      { value: organizationDataLength },
      (err) => {
        console.log(err);
      }
    );
    await Counter.updateOne(
      { key_name: USER_PROFILE_INFO },
      { value: userDataLength },
      (err) => {
        console.log(err);
      }
    );
    await Counter.updateOne(
      { key_name: TEMPLATES },
      { value: templatesDataLength },
      (err) => {
        console.log(err);
      }
    );
    await Counter.updateOne(
      { key_name: ROLES },
      { value: rolesLength },
      (err) => {
        console.log(err);
      }
    );

    await Counter.updateOne(
      { key_name: LOCATIONS },
      { value: locationLength },
      (err) => {
        console.log(err);
      }
    );

    await Counter.updateOne(
      { key_name: EMPLOYMENT_TYPE },
      { value: employmentTypeLength },
      (err) => {
        console.log(err);
      }
    );

    await Counter.updateOne(
      { key_name: ROLES_AND_ACCESS },
      { value: rolesAndAceessLength },
      (err) => {
        console.log(err);
      }
    );

    await Counter.updateOne(
      { key_name: SPECIALTY },
      { value: specialtyLength },
      (err) => {
        console.log(err);
      }
    );

    await Counter.updateOne(
      { key_name: EMPLOYEE_FOLDER },
      { value: employeeFolder },
      (err) => {
        console.log(err);
      }
    );

    await Counter.updateOne(
      { key_name: ORGANIZATION_FOLDER },
      { value: organizationFolder },
      (err) => {
        console.log(err);
      }
    );

    await Counter.updateOne(
      { key_name: TIME_OFF_TYPE },
      { value: timeOffTypeLength },
      (err) => {
        console.log(err);
      }
    );

    await Counter.updateOne(
      { key_name: TIME_OFF_POLICY },
      { value: timeOffPolicyLength },
      (err) => {
        console.log(err);
      }
    );
    await Counter.updateOne(
      { key_name: TEAM_INFO },
      { value: teamInfoLength },
      (err) => {
        console.log(err);
      }
    );
  } else {
    return "Database is not empty";
  }
};

// exporting all the methods
module.exports = {
  createUser,
  queryUsers,
  queryTotalUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  defaultTestData,
};
