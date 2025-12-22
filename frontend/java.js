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
});

// Search Functionality
const searchInput = document.querySelector('.search-input');
const cards = document.querySelectorAll('.card');

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();

    cards.forEach(card => {
        const customerName = card.querySelector('.customer-name').textContent.toLowerCase();

        if (customerName.includes(searchTerm)) {
            card.style.display = 'flex'; // Show matching card
        } else {
            card.style.display = 'none'; // Hide non-matching card
        }
    });
});
});
