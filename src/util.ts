const maxLen = 90
export function trimmer(str: string) {
  if (str.length > maxLen) {
    return str.substring(0, maxLen - 3).padEnd(maxLen, '.')
  } else {
    return str
  }
}
