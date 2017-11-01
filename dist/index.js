'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadData = undefined;

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

// const loadDataFile = dataFileName => require(path.resolve(dataFileName))
var loadDataFile = function loadDataFile(fileName) {
    if (fileName) {
        return _jsYaml2.default.safeLoad(_fs2.default.readFileSync(_path2.default.resolve(fileName)));
    } else {
        //console.error('Error: script-file name is missing!');
        process.exit(1);
    }
};

var mergeDataFile = function mergeDataFile(acc, dataFileName) {
    return _.extend({}, acc, loadDataFile(dataFileName));
};
var loadData = exports.loadData = function loadData(listOfDataFiles) {
    return _.reduce(listOfDataFiles, mergeDataFile, {});
};