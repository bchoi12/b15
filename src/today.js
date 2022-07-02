class Today {
    constructor() {
        this._sunrise = 6;
        this._sunset = 20;
        this._oneDay = 1000 * 60 * 60 * 24;
        this._seed = this.currentDay();
    }
    textDate() {
        const now = new Date();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        return month + "/" + day;
    }
    color() {
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
    imageFile() {
        let debug = false;
        if (debug) {
            return "2/10.jpg";
        }
        return this.textDate() + ".jpg";
    }
    sunrise() {
        return this._sunrise;
    }
    sunHours() {
        return this._sunset - this._sunrise;
    }
    moonHours() {
        return 24 - this.sunHours();
    }
    sunset() {
        return this._sunset;
    }
    isNight() {
        const hours = this.currentHours();
        return hours < this._sunrise || hours >= this._sunset;
    }
    isSunset() {
        const hours = this.currentHours();
        return hours === this._sunset - 1;
    }
    currentHours() {
        return new Date().getHours();
    }
    currentDay() {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
        return Math.floor(diff / this._oneDay);
    }
    tomorrow() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
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
