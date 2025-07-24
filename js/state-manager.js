/**
 * State Manager - Application state management with multi-tab synchronization
 * Handles booking flow state, user preferences, and search data
 */

class StateManager {
    constructor() {
        this.state = {
            user: {
                isLoggedIn: false,
                profile: null,
                preferences: {
                    currency: 'USD',
                    language: 'en'
                }
            },
            search: {
                destination: '',
                checkIn: '',
                checkOut: '',
                guests: {
                    adults: 2,
                    children: 0,
                    rooms: 1
                },
                filters: {
                    priceRange: 250,
                    starRating: [],
                    amenities: []
                }
            },
            booking: {
                selectedHotel: null,
                selectedRoom: null,
                guestDetails: {
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    specialRequests: ''
                },
                paymentDetails: null
            },
            ui: {
                currentPage: 'home',
                isLoading: false,
                messages: []
            }
        };
        
        this.listeners = {};
        this.isInitialized = false;
    }

    /**
     * Initialize the state manager
     */
    initialize() {
        if (this.isInitialized) return;
        
        this.isInitialized = true;
        
        // Set up storage listeners
        storageManager.addDataChangeListener('userState', this.handleUserStateChange.bind(this));
        storageManager.addDataChangeListener('searchState', this.handleSearchStateChange.bind(this));
        storageManager.addDataChangeListener('bookingState', this.handleBookingStateChange.bind(this));
        storageManager.addDataChangeListener('uiState', this.handleUIStateChange.bind(this));
        
        // Load existing state
        this.loadState();
        
        console.log('State Manager initialized');
    }

    /**
     * Load state from storage
     */
    loadState() {
        const userState = storageManager.getData('userState');
        const searchState = storageManager.getData('searchState');
        const bookingState = storageManager.getData('bookingState');
        const uiState = storageManager.getData('uiState');
        
        if (userState) {
            this.state.user = { ...this.state.user, ...userState };
        }
        
        if (searchState) {
            this.state.search = { ...this.state.search, ...searchState };
        }
        
        if (bookingState) {
            this.state.booking = { ...this.state.booking, ...bookingState };
        }
        
        if (uiState) {
            this.state.ui = { ...this.state.ui, ...uiState };
        }
        
        // Notify listeners of initial state
        this.notifyListeners('*', this.state);
    }

    /**
     * Get current state
     */
    getState() {
        return this.state;
    }

    /**
     * Get specific state section
     */
    getStateSection(section) {
        return this.state[section] || null;
    }

    /**
     * Update user state
     */
    updateUserState(updates, persistent = false) {
        this.state.user = { ...this.state.user, ...updates };
        
        if (persistent) {
            storageManager.savePermanentData('userState', this.state.user);
        } else {
            storageManager.saveSyncedSessionData('userState', this.state.user);
        }
        
        this.notifyListeners('user', this.state.user);
        this.notifyListeners('*', this.state);
    }

    /**
     * Update search state
     */
    updateSearchState(updates) {
        this.state.search = { ...this.state.search, ...updates };
        storageManager.saveSyncedSessionData('searchState', this.state.search);
        this.notifyListeners('search', this.state.search);
        this.notifyListeners('*', this.state);
    }

    /**
     * Update booking state
     */
    updateBookingState(updates) {
        this.state.booking = { ...this.state.booking, ...updates };
        storageManager.saveSyncedSessionData('bookingState', this.state.booking);
        this.notifyListeners('booking', this.state.booking);
        this.notifyListeners('*', this.state);
    }

    /**
     * Update UI state
     */
    updateUIState(updates) {
        this.state.ui = { ...this.state.ui, ...updates };
        storageManager.saveSessionData('uiState', this.state.ui);
        this.notifyListeners('ui', this.state.ui);
        this.notifyListeners('*', this.state);
    }

