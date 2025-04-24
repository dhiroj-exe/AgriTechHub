
  // Main JavaScript file for AgriTech Hub
  
  // Initialize AOS animation
  document.addEventListener('DOMContentLoaded', function() {
      // Initialize AOS
      AOS.init({
          duration: 800,
          easing: 'ease-in-out',
          once: true
      });
      
      // Mobile menu toggle
      const mobileMenuButton = document.getElementById('mobile-menu-button');
      const mobileMenu = document.getElementById('mobile-menu');
      
      if (mobileMenuButton && mobileMenu) {
          mobileMenuButton.addEventListener('click', () => {
              mobileMenu.classList.toggle('hidden');
          });
      }
      
      // Navbar scroll effect
      const navbar = document.getElementById('navbar');
      
      if (navbar) {
          window.addEventListener('scroll', () => {
              if (window.scrollY > 50) {
                  navbar.classList.add('py-2', 'shadow-lg', 'bg-white/95', 'backdrop-blur-sm');
                  navbar.classList.remove('py-3');
              } else {
                  navbar.classList.add('py-3');
                  navbar.classList.remove('py-2', 'shadow-lg', 'bg-white/95', 'backdrop-blur-sm');
              }
          });
      }
      
      // Counter animation
      const counters = document.querySelectorAll('.counter');
      
      if (counters.length > 0) {
          const startCounters = () => {
              counters.forEach(counter => {
                  const target = parseInt(counter.getAttribute('data-target'));
                  const count = parseInt(counter.innerText);
                  const increment = target / 100;
                  
                  if (count < target) {
                      counter.innerText = Math.ceil(count + increment);
                      setTimeout(startCounters, 30);
                  } else {
                      counter.innerText = target.toLocaleString();
                  }
              });
          };
          
          // Start counters when they come into view
          const observerOptions = {
              threshold: 0.5
          };
          
          const observer = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                  if (entry.isIntersecting) {
                      startCounters();
                      observer.unobserve(entry.target);
                  }
              });
          }, observerOptions);
          
          observer.observe(counters[0].parentElement.parentElement);
      }
      
      // Page loader
      const loader = document.getElementById('loader');
      if (loader) {
          setTimeout(() => {
              loader.classList.add('loader-hidden');
          }, 1000);
      }
      
      // Smooth scrolling for anchor links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', function(e) {
              const targetId = this.getAttribute('href');
              if (targetId === '#') return;
              
              const targetElement = document.querySelector(targetId);
              if (targetElement) {
                  e.preventDefault();
                  targetElement.scrollIntoView({
                      behavior: 'smooth'
                  });
                  
                  // Close mobile menu if open
                  if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                      mobileMenu.classList.add('hidden');
                  }
              }
          });
      });
  });
  
  // Weather API functionality
  function getWeatherData(location = 'New Delhi') {
      const weatherWidget = document.querySelector('.weather-widget');
      if (!weatherWidget) return;
      
      // Using OpenWeatherMap API
      const apiKey = '5bc1a993dc91c4eaa0d6cae0fcf3f2d8';
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
      
      // Show loading state
      showWeatherLoading(true);
      
      fetch(url)
          .then(response => {
              if (!response.ok) {
                  throw new Error('Weather data not found for this location');
              }
              return response.json();
          })
          .then(data => {
              displayWeatherData(data);
              updateWeatherAlerts(data);
              showWeatherLoading(false);
          })
          .catch(error => {
              console.error('Error fetching weather data:', error);
              showNotification('Could not fetch weather data for this location. Please try another location.');
              showWeatherLoading(false);
          });
  }
  
  // Show loading state for weather widget
  function showWeatherLoading(isLoading) {
      const weatherWidget = document.querySelector('.weather-widget');
      if (!weatherWidget) return;
      
      if (isLoading) {
          weatherWidget.classList.add('opacity-50');
      } else {
          weatherWidget.classList.remove('opacity-50');
      }
  }
  
  // Update weather alerts based on current weather conditions
  function updateWeatherAlerts(data) {
      const alertsContainer = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.gap-6.max-w-4xl.mx-auto');
      if (!alertsContainer) return;
      
      // Clear current alerts
      alertsContainer.innerHTML = '';
      
      const alerts = [];
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      const validUntil = new Date(currentDate);
      validUntil.setDate(validUntil.getDate() + 3);
      const formattedValidUntil = validUntil.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      
      // Temperature alerts
      if (data.main.temp > 35) {
          alerts.push({
              type: 'warning',
              icon: 'fas fa-temperature-high',
              color: 'red',
              title: 'Extreme Heat Warning',
              message: 'Temperatures are extremely high. Ensure crops have adequate water and consider providing shade for sensitive plants.',
              date: formattedDate,
              validUntil: formattedValidUntil
          });
      } else if (data.main.temp > 30) {
          alerts.push({
              type: 'info',
              icon: 'fas fa-temperature-high',
              color: 'yellow',
              title: 'Heat Advisory',
              message: 'High temperatures expected. Increase irrigation frequency and monitor plants for heat stress.',
              date: formattedDate,
              validUntil: formattedValidUntil
          });
      } else if (data.main.temp < 5) {
          alerts.push({
              type: 'warning',
              icon: 'fas fa-temperature-low',
              color: 'blue',
              title: 'Frost Warning',
              message: 'Low temperatures may cause frost. Protect sensitive crops with covers or bring potted plants indoors.',
              date: formattedDate,
              validUntil: formattedValidUntil
          });
      }
      
      // Rain alerts
      if (data.weather[0].id >= 200 && data.weather[0].id < 300) {
          alerts.push({
              type: 'warning',
              icon: 'fas fa-bolt',
              color: 'yellow',
              title: 'Thunderstorm Alert',
              message: 'Thunderstorms expected. Secure loose items and be prepared for potential power outages.',
              date: formattedDate,
              validUntil: formattedValidUntil
          });
      } else if (data.weather[0].id >= 500 && data.weather[0].id < 600) {
          if (data.weather[0].id >= 502) { // Heavy rain
              alerts.push({
                  type: 'warning',
                  icon: 'fas fa-cloud-showers-heavy',
                  color: 'blue',
                  title: 'Heavy Rain Warning',
                  message: 'Heavy rainfall expected. Ensure proper drainage in your fields and consider postponing outdoor activities.',
                  date: formattedDate,
                  validUntil: formattedValidUntil
              });
          } else {
              alerts.push({
                  type: 'info',
                  icon: 'fas fa-cloud-rain',
                  color: 'blue',
                  title: 'Rainfall Advisory',
                  message: 'Rainfall expected. Good opportunity for natural irrigation, but monitor soil moisture levels.',
                  date: formattedDate,
                  validUntil: formattedValidUntil
              });
          }
      }
      
      // Wind alerts
      if (data.wind.speed > 10) {
          alerts.push({
              type: 'warning',
              icon: 'fas fa-wind',
              color: 'orange',
              title: 'Strong Wind Advisory',
              message: 'Strong winds expected. Secure young plants and structures. Consider wind breaks for vulnerable crops.',
              date: formattedDate,
              validUntil: formattedValidUntil
          });
      }
      
      // Humidity alerts
      if (data.main.humidity > 85) {
          alerts.push({
              type: 'info',
              icon: 'fas fa-tint',
              color: 'blue',
              title: 'High Humidity Alert',
              message: 'High humidity levels may increase risk of fungal diseases. Monitor plants and consider fungicide application if necessary.',
              date: formattedDate,
              validUntil: formattedValidUntil
          });
      } else if (data.main.humidity < 30) {
          alerts.push({
              type: 'info',
              icon: 'fas fa-tint-slash',
              color: 'orange',
              title: 'Low Humidity Alert',
              message: 'Low humidity may cause increased water loss in plants. Consider increasing irrigation frequency.',
              date: formattedDate,
              validUntil: formattedValidUntil
          });
      }
      
      // If no alerts, add a default message
      if (alerts.length === 0) {
          alerts.push({
              type: 'info',
              icon: 'fas fa-check-circle',
              color: 'green',
              title: 'Favorable Weather Conditions',
              message: 'Current weather conditions are favorable for most agricultural activities. No significant weather hazards detected.',
              date: formattedDate,
              validUntil: formattedValidUntil
          });
      }
      
      // Display alerts (limit to 2)
      alerts.slice(0, 2).forEach(alert => {
          const alertElement = document.createElement('div');
          alertElement.className = `bg-${alert.color}-50 border-l-4 border-${alert.color}-500 p-5 rounded-r-lg`;
          alertElement.setAttribute('data-aos', 'fade-up');
          alertElement.setAttribute('data-aos-delay', '100');
          
          alertElement.innerHTML = `
              <div class="flex items-center mb-2">
                  <i class="${alert.icon} text-${alert.color}-500 mr-2"></i>
                  <h3 class="text-lg font-bold text-gray-800">${alert.title}</h3>
              </div>
              <p class="text-gray-700">${alert.message}</p>
              <p class="text-sm text-gray-500 mt-2">Issued: ${alert.date} | Valid until: ${alert.validUntil}</p>
          `;
          
          alertsContainer.appendChild(alertElement);
      });
  }
  
  
  function displayWeatherData(data) {
      const currentTemp = document.getElementById('current-temp');
      const weatherCondition = document.getElementById('weather-condition');
      const location = document.getElementById('weather-location');
      const windSpeed = document.getElementById('wind-speed');
      const humidity = document.getElementById('humidity');
      const lastUpdated = document.getElementById('last-updated');
      
      if (currentTemp) currentTemp.textContent = `${Math.round(data.main.temp)}°C`;
      if (weatherCondition) weatherCondition.textContent = data.weather[0].main;
      if (location) location.textContent = `${data.name}, ${data.sys.country}`;
      if (windSpeed) windSpeed.innerHTML = `<i class="fas fa-wind mr-2"></i><span>Wind: ${data.wind.speed} km/h</span>`;
      if (humidity) humidity.innerHTML = `<i class="fas fa-tint mr-2"></i><span>Humidity: ${data.main.humidity}%</span>`;
      if (lastUpdated) lastUpdated.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
      
      // Update weather icon based on weather condition
      const weatherIcon = document.querySelector('.weather-widget .text-8xl');
      if (weatherIcon) {
          const iconClass = getWeatherIconClass(data.weather[0].id);
          weatherIcon.className = `${iconClass} text-8xl mb-4 pulse`;
      }
      
      // Update crop-specific weather impact
      updateCropImpact(data);
      
      // After displaying current weather, fetch and display forecast
      getForecastData(data.name);
  }
  
  // Update crop-specific weather impact based on current weather
  function updateCropImpact(data) {
      const cropImpactContainer = document.getElementById('crop-impact-container');
      if (!cropImpactContainer) return;
      
      // Define common crops and their weather sensitivities
      const crops = [
          {
              name: 'Rice',
              image: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
              tempRange: { min: 20, optimal: 25, max: 35 },
              rainSensitivity: 'high',
              humiditySensitivity: 'high',
              windSensitivity: 'medium'
          },
          {
              name: 'Wheat',
              image: 'https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
              tempRange: { min: 15, optimal: 20, max: 30 },
              rainSensitivity: 'medium',
              humiditySensitivity: 'medium',
              windSensitivity: 'high'
          },
          {
              name: 'Tomatoes',
              image: 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
              tempRange: { min: 18, optimal: 24, max: 32 },
              rainSensitivity: 'medium',
              humiditySensitivity: 'high',
              windSensitivity: 'low'
          }
      ];
      
      // Clear current content
      cropImpactContainer.innerHTML = '';
      
      // Generate impact analysis for each crop
      crops.forEach((crop, index) => {
          const recommendations = [];
          const currentTemp = data.main.temp;
          const weatherCondition = data.weather[0].main.toLowerCase();
          const humidity = data.main.humidity;
          const windSpeed = data.wind.speed;
          
          // Temperature analysis
          if (currentTemp < crop.tempRange.min) {
              recommendations.push(`Temperature is below optimal range. Consider protective measures.`);
          } else if (currentTemp > crop.tempRange.max) {
              recommendations.push(`Temperature is above optimal range. Increase irrigation frequency.`);
          } else if (Math.abs(currentTemp - crop.tempRange.optimal) < 3) {
              recommendations.push(`Temperature is in the optimal range for ${crop.name} growth.`);
          }
          
          // Rain/weather condition analysis
          if (weatherCondition.includes('rain') || weatherCondition.includes('drizzle')) {
              if (crop.rainSensitivity === 'high') {
                  recommendations.push(`Current rainfall may affect ${crop.name}. Ensure proper drainage.`);
              } else if (crop.rainSensitivity === 'medium') {
                  recommendations.push(`Moderate rainfall is generally beneficial for ${crop.name}.`);
              }
          } else if (weatherCondition.includes('clear') || weatherCondition.includes('sun')) {
              recommendations.push(`Clear conditions are good for photosynthesis. Ensure adequate irrigation.`);
          } else if (weatherCondition.includes('cloud')) {
              recommendations.push(`Cloudy conditions may reduce photosynthesis rate slightly.`);
          } else if (weatherCondition.includes('storm') || weatherCondition.includes('thunder')) {
              recommendations.push(`Stormy conditions may damage plants. Consider protective measures.`);
          }
          
          // Humidity analysis
          if (humidity > 80 && crop.humiditySensitivity === 'high') {
              recommendations.push(`High humidity may increase disease risk. Monitor for fungal infections.`);
          } else if (humidity < 40 && crop.humiditySensitivity !== 'low') {
              recommendations.push(`Low humidity may cause water stress. Consider increasing irrigation.`);
          }
          
          // Wind analysis
          if (windSpeed > 8 && crop.windSensitivity === 'high') {
              recommendations.push(`Strong winds may damage plants. Consider wind breaks or supports.`);
          }
          
          // If no specific recommendations, add a general one
          if (recommendations.length === 0) {
              recommendations.push(`Current weather conditions are generally favorable for ${crop.name}.`);
          }
          
          // Create crop impact card
          const cropCard = document.createElement('div');
          cropCard.className = 'bg-white p-6 rounded-xl shadow-md';
          cropCard.setAttribute('data-aos', 'fade-up');
          cropCard.setAttribute('data-aos-delay', (index + 1) * 100);
          
          cropCard.innerHTML = `
              <div class="flex items-center mb-4">
                  <img src="${crop.image}" alt="${crop.name}" class="w-12 h-12 rounded-full object-cover mr-3">
                  <h3 class="text-xl font-bold text-gray-800">${crop.name}</h3>
              </div>
              <p class="text-gray-700 mb-4">${recommendations[0]}</p>
              ${recommendations.length > 1 ? `<p class="text-gray-700 mb-4">${recommendations[1]}</p>` : ''}
              <div class="flex items-center text-sm text-gray-500">
                  <i class="fas fa-thermometer-half mr-2"></i>
                  <span>Optimal temp: ${crop.tempRange.optimal}°C (Current: ${Math.round(currentTemp)}°C)</span>
              </div>
          `;
          
          cropImpactContainer.appendChild(cropCard);
      });
  }
  
  // Get 5-day forecast data
  function getForecastData(location) {
      const apiKey = '5bc1a993dc91c4eaa0d6cae0fcf3f2d8';
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;
      
      fetch(url)
          .then(response => {
              if (!response.ok) {
                  throw new Error('Forecast data not found');
              }
              return response.json();
          })
          .then(data => {
              displayForecastData(data);
          })
          .catch(error => {
              console.error('Error fetching forecast data:', error);
          });
  }
  
  // Display 5-day forecast
  function displayForecastData(data) {
      const forecastContainer = document.querySelector('.weather-widget .grid');
      if (!forecastContainer) return;
      
      // Clear current forecast
      forecastContainer.innerHTML = '';
      
      // Get one forecast per day (data is in 3-hour intervals)
      const dailyForecasts = [];
      const today = new Date().setHours(0, 0, 0, 0);
      
      // Group forecasts by day
      data.list.forEach(forecast => {
          const forecastDate = new Date(forecast.dt * 1000).setHours(0, 0, 0, 0);
          
          // Skip today's forecast
          if (forecastDate === today) return;
          
          // Check if we already have a forecast for this day
          const existingForecast = dailyForecasts.find(df => {
              return new Date(df.dt * 1000).setHours(0, 0, 0, 0) === forecastDate;
          });
          
          if (!existingForecast && dailyForecasts.length < 5) {
              dailyForecasts.push(forecast);
          }
      });
      
      // Create forecast elements
      dailyForecasts.forEach(forecast => {
          const date = new Date(forecast.dt * 1000);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
          const iconClass = getWeatherIconClass(forecast.weather[0].id);
          
          const forecastElement = document.createElement('div');
          forecastElement.className = 'p-3 bg-white bg-opacity-20 rounded-lg';
          forecastElement.innerHTML = `
              <div class="text-sm">${dayName}</div>
              <i class="${iconClass} text-2xl my-2"></i>
              <div class="text-lg font-bold">${Math.round(forecast.main.temp)}°C</div>
          `;
          
          forecastContainer.appendChild(forecastElement);
      });
  }
  
  // Get appropriate weather icon class based on weather condition ID
  function getWeatherIconClass(weatherId) {
      // Weather condition codes: https://openweathermap.org/weather-conditions
      if (weatherId >= 200 && weatherId < 300) {
          return 'fas fa-bolt'; // Thunderstorm
      } else if (weatherId >= 300 && weatherId < 400) {
          return 'fas fa-cloud-rain'; // Drizzle
      } else if (weatherId >= 500 && weatherId < 600) {
          return 'fas fa-cloud-showers-heavy'; // Rain
      } else if (weatherId >= 600 && weatherId < 700) {
          return 'fas fa-snowflake'; // Snow
      } else if (weatherId >= 700 && weatherId < 800) {
          return 'fas fa-smog'; // Atmosphere (fog, mist, etc.)
      } else if (weatherId === 800) {
          return 'fas fa-sun'; // Clear sky
      } else if (weatherId > 800) {
          return 'fas fa-cloud-sun'; // Clouds
      }
      return 'fas fa-cloud'; // Default
  }
  
  // Marketplace functionality
  function addToCart(productId, productName, price) {
      // Get existing cart or initialize new one
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      
      // Check if product already in cart
      const existingProduct = cart.find(item => item.id === productId);
      
      if (existingProduct) {
          existingProduct.quantity += 1;
      } else {
          cart.push({
              id: productId,
              name: productName,
              price: price,
              quantity: 1
          });
      }
      
      // Save updated cart
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Update cart count
      updateCartCount();
      
      // Show notification
      showNotification(`${productName} added to cart!`);
  }
  
  function updateCartCount() {
      const cartCountElement = document.getElementById('cart-count');
      const mobileCartCountElement = document.getElementById('mobile-cart-count');
      
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
      
      // Update desktop cart count
      if (cartCountElement) {
          cartCountElement.textContent = itemCount;
          
          if (itemCount > 0) {
              cartCountElement.classList.remove('hidden');
          } else {
              cartCountElement.classList.add('hidden');
          }
      }
      
      // Update mobile cart count
      if (mobileCartCountElement) {
          mobileCartCountElement.textContent = itemCount;
          
          if (itemCount > 0) {
              mobileCartCountElement.classList.remove('hidden');
          } else {
              mobileCartCountElement.classList.add('hidden');
          }
      }
  }
  
  function showNotification(message, type = 'success') {
      const notification = document.createElement('div');
      notification.className = `fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 transform transition-transform duration-300 translate-y-20 ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`;
      notification.textContent = message;
      
      document.body.appendChild(notification);
      
      // Animate in
      setTimeout(() => {
          notification.classList.remove('translate-y-20');
      }, 10);
      
      // Remove after 3 seconds
      setTimeout(() => {
          notification.classList.add('translate-y-20');
          setTimeout(() => {
              document.body.removeChild(notification);
          }, 300);
      }, 3000);
  }
  
  // Crop management functionality
  function addCrop() {
      const cropForm = document.getElementById('add-crop-form');
      if (!cropForm) return;
      
      cropForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          const cropName = document.getElementById('crop-name').value;
          const cropType = document.getElementById('crop-type').value;
          const plantingDate = document.getElementById('planting-date').value;
          const expectedHarvest = document.getElementById('expected-harvest').value;
          const cropImage = document.getElementById('crop-image').files[0];
          
          // In a real application, you would upload the image to a server
          // For demo purposes, we'll use a placeholder image
          
          // Create crop object
          const crop = {
              id: Date.now(),
              name: cropName,
              type: cropType,
              plantingDate: plantingDate,
              expectedHarvest: expectedHarvest,
              progress: 0,
              image: 'https://images.unsplash.com/photo-1601599561213-832382fd07ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
          };
          
          // Get existing crops or initialize new array
          let crops = JSON.parse(localStorage.getItem('crops')) || [];
          
          // Add new crop
          crops.push(crop);
          
          // Save updated crops
          localStorage.setItem('crops', JSON.stringify(crops));
          
          // Show notification
          showNotification(`${cropName} added successfully!`);
          
          // Reset form
          cropForm.reset();
          
          // Refresh crop list
          displayCrops();
      });
  }
  
  function displayCrops() {
      const cropList = document.getElementById('crop-list');
      if (!cropList) return;
      
      // Get crops from localStorage
      const crops = JSON.parse(localStorage.getItem('crops')) || [];
      
      // Clear current list
      cropList.innerHTML = '';
      
      if (crops.length === 0) {
          cropList.innerHTML = '<p class="text-center text-gray-500 py-8">No crops added yet. Add your first crop above!</p>';
          return;
      }
      
      // Add each crop to the list
      crops.forEach(crop => {
          const cropElement = document.createElement('div');
          cropElement.className = 'crop-card bg-white rounded-xl overflow-hidden shadow-md';
          cropElement.setAttribute('data-aos', 'fade-up');
          
          // Calculate days since planting
          const plantingDate = new Date(crop.plantingDate);
          const today = new Date();
          const daysSincePlanting = Math.floor((today - plantingDate) / (1000 * 60 * 60 * 24));
          
          // Calculate progress percentage
          const harvestDate = new Date(crop.expectedHarvest);
          const totalDays = Math.floor((harvestDate - plantingDate) / (1000 * 60 * 60 * 24));
          const progress = Math.min(Math.round((daysSincePlanting / totalDays) * 100), 100);
          
          // Calculate days until harvest
          const daysUntilHarvest = Math.max(0, Math.floor((harvestDate - today) / (1000 * 60 * 60 * 24)));
          
          // Determine current stage
          let stage = 'Seedling';
          if (progress > 75) {
              stage = 'Maturation';
          } else if (progress > 50) {
              stage = 'Flowering';
          } else if (progress > 25) {
              stage = 'Vegetative';
          }
          
          cropElement.innerHTML = `
              <div class="h-48 overflow-hidden">
                  <img src="${crop.image}" alt="${crop.name}" class="w-full h-full object-cover">
              </div>
              <div class="p-6">
                  <h3 class="text-xl font-bold text-gray-800 mb-2">${crop.name}</h3>
                  <div class="flex items-center mb-4">
                      <div class="w-full bg-gray-200 rounded-full h-2.5">
                          <div class="bg-green-600 h-2.5 rounded-full" style="width: ${progress}%"></div>
                      </div>
                      <span class="ml-2 text-sm text-gray-600">${progress}%</span>
                  </div>
                  <p class="text-gray-600 mb-4">Current stage: ${stage}. Estimated harvest in ${daysUntilHarvest} days.</p>
                  <div class="flex justify-between">
                      <a href="#" class="text-green-600 hover:text-green-700 font-medium inline-flex items-center">
                          View details <i class="fas fa-arrow-right ml-2"></i>
                      </a>
                      <button onclick="deleteCrop(${crop.id})" class="text-red-500 hover:text-red-700">
                          <i class="fas fa-trash"></i>
                      </button>
                  </div>
              </div>
          `;
          
          cropList.appendChild(cropElement);
      });
  }
  
  function deleteCrop(cropId) {
      // Get crops from localStorage
      let crops = JSON.parse(localStorage.getItem('crops')) || [];
      
      // Find crop to delete
      const cropToDelete = crops.find(crop => crop.id === cropId);
      if (!cropToDelete) return;
      
      // Filter out the crop to delete
      crops = crops.filter(crop => crop.id !== cropId);
      
      // Save updated crops
      localStorage.setItem('crops', JSON.stringify(crops));
      
      // Show notification
      showNotification(`${cropToDelete.name} deleted successfully!`);
      
      // Refresh crop list
      displayCrops();
  }
  
  // Google Maps initialization
  function initMap() {
      // Check if map element exists
      const mapElement = document.getElementById('map');
      if (!mapElement) return;
      
      // Coordinates for New Delhi, India
      const officeLocation = { lat: 28.6139, lng: 77.2090 };
      
      // Create map centered at office location
      const map = new google.maps.Map(mapElement, {
          center: officeLocation,
          zoom: 15,
          styles: [
              {
                  "featureType": "administrative",
                  "elementType": "labels.text.fill",
                  "stylers": [{"color": "#444444"}]
              },
              {
                  "featureType": "landscape",
                  "elementType": "all",
                  "stylers": [{"color": "#f2f2f2"}]
              },
              {
                  "featureType": "poi",
                  "elementType": "all",
                  "stylers": [{"visibility": "off"}]
              },
              {
                  "featureType": "road",
                  "elementType": "all",
                  "stylers": [{"saturation": -100}, {"lightness": 45}]
              },
              {
                  "featureType": "road.highway",
                  "elementType": "all",
                  "stylers": [{"visibility": "simplified"}]
              },
              {
                  "featureType": "road.arterial",
                  "elementType": "labels.icon",
                  "stylers": [{"visibility": "off"}]
              },
              {
                  "featureType": "transit",
                  "elementType": "all",
                  "stylers": [{"visibility": "off"}]
              },
              {
                  "featureType": "water",
                  "elementType": "all",
                  "stylers": [{"color": "#c4e5f3"}, {"visibility": "on"}]
              }
          ]
      });
      
      // Add marker for office location
      const marker = new google.maps.Marker({
          position: officeLocation,
          map: map,
          title: 'AgriTech Hub Office',
          animation: google.maps.Animation.DROP,
          icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#4ade80',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2
          }
      });
      
      // Add info window
      const infoWindow = new google.maps.InfoWindow({
          content: `
              <div class="p-2">
                  <h3 class="font-bold text-gray-800">AgriTech Hub Headquarters</h3>
                  <p class="text-gray-600">123 Farming Road, Agri Valley</p>
                  <p class="text-gray-600">New Delhi, 110001</p>
              </div>
          `
      });
      
      // Open info window when marker is clicked
      marker.addListener('click', () => {
          infoWindow.open(map, marker);
      });
      
      // Open info window by default
      infoWindow.open(map, marker);
  }

  // Initialize functionality based on current page
  document.addEventListener('DOMContentLoaded', function() {
      // Initialize cart count
      updateCartCount();
      
      // Initialize weather if on weather page
      if (document.querySelector('.weather-widget')) {
          getWeatherData();
          
          // Add event listener for search button
          const searchButton = document.getElementById('search-weather-btn');
          const locationInput = document.getElementById('location-search');
          
          if (searchButton && locationInput) {
              searchButton.addEventListener('click', function() {
                  const location = locationInput.value.trim();
                  if (location) {
                      getWeatherData(location);
                  } else {
                      showNotification('Please enter a location');
                  }
              });
              
              // Also allow pressing Enter to search
              locationInput.addEventListener('keypress', function(e) {
                  if (e.key === 'Enter') {
                      const location = locationInput.value.trim();
                      if (location) {
                          getWeatherData(location);
                      } else {
                          showNotification('Please enter a location');
                      }
                  }
              });
          }
      }
      
      // Initialize crop management if on crops page
      if (document.getElementById('add-crop-form')) {
          addCrop();
          displayCrops();
      }
      
      // Initialize map if on contact page
      if (document.getElementById('map')) {
          // Load Google Maps API
          if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
              const script = document.createElement('script');
              script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&callback=initMap';
              script.async = true;
              script.defer = true;
              document.head.appendChild(script);
          } else {
              initMap();
          }
      }
  });