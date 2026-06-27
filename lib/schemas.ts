import { z } from 'zod'

// Boundary validation for JSONB columns coming out of the database.
// Reads are our own data, but validating here keeps a single source of truth
// for the JSON shapes and fails loudly if a bad row is ever written.

export const contentSectionSchema = z.object({
  heading: z.string().optional(),
  paragraphs: z.array(z.string()).optional(),
  bullets: z.array(z.string()).optional(),
  quote: z.string().optional(),
})

export const contentSectionsSchema = z.array(contentSectionSchema)

export const resultsSchema = z.array(
  z.object({ label: z.string(), value: z.string() })
)
