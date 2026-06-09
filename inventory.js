// JavaScript Essentials SBA project: simple inventory management app.
// Includes Product and PerishableProduct classes, JSON loading, RegExp search,
// inventory analytics, and an async restock example.

class Product {
    // count how many products were created
    static count = 0;

    constructor(name, price, quantity) {
        this.id = ++Product.count;
        this.name = name;
        this.price = Number(price);
        this.quantity = Number(quantity);
    }

    // format a number as a dollar price
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

// Simulate fetching inventory data from a database or API
function loadInventory() {
    return new Promise((resolve) => {
        const json = JSON.stringify(initialData);
        setTimeout(() => resolve(json), 500); // simulated delay
    });
}

// Export loader for Node usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports.loadInventory = loadInventory;
}

// Runtime inventory (array of Product / PerishableProduct instances)
const inventory = [];

// Convert raw data objects into Product or PerishableProduct instances
function buildInventoryFromData(dataArray) {
    inventory.length = 0; // clear old inventory
    for (const item of dataArray) {
        if (item.expirationDate) {
            inventory.push(new PerishableProduct(item.name, item.price, item.quantity, item.expirationDate));
        } else {
            inventory.push(new Product(item.name, item.price, item.quantity));
        }
    }
}

// Escape user search input so it is safe inside RegExp
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

// Return only perishable products from the inventory
function listPerishables() {
    return inventory.filter((p) => p instanceof PerishableProduct);
}

// logging helper that writes output to both console and browser page
function logMessage(message = '') {
    console.log(message);
    if (typeof document !== 'undefined') {
        const output = document.getElementById('output');
        if (output) {
            const block = document.createElement('pre');
            block.textContent = message;
            output.appendChild(block);
        }
    }
}

// Export runtime functions for Node usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports.inventory = inventory;
    module.exports.buildInventoryFromData = buildInventoryFromData;
    module.exports.searchInventory = searchInventory;
    module.exports.listPerishables = listPerishables;
    module.exports.logMessage = logMessage;
}

// Analytics: total inventory value, most/least expensive, expired items
function totalInventoryValue() {
    const total = inventory.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    return Math.round(total * 100) / 100; // round to 2 decimals
}

function mostExpensiveProduct() {
    if (inventory.length === 0) return null;
    return inventory.reduce((best, p) => (p.price > best.price ? p : best), inventory[0]);
}

function cheapestProduct() {
    if (inventory.length === 0) return null;
    return inventory.reduce((best, p) => (p.price < best.price ? p : best), inventory[0]);
}

function expiredProducts() {
    return inventory.filter((p) => p instanceof PerishableProduct && p.isExpired());
}

// Simulate an async restock operation that updates a product after a delay
function restockProduct(productName, addQuantity) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const regex = new RegExp(escapeRegExp(productName), 'i');
            const product = inventory.find((p) => regex.test(p.name));
            if (!product) {
                return reject(new Error(`Product not found: ${productName}`));
            }
            product.quantity += Number(addQuantity);
            resolve(product);
        }, 2000);
    });
}

// Demo runner: loads inventory, prints summary, runs searches, and restocks
async function runDemo() {
    logMessage('Loading inventory...');
    const json = await loadInventory();
    const data = JSON.parse(json);
    buildInventoryFromData(data);
    logMessage(`Loaded ${inventory.length} products into inventory.`);

    logMessage('\nInventory items:');
    inventory.forEach((item) => logMessage(` - ${item.getInfo()}`));

    const searchTerms = ['lap', 'milk', 'COF'];
    for (const term of searchTerms) {
        const found = searchInventory(term);
        logMessage(`\nSearch results for '${term}':`);
        if (found.length === 0) {
            logMessage('  No products found.');
        } else {
            found.forEach((item) => logMessage(`  ${item.getInfo()}`));
        }
    }

    logMessage(`\nTotal inventory value: ${Product.formatPrice(totalInventoryValue())}`);
    const expensive = mostExpensiveProduct();
    const cheap = cheapestProduct();
    if (expensive) logMessage(`Most expensive product: ${expensive.getInfo()}`);
    if (cheap) logMessage(`Cheapest product: ${cheap.getInfo()}`);

    const expired = expiredProducts();
    if (expired.length > 0) {
        logMessage('\nExpired products:');
        expired.forEach((item) => logMessage(`  ${item.getInfo()}`));
    } else {
        logMessage('\nNo expired products found.');
    }

    logMessage('\nStarting restock for Milk (+5) ...');
    logMessage('Program continues while async restock runs...');
    try {
        const updated = await restockProduct('Milk', 5);
        logMessage(`Restocked ${updated.name}, new quantity: ${updated.quantity}`);
    } catch (error) {
        logMessage(`Restock failed: ${error.message}`);
    }

    logMessage('\nFinal inventory:');
    inventory.forEach((item) => logMessage(` - ${item.getInfo()}`));
}

// Run demo when executed in Node or loaded in the browser
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof runDemo === 'function') {
            runDemo();
        }
    });
} else if (typeof process !== 'undefined' && process.argv && process.argv[1] && process.argv[1].endsWith('inventory.js')) {
    runDemo();
}

// Export analytics and async runner
if (typeof module !== 'undefined' && module.exports) {
    module.exports.totalInventoryValue = totalInventoryValue;
    module.exports.mostExpensiveProduct = mostExpensiveProduct;
    module.exports.cheapestProduct = cheapestProduct;
    module.exports.expiredProducts = expiredProducts;
    module.exports.restockProduct = restockProduct;
    module.exports.runDemo = runDemo;
}

/*
Example console output when running this app:
- Loaded 6 inventory products
- Printed product info lines
- Found matches using searchInventory('lap'), searchInventory('milk'), searchInventory('COF')
- Calculated total inventory value
- Found the most expensive and cheapest products
- Checked perishable products for expired items
- Ran async restock for Milk and showed the new quantity
*/
