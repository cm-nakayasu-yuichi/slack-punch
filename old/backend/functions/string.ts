//
// 文字列に関する汎用関数
//

export function safeValue<T>(target: T|undefined|null, defaultValue: T): T {
  if (target === undefined || target === null) {
    return defaultValue
  }
  return target
}

export function safeString(target: string|undefined|null): string {
  return safeValue(target, '')
}

export function safeParseFloat(target: string|undefined|null, defaultValue: number = 0): number {
  if (target === undefined || target === null) {
    return defaultValue
  }
  return parseFloat(target)
}