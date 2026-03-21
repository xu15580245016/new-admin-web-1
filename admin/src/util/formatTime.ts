import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

const formatTime = {
  getTime: (date: string | Date): string => {
    return dayjs(date).format('YYYY/MM/DD')
  },
  
  format: (date: string | Date, formatStr: string = 'YYYY-MM-DD HH:mm:ss'): string => {
    return dayjs(date).format(formatStr)
  },
  
  relativeTime: (date: string | Date): string => {
    const now = dayjs()
    const target = dayjs(date)
    const diffDays = now.diff(target, 'day')
    
    if (diffDays === 0) {
      return '今天'
    } else if (diffDays === 1) {
      return '昨天'
    } else if (diffDays < 7) {
      return `${diffDays}天前`
    } else {
      return target.format('YYYY/MM/DD')
    }
  },
}

export default formatTime
