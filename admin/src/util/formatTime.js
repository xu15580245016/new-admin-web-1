import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

const formatTime = {
    getTime: (date) => {
        return dayjs(date).format('YYYY/MM/DD')
    }
}

export default formatTime
