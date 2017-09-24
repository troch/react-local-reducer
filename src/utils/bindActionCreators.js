const bindActionCreatorsObject = actionCreators =>
  Object.keys(mapDispatchToProps).reduce((actionCreators, actionKey) => ({
    ...actionCreators,
    [actionKey]: (...args) => {
      const actionCreator = mapDispatchToProps[actionKey]
      const action = actionCreator(...args)

      dispatchAction(action)
    }
  }))

const bindActionCreators = (mapDispatchToProps, dispatchAction, props) => {
  if (typeof mapDispatchToProps === 'function') {
    return mapDispatchToProps(dispatchAction, props)
  } else if (typeof mapDispatchToProps === 'object') {
    return bindActionCreatorsObject(mapDispatchToProps)
  }

  return {}
}

export default bindActionCreators
