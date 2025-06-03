// Initialize Leaflet map
let map;
function initializeMap(containerId = 'Map') {
    if (map) {
        map.remove();
    }
    
    map = L.map(containerId).setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add a sample marker
    L.marker([51.505, -0.09]).addTo(map)
        .bindPopup('Sample Location')
        .openPopup();
}

// Initialize map based on current page
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop();
    
    // Initialize map based on current page
    if (currentPage === 'index.html' || currentPage === '') {
        initializeMap('Map');
        simulateUpdates();
    } else if (currentPage === 'locations.html') {
        initializeMap('locationsMap');
    } else if (currentPage === 'geofences.html') {
        initializeMap('geofenceMap');
    }
    
    // Initialize settings page functionality
    if (currentPage === 'settings.html') {
        initializeSettingsPage();
    }
    
    // Initialize users page functionality
    if (currentPage === 'users.html') {
        initializeUsersPage();
    }
    
    // Initialize alerts page functionality
    if (currentPage === 'alerts.html') {
        initializeAlertsPage();
    }
});

// Settings page initialization
function initializeSettingsPage() {
    // Toggle switches functionality
    const toggleSwitches = document.querySelectorAll('.toggle-switch');
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
        });
    });
    
    // Theme selection functionality
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove active class from all options
            themeOptions.forEach(opt => opt.classList.remove('active'));
            // Add active class to clicked option
            option.classList.add('active');
            
            // Apply theme (in a real app, you would save this preference)
            const themeName = option.querySelector('span').textContent.toLowerCase();
            applyTheme(themeName);
        });
    });
    
    // Save button functionality
    const saveButton = document.querySelector('.btn-primary');
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            // Show a success message
            showNotification('Settings saved successfully!', 'success');
        });
    }
}

// Apply theme function
function applyTheme(theme) {
    // This is a simplified version. In a real app, you would apply CSS variables or classes
    console.log(`Theme changed to: ${theme}`);
    // For demonstration purposes only
    if (theme === 'dark') {
        document.body.style.setProperty('--gray-100', '#1e293b');
        document.body.style.setProperty('--gray-800', '#f1f5f9');
        // In a real implementation, you would change all relevant CSS variables
    } else if (theme === 'light') {
        document.body.style.setProperty('--gray-100', '#f1f5f9');
        document.body.style.setProperty('--gray-800', '#1e293b');
    }
    // System theme would detect user's system preference
}

// Users page initialization
function initializeUsersPage() {
    // Add user button functionality
    const addUserBtn = document.querySelector('.btn-primary');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', () => {
            // In a real app, this would open a modal or navigate to a form
            showNotification('Add user functionality would open a form here', 'info');
        });
    }
    
    // Edit and delete buttons functionality
    const actionButtons = document.querySelectorAll('.btn-icon');
    actionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const action = button.getAttribute('title');
            const userRow = button.closest('tr');
            const userName = userRow.querySelector('.user-cell span').textContent;
            
            if (action === 'Edit') {
                // In a real app, this would open a modal or navigate to a form
                showNotification(`Edit user: ${userName}`, 'info');
            } else if (action === 'Delete') {
                // In a real app, this would show a confirmation dialog
                if (confirm(`Are you sure you want to delete ${userName}?`)) {
                    showNotification(`User ${userName} deleted`, 'success');
                    // In a real app, you would remove the user from the database
                    // For demo purposes, we'll just hide the row
                    userRow.style.display = 'none';
                }
            }
        });
    });
}

