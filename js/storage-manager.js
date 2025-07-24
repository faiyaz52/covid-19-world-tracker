/**
 * Storage Manager - Advanced client-side storage with multi-tab synchronization
 * Inspired by Booking.com's approach to maintaining state across browser tabs
 */

class StorageManager {
    constructor() {
        this.syncedSessionStoragePrefix = '__synced_session__';
        this.listeners = {};
        this.tabId = this.generateTabId();
        this.isInitialized = false;
    }

    /**
     * Initialize the storage manager and set up tab synchronization
     * This should be called once when the page loads
     */
    initializeStorageSyncListener() {
        if (this.isInitialized) return;
        
        this.isInitialized = true;
        
        // Generate and store unique tab ID
        document.getElementById('tabId').textContent = `Tab: ${this.tabId}`;
        
        // Listen for storage events from other tabs
        window.addEventListener('storage', this.handleStorageEvent.bind(this));
        
        // Listen for beforeunload to clean up when tab closes
        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
        
        // Set up BroadcastChannel for real-time communication
        if ('BroadcastChannel' in window) {
            this.broadcastChannel = new BroadcastChannel('hotel_booking_sync');
            this.broadcastChannel.onmessage = this.handleBroadcastMessage.bind(this);
        }
        
        // Initialize tab registry
        this.registerTab();
        
        console.log(`Storage Manager initialized for tab: ${this.tabId}`);
    }

    /**
     * Deinitialize the storage manager
     */
    deinitializeStorageSyncListener() {
        window.removeEventListener('storage', this.handleStorageEvent.bind(this));
        window.removeEventListener('beforeunload', this.handleBeforeUnload.bind(this));
        
        if (this.broadcastChannel) {
            this.broadcastChannel.close();
        }
        
        this.unregisterTab();
        this.isInitialized = false;
    }

    /**
     * Generate a unique tab ID
     */
    generateTabId() {
        return Math.random().toString(36).substr(2, 9);
    }

    /**
     * Register this tab in the tab registry
     */
    registerTab() {
        const tabs = this.getActiveTabs();
        tabs[this.tabId] = {
            timestamp: Date.now(),
            url: window.location.href
        };
        localStorage.setItem('__active_tabs__', JSON.stringify(tabs));
    }

    /**
     * Unregister this tab from the tab registry
     */
    unregisterTab() {
        const tabs = this.getActiveTabs();
        delete tabs[this.tabId];
        localStorage.setItem('__active_tabs__', JSON.stringify(tabs));
    }

    /**
     * Get all active tabs
     */
    getActiveTabs() {
        try {
            return JSON.parse(localStorage.getItem('__active_tabs__') || '{}');
        } catch (e) {
            return {};
        }
    }

    /**
     * Clean up old/inactive tabs
     */
    cleanupInactiveTabs() {
        const tabs = this.getActiveTabs();
        const now = Date.now();
        const timeout = 30000; // 30 seconds
        
        Object.keys(tabs).forEach(tabId => {
            if (now - tabs[tabId].timestamp > timeout) {
                delete tabs[tabId];
            }
        });
        
        localStorage.setItem('__active_tabs__', JSON.stringify(tabs));
    }

    /**
     * Check if this is the only active tab
     */
    isOnlyActiveTab() {
        const tabs = this.getActiveTabs();
        return Object.keys(tabs).length <= 1;
    }

    /**
     * Save data to session storage (tab-specific)
     */
    saveSessionData(key, data) {
        try {
            const serializedData = JSON.stringify(data);
            sessionStorage.setItem(key, serializedData);
            return true;
        } catch (e) {
            console.error('Failed to save session data:', e);
            return false;
        }
    }

    /**
     * Save data to synced session storage (shared across tabs)
     */
    saveSyncedSessionData(key, data) {
        try {
            const syncKey = `${this.syncedSessionStoragePrefix}${key}`;
            const serializedData = JSON.stringify({
                data: data,
                timestamp: Date.now(),
                tabId: this.tabId
            });
            
            // Save to localStorage for persistence and sync
            localStorage.setItem(syncKey, serializedData);
            
            // Also save to sessionStorage for quick access
            sessionStorage.setItem(key, JSON.stringify(data));
            
            // Broadcast to other tabs via BroadcastChannel if available
            if (this.broadcastChannel) {
                this.broadcastChannel.postMessage({
                    type: 'SYNCED_DATA_UPDATE',
                    key: key,
                    data: data,
                    timestamp: Date.now(),
                    tabId: this.tabId
                });
            }
            
            return true;
        } catch (e) {
            console.error('Failed to save synced session data:', e);
            return false;
        }
    }

