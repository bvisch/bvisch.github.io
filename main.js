
window.addEventListener('load', function() {

    var game = new Phaser.Game({
        "title": "ShamRocket",
        "width": 900,
        "height": 600,
        "type": Phaser.AUTO,
        //"backgroundColor": "#697eef",
        "backgroundColor": "#beeeff",
        "physics": {
            "default": "matter", 
            "matter": { "debug": true, "gravity": { "y": 0.8 } }
        }
    });
    game.scene.add("Boot", Boot, true);
    
});

class Boot extends Phaser.Scene {

    preload() {
        this.load.pack("section1", "assets/pack.json");
    }

    create() {
        this.scene.start("Level");
    }

}
