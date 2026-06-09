# InventoryManagementApp

A simple JavaScript inventory management application that demonstrates:

- class design with `Product` and `PerishableProduct`
- async data loading using `Promise` and `setTimeout`
- search with `RegExp` and case-insensitive filtering
- inventory analytics using built-in `Math` methods
- JSON serialization/deserialization with `JSON.stringify()` and `JSON.parse()`
- an async restock simulation that updates inventory after a delay

## Files

- `inventory.js` — main application file containing classes, data loading, search, analytics, and async restock demo

## Run the project

From the project folder, run:

```bash
node inventory.js
```

You can also open `inventoryManagement.html` in a browser, then open the console to see the same output.

You should see output showing:

- loaded inventory items
- search results for sample keywords
- total inventory value
- most expensive and cheapest products
- expired item detection
- async restock result and updated inventory

## Notes

If you want to use just the class definitions or functions from another script, the file exports them for Node.js compatibility.
