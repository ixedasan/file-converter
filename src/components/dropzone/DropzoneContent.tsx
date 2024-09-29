import React from 'react'
import { FiUploadCloud } from 'react-icons/fi'
import { LuFileSymlink } from 'react-icons/lu'

interface DropzoneContentProps {
  isHover: boolean
}

export const DropzoneContent: React.FC<DropzoneContentProps> = ({
  isHover,
}) => {
  return (
    <div className="space-y-4 text-foreground">
      {isHover ? (
        <>
          <div className="flex justify-center text-6xl">
            <LuFileSymlink />
          </div>
          <h3 className="text-center text-2xl font-medium">Yes, right there</h3>
        </>
      ) : (
        <>
          <div className="flex justify-center text-6xl">
            <FiUploadCloud />
          </div>
          <h3 className="text-center text-2xl font-medium">
            Click, or drop your files here
          </h3>
        </>
      )}
    </div>
  )
}
