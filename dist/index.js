'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.validate = exports.loadSchema = exports.mergeTextFilesByFileNameSync = exports.mergeJsonFilesByFileNameSync = exports.mergeJsonFilesByKeySync = exports.findFilesSync = exports.listFilesSync = exports.loadData = exports.mergeJsonFilesSync = exports.loadJsonWithRefs = exports.loadJsonFileSync = exports.stringifyToCsv = exports.saveCsvFileSync = exports.loadCsvFileSync = exports.stringifyToYaml = exports.saveYamlFileSync = exports.saveTextFileSync = exports.loadTextFileSync = undefined;

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _sync = require('csv-parse/sync');

var _sync2 = require('csv-stringify/sync');

var _schemas = require('./schemas/');

var schemas = _interopRequireWildcard(_schemas);

var _jsonRefs = require('json-refs');

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
 * @return {String} - The loaded content. If the file does not exists and `raiseErrors` is `false`, then returns with `null`.
 *
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
 * Save content into a YAML format file
 *
 * @arg {String} fileName - The full path of the output file
 * @arg {String} content - The content to dump in YAML format
 * @arg {Object} options - The options of the `yaml.dump()` function. See the docs of [js-yaml](https://www.npmjs.com/package/js-yaml) package.
 * @arg {Boolean} raiseErrors - If true then exit with process errorCode: 1 in case of error otherwise does nothing. Default: `true`.
 *
 * @function
 */
var saveYamlFileSync = exports.saveYamlFileSync = function saveYamlFileSync(fileName, content, options) {
    var raiseErrors = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    return saveTextFileSync(fileName, _jsYaml2.default.dump(content), raiseErrors);
};

/**
 * Dump an object into a YAML format string
 *
 * It is an alias to the `yaml.dump()` function of the [js-yaml](https://www.npmjs.com/package/js-yaml) package.
 *
 * @function
 */
var stringifyToYaml = exports.stringifyToYaml = _jsYaml2.default.dump;

/**
 * Load records from a CSV format file
 *
 * @arg {String} fileName - The full path of the input file
 * @arg {Object} options - The options of the `yaml.dump()` function. See the docs of [js-yaml](https://www.npmjs.com/package/js-yaml) package.
 * @arg {Boolean} raiseErrors - If true then exit with process errorCode: 1 in case of error otherwise does nothing. Default: `true`.
 *
 * @function
 */
var loadCsvFileSync = exports.loadCsvFileSync = function loadCsvFileSync(dataPath, options) {
    var raiseErrors = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    return (0, _sync.parse)(loadTextFileSync(dataPath, raiseErrors), options);
};

/**
 * Save content into a CSV format file
 *
 * @arg {String} fileName - The full path of the output file
 * @arg {String} content - The content to dump in CSV format
 * @arg {Object} options - The options of the `stringify()` function. See the docs of [csv-stringify](https://csv.js.org/stringify/api/) package.
 * @arg {Boolean} raiseErrors - If true then exit with process errorCode: 1 in case of error otherwise does nothing. Default: `true`.
 *
 * @function
 */
var saveCsvFileSync = exports.saveCsvFileSync = function saveCsvFileSync(fileName, content, options) {
    var raiseErrors = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    return saveTextFileSync(fileName, (0, _sync2.stringify)(content, options), raiseErrors);
};

/**
 * Dump an object into a CSV format string
 *
 * It is an alias of the `stringify()` function of the [csv-stringify](https://csv.js.org/stringify/api/) package.
 *
 * @function
 */
var stringifyToCsv = exports.stringifyToCsv = _sync2.stringify;

/**
 * Load JSON/YAML datafile
 *
 * The data file can be either a JSON or a YAML format file.
 *
 * @arg {String} fileName     - The full path of the file to load.
 * @arg {Boolean} raiseErrors - If true then exit with process errorCode: 1 in case of error otherwise does nothing. Default: `true`.
 *
 * @return {Object} - The data loaded as a JSON object. If the file does not exists and `raiseErrors` is `false`, then returns with an empty object: `{}`.
 *
 * @function
 */
var loadJsonFileSync = exports.loadJsonFileSync = function loadJsonFileSync(fileName) {
    var raiseErrors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var content = {};

    if (fileName) {
        try {
            content = _jsYaml2.default.load(_fs2.default.readFileSync(_path2.default.resolve(fileName) /*, { encoding: 'utf8' }*/));
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
 * Asynchronous load of JSON/YAML datafile with references
 *
 * The data file can be either a JSON or a YAML format file, references are loaded and resolved too.
 *
 * @arg {String} fileName     - The full path of the file to load.
 * @arg {Boolean} raiseErrors - If true then exit with process errorCode: 1 in case of error otherwise does nothing. Default: `true`.
 *
 * @return {Object} - A Promise that resolves to an object with two properties: `{ refs, resolved}`. The `resolved` holds the data loaded as a JSON object, and the `refs` that holds the references.
 *
 * @function
 */
var loadJsonWithRefs = exports.loadJsonWithRefs = function loadJsonWithRefs(fileName) {
    var location = _path2.default.resolve(fileName);
    var root = loadJsonFileSync(location, true);

    return (0, _jsonRefs.resolveRefs)(root, {
        location: location,
        filter: ['relative', 'remote'],
        loaderOptions: {
            processContent: function processContent(res, callback) {
                callback(null, _jsYaml2.default.load(res.text));
            }
        }
    }).then(function (results) {
        return Promise.resolve(results);
    });
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
 *
 * @function
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
 *
 * @example
 *  // earth.yml:
 *  planets:
 *      Earth:
 *          moons:
 *              Moon: {}
 *
 *  // moons.yml:
 *  planets:
 *      Earth:
 *          numOfMoons: 1
 *
 *  mergeJsonFilesSync([
 *      'src/fixtures/merge/earth.yml',
 *      'src/fixtures/merge/moons.yml'
 *  ]
 *
 *  // =>
 *  planets:
 *      Earth:
 *          numOfMoons: 1
 *          moons:
 *              Moon: {}
 *
 * @function
 */
var mergeJsonFilesSync = exports.mergeJsonFilesSync = function mergeJsonFilesSync(listOfJsonFiles) {
    return _.reduce(listOfJsonFiles, mergeJsonFileSync, {});
};

/**
 * Load the listed data files and merge them into a single object.
 *
 * It is an alias of the __{@link mergeJsonFilesSync}__ function.
 *
 * @see {@link mergeJsonFilesSync}
 * @deprecated
 *
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
 * @arg {Boolean} recurse - Find files in subdirectories as well if `true`. Default: `true`.
 * @arg {Booleand} splitBaseDir - If `true`, removes the `baseDir` from the paths of the files found,
 * if `false` then returns with the full path. Default: 'false'.
 *
 * @return {Array} - The list of file paths found
 *
 * @function
 */
var findFilesSync = exports.findFilesSync = function findFilesSync(baseDir, pattern) {
    var recurse = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var splitBaseDir = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    return _.map(_.filter(listFilesSync(baseDir, recurse), function (name, index, dir) {
        return _.isArray(_.last(name.split('/')).match(pattern));
    }), function (fullPath) {
        return splitBaseDir ? fullPath.slice(baseDir.length) : fullPath;
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
 *
 * @function
 */
var mergeJsonFilesByKeySync = exports.mergeJsonFilesByKeySync = function mergeJsonFilesByKeySync(listOfJsonFiles, keyProp) {
    var acc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return _.reduce(listOfJsonFiles, mergeJsonFileByKeySync(keyProp), acc);
};

/**
 * Load and add one JSON data file into an accumulator object, as a property named as the filename.
 *
 * The original `acc` accumulator object will not be modified, but a new copy will be returned,
 * which is extended with the new property that holds the loaded text.
 *
 * @arg {Object} acc          - The accumulator object to merge with.
 * @arg {String} textFileName - The name of the text file to load.
 *
 * @return {Object} - The new accumulator object, including the loaded text.
 *
 * @function
 */
var mergeJsonFileByFileNameSync = function mergeJsonFileByFileNameSync(acc, dataFileName) {
    acc[dataFileName] = loadJsonFileSync(dataFileName);
    return acc;
};

/**
 * Load objects from files and merge them into one object using the file names as property names.
 *
 * Loads each data files, and merges them into one object.
 *
 * The merging begins with a copy of the `acc` accumulator object,
 * and the objects loaded from the data files extend this
 * initial object in the order they were listed in the array.
 *
 * The original `acc` accumulator object will not be modified, but a new copy will be returned,
 * which is extended with the new property that holds the loaded text.
 *
 * Each object is added to the result as a property. The name of the property will be the name of the
 * data file to be merged.
 *
 * @arg {Array} listOfJsonFiles - The list of paths to the data files to be loaded
 * @arg {String} acc            - The initial accumulator object to merge with
 *
 * @return {Object} - The resulted data object
 *
 * @function
 */
var mergeJsonFilesByFileNameSync = exports.mergeJsonFilesByFileNameSync = function mergeJsonFilesByFileNameSync(listOfJsonFiles) {
    var acc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return _.reduce(listOfJsonFiles, mergeJsonFileByFileNameSync, acc);
};

/**
 * Load and add one text file into an accumulator object, as a property named as the filename.
 *
 * The original `acc` accumulator object will not be modified, but a new copy will be returned,
 * which is extended with the new property that holds the loaded text.
 *
 * @arg {Object} acc - The accumulator object to merge with.
 * @arg {String} textFileName - The name of the text file to load.
 *
 * @return {Object} - The new accumulator object, including the loaded text.
 *
 * @function
 */
var mergeTextFileByFileNameSync = function mergeTextFileByFileNameSync(acc, textFileName) {
    acc[textFileName] = loadTextFileSync(textFileName);
    return acc;
};

/**
 * Load plain textual content from files, and build up an object which holds the accumulated contents
 * as properties of the object, using the filename as the property name.
 *
 * @arg {Array} listOfTextFiles - The list of paths to the data files to be loaded
 * @arg {Object} acc            - The initial content of the accumulator object. Default: `{}`.
 *
 * @return {Object} - The resulted data object
 *
 * @function
 */
var mergeTextFilesByFileNameSync = exports.mergeTextFilesByFileNameSync = function mergeTextFilesByFileNameSync(listOfTextFiles) {
    var acc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return _.reduce(listOfTextFiles, mergeTextFileByFileNameSync, acc);
};

var loadSchema = exports.loadSchema = schemas.loadSchema;
var validate = exports.validate = schemas.validate;