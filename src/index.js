'use strict'
import * as _ from 'lodash'
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

/**
 * Data file handler functions.
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
export const loadDataFileSync = function(fileName, raiseErrors=true) {
	let content = {}

    if (fileName) {
        try {
            content = yaml.safeLoad(fs.readFileSync(path.resolve(fileName), { encoding: 'utf8' }));
        } catch (err) {
            if (raiseErrors) {
                throw(err)
            }
        }
    } else {
        if (raiseErrors) {
            throw(new Error('File name is missing!'))
        }
    }
    return content
}

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
const mergeDataFileSync = (acc, dataFileName) => _.merge({}, acc, loadDataFileSync(dataFileName))

/**
 * Load the listed data files and merge them into a single object.
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
export const mergeDataFilesSync = listOfDataFiles => _.reduce(listOfDataFiles, mergeDataFileSync, {})

/**
 * Load the listed data files and merge them into a single object.
 *
 * It is an alias of the mergeFiles function.
 *
 * @deprecated
 * @function
 */
export const loadData = listOfDataFiles => mergeDataFilesSync(listOfDataFiles)

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
export const listFilesSync = (baseDir, recurse=true) => {
    if (fs.statSync(baseDir).isDirectory()) {
        return _.flatMap(fs.readdirSync(baseDir),
            f => recurse ?
                listFilesSync(path.join(baseDir, f), recurse) :
                fs.statSync(path.join(baseDir, f)).isDirectory() ? [] : f)
    } else {
        return baseDir
    }
}

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
export const findFilesSync = (baseDir, pattern, recurse=true) => _.filter(listFilesSync(baseDir, recurse), (name, index, dir) => {
    return _.isArray(_.last(name.split('/')).match(pattern))
})

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
const mergeDataFileByKeySync = keyProp => (acc, dataFileName) => {
    const data = loadDataFileSync(dataFileName)
    if (_.has(data, keyProp)) {
        const key = data[keyProp]
        return _.merge({}, acc, { [key]: data })
    } else {
        return acc
    }
}

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
 * For example the each file to merge contains a document of a bigger collection, and has an `id` field,
 * which holds an `uuid` unique ID value of the document. The `keyProp` should be `"id"`, and the result
 * of merging will be an object, which has as many properties as the number of merged files,
 * and each property holds the complete loaded object, and the name of the property is the `uuid` value.
 *
 * @arg {Array} listOfDataFiles - The list of paths to the data files to be loaded
 * @arg {String} keyProp        - The name of the property that's value is used as a key
 *
 * @return {Object} - The resulted data object
 * @function
 */
export const mergeDataFilesByKeySync = (listOfDataFiles, keyProp, acc={}) =>
    _.reduce(listOfDataFiles, mergeDataFileByKeySync(keyProp), acc)
