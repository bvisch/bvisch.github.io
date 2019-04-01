class Results extends Phaser.Scene {
	
	constructor() {
	
		super('Results');
		
	}
	
	preload() {
		// pre-load assets
	}
	
	create() {
		// create background & sprites
		this.gameWidth = 4000;
		this.gameHeight = 2200;
		
		this.mountains_back = this.add.tileSprite(this.gameWidth/2 - 400, 1344.0, this.gameWidth, 894.0, 'mountains-back');
		this.mountains_back.setScale(1.0, 2.0);
		
		this.mountains_mid1 = this.add.tileSprite(this.gameWidth/2 - 400, 1472.0, this.gameWidth, 770.0, 'mountains-mid1');
		this.mountains_mid1.setScale(1.0, 2.0);
		
		this.mountains_mid2 = this.add.tileSprite(this.gameWidth/2 - 400, 1728.0, this.gameWidth, 482.0, 'mountains-mid2');
		this.mountains_mid2.setScale(1.0, 2.0);

		this.mountains_back.setScrollFactor(0.7, 0.8);
		this.mountains_mid1.setScrollFactor(0.75, 0.9);
		this.mountains_mid2.setScrollFactor(0.8, 1);
	}
}

