# SneakerVerse

A simple, responsive e-commerce style website built for my Web Development final project.

## 🔹 Project Overview
SneakerVerse is a sneaker showcase and shopping site demonstrating core front-end development concepts:

- **Multi-page website** (Home, Products, About, Contact, Cart, Checkout)
- Responsive layout with **Bootstrap 5**
- Interactivity using **JavaScript & jQuery**
- **Ajax** used to load products and simulate form submissions
- **LocalStorage** for the shopping cart
- Simple and clean UI for easy use

## 🚀 Features
- **Home page** — hero section and featured sneakers (fades in).
- **Products page** — search, filter by brand, sort by name/price, add to cart.
- **Cart page** — adjust quantities, remove items, clear cart, proceed to checkout.
- **Checkout page** — shows order summary, form validation, order success message.
- **Contact page** — contact form with jQuery validation and Ajax submit (mock endpoint).

## 🛠️ Technologies Used
- **HTML5 & CSS3** — semantic structure and custom styling (`styles.css`).
- **Bootstrap 5** — responsive grid, navbar, cards, forms, buttons.
- **JavaScript (ES6)** — DOM manipulation, event handling.
- **jQuery** — animations, Ajax, form validation.
- **Ajax & JSON** — load product data (`sneakers.json`) and mock contact form submission.
- **LocalStorage** — persistent shopping cart.

## 📂 File Structure
index.html
products.html
about.html
contact.html
cart.html
checkout.html
sneakers.json
mock-endpoint.json
styles.css
script.js



## ▶️ How to Run
### Option 1 — Quick Open
1. Download or clone the repository.
2. Open `index.html` directly in a web browser.
   - If your browser blocks Ajax when opened as a file, use Option 2.

### Option 2 — Local Server (recommended)
1. Open a terminal in the project folder.
2. Run a simple server (if Python is installed)


🧪 Test Flow
Home → “Shop Now” → Products

Search/filter/sort → Add to cart

Cart → update quantity / remove / clear → Proceed to checkout

Checkout → fill form → Place Order → success message, cart clears.

Contact → fill valid info → Send Message → success alert (mock Ajax).
