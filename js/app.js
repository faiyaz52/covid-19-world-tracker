/**
 * Main Application File - Hotel Booking Web Application
 * Coordinates between storage manager, state manager, and UI components
 * Handles multi-tab state synchronization like Booking.com
 */

// Global application state
let currentFilters = [];
let currentSearchResults = [];

/**
 * Initialize the application
 */
function initializeApp() {
    console.log('Initializing Hotel Booking Application...');
    
    // Initialize storage and state managers
    storageManager.initializeStorageSyncListener();
    stateManager.initialize();
    
    // Set up state listeners
    setupStateListeners();
    
    // Set up UI event listeners
    setupUIEventListeners();
    
    // Load initial UI state
    loadInitialUIState();
    
    // Set default dates
    setDefaultDates();
    
    console.log('Application initialized successfully');
}

/**
 * Set up state change listeners
 */
function setupStateListeners() {
    // Listen for user state changes
    stateManager.addStateChangeListener('user', (userData) => {
        updateUserUI(userData);
    });
    
    // Listen for search state changes
    stateManager.addStateChangeListener('search', (searchData) => {
        updateSearchUI(searchData);
    });
    
    // Listen for booking state changes
    stateManager.addStateChangeListener('booking', (bookingData) => {
        updateBookingUI(bookingData);
    });
    
    // Listen for UI state changes
    stateManager.addStateChangeListener('ui', (uiData) => {
        updateUIState(uiData);
    });
    
    // Listen for messages
    stateManager.addStateChangeListener('*', (state) => {
        displayMessages(state.ui.messages);
    });
}

/**
 * Set up UI event listeners
 */
function setupUIEventListeners() {
    // Login/Register buttons
    document.getElementById('loginBtn').addEventListener('click', () => openAuthModal('login'));
    document.getElementById('registerBtn').addEventListener('click', () => openAuthModal('register'));
    
    // Search form
    document.getElementById('destination').addEventListener('input', handleDestinationInput);
    document.getElementById('checkin').addEventListener('change', handleDateChange);
    document.getElementById('checkout').addEventListener('change', handleDateChange);
    document.getElementById('guests').addEventListener('click', toggleGuestsDropdown);
    
    // Guests dropdown events
    document.addEventListener('click', handleOutsideClick);
    
    // Price range filter
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        priceRange.addEventListener('input', handlePriceRangeChange);
    }
    
    // Star rating filters
    const starFilters = document.querySelectorAll('.star-filters input[type="checkbox"]');
    starFilters.forEach(checkbox => {
        checkbox.addEventListener('change', handleStarRatingChange);
    });
    
    // Amenity filters
    const amenityFilters = document.querySelectorAll('.amenity-filters input[type="checkbox"]');
    amenityFilters.forEach(checkbox => {
        checkbox.addEventListener('change', handleAmenityChange);
    });
    
    // Modal close events
    document.querySelector('.modal .close').addEventListener('click', closeModal);
    document.getElementById('authModal').addEventListener('click', (e) => {
        if (e.target.id === 'authModal') closeModal();
    });
    
    // Form submissions
    document.getElementById('bookingForm').addEventListener('submit', handleBookingFormSubmit);
    document.getElementById('profileForm').addEventListener('submit', handleProfileFormSubmit);
}

/**
 * Load initial UI state from storage
 */
function loadInitialUIState() {
    const state = stateManager.getState();
    
    // Update all UI components with current state
    updateUserUI(state.user);
    updateSearchUI(state.search);
    updateBookingUI(state.booking);
    updateUIState(state.ui);
    
    // Navigate to the correct page
    if (state.ui.currentPage && state.ui.currentPage !== 'home') {
        showPage(state.ui.currentPage);
    }
}

/**
 * Set default dates (today and tomorrow)
 */
function setDefaultDates() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const formatDate = (date) => date.toISOString().split('T')[0];
    
    document.getElementById('checkin').value = formatDate(today);
    document.getElementById('checkout').value = formatDate(tomorrow);
    
    // Update state
    stateManager.updateSearchState({
        checkIn: formatDate(today),
        checkOut: formatDate(tomorrow)
    });
}

/**
 * Handle destination input
 */
function handleDestinationInput(event) {
    const destination = event.target.value;
    stateManager.updateSearchCriteria({ destination });
}

/**
 * Handle date changes
 */
