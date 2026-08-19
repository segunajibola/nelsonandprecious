export interface LoveStoryEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  image: string;
}

export type GalleryCategory = "Candid" | "Traditional" | "Proposal";

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: GalleryCategory;
  width: number;
  height: number;
}

export interface VenueDetail {
  heading: string;
  name: string;
  date?: string;
  time: string;
  address: string;
  dressCode?: string;
  parking?: string;
  mapsUrl: string;
}

export interface AccommodationInfo {
  hotels: { name: string; distance: string; priceRange: string }[];
  transportation: string[];
  airportInfo: string;
  travelTips: string[];
}

export interface WeddingColor {
  name: string;
  hex: string;
}

export interface WeddingPartyMember {
  id: string;
  name: string;
  role: string;
  message?: string;
  image?: string;
}

export interface ScheduleItem {
  time: string;
  title: string;
  description?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface BankAccountInfo {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface ZoomMeetingInfo {
  link?: string;
  meetingId?: string;
  passcode?: string;
  note: string;
}

export interface PhotoOrderItem {
  order: number;
  title: string;
  description?: string;
}

export interface AboutEachOtherEntry {
  from: string;
  about: string;
  text: string;
}

export interface RsvpFormData {
  name: string;
  email: string;
  phone: string;
  attending: "yes" | "no" | "";
  guests: string;
  message: string;
}
