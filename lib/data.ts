import type {
  AboutEachOtherEntry,
  AccommodationInfo,
  BankAccountInfo,
  FaqItem,
  GalleryImage,
  LoveStoryEvent,
  PhotoOrderItem,
  ScheduleItem,
  VenueDetail,
  WeddingColor,
  WeddingPartyMember,
  ZoomMeetingInfo,
} from "@/types";

export const couple = {
  brideName: "Precious",
  groomName: "Nelson",
  brideFullName: "Precious Chiamaka Eze",
  groomFullName: "Nelson Ifeanyi Okafor",
  hashtag: "#LoveNAP26",
  weddingDateISO: "2026-09-26T12:00:00",
  weddingDateDisplay: "September 26, 2026",
  tagline: "Two Hearts, One Beginning",
  heroImage: "/images/couple-hero.jpeg",
};

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Details", href: "/details" },
  { label: "RSVP", href: "/details#rsvp" },
  { label: "Gallery", href: "/gallery#gallery" },
  { label: "Our Story", href: "/gallery#our-story" },
  { label: "Wedding Party", href: "/gallery#wedding-party" },
  { label: "FAQ", href: "/details#faq" },
];

export const loveStory: LoveStoryEvent[] = [
  {
    id: "first-date",
    title: "First Date",
    date: "June 2020",
    description:
      "Nelson invited Precious out for coffee that turned into a four-hour conversation. They talked until the cafe closed and neither of them wanted the night to end.",
    image: "/images/couple-candid-1.jpeg",
  },
  {
    id: "engagement",
    title: "Engagement",
    date: "December 2025",
    description:
      "On a quiet evening surrounded by fairy lights, Nelson asked Precious to be his forever. She said yes through happy tears, and their families celebrated late into the night.",
    image: "/images/couple-proposal.jpeg",
  },
  {
    id: "wedding-day",
    title: "Wedding Day",
    date: "September 26, 2026",
    description:
      "The day it all becomes official — surrounded by the family and friends who have walked this journey with Nelson and Precious from the very start.",
    image: "/images/wedding-welcome-card.jpeg",
  },
];

export const aboutEachOther: AboutEachOtherEntry[] = [
  {
    from: "Nelson",
    about: "Precious",
    text: "Precious brings out the best in me. Her kindness, her laugh, and the way she makes any room feel like home — she is the person I look forward to building every tomorrow with.",
  },
  {
    from: "Precious",
    about: "Nelson",
    text: "Nelson's patience and generous heart are what drew me to him first. He is my biggest supporter and my safest place, and I can't wait to become his wife.",
  },
];

export const galleryImages: GalleryImage[] = [
  {
    id: "g1",
    src: "/images/couple-hero.jpeg",
    alt: "Nelson and Precious smiling together",
    category: "Candid",
    width: 1500,
    height: 2000,
  },
  {
    id: "g2",
    src: "/images/couple-candid-1.jpeg",
    alt: "A candid moment between Nelson and Precious",
    category: "Candid",
    width: 1500,
    height: 2000,
  },
  {
    id: "g3",
    src: "/images/couple-traditional-1.jpeg",
    alt: "Nelson and Precious dressed up together",
    category: "Traditional",
    width: 810,
    height: 1080,
  },
  {
    id: "g4",
    src: "/images/couple-traditional-2.jpeg",
    alt: "Nelson and Precious in traditional outfits",
    category: "Traditional",
    width: 750,
    height: 1000,
  },
  {
    id: "g5",
    src: "/images/couple-traditional-3.jpeg",
    alt: "Nelson and Precious in traditional attire",
    category: "Traditional",
    width: 756,
    height: 1000,
  },
  {
    id: "g6",
    src: "/images/couple-proposal.jpeg",
    alt: "The proposal moment",
    category: "Proposal",
    width: 810,
    height: 1080,
  },
];

export const event: VenueDetail = {
  heading: "Wedding Ceremony & Reception",
  name: "Purple Garden Event Center",
  date: "September 26, 2026",
  time: "12:00 PM",
  address: "Beside MFM Southwest 1 Headquarters, Obantoko, Abeokuta, Ogun State, Nigeria",
  dressCode: "Peach & Navy Blue",
  parking: "Complimentary valet and on-site parking available for guests",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(
      "Purple Garden Event Center, beside MFM Southwest 1 Headquarters, Obantoko, Abeokuta, Ogun State, Nigeria"
    ),
};

export const accommodation: AccommodationInfo = {
  hotels: [
    {
      name: "Moongate Hotel and Suites, Obantoko",
      distance: "Km 8, Abeokuta/Ibadan Expressway (Opposite Winners Chapel), Obantoko — close to the venue",
      priceRange: "$$",
    },
    {
      name: "BG Hotel",
      distance: "1 Abeokuta/Ibadan Expressway, Camp Junction, Obantoko — close to the venue",
      priceRange: "$$",
    },
  ],
  transportation: [
    "Ride-hailing apps (Bolt) and local taxis are available in Abeokuta",
  ],
  airportInfo:
    "The nearest international airport is Murtala Muhammed International Airport (LOS) in Lagos, approximately 1.5–2 hours from Abeokuta via the Lagos–Ibadan Expressway, traffic permitting.",
  travelTips: [
    "Abeokuta/Ibadan Expressway traffic can build up, especially closer to the weekend — please plan to arrive at least 30 minutes early",
    "Light, breathable formalwear is recommended given the weather",
  ],
};

