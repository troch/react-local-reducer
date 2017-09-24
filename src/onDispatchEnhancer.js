export default function onDispatchStoreEnhancer() {
  return createStore => (reducer, initialState, enhancer) => {
    const store = createStore(reducer, initialState, enhancer)
    const dispatch = store.dispatch
    let onDispatchHandlers = []

    store.onDispatch = callback => {
      onDispatchHandlers.push(callback)

      return () => {
        onDispatchHandlers = onDispatchHandlers.filter(cb => cb !== callback)
      }
    }

    store.dispatch = action => {
      const result = dispatch(action)

      onDispatchHandlers.forEach(handler => handler(action))

      return result
    }

    return store
  }
}
