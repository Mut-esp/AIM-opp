import type { Opportunity, Shop } from '../types'

const baseOpportunities: Opportunity[] = [
  { id: 'my-digital', title: 'Malaysia Digital Challenge 2025', provider: 'MDEC', category: 'Competition', state: 'Selangor', district: 'Petaling', interests: ['Technology', 'Leadership'], education: ['Secondary', 'Pre-university', 'University'], audience: 'Youth 18–30', date: '18 Jan 2025', deadline: '04 Jan 2025', fee: 0, format: 'Hybrid', difficulty: 'Intermediate', description: 'Build a digital solution for a real Malaysian community challenge with mentors from the local tech ecosystem.', venue: 'Online + MDEC, Petaling', materials: 'A team of 2–4 and a one-page idea brief.', featured: true, sample: true, registrationUrl: 'https://mdec.my/' },
  { id: 'penang-maker', title: 'Maker Lab: From Idea to Prototype', provider: 'Penang Science Cluster', category: 'Workshop', state: 'Penang', district: 'George Town', interests: ['Technology', 'Science', 'Arts'], education: ['Secondary', 'Pre-university', 'University'], audience: 'Students 15+', date: '22 Feb 2025', deadline: '15 Feb 2025', fee: 25, format: 'In person', difficulty: 'Beginner', description: 'A hands-on Saturday learning electronics, rapid prototyping and pitching through a guided mini build.', venue: 'Penang Science Cluster, George Town', materials: 'Laptop recommended. All hardware is provided.', sample: true, registrationUrl: 'https://example.com/' },
  { id: 'sarawak-scholar', title: 'Sarawak Future Leaders Award', provider: 'Yayasan Sarawak', category: 'Scholarship', state: 'Sarawak', district: 'Kuching', interests: ['Leadership', 'Career development'], education: ['University', 'Graduate'], audience: 'Sarawakian students', date: '01 Mar 2025', deadline: '31 Jan 2025', fee: 0, format: 'Online', difficulty: 'Advanced', description: 'A sample scholarship pathway for high-potential Sarawakian students pursuing priority fields.', venue: 'Online application', materials: 'Academic transcript, personal statement and two references.', sample: true, registrationUrl: 'https://yayasansarawak.org.my/' },
  { id: 'qurban-aid', title: 'Qurban Community Crew', provider: 'Masjid Al-Hidayah', category: 'Spiritual', state: 'Selangor', district: 'Petaling Jaya', interests: ['Spirituality', 'Community service'], education: ['Open to all'], audience: 'Local community', date: '06 Jun 2025', deadline: '30 May 2025', fee: 0, format: 'In person', difficulty: 'Beginner', description: 'Help coordinate packing and neighbourhood distribution for the community qurban programme.', venue: 'Masjid Al-Hidayah, Petaling Jaya', materials: 'Comfortable clothing and a willingness to help. Briefing provided.', sample: true, registrationUrl: 'https://example.com/' },
  { id: 'johor-tutor', title: 'Weekend STEM Tutor', provider: 'KitaBantu Learning Hub', category: 'Odd job', state: 'Johor', district: 'Johor Bahru', interests: ['Science', 'Community service', 'Career development'], education: ['University', 'Graduate'], audience: 'University students', date: 'Every Saturday', deadline: 'Rolling applications', fee: 45, format: 'In person', difficulty: 'Intermediate', description: 'Paid weekend tutoring for Form 1–3 learners. Make a difference while building your teaching portfolio.', venue: 'KitaBantu Hub, Johor Bahru', materials: 'Relevant subject knowledge and a short introduction.', sample: true, registrationUrl: 'https://example.com/' },
  { id: 'imam-assist', title: 'Solat Jenazah Support Team', provider: 'Komuniti Masjid Putra', category: 'Spiritual', state: 'Putrajaya', district: 'Presint 9', interests: ['Spirituality', 'Community service'], education: ['Open to all'], audience: 'Community volunteers', date: 'On call', deadline: 'Open registration', fee: 0, format: 'In person', difficulty: 'Intermediate', description: 'Join a trained support team assisting families with practical arrangements and mosque coordination.', venue: 'Masjid Putra, Putrajaya', materials: 'Orientation and guidance are provided by the mosque team.', sample: true, registrationUrl: 'https://example.com/' },
  { id: 'kl-crew', title: 'Festival Event Crew', provider: 'Kuala Lumpur Youth Co.', category: 'Odd job', state: 'Kuala Lumpur', district: 'Bukit Jalil', interests: ['Arts', 'Career development'], education: ['University', 'Open to all'], audience: 'Youth 18+', date: '12–13 Apr 2025', deadline: '28 Mar 2025', fee: 120, format: 'In person', difficulty: 'Beginner', description: 'Paid short-term shifts supporting guest check-in and venue operations at a youth arts festival.', venue: 'Bukit Jalil, Kuala Lumpur', materials: 'Comfortable shoes and a two-day commitment.', sample: true, registrationUrl: 'https://example.com/' },
  { id: 'sabah-ocean', title: 'Blue Sabah Coastal Fellowship', provider: 'Borneo Ocean Network', category: 'Community', state: 'Sabah', district: 'Kota Kinabalu', interests: ['Science', 'Volunteering', 'Community service'], education: ['Pre-university', 'University', 'Graduate'], audience: 'Youth 17–28', date: '10 May 2025', deadline: '10 Apr 2025', fee: 0, format: 'In person', difficulty: 'Intermediate', description: 'A weekend field programme combining coastal science, citizen research and conservation storytelling.', venue: 'Kota Kinabalu, Sabah', materials: 'Outdoor readiness; meals and field kit included.', sample: true, registrationUrl: 'https://example.com/' },
  { id: 'perak-biz', title: 'Young Founders Microgrant', provider: 'Perak Entrepreneur Centre', category: 'Scholarship', state: 'Perak', district: 'Ipoh', interests: ['Business', 'Leadership'], education: ['University', 'Graduate', 'Open to all'], audience: 'Perak youth founders', date: 'Rolling intake', deadline: '30 Apr 2025', fee: 0, format: 'Hybrid', difficulty: 'Advanced', description: 'Small grants and coaching for young people testing a community-minded business idea.', venue: 'Ipoh + online', materials: 'A simple budget and a two-minute pitch video.', sample: true, registrationUrl: 'https://example.com/' },
  { id: 'melaka-heritage', title: 'Heritage Stories: Street Archive', provider: 'Ruang Seni Melaka', category: 'Workshop', state: 'Melaka', district: 'Bandar Hilir', interests: ['Arts', 'Community service'], education: ['Secondary', 'Pre-university', 'University', 'Open to all'], audience: 'Local storytellers', date: '15 Mar 2025', deadline: '08 Mar 2025', fee: 0, format: 'In person', difficulty: 'Beginner', description: 'Learn ethical oral-history interviewing and create a small digital story about Bandar Hilir.', venue: 'Ruang Seni Melaka, Bandar Hilir', materials: 'Phone with camera and curiosity.', sample: true, registrationUrl: 'https://example.com/' },
]

