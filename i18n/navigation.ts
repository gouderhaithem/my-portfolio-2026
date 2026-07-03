import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

// Locale-aware drop-ins for next/link & next/navigation, used by all public
// pages/components. The /admin area keeps plain next/link (it isn't localized).
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
