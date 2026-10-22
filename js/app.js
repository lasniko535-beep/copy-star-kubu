/**
 * COPY STAR KUBU - Digital Photocopy, Photo Printing & ATK
 * Main Application Logic & POS State Machine
 */

// Global Application State
let storeData = loadStoreData();
let activeView = "pos"; // 'pos' or 'owner'
let activeOwnerTab = "analytics";
let activeCategory = "all";
let audioEnabled = true;
let isDarkTheme = true;

// Current Logged-in User Session State
let currentUser = null;
let currentMockOtp = "5792";

// POS Multi-Session Tabs State
let sessions = [
  {
    id: "sess_1",
    tabTitle: "Pelanggan #101",
    customer: { id: null, name: "Pelanggan Umum", discountPct: 0, points: 0 },
    items: [
      // Preload 1 sample item for instant delight
      {
        productId: "PRD-001",
        name: "Fotokopi B/W (Hitam Putih)",
        qty: 15,
        price: 400, // tiered price
        basePrice: 500,
        costPrice: 85,
        isService: true,
        notes: "15 Lembar (Tarif Rp 400/lbr)"
      }
    ],
    paymentMethod: "TUNAI",
    amountPaid: 6000,
    note: ""
  }
];
let activeSessionId = "sess_1";

// Audio Synthesizer (Web Audio API)
let audioCtx = null;
function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
}

function playBeep(type = "scan") {
  if (!audioEnabled) return;
  try {
    initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;
    if (type === "scan") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(1400, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === "success") {
      // 2-tone melodic chime
      osc.type = "triangle";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.09); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.18); // G5
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === "warning") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.setValueAtTime(260, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch (e) {
    console.warn("Audio feedback error:", e);
  }
}

// Format Rupiah Helper
function formatRupiah(num) {
  return "Rp " + Math.round(num || 0).toLocaleString("id-ID");
}

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  renderCategoryPills();
  renderCatalogProducts();
  renderSessionTabs();
  renderActiveCart();
  renderOwnerAnalytics();
  renderInventoryTable();
  renderEmployeeTable();
  renderActivityLogs();
  updateHeaderFeatureBadges();
  renderKasbonTable();
  renderWaQueue();
  setupKeyboardShortcuts();
  checkAuthSession();
});

/* ==========================================================================
   AUTHENTICATION & USER LOGIN LOGIC
   ========================================================================== */
function checkAuthSession() {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = (urlParams.get("mode") || urlParams.get("role") || urlParams.get("view") || "").toLowerCase();

  // 1. Link Khusus Pelanggan / Konsumen (Order Cetak & ATK Mandiri tanpa password)
  if (mode === "customer" || mode === "order" || mode === "pelanggan") {
    enterCustomerOrderPortal(true);
    return;
  }

  // 2. Link Khusus Kasir (Layar Transaksi POS Toko)
  if (mode === "kasir" || mode === "pos") {
    if (!localStorage.getItem("COPY_STAR_CURRENT_USER") && !sessionStorage.getItem("COPY_STAR_CURRENT_USER")) {
      quickLoginAs("niko");
      actuallySwitchMainView("pos");
      return;
    }
  }

  // 3. Link Khusus Owner / Pemilik Toko (Laporan Omzet & Keuangan)
  if (mode === "owner") {
    if (!localStorage.getItem("COPY_STAR_CURRENT_USER") && !sessionStorage.getItem("COPY_STAR_CURRENT_USER")) {
      quickLoginAs("OWNER");
      actuallySwitchMainView("owner");
      return;
    }
  }

  const savedUser = localStorage.getItem("COPY_STAR_CURRENT_USER") || sessionStorage.getItem("COPY_STAR_CURRENT_USER");
  if (savedUser) {
    try {
      currentUser = JSON.parse(savedUser);
      if (currentUser && (currentUser.role === "DOSEN" || currentUser.username === "dosen")) {
        currentUser = null;
        localStorage.removeItem("COPY_STAR_CURRENT_USER");
        sessionStorage.removeItem("COPY_STAR_CURRENT_USER");
      } else {
        if (currentUser && currentUser.name && currentUser.name.includes("Siti")) {
          currentUser.name = "Niko";
          currentUser.username = "niko";
          localStorage.setItem("COPY_STAR_CURRENT_USER", JSON.stringify(currentUser));
        }
        applyUserSessionUI();
        hideLoginOverlay();
        if (mode === "owner" || currentUser.role === "OWNER") {
          actuallySwitchMainView("owner");
        } else if (mode === "customer" || currentUser.role === "CUSTOMER") {
          actuallySwitchMainView("customer");
        } else {
          actuallySwitchMainView("pos");
        }
        return;
      }
    } catch (e) {
      console.warn("Sesi pengguna tidak valid", e);
    }
  }
  showLoginOverlay();
}

function showLoginOverlay() {
  const overlay = document.getElementById("loginOverlay");
  if (overlay) overlay.classList.remove("hidden");
  const alertEl = document.getElementById("loginErrorAlert");
  if (alertEl) alertEl.style.display = "none";
}

function hideLoginOverlay() {
  const overlay = document.getElementById("loginOverlay");
  if (overlay) overlay.classList.add("hidden");
}

function applyUserSessionUI() {
  if (!currentUser) return;
  if (currentUser.name && currentUser.name.includes("Siti")) {
    currentUser.name = "Niko";
    currentUser.username = "niko";
  }
  const nameEl = document.getElementById("headerUserName");
  const roleEl = document.getElementById("headerUserRole");
  if (nameEl) nameEl.textContent = currentUser.name;
  if (roleEl) {
    roleEl.textContent = currentUser.role;
    let roleClass = "kasir";
    if (currentUser.role.toLowerCase() === "owner") roleClass = "owner";
    else if (currentUser.role.toLowerCase() === "customer") roleClass = "pelanggan";
    roleEl.className = "user-role-pill " + roleClass;
  }

  // Update shift text
  const shiftTextEl = document.getElementById("shiftStatusText");
  if (shiftTextEl) {
    shiftTextEl.textContent = `Kasir: ${currentUser.name} (${currentUser.shift || 'Shift Aktif'})`;
  }

  // Update receipt cashier and shift cashier
  if (currentUser.role === "KASIR") {
    if (storeData.activeShift) {
      storeData.activeShift.cashierName = currentUser.name;
      const matchedEmp = storeData.employees?.find(e => e.name.toLowerCase() === currentUser.name.toLowerCase());
      if (matchedEmp) storeData.activeShift.cashierId = matchedEmp.id;
    }
    const rcptCashier = document.getElementById("rcptMetaCashier");
    if (rcptCashier) rcptCashier.textContent = `Kasir: ${currentUser.name}`;
  }
}

function submitLoginForm() {
  const usernameInput = (document.getElementById("loginUsername")?.value || "").trim().toLowerCase();
  const passwordInput = document.getElementById("loginPassword")?.value || "";
  const rememberMe = document.getElementById("rememberMeCheckbox")?.checked;
  const errorAlert = document.getElementById("loginErrorAlert");
  const errorText = document.getElementById("loginErrorText");

  // Cari di data pengguna
  const user = storeData.users.find(u =>
    (u.username.toLowerCase() === usernameInput ||
      (usernameInput === 'kasir' && u.role === 'KASIR') ||
      u.name.toLowerCase().includes(usernameInput) ||
      u.phone.replace(/[^0-9]/g, '') === usernameInput.replace(/[^0-9]/g, '') ||
      u.email.toLowerCase() === usernameInput) &&
    (u.password === passwordInput || 
     (u.role === 'OWNER' && (passwordInput === '0000' || passwordInput === 'password123')) ||
     (u.role === 'KASIR' && (passwordInput === 'password123' || passwordInput === '123456')))
  );

  if (user) {
    currentUser = user;
    if (rememberMe) {
      localStorage.setItem("COPY_STAR_CURRENT_USER", JSON.stringify(currentUser));
    } else {
      sessionStorage.setItem("COPY_STAR_CURRENT_USER", JSON.stringify(currentUser));
    }

    if (currentUser.role === "KASIR") {
      storeData.activeShift.cashierName = currentUser.name;
      const matchedEmp = storeData.employees?.find(e => e.name.toLowerCase() === currentUser.name.toLowerCase());
      if (matchedEmp) storeData.activeShift.cashierId = matchedEmp.id;
    }

    // Catat log aktivitas login
    storeData.activityLogs.unshift({
      time: new Date().toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" }),
      user: currentUser.name,
      action: `Login Berhasil ke Sistem sebagai [${currentUser.role} - ${currentUser.name}]`
    });
    saveStoreData(storeData);

    if (errorAlert) errorAlert.style.display = "none";
    hideLoginOverlay();
    applyUserSessionUI();

    if (currentUser.role === "OWNER") {
      switchMainView("owner");
    } else if (currentUser.role === "CUSTOMER") {
      switchMainView("customer");
    } else {
      switchMainView("pos");
    }

    playBeep("success");
    showToast(`Selamat datang, ${currentUser.name}! 👋`);
  } else {
    playBeep("warning");
    if (errorAlert) {
      errorAlert.style.display = "flex";
      errorText.textContent = "Username atau Password yang dimasukkan salah!";
    }
  }
}

function quickLoginAs(identifier) {
  let targetUser = storeData.users.find(u => 
    u.username.toLowerCase() === identifier.toLowerCase() ||
    u.name.toLowerCase().includes(identifier.toLowerCase())
  );
  if (!targetUser) {
    targetUser = storeData.users.find(u => u.role.toLowerCase() === identifier.toLowerCase());
  }
  if (targetUser) {
    const userInput = document.getElementById("loginUsername");
    const passInput = document.getElementById("loginPassword");
    if (userInput) userInput.value = targetUser.username;
    if (passInput) passInput.value = targetUser.password;
    submitLoginForm();
  }
}

function handleLogout() {
  if (currentUser && currentUser.role === "CUSTOMER") {
    currentUser = null;
    playBeep("scan");
    showToast("Membuka form login Kasir & Owner...");
    showLoginOverlay();
    return;
  }
  if (confirm(`Apakah Anda yakin ingin keluar dari akun ${currentUser ? currentUser.name : ''}?`)) {
    currentUser = null;
    localStorage.removeItem("COPY_STAR_CURRENT_USER");
    sessionStorage.removeItem("COPY_STAR_CURRENT_USER");
    playBeep("scan");
    showToast("Anda telah berhasil keluar dari sistem.");
    showLoginOverlay();
  }
}

function togglePasswordVisibility(inputId, btnEl) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === "password") {
    input.type = "text";
    btnEl.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
  } else {
    input.type = "password";
    btnEl.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
  }
}

function openForgotPasswordModal() {
  currentMockOtp = Math.floor(1000 + Math.random() * 9000).toString();
  const otpInput = document.getElementById("forgotOtpInput");
  const otpNote = document.getElementById("otpSentNote");
  if (otpInput) otpInput.value = currentMockOtp;
  if (otpNote) otpNote.innerHTML = `✓ Kode OTP simulasi dikirim: <strong>${currentMockOtp}</strong>`;
  openModal("forgotPasswordModal");
}

function generateMockOtp() {
  currentMockOtp = Math.floor(1000 + Math.random() * 9000).toString();
  const otpInput = document.getElementById("forgotOtpInput");
  const otpNote = document.getElementById("otpSentNote");
  if (otpInput) otpInput.value = currentMockOtp;
  if (otpNote) otpNote.innerHTML = `✓ Kode OTP baru dikirim ke WhatsApp: <strong>${currentMockOtp}</strong>`;
  playBeep("scan");
  showToast(`Kode OTP baru: ${currentMockOtp}`);
}

function submitPasswordReset() {
  const identifier = (document.getElementById("forgotAccountIdentifier")?.value || "").trim().toLowerCase();
  const otp = (document.getElementById("forgotOtpInput")?.value || "").trim();
  const newPass = document.getElementById("forgotNewPassword")?.value || "";
  const confirmPass = document.getElementById("forgotConfirmPassword")?.value || "";

  if (!identifier) {
    alert("Masukkan Username, Nomor WhatsApp, atau Email akun Anda!");
    return;
  }

  const user = storeData.users.find(u =>
    u.username.toLowerCase() === identifier ||
    u.phone.replace(/[^0-9]/g, '') === identifier.replace(/[^0-9]/g, '') ||
    u.email.toLowerCase() === identifier
  );

  if (!user) {
    alert("Akun tidak ditemukan dalam sistem COPY STAR KUBU!");
    return;
  }

  if (otp !== currentMockOtp && otp !== "5792") {
    alert("Kode verifikasi OTP salah! Silakan gunakan kode yang tertera.");
    return;
  }

  if (!newPass || newPass.length < 4) {
    alert("Password baru minimal harus 4 karakter!");
    return;
  }

  if (newPass !== confirmPass) {
    alert("Konfirmasi password tidak cocok dengan password baru!");
    return;
  }

  // Update password pengguna di database
  user.password = newPass;

  storeData.activityLogs.unshift({
    time: new Date().toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" }),
    user: user.name,
    action: `Reset Password Berhasil (Verifikasi OTP WhatsApp)`
  });
  saveStoreData(storeData);

  playBeep("success");
  closeModal("forgotPasswordModal");
  showToast(`Password untuk ${user.name} berhasil diperbarui! Silakan masuk.`);

  // Otomatis isi ke formulir login
  const loginUserEl = document.getElementById("loginUsername");
  const loginPassEl = document.getElementById("loginPassword");
  if (loginUserEl) loginUserEl.value = user.username;
  if (loginPassEl) loginPassEl.value = newPass;
}

// Switch Main View (POS vs Print vs Price vs PasFoto vs Banner vs Owner vs Customer)
function switchMainView(view) {
  if (view === "customer") {
    actuallySwitchMainView("customer");
    return;
  }
  if (currentUser && currentUser.role === "CUSTOMER") {
    showLoginOverlay();
    showToast("Silakan login dengan akun Kasir atau Owner untuk mengakses halaman ini 🔒");
    return;
  }
  if (view === "owner") {
    // Jika sudah login sebagai OWNER, langsung buka tanpa PIN
    if (currentUser && currentUser.role === "OWNER") {
      actuallySwitchMainView("owner");
      return;
    }
    // Memerlukan otorisasi PIN / Password Owner (PIN: 0000) untuk non-Owner
    requestSupervisorPin("Masukkan PIN / Password Owner untuk membuka Dashboard (PIN: 0000)", () => {
      actuallySwitchMainView("owner");
    });
    return;
  }
  actuallySwitchMainView(view);
}

function actuallySwitchMainView(view) {
  const validViews = ["pos", "print", "price", "pasfoto", "banner", "owner", "customer"];
  activeView = validViews.includes(view) ? view : "pos";

  // Toggle active class on all 7 header tabs
  const tabIds = {
    pos: "btnViewPos",
    print: "btnViewPrint",
    price: "btnViewPrice",
    pasfoto: "btnViewPasFoto",
    banner: "btnViewBanner",
    owner: "btnViewOwner",
    customer: "btnViewCustomer"
  };
  Object.keys(tabIds).forEach(key => {
    const btn = document.getElementById(tabIds[key]);
    if (btn) btn.classList.toggle("active", activeView === key);
  });

  // Toggle active class on all 7 view sections
  const sectionIds = {
    pos: "posView",
    print: "printCalcView",
    price: "priceManageView",
    pasfoto: "pasFotoView",
    banner: "bannerUndanganView",
    owner: "ownerView",
    customer: "customerView"
  };
  Object.keys(sectionIds).forEach(key => {
    const sec = document.getElementById(sectionIds[key]);
    if (sec) sec.classList.toggle("active", activeView === key);
  });

  const isCustRole = currentUser && currentUser.role === "CUSTOMER";
  const shiftBadge = document.getElementById("shiftBadge");
  const btnKasbon = document.getElementById("btnHeaderKasbon");
  const btnReset = document.querySelector("button[onclick='resetDemoDataPrompt()']");

  if (activeView === "customer") {
    if (isCustRole) {
      if (shiftBadge) shiftBadge.style.display = "none";
      if (btnKasbon) btnKasbon.style.display = "none";
      if (btnReset) btnReset.style.display = "none";
      const nameEl = document.getElementById("headerUserName");
      const roleEl = document.getElementById("headerUserRole");
      if (nameEl) nameEl.textContent = "Pelanggan Online";
      if (roleEl) {
        roleEl.textContent = "PELANGGAN";
        roleEl.className = "user-role-pill pelanggan";
      }
    }
    initCustomerPortal();
  } else {
    if (shiftBadge) shiftBadge.style.display = "flex";
    if (btnKasbon) btnKasbon.style.display = "inline-flex";
    if (btnReset) btnReset.style.display = "inline-flex";
    if (currentUser && currentUser.role !== "CUSTOMER") {
      applyUserSessionUI();
    }
  }

  // Lifecycle initializers for dedicated dashboards
  if (activeView === "owner") {
    renderOwnerAnalytics();
    renderInventoryTable();
    renderEmployeeTable();
    renderActivityLogs();
  } else if (activeView === "print") {
    syncDashboardPrintCalc();
  } else if (activeView === "price") {
    initPriceManageDashboard();
  } else if (activeView === "pasfoto") {
    initPasFotoStudio();
  } else if (activeView === "banner") {
    initBannerUndanganDashboard();
  }

  const toastMessages = {
    pos: "Beralih ke Layar Kasir (POS) 🛒",
    print: "Membuka Dasbor Kalkulator Print & Fotokopi 🖨️ (F3)",
    price: "Membuka Dasbor Kelola & Ubah Harga Katalog 🏷️ (F7)",
    pasfoto: "Membuka Studio Pas Foto Kilat PRO 📸",
    banner: "Membuka Dasbor Kalkulator Spanduk & Undangan 📐",
    owner: "Dashboard Owner Berhasil Dibuka (PIN Terverifikasi) 👑",
    customer: "Portal Order Pelanggan Dibuka 🛍️"
  };
  showToast(toastMessages[activeView] || "Layar diperbarui");
}

// Toggle Theme
function toggleTheme() {
  isDarkTheme = !isDarkTheme;
  document.body.classList.toggle("light-theme", !isDarkTheme);
  showToast(isDarkTheme ? "Mode Gelap Aktif" : "Mode Terang Aktif");
}

// Toggle Audio
function toggleAudio() {
  audioEnabled = !audioEnabled;
  const icon = document.getElementById("audioIcon");
  if (audioEnabled) {
    icon.innerHTML = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>`;
    document.getElementById("btnAudioToggle").title = "Suara Efek Kasir (Aktif)";
    playBeep("scan");
    showToast("Efek Suara Diaktifkan 🔊");
  } else {
    icon.innerHTML = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>`;
    document.getElementById("btnAudioToggle").title = "Suara Efek Kasir (Mati)";
    showToast("Efek Suara Dimatikan 🔇");
  }
}

// Reset Demo Data
function resetDemoDataPrompt() {
  if (confirm("Reset seluruh data transaksi dan katalog kembali ke pengaturan awal simulasi COPY STAR KUBU?")) {
    storeData = resetToDefaultData();
    sessions = [
      {
        id: "sess_1",
        tabTitle: "Pelanggan #101",
        customer: { id: null, name: "Pelanggan Umum", discountPct: 0, points: 0 },
        items: [],
        paymentMethod: "TUNAI",
        amountPaid: 0,
        note: ""
      }
    ];
    activeSessionId = "sess_1";
    renderCatalogProducts();
    renderSessionTabs();
    renderActiveCart();
    renderOwnerAnalytics();
    renderInventoryTable();
    renderEmployeeTable();
    renderActivityLogs();
    playBeep("success");
    showToast("Data simulasi berhasil direset ke awal!");
  }
}

/* ==========================================================================
   CATEGORY & CATALOG LOGIC
   ========================================================================== */
function renderCategoryPills() {
  const container = document.getElementById("categoryPillsContainer");
  if (!container) return;
  container.innerHTML = storeData.categories.map(cat => `
    <button class="pill-btn ${cat.id === activeCategory ? 'active' : ''}" onclick="selectCategory('${cat.id}')">
      ${cat.name}
    </button>
  `).join("");
}

function selectCategory(catId) {
  activeCategory = catId;
  renderCategoryPills();
  renderCatalogProducts();
}

