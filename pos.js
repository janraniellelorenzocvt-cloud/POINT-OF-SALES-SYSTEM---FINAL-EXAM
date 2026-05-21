// Menu items array
const menuItems = [
    { id: 1, name: "Emerald Mist Salad", price: 140, img: "assets/images/emerald-salad.png" },
    { id: 2, name: "Forest Floor Fungi", price: 160, img: "assets/images/fungi-saute.png" },
    { id: 3, name: "The Dewdrop Caprese", price: 130, img: "assets/images/caprese.png" },
    { id: 4, name: "Siren’s Sea-Green Pasta", price: 180, img: "assets/images/pesto-pasta.png" },
    { id: 5, name: "Midnight Orchid Tea", price: 70, img: "assets/images/orchid-tea.png" },
    { id: 6, name: "Sunlight Spritz Shake", price: 90, img: "assets/images/sunlight-shake.png" },
    { id: 7, name: "Ancient Roots Elixir", price: 80, img: "assets/images/roots-elixir.png" },
    { id: 8, name: "The Canopy Smoothie", price: 100, img: "assets/images/canopy-smoothie.png" },
    { id: 9, name: "Wild Berry Briar", price: 80, img: "assets/images/berry-briar.png" },
    { id: 10, name: "Moss-Top Matcha", price: 75, img: "assets/images/matcha-bowl.png" }
];

// Shopping cart object
let checkoutCart = {};

// Load menu items when page opens
function initializeTerminalGrid() {
    const gridContainer = document.getElementById('pos-grid');
    gridContainer.innerHTML = '';

    menuItems.forEach(item => {
        // Create a card element
        const itemCard = document.createElement('div');
        itemCard.className = 'pos-card';
        // Put content and inputs inside card
        itemCard.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="pos-card-info">
                <div class="pos-item-title">${item.name}</div>
                <div class="pos-item-price">${item.price} PHP</div>
            </div>
            <div class="pos-card-actions">
                <input type="number" id="qty-input-${item.id}" class="pos-qty-field" value="" min="1">
                <button class="card-add-btn" onclick="commitCardItemToCart(${item.id})">Add to order</button>
            </div>
        `;
        gridContainer.appendChild(itemCard);
    });
}

// Add item using card fields
function commitCardItemToCart(itemId) {
    const qtyField = document.getElementById(`qty-input-${itemId}`);
    const quantityValue = parseInt(qtyField.value);

    // Filter validation checks
    if (isNaN(quantityValue) || quantityValue <= 0) {
        displaySystemToast("Please enter a valid quantity amount.", "error");
        qtyField.value = '';
        return;
    }

    // Accumulate structural metrics dynamically
    if (checkoutCart[itemId]) {
        checkoutCart[itemId] += quantityValue;
    } else {
        checkoutCart[itemId] = quantityValue;
    }

    // Reset targeted inline inputs back to baseline state 
    qtyField.value = '';
    renderReceiptPanel();
}

// Show current items in sidebar list
function renderReceiptPanel() {
    const listContainer = document.getElementById('order-list');
    listContainer.innerHTML = '';
    let rollingTotal = 0;

    for (const itemId in checkoutCart) {
        const itemMatch = menuItems.find(m => m.id == itemId);
        const contextualQuantity = checkoutCart[itemId];
        const computedLineCost = itemMatch.price * contextualQuantity;
        rollingTotal += computedLineCost;

        const receiptRow = document.createElement('div');
        receiptRow.className = 'receipt-row-item';
        receiptRow.innerHTML = `
            <div>
                <span class="receipt-item-name">${itemMatch.name}</span>
                <span class="receipt-item-qty">Qty: ${contextualQuantity}</span>
            </div>
            <span style="font-weight: 600; color: #fff;">${computedLineCost} PHP</span>
        `;
        listContainer.appendChild(receiptRow);
    }

    // Update prices on view
    document.getElementById('total-display-label').innerText = `Total: ${rollingTotal} PHP`;
}

// Transaction processing rule with explicit UI banners
function executePaymentTransaction() {
    let extractedTotal = 0;
    for (const itemId in checkoutCart) {
        const itemMatch = menuItems.find(m => m.id == itemId);
        extractedTotal += itemMatch.price * checkoutCart[itemId];
    }

    // Exception handling for empty basket execution states
    if (extractedTotal === 0) {
        displaySystemToast("Your order basket is currently empty.", "error");
        return;
    }

    const cashField = document.getElementById('cash-tendered-input');
    const processedCashAmount = parseFloat(cashField.value) || 0;

    // Strict validation verification gate
    if (processedCashAmount < extractedTotal) {
        displaySystemToast("Insufficient amount of money", "error");
        return;
    }

    // Payment Settlement Successful
    const calculatedChangeValue = processedCashAmount - extractedTotal;
    displaySystemToast(`Successful payment! Change: ${calculatedChangeValue} PHP`, "success");

    // Clean structural state components back to system baseline parameters
    checkoutCart = {};
    cashField.value = '';
    renderReceiptPanel();
}

// Custom internal UI Toast alert logic pattern to avoid native system blockages
function displaySystemToast(message, variantType) {
    const bannerElement = document.getElementById('toast-banner');
    bannerElement.innerText = message;
    
    bannerElement.className = 'toast-notification';
    if (variantType === 'success') {
        bannerElement.classList.add('toast-success');
    } else {
        bannerElement.classList.add('toast-error');
    }
    
    bannerElement.classList.add('show');

    // Hide banner after set time parameter
    setTimeout(() => {
        bannerElement.classList.remove('show');
    }, 4500);
}

// Kick off baseline structural renders
document.addEventListener("DOMContentLoaded", () => {
    initializeTerminalGrid();
});
