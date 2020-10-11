export const minAll = xs => Math.min.apply(Math, xs)

export const maxAll = xs => Math.max.apply(Math, xs)

export const roundTo3Decimals = num => Math.round(num * 10 ** 3 / 10 ** 3)

export const limitAll = xs => {
  return [roundTo3Decimals(minAll(xs)), roundTo3Decimals(maxAll(xs))]
}
