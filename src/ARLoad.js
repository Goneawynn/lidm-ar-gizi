// Lokasi File:
// src/ARLoad.js
import { ARManager } from "./ar/ARmanager";

async function initApp() {
  const loading = document.getElementById('loading')
  const container = document.getElementById('ar-container')

  try {
    // 1. Buat ARManager
    const ar = new ARManager(container)
    // 2. Inisialisasi kamera
    await ar.initCamera()
    // 3. Tunggu sebentar agar kamera siap
    await new Promise(r => setTimeout(r, 800))
    // 4. Mulai AR loop
    ar.start()
    // 5. Sembunyikan loading
    loading.style.display = 'none'
    // 6. Setup tombol Reset
    document.getElementById('btn-reset')
      .addEventListener('click', () => ar.reset())
    // 7. Dengarkan event dari ARManager
    document.addEventListener('qr-detected', (e) => {
      const qrInfo = document.getElementById('qr-info')
      const label = document.getElementById('qr-label')
      label.textContent = e.detail.data
      qrInfo.classList.remove('hidden')
    })

  document.addEventListener('qr-reset', () => {
    document.getElementById('qr-info')
      .classList.add('hidden')
 })

 } catch (err) {
 // Jika ada error (misalnya kamera ditolak)
 loading.innerHTML = `
    <p style='color:red'>Gagal memulai AR</p>
    <small>${err.message}</small>
 `
    console.error(err)
  }
}

// console.log("QR Result:", scannedText);
// Jalankan Aplikasi
initApp()

