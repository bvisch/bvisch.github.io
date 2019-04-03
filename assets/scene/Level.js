
// You can write more code here

/* START OF COMPILED CODE */

class Level extends Phaser.Scene {
    
    constructor() {
    
        super('Level');
        
    }
    
    _create() {

        var mountains_back = this.add.tileSprite(4480.0, 1344.0, 9000.0, 894.0, 'mountains-back');
        mountains_back.visible = false;
        mountains_back.setScale(1.0, 2.0);
        
        var mountains_mid1 = this.add.tileSprite(4480.0, 1472.0, 9000.0, 770.0, 'mountains-mid1');
        mountains_mid1.visible = false;
        mountains_mid1.setScale(1.0, 2.0);
        
        var mountains_mid2 = this.add.tileSprite(4480.0, 1728.0, 9000.0, 482.0, 'mountains-mid2');
        mountains_mid2.visible = false;
        mountains_mid2.setScale(1.0, 2.0);
        
        this.fMountains_back = mountains_back;
        this.fMountains_mid1 = mountains_mid1;
        this.fMountains_mid2 = mountains_mid2;
        
    }
    
    /* START-USER-CODE */

    create() {
        this.events.off('waypoint_destroyed');
        this.gameWidth = 4000;
        this.gameHeight = 2000;
        
        this.mountains_back = this.add.tileSprite(this.gameWidth/2 - 400, 1344.0, this.gameWidth, 894.0, 'mountains-back');
        this.mountains_back.setScale(1.0, 2.0);
        
        this.mountains_mid1 = this.add.tileSprite(this.gameWidth/2 - 400, 1472.0, this.gameWidth, 770.0, 'mountains-mid1');
        this.mountains_mid1.setScale(1.0, 2.0);
        
        this.mountains_mid2 = this.add.tileSprite(this.gameWidth/2 - 400, 1728.0, this.gameWidth, 482.0, 'mountains-mid2');
        this.mountains_mid2.setScale(1.0, 2.0);

        // this.mountains_back.setScrollFactor(0.5, 0.8);
        // this.mountains_mid1.setScrollFactor(0.55, 0.9);
        // this.mountains_mid2.setScrollFactor(0.6, 1);
        this.mountains_back.setScrollFactor(0.7, 0.8);
        this.mountains_mid1.setScrollFactor(0.75, 0.9);
        this.mountains_mid2.setScrollFactor(0.8, 1);
        
        this._create();


        this.waypoints = [];
        this.leftMostWaypoint = 0;

        this.waypointCount = 7;

        for(var i = 0; i < this.waypointCount; i++) {
            let x_val = ((this.gameWidth - 200)/this.waypointCount * i) + 100;
            let y_val = Phaser.Math.Between(100, this.gameHeight - 100);

            let waypoint = new Waypoint(this.matter.world, x_val, y_val);
            waypoint.setData('index', i);
            this.add.existing(waypoint);
            this.waypoints.push(waypoint);
        }

        this.events.on('waypoint_destroyed', (index) => {
            this.waypoints[index] = null;
            
            var remainingWaypoints = this.waypoints.filter((el) => el !== null);
            this.waypointCount--;
            
            if (this.waypointCount === 0)
            	this.nextScene();
            else
            	this.leftMostWaypoint = remainingWaypoints[0].getData('index');

        }, this);

        this.timer = this.time.addEvent({
            delay: 9999999999*1000
        });

        this.textCoins = this.add.text(300, 700, '', { fontSize: 50, fontStyle: 'bold' });
        this.textCoins.setColor('#FFF');
        this.textCoins.setDepth(3000);
        this.textCoins.setScrollFactor(0.0);

        
        this.graphics = this.add.graphics({ lineStyle: { color: 0xFFFFFF }, fillStyle: { color: 0x2266aa } });
        this.graphics2 = this.add.graphics({ lineStyle: { color: 0xFFFFFF }, fillStyle: { color: 0x2266aa } });
        
        this.matter.world.setBounds(0,0, this.gameWidth, this.gameHeight);
        
        this.cursors = this.input.keyboard.addKeys({
            leftDown: 'S',
            leftUp: 'W',
            rightDown: 'K',
            rightUp: 'O',
            space: 'SPACE'
        });

        this.ship = new Ship(this, 0, 0, 'potogold', null, null, this.cursors);
        this.add.existing(this.ship);
        
        this.cameras.main.startFollow(this.ship);
        this.cameras.main.setZoom(0.5);
        this.cameras.main.setLerp(0.05, 0.05);
        this.cameras.main.setBounds(0, 0, this.gameWidth, this.gameHeight);

        this.colourWheel = Phaser.Display.Color.HSVColorWheel();

        this.numColours = 15;
        this.colours = [];
        for (var i = 1; i < this.numColours; i++) {
            var colourIndex = Phaser.Math.FloorTo((360/this.numColours) * i-1);
            this.colours.push(this.colourWheel[colourIndex].color);
        }
        
        this.rt = this.add.renderTexture(0, 0, this.gameWidth, this.gameHeight);
        this.rt.setAlpha(0.3);
        this.rt.setGlobalAlpha(1.0);
        this.rt.setVisible(false);


        this.fadeRenderTexture = new FadeRenderTexture(this, 0, 0, this.gameWidth, this.gameHeight, this.cursors);
        this.add.existing(this.fadeRenderTexture);
        this.fadeRenderTexture.setAlpha(0.6);
        this.fadeRenderTexture.setGlobalAlpha(0.6);


		this.shipCentre = this.ship.getCenter();
        this.pointer = this.add.triangle(0,0, 20,0, 0,40, 40,40, 0xffff22);
    }

