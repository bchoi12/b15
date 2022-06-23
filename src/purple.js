import * as THREE from 'three';
class Purple {
    constructor() {
        this._purpleMaterials = [
            new THREE.MeshStandardMaterial({ color: 0x702963, shadowSide: THREE.FrontSide }),
            new THREE.MeshStandardMaterial({ color: 0xBF40BF, shadowSide: THREE.FrontSide }),
            new THREE.MeshStandardMaterial({ color: 0xCF9FFF, shadowSide: THREE.FrontSide }),
            new THREE.MeshStandardMaterial({ color: 0xDA70D6, shadowSide: THREE.FrontSide }),
            new THREE.MeshStandardMaterial({ color: 0x800080, shadowSide: THREE.FrontSide }),
            new THREE.MeshStandardMaterial({ color: 0x673147, shadowSide: THREE.FrontSide })
        ];
    }
    random() {
        const random = Math.random();
        for (let i = 0; i < this._purpleMaterials.length; ++i) {
            if (random <= (i + 1) / this._purpleMaterials.length) {
                return this._purpleMaterials[i];
            }
        }
        return this._purpleMaterials[0];
    }
}
export const purple = new Purple();
