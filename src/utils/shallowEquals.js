const keysAreEqual = (left, right) =>
  Object.keys(left).length === Object.keys(right).length &&
  Object.keys(left).every(leftKey => left[leftKey] === right[leftKey])

const shallowEquals = (left, right) =>
  left === right || keysAreEqual(left, right)

export default shallowEquals