function getProductIconSvg(iconName) {
  switch (iconName) {
    case "copy":
    case "printer":
    case "printer-color":
      return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>`;
    case "box":
    case "layers":
      return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12.89 1.45l8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4a2 2 0 0 1-1.1-1.8V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0z"></path></svg>`;
    case "book":
    case "book-open":
      return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`;
    case "pen-tool":
    case "edit-2":
      return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>`;
    case "folder":
    case "folder-plus":
      return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`;
    case "hard-drive":
      return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="12" x2="2" y2="12"></line><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path><line x1="6" y1="16" x2="6.01" y2="16"></line><line x1="10" y1="16" x2="10.01" y2="16"></line></svg>`;
    case "droplet":
      return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>`;
    default:
      return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
  }
}

function renderCatalogProducts() {
  const container = document.getElementById("productGridContainer");
  const query = (document.getElementById("posSearchInput")?.value || "").toLowerCase().trim();
  if (!container) return;

  const filtered = storeData.products.filter(item => {
    const matchCat = activeCategory === "all" || item.category === activeCategory;
    const matchQuery = !query ||
      item.name.toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query) ||
      (item.description && item.description.toLowerCase().includes(query));
    return matchCat && matchQuery;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">
        <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">Tidak ada barang yang cocok dengan "${query}"</p>
        <button class="btn-secondary-sm" onclick="document.getElementById('posSearchInput').value=''; renderCatalogProducts();" style="margin: 0 auto;">Reset Pencarian</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => {
    const isLow = !item.isService && item.stock <= item.minStock;
    const isDead = item.isDeadStock;
    let badgeClass = "badge-stock";
    let badgeLabel = item.isService ? "Layanan" : `Stok: ${item.stock} ${item.unit}`;

    if (item.isService) {
      badgeClass = "badge-service";
    } else if (isLow) {
      badgeClass = "badge-stock low";
      badgeLabel = `Kritis (${item.stock} ${item.unit})`;
    } else if (isDead) {
      badgeClass = "badge-deadstock";
      badgeLabel = "Dead Stock (>60 Hari)";
    }

    const hasPhoto = Boolean(item.photo);

    return `
      <div class="product-card ${hasPhoto ? 'has-photo' : ''}" onclick="addProductToActiveCart('${item.id}')">
        <div class="card-img-area">
          <div class="card-top-badges">
            <span class="badge-tag ${badgeClass}">${badgeLabel}</span>
            ${item.wholesalePrice ? `<span class="badge-tag" style="background:var(--success-light); color:var(--success);">Grosir Tersedia</span>` : ''}
          </div>
          ${!item.isService ? `
            <div class="card-stock-meter" title="Indikator Ketersediaan Stok: ${item.stock} ${item.unit}">
              <div class="card-stock-meter-fill ${isLow ? 'low' : ''}" style="width: ${Math.min(100, Math.max(8, Math.round((item.stock / (item.minStock * 2.5 || 20)) * 100)))}%;"></div>
            </div>
          ` : ''}
          ${hasPhoto ? `
            <img src="${item.photo}" alt="${item.name}" class="card-product-photo" loading="lazy" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';">
            <div class="card-icon-preview" style="display:none;">${getProductIconSvg(item.image)}</div>
          ` : `
            <div class="card-icon-preview">${getProductIconSvg(item.image)}</div>
          `}
        </div>

        <h4 title="${item.name}">${item.name}</h4>

        <div class="card-price-area">
          <div>
            <div class="price-main">${formatRupiah(item.price)} <span class="unit-label">/${item.unit}</span></div>
            ${item.wholesalePrice ? `<div class="wholesale-hint">≥${item.wholesaleMinQty} ${item.unit}: ${formatRupiah(item.wholesalePrice)}</div>` : ''}
          </div>
          <div class="card-action-btns">
            <button class="btn-card-edit-price" title="Ubah harga barang ini" onclick="event.stopPropagation(); openPriceEditModal('${item.id}')">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </button>
            <button class="btn-card-add" title="Tambah ke keranjang" onclick="event.stopPropagation(); addProductToActiveCart('${item.id}')">
              +
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// Search input listener
document.getElementById("posSearchInput")?.addEventListener("input", () => {
  renderCatalogProducts();
});

/* ==========================================================================
   MULTI-SESSION TABS & POS CART ENGINE
   ========================================================================== */
function getActiveSession() {
  return sessions.find(s => s.id === activeSessionId) || sessions[0];
}

function renderSessionTabs() {
  const container = document.getElementById("cartTabsContainer");
  if (!container) return;

  const tabsHtml = sessions.map((s, idx) => {
    const count = s.items.reduce((sum, it) => sum + it.qty, 0);
    const isActive = s.id === activeSessionId;
    return `
      <div class="session-tab ${isActive ? 'active' : ''}" onclick="switchSession('${s.id}')">
        <span>${s.tabTitle || `Sesi ${idx + 1}`}</span>
        ${count > 0 ? `<span class="tab-badge-count">${count}</span>` : ''}
        ${sessions.length > 1 ? `<button class="tab-close-btn" onclick="event.stopPropagation(); closeSession('${s.id}')" title="Tutup Sesi">&times;</button>` : ''}
      </div>
    `;
  }).join("");

  container.innerHTML = tabsHtml + `
    <button class="btn-add-tab" onclick="createNewSession()" title="Tambah Sesi Transaksi Baru (F4)">
      <span>+ Sesi Baru</span>
      <span class="shortcut-tag" style="margin-left:4px;">F4</span>
    </button>
  `;
}

function createNewSession() {
  const newNum = sessions.length + 101;
  const newSession = {
    id: "sess_" + Date.now(),
    tabTitle: `Pelanggan #${newNum}`,
    customer: { id: null, name: "Pelanggan Umum", discountPct: 0, points: 0 },
    items: [],
    paymentMethod: "TUNAI",
    amountPaid: 0,
    note: ""
  };
  sessions.push(newSession);
  activeSessionId = newSession.id;
  renderSessionTabs();
  renderActiveCart();
  playBeep("scan");
  showToast(`Sesi baru dibuat: ${newSession.tabTitle}`);
}

function switchSession(sessId) {
  if (activeSessionId === sessId) return;
  activeSessionId = sessId;
  renderSessionTabs();
  renderActiveCart();
}

function closeSession(sessId) {
  const sess = sessions.find(s => s.id === sessId);
  if (!sess) return;
  if (sess.items.length > 0) {
    if (!confirm(`Sesi "${sess.tabTitle}" memiliki ${sess.items.length} barang di keranjang. Yakin ingin menutup sesi ini?`)) {
      return;
    }
  }

  sessions = sessions.filter(s => s.id !== sessId);
  if (sessions.length === 0) {
    createNewSession();
  } else {
    activeSessionId = sessions[0].id;
  }
  renderSessionTabs();
  renderActiveCart();
}

/* ==========================================================================
   CART OPERATIONS
   ========================================================================== */
function addProductToActiveCart(productId, customQty = 1) {
  const product = storeData.products.find(p => p.id === productId);
  if (!product) return;

  const currentSession = getActiveSession();
  const existingIndex = currentSession.items.findIndex(it => it.productId === productId && !it.isCustomPrint);

  if (existingIndex >= 0) {
    currentSession.items[existingIndex].qty += customQty;
    // Check wholesale
    if (product.wholesalePrice && currentSession.items[existingIndex].qty >= (product.wholesaleMinQty || 5)) {
      currentSession.items[existingIndex].price = product.wholesalePrice;
    }
  } else {
    let initialPrice = product.price;
    if (product.wholesalePrice && customQty >= (product.wholesaleMinQty || 5)) {
      initialPrice = product.wholesalePrice;
    }

    currentSession.items.push({
      productId: product.id,
      name: product.name,
      qty: customQty,
      price: initialPrice,
      basePrice: product.price,
      costPrice: product.costPrice,
      unit: product.unit,
      isService: product.isService,
      notes: ""
    });
  }

  playBeep("scan");
  renderSessionTabs();
  renderActiveCart();
}

function updateItemQty(index, delta) {
  const currentSession = getActiveSession();
  const item = currentSession.items[index];
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    currentSession.items.splice(index, 1);
  } else {
    // If has tiered pricing or wholesale, recalculate
    const origProduct = storeData.products.find(p => p.id === item.productId);
    if (origProduct) {
      if (origProduct.wholesalePrice) {
        if (item.qty >= (origProduct.wholesaleMinQty || 5)) {
          item.price = origProduct.wholesalePrice;
        } else {
          item.price = origProduct.price;
        }
      }
      if (origProduct.tieredKey && storeData.printTiers[origProduct.tieredKey]) {
        const tiers = storeData.printTiers[origProduct.tieredKey];
        const matchTier = tiers.find(t => item.qty >= t.min && item.qty <= t.max);
        if (matchTier) item.price = matchTier.price;
      }
    }
  }

  playBeep("scan");
  renderSessionTabs();
  renderActiveCart();
}

function removeItemFromCart(index) {
  const currentSession = getActiveSession();
  currentSession.items.splice(index, 1);
  renderSessionTabs();
  renderActiveCart();
}

function renderActiveCart() {
  const currentSession = getActiveSession();
  const container = document.getElementById("cartItemsContainer");
  const customerNameEl = document.getElementById("currentCustomerName");
  const discountBadgeEl = document.getElementById("currentMemberDiscountBadge");

  if (!container) return;

  // Update customer header
  if (customerNameEl) customerNameEl.textContent = currentSession.customer.name;
  if (discountBadgeEl) {
    const disc = currentSession.customer.discountPct || 0;
    discountBadgeEl.textContent = `Diskon Member: ${disc}%`;
    discountBadgeEl.style.display = disc > 0 ? "inline-block" : "none";
  }

  // Render items
  if (currentSession.items.length === 0) {
    container.innerHTML = `
      <div class="cart-empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        <p style="font-weight:600; font-size:0.95rem;">Keranjang Belanja Masih Kosong</p>
        <p style="font-size:0.75rem; color:var(--text-dim);">Klik produk di katalog kiri atau tekan F2 untuk mencari</p>
      </div>
    `;
  } else {
    container.innerHTML = currentSession.items.map((item, idx) => {
      const lineTotal = item.qty * item.price;
      return `
        <div class="cart-item-row">
          <div class="cart-item-header">
            <div class="item-name-col">
              <h5>${item.name}</h5>
              <span class="item-unit-price">${formatRupiah(item.price)} / ${item.unit || 'unit'} ${item.notes ? `(${item.notes})` : ''}</span>
            </div>
            <button class="btn-remove-item" onclick="removeItemFromCart(${idx})" title="Hapus barang">&times;</button>
          </div>

          <div class="cart-item-controls">
            <div class="qty-counter">
              <button class="btn-qty" onclick="updateItemQty(${idx}, -1)">-</button>
              <span class="qty-display">${item.qty}</span>
              <button class="btn-qty" onclick="updateItemQty(${idx}, 1)">+</button>
            </div>
            <span class="item-row-total">${formatRupiah(lineTotal)}</span>
          </div>
        </div>
      `;
    }).join("");
  }

  // Update Cross-Selling Suggestions
  updateCrossSelling();

  // Update Calculations Footer
  updateCartTotals();
}

function updateCartTotals() {
  const currentSession = getActiveSession();
  const subtotal = currentSession.items.reduce((sum, it) => sum + (it.qty * it.price), 0);
  const discountPct = currentSession.customer.discountPct || 0;
  const discountAmount = Math.round(subtotal * (discountPct / 100));
  const finalTotal = Math.max(0, subtotal - discountAmount);

  document.getElementById("cartSubtotalText").textContent = formatRupiah(subtotal);
  document.getElementById("cartDiscountText").textContent = "- " + formatRupiah(discountAmount);
  document.getElementById("rowDiscount").style.display = discountAmount > 0 ? "flex" : "none";
  document.getElementById("cartTotalText").textContent = formatRupiah(finalTotal);

  // If amount paid was lower or exact, adjust
  if (currentSession.paymentMethod === "TUNAI" && currentSession.amountPaid < finalTotal) {
    currentSession.amountPaid = finalTotal;
  }
}

// AI Cross-Selling / Sering Dibeli Bersama
function updateCrossSelling() {
  const currentSession = getActiveSession();
  const box = document.getElementById("crossSellBox");
  const container = document.getElementById("crossSellItemsContainer");
  if (!box || !container) return;

  if (currentSession.items.length === 0) {
    box.style.display = "none";
    return;
  }

  // Find recommendations based on current cart
  const cartProductIds = new Set(currentSession.items.map(i => i.productId));
  const recProductIds = new Set();

  storeData.crossSellRules.forEach(rule => {
    const hasTrigger = currentSession.items.some(it => {
      const p = storeData.products.find(prod => prod.id === it.productId);
      return p && rule.triggerCategories.includes(p.category);
    });
    if (hasTrigger) {
      rule.recommendedProductIds.forEach(id => {
        if (!cartProductIds.has(id)) recProductIds.add(id);
      });
    }
  });

  const recProducts = Array.from(recProductIds).slice(0, 3).map(id => storeData.products.find(p => p.id === id)).filter(Boolean);

  if (recProducts.length > 0) {
    box.style.display = "block";
    container.innerHTML = recProducts.map(p => `
      <div class="cross-item-card" onclick="addProductToActiveCart('${p.id}')">
        ${p.photo ? `
          <img src="${p.photo}" alt="${p.name}" style="width: 22px; height: 22px; object-fit: cover; border-radius: 4px; flex-shrink: 0;" onerror="this.style.display='none';">
        ` : '<span>+</span>'}
        <strong>${p.name.length > 20 ? p.name.slice(0, 18) + '...' : p.name}</strong>
        <span style="color:var(--primary); font-weight:700;">${formatRupiah(p.price)}</span>
      </div>
    `).join("");
  } else {
    box.style.display = "none";
  }
}

// Quick Cash Selection
function setQuickCash(val) {
  const currentSession = getActiveSession();
  const subtotal = currentSession.items.reduce((sum, it) => sum + (it.qty * it.price), 0);
  const discountAmount = Math.round(subtotal * ((currentSession.customer.discountPct || 0) / 100));
  const total = subtotal - discountAmount;

  if (val === 'exact') {
    currentSession.amountPaid = total;
  } else {
    currentSession.amountPaid = val;
  }
  currentSession.paymentMethod = "TUNAI";
  highlightPaymentMethod("TUNAI");
  playBeep("scan");
  showToast(`Uang diterima: ${formatRupiah(currentSession.amountPaid)}`);
}

function selectPaymentMethod(method) {
  const currentSession = getActiveSession();
  currentSession.paymentMethod = method;
  highlightPaymentMethod(method);
  playBeep("scan");
  showToast(`Metode pembayaran: ${method}`);
}

function highlightPaymentMethod(method) {
  document.getElementById("pmCash")?.classList.toggle("active", method === "TUNAI");
  document.getElementById("pmQris")?.classList.toggle("active", method === "QRIS");
  document.getElementById("pmTransfer")?.classList.toggle("active", method === "TRANSFER");
  document.getElementById("pmSplit")?.classList.toggle("active", method === "SPLIT");
  document.getElementById("pmKasbon")?.classList.toggle("active", method === "KASBON");
}

/* ==========================================================================
   CHECKOUT & THERMAL RECEIPT MODAL
   ========================================================================== */
function processCheckout() {
  const currentSession = getActiveSession();
  if (currentSession.items.length === 0) {
    playBeep("warning");
    showToast("Keranjang belanja masih kosong! Tambahkan barang terlebih dahulu.");
    return;
  }

  const subtotal = currentSession.items.reduce((sum, it) => sum + (it.qty * it.price), 0);
  const discountAmount = Math.round(subtotal * ((currentSession.customer.discountPct || 0) / 100));
  const finalTotal = subtotal - discountAmount;
  const costTotal = currentSession.items.reduce((sum, it) => sum + (it.qty * (it.costPrice || 0)), 0);
  const netProfit = finalTotal - costTotal;

  let paid = currentSession.amountPaid || finalTotal;
  if (paid < finalTotal && currentSession.paymentMethod === "TUNAI") {
    paid = finalTotal;
    currentSession.amountPaid = finalTotal;
  }
  const change = Math.max(0, paid - finalTotal);

  // Generate Receipt Data
  const trxId = "TRX-" + Math.floor(1000 + Math.random() * 9000);
  const nowStr = new Date().toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" });

  document.getElementById("rcptMetaTime").textContent = `${nowStr} | ${trxId}`;
  document.getElementById("rcptMetaCashier").textContent = `Kasir: ${storeData.activeShift.cashierName}`;
  document.getElementById("rcptMetaCustomer").textContent = `Pelanggan: ${currentSession.customer.name}`;

  // Render receipt items
  const itemsTable = document.getElementById("rcptItemsTable");
  itemsTable.innerHTML = currentSession.items.map(it => `
    <tr>
      <td colspan="2" style="font-weight:bold;">${it.name}</td>
    </tr>
    <tr>
      <td style="color:#555;">${it.qty} x ${formatRupiah(it.price)}</td>
      <td style="text-align:right; font-weight:600;">${formatRupiah(it.qty * it.price)}</td>
    </tr>
  `).join("");

  document.getElementById("rcptSubtotal").textContent = formatRupiah(subtotal);
  if (discountAmount > 0) {
    document.getElementById("rcptDiscountRow").style.display = "table-row";
    document.getElementById("rcptDiscount").textContent = "- " + formatRupiah(discountAmount);
  } else {
    document.getElementById("rcptDiscountRow").style.display = "none";
  }
  document.getElementById("rcptTotal").textContent = formatRupiah(finalTotal);
  document.getElementById("rcptMethod").textContent = currentSession.paymentMethod;
  document.getElementById("rcptPaid").textContent = formatRupiah(paid);
  document.getElementById("rcptChange").textContent = formatRupiah(change);

  // Deduct inventory & add to transaction log
  currentSession.items.forEach(it => {
    const p = storeData.products.find(prod => prod.id === it.productId);
    if (p && !p.isService) {
      p.stock = Math.max(0, p.stock - it.qty);
      storeData.stockLogs.unshift({
        date: nowStr,
        productId: p.id,
        productName: p.name,
        type: "KELUAR",
        qty: it.qty,
        finalStock: p.stock,
        note: `Penjualan ${trxId}`,
        pic: storeData.activeShift.cashierName
      });
    }
  });

  // Record transaction in storeData
  storeData.recentTransactions.unshift({
    id: trxId,
    date: nowStr,
    customer: currentSession.customer.name,
    cashier: storeData.activeShift.cashierName,
    items: JSON.parse(JSON.stringify(currentSession.items)),
    subtotal: subtotal,
    discount: discountAmount,
    total: finalTotal,
    costTotal: costTotal,
    profit: netProfit,
    paymentMethod: currentSession.paymentMethod,
    amountPaid: paid,
    change: change
  });

  // Update shift stats
  if (currentSession.paymentMethod === "TUNAI") {
    storeData.activeShift.totalCashSales += finalTotal;
  } else {
    storeData.activeShift.totalQrisSales += finalTotal;
  }
  storeData.activeShift.totalTransactions += 1;

  // Save to persistence
  saveStoreData(storeData);

  // Play sound, confetti & open modal
  playBeep("success");
  triggerConfetti();
  openModal("receiptModal");

  // Empty cart for this session
  currentSession.items = [];
  currentSession.amountPaid = 0;
  renderSessionTabs();
  renderActiveCart();
  renderCatalogProducts();
}

function printReceipt() {
  window.print();
}

function shareReceiptWhatsApp() {
  const currentSession = getActiveSession();
  const lastTrx = (storeData.recentTransactions && storeData.recentTransactions[0]) || null;
  const trxId = lastTrx ? lastTrx.id : "TRX-" + Math.floor(1000 + Math.random() * 9000);
  const totalStr = lastTrx ? formatRupiah(lastTrx.total) : document.getElementById("rcptTotal").textContent;
  const customerName = lastTrx ? (lastTrx.customer || "Pelanggan") : "Pelanggan";

  let itemsText = "";
  if (lastTrx && Array.isArray(lastTrx.items)) {
    itemsText = lastTrx.items.map(it => `• ${it.name} (${it.qty}x) = ${formatRupiah(it.qty * it.price)}`).join("\n");
  }

  const message = `*STRUK DIGITAL COPY STAR KUBU*\n` +
    `_Digital Photocopy, Photo Printing & ATK_\n` +
    `Jln. Soeparto 1 Kubu, Desa Kubu, Kec. Kubu, Kabupaten Kubu Raya\n` +
    `📲 Telp/WA: *+62 812-5345-3440 (Star Copy)*\n` +
    `📸 Instagram: *@copystarkubu* (https://www.instagram.com/copystarkubu?obrf=YnByeXZsYnozb3dt)\n\n` +
    `Halo Kak/Bpk/Ibu *${customerName}*,\n` +
    `Terima kasih telah berbelanja di toko kami! Berikut adalah bukti transaksi Anda:\n\n` +
    `📄 *No. Struk:* ${trxId}\n` +
    (itemsText ? `📦 *Rincian Belanja:*\n${itemsText}\n` : '') +
    `💰 *TOTAL:* *${totalStr}*\n` +
    `💳 *Metode:* ${lastTrx ? lastTrx.paymentMethod : "Lunas"}\n\n` +
    `_Kritik, saran, atau order cetak via WA: +62 812-5345-3440 / IG: @copystarkubu_\n` +
    `Semoga harimu menyenangkan! 🙏✨`;

  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
}

/* ==========================================================================
   TIERED PRICING PRINT & COPY CALCULATOR
   ========================================================================== */
function openPrintCalcModal() {
  switchMainView("print");
}

function updateCalcPreview() {
  const serviceKey = document.getElementById("calcServiceType").value;
  const paper = document.getElementById("calcPaperType").value;
  const duplex = document.getElementById("calcDuplex").value;
  const qty = Math.max(1, parseInt(document.getElementById("calcQty").value) || 1);
  const finishing = document.getElementById("calcFinishing").value;

  const tiers = storeData.printTiers[serviceKey] || [];
  let baseRate = 500;
  let activeTier = tiers[0];

  tiers.forEach(t => {
    if (qty >= t.min && qty <= t.max) {
      activeTier = t;
      baseRate = t.price;
    }
  });

  // Additional Paper cost
  let extraPaperCost = 0;
  if (paper === "hvs80") extraPaperCost = 100;
  else if (paper === "buffalo") extraPaperCost = 1000;
  else if (paper === "glossy") extraPaperCost = 2000;

  // Duplex multiplier
  let duplexMultiplier = duplex === "duplex" ? 1.8 : 1.0;

  // Finishing cost
  let finishingCost = 0;
  if (finishing === "lakban") finishingCost = 4000;
  else if (finishing === "spiral") finishingCost = 8000;
  else if (finishing === "hardcover") finishingCost = 25000;
  else if (finishing === "laminating") finishingCost = 3000;

  const effectiveRatePerSheet = Math.round((baseRate + extraPaperCost) * (duplex === "duplex" ? 1.8 : 1.0));
  const printTotal = effectiveRatePerSheet * qty;
  const grandTotal = printTotal + finishingCost;

  // Base tier 1 comparison to show savings!
  const standardTierRate = tiers[0] ? tiers[0].price : baseRate;
  const standardTotal = ((standardTierRate + extraPaperCost) * (duplex === "duplex" ? 1.8 : 1.0)) * qty + finishingCost;
  const savings = Math.max(0, standardTotal - grandTotal);

  // Render UI updates
  document.getElementById("calcRatePerSheetText").textContent = `Tarif Aktif: ${formatRupiah(effectiveRatePerSheet)} / lembar`;
  document.getElementById("calcTotalEstimate").textContent = formatRupiah(grandTotal);

  const saveTextEl = document.getElementById("calcDiscountSaveText");
  if (savings > 0) {
    saveTextEl.style.display = "block";
    saveTextEl.textContent = `Hemat ${formatRupiah(savings)} karena pesanan jumlah banyak!`;
  } else {
    saveTextEl.style.display = "none";
  }

  // Render Tier Badges
  const badgesRow = document.getElementById("tierBadgesRow");
  badgesRow.innerHTML = tiers.map(t => {
    const isCur = t === activeTier;
    return `<span class="tier-badge-pill ${isCur ? 'current-active' : ''}">${t.label}</span>`;
  }).join("");
}

function addCalculatedPrintToCart() {
  const serviceSelect = document.getElementById("calcServiceType");
  const serviceName = serviceSelect.options[serviceSelect.selectedIndex].text;
  const paperSelect = document.getElementById("calcPaperType");
  const paperName = paperSelect.options[paperSelect.selectedIndex].text.split('(')[0].trim();
  const duplex = document.getElementById("calcDuplex").value === "duplex" ? "Bolak-Balik" : "1 Sisi";
  const qty = Math.max(1, parseInt(document.getElementById("calcQty").value) || 1);
  const finishingSelect = document.getElementById("calcFinishing");
  const finishingVal = finishingSelect.value;
  const finishingName = finishingSelect.options[finishingSelect.selectedIndex].text.split('(')[0].trim();

  const totalEstimateStr = document.getElementById("calcTotalEstimate").textContent;
  const totalAmount = parseInt(totalEstimateStr.replace(/[^0-9]/g, '')) || 500;
  const pricePerUnit = Math.round(totalAmount / qty);

  const currentSession = getActiveSession();
  currentSession.items.push({
    productId: "PRINT-CUSTOM-" + Date.now(),
    name: `${serviceName} (${qty} lbr)`,
    qty: qty,
    price: pricePerUnit,
    basePrice: pricePerUnit,
    costPrice: Math.round(pricePerUnit * 0.35),
    unit: "Lbr",
    isService: true,
    isCustomPrint: true,
    notes: `${paperName}, ${duplex}${finishingVal !== 'none' ? ', ' + finishingName : ''}`
  });

  playBeep("success");
  closeModal("printCalcModal");
  renderSessionTabs();
  renderActiveCart();
  showToast("Pesanan cetak berhasil ditambahkan ke keranjang!");
}

/* ==========================================================================
   MEMBER / CUSTOMER SELECTION
   ========================================================================== */
function openCustomerModal() {
  renderMemberList();
  openModal("customerModal");
}

function renderMemberList(filter = "") {
  const container = document.getElementById("membersListContainer");
  if (!container) return;

  const filtered = storeData.members.filter(m => {
    return !filter || m.name.toLowerCase().includes(filter.toLowerCase()) || m.phone.includes(filter);
  });

  container.innerHTML = filtered.map(m => `
    <div style="background:var(--bg-surface-elevated); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:0.65rem 0.85rem; display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="selectMember('${m.id}')">
      <div style="display:flex; align-items:center; gap:0.65rem;">
        <span style="font-size:1.5rem;">${m.avatar}</span>
        <div>
          <div style="font-weight:700; font-size:0.88rem; color:var(--text-main);">${m.name}</div>
          <div style="font-size:0.72rem; color:var(--text-muted);">${m.category} • ${m.phone}</div>
        </div>
      </div>
      <div style="text-align:right;">
        <span class="customer-badge">Diskon ${m.discountPct}%</span>
        <div style="font-size:0.7rem; color:var(--primary); margin-top:2px;">Poin: ${m.points}</div>
      </div>
    </div>
  `).join("");
}

function filterMemberList() {
  const query = document.getElementById("searchMemberInput").value;
  renderMemberList(query);
}

function selectMember(memberId) {
  const currentSession = getActiveSession();
  if (!memberId) {
    currentSession.customer = { id: null, name: "Pelanggan Umum", discountPct: 0, points: 0 };
    showToast("Menggunakan profil Pelanggan Umum");
  } else {
    const member = storeData.members.find(m => m.id === memberId);
    if (member) {
      currentSession.customer = {
        id: member.id,
        name: member.name,
        discountPct: member.discountPct,
        points: member.points
      };
      playBeep("scan");
      showToast(`Member dipilih: ${member.name} (Diskon ${member.discountPct}%)`);
    }
  }
  closeModal("customerModal");
  renderActiveCart();
}

/* ==========================================================================
   SHIFT MANAGEMENT
   ========================================================================== */
function openShiftModal() {
  const shift = storeData.activeShift;
  const cashierSelect = document.getElementById("shiftCashierName");
  if (cashierSelect) {
    cashierSelect.value = shift.cashierName || "Niko";
  }
  const matched = storeData.employees?.find(e => e.name.toLowerCase() === (shift.cashierName || "niko").toLowerCase());
  const shiftInput = document.getElementById("shiftCashierShift");
  if (shiftInput && matched) {
    shiftInput.value = matched.shift;
  }
  document.getElementById("shiftTotalCashText").textContent = formatRupiah(shift.totalCashSales);
  document.getElementById("shiftTotalQrisText").textContent = formatRupiah(shift.totalQrisSales);
  const expected = shift.initialCash + shift.totalCashSales;
  document.getElementById("shiftExpectedCashText").textContent = formatRupiah(expected);
  document.getElementById("shiftActualCashInput").value = "";
  document.getElementById("shiftVarianceBox").style.display = "none";
  openModal("shiftModal");
}

function changeShiftCashier(newName) {
  if (!newName) return;
  storeData.activeShift.cashierName = newName;
  const matched = storeData.employees?.find(e => e.name.toLowerCase() === newName.toLowerCase());
  if (matched) {
    storeData.activeShift.cashierId = matched.id;
    const shiftInput = document.getElementById("shiftCashierShift");
    if (shiftInput) shiftInput.value = matched.shift;
  }
  const shiftTextEl = document.getElementById("shiftStatusText");
  if (shiftTextEl) {
    shiftTextEl.textContent = `Kasir: ${newName} (${matched ? matched.shift : 'Shift Aktif'})`;
  }
  const headerName = document.getElementById("headerUserName");
  if (currentUser && currentUser.role === "KASIR" && headerName) {
    currentUser.name = newName;
    const userObj = storeData.users.find(u => u.name.toLowerCase() === newName.toLowerCase());
    if (userObj) currentUser.username = userObj.username;
    headerName.textContent = newName;
    localStorage.setItem("COPY_STAR_CURRENT_USER", JSON.stringify(currentUser));
  }
  const metaCashier = document.getElementById("rcptMetaCashier");
  if (metaCashier) metaCashier.textContent = `Kasir: ${newName}`;
  saveStoreData(storeData);
  showToast(`Kasir aktif berganti ke: ${newName} 👤`);
}

function checkShiftVariance() {
  const shift = storeData.activeShift;
  const expected = shift.initialCash + shift.totalCashSales;
  const actual = parseFloat(document.getElementById("shiftActualCashInput").value) || 0;
  const variance = actual - expected;
  const box = document.getElementById("shiftVarianceBox");
  box.style.display = "block";

  if (variance === 0) {
    box.style.background = "var(--success-light)";
    box.style.border = "1px solid var(--success)";
    box.style.color = "var(--success)";
    box.innerHTML = `<strong>Uang Pas & Klop!</strong> Tidak ada selisih kas fisik.`;
  } else if (variance > 0) {
    box.style.background = "var(--info-light)";
    box.style.border = "1px solid var(--info)";
    box.style.color = "var(--info)";
    box.innerHTML = `<strong>Kelebihan Kas Fisik: +${formatRupiah(variance)}</strong>`;
  } else {
    box.style.background = "var(--danger-light)";
    box.style.border = "1px solid var(--danger)";
    box.style.color = "var(--danger)";
    box.innerHTML = `<strong>Kekurangan Kas Fisik: ${formatRupiah(variance)}</strong> (Harap cek struk void/pembayaran tertunda!)`;
  }
}

function saveShiftClose() {
  const actual = parseFloat(document.getElementById("shiftActualCashInput").value);
  if (isNaN(actual)) {
    alert("Masukkan jumlah uang fisik aktual di laci kasir terlebih dahulu!");
    return;
  }

  storeData.activityLogs.unshift({
    time: new Date().toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" }),
    user: storeData.activeShift.cashierName,
    action: `Tutup Shift Kasir. Penjualan Tunai: ${formatRupiah(storeData.activeShift.totalCashSales)}, Saldo Akhir: ${formatRupiah(actual)}`
  });
  saveStoreData(storeData);

  playBeep("success");
  closeModal("shiftModal");
  showToast("Laporan shift kasir berhasil disimpan dan dicetak!");
}

/* ==========================================================================
   OWNER DASHBOARD & ANALYTICS
   ========================================================================== */
function switchOwnerTab(tab) {
  activeOwnerTab = tab;
  document.querySelectorAll(".sidebar-link").forEach(btn => btn.classList.remove("active"));
  if (window.event && window.event.currentTarget && window.event.currentTarget.classList) {
    window.event.currentTarget.classList.add("active");
  }

  document.getElementById("subviewAnalytics")?.classList.toggle("active", tab === "analytics");
  document.getElementById("subviewInventory")?.classList.toggle("active", tab === "inventory");
  document.getElementById("subviewEmployees")?.classList.toggle("active", tab === "employees");
  document.getElementById("subviewLogs")?.classList.toggle("active", tab === "logs");
  document.getElementById("subviewKasbon")?.classList.toggle("active", tab === "kasbon");
  document.getElementById("subviewWa")?.classList.toggle("active", tab === "wa");
  document.getElementById("subviewBackup")?.classList.toggle("active", tab === "backup");

  if (tab === "inventory") renderInventoryTable();
  if (tab === "employees") renderEmployeeTable();
  if (tab === "logs") renderActivityLogs();
  if (tab === "analytics") renderOwnerAnalytics();
  if (tab === "kasbon") renderKasbonTable('owner');
  if (tab === "wa") renderWaQueue('owner');
  if (tab === "backup") renderBackupSecurityOverview();
}

/* ==========================================================================
   MODUL CADANGAN & KEAMANAN DATABASE (BACKUP & RESTORE)
   ========================================================================== */
function renderBackupSecurityOverview() {
  const trxCount = (storeData.recentTransactions || []).length;
  const debtCount = (storeData.debts || []).length;
  const prodCount = (storeData.products || []).length;

  const trxEl = document.getElementById("backupTrxCount");
  if (trxEl) trxEl.textContent = `${trxCount} Transaksi`;

  const debtEl = document.getElementById("backupDebtCount");
  if (debtEl) debtEl.textContent = `${debtCount} Data Kasbon`;

  const prodEl = document.getElementById("backupProductCount");
  if (prodEl) prodEl.textContent = `${prodCount} Produk / Jasa`;
}

function downloadDatabaseBackup() {
  try {
    const rawData = localStorage.getItem("COPY_STAR_KUBU_DATA") || JSON.stringify(storeData);
    const parsed = JSON.parse(rawData);
    
    // Tambahkan metadata cadangan
    parsed._backupMeta = {
      store: "COPY STAR KUBU",
      backupTime: new Date().toISOString(),
      appVersion: "2.0-SmartRetail",
      totalTransactions: (parsed.recentTransactions || []).length,
      totalDebts: (parsed.debts || []).length
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(parsed, null, 2));
    const now = new Date();
    const pad = n => String(n).padStart(2, "0");
    const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`;
    const filename = `BACKUP_COPY_STAR_KUBU_${dateStr}.json`;

    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", filename);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();

    // Catat log aktivitas
    if (!Array.isArray(storeData.activityLogs)) storeData.activityLogs = [];
    storeData.activityLogs.unshift({
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      date: new Date().toLocaleDateString("id-ID"),
      user: currentUser?.name || "Owner",
      action: "Backup Database",
      desc: `Berhasil mengunduh file cadangan database (${filename})`
    });
    saveStoreData(storeData);

    alert(`✅ SUKSES!\n\nFile cadangan database berhasil diunduh:\n"${filename}"\n\nSimpan file ini di flashdisk atau Google Drive untuk keamanan maksimal.`);
  } catch (err) {
    console.error("Gagal membuat backup:", err);
    alert("❌ Gagal membuat cadangan database: " + err.message);
  }
}

function handleRestoreFileSelected(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const content = e.target.result;
      const parsed = JSON.parse(content);

      if (!parsed || (!parsed.products && !parsed.storeInfo && !parsed.recentTransactions)) {
        alert("❌ File tidak valid! Pastikan file yang dipilih adalah berkas cadangan resmi COPY STAR KUBU (.json).");
        return;
      }

      const totalTrx = (parsed.recentTransactions || []).length;
      const totalDebts = (parsed.debts || []).length;
      const storeName = parsed.storeInfo?.name || "COPY STAR KUBU";

      const confirmRestore = confirm(
        `⚠️ PERINGATAN PEMULIHAN DATABASE!\n\n` +
        `Anda akan memulihkan database:\n` +
        `• Toko: ${storeName}\n` +
        `• Total Transaksi: ${totalTrx}\n` +
        `• Total Data Kasbon: ${totalDebts}\n\n` +
        `Seluruh data di peramban saat ini akan DIGANTIKAN dengan data cadangan ini.\n\n` +
        `Lanjutkan pemulihan database?`
      );

      if (confirmRestore) {
        storeData = parsed;
        saveStoreData(storeData);
        alert("✅ PEMULIHAN SUKSES!\n\nSeluruh data transaksi, kasbon, dan katalog barang berhasil dipulihkan. Halaman akan dimuat ulang...");
        setTimeout(() => {
          location.reload();
        }, 800);
      }
    } catch (err) {
      alert("❌ Gagal membaca file JSON: " + err.message);
    } finally {
      event.target.value = "";
    }
  };
  reader.readAsText(file);
}

function saveNewSupervisorPin() {
  const pin1 = (document.getElementById("inputNewPin")?.value || "").trim();
  const pin2 = (document.getElementById("inputConfirmPin")?.value || "").trim();

  if (!pin1 || pin1.length < 4) {
    alert("PIN baru minimal harus 4 angka!");
    return;
  }
  if (!/^\d+$/.test(pin1)) {
    alert("PIN hanya boleh berisi angka (0-9)!");
    return;
  }
  if (pin1 !== pin2) {
    alert("Konfirmasi PIN tidak cocok dengan PIN baru!");
    return;
  }

  if (!storeData.storeInfo) storeData.storeInfo = {};
  storeData.storeInfo.supervisorPin = pin1;
  saveStoreData(storeData);

  document.getElementById("inputNewPin").value = "";
  document.getElementById("inputConfirmPin").value = "";

  // Log audit
  if (!Array.isArray(storeData.activityLogs)) storeData.activityLogs = [];
  storeData.activityLogs.unshift({
    time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    date: new Date().toLocaleDateString("id-ID"),
    user: currentUser?.name || "Owner",
    action: "Ganti PIN",
    desc: "Memperbarui PIN otorisasi Supervisor / Owner"
  });
  saveStoreData(storeData);

  alert(`✅ PIN Owner Berhasil Diperbarui!\n\nGunakan PIN baru (${pin1}) saat mengakses laporan dan manajemen toko.`);
}

function exportTransactionsCsv() {
  const trxs = storeData.recentTransactions || [];
  if (trxs.length === 0) {
    alert("Belum ada data transaksi untuk diekspor!");
    return;
  }

  let csvContent = "\uFEFFNo Nota,Tanggal,Waktu,Kasir,Metode Pembayaran,Subtotal,Diskon,Grand Total,Laba Bersih\n";
  trxs.forEach(t => {
    const row = [
      `"${t.id || '-'}"`,
      `"${t.date || '-'}"`,
      `"${t.time || '-'}"`,
      `"${t.cashier || '-'}"`,
      `"${t.paymentMethod || 'TUNAI'}"`,
      t.subtotal || 0,
      t.discount || 0,
      t.total || 0,
      t.profit || 0
    ];
    csvContent += row.join(",") + "\n";
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `LAPORAN_TRANSAKSI_COPY_STAR_KUBU_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function exportKasbonCsv() {
  const debts = storeData.debts || [];
  if (debts.length === 0) {
    alert("Belum ada data kasbon untuk diekspor!");
    return;
  }

  let csvContent = "\uFEFFID Kasbon,Nama Warga,Nomor Kontak,Total Kasbon,Sisa Kasbon,Jatuh Tempo,Status,Catatan\n";
  debts.forEach(d => {
    const row = [
      `"${d.id || '-'}"`,
      `"${d.name || '-'}"`,
      `"${d.phone || '-'}"`,
      d.totalAmount || 0,
      d.remainingAmount || 0,
      `"${d.dueDate || '-'}"`,
      `"${d.status || 'TEMPO'}"`,
      `"${(d.notes || '').replace(/"/g, '""')}"`
    ];
    csvContent += row.join(",") + "\n";
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `LAPORAN_KASBON_WARGA_COPY_STAR_KUBU_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function exportInventoryCsv() {
  const prods = storeData.products || [];
  if (prods.length === 0) {
    alert("Belum ada data produk untuk diekspor!");
    return;
  }

  let csvContent = "\uFEFFKode SKU,Nama Barang,Kategori,Harga Modal (HPP),Harga Jual,Stok Fisik,Batas Minimum,Status Stok\n";
  prods.forEach(p => {
    const status = p.isService ? "JASA" : (p.stock <= (p.minStock || 5) ? "MENIPIS" : "AMAN");
    const row = [
      `"${p.sku || p.id || '-'}"`,
      `"${(p.name || '').replace(/"/g, '""')}"`,
      `"${p.category || 'Umum'}"`,
      p.costPrice || 0,
      p.price || 0,
      p.isService ? "-" : (p.stock || 0),
      p.minStock || 5,
      `"${status}"`
    ];
    csvContent += row.join(",") + "\n";
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `KATALOG_STOK_ATK_COPY_STAR_KUBU_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function renderOwnerAnalytics() {
  // Update KPIs
  const totalOmzet = storeData.weeklySalesData[storeData.weeklySalesData.length - 1].sales;
  const totalProfit = storeData.weeklySalesData[storeData.weeklySalesData.length - 1].profit;
  const txCount = storeData.weeklySalesData[storeData.weeklySalesData.length - 1].txCount;

  document.getElementById("kpiOmzetText").textContent = formatRupiah(totalOmzet);
  document.getElementById("kpiProfitText").textContent = formatRupiah(totalProfit);
  document.getElementById("kpiTxCountText").textContent = `${txCount} Transaksi`;

  const lowStockCount = storeData.products.filter(p => !p.isService && p.stock <= p.minStock).length;
  document.getElementById("kpiLowStockCountText").textContent = `${lowStockCount} Barang Kritis`;

  // Render SVG Sales & Margin Chart
  renderSalesChart();

  // Render Heatmap Matrix
  renderHeatmap();

  // Render Seasonal Events
  renderSeasonalEvents();
}

function renderSalesChart() {
  const container = document.getElementById("salesChartContainer");
  if (!container) return;

  const data = storeData.weeklySalesData;
  const maxVal = Math.max(...data.map(d => d.sales)) * 1.15;
  const width = 500;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;

  const pointsSales = data.map((d, i) => {
    const x = paddingX + (i * ((width - (paddingX * 2)) / (data.length - 1)));
    const y = height - paddingY - (d.sales / maxVal) * (height - (paddingY * 2));
    return { x, y, val: d.sales, day: d.day, profit: d.profit };
  });

  const pointsProfit = data.map((d, i) => {
    const x = paddingX + (i * ((width - (paddingX * 2)) / (data.length - 1)));
    const y = height - paddingY - (d.profit / maxVal) * (height - (paddingY * 2));
    return { x, y, val: d.profit, day: d.day };
  });

  const pathSales = pointsSales.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
  const pathProfit = pointsProfit.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");

  container.innerHTML = `
    <svg class="chart-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
      <!-- Grid lines -->
      <line x1="${paddingX}" y1="${paddingY}" x2="${width - paddingX}" y2="${paddingY}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4"/>
      <line x1="${paddingX}" y1="${height / 2}" x2="${width - paddingX}" y2="${height / 2}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4"/>
      <line x1="${paddingX}" y1="${height - paddingY}" x2="${width - paddingX}" y2="${height - paddingY}" stroke="rgba(255,255,255,0.15)"/>

      <!-- Profit Line (Emerald) -->
      <path d="${pathProfit}" fill="none" stroke="#10B981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      ${pointsProfit.map(p => `
        <circle cx="${p.x}" cy="${p.y}" r="4" fill="#10B981" stroke="#111827" stroke-width="2"/>
      `).join("")}

      <!-- Sales Line (Gold Brand) -->
      <path d="${pathSales}" fill="none" stroke="#FFB800" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      ${pointsSales.map(p => `
        <circle cx="${p.x}" cy="${p.y}" r="5" fill="#FFB800" stroke="#111827" stroke-width="2">
          <title>${p.day}: Omzet ${formatRupiah(p.val)} | Laba ${formatRupiah(p.profit)}</title>
        </circle>
        <text x="${p.x}" y="${height - 10}" fill="#9CA3AF" font-size="9" text-anchor="middle" font-family="sans-serif">${p.day.split(' ')[0]}</text>
      `).join("")}
    </svg>
  `;
}

function renderHeatmap() {
  const table = document.getElementById("heatmapTable");
  if (!table) return;

  const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
  const matrix = storeData.heatmapMatrix;

  let html = `<thead><tr><th>Jam</th>${days.map(d => `<th>${d}</th>`).join("")}</tr></thead><tbody>`;

  matrix.forEach(row => {
    html += `<tr><td style="font-weight:600; text-align:left; color:var(--text-muted); font-size:0.7rem;">${row.hour}</td>`;
    const vals = [row.Mon, row.Tue, row.Wed, row.Thu, row.Fri, row.Sat, row.Sun];
    vals.forEach(v => {
      // Color grading from low (dark blue-slate) to high (vivid gold)
      let bg = "rgba(31, 41, 55, 0.4)";
      let color = "#9CA3AF";
      if (v > 80) {
        bg = "rgba(255, 184, 0, 0.85)";
        color = "#000";
      } else if (v > 65) {
        bg = "rgba(255, 184, 0, 0.5)";
        color = "#FFF";
      } else if (v > 45) {
        bg = "rgba(59, 130, 246, 0.35)";
        color = "#FFF";
      }
      html += `<td><div class="heatmap-cell" style="background:${bg}; color:${color}; padding:4px 2px;" title="${v}% Intensitas Layanan">${v}%</div></td>`;
    });
    html += `</tr>`;
  });
  html += `</tbody>`;
  table.innerHTML = html;
}

function renderSeasonalEvents() {
  const container = document.getElementById("seasonalEventsList");
  if (!container) return;

  container.innerHTML = storeData.seasonalEvents.map(ev => `
    <div class="seasonal-item" style="border-left-color: ${ev.color};">
      <div class="seasonal-item-info">
        <h5>${ev.title}</h5>
        <p>Periode: <strong>${ev.date}</strong></p>
      </div>
      <span class="seasonal-impact-badge" style="color:${ev.color}; background:rgba(255,255,255,0.06);">${ev.impact}</span>
    </div>
  `).join("");
}

/* ==========================================================================
   INVENTORY & STOCK MANAGEMENT
   ========================================================================== */
function renderInventoryTable() {
  const tbody = document.getElementById("inventoryTableBody");
  if (!tbody) return;

  tbody.innerHTML = storeData.products.map(p => {
    const margin = p.costPrice > 0 ? Math.round(((p.price - p.costPrice) / p.price) * 100) : 100;
    const isLow = !p.isService && p.stock <= p.minStock;
    const isDead = p.isDeadStock;

    let statusPill = `<span class="status-badge-pill active">Stok Aman</span>`;
    if (p.isService) {
      statusPill = `<span class="status-badge-pill" style="background:var(--info-light); color:var(--info);">Jasa / Layanan</span>`;
    } else if (isLow) {
      statusPill = `<span class="status-badge-pill warning">⚠️ Kritis (Batas Min: ${p.minStock})</span>`;
    } else if (isDead) {
      statusPill = `<span class="status-badge-pill" style="background:var(--purple-light); color:var(--purple);">Dead Stock (>60 Hari)</span>`;
    }

    return `
      <tr>
        <td style="font-family:monospace; font-weight:700;">${p.id}</td>
        <td>
          <div style="display:flex; align-items:center; gap:0.75rem;">
            ${p.photo ? `
              <img src="${p.photo}" alt="${p.name}" style="width:40px; height:30px; object-fit:cover; border-radius:4px; border:1px solid var(--border-color); flex-shrink:0;" onerror="this.style.display='none';">
            ` : ''}
            <div>
              <strong>${p.name}</strong>
              ${p.badge ? `<br><small style="color:var(--text-muted);">${p.badge}</small>` : ''}
            </div>
          </div>
        </td>
        <td><span style="font-size:0.75rem; color:var(--text-muted);">${p.category}</span></td>
        <td>${p.isService ? '-' : formatRupiah(p.costPrice)}</td>
        <td style="font-weight:700; color:var(--primary);">${formatRupiah(p.price)}</td>
        <td><span style="color:var(--success); font-weight:700;">${margin}%</span></td>
        <td style="font-weight:700;">${p.isService ? '∞' : `${p.stock} ${p.unit}`}</td>
        <td>${statusPill}</td>
        <td>
          <div style="display:flex; gap:0.4rem; align-items:center;">
            <button class="btn-secondary-sm" style="padding:0.25rem 0.55rem; font-size:0.75rem; border-color:var(--primary); color:var(--primary);" onclick="openPriceEditModal('${p.id}')" title="Ubah harga jual & modal barang ini">
              ✏️ Ubah Harga
            </button>
            ${!p.isService ? `
              <button class="btn-secondary-sm" style="padding:0.25rem 0.5rem; font-size:0.75rem;" onclick="quickRestockItem('${p.id}')">
                Restock
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function openRestockModal(preselectedId = null) {
  const select = document.getElementById("restockProductSelect");
  const tangible = storeData.products.filter(p => !p.isService);
  select.innerHTML = tangible.map(p => `
    <option value="${p.id}" ${p.id === preselectedId ? 'selected' : ''}>${p.name} (Stok Saat Ini: ${p.stock} ${p.unit})</option>
  `).join("");
  openModal("restockModal");
}

function quickRestockItem(productId) {
  openRestockModal(productId);
}

function submitRestock() {
  const productId = document.getElementById("restockProductSelect").value;
  const qty = parseInt(document.getElementById("restockQty").value) || 0;
  const cost = parseInt(document.getElementById("restockCost").value) || 0;
  const note = document.getElementById("restockNote").value || "Pengadaan Barang";

  if (qty <= 0) {
    alert("Jumlah masuk harus lebih dari 0!");
    return;
  }

  const p = storeData.products.find(prod => prod.id === productId);
  if (p) {
    p.stock += qty;
    if (cost > 0) p.costPrice = cost;

    const nowStr = new Date().toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" });
    storeData.stockLogs.unshift({
      date: nowStr,
      productId: p.id,
      productName: p.name,
      type: "MASUK",
      qty: qty,
      finalStock: p.stock,
      note: note,
      pic: "Theodorus Eldian (Owner)"
    });

    storeData.activityLogs.unshift({
      time: nowStr,
      user: "Owner",
      action: `Pengadaan Barang Masuk: ${p.name} +${qty} ${p.unit}`
    });

    saveStoreData(storeData);
    playBeep("success");
    closeModal("restockModal");
    renderInventoryTable();
    renderCatalogProducts();
    showToast(`Restock berhasil! Stok ${p.name} kini ${p.stock} ${p.unit}.`);
  }
}

/* ==========================================================================
   FITUR UBAH HARGA BARANG & JASA (PENYESUAIAN HARGA NAIK / TURUN)
   ========================================================================== */
function openPriceEditModal(productId = null) {
  const searchInput = document.getElementById("priceEditQuickSearch");
  if (searchInput) searchInput.value = "";

  const select = document.getElementById("priceEditProductSelect");
  if (!select) return;

  select.innerHTML = storeData.products.map(p => `
    <option value="${p.id}" ${p.id === productId ? 'selected' : ''}>
      [${p.id}] ${p.name} - ${formatRupiah(p.price)} / ${p.unit}
    </option>
  `).join("");

  const targetId = productId || (storeData.products[0] ? storeData.products[0].id : null);
  if (targetId) {
    select.value = targetId;
  }

  onPriceEditProductSelectChange();
  openModal("priceEditModal");

  setTimeout(() => {
    const input = document.getElementById("priceEditNewPrice");
    if (input) {
      input.focus();
      input.select();
    }
  }, 150);
}

function onPriceEditProductSelectChange() {
  const select = document.getElementById("priceEditProductSelect");
  if (!select) return;
  const productId = select.value;
  const p = storeData.products.find(item => item.id === productId);
  if (!p) return;

  const skuBadge = document.getElementById("priceEditSkuBadge");
  if (skuBadge) skuBadge.textContent = `SKU: ${p.id}`;

  const cardPreview = document.getElementById("priceEditCurrentCard");
  if (cardPreview) {
    cardPreview.innerHTML = `
      ${p.photo ? `
        <img src="${p.photo}" alt="${p.name}" style="width:48px; height:48px; object-fit:cover; border-radius:8px; border:1px solid var(--border-color); flex-shrink:0;" onerror="this.style.display='none';">
      ` : `
        <div style="width:48px; height:48px; border-radius:8px; background:var(--bg-surface); display:flex; align-items:center; justify-content:center; color:var(--primary); flex-shrink:0;">
          ${getProductIconSvg(p.image)}
        </div>
      `}
      <div style="flex:1; min-width:0;">
        <div style="font-weight:700; font-size:0.95rem; color:var(--text-main); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${p.name}</div>
        <div style="font-size:0.75rem; color:var(--text-muted); display:flex; gap:0.5rem; flex-wrap:wrap; margin-top:2px;">
          <span>Kategori: <strong>${p.category}</strong></span>
          <span>•</span>
          <span>Satuan: <strong>${p.unit}</strong></span>
          <span>•</span>
          <span>Stok: <strong>${p.isService ? 'Layanan' : `${p.stock} ${p.unit}`}</strong></span>
        </div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:0.7rem; color:var(--text-muted);">Harga Sekarang</div>
        <div style="font-family:'Outfit',sans-serif; font-weight:700; font-size:1.1rem; color:var(--primary);">${formatRupiah(p.price)}</div>
      </div>
    `;
  }

  const oldPriceInput = document.getElementById("priceEditOldPrice");
  if (oldPriceInput) oldPriceInput.value = formatRupiah(p.price);

  const newPriceInput = document.getElementById("priceEditNewPrice");
  if (newPriceInput) newPriceInput.value = p.price;

  const costPriceInput = document.getElementById("priceEditCostPrice");
  if (costPriceInput) costPriceInput.value = p.costPrice || 0;

  const wholesalePriceInput = document.getElementById("priceEditWholesalePrice");
  if (wholesalePriceInput) wholesalePriceInput.value = p.wholesalePrice || 0;

  const wholesaleMinQtyInput = document.getElementById("priceEditWholesaleMinQty");
  if (wholesaleMinQtyInput) wholesaleMinQtyInput.value = p.wholesaleMinQty || 3;

  const reasonInput = document.getElementById("priceEditReason");
  if (reasonInput) reasonInput.value = "";

  calculatePriceChangePreview();
}

function filterPriceEditProducts() {
  const query = (document.getElementById("priceEditQuickSearch")?.value || "").toLowerCase().trim();
  const select = document.getElementById("priceEditProductSelect");
  if (!select) return;

  const currentVal = select.value;
  const filtered = storeData.products.filter(p => {
    return !query ||
      p.name.toLowerCase().includes(query) ||
      p.id.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query);
  });

  if (filtered.length === 0) {
    select.innerHTML = `<option value="">-- Tidak ada barang yang cocok --</option>`;
    return;
  }

  select.innerHTML = filtered.map(p => `
    <option value="${p.id}" ${p.id === currentVal ? 'selected' : ''}>
      [${p.id}] ${p.name} - ${formatRupiah(p.price)} / ${p.unit}
    </option>
  `).join("");

  if (!filtered.some(p => p.id === currentVal)) {
    select.value = filtered[0].id;
  }

  onPriceEditProductSelectChange();
}

function calculatePriceChangePreview() {
  const select = document.getElementById("priceEditProductSelect");
  if (!select) return;
  const p = storeData.products.find(item => item.id === select.value);
  if (!p) return;

  const oldPrice = p.price || 0;
  const newPrice = parseInt(document.getElementById("priceEditNewPrice").value) || 0;
  const costPrice = parseInt(document.getElementById("priceEditCostPrice").value) || 0;

  const badgeContainer = document.getElementById("priceChangeBadgeContainer");
  if (badgeContainer) {
    if (newPrice > 0 && newPrice !== oldPrice) {
      badgeContainer.style.display = "block";
      const diff = newPrice - oldPrice;
      const pct = oldPrice > 0 ? ((Math.abs(diff) / oldPrice) * 100).toFixed(1) : "0";

      if (diff > 0) {
        badgeContainer.innerHTML = `
          <div style="background:rgba(239,68,68,0.12); border:1px solid rgba(239,68,68,0.3); border-radius:8px; padding:0.6rem 0.85rem; display:flex; align-items:center; justify-content:space-between;">
            <div style="display:flex; align-items:center; gap:0.5rem; color:#ef4444; font-weight:600; font-size:0.85rem;">
              <span>📈 Terjadi Kenaikan Harga:</span>
              <strong>+${formatRupiah(diff)}</strong>
            </div>
            <span style="background:#ef4444; color:#fff; font-size:0.75rem; font-weight:700; padding:2px 8px; border-radius:99px;">+${pct}% Naik</span>
          </div>
        `;
      } else {
        badgeContainer.innerHTML = `
          <div style="background:rgba(16,185,129,0.12); border:1px solid rgba(16,185,129,0.3); border-radius:8px; padding:0.6rem 0.85rem; display:flex; align-items:center; justify-content:space-between;">
            <div style="display:flex; align-items:center; gap:0.5rem; color:#10b981; font-weight:600; font-size:0.85rem;">
              <span>📉 Terjadi Penurunan Harga (Diskon):</span>
              <strong>-${formatRupiah(Math.abs(diff))}</strong>
            </div>
            <span style="background:#10b981; color:#fff; font-size:0.75rem; font-weight:700; padding:2px 8px; border-radius:99px;">-${pct}% Turun</span>
          </div>
        `;
      }
    } else {
      badgeContainer.style.display = "none";
    }
  }

  const marginPreview = document.getElementById("priceEditMarginPreview");
  if (marginPreview) {
    if (newPrice > 0) {
      const margin = costPrice > 0 ? Math.round(((newPrice - costPrice) / newPrice) * 100) : 100;
      const profit = newPrice - costPrice;
      marginPreview.innerHTML = `Margin Bersih: <strong style="color:${margin >= 30 ? 'var(--success)' : margin > 0 ? 'var(--warning)' : 'var(--danger)'};">${margin}%</strong> (Untung: ${formatRupiah(profit)})`;
    } else {
      marginPreview.textContent = "Margin: 0%";
    }
  }
}

function submitPriceEdit() {
  const select = document.getElementById("priceEditProductSelect");
  if (!select) return;
  const productId = select.value;
  const p = storeData.products.find(item => item.id === productId);
  if (!p) {
    alert("Produk tidak ditemukan!");
    return;
  }

  const newPrice = parseInt(document.getElementById("priceEditNewPrice").value) || 0;
  const costPrice = parseInt(document.getElementById("priceEditCostPrice").value) || 0;
  const wholesalePrice = parseInt(document.getElementById("priceEditWholesalePrice").value) || 0;
  const wholesaleMinQty = parseInt(document.getElementById("priceEditWholesaleMinQty").value) || 0;
  const reason = (document.getElementById("priceEditReason").value || "").trim();

  if (newPrice <= 0) {
    alert("Harga jual baru harus lebih besar dari Rp 0!");
    return;
  }

  const oldPrice = p.price;
  const priceDiff = newPrice - oldPrice;
  const changeType = priceDiff > 0 ? "Kenaikan Harga" : priceDiff < 0 ? "Penurunan Harga" : "Pengaturan Margin";

  if (oldPrice > 0 && Math.abs(priceDiff) / oldPrice > 0.5) {
    const confirmMsg = `Perhatian: Perubahan harga cukup besar (${formatRupiah(oldPrice)} ➔ ${formatRupiah(newPrice)}).\n\nApakah Anda yakin ingin menyimpan harga baru ini?`;
    if (!confirm(confirmMsg)) return;
  }

  p.price = newPrice;
  if (costPrice >= 0) p.costPrice = costPrice;
  if (wholesalePrice > 0) {
    p.wholesalePrice = wholesalePrice;
    p.wholesaleMinQty = wholesaleMinQty > 0 ? wholesaleMinQty : 3;
  } else {
    delete p.wholesalePrice;
    delete p.wholesaleMinQty;
  }

  sessions.forEach(sess => {
    sess.items.forEach(it => {
      if (it.productId === p.id) {
        it.price = newPrice;
        it.basePrice = newPrice;
      }
    });
  });

  const nowStr = new Date().toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" });
  const logNote = reason ? ` (${reason})` : "";
  storeData.activityLogs.unshift({
    time: nowStr,
    user: currentUser ? currentUser.name : "Owner",
    action: `Ubah Harga [${p.id}] ${p.name}: ${formatRupiah(oldPrice)} ➔ ${formatRupiah(newPrice)} [${changeType}]${logNote}`
  });

  saveStoreData(storeData);
  closeModal("priceEditModal");
  playBeep("success");

  renderCatalogProducts();
  renderActiveCart();
  renderInventoryTable();
  renderOwnerAnalytics();
  renderActivityLogs();

  const toastMsg = priceDiff !== 0 
    ? `Harga "${p.name}" berhasil diubah (${formatRupiah(oldPrice)} ➔ ${formatRupiah(newPrice)})!`
    : `Pengaturan harga "${p.name}" berhasil disimpan!`;
  showToast(toastMsg);
}

function openStockCardModal() {
  const tbody = document.getElementById("stockLogsTableBody");
  tbody.innerHTML = storeData.stockLogs.map(log => {
    let typeBadge = `<span class="status-badge-pill" style="background:var(--success-light); color:var(--success);">MASUK</span>`;
    if (log.type === "KELUAR") {
      typeBadge = `<span class="status-badge-pill warning">KELUAR</span>`;
    } else if (log.type === "KOREKSI") {
      typeBadge = `<span class="status-badge-pill" style="background:var(--info-light); color:var(--info);">KOREKSI</span>`;
    }

    return `
      <tr>
        <td style="font-size:0.75rem; color:var(--text-muted);">${log.date}</td>
        <td><strong>${log.productName}</strong></td>
        <td>${typeBadge}</td>
        <td style="font-weight:700;">${log.qty}</td>
        <td style="font-weight:700; color:var(--primary);">${log.finalStock}</td>
        <td style="font-size:0.78rem;">${log.note}</td>
        <td style="font-size:0.75rem; color:var(--text-muted);">${log.pic}</td>
      </tr>
    `;
  }).join("");
  openModal("stockCardModal");
}

function openStockOpnameModal() {
  const tbody = document.getElementById("stockOpnameTableBody");
  const tangible = storeData.products.filter(p => !p.isService);

  tbody.innerHTML = tangible.map(p => `
    <tr>
      <td><strong>${p.name}</strong></td>
      <td style="font-weight:700;">${p.stock} ${p.unit}</td>
      <td>
        <input type="number" class="form-control opname-input" data-id="${p.id}" value="${p.stock}" min="0" style="width:100px; padding:0.35rem 0.6rem;">
      </td>
      <td id="opnameDiff_${p.id}" style="font-weight:700; color:var(--success);">0</td>
    </tr>
  `).join("");

  document.querySelectorAll(".opname-input").forEach(input => {
    input.addEventListener("input", (e) => {
      const id = e.target.dataset.id;
      const p = storeData.products.find(prod => prod.id === id);
      const val = parseInt(e.target.value) || 0;
      const diff = val - p.stock;
      const diffEl = document.getElementById(`opnameDiff_${id}`);
      if (diff === 0) {
        diffEl.textContent = "0";
        diffEl.style.color = "var(--success)";
      } else if (diff < 0) {
        diffEl.textContent = `${diff} (Hilang/Rusak)`;
        diffEl.style.color = "var(--danger)";
      } else {
        diffEl.textContent = `+${diff} (Lebih)`;
        diffEl.style.color = "var(--info)";
      }
    });
  });

  openModal("stockOpnameModal");
}

function saveStockOpname() {
  const inputs = document.querySelectorAll(".opname-input");
  let changeCount = 0;
  const nowStr = new Date().toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" });

  inputs.forEach(input => {
    const id = input.dataset.id;
    const val = parseInt(input.value) || 0;
    const p = storeData.products.find(prod => prod.id === id);
    if (p && val !== p.stock) {
      const diff = val - p.stock;
      p.stock = val;
      changeCount++;
      storeData.stockLogs.unshift({
        date: nowStr,
        productId: p.id,
        productName: p.name,
        type: "KOREKSI",
        qty: diff,
        finalStock: p.stock,
        note: `Koreksi Stok Opname Fisik (${diff < 0 ? 'Selisih Minus' : 'Selisih Plus'})`,
        pic: "Supervisor / Owner"
      });
    }
  });

  saveStoreData(storeData);
  playBeep("success");
  closeModal("stockOpnameModal");
  renderInventoryTable();
  renderCatalogProducts();
  showToast(`Stok Opname berhasil disimpan! ${changeCount} item disesuaikan.`);
}

/* ==========================================================================
   EMPLOYEES MANAGEMENT (STATUS AKTIF / NONAKTIF)
   ========================================================================== */
function renderEmployeeTable() {
  const tbody = document.getElementById("employeeTableBody");
  if (!tbody) return;

  tbody.innerHTML = storeData.employees.map(emp => {
    const isAktif = emp.status === "Aktif";
    return `
      <tr>
        <td style="font-family:monospace; font-weight:700;">${emp.id}</td>
        <td>
          <strong>${emp.name}</strong>
          <br><small style="color:var(--text-muted);">${emp.phone}</small>
        </td>
        <td>${emp.role}</td>
        <td>${emp.shift}</td>
        <td>
          <span class="status-badge-pill ${isAktif ? 'active' : 'inactive'}">
            ${emp.status}
          </span>
        </td>
        <td style="font-weight:700;">${emp.transactionsServed} Transaksi</td>
        <td style="font-weight:700; color:var(--primary);">${formatRupiah(emp.totalSales)}</td>
        <td>
          <button class="btn-secondary-sm" style="padding:0.25rem 0.6rem; font-size:0.75rem;" onclick="toggleEmployeeStatus('${emp.id}')">
            ${isAktif ? 'Nonaktifkan' : 'Aktifkan Kembali'}
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

function toggleEmployeeStatus(empId) {
  const emp = storeData.employees.find(e => e.id === empId);
  if (!emp) return;

  const newStatus = emp.status === "Aktif" ? "Nonaktif" : "Aktif";
  emp.status = newStatus;

  storeData.activityLogs.unshift({
    time: new Date().toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" }),
    user: "Owner",
    action: `Ubah status karyawan ${emp.name} menjadi [${newStatus}] (Sesuai SOP, histori tetap utuh)`
  });

  saveStoreData(storeData);
  playBeep("scan");
  renderEmployeeTable();
  showToast(`Status karyawan ${emp.name} berhasil diubah menjadi: ${newStatus}`);
}

function openAddEmployeeModal() {
  const name = prompt("Masukkan Nama Karyawan Baru:");
  if (!name) return;
  const role = prompt("Masukkan Posisi (contoh: Kasir Shift Sore / Operator Fotokopi):", "Kasir Shift Sore");
  const phone = prompt("Masukkan Nomor HP / WhatsApp:", "0812-3344-5566");

  const newEmp = {
    id: "EMP-00" + (storeData.employees.length + 1),
    name: name,
    role: role || "Kasir",
    status: "Aktif",
    phone: phone || "-",
    shift: "Siang (13:00 - 21:00)",
    joinedDate: new Date().toLocaleDateString("id-ID"),
    transactionsServed: 0,
    totalSales: 0
  };

  storeData.employees.push(newEmp);
  saveStoreData(storeData);
  playBeep("success");
  renderEmployeeTable();
  showToast(`Karyawan baru ${name} berhasil ditambahkan!`);
}

/* ==========================================================================
   ACTIVITY LOGS (AUDIT TRAIL)
   ========================================================================== */
function renderActivityLogs() {
  const tbody = document.getElementById("activityLogsBody");
  if (!tbody) return;

  tbody.innerHTML = storeData.activityLogs.map(log => `
    <tr>
      <td style="font-size:0.78rem; color:var(--text-muted);">${log.time}</td>
      <td><strong>${log.user}</strong></td>
      <td>${log.action}</td>
      <td><span class="status-badge-pill" style="background:rgba(255,184,0,0.15); color:var(--primary);">Aman</span></td>
    </tr>
  `).join("");
}

/* ==========================================================================
   STARBOT AI TOKO CHATBOT
   ========================================================================== */
function toggleStarBotDrawer() {
  const drawer = document.getElementById("starbotDrawer");
  drawer.classList.toggle("open");
  if (drawer.classList.contains("open")) {
    document.getElementById("starbotInput").focus();
  }
}

function handleBotKey(e) {
  if (e.key === "Enter") sendStarBotMessage();
}

function sendStarBotMessage() {
  const input = document.getElementById("starbotInput");
  const q = input.value.trim();
  if (!q) return;
  input.value = "";
  askStarBot(q);
}

function askStarBot(query) {
  const chatBody = document.getElementById("starbotChatBody");
  // Render user question
  chatBody.innerHTML += `
    <div class="user-msg">
      <div class="user-bubble">${query}</div>
    </div>
  `;
  chatBody.scrollTop = chatBody.scrollHeight;

  playBeep("scan");

  // Generate intelligent response based on store data
  setTimeout(() => {
    let answer = "";
    const qLower = query.toLowerCase();

    if (qLower.includes("untung") || qLower.includes("profit") || qLower.includes("margin")) {
      const sortedByMargin = [...storeData.products]
        .filter(p => p.costPrice > 0)
        .map(p => ({
          name: p.name,
          margin: Math.round(((p.price - p.costPrice) / p.price) * 100),
          profitPerUnit: p.price - p.costPrice
        }))
        .sort((a, b) => b.margin - a.margin);

      answer = `Berikut adalah produk dengan <strong>margin laba tertinggi</strong> di COPY STAR KUBU:<br>
      1. <strong>${sortedByMargin[0].name}</strong> (Margin: ${sortedByMargin[0].margin}%, Untung: ${formatRupiah(sortedByMargin[0].profitPerUnit)}/unit)<br>
      2. <strong>${sortedByMargin[1].name}</strong> (Margin: ${sortedByMargin[1].margin}%, Untung: ${formatRupiah(sortedByMargin[1].profitPerUnit)}/unit)<br>
      3. <strong>${sortedByMargin[2].name}</strong> (Margin: ${sortedByMargin[2].margin}%, Untung: ${formatRupiah(sortedByMargin[2].profitPerUnit)}/unit)<br><br>
      💡 <em>Tips: Dorong kasir untuk menawarkan laminating dan fotokopi skala banyak karena modal bahan bakunya sangat ekonomis!</em>`;
    } else if (qLower.includes("omzet") || qLower.includes("laba hari ini") || qLower.includes("pendapatan")) {
      const today = storeData.weeklySalesData[storeData.weeklySalesData.length - 1];
      answer = `Laporan performa penjualan <strong>Hari Ini</strong>:<br>
      • <strong>Omzet Penjualan:</strong> ${formatRupiah(today.sales)}<br>
      • <strong>Estimasi Laba Bersih:</strong> ${formatRupiah(today.profit)}<br>
      • <strong>Margin Rata-rata:</strong> ${today.margin}%<br>
      • <strong>Jumlah Transaksi:</strong> ${today.txCount} nota kasir.<br><br>
      📈 Tren naik +18.5% dibanding kemarin, terutama dari lonjakan pesanan fotokopi modul & rim kertas!`;
    } else if (qLower.includes("restock") || qLower.includes("habis") || qLower.includes("stok")) {
      const lowItems = storeData.products.filter(p => !p.isService && p.stock <= p.minStock);
      answer = `⚠️ <strong>Peringatan Stok Mendesak:</strong><br>
      ${lowItems.map(p => `• <strong>${p.name}:</strong> Sisa ${p.stock} ${p.unit} (Batas Aman: ${p.minStock}) → <em>Prediksi habis dlm 2-4 hari</em>`).join("<br>")}<br><br>
      📦 Disarankan segera hubungi distributor PT. Sinar Dunia Mandiri untuk restock Kertas F4 & Pulpen Pilot G2!`;
    } else if (qLower.includes("kasir") || qLower.includes("karyawan") || qLower.includes("terlaris")) {
      const topEmp = [...storeData.employees].sort((a, b) => b.totalSales - a.totalSales)[0];
      answer = `🏆 Kasir dengan performa tertinggi adalah <strong>${topEmp.name}</strong> dengan:<br>
      • Total Transaksi: <strong>${topEmp.transactionsServed} transaksi</strong><br>
      • Kontribusi Omzet: <strong>${formatRupiah(topEmp.totalSales)}</strong><br>
      • Shift: ${topEmp.shift}<br><br>
      ${topEmp.name} sangat cepat dalam mengoperasikan multi-sesi kasir dan menawarkan map bundling! 🌟`;
    } else {
      answer = `Data COPY STAR KUBU menunjukkan operasional hari ini berjalan sangat stabil. Total omzet saat ini ${formatRupiah(storeData.weeklySalesData[6].sales)} dengan margin laba 45%. Ada 2 item yang membutuhkan restock segera. Apakah Anda ingin melihat rincian pengadaan atau laporan kasir?`;
    }

    chatBody.innerHTML += `
      <div class="bot-msg">
        <div class="bot-bubble">${answer}</div>
      </div>
    `;
    chatBody.scrollTop = chatBody.scrollHeight;
    playBeep("success");
  }, 400);
}

/* ==========================================================================
   PIN SUPERVISOR AUTHORIZATION (FOR VOID / DISCOUNTS)
   ========================================================================== */
let pendingPinCallback = null;

function requestSupervisorPin(description, callback) {
  pendingPinCallback = callback;
  const descEl = document.getElementById("pinPromptDesc");
  if (descEl) descEl.textContent = description || "Tindakan ini memerlukan PIN / Password Owner (Default PIN: 0000)";
  const inputEl = document.getElementById("supervisorPinInput");
  if (inputEl) inputEl.value = "";
  const errEl = document.getElementById("pinErrorMsg");
  if (errEl) errEl.style.display = "none";
  openModal("pinAuthModal");
  setTimeout(() => inputEl?.focus(), 150);
}

function submitPinAuth() {
  const pinInput = document.getElementById("supervisorPinInput");
  const pin = (pinInput?.value || "").trim();
  const validPin = storeData.storeInfo.supervisorPin || "0000";

  // Verifikasi PIN / Password: cocok dengan 0000 atau supervisorPin
  if (pin === validPin || pin === "0000") {
    playBeep("success");
    closeModal("pinAuthModal");

    // Catat log keamanan
    storeData.activityLogs.unshift({
      time: new Date().toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" }),
      user: currentUser ? currentUser.name : "Owner",
      action: "Otorisasi PIN/Password 0000 Berhasil (Akses Owner Terbuka)"
    });
    saveStoreData(storeData);

    if (typeof pendingPinCallback === "function") {
      const cb = pendingPinCallback;
      pendingPinCallback = null;
      cb();
    }
  } else {
    playBeep("warning");
    const errEl = document.getElementById("pinErrorMsg");
    if (errEl) {
      errEl.textContent = "PIN / Password salah! Silakan coba lagi (PIN: 0000)";
      errEl.style.display = "block";
    }
    if (pinInput) {
      pinInput.value = "";
      pinInput.focus();
    }
  }
}

// Listener tombol Enter pada input PIN
document.getElementById("supervisorPinInput")?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    submitPinAuth();
  }
});

/* ==========================================================================
   MODAL UTILITIES & TOAST
   ========================================================================== */
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add("active");
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove("active");
}

function showToast(msg) {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    <span>${msg}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

/* ==========================================================================
   KEYBOARD SHORTCUTS (F2, F4, F9, ESC)
   ========================================================================== */
function setupKeyboardShortcuts() {
  document.getElementById("priceEditNewPrice")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitPriceEdit();
    }
  });
  document.getElementById("priceEditReason")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitPriceEdit();
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "F2") {
      e.preventDefault();
      switchMainView("pos");
      const search = document.getElementById("posSearchInput");
      if (search) {
        search.focus();
        search.select();
      }
    } else if (e.key === "F3") {
      e.preventDefault();
      switchMainView("print");
    } else if (e.key === "F4") {
      e.preventDefault();
      switchMainView("pos");
      createNewSession();
    } else if (e.key === "F7") {
      e.preventDefault();
      switchMainView("price");
    } else if (e.key === "F9") {
      e.preventDefault();
      if (activeView === "pos") processCheckout();
    } else if (e.key === "Escape") {
      const activeModals = document.querySelectorAll(".modal-overlay.active");
      if (activeModals.length > 0) {
        activeModals.forEach(m => m.classList.remove("active"));
      } else if (["print", "price", "pasfoto", "banner"].includes(activeView)) {
        switchMainView("pos");
      }
      const bot = document.getElementById("starbotDrawer");
      if (bot) bot.classList.remove("open");
    }
  });
}

/* ==========================================================================
   FEATURE 1: CANVAS CONFETTI CELEBRATION ENGINE
   Zero external dependencies — ultra performant canvas confetti
   ========================================================================== */
function triggerConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  if (!canvas) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = "block";
  const ctx = canvas.getContext("2d");

  const colors = ["#F7C948", "#00E5FF", "#00D68F", "#FF4560", "#8B5CF6", "#FFFFFF"];
  const pieces = [];
  const count = 75;

  for (let i = 0; i < count; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height * 0.5,
      w: Math.random() * 10 + 6,
      h: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vy: Math.random() * 4 + 3,
      vx: (Math.random() - 0.5) * 3,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      opacity: 1
    });
  }

  let animationFrameId;
  const startTime = Date.now();
  const duration = 2600; // 2.6 seconds

  function render() {
    const elapsed = Date.now() - startTime;
    if (elapsed > duration) {
      cancelAnimationFrame(animationFrameId);
      canvas.style.display = "none";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach(p => {
      p.y += p.vy;
      p.x += p.vx + Math.sin(p.y * 0.02);
      p.rotation += p.rotationSpeed;
      if (elapsed > duration - 600) {
        p.opacity = Math.max(0, (duration - elapsed) / 600);
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    animationFrameId = requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   FEATURE 2: CETAK LAPORAN RESMI KEUANGAN & PENJUALAN (A4 / PDF)
   ========================================================================== */
function openPrintReportModal() {
  renderOfficialReport();
  openModal("printReportModal");
  showToast("Menyiapkan lembar dokumen resmi laporan penjualan...");
}

function renderOfficialReport() {
  const transactions = storeData.recentTransactions || [];
  const now = new Date();
  const dateFormatted = now.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  // Basic Metas
  const docNoEl = document.getElementById("rptDocNo");
  if (docNoEl) docNoEl.textContent = `RPT-CSK-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const printDateEl = document.getElementById("rptPrintDate");
  if (printDateEl) printDateEl.textContent = dateFormatted;
  const cashierEl = document.getElementById("rptCashierName");
  if (cashierEl) cashierEl.textContent = storeData.activeShift?.cashierName || "Niko";
  const signCashierEl = document.getElementById("rptSignCashier");
  if (signCashierEl) signCashierEl.textContent = storeData.activeShift?.cashierName || "Niko";
  const signDateEl = document.getElementById("rptSignDate");
  if (signDateEl) signDateEl.textContent = dateFormatted;

  // Aggregate Financials
  let totalOmzet = 0;
  let totalHpp = 0;
  let totalProfit = 0;
  const productStats = {};

  transactions.forEach(trx => {
    totalOmzet += trx.total || 0;
    totalHpp += trx.costTotal || 0;
    totalProfit += trx.profit || (trx.total - (trx.costTotal || 0));

    (trx.items || []).forEach(item => {
      const pid = item.productId || item.name;
      if (!productStats[pid]) {
        productStats[pid] = {
          name: item.name,
          category: item.category || "Jasa & Barang",
          qty: 0,
          revenue: 0,
          profit: 0
        };
      }
      productStats[pid].qty += item.qty || 1;
      const rev = (item.qty || 1) * (item.price || 0);
      const cost = (item.qty || 1) * (item.costPrice || 0);
      productStats[pid].revenue += rev;
      productStats[pid].profit += (rev - cost);
    });
  });

  const trxCount = transactions.length;
  const avgBasket = trxCount > 0 ? Math.round(totalOmzet / trxCount) : 0;
  const marginPct = totalOmzet > 0 ? Math.round((totalProfit / totalOmzet) * 100) : 0;

  // Set KPI Text
  const rptOmzet = document.getElementById("rptOmzet");
  if (rptOmzet) rptOmzet.textContent = formatRupiah(totalOmzet);
  const rptHpp = document.getElementById("rptHpp");
  if (rptHpp) rptHpp.textContent = formatRupiah(totalHpp);
  const rptProfit = document.getElementById("rptProfit");
  if (rptProfit) rptProfit.textContent = formatRupiah(totalProfit);
  const rptMargin = document.getElementById("rptMarginPct");
  if (rptMargin) rptMargin.textContent = `Margin Bersih: ${marginPct}%`;
  const rptTrx = document.getElementById("rptTrxCount");
  if (rptTrx) rptTrx.textContent = `${trxCount} Transaksi`;
  const rptAvg = document.getElementById("rptAvgBasket");
  if (rptAvg) rptAvg.textContent = `Rata-rata: ${formatRupiah(avgBasket)} / nota`;

  // Render Top 5 Products Table
  const topProducts = Object.values(productStats).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  const topBody = document.getElementById("rptTopProductsBody");
  if (topBody) {
    if (topProducts.length === 0) {
      topBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#64748B; padding:1rem;">Belum ada data transaksi yang tercatat</td></tr>`;
    } else {
      topBody.innerHTML = topProducts.map((p, idx) => `
        <tr>
          <td style="text-align:center; font-weight:700;">${idx + 1}</td>
          <td style="font-weight:600;">${p.name}</td>
          <td>${p.category}</td>
          <td class="col-right" style="font-weight:700;">${p.qty}</td>
          <td class="col-right">${formatRupiah(p.revenue)}</td>
          <td class="col-right" style="color:#059669; font-weight:700;">${formatRupiah(p.profit)}</td>
        </tr>
      `).join("");
    }
  }

  // Render Recent 8 Transactions Table
  const trxBody = document.getElementById("rptTransactionsBody");
  if (trxBody) {
    const recents = transactions.slice(0, 8);
    if (recents.length === 0) {
      trxBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#64748B; padding:1rem;">Belum ada nota transaksi</td></tr>`;
    } else {
      trxBody.innerHTML = recents.map(trx => `
        <tr>
          <td style="font-weight:700; font-family:monospace;">${trx.id}</td>
          <td style="font-size:0.75rem;">${trx.date}</td>
          <td>${trx.customer || "Pelanggan Umum"}</td>
          <td><span style="font-size:0.72rem; font-weight:700; background:#E2E8F0; padding:2px 6px; border-radius:3px;">${trx.paymentMethod}</span></td>
          <td class="col-right" style="font-weight:700;">${formatRupiah(trx.total)}</td>
          <td class="col-right" style="color:#059669; font-weight:600;">${formatRupiah(trx.profit || 0)}</td>
        </tr>
      `).join("");
    }
  }
}

function printOfficialReport() {
  document.body.classList.add("printing-report");
  setTimeout(() => {
    window.print();
    setTimeout(() => {
      document.body.classList.remove("printing-report");
    }, 1000);
  }, 100);
}

function exportTransactionsCSV() {
  const transactions = storeData.recentTransactions || [];
  if (transactions.length === 0) {
    showToast("Belum ada data transaksi untuk diekspor!");
    return;
  }

  let csvContent = "\uFEFF"; // UTF-8 BOM
  csvContent += "No. Transaksi,Tanggal & Waktu,Nama Pelanggan,Kasir,Metode Pembayaran,Total Belanja (Rp),Total Modal HPP (Rp),Laba Bersih (Rp)\n";

  transactions.forEach(trx => {
    const row = [
      `"${trx.id}"`,
      `"${trx.date}"`,
      `"${(trx.customer || 'Pelanggan Umum').replace(/"/g, '""')}"`,
      `"${(trx.cashier || storeData.activeShift.cashierName).replace(/"/g, '""')}"`,
      `"${trx.paymentMethod}"`,
      trx.total || 0,
      trx.costTotal || 0,
      trx.profit || 0
    ];
    csvContent += row.join(",") + "\n";
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const fileName = `Laporan_Transaksi_COPY_STAR_KUBU_${new Date().toISOString().slice(0, 10)}.csv`;
  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast("File Laporan Transaksi CSV Berhasil Diunduh 📥");
}

/* ==========================================================================
   FEATURE: SISTEM KHUSUS DESA (BUKU KASBON & ANTREAN WA)
   ========================================================================== */

// Helper: Format nomor telepon untuk WhatsApp URL
function cleanPhoneNumberForWa(phone) {
  if (!phone) return "";
  let cleaned = phone.replace(/[^0-9]/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.slice(1);
  } else if (!cleaned.startsWith("62")) {
    cleaned = "62" + cleaned;
  }
  return cleaned;
}

// Update badges di header & tabs secara real-time
function updateHeaderFeatureBadges() {
  if (!storeData.debts) storeData.debts = [];
  if (!storeData.waQueue) storeData.waQueue = [];

  const unpaidDebts = storeData.debts.filter(d => d.status === "BELUM_LUNAS").length;
  const headerKasbonBadge = document.getElementById("headerKasbonBadge");
  if (headerKasbonBadge) {
    headerKasbonBadge.textContent = unpaidDebts;
    headerKasbonBadge.style.display = unpaidDebts > 0 ? "inline-flex" : "none";
  }

  const activeWaJobs = storeData.waQueue.filter(w => w.status !== "SELESAI").length;
  const headerWaBadge = document.getElementById("headerWaQueueBadge");
  if (headerWaBadge) {
    headerWaBadge.textContent = activeWaJobs;
    headerWaBadge.style.display = activeWaJobs > 0 ? "inline-flex" : "none";
  }

  // Update counts on filter tabs
  const countAll = storeData.waQueue.length;
  const countWaiting = storeData.waQueue.filter(w => w.status === "MENUNGGU").length;
  const countPrinting = storeData.waQueue.filter(w => w.status === "SEDANG_DICETAK").length;
  const countReady = storeData.waQueue.filter(w => w.status === "SIAP_DIAMBIL").length;

  ["waCountAll", "modalWaCountAll"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = countAll;
  });
  ["waCountWaiting", "modalWaCountWaiting"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = countWaiting;
  });
  ["waCountPrinting", "modalWaCountPrinting"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = countPrinting;
  });
  ["waCountReady", "modalWaCountReady"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = countReady;
  });
}

/* ──────────────────────────────────────────────────────────────────────────
   1. BUKU KASBON & UTANG PIUTANG WARGA
   ────────────────────────────────────────────────────────────────────────── */
let currentKasbonFilterStatus = "ALL";
let currentKasbonSearchQuery = "";

function openKasbonCheckoutModal() {
  const currentSession = getActiveSession();
  if (currentSession.items.length === 0) {
    playBeep("warning");
    showToast("Keranjang belanja masih kosong!");
    return;
  }

  const subtotal = currentSession.items.reduce((sum, it) => sum + (it.qty * it.price), 0);
  const discountAmount = Math.round(subtotal * ((currentSession.customer.discountPct || 0) / 100));
  const finalTotal = subtotal - discountAmount;

  document.getElementById("checkoutKasbonTotal").textContent = formatRupiah(finalTotal);
  document.getElementById("checkoutKasbonRemaining").textContent = formatRupiah(finalTotal);
  document.getElementById("checkoutDebtorDp").value = "0";

  // Prefill jika nama customer bukan 'Pelanggan Umum'
  const nameInput = document.getElementById("checkoutDebtorName");
  if (currentSession.customer && currentSession.customer.name && currentSession.customer.name !== "Pelanggan Umum") {
    nameInput.value = currentSession.customer.name;
  } else {
    nameInput.value = "";
  }
  document.getElementById("checkoutDebtorPhone").value = "";
  document.getElementById("checkoutDebtorAddress").value = "";
  document.getElementById("checkoutDebtorDueDate").value = "Akhir Bulan (Gajian)";

  openModal("newKasbonCheckoutModal");
}

function updateCheckoutKasbonRemaining() {
  const currentSession = getActiveSession();
  const subtotal = currentSession.items.reduce((sum, it) => sum + (it.qty * it.price), 0);
  const discountAmount = Math.round(subtotal * ((currentSession.customer.discountPct || 0) / 100));
  const finalTotal = subtotal - discountAmount;

  const dp = parseFloat(document.getElementById("checkoutDebtorDp").value) || 0;
  const remaining = Math.max(0, finalTotal - dp);
  document.getElementById("checkoutKasbonRemaining").textContent = formatRupiah(remaining);
}

function confirmKasbonCheckout() {
  const debtorName = document.getElementById("checkoutDebtorName").value.trim();
  if (!debtorName) {
    showToast("Harap isi nama peminjam / warga!");
    document.getElementById("checkoutDebtorName").focus();
    return;
  }

  const debtorPhone = document.getElementById("checkoutDebtorPhone").value.trim();
  const debtorAddress = document.getElementById("checkoutDebtorAddress").value.trim();
  const dueDate = document.getElementById("checkoutDebtorDueDate").value.trim() || "Akhir Bulan";
  const dpAmount = parseFloat(document.getElementById("checkoutDebtorDp").value) || 0;

  const currentSession = getActiveSession();
  const subtotal = currentSession.items.reduce((sum, it) => sum + (it.qty * it.price), 0);
  const discountAmount = Math.round(subtotal * ((currentSession.customer.discountPct || 0) / 100));
  const finalTotal = subtotal - discountAmount;
  const costTotal = currentSession.items.reduce((sum, it) => sum + (it.qty * (it.costPrice || 0)), 0);
  const netProfit = finalTotal - costTotal;
  const remainingDebt = Math.max(0, finalTotal - dpAmount);

  const trxId = "TRX-" + Math.floor(1000 + Math.random() * 9000);
  const debtId = "KSB-" + String((storeData.debts || []).length + 1).padStart(3, "0");
  const nowStr = new Date().toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" });

  const itemsSummary = currentSession.items.map(it => `${it.name} (${it.qty}x)`).join(", ");

  // Simpan record kasbon
  const newDebt = {
    id: debtId,
    trxId: trxId,
    customerName: debtorName,
    customerPhone: debtorPhone || "-",
    customerAddress: debtorAddress || "Warga Desa Kubu",
    date: nowStr,
    dueDate: dueDate,
    totalAmount: finalTotal,
    paidAmount: dpAmount,
    remainingAmount: remainingDebt,
    status: remainingDebt === 0 ? "LUNAS" : "BELUM_LUNAS",
    notes: `Kasbon POS ${trxId}`,
    itemsSummary: itemsSummary,
    payments: dpAmount > 0 ? [
      {
        date: nowStr,
        amount: dpAmount,
        note: "Uang muka (DP) saat transaksi",
        cashier: storeData.activeShift.cashierName
      }
    ] : []
  };

  if (!storeData.debts) storeData.debts = [];
  storeData.debts.unshift(newDebt);

  // Potong stok inventori
  currentSession.items.forEach(it => {
    const p = storeData.products.find(prod => prod.id === it.productId);
    if (p && !p.isService) {
      p.stock = Math.max(0, p.stock - it.qty);
      storeData.stockLogs.unshift({
        date: nowStr,
        productId: p.id,
        productName: p.name,
        type: "KELUAR",
        qty: it.qty,
        finalStock: p.stock,
        note: `Penjualan Kasbon ${debtId}`,
        pic: storeData.activeShift.cashierName
      });
    }
  });

  // Catat transaksi
  storeData.recentTransactions.unshift({
    id: trxId,
    date: nowStr,
    customer: debtorName,
    cashier: storeData.activeShift.cashierName,
    items: JSON.parse(JSON.stringify(currentSession.items)),
    subtotal: subtotal,
    discount: discountAmount,
    total: finalTotal,
    costTotal: costTotal,
    profit: netProfit,
    paymentMethod: "KASBON",
    amountPaid: dpAmount,
    change: 0
  });

  // Update kas kasir jika ada DP tunai
  if (dpAmount > 0) {
    storeData.activeShift.totalCashSales += dpAmount;
  }
  storeData.activeShift.totalTransactions += 1;

  // Render receipt modal
  document.getElementById("rcptMetaTime").textContent = `${nowStr} | ${trxId}`;
  document.getElementById("rcptMetaCashier").textContent = `Kasir: ${storeData.activeShift.cashierName}`;
  document.getElementById("rcptMetaCustomer").textContent = `Pelanggan: ${debtorName} (Kasbon)`;

  const itemsTable = document.getElementById("rcptItemsTable");
  itemsTable.innerHTML = currentSession.items.map(it => `
    <tr>
      <td colspan="2" style="font-weight:bold;">${it.name}</td>
    </tr>
    <tr>
      <td style="color:#555;">${it.qty} x ${formatRupiah(it.price)}</td>
      <td style="text-align:right; font-weight:600;">${formatRupiah(it.qty * it.price)}</td>
    </tr>
  `).join("");

  document.getElementById("rcptSubtotal").textContent = formatRupiah(subtotal);
  if (discountAmount > 0) {
    document.getElementById("rcptDiscountRow").style.display = "table-row";
    document.getElementById("rcptDiscount").textContent = "- " + formatRupiah(discountAmount);
  } else {
    document.getElementById("rcptDiscountRow").style.display = "none";
  }
  document.getElementById("rcptTotal").textContent = formatRupiah(finalTotal);
  document.getElementById("rcptMethod").textContent = `KASBON / TEMPO (${debtId})`;
  document.getElementById("rcptPaid").textContent = `DP: ${formatRupiah(dpAmount)} (Sisa: ${formatRupiah(remainingDebt)})`;
  document.getElementById("rcptChange").textContent = "Rp 0";

  saveStoreData(storeData);

  closeModal("newKasbonCheckoutModal");
  openModal("receiptModal");

  // Reset sesi aktif
  currentSession.items = [];
  currentSession.amountPaid = 0;
  currentSession.paymentMethod = "TUNAI";
  renderActiveCart();
  renderCatalogProducts();
  updateHeaderFeatureBadges();
  renderKasbonTable();

  playBeep("success");
  triggerConfetti();
  showToast(`Kasbon ${debtId} untuk ${debtorName} berhasil dicatat di Buku Utang! 📝`);
}

function openKasbonBookModal() {
  renderKasbonTable();
  openModal("kasbonBookModal");
}

function openManualKasbonModal() {
  document.getElementById("manualKasbonName").value = "";
  document.getElementById("manualKasbonPhone").value = "";
  document.getElementById("manualKasbonDueDate").value = "Akhir Bulan";
  document.getElementById("manualKasbonAddress").value = "";
  document.getElementById("manualKasbonItems").value = "";
  document.getElementById("manualKasbonTotal").value = "";
  document.getElementById("manualKasbonPaid").value = "0";
  document.getElementById("manualKasbonRemainingText").textContent = "Rp 0";

  openModal("manualKasbonModal");
}

function updateManualKasbonRemaining() {
  const total = parseFloat(document.getElementById("manualKasbonTotal").value) || 0;
  const paid = parseFloat(document.getElementById("manualKasbonPaid").value) || 0;
  const rem = Math.max(0, total - paid);
  document.getElementById("manualKasbonRemainingText").textContent = formatRupiah(rem);
}

function submitManualKasbon() {
  const name = document.getElementById("manualKasbonName").value.trim();
  const phone = document.getElementById("manualKasbonPhone").value.trim();
  const dueDate = document.getElementById("manualKasbonDueDate").value.trim() || "Akhir Bulan";
  const address = document.getElementById("manualKasbonAddress").value.trim();
  const items = document.getElementById("manualKasbonItems").value.trim();
  const total = parseFloat(document.getElementById("manualKasbonTotal").value) || 0;
  const paid = parseFloat(document.getElementById("manualKasbonPaid").value) || 0;

  if (!name) {
    showToast("Nama warga wajib diisi!");
    return;
  }
  if (!items) {
    showToast("Rincian barang wajib diisi!");
    return;
  }
  if (total <= 0) {
    showToast("Total nilai kasbon harus lebih dari 0!");
    return;
  }

  const remaining = Math.max(0, total - paid);
  const debtId = "KSB-" + String((storeData.debts || []).length + 1).padStart(3, "0");
  const nowStr = new Date().toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" });

  const newDebt = {
    id: debtId,
    trxId: "MANUAL-" + Math.floor(100 + Math.random() * 900),
    customerName: name,
    customerPhone: phone || "-",
    customerAddress: address || "Warga Desa Kubu",
    date: nowStr,
    dueDate: dueDate,
    totalAmount: total,
    paidAmount: paid,
    remainingAmount: remaining,
    status: remaining === 0 ? "LUNAS" : "BELUM_LUNAS",
    notes: "Pencatatan kasbon manual",
    itemsSummary: items,
    payments: paid > 0 ? [
      { date: nowStr, amount: paid, note: "DP Tunai", cashier: storeData.activeShift.cashierName }
    ] : []
  };

  if (!storeData.debts) storeData.debts = [];
  storeData.debts.unshift(newDebt);

  saveStoreData(storeData);
  updateHeaderFeatureBadges();
  renderKasbonTable();
  closeModal("manualKasbonModal");
  showToast(`Kasbon manual ${debtId} berhasil ditambahkan! 📝`);
  playBeep("success");
}

function renderKasbonTable() {
  if (!storeData.debts) storeData.debts = [];

  // Filter & Search
  let list = storeData.debts;
  if (currentKasbonFilterStatus !== "ALL") {
    list = list.filter(d => d.status === currentKasbonFilterStatus);
  }
  if (currentKasbonSearchQuery) {
    const q = currentKasbonSearchQuery.toLowerCase();
    list = list.filter(d =>
      d.customerName.toLowerCase().includes(q) ||
      (d.customerPhone && d.customerPhone.includes(q)) ||
      (d.itemsSummary && d.itemsSummary.toLowerCase().includes(q)) ||
      d.id.toLowerCase().includes(q)
    );
  }

  // KPIs
  const totalReceivables = storeData.debts
    .filter(d => d.status === "BELUM_LUNAS")
    .reduce((sum, d) => sum + d.remainingAmount, 0);
  const activeDebtorsCount = storeData.debts
    .filter(d => d.status === "BELUM_LUNAS").length;
  const settledCount = storeData.debts
    .filter(d => d.status === "LUNAS").length;
  const totalSettledAmount = storeData.debts
    .reduce((sum, d) => sum + d.paidAmount, 0);

  const kpisHtml = `
    <div class="kasbon-kpi-card amber">
      <div class="kpi-label">Total Sisa Piutang Warga</div>
      <div class="kpi-number" style="color:#FFA726;">${formatRupiah(totalReceivables)}</div>
      <div class="kpi-subtext">Belum tertagih / terbayar</div>
    </div>
    <div class="kasbon-kpi-card red">
      <div class="kpi-label">Jumlah Warga Belum Lunas</div>
      <div class="kpi-number" style="color:var(--danger);">${activeDebtorsCount} Orang</div>
      <div class="kpi-subtext">Menunggu pelunasan / tempo</div>
    </div>
    <div class="kasbon-kpi-card green">
      <div class="kpi-label">Kasbon Sudah Lunas</div>
      <div class="kpi-number" style="color:var(--success);">${settledCount} Transaksi</div>
      <div class="kpi-subtext">Total lunas: ${formatRupiah(totalSettledAmount)}</div>
    </div>
    <div class="kasbon-kpi-card blue">
      <div class="kpi-label">Total Riwayat Kasbon</div>
      <div class="kpi-number" style="color:#00E5FF;">${storeData.debts.length} Catatan</div>
      <div class="kpi-subtext">Buku kasbon Copy Star Kubu</div>
    </div>
  `;

  ["kasbonKpisContainer", "modalKasbonKpisContainer"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = kpisHtml;
  });

  // Table rows HTML
  let rowsHtml = "";
  if (list.length === 0) {
    rowsHtml = `
      <tr>
        <td colspan="10" style="text-align:center; padding:2rem; color:var(--text-muted);">
          Tidak ada data kasbon yang sesuai dengan filter.
        </td>
      </tr>
    `;
  } else {
    rowsHtml = list.map(d => {
      const isPaid = d.status === "LUNAS";
      const statusBadge = isPaid
        ? `<span class="badge-status-paid">✓ LUNAS</span>`
        : `<span class="badge-status-unpaid">⏳ BELUM LUNAS</span>`;

      return `
        <tr>
          <td style="font-family:monospace; font-weight:700;">${d.id}</td>
          <td>
            <strong>${d.customerName}</strong>
            <div style="font-size:0.75rem; color:var(--text-muted); display:flex; align-items:center; gap:4px; margin-top:2px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              ${d.customerPhone}
            </div>
          </td>
          <td><span style="font-size:0.75rem; color:var(--text-muted);">${d.customerAddress || '-'}</span></td>
          <td>
            <div style="font-size:0.8rem; font-weight:600;">${d.date}</div>
            <div style="font-size:0.72rem; color:#FFA726;">Tempo: ${d.dueDate}</div>
          </td>
          <td>
            <div style="max-width:220px; font-size:0.8rem; line-height:1.2;" title="${d.itemsSummary || d.notes}">
              ${d.itemsSummary || d.notes}
            </div>
          </td>
          <td style="font-weight:700;">${formatRupiah(d.totalAmount)}</td>
          <td style="font-weight:700; color:var(--danger);">${formatRupiah(d.remainingAmount)}</td>
          <td>${statusBadge}</td>
          <td>
            <div style="display:flex; gap:0.35rem; align-items:center; flex-wrap:wrap;">
              ${!isPaid ? `
                <button class="btn-secondary-sm" style="padding:0.25rem 0.55rem; font-size:0.75rem; border-color:var(--success); color:var(--success);" onclick="openPayInstallmentModal('${d.id}')" title="Bayar cicilan atau pelunasan kasbon">
                  💳 Bayar
                </button>
                <button class="btn-wa-notify" style="padding:0.25rem 0.55rem; font-size:0.75rem;" onclick="sendKasbonWaReminder('${d.id}')" title="Kirim pengingat tagihan ramah lewat WhatsApp">
                  📲 Tagih WA
                </button>
              ` : `
                <button class="btn-secondary-sm" style="padding:0.25rem 0.55rem; font-size:0.75rem; opacity:0.8;" onclick="openPayInstallmentModal('${d.id}')" title="Lihat riwayat pelunasan">
                  📋 Riwayat
                </button>
              `}
              <button class="btn-secondary-sm" style="padding:0.25rem 0.45rem; font-size:0.75rem; color:var(--danger);" onclick="deleteKasbon('${d.id}')" title="Hapus catatan">
                🗑️
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  ["kasbonTableBody", "modalKasbonTableBody"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = rowsHtml;
  });
}

function filterKasbonStatus(status) {
  currentKasbonFilterStatus = status;
  ["btnFilterKasbonAll", "modalFilterKasbonAll"].forEach(id => document.getElementById(id)?.classList.toggle("active", status === "ALL"));
  ["btnFilterKasbonUnpaid", "modalFilterKasbonUnpaid"].forEach(id => document.getElementById(id)?.classList.toggle("active", status === "BELUM_LUNAS"));
  ["btnFilterKasbonPaid", "modalFilterKasbonPaid"].forEach(id => document.getElementById(id)?.classList.toggle("active", status === "LUNAS"));
  renderKasbonTable();
}

function filterModalKasbonStatus(status) {
  filterKasbonStatus(status);
}

function handleKasbonSearch(val) {
  currentKasbonSearchQuery = val;
  const otherInput = document.getElementById("modalKasbonSearchInput");
  if (otherInput && otherInput.value !== val) otherInput.value = val;
  renderKasbonTable();
}

function handleModalKasbonSearch(val) {
  currentKasbonSearchQuery = val;
  const otherInput = document.getElementById("kasbonSearchInput");
  if (otherInput && otherInput.value !== val) otherInput.value = val;
  renderKasbonTable();
}

function openPayInstallmentModal(debtId) {
  const debt = storeData.debts.find(d => d.id === debtId);
  if (!debt) return;

  document.getElementById("payKasbonDebtId").value = debt.id;
  document.getElementById("payKasbonCustomerName").textContent = debt.customerName;
  document.getElementById("payKasbonIdBadge").textContent = debt.id;
  document.getElementById("payKasbonRemainingText").textContent = formatRupiah(debt.remainingAmount);
  document.getElementById("payKasbonAmount").value = debt.remainingAmount > 0 ? debt.remainingAmount : 0;
  document.getElementById("payKasbonNote").value = "";

  openModal("payKasbonInstallmentModal");
}

function setPayKasbonAmount(amount) {
  document.getElementById("payKasbonAmount").value = amount;
}

function setPayKasbonAmountFull() {
  const debtId = document.getElementById("payKasbonDebtId").value;
  const debt = storeData.debts.find(d => d.id === debtId);
  if (debt) {
    document.getElementById("payKasbonAmount").value = debt.remainingAmount;
  }
}

function submitInstallmentPayment() {
  const debtId = document.getElementById("payKasbonDebtId").value;
  const debt = storeData.debts.find(d => d.id === debtId);
  if (!debt) return;

  const amount = parseFloat(document.getElementById("payKasbonAmount").value) || 0;
  if (amount <= 0) {
    showToast("Jumlah pembayaran harus lebih dari 0!");
    return;
  }

  const method = document.getElementById("payKasbonMethod").value;
  const note = document.getElementById("payKasbonNote").value.trim() || `Pembayaran ${method}`;
  const nowStr = new Date().toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" });

  if (!debt.payments) debt.payments = [];
  debt.payments.push({
    date: nowStr,
    amount: amount,
    note: `${note} (${method})`,
    cashier: storeData.activeShift.cashierName
  });

  debt.paidAmount += amount;
  debt.remainingAmount = Math.max(0, debt.totalAmount - debt.paidAmount);

  if (debt.remainingAmount === 0) {
    debt.status = "LUNAS";
  }

  // Tambah kas ke kasir jika tunai
  if (method === "TUNAI") {
    storeData.activeShift.totalCashSales += amount;
  } else {
    storeData.activeShift.totalQrisSales += amount;
  }

  saveStoreData(storeData);
  updateHeaderFeatureBadges();
  renderKasbonTable();
  closeModal("payKasbonInstallmentModal");

  playBeep("success");
  if (debt.status === "LUNAS") {
    triggerConfetti();
    showToast(`Alhamdulillah! Kasbon ${debt.id} (${debt.customerName}) dinyatakan LUNAS! 🎉`);
  } else {
    showToast(`Cicilan ${formatRupiah(amount)} untuk ${debt.customerName} berhasil disimpan.`);
  }
}

function sendKasbonWaReminder(debtId) {
  const debt = storeData.debts.find(d => d.id === debtId);
  if (!debt) return;

  const cleanPhone = cleanPhoneNumberForWa(debt.customerPhone);
  if (!cleanPhone || cleanPhone.length < 8) {
    showToast("Nomor HP / WhatsApp warga tidak valid atau belum dicatat!");
    return;
  }

  const message = `Assalamu'alaikum / Halo Bpk/Ibu *${debt.customerName}*,\n\nKami dari *COPY STAR KUBU* ingin menyampaikan pengingat ramah untuk catatan kasbon belanja Anda:\n\n` +
    `📌 *No. Kasbon:* ${debt.id}\n` +
    `📦 *Rincian:* ${debt.itemsSummary || debt.notes}\n` +
    `💰 *Total Kasbon:* ${formatRupiah(debt.totalAmount)}\n` +
    `💵 *Sudah Dibayar:* ${formatRupiah(debt.paidAmount)}\n` +
    `⚠️ *Sisa Tagihan:* *${formatRupiah(debt.remainingAmount)}*\n` +
    `📅 *Jatuh Tempo:* ${debt.dueDate}\n\n` +
    `Pembayaran bisa ditransfer via Bank/QRIS atau datang langsung ke toko ya Bpk/Ibu. Terima kasih banyak atas kerjasamanya! Semoga sehat & berkah selalu. 🙏✨\n\n` +
    `*- COPY STAR KUBU -*\n` +
    `_Digital Photocopy, Photo Printing & ATK_`;

  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, "_blank");
  showToast(`Membuka WhatsApp untuk mengirim pengingat ke ${debt.customerName}... 📲`);
}

function deleteKasbon(debtId) {
  if (!confirm(`Hapus catatan kasbon ${debtId}?`)) return;
  storeData.debts = storeData.debts.filter(d => d.id !== debtId);
  saveStoreData(storeData);
  updateHeaderFeatureBadges();
  renderKasbonTable();
  showToast(`Catatan kasbon ${debtId} berhasil dihapus.`);
}

/* ──────────────────────────────────────────────────────────────────────────
   2. ANTREAN BERKAS CETAK & FOTO VIA WHATSAPP
   ────────────────────────────────────────────────────────────────────────── */
let currentWaFilterStatus = "ALL";
let currentWaSearchQuery = "";

function openWaQueueModal() {
  renderWaQueue();
  openModal("waQueueModal");
}

function openNewWaQueueModal() {
  document.getElementById("newWaSenderName").value = "";
  document.getElementById("newWaPhone").value = "";
  document.getElementById("newWaDocTitle").value = "";
  document.getElementById("newWaQty").value = "1";
  document.getElementById("newWaEstimatedPrice").value = "";
  document.getElementById("newWaPaperType").value = "HVS A4 70gr";
  document.getElementById("newWaNotes").value = "";
  document.getElementById("newWaUrgent").checked = false;

  openModal("newWaQueueModal");
}

function submitNewWaQueue() {
  const source = document.getElementById("newWaSource")?.value || "WhatsApp";
  const senderName = document.getElementById("newWaSenderName").value.trim();
  const phone = document.getElementById("newWaPhone").value.trim();
  const serviceType = document.getElementById("newWaServiceType").value;
  const docTitle = document.getElementById("newWaDocTitle").value.trim();
  const qty = parseInt(document.getElementById("newWaQty").value) || 1;
  const price = parseFloat(document.getElementById("newWaEstimatedPrice").value) || 0;
  const paperType = document.getElementById("newWaPaperType").value.trim() || "Standar";
  const notes = document.getElementById("newWaNotes").value.trim();
  const urgent = document.getElementById("newWaUrgent").checked;

  if (!senderName) {
    showToast("Nama pengirim wajib diisi!");
    return;
  }
  if (!phone) {
    showToast("Nomor WhatsApp atau Username Instagram wajib diisi!");
    return;
  }
  if (!docTitle) {
    showToast("Judul file atau nama berkas wajib diisi!");
    return;
  }
  if (price <= 0) {
    showToast("Estimasi biaya cetak harus diisi!");
    return;
  }

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const prefix = source === "Instagram" ? "IG-" : "WA-";
  const newId = prefix + (200 + (storeData.waQueue || []).length + 1);

  const newOrder = {
    id: newId,
    source: source,
    senderName: senderName,
    phone: phone,
    serviceType: serviceType,
    docTitle: docTitle,
    qty: qty,
    paperType: paperType,
    notes: notes,
    estimatedPrice: price,
    status: "MENUNGGU",
    createdAt: timeStr,
    urgent: urgent
  };

  if (!storeData.waQueue) storeData.waQueue = [];
  storeData.waQueue.unshift(newOrder);

  saveStoreData(storeData);
  updateHeaderFeatureBadges();
  renderWaQueue();
  closeModal("newWaQueueModal");

  showToast(`Pesanan berkas [${source}] ${newId} (${senderName}) berhasil dicatat! 📄`);
  playBeep("success");
}

function renderWaQueue() {
  if (!storeData.waQueue) storeData.waQueue = [];

  let list = storeData.waQueue;
  if (currentWaFilterStatus !== "ALL") {
    list = list.filter(w => w.status === currentWaFilterStatus);
  }
  if (currentWaSearchQuery) {
    const q = currentWaSearchQuery.toLowerCase();
    list = list.filter(w =>
      w.senderName.toLowerCase().includes(q) ||
      w.phone.includes(q) ||
      w.docTitle.toLowerCase().includes(q) ||
      w.serviceType.toLowerCase().includes(q)
    );
  }

  let cardsHtml = "";
  if (list.length === 0) {
    cardsHtml = `
      <div style="grid-column: 1 / -1; text-align:center; padding:3rem; color:var(--text-muted); background:var(--bg-surface-elevated); border:1px dashed var(--border-color); border-radius:12px;">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom:0.5rem; opacity:0.6;">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
        <p style="margin:0; font-size:0.9rem;">Tidak ada antrean berkas cetak yang sesuai filter saat ini.</p>
      </div>
    `;
  } else {
    cardsHtml = list.map(item => {
      let statusBadge = "";
      if (item.status === "MENUNGGU") {
        statusBadge = `<span class="badge-wa-waiting">⏳ Menunggu</span>`;
      } else if (item.status === "SEDANG_DICETAK") {
        statusBadge = `<span class="badge-wa-printing">🖨️ Sedang Dicetak</span>`;
      } else if (item.status === "SIAP_DIAMBIL") {
        statusBadge = `<span class="badge-wa-ready">✅ Siap Diambil</span>`;
      } else {
        statusBadge = `<span class="badge-wa-done">📦 Selesai</span>`;
      }

      return `
        <div class="wa-order-card ${item.urgent ? 'urgent' : ''}">
          <div class="wa-card-header">
            <div>
              <div style="display:flex; align-items:center; gap:6px;">
                <span style="font-family:monospace; font-size:0.75rem; color:var(--primary); font-weight:700;">${item.id}</span>
                <span style="font-size:0.7rem; color:var(--text-muted);">Jam ${item.createdAt}</span>
                ${item.urgent ? `<span style="font-size:0.68rem; font-weight:800; background:rgba(255,69,96,0.2); color:var(--danger); padding:1px 5px; border-radius:4px;">URGENT</span>` : ''}
              </div>
              <h4 class="wa-customer-name">${item.senderName}</h4>
              <div class="wa-customer-phone">
                ${(item.source === "Instagram" || (item.phone && item.phone.startsWith("@"))) ? `
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E1306C" stroke-width="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  <span style="color:#E1306C; font-weight:700;">IG: ${item.phone}</span>
                ` : `
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  ${item.phone}
                `}
              </div>
            </div>
            <div>${statusBadge}</div>
          </div>

          <div>
            <span style="font-size:0.72rem; text-transform:uppercase; color:var(--text-muted); font-weight:700;">${item.serviceType}</span>
            <div class="wa-doc-title">${item.docTitle}</div>
          </div>

          <div class="wa-specs-box">
            <div>Jumlah: <strong>${item.qty} Lembar / Foto</strong></div>
            ${item.paperType ? `<div>Kertas/Jilid: <strong>${item.paperType}</strong></div>` : ''}
            ${item.notes ? `<div>Catatan: <em style="color:#FFA726;">"${item.notes}"</em></div>` : ''}
          </div>

          <div class="wa-card-footer">
            <div>
              <span style="font-size:0.7rem; color:var(--text-muted); display:block;">Estimasi Biaya:</span>
              <div class="wa-price-tag">${formatRupiah(item.estimatedPrice)}</div>
            </div>
            <div class="wa-action-buttons">
              ${item.status === "MENUNGGU" ? `
                <button class="btn-secondary-sm" style="padding:0.3rem 0.6rem; font-size:0.75rem; border-color:#00E5FF; color:#00E5FF;" onclick="updateWaQueueStatus('${item.id}', 'SEDANG_DICETAK')" title="Mulai proses cetak berkas ini">
                  🖨️ Cetak
                </button>
              ` : ''}

              ${item.status === "SEDANG_DICETAK" ? `
                <button class="btn-secondary-sm" style="padding:0.3rem 0.6rem; font-size:0.75rem; border-color:var(--success); color:var(--success);" onclick="updateWaQueueStatus('${item.id}', 'SIAP_DIAMBIL')" title="Tandai cetak selesai dan siap diambil">
                  ✅ Tandai Siap
                </button>
              ` : ''}

              ${item.status === "SIAP_DIAMBIL" ? `
                <button class="btn-voice-caller" onclick="callVoiceQueue('${item.id}')" title="Panggil nama & nomor antrean dengan suara speaker toko">
                  📢 Panggil
                </button>
                ${(item.source === "Instagram" || (item.phone && item.phone.startsWith("@"))) ? `
                  <a href="https://www.instagram.com/copystarkubu?obrf=YnByeXZsYnozb3dt" target="_blank" class="btn-ig-notify" style="padding:0.3rem 0.6rem; font-size:0.75rem;" title="Buka Instagram untuk DM pelanggan">
                    📸 DM IG
                  </a>
                ` : `
                  <button class="btn-wa-notify" onclick="sendWaReadyNotification('${item.id}')" title="Kirim notifikasi via WhatsApp bahwa berkas sudah siap">
                    📲 Kabari WA
                  </button>
                `}
                <button class="btn-to-pos" onclick="transferWaOrderToCart('${item.id}')" title="Masukkan pesanan ini ke keranjang kasir (POS)">
                  🛒 Ke Kasir
                </button>
              ` : ''}

              ${item.status === "SELESAI" ? `
                <span style="font-size:0.75rem; color:var(--text-muted);">Sudah Masuk Kasir</span>
              ` : ''}

              <button class="btn-secondary-sm" style="padding:0.3rem 0.45rem; font-size:0.75rem; color:var(--danger);" onclick="deleteWaQueue('${item.id}')" title="Batalkan / hapus antrean ini">
                🗑️
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  ["waCardsContainer", "modalWaCardsContainer"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = cardsHtml;
  });
}

function filterWaStatus(status) {
  currentWaFilterStatus = status;
  ["btnFilterWaAll", "modalFilterWaAll"].forEach(id => document.getElementById(id)?.classList.toggle("active", status === "ALL"));
  ["btnFilterWaWaiting", "modalFilterWaWaiting"].forEach(id => document.getElementById(id)?.classList.toggle("active", status === "MENUNGGU"));
  ["btnFilterWaPrinting", "modalFilterWaPrinting"].forEach(id => document.getElementById(id)?.classList.toggle("active", status === "SEDANG_DICETAK"));
  ["btnFilterWaReady", "modalFilterWaReady"].forEach(id => document.getElementById(id)?.classList.toggle("active", status === "SIAP_DIAMBIL"));
  ["btnFilterWaDone", "modalFilterWaDone"].forEach(id => document.getElementById(id)?.classList.toggle("active", status === "SELESAI"));
  renderWaQueue();
}

function filterModalWaStatus(status) {
  filterWaStatus(status);
}

function handleWaSearch(val) {
  currentWaSearchQuery = val;
  const otherInput = document.getElementById("modalWaSearchInput");
  if (otherInput && otherInput.value !== val) otherInput.value = val;
  renderWaQueue();
}

function handleModalWaSearch(val) {
  currentWaSearchQuery = val;
  const otherInput = document.getElementById("waSearchInput");
  if (otherInput && otherInput.value !== val) otherInput.value = val;
  renderWaQueue();
}

function updateWaQueueStatus(id, newStatus) {
  const item = storeData.waQueue.find(w => w.id === id);
  if (!item) return;

  item.status = newStatus;
  saveStoreData(storeData);
  updateHeaderFeatureBadges();
  renderWaQueue();

  playBeep("success");

  if (newStatus === "SIAP_DIAMBIL") {
    showToast(`Pesanan ${item.id} selesai dicetak! Menyiapkan notifikasi WhatsApp... 📲`);
    setTimeout(() => {
      if (confirm(`Berkas ${item.senderName} sudah siap! Kirim notifikasi WhatsApp ke ${item.phone} sekarang?`)) {
        sendWaReadyNotification(id);
      }
    }, 400);
  } else {
    showToast(`Status pesanan ${item.id} diubah ke: ${newStatus}`);
  }
}

function sendWaReadyNotification(id) {
  const item = storeData.waQueue.find(w => w.id === id);
  if (!item) return;

  const cleanPhone = cleanPhoneNumberForWa(item.phone);
  if (!cleanPhone || cleanPhone.length < 8) {
    showToast("Nomor WhatsApp pelanggan tidak valid!");
    return;
  }

  const message = `Assalamu'alaikum / Halo Kak/Bpk/Ibu *${item.senderName}*,\n\n` +
    `Kabar baik! Berkas pesanan cetak Anda di *COPY STAR KUBU* SUDAH SELESAI & SIAP DIAMBIL di toko ya: ✨\n\n` +
    `📄 *Nama Berkas:* ${item.docTitle}\n` +
    `🖨️ *Layanan:* ${item.serviceType} (${item.qty} Lembar/Foto)\n` +
    `💵 *Total Biaya:* *${formatRupiah(item.estimatedPrice)}*\n` +
    (item.notes ? `📝 *Catatan:* ${item.notes}\n` : '') +
    `\nSilakan datang ke toko COPY STAR KUBU untuk mengambil berkas Anda. Terima kasih banyak! 🙏✨\n\n` +
    `*- COPY STAR KUBU -*\n` +
    `_Jln. Soeparto 1 Kubu, Desa Kubu, Kec. Kubu, Kabupaten Kubu Raya_`;

  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, "_blank");
  showToast(`Membuka WhatsApp untuk memberi tahu ${item.senderName}... 📲`);
}

function transferWaOrderToCart(id) {
  const item = storeData.waQueue.find(w => w.id === id);
  if (!item) return;

  const currentSession = getActiveSession();
  currentSession.items.push({
    productId: "PRD-" + item.id,
    name: `${item.serviceType} (${item.docTitle})`,
    qty: 1,
    price: item.estimatedPrice,
    basePrice: item.estimatedPrice,
    costPrice: Math.round(item.estimatedPrice * 0.35),
    isService: true,
    notes: `Pesanan WA: ${item.senderName} (${item.phone})`
  });

  if (currentSession.customer.name === "Pelanggan Umum") {
    currentSession.customer.name = item.senderName;
  }

  item.status = "SELESAI";
  saveStoreData(storeData);

  updateHeaderFeatureBadges();
  renderWaQueue();
  renderActiveCart();

  closeModal("waQueueModal");
  switchMainView("pos");

  playBeep("success");
  showToast(`Pesanan WA ${item.id} (${item.senderName}) berhasil dimasukkan ke keranjang kasir! 🛒`);
}

function deleteWaQueue(id) {
  if (!confirm(`Hapus antrean berkas ${id}?`)) return;
  storeData.waQueue = storeData.waQueue.filter(w => w.id !== id);
  saveStoreData(storeData);
  updateHeaderFeatureBadges();
  renderWaQueue();
  updateCustLiveQueueBadge();
  renderCustomerPublicQueue();
  showToast(`Antrean berkas ${id} berhasil dihapus.`);
}

/* ==========================================================================
   PORTAL ORDER PELANGGAN (CUSTOMER ORDER & WHATSAPP QUEUE)
   ========================================================================== */

let currentCustomerService = "fotokopi_bw";

function enterCustomerOrderPortal(fromUrl = false) {
  currentUser = {
    id: "CUST-ONLINE",
    username: "pelanggan",
    name: "Pelanggan Online",
    role: "CUSTOMER"
  };
  hideLoginOverlay();
  actuallySwitchMainView("customer");
  initCustomerPortal();
  playBeep("success");
  if (!fromUrl) {
    showToast("Selamat datang di Portal Order Mandiri COPY STAR KUBU! 🛍️");
  }
}

function initCustomerPortal() {
  updateCustLiveQueueBadge();
  calculateCustomerOrderPrice();
  renderCustomerPublicQueue();
  renderCustomerCatalogCategories();
  renderCustomerCatalog();
}

let activeCustomerCatalogCategory = "all";

function switchCustTab(tab) {
  const isForm = tab === "form";
  const isCatalog = tab === "catalog";
  const isQueue = tab === "queue";

  document.getElementById("btnCustTabForm")?.classList.toggle("active", isForm);
  document.getElementById("btnCustTabCatalog")?.classList.toggle("active", isCatalog);
  document.getElementById("btnCustTabQueue")?.classList.toggle("active", isQueue);

  const formSec = document.getElementById("custTabFormSection");
  const catalogSec = document.getElementById("custTabCatalogSection");
  const queueSec = document.getElementById("custTabQueueSection");

  if (formSec) formSec.style.display = isForm ? "block" : "none";
  if (catalogSec) {
    catalogSec.style.display = isCatalog ? "block" : "none";
    if (isCatalog) {
      renderCustomerCatalogCategories();
      renderCustomerCatalog();
    }
  }
  if (queueSec) {
    queueSec.style.display = isQueue ? "block" : "none";
    if (isQueue) renderCustomerPublicQueue();
  }
}

function renderCustomerCatalogCategories() {
  const container = document.getElementById("custCatalogCatContainer");
  if (!container || !storeData || !storeData.categories) return;

  const cats = [
    { id: "all", name: "✨ Semua Barang" },
    ...storeData.categories
  ];

  container.innerHTML = cats.map(cat => `
    <button type="button" class="cust-cat-pill ${cat.id === activeCustomerCatalogCategory ? 'active' : ''}" onclick="selectCustomerCatalogCategory('${cat.id}')">
      ${cat.name}
    </button>
  `).join("");
}

function selectCustomerCatalogCategory(catId) {
  activeCustomerCatalogCategory = catId;
  renderCustomerCatalogCategories();
  renderCustomerCatalog();
}

function renderCustomerCatalog() {
  const grid = document.getElementById("custCatalogGrid");
  if (!grid || !storeData || !storeData.products) return;

  const searchInput = document.getElementById("custCatalogSearchInput");
  const query = (searchInput?.value || "").toLowerCase().trim();

  const filtered = storeData.products.filter(item => {
    const matchCat = activeCustomerCatalogCategory === "all" || item.category === activeCustomerCatalogCategory;
    const matchQuery = !query ||
      item.name.toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query) ||
      (item.description && item.description.toLowerCase().includes(query));
    return matchCat && matchQuery;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem; color: var(--text-muted);">
        <p style="font-size: 1rem; margin-bottom: 0.5rem;">Tidak ada barang yang cocok dengan "${query || ''}"</p>
        <button type="button" class="btn-secondary-sm" onclick="document.getElementById('custCatalogSearchInput').value=''; activeCustomerCatalogCategory='all'; renderCustomerCatalogCategories(); renderCustomerCatalog();">Reset Pencarian</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(item => {
    const isService = Boolean(item.isService);
    const stockLabel = isService ? "Layanan Toko" : (item.stock > 0 ? `Tersedia (${item.stock} ${item.unit})` : "Stok Habis");
    const stockClass = isService ? "badge-service" : (item.stock > 0 ? "badge-stock" : "badge-stock low");
    const hasPhoto = Boolean(item.photo);

    return `
      <div class="cust-product-card">
        <div class="cust-product-img-box">
          <span class="badge-tag ${stockClass}" style="position:absolute; top:6px; left:6px; z-index:2; font-size:0.6rem;">${stockLabel}</span>
          ${hasPhoto ? `
            <img src="${item.photo}" alt="${item.name}" loading="lazy" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';">
            <div class="card-icon-preview" style="display:none; width:36px; height:36px;">${getProductIconSvg(item.image)}</div>
          ` : `
            <div class="card-icon-preview" style="width:36px; height:36px;">${getProductIconSvg(item.image)}</div>
          `}
        </div>

        <h4 class="cust-product-name" title="${item.name}">${item.name}</h4>

        <div class="cust-product-price-row">
          <div>
            <div class="cust-product-price">${formatRupiah(item.price)}</div>
            <small style="color:var(--text-muted); font-size:0.65rem;">/${item.unit}</small>
          </div>
          <button type="button" class="cust-btn-add" onclick="orderProductFromCustomerCatalog('${item.id}')" title="Pesan barang ini via WhatsApp">
            <span>+ Pesan</span>
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function orderProductFromCustomerCatalog(productId) {
  const item = storeData.products.find(p => p.id === productId);
  if (!item) return;

  // Catat juga ke form catatan jika pelanggan ingin gabung pesanan
  const notesField = document.getElementById("custOrderNotes");
  if (notesField) {
    const existing = notesField.value.trim();
    const addition = `+ Tambahan Pesanan Barang: ${item.name} (${formatRupiah(item.price)} / ${item.unit})`;
    notesField.value = existing ? `${existing}\n${addition}` : addition;
  }

  const phone = "6281253453440";
  const text = `Halo COPY STAR KUBU, saya ingin memesan barang berikut:\n\n🛍️ *${item.name}*\n🏷️ Harga: ${formatRupiah(item.price)} / ${item.unit}\n📦 Jumlah: 1 ${item.unit}\n\nMohon info ketersediaan stok & totalnya. Terima kasih!`;
  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

  playBeep("success");
  showToast(`Membuka WhatsApp untuk memesan ${item.name}...`);
  window.open(waUrl, "_blank");
}

function selectCustService(serviceKey) {
  currentCustomerService = serviceKey;
  document.querySelectorAll(".cust-service-card").forEach(c => {
    c.classList.toggle("active", c.getAttribute("data-service") === serviceKey);
  });

  const paperSelect = document.getElementById("custOrderPaper");
  const finishingSelect = document.getElementById("custOrderFinishing");
  const docTitleInput = document.getElementById("custOrderDocTitle");

  if (serviceKey === "fotokopi_bw") {
    if (paperSelect) paperSelect.value = "HVS A4 70gr";
    if (finishingSelect) finishingSelect.value = "none";
    if (docTitleInput && !docTitleInput.value) docTitleInput.placeholder = "Contoh: Fotokopi KTP & KK rangkap 5";
  } else if (serviceKey === "print_dokumen") {
    if (paperSelect) paperSelect.value = "HVS A4 80gr";
    if (docTitleInput && !docTitleInput.value) docTitleInput.placeholder = "Contoh: Skripsi_Bab_1_Sampai_4.pdf";
  } else if (serviceKey === "cetak_foto") {
    if (paperSelect) paperSelect.value = "Kertas Foto Glossy 230g";
    if (finishingSelect) finishingSelect.value = "potong_rapi";
    if (docTitleInput && !docTitleInput.value) docTitleInput.placeholder = "Contoh: Pas Foto 3x4 (Background Merah) 6 lembar";
  } else if (serviceKey === "jilid_buku") {
    if (finishingSelect) finishingSelect.value = "lakban_mika";
    if (docTitleInput && !docTitleInput.value) docTitleInput.placeholder = "Contoh: Jilid Mika Laporan PKL 50 Halaman";
  } else if (serviceKey === "sertifikat_undangan") {
    if (paperSelect) paperSelect.value = "Kertas Linen Sertifikat";
    if (docTitleInput && !docTitleInput.value) docTitleInput.placeholder = "Contoh: Cetak Piagam Penghargaan Lomba Desa";
  } else if (serviceKey === "atk_kertas") {
    if (docTitleInput && !docTitleInput.value) docTitleInput.placeholder = "Contoh: Beli Kertas HVS PaperOne A4 1 Rim & Map Plastik 2 pcs";
  }

  calculateCustomerOrderPrice();
}

function changeCustQty(delta) {
  const qtyInput = document.getElementById("custOrderQty");
  if (!qtyInput) return;
  let val = (parseInt(qtyInput.value) || 1) + delta;
  if (val < 1) val = 1;
  qtyInput.value = val;
  calculateCustomerOrderPrice();
}

function calculateCustomerOrderPrice() {
  const qtyInput = document.getElementById("custOrderQty");
  const qty = Math.max(1, parseInt(qtyInput ? qtyInput.value : 10) || 1);
  const paperSelect = document.getElementById("custOrderPaper");
  const finishingSelect = document.getElementById("custOrderFinishing");
  const duplexSelect = document.getElementById("custOrderDuplex");
  const isDuplex = duplexSelect && duplexSelect.value === "bolak_balik";

  let unitBasePrice = 400; // default Fotokopi
  let serviceTitle = "📄 Fotokopi B/W (Hitam Putih)";

  if (currentCustomerService === "fotokopi_bw") {
    serviceTitle = "📄 Fotokopi B/W (Hitam Putih)";
    if (qty >= 100) unitBasePrice = 250;
    else if (qty >= 50) unitBasePrice = 300;
    else if (qty >= 10) unitBasePrice = 400;
    else unitBasePrice = 500;
  } else if (currentCustomerService === "print_dokumen") {
    serviceTitle = "🖨️ Print Dokumen & Skripsi";
    unitBasePrice = 1000;
  } else if (currentCustomerService === "cetak_foto") {
    serviceTitle = "🖼️ Pas Foto & Cetak Foto Glossy";
    unitBasePrice = 2500;
  } else if (currentCustomerService === "jilid_buku") {
    serviceTitle = "📚 Jilid & Finishing Dokumen";
    unitBasePrice = 300;
  } else if (currentCustomerService === "sertifikat_undangan") {
    serviceTitle = "🎖️ Cetak Sertifikat & Undangan";
    unitBasePrice = 8000;
  } else if (currentCustomerService === "atk_kertas") {
    serviceTitle = "📦 Pembelian Kertas Rim & ATK";
    unitBasePrice = 45000;
  }

  // Paper add-on
  let paperExtra = 0;
  if (paperSelect) {
    const selectedOpt = paperSelect.options[paperSelect.selectedIndex];
    paperExtra = parseFloat(selectedOpt?.getAttribute("data-price") || 0);
  }

  // Finishing add-on
  let finishingCost = 0;
  let finishingName = "Tanpa Jilid";
  if (finishingSelect) {
    const selectedOpt = finishingSelect.options[finishingSelect.selectedIndex];
    finishingCost = parseFloat(selectedOpt?.getAttribute("data-cost") || 0);
    finishingName = selectedOpt?.text || "Finishing";
  }

  // Duplex factor for paper count
  let effectivePaperQty = isDuplex ? Math.ceil(qty / 2) : qty;
  let baseTotal = qty * unitBasePrice;
  let paperTotal = effectivePaperQty * paperExtra;
  let grandTotal = baseTotal + paperTotal + finishingCost;

  // Update DOM elements
  const titleEl = document.getElementById("custEstimateServiceTitle");
  if (titleEl) titleEl.textContent = serviceTitle;

  const qtyLabel = document.getElementById("custEstimateQtyLabel");
  const baseSubtotalEl = document.getElementById("custEstimateBaseSubtotal");
  if (qtyLabel) qtyLabel.textContent = `${qty} Lembar/Pcs x ${formatRupiah(unitBasePrice)}`;
  if (baseSubtotalEl) baseSubtotalEl.textContent = formatRupiah(baseTotal);

  const paperRow = document.getElementById("custEstimatePaperRow");
  const paperLabel = document.getElementById("custEstimatePaperLabel");
  const paperSubtotalEl = document.getElementById("custEstimatePaperSubtotal");
  if (paperRow) {
    if (paperTotal > 0) {
      paperRow.style.display = "flex";
      if (paperLabel) paperLabel.textContent = `Tambahan Kertas (${paperSelect?.value})`;
      if (paperSubtotalEl) paperSubtotalEl.textContent = formatRupiah(paperTotal);
    } else {
      paperRow.style.display = "none";
    }
  }

  const finishingRow = document.getElementById("custEstimateFinishingRow");
  const finishingLabel = document.getElementById("custEstimateFinishingLabel");
  const finishingSubtotalEl = document.getElementById("custEstimateFinishingSubtotal");
  if (finishingRow) {
    if (finishingCost > 0) {
      finishingRow.style.display = "flex";
      if (finishingLabel) finishingLabel.textContent = finishingName;
      if (finishingSubtotalEl) finishingSubtotalEl.textContent = formatRupiah(finishingCost);
    } else {
      finishingRow.style.display = "none";
    }
  }

  const grandTotalEl = document.getElementById("custEstimateGrandTotal");
  if (grandTotalEl) grandTotalEl.textContent = formatRupiah(grandTotal);

  return { grandTotal, unitBasePrice, baseTotal, paperTotal, finishingCost, serviceTitle };
}

function submitCustomerOnlineOrder() {
  const name = (document.getElementById("custOrderName")?.value || "").trim();
  const phone = (document.getElementById("custOrderPhone")?.value || "").trim();
  const docTitle = (document.getElementById("custOrderDocTitle")?.value || "").trim();
  const qty = parseInt(document.getElementById("custOrderQty")?.value || 10) || 1;
  const paperType = document.getElementById("custOrderPaper")?.value || "HVS A4 70gr";
  const duplex = document.getElementById("custOrderDuplex")?.value === "bolak_balik" ? "Bolak-Balik (2 Sisi)" : "1 Sisi";
  const finishingSelect = document.getElementById("custOrderFinishing");
  const finishingText = finishingSelect ? finishingSelect.options[finishingSelect.selectedIndex].text : "Tanpa Jilid";
  const notes = (document.getElementById("custOrderNotes")?.value || "").trim();
  const urgent = document.getElementById("custOrderUrgent")?.checked || false;

  if (!name) {
    alert("Silakan masukkan Nama Lengkap Anda!");
    document.getElementById("custOrderName")?.focus();
    return;
  }
  if (!phone) {
    alert("Silakan masukkan Nomor WhatsApp aktif Anda!");
    document.getElementById("custOrderPhone")?.focus();
    return;
  }
  if (!docTitle) {
    alert("Silakan isi Judul Berkas atau Nama Dokumen / Pesanan Anda!");
    document.getElementById("custOrderDocTitle")?.focus();
    return;
  }

  const calc = calculateCustomerOrderPrice();
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  // Sequential Queue ID
  const newQueueNum = 200 + (storeData.waQueue || []).length + 1;
  const newId = "WA-" + newQueueNum;

  const newOrder = {
    id: newId,
    source: "Portal Pelanggan",
    senderName: name,
    phone: phone,
    serviceType: calc.serviceTitle.replace(/^[^\w\s]+/, '').trim(),
    docTitle: docTitle,
    qty: qty,
    paperType: `${paperType} | ${duplex} | ${finishingText}`,
    notes: notes || "Pesanan mandiri dari Portal Pelanggan",
    estimatedPrice: calc.grandTotal,
    status: "MENUNGGU",
    createdAt: timeStr,
    urgent: urgent
  };

  if (!storeData.waQueue) storeData.waQueue = [];
  storeData.waQueue.unshift(newOrder);
  saveStoreData(storeData);

  // Update header badges & queue cards for cashier/owner
  updateHeaderFeatureBadges();
  renderWaQueue();
  updateCustLiveQueueBadge();
  renderCustomerPublicQueue();

  // Prepare WhatsApp message
  const waNumber = (storeData.storeInfo && storeData.storeInfo.waNumber) || "6281253453440";
  const waMsg = 
`Halo COPY STAR KUBU, saya mau order cetak/berkas:
━━━━━━━━━━━━━━━━━━━
🔖 *NO. ANTREAN: ${newId}*
👤 *Nama:* ${name}
📱 *WhatsApp:* ${phone}
🛠️ *Layanan:* ${calc.serviceTitle}
📄 *Judul/Berkas:* ${docTitle}
🔢 *Jumlah:* ${qty} Lembar / Pcs
📑 *Kertas:* ${paperType} (${duplex})
📚 *Finishing:* ${finishingText}
⚡ *Prioritas:* ${urgent ? "🚨 URGENT / BUTUH CEPAT" : "Standar"}
${notes ? `📝 *Catatan:* ${notes}\n` : ""}💰 *Estimasi Biaya:* ${formatRupiah(calc.grandTotal)}
━━━━━━━━━━━━━━━━━━━
File berkas saya lampirkan di chat ini. Mohon diproses sesuai antrean, terima kasih!`;

  const waUrl = `https://wa.me/${cleanPhoneNumberForWa(waNumber)}?text=${encodeURIComponent(waMsg)}`;

  // Display Digital Ticket
  const ticketModal = document.getElementById("custTicketModal");
  if (ticketModal) {
    document.getElementById("ticketNumberDisplay").textContent = newId;
    document.getElementById("ticketNameDisplay").textContent = name;
    document.getElementById("ticketDocDisplay").textContent = `${docTitle} (${qty} lbr)`;
    document.getElementById("ticketPriceDisplay").textContent = formatRupiah(calc.grandTotal);
    document.getElementById("ticketTimeDisplay").textContent = `${timeStr} WIB`;
    
    // Count how many orders are waiting ahead
    const waitingAhead = storeData.waQueue.filter(w => w.status === "MENUNGGU" && w.id !== newId).length;
    document.getElementById("ticketWaitDisplay").textContent = waitingAhead > 0 
      ? `Ada ${waitingAhead} antrean lain di depan Anda (~${waitingAhead * 5 + 5} menit)`
      : `Anda berada di urutan pertama! Langsung diproses kasir.`;

    const ticketWaBtn = document.getElementById("ticketWaLink");
    if (ticketWaBtn) ticketWaBtn.href = waUrl;

    ticketModal.style.display = "flex";
  }

  // Open WhatsApp in new tab automatically
  window.open(waUrl, "_blank");

  playBeep("success");
  if (typeof triggerConfetti === "function") triggerConfetti();
  showToast(`Nomor Antrean Anda: ${newId}! Berhasil dikirim ke WhatsApp toko.`);
}

function renderCustomerPublicQueue() {
  const container = document.getElementById("custPublicQueueGrid");
  if (!container) return;

  const queue = (storeData.waQueue || []).filter(w => w.status !== "SELESAI");
  updateCustLiveQueueBadge();

  if (queue.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align:center; padding:3rem; color:var(--text-muted); background:var(--bg-surface-elevated); border:1px dashed var(--border-color); border-radius:12px;">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom:0.75rem; color:var(--success);">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <h4 style="font-size:1.1rem; color:var(--text-main); margin-bottom:0.25rem;">Tidak Ada Antrean Menumpuk!</h4>
        <p style="margin:0; font-size:0.88rem;">Mesin fotokopi & printer sedang santai. Order Anda akan langsung diproses tanpa menunggu lama!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = queue.map((item, index) => {
    let statusClass = "badge-wa-waiting";
    let statusText = "⏳ Menunggu";
    if (item.status === "SEDANG_DICETAK") {
      statusClass = "badge-wa-printing";
      statusText = "🖨️ Sedang Dicetak";
    } else if (item.status === "SIAP_DIAMBIL") {
      statusClass = "badge-wa-ready";
      statusText = "✅ Siap Diambil";
    }

    // Mask name for privacy (e.g. "Budi S***")
    const nameParts = (item.senderName || "").split(" ");
    let maskedName = nameParts[0];
    if (nameParts.length > 1) {
      maskedName += " " + nameParts[1].charAt(0) + "***";
    }

    return `
      <div class="cust-queue-card ${item.status.toLowerCase()} ${item.urgent ? 'urgent' : ''}">
        <div class="queue-card-top">
          <div class="queue-id-pill">
            <span class="queue-order-idx">#${index + 1}</span>
            <span class="queue-id-text">${item.id}</span>
          </div>
          <span class="${statusClass}">${statusText}</span>
        </div>
        <div class="queue-card-body">
          <h4 class="queue-cust-name">${maskedName}</h4>
          <div class="queue-service-title">${item.serviceType || 'Cetak Berkas'}</div>
          <div class="queue-doc-name">${item.docTitle}</div>
        </div>
        <div class="queue-card-bottom">
          <span class="queue-time">Masuk jam ${item.createdAt} WIB</span>
          ${item.urgent ? '<span class="queue-urgent-pill">⚡ PRIORITAS</span>' : ''}
        </div>
      </div>
    `;
  }).join("");
}

function updateCustLiveQueueBadge() {
  const count = (storeData.waQueue || []).filter(w => w.status !== "SELESAI").length;
  const countEl = document.getElementById("custLiveQueueCount");
  const tabCountEl = document.getElementById("custQueueTabCount");
  if (countEl) countEl.textContent = count;
  if (tabCountEl) tabCountEl.textContent = count;
}

function closeCustTicketModal() {
  const modal = document.getElementById("custTicketModal");
  if (modal) modal.style.display = "none";
}

function resetCustomerOrderForm() {
  const form = document.getElementById("custOrderForm");
  if (form) form.reset();
  const qtyInput = document.getElementById("custOrderQty");
  if (qtyInput) qtyInput.value = "10";
  selectCustService("fotokopi_bw");
}

/* ==========================================================================
   FITUR 2: PANGGILAN SUARA ANTREAN OTOMATIS (WEB SPEECH API)
   ========================================================================== */
function speakIndonesian(text, onEnd) {
  if (!('speechSynthesis' in window)) {
    showToast("Fitur suara browser tidak didukung di perangkat ini.");
    return;
  }
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.93;
    utterance.pitch = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find(v => v.lang.includes('id') || v.lang.includes('ID') || v.name.toLowerCase().includes('indonesia'));
    if (idVoice) utterance.voice = idVoice;

    if (typeof onEnd === 'function') utterance.onend = onEnd;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.error("SpeechSynthesis error:", e);
  }
}

function callVoiceQueue(id) {
  const item = (storeData.waQueue || []).find(q => q.id === id);
  if (!item) {
    showToast("Data antrean tidak ditemukan.");
    return;
  }
  
  // Format readable text for speech
  const cleanId = item.id.replace(/-/g, ' ');
  const text = `Panggilan antrean nomor ${cleanId}. Atas nama ${item.customerName}. Berkas pesanan cetak Anda sudah selesai dan siap diambil di meja kasir Copy Star Kubu. Terima kasih.`;
  
  playBeep("success");
  showToast(`📢 Memanggil suara: ${item.id} - ${item.customerName}...`);
  speakIndonesian(text);
}

/* ==========================================================================
   FITUR 3: UPLOAD BERKAS & PENDETEKSI JUMLAH HALAMAN PDF (CLIENT-SIDE)
   ========================================================================== */
function countPdfPagesFromBuffer(buffer) {
  try {
    const bytes = new Uint8Array(buffer);
    const maxScanLen = Math.min(bytes.length, 2500000);
    const textChunk = new TextDecoder('latin1').decode(bytes.subarray(0, maxScanLen));

    // Pola 1: /Type /Pages ... /Count N (standar PDF root dictionary)
    const countMatches = [...textChunk.matchAll(/\/Type\s*\/Pages[^>]*\/Count\s+(\d+)/gi)];
    if (countMatches.length > 0) {
      let maxCount = 0;
      for (const m of countMatches) {
        const val = parseInt(m[1], 10);
        if (!isNaN(val) && val > maxCount) maxCount = val;
      }
      if (maxCount > 0) return maxCount;
    }

    // Pola 2: /Count N yang berdiri sendiri
    const standaloneCountMatches = [...textChunk.matchAll(/\/Count\s+(\d+)/gi)];
    if (standaloneCountMatches.length > 0) {
      let maxCount = 0;
      for (const m of standaloneCountMatches) {
        const val = parseInt(m[1], 10);
        if (!isNaN(val) && val > maxCount) maxCount = val;
      }
      if (maxCount > 0 && maxCount < 20000) return maxCount;
    }

    // Pola 3: Hitung kemunculan objek halaman individu: /Type /Page
    const pageObjMatches = textChunk.match(/\/Type\s*\/Page\b/g);
    if (pageObjMatches && pageObjMatches.length > 0) {
      return pageObjMatches.length;
    }
  } catch (err) {
    console.warn("Gagal parse PDF buffer:", err);
  }
  return 1;
}

function handleCustPdfSelected(files) {
  if (!files || files.length === 0) return;
  const file = files[0];
  const titleInput = document.getElementById("custOrderDocTitle");
  const qtyInput = document.getElementById("custOrderQty");
  const statusBadge = document.getElementById("custPdfStatus");

  if (titleInput && (!titleInput.value || titleInput.value.trim() === "")) {
    titleInput.value = file.name;
  }

  if (file.name.toLowerCase().endsWith(".pdf")) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const pageCount = countPdfPagesFromBuffer(e.target.result);
      if (qtyInput) {
        qtyInput.value = pageCount;
        if (typeof calculateCustomerOrderPrice === 'function') calculateCustomerOrderPrice();
      }
      if (statusBadge) {
        statusBadge.style.display = "block";
        statusBadge.innerHTML = `✅ <strong>${file.name}</strong> berhasil dibaca: <strong>${pageCount} Halaman</strong> (Qty & estimasi harga otomatis diperbarui!)`;
      }
      playBeep("beep");
      showToast(`📄 PDF terdeteksi: ${pageCount} halaman!`);
    };
    reader.readAsArrayBuffer(file);
  } else {
    if (statusBadge) {
      statusBadge.style.display = "block";
      statusBadge.innerHTML = `✅ Berkas terpilih: <strong>${file.name}</strong> (${(file.size / 1024).toFixed(1)} KB)`;
    }
    showToast(`📁 Berkas ${file.name} berhasil dipilih.`);
  }
}

function handlePosPdfSelected(files) {
  if (!files || files.length === 0) return;
  const file = files[0];
  const qtyInput = document.getElementById("calcQty");
  const badgeEl = document.getElementById("posPdfPageBadge");
  const filenameText = document.getElementById("posPdfFilenameText");

  if (filenameText) filenameText.textContent = file.name;

  if (file.name.toLowerCase().endsWith(".pdf")) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const pageCount = countPdfPagesFromBuffer(e.target.result);
      if (qtyInput) {
        qtyInput.value = pageCount;
        if (typeof updateCalcPreview === 'function') updateCalcPreview();
      }
      if (badgeEl) {
        badgeEl.style.display = "inline-block";
        badgeEl.textContent = `${pageCount} Hal`;
      }
      playBeep("beep");
      showToast(`✅ PDF terdeteksi: ${pageCount} halaman`);
    };
    reader.readAsArrayBuffer(file);
  } else {
    showToast(`File dipilih: ${file.name}`);
  }
}

/* ==========================================================================
   QUICK SHORTCUTS TO DEDICATED SERVICE DASHBOARDS
   ========================================================================== */
function openPasFotoModal() {
  switchMainView('pasfoto');
}

function openBannerUndanganModal() {
  switchMainView('banner');
}

function addCurrentBuToCart() {
  const panelBanner = document.getElementById('buPanelBanner');
  if (panelBanner && panelBanner.style.display !== 'none') {
    addBannerToCart();
  } else {
    addUndanganToCart();
  }
}

/* ==========================================================================
   FITUR 6: CADANGKAN & PULIHKAN DATA TOKO (BACKUP & RESTORE JSON)
   ========================================================================== */
let pendingRestoreData = null;

function openBackupRestoreModal() {
  const txCount = storeData.transactions ? storeData.transactions.length : 0;
  const debtCount = storeData.debts ? storeData.debts.length : 0;
  const queueCount = storeData.waQueue ? storeData.waQueue.length : 0;
  const prodCount = storeData.products ? storeData.products.length : 0;

  const statTx = document.getElementById("bkpStatTx");
  const statDebt = document.getElementById("bkpStatDebt");
  const statQueue = document.getElementById("bkpStatQueue");
  const statProd = document.getElementById("bkpStatProd");

  if (statTx) statTx.textContent = `📦 Transaksi: ${txCount}`;
  if (statDebt) statDebt.textContent = `📒 Kasbon: ${debtCount}`;
  if (statQueue) statQueue.textContent = `⏳ Antrean: ${queueCount}`;
  if (statProd) statProd.textContent = `🏷️ Produk: ${prodCount}`;

  const previewBox = document.getElementById("restorePreviewBox");
  if (previewBox) previewBox.style.display = "none";
  const fileNameDisp = document.getElementById("restoreFileNameDisplay");
  if (fileNameDisp) fileNameDisp.textContent = "Klik untuk pilih file cadangan (.json)...";
  pendingRestoreData = null;

  openModal('backupRestoreModal');
}

function exportStoreBackupJson() {
  const now = new Date();
  const dateStr = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const backupPayload = {
    app: "COPY STAR KUBU POS & FOTOKOPI",
    version: "2.5",
    exportedAt: now.toISOString(),
    storeInfo: storeData.storeInfo || {},
    data: storeData
  };

  const jsonStr = JSON.stringify(backupPayload, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `copy_star_kubu_backup_${dateStr}.json`;
  a.click();
  URL.revokeObjectURL(url);

  playBeep("success");
  showToast("File cadangan database toko berhasil diunduh!");
}

function handleRestoreFileUpload(files) {
  if (!files || files.length === 0) return;
  const file = files[0];
  const fileNameDisp = document.getElementById("restoreFileNameDisplay");
  if (fileNameDisp) fileNameDisp.textContent = file.name;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      const data = parsed.data || parsed;

      if (!data.products && !data.transactions && !data.debts && !data.waQueue) {
        throw new Error("Format file cadangan tidak sesuai");
      }

      pendingRestoreData = data;
      const previewBox = document.getElementById("restorePreviewBox");
      const detailsText = document.getElementById("restoreDetailsText");

      if (previewBox && detailsText) {
        previewBox.style.display = "block";
        detailsText.innerHTML = `
          • Transaksi: <strong>${data.transactions ? data.transactions.length : 0} item</strong><br>
          • Buku Kasbon: <strong>${data.debts ? data.debts.length : 0} catatan</strong><br>
          • Antrean Berkas: <strong>${data.waQueue ? data.waQueue.length : 0} berkas</strong><br>
          • Daftar Produk/Layanan: <strong>${data.products ? data.products.length : 0} item</strong><br>
          • Tanggal Backup: <em>${parsed.exportedAt ? new Date(parsed.exportedAt).toLocaleString('id-ID') : 'Terdeteksi valid'}</em>
        `;
      }
      playBeep("beep");
      showToast("File cadangan valid! Pilih opsi pemulihan di bawah.");
    } catch (err) {
      console.error(err);
      showToast("Gagal membaca file: format JSON tidak valid.");
    }
  };
  reader.readAsText(file);
}

function applyRestoreData(mode) {
  if (!pendingRestoreData) {
    showToast("Pilih file cadangan terlebih dahulu.");
    return;
  }

  if (mode === 'replace') {
    if (!confirm("⚠️ PERINGATAN: Opsi Timpa Total akan MENGGANTI seluruh data saat ini dengan data dari file cadangan. Lanjutkan?")) {
      return;
    }
    storeData = pendingRestoreData;
  } else {
    // Mode Merge
    if (!confirm("Gabungkan data dari file cadangan dengan data saat ini?")) return;
    
    // Gabungkan transaksi
    if (Array.isArray(pendingRestoreData.transactions)) {
      const existingIds = new Set((storeData.transactions || []).map(t => t.id));
      pendingRestoreData.transactions.forEach(t => {
        if (!existingIds.has(t.id)) storeData.transactions.push(t);
      });
    }

    // Gabungkan kasbon
    if (Array.isArray(pendingRestoreData.debts)) {
      const existingDebtIds = new Set((storeData.debts || []).map(d => d.id));
      pendingRestoreData.debts.forEach(d => {
        if (!existingDebtIds.has(d.id)) storeData.debts.push(d);
      });
    }

    // Gabungkan antrean WA
    if (Array.isArray(pendingRestoreData.waQueue)) {
      const existingQueueIds = new Set((storeData.waQueue || []).map(q => q.id));
      pendingRestoreData.waQueue.forEach(q => {
        if (!existingQueueIds.has(q.id)) storeData.waQueue.push(q);
      });
    }
  }

  // Simpan ke localStorage
  if (typeof saveStoreData === 'function') {
    saveStoreData(storeData);
  } else {
    localStorage.setItem("COPY_STAR_KUBU_DATA", JSON.stringify(storeData));
  }

  // Refresh semua tampilan
  if (typeof renderProducts === 'function') renderProducts();
  if (typeof renderTransactions === 'function') renderTransactions();
  if (typeof renderKasbonTable === 'function') renderKasbonTable();
  if (typeof renderWaQueue === 'function') renderWaQueue();
  if (typeof updateDashboard === 'function') updateDashboard();
  if (typeof updateHeaderFeatureBadges === 'function') updateHeaderFeatureBadges();

  closeModal('backupRestoreModal');
  playBeep("success");
  if (typeof triggerConfetti === 'function') triggerConfetti();
  showToast(`✅ Data toko berhasil dipulihkan (${mode === 'replace' ? 'Timpa Total' : 'Digabungkan'})!`);
}

/* ==========================================================================
   FEATURE: DASBOR KALKULATOR PRINT & FOTOKOPI (DEDICATED VIEW)
   ========================================================================== */
function syncDashboardPrintCalc() {
  const serviceKey = document.getElementById("dbCalcServiceType")?.value || "copy_bw";
  const paper = document.getElementById("dbCalcPaperType")?.value || "hvs70";
  const duplex = document.getElementById("dbCalcDuplex")?.value || "simplex";
  const qty = Math.max(1, parseInt(document.getElementById("dbCalcQty")?.value) || 1);
  const finishing = document.getElementById("dbCalcFinishing")?.value || "none";

  const tiers = (storeData.printTiers && storeData.printTiers[serviceKey]) || [
    { min: 1, max: 20, price: 500, label: "1-20 Lbr (Rp 500)" },
    { min: 21, max: 100, price: 400, label: "21-100 Lbr (Rp 400)" },
    { min: 101, max: 500, price: 300, label: "101-500 Lbr (Rp 300)" },
    { min: 501, max: 999999, price: 250, label: ">500 Lbr (Rp 250)" }
  ];

  let baseRate = 500;
  let activeTier = tiers[0];
  tiers.forEach(t => {
    if (qty >= t.min && qty <= t.max) {
      activeTier = t;
      baseRate = t.price;
    }
  });

  let extraPaperCost = 0;
  if (paper === "hvs80") extraPaperCost = 100;
  else if (paper === "buffalo") extraPaperCost = 1000;
  else if (paper === "glossy") extraPaperCost = 2000;

  let finishingCost = 0;
  if (finishing === "lakban") finishingCost = 4000;
  else if (finishing === "spiral") finishingCost = 8000;
  else if (finishing === "hardcover") finishingCost = 25000;
  else if (finishing === "laminating") finishingCost = 3000;

  const effectiveRatePerSheet = Math.round((baseRate + extraPaperCost) * (duplex === "duplex" ? 1.8 : 1.0));
  const printTotal = effectiveRatePerSheet * qty;
  const grandTotal = printTotal + finishingCost;

  const standardTierRate = tiers[0] ? tiers[0].price : baseRate;
  const standardTotal = ((standardTierRate + extraPaperCost) * (duplex === "duplex" ? 1.8 : 1.0)) * qty + finishingCost;
  const savings = Math.max(0, standardTotal - grandTotal);

  const rateTextEl = document.getElementById("dbCalcRatePerSheetText");
  if (rateTextEl) rateTextEl.textContent = `Tarif Aktif: ${formatRupiah(effectiveRatePerSheet)} / lembar`;

  const totalEl = document.getElementById("dbCalcTotalEstimate");
  if (totalEl) totalEl.textContent = formatRupiah(grandTotal);

  const saveTextEl = document.getElementById("dbCalcDiscountSaveText");
  if (saveTextEl) {
    if (savings > 0) {
      saveTextEl.style.display = "block";
      saveTextEl.textContent = `Hemat ${formatRupiah(savings)} karena pesanan banyak!`;
    } else {
      saveTextEl.style.display = "none";
    }
  }

  const badgesRow = document.getElementById("dbTierBadgesRow");
  if (badgesRow) {
    badgesRow.innerHTML = tiers.map(t => {
      const isCur = t === activeTier;
      return `<span class="tier-badge-pill ${isCur ? 'current-active' : ''}">${t.label}</span>`;
    }).join("");
  }
}

function adjustDashboardPrintQty(delta) {
  const qtyInput = document.getElementById("dbCalcQty");
  if (!qtyInput) return;
  const current = parseInt(qtyInput.value) || 1;
  qtyInput.value = Math.max(1, current + delta);
  syncDashboardPrintCalc();
}

function handleDashboardPdfSelected(files) {
  if (!files || files.length === 0) return;
  const file = files[0];
  const nameEl = document.getElementById("dbPosPdfFilenameText");
  const badgeEl = document.getElementById("dbPosPdfPageBadge");

  if (nameEl) nameEl.textContent = `📄 ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const text = e.target.result;
      const matches = text.match(/\/Type\s*\/Page\b/g);
      let pageCount = matches ? matches.length : 1;
      if (pageCount < 1) pageCount = 1;

      const qtyInput = document.getElementById("dbCalcQty");
      if (qtyInput) qtyInput.value = pageCount;
      if (badgeEl) {
        badgeEl.textContent = `${pageCount} Halaman`;
        badgeEl.style.display = "inline-block";
      }
      syncDashboardPrintCalc();
      playBeep("beep");
      showToast(`PDF berhasil dipindai: ${pageCount} halaman terdeteksi!`);
    } catch (err) {
      console.warn("PDF count fallback:", err);
      if (badgeEl) {
        badgeEl.textContent = `PDF Siap`;
        badgeEl.style.display = "inline-block";
      }
    }
  };
  reader.readAsBinaryString(file.slice(0, 500000));
}

function addCalculatedPrintToCartFromDashboard() {
  const serviceSelect = document.getElementById("dbCalcServiceType");
  const serviceName = serviceSelect ? serviceSelect.options[serviceSelect.selectedIndex].text : "Fotokopi B/W";
  const paperSelect = document.getElementById("dbCalcPaperType");
  const paperName = paperSelect ? paperSelect.options[paperSelect.selectedIndex].text.split('(')[0].trim() : "HVS 70gr";
  const duplex = (document.getElementById("dbCalcDuplex")?.value === "duplex") ? "Bolak-Balik" : "1 Sisi";
  const qty = Math.max(1, parseInt(document.getElementById("dbCalcQty")?.value) || 1);
  const finishingSelect = document.getElementById("dbCalcFinishing");
  const finishingVal = finishingSelect ? finishingSelect.value : "none";
  const finishingName = finishingSelect ? finishingSelect.options[finishingSelect.selectedIndex].text.split('(')[0].trim() : "Tanpa Jilid";

  const totalEstimateStr = document.getElementById("dbCalcTotalEstimate")?.textContent || "0";
  const totalAmount = parseInt(totalEstimateStr.replace(/[^0-9]/g, '')) || (500 * qty);
  const pricePerUnit = Math.round(totalAmount / qty);

  const currentSession = getActiveSession();
  currentSession.items.push({
    productId: "PRINT-CUSTOM-" + Date.now(),
    name: `${serviceName} (${qty} lbr)`,
    qty: qty,
    price: pricePerUnit,
    basePrice: pricePerUnit,
    costPrice: Math.round(pricePerUnit * 0.35),
    unit: "Lbr",
    isService: true,
    isCustomPrint: true,
    notes: `${paperName}, ${duplex}${finishingVal !== 'none' ? ', ' + finishingName : ''}`
  });

  playBeep("success");
  renderSessionTabs();
  renderActiveCart();
  showToast("Pesanan cetak berhasil ditambahkan ke keranjang kasir!");
  switchMainView("pos");
}

/* ==========================================================================
   FEATURE: DASBOR KELOLA & UBAH HARGA KATALOG
   ========================================================================== */
function initPriceManageDashboard() {
  const catSelect = document.getElementById("priceDashboardCategory");
  if (catSelect) {
    const cats = Array.from(new Set(storeData.products.map(p => p.category))).filter(Boolean);
    const curVal = catSelect.value || "ALL";
    catSelect.innerHTML = `<option value="ALL">Semua Kategori (${storeData.products.length})</option>` +
      cats.map(c => `<option value="${c}">${c}</option>`).join("");
    catSelect.value = curVal;
  }
  filterPriceManageDashboard();
}

function filterPriceManageDashboard() {
  const search = (document.getElementById("priceDashboardSearch")?.value || "").toLowerCase().trim();
  const cat = document.getElementById("priceDashboardCategory")?.value || "ALL";
  const tbody = document.getElementById("priceManageTableBody");
  if (!tbody) return;

  const filtered = storeData.products.filter(p => {
    const matchCat = cat === "ALL" || p.category === cat;
    const matchSearch = !search || 
      p.name.toLowerCase().includes(search) || 
      p.id.toLowerCase().includes(search) ||
      (p.barcode && p.barcode.toLowerCase().includes(search));
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding:2.5rem; color:var(--text-muted);">
          🔍 Tidak ada barang atau jasa yang cocok dengan pencarian / filter ini.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(p => {
    const cost = p.costPrice || 0;
    const price = p.price || 0;
    const marginPct = price > 0 ? Math.round(((price - cost) / price) * 100) : 0;
    let marginClass = "healthy";
    if (marginPct < 15) marginClass = "danger";
    else if (marginPct < 25) marginClass = "warning";

    return `
      <tr id="priceRow_${p.id}">
        <td><code style="font-size:0.78rem; color:var(--primary); font-weight:700;">${p.id}</code></td>
        <td>
          <div style="font-weight:600; color:var(--text-main); font-size:0.88rem;">${p.name}</div>
          <div style="font-size:0.74rem; color:var(--text-muted);">${p.unit ? 'Satuan: ' + p.unit : ''}</div>
        </td>
        <td><span class="category-badge-pill">${p.category || 'Lainnya'}</span></td>
        <td>
          <input type="number" class="price-tbl-input" id="tblCost_${p.id}" value="${cost}" min="0" step="100" oninput="updatePriceRowMargin('${p.id}')">
        </td>
        <td>
          <input type="number" class="price-tbl-input" id="tblPrice_${p.id}" value="${price}" min="0" step="100" oninput="updatePriceRowMargin('${p.id}')">
        </td>
        <td>
          <span class="margin-pill ${marginClass}" id="tblMargin_${p.id}">
            ${marginPct}%
          </span>
        </td>
        <td>
          <span style="font-size:0.82rem; font-weight:600; color:${p.isService ? 'var(--primary)' : 'var(--text-secondary)'};">
            ${p.isService ? 'Layanan' : (p.stock + ' ' + (p.unit || 'Pcs'))}
          </span>
        </td>
        <td style="text-align:center;">
          <button type="button" class="btn-tbl-save" onclick="saveSinglePriceRow('${p.id}')" title="Simpan harga barang ini">
            Simpan
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

function updatePriceRowMargin(productId) {
  const costInput = document.getElementById(`tblCost_${productId}`);
  const priceInput = document.getElementById(`tblPrice_${productId}`);
  const marginEl = document.getElementById(`tblMargin_${productId}`);
  if (!priceInput || !marginEl) return;

  const cost = parseFloat(costInput?.value) || 0;
  const price = parseFloat(priceInput.value) || 0;
  const marginPct = price > 0 ? Math.round(((price - cost) / price) * 100) : 0;

  marginEl.textContent = `${marginPct}%`;
  marginEl.className = "margin-pill " + (marginPct < 15 ? "danger" : (marginPct < 25 ? "warning" : "healthy"));
}

function saveSinglePriceRow(productId) {
  const prod = storeData.products.find(p => p.id === productId);
  if (!prod) return;

  const newCost = parseFloat(document.getElementById(`tblCost_${productId}`)?.value) || 0;
  const newPrice = parseFloat(document.getElementById(`tblPrice_${productId}`)?.value) || 0;

  if (newPrice <= 0) {
    showToast("Harga jual harus lebih besar dari Rp 0!");
    return;
  }

  prod.costPrice = newCost;
  prod.price = newPrice;
  saveStoreData(storeData);

  playBeep("success");
  if (typeof renderProducts === 'function') renderProducts();
  showToast(`✅ Harga untuk "${prod.name}" berhasil diperbarui jadi ${formatRupiah(newPrice)}!`);
}

function saveAllPriceDashboardChanges() {
  let updatedCount = 0;
  storeData.products.forEach(p => {
    const costInput = document.getElementById(`tblCost_${p.id}`);
    const priceInput = document.getElementById(`tblPrice_${p.id}`);
    if (priceInput && costInput) {
      const c = parseFloat(costInput.value) || 0;
      const pr = parseFloat(priceInput.value) || 0;
      if (pr > 0 && (p.price !== pr || p.costPrice !== c)) {
        p.price = pr;
        p.costPrice = c;
        updatedCount++;
      }
    }
  });

  saveStoreData(storeData);
  playBeep("success");
  if (typeof triggerConfetti === 'function') triggerConfetti();
  if (typeof renderProducts === 'function') renderProducts();
  showToast(`🎉 Berhasil menyimpan ${updatedCount} pembaruan harga ke database katalog!`);
}

/* ==========================================================================
   FEATURE: STUDIO PAS FOTO KILAT (PRO)
   ========================================================================== */
let pasFotoState = {
  img: null,
  ratioName: "3x4",
  ratioW: 3,
  ratioH: 4,
  bgColor: "#D32F2F",
  bgLabel: "Merah Resmi Kemendagri",
  zoom: 1.0,
  rotation: 0,
  panX: 0,
  panY: 0,
  isDragging: false,
  dragStartX: 0,
  dragStartY: 0
};

function initPasFotoStudio() {
  const canvas = document.getElementById("pasFotoCanvas");
  if (!canvas) return;

  if (!canvas.dataset.dragInitialized) {
    canvas.dataset.dragInitialized = "true";

    canvas.addEventListener("mousedown", (e) => {
      if (!pasFotoState.img) return;
      pasFotoState.isDragging = true;
      pasFotoState.dragStartX = e.clientX - pasFotoState.panX;
      pasFotoState.dragStartY = e.clientY - pasFotoState.panY;
      canvas.style.cursor = "grabbing";
    });

    window.addEventListener("mousemove", (e) => {
      if (!pasFotoState.isDragging) return;
      pasFotoState.panX = e.clientX - pasFotoState.dragStartX;
      pasFotoState.panY = e.clientY - pasFotoState.dragStartY;
      renderPasFotoCanvas();
    });

    window.addEventListener("mouseup", () => {
      if (pasFotoState.isDragging) {
        pasFotoState.isDragging = false;
        if (canvas) canvas.style.cursor = "grab";
      }
    });

    canvas.addEventListener("touchstart", (e) => {
      if (!pasFotoState.img || e.touches.length === 0) return;
      pasFotoState.isDragging = true;
      pasFotoState.dragStartX = e.touches[0].clientX - pasFotoState.panX;
      pasFotoState.dragStartY = e.touches[0].clientY - pasFotoState.panY;
    }, { passive: true });

    window.addEventListener("touchmove", (e) => {
      if (!pasFotoState.isDragging || e.touches.length === 0) return;
      pasFotoState.panX = e.touches[0].clientX - pasFotoState.dragStartX;
      pasFotoState.panY = e.touches[0].clientY - pasFotoState.dragStartY;
      renderPasFotoCanvas();
    }, { passive: true });

    window.addEventListener("touchend", () => {
      pasFotoState.isDragging = false;
    });
  }

  renderPasFotoCanvas();
  updatePasFotoSheetPreview();
}

function handlePasFotoFile(files) {
  if (!files || files.length === 0) return;
  const file = files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      pasFotoState.img = img;
      pasFotoState.zoom = 1.0;
      pasFotoState.rotation = 0;
      pasFotoState.panX = 0;
      pasFotoState.panY = 0;
      const zoomSlider = document.getElementById("pasFotoZoomSlider");
      if (zoomSlider) zoomSlider.value = 100;
      const zoomVal = document.getElementById("pasFotoZoomVal");
      if (zoomVal) zoomVal.textContent = "100%";

      const placeholder = document.getElementById("pasFotoEmptyPlaceholder");
      if (placeholder) placeholder.style.display = "none";

      renderPasFotoCanvas();
      updatePasFotoSheetPreview();
      playBeep("beep");
      showToast("Foto pelanggan berhasil dimuat! Geser atau sesuaikan zoom.");
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function setPasFotoRatio(ratioName, w, h) {
  pasFotoState.ratioName = ratioName;
  pasFotoState.ratioW = w;
  pasFotoState.ratioH = h;

  ["btnPfSize2x3", "btnPfSize3x4", "btnPfSize4x6"].forEach(id => {
    document.getElementById(id)?.classList.remove("active");
  });
  if (ratioName === "2x3") document.getElementById("btnPfSize2x3")?.classList.add("active");
  if (ratioName === "3x4") document.getElementById("btnPfSize3x4")?.classList.add("active");
  if (ratioName === "4x6") document.getElementById("btnPfSize4x6")?.classList.add("active");

  renderPasFotoCanvas();
  updatePasFotoSheetPreview();
}

function setPasFotoBgColor(color, label, element = null) {
  pasFotoState.bgColor = color;
  pasFotoState.bgLabel = label;
  const lbl = document.getElementById("currentBgLabel");
  if (lbl) lbl.textContent = label;

  document.querySelectorAll(".swatch-btn").forEach(btn => {
    btn.classList.remove("active");
    if (color === "original" && btn.classList.contains("original")) btn.classList.add("active");
    else if (color === "#D32F2F" && btn.classList.contains("red")) btn.classList.add("active");
    else if (color === "#0D47A1" && btn.classList.contains("blue")) btn.classList.add("active");
    else if (color === "#FFFFFF" && btn.classList.contains("white")) btn.classList.add("active");
    else if (color === "#FBC02D" && btn.classList.contains("yellow")) btn.classList.add("active");
  });
  if (element && element.classList) {
    element.classList.add("active");
  }
  renderPasFotoCanvas();
  updatePasFotoSheetPreview();
}

function onPasFotoZoomChange(val) {
  pasFotoState.zoom = parseInt(val) / 100;
  const valDisp = document.getElementById("pasFotoZoomVal");
  if (valDisp) valDisp.textContent = `${val}%`;
  renderPasFotoCanvas();
}

function rotatePasFoto(deltaDeg) {
  pasFotoState.rotation = (pasFotoState.rotation + deltaDeg) % 360;
  renderPasFotoCanvas();
  updatePasFotoSheetPreview();
}

function resetPasFotoTransform() {
  pasFotoState.zoom = 1.0;
  pasFotoState.rotation = 0;
  pasFotoState.panX = 0;
  pasFotoState.panY = 0;
  const zoomSlider = document.getElementById("pasFotoZoomSlider");
  if (zoomSlider) zoomSlider.value = 100;
  const zoomVal = document.getElementById("pasFotoZoomVal");
  if (zoomVal) zoomVal.textContent = "100%";
  renderPasFotoCanvas();
}

function renderPasFotoCanvas() {
  const canvas = document.getElementById("pasFotoCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const baseW = 600;
  const baseH = Math.round(baseW * (pasFotoState.ratioH / pasFotoState.ratioW));
  canvas.width = baseW;
  canvas.height = baseH;

  const placeholder = document.getElementById("pasFotoEmptyPlaceholder");
  if (!pasFotoState.img) {
    if (placeholder) placeholder.style.display = "flex";
    ctx.clearRect(0, 0, baseW, baseH);
    return;
  }
  if (placeholder) placeholder.style.display = "none";

  const autoRemoveBg = document.getElementById("chkAutoRemoveBg")?.checked;
  if (autoRemoveBg && pasFotoState.bgColor !== "original") {
    ctx.fillStyle = pasFotoState.bgColor;
    ctx.fillRect(0, 0, baseW, baseH);
  } else {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, baseW, baseH);
  }

  ctx.save();
  ctx.translate(baseW / 2 + pasFotoState.panX, baseH / 2 + pasFotoState.panY);
  ctx.rotate((pasFotoState.rotation * Math.PI) / 180);
  ctx.scale(pasFotoState.zoom, pasFotoState.zoom);

  const imgW = pasFotoState.img.width;
  const imgH = pasFotoState.img.height;
  const scale = Math.max(baseW / imgW, baseH / imgH);
  const drawW = imgW * scale;
  const drawH = imgH * scale;

  if (autoRemoveBg && pasFotoState.bgColor !== "original") {
    const offCanvas = document.createElement("canvas");
    offCanvas.width = drawW;
    offCanvas.height = drawH;
    const offCtx = offCanvas.getContext("2d");
    offCtx.drawImage(pasFotoState.img, 0, 0, drawW, drawH);

    try {
      const imgData = offCtx.getImageData(0, 0, drawW, drawH);
      const data = imgData.data;
      const sampleR = data[0], sampleG = data[1], sampleB = data[2];
      const tol = parseInt(document.getElementById("pfTolerance")?.value) || 45;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const dist = Math.sqrt(
          (r - sampleR) * (r - sampleR) +
          (g - sampleG) * (g - sampleG) +
          (b - sampleB) * (b - sampleB)
        );
        if (dist < tol * 1.5) {
          data[i + 3] = 0;
        }
      }
      offCtx.putImageData(imgData, 0, 0);
      ctx.drawImage(offCanvas, -drawW / 2, -drawH / 2, drawW, drawH);
    } catch (e) {
      ctx.drawImage(pasFotoState.img, -drawW / 2, -drawH / 2, drawW, drawH);
    }
  } else {
    ctx.drawImage(pasFotoState.img, -drawW / 2, -drawH / 2, drawW, drawH);
  }

  ctx.restore();
}

function updatePasFotoSheetPreview() {
  const sheetCanvas = document.getElementById("pasFotoSheetCanvas");
  if (!sheetCanvas) return;
  const ctx = sheetCanvas.getContext("2d");
  const pkg = document.getElementById("pasFotoPackageSelect")?.value || "campur";

  const w = 450;
  const h = 300;
  sheetCanvas.width = w;
  sheetCanvas.height = h;

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "#CCCCCC";
  ctx.lineWidth = 1;
  ctx.strokeRect(4, 4, w - 8, h - 8);

  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.font = "bold 9px sans-serif";
  ctx.fillText("COPY STAR KUBU · KERTAS FOTO GLOSSY 4R (10 x 15 cm)", 12, h - 10);

  const mainCanvas = document.getElementById("pasFotoCanvas");

  if (!pasFotoState.img || !mainCanvas) {
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.font = "italic 11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Muat foto untuk melihat tata letak cetak lembar 4R", w / 2, h / 2);
    return;
  }

  ctx.textAlign = "start";

  if (pkg === "campur") {
    const photoW_4x6 = 85;
    const photoH_4x6 = 125;
    ctx.drawImage(mainCanvas, 15, 15, photoW_4x6, photoH_4x6);
    ctx.drawImage(mainCanvas, 110, 15, photoW_4x6, photoH_4x6);

    const photoW_3x4 = 65;
    const photoH_3x4 = 86;
    ctx.drawImage(mainCanvas, 210, 15, photoW_3x4, photoH_3x4);
    ctx.drawImage(mainCanvas, 285, 15, photoW_3x4, photoH_3x4);
    ctx.drawImage(mainCanvas, 210, 110, photoW_3x4, photoH_3x4);
    ctx.drawImage(mainCanvas, 285, 110, photoW_3x4, photoH_3x4);

    const photoW_2x3 = 50;
    const photoH_2x3 = 75;
    ctx.drawImage(mainCanvas, 365, 15, photoW_2x3, photoH_2x3);
    ctx.drawImage(mainCanvas, 365, 100, photoW_2x3, photoH_2x3);

    ctx.strokeStyle = "rgba(0,0,0,0.25)";
    ctx.setLineDash([3, 3]);
    ctx.strokeRect(15, 15, photoW_4x6, photoH_4x6);
    ctx.strokeRect(110, 15, photoW_4x6, photoH_4x6);
    ctx.strokeRect(210, 15, photoW_3x4, photoH_3x4);
    ctx.strokeRect(285, 15, photoW_3x4, photoH_3x4);
    ctx.strokeRect(210, 110, photoW_3x4, photoH_3x4);
    ctx.strokeRect(285, 110, photoW_3x4, photoH_3x4);
    ctx.strokeRect(365, 15, photoW_2x3, photoH_2x3);
    ctx.strokeRect(365, 100, photoW_2x3, photoH_2x3);
    ctx.setLineDash([]);
  } else if (pkg === "full3x4") {
    const photoW = 75;
    const photoH = 100;
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 4; col++) {
        const x = 20 + col * (photoW + 15);
        const y = 15 + row * (photoH + 15);
        ctx.drawImage(mainCanvas, x, y, photoW, photoH);
        ctx.strokeStyle = "rgba(0,0,0,0.25)";
        ctx.strokeRect(x, y, photoW, photoH);
      }
    }
  } else if (pkg === "full4x6") {
    const photoW = 95;
    const photoH = 135;
    for (let col = 0; col < 4; col++) {
      const x = 18 + col * (photoW + 10);
      const y = 20;
      ctx.drawImage(mainCanvas, x, y, photoW, photoH);
      ctx.strokeStyle = "rgba(0,0,0,0.25)";
      ctx.strokeRect(x, y, photoW, photoH);
    }
  } else {
    ctx.drawImage(mainCanvas, (w - 120) / 2, (h - 160) / 2, 120, 160);
    ctx.strokeStyle = "rgba(0,0,0,0.25)";
    ctx.strokeRect((w - 120) / 2, (h - 160) / 2, 120, 160);
  }
}

function downloadPasFotoSingle() {
  const canvas = document.getElementById("pasFotoCanvas");
  if (!canvas || !pasFotoState.img) {
    showToast("Silakan muat foto pelanggan terlebih dahulu!");
    return;
  }
  const link = document.createElement("a");
  link.download = `pasfoto_${pasFotoState.ratioName}_copystarkubu_${Date.now()}.jpg`;
  link.href = canvas.toDataURL("image/jpeg", 0.95);
  link.click();
  playBeep("success");
  showToast(`Foto ukuran ${pasFotoState.ratioName} berhasil diunduh!`);
}

function printPasFotoSheet() {
  const sheetCanvas = document.getElementById("pasFotoSheetCanvas");
  if (!sheetCanvas || !pasFotoState.img) {
    showToast("Silakan muat foto pelanggan terlebih dahulu!");
    return;
  }
  const dataUrl = sheetCanvas.toDataURL("image/jpeg", 1.0);
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    showToast("Popup terblokir oleh browser. Izinkan popup untuk cetak.");
    return;
  }
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Cetak Lembar Pas Foto 4R - COPY STAR KUBU</title>
        <style>
          @page { size: 102mm 152mm; margin: 0; }
          body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: #fff; }
          img { width: 100mm; height: 150mm; object-fit: contain; }
        </style>
      </head>
      <body onload="window.print(); window.close();">
        <img src="${dataUrl}">
      </body>
    </html>
  `);
  printWindow.document.close();
}

function addPasFotoToCart() {
  const pkgSelect = document.getElementById("pasFotoPackageSelect");
  const pkgVal = pkgSelect?.value || "campur";
  const pkgText = pkgSelect ? pkgSelect.options[pkgSelect.selectedIndex].text.split('—')[0].trim() : "Paket Pas Foto 4R";
  const price = pkgVal === "digital" ? 5000 : 10000;

  const currentSession = getActiveSession();
  currentSession.items.push({
    productId: "PASFOTO-" + Date.now(),
    name: `Studio Pas Foto (${pasFotoState.ratioName.toUpperCase()} - ${pasFotoState.bgLabel})`,
    qty: 1,
    price: price,
    basePrice: price,
    costPrice: Math.round(price * 0.25),
    unit: "Paket",
    isService: true,
    notes: `${pkgText}, Cetak Kertas Foto Glossy 4R`
  });

  playBeep("success");
  renderSessionTabs();
  renderActiveCart();
  showToast("Layanan Pas Foto berhasil dimasukkan ke keranjang kasir!");
  switchMainView("pos");
}

/* ==========================================================================
   FEATURE: DASBOR SPANDUK / BANNER & UNDANGAN
   ========================================================================== */
function initBannerUndanganDashboard() {
  calculateBannerPrice();
  calculateUndanganPrice();
}

function switchBuTab(tab) {
  const btnBanner = document.getElementById("tabBtnBanner");
  const btnUndangan = document.getElementById("tabBtnUndangan");
  const panelBanner = document.getElementById("buPanelBanner");
  const panelUndangan = document.getElementById("buPanelUndangan");

  if (tab === "banner") {
    btnBanner?.classList.add("active");
    btnUndangan?.classList.remove("active");
    if (panelBanner) panelBanner.style.display = "block";
    if (panelUndangan) panelUndangan.style.display = "none";
    calculateBannerPrice();
  } else {
    btnBanner?.classList.remove("active");
    btnUndangan?.classList.add("active");
    if (panelBanner) panelBanner.style.display = "none";
    if (panelUndangan) panelUndangan.style.display = "block";
    calculateUndanganPrice();
  }
}

function calculateBannerPrice() {
  const len = Math.max(0.5, parseFloat(document.getElementById("bannerLength")?.value) || 3);
  const wid = Math.max(0.5, parseFloat(document.getElementById("bannerWidth")?.value) || 1);
  const qty = Math.max(1, parseInt(document.getElementById("bannerQty")?.value) || 1);

  const matSelect = document.getElementById("bannerMaterial");
  const matOption = matSelect?.options[matSelect.selectedIndex];
  const matPrice = matOption ? parseInt(matOption.getAttribute("data-price")) || 20000 : 20000;

  const finSelect = document.getElementById("bannerFinishing");
  const finOption = finSelect?.options[finSelect.selectedIndex];
  const finExtra = finOption ? parseInt(finOption.getAttribute("data-extra")) || 0 : 0;

  const standSelect = document.getElementById("bannerStand");
  const standOption = standSelect?.options[standSelect.selectedIndex];
  const standPrice = standOption ? parseInt(standOption.getAttribute("data-price")) || 0 : 0;

  const desSelect = document.getElementById("bannerDesign");
  const desOption = desSelect?.options[desSelect.selectedIndex];
  const desPrice = desOption ? parseInt(desOption.getAttribute("data-price")) || 0 : 0;

  const areaM2 = Math.max(1, Math.round(len * wid * 100) / 100);
  const baseCost = Math.round(areaM2 * matPrice);
  const addonCost = finExtra + standPrice + desPrice;
  const unitTotal = baseCost + addonCost;
  const grandTotal = unitTotal * qty;

  const areaDisp = document.getElementById("bannerAreaDisplay");
  if (areaDisp) areaDisp.textContent = `${len.toFixed(2)} m x ${wid.toFixed(2)} m = ${areaM2.toFixed(2)} m²`;

  const rateDisp = document.getElementById("bannerRateDisplay");
  if (rateDisp) rateDisp.textContent = `${formatRupiah(matPrice)} / m²`;

  const baseCostDisp = document.getElementById("bannerBaseCostDisplay");
  if (baseCostDisp) baseCostDisp.textContent = formatRupiah(baseCost);

  const addonDisp = document.getElementById("bannerAddonCostDisplay");
  if (addonDisp) addonDisp.textContent = formatRupiah(addonCost);

  const totalDisp = document.getElementById("bannerTotalDisplay");
  if (totalDisp) totalDisp.textContent = formatRupiah(grandTotal);

  return { len, wid, areaM2, qty, matPrice, baseCost, addonCost, grandTotal, unitTotal };
}

function addBannerToCart() {
  const calc = calculateBannerPrice();
  const matSelect = document.getElementById("bannerMaterial");
  const matName = matSelect?.options[matSelect.selectedIndex]?.text.split('(')[0].trim() || "Flexi Standar";
  const finSelect = document.getElementById("bannerFinishing");
  const finName = finSelect?.options[finSelect.selectedIndex]?.text.split('(')[0].trim() || "Mata Ayam";
  const standSelect = document.getElementById("bannerStand");
  const standName = standSelect?.options[standSelect.selectedIndex]?.text.split('(')[0].trim() || "Tanpa Rangka";

  const currentSession = getActiveSession();
  currentSession.items.push({
    productId: "BANNER-" + Date.now(),
    name: `Spanduk ${calc.len}x${calc.wid}m (${matName})`,
    qty: calc.qty,
    price: calc.unitTotal,
    basePrice: calc.unitTotal,
    costPrice: Math.round(calc.unitTotal * 0.45),
    unit: "Pcs",
    isService: true,
    notes: `${calc.areaM2} m², ${finName}, Stand: ${standName}`
  });

  playBeep("success");
  renderSessionTabs();
  renderActiveCart();
  showToast("Pesanan Spanduk / Banner berhasil dimasukkan ke keranjang kasir!");
  switchMainView("pos");
}

function copyBannerQuoteToWa() {
  const calc = calculateBannerPrice();
  const matText = document.getElementById("bannerMaterial")?.selectedOptions[0]?.text || "";
  const finText = document.getElementById("bannerFinishing")?.selectedOptions[0]?.text || "";
  const dp50 = Math.round(calc.grandTotal * 0.5);

  const quote = `*PENAWARAN CETAK SPANDUK / BANNER - COPY STAR KUBU*
📍 Alamat: Jln. Soeparto 1 Kubu, Desa Kubu, Kec. Kubu, Kab. Kubu Raya
📱 WhatsApp: +62 812-5345-3440

*Spesifikasi Pesanan:*
• Ukuran: ${calc.len} x ${calc.wid} Meter (${calc.areaM2} m²)
• Bahan: ${matText}
• Finishing: ${finText}
• Jumlah: ${calc.qty} Lembar

*Rincian Biaya:*
• Total Biaya: *${formatRupiah(calc.grandTotal)}*
• Uang Muka (DP 50%): *${formatRupiah(dp50)}*
• Sisa Pelunasan: ${formatRupiah(calc.grandTotal - dp50)}

Silakan konfirmasi pesanan via balasan pesan ini. Terima kasih! 🙏✨`;

  navigator.clipboard.writeText(quote).then(() => {
    playBeep("beep");
    showToast("📋 Rincian penawaran spanduk berhasil disalin ke clipboard!");
  }).catch(() => {
    prompt("Salin rincian penawaran WhatsApp di bawah:", quote);
  });
}

function calculateUndanganPrice() {
  const modelSelect = document.getElementById("undanganModel");
  const modelPrice = modelSelect ? parseInt(modelSelect.options[modelSelect.selectedIndex]?.getAttribute("data-price")) || 2500 : 2500;

  const paperSelect = document.getElementById("undanganPaper");
  const paperExtra = paperSelect ? parseInt(paperSelect.options[paperSelect.selectedIndex]?.getAttribute("data-extra")) || 0 : 0;

  const finSelect = document.getElementById("undanganFinishing");
  const finExtra = finSelect ? parseInt(finSelect.options[finSelect.selectedIndex]?.getAttribute("data-extra")) || 0 : 0;

  const qty = Math.max(50, parseInt(document.getElementById("undanganQty")?.value) || 200);

  const unitCost = modelPrice + paperExtra + finExtra;
  let discountPct = 0;
  if (qty >= 500) discountPct = 0.10;
  else if (qty >= 300) discountPct = 0.07;
  else if (qty >= 200) discountPct = 0.05;

  const subtotal = unitCost * qty;
  const discountNominal = Math.round(subtotal * discountPct);
  const grandTotal = subtotal - discountNominal;

  const unitDisp = document.getElementById("undanganUnitCostDisplay");
  if (unitDisp) unitDisp.textContent = `${formatRupiah(unitCost)} / pcs`;

  const qtyDisp = document.getElementById("undanganQtyDisplay");
  if (qtyDisp) qtyDisp.textContent = `${qty} pcs`;

  const discDisp = document.getElementById("undanganDiscountDisplay");
  if (discDisp) {
    if (discountPct > 0) {
      discDisp.textContent = `Diskon ${(discountPct * 100).toFixed(0)}% (-${formatRupiah(discountNominal)})`;
    } else {
      discDisp.textContent = "Diskon Grosir (min. 200 pcs)";
    }
  }

  const totalDisp = document.getElementById("undanganTotalDisplay");
  if (totalDisp) totalDisp.textContent = formatRupiah(grandTotal);

  return { qty, unitCost, discountPct, discountNominal, grandTotal };
}

function addUndanganToCart() {
  const calc = calculateUndanganPrice();
  const modelSelect = document.getElementById("undanganModel");
  const modelName = modelSelect?.options[modelSelect.selectedIndex]?.text.split('(')[0].trim() || "Undangan Softcover";
  const paperSelect = document.getElementById("undanganPaper");
  const paperName = paperSelect?.options[paperSelect.selectedIndex]?.text.split('(')[0].trim() || "Kertas BC";

  const effectiveUnitPrice = Math.round(calc.grandTotal / calc.qty);

  const currentSession = getActiveSession();
  currentSession.items.push({
    productId: "UNDANGAN-" + Date.now(),
    name: `Paket Cetak ${modelName} (${calc.qty} pcs)`,
    qty: calc.qty,
    price: effectiveUnitPrice,
    basePrice: effectiveUnitPrice,
    costPrice: Math.round(effectiveUnitPrice * 0.45),
    unit: "Pcs",
    isService: true,
    notes: `${paperName}, Termasuk Plastik OPP & Label Nama`
  });

  playBeep("success");
  renderSessionTabs();
  renderActiveCart();
  showToast("Paket Undangan berhasil dimasukkan ke keranjang kasir!");
  switchMainView("pos");
}

function copyUndanganQuoteToWa() {
  const calc = calculateUndanganPrice();
  const modelText = document.getElementById("undanganModel")?.selectedOptions[0]?.text || "";
  const paperText = document.getElementById("undanganPaper")?.selectedOptions[0]?.text || "";
  const dp50 = Math.round(calc.grandTotal * 0.5);

  const quote = `*PENAWARAN PAKET UNDANGAN - COPY STAR KUBU*
📍 Alamat: Jln. Soeparto 1 Kubu, Desa Kubu, Kec. Kubu, Kab. Kubu Raya
📱 WhatsApp: +62 812-5345-3440

*Spesifikasi Undangan:*
• Model: ${modelText}
• Bahan Kertas: ${paperText}
• Jumlah Cetak: ${calc.qty} Pcs
• Bonus: Plastik OPP + Label Tamu Undangan

*Rincian Biaya:*
• Biaya Satuan: ${formatRupiah(calc.unitCost)}/pcs
• Total Biaya: *${formatRupiah(calc.grandTotal)}*
• Uang Muka (DP 50%): *${formatRupiah(dp50)}*
• Sisa Pelunasan: ${formatRupiah(calc.grandTotal - dp50)}

Silakan konfirmasi pesanan via balasan pesan ini. Terima kasih! 🙏💌`;

  navigator.clipboard.writeText(quote).then(() => {
    playBeep("beep");
    showToast("📋 Rincian penawaran undangan berhasil disalin ke clipboard!");
  }).catch(() => {
    prompt("Salin rincian penawaran WhatsApp di bawah:", quote);
  });
}