    /**
     * Save data to permanent storage (localStorage)
     */
    savePermanentData(key, data) {
        try {
            const serializedData = JSON.stringify({
                data: data,
                timestamp: Date.now(),
                tabId: this.tabId
            });
            localStorage.setItem(key, serializedData);
            
            // Broadcast to other tabs
            if (this.broadcastChannel) {
                this.broadcastChannel.postMessage({
                    type: 'PERMANENT_DATA_UPDATE',
                    key: key,
                    data: data,
                    timestamp: Date.now(),
                    tabId: this.tabId
                });
            }
            
            return true;
        } catch (e) {
            console.error('Failed to save permanent data:', e);
            return false;
        }
    }

    /**
     * Get data from storage
     */
    getData(key) {
        try {
            // Try synced session storage first
            const syncKey = `${this.syncedSessionStoragePrefix}${key}`;
            let data = localStorage.getItem(syncKey);
            
            if (data) {
                const parsed = JSON.parse(data);
                return parsed.data;
            }
            
            // Try permanent storage
            data = localStorage.getItem(key);
            if (data) {
                const parsed = JSON.parse(data);
                return parsed.data;
            }
            
            // Try session storage
            data = sessionStorage.getItem(key);
            if (data) {
                return JSON.parse(data);
            }
            
            return null;
        } catch (e) {
            console.error('Failed to get data:', e);
            return null;
        }
    }

    /**
     * Get data object with type safety
     */
    getDataObject(key) {
        const data = this.getData(key);
        return data && typeof data === 'object' ? data : null;
    }

    /**
     * Delete data from all storage locations
     */
    deleteData(key) {
        try {
            const syncKey = `${this.syncedSessionStoragePrefix}${key}`;
            
            localStorage.removeItem(key);
            localStorage.removeItem(syncKey);
            sessionStorage.removeItem(key);
            
            // Broadcast deletion to other tabs
            if (this.broadcastChannel) {
                this.broadcastChannel.postMessage({
                    type: 'DATA_DELETE',
                    key: key,
                    timestamp: Date.now(),
                    tabId: this.tabId
                });
            }
            
            return true;
        } catch (e) {
            console.error('Failed to delete data:', e);
            return false;
        }
    }

    /**
     * Move data between storage types
     */
    moveDataToSessionStorage(key) {
        const data = this.getData(key);
        if (data) {
            this.deleteData(key);
            this.saveSessionData(key, data);
        }
    }

    moveDataToSyncedSessionStorage(key) {
        const data = this.getData(key);
        if (data) {
            this.deleteData(key);
            this.saveSyncedSessionData(key, data);
        }
    }

    moveDataToPermanentStorage(key) {
        const data = this.getData(key);
        if (data) {
            this.deleteData(key);
            this.savePermanentData(key, data);
        }
    }

    /**
     * Clear all storage
     */
    clearAllStorage() {
        localStorage.clear();
        sessionStorage.clear();
        
        if (this.broadcastChannel) {
            this.broadcastChannel.postMessage({
                type: 'CLEAR_ALL_STORAGE',
                timestamp: Date.now(),
                tabId: this.tabId
            });
        }
    }

