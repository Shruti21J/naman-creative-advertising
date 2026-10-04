# Naman Creative Advertising — Business Website

A modern, premium, responsive B2B business website for **Naman Creative Advertising**, a company specializing in wholesale and bulk plastic manufacturing products.

**Tagline:** *Your Trusted B2B Plastic Products Partner.*

---

## Project Overview

This website serves as a professional online presence for Naman Creative Advertising. It showcases product categories, featured products, company information, and provides multiple channels for customers to request quotations via contact form, WhatsApp, and phone.

The site is built with pure HTML5, CSS3, and Vanilla JavaScript — no frameworks — making it lightweight, fast, and easy to maintain or extend with a backend later.

---

## Features

### Website Sections
- **Sticky Navigation Bar** — Logo, menu links, and "Get Quote" CTA
- **Hero Section** — Headline, description, CTAs, and business illustration
- **About Section** — Company overview with six specialization highlights
- **Product Categories** — Six responsive category cards with images
- **Featured Products** — Grid of 12 sample products with MOQ and quote buttons
- **Why Choose Us** — Six premium benefit cards
- **Customer Testimonials** — Three professional client reviews
- **Call to Action** — Bulk quotation section with WhatsApp and Call buttons
- **Contact Section** — Business details, map, and enquiry form
- **Footer** — Quick links, categories, contact info, and social media

### JavaScript Features
- Responsive hamburger menu with overlay
- Smooth scrolling with sticky header offset
- Active navigation highlight on scroll
- Scroll reveal animations (Intersection Observer)
- Back-to-top button
- Lazy image loading
- Contact form validation with accessible error messages
- Dynamic product rendering from a data array

### Design & UX
- Premium B2B corporate design (Blue, White, Grey palette)
- Mobile-first responsive layout
- Rounded corners, soft shadows, hover animations
- SEO-friendly meta tags and semantic HTML
- Accessibility: skip link, ARIA labels, focus states, reduced motion support

---

## Technology Stack

| Layer        | Technology                          |
|-------------|--------------------------------------|
| Markup      | HTML5 (Semantic)                     |
| Styling     | CSS3 (Custom Properties, Flexbox, Grid) |
| Scripting   | Vanilla JavaScript (ES5-compatible)  |
| Fonts       | Google Fonts — Inter                 |
| Images      | SVG illustrations + Unsplash placeholders |

**No frameworks or libraries used** — no React, Bootstrap, Tailwind, or jQuery.

---

## Current Version

**v1.0.0** — Initial production-ready frontend release.

---

## How to Run

### Option 1: Open Directly
1. Clone or download this repository.
2. Open `index.html` in any modern web browser (Chrome, Firefox, Edge, Safari).

### Option 2: Local Development Server (Recommended)
Using Python:
```bash
# Python 3
python -m http.server 8000

# Then visit http://localhost:8000
```

Using Node.js (npx):
```bash
npx serve .
```

Using VS Code / Cursor:
- Install the **Live Server** extension and click "Go Live".

> **Note:** A local server is recommended for lazy-loaded images and smooth development experience.

---

## Folder Structure

```
/
├── index.html              # Main HTML page (all sections)
├── css/
│   └── style.css           # Complete stylesheet with design tokens
├── js/
│   └── script.js           # Navigation, animations, form, products
├── images/
│   ├── hero-illustration.svg   # Custom hero SVG illustration
│   └── favicon.svg             # Site favicon
├── assets/                 # Reserved for future assets (PDFs, docs)
└── README.md               # Project documentation
```

---

## Future Improvements & Roadmap

This frontend is designed to integrate seamlessly with a **FastAPI** backend. Planned enhancements:

### Backend (FastAPI)
- REST API endpoints for products, categories, and enquiries
- **SQLAlchemy** ORM for database operations
- **SQLite** for development, **PostgreSQL** for production
- Authentication and admin authorization

### Features
- **Product Management** — CRUD operations for products and categories
- **Admin Dashboard** — Manage inventory, pricing, and content
- **Customer Enquiry Management** — View, respond to, and track form submissions
- **Dynamic Content** — Replace static product data with API-driven content
- **Email Notifications** — Auto-notify on new enquiry submissions

### Deployment
- **GitHub Pages** — Static frontend hosting
- **Render / Railway / VPS** — FastAPI backend hosting
- **Custom Domain** — Production domain setup with SSL

---

## Deployment (GitHub Pages)

1. Push the repository to GitHub.
2. Go to **Settings → Pages**.
3. Set source to `main` branch, root folder.
4. Save — the site will be live at `https://<username>.github.io/<repo-name>/`.

---

## Customization Guide

| What to change          | Where to edit                          |
|------------------------|----------------------------------------|
| Contact phone/WhatsApp | `index.html` (contact & CTA sections)  |
| Business address       | `index.html` (contact section)         |
| Products               | `js/script.js` → `PRODUCTS` array      |
| Colors & fonts         | `css/style.css` → `:root` variables    |
| Company text           | `index.html` (about, hero sections)    |

---

## License

This project is developed as a freelance business website for **Naman Creative Advertising**. All rights reserved.

---

## Developer

Developed as a freelance business website for **Naman Creative Advertising**.

For enquiries about this website, contact the development team or reach out via the business contact details on the live site.

---

*Built with care for performance, accessibility, and future scalability.*
