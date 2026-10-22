/**
 * COPY STAR KUBU - Mobile & Tablet UX Enhancement Engine
 * Menangani navigasi sentuh, Bottom Tab Bar, Floating Cart & Drawer di HP/Tablet
 */

(function () {
  // Current active mobile tab in POS: 'catalog' | 'cart'
  let currentPosMobileTab = 'catalog';

  /**
   * Beralih antara tab Katalog & Keranjang di layar HP
   * @param {'catalog' | 'cart'} tab
   */
  window.switchPosMobileTab = function (tab) {
    currentPosMobileTab = tab;
    const posLayout = document.querySelector('.pos-layout');
    const btnCatalog = document.getElementById('btnPosMobileCatalog');
    const btnCart = document.getElementById('btnPosMobileCart');

    if (!posLayout) return;

    if (tab === 'cart') {
      posLayout.classList.add('show-cart');
      if (btnCatalog) btnCatalog.classList.remove('active');
      if (btnCart) btnCart.classList.add('active');
      // Sembunyikan floating bar saat sedang berada di halaman keranjang
      const floatBar = document.getElementById('posMobileFloatingCart');
      if (floatBar) floatBar.classList.add('hidden');
    } else {
      posLayout.classList.remove('show-cart');
      if (btnCatalog) btnCatalog.classList.add('active');
      if (btnCart) btnCart.classList.remove('active');
      // Perbarui tampilan floating bar
      updateMobileFloatingCart();
    }
  };

  /**
   * Perbarui angka dan total rupiah di Floating Cart Bar & Tab Badge Mobile
   */
  window.updateMobileFloatingCart = function () {
    if (typeof getActiveSession !== 'function') return;

    const currentSession = getActiveSession();
    const floatBar = document.getElementById('posMobileFloatingCart');
    const mfcBadge = document.getElementById('mfcBadge');
    const mfcTotal = document.getElementById('mfcTotal');
    const tabBadge = document.getElementById('mobileCartTabBadge');
    const navCartBadge = document.getElementById('bottomNavCartBadge');

    if (!currentSession || !currentSession.items) return;

    const totalQty = currentSession.items.reduce((sum, it) => sum + (it.qty || 1), 0);
    const subtotal = currentSession.items.reduce((sum, it) => sum + (it.qty * it.price), 0);
    const discountPct = (currentSession.customer && currentSession.customer.discountPct) || 0;
    const finalTotal = Math.max(0, subtotal - Math.round(subtotal * (discountPct / 100)));

    const formattedTotal = typeof formatRupiah === 'function' ? formatRupiah(finalTotal) : 'Rp ' + finalTotal.toLocaleString('id-ID');

    // Update tab badges
    if (tabBadge) tabBadge.textContent = totalQty;
    if (navCartBadge) {
      navCartBadge.textContent = totalQty;
      navCartBadge.style.display = totalQty > 0 ? 'inline-block' : 'none';
    }

    // Update Floating bar
    if (floatBar && mfcBadge && mfcTotal) {
      mfcBadge.textContent = `${totalQty} Item`;
      mfcTotal.textContent = formattedTotal;

      // Hanya tampilkan jika ada barang, di POS view, dan sedang di tab catalog
      const isPosView = typeof activeView !== 'undefined' ? activeView === 'pos' : true;
      if (totalQty > 0 && isPosView && currentPosMobileTab === 'catalog') {
        floatBar.classList.remove('hidden');
      } else {
        floatBar.classList.add('hidden');
      }
    }
  };

  /**
   * Kontrol Buka/Tutup Mobile Drawer Menu (Menu Lainnya)
   */
  window.openMobileDrawer = function () {
    const drawer = document.getElementById('mobileDrawerOverlay');
    if (drawer) {
      drawer.classList.add('active');
      // Sinkronkan info kasir di drawer
      syncDrawerUserInfo();
    }
  };

  window.closeMobileDrawer = function () {
    const drawer = document.getElementById('mobileDrawerOverlay');
    if (drawer) {
      drawer.classList.remove('active');
    }
  };

  window.toggleMobileDrawer = function () {
    const drawer = document.getElementById('mobileDrawerOverlay');
    if (drawer) {
      if (drawer.classList.contains('active')) {
        closeMobileDrawer();
      } else {
        openMobileDrawer();
      }
    }
  };

  /**
   * Sinkronkan profil user dan shift di Mobile Drawer
   */
  function syncDrawerUserInfo() {
    const userNameEl = document.getElementById('drawerUserName');
    const userRoleEl = document.getElementById('drawerUserRole');
    const userAvatarEl = document.getElementById('drawerUserAvatar');

    if (typeof currentUser !== 'undefined' && currentUser) {
      const name = currentUser.name || 'Kasir';
      if (userNameEl) userNameEl.textContent = name;
      if (userRoleEl) userRoleEl.textContent = `Shift Aktif · Role: ${currentUser.role || 'KASIR'}`;
      if (userAvatarEl) userAvatarEl.textContent = name.charAt(0).toUpperCase();
    }
  }

  /**
   * Beralih tampilan utama dan sinkronkan status Bottom Nav Bar
   * @param {string} view
   */
  window.mobileNavigateTo = function (view) {
    if (typeof switchMainView === 'function') {
      switchMainView(view);
    }
    closeMobileDrawer();
    syncBottomNavState(view);

    // Jika masuk ke POS di HP, reset ke tab katalog
    if (view === 'pos') {
      switchPosMobileTab('catalog');
    }
  };

  /**
   * Sinkronkan highlight tombol aktif di Mobile Bottom Navigation
   */
  function syncBottomNavState(view) {
    const navItems = document.querySelectorAll('.mob-nav-item');
    navItems.forEach(item => {
      const target = item.getAttribute('data-view');
      if (target === view) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update visibility floating cart jika berpindah halaman
    if (view !== 'pos') {
      const floatBar = document.getElementById('posMobileFloatingCart');
      if (floatBar) floatBar.classList.add('hidden');
    } else {
      updateMobileFloatingCart();
    }
  }

  // Hook ke lifecycle aplikasi utama setelah DOM siap
  document.addEventListener('DOMContentLoaded', function () {
    // Intercept renderActiveCart untuk selalu memperbarui badge & floating cart mobile
    if (typeof renderActiveCart === 'function') {
      const originalRenderActiveCart = renderActiveCart;
      window.renderActiveCart = function () {
        originalRenderActiveCart.apply(this, arguments);
        updateMobileFloatingCart();
      };
    }

    // Intercept actuallySwitchMainView untuk sinkronisasi bottom nav
    if (typeof actuallySwitchMainView === 'function') {
      const origSwitch = actuallySwitchMainView;
      window.actuallySwitchMainView = function (view) {
        origSwitch.apply(this, arguments);
        syncBottomNavState(view);
      };
    }

    // Inisialisasi awal
    setTimeout(function () {
      updateMobileFloatingCart();
      if (typeof activeView !== 'undefined') {
        syncBottomNavState(activeView);
      }
    }, 500);
  });
})();