function handleDateChange(event) {
    const { id, value } = event.target;
    const updates = {};
    
    if (id === 'checkin') {
        updates.checkIn = value;
        
        // Ensure checkout is after checkin
        const checkoutInput = document.getElementById('checkout');
        const checkinDate = new Date(value);
        const checkoutDate = new Date(checkoutInput.value);
        
        if (checkoutDate <= checkinDate) {
            const newCheckout = new Date(checkinDate);
            newCheckout.setDate(newCheckout.getDate() + 1);
            checkoutInput.value = newCheckout.toISOString().split('T')[0];
            updates.checkOut = checkoutInput.value;
        }
    } else if (id === 'checkout') {
        updates.checkOut = value;
    }
    
    stateManager.updateSearchCriteria(updates);
}

/**
 * Toggle guests dropdown
 */
function toggleGuestsDropdown() {
    const dropdown = document.getElementById('guestsDropdown');
    dropdown.classList.toggle('active');
}

/**
 * Handle clicks outside dropdowns
 */
function handleOutsideClick(event) {
    const guestsSelector = document.querySelector('.guests-selector');
    const dropdown = document.getElementById('guestsDropdown');
    
    if (!guestsSelector.contains(event.target)) {
        dropdown.classList.remove('active');
    }
}

/**
 * Update guest count
 */
function updateGuests(type, change) {
    const state = stateManager.getState();
    const guests = { ...state.search.guests };
    
    guests[type] = Math.max(0, guests[type] + change);
    
    // Ensure at least 1 adult
    if (type === 'adults' && guests.adults < 1) {
        guests.adults = 1;
    }
    
    // Ensure at least 1 room
    if (type === 'rooms' && guests.rooms < 1) {
        guests.rooms = 1;
    }
    
    stateManager.updateSearchCriteria({ guests });
    
    // Update UI
    document.getElementById('adultsCount').textContent = guests.adults;
    document.getElementById('childrenCount').textContent = guests.children;
    document.getElementById('roomsCount').textContent = guests.rooms;
    
    // Update summary text
    const guestsText = `${guests.adults} adult${guests.adults !== 1 ? 's' : ''}${guests.children > 0 ? `, ${guests.children} child${guests.children !== 1 ? 'ren' : ''}` : ''}, ${guests.rooms} room${guests.rooms !== 1 ? 's' : ''}`;
    document.getElementById('guests').value = guestsText;
}

/**
 * Handle price range change
 */
function handlePriceRangeChange(event) {
    const priceRange = parseInt(event.target.value);
    document.getElementById('priceValue').textContent = priceRange;
    
    stateManager.updateSearchFilters({ priceRange });
    
    // Re-apply filters if we're on search page
    if (stateManager.getState().ui.currentPage === 'search') {
        applyFilters();
    }
}

/**
 * Handle star rating filter change
 */
function handleStarRatingChange() {
    const checkedStars = Array.from(document.querySelectorAll('.star-filters input:checked'))
        .map(cb => cb.value);
    
    stateManager.updateSearchFilters({ starRating: checkedStars });
    
    if (stateManager.getState().ui.currentPage === 'search') {
        applyFilters();
    }
}

/**
 * Handle amenity filter change
 */
function handleAmenityChange() {
    const checkedAmenities = Array.from(document.querySelectorAll('.amenity-filters input:checked'))
        .map(cb => cb.value);
    
    stateManager.updateSearchFilters({ amenities: checkedAmenities });
    
    if (stateManager.getState().ui.currentPage === 'search') {
        applyFilters();
    }
}

/**
 * Search hotels
 */
function searchHotels() {
    const state = stateManager.getState();
    const searchCriteria = state.search;
    
    // Validate search criteria
    if (!searchCriteria.destination.trim()) {
        stateManager.showMessage('Please enter a destination', 'error');
        return;
    }
    
    if (!searchCriteria.checkIn || !searchCriteria.checkOut) {
        stateManager.showMessage('Please select check-in and check-out dates', 'error');
        return;
    }
    
    stateManager.setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
        const results = HotelData.searchHotels(searchCriteria);
        currentSearchResults = results;
        
        displaySearchResults(results);
        navigateTo('search');
        
        stateManager.setLoading(false);
        stateManager.showMessage(`Found ${results.length} hotels`, 'success');
    }, 1000);
}

/**
 * Apply current filters to search results
 */
