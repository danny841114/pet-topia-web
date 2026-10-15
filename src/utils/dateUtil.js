export const dateUtil = {
  formatDateTime(dateStr) {
    if (!dateStr) return ''

    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return ''

    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }

    return date.toLocaleDateString('zh-TW', options)
  },

  formatDateOnly(dateStr) {
    if (!dateStr) return ''

    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return ''

    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }

    return date.toLocaleDateString('zh-TW', options)
  },

  formatDbDateTime(dateStr) {
    if (!dateStr) return ''

    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return ''

    const year = date.getFullYear()
    const month = ('0' + (date.getMonth() + 1)).slice(-2)
    const day = ('0' + date.getDate()).slice(-2)
    const hours = ('0' + date.getHours()).slice(-2)
    const minutes = ('0' + date.getMinutes()).slice(-2)
    const seconds = ('0' + date.getSeconds()).slice(-2)

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  },

  formatDbDate(dateStr) {
    if (!dateStr) return ''

    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return ''

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  },

  formatReviewDate(dateString) {
    const dateObject = new Date(dateString)
    const date = dateObject.toLocaleDateString('zh-TW')
    const time = dateObject.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
    return date + ' ' + time
  },

  formatProfileDate(dateString) {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = date.getMonth() + 1 // 月份從0開始
    const day = date.getDate()
    let hours = date.getHours()
    let minutes = date.getMinutes()

    const period = hours >= 12 ? '下午' : '上午'

    hours = hours % 12
    hours = hours ? hours : 12

    minutes = minutes < 10 ? '0' + minutes : minutes

    return `${year}年${month}月${day}日 ${period} ${hours}:${minutes}`
  },
}
