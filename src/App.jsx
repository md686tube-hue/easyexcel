// Excel Data Entry App - Complete System
// Dependencies: @supabase/supabase-js, xlsx, file-saver
// Copy supabaseClient.js separately

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";

// ─── Supabase ─────────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://xtgfkriudzwpobkfufow.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0Z2Zrcml1ZHp3cG9ia2Z1Zm93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwOTIxNDYsImV4cCI6MjA5NDY2ODE0Nn0.47l-Z8hrMmd4X2FlVb-hspkNjxuQ7DCt91EskEGvY1A";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ADMIN email — change to your admin email
const ADMIN_EMAIL = "mahmud716868@gmail.com";

// ─── Styles ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');
  @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --blue: #2563eb;
    --blue-light: #eff6ff;
    --blue-mid: #bfdbfe;
    --green: #16a34a;
    --green-light: #f0fdf4;
    --red: #dc2626;
    --red-light: #fef2f2;
    --amber: #d97706;
    --amber-light: #fffbeb;
    --gray-50: #f8fafc;
    --gray-100: #f1f5f9;
    --gray-200: #e2e8f0;
    --gray-300: #cbd5e1;
    --gray-400: #94a3b8;
    --gray-500: #64748b;
    --gray-600: #475569;
    --gray-700: #334155;
    --gray-800: #1e293b;
    --gray-900: #0f172a;
    --radius: 10px;
    --radius-lg: 16px;
    --shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05);
    --shadow-md: 0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05);
    --shadow-lg: 0 10px 15px rgba(0,0,0,0.07), 0 4px 6px rgba(0,0,0,0.05);
  }

  body {
    font-family: 'Inter', 'Noto Sans Bengali', sans-serif;
    background: var(--gray-50);
    color: var(--gray-800);
    min-height: 100vh;
    line-height: 1.6;
  }

  /* ── NAVBAR ── */
  .navbar {
    background: white;
    border-bottom: 1px solid var(--gray-200);
    padding: 0 24px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: var(--shadow);
  }
  .navbar-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 700;
    font-size: 18px;
    color: var(--blue);
    text-decoration: none;
    cursor: pointer;
  }
  .navbar-brand i { font-size: 24px; }
  .navbar-actions { display: flex; align-items: center; gap: 12px; }
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: var(--radius);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: all 0.15s;
    font-family: inherit;
    text-decoration: none;
  }
  .btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .btn-primary { background: var(--blue); color: white; }
  .btn-primary:hover:not(:disabled) { background: #1d4ed8; }
  .btn-outline {
    background: white;
    color: var(--gray-700);
    border: 1px solid var(--gray-300);
  }
  .btn-outline:hover:not(:disabled) { background: var(--gray-50); }
  .btn-danger { background: var(--red); color: white; }
  .btn-danger:hover:not(:disabled) { background: #b91c1c; }
  .btn-success { background: var(--green); color: white; }
  .btn-success:hover:not(:disabled) { background: #15803d; }
  .btn-sm { padding: 5px 10px; font-size: 13px; }
  .btn-ghost {
    background: transparent;
    color: var(--gray-600);
    border: none;
    padding: 6px 10px;
  }
  .btn-ghost:hover { background: var(--gray-100); color: var(--gray-800); }

  /* ── HERO (HOME) ── */
  .hero {
    background: linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%);
    color: white;
    padding: 80px 24px;
    text-align: center;
  }
  .hero h1 {
    font-size: clamp(28px, 5vw, 48px);
    font-weight: 700;
    margin-bottom: 16px;
    line-height: 1.2;
  }
  .hero p {
    font-size: 18px;
    opacity: 0.88;
    max-width: 600px;
    margin: 0 auto 36px;
  }
  .hero-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
  .btn-white { background: white; color: var(--blue); font-weight: 600; padding: 12px 28px; font-size: 16px; }
  .btn-white:hover { background: var(--blue-light); }
  .btn-outline-white {
    background: transparent;
    color: white;
    border: 2px solid rgba(255,255,255,0.6);
    padding: 12px 28px;
    font-size: 16px;
    font-weight: 600;
  }
  .btn-outline-white:hover { background: rgba(255,255,255,0.1); }

  /* ── FEATURES ── */
  .features {
    padding: 64px 24px;
    max-width: 1100px;
    margin: 0 auto;
  }
  .section-title {
    text-align: center;
    font-size: 28px;
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: 8px;
  }
  .section-sub {
    text-align: center;
    color: var(--gray-500);
    margin-bottom: 48px;
    font-size: 16px;
  }
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 24px;
  }
  .feature-card {
    background: white;
    border: 1px solid var(--gray-200);
    border-radius: var(--radius-lg);
    padding: 28px;
    box-shadow: var(--shadow);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .feature-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
  .feature-icon {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: var(--blue-light);
    color: var(--blue);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin-bottom: 16px;
  }
  .feature-card h3 { font-size: 16px; font-weight: 600; margin-bottom: 8px; color: var(--gray-900); }
  .feature-card p { font-size: 14px; color: var(--gray-500); line-height: 1.7; }

  /* ── DEMO ANIMATION ── */
  .demo-section {
    background: var(--gray-100);
    padding: 64px 24px;
  }
  .demo-wrap {
    max-width: 800px;
    margin: 0 auto;
  }
  .demo-screen {
    background: white;
    border-radius: var(--radius-lg);
    border: 1px solid var(--gray-200);
    box-shadow: var(--shadow-lg);
    overflow: hidden;
  }
  .demo-topbar {
    background: var(--gray-800);
    padding: 10px 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .demo-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }
  .demo-body { padding: 24px; min-height: 280px; }
  .demo-step { display: none; animation: fadeSlide 0.5s ease; }
  .demo-step.active { display: block; }
  @keyframes fadeSlide {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .demo-col-row {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
    align-items: center;
  }
  .demo-col-pill {
    background: var(--blue-light);
    color: var(--blue);
    border-radius: 20px;
    padding: 4px 12px;
    font-size: 13px;
    font-weight: 500;
  }
  .demo-form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 12px;
  }
  .demo-field label {
    display: block;
    font-size: 12px;
    color: var(--gray-500);
    margin-bottom: 4px;
    font-weight: 500;
  }
  .demo-field-box {
    border: 1px solid var(--gray-300);
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 13px;
    color: var(--gray-700);
    background: var(--gray-50);
  }
  .demo-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  .demo-table th {
    background: var(--gray-100);
    padding: 8px 12px;
    text-align: left;
    font-weight: 600;
    color: var(--gray-600);
    border-bottom: 1px solid var(--gray-200);
  }
  .demo-table td {
    padding: 8px 12px;
    border-bottom: 1px solid var(--gray-100);
    color: var(--gray-700);
  }
  .demo-progress {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 20px;
  }
  .demo-dot-nav {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--gray-300);
    cursor: pointer;
    border: none;
    transition: background 0.2s;
  }
  .demo-dot-nav.active { background: var(--blue); }
  .demo-step-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--blue);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 12px;
  }

  /* ── HOW IT WORKS ── */
  .steps-section { padding: 64px 24px; max-width: 900px; margin: 0 auto; }
  .steps-list { display: flex; flex-direction: column; gap: 0; }
  .step-item {
    display: flex;
    gap: 20px;
    padding: 20px 0;
    position: relative;
  }
  .step-item:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 19px;
    top: 52px;
    width: 2px;
    height: calc(100% - 32px);
    background: var(--gray-200);
  }
  .step-num {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--blue);
    color: white;
    font-weight: 700;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    z-index: 1;
  }
  .step-content h4 { font-size: 16px; font-weight: 600; margin-bottom: 4px; color: var(--gray-900); }
  .step-content p { font-size: 14px; color: var(--gray-500); }

  /* ── AUTH ── */
  .auth-page {
    min-height: calc(100vh - 60px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }
  .auth-card {
    background: white;
    border-radius: var(--radius-lg);
    border: 1px solid var(--gray-200);
    padding: 40px;
    width: 100%;
    max-width: 440px;
    box-shadow: var(--shadow-lg);
  }
  .auth-logo {
    text-align: center;
    margin-bottom: 28px;
  }
  .auth-logo i { font-size: 44px; color: var(--blue); }
  .auth-logo h2 { font-size: 22px; font-weight: 700; margin-top: 8px; color: var(--gray-900); }
  .auth-logo p { font-size: 13px; color: var(--gray-500); margin-top: 4px; }
  .auth-tabs { display: flex; border-bottom: 1px solid var(--gray-200); margin-bottom: 24px; }
  .auth-tab {
    flex: 1;
    padding: 10px;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    font-size: 14px;
    font-weight: 500;
    color: var(--gray-500);
    cursor: pointer;
    transition: all 0.15s;
    font-family: inherit;
    margin-bottom: -1px;
  }
  .auth-tab.active { color: var(--blue); border-bottom-color: var(--blue); }
  .form-group { margin-bottom: 16px; }
  .form-label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: var(--gray-700);
    margin-bottom: 6px;
  }
  .form-input {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid var(--gray-300);
    border-radius: var(--radius);
    font-size: 14px;
    font-family: inherit;
    transition: border-color 0.15s;
    background: white;
    color: var(--gray-800);
  }
  .form-input:focus {
    outline: none;
    border-color: var(--blue);
    box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
  }
  .form-input::placeholder { color: var(--gray-400); }
  .alert {
    padding: 10px 14px;
    border-radius: var(--radius);
    font-size: 13px;
    margin-bottom: 16px;
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }
  .alert-error { background: var(--red-light); color: #991b1b; border: 1px solid #fca5a5; }
  .alert-success { background: var(--green-light); color: #166534; border: 1px solid #86efac; }
  .alert-warning { background: var(--amber-light); color: #92400e; border: 1px solid #fcd34d; }
  .alert-info { background: var(--blue-light); color: #1e40af; border: 1px solid var(--blue-mid); }

  /* ── ADMIN PANEL ── */
  .admin-layout { display: flex; min-height: calc(100vh - 60px); }
  .admin-sidebar {
    width: 220px;
    background: white;
    border-right: 1px solid var(--gray-200);
    padding: 16px 0;
    flex-shrink: 0;
  }
  .sidebar-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 500;
    color: var(--gray-600);
    cursor: pointer;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
    font-family: inherit;
    transition: all 0.15s;
    border-radius: 0;
  }
  .sidebar-item:hover { background: var(--gray-50); color: var(--gray-900); }
  .sidebar-item.active { background: var(--blue-light); color: var(--blue); }
  .admin-main { flex: 1; padding: 28px; overflow-y: auto; }
  .page-title {
    font-size: 22px;
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: 4px;
  }
  .page-sub { font-size: 14px; color: var(--gray-500); margin-bottom: 24px; }
  .stat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 16px;
    margin-bottom: 28px;
  }
  .stat-card {
    background: white;
    border: 1px solid var(--gray-200);
    border-radius: var(--radius-lg);
    padding: 20px;
    box-shadow: var(--shadow);
  }
  .stat-card .stat-val {
    font-size: 28px;
    font-weight: 700;
    color: var(--gray-900);
  }
  .stat-card .stat-label { font-size: 13px; color: var(--gray-500); margin-top: 4px; }
  .stat-card .stat-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    margin-bottom: 12px;
  }
  .table-wrap {
    background: white;
    border: 1px solid var(--gray-200);
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow);
  }
  .data-table { width: 100%; border-collapse: collapse; }
  .data-table th {
    background: var(--gray-50);
    padding: 12px 16px;
    text-align: left;
    font-size: 12px;
    font-weight: 600;
    color: var(--gray-500);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid var(--gray-200);
  }
  .data-table td {
    padding: 12px 16px;
    font-size: 14px;
    color: var(--gray-700);
    border-bottom: 1px solid var(--gray-100);
  }
  .data-table tr:last-child td { border-bottom: none; }
  .data-table tr:hover td { background: var(--gray-50); }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
  }
  .badge-pending { background: var(--amber-light); color: var(--amber); }
  .badge-approved { background: var(--green-light); color: var(--green); }
  .badge-rejected { background: var(--red-light); color: var(--red); }
  .badge-blocked { background: #ede9fe; color: #7c3aed; }
  .badge-admin { background: var(--blue-light); color: var(--blue); }

  /* ── APP (MAIN EXCEL) ── */
  .app-layout { min-height: calc(100vh - 60px); }
  .app-header-bar {
    background: white;
    border-bottom: 1px solid var(--gray-200);
    padding: 12px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }
  .excel-tabs-bar {
    display: flex;
    align-items: center;
    gap: 4px;
    overflow-x: auto;
    flex: 1;
    min-width: 0;
  }
  .excel-tab {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: var(--radius);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    border: 1px solid transparent;
    background: none;
    color: var(--gray-500);
    font-family: inherit;
    white-space: nowrap;
    transition: all 0.15s;
    max-width: 160px;
  }
  .excel-tab .tab-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100px;
  }
  .excel-tab:hover { background: var(--gray-100); color: var(--gray-700); }
  .excel-tab.active { background: var(--blue-light); color: var(--blue); border-color: var(--blue-mid); }
  .excel-tab .tab-close {
    opacity: 0;
    width: 16px;
    height: 16px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.1s;
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    font-size: 12px;
    padding: 0;
    font-family: inherit;
  }
  .excel-tab:hover .tab-close { opacity: 0.7; }
  .excel-tab .tab-close:hover { opacity: 1; background: rgba(0,0,0,0.08); }
  .new-tab-btn {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: none;
    border: 1px dashed var(--gray-300);
    color: var(--gray-400);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
    transition: all 0.15s;
  }
  .new-tab-btn:hover { border-color: var(--blue); color: var(--blue); background: var(--blue-light); }
  .app-content { padding: 24px; max-width: 1100px; margin: 0 auto; }

  /* ── STEPPER ── */
  .stepper {
    display: flex;
    align-items: center;
    margin-bottom: 28px;
    background: white;
    border: 1px solid var(--gray-200);
    border-radius: var(--radius-lg);
    padding: 16px 24px;
    box-shadow: var(--shadow);
  }
  .step-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: var(--radius);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: var(--gray-400);
    font-family: inherit;
    transition: all 0.15s;
  }
  .step-btn.done { color: var(--green); cursor: pointer; }
  .step-btn.active { color: var(--blue); background: var(--blue-light); }
  .step-btn .step-icon {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    background: var(--gray-200);
    color: var(--gray-400);
  }
  .step-btn.done .step-icon { background: var(--green-light); color: var(--green); }
  .step-btn.active .step-icon { background: var(--blue); color: white; }
  .step-line { flex: 1; height: 1px; background: var(--gray-200); margin: 0 4px; }
  .step-line.done { background: var(--green); }

  /* ── PANELS ── */
  .panel {
    background: white;
    border: 1px solid var(--gray-200);
    border-radius: var(--radius-lg);
    padding: 24px;
    box-shadow: var(--shadow);
    margin-bottom: 20px;
  }
  .panel-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .col-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border: 1px solid var(--gray-200);
    border-radius: var(--radius);
    margin-bottom: 6px;
    background: var(--gray-50);
    transition: all 0.15s;
  }
  .col-row:hover { border-color: var(--gray-300); background: white; }
  .col-drag { cursor: grab; color: var(--gray-400); font-size: 16px; }
  .col-name { flex: 1; font-size: 14px; font-weight: 500; color: var(--gray-700); }
  .type-badge {
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 12px;
    font-weight: 600;
    background: var(--blue-light);
    color: var(--blue);
  }
  .add-col-row { display: flex; gap: 8px; margin-top: 12px; }
  .add-col-row .form-input { flex: 1; }

  /* ── ENTRY FORM ── */
  .entry-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }

  /* ── DATA TABLE ── */
  .data-table-wrap { overflow-x: auto; border-radius: var(--radius-lg); border: 1px solid var(--gray-200); }

  /* ── MODAL ── */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.4);
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    backdrop-filter: blur(2px);
  }
  .modal {
    background: white;
    border-radius: var(--radius-lg);
    padding: 28px;
    width: 100%;
    max-width: 420px;
    box-shadow: var(--shadow-lg);
    animation: popIn 0.2s ease;
  }
  @keyframes popIn {
    from { opacity: 0; transform: scale(0.96) translateY(8px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  .modal-title { font-size: 18px; font-weight: 700; margin-bottom: 16px; color: var(--gray-900); }
  .modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }

  /* ── MISC ── */
  .empty-state {
    text-align: center;
    padding: 48px 24px;
    color: var(--gray-400);
  }
  .empty-state i { font-size: 48px; margin-bottom: 12px; display: block; }
  .empty-state p { font-size: 14px; }
  .spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2px solid var(--gray-200);
    border-top-color: var(--blue);
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .full-center {
    min-height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: var(--gray-500);
  }
  .pending-notice {
    min-height: calc(100vh - 60px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }
  .pending-card {
    background: white;
    border-radius: var(--radius-lg);
    border: 1px solid var(--gray-200);
    padding: 40px;
    max-width: 440px;
    text-align: center;
    box-shadow: var(--shadow-lg);
  }
  .pending-card i { font-size: 48px; color: var(--amber); margin-bottom: 16px; display: block; }
  .pending-card h2 { font-size: 20px; font-weight: 700; margin-bottom: 8px; color: var(--gray-900); }
  .pending-card p { font-size: 14px; color: var(--gray-500); margin-bottom: 20px; }
  select.form-input { cursor: pointer; }
  .tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: var(--blue-light);
    color: var(--blue);
    border-radius: 20px;
    padding: 3px 10px;
    font-size: 12px;
    font-weight: 500;
  }
  .template-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 10px;
    margin-top: 16px;
  }
  .template-card {
    border: 1px solid var(--gray-200);
    border-radius: var(--radius);
    padding: 14px;
    cursor: pointer;
    text-align: center;
    transition: all 0.15s;
    background: none;
    font-family: inherit;
  }
  .template-card:hover {
    border-color: var(--blue);
    background: var(--blue-light);
    color: var(--blue);
  }
  .template-card i { font-size: 22px; display: block; margin-bottom: 6px; color: inherit; }
  .template-card span { font-size: 13px; font-weight: 500; }
  .tab-rename-input {
    border: none;
    background: transparent;
    font-size: 13px;
    font-family: inherit;
    font-weight: 500;
    color: var(--blue);
    width: 100px;
    outline: none;
    padding: 0;
  }

  /* ── HOME CTA ── */
  .cta-section {
    background: var(--gray-900);
    color: white;
    text-align: center;
    padding: 64px 24px;
  }
  .cta-section h2 { font-size: 28px; font-weight: 700; margin-bottom: 12px; }
  .cta-section p { color: rgba(255,255,255,0.7); margin-bottom: 28px; }

  /* ── RESPONSIVE ── */
  @media (max-width: 640px) {
    .admin-sidebar { width: 56px; }
    .sidebar-item span { display: none; }
    .stat-grid { grid-template-columns: 1fr 1fr; }
    .hero h1 { font-size: 26px; }
    .features-grid { grid-template-columns: 1fr; }
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function useMounted() {
  const ref = useRef(true);
  useEffect(() => () => { ref.current = false; }, []);
  return ref;
}

// ─── Demo Animation Component ─────────────────────────────────────────────────
function DemoAnimation() {
  const [slide, setSlide] = useState(0);
  const slides = [
    {
      label: "ধাপ ১ — কলাম সেটআপ",
      content: (
        <div>
          <p style={{ fontSize: 13, color: "var(--gray-500)", marginBottom: 12 }}>
            আপনার প্রয়োজনীয় কলামগুলো তৈরি করুন
          </p>
          {[
            ["শিক্ষার্থীর নাম", "text"],
            ["শ্রেণি", "text"],
            ["রোল নম্বর", "number"],
            ["ছবি", "image"],
          ].map(([name, type], i) => (
            <div key={i} className="demo-col-row">
              <span className="demo-col-pill">{name}</span>
              <span style={{ fontSize: 11, color: "var(--gray-400)" }}>— {type}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      label: "ধাপ ২ — ডেটা এন্ট্রি",
      content: (
        <div>
          <p style={{ fontSize: 13, color: "var(--gray-500)", marginBottom: 12 }}>
            ফর্মে ডেটা পূরণ করুন
          </p>
          <div className="demo-form-row">
            {[
              ["শিক্ষার্থীর নাম", "রাহেলা বেগম"],
              ["শ্রেণি", "দশম"],
              ["রোল নম্বর", "১২৩৪"],
              ["পিতার নাম", "করিম সাহেব"],
            ].map(([label, val]) => (
              <div key={label} className="demo-field">
                <label>{label}</label>
                <div className="demo-field-box">{val}</div>
              </div>
            ))}
          </div>
          <button
            className="btn btn-primary btn-sm"
            style={{ marginTop: 4 }}
          >
            <i className="ti ti-plus" /> এন্ট্রি যোগ করুন
          </button>
        </div>
      ),
    },
    {
      label: "ধাপ ৩ — ডেটা ও ডাউনলোড",
      content: (
        <div>
          <p style={{ fontSize: 13, color: "var(--gray-500)", marginBottom: 12 }}>
            সমস্ত ডেটা দেখুন এবং Excel ডাউনলোড করুন
          </p>
          <table className="demo-table">
            <thead>
              <tr>
                <th>#</th>
                <th>নাম</th>
                <th>শ্রেণি</th>
                <th>রোল</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["১", "রাহেলা বেগম", "দশম", "১২৩৪"],
                ["২", "করিম মিয়া", "নবম", "৫৬৭৮"],
                ["৩", "সুমি আক্তার", "দশম", "৯১০১"],
              ].map((r) => (
                <tr key={r[0]}>
                  {r.map((c, i) => <td key={i}>{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-success btn-sm" style={{ marginTop: 12 }}>
            <i className="ti ti-file-excel" /> Excel ডাউনলোড
          </button>
        </div>
      ),
    },
  ];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % slides.length), 3500);
    return () => clearInterval(t);
  }, []); // eslint-disable-line

  return (
    <div className="demo-section">
      <div className="demo-wrap">
        <h2 className="section-title">কীভাবে কাজ করে</h2>
        <p className="section-sub">মাত্র তিনটি ধাপে Excel ডেটা এন্ট্রি করুন</p>
        <div className="demo-screen">
          <div className="demo-topbar">
            <div className="demo-dot" style={{ background: "#ef4444" }} />
            <div className="demo-dot" style={{ background: "#f59e0b" }} />
            <div className="demo-dot" style={{ background: "#22c55e" }} />
            <span style={{ marginLeft: 12, fontSize: 12, color: "#9ca3af" }}>
              Excel Data Entry App
            </span>
          </div>
          <div className="demo-body">
            <div className="demo-step-label">{slides[slide].label}</div>
            <div key={slide} className="demo-step active">
              {slides[slide].content}
            </div>
          </div>
        </div>
        <div className="demo-progress">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`demo-dot-nav ${i === slide ? "active" : ""}`}
              onClick={() => setSlide(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
function HomePage({ onLogin, onRegister }) {
  const features = [
    {
      icon: "ti-columns",
      title: "কাস্টম কলাম তৈরি",
      desc: "আপনার প্রয়োজন অনুযায়ী যেকোনো কলাম তৈরি করুন — টেক্সট, নম্বর, তারিখ, ছবি।",
    },
    {
      icon: "ti-files",
      title: "একাধিক Excel ফাইল",
      desc: "একসাথে অনেক Excel ফাইল তৈরি করুন এবং যেকোনো সময় পরিবর্তন করুন।",
    },
    {
      icon: "ti-cloud",
      title: "ক্লাউড সিঙ্ক",
      desc: "সব ডেটা ক্লাউডে সেভ হয়। যেকোনো ডিভাইস থেকে একই ডেটা অ্যাক্সেস করুন।",
    },
    {
      icon: "ti-users",
      title: "মাল্টি-ইউজার",
      desc: "অনেক ব্যবহারকারী আলাদা আলাদাভাবে তাদের নিজস্ব ডেটা এন্ট্রি করতে পারবে।",
    },
    {
      icon: "ti-file-excel",
      title: "Excel ডাউনলোড",
      desc: "এক ক্লিকে সম্পূর্ণ ডেটা Excel ফরম্যাটে ডাউনলোড করুন।",
    },
    {
      icon: "ti-shield-check",
      title: "Admin অ্যাপ্রুভাল",
      desc: "Admin অনুমোদনের পরেই ব্যবহারকারী অ্যাপ ব্যবহার করতে পারবে।",
    },
  ];

  const steps = [
    {
      n: "১",
      title: "রেজিস্ট্রেশন করুন",
      desc: "আপনার নাম, ইমেইল ও পাসওয়ার্ড দিয়ে নতুন অ্যাকাউন্ট তৈরি করুন।",
    },
    {
      n: "২",
      title: "Admin অনুমোদনের অপেক্ষা করুন",
      desc: "Admin আপনার অ্যাকাউন্ট যাচাই করে অনুমোদন দেবে।",
    },
    {
      n: "৩",
      title: "লগইন করুন",
      desc: "অনুমোদন পেলে লগইন করুন এবং ডেটা এন্ট্রি শুরু করুন।",
    },
    {
      n: "৪",
      title: "Excel তৈরি করুন",
      desc: "কলাম সেটআপ করুন, ডেটা এন্ট্রি করুন এবং Excel ডাউনলোড করুন।",
    },
  ];

  return (
    <div>
      <div className="hero">
        <h1>📊 Excel ডেটা এন্ট্রি অ্যাপ</h1>
        <p>
          যেকোনো জায়গা থেকে, যেকোনো ডিভাইস থেকে সহজে ডেটা এন্ট্রি করুন এবং Excel
          ফরম্যাটে ডাউনলোড করুন।
        </p>
        <div className="hero-btns">
          <button className="btn btn-white" onClick={onRegister}>
            <i className="ti ti-user-plus" /> বিনামূল্যে শুরু করুন
          </button>
          <button className="btn btn-outline-white" onClick={onLogin}>
            <i className="ti ti-login" /> লগইন করুন
          </button>
        </div>
      </div>

      <div className="features">
        <h2 className="section-title">কেন এই অ্যাপ ব্যবহার করবেন?</h2>
        <p className="section-sub">সহজ, দ্রুত এবং নিরাপদ ডেটা ম্যানেজমেন্ট</p>
        <div className="features-grid">
          {features.map((f) => (
            <div key={f.icon} className="feature-card">
              <div className="feature-icon">
                <i className={`ti ${f.icon}`} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <DemoAnimation />

      <div className="steps-section">
        <h2 className="section-title">কীভাবে শুরু করবেন</h2>
        <p className="section-sub">চারটি সহজ ধাপ অনুসরণ করুন</p>
        <div className="steps-list">
          {steps.map((s) => (
            <div key={s.n} className="step-item">
              <div className="step-num">{s.n}</div>
              <div className="step-content">
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="cta-section">
        <h2>এখনই শুরু করুন</h2>
        <p>বিনামূল্যে অ্যাকাউন্ট তৈরি করুন এবং ডেটা এন্ট্রি শুরু করুন।</p>
        <button className="btn btn-white" onClick={onRegister}>
          <i className="ti ti-rocket" /> রেজিস্ট্রেশন করুন
        </button>
      </div>
    </div>
  );
}

// ─── Auth Page ────────────────────────────────────────────────────────────────
function AuthPage({ initialMode = "login", onBack }) {
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const mounted = useMounted();

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    setError(""); setSuccess("");
    if (!form.email || !form.password) { setError("ইমেইল ও পাসওয়ার্ড দিন"); return; }

    if (mode === "register") {
      if (!form.name.trim()) { setError("নাম দিন"); return; }
      if (form.password !== form.confirm) { setError("পাসওয়ার্ড মিলছে না"); return; }
      if (form.password.length < 6) { setError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে"); return; }
    }

    setLoading(true);
    if (mode === "login") {
      const { error: err } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (!mounted.current) return;
      if (err) setError("লগইন ব্যর্থ: " + err.message);
    } else if (mode === "register") {
      const { data, error: signUpErr } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { full_name: form.name } },
      });
      if (!mounted.current) return;
      if (signUpErr) { setError("রেজিস্ট্রেশন ব্যর্থ: " + signUpErr.message); setLoading(false); return; }
      // Insert pending profile
      if (data.user) {
        await supabase.from("user_profiles").upsert({
          user_id: data.user.id,
          email: form.email,
          full_name: form.name,
          status: "pending",
          created_at: new Date().toISOString(),
        }, { onConflict: "user_id" });
      }
      setSuccess("রেজিস্ট্রেশন সফল! Admin অনুমোদনের পর লগইন করতে পারবেন। ইমেইল যাচাই করুন।");
    } else {
      const { error: err } = await supabase.auth.resetPasswordForEmail(form.email, { redirectTo: "https://easyexcel.vercel.app" });
      if (!mounted.current) return;
      if (err) setError(err.message);
      else setSuccess("পাসওয়ার্ড রিসেট লিংক ইমেইলে পাঠানো হয়েছে।");
    }
    if (mounted.current) setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {onBack && (
          <button className="btn btn-ghost btn-sm" style={{ marginBottom: 12 }} onClick={onBack}>
            <i className="ti ti-arrow-left" /> হোমে ফিরুন
          </button>
        )}
        <div className="auth-logo">
          <i className="ti ti-file-spreadsheet" />
          <h2>Excel ডেটা এন্ট্রি অ্যাপ</h2>
          <p>যেকোনো জায়গা থেকে ডেটা এন্ট্রি করুন</p>
        </div>

        <div className="auth-tabs">
          {[["login", "লগইন"], ["register", "নতুন অ্যাকাউন্ট"]].map(([m, label]) => (
            <button
              key={m}
              className={`auth-tab ${mode === m ? "active" : ""}`}
              onClick={() => { setMode(m); setError(""); setSuccess(""); }}
            >
              {label}
            </button>
          ))}
        </div>

        {error && <div className="alert alert-error"><i className="ti ti-alert-circle" />{error}</div>}
        {success && <div className="alert alert-success"><i className="ti ti-circle-check" />{success}</div>}

        {mode !== "forgot" && (
          <>
            {mode === "register" && (
              <div className="form-group">
                <label className="form-label">পূর্ণ নাম</label>
                <input className="form-input" placeholder="আপনার নাম লিখুন" value={form.name} onChange={set("name")} />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">ইমেইল</label>
              <input className="form-input" type="email" placeholder="আপনার ইমেইল" value={form.email} onChange={set("email")}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
            </div>
            <div className="form-group">
              <label className="form-label">পাসওয়ার্ড</label>
              <input className="form-input" type="password" placeholder="পাসওয়ার্ড" value={form.password} onChange={set("password")}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
            </div>
            {mode === "register" && (
              <div className="form-group">
                <label className="form-label">পাসওয়ার্ড নিশ্চিত করুন</label>
                <input className="form-input" type="password" placeholder="আবার পাসওয়ার্ড দিন" value={form.confirm} onChange={set("confirm")}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
              </div>
            )}
            <button className="btn btn-primary" style={{ width: "100%" }} onClick={handleSubmit} disabled={loading}>
              {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> অপেক্ষা করুন...</>
                : mode === "login" ? <><i className="ti ti-login" /> লগইন করুন</>
                : <><i className="ti ti-user-plus" /> অ্যাকাউন্ট তৈরি করুন</>}
            </button>
            {mode === "login" && (
              <button className="btn btn-ghost" style={{ width: "100%", marginTop: 8 }}
                onClick={() => { setMode("forgot"); setError(""); setSuccess(""); }}>
                পাসওয়ার্ড ভুলে গেছেন?
              </button>
            )}
          </>
        )}

        {mode === "forgot" && (
          <>
            <div className="form-group">
              <label className="form-label">ইমেইল</label>
              <input className="form-input" type="email" placeholder="আপনার ইমেইল" value={form.email} onChange={set("email")} autoFocus />
            </div>
            <button className="btn btn-primary" style={{ width: "100%" }} onClick={handleSubmit} disabled={loading}>
              {loading ? "পাঠানো হচ্ছে..." : "রিসেট লিংক পাঠান"}
            </button>
            <button className="btn btn-ghost" style={{ width: "100%", marginTop: 8 }}
              onClick={() => { setMode("login"); setError(""); setSuccess(""); }}>
              <i className="ti ti-arrow-left" /> লগইনে ফিরুন
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Admin Panel ──────────────────────────────────────────────────────────────
function AdminPanel({ user, onLogout }) {
  const [tab, setTab] = useState("pending");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("user_profiles").select("*").order("created_at", { ascending: false });
    setUsers(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const updateStatus = async (userId, status) => {
    await supabase.from("user_profiles").update({ status, updated_at: new Date().toISOString() }).eq("user_id", userId);
    loadUsers();
  };

  const [pwModal, setPwModal] = useState(null);
  const [newPw, setNewPw] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  const changePassword = async () => {
    if (!newPw || newPw.length < 6) { alert("পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে"); return; }
    setPwLoading(true);
    // Use Supabase admin API via service role - requires Edge Function
    // Fallback: send reset email
    const { error } = await supabase.auth.resetPasswordForEmail(pwModal.email, {
      redirectTo: "https://easyexcel.vercel.app",
    });
    setPwLoading(false);
    if (error) alert("ব্যর্থ: " + error.message);
    else { alert(pwModal.email + " এ পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে।"); setPwModal(null); setNewPw(""); }
  };


  const filtered = users.filter((u) => {
    if (tab === "pending") return u.status === "pending";
    if (tab === "approved") return u.status === "approved";
    if (tab === "all") return true;
    return false;
  });

  const counts = {
    pending: users.filter((u) => u.status === "pending").length,
    approved: users.filter((u) => u.status === "approved").length,
    total: users.length,
  };

  return (
    <>
    <div>
      <nav className="navbar">
        <div className="navbar-brand">
          <i className="ti ti-file-spreadsheet" />
          <span>Excel App — Admin</span>
        </div>
        <div className="navbar-actions">
          <span style={{ fontSize: 13, color: "var(--gray-500)" }}>
            <i className="ti ti-user" /> {user.email}
          </span>
          <button className="btn btn-outline btn-sm" onClick={() => setActiveTab(null)}>
            <i className="ti ti-layout-dashboard" /> ড্যাশবোর্ড
          </button>
          <button className="btn btn-outline btn-sm" onClick={onLogout}>
            <i className="ti ti-logout" /> লগআউট
          </button>
        </div>
      </nav>

      <div className="admin-layout">
        <aside className="admin-sidebar">
          {[
            ["pending", "ti-clock", "অপেক্ষমান"],
            ["approved", "ti-circle-check", "অনুমোদিত"],
            ["all", "ti-users", "সব ইউজার"],
          ].map(([id, icon, label]) => (
            <button
              key={id}
              className={`sidebar-item ${tab === id ? "active" : ""}`}
              onClick={() => setTab(id)}
            >
              <i className={`ti ${icon}`} />
              <span>{label}</span>
            </button>
          ))}
        </aside>

        <main className="admin-main">
          <div className="page-title">Admin প্যানেল</div>
          <div className="page-sub">ইউজার অনুমোদন ও ম্যানেজ করুন</div>

          <div className="stat-grid">
            {[
              { label: "মোট ইউজার", val: counts.total, icon: "ti-users", bg: "#eff6ff", color: "#2563eb" },
              { label: "অপেক্ষমান", val: counts.pending, icon: "ti-clock", bg: "#fffbeb", color: "#d97706" },
              { label: "অনুমোদিত", val: counts.approved, icon: "ti-circle-check", bg: "#f0fdf4", color: "#16a34a" },
            ].map((s) => (
              <div key={s.label} className="stat-card">
                <div className="stat-icon" style={{ background: s.bg, color: s.color }}>
                  <i className={`ti ${s.icon}`} />
                </div>
                <div className="stat-val">{s.val}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {loading ? (
            <div className="full-center" style={{ minHeight: 200 }}>
              <span className="spinner" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="table-wrap">
              <div className="empty-state">
                <i className="ti ti-users" />
                <p>কোনো ইউজার নেই</p>
              </div>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>নাম</th>
                    <th>ইমেইল</th>
                    <th>রেজিস্ট্রেশন</th>
                    <th>স্ট্যাটাস</th>
                    <th>অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u.user_id}>
                      <td style={{ fontWeight: 500 }}>{u.full_name || "—"}</td>
                      <td>{u.email}</td>
                      <td style={{ fontSize: 13, color: "var(--gray-400)" }}>
                        {new Date(u.created_at).toLocaleDateString("bn-BD")}
                      </td>
                      <td>
                        <span className={`badge badge-${u.status}`}>
                          {u.status === "pending" && "অপেক্ষমান"}
                          {u.status === "approved" && "অনুমোদিত"}
                          {u.status === "rejected" && "বাতিল"}
                          {u.status === "blocked" && "ব্লক"}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          {u.status !== "approved" && (
                            <button className="btn btn-success btn-sm" onClick={() => updateStatus(u.user_id, "approved")}>
                              <i className="ti ti-check" /> অনুমোদন
                            </button>
                          )}
                          {u.status !== "rejected" && (
                            <button className="btn btn-danger btn-sm" onClick={() => updateStatus(u.user_id, "rejected")}>
                              <i className="ti ti-x" /> বাতিল
                            </button>
                          )}
                          {u.status !== "blocked" && (
                            <button className="btn btn-sm" style={{background:"#7c3aed",color:"white"}} onClick={() => updateStatus(u.user_id, "blocked")}>
                              <i className="ti ti-ban" /> ব্লক
                            </button>
                          )}
                          {u.status === "blocked" && (
                            <button className="btn btn-success btn-sm" onClick={() => updateStatus(u.user_id, "approved")}>
                              <i className="ti ti-lock-open" /> আনব্লক
                            </button>
                          )}
                          <button className="btn btn-outline btn-sm" onClick={() => { setPwModal({user_id: u.user_id, email: u.email}); setNewPw(""); }}>
                            <i className="ti ti-key" /> পাসওয়ার্ড পরিবর্তন
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>

    {/* Password Change Modal */}
    {pwModal && (
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}}>
        <div style={{background:"white",borderRadius:12,padding:32,width:360,boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
          <h3 style={{marginBottom:8,fontSize:18,fontWeight:700}}>পাসওয়ার্ড পরিবর্তন</h3>
          <p style={{fontSize:13,color:"#6b7280",marginBottom:20}}>{pwModal.email}</p>
          <input
            type="password"
            placeholder="নতুন পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)"
            value={newPw}
            onChange={e => setNewPw(e.target.value)}
            style={{width:"100%",padding:"10px 12px",border:"1px solid #d1d5db",borderRadius:8,fontSize:14,marginBottom:16,boxSizing:"border-box"}}
          />
          <div style={{display:"flex",gap:8}}>
            <button className="btn btn-primary" style={{flex:1}} onClick={changePassword} disabled={pwLoading}>
              {pwLoading ? "পাঠানো হচ্ছে..." : "রিসেট লিংক পাঠান"}
            </button>
            <button className="btn btn-outline" style={{flex:1}} onClick={() => setPwModal(null)}>বাতিল</button>
          </div>
          <p style={{fontSize:12,color:"#9ca3af",marginTop:12,textAlign:"center"}}>User এর email এ একটি reset link পাঠানো হবে</p>
        </div>
      </div>
    )}
  </>
  );
}

// ─── Excel Tab Store ──────────────────────────────────────────────────────────
function useExcelStore(user, excelId) {
  const [columns, setColumns] = useState([]);
  const [entries, setEntries] = useState([]);
  const [dupCheck, setDupCheck] = useState(false);
  const [primaryCol, setPrimaryCol] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user || !excelId) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const [cfg, ents] = await Promise.all([
        supabase.from("form_configs").select("*").eq("user_id", user.id).eq("form_id", excelId).single(),
        supabase.from("entries").select("*").eq("user_id", user.id).eq("form_id", excelId).order("serial_no", { ascending: true }),
      ]);
      if (cancelled) return;
      if (cfg.data) {
        setColumns(cfg.data.columns || []);
        setDupCheck(cfg.data.duplicate_check || false);
        setPrimaryCol(cfg.data.primary_column || "");
      } else {
        setColumns([]); setDupCheck(false); setPrimaryCol("");
      }
      setEntries((ents.data || []).map((r) => ({ ...r.data, __serial: r.serial_no, __id: r.id })));
      setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, [user, excelId]);

  const saveConfig = useCallback(async (cols, dup, prim) => {
    if (!user) return;
    await supabase.from("form_configs").upsert({
      user_id: user.id, form_id: excelId,
      columns: cols, duplicate_check: dup, primary_column: prim,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,form_id" });
  }, [user, excelId]);

  const addColumn = useCallback(async (name, type, minDigits, maxDigits) => {
    if (!name.trim()) return { error: "কলামের নাম লিখুন" };
    if (columns.find((c) => c.name === name.trim())) return { error: "এই নামের কলাম আছে" };
    const col = { id: Date.now(), name: name.trim(), type };
    if (type === "number" && (minDigits || maxDigits)) {
      if (minDigits) col.minDigits = parseInt(minDigits);
      if (maxDigits) col.maxDigits = parseInt(maxDigits);
    }
    const newCols = [...columns, col];
    setColumns(newCols);
    await saveConfig(newCols, dupCheck, primaryCol);
    return { ok: true };
  }, [columns, dupCheck, primaryCol, saveConfig]);

  const removeColumn = useCallback(async (id) => {
    const col = columns.find((c) => c.id === id);
    const newCols = columns.filter((c) => c.id !== id);
    const newPrim = col && primaryCol === col.name ? "" : primaryCol;
    setColumns(newCols);
    if (newPrim !== primaryCol) setPrimaryCol(newPrim);
    await saveConfig(newCols, dupCheck, newPrim);
  }, [columns, primaryCol, dupCheck, saveConfig]);

  const updateColumnType = useCallback(async (id, type) => {
    const newCols = columns.map((c) => (c.id === id ? { ...c, type } : c));
    setColumns(newCols);
    await saveConfig(newCols, dupCheck, primaryCol);
  }, [columns, dupCheck, primaryCol, saveConfig]);

  const reorderColumns = useCallback(async (from, to) => {
    const next = [...columns];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setColumns(next);
    await saveConfig(next, dupCheck, primaryCol);
  }, [columns, dupCheck, primaryCol, saveConfig]);

  const handleSetDupCheck = useCallback(async (val) => {
    setDupCheck(val);
    const newPrim = val ? primaryCol : "";
    if (!val) setPrimaryCol("");
    await saveConfig(columns, val, newPrim);
  }, [columns, primaryCol, saveConfig]);

  const handleSetPrimaryCol = useCallback(async (col) => {
    setPrimaryCol(col);
    await saveConfig(columns, dupCheck, col);
  }, [columns, dupCheck, saveConfig]);

  const addEntry = useCallback(async (formValues) => {
    if (dupCheck && primaryCol) {
      const newVal = (formValues[primaryCol] || "").toString().trim().toLowerCase();
      if (newVal && entries.some((e) => (e[primaryCol] || "").toString().trim().toLowerCase() === newVal)) {
        return { duplicate: true, field: primaryCol };
      }
    }
    setSaving(true);
    const serial = entries.length + 1;
    const { data, error } = await supabase.from("entries").insert({
      user_id: user.id, form_id: excelId, serial_no: serial, data: formValues,
    }).select().single();
    if (error) { setSaving(false); return { error: error.message }; }
    setEntries((prev) => [...prev, { ...formValues, __serial: serial, __id: data.id }]);
    setSaving(false);
    return { ok: true, serial };
  }, [entries, dupCheck, primaryCol, user, excelId]);

  const deleteEntry = useCallback(async (idx) => {
    const entry = entries[idx];
    if (!entry?.__id) return;
    await supabase.from("entries").delete().eq("id", entry.__id);
    const next = entries.filter((_, i) => i !== idx);
    await Promise.all(next.map((e, i) =>
      supabase.from("entries").update({ serial_no: i + 1 }).eq("id", e.__id)
    ));
    setEntries(next.map((e, i) => ({ ...e, __serial: i + 1 })));
  }, [entries]);

  const updateEntry = useCallback(async (idx, updatedValues) => {
    const entry = entries[idx];
    if (!entry?.__id) return;
    const { error } = await supabase.from("entries").update({ data: updatedValues }).eq("id", entry.__id);
    if (!error) {
      setEntries((prev) => prev.map((e, i) => i === idx ? { ...e, ...updatedValues } : e));
    }
    return { error };
  }, [entries]);


  const updateEntry = async (idx, updatedValues) => {
    const entry = entries[idx];
    if (!entry?.__id) return { error: "Not found" };
    const { error } = await supabase.from("entries").update({ data: updatedValues }).eq("id", entry.__id);
    if (!error) setEntries((prev) => prev.map((e, i) => i === idx ? { ...e, ...updatedValues } : e));
    return { error };
  };
  const clearAll = useCallback(async () => {
    setColumns([]); setEntries([]); setPrimaryCol(""); setDupCheck(false);
    if (!user) return;
    await supabase.from("entries").delete().eq("user_id", user.id).eq("form_id", excelId);
    await supabase.from("form_configs").delete().eq("user_id", user.id).eq("form_id", excelId);
  }, [user, excelId]);

  const loadTemplate = useCallback(async (tpl) => {
    const templates = {
      student: [
        { id: 1, name: "শিক্ষার্থীর নাম", type: "text" },
        { id: 2, name: "শ্রেণি", type: "text" },
        { id: 3, name: "রোল নম্বর", type: "number" },
        { id: 4, name: "পিতার নাম", type: "text" },
        { id: 5, name: "মোবাইল", type: "text" },
        { id: 6, name: "ছবি", type: "image" },
      ],
      employee: [
        { id: 1, name: "কর্মচারীর নাম", type: "text" },
        { id: 2, name: "পদবি", type: "text" },
        { id: 3, name: "বিভাগ", type: "text" },
        { id: 4, name: "যোগদানের তারিখ", type: "date" },
        { id: 5, name: "বেতন", type: "number" },
        { id: 6, name: "ছবি", type: "image" },
      ],
      product: [
        { id: 1, name: "পণ্যের নাম", type: "text" },
        { id: 2, name: "পণ্য কোড", type: "text" },
        { id: 3, name: "মূল্য", type: "number" },
        { id: 4, name: "পরিমাণ", type: "number" },
        { id: 5, name: "বিবরণ", type: "textarea" },
        { id: 6, name: "ছবি", type: "image" },
      ],
    };
    const cols = templates[tpl] || [];
    setColumns(cols); setEntries([]); setPrimaryCol(""); setDupCheck(false);
    if (!user) return;
    await supabase.from("entries").delete().eq("user_id", user.id).eq("form_id", excelId);
    await saveConfig(cols, false, "");
  }, [user, excelId, saveConfig]);

  return {
    columns, entries, dupCheck, primaryCol, loading, saving,
    addColumn, removeColumn, updateColumnType, reorderColumns,
    setDupCheck: handleSetDupCheck, setPrimaryCol: handleSetPrimaryCol,
    addEntry, deleteEntry, updateEntry, clearAll, loadTemplate,
  };
}

// ─── Step One: Column Setup ───────────────────────────────────────────────────
function StepOne({ store, onNext }) {
  const { columns, addColumn, removeColumn, updateColumnType, reorderColumns, loadTemplate } = store;
  const [name, setName] = useState("");
  const [type, setType] = useState("text");
  const [minDigits, setMinDigits] = useState("");
  const [maxDigits, setMaxDigits] = useState("");
  const [err, setErr] = useState("");
  const [dragIdx, setDragIdx] = useState(null);

  const handleAdd = async () => {
    const res = await addColumn(name, type, minDigits, maxDigits);
    if (res.error) setErr(res.error);
    else { setName(""); setMinDigits(""); setMaxDigits(""); setErr(""); }
  };

  const TYPES = [
    { value: "text", label: "টেক্সট" },
    { value: "number", label: "সংখ্যা" },
    { value: "date", label: "তারিখ" },
    { value: "textarea", label: "বড় টেক্সট" },
    { value: "image", label: "ছবি" },
    { value: "email", label: "ইমেইল" },
    { value: "phone", label: "ফোন নম্বর" },
    { value: "boolean", label: "হ্যাঁ/না" },
  ];
  const typeLabel = (v) => TYPES.find(t => t.value === v)?.label || v;

  return (
    <div>
      <div className="panel">
        <div className="panel-title"><i className="ti ti-layout-columns" /> কলাম সেটআপ</div>
        <p style={{ fontSize: 13, color: "var(--gray-500)", marginBottom: 16 }}>
          আপনার Excel এর কলামগুলো এখানে তৈরি করুন। টেনে এনে ক্রম পরিবর্তন করুন।
        </p>

        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--gray-600)", marginBottom: 8 }}>
          টেমপ্লেট ব্যবহার করুন:
        </p>
        <div className="template-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
          {[
            ["student", "ti-school", "শিক্ষার্থী"],
            ["employee", "ti-briefcase", "কর্মচারী"],
            ["product", "ti-package", "পণ্য"],
          ].map(([key, icon, label]) => (
            <button key={key} className="template-card" onClick={() => loadTemplate(key)}>
              <i className={`ti ${icon}`} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {columns.length === 0 ? (
          <div className="empty-state" style={{ padding: "24px" }}>
            <i className="ti ti-table-plus" />
            <p>এখনো কোনো কলাম নেই। নিচে থেকে যোগ করুন।</p>
          </div>
        ) : (
          <div>
            {columns.map((col, i) => (
              <div
                key={col.id}
                className="col-row"
                draggable
                onDragStart={() => setDragIdx(i)}
                onDragOver={(e) => { e.preventDefault(); }}
                onDrop={() => { if (dragIdx !== null && dragIdx !== i) reorderColumns(dragIdx, i); setDragIdx(null); }}
              >
                <span className="col-drag"><i className="ti ti-grip-vertical" /></span>
                <span className="col-name">{col.name}</span>
                <span style={{fontSize:11,color:"var(--gray-400)",background:"var(--gray-100)",padding:"2px 6px",borderRadius:4,marginRight:4}}>{typeLabel(col.type)}</span>
                {col.type === "number" && (col.minDigits || col.maxDigits) && (
                  <span style={{fontSize:11,color:"var(--blue)",background:"var(--blue-light)",padding:"2px 6px",borderRadius:4,marginRight:4}}>
                    {col.minDigits && col.maxDigits ? `${col.minDigits}-${col.maxDigits} সংখ্যা` : col.minDigits ? `সর্বনিম্ন ${col.minDigits}` : `সর্বোচ্চ ${col.maxDigits}`}
                  </span>
                )}
                <select
                  className="form-input"
                  style={{ width: 110, padding: "4px 8px", fontSize: 12 }}
                  value={col.type}
                  onChange={(e) => updateColumnType(col.id, e.target.value)}
                >
                  {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                <button className="btn btn-ghost btn-sm" style={{ color: "var(--red)", padding: "4px 8px" }}
                  onClick={() => removeColumn(col.id)}>
                  <i className="ti ti-trash" />
                </button>
              </div>
            ))}
          </div>
        )}

        {err && <div className="alert alert-error" style={{ marginTop: 8 }}><i className="ti ti-alert-circle" />{err}</div>}

        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <div className="add-col-row">
            <input
              className="form-input"
              placeholder="কলামের নাম"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <select className="form-input" style={{ width: 120 }} value={type} onChange={(e) => setType(e.target.value)}>
              {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <button className="btn btn-primary" onClick={handleAdd}>
              <i className="ti ti-plus" /> যোগ
            </button>
          </div>
          {type === "number" && (
            <div style={{display:"flex",gap:8,alignItems:"center",padding:"10px 12px",background:"var(--blue-light)",borderRadius:8,border:"1px solid var(--blue-mid)"}}>
              <span style={{fontSize:13,color:"var(--blue)",fontWeight:600,whiteSpace:"nowrap"}}><i className="ti ti-ruler-2" /> সংখ্যার সীমা:</span>
              <input
                className="form-input"
                style={{width:100}}
                type="number"
                placeholder="সর্বনিম্ন সংখ্যা"
                value={minDigits}
                onChange={e => setMinDigits(e.target.value)}
                min={1}
              />
              <span style={{color:"var(--gray-400)"}}>—</span>
              <input
                className="form-input"
                style={{width:100}}
                type="number"
                placeholder="সর্বোচ্চ সংখ্যা"
                value={maxDigits}
                onChange={e => setMaxDigits(e.target.value)}
                min={1}
              />
              <span style={{fontSize:12,color:"var(--gray-500)"}}>(খালি রাখলে কোনো সীমা থাকবে না)</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="btn btn-primary" onClick={onNext} disabled={columns.length === 0}>
          পরবর্তী ধাপ <i className="ti ti-arrow-right" />
        </button>
      </div>
    </div>
  );
}

// ─── Step Two: Data Entry ─────────────────────────────────────────────────────
function StepTwo({ store, onBack, onViewData }) {
  const { columns, addEntry, saving, dupCheck, primaryCol, setDupCheck, setPrimaryCol } = store;
  const [formValues, setFormValues] = useState(() => {
    const init = {};
    // auto-fill date columns with today
    return init;
  });
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    const init = {};
    columns.forEach(col => {
      if (col.type === "date") init[col.name] = new Date().toISOString().split("T")[0];
    });
    setFormValues(init);
  }, []); // eslint-disable-line

  const handleSubmit = async () => {
    setMsg(null);
    // Validate: all fields required
    for (const col of columns) {
      const val = formValues[col.name];
      if (col.type === "image") continue; // image optional
      if (!val || val.toString().trim() === "") {
        setMsg({ type: "error", text: `"${col.name}" পূরণ করা আবশ্যক!` });
        return;
      }
      // Phone: must be exactly 11 digits
      if (col.type === "phone") {
        const digits = val.toString().replace(/\D/g, "");
        if (digits.length !== 11) {
          setMsg({ type: "error", text: `"${col.name}" অবশ্যই ১১ সংখ্যার হতে হবে!` });
          return;
        }
      }
      // Number: check min/max digit length
      if (col.type === "number" && (col.minDigits || col.maxDigits)) {
        const dlen = val.toString().replace(/[^0-9]/g, "").length;
        if (col.minDigits && dlen < col.minDigits) {
          setMsg({ type: "error", text: `"${col.name}" u09b8u09b0u09cdu09acu09a8u09bfu09aeu09cdu09a8 ${col.minDigits} u09b8u0982u0996u09cdu09afu09beu09b0 u09b9u09a4u09c7 u09b9u09acu09c7!` });
          return;
        }
        if (col.maxDigits && dlen > col.maxDigits) {
          setMsg({ type: "error", text: `"${col.name}" u09b8u09b0u09cdu09acu09cbu099au09cdu099a ${col.maxDigits} u09b8u0982u0996u09cdu09afu09beu09b0 u09b9u09a4u09c7 u09b9u09acu09c7!` });
          return;
        }
      }
    }
    // Format phone as text with leading zero for Excel
    const cleanValues = { ...formValues };
    columns.forEach(col => {
      if (col.type === "phone" && cleanValues[col.name]) {
        cleanValues[col.name] = cleanValues[col.name].toString().replace(/\D/g, "");
      }
    });
    const res = await addEntry(cleanValues);
    if (res.duplicate) {
      setMsg({ type: "error", text: `"${res.field}" তে ডুপ্লিকেট এন্ট্রি!` });
    } else if (res.error) {
      setMsg({ type: "error", text: res.error });
    } else {
      setMsg({ type: "success", text: `এন্ট্রি #${res.serial} সফলভাবে যোগ হয়েছে!` });
      // Reset: keep date fields with today's date
      const reset = {};
      columns.forEach(col => {
        if (col.type === "date") reset[col.name] = new Date().toISOString().split("T")[0];
      });
      setFormValues(reset);
    }
  };

  const toBase64 = (file) =>
    new Promise((res) => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.readAsDataURL(file);
    });

  return (
    <div>
      <div className="panel">
        <div className="panel-title"><i className="ti ti-forms" /> ডেটা এন্ট্রি</div>

        {msg && (
          <div className={`alert alert-${msg.type}`}>
            <i className={`ti ${msg.type === "error" ? "ti-alert-circle" : "ti-circle-check"}`} />
            {msg.text}
          </div>
        )}

        <div className="entry-grid">
          {columns.map((col) => (
            <div key={col.id} className="form-group">
              <label className="form-label">{col.name}</label>
              {col.type === "textarea" ? (
                <textarea
                  className="form-input"
                  rows={3}
                  style={{ resize: "vertical" }}
                  placeholder={col.name + " লিখুন"}
                  value={formValues[col.name] || ""}
                  onChange={(e) => setFormValues((f) => ({ ...f, [col.name]: e.target.value }))}
                />
              ) : col.type === "image" ? (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-input"
                    style={{ padding: "6px" }}
                    onChange={async (e) => {
                      if (e.target.files[0]) {
                        const b64 = await toBase64(e.target.files[0]);
                        setFormValues((f) => ({ ...f, [col.name]: b64 }));
                      }
                    }}
                  />
                  {formValues[col.name] && (
                    <img src={formValues[col.name]} alt="" style={{ marginTop: 6, width: 60, height: 60, objectFit: "cover", borderRadius: 6, border: "1px solid var(--gray-200)" }} />
                  )}
                </div>
              ) : col.type === "boolean" ? (
                <select
                  className="form-input"
                  value={formValues[col.name] || ""}
                  onChange={(e) => setFormValues((f) => ({ ...f, [col.name]: e.target.value }))}
                >
                  <option value="">বেছে নিন</option>
                  <option value="হ্যাঁ">হ্যাঁ</option>
                  <option value="না">না</option>
                </select>
              ) : col.type === "phone" ? (
                <div>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="০১XXXXXXXXX (১১ সংখ্যা)"
                    maxLength={11}
                    value={formValues[col.name] || ""}
                    onChange={(e) => {
                      const v = e.target.value.replace(/[^0-9]/g, "").slice(0, 11);
                      setFormValues((f) => ({ ...f, [col.name]: v }));
                    }}
                  />
                  <span style={{fontSize:11,color:(formValues[col.name]||"").length===11?"var(--green)":"var(--gray-400)",marginTop:3,display:"block"}}>
                    {(formValues[col.name]||"").length}/১১ সংখ্যা
                  </span>
                </div>
              ) : col.type === "date" ? (
                <div style={{position:"relative"}}>
                  <input
                    type="date"
                    className="form-input"
                    value={formValues[col.name] || ""}
                    onChange={(e) => setFormValues((f) => ({ ...f, [col.name]: e.target.value }))}
                    style={{paddingRight:36}}
                  />
                  <span style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",color:"var(--gray-400)",pointerEvents:"none",fontSize:16}}>
                    <i className="ti ti-calendar" />
                  </span>
                </div>
              ) : (
                <div>
                  <input
                    type={col.type === "number" ? "number" : col.type === "email" ? "email" : "text"}
                    className="form-input"
                    placeholder={col.name + " লিখুন"}
                    value={formValues[col.name] || ""}
                    onChange={(e) => setFormValues((f) => ({ ...f, [col.name]: e.target.value }))}
                  />
                  {col.type === "number" && (col.minDigits || col.maxDigits) && (
                    <span style={{fontSize:11,color:"var(--gray-400)",marginTop:3,display:"block"}}>
                      {col.minDigits && col.maxDigits
                        ? `${col.minDigits} থেকে ${col.maxDigits} সংখ্যার মধ্যে হতে হবে`
                        : col.minDigits ? `সর্বনিম্ন ${col.minDigits} সংখ্যা`
                        : `সর্বোচ্চ ${col.maxDigits} সংখ্যা`}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, padding: "12px", background: "var(--gray-50)", borderRadius: "var(--radius)", border: "1px solid var(--gray-200)" }}>
          <input
            type="checkbox"
            id="dupCheck"
            checked={dupCheck}
            onChange={(e) => setDupCheck(e.target.checked)}
            style={{ cursor: "pointer" }}
          />
          <label htmlFor="dupCheck" style={{ fontSize: 13, cursor: "pointer", color: "var(--gray-700)", fontWeight: 500 }}>
            ডুপ্লিকেট চেক করুন
          </label>
          {dupCheck && (
            <select
              className="form-input"
              style={{ width: "auto", fontSize: 13, padding: "4px 8px" }}
              value={primaryCol}
              onChange={(e) => setPrimaryCol(e.target.value)}
            >
              <option value="">কলাম বেছে নিন</option>
              {columns.filter((c) => c.type !== "image").map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          )}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? <><span className="spinner" style={{ width: 16, height: 16 }} /> সেভ হচ্ছে...</>
              : <><i className="ti ti-plus" /> এন্ট্রি যোগ করুন</>}
          </button>
          <button className="btn btn-outline" onClick={onViewData}>
            <i className="ti ti-table" /> ডেটা দেখুন
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn btn-outline" onClick={onBack}>
          <i className="ti ti-arrow-left" /> পেছনে
        </button>
      </div>
    </div>
  );
}

// ─── Step Three: Data & Download ──────────────────────────────────────────────
function StepThree({ store, tabName, onBack, onAddEntry }) {
  const { columns, entries, deleteEntry, updateEntry, clearAll } = store;
  const [confirmClear, setConfirmClear] = useState(false);
  const [search, setSearch] = useState("");
  const [editModal, setEditModal] = useState(null); // {idx, values}
  const [editValues, setEditValues] = useState({});
  const [editSaving, setEditSaving] = useState(false);
  const [dlModal, setDlModal] = useState(false);
  const [orientation, setOrientation] = useState("portrait");

  const openEdit = (idx) => {
    setEditValues({ ...entries[idx] });
    setEditModal({ idx });
  };

  const saveEdit = async () => {
    setEditSaving(true);
    await updateEntry(editModal.idx, editValues);
    setEditSaving(false);
    setEditModal(null);
  };

  const toBase64Edit = (file) => new Promise((res) => {
    const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(file);
  });

  const downloadPDF = () => {
    const isLandscape = orientation === "landscape";
    const pageW = isLandscape ? 297 : 210;
    const pageH = isLandscape ? 210 : 297;
    const margin = 10;
    const cols = columns.filter(c => c.type !== "image");
    const colW = (pageW - margin*2) / (cols.length + 1);

    let html = `<html><head><style>
      @page { size: ${isLandscape ? "A4 landscape" : "A4 portrait"}; margin: 10mm; }
      body { font-family: Arial, sans-serif; font-size: 10px; }
      h2 { text-align: center; margin-bottom: 8px; font-size: 14px; }
      table { width: 100%; border-collapse: collapse; }
      th { background: #2563eb; color: white; padding: 6px 4px; text-align: left; border: 1px solid #ccc; }
      td { padding: 5px 4px; border: 1px solid #ddd; }
      tr:nth-child(even) { background: #f8fafc; }
    </style></head><body>
    <h2>${tabName || "ডেটা"}</h2>
    <table><thead><tr><th>#</th>${cols.map(c => `<th>${c.name}</th>`).join("")}</tr></thead><tbody>
    ${entries.map((e, i) => `<tr><td>${i+1}</td>${cols.map(c => `<td>${e[c.name] ?? ""}</td>`).join("")}</tr>`).join("")}
    </tbody></table></body></html>`;

    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
    w.print();
  };

  const downloadWord = () => {
    const isLandscape = orientation === "landscape";
    const cols = columns.filter(c => c.type !== "image");
    const orientStr = isLandscape
      ? `<w:pgSz w:w="16838" w:h="11906" w:orient="landscape"/>`
      : `<w:pgSz w:w="11906" w:h="16838"/>`;

    const rows = entries.map((e, i) =>
      `<w:tr>${["#", ...cols.map(c => c.name)].map((_, ci) => {
        const val = ci === 0 ? String(i+1) : (e[cols[ci-1]?.name] ?? "");
        return `<w:tc><w:p><w:r><w:t>${String(val).replace(/&/g,"&amp;").replace(/</g,"&lt;")}</w:t></w:r></w:p></w:tc>`;
      }).join("")}</w:tr>`
    ).join("");

    const headerRow = `<w:tr style="background:#2563eb">${["#", ...cols.map(c=>c.name)].map(h =>
      `<w:tc><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/></w:rPr><w:t>${h}</w:t></w:r></w:p></w:tc>`
    ).join("")}</w:tr>`;

    const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:body><w:sectPr>${orientStr}<w:pgMar w:top="720" w:right="720" w:bottom="720" w:left="720"/></w:sectPr>
<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="28"/></w:rPr><w:t>${tabName||"ডেটা"}</w:t></w:r></w:p>
<w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/><w:tblBorders>
<w:top w:val="single"/><w:left w:val="single"/><w:bottom w:val="single"/><w:right w:val="single"/><w:insideH w:val="single"/><w:insideV w:val="single"/>
</w:tblBorders></w:tblPr>${headerRow}${rows}</w:tbl>
</w:body></w:document>`;

    const blob = new Blob([xml], {type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${tabName||"data"}.docx`; a.click();
  };

  const filtered = entries.filter((e) =>
    columns.some((c) => (e[c.name] || "").toString().toLowerCase().includes(search.toLowerCase()))
  );

  const downloadExcel = () => {
    const ws_data = [
      ["#", ...columns.map((c) => c.name)],
      ...entries.map((e, i) => [i + 1, ...columns.map((c) => {
        if (c.type === "image") return e[c.name] ? "[ছবি]" : "";
        return e[c.name] ?? "";
      })]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    // Force phone columns to text format to preserve leading zero
    columns.forEach((c, ci) => {
      if (c.type === "phone") {
        entries.forEach((_, ri) => {
          const cellRef = XLSX.utils.encode_cell({ r: ri + 1, c: ci + 1 });
          if (ws[cellRef]) ws[cellRef].t = "s";
        });
      }
    });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, tabName || "Sheet1");
    XLSX.writeFile(wb, `${tabName || "data"}.xlsx`);
  };

  return (
    <div>
      <div className="panel">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
          <div className="panel-title" style={{ margin: 0 }}>
            <i className="ti ti-table" /> ডেটা ({entries.length}টি রেকর্ড)
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
              className="form-input"
              style={{ width: 200 }}
              placeholder="খুঁজুন..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn-success" onClick={downloadExcel} disabled={entries.length === 0}>
              <i className="ti ti-file-excel" /> Excel
            </button>
            <button className="btn btn-outline" onClick={() => setDlModal("pdf")} disabled={entries.length === 0}
              style={{borderColor:"#dc2626",color:"#dc2626"}}>
              <i className="ti ti-file-type-pdf" /> PDF
            </button>
            <button className="btn btn-outline" onClick={() => setDlModal("word")} disabled={entries.length === 0}
              style={{borderColor:"#2563eb",color:"#2563eb"}}>
              <i className="ti ti-file-word" /> Word
            </button>
            <button className="btn btn-outline" onClick={onAddEntry}>
              <i className="ti ti-plus" /> এন্ট্রি যোগ
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => setConfirmClear(true)}>
              <i className="ti ti-trash" />
            </button>
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="empty-state">
            <i className="ti ti-database" />
            <p>কোনো ডেটা নেই। ডেটা এন্ট্রি করুন।</p>
          </div>
        ) : (
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  {columns.map((c) => <th key={c.id}>{c.name}</th>)}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry, idx) => (
                  <tr key={entry.__id || idx}>
                    <td style={{ color: "var(--gray-400)", fontWeight: 600 }}>{entry.__serial}</td>
                    {columns.map((c) => (
                      <td key={c.id}>
                        {c.type === "image" && entry[c.name] ? (
                          <img src={entry[c.name]} alt="" style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 4, border: "1px solid var(--gray-200)" }} />
                        ) : (
                          <span style={{ fontSize: 13 }}>{entry[c.name] ?? "—"}</span>
                        )}
                      </td>
                    ))}
                    <td>
                      <div style={{display:"flex",gap:4}}>
                        <button className="btn btn-ghost btn-sm" style={{ color: "var(--blue)" }}
                          onClick={() => openEdit(entries.indexOf(entry))}>
                          <i className="ti ti-edit" />
                        </button>
                        <button className="btn btn-ghost btn-sm" style={{ color: "var(--red)" }}
                          onClick={() => deleteEntry(entries.indexOf(entry))}>
                          <i className="ti ti-trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn btn-outline" onClick={onBack}>
          <i className="ti ti-arrow-left" /> পেছনে
        </button>
      </div>

      {confirmClear && (
        <div className="modal-backdrop" onClick={() => setConfirmClear(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">সব ডেটা মুছবেন?</div>
            <p style={{ fontSize: 14, color: "var(--gray-500)" }}>
              এই Excel এর সব ডেটা ও কলাম স্থায়ীভাবে মুছে যাবে। এই কাজ ফিরিয়ে আনা যাবে না।
            </p>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setConfirmClear(false)}>বাতিল</button>
              <button className="btn btn-danger" onClick={async () => { await clearAll(); setConfirmClear(false); }}>
                হ্যাঁ, মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Download Modal */}
      {dlModal && (
        <div className="modal-backdrop" onClick={() => setDlModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title"><i className="ti ti-download" /> ডাউনলোড সেটিংস</div>
            <p style={{fontSize:14,color:"var(--gray-500)",marginBottom:16}}>পেজের অভিমুখ বেছে নিন:</p>
            <div style={{display:"flex",gap:12,marginBottom:20}}>
              {["portrait","landscape"].map(o => (
                <label key={o} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",padding:"10px 16px",border:`2px solid ${orientation===o?"var(--blue)":"var(--gray-200)"}`,borderRadius:8,flex:1,justifyContent:"center"}}>
                  <input type="radio" name="orientation" value={o} checked={orientation===o} onChange={() => setOrientation(o)} style={{display:"none"}} />
                  <i className={`ti ${o==="portrait"?"ti-rectangle-vertical":"ti-rectangle-landscape"}`} style={{fontSize:20,color:orientation===o?"var(--blue)":"var(--gray-400)"}} />
                  <span style={{fontWeight:600,color:orientation===o?"var(--blue)":"var(--gray-600)"}}>{o==="portrait"?"পোর্ট্রেট":"ল্যান্ডস্কেপ"}</span>
                </label>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setDlModal(false)}>বাতিল</button>
              <button className="btn btn-danger" onClick={() => { downloadPDF(); setDlModal(false); }}>
                <i className="ti ti-file-type-pdf" /> PDF ডাউনলোড
              </button>
              <button className="btn btn-primary" onClick={() => { downloadWord(); setDlModal(false); }}>
                <i className="ti ti-file-word" /> Word ডাউনলোড
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="modal-backdrop" onClick={() => setEditModal(null)}>
          <div className="modal" style={{maxWidth:500,width:"90%"}} onClick={e => e.stopPropagation()}>
            <div className="modal-title"><i className="ti ti-edit" /> ডেটা সম্পাদনা</div>
            <div style={{maxHeight:400,overflowY:"auto",marginBottom:16}}>
              {columns.map(col => (
                <div key={col.id} className="form-group" style={{marginBottom:12}}>
                  <label className="form-label">{col.name}</label>
                  {col.type === "boolean" ? (
                    <select className="form-input" value={editValues[col.name]||""} onChange={e => setEditValues(v => ({...v,[col.name]:e.target.value}))}>
                      <option value="">বেছে নিন</option>
                      <option value="হ্যাঁ">হ্যাঁ</option>
                      <option value="না">না</option>
                    </select>
                  ) : col.type === "textarea" ? (
                    <textarea className="form-input" rows={3} value={editValues[col.name]||""} onChange={e => setEditValues(v => ({...v,[col.name]:e.target.value}))} />
                  ) : col.type === "image" ? (
                    <div>
                      <input type="file" accept="image/*" className="form-input" style={{padding:6}} onChange={async e => {
                        if(e.target.files[0]) { const b64 = await toBase64Edit(e.target.files[0]); setEditValues(v => ({...v,[col.name]:b64})); }
                      }} />
                      {editValues[col.name] && <img src={editValues[col.name]} alt="" style={{marginTop:6,width:60,height:60,objectFit:"cover",borderRadius:6}} />}
                    </div>
                  ) : col.type === "phone" ? (
                    <div>
                      <input
                        type="tel"
                        className="form-input"
                        placeholder="০১XXXXXXXXX (১১ সংখ্যা)"
                        maxLength={11}
                        value={editValues[col.name]||""}
                        onChange={e => {
                          const v = e.target.value.replace(/[^0-9]/g,"").slice(0,11);
                          setEditValues(prev => ({...prev,[col.name]:v}));
                        }}
                      />
                      <span style={{fontSize:11,color:(editValues[col.name]||"").length===11?"var(--green)":"var(--gray-400)",marginTop:3,display:"block"}}>
                        {(editValues[col.name]||"").length}/১১ সংখ্যা
                      </span>
                    </div>
                  ) : (
                    <input
                      type={col.type==="number"?"number":col.type==="date"?"date":col.type==="email"?"email":"text"}
                      className="form-input"
                      value={editValues[col.name]||""}
                      onChange={e => setEditValues(v => ({...v,[col.name]:e.target.value}))}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setEditModal(null)}>বাতিল</button>
              <button className="btn btn-primary" onClick={saveEdit} disabled={editSaving}>
                {editSaving ? "সংরক্ষণ হচ্ছে..." : <><i className="ti ti-check" /> সংরক্ষণ</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Excel Tab ────────────────────────────────────────────────────────────────
function ExcelTab({ user, excelId, tabName }) {
  const store = useExcelStore(user, excelId);
  const [step, setStep] = useState(1);

  if (store.loading) {
    return (
      <div className="full-center" style={{ minHeight: 300 }}>
        <span className="spinner" />
        <span style={{ fontSize: 14, color: "var(--gray-400)" }}>লোড হচ্ছে...</span>
      </div>
    );
  }

  return (
    <div className="app-content">
      <div className="stepper">
        {[
          { n: 1, icon: "ti-layout-columns", label: "কলাম সেটআপ" },
          { n: 2, icon: "ti-forms", label: "ডেটা এন্ট্রি" },
          { n: 3, icon: "ti-table", label: "ডেটা ও ডাউনলোড" },
        ].map((s, i, arr) => (
          <span key={s.n} style={{ display: "flex", alignItems: "center", flex: i < arr.length - 1 ? "1" : "0" }}>
            <button
              className={`step-btn ${step === s.n ? "active" : step > s.n ? "done" : ""}`}
              onClick={() => {
                if (s.n < step) setStep(s.n);
                else if (s.n === 2 && store.columns.length > 0) setStep(2);
                else if (s.n === 3 && store.entries.length > 0) setStep(3);
              }}
            >
              <span className="step-icon">
                {step > s.n
                  ? <i className="ti ti-check" />
                  : <i className={`ti ${s.icon}`} />}
              </span>
              {s.label}
            </button>
            {i < arr.length - 1 && (
              <span className={`step-line ${step > s.n ? "done" : ""}`} style={{ flex: 1 }} />
            )}
          </span>
        ))}
      </div>

      {step === 1 && <StepOne store={store} onNext={() => setStep(2)} />}
      {step === 2 && <StepTwo store={store} onBack={() => setStep(1)} onViewData={() => setStep(3)} />}
      {step === 3 && <StepThree store={store} tabName={tabName} onBack={() => setStep(2)} onAddEntry={() => setStep(2)} />}
    </div>
  );
}

// ─── Main App (for approved users) ───────────────────────────────────────────
function MainApp({ user, onLogout }) {
  const [tabs, setTabs] = useState(() => {
    const saved = localStorage.getItem(`excel_tabs_${user.id}`);
    if (saved) {
      try { return JSON.parse(saved); } catch { }
    }
    return [{ id: "default", name: "Excel ১" }];
  });
  const [activeTab, setActiveTab] = useState(null); // null = show dashboard
  const [renamingId, setRenamingId] = useState(null);
  const [renameVal, setRenameVal] = useState("");
  const [newTabModal, setNewTabModal] = useState(false);
  const [newTabName, setNewTabName] = useState("");

  useEffect(() => {
    localStorage.setItem(`excel_tabs_${user.id}`, JSON.stringify(tabs));
  }, [tabs, user.id]);

  const addTab = (name) => {
    const newId = `excel_${Date.now()}`;
    const newName = name || `Excel ${tabs.length + 1}`;
    setTabs((t) => [...t, { id: newId, name: newName }]);
    setActiveTab(newId);
    setNewTabModal(false);
    setNewTabName("");
  };

  const removeTab = (id) => {
    if (tabs.length === 1) return;
    setTabs((t) => t.filter((tab) => tab.id !== id));
    if (activeTab === id) setActiveTab(tabs.find((t) => t.id !== id)?.id || tabs[0].id);
  };

  const startRename = (tab) => {
    setRenamingId(tab.id);
    setRenameVal(tab.name);
  };

  const commitRename = () => {
    if (renameVal.trim()) {
      setTabs((t) => t.map((tab) => tab.id === renamingId ? { ...tab, name: renameVal.trim() } : tab));
    }
    setRenamingId(null);
  };

  const currentTab = tabs.find((t) => t.id === activeTab);

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand">
          <i className="ti ti-file-spreadsheet" />
          <span>Excel ডেটা এন্ট্রি</span>
        </div>
        <div className="navbar-actions">
          <span style={{ fontSize: 13, color: "var(--gray-500)", display: "flex", alignItems: "center", gap: 4 }}>
            <i className="ti ti-user-circle" style={{ fontSize: 16 }} />
            {user.email}
          </span>
          <button className="btn btn-outline btn-sm" onClick={onLogout}>
            <i className="ti ti-logout" /> লগআউট
          </button>
        </div>
      </nav>

      <div className="app-header-bar">
        <div className="excel-tabs-bar">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`excel-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
              onDoubleClick={() => startRename(tab)}
              title="ডাবল ক্লিক করে নাম পরিবর্তন করুন"
            >
              <i className="ti ti-file-spreadsheet" style={{ fontSize: 14, flexShrink: 0 }} />
              {renamingId === tab.id ? (
                <input
                  className="tab-rename-input"
                  value={renameVal}
                  autoFocus
                  onChange={(e) => setRenameVal(e.target.value)}
                  onBlur={commitRename}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitRename();
                    if (e.key === "Escape") setRenamingId(null);
                    e.stopPropagation();
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span className="tab-name">{tab.name}</span>
              )}
              {tabs.length > 1 && (
                <button
                  className="tab-close"
                  onClick={(e) => { e.stopPropagation(); removeTab(tab.id); }}
                  title="বন্ধ করুন"
                >
                  <i className="ti ti-x" />
                </button>
              )}
            </div>
          ))}
          <button className="new-tab-btn" onClick={() => setNewTabModal(true)} title="নতুন Excel তৈরি করুন">
            <i className="ti ti-plus" />
          </button>
        </div>
      </div>

      <div className="app-layout">
        {activeTab ? (
            <ExcelTab
              key={activeTab}
              user={user}
              excelId={activeTab}
              tabName={currentTab?.name || "data"}
            />
          ) : (
            /* Dashboard — Excel list */
            <div style={{padding:24}}>
              <div style={{marginBottom:24}}>
                <h2 style={{fontSize:20,fontWeight:700,color:"var(--gray-900)",marginBottom:4}}>আপনার Excel তালিকা</h2>
                <p style={{fontSize:13,color:"var(--gray-500)"}}>একটি Excel-এ ক্লিক করে ডেটা এন্ট্রি শুরু করুন।</p>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:16}}>
                {tabs.map(tab => (
                  <div key={tab.id} onClick={() => setActiveTab(tab.id)}
                    style={{background:"white",borderRadius:12,border:"1px solid var(--gray-200)",padding:20,cursor:"pointer",transition:"all .15s",boxShadow:"var(--shadow)"}}
                    onMouseEnter={e => e.currentTarget.style.boxShadow="var(--shadow-md)"}
                    onMouseLeave={e => e.currentTarget.style.boxShadow="var(--shadow)"}
                  >
                    <i className="ti ti-file-spreadsheet" style={{fontSize:32,color:"var(--blue)",display:"block",marginBottom:10}} />
                    <div style={{fontWeight:600,fontSize:15,color:"var(--gray-800)",marginBottom:4}}>{tab.name}</div>
                    <div style={{fontSize:12,color:"var(--gray-400)"}}>ক্লিক করে খুলুন</div>
                  </div>
                ))}
                <div onClick={() => setNewTabModal(true)}
                  style={{background:"var(--blue-light)",borderRadius:12,border:"2px dashed var(--blue-mid)",padding:20,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:110,transition:"all .15s"}}
                  onMouseEnter={e => e.currentTarget.style.background="var(--blue-mid)"}
                  onMouseLeave={e => e.currentTarget.style.background="var(--blue-light)"}
                >
                  <i className="ti ti-plus" style={{fontSize:28,color:"var(--blue)",marginBottom:6}} />
                  <span style={{fontWeight:600,color:"var(--blue)",fontSize:14}}>নতুন Excel তৈরি</span>
                </div>
              </div>
            </div>
          )}
      </div>

      {/* New Tab Modal */}
      {newTabModal && (
        <div className="modal-backdrop" onClick={() => setNewTabModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title"><i className="ti ti-file-plus" /> নতুন Excel তৈরি করুন</div>
            <div className="form-group" style={{marginBottom:16}}>
              <label className="form-label">Excel-এর নাম</label>
              <input
                className="form-input"
                placeholder="যেমন: ছাত্র তালিকা, কর্মচারী রেজিস্টার..."
                value={newTabName}
                onChange={e => setNewTabName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && newTabName.trim() && addTab(newTabName.trim())}
                autoFocus
              />
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setNewTabModal(false)}>বাতিল</button>
              <button className="btn btn-primary" onClick={() => addTab(newTabName.trim() || `Excel ${tabs.length + 1}`)}>
                <i className="ti ti-plus" /> তৈরি করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [page, setPage] = useState("home"); // home | login | register

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) { setProfile(null); return; }
    setProfileLoading(true);
    supabase.from("user_profiles").select("*").eq("user_id", user.id).single()
      .then(({ data }) => {
        if (data) setProfile(data);
        else {
          // Auto-create profile if missing (e.g. admin)
          const isAdmin = user.email === ADMIN_EMAIL;
          const prof = { user_id: user.id, email: user.email, full_name: user.user_metadata?.full_name || "", status: isAdmin ? "approved" : "pending", created_at: new Date().toISOString() };
          supabase.from("user_profiles").upsert(prof, { onConflict: "user_id" });
          setProfile(prof);
        }
        setProfileLoading(false);
      });
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setPage("home");
  };

  // Loading
  if (authLoading || (user && profileLoading)) {
    return (
      <>
        <style>{css}</style>
        <nav className="navbar">
          <div className="navbar-brand"><i className="ti ti-file-spreadsheet" /><span>Excel ডেটা এন্ট্রি</span></div>
        </nav>
        <div className="full-center"><span className="spinner" /><span style={{ fontSize: 14, color: "var(--gray-400)" }}>লোড হচ্ছে...</span></div>
      </>
    );
  }

  const isAdmin = user && user.email === ADMIN_EMAIL;

  // Admin
  if (user && isAdmin) {
    return (
      <>
        <style>{css}</style>
        <AdminPanel user={user} onLogout={handleLogout} />
      </>
    );
  }

  // Logged in but pending/rejected
  if (user && profile && profile.status !== "approved") {
    return (
      <>
        <style>{css}</style>
        <nav className="navbar">
          <div className="navbar-brand"><i className="ti ti-file-spreadsheet" /><span>Excel ডেটা এন্ট্রি</span></div>
          <div className="navbar-actions">
            <button className="btn btn-outline btn-sm" onClick={handleLogout}><i className="ti ti-logout" /> লগআউট</button>
          </div>
        </nav>
        <div className="pending-notice">
          <div className="pending-card">
            {profile.status === "rejected" ? (
              <>
                <i className="ti ti-x-circle" style={{ color: "var(--red)" }} />
                <h2>অ্যাকাউন্ট বাতিল</h2>
                <p>আপনার অ্যাকাউন্ট Admin কর্তৃক বাতিল করা হয়েছে। বিস্তারিত জানতে Admin এর সাথে যোগাযোগ করুন।</p>
              </>
            ) : profile.status === "blocked" ? (
              <>
                <i className="ti ti-ban" style={{ color: "#7c3aed" }} />
                <h2>অ্যাকাউন্ট ব্লক</h2>
                <p>আপনার অ্যাকাউন্ট Admin কর্তৃক ব্লক করা হয়েছে। বিস্তারিত জানতে Admin এর সাথে যোগাযোগ করুন।</p>
              </>
            ) : (
              <>
                <i className="ti ti-clock" />
                <h2>অনুমোদনের অপেক্ষায়</h2>
                <p>আপনার অ্যাকাউন্ট তৈরি হয়েছে। Admin অনুমোদন দিলে আপনি ব্যবহার করতে পারবেন। কিছুক্ষণ অপেক্ষা করুন।</p>
              </>
            )}
            <button className="btn btn-outline" onClick={handleLogout}><i className="ti ti-logout" /> লগআউট</button>
          </div>
        </div>
      </>
    );
  }

  // Approved user — main app
  if (user && profile && profile.status === "approved") {
    return (
      <>
        <style>{css}</style>
        <MainApp user={user} onLogout={handleLogout} />
      </>
    );
  }

  // Not logged in — home or auth pages
  return (
    <>
      <style>{css}</style>
      <nav className="navbar">
        <div className="navbar-brand" onClick={() => setPage("home")}>
          <i className="ti ti-file-spreadsheet" />
          <span>Excel ডেটা এন্ট্রি</span>
        </div>
        <div className="navbar-actions">
          {page !== "login" && (
            <button className="btn btn-outline btn-sm" onClick={() => setPage("login")}>
              <i className="ti ti-login" /> লগইন
            </button>
          )}
          {page !== "register" && (
            <button className="btn btn-primary btn-sm" onClick={() => setPage("register")}>
              <i className="ti ti-user-plus" /> রেজিস্ট্রেশন
            </button>
          )}
        </div>
      </nav>

      {page === "home" && (
        <HomePage
          onLogin={() => setPage("login")}
          onRegister={() => setPage("register")}
        />
      )}
      {page === "login" && <AuthPage initialMode="login" onBack={() => setPage("home")} />}
      {page === "register" && <AuthPage initialMode="register" onBack={() => setPage("home")} />}
    </>
  );
}
