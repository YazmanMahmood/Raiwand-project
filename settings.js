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
        const setValuesLogRef = ref(database, '/bay 1/set_value_log');
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

    // Sidebar and Hamburger functionality from bay1.js
    function toggleSidebar(e) {
        e.stopPropagation();
        elements.hamburger.classList.toggle('active');
        elements.sidebar.classList.toggle('open');
        elements.mainContent.classList.toggle('shifted');
    }

    function closeSidebarOnOutsideClick(event) {
        if (elements.sidebar.classList.contains('open') &&
            !elements.sidebar.contains(event.target) &&
            !elements.hamburger.contains(event.target)) {
            elements.hamburger.classList.remove('active');
            elements.sidebar.classList.remove('open');
            elements.mainContent.classList.remove('shifted');
        }
    }

    function toggleDropdown(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        const dropdownContainer = this.nextElementSibling;
        dropdownContainer.style.maxHeight = dropdownContainer.style.maxHeight ? null : `${dropdownContainer.scrollHeight}px`;
    }

    function closeDropdowns(event) {
        if (!event.target.matches('.dropdown-btn')) {
            document.querySelectorAll('.dropdown-container').forEach(dropdown => {
                dropdown.style.maxHeight = null;
                dropdown.previousElementSibling.classList.remove('active');
            });
        }
    }

    // Event Listeners for Sidebar and Dropdown
    if (elements.hamburger && elements.sidebar) {
        elements.hamburger.addEventListener('click', toggleSidebar);
    }
    document.addEventListener('click', closeSidebarOnOutsideClick);
    elements.sidebar.addEventListener('click', (e) => e.stopPropagation());

    elements.dropdownBtns.forEach(btn => btn.addEventListener('click', toggleDropdown));
    document.addEventListener('click', closeDropdowns);
});
