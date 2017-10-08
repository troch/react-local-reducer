import { omit } from './utils/helpers'

const actionTypes = {
  add: '@@localReducer/ADD',
  action: '@@localReducer/ACTION',
  remove: '@@localReducer/REMOVE'
}

export default function embeddedReducerStoreEnhancer(createStore) {
  return (reducer, initialState, enhancer) => {
    let reducerId = 0
    let localReducers = {}

    const finalReducer = (state, action) => {
      if (action.type === actionTypes.action) {
        const { id } = action.payload

        return {
          ...state,
          localReducers: {
            ...state.localReducers,
            [id]: localReducers[id](
              state.localReducers[id],
              action.payload.action
            )
          }
        }
      }

      if (action.type === actionTypes.add) {
        const { id } = action.payload

        return {
          ...state,
          localReducers: {
            ...state.localReducers,
            [id]: localReducers[id](undefined, action)
          }
        }
      }

      if (action.type === actionTypes.remove) {
        const { id } = action.payload

        return {
          ...state,
          localReducers: omit(action.payload.id)(state.localReducers)
        }
      }

      return {
        ...reducer(state, action),
        localReducers: Object.keys(localReducers).reduce(
          (localReducersState, id) =>
            Object.assign(localReducersState, {
              [id]: localReducers[id](state, action)
            }),
          {}
        )
      }
    }

    const store = createStore(finalReducer, initialState, enhancer)

    store.addLocalReducer = reducer => {
      reducerId += 1
      const id = `r${reducerId}`

      localReducers[id] = reducer

      store.dispatch({
        type: actionTypes.add,
        payload: { id }
      })

      return {
        id,
        dispatch: action =>
          store.dispatch({
            type: actionTypes.action,
            payload: {
              id,
              action
            }
          }),
        remove: () => {
          localReducers = omit(id)(localReducers)

          store.dispatch({
            type: actionTypes.remove,
            payload: { id }
          })
        }
      }
    }

    return store
  }
}
