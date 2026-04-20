import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; background: #f8faf6; color: #1a2e1a; }
  .app { min-height: 100vh; }
  .nav { background: #fff; border-bottom: 1px solid #e8f0e8; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
  .nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; height: 60px; display: flex; align-items: center; justify-content: space-between; }
  .logo { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 18px; color: #1a6b2e; cursor: pointer; }
  .logo-icon { width: 32px; height: 32px; background: linear-gradient(135deg,#22c55e,#16a34a); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 16px; }
  .nav-links { display: flex; gap: 4px; }
  .nav-btn { padding: 6px 14px; border-radius: 8px; border: none; background: none; cursor: pointer; font-size: 13px; color: #4b5e4b; transition: all 0.15s; font-weight: 500; }
  .nav-btn:hover, .nav-btn.active { background: #e8f5e9; color: #1a6b2e; }
  .nav-cta { background: #16a34a; color: #fff !important; border-radius: 8px; padding: 6px 16px; border: none; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.15s; }
  .nav-cta:hover { background: #15803d; }
  .hero { background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 40%, #c7f0d8 100%); padding: 120px 24px; text-align: center; position: relative; overflow: hidden; border-bottom: 1px solid #86efac; }
  .hero::before { content: ''; position: absolute; inset: 0; background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2316a34a' fill-opacity='0.04'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); }
  .hero-badge { display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(135deg, #dcfce7 0%, #c7f0d8 100%); color: #15803d; font-size: 13px; font-weight: 700; padding: 8px 18px; border-radius: 100px; border: 1.5px solid #86efac; margin-bottom: 28px; position: relative; box-shadow: 0 2px 8px rgba(22,163,74,0.15); }
  .pulse { width: 7px; height: 7px; background: #22c55e; border-radius: 50%; animation: pulse 1.5s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.3)} }
  .hero h1 { font-size: clamp(36px,7vw,62px); font-weight: 900; font-family: 'Poppins', sans-serif; color: #14532d; line-height: 1.2; max-width: 1000px; margin: 0 auto 20px; position: relative; letter-spacing: -1px; text-transform: uppercase; word-spacing: 0.2em; }
  .hero h1 span { color: #16a34a; }
  .hero p { font-size: clamp(15px,2vw,18px); color: #4b5e4b; max-width: 650px; margin: 0 auto 40px; line-height: 1.8; position: relative; font-weight: 500; }
  .hero-ctas { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; position: relative; }
  .btn-primary { background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: #fff; padding: 14px 32px; border-radius: 10px; border: none; cursor: pointer; font-size: 15px; font-weight: 700; transition: all 0.2s ease; }
  .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(22,163,74,0.4); }
  .btn-outline { background: #fff; color: #16a34a; padding: 12px 28px; border-radius: 10px; border: 2px solid #16a34a; cursor: pointer; font-size: 15px; font-weight: 600; transition: all 0.15s; }
  .btn-outline:hover { background: #f0fdf4; }
  .metrics-strip { background: #fff; border-top: 1px solid #e8f0e8; border-bottom: 1px solid #e8f0e8; }
  .metrics-inner { max-width: 1200px; margin: 0 auto; padding: 24px; display: grid; grid-template-columns: repeat(4,1fr); gap: 0; }
  .metric-item { text-align: center; padding: 20px 16px; border-right: 1px solid #e8f0e8; transition: all 0.3s; }
  .metric-item:hover { background: #f8faf6; }
  .metric-item:last-child { border-right: none; }
  .metric-num { font-size: 28px; font-weight: 700; color: #16a34a; }
  .metric-label { font-size: 12px; color: #6b7b6b; margin-top: 4px; }
  .section { max-width: 1200px; margin: 0 auto; padding: 72px 24px; }
  .section-title { font-size: 28px; font-weight: 800; color: #14532d; margin-bottom: 10px; letter-spacing: -0.5px; }
  .section-sub { font-size: 14px; color: #6b7b6b; margin-bottom: 32px; }
  .workflow-steps { display: grid; grid-template-columns: repeat(auto-fit,minmax(140px,1fr)); gap: 0; position: relative; }
  .workflow-step { text-align: center; padding: 20px 12px; position: relative; }
  .workflow-step:not(:last-child)::after { content: '→'; position: absolute; right: -8px; top: 32px; color: #86efac; font-size: 18px; font-weight: 700; }
  .step-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; margin: 0 auto 10px; }
  .step-label { font-size: 11px; font-weight: 600; color: #4b5e4b; }
  .cards-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(280px,1fr)); gap: 16px; }
  .card { background: #fff; border: 1px solid #e8f0e8; border-radius: 16px; padding: 24px; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
  .card:hover { border-color: #16a34a; box-shadow: 0 12px 32px rgba(22,163,74,0.2); transform: translateY(-6px); }
  .card-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; margin-bottom: 12px; }
  .card-title { font-size: 16px; font-weight: 700; color: #14532d; margin-bottom: 10px; }
  .card-text { font-size: 14px; color: #4b5e4b; line-height: 1.8; font-weight: 500; }
  .dashboard { display: grid; grid-template-columns: 220px 1fr; min-height: calc(100vh - 60px); }
  .sidebar { background: #fff; border-right: 1px solid #e8f0e8; padding: 24px 12px; }
  .sidebar-section { margin-bottom: 24px; }
  .sidebar-label { font-size: 10px; font-weight: 700; color: #9cad9c; text-transform: uppercase; letter-spacing: 0.8px; padding: 0 8px; margin-bottom: 8px; }
  .sidebar-item { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 8px; cursor: pointer; font-size: 13px; color: #4b5e4b; transition: all 0.15s; margin-bottom: 2px; }
  .sidebar-item:hover, .sidebar-item.active { background: #e8f5e9; color: #15803d; font-weight: 600; }
  .sidebar-item span:first-child { font-size: 15px; }
  .main-content { padding: 28px; background: #f8faf6; overflow-y: auto; }
  .page-header { margin-bottom: 24px; }
  .page-title { font-size: 20px; font-weight: 700; color: #14532d; }
  .page-sub { font-size: 13px; color: #6b7b6b; margin-top: 4px; }
  .stats-row { display: grid; grid-template-columns: repeat(auto-fit,minmax(160px,1fr)); gap: 12px; margin-bottom: 24px; }
  .stat-card { background: linear-gradient(135deg, #fff 0%, #f8faf6 100%); border: 1px solid #e8f0e8; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); transition: all 0.3s; }
  .stat-card:hover { border-color: #86efac; box-shadow: 0 4px 16px rgba(22,163,74,0.08); }
  .stat-val { font-size: 24px; font-weight: 700; color: #14532d; }
  .stat-label { font-size: 12px; color: #6b7b6b; margin-top: 4px; }
  .stat-change { font-size: 11px; color: #16a34a; margin-top: 6px; font-weight: 600; }
  .form-card { background: #fff; border: 1px solid #e8f0e8; border-radius: 16px; padding: 28px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
  .form-title { font-size: 16px; font-weight: 700; color: #14532d; margin-bottom: 20px; padding-bottom: 14px; border-bottom: 2px solid #dcfce7; }
  .form-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(200px,1fr)); gap: 14px; }
  .form-group { display: flex; flex-direction: column; gap: 5px; }
  .form-label { font-size: 12px; font-weight: 700; color: #15803d; text-transform: uppercase; letter-spacing: 0.5px; }
  .form-input { padding: 10px 14px; border: 1.5px solid #d1e5d1; border-radius: 8px; font-size: 13px; outline: none; transition: all 0.2s; background: #fff; font-weight: 500; }
  .form-input:focus { border-color: #16a34a; box-shadow: 0 0 0 4px rgba(22,163,74,0.12); background: #f0fdf4; }
  .form-select { padding: 8px 12px; border: 1px solid #d1e5d1; border-radius: 8px; font-size: 13px; outline: none; background: #fff; }
  .toggle-group { display: flex; gap: 8px; flex-wrap: wrap; }
  .toggle-btn { padding: 7px 16px; border-radius: 20px; border: 1.5px solid #d1e5d1; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; background: #fff; color: #4b5e4b; }
  .toggle-btn.selected { background: #16a34a; border-color: #16a34a; color: #fff; box-shadow: 0 4px 12px rgba(22,163,74,0.3); }
  .map-placeholder { background: linear-gradient(135deg,#e8f5e9,#dcfce7); border: 1px solid #bbf7d0; border-radius: 12px; height: 200px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: #15803d; }
  .map-placeholder .map-pin { font-size: 32px; }
  .map-placeholder span { font-size: 13px; font-weight: 600; }
  .ai-card { background: linear-gradient(135deg,#f0fdf4,#dcfce7); border: 1px solid #86efac; border-radius: 16px; padding: 20px; margin-top: 20px; position: relative; overflow: hidden; }
  .ai-card::before { content: 'AI'; position: absolute; top: -8px; right: 16px; background: #16a34a; color: #fff; font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 0 0 8px 8px; }
  .ai-badge { display: inline-flex; align-items: center; gap: 6px; background: #dcfce7; color: #15803d; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 100px; margin-bottom: 12px; }
  .freshness-bar { height: 8px; border-radius: 4px; background: #e8f0e8; overflow: hidden; margin: 8px 0; }
  .freshness-fill { height: 100%; border-radius: 4px; transition: width 0.5s; }
  .urgency-high { background: linear-gradient(90deg,#ef4444,#f97316); }
  .urgency-med { background: linear-gradient(90deg,#f97316,#eab308); }
  .urgency-low { background: linear-gradient(90deg,#22c55e,#16a34a); }
  .countdown { font-size: 28px; font-weight: 700; color: #16a34a; font-variant-numeric: tabular-nums; }
  .listing-card { background: #fff; border: 1px solid #e8f0e8; border-radius: 14px; padding: 16px; display: flex; gap: 14px; transition: all 0.2s; cursor: pointer; }
  .listing-card:hover { border-color: #86efac; box-shadow: 0 2px 12px rgba(22,163,74,0.1); }
  .listing-thumb { width: 72px; height: 72px; border-radius: 10px; background: linear-gradient(135deg,#e8f5e9,#bbf7d0); display: flex; align-items: center; justify-content: center; font-size: 28px; flex-shrink: 0; }
  .listing-info { flex: 1; }
  .listing-name { font-size: 14px; font-weight: 600; color: #1a2e1a; }
  .listing-meta { font-size: 12px; color: #6b7b6b; margin-top: 3px; }
  .badges { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 8px; }
  .badge { font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 100px; text-transform: uppercase; letter-spacing: 0.3px; }
  .badge-green { background: #dcfce7; color: #15803d; }
  .badge-amber { background: #fef3c7; color: #92400e; }
  .badge-red { background: #fee2e2; color: #991b1b; }
  .badge-blue { background: #dbeafe; color: #1e40af; }
  .badge-purple { background: #ede9fe; color: #5b21b6; }
  .match-row { display: flex; align-items: center; gap: 12px; padding: 12px; background: #fff; border: 1px solid #e8f0e8; border-radius: 12px; margin-bottom: 8px; }
  .match-avatar { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; }
  .match-score { margin-left: auto; font-size: 13px; font-weight: 700; color: #16a34a; background: #dcfce7; padding: 3px 10px; border-radius: 20px; }
  .route-card { background: #fff; border: 1px solid #e8f0e8; border-radius: 16px; padding: 20px; }
  .route-map { background: linear-gradient(135deg,#e8f5e9,#f0fdf4); border-radius: 12px; height: 200px; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; }
  .route-svg { width: 100%; height: 100%; }
  .tracking-timeline { margin-top: 20px; }
  .tl-item { display: flex; gap: 12px; padding-bottom: 20px; position: relative; }
  .tl-item:not(:last-child)::before { content: ''; position: absolute; left: 15px; top: 32px; bottom: 0; width: 2px; background: #e8f0e8; }
  .tl-dot { width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; position: relative; z-index: 1; }
  .tl-content { flex: 1; padding-top: 4px; }
  .tl-title { font-size: 13px; font-weight: 600; color: #1a2e1a; }
  .tl-time { font-size: 11px; color: #6b7b6b; margin-top: 2px; }
  .impact-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(200px,1fr)); gap: 16px; margin-bottom: 24px; }
  .impact-card { background: #fff; border: 1px solid #e8f0e8; border-radius: 16px; padding: 20px; text-align: center; }
  .impact-num { font-size: 32px; font-weight: 700; margin: 8px 0; }
  .impact-label { font-size: 12px; color: #6b7b6b; font-weight: 500; }
  .chart-card { background: #fff; border: 1px solid #e8f0e8; border-radius: 16px; padding: 20px; }
  .chart-title { font-size: 14px; font-weight: 600; color: #1a2e1a; margin-bottom: 16px; }
  .leaderboard-row { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #f0f7f0; }
  .lb-rank { width: 24px; font-size: 13px; font-weight: 700; color: #9cad9c; }
  .lb-rank.gold { color: #d97706; }
  .lb-rank.silver { color: #6b7280; }
  .lb-rank.bronze { color: #92400e; }
  .lb-name { flex: 1; font-size: 13px; font-weight: 600; }
  .lb-kg { font-size: 13px; color: #16a34a; font-weight: 700; }
  .pill-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
  .pill { padding: 6px 14px; border-radius: 100px; border: 1.5px solid #d1e5d1; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s; background: #fff; color: #4b5e4b; }
  .pill.active { background: #16a34a; border-color: #16a34a; color: #fff; }
  .qr-box { background: #fff; border: 2px solid #e8f0e8; border-radius: 12px; padding: 16px; text-align: center; }
  .qr-inner { width: 100px; height: 100px; margin: 8px auto; background: repeating-linear-gradient(45deg,#1a2e1a 0,#1a2e1a 2px,transparent 0,transparent 50%) 0 0/8px 8px; border-radius: 4px; }
  .escore { display: flex; align-items: center; gap: 12px; background: linear-gradient(135deg,#f0fdf4,#dcfce7); border: 1px solid #86efac; border-radius: 12px; padding: 14px 18px; }
  .escore-num { font-size: 36px; font-weight: 700; color: #16a34a; }
  .escore-label { font-size: 12px; color: #4b5e4b; font-weight: 500; }
  .notification-dot { width: 7px; height: 7px; background: #ef4444; border-radius: 50%; display: inline-block; margin-left: 4px; }
  .tabs { display: flex; gap: 4px; background: #f0fdf4; border-radius: 10px; padding: 4px; margin-bottom: 20px; }
  .tab { padding: 7px 16px; border-radius: 7px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; color: #6b7b6b; border: none; background: none; }
  .tab.active { background: #fff; color: #15803d; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
  .progress-ring { position: relative; display: inline-block; }
  .upload-zone { border: 2px dashed #86efac; border-radius: 12px; padding: 24px; text-align: center; background: #f0fdf4; cursor: pointer; transition: all 0.15s; }
  .upload-zone:hover { background: #dcfce7; border-color: #16a34a; }
  .welcome-page { min-height: 100vh; background: linear-gradient(135deg, rgba(240,253,244,0.97) 0%, rgba(220,252,231,0.97) 50%, rgba(199,240,216,0.97) 100%), url('https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=1200&h=800&fit=crop') center/cover fixed; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; overflow: hidden; padding: 40px 24px; }
  .welcome-page::before { display: none; }
  .welcome-header { position: absolute; top: 0; left: 0; right: 0; padding: 20px 24px; display: flex; align-items: center; z-index: 10; }
  .welcome-content { position: relative; z-index: 5; }
  .welcome-logo { display: flex; align-items: center; gap: 10px; }
  .logo-circle { width: 48px; height: 48px; background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 28px; font-weight: 900; box-shadow: 0 4px 12px rgba(22,163,74,0.3); }
  .logo-text { font-size: 20px; font-weight: 900; color: #14532d; font-family: 'Poppins', sans-serif; text-transform: uppercase; letter-spacing: -0.5px; }
  .welcome-emoji { font-size: 80px; margin-bottom: 20px; animation: bounce 2s infinite; display: block; }
  @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
  .food-emoji { display: none; }
  .welcome-greeting { font-size: clamp(32px, 6vw, 56px); font-weight: 900; font-family: 'Poppins', sans-serif; color: #14532d; margin-bottom: 12px; text-transform: uppercase; word-spacing: 0.2em; letter-spacing: -0.5px; }
  .welcome-subtext { font-size: 18px; color: #4b5e4b; margin-bottom: 48px; font-weight: 500; line-height: 1.8; }
  .welcome-menu { display: none; }
  .welcome-btn { background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: #fff; padding: 16px 48px; border-radius: 12px; border: none; cursor: pointer; font-size: 16px; font-weight: 700; font-family: 'Poppins', sans-serif; transition: all 0.2s ease; margin-top: 40px; text-transform: uppercase; letter-spacing: 0.5px; }
  .welcome-btn:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(22,163,74,0.4); }
  @media (max-width: 768px) {
    .dashboard { grid-template-columns: 1fr; }
    .sidebar { display: none; }
    .metrics-inner { grid-template-columns: repeat(2,1fr); }
    .workflow-step:not(:last-child)::after { display: none; }
  }
`;

const LISTINGS = [
  { id:1, name:"Biryani (Veg)", qty:"8 portions", org:"Spice Garden Restaurant", location:"Main Bazaar, Jamshedpur", dist:"0.4 km", freshScore:78, urgency:"high", timeLeft:105, type:"Donation", icon:"🍛", veg:true, price:0, allergens:["Gluten"] },
  { id:2, name:"Bread Loaves x4", qty:"4 units", org:"Baker Street Bakery", location:"City Center, Jamshedpur", dist:"0.9 km", freshScore:91, urgency:"low", timeLeft:240, type:"Sale", icon:"🍞", veg:true, price:40, allergens:["Gluten","Dairy"] },
  { id:3, name:"Chicken Curry", qty:"6 portions", org:"Home Cook – Priya S.", location:"Kadma, Jamshedpur", dist:"1.2 km", freshScore:62, urgency:"high", timeLeft:55, type:"Community", icon:"🍗", veg:false, price:0, allergens:[] },
  { id:4, name:"Fresh Salad Box", qty:"12 boxes", org:"GreenBite Café", location:"Tata Nagar, Jamshedpur", dist:"2.1 km", freshScore:95, urgency:"low", timeLeft:360, type:"Sale", icon:"🥗", veg:true, price:30, allergens:[] },
  { id:5, name:"Dal & Rice", qty:"15 portions", org:"Annapurna NGO Kitchen", location:"Dimna Lake, Jamshedpur", dist:"3.0 km", freshScore:84, urgency:"med", timeLeft:180, type:"Donation", icon:"🍲", veg:true, price:0, allergens:[] },
];

const VOLUNTEERS = [
  { name:"Rahul K.", completed:34, rating:4.9, status:"Available", zone:"North Jamshedpur" },
  { name:"Priya M.", completed:21, rating:4.8, status:"On Delivery", zone:"City Center" },
  { name:"Arjun S.", completed:15, rating:4.7, status:"Available", zone:"South Jamshedpur" },
];

const PROVIDERS = [
  { name:"Spice Garden", kg:142, meals:284, esg:87 },
  { name:"Baker Street", kg:98, meals:196, esg:81 },
  { name:"GreenBite Café", kg:76, meals:152, esg:79 },
  { name:"Home Cooks Network", kg:55, meals:110, esg:72 },
];

function FreshnessTimer({ timeLeft, urgency }) {
  const [secs, setSecs] = useState(timeLeft * 60);
  useEffect(() => {
    const iv = setInterval(() => setSecs(s => s > 0 ? s - 1 : 0), 1000);
    return () => clearInterval(iv);
  }, []);
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  const pct = Math.round((secs / (timeLeft * 60)) * 100);
  const fillClass = urgency === "high" ? "urgency-high" : urgency === "med" ? "urgency-med" : "urgency-low";
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontSize:11, color:"#6b7b6b", fontWeight:600 }}>Safe pickup window</span>
        <span style={{ fontSize:11, fontWeight:700, color: urgency==="high"?"#dc2626":urgency==="med"?"#d97706":"#16a34a" }}>
          {urgency==="high"?"🔴 HIGH":urgency==="med"?"🟡 MEDIUM":"🟢 LOW"} urgency
        </span>
      </div>
      <div className="freshness-bar"><div className={`freshness-fill ${fillClass}`} style={{ width:`${pct}%` }} /></div>
      <div className="countdown">
        {h > 0 ? `${h}h ${String(m).padStart(2,"0")}m` : `${m}m ${String(s).padStart(2,"0")}s`}
      </div>
      <div style={{ fontSize:12, color:"#6b7b6b", marginTop:4 }}>Collect before listing auto-expires</div>
    </div>
  );
}

function WelcomePage({ onStart }) {
  return (
    <div className="welcome-page">
      <div className="welcome-header">
        <div className="welcome-logo">
          <div className="logo-circle">🌿</div>
          <div className="logo-text">ANNADATA</div>
        </div>
      </div>
      <div className="welcome-content">
        <span className="welcome-emoji">🙏</span>
        <h1 className="welcome-greeting">Swagat hai!</h1>
        <p className="welcome-subtext">
          Welcome to ANNADATA<br/>
          Khana baant kar khaye, sabki duaayien paye<br/>
          Share food, change lives, build community
        </p>
        
        <button className="welcome-btn" onClick={() => onStart("home")}>START</button>
      </div>
    </div>
  );
}

function LandingPage({ navigate }) {
  const steps = [
    { icon:"📤", label:"Khana Upload Karo", bg:"#dcfce7" },
    { icon:"🧠", label:"AI Taazgi Engine", bg:"#dbeafe" },
    { icon:"🔍", label:"Sahjh Se Match Kro", bg:"#ede9fe" },
    { icon:"🗺️", label:"Raasta Optimize", bg:"#fef3c7" },
    { icon:"📋", label:"Book & Slot", bg:"#fee2e2" },
    { icon:"📍", label:"Live Tracking", bg:"#f0fdf4" },
    { icon:"📊", label:"Impact Dikhao", bg:"#dcfce7" },
  ];
  return (
    <div>
      <div className="hero">
        <div className="hero-badge"><div className="pulse" /><span>Live in Jamshedpur, Jharkhand</span></div>
        <h1>KHANA BAANT KAR KHAYE, <span>SABKI DUAAYIEN PAYE</span></h1>
        <p>AI-powered matching aur smart routing se needy logo tak khana pohunchata hai — waste kam, samaj ko khana, real-time impact.</p>
        <div className="hero-ctas">
          <button className="btn-primary" onClick={() => navigate("provider")}>🍽️ I'm a Food Provider</button>
          <button className="btn-outline" onClick={() => navigate("recipient")}>🤲 Find Food Near Me</button>
          <button className="btn-outline" onClick={() => navigate("volunteer")}>🚴 Join as Volunteer</button>
        </div>
      </div>
      <div className="metrics-strip">
        <div className="metrics-inner">
          {[["12,480","Khana Bachaya"],["6.2T","CO₂ Bachao"],["340","NGO Saathi"],["98%","Suraksha Score"]].map(([n,l]) => (
            <div key={l} className="metric-item"><div className="metric-num">{n}</div><div className="metric-label">{l}</div></div>
          ))}
        </div>
      </div>
      <div className="section">
        <div className="section-title">Popular Khana on ANNADATA</div>
        <div className="section-sub">Dekho konsa khana aaj available hai</div>
        <div className="cards-grid">
          {[
            { food:"🍛", name:"Biryani", desc:"Veg & Non-Veg", listings:"245 active" },
            { food:"🍜", name:"Noodles", desc:"Chinese Style", listings:"180 active" },
            { food:"🥘", name:"Curries", desc:"Dal, Sabzi, More", listings:"340 active" },
            { food:"🍞", name:"Bread", desc:"Fresh Baked", listings:"120 active" },
            { food:"🥗", name:"Salad Box", desc:"Fresh & Healthy", listings:"95 active" },
            { food:"🍰", name:"Sweets", desc:"Mithai, Cake", listings:"156 active" },
            { food:"🥡", name:"Meal Boxes", desc:"Complete Set", listings:"210 active" },
            { food:"🥤", name:"Drinks", desc:"Chai, Coffee", listings:"85 active" },
          ].map((item,i) => (
            <div key={i} className="card" style={{ textAlign:"center", padding:"20px 16px" }}>
              <div style={{ fontSize:"48px", marginBottom:12 }}>{item.food}</div>
              <div style={{ fontSize:14, fontWeight:600, color:"#1a2e1a", marginBottom:4 }}>{item.name}</div>
              <div style={{ fontSize:12, color:"#6b7b6b", marginBottom:10 }}>{item.desc}</div>
              <div style={{ fontSize:11, fontWeight:600, color:"#16a34a" }}>{item.listings}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="section">
        <div className="section-title">ANNADATA Kaise Kaam Karta Hai</div>
        <div className="section-sub">Saath Steps - Khana se Impact Tak</div>
        <div className="workflow-steps">
          {steps.map((s,i) => (
            <div key={i} className="workflow-step">
              <div className="step-icon" style={{ background:s.bg }}>{s.icon}</div>
              <div className="step-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="section" style={{ background:"#fff", borderRadius:20, margin:"0 24px 32px", padding:32 }}>
        <div className="section-title">Kyon ANNADATA Chuno?</div>
        <div className="section-sub" style={{ marginBottom:24 }}>Real impact ke liye banaya, scale ke liye design kiya</div>
        <div className="cards-grid">
          {[
            { icon:"⏱️", bg:"#fef3c7", title:"Smart Freshness Engine", text:"Auto-calculates safe pickup windows based on food type, storage, and time. Listings expire automatically — zero unsafe food." },
            { icon:"🤖", bg:"#ede9fe", title:"AI Recipient Matching", text:"Ranks nearby NGOs, shelters, and individuals by capacity, distance, and demand — ensuring food reaches the right place fast." },
            { icon:"🗺️", bg:"#dbeafe", title:"Priority Route Optimizer", text:"Color-coded urgency routing for volunteers. Shortest path, live ETA, and real-time navigation built in." },
            { icon:"📊", bg:"#dcfce7", title:"Live Impact Dashboard", text:"Real-time CO₂ savings, meals rescued, beneficiaries served. ESG scoring and CSR certificates for every donation." },
            { icon:"🔒", bg:"#fee2e2", title:"AI Safety Detection", text:"Automatic fraud and unsafe listing detection. Food safety checklist enforced before every submission goes live." },
            { icon:"🏆", bg:"#f0fdf4", title:"Contributor Leaderboard", text:"Gamified rankings motivate providers. Top contributors earn badges, featured placement, and CSR recognition." },
          ].map((c,i) => (
            <div key={i} className="card">
              <div className="card-icon" style={{ background:c.bg }}>{c.icon}</div>
              <div className="card-title">{c.title}</div>
              <div className="card-text">{c.text}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="section">
        <div className="section-title">Hamara Samaj Bolti Hai</div>
        <div className="section-sub">Sach ke Kahaniye</div>
        <div className="cards-grid">
          {[
            { quote:"ANNADATA ne humara khana barbad 70% kam kar diya 1 mahine mein. AI match karna sach mein kamal ka hai.", name:"Ravi Sharma", role:"Owner, Spice Garden Restaurant", avatar:"RS", food:"🍛" },
            { quote:"Humala har din 40+ khana portions milte hain shelter mein. Real-time updates baut badiya hain.", name:"Sister Meena", role:"Director, Annapurna Shelter", avatar:"SM", food:"🤲" },
            { quote:"Volunteer karna bilkul easy hai. Route optimize se 30 minutes bachte hain har pickup mein.", name:"Arjun Singh", role:"Volunteer, City Center", avatar:"AS", food:"🚴" },
          ].map((t,i) => (
            <div key={i} className="card">
              <div style={{ fontSize:32, marginBottom:12 }}>{t.food}</div>
              <div style={{ fontSize:24, color:"#16a34a", marginBottom:8 }}>❝</div>
              <div style={{ fontSize:14, color:"#4b5e4b", lineHeight:1.7, marginBottom:14 }}>{t.quote}</div>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:36, height:36, borderRadius:"50%", background:"#dcfce7", color:"#15803d", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:12 }}>{t.avatar}</div>
                <div><div style={{ fontSize:13, fontWeight:600 }}>{t.name}</div><div style={{ fontSize:11, color:"#6b7b6b" }}>{t.role}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background:"linear-gradient(135deg, #14532d 0%, #1a752f 50%, #15803d 100%)", padding:"60px 24px", textAlign:"center" }}>
        <div style={{ fontSize:28, fontWeight:700, color:"#fff", marginBottom:16 }}>Apne Shehar Mein Khana Bachana Hai?</div>
        <div style={{ fontSize:16, color:"#86efac", marginBottom:32, fontWeight:500 }}>1,200+ providers, NGOs aur volunteers ANNADATA par pehle se hain</div>
        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
          <button className="btn-primary" onClick={() => navigate("provider")} style={{ background:"#22c55e" }}>Shukriya Start Karo</button>
          <button style={{ background:"transparent", color:"#86efac", border:"2px solid #86efac", padding:"12px 28px", borderRadius:10, cursor:"pointer", fontSize:15, fontWeight:600 }} onClick={() => navigate("impact")}>Impact Dekho</button>
        </div>
      </div>
    </div>
  );
}

function LocationPicker({ onLocationPicked }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [picked, setPicked] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = L.map(mapRef.current).setView([23.7957, 86.4304], 14);
    
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    let marker;

    map.on('click', function(e) {
      if (marker) {
        map.removeLayer(marker);
      }
      marker = L.marker(e.latlng).addTo(map);
      setPicked(true);
      if (onLocationPicked) onLocationPicked(e.latlng);
    });

    // Make it look interactive initially by faking a bounce
    setTimeout(() => { map.invalidateSize(); }, 200);

    mapInstance.current = map;
    return () => mapInstance.current?.remove();
  }, [onLocationPicked]);

  return (
    <div style={{ position: 'relative', height: "200px", marginBottom: "16px", borderRadius: "12px", overflow: 'hidden', border: "1px solid #bbf7d0" }}>
      <div ref={mapRef} style={{ height: "100%", width: "100%", zIndex: 1 }} />
      {!picked && (
        <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.95)', padding: '8px 14px', borderRadius: '8px', zIndex: 1000, textAlign: 'center', fontSize: '12px', fontWeight: 700, color: '#15803d', border: '1px solid #16a34a', whiteSpace: 'nowrap', pointerEvents: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          📍 Tap map to pin pickup location
        </div>
      )}
    </div>
  );
}

function ProviderDashboard() {
  const [tab, setTab] = useState("upload");
  const [veg, setVeg] = useState("veg");
  const [listingType, setListingType] = useState("donation");
  const [storageType, setStorageType] = useState("room");
  const [foodName, setFoodName] = useState("Paneer Biryani");
  const [qty, setQty] = useState("10");
  const [prepTime, setPrepTime] = useState("14:30");
  const [freshScore, setFreshScore] = useState(78);
  const [location, setLocation] = useState("Jamshedpur, JH");
  const [submitted, setSubmitted] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);

  const handlePhoto = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const calcScore = () => {
    const now = new Date();
    const [h,m] = prepTime.split(":").map(Number);
    const prep = new Date(); prep.setHours(h,m,0);
    const elapsed = (now - prep) / 60000;
    const base = storageType === "fridge" ? 480 : storageType === "room" ? 240 : 120;
    const ratio = Math.max(0, 1 - elapsed / base);
    return Math.round(ratio * 100);
  };

  const handleAI = () => setFreshScore(calcScore());

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="sidebar-section">
          <div className="sidebar-label">Provider Menu</div>
          {[["📤","upload","Upload Surplus"],["📋","listings","My Listings"],["📊","analytics","Analytics"],["🏆","esg","ESG Score"]].map(([icon,id,label]) => (
            <div key={id} className={`sidebar-item ${tab===id?"active":""}`} onClick={() => setTab(id)}>
              <span>{icon}</span><span>{label}</span>
            </div>
          ))}
        </div>
        <div style={{ padding:"12px 10px", borderTop:"1px solid #e8f0e8" }}>
          <div style={{ fontSize:12, fontWeight:600, color:"#4b5e4b", marginBottom:4 }}>Spice Garden Restaurant</div>
          <div style={{ fontSize:11, color:"#6b7b6b" }}>Verified Provider ✓</div>
          <div style={{ marginTop:10 }}>
            <div className="escore">
              <div className="escore-num">87</div>
              <div><div style={{ fontSize:13, fontWeight:700, color:"#15803d" }}>ESG Score</div><div className="escore-label">Top 5% providers</div></div>
            </div>
          </div>
        </div>
      </div>
      <div className="main-content">
        {tab === "upload" && (
          <>
            <div className="page-header">
              <div className="page-title">Upload Surplus Food</div>
              <div className="page-sub">List your surplus — AI will score freshness and find recipients automatically</div>
            </div>
            {!submitted ? (
              <>
                <div className="form-card">
                  <div className="form-title">📍 Location & Type</div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Pickup Location</label>
                      <input className="form-input" value={location} onChange={e => setLocation(e.target.value)} placeholder="Enter pickup location" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Listing Type</label>
                      <div className="toggle-group">
                        {[["donation","🎁 Donation"],["sale","💰 For Sale"],["community","🤝 Community Share"]].map(([v,l]) => (
                          <button key={v} className={`toggle-btn ${listingType===v?"selected":""}`} onClick={() => setListingType(v)}>{l}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-card">
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Food Item Name</label>
                      <input className="form-input" value={foodName} onChange={e => setFoodName(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <select className="form-select"><option>Cooked Meal</option><option>Bakery</option><option>Raw Produce</option><option>Packaged</option></select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Quantity (portions / kg)</label>
                      <input className="form-input" value={qty} onChange={e => setQty(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Preparation Time</label>
                      <input className="form-input" type="time" value={prepTime} onChange={e => setPrepTime(e.target.value)} />
                    </div>
                  </div>
                  <div style={{ marginTop:16 }}>
                    <label className="form-label" style={{ display:"block", marginBottom:8 }}>Vegetarian / Non-Veg</label>
                    <div className="toggle-group">
                      {["veg","nonveg","vegan","jain"].map(v => (
                        <button key={v} className={`toggle-btn ${veg===v?"selected":""}`} onClick={() => setVeg(v)}>
                          {v==="veg"?"🟢 Vegetarian":v==="nonveg"?"🔴 Non-Veg":v==="vegan"?"🌿 Vegan":"🍃 Jain"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginTop:16 }}>
                    <label className="form-label" style={{ display:"block", marginBottom:8 }}>Allergens present</label>
                    <div className="toggle-group">
                      {["Gluten","Dairy","Nuts","Soy","Egg"].map(a => (
                        <button key={a} className="toggle-btn">{a}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="form-card">
                  <div className="form-title">🌡️ Storage & Freshness</div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Storage Condition</label>
                      <div className="toggle-group">
                        {[["fridge","❄️ Fridge"],["room","🌡️ Room Temp"],["hot","🔥 Hot Hold"]].map(([v,l]) => (
                          <button key={v} className={`toggle-btn ${storageType===v?"selected":""}`} onClick={() => setStorageType(v)}>{l}</button>
                        ))}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Temperature (°C)</label>
                      <input className="form-input" type="number" defaultValue="28" />
                    </div>
                  </div>
                  <button onClick={handleAI} style={{ marginTop:16, background:"#7c3aed", color:"#fff", border:"none", borderRadius:8, padding:"9px 18px", fontWeight:600, fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
                    🧠 Run AI Freshness Analysis
                  </button>
                  <div className="ai-card" style={{ marginTop:16 }}>
                    <div className="ai-badge">✨ AI Freshness Engine</div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, marginBottom:16 }}>
                      <div>
                        <div style={{ fontSize:11, color:"#6b7b6b", fontWeight:600, marginBottom:4 }}>Safety Score</div>
                        <div style={{ fontSize:28, fontWeight:700, color: freshScore > 70 ? "#16a34a" : freshScore > 40 ? "#d97706" : "#dc2626" }}>{freshScore}/100</div>
                      </div>
                      <div>
                        <div style={{ fontSize:11, color:"#6b7b6b", fontWeight:600, marginBottom:4 }}>Urgency</div>
                        <div style={{ fontSize:16, fontWeight:700, color: freshScore > 70 ? "#16a34a" : "#dc2626" }}>{freshScore > 70 ? "LOW" : freshScore > 40 ? "MEDIUM" : "HIGH"}</div>
                      </div>
                      <div>
                        <div style={{ fontSize:11, color:"#6b7b6b", fontWeight:600, marginBottom:4 }}>Status</div>
                        <div className={`badge ${freshScore > 70 ? "badge-green" : "badge-amber"}`} style={{ fontSize:12 }}>{freshScore > 70 ? "✓ Safe" : "⚡ Act Fast"}</div>
                      </div>
                    </div>
                    <FreshnessTimer timeLeft={Math.round(freshScore * 3.6)} urgency={freshScore > 70 ? "low" : freshScore > 40 ? "med" : "high"} />
                  </div>
                </div>
                <div className="form-card">
                  <div className="form-title">📍 Pickup & Listing Type</div>
                  <LocationPicker />
                  <div>
                    <label className="form-label" style={{ display:"block", marginBottom:8 }}>Listing Type</label>
                    <div className="toggle-group">
                      {[["donation","🎁 Free Donation"],["sale","💰 Discounted Sale"],["community","🤝 Community Share"]].map(([v,l]) => (
                        <button key={v} className={`toggle-btn ${listingType===v?"selected":""}`} onClick={() => setListingType(v)}>{l}</button>
                      ))}
                    </div>
                  </div>
                  {listingType === "sale" && (
                    <div className="form-group" style={{ marginTop:12, maxWidth:200 }}>
                      <label className="form-label">Price per portion (₹)</label>
                      <input className="form-input" type="number" defaultValue="30" />
                    </div>
                  )}
                  <div style={{ marginTop:16 }}>
                    <label className="form-label" style={{ display:"block", marginBottom:8 }}>Upload Food Photo</label>
                    <label className="upload-zone" style={{ display: "block", overflow: "hidden", padding: photoUrl ? 0 : 24 }}>
                      <input type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={handlePhoto} />
                      {photoUrl ? (
                         <img src={photoUrl} alt="Food preview" style={{ width: "100%", height: "200px", objectFit: "cover", display: "block" }} />
                      ) : (
                        <>
                          <div style={{ fontSize:32 }}>📷</div>
                          <div style={{ fontSize:13, color:"#4b5e4b", marginTop:8, fontWeight:600 }}>Tap to open Camera or Upload</div>
                          <div style={{ fontSize:11, color:"#9cad9c", marginTop:4 }}>JPG, PNG up to 5MB</div>
                        </>
                      )}
                    </label>
                  </div>
                  <div style={{ marginTop:16 }}>
                    <div style={{ background:"#fef3c7", border:"1px solid #fde68a", borderRadius:10, padding:14 }}>
                      <div style={{ fontSize:12, fontWeight:700, color:"#92400e", marginBottom:8 }}>🛡️ Food Safety Checklist</div>
                      {["Food is freshly prepared / recently stored","Packaging is sealed or covered","No visible spoilage, mold, or unusual smell","Prepared in a hygienic environment"].map((item,i) => (
                        <label key={i} style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, color:"#78350f", marginBottom:4, cursor:"pointer" }}>
                          <input type="checkbox" defaultChecked style={{ accentColor:"#d97706" }} />{item}
                        </label>
                      ))}
                    </div>
                  </div>
                  <button className="btn-primary" style={{ marginTop:20, width:"100%", padding:"13px" }} onClick={() => {
                    if (window.confirm("Publish and start AI matching for this listing?")) setSubmitted(true);
                  }}>
                    🚀 Submit Listing — AI Matching Will Begin
                  </button>
                </div>
              </>
            ) : (
              <div className="form-card" style={{ textAlign:"center", padding:48 }}>
                <div style={{ fontSize:64, marginBottom:16 }}>✅</div>
                <div style={{ fontSize:22, fontWeight:700, color:"#14532d", marginBottom:8 }}>Listing Published!</div>
                <div style={{ fontSize:14, color:"#6b7b6b", marginBottom:24 }}>AI matching engine found <strong>3 nearby recipients</strong>. Your food is live.</div>
                <div style={{ background:"#f0fdf4", border:"1px solid #86efac", borderRadius:12, padding:16, marginBottom:20, textAlign:"left" }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"#15803d", marginBottom:8 }}>🤖 AI Match Results</div>
                  {[["Annapurna Shelter","0.8 km","96% match","Immediate capacity"],["Jamshedpur Food Bank","1.2 km","89% match","Moderate demand"],["Student Hub IISM","2.0 km","81% match","Evening pickup"]].map(([n,d,s,c]) => (
                    <div key={n} className="match-row" style={{ marginBottom:6 }}>
                      <div className="match-avatar" style={{ background:"#dcfce7", color:"#15803d", fontSize:13 }}>{n[0]}</div>
                      <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:600 }}>{n}</div><div style={{ fontSize:11, color:"#6b7b6b" }}>{d} · {c}</div></div>
                      <div className="match-score">{s}</div>
                    </div>
                  ))}
                </div>
                <button className="btn-primary" onClick={() => setSubmitted(false)}>+ Upload Another Listing</button>
              </div>
            )}
          </>
        )}
        {tab === "listings" && (
          <>
            <div className="page-header"><div className="page-title">My Active Listings</div></div>
            <div className="stats-row">
              {[["5","Active Listings","+2"],["28","Portions Live","Today"],["3","Claims Pending","Action needed"],["₹320","Earned Today","Discounted sales"]].map(([v,l,c]) => (
                <div key={l} className="stat-card"><div className="stat-val">{v}</div><div className="stat-label">{l}</div><div className="stat-change">{c}</div></div>
              ))}
            </div>
            {LISTINGS.map(l => (
              <div key={l.id} className="listing-card" style={{ marginBottom:10 }}>
                <div className="listing-thumb">{l.icon}</div>
                <div className="listing-info">
                  <div className="listing-name">{l.name}</div>
                  <div className="listing-meta">{l.qty} · {l.org}</div>
                  <div className="listing-meta" style={{ fontSize:11, color:"#16a34a", marginTop:4 }}>📍 {l.location}</div>
                  <div className="badges">
                    <span className={`badge ${l.veg ? "badge-green" : "badge-red"}`}>{l.veg ? "🟢 Veg" : "🔴 Non-Veg"}</span>
                    <span className={`badge ${l.type==="Donation"?"badge-blue":l.type==="Sale"?"badge-amber":"badge-purple"}`}>{l.type==="Donation"?"🎁":l.type==="Sale"?"💰":"🤝"} {l.type}</span>
                    <span className={`badge ${l.urgency==="high"?"badge-red":l.urgency==="med"?"badge-amber":"badge-green"}`}>⏱️ {Math.floor(l.timeLeft/60)}h {l.timeLeft%60}m left</span>
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:20, fontWeight:700, color: l.freshScore > 70 ? "#16a34a" : "#d97706" }}>{l.freshScore}</div>
                  <div style={{ fontSize:10, color:"#6b7b6b" }}>AI Score</div>
                </div>
              </div>
            ))}
          </>
        )}
        {tab === "analytics" && <ProviderAnalytics />}
        {tab === "esg" && <ESGPanel />}
      </div>
    </div>
  );
}

function ProviderAnalytics() {
  return (
    <>
      <div className="page-header"><div className="page-title">Provider Analytics</div></div>
      <div className="stats-row">
        {[["142 kg","Food Rescued"],["284","Meals Served"],["56 kg","CO₂ Saved"],["87","ESG Score"]].map(([v,l]) => (
          <div key={l} className="stat-card"><div className="stat-val">{v}</div><div className="stat-label">{l}</div></div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:16 }}>
        <div className="chart-card">
          <div className="chart-title">Weekly food rescued (kg)</div>
          <div style={{ height:200, background:"linear-gradient(to right, #dcfce7 0%, #86efac 50%, #dcfce7 100%)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", color:"#15803d", fontWeight:600 }}>Graph visualization</div>
        </div>
        <div className="chart-card">
          <div className="chart-title">By listing type</div>
          <div style={{ height:200, background:"conic-gradient(from 0deg, #16a34a 0deg 198deg, #3b82f6 198deg 306deg, #8b5cf6 306deg)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }} />
          <div style={{ display:"flex", flexDirection:"column", gap:6, marginTop:12 }}>
            {[["#16a34a","Donation","55%"],["#3b82f6","Sale","30%"],["#8b5cf6","Community","15%"]].map(([c,l,v]) => (
              <div key={l} style={{ display:"flex", alignItems:"center", gap:8, fontSize:12 }}>
                <div style={{ width:10, height:10, borderRadius:2, background:c }} /><span style={{ flex:1, color:"#6b7b6b" }}>{l}</span><span style={{ fontWeight:700 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function ESGPanel() {
  const handleDownload = () => {
    const certText = `CSR Certificate - April 2026\n\nCertifies: Spice Garden Restaurant\nImpact: 142 kg food rescued, 284 meals served, 56 kg CO2 prevented.\nESG Score: 87\n\nThank you for your contribution to Annadata!`;
    const blob = new Blob([certText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Annadata_CSR_Certificate_April_2026.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="page-header"><div className="page-title">ESG Impact Score</div></div>
      <div style={{ background:"linear-gradient(135deg,#f0fdf4,#dcfce7)", border:"1px solid #86efac", borderRadius:20, padding:28, marginBottom:20, textAlign:"center" }}>
        <div style={{ fontSize:72, fontWeight:700, color:"#16a34a" }}>87</div>
        <div style={{ fontSize:16, fontWeight:600, color:"#15803d" }}>ESG Score — Excellent</div>
        <div style={{ fontSize:13, color:"#4b5e4b", marginTop:6 }}>Top 5% of all FoodLoop providers this month</div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
        {[["🌍 Environment","94","CO₂ reduction, waste cut"],["👥 Social","82","Meals to underserved"],["🏢 Governance","85","Transparency, compliance"]].map(([l,v,d]) => (
          <div key={l} className="stat-card" style={{ textAlign:"center" }}>
            <div style={{ fontSize:13, color:"#6b7b6b", marginBottom:4 }}>{l}</div>
            <div style={{ fontSize:28, fontWeight:700, color:"#16a34a" }}>{v}</div>
            <div style={{ fontSize:11, color:"#9cad9c" }}>{d}</div>
          </div>
        ))}
      </div>
      <div className="form-card">
        <div className="form-title">🏅 CSR Certificate</div>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:600, marginBottom:4 }}>April 2026 CSR Certificate</div>
            <div style={{ fontSize:12, color:"#6b7b6b", marginBottom:12 }}>Certifies 142 kg food rescued, 284 meals served, 56 kg CO₂ prevented</div>
            <button className="btn-primary" style={{ fontSize:13, padding:"8px 18px" }} onClick={handleDownload}>⬇️ Download PDF Certificate</button>
          </div>
          <div className="qr-box" style={{ minWidth:120, padding: 12 }}>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=CSR-April-2026" alt="QR" style={{ width:100, height:100, margin:"0 auto", display:"block", borderRadius:8 }} />
            <div style={{ fontSize:10, color:"#6b7b6b", marginTop:8 }}>Scan to verify</div>
          </div>
        </div>
      </div>
    </>
  );
}

function LiveMap() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map centered on Jamshedpur
    const map = L.map(mapRef.current).setView([23.7957, 86.4304], 14);

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    // Add markers for listings
    LISTINGS.forEach((listing) => {
      const coords = [
        23.7957 + (Math.random() - 0.5) * 0.1,
        86.4304 + (Math.random() - 0.5) * 0.1,
      ];
      const color = listing.urgency === "high" ? "#ef4444" : listing.urgency === "med" ? "#d97706" : "#16a34a";
      const popupContent = `<div style="font-size:12px"><strong>${listing.name}</strong><br/>${listing.qty}<br/>Score: ${listing.freshScore}</div>`;

      const customIcon = L.divIcon({
        html: `<div style="background:${color};color:white;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.2)">${listing.icon}</div>`,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      L.marker(coords, { icon: customIcon }).addTo(map).bindPopup(popupContent);
    });

    mapInstance.current = map;

    return () => {
      mapInstance.current?.remove();
    };
  }, []);

  return (
    <div
      ref={mapRef}
      style={{
        height: "200px",
        borderRadius: "12px",
        border: "1px solid #bbf7d0",
        marginBottom: "20px",
        zIndex: 1,
      }}
    />
  );
}

function LiveRouteMap({ waypoints }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = L.map(mapRef.current);
    
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
      maxZoom: 19,
    }).addTo(map);

    const latlngs = waypoints.map(w => w.coords);
    L.polyline(latlngs, { color: '#3b82f6', weight: 4, dashArray: '8 8' }).addTo(map);

    waypoints.forEach((w, i) => {
      const color = w.type === 'pickup' ? '#ef4444' : w.type === 'drop' ? '#16a34a' : '#f97316';
      const label = w.type === 'driver' ? '🚴' : (i + 1);
      const customIcon = L.divIcon({
        html: `<div style="background:${color};color:white;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:bold;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.2)">${label}</div>`,
        className: "", iconSize: [28, 28], iconAnchor: [14, 14]
      });
      L.marker(w.coords, { icon: customIcon }).bindPopup(`<b>${w.name}</b><br/>${w.type}`).addTo(map);
    });

    if (latlngs.length > 0) {
       map.fitBounds(L.latLngBounds(latlngs), { padding: [20, 20], maxZoom: 15 });
    } else {
       map.setView([23.7957, 86.4304], 14);
    }

    mapInstance.current = map;
    return () => mapInstance.current?.remove();
  }, [waypoints]);

  return <div ref={mapRef} style={{ height: "100%", width: "100%", zIndex: 1 }} />;
}

function RecipientDashboard() {
  const [tab, setTab] = useState("discover");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [reserved, setReserved] = useState(false);
  const [slot, setSlot] = useState("6:00 PM");

  const [myBookings, setMyBookings] = useState([
     { icon: "🍛", name: "Biryani (Veg)", org: "Spice Garden Restaurant", expected: "Apr 18 · 6:00 PM", status: "Collected", color: "badge-green" },
     { icon: "🍞", name: "Bread Loaves x4", org: "Baker Street Bakery", expected: "Yesterday · 5:30 PM", status: "Collected", color: "badge-green" },
     { icon: "🥗", name: "Fresh Salad Box", org: "GreenBite Café", expected: "Apr 8 · 7:00 PM", status: "Cancelled", color: "badge-red" }
  ]);

  const handleReserve = () => {
    if (window.confirm("Reserve this food for your shelter?")) {
      setReserved(true);
      setMyBookings(prev => [{
        icon: selected.icon,
        name: selected.name,
        org: selected.org,
        expected: `Today · ${slot}`,
        status: "Active Tracking",
        color: "badge-amber"
      }, ...prev]);
    }
  };

  const filtered = filter === "all" ? LISTINGS : filter === "veg" ? LISTINGS.filter(l => l.veg) : filter === "free" ? LISTINGS.filter(l => l.type === "Donation") : LISTINGS.filter(l => l.type === "Sale");

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="sidebar-section">
          <div className="sidebar-label">Find Food</div>
          {[["🔍","discover","Discover Near Me"],["📋","bookings","My Bookings"],["🗺️","tracking","Live Tracking"],["💬","alerts","Alerts"]].map(([icon,id,label]) => (
            <div key={id} className={`sidebar-item ${tab===id?"active":""}`} onClick={() => { setTab(id); setSelected(null); setReserved(false); }}>
              <span>{icon}</span><span>{label}{id==="alerts"?<span className="notification-dot" />:null}</span>
            </div>
          ))}
        </div>
        <div style={{ padding:"12px 10px", borderTop:"1px solid #e8f0e8" }}>
          <div style={{ fontSize:12, fontWeight:600, color:"#4b5e4b" }}>Annapurna Shelter</div>
          <div style={{ fontSize:11, color:"#6b7b6b" }}>Verified NGO · Jamshedpur</div>
          <div style={{ marginTop:8, fontSize:12, color:"#16a34a", fontWeight:600 }}>📍 0.4 km radius active</div>
        </div>
      </div>
      <div className="main-content">
        {tab === "discover" && !selected && (
          <>
            <div className="page-header"><div className="page-title">Food Near You</div><div className="page-sub">Real-time listings within 5 km · Jamshedpur, Jharkhand</div></div>
            <LiveMap />
            <div className="pill-row">
              {[["all","All"],["veg","🟢 Veg Only"],["free","🎁 Free"],["sale","💰 For Sale"]].map(([v,l]) => (
                <button key={v} className={`pill ${filter===v?"active":""}`} onClick={() => setFilter(v)}>{l}</button>
              ))}
            </div>
            {filtered.map(l => (
              <div key={l.id} className="listing-card" style={{ marginBottom:10 }} onClick={() => setSelected(l)}>
                <div className="listing-thumb">{l.icon}</div>
                <div className="listing-info">
                  <div className="listing-name">{l.name}</div>
                  <div className="listing-meta">{l.qty} · {l.org}</div>
                  <div className="listing-meta" style={{ fontSize:11, color:"#16a34a", marginTop:4 }}>📍 {l.location} · {l.dist}</div>
                  <div className="badges">
                    <span className={`badge ${l.veg?"badge-green":"badge-red"}`}>{l.veg?"🟢 Veg":"🔴 Non-Veg"}</span>
                    <span className={`badge ${l.type==="Donation"?"badge-blue":l.type==="Sale"?"badge-amber":"badge-purple"}`}>
                      {l.type==="Donation"?"🎁 Free":l.type==="Sale"?`💰 ₹${l.price}`:"🤝 Community"}
                    </span>
                    <span className={`badge ${l.urgency==="high"?"badge-red":l.urgency==="med"?"badge-amber":"badge-green"}`}>
                      ⏱️ {Math.floor(l.timeLeft/60)}h {l.timeLeft%60}m left
                    </span>
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
                  <div style={{ fontSize:18, fontWeight:700, color: l.freshScore > 70 ? "#16a34a" : "#d97706" }}>{l.freshScore}</div>
                  <div style={{ fontSize:10, color:"#6b7b6b" }}>AI Score</div>
                  <div style={{ fontSize:11, color:"#4b5e4b", fontWeight:600 }}>{l.dist}</div>
                </div>
              </div>
            ))}
          </>
        )}
        {tab === "discover" && selected && !reserved && (
          <>
            <button onClick={() => setSelected(null)} style={{ background:"none", border:"none", color:"#16a34a", cursor:"pointer", fontSize:13, fontWeight:600, marginBottom:16, display:"flex", alignItems:"center", gap:6 }}>← Back to listings</button>
            <div className="form-card">
              <div style={{ display:"flex", gap:16, marginBottom:16 }}>
                <div style={{ width:80, height:80, borderRadius:12, background:"#dcfce7", display:"flex", alignItems:"center", justifyContent:"center", fontSize:40 }}>{selected.icon}</div>
                <div>
                  <div style={{ fontSize:18, fontWeight:700, color:"#14532d" }}>{selected.name}</div>
                  <div style={{ fontSize:13, color:"#6b7b6b" }}>{selected.org}</div>
                  <div className="badges" style={{ marginTop:8 }}>
                    <span className={`badge ${selected.veg?"badge-green":"badge-red"}`}>{selected.veg?"🟢 Veg":"🔴 Non-Veg"}</span>
                    <span className="badge badge-blue">{selected.dist}</span>
                  </div>
                </div>
              </div>
              <div className="ai-card">
                <div className="ai-badge">✨ AI Freshness</div>
                <FreshnessTimer timeLeft={selected.timeLeft} urgency={selected.urgency} />
              </div>
              <div style={{ marginTop:20 }}>
                <div style={{ fontSize:14, fontWeight:600, marginBottom:10 }}>🤖 AI Smart Matching</div>
                <div style={{ background:"#f0fdf4", borderRadius:10, padding:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:4 }}>
                    <span style={{ color:"#4b5e4b" }}>Match score for your shelter</span><span style={{ fontWeight:700, color:"#16a34a" }}>94%</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#6b7b6b" }}>
                    <span>Distance</span><span>{selected.dist}</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#6b7b6b" }}>
                    <span>Est. pickup time</span><span>~12 min</span>
                  </div>
                </div>
              </div>
              <div style={{ marginTop:16 }}>
                <div style={{ fontSize:14, fontWeight:600, marginBottom:10 }}>Choose Pickup Slot</div>
                <div className="toggle-group">
                  {["5:00 PM","6:00 PM","7:00 PM","8:00 PM"].map(s => (
                    <button key={s} className={`toggle-btn ${slot===s?"selected":""}`} onClick={() => setSlot(s)}>{s}</button>
                  ))}
                </div>
              </div>
              <button className="btn-primary" style={{ marginTop:20, width:"100%", padding:13 }} onClick={handleReserve}>
                ✅ Reserve & Confirm Pickup at {slot}
              </button>
            </div>
          </>
        )}
        {tab === "discover" && selected && reserved && (
          <div className="form-card" style={{ textAlign:"center", padding:40 }}>
            <div style={{ fontSize:64, marginBottom:12 }}>🎉</div>
            <div style={{ fontSize:22, fontWeight:700, color:"#14532d", marginBottom:8 }}>Booking Confirmed!</div>
            <div style={{ fontSize:14, color:"#6b7b6b", marginBottom:24 }}>{selected.name} · Pickup at {slot}</div>
            <div className="qr-box" style={{ maxWidth:160, margin:"0 auto 20px", padding: 12 }}>
              <div style={{ fontSize:12, fontWeight:700, color:"#15803d", marginBottom:8 }}>Booking ID: #FL-2847</div>
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=Booking-FL2847" alt="QR" style={{ width:100, height:100, margin:"0 auto", display:"block", borderRadius:8 }} />
              <div style={{ fontSize:10, color:"#6b7b6b", marginTop:8 }}>Show QR at pickup</div>
            </div>
            <button className="btn-outline" onClick={() => { setTab("tracking"); setSelected(null); setReserved(false); }}>Track Live → </button>
          </div>
        )}
        {tab === "bookings" && (
          <>
            <div className="page-header"><div className="page-title">My Bookings</div></div>
            {myBookings.length === 0 && <div style={{textAlign: "center", padding: "40px", color: "#6b7b6b"}}>No bookings yet. Start discovering food! 🍛</div>}
            {myBookings.map((b, i) => (
              <div key={i} className="listing-card" style={{ marginBottom: 10 }}>
                <div className="listing-thumb">{b.icon}</div>
                <div className="listing-info">
                  <div className="listing-name">{b.name}</div>
                  <div className="listing-meta">{b.org}</div>
                  <div className="listing-meta" style={{ fontSize:11, color:"#6b7b6b", marginTop:4 }}>Pickup: {b.expected}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <span className={`badge ${b.color}`}>{b.status}</span>
                </div>
              </div>
            ))}
          </>
        )}
        {tab === "tracking" && <TrackingView />}
        {tab === "alerts" && (
          <>
            <div className="page-header"><div className="page-title">Alerts & Notifications</div></div>
            {[["🔴","Urgent","High-urgency: Chicken Curry available 0.4 km","2 min ago"],["🟢","New Listing","Fresh Salad Box just listed by GreenBite","8 min ago"],["📋","Reminder","Your 6:00 PM pickup slot is in 45 minutes","10 min ago"],["✅","Confirmed","Booking #FL-2847 confirmed — Biryani (Veg)","20 min ago"]].map(([dot,type,msg,time]) => (
              <div key={msg} className="card" style={{ marginBottom:10, flexDirection:"row", display:"flex", gap:12, alignItems:"flex-start" }}>
                <div style={{ fontSize:20 }}>{dot}</div>
                <div>
                  <div style={{ fontSize:12, fontWeight:700, color:"#15803d" }}>{type}</div>
                  <div style={{ fontSize:13, color:"#1a2e1a", marginTop:2 }}>{msg}</div>
                  <div style={{ fontSize:11, color:"#9cad9c", marginTop:4 }}>{time}</div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function TrackingView() {
  const [status, setStatus] = useState(1);
  const steps = [
    { label:"Reserved", time:"5:48 PM", done:true },
    { label:"Pickup Started", time:"5:52 PM", done:status >= 2 },
    { label:"In Transit", time:"5:58 PM", done:status >= 3 },
    { label:"Delivered / Collected", time:"6:04 PM", done:status >= 4 },
  ];
  
  const waypoints = [
    { coords: [23.795, 86.430], name: "Provider", type: "pickup" },
    { coords: [23.810, 86.440], name: "You (Recipient)", type: "drop" }
  ];
  if (status >= 2 && status < 4) {
    waypoints.splice(1, 0, { coords: [23.805, 86.435], name: "Driver", type: "driver" });
  }

  return (
    <>
      <div className="page-header"><div className="page-title">Live Tracking</div><div className="page-sub">Booking #FL-2847 · Biryani (Veg)</div></div>
      <div className="route-card">
        <div className="route-map" style={{ padding: 0 }}>
           <LiveRouteMap waypoints={waypoints} />
        </div>
        <div style={{ display:"flex", gap:8, margin:"16px 0 8px" }}>
          {steps.map((s,i) => (
            <button key={i} onClick={() => setStatus(i+1)} style={{ flex:1, padding:"6px 4px", fontSize:10, fontWeight:600, border:`1.5px solid ${s.done?"#16a34a":"#e8f0e8"}`, borderRadius:8, background: s.done?"#dcfce7":"#fff", color: s.done?"#15803d":"#9cad9c", cursor:"pointer" }}>
              {s.label}
            </button>
          ))}
        </div>
        <div className="tracking-timeline" style={{ marginTop:20 }}>
          {steps.map((s,i) => (
            <div key={i} className="tl-item">
              <div className="tl-dot" style={{ background: s.done?"#dcfce7":"#f0f7f0", border:`2px solid ${s.done?"#16a34a":"#e8f0e8"}`, color: s.done?"#16a34a":"#9cad9c" }}>{s.done?"✓":i+1}</div>
              <div className="tl-content">
                <div className="tl-title" style={{ color: s.done?"#1a2e1a":"#9cad9c" }}>{s.label}</div>
                <div className="tl-time">{s.done ? s.time : "Pending"}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function VolunteerDashboard() {
  const [tab, setTab] = useState("tasks");
  const [availableTasks, setAvailableTasks] = useState([
    { id: 1, from:"Spice Garden Restaurant", to:"Annapurna Shelter", dist:"0.8 km", urgency:"High", food:"Biryani (Veg) · 8 portions", time:"Before 6:30 PM", color:"#fee2e2", badge:"badge-red" },
    { id: 2, from:"Baker Street Bakery", to:"Jamshedpur Food Bank", dist:"1.4 km", urgency:"Medium", food:"Bread Loaves x4", time:"Before 7:00 PM", color:"#fef3c7", badge:"badge-amber" },
    { id: 3, from:"GreenBite Café", to:"Student Hub IISM", dist:"2.2 km", urgency:"Low", food:"Fresh Salad Box · 12 boxes", time:"Before 8:00 PM", color:"#dcfce7", badge:"badge-green" },
  ]);
  const [routeTasks, setRouteTasks] = useState([]);

  const handleAccept = (task) => {
    if (window.confirm("Accept this delivery priority task?")) {
      setAvailableTasks(prev => prev.filter(t => t.id !== task.id));
      setRouteTasks(prev => [...prev, task]);
      setTab("route");
    }
  };
  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="sidebar-section">
          <div className="sidebar-label">Volunteer</div>
          {[["🎯","tasks","My Tasks"],["🗺️","route","Route View"],["✅","completed","Completed"],["🏆","leaderboard","Leaderboard"]].map(([icon,id,label]) => (
            <div key={id} className={`sidebar-item ${tab===id?"active":""}`} onClick={() => setTab(id)}>
              <span>{icon}</span><span>{label}</span>
            </div>
          ))}
        </div>
        <div style={{ padding:"12px 10px", borderTop:"1px solid #e8f0e8" }}>
          <div style={{ fontSize:12, fontWeight:600, color:"#4b5e4b" }}>Rahul Kumar</div>
          <div style={{ fontSize:11, color:"#6b7b6b" }}>34 deliveries · ⭐ 4.9</div>
          <div style={{ marginTop:6 }}><span className="badge badge-green">Available</span></div>
        </div>
      </div>
      <div className="main-content">
        {tab === "tasks" && (
          <>
            <div className="page-header"><div className="page-title">Pickup & Delivery Tasks</div></div>
            <div className="stats-row">
              {[["3","Open Tasks"],["1","In Progress"],["34","Completed"],["4.9","Rating"]].map(([v,l]) => (
                <div key={l} className="stat-card"><div className="stat-val">{v}</div><div className="stat-label">{l}</div></div>
              ))}
            </div>
            {availableTasks.length === 0 && <div style={{textAlign: "center", padding: "40px", color: "#6b7b6b"}}>No more tasks left! Give yourself a break. 🥤</div>}
            {availableTasks.map((task,i) => (
              <div key={task.id} className="form-card" style={{ borderLeft:`4px solid ${task.urgency==="High"?"#ef4444":task.urgency==="Medium"?"#d97706":"#16a34a"}`, marginBottom:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:"#1a2e1a", marginBottom:4 }}>{task.food}</div>
                    <div style={{ fontSize:12, color:"#6b7b6b", marginBottom:2 }}>📍 {task.from}</div>
                    <div style={{ fontSize:12, color:"#6b7b6b", marginBottom:8 }}>→ {task.to} · {task.dist}</div>
                    <div className="badges">
                      <span className={`badge ${task.badge}`}>⚡ {task.urgency} Priority</span>
                      <span className="badge badge-blue">⏰ {task.time}</span>
                    </div>
                  </div>
                  <button className="btn-primary" onClick={() => handleAccept(task)} style={{ fontSize:12, padding:"8px 14px", whiteSpace:"nowrap" }}>Accept Task</button>
                </div>
              </div>
            ))}
          </>
        )}
        {tab === "route" && (
          <>
            <div className="page-header"><div className="page-title">Optimized Route</div></div>
            <div className="route-card">
              <div className="route-map" style={{ padding: 0 }}>
                <LiveRouteMap waypoints={[
                  { coords: [23.795, 86.430], name: "Pickup Point", type: "pickup" },
                  { coords: [23.800, 86.435], name: "Drop #1", type: "drop" },
                  { coords: [23.810, 86.440], name: "Drop #2", type: "drop" }
                ]} />
              </div>
              <div style={{ marginTop:16 }}>
                {[["A","Spice Garden Restaurant","Pickup","#ef4444"],["B","Annapurna Shelter","Drop #1","#d97706"],["C","Student Hub IISM","Drop #2","#16a34a"]].map(([l,n,t,c]) => (
                  <div key={l} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:"1px solid #f0f7f0" }}>
                    <div style={{ width:28, height:28, borderRadius:"50%", background:c, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:12 }}>{l}</div>
                    <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:600 }}>{n}</div><div style={{ fontSize:11, color:"#6b7b6b" }}>{t}</div></div>
                    <span className={`badge ${c==="#ef4444"?"badge-red":c==="#d97706"?"badge-amber":"badge-green"}`}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {tab === "completed" && (
          <>
            <div className="page-header"><div className="page-title">Completed Deliveries</div></div>
            {[
              { id: 101, from: "Home Cooks Network", to: "Local Orphanage", date: "Today · 2:15 PM", kg: "4 kg", status: "Delivered", badge: "badge-green" },
              { id: 102, from: "Spice Garden", to: "Annapurna Shelter", date: "Yesterday · 6:30 PM", kg: "8 kg", status: "Delivered", badge: "badge-green" },
              { id: 103, from: "GreenBite Café", to: "City Center Street", date: "Apr 15 · 8:00 PM", kg: "12 kg", status: "Delivered", badge: "badge-green" }
            ].map(task => (
              <div key={task.id} className="form-card" style={{ borderLeft: "4px solid #16a34a", marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1a2e1a", marginBottom: 2 }}>📍 {task.from}</div>
                    <div style={{ fontSize: 13, color: "#6b7b6b", marginBottom: 8 }}>✅ {task.to}</div>
                    <span className={`badge ${task.badge}`}>{task.status} · {task.kg} rescued</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#9cad9c", textAlign: "right" }}>
                    <div>{task.date}</div>
                    <div style={{ fontSize: 24, marginTop: 4 }}>📦</div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
        {tab === "leaderboard" && (
          <>
            <div className="page-header"><div className="page-title">Top Volunteers — April 2026</div></div>
            <div className="form-card">
              {[["Rahul K.",34,"gold"],["Priya M.",21,"silver"],["Arjun S.",15,"bronze"],["Sneha T.",12,""],["Dev R.",9,""]].map(([n,kg,cls],i) => (
                <div key={n} className="leaderboard-row">
                  <div className={`lb-rank ${cls}`}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1}</div>
                  <div className="lb-name">{n}</div>
                  <div style={{ fontSize:12, color:"#6b7b6b", marginRight:8 }}>{kg} deliveries</div>
                  <div className="lb-kg">{kg * 4} kg</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ImpactDashboard() {
  const [counter, setCounter] = useState({ meals:0, kg:0, co2:0, people:0 });

  useEffect(() => {
    const targets = { meals:12480, kg:6240, co2:3120, people:4200 };
    let frame = 0;
    const iv = setInterval(() => {
      frame += 2;
      if (frame >= 100) { setCounter(targets); clearInterval(iv); return; }
      setCounter({ meals:Math.round(targets.meals*frame/100), kg:Math.round(targets.kg*frame/100), co2:Math.round(targets.co2*frame/100), people:Math.round(targets.people*frame/100) });
    }, 20);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{ padding:"28px", background:"#f8faf6", minHeight:"calc(100vh - 60px)" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <div className="page-header">
          <div className="page-title">🌍 ANNADATA — Global Impact Dashboard</div>
          <div className="page-sub">Real-time metrics · April 2026 · Jamshedpur & beyond</div>
        </div>
        <div className="impact-grid">
          {[
            { num:counter.meals.toLocaleString(), label:"Meals Rescued", icon:"🍽️", color:"#16a34a", bg:"#dcfce7" },
            { num:`${counter.kg.toLocaleString()} kg`, label:"Food Rescued", icon:"♻️", color:"#3b82f6", bg:"#dbeafe" },
            { num:`${counter.co2.toLocaleString()} kg`, label:"CO₂ Prevented", icon:"🌿", color:"#7c3aed", bg:"#ede9fe" },
            { num:counter.people.toLocaleString(), label:"People Served", icon:"👥", color:"#d97706", bg:"#fef3c7" },
          ].map((c,i) => (
            <div key={i} className="impact-card">
              <div style={{ width:44, height:44, borderRadius:12, background:c.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, margin:"0 auto 10px" }}>{c.icon}</div>
              <div className="impact-num" style={{ color:c.color }}>{c.num}</div>
              <div className="impact-label">{c.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          <div className="chart-card">
            <div className="chart-title">🏆 Top Provider Leaderboard</div>
            {PROVIDERS.map((p,i) => (
              <div key={p.name} className="leaderboard-row">
                <div className={`lb-rank ${i===0?"gold":i===1?"silver":i===2?"bronze":""}`}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1}</div>
                <div style={{ flex:1 }}>
                  <div className="lb-name">{p.name}</div>
                  <div style={{ fontSize:11, color:"#6b7b6b" }}>{p.meals} meals · ESG {p.esg}</div>
                </div>
                <div className="lb-kg">{p.kg} kg</div>
              </div>
            ))}
          </div>
          <div className="chart-card">
            <div className="chart-title">🌱 Environmental Impact</div>
            {[["CO₂ saved this month","3,120 kg","≈ 156 trees planted","#16a34a"],["Water saved","48,000 L","≈ 192 showers","#3b82f6"],["Land usage reduced","0.8 ha","Prevented landfill","#7c3aed"]].map(([l,v,sub,c]) => (
              <div key={l} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:"1px solid #f0f7f0" }}>
                <div style={{ width:40,height:40,borderRadius:10,background:`${c}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>
                  {c==="#16a34a"?"🌿":c==="#3b82f6"?"💧":"🌍"}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, color:"#6b7b6b" }}>{l}</div>
                  <div style={{ fontSize:11, color:"#9cad9c" }}>{sub}</div>
                </div>
                <div style={{ fontSize:15, fontWeight:700, color:c }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("welcome");
  const [role, setRole] = useState("provider");
  const [theme, setTheme] = useState("light");

  const navTo = (p) => {
    if (p === "provider" || p === "recipient" || p === "volunteer") {
      setRole(p); setPage("dashboard");
    } else if (p === "home" || p === "impact") { 
      setPage(p);
    } else { 
      setPage(p); 
    }
  };

  const startFromWelcome = (action) => {
    if (action === "home") {
      setPage("home");
    } else {
      setRole(action);
      setPage("dashboard");
    }
  };

  return (
    <>
      <div className={`app ${theme}`}>
        {page !== "welcome" && (
          <nav className="nav">
            <div className="nav-inner">
              <div className="logo" onClick={() => setPage("home")}>
                <div className="logo-icon">🌿</div>ANNADATA
              </div>
              <div className="nav-links">
                <button className={`nav-btn ${page==="home"?"active":""}`} onClick={() => setPage("home")}>Home</button>
                <button className={`nav-btn ${page==="dashboard"&&role==="provider"?"active":""}`} onClick={() => navTo("provider")}>Provider</button>
                <button className={`nav-btn ${page==="dashboard"&&role==="recipient"?"active":""}`} onClick={() => navTo("recipient")}>Find Food</button>
                <button className={`nav-btn ${page==="dashboard"&&role==="volunteer"?"active":""}`} onClick={() => navTo("volunteer")}>Volunteer</button>
                <button className={`nav-btn ${page==="impact"?"active":""}`} onClick={() => setPage("impact")}>Impact</button>
              </div>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <button className="nav-btn" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} style={{ fontWeight: 600 }}>
                  {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
                </button>
                <button className="nav-cta" onClick={() => navTo("provider")}>+ List Surplus</button>
              </div>
            </div>
          </nav>
        )}
        {page === "welcome" && <WelcomePage onStart={startFromWelcome} />}
        {page === "home" && <LandingPage navigate={navTo} />}
        {page === "dashboard" && role === "provider" && <ProviderDashboard />}
        {page === "dashboard" && role === "recipient" && <RecipientDashboard />}
        {page === "dashboard" && role === "volunteer" && <VolunteerDashboard />}
        {page === "impact" && <ImpactDashboard />}
      </div>
    </>
  );
}