function applyFilters() {
    const state = stateManager.getState();
    const filteredResults = HotelData.filterHotels(currentSearchResults, state.search.filters);
    
    displaySearchResults(filteredResults);
    
    // Update search info
    document.getElementById('searchResultsInfo').textContent = 
        `${filteredResults.length} of ${currentSearchResults.length} hotels match your criteria`;
}

/**
 * Display search results
 */
function displaySearchResults(hotels) {
    const resultsContainer = document.getElementById('hotelResults');
    
    if (hotels.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <h3>No hotels found</h3>
                <p>Try adjusting your search criteria or filters.</p>
            </div>
        `;
        return;
    }
    
    resultsContainer.innerHTML = hotels.map(hotel => createHotelCard(hotel)).join('');
    
    // Update search info
    const state = stateManager.getState();
    const stayDetails = HotelData.calculateStayDetails(state.search.checkIn, state.search.checkOut);
    const guestsText = `${state.search.guests.adults} adult${state.search.guests.adults !== 1 ? 's' : ''}${state.search.guests.children > 0 ? `, ${state.search.guests.children} child${state.search.guests.children !== 1 ? 'ren' : ''}` : ''}`;
    
    document.getElementById('searchResultsInfo').textContent = 
        `${hotels.length} properties in ${state.search.destination} • ${stayDetails ? stayDetails.nights + ' night' + (stayDetails.nights !== 1 ? 's' : '') : ''} • ${guestsText}`;
}

/**
 * Create hotel card HTML
 */
function createHotelCard(hotel) {
    const stars = '★'.repeat(hotel.starRating);
    const amenities = hotel.amenities.slice(0, 4).map(amenity => 
        `<span class="amenity-tag">${HotelData.getAmenityLabel(amenity)}</span>`
    ).join('');
    
    const lowestPrice = Math.min(...hotel.rooms.map(room => room.price));
    
    return `
        <div class="hotel-card" onclick="viewHotelDetails(${hotel.id})">
            <div class="hotel-card-content">
                <img src="${hotel.images[0]}" alt="${hotel.name}" class="hotel-image">
                <div class="hotel-info">
                    <h3>${hotel.name}</h3>
                    <div class="hotel-rating">
                        <span class="stars">${stars}</span>
                        <span>${hotel.rating}/5 (${hotel.reviewCount} reviews)</span>
                    </div>
                    <p>${hotel.description}</p>
                    <div class="hotel-amenities">
                        ${amenities}
                    </div>
                    <p><strong>Location:</strong> ${hotel.location}</p>
                </div>
                <div class="hotel-pricing">
                    <div class="price">$${lowestPrice}</div>
                    <div class="price-note">per night</div>
                    <button class="btn btn-primary" onclick="event.stopPropagation(); viewHotelDetails(${hotel.id})">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * View hotel details
 */
function viewHotelDetails(hotelId) {
    const hotel = HotelData.getHotelById(hotelId);
    if (!hotel) {
        stateManager.showMessage('Hotel not found', 'error');
        return;
    }
    
    stateManager.selectHotel(hotel);
    displayHotelDetails(hotel);
    navigateTo('hotelDetails');
}

/**
 * Display hotel details
 */
function displayHotelDetails(hotel) {
    const state = stateManager.getState();
    const availableRooms = HotelData.getAvailableRooms(
        hotel.id, 
        state.search.checkIn, 
        state.search.checkOut, 
        state.search.guests
    );
    
    const stars = '★'.repeat(hotel.starRating);
    const amenities = hotel.amenities.map(amenity => 
        `<span class="amenity-tag">${HotelData.getAmenityLabel(amenity)}</span>`
    ).join('');
    
    const gallery = hotel.images.slice(0, 3).map((image, index) => 
        `<img src="${image}" alt="${hotel.name}" class="gallery-image">`
    ).join('');
    
    const rooms = availableRooms.map(room => createRoomCard(room, hotel.id)).join('');
    
    document.getElementById('hotelDetailsContent').innerHTML = `
        <div class="hotel-gallery">
            ${gallery}
        </div>
        <div class="hotel-details-content">
            <div class="hotel-header">
                <div>
                    <h1>${hotel.name}</h1>
                    <div class="hotel-rating">
                        <span class="stars">${stars}</span>
                        <span>${hotel.rating}/5 (${hotel.reviewCount} reviews)</span>
                    </div>
                    <p>${hotel.description}</p>
                    <p><strong>Address:</strong> ${hotel.address}</p>
                    <p><strong>Phone:</strong> ${hotel.phone}</p>
                </div>
            </div>
            <div class="hotel-amenities">
                <h3>Amenities</h3>
                ${amenities}
            </div>
            <div class="room-types">
                <h3>Available Rooms</h3>
                ${rooms}
            </div>
        </div>
    `;
}

/**
 * Create room card HTML
 */
function createRoomCard(room, hotelId) {
    const roomAmenities = room.amenities.map(amenity => 
        `<span class="amenity-tag">${HotelData.getAmenityLabel(amenity)}</span>`
    ).join('');
    
    const state = stateManager.getState();
    const stayDetails = HotelData.calculateStayDetails(state.search.checkIn, state.search.checkOut);
    const totalPrice = room.price * (stayDetails ? stayDetails.nights : 1);
    
    return `
        <div class="room-card">
            <div class="room-header">
                <div>
                    <h4>${room.type}</h4>
                    <p>${room.description}</p>
                    <p><strong>Bed:</strong> ${room.bedType} • <strong>Size:</strong> ${room.size}</p>
                    <div class="room-amenities">
                        ${roomAmenities}
                    </div>
                </div>
                <div class="room-pricing">
                    <div class="price">$${room.price}</div>
                    <div class="price-note">per night</div>
                    ${stayDetails ? `<div class="total-price">Total: $${totalPrice}</div>` : ''}
                    <button class="btn btn-primary" onclick="selectRoom(${hotelId}, ${room.id})">
                        Select Room
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Select room and proceed to booking
 */
function selectRoom(hotelId, roomId) {
    const room = HotelData.getRoomById(hotelId, roomId);
    if (!room) {
        stateManager.showMessage('Room not found', 'error');
        return;
    }
    
    stateManager.selectRoom(room);
    navigateTo('booking');
    updateBookingSummary();
}

/**
 * Update booking summary
 */
function updateBookingSummary() {
    const summary = stateManager.getBookingSummary();
    if (!summary) return;
    
    const summaryHTML = `
        <div class="summary-hotel">
            <h4>${summary.hotel.name}</h4>
            <p>${summary.room.type}</p>
            <p>${summary.hotel.location}</p>
        </div>
        <div class="summary-dates">
            <div class="summary-row">
                <span>Check-in:</span>
                <span>${new Date(summary.checkIn).toLocaleDateString()}</span>
            </div>
            <div class="summary-row">
                <span>Check-out:</span>
                <span>${new Date(summary.checkOut).toLocaleDateString()}</span>
            </div>
            <div class="summary-row">
                <span>Nights:</span>
                <span>${summary.nights}</span>
            </div>
            <div class="summary-row">
                <span>Guests:</span>
                <span>${summary.guests.adults} adult${summary.guests.adults !== 1 ? 's' : ''}${summary.guests.children > 0 ? `, ${summary.guests.children} child${summary.guests.children !== 1 ? 'ren' : ''}` : ''}</span>
            </div>
        </div>
        <div class="summary-pricing">
            <div class="summary-row">
                <span>Room rate (${summary.nights} nights):</span>
                <span>$${summary.pricing.totalPrice}</span>
            </div>
            <div class="summary-row">
                <span>Taxes & fees:</span>
                <span>$${summary.pricing.taxes.toFixed(2)}</span>
            </div>
            <div class="summary-row total">
                <span><strong>Total:</strong></span>
                <span><strong>$${summary.pricing.grandTotal.toFixed(2)}</strong></span>
            </div>
        </div>
    `;
    
    document.getElementById('bookingSummaryContent').innerHTML = summaryHTML;
}

/**
 * Handle booking form submission
 */
function handleBookingFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const guestDetails = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        specialRequests: document.getElementById('specialRequests').value
    };
    
    stateManager.updateGuestDetails(guestDetails);
    
    // Validate booking data
    const validation = stateManager.validateBookingData();
    if (!validation.isValid) {
        stateManager.showMessage(validation.errors[0], 'error');
        return;
    }
    
    confirmBooking();
}

/**
 * Confirm booking
 */
function confirmBooking() {
    const validation = stateManager.validateBookingData();
    if (!validation.isValid) {
        stateManager.showMessage(validation.errors.join(', '), 'error');
        return;
    }
    
    stateManager.setLoading(true);
    
    // Simulate booking process
    setTimeout(() => {
        const summary = stateManager.getBookingSummary();
        const confirmation = HotelData.generateBookingConfirmation(summary);
        
        // Save booking to user's bookings
        const userBookings = storageManager.getData('userBookings') || [];
        userBookings.push(confirmation);
        storageManager.saveSyncedSessionData('userBookings', userBookings);
        
        stateManager.setLoading(false);
        stateManager.showMessage(`Booking confirmed! Confirmation: ${confirmation.confirmationNumber}`, 'success');
        
        // Clear booking state
        stateManager.clearBookingState();
        
        // Navigate to bookings page
        setTimeout(() => {
            loadUserBookings();
            navigateTo('bookings');
        }, 2000);
    }, 2000);
}

/**
 * Load user bookings
 */
function loadUserBookings() {
    const bookings = storageManager.getData('userBookings') || [];
    const bookingsContainer = document.getElementById('userBookings');
    
    if (bookings.length === 0) {
        bookingsContainer.innerHTML = `
            <div class="no-bookings">
                <h3>No bookings found</h3>
                <p>You haven't made any bookings yet.</p>
                <button class="btn btn-primary" onclick="navigateTo('home')">Search Hotels</button>
            </div>
        `;
        return;
    }
    
    bookingsContainer.innerHTML = bookings.map(booking => `
        <div class="booking-card">
            <div class="booking-header">
                <h3>${booking.hotel.name}</h3>
                <span class="confirmation-number">Confirmation: ${booking.confirmationNumber}</span>
            </div>
            <div class="booking-details">
                <p><strong>Room:</strong> ${booking.room.type}</p>
                <p><strong>Dates:</strong> ${new Date(booking.checkIn).toLocaleDateString()} - ${new Date(booking.checkOut).toLocaleDateString()}</p>
                <p><strong>Guests:</strong> ${booking.guests.adults} adult${booking.guests.adults !== 1 ? 's' : ''}${booking.guests.children > 0 ? `, ${booking.guests.children} child${booking.guests.children !== 1 ? 'ren' : ''}` : ''}</p>
                <p><strong>Total:</strong> $${booking.pricing.grandTotal.toFixed(2)}</p>
                <p><strong>Status:</strong> <span class="status ${booking.status}">${booking.status}</span></p>
            </div>
        </div>
    `).join('');
}

/**
 * Navigation functions
 */
function navigateTo(page) {
    showPage(page);
    stateManager.navigateToPage(page);
}

function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Load page-specific data
    switch (pageId) {
        case 'bookings':
            loadUserBookings();
            break;
        case 'profile':
            loadUserProfile();
            break;
    }
}

/**
 * Authentication functions
 */
function openAuthModal(tab = 'login') {
    document.getElementById('authModal').classList.add('active');
    switchAuthTab(tab);
}

function closeModal() {
    document.getElementById('authModal').classList.remove('active');
}

function switchAuthTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.auth-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.auth-tab[onclick*="${tab}"]`).classList.add('active');
    
    // Update forms
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById(tab + 'Form').classList.add('active');
}

function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    if (!email || !password) {
        stateManager.showMessage('Please fill in all fields', 'error');
        return;
    }
    
    // Simulate login
    const userProfile = {
        email: email,
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1 (555) 123-4567'
    };
    
    stateManager.loginUser(userProfile, rememberMe);
    closeModal();
}

