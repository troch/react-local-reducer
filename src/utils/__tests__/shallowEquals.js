import shallowEquals from '../shallowEquals'

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
