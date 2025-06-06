'use client'
import { Drawer } from "./drawer"
import { usePointerEvents } from "@/hooks/usePointerEvents"

interface DrawerWrapperProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

export function DrawerWrapper({
  open,
  onOpenChange,
  children,
}: DrawerWrapperProps) {
  usePointerEvents(open)

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
    >
      {children}
    </Drawer>
  )
}
