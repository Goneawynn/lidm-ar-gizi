// Lokasi file:
// src/ar/ARManager.js
import * as THREE from "three";
import {ModelLoader} from "./modelLoader.js";
import {QRTracker} from "./QRTracker.js";

export class ARManager{
    constructor(container){
        this.container = container // div#ar-container dari HTML
        this.isRunning = false
        this.currentQR = null
        this._initThree() // setup 3D Renderer
        this.qrTracker = new QRTracker()
        this.modelLoader = new ModelLoader(this.scene)
    }

    _initThree() {
        // 1. Scene — ruang tempat semua objek 3D berada
        this.scene = new THREE.Scene()
        
        // 2. Camera — sudut pandang pengguna
        this.camera = new THREE.PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight,
            0.01, 100
        )
        this.camera.position.set(0, 0, 0)
    
        // 3. Renderer — yang menggambar ke layar
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha : true, // background transparan
        })
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.setClearColor(0x000000, 0)
        this.container.appendChild(this.renderer.domElement)
 
        // 4. Pencahayaan
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
        const dirLight = new THREE.DirectionalLight(0xffffff, 1.2)
        dirLight.position.set(5, 10, 7)
        this.scene.add(ambientLight, dirLight)
 
        // 5. Handle resize layar
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight
            this.camera.updateProjectionMatrix()
            this.renderer.setSize(window.innerWidth, window.innerHeight)
        })
    }

    // Inisialisasi kamera HP/laptop
    async initCamera() {
        this.video = document.getElementById('bg-video')
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
            audio: false,
        })
        this.video.srcObject = stream
        await this.video.play()
    }

    start() {
        this.isRunning = true
        this._loop() // mulai loop
    }

    // Loop utama dipanggil ~60x per detik
    _loop() {
        if (!this.isRunning) return
        requestAnimationFrame(() => this._loop())
        // Scan QR dari frame kamera
        const qrData = this.qrTracker.scan(this.video)
        // Jika QR baru ditemukan
        if (qrData && qrData !== this.currentQR) {
            this.currentQR = qrData
            this.modelLoader.showModel(qrData)
            this._notifyUI(qrData)
        }
        // Putar model pelan-pelan
        if (this.modelLoader.current) {
            this.modelLoader.current.rotation.y += 0.008
        }
        this.renderer.render(this.scene, this.camera)
    }

    _notifyUI(data) {
        document.dispatchEvent(
            new CustomEvent('qr-detected', { detail: { data } })
        )
    }

    reset() {
        this.currentQR = null
        this.qrTracker.reset()
        this.modelLoader.removeCurrentModel()
        document.dispatchEvent(new CustomEvent('qr-reset'))
    }
}