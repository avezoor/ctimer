// DOM elements
const githubLink = document.getElementById('githubLink');
const daysElement = document.getElementById('days');
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const setTimerBtn = document.getElementById('setTimerBtn');
const resetTimerBtn = document.getElementById('resetTimerBtn');
const startTimerBtn = document.getElementById('startTimerBtn');
const timerModal = new bootstrap.Modal(document.getElementById('timerModal'));
const timeUpModal = new bootstrap.Modal(document.getElementById('timeUpModal'));
const githubProfileModal = new bootstrap.Modal(document.getElementById('githubProfileModal'));

// Timer variables
let countdownDate = null;
let countdownInterval = null;
let timeElements = [daysElement, hoursElement, minutesElement, secondsElement];

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle effect
    initializeParticles();
    
    // Add particles to background
    generateBackgroundParticles();
    
    // Load timer from localStorage if exists
    const savedCountdown = localStorage.getItem('countdownTime');
    if (savedCountdown) {
        countdownDate = parseInt(savedCountdown);
        startCountdown();
    }

    // Add hover effects to buttons
    addButtonHoverEffects();
    
    // Initialize increment/decrement buttons
    initIncrementDecrementButtons();
    
    // GitHub link animation
    initGitHubAnimation();
});

// GitHub link animation and modal
function initGitHubAnimation() {
    if (githubLink) {
        githubLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add shine effect
            this.classList.add('animate__animated', 'animate__rubberBand');
            
            // Remove animation classes after animation completes
            setTimeout(() => {
                this.classList.remove('animate__animated', 'animate__rubberBand');
                
                // Show GitHub profile modal with animation
                const modalEl = document.getElementById('githubProfileModal');
                modalEl.classList.add('animate__animated', 'animate__fadeIn');
                githubProfileModal.show();
                
                // Add entrance animations to elements inside modal
                const container = document.querySelector('.github-profile-container');
                container.classList.add('animate__animated', 'animate__zoomIn');
                
                // Create code rain animation in background
                createCodeRain();
            }, 700);
        });
    }
}

// Create matrix-like code rain in the GitHub modal background
function createCodeRain() {
    const container = document.querySelector('.github-profile-container');
    if (!container) return;
    
    // Remove any existing code rain
    document.querySelectorAll('.code-rain').forEach(el => el.remove());
    
    // Create code rain container
    const codeRainContainer = document.createElement('div');
    codeRainContainer.className = 'code-rain';
    codeRainContainer.style.position = 'absolute';
    codeRainContainer.style.top = '0';
    codeRainContainer.style.left = '0';
    codeRainContainer.style.width = '100%';
    codeRainContainer.style.height = '100%';
    codeRainContainer.style.zIndex = '-1';
    codeRainContainer.style.overflow = 'hidden';
    codeRainContainer.style.pointerEvents = 'none';
    
    container.style.position = 'relative';
    container.appendChild(codeRainContainer);
    
    // Create code rain drops
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/{}[]!@#$%^&*()';
    const columns = Math.floor(codeRainContainer.offsetWidth / 20);
    
    for (let i = 0; i < columns; i++) {
        const drop = document.createElement('div');
        drop.className = 'code-drop';
        drop.style.position = 'absolute';
        drop.style.top = `-${Math.random() * 500}px`;
        drop.style.left = `${i * 20}px`;
        drop.style.color = i % 2 === 0 ? 'var(--primary-neon)' : 'var(--secondary-neon)';
        drop.style.fontSize = '14px';
        drop.style.opacity = '0.7';
        drop.style.fontFamily = 'monospace';
        drop.style.textShadow = i % 2 === 0 ? 'var(--neon-primary-glow)' : 'var(--neon-secondary-glow)';
        
        const length = 5 + Math.floor(Math.random() * 15); // Random length between 5-20 characters
        
        for (let j = 0; j < length; j++) {
            const char = document.createElement('div');
            char.textContent = characters[Math.floor(Math.random() * characters.length)];
            char.style.animationDelay = `${j * 0.1}s`;
            char.style.opacity = `${1 - (j * 0.1)}`;
            drop.appendChild(char);
        }
        
        // Animate the drop
        drop.style.animation = `codeDrop ${2 + Math.random() * 5}s linear infinite`;
        drop.style.animationDelay = `${Math.random() * 5}s`;
        
        codeRainContainer.appendChild(drop);
    }
    
    // Add CSS for code rain animation
    if (!document.getElementById('code-rain-style')) {
        const style = document.createElement('style');
        style.id = 'code-rain-style';
        style.textContent = `
            @keyframes codeDrop {
                0% { transform: translateY(0); }
                100% { transform: translateY(500px); }
            }
            
            .code-drop > div {
                margin-bottom: 2px;
                transition: all 0.1s ease;
            }
            
            .code-drop > div:first-child {
                color: white;
                text-shadow: 0 0 10px white;
            }
        `;
        document.head.appendChild(style);
    }
}

