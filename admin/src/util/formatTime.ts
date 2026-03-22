import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

// 设置中文语言
dayjs.locale('zh-cn');

// 日期格式化工具
export const formatTime = {
  /**
   * 格式化日期为 YYYY/MM/DD 格式
   * @param date 日期字符串或 Date 对象
   * @returns 格式化后的日期字符串
   */
  getTime: (date: string | Date | number): string => {
    if (!date) return '';
    return dayjs(date).format('YYYY/MM/DD');
  },

  /**
   * 格式化日期为指定格式
   * @param date 日期字符串或 Date 对象
   * @param format 格式化模板，默认为 YYYY-MM-DD HH:mm:ss
   * @returns 格式化后的日期字符串
   */
  format: (date: string | Date | number, format: string = 'YYYY-MM-DD HH:mm:ss'): string => {
    if (!date) return '';
    return dayjs(date).format(format);
  },

  /**
   * 获取相对时间（如：2小时前）
   * @param date 日期字符串或 Date 对象
   * @returns 相对时间字符串
   */
  fromNow: (date: string | Date | number): string => {
    if (!date) return '';
    return dayjs(date).fromNow();
  }
};

export default formatTime;
