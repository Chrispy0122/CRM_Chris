document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.querySelector('.btn-add-customer');
    const modal = document.getElementById('addCustomerModal');
    const closeBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelModal');
    const form = document.getElementById('customerForm');
<<<<<<< HEAD
=======
    const grid = document.querySelector('.customers-grid');

    // --- HELPER: Bind Image Upload Events (Reusable) ---
    const bindImageEvents = (wrapper) => {
        const input = wrapper.querySelector('.image-input');
        const label = wrapper.querySelector('.upload-label');
        const img = label.querySelector('.uploaded-image');
        const plusIcon = label.querySelector('.plus-icon');
        const removeBtn = wrapper.querySelector('.remove-image-btn');

        // Handle File Select
        input.addEventListener('change', function (e) {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    img.src = e.target.result;
                    img.style.display = 'block';
                    plusIcon.style.display = 'none';
                    label.style.borderStyle = 'solid';
                    if (removeBtn) removeBtn.style.display = 'flex';
                }
                reader.readAsDataURL(this.files[0]);
            }
        });

        // Handle Remove
        if (removeBtn) {
            removeBtn.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent label click
                e.stopPropagation();

                // Clear Preview
                img.src = "";
                img.style.display = 'none';
                plusIcon.style.display = 'block';
                label.style.borderStyle = 'dashed';
                removeBtn.style.display = 'none';

                // Clear Input
                input.value = "";
            });
        }
    };
>>>>>>> 274a015c6e8bffee8e53e432e6eb4f2b472b87f6

    // Open Modal
    addBtn.addEventListener('click', () => {
        modal.classList.add('active');
        // Focus first input for accessibility
        setTimeout(() => document.getElementById('name').focus(), 100);
    });

    // Close Modal Function
    const closeModal = () => {
        modal.classList.remove('active');
    };

    // Close Event Listeners
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Close when clicking outside the modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Handle Form Submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();
<<<<<<< HEAD
        // Here you would gather data and potentially send it to a backend
        // For now, we'll just log it and close
        console.log('Customer Added');
        closeModal();
        form.reset();
    });
    // --- SEARCH & FILTER LOGIC ---
    const searchInput = document.querySelector('.search-input');
    const cards = document.querySelectorAll('.card');
=======

        // Get Values
        const name = document.getElementById('name').value;
        const phone = document.getElementById('whatsapp').value;
        const item = document.getElementById('item').value;
        const email = document.getElementById('email').value;

        // Format Date (e.g., "Oct 24, 2023")
        const dateObj = new Date();
        const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        // Unique ID for Upload
        const uniqueId = 'upload-' + Date.now();

        // Create HTML string
        const cardHTML = `
            <div class="card-header">
                <h2 class="customer-name">${name}</h2>
            </div>
            <div class="card-body">
                <div class="card-content-row">
                    <div class="card-info">
                        <div class="info-group">
                            <span class="label">Phone</span>
                            <p class="value">${phone}</p>
                        </div>
                        <div class="info-group">
                            <span class="label">Email</span>
                            <p class="value">${email}</p>
                        </div>
                        <div class="info-group">
                            <span class="label">Last Purchase</span>
                            <p class="value">${item}</p>
                            <span class="date">${dateStr}</span>
                        </div>
                    </div>
                    <div class="card-image-upload">
                            <input type="file" id="${uniqueId}" class="image-input" accept="image/*">
                            <label for="${uniqueId}" class="upload-label" aria-label="Upload Image">
                            <span class="plus-icon">+</span>
                            <img src="" alt="" class="uploaded-image" style="display: none;">
                            </label>
                            <button type="button" class="remove-image-btn" style="display: none;" aria-label="Remove Image">&times;</button>
                    </div>
                </div>
                <button class="btn-generate">Generate a Thank You Message</button>
            </div>
        `;

        // Create Element
        const newCard = document.createElement('article');
        newCard.className = 'card';
        newCard.innerHTML = cardHTML;

        // Append to Grid (Before the empty state)
        grid.insertBefore(newCard, document.querySelector('.no-results'));

        // Bind Image Events for the new card
        bindImageEvents(newCard.querySelector('.card-image-upload'));

        // Close & Reset
        closeModal();
        form.reset();

        // Run filters
        runFilters();
    });
    // --- SEARCH & FILTER LOGIC ---
    const searchInput = document.querySelector('.search-input');
    // const cards = document.querySelectorAll('.card');