function register() {
    const firstName = document.getElementById('regFirstName').value;
    const lastName = document.getElementById('regLastName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        stateManager.showMessage('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        stateManager.showMessage('Passwords do not match', 'error');
        return;
    }
    
    // Simulate registration
    const userProfile = {
        email: email,
        firstName: firstName,
        lastName: lastName,
        phone: ''
    };
    
    stateManager.loginUser(userProfile, false);
    stateManager.showMessage('Account created successfully!', 'success');
    closeModal();
}

function logout() {
    stateManager.logoutUser();
    navigateTo('home');
}

/**
 * Profile functions
 */
function loadUserProfile() {
    const state = stateManager.getState();
    if (!state.user.isLoggedIn) {
        navigateTo('home');
        return;
    }
    
    const profile = state.user.profile;
    document.getElementById('profileFirstName').value = profile.firstName || '';
    document.getElementById('profileLastName').value = profile.lastName || '';
    document.getElementById('profileEmail').value = profile.email || '';
    document.getElementById('profilePhone').value = profile.phone || '';
}

function handleProfileFormSubmit(event) {
    event.preventDefault();
    updateProfile();
}

function updateProfile() {
    const updatedProfile = {
        firstName: document.getElementById('profileFirstName').value,
        lastName: document.getElementById('profileLastName').value,
        email: document.getElementById('profileEmail').value,
        phone: document.getElementById('profilePhone').value
    };
    
    const state = stateManager.getState();
    const newUserData = {
        ...state.user,
        profile: { ...state.user.profile, ...updatedProfile }
    };
    
    stateManager.updateUserState(newUserData, state.user.profile?.rememberMe);
    stateManager.showMessage('Profile updated successfully!', 'success');
}

