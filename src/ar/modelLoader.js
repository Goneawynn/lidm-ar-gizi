// Lokasi file:
// src/ar/modelLoader.js
import * as THREE from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {MODEL_MAP, DEFAULT_MODEL} from "../config/modelMap.js";

export class ModelLoader{
    constructor(scene){
        this.scene = scene
        this.loader = new GLTFLoader()
        this.current = null     // Model yang sedang tampil
        this.cache = {}         // Simpan model agar tidak load ulang
    }

    // Tampilkan model berdasarkan data QR Code
    async showModel(qrData) {
        const config = MODEL_MAP[qrData] ?? DEFAULT_MODEL
        this.removeCurrentModel()

        // Cek cache
        if (this.cache[config.model]) {
            const clone = this.cache[config.model].clone()
            this._addToScene(clone, config)
            return
        }

        try {
            const gltf = await this._loadGLTF(config.model)
            this.cache[config.model] = gltf.scene
            this._addToScene(gltf.scene.clone(), config)
        } catch (err) {
            console.error('Gagal load model:', err)
        }
    }

    // Tambahkan model ke scene
    _addToScene(model, config) {
        model.scale.setScalar(config.scale)
        model.position.set(0, config.offsetY, -1)
        this.scene.add(model)
        this.current = model
        this._animateIn(model, config.scale)
 }

 // Animasi model muncul dari kecil ke normal
    _animateIn(model, targetScale) {
        let progress = 0
        const animate = () => {
            progress += 0.05
            const scale = Math.min(progress, 1) * targetScale
            model.scale.setScalar(scale)
            if (progress < 1) requestAnimationFrame(animate)
    }
    animate()
    }

    // Hapus model dari scene
    removeCurrentModel() {
        if (this.current) {
            this.scene.remove(this.current)
            this.current = null
        }
    }

 // Load file .glb (mengembalikan Promise)
    _loadGLTF(path) {
        return new Promise((resolve, reject) => {
            this.loader.load(path, resolve, undefined, reject)
        })
    }
}
