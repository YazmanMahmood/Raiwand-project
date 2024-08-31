import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getDatabase, ref, onValue, off, remove, get, set } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';
import { firebaseConfig } from './firebase-config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
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
    commentInput: document.getElementById('comment-input'),
    postCommentBtn: document.getElementById('post-comment'),
    commentsContainer: document.getElementById('comments-container'),
    deleteAllCommentsBtn: document.getElementById('delete-all-comments'),
    errorBox: document.getElementById('error-box'),
    errorMessage: document.getElementById('error-message'),
    popup: document.getElementById('popup'),
  };

  let nodeRef, commentsRef;

  const initializeFirebase = () => {
    nodeRef = ref(database, 'bay 1/node 2');
    commentsRef = ref(database, 'bay 1/Comments/node2');

    setupFirebaseListeners();
  };

  const setupFirebaseListeners = () => {
    const setupListener = (reference, updateFunction, errorMessage) => {
      onValue(reference, updateFunction, (error) => {
        console.error(errorMessage, error);
        showPopup(`${errorMessage} Please refresh the page.`);
      });
    };

    setupListener(nodeRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        updateVisuals(data);
        checkForErrors(data);
      }
    }, 'Error fetching node data:');

    setupListener(commentsRef, (snapshot) => {
      const comments = snapshot.val();
      displayComments(comments);
    }, 'Error fetching comments:');
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

  const updateLastReadingTime = () => {
    if (elements.lastReading) {
      const now = new Date();
      elements.lastReading.textContent = now.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).replace(/\//g, '/').replace(',', '');
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
    elements.errorMessage.textContent = message.split(',').join('\n');
    elements.errorBox.style.display = 'block';
  };

  const hideError = () => {
    elements.errorBox.style.display = 'none';
  };

  const checkForErrors = (data) => {
    const errorConditions = [
      { condition: data.Power_1_status === 0, message: 'Error 001: Power supply loss' },
      { condition: data.DHT_check === 0, message: 'Error 002: DHT sensor down' },
      { condition: data.Battery === 0, message: 'Error 003: Battery low' },
      { condition: data.active === 0, message: 'Error 004: Connection lost' },
    ];

    const errorMessages = errorConditions
      .filter(({ condition }) => condition)
      .map(({ message }) => message);

    if (errorMessages.length > 0) {
      showError(errorMessages.join(','));
    } else {
      hideError();
    }
  };

  const toggleSidebar = () => {
    elements.hamburger.classList.toggle('active');
    elements.sidebar.classList.toggle('open');
    elements.mainContent.classList.toggle('shifted');
  };

  elements.hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleSidebar();
  });

  document.addEventListener('click', (event) => {
    const isSidebarOpen = elements.sidebar.classList.contains('open');
    const clickedInsideSidebar = elements.sidebar.contains(event.target);
    const clickedHamburger = elements.hamburger.contains(event.target);

    if (isSidebarOpen && !clickedInsideSidebar && !clickedHamburger) {
      toggleSidebar();
    }
  });

  elements.sidebar.addEventListener('click', (e) => e.stopPropagation());

  const updateVisuals = (data) => {
    updateGauge('temperature', 'temperature', data.temperature, 0, 100, '°C');
    updateGauge('soilMoisture', 'soilMoisture', data.soil_moisture, 0, 100, '%');
    updateGauge('humidity', 'humidity', data.humidity, 0, 100, '%');
    updateLastReadingTime();
    debouncedChartUpdate(data);
  };

  const displayComments = (comments) => {
    elements.commentsContainer.innerHTML = '';
    if (comments) {
      const fragment = document.createDocumentFragment();
      Object.entries(comments)
        .sort(([, a], [, b]) => b.timestamp.localeCompare(a.timestamp))
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
  adjustForMobile();

  const cleanupFirebaseListeners = () => {
    [nodeRef, commentsRef].forEach(ref => ref && off(ref));
  };

  elements.popupClose.addEventListener('click', hidePopup);

  elements.postCommentBtn.addEventListener('click', () => {
    const commentText = elements.commentInput.value.trim();
    if (commentText) {
      const comments = commentText.split('\n').filter((comment) => comment.trim() !== '');

      get(commentsRef)
        .then((snapshot) => {
          const existingComments = snapshot.val() || {};
          let nextIndex = Object.keys(existingComments).length;

          const updates = comments.reduce((acc, comment) => {
            const now = new Date();
            const timestamp = now.toLocaleString('en-GB', {
              day: '2-digit', month: '2-digit', year: 'numeric',
              hour: '2-digit', minute: '2-digit', second: '2-digit',
              hour12: false,
            }).replace(/\//g, '/').replace(',', '');

            acc[nextIndex++] = { text: comment.trim(), timestamp };
            return acc;
          }, {});

          set(commentsRef, { ...existingComments, ...updates })
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
      const commentRef = ref(database, `bay 1/Comments/node2/${commentKey}`);
      remove(commentRef)
        .then(() => showPopup('Comment deleted successfully'))
        .catch((error) => {
          console.error('Error deleting comment:', error);
          showPopup('Error deleting comment. Please try again.');
        });
    }
  });

  elements.deleteAllCommentsBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete all comments?')) {
      remove(commentsRef)
        .then(() => showPopup('All comments deleted successfully'))
        .catch((error) => {
          console.error('Error deleting all comments:', error);
          showPopup('Error deleting all comments. Please try again.');
        });
    }
  });

  elements.dropdownBtns.forEach((dropdownBtn) => {
    dropdownBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      this.classList.toggle('active');
      const dropdownContainer = this.nextElementSibling;
      dropdownContainer.style.maxHeight = dropdownContainer.style.maxHeight
        ? null
        : `${dropdownContainer.scrollHeight}px`;
    });
  });

  document.addEventListener('click', function (event) {
    if (!event.target.matches('.dropdown-btn')) {
      document.querySelectorAll('.dropdown-container').forEach(dropdown => {
        if (dropdown.style.maxHeight) {
          dropdown.style.maxHeight = null;
          dropdown.previousElementSibling.classList.remove('active');
        }
      });
    }
  });

  initializeFirebase();

  window.addEventListener('beforeunload', cleanupFirebaseListeners);
});
