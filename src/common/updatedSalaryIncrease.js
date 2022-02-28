const { logger } = require("handlebars");
const { User } = require("../models");

module.exports.updateSalaryIncreaseAction = async ({
  orgId,
  salaryIncreaseInterval,
  existing,
}) => {
  await User.find({ orgId, isDeleted: false })
    .then((res) =>
      res.forEach(async (docs) => {
        try {
          if (docs.hireDate && (!docs.nextSalaryIncreaseDate || existing)) {
            if (!existing) {
              const hireDate = new Date(docs.hireDate);
              const salaryIncreaseDate = hireDate.setFullYear(
                hireDate.getFullYear() + parseInt(salaryIncreaseInterval, 10)
              );
              const oneDayLess = new Date(salaryIncreaseDate).setDate(
                new Date(salaryIncreaseDate).getDate() - 1
              );
              await User.updateOne(
                { _id: docs._id },
                { nextSalaryIncreaseDate: oneDayLess }
              );
              // console.log(hireDate, new Date(salaryIncreaseDate),oneDayLess, "hired")
            } else {
              const nextSalaryIncreaseDate = new Date(
                docs.nextSalaryIncreaseDate
              );
              const salaryIncreaseDate = nextSalaryIncreaseDate.setFullYear(
                nextSalaryIncreaseDate.getFullYear() +
                  parseInt(salaryIncreaseInterval, 10)
              );
              await User.updateOne(
                { _id: docs._id },
                { nextSalaryIncreaseDate: salaryIncreaseDate }
              );
              // console.log(hireDate, new Date(salaryIncreaseDate),oneDayLess, "hired")
            }
          }
        } catch (error) {
          console.log(error, "eror");
        }
      })
    )
    .catch((err) => logger.error(err));
};
