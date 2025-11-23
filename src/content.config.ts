// 1. Import utilities from `astro:content`
import { defineCollection, z } from 'astro:content'

// 2. Import loader(s)
import { glob } from 'astro/loaders'

// 3. Define your collection(s)
const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
  }),
})

const blogs = defineCollection({
  // Schema should match the properties your Notion utility produces.
  schema: z.object({
    // human-friendly title (required)
    title: z.string(),

    // short description / excerpt (required)
    description: z.string(),

    // slug as stored in Notion (required)
    slug: z.string(),

    // publication datetime (use Date type so CollectionEntry<"blogs"> has a Date)
    pubDatetime: z.date(),

    // last modified datetime
    modDatetime: z.date(),

    // author name
    author: z.string(),

    // boolean flags
    featured: z.boolean().optional().default(false),

    // tags array
    tags: z.array(z.string()).optional().default([]),

    // status
    status: z.string(),

    // optional Notion page id (if you want to keep it)
    id: z.string().optional(),
  }),
});

// 4. Export a single `collections` object to register you collection(s)
export const collections = { projects, blogs }
