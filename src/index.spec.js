import expect from 'expect'
import { loadDataFile, loadData } from './index'

describe('datafile', () => {

    it('loadDataFile - load a single file', () => {
        const data = loadDataFile('src/fixtures/solarSystem.yml', false)
        expect(data).toBeA('object')
        expect(data).toIncludeKeys(['name', 'format', 'comment', 'planets'])
        expect(data.name).toEqual('The Solar System')
        expect(data.planets).toBeAn('object')
    })

    it('loadDataFile - try to load a non-existing file with no-exit-on-error', () => {
        const data = loadDataFile('src/fixtures/slrSystem.yml', false)
        expect(data).toBeA('object')
        expect(data).toEqual({})
    })

    it('loadDataFile - try to load with no name and with no-exit-on-error', () => {
        const data = loadDataFile(null, false)
        expect(data).toBeA('object')
        expect(data).toEqual({})
    })

    it('loadData - load a single file', () => {
        const data = loadData(['src/fixtures/solarSystem.yml'])
        expect(data).toBeA('object')
        expect(data).toIncludeKeys(['name', 'format', 'comment', 'planets'])
        expect(data.name).toEqual('The Solar System')
        expect(data.planets).toBeAn('object')
    })

    it('loadData - merging several files', () => {
        const data = loadData([
                'src/fixtures/solarSystem.yml',
                'src/fixtures/moons.yml',
                'src/fixtures/earth.yml',
                'src/fixtures/mars.yml'
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

})