type JobLocation = {
  state: string
  district: string
  provider: string
  prefix: string
  venue: string
}

const jobLocations: JobLocation[] = [
  { state: 'Selangor', district: 'Petaling', provider: 'Petaling Youth Works', prefix: 'Petaling', venue: 'Petaling, Selangor' },
  { state: 'Selangor', district: 'Klang', provider: 'Klang Skills Network', prefix: 'Klang', venue: 'Klang, Selangor' },
  { state: 'Selangor', district: 'Hulu Langat', provider: 'Hulu Langat Community Hub', prefix: 'Hulu Langat', venue: 'Hulu Langat, Selangor' },
  { state: 'Selangor', district: 'Sepang', provider: 'Sepang Youth Works', prefix: 'Sepang', venue: 'Sepang, Selangor' },
  { state: 'Selangor', district: 'Gombak', provider: 'Gombak Student Connect', prefix: 'Gombak', venue: 'Gombak, Selangor' },
  { state: 'Selangor', district: 'Kuala Selangor', provider: 'Kuala Selangor Community Desk', prefix: 'Kuala Selangor', venue: 'Kuala Selangor, Selangor' },
  { state: 'Selangor', district: 'Hulu Selangor', provider: 'Hulu Selangor Youth Collective', prefix: 'Hulu Selangor', venue: 'Hulu Selangor, Selangor' },
  { state: 'Selangor', district: 'Sabak Bernam', provider: 'Sabak Bernam Career Bridge', prefix: 'Sabak Bernam', venue: 'Sabak Bernam, Selangor' },
  { state: 'Selangor', district: 'Kuala Langat', provider: 'Kuala Langat Creative Network', prefix: 'Kuala Langat', venue: 'Kuala Langat, Selangor' },
]

const jobLevels: Array<{
  difficulty: Opportunity['difficulty']
  title: string
  interests: string[]
  education: Opportunity['education']
  audience: string
  fee: number
  description: string
  materials: string
}> = [
  { difficulty: 'Beginner', title: 'Event Crew Assistant', interests: ['Community service', 'Career development'], education: ['Open to all'], audience: 'Youth 18+', fee: 60, description: 'A paid short-term shift helping with guest check-in, directions and simple event setup. Briefing is provided on arrival.', materials: 'Comfortable shoes and a half-day commitment.' },
  { difficulty: 'Intermediate', title: 'Community Tutor', interests: ['Science', 'Community service', 'Career development'], education: ['University', 'Graduate'], audience: 'Students with subject knowledge', fee: 45, description: 'A paid weekly opportunity to support younger learners with homework, study habits and confidence building.', materials: 'Relevant subject knowledge and a short introduction.' },
  { difficulty: 'Advanced', title: 'Digital Project Assistant', interests: ['Technology', 'Business', 'Leadership'], education: ['University', 'Graduate'], audience: 'Students with a project portfolio', fee: 150, description: 'Support a small local organisation with research, spreadsheets and digital communications on a short project.', materials: 'Laptop, portfolio or examples of previous work.' },
]

