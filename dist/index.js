'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mergeTextFilesByFileNameSync = exports.mergeJsonFilesByFileNameSync = exports.mergeJsonFilesByKeySync = exports.findFilesSync = exports.listFilesSync = exports.loadData = exports.mergeJsonFilesSync = exports.loadJsonFileSync = exports.saveTextFileSync = exports.loadTextFileSync = undefined;

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Data file handler functions.
 *
 * @module datafile
 */

/**
 * Load text content from a file
 *
 * @arg {String} fileName - The full path of the input file
 * @arg {Boolean} raiseErrors - If true then exit with process errorCode: 1 in case of error otherwise does nothing. Default: `true`.
 *
 * @return {String} - The loaded content
 * @function
 */
var loadTextFileSync = exports.loadTextFileSync = function loadTextFileSync(fileName) {
    var raiseErrors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var content = null;

    try {
        content = _fs2.default.readFileSync(_path2.default.resolve(fileName), { encoding: 'utf8' });
    } catch (err) {
        if (raiseErrors) {
            throw err;
        }
    }
    return content;
};

/**
 * Save content into a text file
 *
 * @arg {String} fileName - The full path of the output file
 * @arg {String} content - The content to save
 * @arg {Boolean} raiseErrors - If true then exit with process errorCode: 1 in case of error otherwise does nothing. Default: `true`.
 *
 * @function
 */
var saveTextFileSync = exports.saveTextFileSync = function saveTextFileSync(fileName, content) {
    var raiseErrors = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;


    try {
        _fs2.default.writeFileSync(_path2.default.resolve(fileName), content, { encoding: 'utf8' });
    } catch (err) {
        if (raiseErrors) {
            throw err;
        }
    }
};

/**
 * Load JSON/YAML datafile
 *
 * The data file can be either a JSON or a YAML format file.
 *
 * @arg {String} fileName     - The full path of the file to load.
 * @arg {Boolean} raiseErrors - If true then exit with process errorCode: 1 in case of error otherwise does nothing. Default: `true`.
 *
 * @return {Object} - The data loaded as a JSON object.
 * @function
 */
var loadJsonFileSync = exports.loadJsonFileSync = function loadJsonFileSync(fileName) {
    var raiseErrors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var content = {};

    if (fileName) {
        try {
            content = _jsYaml2.default.safeLoad(_fs2.default.readFileSync(_path2.default.resolve(fileName), { encoding: 'utf8' }));
        } catch (err) {
            if (raiseErrors) {
                throw err;
            }
        }
    } else {
        if (raiseErrors) {
            throw new Error('File name is missing!');
        }
    }
    return content;
};

/**
 * Load and merge one data file into the accumulator object.
 *
 * Get an accumulator object, then load the data from the file identified by the `dataFileName` argument,
 * then extend the accumulator object with the loaded data.
 *
 * Note: The function returns with a new object, and the original object will not be modified.
 *
 * @arg {Object} acc - The original object, to extend with the data to be loaded
 * @arg {String} dataFileName - The name of the data file to be loaded
 *
 * @return {Object} - The result object of merging
 */
var mergeJsonFileSync = function mergeJsonFileSync(acc, dataFileName) {
    return _.merge({}, acc, loadJsonFileSync(dataFileName));
};

/**
 * Load the listed data files and merge them into a single object.
 *
 * Loads each data files, and merges them into one object.
 * The merging begins with an empty object, and the objects loaded from the data files extend this
 * initial object in order of listing in the array.
 *
 * @arg {Array} listOfJsonFiles - The list of paths to the data files to be loaded
 *
 * @return {Object} - The resulted data object
 * @function
 */
var mergeJsonFilesSync = exports.mergeJsonFilesSync = function mergeJsonFilesSync(listOfJsonFiles) {
    return _.reduce(listOfJsonFiles, mergeJsonFileSync, {});
};

/**
 * Load the listed data files and merge them into a single object.
 *
 * It is an alias of the mergeFiles function.
 *
 * @deprecated
 * @function
 */
var loadData = exports.loadData = function loadData(listOfJsonFiles) {
    return mergeJsonFilesSync(listOfJsonFiles);
};

/**
 * List files of a directory recursively or top level only
 *
 * Recursively lists the files under the `baseDir` directory.
 * Skips directory names from the result list. Only files will be listed.
 *
 * @arg {String} baseDir  - The path to the base directory to start searching.
 * @arg {Boolean} recurse - `true` tells to recursively list the subdirectories as well.
 * `false` means, only the `baseDir` content will be listed. Default: `true`.
 *
 * @return {Array} - The list of file paths found.
 *
 * @function
 */
