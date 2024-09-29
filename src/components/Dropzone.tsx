'use client'

import { useEffect, useRef, useState } from 'react'
import { acceptedFiles, extensions } from '@/utils/file-constants'
import loadFfmpeg from '@/utils/load-ffmpeg'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import ReactDropzone from 'react-dropzone'

import { useToast } from '@/hooks/use-toast'
import { Action } from '@/app/types'

import { ConversionActions } from './dropzone/ConversionActions'
import { DropzoneContent } from './dropzone/DropzoneContent'
import { FileList } from './dropzone/FileList'

export default function Dropzone() {
  const { toast } = useToast()
  const [isHover, setIsHover] = useState<boolean>(false)
  const [actions, setActions] = useState<Action[]>([])
  const [isReady, setIsReady] = useState<boolean>(false)
  const [files, setFiles] = useState<Array<any>>([])
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [isConverting, setIsConverting] = useState<boolean>(false)
  const [isDone, setIsDone] = useState<boolean>(false)
  const ffmpegRef = useRef<any>(null)

  useEffect(() => {
    loadFfmpeg().then((ffmpeg: FFmpeg) => {
      ffmpegRef.current = ffmpeg
      setIsLoaded(true)
    })
  }, [])

  useEffect(() => {
    if (!actions.length) {
      setIsDone(false)
      setFiles([])
      setIsReady(false)
      setIsConverting(false)
    } else {
      checkIsReady()
    }
  }, [actions])

  const handleUpload = (data: Array<any>): void => {
    setIsHover(false)
    setFiles(data)
    const newActions: Action[] = data.map(file => ({
      file_name: file.name,
      file_size: file.size,
      from: file.name.slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 2),
      to: null,
      file_type: file.type,
      file,
      is_converted: false,
      is_converting: false,
      is_error: false,
    }))
    setActions(newActions)
  }

  const checkIsReady = (): void => {
    const allActionsReady = actions.every(action => action.to)
    setIsReady(allActionsReady)
  }

  const updateAction = (fileName: string, to: string) => {
    setActions(prevActions =>
      prevActions.map(action =>
        action.file_name === fileName ? { ...action, to } : action,
      ),
    )
  }

  const deleteAction = (action: Action): void => {
    setActions(prevActions => prevActions.filter(a => a !== action))
    setFiles(prevFiles => prevFiles.filter(f => f.name !== action.file_name))
  }

  const reset = () => {
    setIsDone(false)
    setActions([])
    setFiles([])
    setIsReady(false)
    setIsConverting(false)
  }

  if (actions.length) {
    return (
      <div className="space-y-6">
        <FileList
          actions={actions}
          isLoaded={isLoaded}
          updateAction={updateAction}
          deleteAction={deleteAction}
          extensions={extensions}
        />
        <ConversionActions
          actions={actions}
          isReady={isReady}
          isConverting={isConverting}
          isDone={isDone}
          ffmpegRef={ffmpegRef}
          setActions={setActions}
          setIsConverting={setIsConverting}
          setIsDone={setIsDone}
          reset={reset}
        />
      </div>
    )
  }

  return (
    <ReactDropzone
      onDrop={handleUpload}
      onDragEnter={() => setIsHover(true)}
      onDragLeave={() => setIsHover(false)}
      accept={acceptedFiles}
      onDropRejected={() => {
        setIsHover(false)
        toast({
          variant: 'destructive',
          title: 'Error uploading your file(s)',
          description: 'Allowed Files: Audio, Video and Images.',
          duration: 5000,
        })
      }}
      onError={() => {
        setIsHover(false)
        toast({
          variant: 'destructive',
          title: 'Error uploading your file(s)',
          description: 'Allowed Files: Audio, Video and Images.',
          duration: 5000,
        })
      }}
    >
      {({ getRootProps, getInputProps }) => (
        <div
          {...getRootProps()}
          className="flex h-72 cursor-pointer items-center justify-center rounded-3xl border-2 border-dashed border-secondary bg-background shadow-sm lg:h-80 xl:h-96"
        >
          <input {...getInputProps()} />
          <DropzoneContent isHover={isHover} />
        </div>
      )}
    </ReactDropzone>
  )
}
