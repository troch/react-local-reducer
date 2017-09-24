import bindActionCreators from '../bindActionCreators'

describe('bindActionCreators', () => {
  it('should bind action creators from a factory', () => {
    const dispatchAction = jest.fn()
    const actionCreators = bindActionCreators(
      dispatch => ({
        action: () => dispatch({ type: 'ACTION' })
      }),
      dispatchAction
    )

    expect(actionCreators.action).toBeDefined()

    actionCreators.action()

    expect(dispatchAction).toHaveBeenCalledWith({ type: 'ACTION' })
  })

  it('should bind action creators from an object', () => {
    const dispatchAction = jest.fn()
    const actionCreators = bindActionCreators(
      {
        action: () => ({ type: 'ACTION' })
      },
      dispatchAction
    )

    expect(actionCreators.action).toBeDefined()

    actionCreators.action()

    expect(dispatchAction).toHaveBeenCalledWith({ type: 'ACTION' })
  })
})
