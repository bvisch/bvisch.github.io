/**
 *
 */
class Ship extends Phaser.Physics.Matter.Sprite {
	
	constructor(world, x, y, texture, frame, options, cursors) {
		super(world, x, y, texture, frame, options);
		
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
	
		var left = this.getBottomLeft();
		var right = this.getBottomRight();
	
		var leftDifference = new Phaser.Math.Vector2(-60, 20);
		var rightDifference = new Phaser.Math.Vector2(60, 20);
		
		var shipRotation = Phaser.Math.Angle.Normalize(this.rotation);
		var rotationMatrix = new Phaser.Math.Matrix3();
		
		rotationMatrix.rotate(shipRotation);
		leftDifference.transformMat3(rotationMatrix);
		rightDifference.transformMat3(rotationMatrix);
		
		left.add(leftDifference);
		right.add(rightDifference);
		
		var forceMagnitude = 0.08;
		var force = { 
			x: forceMagnitude * -Math.sin(shipRotation + Math.PI), 
			y: forceMagnitude * Math.cos(shipRotation + Math.PI)
		}
		var negForce = { x: -force.x, y: -force.y };
		
		if (this.cursors.left.isDown) {
			this.applyForceFrom(left, force);
		}
		
		if (this.cursors.up.isDown) {
			this.applyForceFrom(left, negForce);
		}
		
		if (this.cursors.right.isDown) {
			this.applyForceFrom(right, force);
		}
		
		if (this.cursors.down.isDown) {
			this.applyForceFrom(right, negForce);
		}
	}
	
}