>>>>>>> 274a015c6e8bffee8e53e432e6eb4f2b472b87f6
    const noResultsMsg = document.querySelector('.no-results');
    const filterToggle = document.getElementById('filterToggle');
    const filterMenu = document.getElementById('filterMenu');
    const applyBtn = document.getElementById('applyFilters');
    const clearBtn = document.getElementById('clearFilters');

    // State
    let currentSearchTerm = '';
    let currentFilters = {
        category: '',
        materials: [],
        colors: [],
        sizes: []
    };

    // Category Singularization Map
    const categoryMap = {
        'shirts': 'shirt',
        'pants': 'pants', // Pants is usually plural in text too "Denim Pants"
        'shorts': 'shorts',
        'sweaters': 'sweater',
        'dresses': 'dress',
        'jackets': 'jacket'
    };

    // Normalization Helper
    const normalize = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    // Main Filter Function
    const runFilters = () => {
        let visibleCount = 0;
<<<<<<< HEAD
=======
        const cards = document.querySelectorAll('.card');
>>>>>>> 274a015c6e8bffee8e53e432e6eb4f2b472b87f6

        cards.forEach(card => {
            const cardNameEl = card.querySelector('.customer-name');
            const cardName = cardNameEl ? normalize(cardNameEl.textContent) : '';
            const cardFullText = normalize(card.textContent);

            let isMatch = true;

            // 1. Search Term (Name Match - Multi-word)
            if (currentSearchTerm) {
                const searchTerms = currentSearchTerm.split(/\s+/).filter(t => t.length > 0);
                const nameMatch = searchTerms.every(term => cardName.includes(term));
                if (!nameMatch) isMatch = false;
            }

            // 2. Category Filter
            if (isMatch && currentFilters.category) {
                const keyword = categoryMap[currentFilters.category] || currentFilters.category;
                if (!cardFullText.includes(keyword)) isMatch = false;
            }

            // 3. Materials Filter (OR logic: if any selected, card must have at least one)
            if (isMatch && currentFilters.materials.length > 0) {
                const matMatch = currentFilters.materials.some(mat => cardFullText.includes(mat));
                if (!matMatch) isMatch = false;
            }

            // 4. Colors Filter (OR logic)
            if (isMatch && currentFilters.colors.length > 0) {
                const colMatch = currentFilters.colors.some(col => cardFullText.includes(col));
                if (!colMatch) isMatch = false;
            }

            // 5. Size Filter (OR logic) - currently strictly checks text
            if (isMatch && currentFilters.sizes.length > 0) {
                const sizeMatch = currentFilters.sizes.some(size => cardFullText.includes(" " + size + " "));
                // Note: Spaces check to avoid matching "S" in "Silk"
                // Since text doesn't have sizes yet, this will likely hide everything if used.
                // For now, let's allow it to be strict.
                if (!sizeMatch) isMatch = false;
            }

            // Toggle Visibility
            if (isMatch) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        // Empty State
        noResultsMsg.style.display = (visibleCount === 0) ? 'block' : 'none';
    };

    // Event: Search Input
    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = normalize(e.target.value);
        runFilters();
    });

    // Event: Toggle Filter Menu
    filterToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isExpanded = filterToggle.getAttribute('aria-expanded') === 'true';
        filterToggle.setAttribute('aria-expanded', !isExpanded);
        filterToggle.classList.toggle('active');
        filterMenu.classList.toggle('active');
    });

    // Event: Close Menu Outside
    document.addEventListener('click', (e) => {
        if (!filterMenu.contains(e.target) && !filterToggle.contains(e.target)) {
            filterMenu.classList.remove('active');
            filterToggle.classList.remove('active');
            filterToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Event: Toggle Selection (Visual)
    const toggleSelection = (elements) => {
        elements.forEach(el => {
            el.addEventListener('click', () => {
                el.classList.toggle('selected');
            });
        });
    };
    toggleSelection(document.querySelectorAll('.size-btn'));
    toggleSelection(document.querySelectorAll('.chip-btn'));
    toggleSelection(document.querySelectorAll('.color-btn'));

    // Event: Apply Filters
    applyBtn.addEventListener('click', () => {
        // Harvest Data
        const categoryVal = document.querySelector('.filter-select').value;
        const sizeVals = Array.from(document.querySelectorAll('.size-btn.selected')).map(el => normalize(el.textContent));
        const materialVals = Array.from(document.querySelectorAll('.chip-btn.selected')).map(el => normalize(el.textContent));
        const colorVals = Array.from(document.querySelectorAll('.color-btn.selected')).map(el => normalize(el.getAttribute('aria-label')));

        // Update State
        currentFilters = {
            category: categoryVal,
            sizes: sizeVals,
            materials: materialVals,
            colors: colorVals
        };

        // Run
        runFilters();

        // Close Menu
        filterMenu.classList.remove('active');
        filterToggle.classList.remove('active');
        filterToggle.setAttribute('aria-expanded', 'false');
    });

    // Event: Clear Filters
    clearBtn.addEventListener('click', () => {
        // Clear UI
        document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
        document.querySelector('.filter-select').value = "";

        // Clear State
        currentFilters = {
            category: '',
            materials: [],
            colors: [],
            sizes: []
        };

        // Run
        runFilters();
    });

    // Event: Click Title to Reset (Home)
    document.querySelector('.page-title').addEventListener('click', () => {
        // Clear Search
        searchInput.value = '';
        currentSearchTerm = '';

        // Clear Filters UI
        document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
        document.querySelector('.filter-select').value = "";

        // Clear Filter State
        currentFilters = {
            category: '',
            materials: [],
            colors: [],
            sizes: []
        };

        // Run to show all
        runFilters();
    });

<<<<<<< HEAD
=======
    // Initialize Image Upload Events for existing cards
    document.querySelectorAll('.card-image-upload').forEach(wrapper => bindImageEvents(wrapper));

>>>>>>> 274a015c6e8bffee8e53e432e6eb4f2b472b87f6
});
