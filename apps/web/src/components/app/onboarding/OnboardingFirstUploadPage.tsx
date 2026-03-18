import { useRef, useState } from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
import { UploadCloudIcon, FileIcon } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { OnboardingLayout } from './OnboardingLayout'

export function OnboardingFirstUploadPage() {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  function handleFile(file: File) {
    setSelectedFile(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  async function handleContinue() {
    await navigate({ to: '/onboarding/done' })
  }

  return (
    <OnboardingLayout step={2}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="font-serif text-3xl font-medium">Add your first record</h1>
          <p className="text-muted-foreground leading-relaxed">
            Upload a medical report to get started. You can add more later.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50'
            }`}
            aria-label="Upload a file"
          >
            {selectedFile ? (
              <>
                <FileIcon className="size-8 text-primary" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-foreground">{selectedFile.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">Tap to change file</span>
              </>
            ) : (
              <>
                <UploadCloudIcon className="size-8 text-muted-foreground" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">Tap to upload a file</span>
                  <span className="text-xs text-muted-foreground">PDF, JPG, or PNG</span>
                </div>
              </>
            )}
          </button>

          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="sr-only"
            onChange={handleInputChange}
            aria-hidden="true"
            tabIndex={-1}
          />

          <Button
            size="lg"
            className="w-full"
            onClick={handleContinue}
            disabled={!selectedFile}
          >
            Upload and continue
          </Button>

          <Link
            to="/onboarding/done"
            className="text-center text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Skip for now
          </Link>
        </div>
      </div>
    </OnboardingLayout>
  )
}
