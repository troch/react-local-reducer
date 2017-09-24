import onDispatchEnhancer from '../onDispatchEnhancer'
import { createStore, applyMiddleware, compose } from 'redux'

describe('onDispatchEnhancer', () => {
  const reducer = () => ({ a: 1 })

  it('should add a onDispatch method to stores', () => {
    const store = createStore(reducer, {}, onDispatchEnhancer)

    expect(store.onDispatch).toBeDefined()
  })

  it('should add and remove dispatch callbacks', () => {
    const store = createStore(reducer, {}, onDispatchEnhancer)
    const callback = jest.fn()
    const action = {
      type: 'ACTION'
    }
    const action2 = {
      type: 'ACTION2'
    }
    const unsubscribe = store.onDispatch(callback)

    store.dispatch(action)

    expect(callback).toHaveBeenCalledWith(action)

    unsubscribe()

    store.dispatch(action2)

    expect(callback).not.toHaveBeenCalledWith(action2)
  })
})
