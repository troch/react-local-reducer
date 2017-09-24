import onDispatchStoreEnhancer from '../onDispatchStoreEnhancer'
import { createStore, applyMiddleware, compose } from 'redux'

describe('onDispatchStoreEnhancer', () => {
  const reducer = () => ({ a: 1 })

  it('should add a onDispatch method to stores', () => {
    const store = createStore(reducer, {}, onDispatchStoreEnhancer)

    expect(store.onDispatch).toBeDefined()
  })

  it('should add and remove dispatch callbacks', () => {
    const store = createStore(reducer, {}, onDispatchStoreEnhancer)
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
