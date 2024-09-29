import Link from 'next/link'
import { FileHeart, Heart } from 'lucide-react'

import Dropzone from '@/components/Dropzone'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'

export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-between p-6">
      <header className="flex w-full items-center justify-between pb-6 pt-8 md:pt-10">
        <FileHeart size={32} className="text-primary" />
        <ThemeSwitcher />
      </header>
      <main className="flex justify-center">
        <div>
          <div className="mb-5">
            <h1 className="my-6 p-2 text-center text-4xl font-bold text-primary">
              File Converter
            </h1>
            <p className="text-secondary-foreground">
              Easily convert your files into different formats in just a few
              clicks. Whether it's video, audio, or images, we've got you
              covered. Fast, simple, and efficient file conversions at your
              fingertips.
            </p>
          </div>

          <Dropzone />
        </div>
      </main>
      <footer>
        <p className="py-8 text-center text-gray-500">
          Made with <Heart className="mb-1 inline-block text-primary" /> by{' '}
          <Link
            href="https://github.com/ixedasan"
            target="_blank"
            className="text-lg text-primary"
          >
            ixedasan
          </Link>
        </p>
      </footer>
    </div>
  )
}
