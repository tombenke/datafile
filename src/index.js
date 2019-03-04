'use strict'
import * as _ from 'lodash'
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import * as schemas from './schemas/'
import { resolveRefs } from 'json-refs'

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
export const loadTextFileSync = function(fileName, raiseErrors = true) {
    let content = null

    try {
        content = fs.readFileSync(path.resolve(fileName), { encoding: 'utf8' })
    } catch (err) {
        if (raiseErrors) {
            throw err
        }
    }
    return content
}

/**
 * Save content into a text file
 *
 * @arg {String} fileName - The full path of the output file
 * @arg {String} content - The content to save
 * @arg {Boolean} raiseErrors - If true then exit with process errorCode: 1 in case of error otherwise does nothing. Default: `true`.
 *
 * @function
 */
export const saveTextFileSync = function(fileName, content, raiseErrors = true) {
    try {
        fs.writeFileSync(path.resolve(fileName), content, { encoding: 'utf8' })
    } catch (err) {
        if (raiseErrors) {
            throw err
        }
    }
}

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
export const loadJsonFileSync = (fileName, raiseErrors = true) => {
    let content = {}

    if (fileName) {
        try {
            content = yaml.safeLoad(fs.readFileSync(path.resolve(fileName), { encoding: 'utf8' }))
        } catch (err) {
            if (raiseErrors) {
                throw err
            }
        }
    } else {
        if (raiseErrors) {
            throw new Error('File name is missing!')
        }
    }
    return content
}

/**
 * Load JSON/YAML datafile with references
 *
 * The data file can be either a JSON or a YAML format file, references are loaded and resolved too.
 *
 * @arg {String} fileName     - The full path of the file to load.
 * @arg {Boolean} raiseErrors - If true then exit with process errorCode: 1 in case of error otherwise does nothing. Default: `true`.
 *
 * @return {Object} - An object with two properties: `{ refs, resolved}`. The `resolved` holds the data loaded as a JSON object, and the `refs` that holds the references.
 *
 * @function
 */
export const loadJsonWithRefs = fileName => {
    const location = path.resolve(fileName)
    const root = loadJsonFileSync(location, true)

    return resolveRefs(root, {
        location: location,
        filter: ['relative', 'remote'],
        loaderOptions: {
            processContent: (res, callback) => {
                callback(null, yaml.safeLoad(res.text))
            }
        }
    }).then(results => {
        return Promise.resolve(results)
    })
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
 *
 * @function
 */
const mergeJsonFileSync = (acc, dataFileName) => _.merge({}, acc, loadJsonFileSync(dataFileName))

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
export const mergeJsonFilesSync = listOfJsonFiles => _.reduce(listOfJsonFiles, mergeJsonFileSync, {})

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
export const loadData = listOfJsonFiles => mergeJsonFilesSync(listOfJsonFiles)

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
export const listFilesSync = (baseDir, recurse = true) => {
    if (fs.statSync(baseDir).isDirectory()) {
        return _.flatMap(fs.readdirSync(baseDir), f =>
            recurse
                ? listFilesSync(path.join(baseDir, f), recurse)
                : fs.statSync(path.join(baseDir, f)).isDirectory()
                ? []
                : f
        )
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
 * @arg {Boolean} recurse - Find files in subdirectories as well if `true`. Default: `true`.
 * @arg {Booleand} splitBaseDir - If `true`, removes the `baseDir` from the paths of the files found,
 * if `false` then returns with the full path. Default: 'false'.
 *
 * @return {Array} - The list of file paths found
 *
 * @function
 */
export const findFilesSync = (baseDir, pattern, recurse = true, splitBaseDir = false) =>
    _.map(
        _.filter(listFilesSync(baseDir, recurse), (name, index, dir) => {
            return _.isArray(_.last(name.split('/')).match(pattern))
        }),
        fullPath => (splitBaseDir ? fullPath.slice(baseDir.length) : fullPath)
    )

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
const mergeJsonFileByKeySync = keyProp => (acc, dataFileName) => {
    const data = loadJsonFileSync(dataFileName)
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
export const mergeJsonFilesByKeySync = (listOfJsonFiles, keyProp, acc = {}) =>
    _.reduce(listOfJsonFiles, mergeJsonFileByKeySync(keyProp), acc)

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
const mergeJsonFileByFileNameSync = (acc, dataFileName) => {
    acc[dataFileName] = loadJsonFileSync(dataFileName)
    return acc
}

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
export const mergeJsonFilesByFileNameSync = (listOfJsonFiles, acc = {}) =>
    _.reduce(listOfJsonFiles, mergeJsonFileByFileNameSync, acc)

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
const mergeTextFileByFileNameSync = (acc, textFileName) => {
    acc[textFileName] = loadTextFileSync(textFileName)
    return acc
}

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
export const mergeTextFilesByFileNameSync = (listOfTextFiles, acc = {}) =>
    _.reduce(listOfTextFiles, mergeTextFileByFileNameSync, acc)

export const loadSchema = schemas.loadSchema
export const validate = schemas.validate
