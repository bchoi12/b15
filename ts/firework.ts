import * as THREE from 'three'

import { purple } from './purple.js'
import { Range } from './range.js'

export enum Type {
	UNKNOWN = 0,
	RED = 1,
	GREEN = 2,
	BLUE = 3,
}

enum State {
	UNKNOWN = 0,
	DISABLED = 1,
	WAITING = 2,
	LAUNCHING = 3,
	EXPLODING = 4,
}

export class Firework {
	private readonly _materialSize = 0.8;

	private readonly _points = new Range(150, 180);
	private readonly _rangeX = new Range(-6, 6);
	private readonly _startY = new Range(-16, -15);
	private readonly _endY = new Range(12, 16);
	private readonly _rangeZ = new Range(-20, -30);
	private readonly _scale = new Range(1, 10);
	private readonly _opacity = new Range(0.1, 0.9);
	private readonly _lightIntensity = new Range(0, 2);
	private readonly _equatorAngle = new Range(0, 2 * Math.PI);
	private readonly _phiAngle = new Range(-Math.PI, Math.PI);

	private readonly _waitingTime = new Range(300, 1500);
	private readonly _launchTime = new Range(1500, 1800);
	private readonly _explodeTime = new Range(1000, 1500);

	private _scene : THREE.Scene;
	private _explosion : THREE.Mesh;
	private _explosionLight : THREE.PointLight;
	private _launcher : THREE.Mesh;
	private _startPos : THREE.Vector3;
	private _endPos : THREE.Vector3;

	private _color : THREE.Color;
	private _state : State;
	private _stateStarted : Map<State, number>;
	private _stateDuration : Map<State, number>;

	constructor() {
		this._scene = new THREE.Scene();
		this._color = purple.random().color;

		let geometry = new THREE.BufferGeometry();
		let points = [];
		let colors = [];

		let numPoints = this._points.random();
		for (let i = 0; i < numPoints; ++i) {
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

		this._launcher = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 6), new THREE.MeshStandardMaterial({color: 0xffffff}));
		this._launcher.visible = false;
		this._scene.add(this._launcher);


		this._stateStarted = new Map();
		this._stateDuration = new Map();
		this.setState(State.DISABLED, 0);
	}

	enable() : void {
		this.setState(State.WAITING, this._waitingTime.random());
	}

	scene() : THREE.Scene {
		return this._scene;
	}

	update() : void {
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

	private setCoordinates() {
		this._startPos = new THREE.Vector3(this._rangeX.random(), this._startY.random(), this._rangeZ.random());
		this._endPos = new THREE.Vector3(this._rangeX.random(), this._endY.random(), this._rangeZ.random());

		this._explosionLight.position.x = this._endPos.x;
		this._explosionLight.position.y = this._endPos.y;
		this._explosionLight.position.z = -this._endPos.z;

		this._launcher.position.copy(this._startPos);
		this._explosion.position.copy(this._endPos);
	}

	private setState(state : State, duration : number) {
		this._state = state;
		this._stateStarted.set(state, Date.now());
		this._stateDuration.set(state, duration);
	}

	private weight(state : State) {
		if (this._stateDuration.get(state) <= 0) {
			return 1;
		}

		return (Date.now() - this._stateStarted.get(state)) / this._stateDuration.get(state);
	}
}