var listFilesSync = exports.listFilesSync = function listFilesSync(baseDir) {
    var recurse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    if (_fs2.default.statSync(baseDir).isDirectory()) {
        return _.flatMap(_fs2.default.readdirSync(baseDir), function (f) {
            return recurse ? listFilesSync(_path2.default.join(baseDir, f), recurse) : _fs2.default.statSync(_path2.default.join(baseDir, f)).isDirectory() ? [] : f;
        });
    } else {
        return baseDir;
    }
};

/**
 * Find files by name pattern.
 *
 * Recursively finds the files under the `baseDir` directory, that have name which matches the `pattern`.
 * @arg {String} baseDir - The path to the base directory to start searching.
 * @arg {RegExp} pattern - The regular expression pattern to match the filenames.
 *
 * @return {Array} - The list of file paths found
 *
 * @function
 */
var findFilesSync = exports.findFilesSync = function findFilesSync(baseDir, pattern) {
    var recurse = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    return _.filter(listFilesSync(baseDir, recurse), function (name, index, dir) {
        return _.isArray(_.last(name.split('/')).match(pattern));
    });
};

/**
 * Creates a function that merge a single file into an accumulator object, using a unique value as a key.
 * @arg {String} keyProp - The name of the property that's value will be used as a key
 * to add the loaded data to the accumator to merge.
 *
 * @return {Function}    - The merge function with the following signature:
 * function(acc: Object, dataFileName : String), where the `dataFileName` is the path to the data file
 * to merge, and the `acc` the accumulator object, to merge the data into.
 *
 * @function
 */
var mergeJsonFileByKeySync = function mergeJsonFileByKeySync(keyProp) {
    return function (acc, dataFileName) {
        var data = loadJsonFileSync(dataFileName);
        if (_.has(data, keyProp)) {
            var key = data[keyProp];
            return _.merge({}, acc, _defineProperty({}, key, data));
        } else {
            return acc;
        }
    };
};

/**
 * Load objects from files and merge them into one object using one of their properties as a key.
 *
 * Loads each data files, and merges them into one object.
 *
 * The merging begins with an empty object, and the objects loaded from the data files extend this
 * initial object in the order they were listed in the array.
 *
 * Each object is added to the result as a property. The name of the property is determined by the
 * object to merge. The `keyProp` parameter identifies the property in this object to merge that value
 * that will be used as a property name in the new object. This value should be unique among the objects
 * to merge.
 *
 * For example each file to merge contains a document of a bigger collection, and has an `id` field,
 * which holds an `uuid` unique ID value of the document. The `keyProp` should be `"id"`, and the result
 * of merging will be an object, which has as many properties as the number of merged files,
 * and each property holds the complete loaded object, and the name of the property is the `uuid` value.
 *
 * @arg {Array} listOfJsonFiles - The list of paths to the data files to be loaded
 * @arg {String} keyProp        - The name of the property that's value is used as a key
 *
 * @return {Object} - The resulted data object
 * @function
 */
var mergeJsonFilesByKeySync = exports.mergeJsonFilesByKeySync = function mergeJsonFilesByKeySync(listOfJsonFiles, keyProp) {
    var acc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return _.reduce(listOfJsonFiles, mergeJsonFileByKeySync(keyProp), acc);
};

var mergeJsonFileByFileNameSync = function mergeJsonFileByFileNameSync(acc, dataFileName) {
    acc[dataFileName] = loadJsonFileSync(dataFileName);
    return acc;
};

var mergeJsonFilesByFileNameSync = exports.mergeJsonFilesByFileNameSync = function mergeJsonFilesByFileNameSync(listOfJsonFiles) {
    var acc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return _.reduce(listOfJsonFiles, mergeJsonFileByFileNameSync, acc);
};

var mergeTextFileByFileNameSync = function mergeTextFileByFileNameSync(acc, dataFileName) {
    acc[dataFileName] = loadTextFileSync(dataFileName);
    return acc;
};

var mergeTextFilesByFileNameSync = exports.mergeTextFilesByFileNameSync = function mergeTextFilesByFileNameSync(listOfTextFiles) {
    var acc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return _.reduce(listOfTextFiles, mergeTextFileByFileNameSync, acc);
};