import fs from 'fs'
import { rimrafSync } from 'rimraf'
import path from 'path'
import expect from 'expect'
import * as _ from 'lodash'
import {
    loadTextFileSync,
    saveTextFileSync,
    saveYamlFileSync,
    loadCsvFileSync,
    saveCsvFileSync,
    loadJsonFileSync,
    loadJsonWithRefs,
    mergeJsonFilesSync,
    listFilesSync,
    findFilesSync,
    mergeJsonFilesByKeySync,
    mergeJsonFilesByFileNameSync,
    mergeTextFilesByFileNameSync,
    loadData // alias mergeJsonFilesSync, DEPRECATED
} from './index'

const destCleanup = function (cb) {
    const dest = path.resolve('./tmp/')
    console.log('Remove: ', dest)
    rimrafSync(dest)
    cb()
}

before(function (done) {
    destCleanup(function () {
        fs.mkdirSync(path.resolve('./tmp'))
        done()
    })
})

after(function (done) {
    destCleanup(done)
})

describe('datafile', () => {
    it('loadTextFileSync - load a text file', () => {
        const content = loadTextFileSync('src/fixtures/merge/earth.yml', false)
        expect(typeof content).toBe('string')
        expect(content).toEqual('planets:\n    Earth:\n        moons:\n            Moon: {}\n')
    })

    it('loadTextFileSync - try to load a non-existing file (throws exception)', () => {
        try {
            loadTextFileSync('nonExistingFile.txt')
        } catch (err) {
            expect(err).toBeInstanceOf(Error)
        }
    })

    it('loadTextFileSync - try to load a non-existing file (throws no exception)', () => {
        const data = loadTextFileSync('nonExistingFile.txt', false)
        expect(typeof data).toBe('object')
        expect(data).toEqual(null)
    })

    it('saveTextFileSync - save text content into a file', () => {
        const testFileName = 'tmp/testFileToSave.txt'
        const contentToSave = 'This is a simple text to save,\nand load back\n\n'

        saveTextFileSync(testFileName, contentToSave, false)
        expect(fs.readFileSync(testFileName, 'utf-8')).toEqual(contentToSave)
    })

    it('saveYamlFileSync - save content into a YAMl format file', () => {
        const testFileName = 'tmp/testFileToSave.yml'
        const contentToSave = { id: 42, text: 'This is a simple text to save,\nand load back\n\n' }

        saveYamlFileSync(testFileName, contentToSave, {}, false)
        expect(loadJsonFileSync(testFileName)).toEqual(contentToSave)
    })

    it('loadCsvFileSync - load records from a CSV format file synchronously', () => {
        const testDataCsvFileName = 'src/fixtures/testdata.csv'
        const testDataYamlFileName = 'src/fixtures/testdata.yml'
        const csvData = loadCsvFileSync(testDataCsvFileName, { columns: true, skip_empty_lines: true })
        const yamlData = loadJsonFileSync(testDataYamlFileName)
        expect(csvData).toEqual(yamlData)
    })

    it('saveCsvFileSync - save records to a CSV format file synchronously', () => {
        const outputCsvFileName = 'tmp/testdata.csv'
        const testDataYamlFileName = 'src/fixtures/testdata.yml'
        const yamlData = loadJsonFileSync(testDataYamlFileName)
        saveCsvFileSync(outputCsvFileName, yamlData, {
            header: true /*, columns: ['id', 'userName', 'fullName', 'email']*/
        })
        const csvData = loadCsvFileSync(outputCsvFileName, { columns: true, skip_empty_lines: true })
        expect(csvData).toEqual(yamlData)
    })

    it('saveTextFileSync - try to save a file into a non-existing dir (throws exception)', () => {
        try {
            saveTextFileSync('tmp/nonExistingFileDir/file.txt', 'content')
        } catch (err) {
            expect(err).toBeInstanceOf(Error)
        }
    })

    it('saveTextFileSync - try to save a file into a non-existing dir (throws no exception)', () => {
        saveTextFileSync('tmp/nonExistingFileDir/file.txt', 'content', false)
    })

    it('loadJsonFileSync - load a single file', () => {
        const data = loadJsonFileSync('src/fixtures/merge/solarSystem.yml', false)
        expect(data).toBeInstanceOf(Object)
        //expect(data).toIncludeKeys(['name', 'format', 'comment', 'planets'])
        expect(data.name).toEqual('The Solar System')
        expect(data.planets).toBeInstanceOf(Object)
    })

    it('loadJsonFileSync - try to load a non-existing file (throws exception)', () => {
        try {
            loadJsonFileSync('nonExistingFile.yml')
        } catch (err) {
            expect(err).toBeInstanceOf(Error)
        }
    })

    it('loadJsonFileSync - try to load a non-existing file (throws no exception)', () => {
        const data = loadJsonFileSync('nonExistingFile.yml', false)
        expect(data).toBeInstanceOf(Object)
        expect(data).toEqual({})
    })

    it('loadJsonFileSync - try to load with no name (throws exception)', () => {
        try {
            loadJsonFileSync(null, true)
        } catch (err) {
            expect(err).toEqual(new Error('File name is missing!'))
        }
    })

    it('loadJsonFileSync - try to load with no name (throws no exception)', () => {
        const data = loadJsonFileSync(null, false)
        expect(data).toBeInstanceOf(Object)
        expect(data).toEqual({})
    })

    it('listFilesSync - list files (recursive)', () => {
        expect(listFilesSync('src/fixtures/')).toEqual([
            'src/fixtures/merge/earth.yml',
            'src/fixtures/merge/mars.yml',
            'src/fixtures/merge/moons.yml',
            'src/fixtures/merge/solarSystem.yml',
            'src/fixtures/refs/endpoints/health.yml',
            'src/fixtures/refs/endpoints/monitoring.yml',
            'src/fixtures/refs/genericHeaders.yml',
            'src/fixtures/refs/protocols.yml',
            'src/fixtures/refs/root.yml',
            'src/fixtures/templates/copyright.html',
            'src/fixtures/templates/footer.html',
            'src/fixtures/templates/header.html',
            'src/fixtures/templates/main.html',
            'src/fixtures/testdata.csv',
            'src/fixtures/testdata.yml',
            'src/fixtures/tree/services/customers/customer/service.yml',
            'src/fixtures/tree/services/customers/service.yml',
            'src/fixtures/tree/services/defaults/noHeaders/service.yml',
            'src/fixtures/tree/services/defaults/noTestCases/service.yml',
            'src/fixtures/tree/services/monitoring/isAlive/service.yml'
        ])
    })

    it('listFilesSync - list files (non-recursive)', () => {
        expect(listFilesSync('src/fixtures/merge/', false)).toEqual([
            'earth.yml',
            'mars.yml',
            'moons.yml',
            'solarSystem.yml'
        ])
    })

    it('findFilesSync - find s*.yml files (non-recursive)', () => {
        expect(findFilesSync('src/fixtures/merge/', /^s.+\.yml$/, false)).toEqual(['solarSystem.yml'])
    })

    it('findFilesSync - find s*.yml files (recursive + splitBaseDir)', () => {
        expect(findFilesSync('src/fixtures/merge/', /^s.+\.yml$/, true, true)).toEqual(['solarSystem.yml'])
    })

    it('mergeJsonFilesSync - load a single file', () => {
        const data = mergeJsonFilesSync(['src/fixtures/merge/solarSystem.yml'])
        expect(data).toBeInstanceOf(Object)
        //expect(data).toIncludeKeys(['name', 'format', 'comment', 'planets'])
        expect(data.name).toEqual('The Solar System')
        expect(data.planets).toBeInstanceOf(Object)
    })

    it('mergeJsonFilesSync - merging several files', () => {
        const data = mergeJsonFilesSync([
            'src/fixtures/merge/solarSystem.yml',
            'src/fixtures/merge/moons.yml',
            'src/fixtures/merge/earth.yml',
            'src/fixtures/merge/mars.yml'
        ])

        const mars = {
            earthMass: 0.11,
            numOfMoons: 2,
            moons: {
                Deimos: {},
                Phobos: {}
            }
        }

        expect(data).toBeInstanceOf(Object)
        expect(data.name).toEqual('The Solar System')
        //expect(data).toIncludeKeys(['name', 'format', 'comment', 'planets'])
        //expect(data.planets).toIncludeKeys([
        //    'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Neptune', 'Uranus', 'Pluto'
        //])
        expect(data.planets.Mars).toEqual(mars)
    })

    it('loadData - merging several files', () => {
        const filesToMerge = [
            'src/fixtures/merge/solarSystem.yml',
            'src/fixtures/merge/moons.yml',
            'src/fixtures/merge/earth.yml',
            'src/fixtures/merge/mars.yml'
        ]
        expect(loadData(filesToMerge)).toEqual(mergeJsonFilesSync(filesToMerge))
    })

    it('mergeJsonFilesByKeySync - find s*.yml files and merge them by urlPattern|urlTemplate keys', () => {
        const fileListToMerge = findFilesSync('src/fixtures/tree/', /^s.+\.yml$/)
        const results = mergeJsonFilesByKeySync(
            fileListToMerge,
            'uriTemplate',
            mergeJsonFilesByKeySync(fileListToMerge, 'urlPattern')
        )
        expect(_.keys(results)).toEqual([
            '/customers/{id}',
            '/customers',
            '/monitoring/isAlive',
            '/defaults/noHeaders',
            '/defaults/noTestCases'
        ])
    })

    it('mergeJsonFilesByFileNameSync - find s*.yml files and merge them by the names of the files', () => {
        const fileListToMerge = findFilesSync('src/fixtures/tree/', /^s.+\.yml$/)
        const results = mergeJsonFilesByFileNameSync(fileListToMerge, {})
        expect(_.keys(results)).toEqual([
            'src/fixtures/tree/services/customers/customer/service.yml',
            'src/fixtures/tree/services/customers/service.yml',
            'src/fixtures/tree/services/defaults/noHeaders/service.yml',
            'src/fixtures/tree/services/defaults/noTestCases/service.yml',
            'src/fixtures/tree/services/monitoring/isAlive/service.yml'
        ])
        _.map(results, (dataItem, key) => {
            expect(dataItem).toBeInstanceOf(Object)
            expect(dataItem).toEqual(loadJsonFileSync(key))
        })
    })

    it('mergeTextFilesByFileNameSync - find and read files as plain text and merge them by their names', () => {
        const fileListToMerge = findFilesSync('src/fixtures/templates/', /.*\.html$/)
        const results = mergeTextFilesByFileNameSync(fileListToMerge, {})
        expect(_.keys(results)).toEqual([
            'src/fixtures/templates/copyright.html',
            'src/fixtures/templates/footer.html',
            'src/fixtures/templates/header.html',
            'src/fixtures/templates/main.html'
        ])
        _.map(results, (dataItem, key) => {
            expect(typeof dataItem).toBe('string')
            expect(dataItem).toEqual(loadTextFileSync(key))
        })
    })

    it('loadJsonWithRefs', (done) => {
        loadJsonWithRefs('./src/fixtures/refs/root.yml').then((results) => {
            const expected = [
                '#/server/protocols',
                '#/server/endpoints/0',
                '#/server/endpoints/0/methods/get/headers',
                '#/server/endpoints/1',
                '#/server/endpoints/1/some_def',
                '#/server/endpoints/1/methods/get/headers'
            ]
            const refs = _.map(results.refs, (v, k, i) => k)
            expect(expected).toEqual(refs)
            expect(results.resolved.server.protocols).toEqual(['http', 'https'])
            expect(results.resolved.server.endpoints[0].methods.get.headers).toEqual(
                results.resolved.server.endpoints[1].methods.get.headers
            )
            done()
        })
    })
})