export const zoomMeeting: ZoomMeetingInfo = {
  note: "Can't make it in person? Livestream details will be shared here closer to the wedding day — check back soon.",
};

export const weddingColors: WeddingColor[] = [
  { name: "Peach", hex: "#ffcba4" },
  { name: "Navy Blue", hex: "#1c2841" },
];

export const bridalParty: WeddingPartyMember[] = [
  {
    id: "bride",
    name: "Precious Chiamaka Eze",
    role: "Bride",
    message: "Marrying my best friend and my greatest adventure.",
  },
  { id: "bm1", name: "Chiamaka Nwosu", role: "Bride's Maid" },
  { id: "bm2", name: "Blessing Umeh", role: "Bride's Maid" },
  { id: "bm3", name: "Faith Okonkwo", role: "Bride's Maid" },
  { id: "bm4", name: "Ifeoma Chukwu", role: "Bride's Maid" },
  { id: "bm5", name: "Grace Adeyemi", role: "Bride's Maid" },
  { id: "bm6", name: "Victory Nnamdi", role: "Bride's Maid" },
];

export const asoEbi: WeddingPartyMember[] = [
  { id: "ae1", name: "Ugochi Eze", role: "Chief Bride's Maid" },
  { id: "ae2", name: "Nkechi Eze", role: "Aso Ebi" },
  { id: "ae3", name: "Adaeze Okoro", role: "Aso Ebi" },
  { id: "ae4", name: "Oluwaseun Bakare", role: "Aso Ebi" },
  { id: "ae5", name: "Rita Anyanwu", role: "Aso Ebi" },
  { id: "ae6", name: "Temitope Alade", role: "Aso Ebi" },
  { id: "ae7", name: "Chidinma Okeke", role: "Aso Ebi" },
];

export const groomParty: WeddingPartyMember[] = [
  {
    id: "groom",
    name: "Nelson Ifeanyi Okafor",
    role: "Groom",
    message: "Every day with her feels like the beginning of something beautiful.",
  },
  { id: "gm1", name: "Emmanuel Okafor", role: "Groomsman" },
  { id: "gm2", name: "David Chukwuemeka", role: "Groomsman" },
  { id: "gm3", name: "Samuel Eze", role: "Groomsman" },
  { id: "gm4", name: "Tobi Adebayo", role: "Groomsman" },
];

export const schedule: ScheduleItem[] = [
  {
    time: "11:30 AM",
    title: "Guests Arrive",
    description: "Please be seated by 11:45 AM",
  },
  { time: "12:00 PM", title: "Ceremony Begins" },
  {
    time: "1:15 PM",
    title: "Photography",
    description: "Family and wedding party portraits",
  },
  { time: "1:45 PM", title: "Lunch & Cocktail Hour" },
  {
    time: "3:00 PM",
    title: "Dance",
    description: "First dance followed by open floor",
  },
  { time: "4:30 PM", title: "Farewell, but party continues" },
];

export const photoOrder: PhotoOrderItem[] = [
  { order: 1, title: "Bride & Groom" },
  { order: 2, title: "Immediate Families" },
  { order: 3, title: "Groomsmen & Groom" },
  { order: 4, title: "Bridal Train & Bride" },
  { order: 5, title: "Extended Family" },
  { order: 6, title: "Friends & Colleagues" },
];

export const faqs: FaqItem[] = [
  {
    question: "What is the dress code?",
    answer:
      "We'd love to see our wedding colors — peach and navy blue — represented, though it is not required. Come as you feel most comfortable, and please dress for the weather.",
  },
  {
    question: "Can I bring a plus one?",
    answer:
      "Plus ones are welcome for guests whose invitation specifically indicates so. Please check your invitation or reach out to us directly if you're unsure.",
  },
  {
    question: "Where should I park?",
    answer:
      "Complimentary valet and on-site parking are available for all guests at the venue.",
  },
  {
    question: "Are children invited?",
    answer: "We love to see your little ones, please come with them.",
  },
  {
    question: "What time should I arrive?",
    answer:
      "Please arrive by 11:30 AM to be seated before the ceremony begins at 12:00 PM. Given expressway traffic, we recommend leaving with plenty of buffer time.",
  },
];

// Placeholder only — replace with the couple's real bank details before sharing this site with guests.
export const giftAccounts: BankAccountInfo[] = [
  {
    bankName: "Add bank name",
    accountNumber: "0000000000",
    accountName: "Nelson Ifeanyi Okafor (update before sharing)",
  },
  {
    bankName: "Add bank name",
    accountNumber: "0000000000",
    accountName: "Precious Chiamaka Eze (update before sharing)",
  },
];

export const appreciation =
  "Thank you for being part of our journey. Your presence, love, and support mean the world to us as we begin this new chapter together.";

export const thankYouNote =
  "To our family and friends — thank you for every prayer, every word of encouragement, and every way you've shown us love along the way. We are endlessly grateful to have you with us as we start our forever. With all our love, Nelson & Precious.";
