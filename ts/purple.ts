import * as THREE from 'three'


class Purple {
	// https://htmlcolorcodes.com/colors/shades-of-purple/
	private readonly _purpleMaterials : Array<THREE.Material> = [
		// byzantium
		new THREE.MeshStandardMaterial({color: 0x702963, shadowSide: THREE.FrontSide}),
		// bright purple
		new THREE.MeshStandardMaterial({color: 0xBF40BF, shadowSide: THREE.FrontSide}),
		// light violet
		new THREE.MeshStandardMaterial({color: 0xCF9FFF, shadowSide: THREE.FrontSide}),		
		// orchid
		new THREE.MeshStandardMaterial({color: 0xDA70D6, shadowSide: THREE.FrontSide}),
		// purple		
		new THREE.MeshStandardMaterial({color: 0x800080, shadowSide: THREE.FrontSide}),
		// plum
		new THREE.MeshStandardMaterial({color: 0x673147, shadowSide: THREE.FrontSide})];

	constructor() {

	}

	random() : THREE.MeshStandardMaterial {
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