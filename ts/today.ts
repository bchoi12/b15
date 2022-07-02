
class Today {
	private readonly _sunrise = 6;
	private readonly _sunset = 20;
	private readonly _oneDay = 1000 * 60 * 60 * 24;

	private _seed : number;

	constructor() {
		this._seed = this.currentDay();
	}

	textDate() : string {
		const now = new Date();

		// bless javascript
		const month = now.getMonth() + 1;
		const day = now.getDate();
		return month + "/" + day;
	}

	color() : number {
		const td = this.textDate();

		switch (td) {
			case "6/23":
			case "7/21":
			case "9/15":
				return 0x9f30db;
			case "6/24":
			case "11/24":
				return 0xdb3030;
			case "8/1":
				return 0xcfbc93;
		}

		return 0xcfbc93;
	}

	imageFile() : string {
		let debug = false; // location.hostname === "localhost" ? true : false;
		if (debug) {
			return "2/10.jpg";
		}

		return this.textDate() + ".jpg";
	}

	sunrise() : number {
		return this._sunrise;
	}

	sunHours() : number {
		return this._sunset - this._sunrise;
	}

	moonHours() : number {
		return 24 - this.sunHours();
	}

	sunset() : number {
		return this._sunset;
	}

	isNight() : boolean {
		const hours = this.currentHours();
		return hours < this._sunrise || hours >= this._sunset;
	}

	isSunset() : boolean {
		const hours = this.currentHours();
		return hours === this._sunset - 1;
	}

	currentHours() : number {
		return new Date().getHours();
	}

	currentDay() : number {
		const now = new Date();
		const start = new Date(now.getFullYear(), 0, 0);
		const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
		
		return Math.floor(diff / this._oneDay);
	}

	tomorrow() : Date {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate()+1);
		return tomorrow;
	}

	restartRandom() {
		this._seed = this.currentDay();
	}

	random() {
    	let x = Math.sin(this._seed++) * 10000;
	    return x - Math.floor(x);
	}
}

export const today = new Today();