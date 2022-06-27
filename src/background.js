import * as THREE from 'three';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { Firework } from './firework.js';
import { purple } from './purple.js';
import { Range } from './range.js';
import { today } from './today.js';
export class Background {
    constructor() {
        this._sunAngle = new Range(Math.PI / 2, 17 * Math.PI / 40);
        this._scene = new THREE.Scene();
        this._sky = new Sky();
        this._sky.scale.setScalar(4000);
        this._sunPos = new THREE.Vector3();
        this._scene.add(this._sky);
        this._hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x565656, 1.2);
        this._scene.add(this._hemisphereLight);
        this._sunLight = new THREE.DirectionalLight(0xfdfbfd, 2.0);
        const side = 10;
        this._sunLight.castShadow = true;
        this._sunLight.shadow.camera = new THREE.OrthographicCamera(-side, side, side, -side, 0.1, 500);
        this._sunLight.shadow.mapSize.width = 1024;
        this._sunLight.shadow.mapSize.height = 1024;
        this._sunLight.shadow.bias = -0.00018;
        this._scene.add(this._sunLight);
        this._scene.add(this._sunLight.target);
        this._spotLights = new Array();
        for (let i of [-1, 1]) {
            const spotLight = new THREE.SpotLight(0xffffff, 2.0);
            spotLight.position.set(12 * i, 20, 12);
            spotLight.castShadow = true;
            spotLight.shadow.mapSize.width = 1024;
            spotLight.shadow.mapSize.height = 1024;
            spotLight.shadow.camera.near = 0.1;
            spotLight.shadow.camera.far = 100;
            spotLight.shadow.camera.fov = 30;
            spotLight.target.position.copy(new THREE.Vector3());
            this._spotLights.push(spotLight);
            this._scene.add(spotLight);
            this._scene.add(spotLight.target);
        }
        this.updateSky();
        this._fireworks = new Array();
        this._ground = new THREE.Mesh(new THREE.BoxGeometry(20, 6, 20), new THREE.MeshStandardMaterial({ color: 0x777777 }));
        this._ground.position.y -= (6 + 3);
        this._ground.receiveShadow = true;
        this._scene.add(this._ground);
        const loader = new FontLoader();
        loader.load('./helvetiker_bold.typeface.json', (response) => {
            console.log(response);
            const font = response;
            const geometry = new TextGeometry(today.textDate(), {
                font: font,
                size: 3,
                height: 1,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.1,
                bevelSize: 0.1,
                bevelOffset: 0,
                bevelSegments: 6
            });
            const mesh = new THREE.Mesh(geometry, purple.random());
            mesh.castShadow = true;
            let size = new THREE.Vector3();
            const bbox = new THREE.Box3().setFromObject(mesh);
            bbox.getSize(size);
            mesh.position.x -= size.x / 2;
            mesh.position.z = 10;
            mesh.position.y = this._ground.position.y - 3 + size.y / 2;
            const pointLight = new THREE.PointLight(0xdddddd, 0.8, 30);
            pointLight.position.x = mesh.position.x;
            pointLight.position.y = mesh.position.y;
            pointLight.position.z = mesh.position.z + 10;
            pointLight.lookAt(0, 0, 0);
            this._scene.add(pointLight);
            this._scene.add(mesh);
        });
        this._updateCount = 0;
        this._victoryStarted = false;
    }
    scene() {
        return this._scene;
    }
    update() {
        if (this._updateCount % 60 === 0) {
            this.updateSky();
        }
        this._fireworks.forEach((firework) => {
            firework.update();
        });
        this._updateCount++;
    }
    startVictory() {
        if (this._victoryStarted) {
            return;
        }
        this._victoryStarted = true;
        for (let i = 0; i < 6; ++i) {
            const firework = new Firework();
            firework.enable();
            this._fireworks.push(firework);
            this._scene.add(firework.scene());
        }
    }
    updateSky() {
        const night = today.isNight();
        let uniforms = this._sky.material.uniforms;
        uniforms['turbidity'].value = 1;
        uniforms['rayleigh'].value = 1.3;
        uniforms['mieCoefficient'].value = 0.1;
        uniforms['mieDirectionalG'].value = night ? 1 : 0.9999;
        this._sunPos.setFromSphericalCoords(1, this.sunAngle(), 0.97 * Math.PI);
        uniforms['sunPosition'].value.copy(this._sunPos);
        const sunLightOffset = uniforms['sunPosition'].value.clone();
        sunLightOffset.multiplyScalar(86);
        this._sunLight.position.copy(sunLightOffset);
        this._sunLight.intensity = today.isNight() ? 0.3 : 2.0;
        this._spotLights.forEach((spotLight) => {
            spotLight.intensity = today.isNight() ? 2.0 : 0.3;
        });
    }
    sunAngle() {
        const hours = today.currentHours();
        const minutes = new Date().getMinutes();
        const start = today.isNight() ? today.sunset() : today.sunrise();
        let hoursElapsed = hours - start;
        if (hoursElapsed < 0) {
            hoursElapsed += 24;
        }
        let percent = (60 * hoursElapsed + minutes) / (60 * (today.isNight() ? today.moonHours() : today.sunHours()));
        percent = 1 - 2 * Math.abs(0.5 - percent);
        if (today.isNight()) {
            percent = 1 - percent;
        }
        return this._sunAngle.lerp(percent);
    }
}
