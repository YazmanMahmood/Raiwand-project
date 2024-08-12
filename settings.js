import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getDatabase, ref, get, set, remove } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';
import { firebaseConfig } from './firebase-config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        hamburger: document.querySelector('.hamburger'),
        sidebar: document.querySelector('.sidebar'),
        mainContent: document.querySelector('.main-content'),
        container: document.querySelector('.container'),
        dropdownBtns: document.querySelectorAll('.dropdown-btn'),
        changePasswordForm: document.getElementById('change-password-form'),
        clearSetValuesBtn: document.getElementById('clear-set-values'),
        clearDataLogBtn: document.getElementById('clear-data-log'),
        popup: document.getElementById('popup'),
        popupMessage: document.getElementById('popup-message'),
        popupConfirm: document.getElementById('popup-confirm'),
        popupCancel: document.getElementById('popup-cancel'),
        closePopup: document.querySelector('.close-popup')
    };

    // Function to show popup
    function showPopup(message, confirmCallback, cancelCallback = null) {
        elements.popupMessage.textContent = message;
        elements.popup.style.display = 'block';

        elements.popupConfirm.onclick = () => {
            elements.popup.style.display = 'none';
            if (confirmCallback) confirmCallback();
        };

        const closePopupHandler = () => {
            elements.popup.style.display = 'none';
            if (cancelCallback) cancelCallback();
        };

        elements.popupCancel.onclick = closePopupHandler;
        elements.closePopup.onclick = closePopupHandler;
    }

    // Change Password
    const handleChangePassword = async (e) => {
        e.preventDefault();
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            showPopup("Please fill in all password fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            showPopup("New passwords don't match!");
            return;
        }

        try {
            const adminPasswordRef = ref(database, 'users/admin/password');
            const snapshot = await get(adminPasswordRef);
            const storedPassword = snapshot.val();

            if (currentPassword !== storedPassword) {
                showPopup("Current password is incorrect.");
                return;
            }

            showPopup("Are you sure you want to change your password?", async () => {
                try {
                    await set(adminPasswordRef, newPassword);
                    showPopup("Password changed successfully!");
                    elements.changePasswordForm.reset();
                } catch (error) {
                    showPopup("Error changing password: " + error.message);
                }
            });
        } catch (error) {
            showPopup("Error: " + error.message);
        }
    };

    if (elements.changePasswordForm) {
        elements.changePasswordForm.addEventListener('submit', handleChangePassword);
    }

    // Clear Set Values History
    const handleClearSetValues = () => {
        const setValuesLogRef = ref(database, '/bay 1/node 1/set_values_log');
        showPopup("Are you sure you want to clear all set values history?", async () => {
            try {
                await remove(setValuesLogRef);
                showPopup("Set values history cleared successfully!");
            } catch (error) {
                console.error('Error clearing set values log:', error);
                showPopup("Error clearing set values history: " + error.message);
            }
        });
    };

    if (elements.clearSetValuesBtn) {
        elements.clearSetValuesBtn.addEventListener('click', handleClearSetValues);
    }

    // Clear Data Log for Bay 1, Node 1
    const handleClearDataLog = () => {
        const dataLogRef = ref(database, 'bay 1/logs/node1');
        showPopup("Are you sure you want to clear the data log for Bay 1, Node 1? This action cannot be undone.", async () => {
            try {
                await remove(dataLogRef);
                showPopup("Data log for Bay 1, Node 1 cleared successfully!");
            } catch (error) {
                console.error('Error clearing data log:', error);
                showPopup("Error clearing data log: " + error.message);
            }
        });
    };

    if (elements.clearDataLogBtn) {
        elements.clearDataLogBtn.addEventListener('click', handleClearDataLog);
    }

    // Sidebar functionality
    if (elements.hamburger && elements.sidebar) {
        elements.hamburger.addEventListener('click', () => {
            elements.sidebar.classList.toggle('open');
            elements.container.classList.toggle('shifted');
        });
    }

    // Close sidebar when clicking outside
    document.addEventListener('click', (event) => {
        if (elements.sidebar && elements.hamburger &&
            !elements.sidebar.contains(event.target) && !elements.hamburger.contains(event.target)) {
            elements.sidebar.classList.remove('open');
            elements.container.classList.remove('shifted');
        }
    });

    // Dropdown functionality for sidebar
    elements.dropdownBtns.forEach((dropdownBtn) => {
        dropdownBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            const dropdownContainer = this.nextElementSibling;
            if (dropdownContainer) {
                if (dropdownContainer.style.maxHeight) {
                    dropdownContainer.style.maxHeight = null;
                } else {
                    dropdownContainer.style.maxHeight = dropdownContainer.scrollHeight + "px";
                }
            }
        });
    });
});
