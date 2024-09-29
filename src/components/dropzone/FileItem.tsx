import React, { useState } from 'react'
import bytesToSize from '@/utils/bytes-to-size'
import compressFileName from '@/utils/compress-file-name'
import fileToIcon from '@/utils/file-to-icon'
import { BiError } from 'react-icons/bi'
import { ImSpinner3 } from 'react-icons/im'
import { MdClose, MdDone } from 'react-icons/md'

import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Action } from '@/app/types'

interface FileItemProps {
  action: Action
  isLoaded: boolean
  updateAction: (fileName: string, to: string) => void
  deleteAction: (action: Action) => void
  extensions: Record<string, string[]>
}

export const FileItem: React.FC<FileItemProps> = ({
  action,
  isLoaded,
  updateAction,
  deleteAction,
  extensions,
}) => {
  const [defaultValues, setDefaultValues] = useState<string>('video')
  const [selected, setSelected] = useState<string>('...')

  return (
    <div className="relative flex h-fit w-full cursor-pointer flex-wrap items-center justify-between space-y-2 rounded-xl border px-4 py-4 lg:h-20 lg:flex-nowrap lg:px-10 lg:py-0">
      {!isLoaded && (
        <Skeleton className="absolute -ml-10 h-full w-full cursor-progress rounded-xl" />
      )}
      <div className="flex items-center gap-4">
        <span className="text-2xl text-primary">
          {fileToIcon(action.file_type)}
        </span>
        <div className="flex w-96 items-center gap-1">
          <span className="text-md overflow-x-hidden font-medium">
            {compressFileName(action.file_name)}
          </span>
          <span className="text-sm text-muted-foreground">
            ({bytesToSize(action.file_size)})
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {action.is_error ? (
          <Badge variant="destructive" className="flex gap-2">
            <span>Error Converting File</span>
            <BiError />
          </Badge>
        ) : action.is_converted ? (
          <Badge variant="default" className="flex gap-2 bg-green-500">
            <span>Done</span>
            <MdDone />
          </Badge>
        ) : action.is_converting ? (
          <Badge variant="default" className="flex gap-2">
            <span>Converting</span>
            <span className="animate-spin">
              <ImSpinner3 />
            </span>
          </Badge>
        ) : (
          <ConversionOptions
            action={action}
            extensions={extensions}
            updateAction={updateAction}
            setDefaultValues={setDefaultValues}
            setSelected={setSelected}
            selected={selected}
            defaultValues={defaultValues}
          />
        )}
        {action.is_converted && (
          <span
            onClick={() => deleteAction(action)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-2xl text-foreground hover:bg-muted"
          >
            <MdClose />
          </span>
        )}
      </div>
    </div>
  )
}

const ConversionOptions: React.FC<{
  action: Action
  extensions: Record<string, string[]>
  updateAction: (fileName: string, to: string) => void
  setDefaultValues: React.Dispatch<React.SetStateAction<string>>
  setSelected: React.Dispatch<React.SetStateAction<string>>
  selected: string
  defaultValues: string
}> = ({
  action,
  extensions,
  updateAction,
  setDefaultValues,
  setSelected,
  selected,
  defaultValues,
}) => {
  return (
    <div className="text-md flex items-center gap-4 text-muted-foreground">
      <span>Convert to</span>
      <Select
        onValueChange={value => {
          if (extensions.audio.includes(value)) {
            setDefaultValues('audio')
          } else if (extensions.video.includes(value)) {
            setDefaultValues('video')
          }
          setSelected(value)
          updateAction(action.file_name, value)
        }}
        value={selected}
      >
        <SelectTrigger className="text-md w-32 bg-background text-center font-medium text-muted-foreground outline-none focus:outline-none focus:ring-0">
          <SelectValue placeholder="..." />
        </SelectTrigger>
        <SelectContent className="h-fit">
          {action.file_type.includes('image') && (
            <ImageConversionOptions extensions={extensions} />
          )}
          {action.file_type.includes('video') && (
            <VideoConversionOptions
              extensions={extensions}
              defaultValues={defaultValues}
            />
          )}
          {action.file_type.includes('audio') && (
            <AudioConversionOptions extensions={extensions} />
          )}
        </SelectContent>
      </Select>
    </div>
  )
}

const ImageConversionOptions: React.FC<{
  extensions: Record<string, string[]>
}> = ({ extensions }) => (
  <div className="grid w-fit grid-cols-2 gap-2">
    {extensions.image.map((elt, i) => (
      <div key={i} className="col-span-1 text-center">
        <SelectItem value={elt} className="mx-auto">
          {elt}
        </SelectItem>
      </div>
    ))}
  </div>
)

const VideoConversionOptions: React.FC<{
  extensions: Record<string, string[]>
  defaultValues: string
}> = ({ extensions, defaultValues }) => (
  <Tabs defaultValue={defaultValues} className="w-full">
    <TabsList className="w-full">
      <TabsTrigger value="video" className="w-full">
        Video
      </TabsTrigger>
      <TabsTrigger value="audio" className="w-full">
        Audio
      </TabsTrigger>
    </TabsList>
    <TabsContent value="video">
      <div className="grid w-fit grid-cols-3 gap-2">
        {extensions.video.map((elt, i) => (
          <div key={i} className="col-span-1 text-center">
            <SelectItem value={elt} className="mx-auto">
              {elt}
            </SelectItem>
          </div>
        ))}
      </div>
    </TabsContent>
    <TabsContent value="audio">
      <div className="grid w-fit grid-cols-3 gap-2">
        {extensions.audio.map((elt, i) => (
          <div key={i} className="col-span-1 text-center">
            <SelectItem value={elt} className="mx-auto">
              {elt}
            </SelectItem>
          </div>
        ))}
      </div>
    </TabsContent>
  </Tabs>
)

const AudioConversionOptions: React.FC<{
  extensions: Record<string, string[]>
}> = ({ extensions }) => (
  <div className="grid w-fit grid-cols-2 gap-2">
    {extensions.audio.map((elt, i) => (
      <div key={i} className="col-span-1 text-center">
        <SelectItem value={elt} className="mx-auto">
          {elt}
        </SelectItem>
      </div>
    ))}
  </div>
)