// Open the timer modal with animation
setTimerBtn.addEventListener('click', () => {
    document.getElementById('days-input').value = "0";
    document.getElementById('hours-input').value = "0";
    document.getElementById('minutes-input').value = "0";
    document.getElementById('seconds-input').value = "0";
    
    // Add entrance animation to modal
    document.getElementById('timerModal').classList.add('fade-in');
    timerModal.show();
    
    // Focus on the first input
    setTimeout(() => {
        document.getElementById('days-input').focus();
    }, 500);
});

// Reset the countdown timer with animation
resetTimerBtn.addEventListener('click', () => {
    // Add shake animation
    timeElements.forEach(element => {
        element.parentElement.classList.add('shake-animation');
    });
    
    setTimeout(() => {
        clearInterval(countdownInterval);
        countdownDate = null;
        localStorage.removeItem('countdownTime');
        
        // Reset display to zeros
        updateTimerDisplay(0, 0, 0, 0);
        
        // Remove shake animation
        timeElements.forEach(element => {
            element.parentElement.classList.remove('shake-animation');
        });
    }, 300);
});

// Start the countdown with the values from the modal
startTimerBtn.addEventListener('click', () => {
    const days = parseInt(document.getElementById('days-input').value) || 0;
    const hours = parseInt(document.getElementById('hours-input').value) || 0;
    const minutes = parseInt(document.getElementById('minutes-input').value) || 0;
    const seconds = parseInt(document.getElementById('seconds-input').value) || 0;
    
    // Check if all values are zero
    if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
        // Add shake animation to inputs
        const inputs = document.querySelectorAll('#timerForm input');
        inputs.forEach(input => {
            input.classList.add('error-shake');
            setTimeout(() => {
                input.classList.remove('error-shake');
            }, 500);
        });
        
        // Show error message
        const errorMsg = document.createElement('div');
        errorMsg.className = 'alert alert-danger mt-3 animate__animated animate__fadeIn';
        errorMsg.textContent = "Please set a time greater than zero.";
        
        const modalBody = document.querySelector('.modal-body');
        modalBody.appendChild(errorMsg);
        
        setTimeout(() => {
            errorMsg.classList.add('animate__fadeOut');
            setTimeout(() => {
                modalBody.removeChild(errorMsg);
            }, 500);
        }, 2000);
        
        return;
    }
    
    // Calculate total milliseconds
    const totalMilliseconds = 
        (days * 24 * 60 * 60 * 1000) + 
        (hours * 60 * 60 * 1000) + 
        (minutes * 60 * 1000) + 
        (seconds * 1000);
    
    // Set the countdown date
    countdownDate = Date.now() + totalMilliseconds;
    
    // Save to localStorage
    localStorage.setItem('countdownTime', countdownDate.toString());
    
    // Start the countdown and hide modal
    startCountdown();
    timerModal.hide();
    
    // Add pulse animation to the timer container
    document.querySelector('.timer-container').classList.add('pulse-animation');
    setTimeout(() => {
        document.querySelector('.timer-container').classList.remove('pulse-animation');
    }, 1000);
});