// Alerts page initialization
function initializeAlertsPage() {
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const alertItems = document.querySelectorAll('.alert-item');
            
            alertItems.forEach(item => {
                const alertText = item.textContent.toLowerCase();
                if (alertText.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
    
    // Filter button functionality
    const filterBtn = document.querySelector('.btn-secondary');
    if (filterBtn) {
        filterBtn.addEventListener('click', () => {
            // In a real app, this would open a filter dialog
            showNotification('Filter functionality would open options here', 'info');
        });
    }
    
    // Pagination functionality
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    paginationBtns.forEach(btn => {
        if (!btn.disabled) {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                paginationBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                
                // In a real app, this would load the corresponding page of alerts
                showNotification(`Navigated to page ${btn.textContent}`, 'info');
            });
        }
    });
}

// Notification function
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Add styles if they don't exist
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 16px;
                border-radius: 8px;
                background-color: white;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                display: flex;
                align-items: center;
                justify-content: space-between;
                z-index: 1000;
                min-width: 300px;
                max-width: 400px;
                animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .notification-success i {
                color: var(--success);
            }
            .notification-error i {
                color: var(--danger);
            }
            .notification-info i {
                color: var(--primary);
            }
            .notification-close {
                background: none;
                border: none;
                color: var(--gray-500);
                cursor: pointer;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; display: none; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Location toggle functionality
const locationToggle = document.getElementById('locationToggle');
if (locationToggle) {
    // Set initial state (active by default)
    locationToggle.classList.add('active');
    
    locationToggle.addEventListener('click', () => {
        locationToggle.classList.toggle('active');
        const isActive = locationToggle.classList.contains('active');
        const statusDot = document.querySelector('.status-dot');
        const statusTitle = document.querySelector('.status-title');
        const statusLocation = document.querySelector('.status-location');
        
        if (statusDot) {
            statusDot.style.backgroundColor = isActive ? 'var(--success)' : 'var(--danger)';
        }
        
        if (statusTitle) {
            statusTitle.textContent = isActive ? 'Inside Geofence' : 'Outside Geofence';
        }
        
        if (statusLocation) {
            statusLocation.textContent = isActive ? 'Campus Area - Building A' : 'No active geofence';
        }
    });
}

// Map controls functionality
const centerMapBtn = document.getElementById('centerMap');
if (centerMapBtn) {
    centerMapBtn.addEventListener('click', () => {
        map.setView([51.505, -0.09], 13);
    });
}

const fullscreenBtn = document.getElementById('fullscreen');
if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
        const mapContainer = document.querySelector('.map-container');
        if (!document.fullscreenElement) {
            mapContainer.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });
}

// Geofence drawing functionality
let drawingMode = false;
let currentPolygon = null;
let polygonPoints = [];

const drawGeofenceBtn = document.getElementById('drawGeofence');
if (drawGeofenceBtn) {
    drawGeofenceBtn.addEventListener('click', () => {
        drawingMode = !drawingMode;
        const button = drawGeofenceBtn;
        
        if (drawingMode) {
            button.style.backgroundColor = 'var(--primary)';
            button.style.color = 'white';
            map.on('click', handleMapClick);
        } else {
            button.style.backgroundColor = 'white';
            button.style.color = 'var(--gray-700)';
            map.off('click', handleMapClick);
            finishDrawing();
        }
    });
}

function handleMapClick(e) {
    if (!drawingMode) return;
    
    const point = e.latlng;
    polygonPoints.push(point);
    
    if (currentPolygon) {
        map.removeLayer(currentPolygon);
    }
    
    if (polygonPoints.length > 2) {
        currentPolygon = L.polygon(polygonPoints, {
            color: 'var(--primary)',
            fillColor: 'var(--primary)',
            fillOpacity: 0.2
        }).addTo(map);
    }
}

function finishDrawing() {
    if (polygonPoints.length > 2) {
        // Here you would typically save the geofence to your backend
        console.log('Geofence created:', polygonPoints);
        
        // Reset drawing state
        polygonPoints = [];
        currentPolygon = null;
    }
}

// Simulate real-time updates
function simulateUpdates() {
    const alerts = [
        { type: 'enter', user: 'Sarah Wilson', location: 'Campus Area' },
        { type: 'exit', user: 'Mike Johnson', location: 'Office Zone' },
        { type: 'enter', user: 'Emma Davis', location: 'Parking Area' },
        { type: 'exit', user: 'Alex Brown', location: 'Security Zone' }
    ];
    
    setInterval(() => {
        const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
        const alertContainer = document.querySelector('.alerts-container');
        if (alertContainer) {
            const newAlert = document.createElement('div');
            newAlert.className = 'alert-item';
            newAlert.innerHTML = `
                <div class="alert-icon alert-${randomAlert.type}">
                    <i class="fas fa-sign-${randomAlert.type === 'enter' ? 'in' : 'out'}-alt"></i>
                </div>
                <div class="alert-details">
                    <div class="alert-user">${randomAlert.user} ${randomAlert.type}ed</div>
                    <div class="alert-meta">${randomAlert.location}</div>
                </div>
                <div class="alert-time">Just now</div>
            `;
            
            alertContainer.insertBefore(newAlert, alertContainer.firstChild);
            if (alertContainer.children.length > 4) {
                alertContainer.removeChild(alertContainer.lastChild);
            }
        }
    }, 5000);
}