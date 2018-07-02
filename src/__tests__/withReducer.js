import React from 'react'
import withReducer from '../withReducer'
import { shallow } from 'enzyme'

describe('withReducer', () => {
  const createComponent = mergeProps => {
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

    return withReducer(createReducer, { action }, mergeProps)(BaseComponent)
  }

  it('should create a component', () => {
    const Component = createComponent()
    const component = shallow(<Component />)
    const output = component.dive()

    expect(Component).toBeDefined()
    expect(component.prop('value')).toBe(1)
    expect(output.text()).toBe('1')
  })

  it('should use a mergeProps function when provided', () => {
    const Component = createComponent((props, state) => ({
      ...props,
      state,
      ...state
    }))
    const component = shallow(<Component />)
    const output = component.dive()

    expect(Component).toBeDefined()
    expect(component.prop('state')).toEqual({ value: 1 })
    expect(output.text()).toBe('1')
  })
})
