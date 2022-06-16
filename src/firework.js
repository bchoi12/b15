import * as THREE from 'three';
import { Range } from './range.js';
export var Type;
(function (Type) {
    Type[Type["UNKNOWN"] = 0] = "UNKNOWN";
    Type[Type["RED"] = 1] = "RED";
    Type[Type["GREEN"] = 2] = "GREEN";
    Type[Type["BLUE"] = 3] = "BLUE";
})(Type || (Type = {}));
var State;
(function (State) {
    State[State["UNKNOWN"] = 0] = "UNKNOWN";
    State[State["DISABLED"] = 1] = "DISABLED";
    State[State["WAITING"] = 2] = "WAITING";
    State[State["LAUNCHING"] = 3] = "LAUNCHING";
    State[State["EXPLODING"] = 4] = "EXPLODING";
})(State || (State = {}));
export class Firework {
    constructor(type) {
        this._materialSize = 0.8;
        this._rangeX = new Range(-6, 6);
        this._startY = new Range(-16, -15);
        this._endY = new Range(12, 16);
        this._rangeZ = new Range(-20, -30);
        this._scale = new Range(1, 10);
        this._opacity = new Range(0.1, 0.9);
        this._lightIntensity = new Range(0, 2);
        this._equatorAngle = new Range(0, 2 * Math.PI);
        this._phiAngle = new Range(-Math.PI, Math.PI);
        this._waitingTime = new Range(300, 1200);
        this._launchTime = new Range(1400, 1600);
        this._explodeTime = new Range(1000, 1200);
        this._scene = new THREE.Scene();
        this._type = type;
        switch (this._type) {
            case Type.RED:
                this._color = new THREE.Color(1, 0, 0);
                break;
            case Type.GREEN:
                this._color = new THREE.Color(0, 1, 0);
                break;
            case Type.BLUE:
                this._color = new THREE.Color(0, 0, 1);
                break;
            default:
                this._color = new THREE.Color(1, 1, 1);
        }
        let geometry = new THREE.BufferGeometry();
        let points = [];
        let colors = [];
        for (let i = 0; i < 150; ++i) {
            const pos = new THREE.Vector3();
            pos.setFromSphericalCoords(1, this._equatorAngle.random(), this._phiAngle.random());
            points.push(pos.x);
            points.push(pos.y);
            points.push(pos.z);
            colors.push(this._color.r);
            colors.push(this._color.g);
            colors.push(this._color.b);
            colors.push(1);
        }
        geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(points), 3));
        geometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(colors), 4));
        this._explosion = new THREE.Points(geometry, new THREE.PointsMaterial({
            size: this._materialSize,
            opacity: this._opacity.max(),
            transparent: true,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
        }));
        this._explosion.visible = false;
        this._scene.add(this._explosion);
        this._explosionLight = new THREE.PointLight(this._color, 0, 100);
        this._scene.add(this._explosionLight);
        this._launcher = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 6), new THREE.MeshStandardMaterial({ color: 0xffffff }));
        this._launcher.visible = false;
        this._scene.add(this._launcher);
        this._stateStarted = new Map();
        this._stateDuration = new Map();
        this.setState(State.DISABLED, 0);
    }
    enable() {
        this.setState(State.WAITING, this._waitingTime.random());
    }
    scene() {
        return this._scene;
    }
    update() {
        let time, percent, weight;
        switch (this._state) {
            case State.WAITING:
                percent = this.weight(State.WAITING);
                if (percent >= 1) {
                    this._launcher.visible = true;
                    this._explosion.visible = false;
                    this._explosion.rotation.x = Math.random() * 2 * Math.PI;
                    this._explosion.rotation.y = Math.random() * 2 * Math.PI;
                    this._explosion.rotation.z = Math.random() * 2 * Math.PI;
                    this._explosionLight.intensity = this._lightIntensity.min();
                    this.setCoordinates();
                    this.setState(State.LAUNCHING, this._launchTime.random());
                }
                break;
            case State.LAUNCHING:
                percent = this.weight(State.LAUNCHING);
                weight = 2.2 * percent - 1.2 * percent * percent;
                this._launcher.position.x = percent * (this._endPos.x - this._startPos.x) + this._startPos.x;
                this._launcher.position.y = weight * (this._endPos.y - this._startPos.y) + this._startPos.y;
                this._launcher.position.z = percent * (this._endPos.z - this._startPos.z) + this._startPos.z;
                if (percent >= 1) {
                    this.setState(State.EXPLODING, this._explodeTime.random());
                    this._launcher.visible = false;
                    this._explosion.visible = true;
                    this._explosion.material.opacity = this._opacity.max();
                    this._explosion.scale.x = this._scale.min();
                    this._explosion.scale.y = this._scale.min();
                    this._explosion.scale.z = this._scale.min();
                }
                break;
            case State.EXPLODING:
                percent = this.weight(State.EXPLODING);
                weight = 2 * percent - percent * percent;
                this._explosion.scale.x = this._scale.lerp(weight);
                this._explosion.scale.y = this._scale.lerp(weight);
                this._explosion.scale.z = this._scale.lerp(weight);
                this._explosion.material.opacity = this._opacity.lerp(1 - weight);
                this._explosionLight.intensity = this._lightIntensity.lerp(1 - weight);
                if (percent >= 1) {
                    this._explosion.visible = false;
                    this._explosionLight.intensity = this._lightIntensity.min();
                    this.setState(State.WAITING, this._waitingTime.random());
                }
                break;
        }
    }
    setCoordinates() {
        this._startPos = new THREE.Vector3(this._rangeX.random(), this._startY.random(), this._rangeZ.random());
        this._endPos = new THREE.Vector3(this._rangeX.random(), this._endY.random(), this._rangeZ.random());
        this._explosionLight.position.x = this._endPos.x;
        this._explosionLight.position.y = this._endPos.y;
        this._explosionLight.position.z = -this._endPos.z;
        this._launcher.position.copy(this._startPos);
        this._explosion.position.copy(this._endPos);
    }
    setState(state, duration) {
        this._state = state;
        this._stateStarted.set(state, Date.now());
        this._stateDuration.set(state, duration);
    }
    weight(state) {
        if (this._stateDuration.get(state) <= 0) {
            return 1;
        }
        return (Date.now() - this._stateStarted.get(state)) / this._stateDuration.get(state);
    }
}