    update() {
        
        var shipRotation = Phaser.Math.Angle.Normalize(this.ship.rotation);
        
        if(this.ship.coins <= 0) {
            this.nextScene();
    	}

        var left = this.ship.left;
        var right = this.ship.right;
        
        this.ship.getCenter(this.shipCentre);
        
        if (this.waypointCount > 0) {
	        var pointerPoint = this.shipCentre.clone();
	        var pointerVector = pointerPoint.subtract(this.waypoints[this.leftMostWaypoint].getCenter()).normalize();
	        pointerVector.scale(130);
	        var pointerPoint = this.shipCentre.subtract(pointerVector);
	        
	        var pointerAngle = Phaser.Math.Angle.BetweenPoints(this.ship.getCenter(), pointerPoint);
	
	        this.pointer.setPosition(pointerPoint.x, pointerPoint.y);
	        this.pointer.setRotation(pointerAngle + Math.PI/2);
        }

        this.textCoins.setText("Coins: " + this.ship.coins);
        
        
        this.graphics.clear();
        this.graphics2.clear();

        for (var i = 1; i < this.numColours; i++) {
            var pointX = Phaser.Math.Interpolation.Linear([right.x, left.x], i/this.numColours);
            var pointY = Phaser.Math.Interpolation.Linear([right.y, left.y], i/this.numColours);
            this.graphics2.fillStyle(this.colours[i-1], 0.6);
            this.graphics2.fillPointShape({x: pointX, y: pointY}, 10);
        }
        
        this.rt.draw(this.graphics2);
        this.fadeRenderTexture.draw(this.graphics2);
        
        if (this.cursors.space.isDown) {
            this.rt.setVisible(true);
            this.rt.setAlpha(1.0);
        }
        
        var scrollX = this.cameras.main.scrollX;
        var scrollY = this.cameras.main.scrollY;
    }


    nextScene() {
        var elapsedSeconds = this.timer.getElapsedSeconds();
        this.rt.ignoreDestroy = true;
        this.mountains_back.ignoreDestroy = true;
        this.mountains_mid1.ignoreDestroy = true;
        this.mountains_mid2.ignoreDestroy = true;
        this.scene.start("Results", {
            cameraScrollX: this.cameras.main.scrollX,
            cameraScrollY: this.cameras.main.scrollY,
            elapsedSeconds: elapsedSeconds,
            gameWidth: this.gameWidth,
            gameHeight: this.gameHeight,
            coins: this.ship.coins,
            maxCoins: 1000,
            waypointsHit: this.waypoints.length - this.waypointCount,
            maxWaypoints: this.waypoints.length,
            rt: this.rt, 
            mountains_back: this.mountains_back,
            mountains_mid1: this.mountains_mid1,
            mountains_mid2: this.mountains_mid2
        });
    }


    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
