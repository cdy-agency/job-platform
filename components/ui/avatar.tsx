"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn, getImage } from "@/lib/utils"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }

// AppAvatar: centralized avatar rendering with initials fallback
export function AppAvatar({
  image,
  name,
  className,
  size = 40,
}: {
  image?: unknown
  name?: string
  className?: string
  size?: number
}) {
  const src = getImage(image)
  const initials = React.useMemo(() => {
    const base = (name || '').trim()
    if (!base) return 'U'
    const parts = base.split(/\s+/).filter(Boolean)
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase()
  }, [name])
  const dimension = `${size}px`

  return (
    <div className={cn("inline-flex", className)} style={{ width: dimension, height: dimension }}>
      <Avatar className="h-full w-full">
        {src ? (
          <AvatarImage src={src} alt={name || 'avatar'} className="object-cover" />
        ) : null}
        <AvatarFallback className="bg-gray-200 text-gray-700 text-xs font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>
    </div>
  )
}
