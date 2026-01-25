'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, PenTool, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import Image from 'next/image'
import { getSupabase } from '@/lib/supabase/client'

interface SignatureUploadProps {
  currentSignatureUrl?: string | null
  onSignatureChange: (url: string | null) => void
}

export function SignatureUpload({ currentSignatureUrl, onSignatureChange }: SignatureUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentSignatureUrl || null)
  const { toast } = useToast()

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Signature must be less than 2MB',
          variant: 'destructive',
        })
        return
      }

      setUploading(true)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'signature')

      try {
        let response = await fetch('/api/upload-logo', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        })

        // Handle 401 by refreshing session and retrying
        if (response.status === 401) {
          await getSupabase().auth.refreshSession()
          response = await fetch('/api/upload-logo', {
            method: 'POST',
            body: formData,
            credentials: 'include',
          })
        }

        if (response.ok) {
          const { url } = await response.json()
          onSignatureChange(url)
          toast({
            title: 'Signature uploaded',
            description: 'Your signature has been uploaded successfully',
          })
        } else {
          const { error } = await response.json()
          toast({
            title: 'Upload failed',
            description: error || 'Failed to upload signature',
            variant: 'destructive',
          })
          setPreview(currentSignatureUrl || null)
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to upload signature',
          variant: 'destructive',
        })
        setPreview(currentSignatureUrl || null)
      } finally {
        setUploading(false)
      }
    },
    [currentSignatureUrl, onSignatureChange, toast]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.svg'],
    },
    maxFiles: 1,
    disabled: uploading,
  })

  const handleRemove = () => {
    setPreview(null)
    onSignatureChange(null)
    toast({
      title: 'Signature removed',
      description: 'Your signature has been removed',
    })
  }

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative">
          <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="relative w-full h-24 flex items-center justify-center">
              <Image
                src={preview}
                alt="Signature"
                width={200}
                height={96}
                className="object-contain max-h-full"
              />
            </div>
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemove}
            disabled={uploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400'
          } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
              <p className="text-gray-600 text-sm">Uploading signature...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <PenTool className="h-10 w-10 text-gray-400" />
              {isDragActive ? (
                <p className="text-blue-600 text-sm">Drop the signature here</p>
              ) : (
                <>
                  <p className="text-gray-600 text-sm">
                    Drag & drop your signature, or click to select
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, SVG (max 2MB)
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