    /**
     * Login user
     */
    loginUser(userProfile, rememberMe = false) {
        const userData = {
            isLoggedIn: true,
            profile: userProfile,
            loginTime: Date.now()
        };
        
        this.updateUserState(userData, rememberMe);
        
        // Show success message
        this.showMessage('Login successful!', 'success');
        
        console.log('User logged in:', userProfile.email);
    }

    /**
     * Logout user
     */
    logoutUser() {
        const userData = {
            isLoggedIn: false,
            profile: null,
            loginTime: null
        };
        
        this.updateUserState(userData);
        
        // Clear booking state on logout
        this.clearBookingState();
        
        // Show success message
        this.showMessage('Logged out successfully', 'info');
        
        console.log('User logged out');
    }

    /**
     * Update search criteria
     */
    updateSearchCriteria(criteria) {
        this.updateSearchState(criteria);
        console.log('Search criteria updated:', criteria);
    }

    /**
     * Update search filters
     */
    updateSearchFilters(filters) {
        const searchUpdates = {
            filters: { ...this.state.search.filters, ...filters }
        };
        this.updateSearchState(searchUpdates);
        console.log('Search filters updated:', filters);
    }

    /**
     * Select hotel
     */
    selectHotel(hotel) {
        this.updateBookingState({ selectedHotel: hotel });
        console.log('Hotel selected:', hotel.name);
    }

    /**
     * Select room
     */
    selectRoom(room) {
        this.updateBookingState({ selectedRoom: room });
        console.log('Room selected:', room.type);
    }

    /**
     * Update guest details
     */
    updateGuestDetails(guestDetails) {
        const bookingUpdates = {
            guestDetails: { ...this.state.booking.guestDetails, ...guestDetails }
        };
        this.updateBookingState(bookingUpdates);
    }

    /**
     * Clear booking state
     */
    clearBookingState() {
        this.updateBookingState({
            selectedHotel: null,
            selectedRoom: null,
            guestDetails: {
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                specialRequests: ''
            },
            paymentDetails: null
        });
    }

    /**
     * Navigate to page
     */
    navigateToPage(page) {
        this.updateUIState({ currentPage: page });
        console.log('Navigation to:', page);
    }

    /**
     * Set loading state
     */
    setLoading(isLoading) {
        this.updateUIState({ isLoading });
    }

    /**
     * Show message
     */
    showMessage(text, type = 'info', duration = 5000) {
        const message = {
            id: Date.now(),
            text,
            type,
            timestamp: Date.now()
        };
        
        const messages = [...this.state.ui.messages, message];
        this.updateUIState({ messages });
        
        // Auto-remove message after duration
        setTimeout(() => {
            this.removeMessage(message.id);
        }, duration);
    }

    /**
     * Remove message
     */
    removeMessage(messageId) {
        const messages = this.state.ui.messages.filter(m => m.id !== messageId);
        this.updateUIState({ messages });
    }

    /**
     * Clear all messages
     */
    clearMessages() {
        this.updateUIState({ messages: [] });
    }

    /**
     * Handle storage change events
     */
    handleUserStateChange(data) {
        if (data) {
            this.state.user = { ...this.state.user, ...data };
            this.notifyListeners('user', this.state.user);
            this.notifyListeners('*', this.state);
        }
    }

    handleSearchStateChange(data) {
        if (data) {
            this.state.search = { ...this.state.search, ...data };
            this.notifyListeners('search', this.state.search);
            this.notifyListeners('*', this.state);
        }
    }

    handleBookingStateChange(data) {
        if (data) {
            this.state.booking = { ...this.state.booking, ...data };
            this.notifyListeners('booking', this.state.booking);
            this.notifyListeners('*', this.state);
        }
    }

    handleUIStateChange(data) {
        if (data) {
            this.state.ui = { ...this.state.ui, ...data };
            this.notifyListeners('ui', this.state.ui);
            this.notifyListeners('*', this.state);
        }
    }

