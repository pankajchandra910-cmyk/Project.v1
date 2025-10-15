 export const featuredPlaces = [
  {
    id: "naina-devi-temple",
    image: "https://nainitaltourism.org.in/images/places-to-visit/headers/naina-devi-temple-nainital-tourism-entry-fee-timings-holidays-reviews-header.jpg",
    title: "Naina Devi Temple",
    location: "Nainital, Uttarakhand",
    price: "Free Entry",
    rating: 4.7,
    description: "Visited by 500K+ annually—iconic spiritual destination ⭐ 4.7/5",
    
  },
  {
    id: "china-peak",
    image: "https://images.unsplash.com/photo-1717050788940-189e308415fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHRyZWtraW5nJTIwaGltYWRlYXlhfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "China Peak",
    location: "Nainital, Uttarakhand",
    price: "₹50",
    rating: 4.8,
    description: "Top for adventure views—highest peak around Nainital ⭐ 4.8/5",
    
  },
  {
    id: "bhimtal-lake",
    image: "https://images.unsplash.com/photo-1683973200791-47539048cf63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxiaGltdGFsJTIwbGFrZSUyMHV0dGFyYWtoYW5kfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Bhimtal Lake",
    location: "Bhimtal, Uttarakhand",
    price: "₹30",
    rating: 4.6,
    description: "Popular family spot—larger than Naini Lake ⭐ 4.6/5",
    
  },
  {
    id: "tiffin-top",
    image: "https://images.unsplash.com/photo-1670555383991-ae6ad4bb39df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxiaWxsJTIwcmVzb3J0JTIwbW91bnRhaW4lMjB2aWV3fGVufDF8fHx8MTc1NzYxNjk4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Tiffin Top",
    location: "Nainital, Uttarakhand",
    price: "Free",
    rating: 4.5,
    description: "Eco-trail favorite—perfect for nature walks ⭐ 4.5/5",
    type: "Place"
  }
];

