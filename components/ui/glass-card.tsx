import * as React from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "light" | "dark" | "auto"
  glow?: boolean
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "auto", glow = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "glass-card",
        glow && "shadow-lg shadow-purple-400/20 dark:shadow-purple-600/20",
        variant === "light" && "glass",
        variant === "dark" && "glass-dark",
        className
      )}
      {...props}
    />
  )
)
GlassCard.displayName = "GlassCard"

interface GlassCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const GlassCardHeader = React.forwardRef<
  HTMLDivElement,
  GlassCardHeaderProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
GlassCardHeader.displayName = "GlassCardHeader"

interface GlassCardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const GlassCardTitle = React.forwardRef<
  HTMLHeadingElement,
  GlassCardTitleProps
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
GlassCardTitle.displayName = "GlassCardTitle"

interface GlassCardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

const GlassCardDescription = React.forwardRef<
  HTMLParagraphElement,
  GlassCardDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm opacity-70", className)}
    {...props}
  />
))
GlassCardDescription.displayName = "GlassCardDescription"

interface GlassCardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const GlassCardContent = React.forwardRef<
  HTMLDivElement,
  GlassCardContentProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-6 pt-0", className)}
    {...props}
  />
))
GlassCardContent.displayName = "GlassCardContent"

interface GlassCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const GlassCardFooter = React.forwardRef<
  HTMLDivElement,
  GlassCardFooterProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
GlassCardFooter.displayName = "GlassCardFooter"

export {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
  GlassCardFooter,
}
