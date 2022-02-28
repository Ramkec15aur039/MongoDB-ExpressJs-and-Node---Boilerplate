/** ***************** package Import ******************************************************** */

const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

/** ***************** toJson and paginate from plugins folder ******************************************************** */

const { toJSON, paginate } = require("./plugins");

/** ***************** roles from config/roles  ******************************************************** */

/*
  userSchema  - It is the schema for our user module
*/

const userSchema = mongoose.Schema(
  {
    _id: {
      type: String,
    },
    orgId: {
      type: String,
    },
    organizationAccessIds: [
      {
        type: String,
        ref: "organizations",
      },
    ],
    personalEmail: {
      type: String,
      trim: true,
      lowercase: true,
      validate(value) {
        if (value === "") return true;
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    workEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (value === "") return true;
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    password: {
      type: String,
      // required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            "Password must contain at least one letter and one number"
          );
        }
      },
      private: true, // used by the toJSON plugin
    },
    isPasswordChanged: {
      type: Boolean,
      default: false,
    },
    profileImage: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      // enum: ['user', 'admin', 'hr', 'manager', 'timeKeeper'],
      default: "user",
    },
    firstName: {
      type: String,
      trim: true,
    },
    middleName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    preferredName: {
      type: String,
      trim: true,
    },
    clinicalTitle: {
      type: String,
      enum: ["MD", "DO", "NP", "PA"],
    },
    adminTitle: {
      type: String,
    },
    dob: {
      type: Date,
      // required: true,
    },
    payrollId: {
      type: String,
      trim: true,
    },
    employmentStatus: {
      type: String,
      enum: ["active", "inActive"],
      trim: true,
    },
    hireDate: {
      type: Date,
    },
    nextSalaryIncreaseDate: {
      type: Date,
    },
    terminationDate: {
      type: Date,
    },
    mobileNumber: {
      type: String,
      // required: true,
      trim: true,
    },
    telmediqNumber: {
      type: String,
      // required: true,
      trim: true,
    },
    preferredPhone: {
      type: String,
      trim: true,
    },
    homeAddress: {
      address1: String,
      address2: String,
      city: String,
      state: String,
      zipCode: String,
    },
    locationId: {
      type: String,
      trim: true,
    },
    pager: {
      type: String,
      trim: true,
    },
    officePhone: {
      type: String,
      trim: true,
    },
    lastVisitedRoute: {
      type: Object,
    },
    lastOrganization: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: String,
      trim: true,
    },

    updatedBy: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    _id: false,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

// userSchema.vir
/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({
    workEmail: email,
    isDeleted: false,
    _id: { $ne: excludeUserId },
  });

  return !!user;
};
/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

/**
 * @typedef User
 */
const User = mongoose.model("users", userSchema);

module.exports = User;
