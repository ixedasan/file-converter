import React from 'react'

import { Action } from '@/app/types'

import { FileItem } from './FileItem'

interface FileListProps {
  actions: Action[]
  isLoaded: boolean
  updateAction: (fileName: string, to: string) => void
  deleteAction: (action: Action) => void
  extensions: Record<string, string[]>
}

export const FileList: React.FC<FileListProps> = ({
  actions,
  isLoaded,
  updateAction,
  deleteAction,
  extensions,
}) => {
  return (
    <>
      {actions.map((action: Action, i: number) => (
        <FileItem
          key={i}
          action={action}
          isLoaded={isLoaded}
          updateAction={updateAction}
          deleteAction={deleteAction}
          extensions={extensions}
        />
      ))}
    </>
  )
}
