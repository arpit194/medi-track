import { useState, useRef } from 'react'
import { ExternalLinkIcon, PlusIcon, MinusIcon, Maximize2Icon, XIcon } from 'lucide-react'
import { buttonVariants } from '#/components/ui/button'
import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'
import { Dialog, DialogContent, DialogClose, DialogHeader, DialogTitle } from '#/components/ui/dialog'
import type { ReportFile } from '@medi-track/types'

function ImageViewer({ url, name, onLoadError }: { url: string; name: string; onLoadError: () => void }) {
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragOrigin = useRef<{ mx: number; my: number; ox: number; oy: number } | null>(null)

  function zoom(factor: number) {
    setScale((prev) => {
      const next = Math.min(4, Math.max(0.25, prev * factor))
      if (next <= 1) setOffset({ x: 0, y: 0 })
      return next
    })
  }

  function reset() {
    setScale(1)
    setOffset({ x: 0, y: 0 })
  }

  function onMouseDown(e: React.MouseEvent) {
    if (scale <= 1) return
    e.preventDefault()
    setIsDragging(true)
    dragOrigin.current = { mx: e.clientX, my: e.clientY, ox: offset.x, oy: offset.y }
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!isDragging || !dragOrigin.current) return
    setOffset({
      x: dragOrigin.current.ox + (e.clientX - dragOrigin.current.mx),
      y: dragOrigin.current.oy + (e.clientY - dragOrigin.current.my),
    })
  }

  function onMouseUp() {
    setIsDragging(false)
    dragOrigin.current = null
  }

  return (
    <div
      className="relative flex h-full w-full overflow-hidden select-none"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <div
        className="flex h-full w-full items-center justify-center"
        style={{ cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
        onMouseDown={onMouseDown}
      >
        <img
          src={url}
          alt={name}
          draggable={false}
          onError={onLoadError}
          className="max-h-full max-w-full object-contain rounded"
          style={{
            transform: `scale(${scale}) translate(${offset.x / scale}px, ${offset.y / scale}px)`,
            transition: isDragging ? 'none' : 'transform 0.15s ease',
          }}
        />
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-lg border border-border bg-background/90 px-2 py-1 backdrop-blur-sm shadow-sm">
        <Button size="icon-sm" variant="ghost" aria-label="Zoom out" onClick={() => zoom(0.75)}>
          <MinusIcon className="size-4" />
        </Button>
        <button
          onClick={reset}
          className="min-w-12 text-center text-xs tabular-nums text-muted-foreground hover:text-foreground transition-colors"
        >
          {Math.round(scale * 100)}%
        </button>
        <Button size="icon-sm" variant="ghost" aria-label="Zoom in" onClick={() => zoom(1.33)}>
          <PlusIcon className="size-4" />
        </Button>
        <div className="mx-1 h-4 w-px bg-border" />
        <Button size="icon-sm" variant="ghost" aria-label="Reset zoom" onClick={reset}>
          <Maximize2Icon className="size-4" />
        </Button>
      </div>
    </div>
  )
}

function PdfViewer({ url, name }: { url: string; name: string }) {
  return <iframe src={url} title={name} className="h-full w-full min-h-[60vh]" />
}

export function ReportFileViewer({
  file,
  open,
  onClose,
}: {
  file: ReportFile
  open: boolean
  onClose: () => void
}) {
  const [showAsPdf, setShowAsPdf] = useState(false)

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent showCloseButton={false} className="flex flex-col gap-0 p-0">
        <DialogHeader className="flex shrink-0 flex-row items-center gap-3 border-b border-border px-4 py-3">
          <DialogTitle className="min-w-0 flex-1 truncate text-base">{file.name}</DialogTitle>
          <div className="flex shrink-0 items-center gap-1">
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
            >
              <ExternalLinkIcon className="size-4" />
              Open in new tab
            </a>
            <DialogClose render={<Button variant="ghost" size="icon-sm" aria-label="Close" />}>
              <XIcon className="size-4" />
            </DialogClose>
          </div>
        </DialogHeader>
        <div className="flex-1 min-h-0">
          {showAsPdf ? (
            <PdfViewer url={file.url} name={file.name} />
          ) : (
            <ImageViewer url={file.url} name={file.name} onLoadError={() => setShowAsPdf(true)} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
