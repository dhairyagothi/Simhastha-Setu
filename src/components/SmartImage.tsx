import React, { useState } from 'react'

type SmartImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallbackTitle: string
  fallbackSubtitle?: string
}

export default function SmartImage({ fallbackTitle, fallbackSubtitle, className = '', onError, ...props }: SmartImageProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className={`flex items-end justify-start bg-gradient-to-br from-orange-500 via-amber-400 to-orange-100 text-white ${className}`}>
        <div className="w-full bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-100">SimhasthaSetu</div>
          <div className="mt-2 text-lg font-bold">{fallbackTitle}</div>
          {fallbackSubtitle ? <div className="mt-1 text-sm text-orange-50/90">{fallbackSubtitle}</div> : null}
        </div>
      </div>
    )
  }

  return (
    <img
      {...props}
      className={className}
      onError={(event) => {
        setFailed(true)
        onError?.(event)
      }}
    />
  )
}
