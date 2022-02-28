const configFile = require("../../configFile.json");

const environmentList = ["local", "development", "staging"];
const environment = environmentList[0];

const configuration = {
  local: {
    env: "local",
    port: 5030,
    backendUrl: "http://localhost:5030",
    frontEndUrl: "http://localhost:4000",
    mongoose: {
      url: "mongodb://localhost/local_staging_paradigm", // url to connect mongodb locally
      DbName: configFile.mongoose.DbName,
      options: {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
    },
    jwt: {
      secret: "local!@#",
      accessExpirationMinutes: 30,
      refreshExpirationDays: 30,
      candidateAccessExpirationDays: 10,
      candidateRefreshExpirationDays: 20,
      resetPasswordExpirationMinutes: 10,
    },
    email: {
      smtp: {
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: configFile.email.Email,
          pass: configFile.email.password,
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
      from: configFile.email.Email,
    },
  },
  development: {
    env: "development",
    port: 4030,
    backendUrl: "https://develop.staging.pacificmedicalgroup.org/api",
    frontEndUrl: "https://develop.staging.pacificmedicalgroup.org",
    mongoose: {
      url: `mongodb://localhost:1500/${configFile.mongoose.DevelopDbName}`, // url to connect mongodb staging
      DbName: configFile.mongoose.DevelopDbName,
      options: {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
    },
    jwt: {
      secret: "develop!@#",
      accessExpirationMinutes: 30,
      refreshExpirationDays: 30,
      candidateAccessExpirationDays: 10,
      candidateRefreshExpirationDays: 20,
      resetPasswordExpirationMinutes: 10,
    },
    email: {
      smtp: {
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: configFile.email.Email,
          pass: configFile.email.password,
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
      from: configFile.email.Email,
    },
  },
  staging: {
    env: "staging",
    port: 5030,
    backendUrl: "https://hrms.staging.pacificmedicalgroup.org/api",
    frontEndUrl: "https://hrms.staging.pacificmedicalgroup.org",
    mongoose: {
      url: `mongodb://localhost:1500/${configFile.mongoose.StagingDbName}`, // url to connect mongodb staging
      DbName: configFile.mongoose.StagingDbName,
      options: {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
    },
    jwt: {
      secret: "local!@#",
      accessExpirationMinutes: 30,
      refreshExpirationDays: 30,
      candidateAccessExpirationDays: 10,
      candidateRefreshExpirationDays: 20,
      resetPasswordExpirationMinutes: 10,
    },
    email: {
      smtp: {
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: configFile.email.Email,
          pass: configFile.email.password,
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
      from: configFile.email.Email,
    },
  },
};

module.exports = configuration[environment];
