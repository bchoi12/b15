
export class Range {
	private _min : number;
	private _max : number;

	constructor(min : number, max : number) {
		this._min = min;
		this._max = max;
	}

	lerp(x : number) {
		return this._min + x * this.length();
	}

	length() {
		return this._max - this._min;
	}

	min() {
		return this._min;
	}

	max() {
		return this._max;
	}

	random() { 
		return this.lerp(Math.random());
	}
}