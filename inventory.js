// Inventory Management Application
// Implements Product and PerishableProduct classes, JSON load, RegExp search,
// inventory analytics, and async restock simulation.

class Product {
    // static counter to assign unique IDs to each product
    static count = 0;

    constructor(name, price, quantity) {
        this.id = ++Product.count;
        this.name = name;
        this.price = Number(price);
        this.quantity = Number(quantity);
    }

    // helper static method to format price to 2 decimal places
    static formatPrice(value) {
        return `$${Number(value).toFixed(2)}`;
    }

    // return descriptive string for product
    getInfo() {
        return `Product: ${this.name}, Price: ${Product.formatPrice(this.price)}, Qty: ${this.quantity}`;
    }
}

class PerishableProduct extends Product {
    constructor(name, price, quantity, expirationDate) {
        super(name, price, quantity);
        // store as ISO string for consistent parsing
        this.expirationDate = expirationDate ? new Date(expirationDate).toISOString() : null;
    }

    // override getInfo to include expiration date
    getInfo() {
        const exp = this.expirationDate ? new Date(this.expirationDate).toISOString().slice(0, 10) : 'N/A';
        return `Perishable: ${this.name}, Price: ${Product.formatPrice(this.price)}, Qty: ${this.quantity}, Expires: ${exp}`;
    }

    // checks whether the product is expired relative to now
    isExpired() {
        if (!this.expirationDate) return false;
        const now = new Date();
        return new Date(this.expirationDate) < now;
    }
}

// Export classes for possible imports (works in Node + bundlers)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Product, PerishableProduct };
}

// Initial product data (represented as JavaScript objects)
const initialData = [
    { name: 'Milk', price: 3.5, quantity: 10, expirationDate: '2025-05-01' },
    { name: 'Bread', price: 2.0, quantity: 20, expirationDate: '2025-04-15' },
    { name: 'Laptop', price: 1200, quantity: 5 },
    { name: 'Eggs', price: 0.2, quantity: 60, expirationDate: '2024-12-01' },
    { name: 'Coffee', price: 8.99, quantity: 15 },
    { name: 'Yogurt', price: 1.25, quantity: 12, expirationDate: '2024-11-05' }
];

// Simulate fetching the inventory JSON asynchronously
function loadInventory() {
    return new Promise((resolve) => {
        const json = JSON.stringify(initialData);
        setTimeout(() => resolve(json), 500); // 500ms simulated delay
    });
}

// Export loader for Node usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports.loadInventory = loadInventory;
}

// Runtime inventory (array of Product / PerishableProduct instances)
const inventory = [];

// Build inventory instances from parsed data array
function buildInventoryFromData(dataArray) {
    inventory.length = 0; // clear
    for (const item of dataArray) {
        if (item.expirationDate) {
            inventory.push(new PerishableProduct(item.name, item.price, item.quantity, item.expirationDate));
        } else {
            inventory.push(new Product(item.name, item.price, item.quantity));
        }
    }
}

// Escape regex special chars in user input
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Search inventory by keyword (case-insensitive) using RegExp
function searchInventory(keyword) {
    if (!keyword || typeof keyword !== 'string') return [];
    const escaped = escapeRegExp(keyword);
    const regex = new RegExp(escaped, 'i');
    return inventory.filter((p) => regex.test(p.name));
}

// List only perishable items
function listPerishables() {
    return inventory.filter((p) => p instanceof PerishableProduct);
}

// Export runtime functions for Node usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports.inventory = inventory;
    module.exports.buildInventoryFromData = buildInventoryFromData;
    module.exports.searchInventory = searchInventory;
    module.exports.listPerishables = listPerishables;
}
