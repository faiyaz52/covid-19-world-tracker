// Booking Manager - Handles all booking data persistence across tabs
class BookingManager {
    static STORAGE_KEY = 'hotel_booking_data';

    // Get current booking data from localStorage
    static getBookingData() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : this.getDefaultBookingData();
        } catch (error) {
            console.error('Error reading booking data:', error);
            return this.getDefaultBookingData();
        }
    }

    // Get default empty booking structure
    static getDefaultBookingData() {
        return {
            hotelId: '',
            hotelName: '',
            hotelPrice: 0,
            hotelImage: '',
            hotelDescription: '',
            guests: 1,
            guestDetails: [],
            checkIn: '',
            checkOut: '',
            totalAmount: 0,
            lastUpdated: new Date().toISOString(),
            sessionId: this.generateSessionId()
        };
    }

    // Save booking data to localStorage
    static saveBookingData(data) {
        try {
            const currentData = this.getBookingData();
            const updatedData = {
                ...currentData,
                ...data,
                lastUpdated: new Date().toISOString()
            };
            
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedData));
            
            // Trigger storage event for other tabs
            window.dispatchEvent(new StorageEvent('storage', {
                key: this.STORAGE_KEY,
                newValue: JSON.stringify(updatedData),
                url: window.location.href
            }));
            
            return true;
        } catch (error) {
            console.error('Error saving booking data:', error);
            return false;
        }
    }

    // Update specific field in booking data
    static updateField(fieldName, value) {
        const data = {};
        data[fieldName] = value;
        return this.saveBookingData(data);
    }

    // Update multiple fields at once
    static updateFields(fields) {
        return this.saveBookingData(fields);
    }

    // Clear all booking data
    static clearBookingData() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            window.dispatchEvent(new StorageEvent('storage', {
                key: this.STORAGE_KEY,
                newValue: null,
                url: window.location.href
            }));
            return true;
        } catch (error) {
            console.error('Error clearing booking data:', error);
            return false;
        }
    }

    // Generate unique session ID
    static generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Check if booking is complete
    static isBookingComplete() {
        const data = this.getBookingData();
        return !!(data.hotelId && data.guests && data.checkIn && data.checkOut);
    }

    // Calculate total amount
    static calculateTotal() {
        const data = this.getBookingData();
        if (data.hotelPrice && data.checkIn && data.checkOut) {
            const checkIn = new Date(data.checkIn);
            const checkOut = new Date(data.checkOut);
            const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
            const total = data.hotelPrice * nights;
            this.updateField('totalAmount', total);
            return total;
        }
        return 0;
    }

    // Add guest details
    static addGuestDetail(guestData) {
        const data = this.getBookingData();
        const guestDetails = data.guestDetails || [];
        guestDetails.push({
            ...guestData,
            id: Date.now() + '_' + Math.random().toString(36).substr(2, 5)
        });
        return this.updateField('guestDetails', guestDetails);
    }

    // Remove guest detail
    static removeGuestDetail(guestId) {
        const data = this.getBookingData();
        const guestDetails = (data.guestDetails || []).filter(guest => guest.id !== guestId);
        return this.updateField('guestDetails', guestDetails);
    }

    // Validate booking data
    static validateBooking() {
        const data = this.getBookingData();
        const errors = [];

        if (!data.hotelId) errors.push('Please select a hotel');
        if (!data.checkIn) errors.push('Please select check-in date');
        if (!data.checkOut) errors.push('Please select check-out date');
        if (data.guests < 1) errors.push('Please specify number of guests');
        
        if (data.checkIn && data.checkOut) {
            const checkIn = new Date(data.checkIn);
            const checkOut = new Date(data.checkOut);
            if (checkOut <= checkIn) {
                errors.push('Check-out date must be after check-in date');
            }
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Export booking data for backup/sharing
    static exportBookingData() {
        const data = this.getBookingData();
        return {
            ...data,
            exportedAt: new Date().toISOString()
        };
    }

    // Import booking data from backup
    static importBookingData(importData) {
        try {
            delete importData.exportedAt;
            return this.saveBookingData(importData);
        } catch (error) {
            console.error('Error importing booking data:', error);
            return false;
        }
    }

    // Setup cross-tab communication
    static setupCrossTabSync() {
        window.addEventListener('storage', (e) => {
            if (e.key === this.STORAGE_KEY) {
                // Trigger custom event for the current page to update
                window.dispatchEvent(new CustomEvent('bookingDataChanged', {
                    detail: e.newValue ? JSON.parse(e.newValue) : null
                }));
            }
        });
    }

    // Initialize booking manager
    static init() {
        this.setupCrossTabSync();
        
        // Ensure we have initial data structure
        const currentData = this.getBookingData();
        if (!currentData.sessionId) {
            this.saveBookingData(this.getDefaultBookingData());
        }
    }
}

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
    BookingManager.init();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BookingManager;
}