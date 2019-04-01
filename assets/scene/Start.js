class Start extends Phaser.Scene {
	
	constructor() {
		super('Start');
	}
	
	preload() {
		// pre-load assets
	}
	
	create() {
		// create background & sprites
		var title = this.add.image(400, 200, 'title');
		title.setInteractive();
		title.on('pointerdown', () => this.scene.start("Level"));
	}
}