/**
 * UI update functions
 */
function updateUserUI(userData) {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    
    if (userData.isLoggedIn) {
        loginBtn.textContent = userData.profile.firstName || 'User';
        loginBtn.onclick = () => navigateTo('profile');
        registerBtn.textContent = 'Logout';
        registerBtn.onclick = logout;
    } else {
        loginBtn.textContent = 'Sign In';
        loginBtn.onclick = () => openAuthModal('login');
        registerBtn.textContent = 'Register';
        registerBtn.onclick = () => openAuthModal('register');
    }
}

function updateSearchUI(searchData) {
    // Update form fields
    document.getElementById('destination').value = searchData.destination || '';
    document.getElementById('checkin').value = searchData.checkIn || '';
    document.getElementById('checkout').value = searchData.checkOut || '';
    
    // Update guests display
    if (searchData.guests) {
        document.getElementById('adultsCount').textContent = searchData.guests.adults;
        document.getElementById('childrenCount').textContent = searchData.guests.children;
        document.getElementById('roomsCount').textContent = searchData.guests.rooms;
        
        const guestsText = `${searchData.guests.adults} adult${searchData.guests.adults !== 1 ? 's' : ''}${searchData.guests.children > 0 ? `, ${searchData.guests.children} child${searchData.guests.children !== 1 ? 'ren' : ''}` : ''}, ${searchData.guests.rooms} room${searchData.guests.rooms !== 1 ? 's' : ''}`;
        document.getElementById('guests').value = guestsText;
    }
    
    // Update filters
    if (searchData.filters) {
        const priceRange = document.getElementById('priceRange');
        if (priceRange && searchData.filters.priceRange) {
            priceRange.value = searchData.filters.priceRange;
            document.getElementById('priceValue').textContent = searchData.filters.priceRange;
        }
    }
}

