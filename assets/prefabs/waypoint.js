/**
 *
 */
class Waypoint extends Phaser.Physics.Matter.Sprite {
	
	constructor(world, x, y, texture, frame, options) {
		super(world, x, y, 'character', 'fruit', options);
		
		this.setIgnoreGravity(true);
		
		world.scene.waypoints++;
		
		world.on('collisionstart', (event, bodyA, bodyB) => {
			if (bodyA.gameObject instanceof Waypoint) {
				bodyA.gameObject.setVisible(false);
				bodyA.gameObject.destroy();
				bodyB.gameObject.scene.events.emit('waypoint_destroyed');
			}
		});
	}
	
	preUpdate() {
		super.preUpdate();
	}
	
}

