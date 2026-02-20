import { useState, useEffect, useRef } from "react";

// ─── MOCK DATA (would come from MongoDB via Express API) ───────────────────
const PRODUCTS = [
  { id: 1, name: "Rambler 30 oz Tumbler", price: 38, category: "Drinkware", badge: "Best Seller", img: "🥤", color: "#1a1a2e", desc: "Double-wall vacuum insulation keeps drinks cold 24 hrs, hot 6 hrs." },
  { id: 2, name: "Tundra 45 Cooler", price: 325, category: "Coolers", badge: "New", img: "🧊", color: "#0f3460", desc: "Rotomolded construction. Bear-resistant certified. Keeps ice for 5+ days." },
  { id: 3, name: "Hopper Flip 18", price: 250, category: "Coolers", badge: "", img: "🏕️", color: "#16213e", desc: "Leakproof top handle soft cooler, DryHide Shell." },
  { id: 4, name: "Rambler 64 oz Jug", price: 60, category: "Drinkware", badge: "Popular", img: "🫙", color: "#533483", desc: "Half gallon of cold refreshment. MagCap closure." },
  { id: 5, name: "LoadOut GoBox 30", price: 250, category: "Gear", badge: "", img: "📦", color: "#2c2c54", desc: "Rugged, organized gear storage for every adventure." },
  { id: 6, name: "Crossroads 35L Backpack", price: 300, category: "Bags", badge: "New", img: "🎒", color: "#1a1a2e", desc: "All-terrain backpack built for work and beyond." },
  { id: 7, name: "Camino 50 Carryall", price: 200, category: "Bags", badge: "", img: "👜", color: "#0f3460", desc: "Waterproof carryall for gear, groceries, or whatever life throws." },
  { id: 8, name: "Trailhead Dog Bed", price: 200, category: "Gear", badge: "New", img: "🐕", color: "#16213e", desc: "Tough, washable, adventure-ready dog bed." },
];

const CATEGORIES = ["All", "Coolers", "Drinkware", "Bags", "Gear"];

const HERO_SLIDES = [
  { title: "Built for the Wild", sub: "Coolers & drinkware engineered to outlast your adventure.", cta: "Shop Coolers", bg: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)" },
  { title: "Keep It Cold. Keep It Real.", sub: "YETI Rambler — the tumbler that goes everywhere you do.", cta: "Shop Drinkware", bg: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)" },
  { title: "Gear That Doesn't Quit", sub: "From summit to sea, YETI has your back.", cta: "Shop Gear", bg: "linear-gradient(135deg, #2c2c54, #1a1a2e, #0f3460)" },
];