const localJobExamples: Opportunity[] = jobLocations.flatMap((location) => jobLevels.map((level, index) => ({
  id: `${location.state.toLowerCase().replace(/ /g, '-')}-job-${index + 1}`,
  title: `${location.prefix} ${level.title}`,
  provider: location.provider,
  category: 'Odd job',
  state: location.state,
  district: location.district,
  interests: level.interests,
  education: level.education,
  audience: level.audience,
  date: index === 0 ? 'Rolling shifts' : index === 1 ? 'Every weekend' : 'Short project',
  deadline: 'Rolling applications',
  fee: level.fee,
  format: index === 2 ? 'Hybrid' : 'In person',
  difficulty: level.difficulty,
  description: level.description,
  venue: location.venue,
  materials: level.materials,
  sample: true,
  registrationUrl: 'https://example.com/',
})))

export const opportunities: Opportunity[] = [...baseOpportunities, ...localJobExamples]

export const states = ['All Malaysia', ...Array.from(new Set(opportunities.map((item) => item.state)))]
export const districts = Array.from(new Set(opportunities.map((item) => item.district)))
export const categories = ['All categories', 'Competition', 'Workshop', 'Scholarship', 'Community', 'Spiritual', 'Odd job']
export const interests = ['Technology', 'Business', 'Arts', 'Sports', 'Science', 'Leadership', 'Volunteering', 'Career development', 'Spirituality', 'Community service']

export const shops: Shop[] = [
  { id: 'goreng-pisang-waris', name: 'Goreng Pisang Waris', category: 'Street food', description: 'Crispy banana fritters made fresh throughout the afternoon, with a loyal neighbourhood following.', state: 'Selangor', district: 'Petaling', location: 'SS15, Subang Jaya', price: 'RM1 / piece', rating: 4.9, reviewCount: 328, likes: 1000000, sample: true },
  { id: 'kuih-murni', name: 'Kuih Murni', category: 'Traditional kuih', description: 'Colourful kuih lapis, seri muka and onde-onde prepared in small batches every morning.', state: 'Selangor', district: 'Klang', location: 'Meru, Klang', price: 'RM2 / piece', rating: 4.8, reviewCount: 186, likes: 24800, sample: true },
  { id: 'kopi-bukit', name: 'Kopi Bukit 18', category: 'Coffee & breakfast', description: 'A family-run breakfast stop serving local coffee, roti bakar and warm community energy.', state: 'Selangor', district: 'Hulu Langat', location: 'Batu 18, Hulu Langat', price: 'RM4.50 / cup', rating: 4.7, reviewCount: 142, likes: 17300, sample: true },
  { id: 'bunga-sepang', name: 'Bunga Sepang Studio', category: 'Local craft', description: 'Hand-tied bouquets and locally inspired gifts for celebrations, small events and everyday moments.', state: 'Selangor', district: 'Sepang', location: 'Kota Warisan, Sepang', price: 'From RM25', rating: 4.9, reviewCount: 97, likes: 11900, sample: true },
  { id: 'rotican-gombak', name: 'Roti Canai Pak Din', category: 'Street food', description: 'Flaky roti canai with dhal and sambal, served from a beloved morning stall near the hills.', state: 'Selangor', district: 'Gombak', location: 'Batu Caves, Gombak', price: 'RM1.50 / piece', rating: 4.8, reviewCount: 214, likes: 31600, sample: true },
  { id: 'madu-selangor', name: 'Madu Kuala Selangor', category: 'Local produce', description: 'Small-batch local honey and pantry gifts sourced from beekeepers around the district.', state: 'Selangor', district: 'Kuala Selangor', location: 'Tanjong Karang, Kuala Selangor', price: 'RM18 / jar', rating: 4.6, reviewCount: 74, likes: 8600, sample: true },
  { id: 'anyaman-hulu', name: 'Anyaman Hulu', category: 'Handmade goods', description: 'Woven baskets and practical homeware made with patient hands and local materials.', state: 'Selangor', district: 'Hulu Selangor', location: 'Kuala Kubu Bharu, Hulu Selangor', price: 'From RM12', rating: 4.9, reviewCount: 63, likes: 7400, sample: true },
  { id: 'nasi-lemak-sabak', name: 'Nasi Lemak Sawah', category: 'Street food', description: 'Fragrant nasi lemak wrapped for the morning crowd, with sambal that keeps regulars coming back.', state: 'Selangor', district: 'Sabak Bernam', location: 'Sekinchan, Sabak Bernam', price: 'RM3.50 / pack', rating: 4.8, reviewCount: 121, likes: 14500, sample: true },
  { id: 'tempeh-langat', name: 'Tempeh Kuala Langat', category: 'Local produce', description: 'Fresh tempeh and soy snacks made locally and delivered to nearby communities.', state: 'Selangor', district: 'Kuala Langat', location: 'Banting, Kuala Langat', price: 'RM6 / pack', rating: 4.7, reviewCount: 88, likes: 10200, sample: true },
]