function updateBookingUI(bookingData) {
    // Update guest details form if we have data
    if (bookingData.guestDetails) {
        const details = bookingData.guestDetails;
        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const specialRequests = document.getElementById('specialRequests');
        
        if (firstName) firstName.value = details.firstName || '';
        if (lastName) lastName.value = details.lastName || '';
        if (email) email.value = details.email || '';
        if (phone) phone.value = details.phone || '';
        if (specialRequests) specialRequests.value = details.specialRequests || '';
    }
    
    // Update booking summary if we have selected hotel and room
    if (bookingData.selectedHotel && bookingData.selectedRoom) {
        updateBookingSummary();
    }
}

function updateUIState(uiData) {
    // Handle loading state
    if (uiData.isLoading) {
        document.body.classList.add('loading');
    } else {
        document.body.classList.remove('loading');
    }
}

function displayMessages(messages) {
    // Remove existing messages
    document.querySelectorAll('.message').forEach(msg => msg.remove());
    
    // Display new messages
    messages.forEach(message => {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${message.type}`;
        messageEl.textContent = message.text;
        messageEl.onclick = () => stateManager.removeMessage(message.id);
        
        document.body.appendChild(messageEl);
        
        // Position the message
        messageEl.style.position = 'fixed';
        messageEl.style.top = '100px';
        messageEl.style.right = '20px';
        messageEl.style.zIndex = '9999';
        messageEl.style.cursor = 'pointer';
    });
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);

// Global functions for onclick handlers
window.navigateTo = navigateTo;
window.updateGuests = updateGuests;
window.searchHotels = searchHotels;
window.viewHotelDetails = viewHotelDetails;
window.selectRoom = selectRoom;
window.confirmBooking = confirmBooking;
window.openAuthModal = openAuthModal;
window.closeModal = closeModal;
window.switchAuthTab = switchAuthTab;
window.login = login;
window.register = register;
window.logout = logout;
window.updateProfile = updateProfile;