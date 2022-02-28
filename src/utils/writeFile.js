const fs = require('fs');
const httpStatus = require('http-status');
const path = require('path');
const logger = require('../config/logger');
// const ApiError = require('./ApiError');

// Funtion to split base64 string from the prefix e.g. 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA';
const splitBase64 = (base64String) => base64String.split(';base64,').pop();
const extractExtension = async (base64String) => base64String.split(';base64,')[0].split('/')[1];

const createNewFile = async (folderName, base64String, name, extension, rootFolder, parentId) => {
  try {
    let folderPath;
    if (rootFolder !== 'common') {
      folderPath = `../public/${rootFolder}/${parentId}`;
    } else {
      folderPath = `../public/${rootFolder}`;
    }
    console.log(folderName, name, extension, rootFolder, parentId);
    const extractedString = splitBase64(base64String);
    // console.log(extractExtension(base64String), "file extension");
    if (!fs.existsSync(path.join(`${__dirname}`, `${folderPath}/${folderName}/${name}.${extension}`))) {
      fs.writeFile(path.join(`${__dirname}`, `${folderPath}/${folderName}/${name}.${extension}`), extractedString, { encoding: 'base64' }, () => {
        console.log('File created');
      });
      return {
        message: 'File created successfully',
        code: httpStatus.OK,
      };
    }
    return {
      message: 'File Already exists',
      code: httpStatus.CONFLICT,
    };
  } catch (err) {
    logger.error(err);
  }
};

const renameFile = async (oldName, newName, folderName, extension, rootFolder, parentId) => {
  console.log(oldName, newName, folderName, parentId, extension);
  try {
    let folderPath;
    if (rootFolder !== 'common') {
      folderPath = `../public/${rootFolder}/${parentId}`;
    } else {
      folderPath = `../public/${rootFolder}`;
    }
    if (fs.existsSync(path.join(`${__dirname}`, `${folderPath}/${folderName}`))) {
      try {
        fs.rename(path.join(`${__dirname}`, `${folderPath}/${folderName}/${oldName}`), path.join(`${__dirname}`, `../public/${rootFolder}/${parentId}/${folderName}/${newName}`), (err) => {
          if (err) {
            return {
              message: 'Internal Server Error',
              code: httpStatus.INTERNAL_SERVER_ERROR,
            };
          }
        });
        return {
          message: 'File Renamed Successfully',
          code: httpStatus.OK,
        };
      } catch (e) {
        logger.error(e);
      }
    }

    return {
      message: 'File Already exists',
      code: httpStatus.CONFLICT,
    };
  } catch (e) {
    logger.error(e);
  }
};

const removeFile = async (name, folderName, rootFolder, parentId) => {
  console.log(name, folderName, parentId, 'remvoe');
  try {
    let folderPath;
    if (rootFolder !== 'common') {
      folderPath = `../public/${rootFolder}/${parentId}`;
    } else {
      folderPath = `../public/${rootFolder}`;
    }
    if (fs.existsSync(path.join(`${__dirname}`, `${folderPath}/${folderName}/${name}`))) {
      fs.unlink(path.join(`${__dirname}`, `${folderPath}/${folderName}/${name}`), (err) => {
        if (err) {
          return {
            message: err,
            code: httpStatus.INTERNAL_SERVER_ERROR,
          };
        }
        console.log('file removed');
      });
      return {
        message: 'File Removed Successfully',
        code: httpStatus.OK,
      };
    }
    return {
      message: 'File Does Not Exist',
      code: httpStatus.NOT_FOUND,
    };
  } catch (e) {
    logger.error(e);
  }
};
module.exports = {
  createNewFile,
  splitBase64,
  extractExtension,
  renameFile,
  removeFile,
};
