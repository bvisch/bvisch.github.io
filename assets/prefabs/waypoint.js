/**
 *
 */
class Waypoint extends Phaser.Physics.Matter.Sprite {
	
	constructor(world, x, y, options) {
		super(world, x, y, 'gold', 'null', options);
		
		this.setIgnoreGravity(true);
		
		// world.scene.waypoints++;
		
		world.on('collisionstart', (event, bodyA, bodyB) => {
			if (bodyA.gameObject instanceof Waypoint) {
				var index = bodyA.gameObject.getData('index');
				bodyA.gameObject.setVisible(false);
				bodyA.gameObject.destroy();
				bodyB.gameObject.scene.events.emit('waypoint_destroyed', index);
			}
		});
	}
	
	preUpdate() {
		super.preUpdate();
	}
	
}

