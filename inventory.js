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