// Start and update the countdown
function startCountdown() {
    // Clear any existing intervals
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    // Function to update the countdown
    function updateCountdown() {
        const now = Date.now();
        const distance = countdownDate - now;
        
        // Time calculations
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Update the display
        updateTimerDisplay(days, hours, minutes, seconds);
        
        // If the countdown is over
        if (distance < 0) {
            clearInterval(countdownInterval);
            updateTimerDisplay(0, 0, 0, 0);
            localStorage.removeItem('countdownTime');
            countdownDate = null;
            
            // Add entrance animation to the time's up modal
            const timeUpModalEl = document.getElementById('timeUpModal');
            timeUpModalEl.classList.add('zoom-in');
            
            // Show modal with pulsing animation
            timeUpModal.show();
            
            // Add sound effect (if allowed by browser)
            try {
                const audio = new Audio('data:audio/mp3;base64,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'
                );
                audio.play();
            } catch (e) {
                console.log('Audio playback not supported');
            }
            
            // Vibrate phone if supported
            if ('vibrate' in navigator) {
                navigator.vibrate([200, 100, 200]);
            }
        }
    }
    
    // Update immediately and then every second
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

// Update the timer display with animation
function updateTimerDisplay(days, hours, minutes, seconds) {
    // Format the values with leading zeros
    const values = [
        days.toString().padStart(2, '0'),
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0')
    ];
    
    // Update each element with animation if value changed
    timeElements.forEach((element, index) => {
        if (element.textContent !== values[index]) {
            // Add animation class
            element.parentElement.classList.add('animate');
            
            // Update text
            element.textContent = values[index];
            
            // Remove animation class after animation completes
            setTimeout(() => {
                element.parentElement.classList.remove('animate');
            }, 500);
        }
    });
}

// Form validation with enhanced feedback
document.querySelectorAll('#timerForm input[type="number"]').forEach(input => {
    input.addEventListener('input', function() {
        // Clear any previous validation styling
        this.classList.remove('is-invalid', 'is-valid');
        
        // Validate input values
        if (this.value === '') {
            this.value = 0;
        } else if (parseInt(this.value) < 0) {
            this.value = 0;
            this.classList.add('is-invalid');
        } else {
            // Add max validation
            if (this.id === 'hours-input' && parseInt(this.value) > 23) {
                this.value = 23;
                this.classList.add('is-valid');
            } else if ((this.id === 'minutes-input' || this.id === 'seconds-input') && parseInt(this.value) > 59) {
                this.value = 59;
                this.classList.add('is-valid');
            } else {
                this.classList.add('is-valid');
            }
        }
        
        // Add transition effect
        this.classList.add('input-changed');
        setTimeout(() => {
            this.classList.remove('input-changed');
        }, 300);
    });
});

// Initialize increment/decrement buttons
function initIncrementDecrementButtons() {
    // Increment buttons
    document.querySelectorAll('.increment-btn').forEach(button => {
        button.addEventListener('click', function() {
            const targetInput = document.getElementById(this.dataset.target);
            let currentValue = parseInt(targetInput.value) || 0;
            
            // Apply max values based on input type
            if (targetInput.id === 'hours-input' && currentValue >= 23) {
                currentValue = 23;
            } else if ((targetInput.id === 'minutes-input' || targetInput.id === 'seconds-input') && currentValue >= 59) {
                currentValue = 59;
            } else {
                currentValue++;
            }
            
            // Update input value with animation
            targetInput.value = currentValue;
            targetInput.classList.add('input-changed');
            
            // Add button animation
            this.classList.add('btn-active');
            setTimeout(() => {
                this.classList.remove('btn-active');
                targetInput.classList.remove('input-changed');
            }, 300);
        });
    });

    // Decrement buttons
    document.querySelectorAll('.decrement-btn').forEach(button => {
        button.addEventListener('click', function() {
            const targetInput = document.getElementById(this.dataset.target);
            let currentValue = parseInt(targetInput.value) || 0;
            
            if (currentValue > 0) {
                currentValue--;
            }
            
            // Update input value with animation
            targetInput.value = currentValue;
            targetInput.classList.add('input-changed');
            
            // Add button animation
            this.classList.add('btn-active');
            setTimeout(() => {
                this.classList.remove('btn-active');
                targetInput.classList.remove('input-changed');
            }, 300);
        });
    });
}

// Initialize particles.js
function initializeParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#ffffff"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    }
                },
                "opacity": {
                    "value": 0.5,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 2,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#ffffff",
                    "opacity": 0.2,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": true,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "repulse"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 100,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });
    }
}

// Generate floating particles in background
function generateBackgroundParticles() {
    const container = document.querySelector('.particles-container');
    
    // Only add if container exists and particles.js not loaded
    if (container && typeof particlesJS === 'undefined') {
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random position
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.top = Math.random() * 100 + 'vh';
            
            // Random size
            const size = Math.random() * 5 + 2;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            // Random opacity
            particle.style.opacity = Math.random() * 0.5 + 0.1;
            
            // Random animation delay
            particle.style.animationDelay = Math.random() * 40 + 's';
            particle.style.animationDuration = Math.random() * 40 + 20 + 's';
            
            container.appendChild(particle);
        }
    }
}

// Add button hover effects
function addButtonHoverEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.classList.add('btn-hover');
        });
        
        button.addEventListener('mouseleave', function() {
            this.classList.remove('btn-hover');
        });
        
        button.addEventListener('mousedown', function(event) {
            this.classList.add('btn-active');
            
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height) * 2;
            
            ripple.style.width = size + 'px';
            ripple.style.height = size + 'px';
            ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        button.addEventListener('mouseup', function() {
            this.classList.remove('btn-active');
        });
    });
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        animation: fadeIn 0.5s ease-in-out;
    }
    
    @keyframes fadeIn {
        0% { opacity: 0; }
        100% { opacity: 1; }
    }
    
    .shake-animation {
        animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    }
    
    @keyframes shake {
        10%, 90% { transform: translate3d(-1px, 0, 0); }
        20%, 80% { transform: translate3d(2px, 0, 0); }
        30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
        40%, 60% { transform: translate3d(4px, 0, 0); }
    }
    
    .error-shake {
        animation: errorShake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        border-color: #ff4d6d !important;
    }
    
    @keyframes errorShake {
        10%, 90% { transform: translate3d(-1px, 0, 0); }
        20%, 80% { transform: translate3d(2px, 0, 0); }
        30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
        40%, 60% { transform: translate3d(4px, 0, 0); }
    }
    
    .pulse-animation {
        animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1);
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.05); opacity: 0.9; }
    }
    
    .zoom-in {
        animation: zoomIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    @keyframes zoomIn {
        from { transform: scale(0.5); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }
    
    .input-changed {
        transition: all 0.3s ease;
        background-color: rgba(0, 238, 255, 0.1);
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        background-color: rgba(255, 255, 255, 0.7);
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .btn-hover {
        transform: translateY(-2px);
        transition: all 0.2s ease;
    }
    
    .btn-active {
        transform: translateY(1px);
        transition: all 0.1s ease;
    }
`;

document.head.appendChild(style);
