'use strict'
import * as _ from 'lodash'
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

// const loadDataFile = dataFileName => require(path.resolve(dataFileName))
var loadDataFile = function(fileName) {
    if (fileName) {
        return yaml.safeLoad(fs.readFileSync(path.resolve(fileName)));
    } else {
        //console.error('Error: script-file name is missing!');
        process.exit(1);
    }
};

const mergeDataFile = (acc, dataFileName) => _.extend({}, acc, loadDataFile(dataFileName))
export const loadData = listOfDataFiles => _.reduce(listOfDataFiles, mergeDataFile, {})

