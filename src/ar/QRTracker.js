// Lokasi File:
// src/ar/QRTracker.js
import jsQR from "jsqr";

export class QRTracker{
    constructor(){
        // Canvas berguna untuk mengambil barang dari video
        this.canvas = document.createElement('canvas')
        this.ctx = this.canvas.getContext('2d')

        this.lastResult = null  // QR Terakhir yang terdeteksi
        this.lastTime = 0       // Waktu scan terakhir
        this.cooldownMs = 1500  // Jeda 1.5 detik antar scan
    }

    // Fungsi utama untuk scan QR dari elemen video
    scan(video){
        // Cek apakah video sudah siap
        if (!video.readyState || video.readyState < 2) return null

        // Cek cooldown agar tidak scan terlalu cepat
        const now = Date.now()
        if (now - this.lastTime < this.cooldownMs){
            return this.lastResult
        }
        
    // Ambil ukuran video
    const w = video.videoWidth
    const h = video.videoHeight
    this.canvas.width = w
    this.canvas.height = h
 
    // Gambar frame video ke canvas 
    this.ctx.drawImage(video, 0, 0, w, h)
 
    // Ambil data pixel dari canvas
    const imageData = this.ctx.getImageData(0, 0, w, h)

    // Minta jsQR mencari QR Code di data pixel
    const result = jsQR(imageData.data, w, h, {
    inversionAttempts: 'dontInvert',
    })
    
    // Jika QR ditemukan, simpan dan kembalikan datanya
    if (result) {
        this.lastResult = result.data
        console.log(result.data)
        this.lastTime = now
        return result.data // contoh: 'PRODUCT_ROBOT'
    }
    return null // tidak ada QR Code
}

 // Reset tracker (dipakai saat tombol Reset ditekan)
    reset() {
        this.lastResult = null
        this.lastTime = 0
    }
}

