document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.querySelector('.btn-add-customer');
    const modal = document.getElementById('addCustomerModal');
    const closeBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelModal');
    const form = document.getElementById('customerForm');

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
        // Here you would gather data and potentially send it to a backend
        // For now, we'll just log it and close
        console.log('Customer Added');
        closeModal();
        form.reset();
    });
    // Search Functionality
    const searchInput = document.querySelector('.search-input');
    const cards = document.querySelectorAll('.card');
    const noResultsMsg = document.querySelector('.no-results');

    // Helper to normalize strings (remove accents/diacritics)
    const normalizeString = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    searchInput.addEventListener('input', (e) => {
        const searchString = normalizeString(e.target.value);
        const searchTerms = searchString.split(/\s+/).filter(term => term.length > 0);
        let visibleCount = 0;

        cards.forEach(card => {
            const nameElement = card.querySelector('.customer-name');
            const nameText = nameElement ? normalizeString(nameElement.textContent) : '';

            // Check if ALL search terms are present in the name (Order independent)
            const isMatch = searchTerms.every(term => nameText.includes(term));

            // "Apple-like" Smooth Filtering
            if (isMatch) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        // Show/Hide Empty State
        if (visibleCount === 0) {
            noResultsMsg.style.display = 'block';
        } else {
            noResultsMsg.style.display = 'none';
        }
    });

    // Filter UI Logic
    const filterToggle = document.getElementById('filterToggle');
    const filterMenu = document.getElementById('filterMenu');

    // Toggle Menu
    filterToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isExpanded = filterToggle.getAttribute('aria-expanded') === 'true';
        filterToggle.setAttribute('aria-expanded', !isExpanded);
        filterToggle.classList.toggle('active');
        filterMenu.classList.toggle('active');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!filterMenu.contains(e.target) && !filterToggle.contains(e.target)) {
            filterMenu.classList.remove('active');
            filterToggle.classList.remove('active');
            filterToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Handle Selection (Visual only for now)
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

    // Clear Filters
    document.getElementById('clearFilters').addEventListener('click', () => {
        document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
        const filterSelect = document.querySelector('.filter-select');
        if (filterSelect) filterSelect.value = "";
    });

});
