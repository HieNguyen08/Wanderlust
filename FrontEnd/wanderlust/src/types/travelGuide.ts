// Travel Guide Types
export interface TravelGuide {
  id: string;
  title: string;
  destination: string;
  country?: string;
  continent?: string;
  category?: string;
  description: string;
  content?: string;
  readTime?: string;
  coverImage: string;
  images?: string[];
  authorId?: string;
  authorName?: string;
  tags?: string[];
  views?: number;
  likes?: number;
  duration?: number;
  type?: "destination" | "blog" | "region" | "attraction";
  difficulty?: "easy" | "moderate" | "challenging";
  attractions?: Attraction[];
  tips?: Tip[];
  published?: boolean;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Attraction {
  name: string;
  image: string;
  description?: string;
}

export interface Tip {
  title: string;
  content: string;
  icon?: string;
}

// Request DTO for creating/updating travel guides
export interface TravelGuideRequest {
  title: string;
  destination: string;
  country?: string;
  continent?: string;
  category?: string;
  description: string;
  content?: string;
  readTime?: string;
  coverImage: string;
  images?: string[];
  authorId?: string;
  authorName?: string;
  tags?: string[];
  duration?: number;
  type?: string;
  difficulty?: string;
  attractions?: Attraction[];
  tips?: Tip[];
  published?: boolean;
  featured?: boolean;
}
