export type UserType = 'employee' | 'specialist'

export interface User {
  id: number
  email: string
  full_name: string
  user_type: UserType
}

export interface ThreatType {
  id: number
  name: string
  category?: {
    id: number
    name: string
  }
}

export interface RequestFact {
  id: number
  request_id: number
  title: string
  description: string
  screenshot_url: string
  created_at: string
}

export interface RequestItem {
  id: number
  title: string
  description: string
  status: string
  created_at: string
  result_count: number
  threat_type?: ThreatType
  creator?: User
  request_facts?: RequestFact[]
}

export interface Service {
  id: number
  title: string
  description: string
  category: string
  date: string
  price: number
  imageUrl: string
  status: string
}

export interface CreateFactRequest {
  title: string;
  description: string;
  screenshot?: File;
}

export interface RequestFactsResponse {
  facts: RequestFact[];
}

export interface RequestsListResponse {
  requests: RequestItem[];
}
