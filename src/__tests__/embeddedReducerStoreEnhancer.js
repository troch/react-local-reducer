import embeddedReducerStoreEnhancer from '../embeddedReducerStoreEnhancer'
import { createStore, applyMiddleware, compose } from 'redux'

describe('embeddedReducerStoreEnhancer', () => {
  const reducer = () => ({ a: 1 })

  it('should add a addLocalReducer method to stores', () => {
    const store = createStore(reducer, {}, embeddedReducerStoreEnhancer)

    expect(store.addLocalReducer).toBeDefined()
  })

  it('should add a localReducers key to your reducer', () => {
    const store = createStore(reducer, {}, embeddedReducerStoreEnhancer)

    expect(store.getState().localReducers).toBeDefined()
  })

  it('should add local reducers', () => {
    const store = createStore(reducer, {}, embeddedReducerStoreEnhancer)
    const localReducer = (state, action) => {
      console.log(action)
      if (action.type === 'INCREMENT') {
        return {
          count: state.count + 1
        }
      }

      return {
        count: 1
      }
    }

    const { id, dispatch, remove } = store.addLocalReducer(localReducer)

    expect(store.getState()).toEqual({
      a: 1,
      localReducers: {
        [id]: {
          count: 1
        }
      }
    })

    dispatch({
      type: 'INCREMENT'
    })

    expect(store.getState()).toEqual({
      a: 1,
      localReducers: {
        [id]: {
          count: 2
        }
      }
    })

    remove()

    expect(store.getState()).toEqual({
      a: 1,
      localReducers: {}
    })
  })
})
