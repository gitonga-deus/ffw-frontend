"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from"lucide-react"
import { useTheme } from"next-themes"
import { Toaster as Sonner, type ToasterProps } from"sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme ="system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-5 text-green-600" />,
        info: <InfoIcon className="size-5 text-blue-600" />,
        warning: <TriangleAlertIcon className="size-5 text-yellow-600" />,
        error: <OctagonXIcon className="size-5 text-red-600" />,
        loading: <Loader2Icon className="size-5 animate-spin text-blue-600" />,
      }}
      toastOptions={{
        classNames: {
          toast: "bg-white dark:bg-white border-border shadow-xs rounded",
          title: "text-foreground dark:text-foreground font-semibold",
          description: "text-muted-foreground dark:text-muted-foreground",
          actionButton: "bg-primary text-primary-foreground rounded",
          cancelButton: "bg-muted text-muted-foreground rounded",
        },
      }}
      style={
        {
          "--normal-bg":"#ffffff",
          "--normal-text":"hsl(var(--foreground))",
          "--normal-border":"hsl(var(--border))",
          "--border-radius":"0.375rem",
          "--success-bg":"#ffffff",
          "--success-text":"#16a34a",
          "--success-border":"#16a34a",
          "--error-bg":"#ffffff",
          "--error-text":"#dc2626",
          "--error-border":"#dc2626",
          "--warning-bg":"#ffffff",
          "--warning-text":"#ca8a04",
          "--warning-border":"#ca8a04",
          "--info-bg":"#ffffff",
          "--info-text":"#2563eb",
          "--info-border":"#2563eb",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
