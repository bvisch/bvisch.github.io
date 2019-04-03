/**
 *
 */
class Ship extends Phaser.Physics.Matter.Sprite {
	
	constructor(scene, x, y, texture, frame, options, cursors) {
		super(scene.matter.world, x, y, texture, frame, options);

		var _this = this;
		this.left = this.getBottomLeft();
		this.right = this.getBottomRight();
		this.leftThrustAngle = this.angle;
		this.rightThrustAngle = this.angle;

		this.particles = scene.add.particles('flares');
		this.leftThruster = this.particles.createEmitter({
			frame: 'red',
	        x: { onEmit: () => { return _this.left.x; } },
	        y: { onEmit: () => { return _this.left.y; } },
	        lifespan: 500,
	        speed: { min: 1000, max: 1200 },
	        angle: { onEmit: () => { return _this.leftThrustAngle + 90; } },
	        gravityY: 0,
	        scale: { start: 0.4, end: 0 },
	        quantity: 2,
	        blendMode: 'ADD',
	        on: false
		});

		this.rightThruster = this.particles.createEmitter({
			frame: 'red',
	        x: { onEmit: () => { return _this.right.x; } },
	        y: { onEmit: () => { return _this.right.y; } },
	        lifespan: 500,
	        speed: { min: 1000, max: 1200 },
	        angle: { onEmit: () => { return _this.rightThrustAngle + 90; } },
	        gravityY: 0,
	        scale: { start: 0.4, end: 0 },
	        quantity: 2,
	        blendMode: 'ADD',
	        on: false
		});


		this.top = this.getTopLeft();

		this.coins = 1000;
		// this.coinParticleManager = scene.add.particles('flares');
		this.coinParticles = this.particles.createEmitter({
			frame: 'yellow',
	        x: { onEmit: () => { return _this.top.x; } },
	        y: { onEmit: () => { return _this.top.y; } },
	        lifespan: 2000,
	        speed: { min: 400, max: 600 },
	        angle: 90,
	        gravityY: 500,
	        scale: 0.2,
	        quantity: 1,
	        blendMode: 'ADD',
	        on: false
		});
		
		this.emitZoneLeft = this.getTopLeft();
		this.emitZoneRight = this.getTopRight();
		this.emitZoneLine = new Phaser.Geom.Line(0, 0, this.emitZoneRight.x - this.emitZoneLeft.x, this.emitZoneRight.y - this.emitZoneLeft.y);
		this.emitZone = { 
			source: this.emitZoneLine,
			type: 'random'
		};
		
		this.coinParticles.setEmitZone(this.emitZone);
		
		this.cursors = cursors;

		this.setBody({
			type: 'rectangle',
			width: this.width,
			height: this.height,
			x: 400,
			y: 200
		});

		this.setFrictionAir(0.02);
		this.setMass(100);
		
		this.setDepth(1000);
	}
	
	preUpdate() {
		super.preUpdate();
	
		this.getBottomLeft(this.left);
		this.getBottomRight(this.right);
		this.getTopLeft(this.top);
	
		var leftDifference = new Phaser.Math.Vector2(10, -10);
		var rightDifference = new Phaser.Math.Vector2(-10, -10);
		// var topDifference = new Phaser.Math.Vector2(this.width/2, 0);
		
		var shipRotation = Phaser.Math.Angle.Normalize(this.rotation);
		var rotationMatrix = new Phaser.Math.Matrix3();
		
		rotationMatrix.rotate(shipRotation);
		leftDifference.transformMat3(rotationMatrix);
		rightDifference.transformMat3(rotationMatrix);
		// topDifference.transformMat3(rotationMatrix);
		
		this.left.add(leftDifference);
		this.right.add(rightDifference);
		// this.top.add(topDifference);
		
		var forceMagnitude = 0.08;
		var force = { 
			x: forceMagnitude * -Math.sin(shipRotation + Math.PI), 
			y: forceMagnitude * Math.cos(shipRotation + Math.PI)
		}
		var negForce = { x: -force.x, y: -force.y };

		this.leftThruster.stop();
		this.rightThruster.stop();
		
		this.leftThrustAngle = this.rightThrustAngle = this.angle;
		if (this.cursors.leftDown.isDown) {
			this.leftThruster.start();
			this.applyForceFrom(this.left, force);
		}
		
		if (this.cursors.leftUp.isDown) {
			this.leftThrustAngle += 180;
			this.leftThruster.start();
			this.applyForceFrom(this.left, negForce);
		}
		
		if (this.cursors.rightDown.isDown) {
			this.rightThruster.start();
			this.applyForceFrom(this.right, force);
		}
		
		if (this.cursors.rightUp.isDown) {
			this.rightThrustAngle += 180;
			this.rightThruster.start();
			this.applyForceFrom(this.right, negForce);
		}
        
        if (shipRotation > Math.PI/2 && shipRotation < (3*Math.PI)/2) {
			this.emitZoneLeft = this.getTopLeft()
			this.emitZoneRight = this.getTopRight();
			
			this.emitZoneLine.setTo(0, 0, this.emitZoneRight.x - this.emitZoneLeft.x, this.emitZoneRight.y - this.emitZoneLeft.y);
			// this.emitZone = { 
			// 	source: this.emitZoneLine,
			// 	type: 'random'
			// };
			
			// this.coinParticles.emitZone.updateSource();

            this.coins -= Math.floor(Math.min(Math.abs(shipRotation - (Math.PI/2)), Math.abs(shipRotation - (3*Math.PI)/2)) * 5);
            this.coinParticles.start();
        }
        else
        	this.coinParticles.stop();
	}
	
}