    /**
     * Clear all session storage across tabs
     */
    clearAllSessionsStorage() {
        // Clear local session storage
        sessionStorage.clear();
        
        // Clear synced session storage from localStorage
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(this.syncedSessionStoragePrefix)) {
                localStorage.removeItem(key);
            }
        });
        
        if (this.broadcastChannel) {
            this.broadcastChannel.postMessage({
                type: 'CLEAR_SESSION_STORAGE',
                timestamp: Date.now(),
                tabId: this.tabId
            });
        }
    }

    /**
     * Clear only this tab's session storage
     */
    clearInstanceSessionStorage() {
        sessionStorage.clear();
    }

    /**
     * Clear only localStorage
     */
    clearLocalStorage() {
        localStorage.clear();
        
        if (this.broadcastChannel) {
            this.broadcastChannel.postMessage({
                type: 'CLEAR_LOCAL_STORAGE',
                timestamp: Date.now(),
                tabId: this.tabId
            });
        }
    }

    /**
     * Handle storage events from other tabs
     */
    handleStorageEvent(event) {
        if (!event.key) return;
        
        // Handle synced session storage updates
        if (event.key.startsWith(this.syncedSessionStoragePrefix)) {
            const realKey = event.key.replace(this.syncedSessionStoragePrefix, '');
            
            if (event.newValue) {
                try {
                    const parsed = JSON.parse(event.newValue);
                    // Don't sync data from the same tab
                    if (parsed.tabId !== this.tabId) {
                        sessionStorage.setItem(realKey, JSON.stringify(parsed.data));
                        this.notifyListeners(realKey, parsed.data);
                    }
                } catch (e) {
                    console.error('Failed to parse synced storage data:', e);
                }
            } else {
                // Data was deleted
                sessionStorage.removeItem(realKey);
                this.notifyListeners(realKey, null);
            }
        }
        
        // Handle regular localStorage updates
        else if (!event.key.startsWith('__')) {
            if (event.newValue) {
                try {
                    const parsed = JSON.parse(event.newValue);
                    if (parsed.tabId !== this.tabId) {
                        this.notifyListeners(event.key, parsed.data);
                    }
                } catch (e) {
                    // Handle plain string values
                    this.notifyListeners(event.key, event.newValue);
                }
            } else {
                this.notifyListeners(event.key, null);
            }
        }
    }

    /**
     * Handle BroadcastChannel messages
     */
    handleBroadcastMessage(event) {
        const { type, key, data, tabId } = event.data;
        
        // Don't process messages from the same tab
        if (tabId === this.tabId) return;
        
        switch (type) {
            case 'SYNCED_DATA_UPDATE':
                sessionStorage.setItem(key, JSON.stringify(data));
                this.notifyListeners(key, data);
                break;
                
            case 'PERMANENT_DATA_UPDATE':
                this.notifyListeners(key, data);
                break;
                
            case 'DATA_DELETE':
                sessionStorage.removeItem(key);
                this.notifyListeners(key, null);
                break;
                
            case 'CLEAR_ALL_STORAGE':
                localStorage.clear();
                sessionStorage.clear();
                this.notifyListeners('*', null);
                break;
                
            case 'CLEAR_SESSION_STORAGE':
                sessionStorage.clear();
                Object.keys(localStorage).forEach(storageKey => {
                    if (storageKey.startsWith(this.syncedSessionStoragePrefix)) {
                        localStorage.removeItem(storageKey);
                    }
                });
                this.notifyListeners('session:*', null);
                break;
                
            case 'CLEAR_LOCAL_STORAGE':
                localStorage.clear();
                this.notifyListeners('local:*', null);
                break;
        }
    }

    /**
     * Handle before unload event
     */
    handleBeforeUnload() {
        this.unregisterTab();
        
        // Clean up synced session data if this is the last tab
        setTimeout(() => {
            if (this.isOnlyActiveTab()) {
                Object.keys(localStorage).forEach(key => {
                    if (key.startsWith(this.syncedSessionStoragePrefix)) {
                        localStorage.removeItem(key);
                    }
                });
            }
        }, 100);
    }

    /**
     * Add a listener for data changes
     */
    addDataChangeListener(key, callback) {
        if (!this.listeners[key]) {
            this.listeners[key] = [];
        }
        this.listeners[key].push(callback);
    }

    /**
     * Remove a listener for data changes
     */
    removeDataChangeListener(key, callback) {
        if (this.listeners[key]) {
            this.listeners[key] = this.listeners[key].filter(cb => cb !== callback);
        }
    }

    /**
     * Notify listeners of data changes
     */
    notifyListeners(key, data) {
        if (this.listeners[key]) {
            this.listeners[key].forEach(callback => {
                try {
                    callback(data, key);
                } catch (e) {
                    console.error('Error in data change listener:', e);
                }
            });
        }
        
        // Also notify wildcard listeners
        if (this.listeners['*']) {
            this.listeners['*'].forEach(callback => {
                try {
                    callback(data, key);
                } catch (e) {
                    console.error('Error in wildcard data change listener:', e);
                }
            });
        }
    }

    /**
     * Get storage statistics
     */
    getStorageStats() {
        const localStorageSize = new Blob(Object.values(localStorage)).size;
        const sessionStorageSize = new Blob(Object.values(sessionStorage)).size;
        
        return {
            localStorage: {
                keys: Object.keys(localStorage).length,
                size: localStorageSize
            },
            sessionStorage: {
                keys: Object.keys(sessionStorage).length,
                size: sessionStorageSize
            },
            activeTabs: Object.keys(this.getActiveTabs()).length,
            tabId: this.tabId
        };
    }
}

// Create global instance
window.storageManager = new StorageManager();