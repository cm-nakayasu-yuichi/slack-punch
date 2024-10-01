export const timestampToDate = (timestamp: string) => {
  const numTs = parseFloat(timestamp);
  return new Date(Math.floor(numTs) * 1000);
};

/**
 * DateオブジェクトをISO8601形式に文字列化する
 * @param {Date} date Dateオブジェクト
 * @returns {string} ISO8601形式にした文字列
 */
export function dateToISOString(date?: Date): string {
  if (date === undefined) {
    return "undefined";
  }
  return date.toISOString();
}
