const perPage = 8

export function getPagePos(page: number) {
  const start = (page - 1) * perPage
  const end = page * perPage

  return { start, end }
}
