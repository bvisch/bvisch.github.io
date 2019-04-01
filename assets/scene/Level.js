
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
        
        var fruit = this.add.image(1408.0, 320.0, 'character', 'fruit');
        
        var fruit_1 = this.add.image(705.44775, 1169.7168, 'character', 'fruit');
        
        var fruit_2 = this.add.image(6080.0, 768.0, 'character', 'fruit');
        
        var fruit_4 = this.add.image(7360.0, 1216.0, 'character', 'fruit');
        
        var fruit_5 = this.add.image(3776.0, 704.0, 'character', 'fruit');
        
        var fruit_6 = this.add.image(2321.3452, 1460.023, 'character', 'fruit');
        
        var fruit_3 = this.add.image(5056.0, 1216.0, 'character', 'fruit');
        
        this.fMountains_back = mountains_back;
        this.fMountains_mid1 = mountains_mid1;
        this.fMountains_mid2 = mountains_mid2;
        this.fFruit = fruit;
        this.fFruit_1 = fruit_1;
        this.fFruit_2 = fruit_2;
        this.fFruit_4 = fruit_4;
        this.fFruit_5 = fruit_5;
        this.fFruit_6 = fruit_6;
        this.fFruit_3 = fruit_3;
        
    }
    
    /* START-USER-CODE */

    create() {
    
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
        

        
        
        this.textAngle = this.add.text(10, 10);
        this.textForce = this.add.text(10, 50);
        this.textVelocity = this.add.text(10, 90);
        this.textCoins = this.add.text(1500, 1500);

        
        this.graphics = this.add.graphics({ lineStyle: { color: 0xFFFFFF }, fillStyle: { color: 0x2266aa } });
        this.graphics2 = this.add.graphics({ lineStyle: { color: 0xFFFFFF }, fillStyle: { color: 0x2266aa } });
        
        this.coins = 10000;
        
        this.matter.world.setBounds(0,0, this.gameWidth, this.gameHeight);
        
        this.cursors = this.input.keyboard.createCursorKeys();

        this.ship = new Ship(this.matter.world, 400, 200, 'fruit', null, null, this.cursors);
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
        this.fadeRenderTexture.setAlpha(0.8);
        this.fadeRenderTexture.setGlobalAlpha(0.8);
        
        // this.rt2 = this.add.renderTexture(0, 0, this.gameWidth, this.gameHeight);
        // this.rt2.setAlpha(0.3);
        // this.rt2.setGlobalAlpha(0.3);
        // this.rt2.setVisible(false);
        
        // this.rt3 = this.add.renderTexture(0, 0, this.gameWidth, this.gameHeight);
        // this.rt3.setAlpha(0.3);
        // this.rt3.setGlobalAlpha(0.3);
    }

    update() {
        
        var shipRotation = Phaser.Math.Angle.Normalize(this.ship.rotation);
        
        if (shipRotation > Math.PI/2 - Math.PI/32 && shipRotation < (3*Math.PI)/2 + Math.PI/32)
            this.coins -= 1;
        
        var left = this.ship.getBottomLeft();
        var right = this.ship.getBottomRight();
        var angularVelocity = this.ship.body.angularVelocity;
        var forceMagnitude = 0.08;
        var force = { 
            x: forceMagnitude * -Math.sin(shipRotation + Math.PI), 
            y: forceMagnitude * Math.cos(shipRotation + Math.PI)
        }

        this.textCoins.setText("Coins " + this.coins);
        this.textAngle.setText("Angle " + shipRotation.toFixed(3));
        this.textForce.setText("Left " + left.x.toFixed(3) + " " + left.y.toFixed(3));
        this.textVelocity.setText("Angular Velocity " + angularVelocity.toFixed(3));
        
        var leftDifference = new Phaser.Math.Vector2(-60, 20);
        var rightDifference = new Phaser.Math.Vector2(60, 20);
        
        var rotation = new Phaser.Math.Matrix3();
        
        rotation.rotate(shipRotation);
        leftDifference.transformMat3(rotation);
        rightDifference.transformMat3(rotation);
        
        left.add(leftDifference);
        right.add(rightDifference);
        
        // var angle = Phaser.Math.Angle.Normalize((this.ship.rotation*2) + (Math.PI));
        // angle = Phaser.Math.Clamp(angle, 0.5, (2 * Math.PI - 0.5));
        
        // var lerpValue = angle / (2 * Math.PI);

        // var pointX = Phaser.Math.Interpolation.Linear([right.x, left.x], lerpValue);
        // var pointY = Phaser.Math.Interpolation.Linear([right.y, left.y], lerpValue);
        // var point = { x: pointX, y: pointY };
        
        // var rightingForceMagnitude = 0.2;
        // var rightingForce = { 
        //  x: rightingForceMagnitude * Math.sin(shipRotation + Math.PI), 
        //  y: rightingForceMagnitude * -Math.cos(shipRotation + Math.PI)
        // }
        
        //this.ship.applyForceFrom(point, rightingForce);
        
        // var negForce = { x: -force.x, y: -force.y };
        
        
        
        
        
        var direction = new Phaser.Math.Vector2(this.ship.body.velocity);
        // direction.normalize();
        
        // var lineStartPoint = new Phaser.Geom.Point(1500, 2000);
        var lineStartPoint = this.ship.body.position;
        var lineEndPoint = new Phaser.Geom.Point(lineStartPoint.x + direction.x*100, lineStartPoint.y + direction.y*100);
        var line = new Phaser.Geom.Line(lineStartPoint.x, lineStartPoint.y, lineEndPoint.x, lineEndPoint.y);
        
        direction.normalize();
        var tempY = direction.y;
        direction.y = direction.x;
        direction.x = tempY;
        
        direction.scale(10);
        
        this.graphics.clear();
        this.graphics2.clear();
        // this.graphics2.strokeLineShape(line);
        
        this.graphics.fillPointShape(left, 30);
        this.graphics.fillPointShape(right, 30);
        // this.graphics.fillPointShape(point, 40);


        
        
        // var shipPosition = new Phaser.Math.Vector2(this.ship.body.position);
        // shipPosition.subtract(direction).subtract(direction);
        
        // for (var i = 1; i < 8; i++) {
        //  var colourIndex = Phaser.Math.FloorTo((360/8) * i-1);
        //  var colourObject = this.colourWheel[colourIndex];
        //  this.graphics2.fillStyle(colourObject.color, 0.2);
        //  this.graphics2.fillPointShape(shipPosition, 10);
        //  shipPosition.add(direction);
        // }

        for (var i = 1; i < this.numColours; i++) {
            var pointX = Phaser.Math.Interpolation.Linear([right.x, left.x], i/this.numColours);
            var pointY = Phaser.Math.Interpolation.Linear([right.y, left.y], i/this.numColours);
            this.graphics2.fillStyle(this.colours[i-1], 0.6);
            this.graphics2.fillPointShape({x: pointX, y: pointY}, 10);
        }
        
        this.rt.draw(this.graphics2);
        this.fadeRenderTexture.draw(this.graphics2);
        
        // this.rt3.clear();
        // this.rt3.draw([this.rt2, this.graphics2], null, null, 0.1);
        // this.rt2.draw(this.rt3, null, null, 0.1);
        
        if (this.cursors.space.isDown) {
            this.rt.setVisible(true);
            this.rt.setAlpha(1.0);
        }
        
        var scrollX = this.cameras.main.scrollX;
        var scrollY = this.cameras.main.scrollY;
    }


    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here


        // var fruit = new Waypoint(this.matter.world, 371.2782, 266.19022)
        // this.add.existing(fruit)
        
        // var fruit_1 = new Waypoint(this.matter.world, 705.44775, 1169.7168)
        // this.add.existing(fruit_1)
        
        // var fruit_2 = new Waypoint(this.matter.world, 2230.903, 795.8898)
        // this.add.existing(fruit_2)
        
        // var fruit_3 = new Waypoint(this.matter.world, 2640.9067, 1905.3119)
        // this.add.existing(fruit_3)
        
        // var fruit_4 = new Waypoint(this.matter.world, 1037.0685, 2526.3472)
        // this.add.existing(fruit_4)
        
        // var fruit_5 = new Waypoint(this.matter.world, 1646.0447, 1670.1626)
        // this.add.existing(fruit_5)
        
        // var fruit_6 = new Waypoint(this.matter.world, 2321.3452, 2460.023)
        // this.add.existing(fruit_6)
        
        // this.fFruit = fruit;
        // this.fFruit_1 = fruit_1;
        // this.fFruit_2 = fruit_2;
        // this.fFruit_3 = fruit_3;
        // this.fFruit_4 = fruit_4;
        // this.fFruit_5 = fruit_5;
        // this.fFruit_6 = fruit_6;

