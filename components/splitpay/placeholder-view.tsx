import type { LucideIcon } from "lucide-react"

export function PlaceholderView({
  title,
  subtitle,
  icon: Icon,
}: {
  title: string
  subtitle: string
  icon: LucideIcon
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 pb-28 text-center">
      <span className="h-16 w-16 rounded-2xl bg-card border border-border flex items-center justify-center text-primary mb-4 glow-primary">
        <Icon className="h-7 w-7" />
      </span>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground text-pretty max-w-xs">{subtitle}</p>
    </div>
  )
}
