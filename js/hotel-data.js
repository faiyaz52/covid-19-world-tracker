/**
 * Hotel Data Module - Sample hotel data and search functionality
 * Simulates a hotel booking API with realistic data
 */

const HotelData = {
    hotels: [
        {
            id: 1,
            name: "Grand Plaza Hotel",
            description: "Luxury hotel in the heart of the city with exceptional service and amenities.",
            location: "Downtown New York",
            coordinates: { lat: 40.7589, lng: -73.9851 },
            starRating: 5,
            rating: 4.5,
            reviewCount: 2847,
            images: [
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
                "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400",
                "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400"
            ],
            amenities: ["wifi", "pool", "gym", "spa", "restaurant", "parking", "concierge"],
            address: "123 Broadway, New York, NY 10001",
            phone: "+1 (555) 123-4567",
            email: "info@grandplazahotel.com",
            checkInTime: "15:00",
            checkOutTime: "11:00",
            rooms: [
                {
                    id: 101,
                    type: "Standard Room",
                    description: "Comfortable room with city view and modern amenities",
                    price: 299,
                    currency: "USD",
                    maxGuests: 2,
                    bedType: "Queen Bed",
                    size: "35 sqm",
                    amenities: ["wifi", "minibar", "safe", "tv"],
                    images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400"],
                    availability: true
                },
                {
                    id: 102,
                    type: "Deluxe Suite",
                    description: "Spacious suite with separate living area and premium amenities",
                    price: 499,
                    currency: "USD",
                    maxGuests: 4,
                    bedType: "King Bed + Sofa Bed",
                    size: "65 sqm",
                    amenities: ["wifi", "minibar", "safe", "tv", "balcony", "kitchenette"],
                    images: ["https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400"],
                    availability: true
                }
            ]
        },
        {
            id: 2,
            name: "Seaside Resort & Spa",
            description: "Beachfront resort with stunning ocean views and world-class spa facilities.",
            location: "Miami Beach",
            coordinates: { lat: 25.7617, lng: -80.1918 },
            starRating: 4,
            rating: 4.3,
            reviewCount: 1923,
            images: [
                "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
                "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400",
                "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400"
            ],
            amenities: ["wifi", "pool", "spa", "restaurant", "beach", "parking"],
            address: "456 Ocean Drive, Miami Beach, FL 33139",
            phone: "+1 (555) 987-6543",
            email: "reservations@seasideresort.com",
            checkInTime: "16:00",
            checkOutTime: "12:00",
            rooms: [
                {
                    id: 201,
                    type: "Ocean View Room",
                    description: "Beautiful room with direct ocean views and private balcony",
                    price: 349,
                    currency: "USD",
                    maxGuests: 2,
                    bedType: "King Bed",
                    size: "40 sqm",
                    amenities: ["wifi", "minibar", "safe", "tv", "balcony"],
                    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400"],
                    availability: true
                },
                {
                    id: 202,
                    type: "Beachfront Villa",
                    description: "Luxurious villa with private beach access and butler service",
                    price: 899,
                    currency: "USD",
                    maxGuests: 6,
                    bedType: "2 King Beds + 2 Single Beds",
                    size: "120 sqm",
                    amenities: ["wifi", "minibar", "safe", "tv", "balcony", "kitchenette", "butler"],
                    images: ["https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400"],
                    availability: true
                }
            ]
        },
        {
            id: 3,
            name: "Mountain Lodge Retreat",
            description: "Cozy mountain lodge perfect for nature lovers and outdoor enthusiasts.",
            location: "Aspen, Colorado",
            coordinates: { lat: 39.1911, lng: -106.8175 },
            starRating: 3,
            rating: 4.1,
            reviewCount: 756,
            images: [
                "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
                "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400"
            ],
            amenities: ["wifi", "restaurant", "gym", "parking", "fireplace"],
            address: "789 Mountain View Road, Aspen, CO 81611",
            phone: "+1 (555) 456-7890",
            email: "stay@mountainlodge.com",
            checkInTime: "15:00",
            checkOutTime: "11:00",
            rooms: [
                {
                    id: 301,
                    type: "Cozy Cabin Room",
                    description: "Rustic room with mountain views and cozy fireplace",
                    price: 189,
                    currency: "USD",
                    maxGuests: 2,
                    bedType: "Queen Bed",
                    size: "30 sqm",
                    amenities: ["wifi", "fireplace", "tv"],
                    images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400"],
                    availability: true
                },
                {
                    id: 302,
                    type: "Family Suite",
                    description: "Spacious suite perfect for families with bunk beds for kids",
                    price: 289,
                    currency: "USD",
                    maxGuests: 6,
                    bedType: "King Bed + Bunk Beds",
                    size: "55 sqm",
                    amenities: ["wifi", "fireplace", "tv", "kitchenette"],
                    images: ["https://images.unsplash.com/photo-1631049552240-59c37f38802b?w=400"],
                    availability: true
                }
            ]
        },
        {
            id: 4,
            name: "Business Center Hotel",
            description: "Modern business hotel with state-of-the-art conference facilities.",
            location: "Chicago Downtown",
            coordinates: { lat: 41.8781, lng: -87.6298 },
            starRating: 4,
            rating: 4.2,
            reviewCount: 1456,
            images: [
                "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",
                "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400",
                "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400"
            ],
            amenities: ["wifi", "gym", "restaurant", "parking", "business-center"],
            address: "321 Michigan Avenue, Chicago, IL 60601",
            phone: "+1 (555) 234-5678",
            email: "reservations@businesscenter.com",
            checkInTime: "15:00",
            checkOutTime: "12:00",
            rooms: [
                {
                    id: 401,
                    type: "Business Room",
                    description: "Well-equipped room perfect for business travelers",
                    price: 249,
                    currency: "USD",
                    maxGuests: 2,
                    bedType: "King Bed",
                    size: "32 sqm",
                    amenities: ["wifi", "desk", "safe", "tv"],
                    images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400"],
                    availability: true
                },
                {
                    id: 402,
                    type: "Executive Suite",
                    description: "Premium suite with dedicated workspace and meeting area",
                    price: 449,
                    currency: "USD",
                    maxGuests: 3,
                    bedType: "King Bed + Sofa",
                    size: "60 sqm",
                    amenities: ["wifi", "desk", "safe", "tv", "meeting-area"],
                    images: ["https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400"],
                    availability: true
                }
            ]
        },
        {
            id: 5,
            name: "Historic Heritage Inn",
            description: "Charming historic inn with traditional architecture and modern comforts.",
            location: "Boston Historic District",
            coordinates: { lat: 42.3601, lng: -71.0589 },
            starRating: 3,
            rating: 4.0,
            reviewCount: 892,
            images: [
                "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
                "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400"
            ],
            amenities: ["wifi", "restaurant", "parking", "historic"],
            address: "567 Historic Street, Boston, MA 02108",
            phone: "+1 (555) 345-6789",
            email: "info@heritageinn.com",
            checkInTime: "14:00",
            checkOutTime: "11:00",
            rooms: [
                {
                    id: 501,
                    type: "Classic Room",
                    description: "Traditional room with period furnishings and modern amenities",
                    price: 179,
                    currency: "USD",
                    maxGuests: 2,
                    bedType: "Queen Bed",
                    size: "28 sqm",
                    amenities: ["wifi", "tv", "historic-decor"],
                    images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400"],
                    availability: true
                },
                {
                    id: 502,
                    type: "Heritage Suite",
                    description: "Elegant suite with antique furnishings and city views",
                    price: 329,
                    currency: "USD",
                    maxGuests: 4,
                    bedType: "King Bed + Daybed",
                    size: "50 sqm",
                    amenities: ["wifi", "tv", "historic-decor", "sitting-area"],
                    images: ["https://images.unsplash.com/photo-1631049552240-59c37f38802b?w=400"],
                    availability: true
                }
            ]
        },
        {
            id: 6,
            name: "Budget Friendly Inn",
            description: "Clean, comfortable accommodation at an affordable price.",
            location: "Las Vegas Strip",
            coordinates: { lat: 36.1699, lng: -115.1398 },
            starRating: 2,
            rating: 3.8,
            reviewCount: 543,
            images: [
                "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",
                "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400"
            ],
            amenities: ["wifi", "parking"],
            address: "890 Vegas Boulevard, Las Vegas, NV 89109",
            phone: "+1 (555) 567-8901",
            email: "reservations@budgetinn.com",
            checkInTime: "15:00",
            checkOutTime: "11:00",
            rooms: [
                {
                    id: 601,
                    type: "Standard Room",
                    description: "Clean and comfortable room with basic amenities",
                    price: 89,
                    currency: "USD",
                    maxGuests: 2,
                    bedType: "Double Bed",
                    size: "20 sqm",
                    amenities: ["wifi", "tv"],
                    images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400"],
                    availability: true
                },
                {
                    id: 602,
                    type: "Family Room",
                    description: "Larger room suitable for families with multiple beds",
                    price: 129,
                    currency: "USD",
                    maxGuests: 4,
                    bedType: "2 Double Beds",
                    size: "35 sqm",
                    amenities: ["wifi", "tv", "microwave"],
                    images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400"],
                    availability: true
                }
            ]
        }
    ],

    destinations: [
        "New York", "Miami", "Los Angeles", "Chicago", "Boston", "Las Vegas",
        "San Francisco", "Seattle", "Denver", "Austin", "Nashville", "Atlanta"
    ],

    amenityLabels: {
        wifi: "Free WiFi",
        pool: "Swimming Pool",
        gym: "Fitness Center",
        spa: "Spa & Wellness",
        restaurant: "Restaurant",
        parking: "Free Parking",
        beach: "Beach Access",
        concierge: "Concierge Service",
        fireplace: "Fireplace",
        "business-center": "Business Center",
        historic: "Historic Building",
        minibar: "Minibar",
        safe: "In-room Safe",
        tv: "Flat-screen TV",
        balcony: "Balcony",
        kitchenette: "Kitchenette",
        butler: "Butler Service",
        desk: "Work Desk",
        "meeting-area": "Meeting Area",
        "historic-decor": "Historic Decor",
        "sitting-area": "Sitting Area",
        microwave: "Microwave"
    },

    /**
     * Search hotels based on criteria
     */
    searchHotels(searchCriteria) {
        const { destination, checkIn, checkOut, guests, filters } = searchCriteria;
        
        let results = [...this.hotels];
        
        // Filter by destination
        if (destination) {
            results = results.filter(hotel => 
                hotel.location.toLowerCase().includes(destination.toLowerCase()) ||
                hotel.name.toLowerCase().includes(destination.toLowerCase())
            );
        }
        
        // Filter by guest capacity
        if (guests) {
            results = results.filter(hotel => {
                return hotel.rooms.some(room => 
                    room.maxGuests >= (guests.adults + guests.children)
                );
            });
        }
        
        // Apply filters
        if (filters) {
            // Price range filter
            if (filters.priceRange) {
                results = results.filter(hotel => {
                    return hotel.rooms.some(room => room.price <= filters.priceRange);
                });
            }
            
            // Star rating filter
            if (filters.starRating && filters.starRating.length > 0) {
                results = results.filter(hotel => 
                    filters.starRating.includes(hotel.starRating.toString())
                );
            }
            
            // Amenities filter
            if (filters.amenities && filters.amenities.length > 0) {
                results = results.filter(hotel => 
                    filters.amenities.every(amenity => 
                        hotel.amenities.includes(amenity)
                    )
                );
            }
        }
        
        // Sort by rating (default)
        results.sort((a, b) => b.rating - a.rating);
        
        return results;
    },

    /**
     * Get hotel by ID
     */
    getHotelById(id) {
        return this.hotels.find(hotel => hotel.id === parseInt(id));
    },

    /**
     * Get room by hotel ID and room ID
     */
    getRoomById(hotelId, roomId) {
        const hotel = this.getHotelById(hotelId);
        if (!hotel) return null;
        
        return hotel.rooms.find(room => room.id === parseInt(roomId));
    },

    /**
     * Get available rooms for a hotel
     */
    getAvailableRooms(hotelId, checkIn, checkOut, guests) {
        const hotel = this.getHotelById(hotelId);
        if (!hotel) return [];
        
        return hotel.rooms.filter(room => {
            return room.availability && 
                   room.maxGuests >= (guests.adults + guests.children);
        });
    },

    /**
     * Calculate stay details
     */
    calculateStayDetails(checkIn, checkOut) {
        if (!checkIn || !checkOut) return null;
        
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
        
        return {
            checkIn,
            checkOut,
            nights,
            checkInDate,
            checkOutDate
        };
    },

    /**
     * Get popular destinations
     */
    getPopularDestinations() {
        return this.destinations.slice(0, 6);
    },

    /**
     * Get featured hotels
     */
    getFeaturedHotels() {
        return this.hotels
            .filter(hotel => hotel.rating >= 4.0)
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 3);
    },

    /**
     * Generate booking confirmation
     */
    generateBookingConfirmation(bookingData) {
        const confirmationNumber = 'BK' + Date.now().toString().slice(-8);
        
        return {
            confirmationNumber,
            bookingDate: new Date().toISOString(),
            status: 'confirmed',
            ...bookingData
        };
    },

    /**
     * Validate booking availability
     */
    validateBookingAvailability(hotelId, roomId, checkIn, checkOut) {
        const hotel = this.getHotelById(hotelId);
        if (!hotel) return { available: false, reason: 'Hotel not found' };
        
        const room = hotel.rooms.find(r => r.id === parseInt(roomId));
        if (!room) return { available: false, reason: 'Room not found' };
        
        if (!room.availability) {
            return { available: false, reason: 'Room not available' };
        }
        
        // In a real system, you would check against actual bookings
        // For this demo, we'll assume all rooms are available
        return { available: true };
    },

    /**
     * Get amenity label
     */
    getAmenityLabel(amenity) {
        return this.amenityLabels[amenity] || amenity;
    },

    /**
     * Filter hotels by criteria (advanced)
     */
    filterHotels(hotels, filters) {
        return hotels.filter(hotel => {
            // Price filter
            if (filters.minPrice || filters.maxPrice) {
                const hotelMinPrice = Math.min(...hotel.rooms.map(r => r.price));
                const hotelMaxPrice = Math.max(...hotel.rooms.map(r => r.price));
                
                if (filters.minPrice && hotelMaxPrice < filters.minPrice) return false;
                if (filters.maxPrice && hotelMinPrice > filters.maxPrice) return false;
            }
            
            // Rating filter
            if (filters.minRating && hotel.rating < filters.minRating) return false;
            
            // Star rating filter
            if (filters.starRating && filters.starRating.length > 0) {
                if (!filters.starRating.includes(hotel.starRating.toString())) return false;
            }
            
            // Amenities filter
            if (filters.amenities && filters.amenities.length > 0) {
                if (!filters.amenities.every(amenity => hotel.amenities.includes(amenity))) {
                    return false;
                }
            }
            
            return true;
        });
    }
};

// Export for global use
window.HotelData = HotelData;