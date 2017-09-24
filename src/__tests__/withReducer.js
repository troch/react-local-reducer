import React from 'react'
import withReducer from '../withReducer'
import { shallow } from 'enzyme'

describe('withReducer', () => {
  const createComponent = () => {
    const initialState = { value: 1 }
    const createReducer = () => (state = initialState, action) => {
      if (action && action.type === 'ACTION') {
        return { value: action.payload }
      }

      return state
    }
    const action = value => ({
      type: 'ACTION',
      payload: value
    })

    const BaseComponent = ({ value, action }) => (
      <button onClick={() => action(2)}>{value}</button>
    )

    return withReducer(createReducer, { action })(BaseComponent)
  }

  it('should create a component', () => {
    const Component = createComponent()
    const output = shallow(<Component />).dive()

    expect(Component).toBeDefined()
    expect(output.text()).toBe('1')
  })
})
