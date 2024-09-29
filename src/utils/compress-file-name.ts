const MAX_LENGTH = 18

export default function compressFileName(fileName: string): string {
  if (fileName.length <= MAX_LENGTH) {
    return fileName.trim()
  }

  const [name, extension] = fileName.split(/\.(?=[^.]+$)/)
  const availableLength = MAX_LENGTH - extension.length - 4 // 4 accounts for '....' and '.'

  if (availableLength <= 0) {
    return fileName.substring(0, MAX_LENGTH - 3) + '...'
  }

  const start = Math.ceil(availableLength / 2)
  const end = Math.floor(availableLength / 2)

  return `${name.substring(0, start)}...${name.slice(-end)}.${extension}`
}
