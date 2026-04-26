export interface TravelPreferences {
  origin: string;
  destination: string;
  duration: string;
  budget: 'economy' | 'moderate' | 'luxury';
  interests: string[];
  travelers: 'solo' | 'couple' | 'family' | 'group';
  numTravelers: number;
  numChildren: number;
  childrenAges: string;
  hasPets: boolean;
  startDate: string;
  endDate: string;
  language: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface ItinerarySegment {
  day: number;
  activities: string[];
  location: string;
}
