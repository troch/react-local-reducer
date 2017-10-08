import { isObject, shallowEquals, omit } from '../helpers'

describe('isObject', () => {
  it('should correctly identify objects', () => {
    expect(isObject({})).toBe(true)
    expect(isObject([])).toBe(false)
    expect(isObject({ valid: true })).toBe(true)
  })
})

describe('shallowEquals', () => {
  it('should correctly shallow compare objects', () => {
    expect(shallowEquals({}, {})).toBe(true)
    expect(shallowEquals({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 3 })).toBe(true)
    expect(
      shallowEquals({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 3, d: 4 })
    ).toBe(false)

    expect(shallowEquals({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 4 })).toBe(
      false
    )
  })
})

describe('omit', () => {
  it('should remove keys from objects', () => {
    const obj = {
      a: 1,
      b: 2
    }

    const obj2 = omit('a')(obj)

    expect(obj2).toEqual({
      b: 2
    })
    expect(obj2).not.toBe(obj)
  })
})
