import expect from 'expect'
import * as _ from 'lodash'
import {
    loadDataFileSync,
    mergeDataFilesSync,
    listFilesSync,
    findFilesSync,
    mergeDataFilesByKeySync,
    loadData // alias mergeDataFilesSync, DEPRECATED
} from './index'

describe('datafile', () => {

    it('loadDataFileSync - load a single file', () => {
        const data = loadDataFileSync('src/fixtures/merge/solarSystem.yml', false)
        expect(data).toBeA('object')
        expect(data).toIncludeKeys(['name', 'format', 'comment', 'planets'])
        expect(data.name).toEqual('The Solar System')
        expect(data.planets).toBeAn('object')
    })

    it('loadDataFileSync - try to load a non-existing file (throws exception)', () => {
        try {
            loadDataFileSync('src/fixtures/merge/slrSystem.yml')
        } catch (err) {
            expect(err).toBeAn(Error)
        }
    })

    it('loadDataFileSync - try to load a non-existing file (throws no exception)', () => {
        const data = loadDataFileSync('src/fixtures/merge/slrSystem.yml', false)
        expect(data).toBeA('object')
        expect(data).toEqual({})
    })

    it('loadDataFileSync - try to load with no name (throws exception)', () => {
        try {
            loadDataFileSync(null)
        } catch (err) {
            expect(err).toEqual('Error: File name is missing!')
        }
    })

    it('loadDataFileSync - try to load with no name (throws no exception)', () => {
        const data = loadDataFileSync(null, false)
        expect(data).toBeA('object')
        expect(data).toEqual({})
    })

    it('mergeDataFilesSync - load a single file', () => {
        const data = mergeDataFilesSync(['src/fixtures/merge/solarSystem.yml'])
        expect(data).toBeA('object')
        expect(data).toIncludeKeys(['name', 'format', 'comment', 'planets'])
        expect(data.name).toEqual('The Solar System')
        expect(data.planets).toBeAn('object')
    })

    it('loadDataSync - merging several files', () => {
        const filesToMerge = [
            'src/fixtures/merge/solarSystem.yml',
            'src/fixtures/merge/moons.yml',
            'src/fixtures/merge/earth.yml',
            'src/fixtures/merge/mars.yml'
        ]
        expect(loadData(filesToMerge)).toEqual(mergeDataFilesSync(filesToMerge))
    })

    it('mergeDataFilesSync - merging several files', () => {
        const data = mergeDataFilesSync([
                'src/fixtures/merge/solarSystem.yml',
                'src/fixtures/merge/moons.yml',
                'src/fixtures/merge/earth.yml',
                'src/fixtures/merge/mars.yml'
        ])

        const mars = {
                "earthMass": 0.11,
                "numOfMoons": 2,
                "moons": {
                "Deimos": {},
                "Phobos": {}
            }
        }

        expect(data).toBeA('object')
        expect(data.name).toEqual('The Solar System')
        expect(data).toIncludeKeys(['name', 'format', 'comment', 'planets'])
        expect(data.planets).toIncludeKeys([
            'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Neptune', 'Uranus', 'Pluto'
        ])
        expect(data.planets.Mars).toEqual(mars)
    })

    it('listFilesSync - list files (recursive)', () => {
        expect(listFilesSync('src/fixtures/')).toEqual([
            'src/fixtures/merge/earth.yml',
            'src/fixtures/merge/mars.yml',
            'src/fixtures/merge/moons.yml',
            'src/fixtures/merge/solarSystem.yml',
            'src/fixtures/tree/services/customers/customer/service.yml',
            'src/fixtures/tree/services/customers/service.yml',
            'src/fixtures/tree/services/defaults/noHeaders/service.yml',
            'src/fixtures/tree/services/defaults/noTestCases/service.yml',
            'src/fixtures/tree/services/monitoring/isAlive/service.yml'
        ])
    })

    it('listFilesSync - list files (non-recursive)', () => {
        expect(listFilesSync('src/fixtures/merge/', false)).toEqual([ 'earth.yml', 'mars.yml', 'moons.yml', 'solarSystem.yml' ])
    })

    it('findFilesSync - find s*.yml files (non-recursive)', () => {
        expect(findFilesSync('src/fixtures/merge/', /^s.+\.yml$/, false)).toEqual([ 'solarSystem.yml' ])
    })

    it('findFilesSync - find s*.yml files and merge them by urlPattern|urlTemplate keys', () => {
        const fileListToMerge = findFilesSync('src/fixtures/tree/', /^s.+\.yml$/)
        const results = mergeDataFilesByKeySync(fileListToMerge, 'uriTemplate', mergeDataFilesByKeySync(fileListToMerge, 'urlPattern'))
        expect(_.keys(results)).toEqual([ '/customers/{id}', '/customers', '/monitoring/isAlive', '/defaults/noHeaders', '/defaults/noTestCases' ])
    })
})