export const hotelDetailsData = {
  "naina-devi-temple": {
    id: "mountain-view-resort-bhimtal",
    name: "Mountain View Resort Bhimtal",
    location: "2km from Bhimtal Lake, Uttarakhand",
    rating: 4.5,
    reviewCount: 128,
    price: "₹4,500",
    priceNote: "per night",
    checkInTime: "2:00 PM",
    checkOutTime: "11:00 AM",
    images: [
      "https://images.unsplash.com/photo-1670555383991-ae6ad4bb39df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxoaWxsJTIwcmVzb3J0JTIwbW91bnRhaW4lMjB2aWV3fGVuMXx8fHwxNzU3NjE2OTg5fDB&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJvb20lMjBsdXh1cnl8ZW58MXx8fHwxNzM3MDM4NDAwfDB&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHBob3RlbCUyMHBvb2wlMjByZXNvcnR8ZW58MXx8fHwxNzM3MDM4NDAwfDB&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzM3MDM4NDAwfDB&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    description: "Luxury resort with spectacular lake views, modern amenities, and spa facilities. Perfect for families and couples seeking a peaceful mountain retreat with easy access to Bhimtal's attractions.",
    amenities: [
      { icon: "Wifi", name: "Free WiFi" },
      { icon: "Car", name: "Free Parking" },
      { icon: "Waves", name: "Swimming Pool" },
      { icon: "Coffee", name: "Spa & Wellness" },
      { icon: "Utensils", name: "Multi-cuisine Restaurant" },
      { icon: "Shield", name: "24/7 Security" }
    ],
    roomTypes: [
      {
        name: "Standard Room",
        price: "₹2,500",
        features: ["Lake View", "AC", "TV", "WiFi"],
        available: true
      },
      {
        name: "Deluxe Room",
        price: "₹3,500",
        features: ["Lake View", "Balcony", "AC", "TV", "WiFi", "Mini Bar"],
        available: true
      },
      {
        name: "Suite",
        price: "₹5,500",
        features: ["Panoramic View", "Separate Living Area", "Jacuzzi", "All Premium Amenities"],
        available: false
      }
    ],
    nearbyAttractions: [ // Renamed from 'nearby' to align with PlaceDetails structure
      { id: "bhimtal-lake", name: "Bhimtal Lake", distance: "2km", type: "lake", rating: 4.6 },
      { id: "naukuchiatal", name: "Naukuchiatal", distance: "8km", type: "lake", rating: 4.5 },
      { id: "tiffin-top-trek", name: "Tiffin Top Trek", distance: "12km", type: "viewpoint", rating: 4.7 },
      { id: "naina-peak-trek", name: "Naina Peak Trek", distance: "15km", type: "trek", rating: 4.8 }
    ],
    contact: {
      phone: "+91 9876543210",
      email: "info@mountainviewresort.com"
    },
    policies: [
      "Check-in: 2:00 PM | Check-out: 11:00 AM",
      "Cancellation: Free cancellation up to 24 hours before arrival",
      "Children: Children under 12 stay free with existing bedding",
      "Pets: Pet-friendly rooms available on request"
    ],
    reviews: [
        {
            author: "Rajesh Kumar",
            rating: 5,
            date: "2 days ago",
            comment: "Amazing stay with beautiful lake views! The staff was very helpful and the food was excellent. Perfect location for exploring Bhimtal and nearby attractions."
        },
        {
            author: "Priya Sharma",
            rating: 4,
            date: "1 week ago",
            comment: "Great mountain resort experience. Room was clean and comfortable. The spa facilities were relaxing after a day of trekking."
        }
    ],
    faqs: [
      {
        question: "Is there a swimming pool?",
        answer: "Yes, the resort has a spacious outdoor swimming pool accessible to all guests."
      },
      {
        question: "Do rooms have lake views?",
        answer: "Many of our rooms offer spectacular lake views. Please specify your preference when booking."
      },
      {
        question: "Is parking available?",
        answer: "Yes, we provide ample free parking for all our guests."
      },
      {
        question: "Are pets allowed?",
        answer: "We have designated pet-friendly rooms available upon request. Additional charges may apply."
      }
    ]
  },
  "the-naini-retreat": {
    id: "the-naini-retreat",
    name: "The Naini Retreat",
    location: "Ayarpata, Nainital, Uttarakhand",
    rating: 4.7,
    reviewCount: 250,
    price: "₹6,800",
    priceNote: "per night",
    checkInTime: "3:00 PM",
    checkOutTime: "12:00 PM",
    images: [
      "https://images.unsplash.com/photo-1582719424888-8255018e6e58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWluaXRhbCUyMGhvdGVsJTIwbHV4dXJ5fGVufDF8fHx8MTc1NzYxNjk5MHww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1549294413-26f195200c8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJlc3RhdXJhbnQlMjBudXhlcnl8ZW58MXx8fHwxNzM3MDM4NDAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1563299797-0bfe122a6d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxuYWluaXRhbCUyMGhvdGVsJTIwcG9vbHxlbnwxfHx8MTczNzAzODQwMHww&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    description: "An erstwhile residence of the Maharaja of Pilibhit, The Naini Retreat is a luxury heritage hotel offering majestic views of the Naini Lake and surrounding mountains. Experience colonial charm with modern comforts.",
    amenities: [
      { icon: "Wifi", name: "Free WiFi" },
      { icon: "Car", name: "Valet Parking" },
      { icon: "Waves", name: "Heated Swimming Pool" },
      { icon: "Coffee", name: "Spa & Massage" },
      { icon: "Utensils", name: "Fine Dining Restaurant" },
      { icon: "Users", name: "Conference Facilities" }
    ],
    roomTypes: [
      {
        name: "Heritage Room",
        price: "₹6,800",
        features: ["Lake View", "Antique Decor", "Heater", "TV", "WiFi"],
        available: true
      },
      {
        name: "Superior Room",
        price: "₹8,500",
        features: ["Garden View", "Balcony", "Modern Amenities", "Mini Bar"],
        available: true
      },
      {
        name: "Maharaja Suite",
        price: "₹15,000",
        features: ["Panoramic Lake View", "Separate Living Area", "Fireplace", "Personal Butler"],
        available: true
      }
    ],
    nearbyAttractions: [
      { id: "naini-lake", name: "Naini Lake", distance: "1km", type: "lake", rating: 4.7 },
      { id: "mall-road", name: "Mall Road", distance: "1.5km", type: "market", rating: 4.5 },
      { id: "naina-devi-temple", name: "Naina Devi Temple", distance: "2km", type: "temple", rating: 4.7 }
    ],
    contact: {
      phone: "+91 7654321098",
      email: "reservations@nainiretreat.com"
    },
    policies: [
      "Check-in: 3:00 PM | Check-out: 12:00 PM",
      "Cancellation: 48-hour free cancellation policy",
      "Children: Kids Club available",
      "Pets: Not allowed"
    ],
    reviews: [
        {
            author: "Ananya Singh",
            rating: 5,
            date: "3 days ago",
            comment: "Absolutely stunning property with breathtaking views of Naini Lake. The service was impeccable, and the heritage feel added so much charm to our stay."
        },
        {
            author: "Vikram Mehta",
            rating: 4,
            date: "2 weeks ago",
            comment: "A wonderful experience! The food was delicious, and the staff went above and beyond to make us comfortable. Highly recommended for a luxurious getaway."
        }
    ],
    faqs: [
      {
        question: "Is breakfast included?",
        answer: "Yes, a complimentary buffet breakfast is included with all room bookings."
      },
      {
        question: "Do you have a shuttle service?",
        answer: "We offer shuttle services to Mall Road and other local attractions. Please inquire at the reception."
      },
      {
        question: "Are there vegetarian food options?",
        answer: "Our multi-cuisine restaurant offers a wide array of vegetarian and vegan dishes."
      }
    ]
  }
};

export const viewpoints = [
  { id: "1", name: "Tiffin Top (Dorothy's Seat)", distance: "4km", rating: 4.7, description: "Panoramic views, 4km trek from Nainital" },
  { id: "2", name: "Snow View Point", distance: "2.5km", rating: 4.6, description: "Cable car access, Himalayan vistas" },
  { id: "3", name: "Naina Peak (China Peak)", distance: "6km", rating: 4.9, description: "Highest point, trekking spot" },
  { id: "4", name: "Himalaya Darshan Point", distance: "3km", rating: 4.5, description: "Snow-capped peaks view" },
  { id: "5", name: "Lover's Point", distance: "2km", rating: 4.3, description: "Scenic overlook" },
  { id: "6", name: "Land's End", distance: "5km", rating: 4.4, description: "Cliff-edge views" },
  { id: "7", name: "Mukteshwar", distance: "50km", rating: 4.8, description: "Temple and orchards" },
  { id: "8", name: "Sariyatal", distance: "10km", rating: 4.2, description: "Lake viewpoint" },
  { id: "9", name: "Khurpatal", distance: "12km", rating: 4.1, description: "Hidden lake spot" },
  { id: "10", name: "Kilbury", distance: "15km", rating: 4.6, description: "Bird watching views" }
];

export const routes = [
  { id: "1", name: "Naina Peak Trek", difficulty: "Moderate", distance: "6km loop", rating: 4.8 },
  { id: "2", name: "Tiffin Top Hike", difficulty: "Easy", distance: "4km to viewpoint", rating: 4.7 },
  { id: "3", name: "Snow View Trek", difficulty: "Easy", distance: "2km uphill", rating: 4.5 },
  { id: "4", name: "Guano Hills Trail", difficulty: "Moderate", distance: "10km birding adventure", rating: 4.4 },
  { id: "5", name: "Pangot Trek", difficulty: "Easy", distance: "15km nature walk", rating: 4.3 },
  { id: "6", name: "Kunjkharak Trek", difficulty: "Hard", distance: "20km wildlife path", rating: 4.6 },
  { id: "7", name: "Hartola Shiv Mandir Hike", difficulty: "Easy", distance: "8km spiritual trail", rating: 4.2 },
  { id: "8", name: "Sattal Waterfall Trail", difficulty: "Moderate", distance: "25km waterfall route", rating: 4.5 },
  { id: "9", name: "Lands End Trail", difficulty: "Easy", distance: "5km scenic end-point", rating: 4.1 },
  { id: "10", name: "Kilbury Trek", difficulty: "Moderate", distance: "15km forest adventure", rating: 4.4 }
];

 export const locations = [
  {
    id: "1",
    name: "Nainital",
    image: "https://images.unsplash.com/photo-1656828059867-3fb503eb2214?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8ZW58MXx8fHwxNzU3NjE2OTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    distance: "0km",
    viewpoints: ["Naini Lake", "Mall Road", "Snow View Point"],
    description: "The Queen of Hills, famous for its pristine lake and colonial charm",
    gallery: [
      "https://images.unsplash.com/photo-1656828059867-3fb503eb2214?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8ZW58MXx8fHwxNzU3NjE2OTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8ZW58MXx8fHwxNzU3NjE2OTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxZnxtb3VudGFpbiUyMGxha2V8ZW58MXx8fHwxNzU3NjIyNzUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ]
  },
  {
    id: "2",
    name: "Bhimtal",
    image: "https://images.unsplash.com/photo-1683973200791-47539048cf63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaGltdGFsJTIwbGFrZSUyMHV0dGFyYWtoYW5kfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    distance: "22km",
    viewpoints: ["Bhimtal Lake", "Island Restaurant", "Butterfly Research Centre"],
    description: "Larger lake than Naini with serene surroundings and island restaurant",
    gallery: [
      "https://images.unsplash.com/photo-1683973200791-47539048cf63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaGltdGFsJTIwbGFrZSUyMHV0dGFyYWtoYW5kfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxZnxtb3VudGFpbiUyMGxha2V8ZW58MXx8fHwxNzU3NjIyNzUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ]
  },
  {
    id: "3",
    name: "Sukhatal",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8ZW58MXx8fHwxNzU3NjE2OTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    distance: "18km",
    viewpoints: ["Sukhatal Lake", "Forest Walks", "Bird Watching Points"],
    description: "Peaceful lake perfect for meditation and nature photography",
    gallery: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8ZW58MXx8fHwxNzU3NjE2OTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ]
  },
  {
    id: "4",
    name: "Brahmsthali",
    image: "https://images.unsplash.com/photo-1717050788940-189e308415fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHRyZWtraW5nJTIwaGltYWxheWFzfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    distance: "26km",
    viewpoints: ["Brahma Temple", "Himalayan Views", "Sunrise Point"],
    description: "Spiritual destination with panoramic mountain views",
    gallery: [
      "https://images.unsplash.com/photo-1717050788940-189e308415fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHRyZWtraW5nJTIwaGltYWxheWFzfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ]
  },
  {
    id: "5",
    name: "Naini Track",
    image: "https://images.unsplash.com/photo-1670555383991-ae6ad4bb39df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxoaWxsJTIwcmVzb3J0JTIwbW91bnRhaW4lMjB2aWV3fGVufDF8fHx8MTc1NzYxNjk4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    distance: "8km",
    viewpoints: ["Tiffin Top", "Dorothy's Seat", "Lands End"],
    description: "Popular trekking route with multiple viewpoints",
    gallery: [
      "https://images.unsplash.com/photo-1670555383991-ae6ad4bb39df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxoaWxsJTIwcmVzb3J0JTIwbW91bnRhaW4lMjB2aWV3fGVufDF8fHx8MTc1NzYxNjk4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ]
  },
  {
    id: "6",
    name: "Kanchi Dhaam",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZW1wbGUlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzU3NjIyODUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    distance: "15km",
    viewpoints: ["Temple Complex", "Valley Views", "Sacred Ponds"],
    description: "Ancient temple complex with spiritual significance",
    gallery: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZW1wbGUlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzU3NjIyODUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ]
  },
  {
    id: "7",
    name: "Naina Devi Temple",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZW1wbGUlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzU3NjIyODUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    distance: "2km",
    viewpoints: ["Temple Premises", "Lake Views", "Prayer Halls"],
    description: "Sacred temple dedicated to Goddess Naina Devi",
    gallery: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZW1wbGUlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzU3NjIyODUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ]
  },
  {
    id: "8",
    name: "China Peak",
    image: "https://images.unsplash.com/photo-1717050788940-189e308415fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHRyZWtraW5nJTIwaGltYWxheWFzfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    distance: "6km",
    viewpoints: ["Summit Views", "Trekking Trails", "Sunrise Point"],
    description: "Highest peak around Nainital, perfect for adventure seekers",
    gallery: [
      "https://images.unsplash.com/photo-1717050788940-189e308415fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHRyZWtraW5nJTIwaGltYWxheWFzfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ]
  },
  {
    id: "9",
    name: "Himdarshan",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8ZW58MXx8fHwxNzU3NjE2OTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    distance: "12km",
    viewpoints: ["Himalayan Range", "Valley Views", "Photography Points"],
    description: "Best spot for Himalayan range photography",
    gallery: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8ZW58MXx8fHwxNzU3NjE2OTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ]
  },
  {
    id: "10",
    name: "Pangoot",
    image: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxZnxtb3VudGFpbiUyMGxha2V8ZW58MXx8fHwxNzU3NjIyNzUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    distance: "15km",
    viewpoints: ["Bird Watching", "Forest Trails", "Eco Point"],
    description: "Paradise for bird watchers and nature enthusiasts",
    gallery: [
      "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxZnxtb3VudGFpbiUyMGxha2V8ZW58MXx8fHwxNzU3NjIyNzUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ]
  }
];

export const locationsData = {
 "nainital": {
    
    name: "Nainital",
    location: "Kumaon region, Uttarakhand, India",
    rating: 4.7,
    reviewCount: 25847,
    elevation: "2,084 meters (6,837 ft)",
    bestTime: "March-June (15-25°C)",
    peakSeason: "April-June, September-November",
    annualVisitors: 3000000,
    lat: 29.391775,
    lng: 79.455979,
    image: "https://images.unsplash.com/photo-1656828059867-3fb503eb2214?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8ZW58MXx8fHwxNzU3NjE2OTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    gallery: [
      "https://images.unsplash.com/photo-1656828059867-3fb503eb2214?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxuYWluX3x8fHwxNzU3NjE2OTg3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtZW1wbGUlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzU3NjIyODUyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb3VudGFpbiUyMHZpZXdwb2ludCUyMHN1bnJpc2V8ZW58MXx8fHwxNzM3MDM4NDAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHtoaW1hbGF5YSUyMG1vdW50YWluJTIwdmlld3xlbnwxfHx8fDE3MzcwMzg0MDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1464822759844-d150ad6d1f6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx0cmVra2luZyUyMHRyYWlsJTIwZm9yZXN0fGVuMXx8fHwxNzM3MDM4NDAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1683973200791-47539048cf63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxiaGltdGFsJTIwbGFrZSUyMHV0dGFyYWtoYW5kfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    description: "Nainital, the 'Queen of Hills,' is a picturesque hill station centered around the beautiful Naini Lake. Located at 2,084 meters above sea level, it offers stunning Himalayan views, colonial charm, and perfect weather. Home to over 500K+ annual visitors, Nainital features 20+ major attractions including lakes, viewpoints, temples, and adventure activities.",
    highlights: [
      "Pristine Naini Lake",
      "Colonial Architecture",
      "Panoramic Himalayan Views",
      "Boating and Trekking opportunities"
    ],
    whatToExpect: [
      { icon: "Mountain", title: "Scenic Beauty", desc: "Breathtaking views of surrounding hills" },
      { icon: "Camera", title: "Photography Hotspot", desc: "Capture stunning landscapes" },
      { icon: "Binoculars", title: "Explore Wildlife", desc: "Spot local fauna in natural habitats" },
      { icon: "Waves", title: "Water Activities", desc: "Boating, paddling, and lakeside relaxation" }
    ],
    tips: [
      "Book accommodations in advance during peak season.",
      "Carry warm clothes even in summer for evenings.",
      "Explore local markets for unique souvenirs.",
      "Try local Kumaoni cuisine."
    ],
    routes: [
      {
        mode: "By Road from Delhi",
        distance: "300km",
        duration: "7 hours",
        route: "Delhi → Moradabad → Rampur → Rudrapur → Haldwani → Nainital",
        icon: "Car",
        details: "Well-maintained highways, scenic mountain roads in last 35km"
      },
      {
        mode: "By Train + Taxi",
        distance: "Kathgodam Station (35km)",
        duration: "1 hour from station",
        route: "Kathgodam Railway Station → NH109 → Nainital",
        icon: "Train",
        details: "Nearest railhead, taxis/buses available from station"
      },
      {
        mode: "Alternative Routes",
        distance: "Via Kaladhungi (40km) / Julikote (45km)",
        duration: "1-1.5 hours",
        route: "Multiple scenic routes through different valleys",
        icon: "Mountain",
        details: "Less crowded routes with beautiful valley views"
      }
    ],
    popularSpots: [
      { name: "Naini Lake", id: "naini-lake", visitors: "500K+", type: "Lake", rating: 4.5, activities: ["Boating", "Photography", "Walking"], description: "Central attraction with boating and temple views", lat: 29.3920, lng: 79.4600, image: "https://images.unsplash.com/photo-1656828059867-3fb503eb2214?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8ZW58MXx8fHwxNzU3NjE2OTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", },
      { name: "Snow View Point", id: "snow-view-point", visitors: "300K+", type: "Viewpoint", rating: 4.6, activities: ["Cable Car", "Himalayan Views"], description: "Cable car access to Himalayan panorama", lat: 29.3870, lng: 79.4750, image: "https://images.unsplash.com/photo-1717050788940-189e308415fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHRyZWtraW5nJTIwaGltYWxheWFzfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", },
      { name: "Naina Peak (China Peak)", id: "naina-peak", visitors: "200K+", type: "Trek", rating: 4.9, activities: ["Trekking", "Sunrise Views"], description: "Highest point around Nainital, 6km trek", lat: 29.4070, lng: 79.4700, image: "https://images.unsplash.com/photo-1717050788940-189e308415fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHRyZWtraW5nJTIwaGltYWxheWFzfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", },
      { name: "Tiffin Top (Dorothy's Seat)", id: "tiffin-top", visitors: "250K+", type: "Viewpoint", rating: 4.7, activities: ["Trekking", "Panoramic Views"], description: "4km trek through pine forests", lat: 29.3879, lng: 79.4678, image: "https://images.unsplash.com/photo-1728312563312-b932a0a25603?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aWZmaW4lMjB0b3AlMjBuYWluaXRhbCUyMHZpZXdwb2ludHxlbnwxfHx8fDE3NTc2MjE1NDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", },
      { name: "High Altitude Zoo", id: "high-altitude-zoo", visitors: "150K+", type: "Wildlife", rating: 4.3, activities: ["Wildlife Viewing", "Photography"], description: "Rare Himalayan animals and birds", lat: 29.3990, lng: 79.4580, image: "https://images.unsplash.com/photo-1670555383991-ae6ad4bb39df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxoaWxsJTIwcmVzb3J0JTIwbW91bnRhaW4lMjB2aWV3fGVufDF8fHx8MTc1NzYxNjk4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", },
      { name: "Eco Cave Gardens", id: "eco-cave-gardens", visitors: "180K+", type: "Adventure", rating: 4.2, activities: ["Cave Exploration", "Gardens"], description: "Interconnected caves and musical fountain", lat: 29.3900, lng: 79.4620, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8ZW58MXx8fHwxNzU3NjE2OTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", },
      { name: "Hanumangarhi", id: "hanumangarhi", visitors: "120K+", type: "Temple", rating: 4.5, activities: ["Spiritual Visit", "Sunrise Views"], description: "Sunrise temple with valley views", lat: 29.3780, lng: 79.4630, image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZW1wbGUlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzU3NjIyODUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", },
      { name: "Land's End", id: "lands-end", visitors: "100K+", type: "Viewpoint", rating: 4.4, activities: ["Picnic", "Views"], description: "Cliff-edge viewpoint for picnics", lat: 29.3700, lng: 79.4680, image: "https://images.unsplash.com/photo-1670555383991-ae6ad4bb39df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxoaWxsJTIwcmVzb3J0JTIwbW91bnRhaW4lMjB2aWV3fGVufDF8fHx8MTc1NzYxNjk4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", },
      { name: "Khurpatal", id: "khurpatal", visitors: "80K+", type: "Lake", rating: 4.1, activities: ["Fishing", "Peaceful Walks"], description: "Emerald lake, 12km from Nainital", lat: 29.3250, lng: 79.5200, image: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxZnxtb3VudGFpbiUyMGxha2V8ZW58MXx8fHwxNzU3NjIyNzUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", },
      { name: "Lover's Point", id: "lovers-point", visitors: "90K+", type: "Viewpoint", rating: 4.3, activities: ["Photography", "Romantic Views"], description: "Popular couples spot with lake views", lat: 29.3850, lng: 79.4650, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8ZW58MXx8fHwxNzU3NjE2OTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", }
    ], 
    boatingPoints: [
      {
        name: "Naini Lake Main Dock",
        location: "Mall Road, near Flats",
        timings: "6:00 AM - 6:00 PM",
        rates: { paddle: "₹150/hour", yacht: "₹210/round", rowboat: "₹120/hour" },
        views: ["Naina Devi Temple", "Mall Road", "Thandi Sadak"],
        description: "Main boating hub with various boat options"
      },
      {
        name: "Bhimtal Lake",
        location: "22km from Nainital",
        timings: "7:00 AM - 5:00 PM",
        rates: { kayaking: "₹200/hour", paddle: "₹180/hour" },
        views: ["Island Restaurant", "Bhimeshwar Temple"],
        description: "Larger lake with island cafe views"
      }
    ],

    hotels: [
      {
        id: "shervani-hilltop-resort",
        name: "Shervani Hilltop Resort",
        description: "Premium resort with panoramic lake views",
        distance: "2km from lake",
        rating: 4.5,
        price: "₹5,000",
        features: ["Lake View", "Spa", "Multi-cuisine Restaurant", "Free Wi-Fi"],
        lat: 29.3950,
        lng: 79.4450,
        image: "https://images.unsplash.com/photo-1670555383991-ae6ad4bb39df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxoaWxsJTIwcmVzb3J0JTIwbW91bnRhaW4lMjB2aWV3fGVufDF8fHx8MTc1NzYxNjk4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      },
      {
        id: "the-naini-retreat",
        name: "The Naini Retreat",
        description: "Heritage hotel with colonial charm",
        distance: "1.5km from lake",
        rating: 4.6,
        price: "₹8,000",
        features: ["Heritage Property", "Spa", "Valley Views", "Restaurant"],
        lat: 29.3880,
        lng: 79.4480,
        image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHtoaW1hbGF5YSUyMG1vdW50YWluJTIwdmlld3xlbnwxfHx8fDE3MzcwMzg0MDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      },
      {
        id: "namah-nainital",
        name: "Namah Nainital",
        description: "Luxury resort with modern amenities",
        distance: "3km from lake",
        rating: 4.7,
        price: "₹10,000",
        features: ["Luxury Resort", "Pool", "Premium Dining", "Free Wi-Fi"],
        lat: 29.4000,
        lng: 79.4500,
        image: "https://images.unsplash.com/photo-1464822759844-d150ad6d1f6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx0cmVra2luZyUyMHRyYWlsJTIwZm9yZXN0fGVuMXx8fHwxNzM3MDM4NDAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      },
      {
        id: "welcome-heritage-ashdale",
        name: "Welcome Heritage Ashdale",
        description: "Colonial charm with modern comfort",
        distance: "2.5km from lake",
        rating: 4.4,
        price: "₹6,000",
        features: ["Colonial Architecture", "Garden Views", "Heritage Dining", "Free Wi-Fi"],
        lat: 29.3900,
        lng: 79.4400,
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8ZW58MXx8fHwxNzU3NjE2OTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      },
      {
        id: "vikram-vintage-inn",
        name: "Vikram Vintage Inn",
        description: "Cozy budget option near Mall Road",
        distance: "1km from lake",
        rating: 4.2,
        price: "₹3,000",
        features: ["Budget Friendly", "Central Location", "Local Cuisine", "Free Wi-Fi"],
        lat: 29.3910,
        lng: 79.4570,
        image: "https://images.unsplash.com/photo-1656828059867-3fb503eb2214?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8ZW58MXx8fHwxNzU3NjE2OTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      }
    ],

    localFood: [
      "Bhatt ki Churkani (black bean curry)",
      "Momos (Tibetan dumplings)",
      "Bal Mithai (local sweet)",
      "Singori (coconut sweet)",
      "Kumaoni Raita",
      "Local Honey varieties"
    ],
    otherActivities: [
      { name: "Shopping on Mall Road", icon: "ShoppingCart", description: "Browse local handicrafts and souvenirs." }, // Added icon
      { name: "Cable Car Ride to Snow View Point", icon: "Mountain", description: "Enjoy panoramic views via a thrilling cable car ride." }, // Added icon
      { name: "Boating in Naini Lake", icon: "Waves", description: "Classic experience on the pristine Naini Lake." }, // Added icon
      { name: "Trekking to Tiffin Top or Naina Peak", icon: "Walking", description: "Adventure treks with rewarding views." }, // Added icon
      { name: "Visiting Naina Devi Temple", icon: "Info", description: "Seek blessings at this revered Shakti Peeth." } // Added icon
    ],
    faqs: [
      { question: "What's the best time to visit Nainital?", answer: "March-June (15-25°C) for pleasant weather. Avoid monsoons (July-August) due to landslides. Winter (Dec-Feb) is cold but offers snow views." },
      { question: "How far is Nainital from Delhi and how to reach?", answer: "300km/7 hours by road via Moradabad-Haldwani route. By train: Kathgodam station (35km) then taxi. Multiple bus services available." },
      { question: "What are the must-visit places in Nainital?", answer: "Naini Lake (boating), Snow View Point (cable car), Naina Peak (trekking), Tiffin Top (4km trek), High Altitude Zoo, and Eco Cave Gardens." },
      { question: "How much does boating cost at Naini Lake?", answer: "Paddle boats: ₹150/hour, Yacht rides: ₹210/round trip, Row boats: ₹120/hour. Timings: 6 AM - 6 PM daily." },
      { question: "Is Nainital safe for solo travelers and families?", answer: "Very safe for both. Well-developed tourist infrastructure, police assistance available. Avoid monsoon season for landslide safety." },
      { question: "What should I pack for Nainital trip?", answer: "Layers for temperature changes, comfortable trekking shoes, warm clothes for evenings, rain gear (if monsoon), camera, sunscreen." },
      { question: "Are there budget accommodation options?", answer: "Yes! Budget hotels from ₹1,500-3,000/night. Mid-range ₹3,000-6,000. Luxury resorts ₹8,000-15,000. Book in advance during peak season." },
      { question: "What local food should I try?", answer: "Bhatt ki Churkani, Bal Mithai, Momos, Singori sweets, Kumaoni Raita, and local honey varieties. Many restaurants on Mall Road." }
    ]
  },
  "bhimtal": {
    id: "2",
    name: "Bhimtal",
    location: "Kumaon region, Uttarakhand, India",
    rating: 4.4,
    reviewCount: 15000,
    elevation: "1,370 meters (4,490 ft)",
    bestTime: "March-June (20-30°C)",
    peakSeason: "April-June, September-October",
    annualVisitors: 800000,
    lat: 29.3440,
    lng: 79.5490,
    image: "https://images.unsplash.com/photo-1683973200791-47539048cf63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxiaGltdGFsJTIwbGFrZSUyMHV0dGFyYWtoYW5kfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    gallery: [
    "https://images.unsplash.com/photo-1683973200791-47539048cf63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxiaGltdGFsJTIwbGFrZSUyMHV0dGFyYWtoYW5kfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1596707328691-0361e27a1e1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxiaGltdGFsJTIwdGVtcGxlfGVufDF8fHx8MTcwMzYyMzYwMHww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1589182373030-a9b0c7a7b8e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxoYWlkYWtoYW4lMjB0ZW1wbGUlMjBiaGltdGFsfGVufDF8fHx8MTcwMzYyMzYwMHww&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    description: "Bhimtal is a serene lake town, larger than Nainital and known for Bhimtal Lake, which has a small island in the center. It offers a quieter alternative with opportunities for boating, kayaking, and exploring the surrounding nature.",
    highlights: [
    "Largest lake in Kumaon",
    "Island with an aquarium",
    "Peaceful and less crowded",
    "Variety of water activities"
    ],
    whatToExpect: [
      { icon: "Waves", title: "Calm Lake", desc: "Serene waters perfect for relaxation" }, // Example icon
      { icon: "TreePine", title: "Nature Walks", desc: "Explore lush trails around the lake" }, // Example icon
      { icon: "Users", title: "Family Fun", desc: "Ideal for family picnics and activities" }, // Example icon
      { icon: "Clock", title: "Quiet Escape", desc: "A peaceful retreat from city bustle" } // Example icon
    ],
    tips: [
    "Visit the Bhimtal Island aquarium.",
    "Enjoy kayaking or paddle boating.",
    "Explore the local villages for a cultural experience.",
    "Carry insect repellent."
    ],
    routes: [
    {
    mode: "By Road from Delhi",
    distance: "290km",
    duration: "6.5 hours",
    route: "Delhi → Moradabad → Rampur → Rudrapur → Haldwani → Bhimtal",
    icon: "Car",
    details: "Well-connected roads, slightly less hilly than Nainital approach."
    },
    {
    mode: "By Train + Taxi",
    distance: "Kathgodam Station (22km)",
    duration: "45 min from station",
    route: "Kathgodam Railway Station → NH109 → Bhimtal",
    icon: "Train",
    details: "Nearest railhead, easy taxi/bus access."
    }
    ],
    popularSpots: [
    { name: "Bhimtal Lake", id: "bhimtal-lake", visitors: "300K+", type: "Lake", rating: 4.5, activities: ["Boating", "Kayaking", "Island Visit"], description: "The largest lake in the Kumaon region with an island aquarium.", lat: 29.3460, lng: 79.5510, image: "https://images.unsplash.com/photo-1683973200791-47539048cf63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxiaGltdGFsJTIwbGFrZSUyMHV0dGFyYWtoYW5kfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", },
    { name: "Bhimeshwar Mahadev Temple", id: "bhimeshwar-temple", visitors: "80K+", type: "Temple", rating: 4.3, activities: ["Spiritual Visit", "Photography"], description: "Ancient Shiva temple near the lake, believed to be built by Bhima.", lat: 29.3450, lng: 79.5550, image: "https://images.unsplash.com/photo-1596707328691-0361e27a1e1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxiaGltdGFsJTIwdGVtcGxlfGVufDF8fHx8MTcwMzYyMzYwMHww&ixlib=rb-4.1.0&q=80&w=1080", },
    { name: "Victoria Dam", id: "victoria-dam", visitors: "50K+", type: "Viewpoint", rating: 4.0, activities: ["Picnic", "Views"], description: "Offers scenic views of the lake and surrounding hills.", lat: 29.3420, lng: 79.5500, image: "https://images.unsplash.com/photo-1589182373030-a9b0c7a7b8e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxoYWlkYWtoYW4lMjB0ZW1wbGUlMjBiaGltdGFsfGVufDF8fHx8MTcwMzYyMzYwMHww&ixlib=rb-4.1.0&q=80&w=1080", }
    ],
    boatingPoints: [
    {
    name: "Bhimtal Lake Main Dock",
    location: "Near Bhimtal Island",
    timings: "7:00 AM - 5:00 PM",
    rates: { paddle: "₹180/hour", kayaking: "₹200/hour", rowboat: "₹150/hour" },
    views: ["Island", "Temple", "Dam"],
    description: "Central dock for various water activities."
    }
    ],
    hotels: [
    {
    id: "country-inn-bhimtal",
    name: "Country Inn Bhimtal",
    description: "Comfortable stay with easy access to the lake.",
    distance: "0.5km from lake",
    rating: 4.3,
    price: "₹4,500",
    features: ["Lake View", "Garden", "Restaurant", "Free Wi-Fi"],
    lat: 29.3400,
    lng: 79.5480,
    image: "https://images.unsplash.com/photo-1683973200791-47539048cf63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxiaGltdGFsJTIwbGFrZSUyMHV0dGFyYWtoYW5kfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
    id: "the-lake-resort-bhimtal",
    name: "The Lake Resort Bhimtal",
    description: "Premium resort offering serene lake views.",
    distance: "2km from lake",
    rating: 4.6,
    price: "₹7,000",
    features: ["Luxury", "Spa", "Pool", "Free Wi-Fi"],
    lat: 29.3500,
    lng: 79.5600,
    image: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxZnxtb3VudGFpbiUyMGxha2V8ZW58MXx8fHwxNzU3NjIyNzUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    }
    ],
    localFood: [
    "Bhatt ki Churkani",
    "Kumaoni Thali",
    "Aloo ke Gutke",
    "Bal Mithai"
    ],
    otherActivities: [
      { name: "Bird watching", icon: "Binoculars", description: "Spot various avian species around the lake." }, // Added icon
      { name: "Nature walks", icon: "Walking", description: "Explore the surrounding forests and trails." }, // Added icon
      { name: "Visiting Sattal (Seven Lakes)", icon: "Waves", description: "A cluster of seven interconnected freshwater lakes." }, // Added icon
      { name: "Butterfly Research Centre", icon: "Info", description: "Learn about various butterfly species." } // Added icon
    ],
    faqs: [
    { question: "What is Bhimtal known for?", answer: "Bhimtal is known for its large, pristine lake with an island in the middle, offering a peaceful environment for boating and nature walks." },
    { question: "How far is Bhimtal from Nainital?", answer: "Bhimtal is approximately 22 kilometers (about 14 miles) from Nainital." },
    { question: "Can I do adventure sports in Bhimtal?", answer: "Yes, you can enjoy kayaking, paddle boating, and paragliding (seasonal) in and around Bhimtal." }
    ]
  },
  "sukhatal":{
  id: "3",
  name: "Sukhatal",
  location: "Kumaon region, Uttarakhand, India",
  rating: 4.0,
  reviewCount: 5000,
  elevation: "2,050 meters (6,726 ft)",
  bestTime: "April-June, Sept-Oct",
  annualVisitors: 150000,
  lat: 29.4050,
  lng: 79.4300,
  image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8ZW58MXx8fHwxNzU3NjE2OTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  gallery: [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8ZW58MXx8fHwxNzU3NjE2OTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  ],
  description: "Sukhatal is a peaceful lake known for its tranquil environment, ideal for meditation and nature photography. It's often less crowded than Naini Lake, offering a serene escape.",
  highlights: [
  "Peaceful lake",
  "Ideal for meditation and photography",
  "Less crowded",
  "Surrounded by lush forests"
  ],
  whatToExpect: [
    { icon: "Cloud", title: "Quiet and Calm", desc: "Experience a tranquil atmosphere perfect for relaxation." },
    { icon: "TreePine", title: "Nature Walks", desc: "Enjoy serene strolls amidst lush greenery and fresh air." },
    { icon: "Camera", title: "Photography", desc: "Capture the serene landscapes and unique seasonal changes." },
    { icon: "Binoculars", title: "Bird Watching", desc: "Spot various bird species in their natural habitat." }
  ],
  tips: [
  "Carry your camera for beautiful shots.",
  "Enjoy a quiet picnic by the lake.",
  "Respect the serene environment.",
  "Check for local bird watching tours."
  ],
  routes: [
  {
  mode: "By Road from Nainital",
  distance: "18km",
  duration: "45 min",
  route: "Nainital → NH109 → Sukhatal",
  icon: "Car",
  details: "Easy drive from Nainital through scenic routes."
  }
  ],
  popularSpots: [
  { name: "Sukhatal Lake", id: "sukhatal-lake", visitors: "50K+", type: "Lake", rating: 4.2, activities: ["Nature Walks", "Photography", "Bird Watching"], description: "The dry lake, famous for its unique geological features and seasonal water.", lat: 29.4050, lng: 79.4300, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8ZW58MXx8fHwxNzU3NjE2OTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", },
  { name: "Forest Walks", id: "forest-walks-sukhatal", visitors: "20K+", type: "Nature Trail", rating: 4.0, activities: ["Trekking", "Nature Photography"], description: "Explore the serene forest trails around Sukhatal for bird watching and tranquility.", lat: 29.4060, lng: 79.4320, image: "https://images.unsplash.com/photo-1464822759844-d150ad6d1f6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx0cmVra2luZyUyMHRyYWlsJTIwZm9yZXN0fGVuMXx8fHwxNzM3MDM4NDAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", }
  ],
  boatingPoints: [], // No boating available here typically
  hotels: [], // Typically fewer hotels directly in Sukhatal
  localFood: [
  "Local snacks and tea from small vendors"
  ],
  otherActivities: [
    { name: "Bird Watching", icon: "Binoculars", description: "Observe various bird species in their natural habitat." },
    { name: "Nature Photography", icon: "Camera", description: "Capture the serene landscapes and wildlife." },
    { name: "Picnics", icon: "Umbrella", description: "Enjoy a peaceful meal amidst nature." },
    { name: "Meditation", icon: "Lotus", description: "Find solitude and peace in the tranquil surroundings." }
  ],
  faqs: [
  { question: "What is special about Sukhatal?", answer: "Sukhatal is a unique seasonal lake. It's known for its peaceful environment and as a place where Naini Lake is believed to have originated from an underground channel." },
  { question: "Is Sukhatal good for families?", answer: "It's ideal for families looking for a quiet day out, with opportunities for nature walks and picnics rather than active adventures." }
  ]
  },
 "brahmsthali": {
  id: "4",
  name: "Brahmsthali",
  location: "Near Nainital, Uttarakhand, India",
  rating: 4.3,
  reviewCount: 8000,
  elevation: "2,200 meters (7,218 ft)",
  bestTime: "March-June, Sept-Nov",
  annualVisitors: 100000,
  lat: 29.4100,
  lng: 79.4900,
  image: "https://images.unsplash.com/photo-1717050788940-189e308415fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHRyZWtraW5nJTIwaGltYWxheWFzfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  gallery: [
  "https://images.unsplash.com/photo-1717050788940-189e308415fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb3VudGFpbiUyMHRyZWtraW5nJTIwaGltYWxheWFzfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  ],
  description: "Brahmsthali is a spiritual destination offering panoramic views of the Himalayan ranges. It's known for its serene temple and a spectacular sunrise point.",
  highlights: [
  "Panoramic Himalayan views",
  "Spiritual tranquility",
  "Stunning sunrise point",
  "Opportunity for peaceful treks"
  ],
  whatToExpect: [
    { icon: "Mountain", title: "Majestic Views", desc: "Breathtaking panoramic views of the Himalayan ranges." },
    { icon: "Cloud", title: "Spiritual Calm", desc: "Experience a serene and meditative atmosphere." },
    { icon: "Camera", title: "Sunrise Spectacle", desc: "Witness stunning sunrises over the mountains." },
    { icon: "Walking", title: "Peaceful Treks", desc: "Enjoy gentle walks and short treks in nature." }
  ],
  tips: [
  "Visit early morning for sunrise views.",
  "Carry a jacket as it can be chilly.",
  "Wear comfortable shoes for walking.",
  "Respect the sanctity of the temple."
  ],
  routes: [
  {
  mode: "By Road from Nainital",
  distance: "26km",
  duration: "1 hour",
  route: "Nainital → Bhimtal Road → Brahmsthali",
  icon: "Car",
  details: "Scenic drive through hills, last few kilometers might be a bit rough."
  }
  ],
  popularSpots: [
  { name: "Brahma Temple", id: "brahma-temple", visitors: "50K+", type: "Temple", rating: 4.3, activities: ["Spiritual Visit", "Meditation"], description: "An ancient temple dedicated to Lord Brahma amidst tranquil surroundings.", lat: 29.4100, lng: 79.4900, image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx0ZW1wbGUlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzU3NjIyODUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", },
  { name: "Himalayan Viewpoint", id: "himalayan-viewpoint-brahmsthali", visitors: "30K+", type: "Viewpoint", rating: 4.5, activities: ["Photography", "Sightseeing", "Sunrise Viewing"], description: "Offers majestic panoramic views of the snow-capped Himalayan peaks.", lat: 29.4120, lng: 79.4920, image: "https://images.unsplash.com/photo-1717050788940-189e308415fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb3VudGFpbiUyMHRyZWtraW5nJTIwaGltYWxheWFzfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", }
  ],
  boatingPoints: [],
  hotels: [], // Likely fewer direct hotels, more homestays or guesthouses
  localFood: [
  "Simple local meals at small eateries"
  ],
  otherActivities: [
    { name: "Trekking to nearby spots", icon: "Walking", description: "Explore the surrounding hills and trails." },
    { name: "Photography of landscapes", icon: "Camera", description: "Capture stunning views of the Himalayas and valleys." },
    { name: "Meditation and spiritual retreats", icon: "Lotus", description: "Find peace and connect with nature at the temple." },
    { name: "Sunrise Viewing", icon: "Sun", description: "Witness a spectacular sunrise over the snow-capped peaks." }
  ],
  faqs: [
  { question: "What is the main attraction of Brahmsthali?", answer: "The Brahma Temple and the breathtaking panoramic views of the Himalayan range, especially at sunrise." },
  { question: "How challenging is the trek to Brahmsthali?", answer: "The approach is generally accessible by road, with some light walking or short treks to specific viewpoints." }
  ]
  },
  "naini-track":{
  id: "5",
  name: "Naini Track",
  location: "Near Nainital, Uttarakhand, India",
  rating: 4.6,
  reviewCount: 12000,
  elevation: "2,292 meters (7,520 ft) at Tiffin Top",
  bestTime: "March-June, Sept-Nov",
  annualVisitors: 200000,
  lat: 29.3879,
  lng: 79.4678, // Tiffin Top coordinates
  image: "https://images.unsplash.com/photo-1670555383991-ae6ad4bb39df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxoaWxsJTIwcmVzb3J0JTIwbW91bnRhaW4lMjB2aWV3fGVufDF8fHx8MTc1NzYxNjk4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  gallery: [
  "https://images.unsplash.com/photo-1670555383991-ae6ad4bb39df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxoaWxsJTIwcmVzb3J0JTIwbW91bnRhaW4lMjB2aWV3fGVufDF8fHx8MTc1NzYxNjk4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  ],
  description: "Naini Track encompasses popular trekking routes around Nainital, leading to famous viewpoints like Tiffin Top, Dorothy's Seat, and Land's End. It's a favorite for adventure seekers and nature lovers.",
  highlights: [
  "Popular trekking routes",
  "Multiple scenic viewpoints",
  "Lush pine and deodar forests",
  "Panoramic views of Nainital and Himalayas"
  ],
  whatToExpect: [
    { icon: "Walking", title: "Moderate Trekking", desc: "Enjoy diverse trails ranging from easy walks to moderate climbs." },
    { icon: "Wind", title: "Fresh Mountain Air", desc: "Breathe in crisp, clean air while surrounded by nature." },
    { icon: "Camera", title: "Stunning Photography", desc: "Capture picturesque landscapes and panoramic vistas." },
    { icon: "Users", title: "Popular Trails", desc: "Experience well-trodden paths that can be bustling during peak times." }
  ],
  tips: [
  "Wear comfortable trekking shoes.",
  "Carry water and snacks.",
  "Start early to avoid crowds and enjoy the views.",
  "Consider hiring a local guide if venturing off main paths."
  ],
  routes: [
  {
  mode: "On Foot from Nainital",
  distance: "2-8km depending on destination",
  duration: "1-3 hours (one-way)",
  route: "Starts from various points near Nainital Lake or Mall Road",
  icon: "Walk",
  details: "Well-marked trails, some steeper sections."
  }
  ],
  popularSpots: [
  { name: "Tiffin Top (Dorothy's Seat)", id: "tiffin-top-nt", visitors: "100K+", type: "Viewpoint", rating: 4.7, activities: ["Trekking", "Panoramic Views", "Photography"], description: "A popular picnic spot offering stunning 360-degree views of Nainital and the Himalayas.", lat: 29.3879, lng: 79.4678, image: "https://images.unsplash.com/photo-1728312563312-b932a0a25603?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aWZmaW4lMjB0b3AlMjBuYWluaXRhbCUyMHZpZXdwb2ludHxlbnwxfHx8fDE3NTc2MjE1NDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", },
  { name: "Land's End", id: "lands-end-nt", visitors: "70K+", type: "Viewpoint", rating: 4.4, activities: ["Sightseeing", "Photography"], description: "A cliff-edge viewpoint providing spectacular views of the plains and Khurpatal lake.", lat: 29.3700, lng: 79.4680, image: "https://images.unsplash.com/photo-1670555383991-ae6ad4bb39df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxoaWxsJTIwcmVzb3J0JTIwbW91bnRhaW4lMjB2aWV3fGVufDF8fHx8MTc1NzYxNjk4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", }
  ],
  boatingPoints: [],
  hotels: [], // Trekking routes themselves don't have hotels, but are accessible from Nainital hotels
  localFood: [
  "Small food stalls at viewpoints selling tea, coffee, and quick snacks."
  ],
  otherActivities: [
    { name: "Horse riding to Tiffin Top", icon: "Horse", description: "Enjoy a unique way to reach Tiffin Top." },
    { name: "Photography walks", icon: "Camera", description: "Explore and capture the natural beauty of the trails." },
    { name: "Bird watching during treks", icon: "Binoculars", description: "Spot various bird species in the dense forests." },
    { name: "Picnic at scenic spots", icon: "Umbrella", description: "Relax and enjoy a meal with breathtaking views." }
  ],

  faqs: [
  { question: "What is the Naini Track?", answer: "Naini Track refers to the network of popular walking and trekking trails around Nainital that lead to various viewpoints and scenic spots." },
  { question: "How long does it take to trek to Tiffin Top?", answer: "It typically takes about 1-1.5 hours to trek to Tiffin Top from Nainital (one way), depending on your pace." }
  ]
  },
  "kanchi-dhaam":{
  id: "6",
  name: "Kanchi Dhaam",
  location: "Near Bhowali, Uttarakhand, India",
  rating: 4.8,
  reviewCount: 18000,
  elevation: "1,400 meters (4,593 ft)",
  bestTime: "Throughout the year",
  annualVisitors: 400000,
  lat: 29.4750,
  lng: 79.5250,
  image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx0ZW1wbGUlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzU3NjIyODUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  gallery: [
  "https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx0ZW1wbGUlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzU3NjIyODUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  ],
  description: "Kainchi Dham is a revered ashram and temple complex located in the Kumaon hills. Founded by Neem Karoli Baba, it's a spiritual hub attracting devotees worldwide, famous for its serene ambiance and beautiful valley views.",
  highlights: [
  "Spiritual ashram and temple",
  "Founded by Neem Karoli Baba",
  "Serene and peaceful ambiance",
  "Beautiful natural surroundings"
  ],
  whatToExpect: [
        { icon: "Temple", title: "Devotional Atmosphere", desc: "Experience a spiritual and devotional ambiance." },
        { icon: "Users", title: "Crowds during Festivals", desc: "Be prepared for large gatherings, especially on June 15th." },
        { icon: "Meditation", title: "Meditation Opportunities", desc: "Find quiet spots for introspection and meditation." },
        { icon: "Mountain", title: "Picturesque Views", desc: "Enjoy beautiful valley and river views." }
  ],
  tips: [
  "Dress modestly when visiting the temple.",
  "Visit early morning for a quieter experience.",
  "Be prepared for crowds on significant dates like June 15th.",
  "Explore the beautiful surrounding areas."
  ],
  routes: [
  {
  mode: "By Road from Nainital",
  distance: "17km",
  duration: "40 min",
  route: "Nainital → Bhowali → Kainchi Dham",
  icon: "Car",
  details: "Well-connected road, regular taxi and bus services available."
  }
  ],
  popularSpots: [
  { name: "Kainchi Dham Temple Complex", id: "kainchi-dham-temple", visitors: "400K+", type: "Temple/Ashram", rating: 4.8, activities: ["Spiritual Visit", "Meditation", "Photography"], description: "The main ashram and temple complex, a significant pilgrimage site.", lat: 29.4750, lng: 79.5250, image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx0ZW1wbGUlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzU3NjIyODUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", },
  { name: "Valley Views", id: "kainchi-valley-views", visitors: "200K+", type: "Viewpoint", rating: 4.6, activities: ["Photography", "Sightseeing"], description: "Enjoy the scenic beauty of the Kosi River flowing through the valley.", lat: 29.4760, lng: 79.5200, image: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxZnxtb3VudGFpbiUyMGxha2V8ZW58MXx8fHwxNzU3NjIyNzUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", }
  ],
  boatingPoints: [],
  hotels: [
  {
  id: "kainchi-dham-guesthouse",
  name: "Kainchi Dham Guesthouse",
  description: "Simple and clean accommodation near the ashram.",
  distance: "0.5km from temple",
  rating: 4.0,
  price: "₹1,500",
  features: ["Basic Amenities", "Peaceful", "Restaurant"],
  lat: 29.4740,
  lng: 79.5260,
  image: "https://images.unsplash.com/photo-1670555383991-ae6ad4bb39df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxoaWxsJTIwcmVzb3J0JTIwbW91bnRhaW4lMjB2aWV3fGVufDF8fHx8MTc1NzYxNjk4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  }
  ],
  localFood: [
  "Prasad (offerings) at the temple",
  "Local snacks from nearby shops"
  ],
  otherActivities: [
      { name: "Participate in Aarti and prayers", icon: "Pray", description: "Engage in the spiritual rituals and prayers at the ashram." },
      { name: "Explore the scenic Kosi Valley", icon: "Mountain", description: "Take walks around the beautiful valley surrounding the dham." },
      { name: "Photography of the temple architecture", icon: "Camera", description: "Capture the unique architecture and serene surroundings of the temple." }
    ],
  faqs: [
  { question: "Who founded Kainchi Dham?", answer: "Kainchi Dham was founded by the revered spiritual guru Neem Karoli Baba." },
  { question: "What is the best time to visit Kainchi Dham?", answer: "It can be visited throughout the year, but avoid June 15th if you prefer smaller crowds, as it's the annual Bhandara (feast) day." }
  ]
  },
  "naina-devi-temple":{
  id: "7",
  name: "Naina Devi Temple",
  location: "Nainital, Uttarakhand, India",
  rating: 4.7,
  reviewCount: 20000,
  elevation: "2,084 meters (6,837 ft)",
  bestTime: "Throughout the year",
  annualVisitors: 500000,
  lat: 29.3950,
  lng: 79.4580,
  image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx0ZW1wbGUlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzU3NjIyODUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  gallery: [
  "https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx0ZW1wbGUlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzU3NjIyODUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  ],
  description: "The Naina Devi Temple is one of the most revered Shakti Peeths in India, located on the northern shore of Naini Lake. It is dedicated to Goddess Naina Devi and is a significant pilgrimage site for devotees.",
  highlights: [
  "One of the 51 Shakti Peeths",
  "Located on the edge of Naini Lake",
  "Deep spiritual significance",
  "Beautiful views of the lake"
  ],
  whatToExpect: [
      { icon: "Users", title: "Crowded during Festivals", desc: "Expect large crowds, especially during auspicious festivals." },
      { icon: "Temple", title: "Devotional Atmosphere", desc: "Immerse yourself in a strong spiritual and devotional environment." },
      { icon: "Pray", title: "Prayers and Blessings", desc: "Opportunity to offer prayers and seek blessings from the goddess." },
      { icon: "Walk", title: "Easy Accessibility", desc: "Conveniently located and easily accessible from Mall Road." }
  ],
  tips: [
  "Remove your shoes before entering the temple.",
  "Be respectful of local customs and traditions.",
  "Watch out for touts and street vendors.",
  "Combine your visit with a boat ride on Naini Lake."
  ],
  routes: [
  {
  mode: "On Foot from Mall Road",
  distance: "0.5km",
  duration: "5-10 min",
  route: "Walk along Mall Road to the northern end of Naini Lake.",
  icon: "Walk",
  details: "Easily accessible by foot from anywhere on Mall Road."
  }
  ],
  popularSpots: [
  { name: "Temple Premises", id: "naina-devi-temple-premises", visitors: "500K+", type: "Temple", rating: 4.7, activities: ["Prayer", "Meditation", "Spiritual Visit"], description: "The main temple complex dedicated to Goddess Naina Devi.", lat: 29.3950, lng: 79.4580, image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx0ZW1wbGUlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzU3NjIyODUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", },
  { name: "Lake Views from Temple", id: "lake-views-naina-devi", visitors: "300K+", type: "Viewpoint", rating: 4.6, activities: ["Photography", "Sightseeing"], description: "Enjoy picturesque views of Naini Lake from the temple grounds.", lat: 29.3940, lng: 79.4590, image: "https://images.unsplash.com/photo-1656828059867-3fb503eb2214?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8ZW58MXx8fHwxNzU3NjE2OTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", }
  ],
  boatingPoints: [],
  hotels: [], // Accessible from any hotel in Nainital
  localFood: [
  "Prasad and small devotional offerings"
  ],
  otherActivities: [
  { name: "Shopping for religious items", icon: "Shop", description: "Browse and purchase religious artifacts and souvenirs near the temple." },
  { name: "Strolling on Mall Road after the visit", icon: "Walk", description: "Enjoy a leisurely walk along the bustling Mall Road after your temple visit." }
  ],
  faqs: [
  { question: "What is the history of Naina Devi Temple?", answer: "The temple is believed to be one of the 51 Shakti Peeths, where the eyes (Nain) of Goddess Sati fell after Lord Shiva carried her body." },
  { question: "What are the timings for Naina Devi Temple?", answer: "The temple is generally open from early morning to late evening, with specific timings for Aarti (prayers). It's best to check locally for exact timings." }
  ]
  },
  "china-peak":{
  id: "8",
  name: "China Peak",
  location: "Near Nainital, Uttarakhand, India",
  rating: 4.9,
  reviewCount: 10000,
  elevation: "2,611 meters (8,568 ft)",
  bestTime: "March-June, Sept-Nov",
  annualVisitors: 120000,
  lat: 29.4070,
  lng: 79.4700,
  image: "https://images.unsplash.com/photo-1717050788940-189e308415fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb3VudGFpbiUyMHRyZWtraW5nJTIwaGltYWxheWFzfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  gallery: [
  "https://images.unsplash.com/photo-1717050788940-189e308415fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb3VudGFpbiUyMHRyZWtraW5nJTIwaGltYWxheWFzfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  ],
  description: "China Peak (Naina Peak) is the highest peak in Nainital, offering breathtaking panoramic views of the entire Nainital town, the Naini Lake, and the majestic Himalayan ranges. It's a popular spot for trekking and experiencing stunning sunrises.",
  highlights: [
  "Highest point in Nainital",
  "360-degree panoramic views",
  "Spectacular sunrise views",
  "Challenging but rewarding trek"
  ],
  whatToExpect: [
      { icon: "Walking", title: "Steep Ascent", desc: "Be ready for challenging uphill sections during the trek." },
      { icon: "Snow", title: "Cooler Temperatures", desc: "Expect significantly cooler weather at the summit." },
      { icon: "Mountain", title: "Unparalleled Natural Beauty", desc: "Witness breathtaking landscapes and pristine nature." },
      { icon: "Peace", title: "Peaceful Environment", desc: "Enjoy tranquility away from the usual tourist crowds." }
    ],
  tips: [
  "Start the trek early morning to catch the sunrise.",
  "Wear sturdy trekking shoes and comfortable clothing.",
  "Carry water, snacks, and a camera.",
  "A local guide is recommended for first-timers."
  ],
  routes: [
  {
  mode: "Trek from Nainital",
  distance: "6km (one-way)",
  duration: "2-3 hours (one-way)",
  route: "Starts from Mallital or Ayarpatta Hill.",
  icon: "Walk",
  details: "A moderately challenging trek through dense forests."
  }
  ],
  popularSpots: [
  { name: "Summit Views", id: "china-peak-summit", visitors: "100K+", type: "Viewpoint", rating: 4.9, activities: ["Trekking", "Sunrise Viewing", "Photography"], description: "The ultimate reward of the trek, offering unparalleled views of Nainital and the Himalayas.", lat: 29.4070, lng: 79.4700, image: "https://images.unsplash.com/photo-1717050788940-189e308415fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb3VudGFpbiUyMHRyZWtraW5nJTIwaGltYWxheWFzfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", },
  { name: "Trekking Trails", id: "china-peak-trails", visitors: "80K+", type: "Trek", rating: 4.8, activities: ["Hiking", "Nature Walks", "Bird Watching"], description: "The various paths leading to the summit, offering diverse flora and fauna.", lat: 29.4050, lng: 79.4680, image: "https://images.unsplash.com/photo-1464822759844-d150ad6d1f6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx0cmVra2luZyUyMHRyYWlsJTIwZm9yZXN0fGVuMXx8fHwxNzM3MDM4NDAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", }
  ],
  boatingPoints: [],
  hotels: [],
  localFood: [
  "Packed lunches/snacks to carry on the trek."
  ],
  otherActivities: [
      { name: "Bird watching",icon: "Binoculars", description: "Spot various bird species in the dense forests along the trail." },
      { name: "Photography of landscapes and wildlife", icon: "Camera", description: "Capture stunning panoramic views and occasional wildlife sightings." }
    ],
  faqs: [
  { question: "Is China Peak suitable for beginners?", answer: "It's a moderately challenging trek. Beginners with good physical fitness can attempt it, but it's advisable to be prepared for uphill climbs." },
  { question: "What can I see from China Peak?", answer: "You can see panoramic views of Nainital town, Naini Lake, and a vast expanse of the snow-clad Himalayan peaks, including Nanda Devi." }
  ]
  },
   "himdarshan": {
    id: "9",
    name: "Himdarshan",
    location: "Near Nainital, Kumaon region, Uttarakhand, India",
    rating: 4.5,
    reviewCount: 7500,
    elevation: "2,200 meters (7,218 ft)",
    bestTime: "March-June, Sept-Nov",
    peakSeason: "April-June, October",
    annualVisitors: 180000,
    lat: 29.3980,
    lng: 79.4850,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8ZW58MXx8fHwxNzU3NjE2OTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    gallery: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8ZW58MXx8fHwxNzU3NjE2OTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHtoaW1hbGF5YSUyMG1vdW50YWluJTIwdmlld3xlbnwxfHx8fDE3MzcwMzg0MDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1717050788940-189e308415fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb3VudGFpbiUyMHRyZWtraW5nJTIwaGltYWxheWFzfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    description: "Himdarshan, located just 12km from Nainital, is a prime spot renowned for its breathtaking panoramic views of the majestic Himalayan Range. It's a photographer's paradise, offering clear vistas of snow-capped peaks and sprawling valley landscapes, especially during sunrise and sunset.",
    highlights: [
      "Stunning Himalayan Range views",
      "Excellent photography opportunities",
      "Serene and peaceful environment",
      "Valley viewpoints"
    ],
    whatToExpect: [
      { icon: "Mountain", title: "Clear Mountain Views", desc: "Enjoy unobstructed views of the Himalayas on clear days." },
      { icon: "Snow", title: "Cooler Temperatures", desc: "Experience cooler weather due to the higher elevation." },
      { icon: "Peace", title: "Relatively Quiet", desc: "A peaceful escape compared to the more bustling areas of Nainital." },
      { icon: "Shop", title: "Limited Commercial Establishments", desc: "Fewer shops or restaurants, offering a more natural experience." }
    ],
    tips: [
      "Visit early morning for sunrise views and clearer skies.",
      "Carry a good camera and extra batteries.",
      "Dress in layers, as it can get chilly.",
      "Binoculars are recommended for enhanced views."
    ],
    routes: [
      {
        mode: "By Road from Nainital",
        distance: "12km",
        duration: "30-40 minutes",
        route: "Nainital → (local roads towards higher altitudes)",
        icon: "Car",
        details: "Accessible by taxi or private vehicle. Roads are well-maintained but can be winding."
      }
    ],
    popularSpots: [
      {
        name: "Himdarshan Viewpoint",
        id: "himdarshan-viewpoint",
        visitors: "100K+",
        type: "Viewpoint",
        rating: 4.6,
        activities: ["Himalayan Views", "Photography", "Sunrise/Sunset Watching"],
        description: "The main attraction, offering uninterrupted views of the Himalayas.",
        lat: 29.3980,
        lng: 79.4850,
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8ZW58MXx8fHwxNzU3NjE2OTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      }
    ],
    boatingPoints: [],
    hotels: [
      {
        id: "himdarshan-guesthouse",
        name: "Himdarshan Guesthouse",
        description: "Simple accommodation with stunning mountain views.",
        distance: "0.5km from viewpoint",
        rating: 4.0,
        price: "₹2,500",
        features: ["Mountain View", "Basic Amenities", "Homely Food"],
        lat: 29.3975,
        lng: 79.4845,
        image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHtoaW1hbGF5YSUyMG1vdW50YWluJTIwdmlld3xlbnwxfHx8fDE3MzcwMzg0MDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      }
    ],
    localFood: [
      "Hot beverages (tea, coffee)",
      "Simple local snacks"
    ],
    otherActivities: [
      { name: "Stargazing on clear nights", icon: "Star", description: "Experience spectacular stargazing opportunities due to minimal light pollution." },
      { name: "Short walks around the viewpoint", icon: "Walk", description: "Take leisurely short walks to explore the immediate surroundings of the viewpoint." }
    ],
    faqs: [
      {
        question: "What is the main attraction at Himdarshan?",
        answer: "The primary attraction is the panoramic view of the Himalayan mountain range and the surrounding valleys, perfect for photography."
      },
      {
        question: "How far is Himdarshan from Nainital?",
        answer: "It's approximately 12 kilometers from Nainital and can be reached by a short drive."
      }
    ]
  },
   "pangoot":{
    id: "10",
    name: "Pangoot",
    location: "Near Nainital, Kumaon region, Uttarakhand, India",
    rating: 4.6,
    reviewCount: 9000,
    elevation: "1,980 meters (6,496 ft)",
    bestTime: "March-June, Oct-Feb (for birdwatching)",
    peakSeason: "April-June, November-December",
    annualVisitors: 200000,
    lat: 29.4670,
    lng: 79.4750,
    image: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxZnxtb3VudGFpbiUyMGxha2V8ZW58MXx8fHwxNzU3NjIyNzUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    gallery: [
      "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxZnxtb3VudGFpbiUyMGxha2V8ZW58MXx8fHwxNzU3NjIyNzUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1546522303-3162788ca5f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxiaXJkcyUyMGZvcmVzdHxlbnwxfHx8fDE3NTc2MjI4NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1517424911228-569d6b9d6e87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxuYXR1cmUlMjB0cmFpbHMlMjBoaWxsfGVufDF8fHx8MTc1NzYyMjg1M3ww&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    description: "Pangoot, a charming village located 15km from Nainital, is a paradise for birdwatchers and nature enthusiasts. Surrounded by lush oak and pine forests, it boasts over 250 species of birds, making it an ideal destination for serene forest trails and eco-tourism.",
    highlights: [
      "Renowned birdwatching destination",
      "Tranquil forest trails",
      "Rich biodiversity",
      "Eco-friendly environment"
    ],
   whatToExpect: [
      { icon: "Bird", title: "Bird Spotting Opportunities", desc: "High chances of encountering a wide variety of bird species." },
      { icon: "Walking", title: "Peaceful Forest Walks", desc: "Enjoy tranquil strolls through lush oak and pine forests." },
      { icon: "Wind", title: "Cool and Pleasant Weather", desc: "Experience comfortable and refreshing temperatures." },
      { icon: "Peace", title: "Quiet Escape", desc: "A serene retreat perfect for escaping urban hustle." }
    ],
    tips: [
      "Carry binoculars and a bird identification guide.",
      "Wear comfortable walking shoes.",
      "Visit during migration seasons for best birdwatching.",
      "Be respectful of local wildlife and environment."
    ],
    routes: [
      {
        mode: "By Road from Nainital",
        distance: "15km",
        duration: "40-50 minutes",
        route: "Nainital → Pangoot Road",
        icon: "Car",
        details: "The road to Pangoot is scenic but narrow and winding in some sections, best traversed by taxi or private vehicle."
      }
    ],
    popularSpots: [
      {
        name: "Pangoot Bird Sanctuary",
        id: "pangoot-bird-sanctuary",
        visitors: "80K+",
        type: "Wildlife Sanctuary",
        rating: 4.7,
        activities: ["Bird Watching", "Nature Photography", "Trekking"],
        description: "Home to numerous bird species and lush forest trails.",
        lat: 29.4670,
        lng: 79.4750,
        image: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxZnxtb3VudGFpbiUyMGxha2V8ZW58MXx8fHwxNzU3NjIyNzUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      },
      {
        name: "Eco Point",
        id: "eco-point-pangoot",
        visitors: "50K+",
        type: "Viewpoint",
        rating: 4.4,
        activities: ["Nature Views", "Photography"],
        description: "A viewpoint offering serene natural beauty and a peaceful environment.",
        lat: 29.4650,
        lng: 79.4700,
        image: "https://images.unsplash.com/photo-1517424911228-569d6b9d6e87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxuYXR1cmUlMjB0cmFpbHMlMjBoaWxsfGVufDF8fHx8MTc1NzYyMjg1M3ww&ixlib=rb-4.1.0&q=80&w=1080"
      }
    ],
    boatingPoints: [],
    hotels: [
      {
        id: "jungle-lores-pangoot",
        name: "Jungle Lores Pangoot",
        description: "A popular retreat offering comfortable stays amidst nature, focused on birdwatching.",
        distance: "0.8km from village center",
        rating: 4.5,
        price: "₹4,000",
        features: ["Birdwatching Tours", "Nature Walks", "Organic Food"],
        lat: 29.4680,
        lng: 79.4740,
        image: "https://images.unsplash.com/photo-1546522303-3162788ca5f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxiaXJkcyUyMGZvcmVzdHxlbnwxfHx8fDE3NTc2MjI4NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      }
    ],
    localFood: [
      "Simple Kumaoni meals",
      "Freshly prepared local dishes"
    ],
    otherActivities: [
      { name: "Photography of flora and fauna", icon: "Camera", description: "Capture the rich plant and animal life of the region." },
      { name: "Village walks and interaction with locals", icon: "Users", description: "Explore the charming village and engage with the local community." }
    ],
    faqs: [
      {
        question: "Why is Pangoot famous?",
        answer: "Pangoot is famous as a prime birdwatching destination, with dense forests attracting a wide variety of Himalayan bird species."
      },
      {
        question: "What kind of birds can be seen in Pangoot?",
        answer: "You can spot over 250 species including Himalayan Griffon, Lammergeier, Blue-winged Minla, and various thrushes, tits, and finches."
      }
    ]
  } 

};
// --- Global helper to generate unique IDs and slugs ---
const generateSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const placeDetailsData = {
  "naina-devi-temple": {
    id: "naina-devi-temple",
    name: "Naina Devi Temple",
    location: "Nainital, Uttarakhand",
    rating: 4.7,
    reviewCount: 500000, // From description "Visited by 500K+ annually"
    entryFee: "Free",
    bestTime: "Morning & Evening Aarti",
    duration: "1-2 hours",
    difficulty: "Easy",
    images: [
      "https://nainitaltourism.org.in/images/places-to-visit/headers/naina-devi-temple-nainital-tourism-entry-fee-timings-holidays-reviews-header.jpg",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtZW1wbGUlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzU3NjIyODUyfDA&ixlib=rb-4.1.0&q=80&w=1080", // Example image
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb3VudGFpbiUyMHZpZXdwb2ludCUyMHN1bnJpc2V8ZW58MXx8fHwxNzM3MDM4NDAwfDA&ixlib=rb-4.1.0&q=80&w=1080", // Example image
    ],
    description: "The Naina Devi Temple is a revered Hindu temple located on the northern shore of Naini Lake in Nainital. It is one of the 51 Shakti Peeths in India, dedicated to Goddess Sati. The temple is a significant spiritual destination, attracting hundreds of thousands of devotees and tourists annually. Its serene location by the lake adds to its spiritual charm.",
    highlights: [
      "One of the 51 Shakti Peeths",
      "Located on the banks of Naini Lake",
      "Spiritual significance",
      "Beautiful architecture",
      "Peaceful atmosphere"
    ],
    whatToExpect: [
      { icon: "Temple", title: "Spiritual Experience", desc: "A sacred site for Hindu devotees" },
      { icon: "Water", title: "Lake Views", desc: "Enjoy views of Naini Lake from the temple" },
      { icon: "People", title: "Crowds", desc: "Can be crowded, especially during festivals" },
      { icon: "Camera", title: "Photography", desc: "Limited photography inside the sanctum" }
    ],
    accessibility: {
      difficulty: "Easy",
      duration: "1-2 hours",
      distance: "Centrally located in Nainital",
      transport: "Walkable from Mall Road, rickshaws available",
      facilities: ["Washrooms", "Shops for offerings", "Seating areas"]
    },
    nearbyAttractions: [
      { name: "Naini Lake", distance: "Adjacent", type: "lake", rating: 4.5, id: "naini-lake" },
      // { name: "Mall Road", distance: "0.5km", type: "shopping", rating: 4.4, id: "mall-road" },
      // { name: "Tibetan Market", distance: "0.7km", type: "market", rating: 4.2, id: "tibetan-market" }
    ],
    nearbyHotels: [
      { name: "The Naini Retreat", distance: "1.5km", rating: 4.6, price: "₹8,000", id: "the-naini-retreat" },
      { name: "Vikram Vintage Inn", distance: "1km", rating: 4.2, price: "₹3,000", id: "vikram-vintage-inn" }
    ],
    tips: [
      "Visit early morning or late evening to avoid crowds",
      "Dress modestly as it is a religious site",
      "Be mindful of your belongings in crowded areas",
      "Combine your visit with a boat ride on Naini Lake"
    ],
    faqs: [
      { question: "What is the significance of Naina Devi Temple?", answer: "It is one of the 51 Shakti Peeths, where the eyes of Goddess Sati are believed to have fallen." },
      { question: "What are the timings for Naina Devi Temple?", answer: "Generally open from 6 AM to 10 PM, with specific timings for Aarti. It's best to check locally for exact timings." },
      { question: "Is there an entry fee for Naina Devi Temple?", answer: "No, entry is free. However, donations are welcome." }
    ]
  },
  "china-peak": {
    id: "china-peak",
    name: "China Peak (Naina Peak)",
    location: "Nainital, Uttarakhand",
    rating: 4.8,
    reviewCount: 200000, // From popularSpots in locationsData
    entryFee: "₹50", // From featuredPlaces
    bestTime: "Sunrise & Daytime",
    duration: "4-6 hours (trek)",
    difficulty: "Moderate",
    images: [
      "https://images.unsplash.com/photo-1717050788940-189e308415fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHRyZWtraW5nJTIwaGltYWRlYXlhfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHtoaW1hbGF5YSUyMG1vdW50YWluJTIwdmlld3xlbnwxfHx8fDE3MzcwMzg0MDB8MA&ixlib=rb-4.1.0&q=80&w=1080", // Example image
      "https://images.unsplash.com/photo-1464822759844-d150ad6d1f6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx0cmVra2luZyUyMHRyYWlsJTIwZm9yZXN0fGVuMXx8fHwxNzM3MDM4NDAwfDA&ixlib=rb-4.1.0&q=80&w=1080", // Example image
    ],
    description: "China Peak, also known as Naina Peak, is the highest point in Nainital, offering spectacular 360-degree panoramic views of the Himalayas and the entire Nainital valley. It's a popular destination for trekking enthusiasts, providing a challenging yet rewarding experience through dense forests.",
    highlights: [
      "Highest peak in Nainital",
      "Panoramic views of Himalayas",
      "Trekking adventure",
      "Sunrise views",
      "Dense forest trails"
    ],
    whatToExpect: [{ icon: "Mountain", title: "Stunning Views", desc: "360-degree views of snow-capped peaks" },
      { icon: "Hiking", title: "Challenging Trek", desc: "Moderate to difficult trek through forests" },
      { icon: "Sunrise", title: "Best for Sunrise", desc: "Witness breathtaking sunrises over the Himalayas" },
      { icon: "Camera", title: "Photography", desc: "Excellent opportunities for landscape photography" }
    ],
    accessibility: {
      difficulty: "Moderate",
      duration: "4-6 hours round trip",
      distance: "6km from Nainital",
      transport: "Trek from Mallital or via a pony ride (partially)",
      facilities: ["Basic rest stops", "Viewpoint benches"]
    },
    nearbyAttractions: [
      { name: "Naini Lake", distance: "6km", type: "lake", rating: 4.5, id: "naini-lake" },
      { name: "Snow View Point", distance: "3.5km", type: "place", rating: 4.6, id: "snow-view-point" },
      { name: "Tiffin Top", distance: "2km", type: "place", rating: 4.7, id: "tiffin-top" }
    ],
    nearbyHotels: [
      { name: "The Naini Retreat", distance: "4km", rating: 4.6, price: "₹8,000", id: "the-naini-retreat" },
      { name: "Shervani Hilltop Resort", distance: "5km", rating: 4.5, price: "₹5,000", id: "shervani-hilltop-resort" }
    ],
    tips: [
      "Start your trek early in the morning to enjoy the sunrise and avoid the midday sun.",
      "Wear sturdy trekking shoes and comfortable clothing.",
      "Carry enough water, snacks, and a first-aid kit.",
      "A local guide is recommended for first-timers.",
      "Check weather conditions before heading out."
    ],
    faqs: [
      { question: "How long does it take to trek to China Peak?", answer: "The trek typically takes 2-3 hours one way, so 4-6 hours for a round trip, depending on your pace." },
      { question: "Is China Peak suitable for beginners?", answer: "It's a moderate trek. While challenging, beginners with good physical fitness can complete it. Pony rides are available for part of the way." },
      { question: "What can I see from China Peak?", answer: "You can see panoramic views of the Himalayan ranges, including Nanda Devi, Trishul, and Nanda Kot, along with the entire Nainital town and Naini Lake." }
    ]
  },
  "bhimtal-lake": {
    id: "bhimtal-lake",
    name: "Bhimtal Lake",
    location: "Bhimtal, Uttarakhand",
    rating: 4.6,
    reviewCount: 300000, // From popularSpots in locationsData
    entryFee: "₹30 (for boating, entry to lake area is free)", // From featuredPlaces
    bestTime: "Morning & Evening",
    duration: "2-4 hours",
    difficulty: "Easy",
    images: [
      "https://images.unsplash.com/photo-1683973200791-47539048cf63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxiaGltdGFsJTIwbGFrZSUyMHV0dGFyYWtoYW5kfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1596707328691-0361e27a1e1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaGltdGFsJTIwdGVtcGxlfGVufDF8fHx8MTcwMzYyMzYwMHww&ixlib=rb-4.1.0&q=80&w=1080", // Example image
      "https://images.unsplash.com/photo-1589182373030-a9b0c7a7b8e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxoYWlkYWtoYW4lMjB0ZW1wbGUlMjBiaGltdGFsfGVufDF8fHx8MTcwMzYyMzYwMHww&ixlib=rb-4.1.0&q=80&w=1080", // Example image
    ],
    description: "Bhimtal Lake is the largest lake in the Kumaon region, known for its serene environment and a picturesque island in the center that houses an aquarium. It's a popular spot for various water activities like boating and kayaking, offering a peaceful retreat away from the bustling crowds of Nainital.",
    highlights: [
      "Largest lake in Kumaon",
      "Island with an aquarium",
      "Boating and kayaking",
      "Peaceful and serene atmosphere",
      "Family-friendly destination"
    ],
    whatToExpect: [
      { icon: "Water", title: "Water Activities", desc: "Boating, kayaking, and paddle boating" },
      { icon: "Fish", title: "Island Aquarium", desc: "Visit the aquarium on the central island" },
      { icon: "Park", title: "Lakeside Parks", desc: "Relax in the well-maintained gardens" },
      { icon: "Camera", title: "Photography", desc: "Scenic views for photography" }
    ],
    accessibility: {
      difficulty: "Easy",
      duration: "2-4 hours",
      distance: "22km from Nainital",
      transport: "Accessible by taxi, bus, or private vehicle",
      facilities: ["Boating docks", "Restaurants", "Washrooms", "Parking"]
    },
    nearbyAttractions: [
      { name: "Bhimeshwar Mahadev Temple", distance: "0.5km", type: "temple", rating: 4.3, id: "bhimeshwar-temple" },
      { name: "Victoria Dam", distance: "1km", type: "viewpoint", rating: 4.0, id: "victoria-dam" },
      { name: "Nal Damyanti Tal", distance: "2km", type: "lake", rating: 4.0, id: "nal-damyanti-tal" }
    ],
    nearbyHotels: [
      { name: "Country Inn Bhimtal", distance: "0.5km", rating: 4.3, price: "₹4,500", id: "country-inn-bhimtal" },
      { name: "The Lake Resort Bhimtal", distance: "2km", rating: 4.6, price: "₹7,000", id: "the-lake-resort-bhimtal" }
    ],
    tips: [
      "Try kayaking for a unique experience on the lake.",
      "Visit the island aquarium for a small fee.",
      "Enjoy a picnic by the lakeside.",
      "Consider staying in Bhimtal for a quieter alternative to Nainital."
    ],
    faqs: [
      { question: "What activities are available at Bhimtal Lake?", answer: "Boating, kayaking, paddle boating, and visiting the island aquarium are popular activities." },
      { question: "Is there an entry fee for Bhimtal Lake?", answer: "Entry to the lake area is generally free, but there are charges for boating and visiting the island aquarium." },
      { question: "How to reach Bhimtal Lake from Nainital?", answer: "Bhimtal is about 22km from Nainital and can be reached by taxi or local bus." }
    ]
  },
  "tiffin-top": {
    id: "tiffin-top",
    name: "Tiffin Top (Dorothy's Seat)",
    location: "4km from Nainital, Uttarakhand",
    rating: 4.7,
    reviewCount: 234,
    entryFee: "Free",
    bestTime: "Sunrise & Sunset",
    duration: "2-3 hours",
    difficulty: "Easy to Moderate",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHZpZXdwb2ludCUyMHN1bnJpc2V8ZW58MXx8fHwxNzM3MDM4NDAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxtb3VudGFpbiUyMHZpZXdwb2ludCUyMHN1bnNldHxlbnwxfHx8fDE3MzcwMzg0MDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1464822759844-d150ad6d1f6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx0cmVra2luZyUyMHRyYWlsJTIwZm9yZXM0fGVufDF8fHx8MTczNzAzODQwMHww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHtoaW1hbGF5YSUyMG1vdW50YWluJTIwdmlld3xlbnwxfHx8fDE3MzcwMzg0MDB8MA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    description: "Named after Dorothy Kellet, an English woman who died here in a aircraft crash, Tiffin Top offers breathtaking panoramic views of the snow-capped Himalayas. This popular viewpoint is accessible via a scenic 4km trek through pine forests and is perfect for nature photography and peaceful contemplation.",
    highlights: [
      "Panoramic Himalayan views",
      "Sunrise and sunset viewpoint",
      "4km scenic trek through pine forests",
      "Photography opportunities",
      "Historical significance",
      "Peaceful environment for meditation"
    ],
    whatToExpect: [
      { icon: "Mountain", title: "Stunning Views", desc: "360-degree views of Himalayan peaks" },
      { icon: "Camera", title: "Photography", desc: "Perfect for landscape and nature photography" },
      { icon: "TreePine", title: "Pine Forest Trek", desc: "Walk through beautiful pine and oak forests" },
      { icon: "Sunrise", title: "Best Timing", desc: "Early morning and evening for best light" }
    ],
    accessibility: {
      difficulty: "Easy to Moderate",
      duration: "2-3 hours round trip",
      distance: "4km from Nainital",
      transport: "By foot (trekking only)",
      facilities: ["Basic seating areas", "Photography spots", "Trail markers"]
    },
    nearbyAttractions: [
      { name: "Snow View Point", distance: "2km", type: "place", rating: 4.6, id: "snow-view-point" },
      { name: "Naina Lake", distance: "4km", type: "lake", rating: 4.5, id: "naini-lake" },
      { name: "Lover's Point", distance: "3km", type: "place", rating: 4.3, id: "lovers-point" },
      { name: "Himalaya Darshan Point", distance: "2.5km", type: "place", rating: 4.5, id: "himalaya-darshan-point" }
    ],
    nearbyHotels: [
      { name: "Himalaya Hotel", distance: "3km", rating: 4.4, price: "₹2,500", id: "himalaya-hotel" },
      { name: "The Pavilion", distance: "4km", rating: 4.6, price: "₹4,000", id: "the-pavilion" },
      { name: "Shervani Hilltop", distance: "3.5km", rating: 4.2, price: "₹3,200", id: "shervani-hilltop" }
    ],
    tips: [
      "Start early morning for sunrise views and to avoid crowds",
      "Carry water and snacks for the trek",
      "Wear comfortable trekking shoes with good grip",
      "Check weather conditions before visiting",
      "Carry warm clothes for early morning/evening visits",
      "Respect the environment - don't litter"
    ],
    faqs: [
      { question: "How to reach Tiffin Top from Nainital?", answer: "4km trek through pine forests starting from Ayarpatta Hills. The trek takes 2-3 hours and is suitable for beginners." },
      { question: "What's the best time to visit Tiffin Top?", answer: "Early morning (5-7 AM) for sunrise views or evening (5-7 PM) for sunset. Avoid monsoon season (July-August)." },
      { question: "Is the trek difficult for beginners?", answer: "No, it's an easy to moderate trek. Well-marked trails through beautiful pine forests. Wear comfortable trekking shoes." },
      { question: "What to carry for the trek?", answer: "Water bottle, snacks, warm clothes for early morning/evening, camera, and comfortable trekking shoes with good grip." },
      { question: "Are there any facilities at Tiffin Top?", answer: "Basic seating areas and photography spots available. No food stalls, so carry your own refreshments." }
    ]
  },
  // Add other popular spots from locationsData.nainital.popularSpots here
  "naini-lake": {
    id: "naini-lake",
    name: "Naini Lake",
    location: "Nainital, Uttarakhand",
    rating: 4.5,
    reviewCount: 500000, // From popularSpots in locationsData
    entryFee: "Free (boating charges apply)",
    bestTime: "Morning & Evening",
    duration: "1-3 hours",
    difficulty: "Easy",
    images: [
      "https://images.unsplash.com/photo-1656828059867-3fb503eb2214?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxuYWluX3x8fHwxNzU3NjE2OTg3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtZW1wbGUlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzU3NjIyODUyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb3VudGFpbiUyMHZpZXdwb2ludCUyMHN1bnJpc2V8ZW58MXx8fHwxNzM3MDM4NDAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    description: "Naini Lake is the heart of Nainital, a beautiful crescent-shaped natural freshwater lake surrounded by seven hills. It's a popular tourist attraction offering boating, yachting, and paddle boating. The lake is flanked by the famous Mall Road and the Naina Devi Temple, making it a vibrant hub of activity.",
    highlights: [
      "Crescent-shaped natural lake",
      "Boating and water sports",
      "Surrounded by seven hills",
      "Proximity to Mall Road and Naina Devi Temple",
      "Picturesque views"
    ],
    whatToExpect: [
      { icon: "Boat", title: "Boating Experience", desc: "Enjoy paddle boats, rowboats, or yachts" },
      { icon: "Walk", title: "Lakeside Stroll", desc: "Walk along the Mall Road and Thandi Sadak" },
      { icon: "Temple", title: "Temple Views", desc: "View Naina Devi Temple from the lake" },
      { icon: "Camera", title: "Photography", desc: "Great for scenic and candid shots" }
    ],
    accessibility: {
      difficulty: "Easy",
      duration: "1-3 hours",
      distance: "Central Nainital",
      transport: "Walkable from most parts of Nainital, rickshaws available",
      facilities: ["Boating docks", "Food stalls", "Seating areas", "Washrooms"]
    },
    nearbyAttractions: [
      { name: "Naina Devi Temple", distance: "Adjacent", type: "temple", rating: 4.7, id: "naina-devi-temple" },
      { name: "Mall Road", distance: "Adjacent", type: "shopping", rating: 4.4, id: "mall-road" },
      { name: "Flats Ground", distance: "0.2km", type: "recreation", rating: 4.0, id: "flats-ground" }
    ],
    nearbyHotels: [
      { name: "The Naini Retreat", distance: "1.5km", rating: 4.6, price: "₹8,000", id: "the-naini-retreat" },
      { name: "Vikram Vintage Inn", distance: "1km", rating: 4.2, price: "₹3,000", id: "vikram-vintage-inn" }
    ],
    tips: [
      "Try a rowboat for a more traditional experience.",
      "Visit during sunrise or sunset for stunning reflections on the water.",
      "Bargain politely for boat rides if you feel the price is too high.",
      "Avoid feeding the ducks with unhealthy food."
    ],
    faqs: [
      { question: "What are the boating charges at Naini Lake?", answer: "Paddle boats: ₹150/hour, Yacht rides: ₹210/round trip, Row boats: ₹120/hour. Timings: 6 AM - 6 PM daily." },
      { question: "Is swimming allowed in Naini Lake?", answer: "No, swimming is generally not allowed in Naini Lake for safety and ecological reasons." },
      { question: "Can I walk around Naini Lake?", answer: "Yes, you can walk along the Mall Road on one side and Thandi Sadak on the other, offering a full circuit around the lake." }
    ]
  },
  "snow-view-point": {
    id: "snow-view-point",
    name: "Snow View Point",
    location: "2.5km from Nainital, Uttarakhand",
    rating: 4.6,
    reviewCount: 300000, // From popularSpots in locationsData
    entryFee: "₹50 (for cable car)",
    bestTime: "Morning",
    duration: "1-2 hours",
    difficulty: "Easy",
    images: [
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHtoaW1hbGF5YSUyMG1vdW50YWluJTIwdmlld3xlbnwxfHx8fDE3MzcwMzg0MDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1464822759844-d150ad6d1f6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx0cmVra2luZyUyMHRyYWlsJTIwZm9yZXN0fGVuMXx8fHwxNzM3MDM4NDAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHZpZXdwb2ludCUyMHN1bnJpc2V8ZW58MXx8fHwxNzM3MDM4NDAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    description: "Snow View Point is one of the most accessible and popular viewpoints in Nainital, offering magnificent panoramic views of the snow-capped Himalayan peaks like Nanda Devi, Trishul, and Nanda Kot. It can be reached by an aerial ropeway (cable car) from Mallital, providing a thrilling ride with stunning vistas.",
    highlights: [
      "Panoramic Himalayan views",
      "Accessible by cable car",
      "Views of Nanda Devi, Trishul, Nanda Kot",
      "Telescopes available for closer views",
      "Small temple and shops at the top"
    ],
    whatToExpect: [
      { icon: "CableCar", title: "Ropeway Ride", desc: "Enjoy a scenic cable car ride to the top" },
      { icon: "Mountain", title: "Himalayan Panorama", desc: "Witness majestic snow-capped peaks" },
      { icon: "Telescope", title: "Telescope Views", desc: "Use telescopes for detailed mountain views" },
      { icon: "Shop", title: "Souvenir Shops", desc: "Browse local handicrafts and snacks" }
    ],
    accessibility: {
      difficulty: "Easy",
      duration: "1-2 hours",
      distance: "2.5km from Nainital",
      transport: "Cable car from Mallital, or a short trek/pony ride",
      facilities: ["Cable car station", "Telescopes", "Shops", "Small temple"]
    },
    nearbyAttractions: [
      { name: "Naini Lake", distance: "2.5km", type: "lake", rating: 4.5, id: "naini-lake" },
      { name: "Mall Road", distance: "2.5km", type: "shopping", rating: 4.4, id: "mall-road" },
      { name: "Naina Peak (China Peak)", distance: "3.5km", type: "trek", rating: 4.9, id: "china-peak" }
    ],
    nearbyHotels: [
      { name: "The Naini Retreat", distance: "2km", rating: 4.6, price: "₹8,000", id: "the-naini-retreat" },
      { name: "Shervani Hilltop Resort", distance: "3km", rating: 4.5, price: "₹5,000", id: "shervani-hilltop-resort" }
    ],
    tips: [
      "Visit early in the morning for the clearest views, especially during winter.",
      "The cable car can have long queues during peak season, so plan accordingly.",
      "Carry a jacket as it can be windy and cold at the top.",
      "Don't forget your camera for stunning mountain shots."
    ],
    faqs: [
      { question: "How to reach Snow View Point?", answer: "The easiest way is by aerial ropeway (cable car) from Mallital. You can also trek or take a pony ride." },
      { question: "What are the cable car timings and charges?", answer: "The cable car usually operates from 10 AM to 5 PM. Charges are approximately ₹150-200 for a round trip. Confirm locally for exact timings and prices." },
      { question: "What can I see from Snow View Point?", answer: "You get clear views of prominent Himalayan peaks like Nanda Devi, Trishul, and Nanda Kot, along with a bird's-eye view of Nainital town and Naini Lake." }
    ]
  },
  "high-altitude-zoo": {
    id: "high-altitude-zoo",
    name: "Pt. G.B. Pant High Altitude Zoo",
    location: "Tallital, Nainital, Uttarakhand",
    rating: 4.3,
    reviewCount: 150000, // From popularSpots in locationsData
    entryFee: "₹50 (Adults), ₹20 (Children)",
    bestTime: "Daytime",
    duration: "2-3 hours",
    difficulty: "Easy to Moderate (uphill walk)",
    images: [
      "https://images.unsplash.com/photo-1589182373030-a9b0c7a7b8e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxoYWlkYWtoYW4lMjB0ZW1wbGUlMjBiaGltdGFsfGVufDF8fHx8MTcwMzYyMzYwMHww&ixlib=rb-4.1.0&q=80&w=1080", // Placeholder, find a relevant image
      "https://images.unsplash.com/photo-1596707328691-0361e27a1e1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaGltdGFsJTIwdGVtcGxlfGVufDF8fHx8MTcwMzYyMzYwMHww&ixlib=rb-4.1.0&q=80&w=1080", // Placeholder
    ],
    description: "The Pt. G.B. Pant High Altitude Zoo is one of the few high-altitude zoos in India, home to several endangered species of animals and birds found in the Himalayan region. It's a great place for wildlife enthusiasts and families to observe animals like the Snow Leopard, Himalayan Bear, Tibetan Wolf, and various pheasants in a natural habitat.",
    highlights: [
      "High-altitude zoo",
      "Home to endangered Himalayan species",
      "Snow Leopard, Himalayan Bear, Tibetan Wolf",
      "Bird watching opportunities",
      "Educational and family-friendly"
    ],
    whatToExpect: [
      { icon: "PawPrint", title: "Wildlife Viewing", desc: "Observe rare Himalayan animals" },
      { icon: "Bird", title: "Bird Watching", desc: "Spot various high-altitude birds" },
      { icon: "Walk", title: "Uphill Walk", desc: "The zoo is built on a hillside, involves walking uphill" },
      { icon: "Family", title: "Family Fun", desc: "Engaging for children and adults" }
    ],
    accessibility: {
      difficulty: "Easy to Moderate",
      duration: "2-3 hours",
      distance: "2km from Mall Road",
      transport: "Accessible by taxi or a steep walk from Tallital",
      facilities: ["Washrooms", "Cafeteria", "Souvenir shops", "Drinking water"]
    },
    nearbyAttractions: [
      { name: "Naini Lake", distance: "2km", type: "lake", rating: 4.5, id: "naini-lake" },
      { name: "Mall Road", distance: "2km", type: "shopping", rating: 4.4, id: "mall-road" },
      { name: "Tallital Bus Stand", distance: "1.5km", type: "transport", rating: 3.8, id: "tallital-bus-stand" }
    ],
    nearbyHotels: [
      { name: "Hotel Himalaya", distance: "2.5km", rating: 4.4, price: "₹2,500", id: "himalaya-hotel" },
      { name: "The Pavilion", distance: "3km", rating: 4.6, price: "₹4,000", id: "the-pavilion" }
    ],
    tips: [
      "Wear comfortable walking shoes as there's a fair amount of uphill walking.",
      "Visit during feeding times for a better chance to see the animals active.",
      "Avoid visiting during peak summer afternoons as it can get hot.",
      "Photography is allowed, but avoid using flash."
    ],
    faqs: [
      { question: "What are the opening hours of Nainital Zoo?", answer: "The zoo is generally open from 10 AM to 4:30 PM, but it remains closed on Mondays and national holidays. Confirm locally for exact timings." },
      { question: "What animals can I see at the High Altitude Zoo?", answer: "You can see animals like Snow Leopard, Himalayan Bear, Tibetan Wolf, Sambar, Barking Deer, and various species of pheasants." },
      { question: "Is the zoo suitable for young children?", answer: "Yes, it's a great educational experience for children, but be prepared for some uphill walking." }
    ]
  },
  "eco-cave-gardens": {
    id: "eco-cave-gardens",
    name: "Eco Cave Gardens",
    location: "Mallital, Nainital, Uttarakhand",
    rating: 4.2,
    reviewCount: 180000, // From popularSpots in locationsData
    entryFee: "₹60 (Adults), ₹25 (Children)",
    bestTime: "Daytime",
    duration: "1-2 hours",
    difficulty: "Easy to Moderate",
    images: [
      "https://images.unsplash.com/photo-1683973200791-47539048cf63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxiaGltdGFsJTIwbGFrZSUyMHV0dGFyYWtoYW5kfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080", // Placeholder, find a relevant image
      "https://images.unsplash.com/photo-1596707328691-0361e27a1e1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaGltdGFsJTIwdGVtcGxlfGVufDF8fHx8MTcwMzYyMzYwMHww&ixlib=rb-4.1.0&q=80&w=1080", // Placeholder
    ],
    description: "Eco Cave Gardens is a network of interconnected natural caves and hanging gardens, designed to give visitors a glimpse into the natural habitat of various animals through artificial caves. It features six small caves named after different animals like Tiger Cave, Panther Cave, Bat Cave, etc., along with a musical fountain.",
    highlights: [
      "Interconnected natural caves",
      "Hanging gardens",
      "Musical fountain",
      "Animal-themed caves",
      "Fun for children and families"
    ],
    whatToExpect: [
      { icon: "Cave", title: "Cave Exploration", desc: "Crawl and walk through small, natural caves" },
      { icon: "Garden", title: "Hanging Gardens", desc: "Enjoy the lush green surroundings" },
      { icon: "Music", title: "Musical Fountain", desc: "Evening shows with light and music" },
      { icon: "Family", title: "Kids Friendly", desc: "Engaging and adventurous for children" }
    ],
    accessibility: {
      difficulty: "Easy to Moderate",
      duration: "1-2 hours",
      distance: "1km from Mall Road",
      transport: "Walkable from Mall Road, or short taxi ride",
      facilities: ["Washrooms", "Snack stalls", "Seating areas"]
    },
    nearbyAttractions: [
      { name: "Naini Lake", distance: "1km", type: "lake", rating: 4.5, id: "naini-lake" },
      { name: "Mall Road", distance: "1km", type: "shopping",rating: 4.4, id: "mall-road" },
      { name: "Flats Ground", distance: "0.5km", type: "recreation", rating: 4.0, id: "flats-ground" }
    ],
    nearbyHotels: [
      { name: "The Naini Retreat", distance: "2km", rating: 4.6, price: "₹8,000", id: "the-naini-retreat" },
      { name: "Vikram Vintage Inn", distance: "1.5km", rating: 4.2, price: "₹3,000", id: "vikram-vintage-inn" }
    ],
    tips: [
      "Wear comfortable shoes as you'll be walking and crawling through caves.",
      "Be cautious inside the caves as some passages are narrow and dimly lit.",
      "Visit in the evening to enjoy the musical fountain show.",
      "It's a great spot for families with children."
    ],
    faqs: [
      { question: "What are the timings for Eco Cave Gardens?", answer: "It is generally open from 9:30 AM to 5:30 PM daily. The musical fountain show usually starts after sunset." },
      { question: "Is Eco Cave Gardens suitable for all ages?", answer: "While fun for most, some cave passages are narrow and might be challenging for very young children, elderly, or those with mobility issues." },
      { question: "What kind of caves are there?", answer: "There are six interconnected natural caves, each named after an animal (e.g., Tiger Cave, Panther Cave), designed to give a feel of their natural habitat." }
    ]
  },
  "hanumangarhi": {
    id: "hanumangarhi",
    name: "Hanumangarhi",
    location: "Nainital, Uttarakhand",
    rating: 4.5,
    reviewCount: 120000, // From popularSpots in locationsData
    entryFee: "Free",
    bestTime: "Sunrise & Sunset",
    duration: "1-2 hours",
    difficulty: "Easy",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtZW1wbGUlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzU3NjIyODUyfDA&ixlib=rb-4.1.0&q=80&w=1080", // Placeholder, find a relevant image
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb3VudGFpbiUyMHZpZXdwb2ludCUyMHN1bnJpc2V8ZW58MXx8fHwxNzM3MDM4NDAwfDA&ixlib=rb-4.1.0&q=80&w=1080", // Placeholder
    ],
    description: "Hanumangarhi is a famous Hanuman temple located on a hill, offering stunning views of the sunrise and sunset over the Himalayas and the entire valley. It's a peaceful spiritual spot and a popular viewpoint, especially for its breathtaking celestial displays.",
    highlights: [
      "Famous Hanuman temple",
      "Spectacular sunrise and sunset views",
      "Panoramic valley views",
      "Peaceful spiritual atmosphere",
      "Accessible location"
    ],
    whatToExpect: [
      { icon: "Temple", title: "Spiritual Visit", desc: "Seek blessings at the Hanuman temple" },
      { icon: "Sunrise", title: "Sunrise/Sunset Views", desc: "Witness magnificent celestial displays" },
      { icon: "Mountain", title: "Valley Views", desc: "Enjoy panoramic views of the surrounding valley" },
      { icon: "Camera", title: "Photography", desc: "Great for capturing scenic beauty" }
    ],
    accessibility: {
      difficulty: "Easy",
      duration: "1-2 hours",
      distance: "3.5km from Tallital",
      transport: "Accessible by taxi or shared jeep from Tallital",
      facilities: ["Temple premises", "Small shops for offerings", "Seating areas"]
    },
    nearbyAttractions: [
      { name: "Naini Lake", distance: "3.5km", type: "lake", rating: 4.5, id: "naini-lake" },
      { name: "Tallital Bus Stand", distance: "3.5km", type: "transport", rating: 3.8, id: "tallital-bus-stand" },
      { name: "High Altitude Zoo", distance: "2km", type: "wildlife", rating: 4.3, id: "high-altitude-zoo" }
    ],
    nearbyHotels: [
      { name: "Hotel Himalaya", distance: "3km", rating: 4.4, price: "₹2,500", id: "himalaya-hotel" },
      { name: "The Pavilion", distance: "4km", rating: 4.6, price: "₹4,000", id: "the-pavilion" }
    ],
    tips: [
      "Visit early morning for sunrise or late afternoon for sunset views.",
      "Dress modestly as it is a religious site.",
      "Combine your visit with a trip to the High Altitude Zoo, which is relatively close."
    ],
    faqs: [
      { question: "What is Hanumangarhi famous for?", answer: "It is famous for its Hanuman temple and the spectacular sunrise and sunset views it offers over the Himalayas and the valley." },
      { question: "How to reach Hanumangarhi?", answer: "It's about 3.5 km from Tallital and can be reached by taxi or shared jeep." },
      { question: "Are there any other temples nearby?", answer: "Yes, there is also a small temple dedicated to Lord Rama and Sita near Hanumangarhi." }
    ]
  },
  "lands-end": {
    id: "lands-end",
    name: "Land's End",
    location: "Nainital, Uttarakhand",
    rating: 4.4,
    reviewCount: 100000, // From popularSpots in locationsData
    entryFee: "Free",
    bestTime: "Daytime",
    duration: "1-2 hours",
    difficulty: "Easy",
    images: [
      "https://images.unsplash.com/photo-1670555383991-ae6ad4bb39df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxiaWxsJTIwcmVzb3J0JTIwbW91bnRhaW4lMjB2aWV3fGVufDF8fHx8MTc1NzYxNjk4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", // Placeholder, find a relevant image
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHZpZXdwb2ludCUyMHN1bnJpc2V8ZW58MXx8fHwxNzM3MDM4NDAwfDA&ixlib=rb-4.1.0&q=80&w=1080", // Placeholder
    ],
    description: "Land's End is a picturesque viewpoint that offers stunning panoramic views of the plains and the Khurpatal lake. It's a cliff-edge spot that provides a feeling of being at the 'end of the land,' making it a popular picnic spot and a great place for photography.",
    highlights: [
      "Cliff-edge viewpoint",
      "Panoramic views of plains and Khurpatal lake",
      "Popular picnic spot",
      "Scenic beauty",
      "Peaceful environment"
    ],
    whatToExpect: [
      { icon: "Mountain", title: "Scenic Views", desc: "Enjoy expansive views of the plains and lake" },
      { icon: "Picnic", title: "Picnic Spot", desc: "Ideal for a relaxing picnic with family or friends" },
      { icon: "Camera", title: "Photography", desc: "Capture beautiful landscape shots" },
      { icon: "Walk", title: "Easy Walk", desc: "Relatively easy walk to the viewpoint" }
    ],
    accessibility: {
      difficulty: "Easy",
      duration: "1-2 hours",
      distance: "5km from Nainital",
      transport: "Accessible by pony ride or a short trek from Bara Pathar",
      facilities: ["Seating areas", "Small tea stalls"]
    },
    nearbyAttractions: [
      { name: "Khurpatal", distance: "2km", type: "lake", rating: 4.1, id: "khurpatal" },
      { name: "Tiffin Top", distance: "3km", type: "place", rating: 4.7, id: "tiffin-top" },
      { name: "Bara Pathar", distance: "1km", type: "landmark", rating: 3.9, id: "bara-pathar" }
    ],
    nearbyHotels: [
      { name: "Shervani Hilltop Resort", distance: "4km", rating: 4.5, price: "₹5,000", id: "shervani-hilltop-resort" },
      { name: "The Naini Retreat", distance: "5km", rating: 4.6, price: "₹8,000", id: "the-naini-retreat" }
    ],
    tips: [
      "Take a pony ride from Bara Pathar for a fun experience.",
      "Carry snacks and water if you plan to picnic.",
      "Visit during clear weather for the best views.",
      "Be careful near the cliff edge."
    ],
    faqs: [
      { question: "How to reach Land's End?", answer: "You can take a pony ride from Bara Pathar, which is about 4km from Nainital, or trek the remaining distance." },
      { question: "What views can I expect from Land's End?", answer: "You get spectacular views of the plains, the beautiful Khurpatal lake, and the surrounding hills." },
      { question: "Is Land's End suitable for children?", answer: "Yes, it's a relatively easy and enjoyable spot for families, but always supervise children near the cliff." }
    ]
  },
  "khurpatal": {
    id: "khurpatal",
    name: "Khurpatal",
    location: "12km from Nainital, Uttarakhand",
    rating: 4.1,
    reviewCount: 80000, // From popularSpots in locationsData
    entryFee: "Free (fishing charges apply)",
    bestTime: "Daytime",
    duration: "1-2 hours",
    difficulty: "Easy",
    images: [
      "https://images.unsplash.com/photo-1683973200791-47539048cf63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxiaGltdGFsJTIwbGFrZSUyMHV0dGFyYWtoYW5kfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080", // Placeholder, find a relevant image
      "https://images.unsplash.com/photo-1596707328691-0361e27a1e1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaGltdGFsJTIwdGVtcGxlfGVufDF8fHx8MTcwMzYyMzYwMHww&ixlib=rb-4.1.0&q=80&w=1080", // Placeholder
    ],
    description: "Khurpatal is a small, emerald-colored lake located about 12 km from Nainital, known for its crystal-clear waters and peaceful surroundings. It's a hidden gem, less crowded than Naini Lake, and popular for fishing and tranquil walks amidst lush greenery.",
    highlights: [
      "Emerald-colored lake",
      "Peaceful and less crowded",
      "Popular for fishing",
      "Surrounded by lush greenery",
      "Scenic drive from Nainital"
    ],
    whatToExpect: [
      { icon: "Fish", title: "Fishing", desc: "Enjoy fishing in the clear waters (with permit)" },
      { icon: "Walk", title: "Peaceful Walks", desc: "Stroll around the lake in a serene environment" },
      { icon: "Camera", title: "Photography", desc: "Capture the beauty of the emerald lake" },
      { icon: "Car", title: "Scenic Drive", desc: "Enjoy the picturesque drive to Khurpatal" }
    ],
    accessibility: {
      difficulty: "Easy",
      duration: "1-2 hours",
      distance: "12km from Nainital",
      transport: "Accessible by taxi or private vehicle",
      facilities: ["Small eateries", "Boating (limited)"]
    },
    nearbyAttractions: [
      { name: "Land's End", distance: "2km", type: "place", rating: 4.4, id: "lands-end" },
      { name: "Bhimtal Lake", distance: "15km", type: "lake", rating: 4.6, id: "bhimtal-lake" },
      { name: "Nainital", distance: "12km", type: "city", rating: 4.7, id: "nainital" }
    ],
    nearbyHotels: [
      { name: "Country Inn Bhimtal", distance: "15km", rating: 4.3, price: "₹4,500", id: "country-inn-bhimtal" },
      { name: "The Lake Resort Bhimtal", distance: "17km", rating: 4.6, price: "₹7,000", id: "the-lake-resort-bhimtal" }
    ],
    tips: [
      "If you plan to fish, inquire about permits beforehand.",
      "It's a great spot for a quiet escape from the main tourist areas.",
      "Carry your own snacks and drinks as options are limited.",
      "The road to Khurpatal is scenic but can be winding."
    ],
    faqs: [
      { question: "What is Khurpatal known for?", answer: "Khurpatal is known for its beautiful emerald-colored lake, peaceful environment, and opportunities for fishing." },
      { question: "How far is Khurpatal from Nainital?", answer: "It is approximately 12 kilometers from Nainital." },
      { question: "Can I do boating in Khurpatal?", answer: "Boating options are limited compared to Naini Lake or Bhimtal Lake, but sometimes local rowboats are available." }
    ]
  },
  "lovers-point": {
    id: "lovers-point",
    name: "Lover's Point",
    location: "Nainital, Uttarakhand",
    rating: 4.3,
    reviewCount: 90000, // From popularSpots in locationsData
    entryFee: "Free",
    bestTime: "Daytime",
    duration: "0.5-1 hour",
    difficulty: "Easy",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHZpZXdwb2ludCUyMHN1bnJpc2V8ZW58MXx8fHwxNzM3MDM4NDAwfDA&ixlib=rb-4.1.0&q=80&w=1080", // Placeholder, find a relevant image
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHtoaW1hbGF5YSUyMG1vdW50YWluJTIwdmlld3xlbnwxfHx8fDE3MzcwMzg0MDB8MA&ixlib=rb-4.1.0&q=80&w=1080", // Placeholder
    ],
    description: "Lover's Point is a scenic viewpoint in Nainital, popular among couples and families for its beautiful views of the Naini Lake and the surrounding valley. It's often visited along with Suicide Point (which is adjacent) and offers a serene spot for photography and enjoying the natural beauty.",
    highlights: [
      "Scenic views of Naini Lake",
      "Popular among couples",
      "Adjacent to Suicide Point",
      "Photography opportunities",
      "Peaceful and romantic atmosphere"
    ],
    whatToExpect: [
      { icon: "Heart", title: "Romantic Views", desc: "Enjoy picturesque views with loved ones" },
      { icon: "Camera", title: "Photography", desc: "Great spot for memorable photos" },
      { icon: "Walk", title: "Short Walk", desc: "Easily accessible with a short walk" },
      { icon: "Mountain", title: "Valley Views", desc: "Panoramic views of the valley" }
    ],
    accessibility: {
      difficulty: "Easy",
      duration: "0.5-1 hour",
      distance: "2km from Mall Road",
      transport: "Accessible by pony ride or a short walk from the main road",
      facilities: ["Small shops", "Seating areas"]
    },
    nearbyAttractions: [
      { name: "Suicide Point", distance: "Adjacent", type: "viewpoint", rating: 3.5, id: "suicide-point" }, // Note: Name might be sensitive, but it's a known landmark
      { name: "Tiffin Top", distance: "3km", type: "place", rating: 4.7, id: "tiffin-top" },
      { name: "Naini Lake", distance: "2km", type: "lake", rating: 4.5, id: "naini-lake" }
    ],
    nearbyHotels: [
      { name: "The Naini Retreat", distance: "2.5km", rating: 4.6, price: "₹8,000", id: "the-naini-retreat" },
      { name: "Shervani Hilltop Resort", distance: "3km", rating: 4.5, price: "₹5,000", id: "shervani-hilltop-resort" }
    ],
    tips: [
      "Be mindful of the crowds, especially during peak season.",
      "Combine your visit with a pony ride to nearby viewpoints.",
      "Be cautious near the edges, especially with children.",
      "Enjoy the local snacks sold by vendors."
    ],
    faqs: [
      { question: "How to reach Lover's Point?", answer: "It's about 2km from Mall Road and can be reached by pony ride or a short walk from the main road." },
      { question: "What views does Lover's Point offer?", answer: "It offers beautiful views of Naini Lake and the surrounding valley, making it a popular spot for couples." },
      { question: "Is it safe to visit Lover's Point?", answer: "Yes, it's safe, but always exercise caution near the cliff edges and keep an eye on children." }
    ]
  }
};