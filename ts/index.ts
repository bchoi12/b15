import { Renderer } from './renderer.js'

document.addEventListener('DOMContentLoaded', (event) => {
	const pic = 1; // + Math.floor(Math.random() * 5);

	const renderer = new Renderer("https://brianchoi.net/b15/" + pic + ".jpg");
	renderer.start();
});