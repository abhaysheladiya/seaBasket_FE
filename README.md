# SeaBasket - E-Commerce Platform

SeaBasket is a modern e-commerce web application focused on product discovery, cart/checkout flow, account management, and order tracking.

## Project Summary

- Project Name: `SeaBasket`
- Primary Stack: `React (Next.js App Router)`, `Tailwind CSS`, `Git`
- Package Manager: `npm`

## Tech Stack and Versions

### Runtime and Tooling

- Node.js: `v24.12.0`
- npm: `11.6.2`
- TypeScript: `^5`
- Next.js: `16.1.6`
- React: `19.2.3`
- React DOM: `19.2.3`

### UI and Styling

- Tailwind CSS: `^4`
- `@tailwindcss/postcss`: `^4`
- Framer Motion: `^12.35.0`
- Lucide React: `^0.577.0`
- `class-variance-authority`: `^0.7.1`
- `clsx`: `^2.1.1`
- `tailwind-merge`: `^3.5.0`
- `tw-animate-css`: `^1.4.0`

### Data and State Utilities

- `@tanstack/react-query`: `^5.90.21`
- `redux-toolkit`: `^1.1.2`

### Quality and Linting

- Biome: `@biomejs/biome ^2.4.5`
- ESLint: `^9`
- `eslint-config-next`: `16.1.6`

## Authentication Features

Guest browsing

Login with Email + Password

OTP verification

Forgot password

Password reset via email link

Logout with confirmation

## Home Page Features

Header (Logo, Search, Profile, Cart, Login)

Product search bar

Trending products carousel

Category listing section

Category-based navigation

Footer with links

## Product Listing Features

Product grid/list view

Product card (Image, Name, Price, Rating, Discount)

Price range filter

Discount filter

Sort by Price (Low → High)

Sort by Price (High → Low)

Sort by Name

## Product Details Features

Product images gallery

Product description

Price & discount display

Ratings & reviews (add/view)

Add to cart

Buy now

## Cart Features

View added products

Update quantity

Remove product

Price summary

Checkout button

Guest checkout restriction

## Checkout Features

Shipping address selection

Add new shipping address

Payment method selection

Credit Card

Debit Card

UPI

Cash on Delivery

Order summary

Place order

## Profile Features

Update personal details (Name, Email, Mobile)

Manage shipping addresses

View order history

Logout option

## Order Features

Order details page

Order status stepper

Expected delivery date

Order summary

## Current Route Structure

Implemented/created routes in this codebase:

- `/` -> Home
- `/login` -> Login
- `/register` -> Register
- `/verification` -> OTP verification
- `/products` -> Product listing
- `/products/[ProductDetail]` -> Product details
- `/cart` -> Cart
- `/checkout` -> Checkout
- `/forgotpassword` -> Forgot password
- `/resetpassword` -> Reset password
- `/profile` -> Profile Page

## Environment Variables

Create a `.env.local` file in project root:

```env
NEXT_PUBLIC_BASE_API_URL=
```

## Getting Started

### 1. Clone the Repository

```bash
git clone https://gitlab.com/ketul.suthar-group/seabasket
cd seabasket
```

If your repository name is different, update the `cd` command accordingly.

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your API URL.

### 4. Start Development Server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Available Scripts

- `npm run dev` -> Start local development server
- `npm run build` -> Production build
- `npm run start` -> Run production server
- `npm run format` -> Format code with Biome
- `npm run lint` -> Lint code with Biome
- `npm run check` -> Lint + format fixes with Biome
