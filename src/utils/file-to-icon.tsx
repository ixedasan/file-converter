import React from 'react'
import { IconType } from 'react-icons'
import { AiFillFile } from 'react-icons/ai'
import {
  BsFileEarmarkTextFill,
  BsFillCameraVideoFill,
  BsFillImageFill,
} from 'react-icons/bs'
import { PiSpeakerSimpleHighFill } from 'react-icons/pi'

export default function fileToIcon(
  fileType: string,
): React.ReactElement<IconType> {
  if (fileType.includes('video')) return <BsFillCameraVideoFill />
  if (fileType.includes('audio')) return <PiSpeakerSimpleHighFill />
  if (fileType.includes('text')) return <BsFileEarmarkTextFill />
  if (fileType.includes('image')) return <BsFillImageFill />
  return <AiFillFile />
}
