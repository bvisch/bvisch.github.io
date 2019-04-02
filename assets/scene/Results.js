class Results extends Phaser.Scene {

	constructor() {
		super('Results');
	}

	init(data) {
		this.coins = data.coins;
		// this.rt = data.rt;
		// this.mountains_back = data.mountains_back;
		// this.mountains_mid1 = data.mountains_mid1;
		// this.mountains_mid2 = data.mountains_mid2;
	}
	
	preload() {
		// pre-load assets
	}
	
	create() {
		this.cameras.main.setZoom(1.0);
		if(this.coins > 0) {
			this.add.text(400, 150, 'You Are Winner!');
		}
		else if(this.coins <= 0) {
			this.add.text(400, 150, 'You Are Loser!');
		}
		this.add.text(400, 300, 'Click to Return');
		this.input.once('pointerup', () => this.scene.start("Start"));
	}
}