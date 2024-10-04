//
// 文字列に関する汎用関数
//

export function safeParseFloat(
  target: string | undefined | null,
  defaultValue: number = 0
): number {
  if (target === undefined || target === null) {
    return defaultValue;
  }
  return parseFloat(target);
}
