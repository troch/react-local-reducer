import isObject from '../isObject'

describe('isObject', () => {
  it('should correctly identify objects', () => {
    expect(isObject({})).toBe(true)
    expect(isObject([])).toBe(false)
    expect(isObject({ valid: true })).toBe(true)
  })
})
