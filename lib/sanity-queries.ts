import { groq } from 'next-sanity'
import { client } from '../sanity/lib/client'

// Tipos base que retornarán las consultas
export interface SanityCourse {
  _id: string
  title: string
  slug: { current: string }
  category: string
  description: string
  overview: string
  duration: string
  modality: string
  schedule: string
  startDate: string
  price: string
  benefits: string[]
  jobOpportunities: string[]
  whatIncludes: string[]
  popular: boolean
  heroImage: any
  rating?: number
  isAsync?: boolean
  icon?: string
  requirements?: string[]
  certification?: string
  methodology?: string
  targetAudience?: string
  contactInfo?: {
    email?: string
    website?: string
    phone?: string
    socialMedia?: string
  }
}

export interface SanityRepresentante {
  _id: string
  name: string
  sede: string
  location: string
  phone: string
  image: any
}

export async function getCourses(): Promise<SanityCourse[]> {
  return client.fetch(
    groq`*[_type == "course"] | order(_createdAt asc) {
      _id,
      title,
      slug,
      category,
      description,
      overview,
      duration,
      modality,
      schedule,
      startDate,
      price,
      benefits,
      jobOpportunities,
      whatIncludes,
      popular,
      heroImage,
      rating,
      isAsync,
      icon,
      requirements,
      certification,
      methodology,
      targetAudience,
      contactInfo
    }`,
    {},
    { next: { revalidate: 60 } }
  )
}

export async function getCourseBySlug(slug: string): Promise<SanityCourse | null> {
  return client.fetch(
    groq`*[_type == "course" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      category,
      description,
      overview,
      duration,
      modality,
      schedule,
      startDate,
      price,
      benefits,
      jobOpportunities,
      whatIncludes,
      popular,
      heroImage,
      rating,
      isAsync,
      icon,
      requirements,
      certification,
      methodology,
      targetAudience,
      contactInfo
    }`,
    { slug },
    { next: { revalidate: 60 } }
  )
}

export async function getRelatedCourses(currentSlug: string): Promise<SanityCourse[]> {
  return client.fetch(
    groq`*[_type == "course" && slug.current != $currentSlug] | order(_createdAt asc)[0...3] {
      _id,
      title,
      slug,
      category,
      description,
      duration,
      modality,
      heroImage
    }`,
    { currentSlug },
    { next: { revalidate: 60 } }
  )
}

export async function getRepresentantes(): Promise<SanityRepresentante[]> {
  return client.fetch(
    groq`*[_type == "representante"] | order(sede asc) {
      _id,
      name,
      sede,
      location,
      phone,
      image
    }`,
    {},
    { next: { revalidate: 60 } }
  )
}

export async function getSedesCount(): Promise<number> {
  return client.fetch(
    groq`count(*[_type == "representante"])`,
    {},
    { next: { revalidate: 60 } }
  )
}

export interface SanitySiteSettings {
  title: string
  hero: {
    title: string
    subtitle: string
    buttonText: string
    image: any
  }
  about: {
    subtitle: string
    title: string
    description: string
    features: string[]
    image: any
    video?: { url: string }
  }
  certifications: {
    subtitle: string
    title: string
    description: string
    list: string[]
    buttonText: string
    image: any
    gallery?: {
      _type: string
      url?: string
      asset?: any
    }[]
    video?: { url: string }
  }
  contact: {
    email: string
    phone: string
    phoneRaw: string
    address: string
    mapUrl: string
    phonesList?: {
      department: string
      numbers: string[]
    }[]
    schedule?: string[]
  }
  social: {
    instagram: string
    facebook: string
    whatsapp: string
  }
  footer: {
    copyrightText: string
  }
  header: {
    campusButtonText: string
    campusUrl: string
  }
  jobBoard?: {
    badge: string
    title: string
    subtitle: string
    description: string
    stats: { value: string; label: string }[]
    buttonText: string
    buttonUrl: string
    image: any
  }
  coursesHero?: {
    titleTitlePart1?: string
    titlePart1: string
    titleHighlight: string
    subtitle: string
    image: any
  }
  sedesHero?: {
    titlePart1: string
    titleHighlight: string
    titlePart2: string
    subtitle: string
    image: any
    features: { title: string; description: string }[]
  }
  contactPage?: {
    heroTitle: string
    heroImage: any
    benefitsTitle: string
    benefits: { title: string; description: string }[]
  }
}

export async function getSiteSettings(): Promise<SanitySiteSettings | null> {
  return client.fetch(
    groq`*[_type == "siteSettings"][0]{
      ...,
      about {
        ...,
        video { ..., "url": asset->url }
      },
      certifications {
        ...,
        gallery[]{
          ...,
          "url": asset->url
        },
        video { ..., "url": asset->url }
      }
    }`,
    {},
    { next: { revalidate: 0 } }
  )
}
