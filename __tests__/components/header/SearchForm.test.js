/* eslint-env jest */
import { mount } from 'enzyme'
import React from 'react'
import SearchForm from '../../../components/header/SearchForm.js'
import Router from 'next/router'
Router['push'] = jest.fn(() => function () {})

describe('Search Form component', () => {
  let form, input, wrapper
  const fakeEvent = {
    preventDefault: function () {}
  }

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('Search form', function () {
    beforeAll(() => {
      wrapper = mount(<SearchForm />)
      form = wrapper.find('form')
      input = wrapper.find('input[type="search"]')
    })

    it('renders the component', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('renders the search form', () => {
      expect(form.exists()).toBe(true)
      expect(input.exists()).toBe(true)
    })

    it('sets the input value on state', () => {
      input.simulate('change', { target: { value: 'Hello' } })
      expect(wrapper.state('value')).toBe('Hello')
    })
  })

  describe('Handling special characters in search input', function () {
    beforeAll(() => {
      Router.router = {
        route: '/report-listing'
      }
      wrapper = mount(<SearchForm />)
      form = wrapper.find('form')
      input = wrapper.find('input[type="search"]')
    })

    it('replaces special characters with spaces', () => {
      const inputString = 'Hello+Good-bye&&guten||tag!auf(weidersehn}{pet}[hola]bonjour^hallo"salut"~bored*now?nearly:at\\theend'
      const searchString = 'Hello Good bye guten tag auf weidersehn pet hola bonjour hallo salut bored now nearly at theend'
      input.simulate('change', { target: { value: inputString } })
      form.simulate('submit', fakeEvent)
      expect(Router.push).toHaveBeenCalledWith(`/report-listing?search=${searchString}`, `/report/listing?search=${searchString}`)
    })

    it('does not replace accented characters', () => {
      input.simulate('change', { target: { value: 'Curaçao' } })
      form.simulate('submit', fakeEvent)
      expect(Router.push).toHaveBeenCalledWith('/report-listing?search=Curaçao', '/report/listing?search=Curaçao')

      input.simulate('change', { target: { value: '1585 ressortissantes et ressortissants haïtiens rapatriés à Belladère au cours du mois d’août 2017 Spécial' } })
      form.simulate('submit', fakeEvent)
      expect(Router.push).toHaveBeenCalledWith('/report-listing?search=1585 ressortissantes et ressortissants haïtiens rapatriés à Belladère au cours du mois d’août 2017 Spécial', '/report/listing?search=1585 ressortissantes et ressortissants haïtiens rapatriés à Belladère au cours du mois d’août 2017 Spécial')
    })

    it('replaces + years experience to plus years if searching for experience', () => {
      input.simulate('change', { target: { value: 'experience.exact:"10+ years"' } })
      form.simulate('submit', fakeEvent)
      expect(Router.push).toHaveBeenCalledWith('/report-listing?search=experience.exact:"10plus years"', '/report/listing?search=experience.exact:"10plus years"')
    })

    it('does not remove colons and quotes if searching for an exact type', () => {
      input.simulate('change', { target: { value: 'source.exact:"something: somewhere"' } })
      form.simulate('submit', fakeEvent)
      expect(Router.push).toHaveBeenCalledWith('/report-listing?search=source.exact:"something: somewhere"', '/report/listing?search=source.exact:"something: somewhere"')
    })
  })

  describe('Searching for updates', function () {
    describe('From updates listing page', function () {
      beforeAll(() => {
        Router.router = {
          route: '/report-listing'
        }
        wrapper = mount(<SearchForm />)
        form = wrapper.find('form')
        input = wrapper.find('input[type="search"]')
      })

      it('sets the search and placeholder values on state', () => {
        expect(wrapper.state('searchType')).toBe('report')
        expect(wrapper.state('placeholder')).toBe('Search for updates')
      })

      it('sets the route with the input value on submit', () => {
        input.simulate('change', { target: { value: 'Yemen' } })
        form.simulate('submit', fakeEvent)
        expect(Router.push).toHaveBeenCalledWith('/report-listing?search=Yemen', '/report/listing?search=Yemen')
      })
    })
    describe('From home page', function () {
      beforeAll(() => {
        Router.router = {
          route: '/'
        }
        wrapper = mount(<SearchForm />)
        form = wrapper.find('form')
        input = wrapper.find('input[type="search"]')
      })

      it('sets the search and placeholder values on state', () => {
        expect(wrapper.state('searchType')).toBe('report')
        expect(wrapper.state('placeholder')).toBe('Search for updates')
      })

      it('sets the route with the input value on submit', () => {
        input.simulate('change', { target: { value: 'Yemen' } })
        form.simulate('submit', fakeEvent)
        expect(Router.push).toHaveBeenCalledWith('/report-listing?search=Yemen', '/report/listing?search=Yemen')
      })
    })
  })

  describe('Searching for countries', function () {
    describe('From countries listing page', function () {
      beforeAll(() => {
        Router.router = {
          route: '/country-listing'
        }
        wrapper = mount(<SearchForm />)
        form = wrapper.find('form')
        input = wrapper.find('input[type="search"]')
      })

      it('sets the search and placeholder values on state', () => {
        expect(wrapper.state('searchType')).toBe('country')
        expect(wrapper.state('placeholder')).toBe('Search for countries')
      })

      it('sets the route with the input value on submit', () => {
        input.simulate('change', { target: { value: 'Yemen' } })
        form.simulate('submit', fakeEvent)
        expect(Router.push).toHaveBeenCalledWith('/country-listing?search=Yemen', '/country/listing?search=Yemen')
      })
    })
  })

  describe('Searching for disasters', () => {
    describe('From disasters listing page', function () {
      beforeAll(() => {
        Router.router = {
          route: '/disaster-listing'
        }
        wrapper = mount(<SearchForm />)
        form = wrapper.find('form')
        input = wrapper.find('input[type="search"]')
      })

      it('sets the search and placeholder values on state', () => {
        expect(wrapper.state('searchType')).toBe('disaster')
        expect(wrapper.state('placeholder')).toBe('Search for disasters')
      })

      it('sets the route with the input value on submit', () => {
        input.simulate('change', { target: { value: 'Yemen' } })
        form.simulate('submit', fakeEvent)
        expect(Router.push).toHaveBeenCalledWith('/disaster-listing?search=Yemen', '/disaster/listing?search=Yemen')
      })
    })

    describe('From disasters article page', function () {
      beforeAll(() => {
        Router.router = {
          route: '/disaster'
        }
        wrapper = mount(<SearchForm />)
        form = wrapper.find('form')
        input = wrapper.find('input[type="search"]')
      })

      it('sets the search and placeholder values on state', () => {
        expect(wrapper.state('searchType')).toBe('disaster')
        expect(wrapper.state('placeholder')).toBe('Search for disasters')
      })

      it('sets the route with the input value on submit', () => {
        input.simulate('change', { target: { value: 'Yemen' } })
        form.simulate('submit', fakeEvent)
        expect(Router.push).toHaveBeenCalledWith('/disaster-listing?search=Yemen', '/disaster/listing?search=Yemen')
      })
    })
  })

  describe('Searching for jobs', () => {
    describe('From jobs listing page', function () {
      beforeAll(() => {
        Router.router = {
          route: '/job-listing'
        }
        wrapper = mount(<SearchForm />)
        form = wrapper.find('form')
        input = wrapper.find('input[type="search"]')
      })

      it('sets the search and placeholder values on state', () => {
        expect(wrapper.state('searchType')).toBe('job')
        expect(wrapper.state('placeholder')).toBe('Search for jobs')
      })

      it('sets the route with the input value on submit', () => {
        input.simulate('change', { target: { value: 'Yemen' } })
        form.simulate('submit', fakeEvent)
        expect(Router.push).toHaveBeenCalledWith('/job-listing?search=Yemen', '/job/listing?search=Yemen')
      })
    })

    describe('From jobs article page', function () {
      beforeAll(() => {
        Router.router = {
          route: '/job'
        }
        wrapper = mount(<SearchForm />)
        form = wrapper.find('form')
        input = wrapper.find('input[type="search"]')
      })

      it('sets the search and placeholder values on state', () => {
        expect(wrapper.state('searchType')).toBe('job')
        expect(wrapper.state('placeholder')).toBe('Search for jobs')
      })

      it('sets the route with the input value on submit', () => {
        input.simulate('change', { target: { value: 'Yemen' } })
        form.simulate('submit', fakeEvent)
        expect(Router.push).toHaveBeenCalledWith('/job-listing?search=Yemen', '/job/listing?search=Yemen')
      })
    })
  })

  describe('Searching for training', () => {
    describe('From training listing page', function () {
      beforeAll(() => {
        Router.router = {
          route: '/training-listing'
        }
        wrapper = mount(<SearchForm />)
        form = wrapper.find('form')
        input = wrapper.find('input[type="search"]')
      })

      it('sets the search and placeholder values on state', () => {
        expect(wrapper.state('searchType')).toBe('training')
        expect(wrapper.state('placeholder')).toBe('Search for training')
      })

      it('sets the route with the input value on submit', () => {
        input.simulate('change', { target: { value: 'Yemen' } })
        form.simulate('submit', fakeEvent)
        expect(Router.push).toHaveBeenCalledWith('/training-listing?search=Yemen', '/training/listing?search=Yemen')
      })
    })

    describe('From training article page', function () {
      beforeAll(() => {
        Router.router = {
          route: '/training'
        }
        wrapper = mount(<SearchForm />)
        form = wrapper.find('form')
        input = wrapper.find('input[type="search"]')
      })

      it('sets the search and placeholder values on state', () => {
        expect(wrapper.state('searchType')).toBe('training')
        expect(wrapper.state('placeholder')).toBe('Search for training')
      })

      it('sets the route with the input value on submit', () => {
        input.simulate('change', { target: { value: 'Yemen' } })
        form.simulate('submit', fakeEvent)
        expect(Router.push).toHaveBeenCalledWith('/training-listing?search=Yemen', '/training/listing?search=Yemen')
      })
    })
  })
})
