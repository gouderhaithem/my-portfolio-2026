import type { ServiceIconName } from '@/lib/services'

const PATHS: Record<ServiceIconName, React.ReactNode> = {
  web: (
    <>
      <rect x="3" y="4" width="18" height="14" rx="1.5" />
      <path d="M3 8h18" />
      <circle cx="6" cy="6" r="0.6" fill="currentColor" />
      <circle cx="8.5" cy="6" r="0.6" fill="currentColor" />
      <path d="M9 21h6" />
      <path d="M12 18v3" />
    </>
  ),
  crm: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <circle cx="17" cy="7" r="2" />
      <path d="M21 14c0-2.2-1.8-4-4-4" />
    </>
  ),
  erp: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <path d="M10 6.5h4" />
      <path d="M17.5 10v4" />
      <path d="M10 17.5h4" />
      <path d="M6.5 10v4" />
    </>
  ),
  api: (
    <>
      <path d="M8 4 3 12l5 8" />
      <path d="M16 4l5 8-5 8" />
      <path d="M13.5 7l-3 10" />
    </>
  ),
  audit: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
      <path d="M8 11.5l2 2 3.5-4" />
    </>
  ),
  support: (
    <>
      <path d="M12 3a9 9 0 0 0-9 9v4a2 2 0 0 0 2 2h1v-6H5v-0a7 7 0 0 1 14 0v0h-1v6h1a2 2 0 0 0 2-2v-4a9 9 0 0 0-9-9Z" />
      <path d="M16 18a4 4 0 0 1-4 3" />
    </>
  ),
}

/** Renders the line icon for a service, styled to inherit `currentColor`. */
export default function ServiceIcon({ name }: { name: ServiceIconName }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      {PATHS[name]}
    </svg>
  )
}
