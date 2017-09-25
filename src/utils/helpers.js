export const isObject = value =>
  typeof value === 'object' && !Array.isArray(value)

const keysAreEqual = (left, right) =>
  Object.keys(left).length === Object.keys(right).length &&
  Object.keys(left).every(leftKey => left[leftKey] === right[leftKey])

export const shallowEquals = (left, right) =>
  left === right || keysAreEqual(left, right)
