const fs = require('fs');
const httpStatus = require('http-status');
const path = require('path');
const ApiError = require('./ApiError');

const createNewFolder = async (folderName, rootFolder, parentId) => {
  let folderPath;
  if (rootFolder !== 'common') {
    folderPath = `../public/${rootFolder}/${parentId}`;
  } else {
    folderPath = `../public/${rootFolder}`;
  }
  if (!fs.existsSync(path.join(`${__dirname}`, `../public/${rootFolder}`)) || !fs.existsSync(path.join(`${__dirname}`, `../public/${rootFolder}/${parentId}`)) || !fs.existsSync(path.join(`${__dirname}`, `../public/${rootFolder}/${parentId}/${folderName}`))) {
    fs.mkdirSync(path.join(__dirname, `${folderPath}/${folderName}`), { recursive: true }, (err) => {
      if (err) {
        return {
          message: 'Something went wrong',
          code: httpStatus.INTERNAL_SERVER_ERROR,
        };
      }
    });
    return {
      message: 'Folder Created SuccessFully',
      code: httpStatus.OK,
    };
  }
  return {
    message: 'Folder Already Exists',
    code: httpStatus.CONFLICT,
  };
};
const renameFolder = async (oldName, newName, rootFolder, parentId) => {
  let folderPath;
  if (rootFolder !== 'common') {
    folderPath = `../public/${rootFolder}/${parentId}`;
  } else {
    folderPath = `../public/${rootFolder}`;
  }
  console.log(oldName, newName, rootFolder, parentId, !fs.existsSync(path.join(`${__dirname}`, `../public/${rootFolder}/${parentId}/${newName}`)));
  if (!fs.existsSync(path.join(`${__dirname}`, `${folderPath}/${newName}`))) {
    if (fs.existsSync(path.join(`${__dirname}`, `${folderPath}/${oldName}`))) {
      fs.rename(path.join(`${__dirname}`, `${folderPath}/${oldName}`), path.join(`${__dirname}`, `${folderPath}/${newName}`), (err) => {
        if (err) {
          throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'err');
        }
      });
      return {
        message: 'Folder Renamed SuccessFully',
        code: httpStatus.OK,
      };
    }
    return {
      message: 'Folder Does Not Exists',
      code: httpStatus.NOT_FOUND,
    };
  }
  console.log('confilict error');
  return {
    message: 'Already Exists',
    code: httpStatus.CONFLICT,
  };
};

const removeFolder = async (folderName, rootFolder, parentId) => {
  console.log(folderName, rootFolder, parentId, 'remove');
  let folderPath;
  if (rootFolder !== 'common') {
    folderPath = `../public/${rootFolder}/${parentId}`;
  } else {
    folderPath = `../public/${rootFolder}`;
  }
  let fileExist;
  try {
    fileExist = fs.existsSync(path.join(`${__dirname}`, `${folderPath}/${folderName}`));
  } catch (err) {
    return {
      message: 'Something went wrong',
      code: httpStatus.INTERNAL_SERVER_ERROR,
    };
  }
  if (fileExist) {
    const rmvFolder = fs.rmdir(path.join(`${__dirname}`, `${folderPath}/${folderName}`), (err) => {
      if (err) {
        return {
          message: 'Something went wrong',
          code: httpStatus.INTERNAL_SERVER_ERROR,
        };
      }
    });
    console.log(rmvFolder, 'in remove folder');
    return {
      message: 'Folder Deleted Successfully',
      code: httpStatus.OK,
    };
  }
  return {
    message: 'Folder Not Exists',
    code: httpStatus.NOT_FOUND,
  };
};

const moveFolder = async (src, dest, options, rootFolder, parentId) => {
  let fileExist;
  try {
    fileExist = fs.existsSync(path.join(`${__dirname}`, `../public/${rootFolder}/${parentId}/${src}`));
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'err');
  }
  if (fileExist) {
    fs.move(path.join(`${__dirname}`, `../public/${src}`), path.join(`${__dirname}`, `../public/${rootFolder}/${parentId}/${dest}`), options, (err) => {
      if (err) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'err');
      }
    });
    return 'Moved successfully!';
  }
  throw new ApiError(httpStatus.NOT_FOUND, "Folder doesn't exist");
};
module.exports = {
  createNewFolder,
  renameFolder,
  removeFolder,
  moveFolder,
};
