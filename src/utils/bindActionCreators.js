const bindActionCreatorsObject = (mapDispatchToProps, dispatchAction) =>
  Object.keys(mapDispatchToProps).reduce(
    (actionCreators, actionName) => ({
      ...actionCreators,
      [actionName]: (...args) => {
        const actionCreator = mapDispatchToProps[actionName]
        const action = actionCreator(...args)

        dispatchAction(action)
      }
    }),
    {}
  )

const bindActionCreators = (mapDispatchToProps, dispatchAction, props = {}) => {
  if (typeof mapDispatchToProps === 'function') {
    return mapDispatchToProps(dispatchAction, props)
  } else if (typeof mapDispatchToProps === 'object') {
    return bindActionCreatorsObject(mapDispatchToProps, dispatchAction)
  }

  return {}
}

export default bindActionCreators
