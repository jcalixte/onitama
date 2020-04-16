export const getRandomItemFromArray = <T>(array: T[]): [T, T[]] => {
  const item = array[Math.floor(Math.random() * array.length)]
  const arrayFiltered = array.filter((i) => i !== item)
  return [item, arrayFiltered]
}
