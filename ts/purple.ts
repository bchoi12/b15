import * as THREE from 'three'


class Purple {
	// https://htmlcolorcodes.com/colors/shades-of-purple/
	private readonly _colors : Array<number> = [
		// byzantium
		0x702963,
		// bright purple
		0xBF40BF,
		// light violet
		0xCF9FFF,		
		// orchid
		0xDA70D6,
		// purple		
		0x800080,
		// plum
		0x673147,
	]

	private _materials : Array<THREE.Material>;

	constructor() {
		this._materials = new Array<THREE.Material>();
		for (const color of this._colors) {
			this._materials.push(new THREE.MeshStandardMaterial({color: color, shadowSide: THREE.FrontSide}));
		}
	}

	random() : THREE.MeshStandardMaterial {
		const random = Math.random();
		for (let i = 0; i < this._materials.length; ++i) {
			if (random <= (i + 1) / this._materials.length) {
				return this._materials[i];
			}
		}
		return this._materials[0];
	}

	randomColor() : number {
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