'use strict'
import * as _ from 'lodash'
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

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
 * @function
 */
export const loadDataFile = function(fileName, exitOnError=true) {
	let content = {}

    if (fileName) {
        try {
            content = yaml.safeLoad(fs.readFileSync(path.resolve(fileName)));
        } catch (err) {
            if (exitOnError) {
                console.log(err)
                process.exit(1)
            }
        }
    } else {
        if (exitOnError) {
            console.error('Error: script-file name is missing!');
            process.exit(1)
        }
    }
    return content
}

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
const mergeDataFile = (acc, dataFileName) => _.merge({}, acc, loadDataFile(dataFileName))

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
 * @function
 */
export const loadData = (listOfDataFiles) => _.reduce(listOfDataFiles, mergeDataFile, {})
