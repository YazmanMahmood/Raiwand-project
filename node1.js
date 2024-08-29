import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getDatabase, ref, onValue, off, remove, get, set } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';
import { firebaseConfig } from './firebase-config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const debounce = (func, wait) => {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

document.addEventListener('DOMContentLoaded', () => {
  const elements = {
    hamburger: document.querySelector('#sidebarToggle'),
    sidebar: document.querySelector('.sidebar'),
    mainContent: document.querySelector('.main-content'),
    container: document.querySelector('.container'),
    dropdownBtns: document.querySelectorAll('.dropdown-btn'),
    lastReading: document.getElementById('last-reading'),
    errorDisplay: document.getElementById('error-display'),
    popupMessage: document.getElementById('popup-message'),
    popupClose: document.getElementById('popup-close'),
    chartContainer: document.getElementById('summary-chart-container'),
    gauges: {
      temperature: document.getElementById('temperature-gauge'),
      soilMoisture: document.getElementById('soil-moisture-gauge'),
      humidity: document.getElementById('humidity-gauge'),
    },
    values: {
      temperature: document.getElementById('temperature-value'),
      soilMoisture: document.getElementById('soil-moisture-value'),
      humidity: document.getElementById('humidity-value'),
    },
    textboxes: {
      temperature: document.getElementById('temperature-value-textbox'),
      soilMoisture: document.getElementById('soil-moisture-value-textbox'),
      humidity: document.getElementById('humidity-value-textbox'),
    },
    setValues: {
      temperature: document.getElementById('temperature-set-value'),
      soilMoisture: document.getElementById('soil-moisture-set-value'),
      humidity: document.getElementById('humidity-set-value'),
    },
    commentInput: document.getElementById('comment-input'),
    postCommentBtn: document.getElementById('post-comment'),
    commentsContainer: document.getElementById('comments-container'),
    deleteAllCommentsBtn: document.getElementById('delete-all-comments'),
    errorBox: document.getElementById('error-box'),
    errorMessage: document.getElementById('error-message'),
  };

  let nodeRef, setValuesRef, commentsRef;

  const initializeFirebase = () => {
    nodeRef = ref(database, 'bay 1/node 1');
    setValuesRef = ref(database, 'bay 1/node 1/set values');
    commentsRef = ref(database, 'bay 1/Comments/node1');

    setupFirebaseListeners();
    loadInitialSetValues();
  };

  const setupFirebaseListeners = () => {
    onValue(nodeRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        updateVisuals(data);
        checkForErrors(data);
      }
    }, (error) => {
      console.error('Error fetching node data:', error);
      showPopup('Error fetching data. Please refresh the page.');
    });

    onValue(setValuesRef, (snapshot) => {
      const setValues = snapshot.val();
      if (setValues) {
        updateSetValueIndicators(setValues);
      }
    }, (error) => {
      console.error('Error fetching set values:', error);
      showPopup('Error fetching set values. Please refresh the page.');
    });

    onValue(commentsRef, (snapshot) => {
      const comments = snapshot.val();
      displayComments(comments);
    }, (error) => {
      console.error('Error fetching comments:', error);
      showPopup('Error fetching comments. Please refresh the page.');
    });
  };

  const loadInitialSetValues = () => {
    get(setValuesRef)
      .then((snapshot) => {
        const setValues = snapshot.val();
        if (setValues) {
          updateSetValueIndicators(setValues);
        }
      })
      .catch((error) => {
        console.error('Error fetching initial set values:', error);
        showPopup('Error fetching initial values. Please refresh the page.');
      });
  };

  const updateGauge = (gaugeId, valueId, value, min, max, unit) => {
    const gauge = elements.gauges[gaugeId];
    const valueDisplay = elements.values[valueId];
    const valueTextbox = elements.textboxes[valueId];

    if (gauge && valueDisplay && valueTextbox && value !== null) {
      const percentage = ((value - min) / (max - min)) * 100;
      const dashOffset = 565.48 - (565.48 * percentage) / 100;
      gauge.style.strokeDashoffset = dashOffset;
      const formattedValue = `${value.toFixed(1)}${unit}`;
      valueDisplay.textContent = formattedValue;
      valueTextbox.textContent = formattedValue;
    }
  };

  const updateSetValueIndicators = (setValues) => {
    updateSetValueIndicator('temperature', setValues.temperature, 0, 100);
    updateSetValueIndicator('soilMoisture', setValues.soil_moisture, 0, 100);
    updateSetValueIndicator('humidity', setValues.humidity, 0, 100);
  };

  const updateSetValueIndicator = (gaugeId, value, min, max) => {
    const setValueGauge = elements.setValues[gaugeId];
    if (setValueGauge && value !== null) {
      const percentage = ((value - min) / (max - min)) * 100;
      const dashOffset = 565.48 - (565.48 * percentage) / 100;
      setValueGauge.style.strokeDashoffset = dashOffset;
    }
  };

  const updateLastReadingTime = () => {
    if (elements.lastReading) {
      const now = new Date();
      const formattedDate = now
        .toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
        .replace(/\//g, '/')
        .replace(',', '');
      elements.lastReading.textContent = formattedDate;
    }
  };

  const debouncedChartUpdate = debounce((data) => {
    const maxPosition = window.innerHeight - elements.chartContainer.offsetHeight;
    const avgValue = (data.temperature + data.humidity + data.soil_moisture) / 3;
    const newPosition = maxPosition * (1 - avgValue / 100);
    elements.chartContainer.style.top = `${newPosition}px`;

    if (window.updateChartData) {
      window.updateChartData(data);
    }
  }, 1000);

  const showError = (message) => {
    const errorLines = message.split(',').join('\n');
    elements.errorMessage.textContent = errorLines;
    elements.errorBox.style.display = 'block';
  };
  
  const checkForErrors = (data) => {
    let errorMessages = [];
  
    if (data.Power_1_status === 0) {
      errorMessages.push('Error 001: Power supply loss');
    }
    if (data.DHT_check === 0) {
      errorMessages.push('Error 002: DHT sensor down');
    }
    if (data.Battery === 0) {
      errorMessages.push('Error 003: Battery low');
    }
    if (data.active === 0) {
      errorMessages.push('Error 004: Connection lost');
    }
  
    if (errorMessages.length > 0) {
      showError(errorMessages.join(','));
    } else {
      hideError();
    }
  };
  // Sidebar functionality
  elements.hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    elements.hamburger.classList.toggle('active');
    elements.sidebar.classList.toggle('open');
    elements.mainContent.classList.toggle('shifted');
  });

  // Close sidebar when clicking outside
  document.addEventListener('click', (event) => {
    const isSidebarOpen = elements.sidebar.classList.contains('open');
    const clickedInsideSidebar = elements.sidebar.contains(event.target);
    const clickedHamburger = elements.hamburger.contains(event.target);

    if (isSidebarOpen && !clickedInsideSidebar && !clickedHamburger) {
      elements.hamburger.classList.remove('active');
      elements.sidebar.classList.remove('open');
      elements.mainContent.classList.remove('shifted');
    }
  });

  // Prevent sidebar from closing when clicking inside it
  elements.sidebar.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  const updateVisuals = (data) => {
    updateGauge('temperature', 'temperature', data.temperature, 0, 100, '°C');
    updateGauge('soilMoisture', 'soilMoisture', data.soil_moisture, 0, 100, '%');
    updateGauge('humidity', 'humidity', data.humidity, 0, 100, '%');
    updateLastReadingTime();
    debouncedChartUpdate(data);
  };

  const displayComments = (comments) => {
    elements.commentsContainer.innerHTML = ''; // Clear existing comments
    if (comments) {
      const fragment = document.createDocumentFragment();
      Object.entries(comments)
        .sort(([, a], [, b]) => b.timestamp.localeCompare(a.timestamp)) // Sort comments by timestamp, newest first
        .forEach(([key, comment]) => {
          const commentElement = document.createElement('div');
          commentElement.className = 'comment';
          commentElement.innerHTML = `
            <p>${comment.text} - ${comment.timestamp}</p>
            <button class="delete-comment" data-key="${key}">Delete</button>
          `;
          fragment.appendChild(commentElement);
        });
      elements.commentsContainer.appendChild(fragment);
    }
  };

  const showPopup = (message) => {
    elements.popupMessage.textContent = message;
    elements.popup.classList.add('show');
  };

  const hidePopup = () => {
    elements.popup.classList.remove('show');
  };

  // Mobile responsiveness improvements
  const adjustForMobile = () => {
    const isMobile = window.innerWidth <= 768;
    document.body.classList.toggle('mobile', isMobile);

    if (isMobile) {
      elements.sidebar.classList.remove('open');
      elements.mainContent.classList.remove('shifted');
      elements.hamburger.classList.remove('active');
    }
  };

  window.addEventListener('resize', adjustForMobile);
  adjustForMobile(); // Call once on load

  const cleanupFirebaseListeners = () => {
    if (nodeRef) off(nodeRef);
    if (setValuesRef) off(setValuesRef);
    if (commentsRef) off(commentsRef);
  };

  elements.popupClose.addEventListener('click', hidePopup);

  elements.postCommentBtn.addEventListener('click', () => {
    const commentText = elements.commentInput.value.trim();
    if (commentText) {
      const comments = commentText.split('\n').filter((comment) => comment.trim() !== '');

      get(commentsRef)
        .then((snapshot) => {
          const existingComments = snapshot.val() || {};
          let nextIndex = 0;
          while (existingComments.hasOwnProperty(nextIndex.toString())) {
            nextIndex++;
          }

          const updates = {};
          comments.forEach((comment) => {
            const now = new Date();
            const timestamp = now
              .toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
              })
              .replace(/\//g, '/')
              .replace(',', '');

            updates[nextIndex.toString()] = {
              text: comment.trim(),
              timestamp: timestamp,
            };
            nextIndex++;
          });

          set(commentsRef, { ...updates, ...existingComments }) // Place new comments at the top
            .then(() => {
              elements.commentInput.value = '';
              showPopup('Comments posted successfully');
            })
            .catch((error) => {
              console.error('Error posting comments:', error);
              showPopup('Error posting comments. Please try again.');
            });
        })
        .catch((error) => {
          console.error('Error fetching existing comments:', error);
          showPopup('Error posting comments. Please try again.');
        });
    } else {
      showPopup('Please enter at least one comment before posting');
    }
  });

  elements.commentsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-comment')) {
      const commentKey = event.target.getAttribute('data-key');
      const commentRef = ref(database, `bay 1/Comments/node1/${commentKey}`);
      remove(commentRef)
        .then(() => {
          showPopup('Comment deleted successfully');
        })
        .catch((error) => {
          console.error('Error deleting comment:', error);
          showPopup('Error deleting comment. Please try again.');
        });
    }
  });

  elements.deleteAllCommentsBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete all comments?')) {
      remove(commentsRef)
        .then(() => {
          showPopup('All comments deleted successfully');
        })
        .catch((error) => {
          console.error('Error deleting all comments:', error);
          showPopup('Error deleting all comments. Please try again.');
        });
    }
  });

  // Dropdown functionality for sidebar
  elements.dropdownBtns.forEach((dropdownBtn) => {
    dropdownBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      this.classList.toggle('active');
      const dropdownContainer = this.nextElementSibling;
      if (dropdownContainer.style.maxHeight) {
        dropdownContainer.style.maxHeight = null;
      } else {
        dropdownContainer.style.maxHeight = dropdownContainer.scrollHeight + 'px';
      }
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', function (event) {
    if (!event.target.matches('.dropdown-btn')) {
      var dropdowns = document.getElementsByClassName('dropdown-container');
      for (var i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.style.maxHeight) {
          openDropdown.style.maxHeight = null;
          openDropdown.previousElementSibling.classList.remove('active');
        }
      }
    }
  });

  // Initialize Firebase and setup listeners
  initializeFirebase();

  window.addEventListener('beforeunload', cleanupFirebaseListeners);
});
