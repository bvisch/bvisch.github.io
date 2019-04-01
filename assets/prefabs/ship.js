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
			frame: 'blue',
	        x: { onEmit: () => { return _this.left.x; } },
	        y: { onEmit: () => { return _this.left.y; } },
	        lifespan: 2000,
	        speed: { min: 400, max: 600 },
	        angle: { onEmit: function () { return _this.leftThrustAngle + 90; } },
	        gravityY: 0,
	        scale: { start: 0.4, end: 0 },
	        quantity: 2,
	        blendMode: 'ADD'
		});

		this.rightThruster = this.particles.createEmitter({
			frame: 'blue',
	        x: { onEmit: () => { return _this.right.x; } },
	        y: { onEmit: () => { return _this.right.y; } },
	        lifespan: 2000,
	        speed: { min: 400, max: 600 },
	        angle: { onEmit: function () { return _this.rightThrustAngle + 90; } },
	        gravityY: 0,
	        scale: { start: 0.4, end: 0 },
	        quantity: 2,
	        blendMode: 'ADD'
		});
		
		this.cursors = cursors;

		this.setBody({
			type: 'rectangle',
			width: 200,
			height: 100,
			x: 400,
			y: 200
		});

		this.setFrictionAir(0.01);
		this.setMass(100);
	}
	
	preUpdate() {
		super.preUpdate();
	
		this.left = this.getBottomLeft();
		this.right = this.getBottomRight();
	
		var leftDifference = new Phaser.Math.Vector2(-60, 20);
		var rightDifference = new Phaser.Math.Vector2(60, 20);
		
		var shipRotation = Phaser.Math.Angle.Normalize(this.rotation);
		var rotationMatrix = new Phaser.Math.Matrix3();
		
		rotationMatrix.rotate(shipRotation);
		leftDifference.transformMat3(rotationMatrix);
		rightDifference.transformMat3(rotationMatrix);
		
		this.left.add(leftDifference);
		this.right.add(rightDifference);
		
		var forceMagnitude = 0.08;
		var force = { 
			x: forceMagnitude * -Math.sin(shipRotation + Math.PI), 
			y: forceMagnitude * Math.cos(shipRotation + Math.PI)
		}
		var negForce = { x: -force.x, y: -force.y };

		this.leftThruster.stop();
		this.rightThruster.stop();
		
		this.leftThrustAngle = this.rightThrustAngle = this.angle;
		if (this.cursors.left.isDown) {
			this.leftThruster.start();
			this.applyForceFrom(this.left, force);
		}
		
		if (this.cursors.up.isDown) {
			this.leftThrustAngle += 180;
			this.leftThruster.start();
			this.applyForceFrom(this.left, negForce);
		}
		
		if (this.cursors.right.isDown) {
			this.rightThruster.start();
			this.applyForceFrom(this.right, force);
		}
		
		if (this.cursors.down.isDown) {
			this.rightThrustAngle += 180;
			this.rightThruster.start();
			this.applyForceFrom(this.right, negForce);
		}
	}
	
}