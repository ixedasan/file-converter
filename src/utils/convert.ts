import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile } from '@ffmpeg/util'

import { Action } from '@/app/types'

const getFileExtension = (fileName: string): string => {
  const match = fileName.match(/\.([^.]+)$/)
  return match ? match[1] : ''
}

const removeFileExtension = (fileName: string): string => {
  const lastDotIndex = fileName.lastIndexOf('.')
  return lastDotIndex !== -1 ? fileName.slice(0, lastDotIndex) : fileName
}

const getFfmpegCommand = (
  input: string,
  output: string,
  to: string,
): string[] => {
  if (to === '3gp') {
    return [
      '-i',
      input,
      '-r',
      '20',
      '-s',
      '352x288',
      '-vb',
      '400k',
      '-acodec',
      'aac',
      '-strict',
      'experimental',
      '-ac',
      '1',
      '-ar',
      '8000',
      '-ab',
      '24k',
      output,
    ]
  }
  return ['-i', input, output]
}

export default async function convert(
  ffmpeg: FFmpeg,
  action: Action,
): Promise<{ url: string; output: string }> {
  const { file, to, file_name, file_type } = action

  if (!file_name || !to) {
    throw new Error('Invalid file name or conversion format.')
  }

  const input = getFileExtension(file_name)
  const output = `${removeFileExtension(file_name)}.${to}`

  await ffmpeg.writeFile(input, await fetchFile(file))

  const ffmpegCmd = getFfmpegCommand(input, output, to)
  await ffmpeg.exec(ffmpegCmd)

  const data = await ffmpeg.readFile(output)
  const blob = new Blob([data], { type: file_type.split('/')[0] })
  const url = URL.createObjectURL(blob)

  return { url, output }
}
