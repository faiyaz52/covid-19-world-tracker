# Hotel Booking Web Application

A modern, responsive hotel booking web application with advanced multi-tab state synchronization, inspired by Booking.com's approach to handling state across browser tabs.

## 🌟 Features

### Core Functionality
- **Hotel Search & Filtering**: Search hotels by destination, dates, and guest count with advanced filtering options
- **Hotel Details & Room Selection**: Detailed hotel information with room types and pricing
- **Complete Booking Flow**: Guest information collection and booking confirmation
- **User Authentication**: Login/registration with persistent sessions
- **Booking Management**: View and manage bookings
- **User Profile Management**: Update personal information

### Advanced Multi-Tab State Management
- **Real-time State Synchronization**: Changes in one tab instantly reflect in all other tabs
- **Persistent Session Data**: Booking progress preserved across tab refreshes and new tabs
- **Smart Storage Strategy**: Combines localStorage, sessionStorage, and BroadcastChannel API
- **Tab Lifecycle Management**: Automatic cleanup when tabs are closed
- **Conflict Resolution**: Handles concurrent updates from multiple tabs

## 🎯 Multi-Tab Scenarios Addressed

### Scenario 1: Hotel Selection Across Tabs
**Problem**: User selects a hotel in one tab, opens a new tab, expects the same selection to be available.

**Solution**: 
- Hotel selection is stored in synchronized session storage
- New tabs automatically load the current booking state
- Hotel details and room selection persist across all tabs

### Scenario 2: Guest Information Synchronization
**Problem**: User fills out guest details in one tab, switches to another tab, expects the same information to be available.

**Solution**:
- Guest details are synchronized across tabs in real-time
- Form auto-fills with existing data when switching tabs
- No data loss during the booking process

### Scenario 3: Duplicate Tab State Consistency
**Problem**: User duplicates a browser tab, expects both tabs to maintain the same booking state.

**Solution**:
- State is immediately synchronized when tabs are duplicated
- Both tabs maintain identical booking progress
- Changes in either tab update both simultaneously

## 🏗️ Architecture

### Storage Management System
```
├── StorageManager (js/storage-manager.js)
│   ├── localStorage (permanent data)
│   ├── sessionStorage (tab-specific data)
│   ├── Synced Session Storage (cross-tab data)
│   └── BroadcastChannel (real-time communication)
```

### State Management System
```
├── StateManager (js/state-manager.js)
│   ├── User State (login, profile, preferences)
│   ├── Search State (criteria, filters, results)
│   ├── Booking State (hotel, room, guest details)
│   └── UI State (current page, loading, messages)
```

### Key Technologies
- **BroadcastChannel API**: Real-time cross-tab communication
- **Storage Events**: Fallback for localStorage changes
- **Tab Registry**: Tracks active tabs and manages lifecycle
- **State Versioning**: Prevents conflicts and ensures data consistency

## 🚀 Quick Start

1. **Clone or download the project files**
2. **Open `index.html` in a web browser**
3. **Test multi-tab functionality**:
   - Open multiple tabs with the application
   - Search for hotels in one tab
   - Open another tab and see the search persist
   - Fill out booking details and observe real-time sync

## 📋 Testing Multi-Tab Functionality

### Test Case 1: Search Synchronization
1. Open the application in Tab A
2. Search for "New York" hotels with 2 adults, 1 room
3. Open a new tab (Tab B) with the same application
4. ✅ Verify: Search criteria and results appear in Tab B

### Test Case 2: Booking Flow Synchronization
1. In Tab A: Select a hotel and room
2. Switch to Tab B
3. ✅ Verify: Same hotel and room are selected in Tab B
4. In Tab B: Fill out guest details
5. Switch to Tab A
6. ✅ Verify: Guest details are populated in Tab A

### Test Case 3: Authentication Synchronization
1. Login in Tab A
2. Check Tab B
3. ✅ Verify: User is logged in across all tabs
4. Logout in Tab B
5. Check Tab A
6. ✅ Verify: User is logged out in all tabs

### Test Case 4: Tab Duplication
1. Complete a hotel search in Tab A
2. Right-click and "Duplicate Tab" (Tab C)
3. ✅ Verify: Tab C has identical search results and state
4. Make changes in Tab C
5. ✅ Verify: Changes reflect in Tab A immediately

## 🔧 Implementation Details

### Storage Strategy
```javascript
// Permanent data (survives browser restart)
storageManager.savePermanentData('userProfile', userData);

// Synced session data (shared across tabs, cleared when browser closes)
storageManager.saveSyncedSessionData('bookingState', bookingData);

// Tab-specific data (not shared)
storageManager.saveSessionData('uiState', uiData);
```

### Real-time Synchronization
```javascript
// Broadcast changes to other tabs
if (this.broadcastChannel) {
    this.broadcastChannel.postMessage({
        type: 'SYNCED_DATA_UPDATE',
        key: key,
        data: data,
        timestamp: Date.now(),
        tabId: this.tabId
    });
}
```

### State Management
```javascript
// Update state and synchronize across tabs
stateManager.updateSearchState({
    destination: 'New York',
    checkIn: '2024-01-15',
    checkOut: '2024-01-17'
});
```

## 🎨 Similar to Booking.com Implementation

This application implements state management strategies similar to how Booking.com handles multi-tab scenarios:

1. **Session Persistence**: Search criteria and booking progress persist across tabs
2. **Real-time Updates**: Login/logout events immediately affect all tabs
3. **Smart Cleanup**: Unused data is cleaned up when all tabs are closed
4. **Graceful Degradation**: Works even when BroadcastChannel is not supported
5. **User Experience**: Seamless experience regardless of how users navigate between tabs

## 📱 Browser Compatibility

- **Modern Browsers**: Full functionality with BroadcastChannel API
- **Legacy Browsers**: Fallback to storage events for synchronization
- **Mobile Browsers**: Responsive design works on all screen sizes

## 🔍 Key Files

- `index.html` - Main application structure
- `styles.css` - Responsive styling and modern UI
- `js/storage-manager.js` - Advanced storage and synchronization system
- `js/state-manager.js` - Application state management
- `js/hotel-data.js` - Sample hotel data and search functionality
- `js/app.js` - Main application logic and UI coordination

## 🎯 Real-World Applications

This approach to multi-tab state management is ideal for:
- E-commerce websites (shopping cart synchronization)
- Travel booking platforms (search and booking state)
- Financial applications (account information sync)
- Collaborative tools (document editing state)
- Any application where users frequently work across multiple tabs

## 📈 Performance Considerations

- **Efficient Storage**: Only necessary data is synchronized
- **Event Throttling**: Prevents excessive updates during rapid changes
- **Memory Management**: Automatic cleanup of inactive tab data
- **Conflict Resolution**: Timestamp-based updates prevent data corruption

## 🛡️ Security Features

- **Data Isolation**: User-specific data is properly isolated
- **Secure Storage**: Sensitive data can be encrypted before storage
- **Tab Verification**: Prevents unauthorized access between different origins
- **Session Management**: Proper cleanup of authentication data

This implementation provides a robust foundation for any web application requiring sophisticated multi-tab state management, ensuring users never lose their progress regardless of how they navigate between browser tabs.