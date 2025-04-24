
  /**
  * FarmAssist AI - Intelligent Chatbot for Farmers
  * This script handles the chatbot functionality, keyword detection, and responses
  */
  
  document.addEventListener('DOMContentLoaded', function() {
     console.log("FarmAssist AI script loaded");
     
     // Elements
     const chatMessages = document.getElementById('chat-messages');
     const userInput = document.getElementById('user-input');
     const sendButton = document.getElementById('send-button');
     const voiceButton = document.getElementById('voice-input-button');
     
     // Debug element existence
     console.log("Chat messages element:", chatMessages);
     console.log("User input element:", userInput);
     console.log("Send button element:", sendButton);
     console.log("Voice button element:", voiceButton);
     
     // Keywords and responses database
     const keywordResponses = {
         // Crop diseases
         'blight': {
             response: "Blight is a common disease affecting crops like potatoes and tomatoes. Signs include brown spots on leaves that quickly spread. To treat: 1) Remove infected plants, 2) Apply copper-based fungicide, 3) Ensure proper spacing for air circulation, 4) Water at the base to keep foliage dry.",
             category: "disease"
         },
         'rust': {
             response: "Rust is a fungal disease appearing as orange-brown spots on leaves. For treatment: 1) Remove infected parts, 2) Apply fungicide specifically labeled for rust, 3) Improve air circulation, 4) Avoid overhead watering.",
             category: "disease"
         },
         'powdery mildew': {
             response: "Powdery mildew appears as white powdery spots on leaves and stems. To manage: 1) Apply neem oil or potassium bicarbonate spray, 2) Ensure good air circulation, 3) Plant resistant varieties, 4) Remove severely infected plants.",
             category: "disease"
         },
         'leaf spot': {
             response: "Leaf spot diseases cause circular spots on leaves, often with yellow halos. Control methods: 1) Remove infected leaves, 2) Apply appropriate fungicide, 3) Avoid overhead watering, 4) Ensure proper plant spacing.",
             category: "disease"
         },
         'disease': {
             response: "Common crop diseases include fungal (powdery mildew, rusts), bacterial (bacterial spot, soft rot), and viral (mosaic viruses) diseases. Prevention is key: 1) Use disease-resistant varieties, 2) Practice crop rotation, 3) Maintain proper spacing, 4) Apply appropriate fungicides when necessary.",
             category: "disease"
         },
         
         // Weather related
         'weather': {
             response: "For accurate weather forecasts specific to your farm, I recommend checking local meteorological services. Generally, the current season outlook shows [seasonal forecast]. Would you like me to provide information about weather-smart farming practices?",
             category: "weather"
         },
         'rain': {
             response: "Rainfall management is crucial for successful farming. Consider: 1) Installing rainwater harvesting systems, 2) Creating proper drainage channels, 3) Using mulch to prevent soil erosion, 4) Planting cover crops during heavy rainfall seasons.",
             category: "weather"
         },
         'drought': {
             response: "During drought conditions: 1) Implement drip irrigation to conserve water, 2) Apply mulch to retain soil moisture, 3) Choose drought-resistant crop varieties, 4) Consider rainwater harvesting for future use, 5) Practice conservation tillage.",
             category: "weather"
         },
         'forecast': {
             response: "Weather forecasting helps you plan farming activities. Consider: 1) Check 7-day forecasts regularly, 2) Install a weather station on your farm for local data, 3) Use weather apps with agricultural features, 4) Plan irrigation based on rainfall predictions.",
             category: "weather"
         },
         
         // Fertilizers
         'fertilizer': {
             response: "Choosing the right fertilizer depends on your crop and soil needs. Generally: 1) Conduct soil tests before application, 2) Use NPK fertilizers based on specific crop requirements, 3) Consider slow-release options for long-term feeding, 4) Complement with organic matter for soil health.",
             category: "fertilizer"
         },
         'organic fertilizer': {
             response: "Organic fertilizers include: 1) Compost - balanced nutrients and improves soil structure, 2) Manure - high in nitrogen but should be composted first, 3) Bone meal - excellent phosphorus source, 4) Seaweed - contains trace minerals and growth hormones.",
             category: "fertilizer"
         },
         'npk': {
             response: "NPK stands for Nitrogen (N), Phosphorus (P), and Potassium (K): 1) Nitrogen promotes leaf growth, 2) Phosphorus develops roots, flowers, and fruits, 3) Potassium improves overall plant health and disease resistance. The numbers on fertilizer packages (e.g., 10-10-10) represent the percentage of each nutrient.",
             category: "fertilizer"
         },
         'nutrient': {
             response: "Essential plant nutrients include: 1) Macronutrients: Nitrogen (N), Phosphorus (P), Potassium (K), Calcium (Ca), Magnesium (Mg), Sulfur (S), 2) Micronutrients: Iron (Fe), Manganese (Mn), Zinc (Zn), Copper (Cu), Boron (B), Molybdenum (Mo). Deficiencies show as specific leaf discolorations or growth problems.",
             category: "fertilizer"
         },
         
         // Pests
         'pest': {
             response: "Integrated Pest Management (IPM) is the most effective approach: 1) Identify the specific pest, 2) Use biological controls like beneficial insects, 3) Apply targeted treatments rather than broad-spectrum pesticides, 4) Practice crop rotation and companion planting, 5) Use physical barriers when appropriate.",
             category: "pest"
         },
         'aphid': {
             response: "To control aphids naturally: 1) Introduce ladybugs or lacewings as predators, 2) Spray plants with strong water jets to dislodge them, 3) Apply insecticidal soap or neem oil, 4) Plant companion plants like marigolds or nasturtiums to repel them.",
             category: "pest"
         },
         'caterpillar': {
             response: "For caterpillar control: 1) Handpick them from plants when population is small, 2) Apply Bacillus thuringiensis (Bt), a natural bacteria that targets caterpillars, 3) Encourage natural predators like birds, 4) Use row covers during peak butterfly seasons.",
             category: "pest"
         },
         'insect': {
             response: "For sustainable insect management: 1) Identify the specific insect before treatment, 2) Use companion planting to repel pests or attract beneficial insects, 3) Apply organic insecticides like neem oil or insecticidal soap, 4) Implement crop rotation to break pest cycles.",
             category: "pest"
         },
         
         // Soil management
         'soil': {
             response: "Healthy soil is the foundation of successful farming. Key practices: 1) Regular soil testing for pH and nutrients, 2) Adding organic matter through compost or cover crops, 3) Practicing crop rotation to prevent nutrient depletion, 4) Minimizing tillage to preserve soil structure, 5) Using appropriate amendments based on test results.",
             category: "soil"
         },
         'ph': {
             response: "Soil pH affects nutrient availability to plants. Most crops prefer a pH between 6.0-7.0. To adjust: 1) Add lime to raise pH (make soil less acidic), 2) Add sulfur to lower pH (make soil more acidic), 3) Always test before amending, 4) Make gradual changes over time rather than all at once.",
             category: "soil"
         },
         'compost': {
             response: "Making quality compost: 1) Balance green materials (nitrogen-rich like fresh grass) with brown materials (carbon-rich like dried leaves), 2) Keep pile moist but not soggy, 3) Turn regularly for aeration, 4) Compost is ready when it's dark, crumbly, and earthy-smelling, usually in 3-6 months.",
             category: "soil"
         },
         'organic matter': {
             response: "Increasing soil organic matter: 1) Apply compost regularly, 2) Use cover crops and green manures, 3) Practice minimal tillage to prevent organic matter breakdown, 4) Mulch with organic materials, 5) Rotate crops to include those that contribute more residue.",
             category: "soil"
         },
         
         // Irrigation
         'irrigation': {
             response: "Efficient irrigation methods: 1) Drip irrigation - delivers water directly to plant roots with minimal waste, 2) Sprinkler systems - good for larger areas but less water-efficient, 3) Flood irrigation - traditional but uses more water, 4) Smart irrigation with soil moisture sensors can reduce water usage by 30-50%.",
             category: "irrigation"
         },
         'water': {
             response: "Water management tips: 1) Water deeply but infrequently to encourage deep root growth, 2) Water early morning to reduce evaporation, 3) Use mulch to retain soil moisture, 4) Consider rainwater harvesting, 5) Monitor soil moisture rather than following a fixed schedule.",
             category: "irrigation"
         },
         'drip': {
             response: "Drip irrigation benefits: 1) Water efficiency - reduces usage by up to 60%, 2) Targeted application directly to roots, 3) Reduces weed growth by not watering between rows, 4) Decreases fungal diseases by keeping foliage dry, 5) Can be automated with timers for convenience.",
             category: "irrigation"
         },
         'sprinkler': {
             response: "Sprinkler irrigation considerations: 1) Best for larger areas and certain crops like lawns and grains, 2) Water early morning to minimize evaporation, 3) Check for even distribution and avoid windy conditions, 4) Maintain proper pressure for optimal droplet size, 5) Consider impact on disease development from wet foliage.",
             category: "irrigation"
         },
         
         // Market information
         'market': {
             response: "To get better market prices: 1) Consider direct-to-consumer selling through farmers markets or CSAs, 2) Form or join farmer cooperatives for better bargaining power, 3) Look into value-added products from your crops, 4) Use online platforms to reach more customers, 5) Store crops when prices are low if you have proper storage facilities.",
             category: "market"
         },
         'price': {
             response: "Crop prices fluctuate based on supply and demand. To stay informed: 1) Subscribe to agricultural price information services, 2) Join farmer networks or WhatsApp groups sharing market information, 3) Develop relationships with multiple buyers, 4) Consider futures contracts for price stability.",
             category: "market"
         },
         'sell': {
             response: "Selling strategies for farmers: 1) Grade and sort your produce for premium pricing, 2) Build a reputation for quality and reliability, 3) Consider organic or other certifications for higher prices, 4) Explore export markets if you have sufficient volume, 5) Develop a brand identity for your farm products.",
             category: "market"
         },
         'marketing': {
             response: "Farm marketing strategies: 1) Create a compelling story about your farm and practices, 2) Use social media to showcase your products and farming methods, 3) Develop a simple website with product information, 4) Participate in local food events and farmers markets, 5) Consider agritourism if appropriate for your farm.",
             category: "market"
         },
         
         // Crop specific
         'wheat': {
             response: "Wheat growing tips: 1) Plant in well-drained soil with pH 6.0-7.0, 2) Apply nitrogen fertilizer in split applications, 3) Control weeds early in the growing season, 4) Monitor for rust and fusarium head blight, 5) Harvest when grain moisture is between 13-14% for storage.",
             category: "crop"
         },
         'rice': {
             response: "Rice cultivation practices: 1) Prepare level fields for proper water management, 2) Maintain 2-5 cm water depth during vegetative stage, 3) Practice alternate wetting and drying to save water, 4) Monitor for stem borers and blast disease, 5) Drain fields 2-3 weeks before harvest.",
             category: "crop"
         },
         'tomato': {
             response: "Tomato growing guide: 1) Plant in full sun with well-drained soil, 2) Stake or cage plants for support, 3) Water consistently to prevent blossom end rot, 4) Prune suckers for indeterminate varieties, 5) Monitor for early blight and hornworms, 6) Harvest when fruits are firm and fully colored.",
             category: "crop"
         },
         'potato': {
             response: "Potato cultivation tips: 1) Plant seed potatoes in trenches 4-6 inches deep, 2) Hill soil around plants as they grow, 3) Ensure consistent moisture, especially during tuber formation, 4) Watch for Colorado potato beetles and late blight, 5) Harvest after vines die back for storage potatoes.",
             category: "crop"
         },
         'corn': {
             response: "Corn growing essentials: 1) Plant in blocks rather than single rows for better pollination, 2) Ensure soil temperature is at least 60°F (16°C) at planting, 3) Apply nitrogen fertilizer when plants are knee-high, 4) Maintain consistent moisture during silking and tasseling, 5) Control corn earworms and borers as needed.",
             category: "crop"
         },
         'soybean': {
             response: "Soybean cultivation tips: 1) Inoculate seeds with rhizobium bacteria for nitrogen fixation if planting in new fields, 2) Plant when soil temperatures reach 55-60°F (13-16°C), 3) Maintain proper pH between 6.0-6.8, 4) Scout regularly for soybean cyst nematode and aphids, 5) Harvest when pods are brown and seeds rattle in the pods.",
             category: "crop"
         },
         
         // Organic farming
         'organic': {
             response: "Organic farming principles: 1) Build soil health through compost and cover crops, 2) Use biological pest control methods, 3) Implement crop rotation and diversity, 4) Use only approved organic inputs, 5) Maintain buffer zones from conventional farms, 6) Keep detailed records for certification.",
             category: "organic"
         },
         'natural': {
             response: "Natural farming approaches: 1) Minimize external inputs, 2) Work with natural ecological processes, 3) Use locally available resources, 4) Integrate livestock and crops when possible, 5) Observe and learn from natural ecosystems, 6) Practice minimal soil disturbance.",
             category: "organic"
         },
         
         // Climate-smart agriculture
         'climate': {
             response: "Climate-smart agriculture practices: 1) Use drought-resistant crop varieties, 2) Implement water conservation techniques, 3) Practice agroforestry to increase carbon sequestration, 4) Use renewable energy sources for farm operations, 5) Minimize soil disturbance to reduce carbon loss, 6) Diversify crops for resilience.",
             category: "climate"
         },
         'sustainable': {
             response: "Sustainable farming approaches: 1) Minimize synthetic inputs, 2) Conserve water through efficient irrigation, 3) Maintain biodiversity on and around the farm, 4) Reduce fossil fuel usage, 5) Implement integrated pest management, 6) Build soil organic matter for long-term productivity.",
             category: "climate"
         }
     };
     
     // Add message to chat
     function addMessage(message, isUser = false) {
         const messageDiv = document.createElement('div');
         messageDiv.className = `message flex mb-4 ${isUser ? 'justify-end' : ''}`;
         
         if (isUser) {
             messageDiv.innerHTML = `
                 <div class="bg-green-500 text-white rounded-lg p-3 max-w-[80%]">
                     <p>${message}</p>
                 </div>
                 <div class="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center ml-3 flex-shrink-0">
                     <i class="fas fa-user text-white"></i>
                 </div>
             `;
         } else {
             messageDiv.innerHTML = `
                 <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                     <i class="fas fa-robot text-green-500"></i>
                 </div>
                 <div class="bg-green-100 rounded-lg p-3 max-w-[80%]">
                     <p class="text-gray-800">${message}</p>
                 </div>
             `;
         }
         
         chatMessages.appendChild(messageDiv);
         chatMessages.scrollTop = chatMessages.scrollHeight;
         
         // Apply animation with delay
         setTimeout(() => {
             messageDiv.classList.add('show');
         }, 100);
     }
     
     // Show typing indicator
     function showTypingIndicator() {
         const typingDiv = document.createElement('div');
         typingDiv.className = 'message flex mb-4 typing-message';
         typingDiv.innerHTML = `
             <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                 <i class="fas fa-robot text-green-500"></i>
             </div>
             <div class="bg-green-100 rounded-lg p-3 px-4">
                 <div class="typing-indicator">
                     <div class="typing-dot"></div>
                     <div class="typing-dot"></div>
                     <div class="typing-dot"></div>
                 </div>
             </div>
         `;
         
         chatMessages.appendChild(typingDiv);
         chatMessages.scrollTop = chatMessages.scrollHeight;
         return typingDiv;
     }
     
     // Process user message and generate response
     function processMessage(userMessage) {
         // Convert to lowercase for matching
         const messageLower = userMessage.toLowerCase();
         
         // Show typing indicator
         const typingIndicator = showTypingIndicator();
         
         // Simulate processing delay
         setTimeout(() => {
             // Remove typing indicator
             chatMessages.removeChild(typingIndicator);
             
             // Check for keyword matches
             let matchFound = false;
             let response = "";
             let category = "";
             
             // Check for specific crop disease questions
             if (messageLower.includes('disease') && 
                 (messageLower.includes('tomato') || 
                  messageLower.includes('potato') || 
                  messageLower.includes('wheat') || 
                  messageLower.includes('rice') || 
                  messageLower.includes('corn'))) {
                 
                 matchFound = true;
                 category = "disease";
                 response = "<i class='fas fa-disease text-red-500 mr-2'></i> Common diseases for ";
                 
                 // Determine which crop
                 if (messageLower.includes('tomato')) {
                     response   = "tomatoes include:";
                     response   = `<ul class="list-disc ml-5 mt-2">
                         <li>Early Blight - Dark brown spots with concentric rings, apply copper fungicide</li>
                         <li>Late Blight - Dark water-soaked spots, remove infected plants immediately</li>
                         <li>Septoria Leaf Spot - Small dark spots with light centers, apply fungicide</li>
                         <li>Fusarium Wilt - Yellowing and wilting leaves, use resistant varieties</li>
                     </ul>`;
                 } else if (messageLower.includes('potato')) {
                     response   = "potatoes include:";
                     response   = `<ul class="list-disc ml-5 mt-2">
                         <li>Late Blight - Dark water-soaked spots, can destroy crop in days</li>
                         <li>Early Blight - Dark brown concentric rings on lower leaves</li>
                         <li>Black Leg - Stem rot at soil level, plant certified seed potatoes</li>
                         <li>Scab - Rough, corky patches on tubers, maintain soil pH below 5.5</li>
                     </ul>`;
                 } else if (messageLower.includes('wheat')) {
                     response   = "wheat include:";
                     response   = `<ul class="list-disc ml-5 mt-2">
                         <li>Rust (Leaf, Stem, Stripe) - Orange-brown pustules, use resistant varieties</li>
                         <li>Fusarium Head Blight - Bleached spikelets, apply fungicide at flowering</li>
                         <li>Powdery Mildew - White powdery growth, apply sulfur-based fungicides</li>
                         <li>Septoria - Brown lesions with yellow halos, rotate crops</li>
                     </ul>`;
                 } else if (messageLower.includes('rice')) {
                     response   = "rice include:";
                     response   = `<ul class="list-disc ml-5 mt-2">
                         <li>Rice Blast - Diamond-shaped lesions, use resistant varieties</li>
                         <li>Bacterial Leaf Blight - Water-soaked lesions that turn yellow</li>
                         <li>Sheath Blight - Irregular lesions on leaf sheaths, apply fungicide</li>
                         <li>Brown Spot - Brown oval spots, ensure balanced nutrition</li>
                     </ul>`;
                 } else if (messageLower.includes('corn')) {
                     response   = "corn include:";
                     response   = `<ul class="list-disc ml-5 mt-2">
                         <li>Gray Leaf Spot - Rectangular gray-brown lesions, rotate crops</li>
                         <li>Northern Corn Leaf Blight - Cigar-shaped gray-green lesions</li>
                         <li>Common Rust - Small, circular to elongated orange-brown pustules</li>
                         <li>Corn Smut - Galls on ears, tassels, and stems, remove infected parts</li>
                     </ul>`;
                 }
             }
             // Check for specific fertilizer questions
             else if (messageLower.includes('fertilizer') && 
                     (messageLower.includes('tomato') || 
                      messageLower.includes('potato') || 
                      messageLower.includes('wheat') || 
                      messageLower.includes('rice') || 
                      messageLower.includes('corn'))) {
                 
                 matchFound = true;
                 category = "fertilizer";
                 response = "<i class='fas fa-flask text-purple-500 mr-2'></i> Fertilizer recommendations for ";
                 
                 // Determine which crop
                 if (messageLower.includes('tomato')) {
                     response   = "tomatoes:";
                     response   = `<ul class="list-disc ml-5 mt-2">
                         <li>Before planting: Apply balanced fertilizer like 10-10-10</li>
                         <li>At flowering: Side-dress with calcium nitrate to prevent blossom end rot</li>
                         <li>Every 3-4 weeks: Apply compost tea or balanced liquid fertilizer</li>
                         <li>Avoid excess nitrogen which promotes foliage at expense of fruit</li>
                     </ul>`;
                 } else if (messageLower.includes('potato')) {
                     response   = "potatoes:";
                     response   = `<ul class="list-disc ml-5 mt-2">
                         <li>Pre-planting: Apply balanced fertilizer (10-10-10) or compost</li>
                         <li>Avoid fresh manure which can cause scab</li>
                         <li>At emergence: Side-dress with nitrogen-rich fertilizer</li>
                         <li>Potatoes need consistent potassium for tuber development</li>
                     </ul>`;
                 } else if (messageLower.includes('wheat')) {
                     response   = "wheat:";
                     response   = `<ul class="list-disc ml-5 mt-2">
                         <li>Pre-planting: 20-30 kg/ha of nitrogen, 40-60 kg/ha of phosphorus</li>
                         <li>Tillering stage: Apply 30-50 kg/ha of nitrogen</li>
                         <li>Heading stage: Additional nitrogen may be needed based on crop appearance</li>
                         <li>Ensure adequate sulfur which is essential for protein formation</li>
                     </ul>`;
                 } else if (messageLower.includes('rice')) {
                     response   = "rice:";
                     response   = `<ul class="list-disc ml-5 mt-2">
                         <li>Basal application: 20-30 kg/ha of nitrogen, 40-60 kg/ha of phosphorus, 30-40 kg/ha of potassium</li>
                         <li>Tillering stage: 30-40 kg/ha of nitrogen</li>
                         <li>Panicle initiation: 20-30 kg/ha of nitrogen</li>
                         <li>Consider zinc application in deficient soils (common in rice fields)</li>
                     </ul>`;
                 } else if (messageLower.includes('corn')) {
                     response   = "corn:";
                     response   = `<ul class="list-disc ml-5 mt-2">
                         <li>Pre-planting: 30-50 kg/ha of nitrogen, 60-80 kg/ha of phosphorus, 40-60 kg/ha of potassium</li>
                         <li>V6 stage (knee-high): Side-dress with 50-70 kg/ha of nitrogen</li>
                         <li>Ensure adequate zinc levels as corn is sensitive to zinc deficiency</li>
                         <li>Consider split nitrogen applications to reduce leaching</li>
                     </ul>`;
                 }
             }
             // Check each keyword for a match
             else {
                 for (const [keyword, data] of Object.entries(keywordResponses)) {
                     if (messageLower.includes(keyword)) {
                         response = data.response;
                         category = data.category;
                         matchFound = true;
                         break;
                     }
                 }
             }
             
             // Default response if no keyword match
             if (!matchFound) {
                 response = "I'm not sure I understand your question. Could you try rephrasing it or ask about specific topics like crop diseases, weather, fertilizers, pests, soil management, irrigation, or market information?";
             }
             
             // Add category-specific icon if not already added
             if (category && !response.includes('fas fa-')) {
                 switch(category) {
                     case "disease":
                         response = `<i class="fas fa-disease text-red-500 mr-2"></i> ${response}`;
                         break;
                     case "weather":
                         response = `<i class="fas fa-cloud-sun-rain text-blue-500 mr-2"></i> ${response}`;
                         break;
                     case "fertilizer":
                         response = `<i class="fas fa-flask text-purple-500 mr-2"></i> ${response}`;
                         break;
                     case "pest":
                         response = `<i class="fas fa-bug text-orange-500 mr-2"></i> ${response}`;
                         break;
                     case "soil":
                         response = `<i class="fas fa-layer-group text-brown-500 mr-2"></i> ${response}`;
                         break;
                     case "irrigation":
                         response = `<i class="fas fa-tint text-blue-500 mr-2"></i> ${response}`;
                         break;
                     case "market":
                         response = `<i class="fas fa-chart-line text-green-500 mr-2"></i> ${response}`;
                         break;
                     case "crop":
                         response = `<i class="fas fa-seedling text-green-500 mr-2"></i> ${response}`;
                         break;
                     case "organic":
                         response = `<i class="fas fa-leaf text-green-500 mr-2"></i> ${response}`;
                         break;
                     case "climate":
                         response = `<i class="fas fa-globe-americas text-blue-500 mr-2"></i> ${response}`;
                         break;
                 }
             }
             
             // Add bot response
             addMessage(response);
             
         }, 1500); // Simulate thinking time
     }
     
     // Send message when button clicked
     if (sendButton) {
         sendButton.addEventListener('click', () => {
             const message = userInput.value.trim();
             if (message) {
                 addMessage(message, true);
                 userInput.value = '';
                 processMessage(message);
             }
         });
     } else {
         console.error("Send button not found! Element ID: send-button");
     }
     
     // Send message when Enter key pressed
     if (userInput) {
         userInput.addEventListener('keypress', (e) => {
             if (e.key === 'Enter') {
                 const message = userInput.value.trim();
                 if (message) {
                     addMessage(message, true);
                     userInput.value = '';
                     processMessage(message);
                 }
             }
         });
     }
     
     // Quick question function
     window.sendQuickQuestion = function(question) {
         addMessage(question, true);
         processMessage(question);
     };
     
     // Voice input functionality
     if (voiceButton) {
         voiceButton.addEventListener('click', () => {
             // Check if browser supports speech recognition
             if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                 const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                 const recognition = new SpeechRecognition();
                 
                 recognition.lang = 'en-US';
                 recognition.interimResults = false;
                 
                 // Change button text
                 voiceButton.innerHTML = '<i class="fas fa-microphone-alt text-red-500 animate-pulse mr-2"></i> Listening...';
                 
                 recognition.start();
                 
                 recognition.onresult = function(event) {
                     const transcript = event.results[0][0].transcript;
                     userInput.value = transcript;
                     
                     // Reset button
                     voiceButton.innerHTML = '<i class="fas fa-microphone mr-2"></i> Tap to speak';
                     
                     // Process the voice input
                     addMessage(transcript, true);
                     userInput.value = '';
                     processMessage(transcript);
                 };
                 
                 recognition.onerror = function() {
                     voiceButton.innerHTML = '<i class="fas fa-microphone mr-2"></i> Tap to speak';
                 };
                 
                 recognition.onend = function() {
                     voiceButton.innerHTML = '<i class="fas fa-microphone mr-2"></i> Tap to speak';
                 };
             } else {
                 alert('Voice recognition is not supported in your browser. Please try Chrome or Edge.');
             }
         });
     }
     
     // Add message animation class to existing messages
     document.querySelectorAll('.message').forEach(message => {
         message.classList.add('show');
     });
  });
  
  // Utility functions
  
  /**
  * Detects crop type mentioned in the message
  * @param {string} message - The user's message
  * @return {string|null} - Detected crop or null
  */
  function detectCropType(message) {
     const crops = [
         'wheat', 'rice', 'maize', 'corn', 'soybean', 'cotton', 
         'sugarcane', 'potato', 'tomato', 'onion', 'chilli', 
         'garlic', 'ginger', 'turmeric', 'mustard', 'groundnut',
         'sunflower', 'sorghum', 'millet', 'barley', 'pulses',
         'lentil', 'chickpea', 'pigeon pea', 'black gram', 'green gram'
     ];
     
     message = message.toLowerCase();
     
     for (const crop of crops) {
         if (message.includes(crop)) {
             return crop;
         }
     }
     
     return null;
  }
  
  // Backup direct event listener for send button
  document.addEventListener('click', function(event) {
     if (event.target && (event.target.id === 'send-button' || event.target.closest('#send-button'))) {
         console.log("Send button clicked via document event listener");
         const userInput = document.getElementById('user-input');
         if (userInput) {
             const message = userInput.value.trim();
             if (message) {
                 // Find the addMessage and processMessage functions in the parent scope
                 const chatMessages = document.getElementById('chat-messages');
                 if (chatMessages) {
                     // Create user message
                     const messageDiv = document.createElement('div');
                     messageDiv.className = 'message flex mb-4 justify-end';
                     messageDiv.innerHTML = `
                         <div class="bg-green-500 text-white rounded-lg p-3 max-w-[80%]">
                             <p>${message}</p>
                         </div>
                         <div class="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center ml-3 flex-shrink-0">
                             <i class="fas fa-user text-white"></i>
                         </div>
                     `;
                     
                     chatMessages.appendChild(messageDiv);
                     chatMessages.scrollTop = chatMessages.scrollHeight;
                     
                     // Apply animation
                     setTimeout(() => {
                         messageDiv.classList.add('show');
                     }, 100);
                     
                     // Clear input
                     userInput.value = '';
                     
                     // Show typing indicator
                     const typingDiv = document.createElement('div');
                     typingDiv.className = 'message flex mb-4 typing-message';
                     typingDiv.innerHTML = `
                         <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                             <i class="fas fa-robot text-green-500"></i>
                         </div>
                         <div class="bg-green-100 rounded-lg p-3 px-4">
                             <div class="typing-indicator">
                                 <div class="typing-dot"></div>
                                 <div class="typing-dot"></div>
                                 <div class="typing-dot"></div>
                             </div>
                         </div>
                     `;
                     
                     chatMessages.appendChild(typingDiv);
                     chatMessages.scrollTop = chatMessages.scrollHeight;
                     
                     // Simulate AI response after delay
                     setTimeout(function() {
                         // Remove typing indicator
                         chatMessages.removeChild(typingDiv);
                         
                         // Add AI response
                         const responseDiv = document.createElement('div');
                         responseDiv.className = 'message flex mb-4';
                         
                         // Default response
                         let response = "I'm not sure I understand your question. Could you try rephrasing it or ask about specific topics like crop diseases, weather, fertilizers, pests, soil management, irrigation, or market information?";
                         
                         // Simple keyword matching
                         const messageLower = message.toLowerCase();
                         if (messageLower.includes('disease') || messageLower.includes('blight') || messageLower.includes('rust')) {
                             response = "<i class='fas fa-disease text-red-500 mr-2'></i> Common crop diseases include Early Blight, Late Blight, Powdery Mildew, and Rust. To prevent diseases: 1) Use resistant varieties, 2) Practice crop rotation, 3) Ensure proper spacing for air circulation, 4) Apply appropriate fungicides when necessary.";
                         } else if (messageLower.includes('weather') || messageLower.includes('rain') || messageLower.includes('forecast')) {
                             response = "<i class='fas fa-cloud-sun-rain text-blue-500 mr-2'></i> Weather forecasting helps you plan farming activities. Consider: 1) Check 7-day forecasts regularly, 2) Install a weather station on your farm for local data, 3) Use weather apps with agricultural features, 4) Plan irrigation based on rainfall predictions.";
                         } else if (messageLower.includes('fertilizer') || messageLower.includes('nutrient')) {
                             response = "<i class='fas fa-flask text-purple-500 mr-2'></i> Fertilizer application should be based on soil tests. Key nutrients include: 1) Nitrogen (N) for leaf growth, 2) Phosphorus (P) for root development, 3) Potassium (K) for overall plant health, 4) Micronutrients like zinc and boron for specific functions.";
                         } else if (messageLower.includes('pest') || messageLower.includes('insect')) {
                             response = "<i class='fas fa-bug text-orange-500 mr-2'></i> Integrated Pest Management (IPM) is the most effective approach: 1) Identify pests correctly, 2) Use biological controls when possible, 3) Apply targeted pesticides only when necessary, 4) Implement preventive measures like crop rotation and trap crops.";
                         }
                         
                         responseDiv.innerHTML = `
                             <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                                 <i class="fas fa-robot text-green-500"></i>
                             </div>
                             <div class="bg-green-100 rounded-lg p-3 max-w-[80%]">
                                 <p class="text-gray-800">${response}</p>
                             </div>
                         `;
                         
                         chatMessages.appendChild(responseDiv);
                         chatMessages.scrollTop = chatMessages.scrollHeight;
                         
                         // Apply animation
                         setTimeout(() => {
                             responseDiv.classList.add('show');
                         }, 100);
                     }, 1500);
                 }
             }
         }
     }
});