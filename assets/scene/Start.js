class Start extends Phaser.Scene {
	
	constructor() {
		super('Start');
	}
	
	preload() {
		// pre-load assets
	}
	
	create() {
		// create background & sprites
		this.add.image(450, 200, 'title');
		this.add.text(300, 500, 'Press any key to start', { fill: '#000', fontFamily: 'Arial', fontSize: '30px' });
		this.input.keyboard.once('keyup', () => this.scene.start('Level'));
		this.add.image(200, 300, 'leftthrust');
		this.add.image(550, 300, 'rightthrust');
		this.add.image(200, 400, 'leftreversethrust');
		this.add.image(550, 400, 'rightreversethrust');
		this.add.text(250, 285, 'Left Thrust', { fill: '#000', fontFamily: 'Arial', fontSize: '24px' });
		this.add.text(600, 285, 'Right Thrust', { fill: '#000', fontFamily: 'Arial', fontSize: '24px' });
		this.add.text(250, 385, 'Left Reverse Thrust', { fill: '#000', fontFamily: 'Arial', fontSize: '24px' });
		this.add.text(600, 385, 'Right Reverse Thrust', { fill: '#000', fontFamily: 'Arial', fontSize: '24px' });
	}
}
