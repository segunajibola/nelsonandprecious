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
  rsvpDeadlineISO: "2026-09-21T23:59:59",
  rsvpDeadlineDisplay: "September 21, 2026",
  tagline: "Two Hearts, One Beginning",
  heroImage: "/images/couple-formal-3.jpeg",
};

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Details", href: "/details" },
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
    date: "August 2023",
    description:
      "Nelson invited Precious for coffee that turned into a four-hour conversation. They talked until the cafe closed and neither of them wanted the night to end.",
    image: "/images/couple-first-date.jpeg",
  },
  {
    id: "engagement",
    title: "Engagement",
    date: "November 2025",
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
    id: "g10",
    src: "/images/couple-candid-4.jpeg",
    alt: "Nelson and Precious dressed up together outdoors",
    category: "Candid",
    width: 1500,
    height: 2000,
  },
  {
    id: "g11",
    src: "/images/couple-candid-5.jpeg",
    alt: "Nelson and Precious celebrating a graduation together",
    category: "Candid",
    width: 1500,
    height: 2000,
  },
  {
    id: "g12",
    src: "/images/couple-candid-6.jpeg",
    alt: "Nelson and Precious sharing a playful selfie",
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
  {
    id: "v3",
    src: "/images/couple-clip-3.mp4",
    caption: "Another candid moment with Nelson and Precious",
    width: 1024,
    height: 576,
  },
];

export const ceremonyVenue: VenueDetail = {
  heading: "Wedding Ceremony",
  name: "Kingdom Hall of Jehovah's Witness",
  date: "September 26, 2026",
  time: "10:30 AM – 11:30 AM",
  address:
    "Block XI, B1 Extension, Federal Housing Estate, Ita Elega, Abeokuta, Ogun State",
  parking: "Complimentary valet and on-site parking available for guests",
  mapsUrl: "https://www.google.com/maps?q=7.191373,3.356954",
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
  link: "https://us05web.zoom.us/j/7796674079?pwd=LYPpInD47pRQTZTd9y44hhiLkEuSe8.1",
  meetingId: "779 667 4079",
  passcode: "Xz412N",
  note: "Can't make it in person? Livestream details will be shared here closer to the wedding day — check back soon.",
  image:
    "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&w=800&q=80",
};

export const weddingColors: WeddingColor[] = [
  { name: "White", hex: "#ffffff" },
  { name: "Peach", hex: "#ffcba4" },
];

export const bridalParty: WeddingPartyMember[] = [
  {
    id: "bride",
    name: "Bamidele Precious Opeyemi",
    role: "Bride",
    message: "Marrying my best friend and my greatest adventure.",
  },
  { id: "chief-bridesmaid", name: "Andrew Blessing Adeola", role: "Chief Bride's Maid" },
  { id: "little-bride", name: "Ataikun Rejoice", role: "Little Bride" },
  { id: "bt1", name: "Titilayo Oyindamola L.", role: "Bridal Train" },
  { id: "bt2", name: "Okpere Jemimah Oseiwe", role: "Bridal Train" },
  { id: "bt3", name: "Abigeal Abike Olumuyiwa", role: "Bridal Train" },
  { id: "bt4", name: "Olajumoke Ojo", role: "Bridal Train" },
];

export const asoEbiLadies: WeddingPartyMember[] = [
  { id: "al1", name: "Sodunke Mary Boluwatife", role: "Asoebi Lady" },
  { id: "al2", name: "Odujebe Ayomide", role: "Asoebi Lady" },
  { id: "al3", name: "Nkechi Cecilia Nwana", role: "Asoebi Lady" },
  { id: "al4", name: "Ariavie Favour", role: "Asoebi Lady" },
  { id: "al5", name: "Ayomide Andrew", role: "Asoebi Lady" },
  { id: "al6", name: "Ojetunde Jolaoluwa", role: "Asoebi Lady" },
  { id: "al7", name: "Praise Boldwill", role: "Asoebi Lady" },
  { id: "al8", name: "Talitha Kuyet", role: "Asoebi Lady" },
];

export const asoEbiMen: WeddingPartyMember[] = [
  { id: "am1", name: "Nwokeji Precious", role: "Asoebi Man" },
  { id: "am2", name: "Nkemdirim Darlington", role: "Asoebi Man" },
  { id: "am3", name: "Oyeleye Olawale", role: "Asoebi Man" },
  { id: "am4", name: "Egbeigwe Tobechukwu", role: "Asoebi Man" },
  { id: "am5", name: "Omeriaye Rukky", role: "Asoebi Man" },
  { id: "am6", name: "Moses Bright", role: "Asoebi Man" },
];

export const groomParty: WeddingPartyMember[] = [
  {
    id: "groom",
    name: "Nwabekee Nelson Ugochukwu",
    role: "Groom",
    message:
      "Every day with her feels like the beginning of something beautiful.",
  },
  { id: "best-man", name: "Nnabuife Marvelous", role: "Best Man" },
  { id: "ring-bearer", name: "Omon Jaiden", role: "Ring Bearer" },
  { id: "gm1", name: "Inyamah Misheal", role: "Groomsman" },
  { id: "gm2", name: "Opiah Frank", role: "Groomsman" },
  { id: "gm3", name: "Opiah Welfare", role: "Groomsman" },
  { id: "gm4", name: "Onuoha Michael", role: "Groomsman" },
];

export const schedule: ScheduleItem[] = [
  {
    time: "10:30 AM",
    title: "Wedding Ceremony",
    description: "At the Kingdom Hall of Jehovah's Witness, Ita Elega, Abeokuta",
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
  {
    question: "Can I join the celebration virtually?",
    answer: `Absolutely! We'll be streaming the ceremony live on Zoom — Meeting ID: ${zoomMeeting.meetingId}, Passcode: ${zoomMeeting.passcode}. You can also select "Joining via Zoom" when you RSVP and we'll send the link straight to your inbox.`,
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
