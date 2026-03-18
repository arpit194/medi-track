import type { ReactNode } from 'react'

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <div className="text-center">
          <span className="font-serif text-2xl font-semibold text-primary">MediTrack</span>
        </div>
        {children}
      </div>
    </div>
  )
}
