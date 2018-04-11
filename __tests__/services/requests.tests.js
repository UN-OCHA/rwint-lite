/* eslint-env jest */
import { requestCountry, requestCountries, requestDisaster, requestDisasters, requestFeatured, requestJob, requestJobs,
  requestHeadlines, requestTraining, requestTrainings, requestUpdate, requestReports } from '../../services/requests.js'
import { mockCountry, mockCountries, mockDisaster, mockDisasters, mockEndpoints, mockHeadlines, mockJob, mockJobs, mockTraining,
  mockTrainings, mockReports, mockUpdate } from '../../__fixtures__/data.fixture'
jest.mock('../../helpers/shuffleArray')
const fetchMock = require('fetch-mock/es5/server')

describe('API requests', () => {
  let expectedBody, result

  describe('Get Featured', () => {
    beforeAll(async () => {
      fetchMock.post(mockEndpoints.countries, {data: mockCountries.data})
      fetchMock.post(mockEndpoints.disasters, {data: mockDisasters.data})
      result = await requestFeatured()
    })
    afterAll(fetchMock.restore)

    it('posts to the featured countries endpoint', () => {
      expect(fetchMock.called(mockEndpoints.countries)).toEqual(true)
      expectedBody = {
        filter: {
          field: 'featured',
          value: true
        }
      }
      expect(fetchMock.lastOptions()).toEqual({
        method: 'post',
        body: JSON.stringify(expectedBody)
      })
    })

    it('posts to the featured disasters endpoint', () => {
      expect(fetchMock.called(mockEndpoints.disasters)).toEqual(true)
      expectedBody = {
        filter: {
          field: 'featured',
          value: true
        }
      }
      expect(fetchMock.lastOptions()).toEqual({
        method: 'post',
        body: JSON.stringify(expectedBody)
      })
    })

    it('returns 6 from the merged and shuffled array data', () => {
      // shuffle is mocked to return first and last 4 items of the array
      expect(result.length).toBe(6)
      expect(result[0].id).toEqual(mockCountries.data[0].id)
      expect(result[5].id).toEqual(mockDisasters.data[7].id)
    })

    it('adds the type to each result', () => {
      expect(result[0].type).toBe('country')
      expect(result[5].type).toBe('disaster')
    })

    it('formats and adds the url name to each result', () => {
      expect(result[0].urlName).toBe('a-country-name-0')
      expect(result[5].urlName).toBe('oh-no-a-disaster-name-7')
    })
  })

  describe('Get Headlines', () => {
    beforeAll(async () => {
      fetchMock.post(mockEndpoints.updates, mockReports)
      result = await requestHeadlines()
    })
    afterAll(fetchMock.restore)

    it('posts to the headlines endpoint', () => {
      expect(fetchMock.called(mockEndpoints.headlines)).toEqual(true)
      expectedBody = {
        limit: 16,
        offset: 0,
        sort: ['date:desc'],
        fields: {
          include: ['headline.title', 'date.created', 'primary_country.name', 'primary_country.shortname', 'source.name', 'source.shortname']
        },
        filter: {
          field: 'headline'
        }
      }
      expect(fetchMock.lastOptions()).toEqual({
        method: 'post',
        body: JSON.stringify(expectedBody)
      })
    })

    it('returns the data', () => {
      expect(result.data[0].id).toEqual(mockHeadlines.data[0].id)
      expect(result.data[1].fields.title).toEqual(mockHeadlines.data[1].fields.title)
    })

    it('formats and adds the url-friendly country using the shortname if present to each result', () => {
      expect(result.data[0].urlCountry).toBe('so-yo')
    })

    it('formats and adds the url-friendly country using the name if no shortname to each result', () => {
      expect(result.data[1].urlCountry).toBe('south-yorkshire')
    })

    it('formats and adds the url-friendly title to each result', () => {
      expect(result.data[0].urlTitle).toBe('report-something-words-en-uk-0')
    })
  })

  describe('Get Updates', () => {
    beforeAll(async () => {
      fetchMock.post(mockEndpoints.updates, mockReports)
      result = await requestReports()
    })
    afterAll(fetchMock.restore)

    it('sends a post request with the correct body data', () => {
      expect(fetchMock.called(mockEndpoints.updates)).toEqual(true)
      expectedBody = {
        limit: 10,
        offset: 0,
        preset: 'latest',
        sort: ['date:desc'],
        fields: {
          include: ['title', 'date.created', 'primary_country.name', 'primary_country.shortname', 'source.name', 'source.shortname']
        }
      }
      expect(fetchMock.lastOptions()).toEqual({
        method: 'post',
        body: JSON.stringify(expectedBody)
      })
    })

    it('returns the data', () => {
      expect(result.data[0].id).toEqual(mockReports.data[0].id)
      expect(result.data[1].fields.title).toEqual(mockReports.data[1].fields.title)
    })

    it('formats and adds the url-friendly country using the shortname if present to each result', () => {
      expect(result.data[0].urlCountry).toBe('so-yo')
    })

    it('formats and adds the url-friendly country using the name if no shortname to each result', () => {
      expect(result.data[1].urlCountry).toBe('south-yorkshire')
    })

    it('formats and adds the url-friendly title to each result', () => {
      expect(result.data[0].urlTitle).toBe('report-something-words-en-uk-0')
    })
  })

  describe('Get next page of updates', () => {
    beforeAll(async () => {
      fetchMock.post(mockEndpoints.updates, mockReports)
      result = await requestReports(10)
    })
    afterAll(fetchMock.restore)

    it('sends the post request with offset set to 10', () => {
      expect(fetchMock.called(mockEndpoints.updates)).toEqual(true)
      expectedBody = {
        limit: 10,
        offset: 10,
        preset: 'latest',
        sort: ['date:desc'],
        fields: {
          include: ['title', 'date.created', 'primary_country.name', 'primary_country.shortname', 'source.name', 'source.shortname']
        }
      }
      expect(fetchMock.lastOptions()).toEqual({
        method: 'post',
        body: JSON.stringify(expectedBody)
      })
    })
  })

  describe('Get queried updates', () => {
    beforeAll(async () => {
      fetchMock.post(mockEndpoints.updates, mockReports)
      result = await requestReports(0, 10, 'country.exact:"Syria"')
    })
    afterAll(fetchMock.restore)

    it('sends the post request with the query', () => {
      expect(fetchMock.called(mockEndpoints.updates)).toEqual(true)
      expectedBody = {
        limit: 10,
        offset: 0,
        preset: 'latest',
        sort: ['date:desc'],
        fields: {
          include: ['title', 'date.created', 'primary_country.name', 'primary_country.shortname', 'source.name', 'source.shortname']
        },
        query: {
          value: 'country.exact:"Syria"',
          operator: 'AND'
        }
      }
      expect(fetchMock.lastOptions()).toEqual({
        method: 'post',
        body: JSON.stringify(expectedBody)
      })
    })

    it('returns the data', () => {
      expect(result.data[0].id).toEqual(mockReports.data[0].id)
      expect(result.data[1].fields.title).toEqual(mockReports.data[1].fields.title)
    })
  })

  describe('Get Countries', () => {
    beforeAll(async () => {
      fetchMock.post(mockEndpoints.countries, {data: mockCountries.data})
      result = await requestCountries()
    })
    afterAll(fetchMock.restore)

    it('posts to the countries endpoint', () => {
      expect(fetchMock.called(mockEndpoints.countries)).toEqual(true)
      expectedBody = {
        limit: 300,
        offset: 0,
        sort: ['name:asc'],
        fields: {
          include: ['name', 'featured']
        }
      }
      expect(fetchMock.lastOptions()).toEqual({
        method: 'post',
        body: JSON.stringify(expectedBody)
      })
    })

    it('returns the data', () => {
      expect(result.data[0].id).toEqual(mockCountries.data[0].id)
      expect(result.data[1].fields.title).toEqual(mockCountries.data[1].fields.title)
    })

    it('adds the type to each result', () => {
      expect(result.data[0].type).toBe('country')
    })

    it('formats and adds the url name to each result', () => {
      expect(result.data[0].urlName).toBe('a-country-name-0')
    })
  })

  describe('Get an Update', () => {
    beforeAll(async () => {
      fetchMock.get(mockEndpoints.update, {data: mockUpdate})
      result = await requestUpdate(100)
    })
    afterAll(fetchMock.restore)

    it('calls the update endpoint', () => {
      expect(fetchMock.called(mockEndpoints.update)).toBe(true)
    })

    it('returns the data', () => {
      expect(result.id).toEqual(mockUpdate.id)
      expect(result.fields.title).toEqual(mockUpdate.fields.title)
    })
  })

  describe('Get a Country', () => {
    beforeAll(async () => {
      fetchMock.get(mockEndpoints.country, {data: mockCountry})
      result = await requestCountry(100)
    })
    afterAll(fetchMock.restore)

    it('calls the country endpoint', () => {
      expect(fetchMock.called(mockEndpoints.country)).toBe(true)
    })

    it('returns the data', () => {
      expect(result.id).toEqual(mockCountry.id)
      expect(result.fields.name).toEqual(mockCountry.fields.name)
    })
  })

  describe('Get Disasters', () => {
    beforeAll(async () => {
      fetchMock.post(mockEndpoints.disasters, mockDisasters)
      result = await requestDisasters()
    })
    afterAll(fetchMock.restore)

    it('sends a post request with the correct body data', () => {
      expect(fetchMock.called(mockEndpoints.disasters)).toEqual(true)
      expectedBody = {
        limit: 10,
        offset: 0,
        preset: 'latest',
        fields: {
          include: ['name', 'country.id', 'country.name', 'country.shortname', 'type', 'status']
        }
      }
      expect(fetchMock.lastOptions()).toEqual({
        method: 'post',
        body: JSON.stringify(expectedBody)
      })
    })

    it('returns the data', () => {
      expect(result.data[0].id).toEqual(mockDisasters.data[0].id)
      expect(result.data[1].fields.name).toEqual(mockDisasters.data[1].fields.name)
    })

    it('formats and adds the url-friendly country using the shortname if present to each result', () => {
      expect(result.data[0].urlCountry).toBe('so-yo')
    })

    it('formats and adds the url-friendly country using the name if no shortname to each result', () => {
      expect(result.data[1].urlCountry).toBe('south-yorkshire')
    })

    it('formats and adds the url-friendly title to each result', () => {
      expect(result.data[0].urlTitle).toBe('oh-no-a-disaster-name-0')
    })
  })

  describe('Get next page of disasters', () => {
    beforeAll(async () => {
      fetchMock.post(mockEndpoints.disasters, mockDisasters)
      result = await requestDisasters(10)
    })
    afterAll(fetchMock.restore)

    it('sends the post request with offset set to 10', () => {
      expect(fetchMock.called(mockEndpoints.disasters)).toEqual(true)
      expectedBody = {
        limit: 10,
        offset: 10,
        preset: 'latest',
        fields: {
          include: ['name', 'country.id', 'country.name', 'country.shortname', 'type', 'status']
        }
      }
      expect(fetchMock.lastOptions()).toEqual({
        method: 'post',
        body: JSON.stringify(expectedBody)
      })
    })
  })

  describe('Get queried disasters', () => {
    beforeAll(async () => {
      fetchMock.post(mockEndpoints.disasters, mockDisasters)
      result = await requestDisasters(0, 10, 'Syria')
    })
    afterAll(fetchMock.restore)

    it('sends the post request with the query', () => {
      expect(fetchMock.called(mockEndpoints.disasters)).toEqual(true)
      expectedBody = {
        limit: 10,
        offset: 0,
        preset: 'latest',
        fields: {
          include: ['name', 'country.id', 'country.name', 'country.shortname', 'type', 'status']
        },
        query: {
          value: 'Syria',
          operator: 'AND'
        }
      }
      expect(fetchMock.lastOptions()).toEqual({
        method: 'post',
        body: JSON.stringify(expectedBody)
      })
    })

    it('returns the data', () => {
      expect(result.data[0].id).toEqual(mockDisasters.data[0].id)
      expect(result.data[1].fields.name).toEqual(mockDisasters.data[1].fields.name)
    })
  })

  describe('Get a Disaster', () => {
    beforeAll(async () => {
      fetchMock.get(mockEndpoints.disaster, {data: mockDisaster})
      result = await requestDisaster(200)
    })
    afterAll(fetchMock.restore)

    it('calls the disaster endpoint', () => {
      expect(fetchMock.called(mockEndpoints.disaster)).toBe(true)
    })

    it('returns the data', () => {
      expect(result.id).toEqual(mockDisaster.id)
      expect(result.fields.name).toEqual(mockDisaster.fields.name)
    })
  })

  describe('Get Jobs', () => {
    beforeAll(async () => {
      fetchMock.post(mockEndpoints.jobs, mockJobs)
      result = await requestJobs()
    })
    afterAll(fetchMock.restore)

    it('sends a post request with the correct body data', () => {
      expect(fetchMock.called(mockEndpoints.jobs)).toEqual(true)
      expectedBody = {
        limit: 10,
        offset: 0,
        preset: 'latest',
        sort: ['date.created:desc'],
        fields: {
          include: ['title', 'date.closing', 'country.name', 'country.shortname', 'source.name', 'source.shortname']
        }
      }
      expect(fetchMock.lastOptions()).toEqual({
        method: 'post',
        body: JSON.stringify(expectedBody)
      })
    })

    it('returns the data', () => {
      expect(result.data[0].id).toEqual(mockJobs.data[0].id)
      expect(result.data[1].fields.title).toEqual(mockJobs.data[1].fields.title)
    })

    it('formats and adds the url-friendly country using the shortname if present to each result', () => {
      expect(result.data[0].urlCountry).toBe('so-yo')
    })

    it('formats and adds the url-friendly country using the name if no shortname to each result', () => {
      expect(result.data[1].urlCountry).toBe('south-yorkshire')
    })

    it('formats and adds the url-friendly title to each result', () => {
      expect(result.data[0].urlTitle).toBe('job-title-0')
    })
  })

  describe('Get next page of jobs', () => {
    beforeAll(async () => {
      fetchMock.post(mockEndpoints.jobs, mockJobs)
      result = await requestJobs(10)
    })
    afterAll(fetchMock.restore)

    it('sends the post request with offset set to 10', () => {
      expect(fetchMock.called(mockEndpoints.jobs)).toEqual(true)
      expectedBody = {
        limit: 10,
        offset: 10,
        preset: 'latest',
        sort: ['date.created:desc'],
        fields: {
          include: ['title', 'date.closing', 'country.name', 'country.shortname', 'source.name', 'source.shortname']
        }
      }
      expect(fetchMock.lastOptions()).toEqual({
        method: 'post',
        body: JSON.stringify(expectedBody)
      })
    })
  })

  describe('Get queried jobs', () => {
    beforeAll(async () => {
      fetchMock.post(mockEndpoints.jobs, mockJobs)
      result = await requestJobs(0, 10, 'Syria')
    })
    afterAll(fetchMock.restore)

    it('sends the post request with the query', () => {
      expect(fetchMock.called(mockEndpoints.jobs)).toEqual(true)
      expectedBody = {
        limit: 10,
        offset: 0,
        preset: 'latest',
        sort: ['date.created:desc'],
        fields: {
          include: ['title', 'date.closing', 'country.name', 'country.shortname', 'source.name', 'source.shortname']
        },
        query: {
          value: 'Syria',
          operator: 'AND'
        }
      }
      expect(fetchMock.lastOptions()).toEqual({
        method: 'post',
        body: JSON.stringify(expectedBody)
      })
    })

    it('returns the data', () => {
      expect(result.data[0].id).toEqual(mockJobs.data[0].id)
      expect(result.data[1].fields.title).toEqual(mockJobs.data[1].fields.title)
    })
  })

  describe('Get a Job', () => {
    beforeAll(async () => {
      fetchMock.get(mockEndpoints.job, {data: mockJob})
      result = await requestJob(300)
    })
    afterAll(fetchMock.restore)

    it('calls the job endpoint', () => {
      expect(fetchMock.called(mockEndpoints.job)).toBe(true)
    })

    it('returns the data', () => {
      expect(result.id).toEqual(mockJob.id)
      expect(result.fields.title).toEqual(mockJob.fields.title)
    })
  })

  describe('Get Trainings', () => {
    beforeAll(async () => {
      fetchMock.post(mockEndpoints.trainings, mockTrainings)
      result = await requestTrainings()
    })
    afterAll(fetchMock.restore)

    it('sends a post request with the correct body data', () => {
      expect(fetchMock.called(mockEndpoints.trainings)).toEqual(true)
      expectedBody = {
        limit: 10,
        offset: 0,
        preset: 'latest',
        sort: ['date.created:desc'],
        fields: {
          include: ['title', 'date.registration', 'date.start', 'date.end', 'country.name', 'country.shortname', 'source.name', 'source.shortname']
        }
      }
      expect(fetchMock.lastOptions()).toEqual({
        method: 'post',
        body: JSON.stringify(expectedBody)
      })
    })

    it('returns the data', () => {
      expect(result.data[0].id).toEqual(mockTrainings.data[0].id)
      expect(result.data[1].fields.title).toEqual(mockTrainings.data[1].fields.title)
    })

    it('formats and adds the url-friendly country using the shortname if present to each result', () => {
      expect(result.data[0].urlCountry).toBe('so-yo')
    })

    it('formats and adds the url-friendly country using the name if no shortname to each result', () => {
      expect(result.data[1].urlCountry).toBe('south-yorkshire')
    })

    it('formats and adds the url-friendly title to each result', () => {
      expect(result.data[0].urlTitle).toBe('training-title-0')
    })
  })

  describe('Get next page of trainings', () => {
    beforeAll(async () => {
      fetchMock.post(mockEndpoints.trainings, mockTrainings)
      result = await requestTrainings(10)
    })
    afterAll(fetchMock.restore)

    it('sends the post request with offset set to 10', () => {
      expect(fetchMock.called(mockEndpoints.trainings)).toEqual(true)
      expectedBody = {
        limit: 10,
        offset: 10,
        preset: 'latest',
        sort: ['date.created:desc'],
        fields: {
          include: ['title', 'date.registration', 'date.start', 'date.end', 'country.name', 'country.shortname', 'source.name', 'source.shortname']
        }
      }
      expect(fetchMock.lastOptions()).toEqual({
        method: 'post',
        body: JSON.stringify(expectedBody)
      })
    })
  })

  describe('Get queried trainings', () => {
    beforeAll(async () => {
      fetchMock.post(mockEndpoints.trainings, mockTrainings)
      result = await requestTrainings(0, 10, 'Syria')
    })
    afterAll(fetchMock.restore)

    it('sends the post request with the query', () => {
      expect(fetchMock.called(mockEndpoints.trainings)).toEqual(true)
      expectedBody = {
        limit: 10,
        offset: 0,
        preset: 'latest',
        sort: ['date.created:desc'],
        fields: {
          include: ['title', 'date.registration', 'date.start', 'date.end', 'country.name', 'country.shortname', 'source.name', 'source.shortname']
        },
        query: {
          value: 'Syria',
          operator: 'AND'
        }
      }
      expect(fetchMock.lastOptions()).toEqual({
        method: 'post',
        body: JSON.stringify(expectedBody)
      })
    })

    it('returns the data', () => {
      expect(result.data[0].id).toEqual(mockTrainings.data[0].id)
      expect(result.data[1].fields.title).toEqual(mockTrainings.data[1].fields.title)
    })
  })

  describe('Get a Training', () => {
    beforeAll(async () => {
      fetchMock.get(mockEndpoints.training, {data: mockTraining})
      result = await requestTraining(400)
    })
    afterAll(fetchMock.restore)

    it('calls the training endpoint', () => {
      expect(fetchMock.called(mockEndpoints.training)).toBe(true)
    })

    it('returns the data', () => {
      expect(result.id).toEqual(mockTraining.id)
      expect(result.fields.title).toEqual(mockTraining.fields.title)
    })
  })

  describe('Handle error when get single item', () => {
    beforeAll(async () => {
      fetchMock.get(mockEndpoints.training, 404)
      result = await requestTraining(400)
    })
    afterAll(fetchMock.restore)

    it('returns the error response', () => {
      expect(result.ok).toBe(false)
      expect(result.status).toBe(404)
    })
  })

  describe('Handle error when get items', () => {
    beforeAll(async () => {
      fetchMock.post(mockEndpoints.trainings, 404)
      result = await requestTrainings()
      console.log('result', result)
    })
    afterAll(fetchMock.restore)

    it('returns the error response', () => {
      expect(result.ok).toBe(false)
      expect(result.status).toBe(404)
    })
  })

  describe('Handle error when get featured', () => {
    beforeAll(async () => {
      fetchMock.post(mockEndpoints.countries, 404)
      fetchMock.post(mockEndpoints.disasters, 404)
      result = await requestFeatured()
    })
    afterAll(fetchMock.restore)

    it('returns the error response', () => {
      expect(result.ok).toBe(false)
    })
  })
})
