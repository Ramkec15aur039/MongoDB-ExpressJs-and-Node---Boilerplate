const pdf = require("pdf-creator-node");
const path = require("path");
const {
  OnboardingStatus,
  Signature,
  Tasks,
  EmployeeFolder,
  EmployeeFiles,
} = require("../models");
const executedDocumentService = require("../services/executedDocument.service");
const employeeFileService = require("../services/employeeDocument/employeeFile.service");
const { EMPLOYEE_FILE } = require("../config/constants");
const { counter } = require("../services");
/* ****************** package Import ****************************************************** */

/** ***************** ApiError Import ***************************************************** */

/** ***************** Counter services Import ********************************************* */

// const splitUTCFormat = (string) => {
//     const array = string.split(" ");
//     const result = `${array[0]}  ${array[1]}  ${array[2]}  ${array[3]}`;
//     return result;
//   }

const replaceAll = async (str, mapObj) => {
  const re = new RegExp(Object.keys(mapObj).join("|"), "gi");
  console.log(re);
  return str.replace(re, (matched) => mapObj[matched.toLowerCase()]);
};

const getContractLetterUtils = async (filter) => {
  console.log(filter, "filter");
  const defaultSignatureCanvas =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAABkCAYAAAA8AQ3AAAAAAXNSR0IArs4c6QAAAvRJREFUeF7t1AEJAAAMAsHZv/RyPNwSyDncOQIECEQEFskpJgECBM5geQICBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECDxmQABlNwQbOQAAAABJRU5ErkJggg==";
  const candidateSignature = await Signature.findOne({
    userId: filter.candidateId,
    isCandidate: true,
  });
  const assignedPerson = await Tasks.findOne({
    candidateId: filter.candidateId,
    category: "onboarding",
    taskType: "contract",
  });
  const managerSignature = await Signature.findOne({
    userId: assignedPerson.assignTo,
    isCandidate: false,
  });
  console.log(candidateSignature, managerSignature, "candi", "manager");
  const contract = await OnboardingStatus.find({
    candidateId: filter.candidateId,
  })
    .populate([
      {
        path: "candidateId",
        model: "candidate",
        populate: [
          {
            path: "contactPersonName",
            model: "users",
          },
          {
            path: "orgId",
            model: "organizations",
          },
        ],
      },
      {
        path: "contract",
        model: "templates",
      },
    ])
    .then(async (doc) => {
      console.log(doc, "docss....");
      if (doc.length) {
        const html = doc[0].contract.content.toString();
        const mapObj = {
          "{{date}}": html && new Date(doc[0].createdAt).getUTCDate(),
          "{{month}}": `month ${
            html && new Date(doc[0].createdAt).getUTCMonth() + 1
          }`,
          "{{year}}": html && new Date(doc[0].createdAt).getUTCFullYear(),
          "{{companyname}}": html && doc[0].candidateId.orgId.organizationName,
          "{{employeename}}":
            html &&
            `${doc[0].candidateId.firstName} ${doc[0].candidateId.lastName}`,
          "{{city}}": html && doc[0].candidateId.homeAddress.city,
          "{{state}}": html && doc[0].candidateId.homeAddress.state,
          "{{district}}": html && "Abiline",
          "{{salary}}": html && doc[0].candidateId.baseSalaryAmount,
          "{{perhour/perannum}}": html && "per month",
          "{{jobtitle}}": `${
            doc?.[0]?.candidateId?.clinicalRole?.[0]?.clinicalTitle ||
            doc?.[0]?.candidateId?.administrativeRole?.[0]?.adminTitle
          }`,
          "{{candidatesrc}}": `${candidateSignature?.signature}`,
          "{{managersrc}}": `${managerSignature?.signature}`,
          "{{employeesignaturedate}}": `${candidateSignature?.createdAt.toLocaleString(
            "en-US",
            {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }
          )}`,
          "{{companysignaturedate}}": `${managerSignature?.createdAt.toLocaleString(
            "en-US",
            {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }
          )}`,
        };
        // const html = doc[0].contract.content.toString();
        const replaced = await replaceAll(html, mapObj);
        const options = {
          format: "A3",
          orientation: "portrait",
          border: "10mm",
        };

        // const candidates = [OnboardingStatus.find({})];
        const document = {
          html: replaced,
          data: {
            candidates: [],
          },
          path: path.join(
            `${__dirname}`,
            `../public/common/signedDocument/userContract${filter.userId}.pdf`
          ),
          type: "",
        };
        console.log(document, "document");
        await pdf
          .create(document, options)
          .then((data) => data)
          .catch((error) => {
            console.error(error);
          });
        const fileName = `userContract${filter.userId}.pdf`;
        await executedDocumentService
          .createDocument({
            category: "signedDocument",
            fileName,
            userId: filter.userId,
          })
          .then(async (res) => {
            console.log(doc[0]?.candidateId?.orgId?._id, "docfjsldkj");
            const empFolder = await EmployeeFolder.findOne({
              orgId: doc[0].candidateId?.orgId?._id,
              name: "signedDocument",
              isCommon: true,
            });
            const id = await counter.getCount(EMPLOYEE_FILE);
            await EmployeeFiles.create({
              _id: id.toString(),
              orgId: doc[0]?.candidateId?.orgId?._id,
              userId: filter.userId,
              fileName,
              empFolderId: empFolder._id,
            }).then((succes) => console.log("success", succes));
          });
        return fileName;
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
  // let pdfFileLocation = fs.createReadStream(offerLetter.filename);
  //  pdfFileLocation.pipe(res);
  if (contract) {
    return `common/signedDocument/${contract}`;
  }
};

module.exports = getContractLetterUtils;
