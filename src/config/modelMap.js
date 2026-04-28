// Lokasi file:
// src/config/modelMap.js

import { scanlines } from "three/examples/jsm/tsl/display/CRT.js";
import { modelDirection } from "three/tsl";

// Daftar mapping: data QR code -> file 3D modelnya
export const MODEL_MAP = {
    // Format: 'ISI_QR_CODE': (model, scale, offsetY, label)
    'PRODUCT_AYAM': {
        model   : '/assets/models/ayamBakar.compressed.glb', // path file .glb 
        scale   : 0.3,          // ukuran model (0.2 = 20% dari ukuran asli)
        offsetY : 0,            // posisi vertikal
        label   : 'AYAM BAKAR'  // nama yang ditampilkan ke user
    },
    'PRODUCT_JAGUNG':{
        model   : 'public/assets/models/jagung.glb',
        scale   : 0.2,
        offsetY : 0,
        label   : 'JAGUNG'
    },
}

// Model default jika QR tidak ada di daftar
export const DEFAULT_MODEL = {
    model : '/public/assets/models/alpukat.glb',
    scale : 0.2,
    offsetY: 0,
    label : 'Object AR'
}

