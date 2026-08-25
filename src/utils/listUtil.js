export const listUtil = {
  shuffleList(array) {
    return array.sort(() => Math.random() - 0.5)
  },
}
