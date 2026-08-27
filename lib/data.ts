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
  VideoItem,
  WeddingColor,
  WeddingPartyMember,
  ZoomMeetingInfo,
} from "@/types";

export const couple = {
  brideName: "Precious",
  groomName: "Nelson",
  brideFullName: "Opeyemi Precious Bamidele",
  groomFullName: "Nelson Ugochukwu Nwabekee",
  hashtag: "#PNLockedIn",
  weddingDateISO: "2026-09-26T12:00:00",
  weddingDateDisplay: "September 26, 2026",
  tagline: "Two Hearts, One Beginning",
  heroImage: "/images/couple-formal-3.jpeg",
};

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Details", href: "/details" },
  { label: "RSVP", href: "/details#rsvp" },
  { label: "Gallery", href: "/gallery#gallery" },
  { label: "Videos", href: "/gallery#videos" },
  { label: "Our Story", href: "/gallery#our-story" },
  { label: "Wedding Party", href: "/gallery#wedding-party" },
  { label: "FAQ", href: "/details#faq" },
];

export const loveStory: LoveStoryEvent[] = [
  {
    id: "first-date",
    title: "First Date",
    date: "June 2024",
    description:
      "Nelson invited Precious for coffee that turned into a four-hour conversation. They talked until the cafe closed and neither of them wanted the night to end.",
    image: "/images/couple-first-date.jpeg",
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
    image: "/images/wedding-invitation.jpeg",
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
    alt: "A cozy candid moment between Nelson and Precious",
    category: "Candid",
    width: 1500,
    height: 2000,
  },
  {
    id: "g3",
    src: "/images/couple-candid-2.jpeg",
    alt: "Nelson and Precious sharing a playful moment",
    category: "Candid",
    width: 1500,
    height: 2000,
  },
  {
    id: "g4",
    src: "/images/couple-formal-1.jpeg",
    alt: "Nelson and Precious in a formal black-and-white portrait",
    category: "Studio",
    width: 810,
    height: 1080,
  },
  {
    id: "g5",
    src: "/images/couple-formal-2.jpeg",
    alt: "Nelson and Precious dressed up in red and navy",
    category: "Studio",
    width: 810,
    height: 1080,
  },
  {
    id: "g6",
    src: "/images/couple-formal-3.jpeg",
    alt: "Nelson and Precious in an elegant embrace",
    category: "Studio",
    width: 810,
    height: 1080,
  },
  {
    id: "g7",
    src: "/images/couple-proposal.jpeg",
    alt: "Nelson and Precious under fairy lights",
    category: "Proposal",
    width: 1500,
    height: 2000,
  },
  {
    id: "g8",
    src: "/images/couple-traditional-1.jpeg",
    alt: "Nelson and Precious in traditional attire",
    category: "Traditional",
    width: 1500,
    height: 2000,
  },
  {
    id: "g9",
    src: "/images/couple-candid-3.jpeg",
    alt: "Nelson and Precious out and about together",
    category: "Candid",
    width: 1500,
    height: 2000,
  },
  {
    id: "g10",
    src: "/images/couple-candid-4.jpeg",
    alt: "Nelson and Precious dressed up together outdoors",
    category: "Candid",
    width: 1500,
    height: 2000,
  },
];

export const videoMoments: VideoItem[] = [
  {
    id: "v1",
    src: "/images/couple-clip-1.mp4",
    caption: "A candid moment with Nelson and Precious",
    width: 576,
    height: 1024,
  },
  {
    id: "v2",
    src: "/images/couple-clip-2.mp4",
    caption: "Nelson and Precious in motion",
    width: 576,
    height: 1024,
  },
];

export const ceremonyVenue: VenueDetail = {
  heading: "Wedding Ceremony",
  name: "Kingdom Hall",
  date: "September 26, 2026",
  time: "10:30 AM – 11:30 AM",
  address: "Address to be shared soon — check back closer to the date.",
};

export const event: VenueDetail = {
  heading: "Wedding Reception",
  name: "Purple Garden Event Center",
  date: "September 26, 2026",
  time: "12:00 PM",
  address:
    "Beside MFM Southwest 1 Headquarters, Obantoko, Abeokuta, Ogun State, Nigeria",
  dressCode: "White & Peach",
  parking: "Complimentary valet and on-site parking available for guests",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(
      "Purple Garden Event Center, beside MFM Southwest 1 Headquarters, Obantoko, Abeokuta, Ogun State, Nigeria",
    ),
};

