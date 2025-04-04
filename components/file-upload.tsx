"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, ImageIcon, X } from "lucide-react"
import Image from "next/image"

export function FileUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const clearFile = () => {
    setFile(null)
    setPreview(null)
  }

  return (
    <div className="space-y-4">
      {!preview ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 h-[180px]">
          <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-2">Drag and drop or click to upload</p>
          <Input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="image-upload" />
          <label htmlFor="image-upload">
            <Button variant="outline" size="sm" className="cursor-pointer" asChild>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                Select Image
              </span>
            </Button>
          </label>
        </div>
      ) : (
        <div className="relative">
          <div className="relative h-[180px] w-full rounded-md overflow-hidden">
            <Image src={preview || "/placeholder.svg"} alt="Preview" fill className="object-contain" />
          </div>
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full"
            onClick={clearFile}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, GIF, SVG. Max size: 5MB</p>
    </div>
  )
}