    /**
     * Add state change listener
     */
    addStateChangeListener(section, callback) {
        if (!this.listeners[section]) {
            this.listeners[section] = [];
        }
        this.listeners[section].push(callback);
    }

    /**
     * Remove state change listener
     */
    removeStateChangeListener(section, callback) {
        if (this.listeners[section]) {
            this.listeners[section] = this.listeners[section].filter(cb => cb !== callback);
        }
    }

    /**
     * Notify listeners of state changes
     */
    notifyListeners(section, data) {
        if (this.listeners[section]) {
            this.listeners[section].forEach(callback => {
                try {
                    callback(data, section);
                } catch (e) {
                    console.error('Error in state change listener:', e);
                }
            });
        }
    }

    /**
     * Get booking summary
     */
    getBookingSummary() {
        const { selectedHotel, selectedRoom, guestDetails } = this.state.booking;
        const { checkIn, checkOut, guests } = this.state.search;
        
        if (!selectedHotel || !selectedRoom) {
            return null;
        }
        
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
        const totalPrice = selectedRoom.price * nights;
        
        return {
            hotel: selectedHotel,
            room: selectedRoom,
            checkIn,
            checkOut,
            nights,
            guests,
            guestDetails,
            pricing: {
                basePrice: selectedRoom.price,
                nights,
                totalPrice,
                taxes: totalPrice * 0.15,
                grandTotal: totalPrice * 1.15
            }
        };
    }

    /**
     * Validate booking data
     */
    validateBookingData() {
        const errors = [];
        const { selectedHotel, selectedRoom, guestDetails } = this.state.booking;
        const { checkIn, checkOut } = this.state.search;
        
        if (!selectedHotel) errors.push('No hotel selected');
        if (!selectedRoom) errors.push('No room selected');
        if (!checkIn) errors.push('Check-in date required');
        if (!checkOut) errors.push('Check-out date required');
        if (!guestDetails.firstName) errors.push('First name required');
        if (!guestDetails.lastName) errors.push('Last name required');
        if (!guestDetails.email) errors.push('Email required');
        if (!guestDetails.phone) errors.push('Phone number required');
        
        // Validate email format
        if (guestDetails.email && !/\S+@\S+\.\S+/.test(guestDetails.email)) {
            errors.push('Invalid email format');
        }
        
        // Validate dates
        if (checkIn && checkOut) {
            const checkInDate = new Date(checkIn);
            const checkOutDate = new Date(checkOut);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (checkInDate < today) {
                errors.push('Check-in date cannot be in the past');
            }
            
            if (checkOutDate <= checkInDate) {
                errors.push('Check-out date must be after check-in date');
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Reset state (for testing or logout)
     */
    resetState() {
        this.state = {
            user: {
                isLoggedIn: false,
                profile: null,
                preferences: {
                    currency: 'USD',
                    language: 'en'
                }
            },
            search: {
                destination: '',
                checkIn: '',
                checkOut: '',
                guests: {
                    adults: 2,
                    children: 0,
                    rooms: 1
                },
                filters: {
                    priceRange: 250,
                    starRating: [],
                    amenities: []
                }
            },
            booking: {
                selectedHotel: null,
                selectedRoom: null,
                guestDetails: {
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    specialRequests: ''
                },
                paymentDetails: null
            },
            ui: {
                currentPage: 'home',
                isLoading: false,
                messages: []
            }
        };
        
        // Clear storage
        storageManager.deleteData('userState');
        storageManager.deleteData('searchState');
        storageManager.deleteData('bookingState');
        storageManager.deleteData('uiState');
        
        this.notifyListeners('*', this.state);
    }

    /**
     * Get state for debugging
     */
    debugState() {
        return {
            state: this.state,
            storageStats: storageManager.getStorageStats(),
            activeTabs: storageManager.getActiveTabs()
        };
    }
}

// Create global instance
window.stateManager = new StateManager();