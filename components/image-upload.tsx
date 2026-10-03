"use client"

import type React from "react"
import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Upload, X, Check, FileText, Sparkles, AlertCircle } from "lucide-react"

interface ImageUploadProps {
  onImageAnalysis: (imageData: string) => Promise<void> | void
}

export function ImageUpload({ onImageAnalysis }: ImageUploadProps) {
  const [image, setImage] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setIsUploading(true)
    setAnalysisError(null)

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

    setFileName(file.name)
    setIsUploading(true)
    setAnalysisError(null)

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

  const handleAnalyze = async () => {
    if (!image || isAnalyzing) return

    setIsAnalyzing(true)
    setAnalysisError(null)

    try {
      await onImageAnalysis(image)
    } catch (err: any) {
      console.error("Prescription analysis failed:", err)
      setAnalysisError(err?.message || "Failed to analyze prescription. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleRemoveImage = () => {
    setImage(null)
    setFileName("")
    setAnalysisError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-teal-500/30 hover:border-teal-500/60 transition-colors rounded-2xl p-6 bg-gradient-to-b from-teal-500/5 via-blue-500/5 to-transparent relative overflow-hidden shadow-inner"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className="relative flex items-center justify-center h-16 w-16 mb-4">
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-teal-500 border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
                <FileText className="h-6 w-6 text-teal-500" />
              </div>
              <p className="text-lg font-medium text-foreground">Uploading prescription...</p>
            </motion.div>
          ) : image ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full max-w-lg flex flex-col items-center"
            >
              <div className="relative w-full rounded-xl overflow-hidden shadow-xl border border-teal-500/20 bg-black/40 backdrop-blur-md">
                <img
                  src={image}
                  alt="Prescription Preview"
                  className="w-full h-auto max-h-[50vh] object-contain mx-auto"
                />

                {/* Medical Scanning Beam Effect while analyzing */}
                {isAnalyzing && (
                  <motion.div
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_15px_#2dd4bf]"
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  />
                )}

                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-3 right-3 shadow-md rounded-full hover:scale-105 transition-transform"
                  onClick={handleRemoveImage}
                  disabled={isAnalyzing}
                >
                  <X size={18} />
                </Button>
              </div>

              {fileName && (
                <p className="text-xs text-muted-foreground mt-2 truncate max-w-xs font-mono">
                  {fileName}
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center flex flex-col items-center max-w-md"
            >
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="flex items-center justify-center bg-gradient-to-tr from-teal-500 to-blue-600 p-5 rounded-2xl shadow-lg shadow-teal-500/20 mb-6 text-white"
              >
                <Upload className="h-10 w-10" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">
                Upload Prescription Image
              </h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Drag and drop your medical prescription or doctor notes here. Our AI Vision system will extract medication names, dosages, and usage instructions.
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                size="lg"
                className="px-8 shadow-md bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 text-white rounded-xl"
              >
                Select Prescription Image
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*,.pdf"
                onChange={handleFileChange}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {analysisError && (
        <div className="flex items-center gap-2 p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <p>{analysisError}</p>
        </div>
      )}

      {image && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Button
            className="w-full py-6 text-lg font-bold shadow-lg bg-gradient-to-r from-teal-600 via-blue-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white rounded-xl transition-all duration-300"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            size="lg"
          >
            {isAnalyzing ? (
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Sparkles className="h-5 w-5" />
                </motion.div>
                Scanning & Extracting Prescription Data...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Check size={20} /> Analyze Prescription with AI
              </div>
            )}
          </Button>
        </motion.div>
      )}
    </div>
  )
}
