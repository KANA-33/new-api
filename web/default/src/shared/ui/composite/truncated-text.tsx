import { cn } from '@shared/lib/utils'
import { TruncatedCell } from '@shared/ui/data-table'

interface TruncatedTextProps {
  text: string
  className?: string
  maxWidth?: string
  side?: 'top' | 'bottom' | 'left' | 'right'
}

export function TruncatedText({
  text,
  className,
  maxWidth = 'max-w-[200px]',
  side = 'top',
}: TruncatedTextProps) {
  return (
    <TruncatedCell className={cn(maxWidth, className)} side={side}>
      {text}
    </TruncatedCell>
  )
}

