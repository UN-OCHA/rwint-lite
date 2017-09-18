/* eslint-env jest */
import { shallow } from 'enzyme'
import React from 'react'
import configureStore from 'redux-mock-store'
import ConnectedDisaster, { Disaster } from '../../pages/disaster.js'
import { mockDisaster } from '../../__fixtures__/data.fixture'

describe('Disaster page', () => {
  let container, store, wrapper
  const mockStore = configureStore()
  const initialState = {
    updateDisasters: [mockDisaster]
  }

  describe('Connected component', () => {
    beforeAll(function () {
      store = mockStore(initialState)
      container = shallow(<ConnectedDisaster store={store} />)
    })

    it('renders the page', () => {
      expect(container.exists()).toBe(true)
    })
  })

  describe('Simple component', () => {
    beforeAll(() => {
      const report = {
        fields: {
          name: 'the name'
        }
      }
      wrapper = shallow(<Disaster report={report} />)
    })

    it('renders the component', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('passes the title to the layout', () => {
      expect(wrapper.find('Layout[title="the name"]').exists()).toBe(true)
    })

    it('returns the correct report from getInitialProps', () => {
      let fakeStore = {
        dispatch: function () {},
        getState: function () {
          return {
            disasterReports: [mockDisaster, {id: 3}]
          }
        }
      }

      return Disaster.getInitialProps({store: fakeStore, isServer: true, pathname: '', query: {id: 200}}).then(function (data) {
        expect(data.report).toEqual(mockDisaster)
      })
    })
  })
})