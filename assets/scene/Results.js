class Results extends Phaser.Scene {

	constructor() {
		super('Results');
	}

	init(data) {
		this.coins = Phaser.Math.Clamp(data.coins, 0, Math.abs(data.coins));
		this.maxCoins = data.maxCoins;
		this.waypointsHit = data.waypointsHit;
		this.maxWaypoints = data.maxWaypoints;
		this.rt = data.rt;
		this.mountains_back = data.mountains_back;
		this.mountains_mid1 = data.mountains_mid1;
		this.mountains_mid2 = data.mountains_mid2;
		this.gameWidth = data.gameWidth;
		this.gameHeight = data.gameHeight;

		this.cameraScrollX = data.cameraScrollX;
		this.cameraScrollY = data.cameraScrollY;

		this.elapsedSeconds = data.elapsedSeconds;
	}
	
	preload() {
		// pre-load assets
	}
	
	create() {
		this.add.existing(this.mountains_back);
		this.add.existing(this.mountains_mid1);
		this.add.existing(this.mountains_mid2);
		this.add.existing(this.rt);
		this.rt.setVisible(true);
		this.rt.setAlpha(0.0);

        this.tweens.add({
        	targets: this.rt,
        	duration: 10000,
        	alpha: 0.8,
        	ease: 'Linear'
        });

        this.canvasWidth = this.game.config.width;
        this.canvasHeight = this.game.config.height;
        
        
        this.messageText = this.add.text(200, 150, '', { 
        	fill: '#E4C',
        	fontFamily: 'Arial', 
        	fontSize: '40px', 
        	fontStyle: 'bold'
        });
        this.returnText = this.add.text(200, 400, '', { 
        	fill: '#FEF',
        	fontFamily: 'Arial', 
        	fontSize: '40px', 
        	fontStyle: 'bold'
        });

		var mainCamera = this.cameras.main;
		// mainCamera.setRenderToTexture('TextureTintPipeline');
        mainCamera.setBounds(0, 0, this.gameWidth, this.gameHeight);
        mainCamera.setScroll(this.cameraScrollX, this.cameraScrollY);
        // mainCamera.tint = 0xE0E0E0;
		mainCamera.zoomTo(this.canvasHeight/this.gameHeight, 2000);
		mainCamera.ignore(this.messageText);
		mainCamera.ignore(this.returnText);
		
		this.textCamera = this.cameras.add(mainCamera.x, mainCamera.y, mainCamera.width, mainCamera.height);
		this.textCamera.ignore(this.mountains_back);
		this.textCamera.ignore(this.mountains_mid1);
		this.textCamera.ignore(this.mountains_mid2);
		this.textCamera.ignore(this.rt);

		this.panLeft();

		this.scoreSeconds = Phaser.Math.Clamp(this.elapsedSeconds - 20, 0, 120);
		this.score = ((this.coins/this.maxCoins) * 50) + ((this.waypointsHit/this.maxWaypoints) * 50) - ((this.scoreSeconds/120) * 50);
		
		if(this.coins > 0) {
			this.message = 'You win!';
		}
		else if(this.coins <= 0) {
			this.message = 'You lost';
		}

		this.message += "\nCoins:     " + this.coins + "/" + this.maxCoins
					  + "\nWaypoints: " + this.waypointsHit + "/" + this.maxWaypoints
					  + "\nTime:      " + this.elapsedSeconds.toFixed(2) + " seconds"
					  + "\nScore:     " + this.score.toFixed(0) + "/100";

		this.messageText.setText(this.message);

		this.time.addEvent({
			delay: 2000,
		    callback: () => {
		    	this.returnText.setText('Press any key to play again');
		    	this.input.keyboard.once('keyup', () => { 
					this.scene.start('Level');
				});
			},
		    callbackScope: this,
		    loop: false
		});
	}

	panRight() {
		this.cameras.main.pan(this.gameWidth-this.canvasWidth/2, this.gameHeight/2, 6000, 'Sine.easeInOut');
		this.cameras.main.once('camerapancomplete', () => {
			this.panLeft();
		});
	}

	panLeft() {
		this.cameras.main.pan(this.canvasWidth/2, this.gameHeight/2, 6000, 'Sine.easeInOut');
		this.cameras.main.once('camerapancomplete', () => {
			this.panRight();
		});
	}
}