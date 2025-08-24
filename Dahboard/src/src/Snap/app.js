document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const fileInput = document.getElementById('fileInput');
    const dropArea = document.getElementById('drop-area');
    const analyzeBtn = document.getElementById('analyze-btn');
    const previewContainer = document.getElementById('preview-container');
    const previewImage = document.getElementById('preview-image');
    const changeImageBtn = document.getElementById('change-image');
    const uploadSection = document.getElementById('upload-section');
    const loadingSection = document.getElementById('loading-section');
    const resultsSection = document.getElementById('results-section');
    const errorSection = document.getElementById('error-section');
    const errorMessage = document.getElementById('error-message');
    const tryAgainBtn = document.getElementById('try-again');
    const cardsContainer = document.getElementById('cards-container');
    const editToggleBtn = document.getElementById('edit-toggle');
    const confirmBtn = document.getElementById('confirm-btn');
    
    // Totals elements
    const totalCalories = document.getElementById('total-calories');
    const totalProtein = document.getElementById('total-protein');
    const totalCarbs = document.getElementById('total-carbs');
    const totalFats = document.getElementById('total-fats');
    const totalFiber = document.getElementById('total-fiber');
    
    // State
    let selectedFile = null;
    let analysisResults = null;
    let isEditMode = false;
    
    // Event Listeners for drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => {
            dropArea.classList.add('highlight');
        }, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => {
            dropArea.classList.remove('highlight');
        }, false);
    });
    
    // Setup event listeners
    dropArea.addEventListener('drop', handleDrop);
    fileInput.addEventListener('change', handleFileChange);
    analyzeBtn.addEventListener('click', handleAnalyze);
    changeImageBtn.addEventListener('click', resetUpload);
    tryAgainBtn.addEventListener('click', resetApp);
    editToggleBtn.addEventListener('click', toggleEditMode);
    confirmBtn.addEventListener('click', handleConfirm);
    
    // Click on drop area to trigger file input
    dropArea.addEventListener('click', () => fileInput.click());
    
    // Add CSS rules to the document for our layout changes
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        #cards-container {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-gap: 20px;
        }
        
        @media (max-width: 768px) {
            #cards-container {
                grid-template-columns: 1fr;
            }
        }
        
        /* More aggressive styling for nutrition totals */
        .nutrition-summary, 
        #nutrition-summary,
        .results-summary,
        #results-summary {
            width: 100% !important;
            max-width: 100% !important;
            margin-bottom: 30px !important;
            box-sizing: border-box !important;
        }
        
        .nutrition-totals,
        #nutrition-totals {
            width: 100% !important;
            max-width: 100% !important;
            display: flex !important;
            flex-wrap: wrap !important;
            justify-content: space-between !important;
            margin: 0 auto !important;
        }
        
        .nutrition-item,
        .total-item {
            flex: 1 1 18% !important;
            min-width: 120px !important;
        }
        .food-card-quantity {
            display: inline-block !important;
        }
        /* Ensure the totals container is full width */
        #total-nutrition-card {
            width: 100% !important;
            display: flex !important;
            flex-direction: row !important;
            justify-content: space-between !important;
        }
    `;
    document.head.appendChild(styleElement);
    
    // Apply nutrition totals styling immediately
    setTimeout(() => {
        applyNutritionCardStyles();
    }, 100);
    
    // Helper function to apply nutrition card styles
    function applyNutritionCardStyles() {
        // Target all possible nutrition summary containers
        const nutritionContainers = document.querySelectorAll('.nutrition-summary, #nutrition-summary, .results-summary, #results-summary');
        nutritionContainers.forEach(container => {
            container.style.width = '100%';
            container.style.maxWidth = '100%';
            container.style.boxSizing = 'border-box';
        });
        
        // Target all possible nutrition totals containers
        const totalsContainers = document.querySelectorAll('.nutrition-totals, #nutrition-totals');
        totalsContainers.forEach(container => {
            container.style.width = '100%';
            container.style.maxWidth = '100%';
            container.style.display = 'flex';
            container.style.flexWrap = 'wrap';
            container.style.justifyContent = 'space-between';
        });
        
        // Target all nutrition items
        const nutritionItems = document.querySelectorAll('.nutrition-item, .total-item');
        nutritionItems.forEach(item => {
            item.style.flex = '1 1 18%';
            item.style.minWidth = '120px';
        });
    }
    
    // Functions
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length) {
            handleFiles(files);
        }
    }
    
    function handleFileChange(e) {
        const files = e.target.files;
        if (files.length) {
            handleFiles(files);
        }
    }
    
    function handleFiles(files) {
        selectedFile = files[0];
        
        if (!selectedFile.type.match('image.*')) {
            showError('Please select an image file');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            previewContainer.classList.remove('hidden');
            analyzeBtn.disabled = false;
        };
        reader.readAsDataURL(selectedFile);
    }
    
    function resetUpload() {
        fileInput.value = '';
        selectedFile = null;
        previewImage.src = '';
        previewContainer.classList.add('hidden');
        analyzeBtn.disabled = true;
    }
    
    function resetApp() {
        resetUpload();
        errorSection.classList.add('hidden');
        resultsSection.classList.add('hidden');
        uploadSection.classList.remove('hidden');
        cardsContainer.innerHTML = '';
        isEditMode = false;
        editToggleBtn.textContent = 'Edit Values';
        editToggleBtn.classList.remove('warning-btn');
    }
    
    function showError(message) {
        errorMessage.textContent = message;
        uploadSection.classList.add('hidden');
        loadingSection.classList.add('hidden');
        resultsSection.classList.add('hidden');
        errorSection.classList.remove('hidden');
    }
    
    function toggleEditMode() {
        isEditMode = !isEditMode;
        
        const editSections = document.querySelectorAll('.food-card-edit');
        editSections.forEach(section => {
            if (isEditMode) {
                section.classList.add('active');
                editToggleBtn.textContent = 'Cancel Editing';
                editToggleBtn.classList.add('warning-btn');
            } else {
                section.classList.remove('active');
                editToggleBtn.textContent = 'Edit Values';
                editToggleBtn.classList.remove('warning-btn');
            }
        });
    }
    
    function handleConfirm() {
        if (isEditMode) {
            // Apply edits before confirming
            updateTotalsFromEditedCards();
            toggleEditMode();
        }
        
        alert('Analysis confirmed! You can now use this data for your meal planning.');
        resetApp();
    }
    
    function updateTotalsFromEditedCards() {
        const cards = document.querySelectorAll('.food-card');
        let newTotals = {
            calories: 0,
            protein: 0,
            carbs: 0,
            fats: 0,
            fiber: 0
        };
        
        cards.forEach(card => {
            const index = parseInt(card.dataset.index);
            // Update the analysis results object with edited values
            if (analysisResults && analysisResults.final_analysis && analysisResults.final_analysis[index]) {
                const item = analysisResults.final_analysis[index];
                
                // Get edited values from input fields
                const nameInput = card.querySelector(`input[name="name-${index}"]`);
                const quantityInput = card.querySelector(`input[name="quantity-${index}"]`);
                const unitInput = card.querySelector(`input[name="unit-${index}"]`);
                const caloriesInput = card.querySelector(`input[name="calories-${index}"]`);
                const proteinInput = card.querySelector(`input[name="protein-${index}"]`);
                const carbsInput = card.querySelector(`input[name="carbohydrates-${index}"]`);
                const fatsInput = card.querySelector(`input[name="fats-${index}"]`);
                const fiberInput = card.querySelector(`input[name="fiber-${index}"]`);
                
                // Update the object with new values
                if (nameInput) item.name = nameInput.value;
                if (quantityInput) item.quantity = quantityInput.value;
                if (unitInput) item.unit = unitInput.value;
                if (caloriesInput) item.calories = parseFloat(caloriesInput.value);
                if (proteinInput) item.protein = parseFloat(proteinInput.value);
                if (carbsInput) item.carbohydrates = parseFloat(carbsInput.value);
                if (fatsInput) item.fats = parseFloat(fatsInput.value);
                if (fiberInput) item.fiber = parseFloat(fiberInput.value);
                
                // Update display values
                const nameDisplay = card.querySelector('.food-card-name');
                const quantityDisplay = card.querySelector('.food-card-quantity');
                const caloriesDisplay = card.querySelector('.calories-value');
                const proteinDisplay = card.querySelector('.protein-value');
                const carbsDisplay = card.querySelector('.carbs-value');
                const fatsDisplay = card.querySelector('.fats-value');
                const fiberDisplay = card.querySelector('.fiber-value');
                
                if (nameDisplay) nameDisplay.textContent = item.name;
                if (quantityDisplay) {
                    // Format quantity with unit without space between
                    const unit = item.unit || '';
                    quantityDisplay.textContent = item.quantity ? `${item.quantity}${unit}` : 'N/A';
                }
                if (caloriesDisplay) caloriesDisplay.textContent = `${Math.round(item.calories)} kcal`;
                if (proteinDisplay) proteinDisplay.textContent = `${item.protein?.toFixed(1)}g`;
                if (carbsDisplay) carbsDisplay.textContent = `${item.carbohydrates?.toFixed(1)}g`;
                if (fatsDisplay) fatsDisplay.textContent = `${item.fats?.toFixed(1)}g`;
                if (fiberDisplay) fiberDisplay.textContent = `${item.fiber?.toFixed(1)}g`;
                
                // Add to new totals
                newTotals.calories += parseFloat(item.calories || 0);
                newTotals.protein += parseFloat(item.protein || 0);
                newTotals.carbs += parseFloat(carbsInput.value);
                newTotals.fats += parseFloat(fatsInput.value);
                newTotals.fiber += parseFloat(fiberInput.value);
            }
        });
        
        // Update total displays
        updateTotalDisplays(newTotals);
    }
    
    function updateTotalDisplays(totals) {
        totalCalories.textContent = `${Math.round(totals.calories)} kcal`;
        totalProtein.textContent = `${totals.protein.toFixed(1)}g`;
        totalCarbs.textContent = `${totals.carbs.toFixed(1)}g`;
        totalFats.textContent = `${totals.fats.toFixed(1)}g`;
        totalFiber.textContent = `${totals.fiber.toFixed(1)}g`;
        // New: ensure the parent container is wide
        const totalsContainer = totalCalories.parentElement;
        if (totalsContainer) {
            totalsContainer.style.width = '100%';
            totalsContainer.style.display = 'flex';
            totalsContainer.style.flexDirection = 'row';
            totalsContainer.style.justifyContent = 'space-between';
        }
    }
    
    async function handleAnalyze() {
        if (!selectedFile) {
            showError('Please select an image file');
            return;
        }
        
        try {
            // Show loading state
            uploadSection.classList.add('hidden');
            loadingSection.classList.remove('hidden');
            errorSection.classList.add('hidden');
            
            // Prepare form data for the upload
            const formData = new FormData();
            formData.append('foodImage', selectedFile);
            
            // Send request to the server
            const response = await fetch('/analyze', {
                method: 'POST',
                body: formData
            });
            
            // Hide loading indicator
            loadingSection.classList.add('hidden');
            
            if (!response.ok) {
                let errorMsg = 'Failed to analyze the image';
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.message || errorMsg;
                } catch (parseError) {
                    console.error('Error parsing error response:', parseError);
                }
                throw new Error(errorMsg);
            }
            
            // Process the response data
            let data;
            try {
                const responseText = await response.text();
                data = JSON.parse(responseText);
                console.log('Analysis results:', data);
            } catch (parseError) {
                console.error('Error parsing response:', parseError);
                throw new Error('Error parsing server response. Please try again.');
            }
            
            if (data.status === 'error') {
                throw new Error(data.message || 'Error during analysis');
            }
            
            // Save the analysis results and render
            analysisResults = data;
            renderResults(data);
            
        } catch (error) {
            console.error('Analysis error:', error);
            showError(error.message || 'Error analyzing the image');
        }
    }
    
    function renderResults(data) {
        // Clear previous results
        cardsContainer.innerHTML = '';
        
        // Check if we have the final analysis results
        if (!data.final_analysis) {
            showError('No analysis data available');
            return;
        }
        
        // Convert data.final_analysis to array if it's not already
        let foodItems = [];
        
        if (Array.isArray(data.final_analysis)) {
            foodItems = data.final_analysis;
        } else if (typeof data.final_analysis === 'object') {
            // If it's an object with key-value pairs, convert to array
            foodItems = Object.values(data.final_analysis);
        } else {
            console.error('Invalid final_analysis format:', data.final_analysis);
            showError('Invalid analysis data format');
            return;
        }
        
        if (foodItems.length === 0) {
            showError('No food items detected in the analysis');
            return;
        }
        
        // Calculate totals
        let totals = {
            calories: 0,
            protein: 0,
            carbs: 0,
            fats: 0,
            fiber: 0
        };
        
        // Create color palette for cards
        const colorPalette = [
            { border: '#FF5252', bg: '#FFEBEE' },
            { border: '#536DFE', bg: '#E8EAF6' },
            { border: '#00BFA5', bg: '#E0F2F1' },
            { border: '#FFA726', bg: '#FFF3E0' },
            { border: '#AB47BC', bg: '#F3E5F5' },
            { border: '#26A69A', bg: '#E0F2F1' },
            { border: '#EC407A', bg: '#FCE4EC' },
            { border: '#7E57C2', bg: '#EDE7F6' }
        ];
        
        // Create cards for each food item
        foodItems.forEach((item, index) => {
            // Add to totals
            totals.calories += parseFloat(item.calories || 0);
            totals.protein += parseFloat(item.protein || 0);
            totals.carbs += parseFloat(item.carbohydrates || 0);
            totals.fats += parseFloat(item.fats || 0);
            totals.fiber += parseFloat(item.fiber || 0);
            
            // Select a color for this card
            const colorIndex = index % colorPalette.length;
            const cardColor = colorPalette[colorIndex];
            
            // Create the card element
            const card = document.createElement('div');
            card.className = 'food-card';
            card.dataset.index = index;
            card.style.borderLeft = `6px solid ${cardColor.border}`;
            card.style.backgroundColor = cardColor.bg;
            
            // Create card content with explicit unit handling
            card.innerHTML = `
                <div class="food-card-header">
                    <div class="food-card-name">${item.name || ''}</div>
                    <div class="food-card-quantity">${formatQuantityWithUnit(item.quantity, item.unit)}</div>
                </div>
                <div class="food-card-body">
                    <div class="food-card-nutrient">
                        <span class="nutrient-label">Calories</span>
                        <span class="nutrient-value calories-value">${Math.round(item.calories || 0)} kcal</span>
                    </div>
                    <div class="food-card-nutrient">
                        <span class="nutrient-label">Protein</span>
                        <span class="nutrient-value protein-value">${(item.protein || 0).toFixed(1)}g</span>
                    </div>
                    <div class="food-card-nutrient">
                        <span class="nutrient-label">Carbs</span>
                        <span class="nutrient-value carbs-value">${(item.carbohydrates || 0).toFixed(1)}g</span>
                    </div>
                    <div class="food-card-nutrient">
                        <span class="nutrient-label">Fats</span>
                        <span class="nutrient-value fats-value">${(item.fats || 0).toFixed(1)}g</span>
                    </div>
                    <div class="food-card-nutrient">
                        <span class="nutrient-label">Fiber</span>
                        <span class="nutrient-value fiber-value">${(item.fiber || 0).toFixed(1)}g</span>
                    </div>
                </div>
                <div class="food-card-edit">
                    <div class="edit-group">
                        <label for="name-${index}">Food Name:</label>
                        <input type="text" name="name-${index}" value="${item.name || ''}">
                    </div>
                    <div class="edit-row">
                        <div class="edit-group half">
                            <label for="quantity-${index}">Quantity:</label>
                            <input type="text" name="quantity-${index}" value="${item.quantity || ''}">
                        </div>
                        <div class="edit-group half">
                            <label for="unit-${index}">Unit:</label>
                            <input type="text" name="unit-${index}" value="${item.unit || ''}">
                        </div>
                    </div>
                    <div class="edit-row">
                        <div class="edit-group half">
                            <label for="calories-${index}">Calories:</label>
                            <input type="number" name="calories-${index}" value="${item.calories || 0}" step="1">
                        </div>
                        <div class="edit-group half">
                            <label for="protein-${index}">Protein (g):</label>
                            <input type="number" name="protein-${index}" value="${item.protein || 0}" step="0.1">
                        </div>
                    </div>
                    <div class="edit-row">
                        <div class="edit-group half">
                            <label for="carbohydrates-${index}">Carbs (g):</label>
                            <input type="number" name="carbohydrates-${index}" value="${item.carbohydrates || 0}" step="0.1">
                        </div>
                        <div class="edit-group half">
                            <label for="fats-${index}">Fats (g):</label>
                            <input type="number" name="fats-${index}" value="${item.fats || 0}" step="0.1">
                        </div>
                    </div>
                    <div class="edit-group">
                        <label for="fiber-${index}">Fiber (g):</label>
                        <input type="number" name="fiber-${index}" value="${item.fiber || 0}" step="0.1">
                    </div>
                </div>
            `;
            
            cardsContainer.appendChild(card);
        });
        
        // Update total displays
        updateTotalDisplays({
            calories: totals.calories,
            protein: totals.protein,
            carbs: totals.carbs,
            fats: totals.fats,
            fiber: totals.fiber
        });
        
        // Show results section
        uploadSection.classList.add('hidden');
        resultsSection.classList.remove('hidden');
        
        // Apply nutrition card styling
        applyNutritionCardStyles();
    }
    
    // Helper function to format quantity with unit (without space)
    function formatQuantityWithUnit(quantity, unit) {
        if (!quantity) return 'N/A';
        
        // Join quantity and unit directly without space
        const unitStr = unit || '';
        return `${quantity} ${unitStr}`.trim();
    }

    // Add a more direct style fix right after the document loads
    document.head.innerHTML += `
        <style>
            .nutrition-summary, 
            .nutrition-totals,
            #nutrition-summary,
            #nutrition-totals,
            .results-summary {
                width: 100% !important;
                max-width: 100% !important;
                box-sizing: border-box !important;
                padding: 15px !important;
            }
            
            .nutrition-totals,
            #nutrition-totals {
                display: flex !important;
                flex-direction: row !important;
                flex-wrap: wrap !important;
            }
            
            .nutrition-item,
            .total-item {
                flex: 1 !important;
                min-width: 120px !important;
                text-align: center !important;
            }
            
            #cards-container {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                grid-gap: 20px;
            }
        </style>
    `;
    
    // Fix the nutrition card as soon as DOM is loaded and after any render
    function fixNutritionCard() {
        const allPossibleSelectors = [
            '.nutrition-summary', 
            '#nutrition-summary', 
            '.nutrition-totals', 
            '#nutrition-totals',
            '.results-summary'
        ];
        
        allPossibleSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.style.width = '100%';
                el.style.maxWidth = '100%';
                el.style.boxSizing = 'border-box';
            });
        });
        
        // Apply styles directly to nutrition items
        document.querySelectorAll('.nutrition-item, .total-item').forEach(item => {
            item.style.flex = '1';
            item.style.minWidth = '120px';
            item.style.textAlign = 'center';
        });
    }
    
    // Call immediately and on window load to ensure it applies
    fixNutritionCard();
    window.addEventListener('load', fixNutritionCard);
    
    // Override existing functions that need fixes
    
    function updateTotalsFromEditedCards() {
        const cards = document.querySelectorAll('.food-card');
        let newTotals = {
            calories: 0,
            protein: 0,
            carbs: 0,
            fats: 0,
            fiber: 0
        };
        
        cards.forEach(card => {
            const index = parseInt(card.dataset.index);
            // Update the analysis results object with edited values
            if (analysisResults && analysisResults.final_analysis && analysisResults.final_analysis[index]) {
                const item = analysisResults.final_analysis[index];
                
                // Get edited values from input fields
                const nameInput = card.querySelector(`input[name="name-${index}"]`);
                const quantityInput = card.querySelector(`input[name="quantity-${index}"]`);
                const unitInput = card.querySelector(`input[name="unit-${index}"]`);
                const caloriesInput = card.querySelector(`input[name="calories-${index}"]`);
                const proteinInput = card.querySelector(`input[name="protein-${index}"]`);
                const carbsInput = card.querySelector(`input[name="carbohydrates-${index}"]`);
                const fatsInput = card.querySelector(`input[name="fats-${index}"]`);
                const fiberInput = card.querySelector(`input[name="fiber-${index}"]`);
                
                // Update the object with new values
                if (nameInput) item.name = nameInput.value;
                if (quantityInput) item.quantity = quantityInput.value;
                if (unitInput) item.unit = unitInput.value;
                if (caloriesInput) item.calories = parseFloat(caloriesInput.value);
                if (proteinInput) item.protein = parseFloat(proteinInput.value);
                if (carbsInput) item.carbohydrates = parseFloat(carbsInput.value);
                if (fatsInput) item.fats = parseFloat(fatsInput.value);
                if (fiberInput) item.fiber = parseFloat(fiberInput.value);
                
                // Update display values
                const nameDisplay = card.querySelector('.food-card-name');
                const quantityDisplay = card.querySelector('.food-card-quantity');
                const caloriesDisplay = card.querySelector('.calories-value');
                const proteinDisplay = card.querySelector('.protein-value');
                const carbsDisplay = card.querySelector('.carbs-value');
                const fatsDisplay = card.querySelector('.fats-value');
                const fiberDisplay = card.querySelector('.fiber-value');
                
                if (nameDisplay) nameDisplay.textContent = item.name;
                if (quantityDisplay) {
                    // Format quantity with unit without space between
                    const unit = item.unit || '';
                    quantityDisplay.textContent = item.quantity ? `${item.quantity}${unit}` : 'N/A';
                }
                if (caloriesDisplay) caloriesDisplay.textContent = `${Math.round(item.calories)} kcal`;
                if (proteinDisplay) proteinDisplay.textContent = `${item.protein?.toFixed(1)}g`;
                if (carbsDisplay) carbsDisplay.textContent = `${item.carbohydrates?.toFixed(1)}g`;
                if (fatsDisplay) fatsDisplay.textContent = `${item.fats?.toFixed(1)}g`;
                if (fiberDisplay) fiberDisplay.textContent = `${item.fiber?.toFixed(1)}g`;
                
                // Add to new totals
                newTotals.calories += parseFloat(item.calories || 0);
                newTotals.protein += parseFloat(item.protein || 0);
                newTotals.carbs += parseFloat(carbsInput.value);
                newTotals.fats += parseFloat(fatsInput.value);
                newTotals.fiber += parseFloat(fiberInput.value);
            }
        });
        
        // Update total displays
        updateTotalDisplays(newTotals);
    }
    
    // Helper function to format quantity with unit EXACTLY how we want
    function formatQuantityWithUnit(quantity, unit) {
        if (!quantity) return 'N/A';
        // Ensure NO space between quantity and unit
        return `${quantity}${unit || ''}`;
    }
    
    // Override renderResults function
    const originalRenderResults = renderResults;
    renderResults = function(data) {
        originalRenderResults(data);
        
        // Apply styles after rendering is complete
        fixNutritionCard();
        
        // For quantity & unit - fix any potential issues by directly updating DOM
        document.querySelectorAll('.food-card-quantity').forEach(quantityEl => {
            const cardEl = quantityEl.closest('.food-card');
            if (!cardEl) return;
            
            const index = cardEl.dataset.index;
            if (!index || !analysisResults?.final_analysis?.[index]) return;
            
            const item = analysisResults.final_analysis[index];
            quantityEl.textContent = formatQuantityWithUnit(item.quantity, item.unit);
        });
    };
});