export const accommodation: AccommodationInfo = {
  hotels: [
    {
      name: "Moongate Hotel and Suites, Obantoko",
      distance:
        "Km 8, Abeokuta/Ibadan Expressway (Opposite Winners Chapel), Obantoko — close to the venue",
      priceRange: "$$",
    },
    {
      name: "BG Hotel",
      distance:
        "1 Abeokuta/Ibadan Expressway, Camp Junction, Obantoko — close to the venue",
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
  { name: "White", hex: "#ffffff" },
  { name: "Peach", hex: "#ffcba4" },
];

export const bridalParty: WeddingPartyMember[] = [
  {
    id: "bride",
    name: "Opeyemi Precious Bamidele",
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
    name: "Nelson Ugochukwu Nwabekee",
    role: "Groom",
    message:
      "Every day with her feels like the beginning of something beautiful.",
  },
  { id: "gm1", name: "Emmanuel Okafor", role: "Groomsman" },
  { id: "gm2", name: "David Chukwuemeka", role: "Groomsman" },
  { id: "gm3", name: "Samuel Eze", role: "Groomsman" },
  { id: "gm4", name: "Tobi Adebayo", role: "Groomsman" },
];

export const schedule: ScheduleItem[] = [
  {
    time: "10:30 AM",
    title: "Wedding Ceremony",
    description:
      "At the Kingdom Hall — address to be shared closer to the date",
  },
  {
    time: "12:00 PM",
    title: "Reception Begins",
    description: "Purple Garden Event Center",
  },
];

export const receptionProgramme: PhotoOrderItem[] = [
  { order: 1, title: "Guest Arrival" },
  { order: 2, title: "Brief Welcome by the MC" },
  { order: 3, title: "Groom's Family Grand Entrance" },
  { order: 4, title: "Bride's Family Grand Entrance" },
  { order: 5, title: "Bridesmaids and Groomsmen Grand Entrance" },
  { order: 6, title: "Bride and Groom Official Entrance" },
  { order: 7, title: "Energizer Session by the MC" },
  { order: 8, title: "Opening Prayer" },
  { order: 9, title: "Chairman's Opening Remark" },
  { order: 10, title: "Cake Cutting" },
  {
    order: 11,
    title: "Couple's First Dance",
    description: "In classic outfit",
  },
  { order: 12, title: "Audience Game" },
  {
    order: 13,
    title: "Couple's Second Entrance",
    description: "Groom with Groomsmen / Agbada Dance",
  },
  {
    order: 14,
    title: "Couple's Second Entrance",
    description: "Bride with Bridesmaids / Asoebi Dance",
  },
  {
    order: 15,
    title: "Fun Time",
    description: "Men in Agbada vs Asoebi Ladies",
  },
  { order: 16, title: "Presentation of Gifts" },
  {
    order: 17,
    title: "Bride & Bride's Father Dance",
    description: "Mother joins later",
  },
  {
    order: 18,
    title: "Groom & Groom's Mother Dance",
    description: "Father joins later",
  },
  { order: 19, title: "Chairman's Closing Speech" },
  { order: 20, title: "Groom's Vote of Thanks" },
  { order: 21, title: "Closing Prayer" },
  { order: 22, title: "Let's Dance!" },
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
      "We'd love to see our wedding colors — white and peach — represented, though it is not required. Come as you feel most comfortable, and please dress for the weather.",
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
    answer:
      "As much as we love your little ones, we've kept our celebration an adults-only affair. We appreciate you making arrangements for childcare on the day.",
  },
  {
    question: "What time should I arrive?",
    answer:
      "The wedding ceremony holds at the Kingdom Hall from 10:30 AM to 11:30 AM, and the reception begins at 12:00 PM at Purple Garden Event Center. Given expressway traffic, we recommend leaving with plenty of buffer time.",
  },
];

export const giftAccounts: BankAccountInfo[] = [
  {
    bankName: "Opay",
    accountNumber: "8057454364",
    accountName: "Nelson Ugochukwu Nwabekee",
  },
  {
    bankName: "Opay",
    accountNumber: "7067649742",
    accountName: "Opeyemi Precious Bamidele",
  },
];

export const appreciation =
  "Thank you for being part of our journey. Your presence, love, and support mean the world to us as we begin this new chapter together.";

export const thankYouNote =
  "To our family and friends — thank you for every prayer, every word of encouragement, and every way you've shown us love along the way. We are endlessly grateful to have you with us as we start our forever. With all our love, Nelson & Precious.";
