'use client'
import { Dialog } from "./dialog"
import { usePointerEvents } from "@/hooks/usePointerEvents"

interface DialogWrapperProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

export function DialogWrapper({
  open,
  onOpenChange,
  children,
  className
}: DialogWrapperProps) {
  usePointerEvents(open)

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      className={className}
    >
      {children}
    </Dialog>
  )
} 