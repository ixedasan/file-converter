import React from 'react'
import convertFile from '@/utils/convert'
import { HiOutlineDownload } from 'react-icons/hi'
import { ImSpinner3 } from 'react-icons/im'

import { Button } from '@/components/ui/button'
import { Action } from '@/app/types'

interface ConversionActionsProps {
  actions: Action[]
  isReady: boolean
  isConverting: boolean
  isDone: boolean
  ffmpegRef: React.MutableRefObject<any>
  setActions: React.Dispatch<React.SetStateAction<Action[]>>
  setIsConverting: React.Dispatch<React.SetStateAction<boolean>>
  setIsDone: React.Dispatch<React.SetStateAction<boolean>>
  reset: () => void
}

export const ConversionActions: React.FC<ConversionActionsProps> = ({
  actions,
  isReady,
  isConverting,
  isDone,
  ffmpegRef,
  setActions,
  setIsConverting,
  setIsDone,
  reset,
}) => {
  const convert = async (): Promise<void> => {
    let updatedActions = actions.map(elt => ({
      ...elt,
      is_converting: true,
    }))
    setActions(updatedActions)
    setIsConverting(true)

    for (const action of updatedActions) {
      try {
        const { url, output } = await convertFile(ffmpegRef.current, action)
        updatedActions = updatedActions.map(elt =>
          elt === action
            ? {
                ...elt,
                is_converted: true,
                is_converting: false,
                url,
                output,
              }
            : elt,
        )
        setActions(updatedActions)
      } catch (err) {
        updatedActions = updatedActions.map(elt =>
          elt === action
            ? {
                ...elt,
                is_converted: false,
                is_converting: false,
                is_error: true,
              }
            : elt,
        )
        setActions(updatedActions)
      }
    }
    setIsDone(true)
    setIsConverting(false)
  }

  const downloadAll = (): void => {
    actions.forEach(action => {
      if (!action.is_error) {
        download(action)
      }
    })
  }

  const download = (action: Action) => {
    const a = document.createElement('a')
    a.style.display = 'none'
    if (action.url) {
      a.href = action.url
      a.download = action.output || 'downloaded-file'

      document.body.appendChild(a)
      a.click()

      URL.revokeObjectURL(action.url)
      document.body.removeChild(a)
    }
  }

  return (
    <div className="flex w-full justify-end">
      {isDone ? (
        <div className="w-fit space-y-4">
          <Button
            size="lg"
            className="text-md relative flex w-full items-center gap-2 rounded-xl py-4 font-semibold"
            onClick={downloadAll}
          >
            {actions.length > 1 ? 'Download All' : 'Download'}
            <HiOutlineDownload />
          </Button>
          <Button
            size="lg"
            onClick={reset}
            variant="outline"
            className="rounded-xl"
          >
            Convert Another File(s)
          </Button>
        </div>
      ) : (
        <Button
          size="lg"
          disabled={!isReady || isConverting}
          className="text-md relative flex w-44 items-center rounded-xl py-4 font-semibold"
          onClick={convert}
        >
          {isConverting ? (
            <span className="animate-spin text-lg">
              <ImSpinner3 />
            </span>
          ) : (
            <span>Convert Now</span>
          )}
        </Button>
      )}
    </div>
  )
}
