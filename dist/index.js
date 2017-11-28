'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadDataFile = undefined;

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

/**
 * Data file loader functions
 *
 * @module datafile
 */

/**
 * Load JSON/YAML datafile
 *
 * The data file can be either a JSON or a YAML format file.
 *
 * @arg {String} fileName     - The full path of the file to load.
 * @arg {Boolean} exitOnError - If true then exit with process errorCode: 1 in case of error otherwise does nothing. Default: `true`.
 *
 * @return {Object} - The data loaded as a JSON object.
 */
var loadDataFile = exports.loadDataFile = function loadDataFile(fileName) {
    var exitOnError = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var content = {};

    if (fileName) {
        try {
            content = _jsYaml2.default.safeLoad(_fs2.default.readFileSync(_path2.default.resolve(fileName)));
        } catch (err) {
            if (exitOnError) {
                console.log(err);
                process.exit(1);
            }
        }
    } else {
        if (exitOnError) {
            console.error('Error: script-file name is missing!');
            process.exit(1);
        }
    }
    return content;
};

/**
 * Merge data file
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
var mergeDataFile = function mergeDataFile(acc, dataFileName) {
    return _.extend({}, acc, loadDataFile(dataFileName));
};

/**
 * Load data
 *
 * Loads each data files, and merges them into one object.
 * The merging begins with an empty object, and the objects loaded from the data files extend this
 * initial object in order of listing in the array.
 *
 * @arg {Array} listOfDataFiles - The list of paths to the data files to be loaded
 *
 * @return {Object} - The resulted data object
 */
var loadData = function loadData(listOfDataFiles) {
    return _.reduce(listOfDataFiles, mergeDataFile, {});
};

module.exports = { loadDataFile: loadDataFile, loadData: loadData };