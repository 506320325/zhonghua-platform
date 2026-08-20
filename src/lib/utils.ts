export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('zh-HK', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleString('zh-HK', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getCommunityName(code: string): string {
  const map: Record<string, string> = {
    '81010101': '中環',
    '81010108': '西環',
    '81010204': '銅鑼灣',
    '81010306': '筲箕灣',
    '81010323': '火炭',
    '81030301': '沙田市中心',
    '81030329': '烏溪沙',
    '81030334': '恆安',
  }
  return map[code] || code
}