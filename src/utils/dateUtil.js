export const dateUtil = {
  formatChineseDate(dateString) {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    let hours = date.getHours()
    const minutes = date.getMinutes()
    const period = hours >= 12 ? '下午' : '上午'
    hours = hours % 12 || 12

    return `${year}年${month}月${day}日 ${period}
    ${hours}:${minutes < 10 ? '0' + minutes : minutes}`
  },
}
