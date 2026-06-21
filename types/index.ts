export type UserRole = 'admin' | 'user'

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Property {
  id: string
  title: string
  description: string
  price: number
  price_type: 'sale' | 'rent'
  location: string
  city: string
  bedrooms: number
  bathrooms: number
  area: number
  property_type: 'apartment' | 'villa' | 'penthouse' | 'house'
  images: string[]
  amenities: string[]
  featured: boolean
  status: 'available' | 'sold' | 'rented'
  created_at: string
  updated_at: string
}

export interface Inquiry {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  status: 'new' | 'contacted' | 'closed'
  property_id?: string
  property?: Pick<Property, 'title' | 'city'> | null
  created_at: string
}

export type PropertyFilters = {
  city?: string
  property_type?: string
  price_min?: number
  price_max?: number
  bedrooms?: number
  bathrooms?: number
  area_min?: number
  keyword?: string
  status?: 'available' | 'sold' | 'rented'
  price_type?: 'sale' | 'rent'
  featured?: boolean
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'featured'
  page?: number
  limit?: number
}

export interface PropertiesResponse {
  properties: Property[]
  total: number
  page: number
  pages: number
}
