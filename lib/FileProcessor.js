const fs = require('fs');
const path = require('path');
const async = require('async');

// Parsers
const jsonParser = require('./parsers/json');
const yamlParser = require('./parsers/yaml');
const jsParser = require('./parsers/javascript');

// used by ParseDir to process and parse individual files:
class FileProcessor {
  constructor(options) {
    this.data = [];
  }

  determineIfDirectory(meta) {
    return new Promise((resolve, reject) => {
      fs.lstat(meta.filepath, (err, stats) => {
        let error = null;
        if (err || !stats) {
          error = err || true;
        }
        if (!error) {
          return resolve(stats.isDirectory());
        }
        return reject(error);
      });
    });
  }

  getFileContents(meta, isDirectory) {
    return new Promise((resolve, reject) => {
      // Get the files raw contents
      if (isDirectory) {
        return resolve();
      }
      const onFileRead = (err, fileData) => {
        let error = null;
        if (err || !fileData) {
          error = err || true;
        }
        if (!error) {
          return resolve(fileData.toString());
        }
        reject(error);
      };
      fs.readFile(meta.filepath, onFileRead);
    });
  }

  parseFileContents(meta, fileContents) {
    return new Promise((resolve, reject) => {
      // Parse the file using the correct lib
      if (!fileContents) {
        return resolve();
      }
      meta.raw = fileContents;
      const handleResult = (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      };
      switch (meta.extension) {
        case '.json':
          jsonParser(meta, handleResult);
          break;
        case '.yml':
        case '.yaml':
          yamlParser(meta, handleResult);
          break;
        case '.coffee':
        case '.litcoffee':
        case '.ls':
        case '.livescript':
        case '.js':
          jsParser(meta, handleResult);
          break;
        default:
          return handleResult();
      }
    });
  }

  processFile(file) {
    return new Promise( async(resolve, reject) => {
      const meta = {
        relativePath: file,
        filepath: path.resolve(file),
        filename: path.basename(file),
        basename: path.basename(file, path.extname(file)),
        extension: path.extname(file),
        parsed: false
      };
      try {
        meta.isDirectory = await this.determineIfDirectory(meta);
        if (!meta.isDirectory) {
          meta.raw = await this.getFileContents(meta);
          meta.contents = await this.parseFileContents(meta, meta.raw);
        }
        if (meta.contents) {
          meta.parsed = true;
        } else {
          meta.parsed = false;
          meta.contents = meta.raw;
        }
        this.data.push(meta);
        resolve();
      } catch (e) {
        return reject(e);
      }
    });
  }
}

module.exports = FileProcessor;
