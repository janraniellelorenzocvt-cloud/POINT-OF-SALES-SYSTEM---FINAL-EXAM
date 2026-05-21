const menuItems = [
    { id: 1, name: "Emerald Mist Salad", price: 14.00, img: "assets/images/emerald-salad.png" },
    { id: 2, name: "Forest Floor Fungi", price: 16.00, img: "assets/images/fungi-saute.png" },
    { id: 3, name: "The Dewdrop Caprese", price: 13.00, img: "assets/images/caprese.png" },
    { id: 4, name: "Siren’s Sea Pasta", price: 18.00, img: "assets/images/pesto-pasta.png" },
    { id: 5, name: "Midnight Orchid Tea", price: 7.00, img: "assets/images/orchid-tea.png" },
    { id: 6, name: "Sunlight Spritz Shake", price: 9.00, img: "assets/images/sunlight-shake.png" },
    { id: 7, name: "Ancient Roots Elixir", price: 8.00, img: "assets/images/roots-elixir.png" },
    { id: 8, name: "The Canopy Smoothie", price: 10.00, img: "assets/images/canopy-smoothie.png" },
    { id: 9, name: "Wild Berry Briar", price: 8.00, img: "assets/images/berry-briar.png" },
    { id: 10, name: "Moss-Top Matcha", price: 7.50, img: "assets/images/matcha-bowl.png" }
];

let cart = {}; 

function init() {
    const grid = document.getElementById('pos-grid');
    const select = document.getElementById('item-select');

    menuItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'pos-card';
        card.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <strong>${item.name}</strong><br>
            ${item.price.toFixed(2)} PHP
        `;
        card.onclick = () => addItem(item.id, 1);
        grid.appendChild(card);

        const opt = document.createElement('option');
        opt.value = item.id;
        opt.textContent = item.name;
        select.appendChild(opt);
    });
}

function addFromMenu() {
    const id = document.getElementById('item-select').value;
    const qtyInput = document.getElementById('item-qty');
    const qty = parseInt(qtyInput.value);
    addItem(parseInt(id), qty);
}

function addItem(id, qty) {
    if (cart[id]) {
        cart[id] += qty;
    } else {
        cart[id] = qty;
    }
    renderCart();
}

function renderCart() {
    const list = document.getElementById('order-list');
    list.innerHTML = '';
    let subtotal = 0;

    for (const id in cart) {
        const item = menuItems.find(m => m.id == id);
        const lineTotal = item.price * cart[id];
        subtotal += lineTotal;

        list.innerHTML += `
            <div class="order-item">
                <div class="item-info">
                    <img src="${item.img}" class="pos-item-img">
                    <div class="item-details">
                        <strong>${item.name}</strong>
                        <span class="item-qty">x${cart[id]}</span>
                    </div>
                </div>
                <span>${lineTotal.toFixed(2)} PHP</span>
            </div>
        `;
    }

    document.getElementById('subtotal').innerText = subtotal.toFixed(2);
    document.getElementById('total-amount').innerText = subtotal.toFixed(2);
    calculateChange();
}

function calculateChange() {
    const total = parseFloat(document.getElementById('total-amount').innerText);
    const cashInput = document.getElementById('cash-input');
    const cash = parseFloat(cashInput.value) || 0;
    const changeDisplay = document.getElementById('change-display');
    const btn = document.getElementById('confirm-pay-btn');

    if (cash >= total && total > 0) {
        changeDisplay.innerText = (cash - total).toFixed(2) + " PHP";
        changeDisplay.style.color = "#2ecc71";
        btn.disabled = false;
        btn.style.opacity = "1";
    } else {
        changeDisplay.innerText = "Insufficient";
        changeDisplay.style.color = "#ff4d4d";
        btn.disabled = true;
        btn.style.opacity = "0.5";
    }
}

function processCheckout() {
    alert("Payment Confirmed! Change: " + document.getElementById('change-display').innerText);
    cart = {};
    document.getElementById('cash-input').value = '';
    renderCart();
}

init();