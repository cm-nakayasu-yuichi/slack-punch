//
// 日付に関する汎用関数
//

/**
 * SlackAPIのタイムスタンプ値(ts)をDateオブジェクトに変換する
 * @param {string} ts SlackAPIのタイムスタンプ値(ts)
 * @returns {Date} 変換されたDateオブジェクト
 */
export function tsToDate(ts: string): Date {
  const numTs = parseFloat(ts)
  return new Date(Math.floor(numTs) * 1000)
}

/**
 * DateオブジェクトをISO8601形式に文字列化する
 * @param {Date} date Dateオブジェクト
 * @returns {string} ISO8601形式にした文字列
 */
export function dateToISOString(date?: Date): string {
  if (date === undefined) {
    return 'undefined'
  }
  return date.toISOString()
}

/**
 * Dateオブジェクトを見やすい形式に文字列化する
 * @param {Date} date Dateオブジェクト
 * @returns {string} 見やすい形式にした文字列
 */
export function dateToString(date: Date): string {
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
}