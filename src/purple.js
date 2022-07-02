import * as THREE from 'three';
class Purple {
    constructor() {
        this._colors = [
            0x702963,
            0xBF40BF,
            0xCF9FFF,
            0xDA70D6,
            0x800080,
            0x673147,
        ];
        this._materials = new Array();
        for (const color of this._colors) {
            this._materials.push(new THREE.MeshStandardMaterial({ color: color, shadowSide: THREE.FrontSide }));
        }
    }
    random() {
        const random = Math.random();
        for (let i = 0; i < this._materials.length; ++i) {
            if (random <= (i + 1) / this._materials.length) {
                return this._materials[i];
            }
        }
        return this._materials[0];
    }
    randomColor() {
        const random = Math.random();
        for (let i = 0; i < this._colors.length; ++i) {
            if (random <= (i + 1) / this._colors.length) {
                return this._colors[i];
            }
        }
        return this._colors[0];
    }
}
export const purple = new Purple();
