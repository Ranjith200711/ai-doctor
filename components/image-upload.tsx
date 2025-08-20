"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, Check, Loader2 } from "lucide-react"

interface ImageUploadProps {
  onImageAnalysis: (imageData: string) => void
}

export function ImageUpload({ onImageAnalysis }: ImageUploadProps) {
  const [image, setImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    const reader = new FileReader()
    reader.onload = (event) => {
      setImage(event.target?.result as string)
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file) return

    setIsUploading(true)

    const reader = new FileReader()
    reader.onload = (event) => {
      setImage(event.target?.result as string)
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleAnalyze = () => {
    if (!image) return

    setIsAnalyzing(true)

    // Simulate analysis delay
    setTimeout(() => {
      onImageAnalysis(image)
      setIsAnalyzing(false)
    }, 2000)
  }

  const handleRemoveImage = () => {
    setImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-primary/20 rounded-lg p-8 mb-4 bg-primary/5"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {isUploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium">Uploading image...</p>
          </div>
        ) : image ? (
          <div className="relative w-full max-w-md">
            <img
              src={image || "/placeholder.svg"}
              alt="Prescription"
              className="w-full h-auto rounded-lg object-contain max-h-[60vh] shadow-lg"
            />
            <Button variant="destructive" size="icon" className="absolute top-2 right-2" onClick={handleRemoveImage}>
              <X size={16} />
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <div className="flex items-center justify-center bg-primary/10 p-6 rounded-full mx-auto mb-6">
              <Upload className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Upload Prescription Image</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md">
              Drag and drop your prescription image here, or click to browse. We support JPG, PNG and PDF files.
            </p>
            <Button onClick={() => fileInputRef.current?.click()} size="lg" className="px-8">
              Select Image
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*,.pdf"
              onChange={handleFileChange}
            />
          </div>
        )}
      </div>

      {image && (
        <Button className="w-full py-6 text-lg" onClick={handleAnalyze} disabled={isAnalyzing} size="lg">
          {isAnalyzing ? (
            <>
              <Loader2 size={20} className="mr-2 animate-spin" />
              Analyzing Prescription...
            </>
          ) : (
            <>
              <Check size={20} className="mr-2" /> Analyze Prescription
            </>
          )}
        </Button>
      )}
    </div>
  )
}