// ─── STYLES ────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --black: #0a0a0a;
    --dark: #111118;
    --card: #16161e;
    --accent: #e8c547;
    --accent2: #4ecdc4;
    --text: #f0f0f0;
    --muted: #888;
    --border: rgba(255,255,255,0.08);
    --radius: 12px;
    --nav-h: 64px;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--black);
    color: var(--text);
    overflow-x: hidden;
  }

  /* ── NAV ── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    height: var(--nav-h);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 5%;
    background: rgba(10,10,10,0.85);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
    transition: background .3s;
  }
  .nav-logo {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2rem;
    letter-spacing: 4px;
    color: var(--accent);
    cursor: pointer;
    user-select: none;
  }
  .nav-links {
    display: flex; gap: 2rem; list-style: none;
  }
  .nav-links a {
    color: var(--text); text-decoration: none; font-size: 0.85rem;
    font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase;
    opacity: 0.8; transition: opacity .2s, color .2s;
  }
  .nav-links a:hover { opacity: 1; color: var(--accent); }
  .nav-actions { display: flex; gap: 1rem; align-items: center; }
  .nav-btn {
    background: none; border: none; color: var(--text); cursor: pointer;
    font-size: 1.3rem; position: relative; transition: color .2s;
  }
  .nav-btn:hover { color: var(--accent); }
  .cart-badge {
    position: absolute; top: -6px; right: -8px;
    background: var(--accent); color: var(--black);
    font-size: 0.6rem; font-weight: 700;
    width: 18px; height: 18px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
  }
  .hamburger {
    display: none; background: none; border: none;
    color: var(--text); font-size: 1.5rem; cursor: pointer;
  }

  /* ── MOBILE NAV ── */
  .mobile-menu {
    position: fixed; top: var(--nav-h); left: 0; right: 0; z-index: 99;
    background: rgba(10,10,10,0.97);
    backdrop-filter: blur(20px);
    padding: 2rem 5%;
    display: flex; flex-direction: column; gap: 1.5rem;
    transform: translateY(-110%);
    transition: transform .35s cubic-bezier(.4,0,.2,1);
    border-bottom: 1px solid var(--border);
  }
  .mobile-menu.open { transform: translateY(0); }
  .mobile-menu a {
    color: var(--text); text-decoration: none;
    font-size: 1.2rem; font-weight: 500;
    letter-spacing: 2px; text-transform: uppercase;
    border-bottom: 1px solid var(--border); padding-bottom: 1rem;
    transition: color .2s;
  }
  .mobile-menu a:hover { color: var(--accent); }

  /* ── HERO ── */
  .hero {
    height: 100svh; min-height: 560px;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center;
    padding: 0 5%;
    position: relative; overflow: hidden;
    transition: background 0.8s ease;
  }
  .hero::before {
    content: ''; position: absolute; inset: 0;
    background: inherit;
    animation: heroPulse 8s ease-in-out infinite alternate;
  }
  @keyframes heroPulse {
    from { transform: scale(1); }
    to { transform: scale(1.04); }
  }
  .hero-content { position: relative; z-index: 2; max-width: 700px; }
  .hero-tag {
    font-size: 0.75rem; letter-spacing: 4px; text-transform: uppercase;
    color: var(--accent); font-weight: 600;
    background: rgba(232,197,71,0.12);
    padding: 6px 16px; border-radius: 20px;
    border: 1px solid rgba(232,197,71,0.3);
    display: inline-block; margin-bottom: 1.5rem;
    animation: fadeUp 0.6s ease both;
  }
  .hero h1 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3.5rem, 12vw, 9rem);
    line-height: 0.9;
    letter-spacing: 2px;
    animation: fadeUp 0.7s 0.1s ease both;
    text-shadow: 0 0 60px rgba(232,197,71,0.15);
  }
  .hero h1 span { color: var(--accent); }
  .hero p {
    margin: 1.5rem 0 2.5rem;
    font-size: clamp(0.9rem, 2.5vw, 1.15rem);
    color: rgba(240,240,240,0.75);
    font-weight: 300;
    line-height: 1.6;
    animation: fadeUp 0.7s 0.2s ease both;
  }
  .hero-btns {
    display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;
    animation: fadeUp 0.7s 0.3s ease both;
  }
  .btn-primary {
    background: var(--accent); color: var(--black);
    border: none; padding: 14px 32px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase;
    border-radius: 4px; cursor: pointer;
    transition: transform .2s, box-shadow .2s;
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(232,197,71,0.4); }
  .btn-outline {
    background: transparent; color: var(--text);
    border: 1px solid rgba(240,240,240,0.3);
    padding: 14px 32px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem; font-weight: 500;
    letter-spacing: 2px; text-transform: uppercase;
    border-radius: 4px; cursor: pointer;
    transition: border-color .2s, color .2s;
  }
  .btn-outline:hover { border-color: var(--accent); color: var(--accent); }

  /* HERO DOTS */
  .hero-dots {
    position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%);
    display: flex; gap: 8px; z-index: 3;
  }
  .hero-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: rgba(240,240,240,0.3);
    cursor: pointer; border: none;
    transition: background .3s, transform .3s;
  }
  .hero-dot.active { background: var(--accent); transform: scale(1.3); }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* ── SECTION ── */
  .section { padding: 5rem 5%; }
  .section-header {
    display: flex; align-items: flex-end; justify-content: space-between;
    margin-bottom: 3rem; flex-wrap: wrap; gap: 1rem;
  }
  .section-label {
    font-size: 0.7rem; letter-spacing: 4px; text-transform: uppercase;
    color: var(--accent); font-weight: 600; margin-bottom: 0.5rem;
  }
  .section-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2.2rem, 5vw, 3.5rem);
    line-height: 1; letter-spacing: 1px;
  }
  .see-all {
    background: none; border: 1px solid var(--border);
    color: var(--muted); font-size: 0.8rem;
    letter-spacing: 2px; text-transform: uppercase;
    padding: 10px 20px; border-radius: 4px; cursor: pointer;
    transition: border-color .2s, color .2s; white-space: nowrap;
    font-family: 'DM Sans', sans-serif;
  }
  .see-all:hover { border-color: var(--accent); color: var(--accent); }

  /* ── CATEGORY FILTER ── */
  .filters {
    display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 3rem;
  }
  .filter-btn {
    background: none;
    border: 1px solid var(--border);
    color: var(--muted); font-size: 0.8rem;
    letter-spacing: 1.5px; text-transform: uppercase;
    padding: 8px 20px; border-radius: 30px; cursor: pointer;
    transition: all .2s; font-family: 'DM Sans', sans-serif;
    font-weight: 500;
  }
  .filter-btn.active, .filter-btn:hover {
    background: var(--accent); color: var(--black);
    border-color: var(--accent);
  }

  /* ── PRODUCT GRID ── */
  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1.5rem;
  }
  .product-card {
    background: var(--card);
    border-radius: var(--radius);
    border: 1px solid var(--border);
    overflow: hidden; cursor: pointer;
    transition: transform .3s, box-shadow .3s, border-color .3s;
    position: relative;
  }
  .product-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    border-color: rgba(232,197,71,0.3);
  }
  .product-img {
    height: 200px;
    display: flex; align-items: center; justify-content: center;
    font-size: 5rem;
    transition: transform .4s;
    position: relative;
  }
  .product-card:hover .product-img { transform: scale(1.06); }
  .product-badge {
    position: absolute; top: 12px; left: 12px;
    background: var(--accent); color: var(--black);
    font-size: 0.65rem; font-weight: 700;
    letter-spacing: 1.5px; text-transform: uppercase;
    padding: 4px 10px; border-radius: 3px;
  }
  .product-info { padding: 1.25rem; }
  .product-category {
    font-size: 0.65rem; letter-spacing: 2px;
    text-transform: uppercase; color: var(--accent2);
    font-weight: 600; margin-bottom: 0.4rem;
  }
  .product-name {
    font-size: 1rem; font-weight: 600;
    margin-bottom: 0.4rem; line-height: 1.3;
  }
  .product-desc {
    font-size: 0.8rem; color: var(--muted);
    line-height: 1.5; margin-bottom: 1rem;
  }
  .product-footer {
    display: flex; align-items: center; justify-content: space-between;
  }
  .product-price {
    font-size: 1.2rem; font-weight: 700; color: var(--accent);
  }
  .add-btn {
    background: var(--accent); color: var(--black);
    border: none; width: 36px; height: 36px;
    border-radius: 50%; cursor: pointer; font-size: 1.2rem;
    display: flex; align-items: center; justify-content: center;
    transition: transform .2s, box-shadow .2s;
    font-weight: 700;
  }
  .add-btn:hover { transform: scale(1.15); box-shadow: 0 4px 15px rgba(232,197,71,0.5); }
  .add-btn.added { background: var(--accent2); }

  /* ── FEATURES BAND ── */
  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1px;
    background: var(--border);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }
  .feature {
    background: var(--dark); padding: 2.5rem;
    text-align: center;
    transition: background .2s;
  }
  .feature:hover { background: #1c1c24; }
  .feature-icon { font-size: 2.5rem; margin-bottom: 1rem; }
  .feature-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.2rem; letter-spacing: 2px;
    margin-bottom: 0.5rem; color: var(--text);
  }
  .feature p { font-size: 0.82rem; color: var(--muted); line-height: 1.6; }

  /* ── BANNER ── */
  .banner {
    margin: 5rem 5%;
    border-radius: 16px; overflow: hidden;
    position: relative; min-height: 300px;
    display: flex; align-items: center;
    background: linear-gradient(135deg, #0f3460, #533483);
    padding: 4rem 5%;
  }
  .banner::after {
    content: '';
    position: absolute; right: 0; top: 0; bottom: 0; width: 50%;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='80' cy='50' r='40' fill='none' stroke='rgba(255,255,255,0.05)' stroke-width='20'/%3E%3C/svg%3E") center/cover;
  }
  .banner-content { position: relative; z-index: 1; max-width: 500px; }
  .banner h2 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2rem, 5vw, 3.5rem);
    line-height: 1; letter-spacing: 2px;
    margin-bottom: 1rem;
  }
  .banner p { font-size: 1rem; color: rgba(240,240,240,0.75); margin-bottom: 2rem; line-height: 1.6; }

  /* ── CART DRAWER ── */
  .overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(4px);
    opacity: 0; pointer-events: none;
    transition: opacity .3s;
  }
  .overlay.open { opacity: 1; pointer-events: all; }
  .cart-drawer {
    position: fixed; top: 0; right: 0; bottom: 0; z-index: 201;
    width: min(420px, 100vw);
    background: var(--card);
    border-left: 1px solid var(--border);
    display: flex; flex-direction: column;
    transform: translateX(100%);
    transition: transform .35s cubic-bezier(.4,0,.2,1);
  }
  .cart-drawer.open { transform: translateX(0); }
  .cart-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.5rem 1.5rem;
    border-bottom: 1px solid var(--border);
  }
  .cart-header h3 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.5rem; letter-spacing: 2px;
  }
  .close-btn {
    background: none; border: none; color: var(--muted);
    font-size: 1.5rem; cursor: pointer; transition: color .2s;
  }
  .close-btn:hover { color: var(--accent); }
  .cart-items { flex: 1; overflow-y: auto; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
  .cart-item {
    display: flex; gap: 1rem; align-items: center;
    background: var(--dark); border-radius: 8px; padding: 1rem;
    border: 1px solid var(--border);
  }
  .cart-item-emoji { font-size: 2.5rem; min-width: 50px; text-align: center; }
  .cart-item-info { flex: 1; }
  .cart-item-name { font-size: 0.9rem; font-weight: 600; margin-bottom: 0.25rem; }
  .cart-item-price { font-size: 0.85rem; color: var(--accent); font-weight: 700; }
  .cart-item-qty { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem; }
  .qty-btn {
    width: 26px; height: 26px; border-radius: 50%;
    background: var(--border); border: 1px solid var(--border);
    color: var(--text); cursor: pointer; font-size: 1rem;
    display: flex; align-items: center; justify-content: center;
    transition: background .2s;
  }
  .qty-btn:hover { background: var(--accent); color: var(--black); }
  .qty-num { font-size: 0.85rem; font-weight: 600; min-width: 20px; text-align: center; }
  .remove-btn { background: none; border: none; color: var(--muted); cursor: pointer; font-size: 1rem; transition: color .2s; }
  .remove-btn:hover { color: #ff6b6b; }
  .cart-footer { padding: 1.5rem; border-top: 1px solid var(--border); }
  .cart-total {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 1.5rem;
    font-size: 1.1rem; font-weight: 600;
  }
  .cart-total-price { font-size: 1.4rem; color: var(--accent); font-weight: 700; }
  .empty-cart { text-align: center; color: var(--muted); padding: 3rem 0; }
  .empty-cart p { font-size: 3rem; margin-bottom: 1rem; }

  /* ── TOAST ── */
  .toast {
    position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%) translateY(80px);
    background: var(--card); border: 1px solid var(--accent);
    color: var(--text); padding: 12px 24px;
    border-radius: 30px; font-size: 0.85rem; font-weight: 500;
    z-index: 300; white-space: nowrap;
    transition: transform .3s, opacity .3s;
    opacity: 0;
  }
  .toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }

  /* ── FOOTER ── */
  footer {
    background: var(--dark);
    border-top: 1px solid var(--border);
    padding: 4rem 5% 2rem;
  }
  .footer-grid {
    display: grid;
    grid-template-columns: 2fr repeat(3, 1fr);
    gap: 3rem; margin-bottom: 3rem;
  }
  .footer-brand .logo {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2rem; letter-spacing: 4px; color: var(--accent);
    margin-bottom: 1rem;
  }
  .footer-brand p { font-size: 0.85rem; color: var(--muted); line-height: 1.7; max-width: 280px; }
  .footer-col h4 {
    font-size: 0.7rem; letter-spacing: 3px; text-transform: uppercase;
    color: var(--text); font-weight: 700; margin-bottom: 1.2rem;
  }
  .footer-col a {
    display: block; color: var(--muted); text-decoration: none;
    font-size: 0.85rem; margin-bottom: 0.7rem; transition: color .2s;
  }
  .footer-col a:hover { color: var(--accent); }
  .footer-bottom {
    border-top: 1px solid var(--border); padding-top: 2rem;
    display: flex; justify-content: space-between; align-items: center;
    flex-wrap: wrap; gap: 1rem;
    font-size: 0.78rem; color: var(--muted);
  }
  .social-links { display: flex; gap: 1rem; }
  .social-btn {
    width: 36px; height: 36px; border-radius: 50%;
    background: var(--border); border: 1px solid var(--border);
    color: var(--text); font-size: 1rem; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background .2s, border-color .2s;
  }
  .social-btn:hover { background: var(--accent); border-color: var(--accent); color: var(--black); }

  /* ── MEDIA QUERIES ── */
  @media (max-width: 1024px) {
    .footer-grid { grid-template-columns: repeat(2, 1fr); }
    .footer-brand { grid-column: 1 / -1; }
  }

  @media (max-width: 768px) {
    :root { --nav-h: 56px; }
    .nav-links { display: none; }
    .hamburger { display: block; }
    .product-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; }
    .product-img { height: 150px; font-size: 3.5rem; }
    .banner { margin: 3rem 5%; padding: 3rem; }
    .section { padding: 3rem 5%; }
    .features { grid-template-columns: repeat(2, 1fr); }
    .footer-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
    .footer-brand { grid-column: auto; }
  }

  @media (max-width: 480px) {
    .product-grid { grid-template-columns: 1fr 1fr; gap: 0.75rem; }
    .product-img { height: 130px; font-size: 3rem; }
    .product-info { padding: 0.9rem; }
    .product-name { font-size: 0.88rem; }
    .product-desc { display: none; }
    .features { grid-template-columns: 1fr; }
    .footer-grid { grid-template-columns: 1fr; }
    .banner { flex-direction: column; text-align: center; padding: 2.5rem; }
    .hero-btns { flex-direction: column; align-items: center; }
    .btn-primary, .btn-outline { width: 100%; max-width: 280px; }
    .section-header { flex-direction: column; align-items: flex-start; }
  }

  @media (max-width: 360px) {
    .product-grid { grid-template-columns: 1fr; }
    .product-img { height: 180px; }
    .product-desc { display: block; }
  }

  /* scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--black); }
  ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--accent); }
`;

// ─── COMPONENTS ────────────────────────────────────────────────────────────

function CartDrawer({ cart, open, onClose, onQty, onRemove }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <>
      <div className={`overlay ${open ? "open" : ""}`} onClick={onClose} />
      <div className={`cart-drawer ${open ? "open" : ""}`}>
        <div className="cart-header">
          <h3>Your Cart ({cart.reduce((s,i)=>s+i.qty,0)})</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-cart"><p>🛒</p><span>Your cart is empty</span></div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-emoji">{item.img}</div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">${item.price}</div>
                  <div className="cart-item-qty">
                    <button className="qty-btn" onClick={() => onQty(item.id, -1)}>−</button>
                    <span className="qty-num">{item.qty}</span>
                    <button className="qty-btn" onClick={() => onQty(item.id, 1)}>+</button>
                  </div>
                </div>
                <button className="remove-btn" onClick={() => onRemove(item.id)}>🗑</button>
              </div>
            ))
          )}
        </div>
        <div className="cart-footer">
          <div className="cart-total">
            <span>Total</span>
            <span className="cart-total-price">${total.toFixed(2)}</span>
          </div>
          <button className="btn-primary" style={{width:"100%",textAlign:"center"}} disabled={cart.length===0}>
            Checkout →
          </button>
        </div>
      </div>
    </>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────
export default function App() {
  const [slide, setSlide] = useState(0);
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [added, setAdded] = useState({});
  const [toast, setToast] = useState({ show: false, msg: "" });
  const slideTimer = useRef(null);

  // auto-advance hero
  useEffect(() => {
    slideTimer.current = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(slideTimer.current);
  }, []);

  const goSlide = (i) => {
    clearInterval(slideTimer.current);
    setSlide(i);
    slideTimer.current = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 5000);
  };

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  };

  const addToCart = (product) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id);
      if (ex) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    setAdded(a => ({ ...a, [product.id]: true }));
    setTimeout(() => setAdded(a => ({ ...a, [product.id]: false })), 1000);
    showToast(`${product.name} added to cart!`);
  };

  const adjustQty = (id, delta) => {
    setCart(prev => {
      const updated = prev.map(i => i.id === id ? { ...i, qty: i.qty + delta } : i);
      return updated.filter(i => i.qty > 0);
    });
  };

  const removeItem = (id) => setCart(prev => prev.filter(i => i.id !== id));

  const filtered = category === "All" ? PRODUCTS : PRODUCTS.filter(p => p.category === category);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const current = HERO_SLIDES[slide];

  return (
    <>
      <style>{css}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo">YETI</div>
        <ul className="nav-links">
          {["Coolers","Drinkware","Bags","Gear","Sale"].map(l => (
            <li key={l}><a href="#products" onClick={() => setCategory(l === "Sale" ? "All" : l)}>{l}</a></li>
          ))}
        </ul>
        <div className="nav-actions">
          <button className="nav-btn" title="Search">🔍</button>
          <button className="nav-btn" onClick={() => setCartOpen(true)} title="Cart">
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          <button className="hamburger" onClick={() => setMenuOpen(m => !m)}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {["Coolers","Drinkware","Bags","Gear","About","Sale"].map(l => (
          <a key={l} href="#products" onClick={() => { setCategory(l === "Sale" || l === "About" ? "All" : l); setMenuOpen(false); }}>
            {l}
          </a>
        ))}
      </div>

      {/* HERO */}
      <section className="hero" style={{ background: current.bg }}>
        <div className="hero-content">
          <div className="hero-tag">New Season Drop</div>
          <h1>
            {current.title.split(" ").map((w, i) =>
              i === 1 ? <span key={i}> {w} </span> : w + " "
            )}
          </h1>
          <p>{current.sub}</p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => document.getElementById("products").scrollIntoView({behavior:"smooth"})}>
              {current.cta}
            </button>
            <button className="btn-outline">Learn More</button>
          </div>
        </div>
        <div className="hero-dots">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} className={`hero-dot ${i === slide ? "active" : ""}`} onClick={() => goSlide(i)} />
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <div className="features">
        {[
          { icon: "🧊", title: "5-Day Ice Retention", text: "Rotomolded walls keep ice frozen through the hottest days." },
          { icon: "🔒", title: "Bear Certified", text: "Tested and approved by the IGBC. Tough enough for the wild." },
          { icon: "🌊", title: "Waterproof Zippers", text: "HydroLok technology seals out water completely." },
          { icon: "♻️", title: "Built to Last", text: "Lifetime warranty. One cooler, thousands of adventures." },
        ].map(f => (
          <div className="feature" key={f.title}>
            <div className="feature-icon">{f.icon}</div>
            <div className="feature-title">{f.title}</div>
            <p>{f.text}</p>
          </div>
        ))}
      </div>

      {/* PRODUCTS */}
      <section className="section" id="products">
        <div className="section-header">
          <div>
            <div className="section-label">Featured Collection</div>
            <h2 className="section-title">Built Different</h2>
          </div>
          <button className="see-all" onClick={() => setCategory("All")}>View All</button>
        </div>
        <div className="filters">
          {CATEGORIES.map(c => (
            <button key={c} className={`filter-btn ${category === c ? "active" : ""}`} onClick={() => setCategory(c)}>
              {c}
            </button>
          ))}
        </div>
        <div className="product-grid">
          {filtered.map(p => (
            <div key={p.id} className="product-card">
              {p.badge && <span className="product-badge">{p.badge}</span>}
              <div className="product-img" style={{ background: `${p.color}33` }}>
                {p.img}
              </div>
              <div className="product-info">
                <div className="product-category">{p.category}</div>
                <div className="product-name">{p.name}</div>
                <div className="product-desc">{p.desc}</div>
                <div className="product-footer">
                  <span className="product-price">${p.price}</span>
                  <button
                    className={`add-btn ${added[p.id] ? "added" : ""}`}
                    onClick={() => addToCart(p)}
                    title="Add to cart"
                  >
                    {added[p.id] ? "✓" : "+"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROMO BANNER */}
      <div className="banner">
        <div className="banner-content">
          <div className="section-label">Limited Time</div>
          <h2>Free Shipping<br />on Orders $99+</h2>
          <p>Adventure awaits — and now it ships for free. Stock up on your favorite YETI gear today.</p>
          <button className="btn-primary" onClick={() => document.getElementById("products").scrollIntoView({behavior:"smooth"})}>
            Shop Now →
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">YETI</div>
            <p>YETI was founded in 2006 with one simple mission: build the cooler we'd use every day. Today that same mission drives every product we make.</p>
          </div>
          <div className="footer-col">
            <h4>Shop</h4>
            {["Coolers","Drinkware","Bags","Gear","Accessories","Sale"].map(l=><a key={l} href="#products">{l}</a>)}
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            {["FAQ","Warranty","Returns","Order Status","Contact Us","Stores"].map(l=><a key={l} href="#">{l}</a>)}
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            {["About YETI","Sustainability","Careers","Press","Ambassadors","Blog"].map(l=><a key={l} href="#">{l}</a>)}
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 YETI Clone — Demo Project</span>
          <div className="social-links">
            {["𝕏","in","f","▶"].map(s=><button key={s} className="social-btn">{s}</button>)}
          </div>
        </div>
      </footer>

      {/* CART */}
      <CartDrawer cart={cart} open={cartOpen} onClose={() => setCartOpen(false)} onQty={adjustQty} onRemove={removeItem} />

      {/* TOAST */}
      <div className={`toast ${toast.show ? "show" : ""}`}>✓ {toast.msg}</div>
    </>
  );
}
