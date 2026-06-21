'use client'

import { useState } from 'react'
import { UploadCloud, X } from 'lucide-react'

interface Props {
  images: string[]
  onChange: (urls: string[]) => void
}

export default function ImageUploader({ images, onChange }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    setError('')

    const urls: string[] = []
    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || 'Upload failed')
        if (json.url) urls.push(json.url)
      }
      onChange([...images, ...urls])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const removeImage = (url: string) => {
    onChange(images.filter((img) => img !== url))
  }

  return (
    <div>
      {images.length > 0 && (
        <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((url) => (
            <div
              key={url}
              className="group relative aspect-[4/3] overflow-hidden rounded-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Remove image"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-sm border-2 border-dashed border-sand p-8 text-muted transition-colors hover:border-bark hover:text-bark">
        <UploadCloud size={28} />
        <span className="text-sm">
          {uploading ? 'Uploading…' : 'Click to upload images'}
        </span>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />
      </label>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}
