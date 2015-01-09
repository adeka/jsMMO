/**
 * Created by gramp_000 on 3/2/14.
 */
function Tile(type) {
    this.xPos = 0;
    this.yPos = 0;
    this.xOffset = 0;
    this.yOffset = 0;
    this.colYOffset = 0;
    this.type = type;
    var s;
    this.isDrawn = false;
    this.rando = Math.random() * 2;
    this.ready = false;
    this.water = new createjs.SpriteSheet({
        "animations": {
            "center": [0, 3, "center", .009]
        },
        "images": ["assets/water2.png"],
        "frames": {
            "height": 50,
            "width": 50,
            "regX": 0,
            "regY": 0,
            "count": 4
        }
    });
    /*
     this.ss = new createjs.SpriteSheet({
     "animations": {
     "grass": [65, 65, "grass", 0],
     "dirt": [0, 0, "dirt", 0],
     "ground": [10, 10, "ground", 0],
     "stone": [40, 40, "stone", 0],
     "sand": [70, 70, "sand", 0],
     "darkGrass": [71, 71, "darkGrass", 0]
     },
     "images": ["assets/tileset.png"],
     "frames": {
     "height": 50,
     "width": 50,
     "regX": 0,
     "regY": 0,
     "count": 72
     }
     });

     this.darkGrassCorners = new createjs.SpriteSheet({
     "animations": {
     "bottomRight": [22, 22, "bottomRight", 0],
     "bottomLeft": [20, 20, "bottomLeft", 0],
     "topRight": [10, 10, "topRight", 0],
     "topLeft": [8, 8, "topLeft", 0],
     "cross": [3, 3, "cross", 0],
     "isolated": [2, 2, "isolated", 0],
     "center": [71, 71, "center", 0]
     },
     "images": ["assets/tileset.png"],
     "frames": {
     "height": 50,
     "width": 50,
     "regX": 0,
     "regY": 0,
     "count": 72
     }
     });
     this.darkGrassHorizontal = new createjs.SpriteSheet({
     "animations": {
     "right": [16, 16, "cross", 0],
     "left": [14, 14, "isolated", 0]
     },
     "images": ["assets/offsetTileset.png"],
     "frames": {
     "height": 50,
     "width": 50,
     "regX": 0,
     "regY": 0,
     "count": 72
     }
     });
     this.darkGrassVertical = new createjs.SpriteSheet({
     "animations": {
     "top": [11, 11, "dirt", 0],
     "bottom": [17, 17, "ground", 0]
     },
     "images": ["assets/horizontalOffsetTileset.png"],
     "frames": {
     "height": 50,
     "width": 50,
     "regX": 0,
     "regY": 0,
     "count": 72
     }
     });

     */

    switch (type) {
        case -1:
            break;
        case 0:
            s = new createjs.Bitmap("assets/grass.png");
            // this.yOffset = 0;
            //this.colYOffset = -15;
            //s = new createjs.Sprite(this.ss, "grass");
            break;
        case 1:
            s = new createjs.Bitmap("assets/dark_grass.png");
            s.set({regY: -22});
            this.yOffset = -22;
            this.colYOffset = 0;
            break;
        case 2:
            s = new createjs.Bitmap("assets/dirt.png");
            s.set({regY: -47});
            this.yOffset = -47;
            this.colYOffset = -40;
            //s = new createjs.Sprite(this.ss, "darkGrass");
            break;
        case 3:
            //s = new createjs.Bitmap("assets/water.png");
            s = new createjs.Sprite(this.water, "center");
            s.set({alpha: 1, regX: 0, regY: -60});
            this.yOffset = -60;
            this.colYOffset = 0;
            break;
        case 4:
            s = new createjs.Bitmap("assets/tall.png");
            s.set({regY: 25});
            this.yOffset = 25;
            this.colYOffset = 15;
            break;
        case 5:
            s = new createjs.Bitmap("assets/cementblock.png");
            //s.set({regY: 25});
            //this.yOffset = 25;
            //this.colYOffset = 15;
            break;
        case 6:
            s = new createjs.Bitmap("assets/tallstone.png");
            //s.set({regY: 25});
            //this.yOffset = 25;
            //this.colYOffset = 15;
            break;
        case 7:
            s = new createjs.Bitmap("assets/sandstone.png");
            //s.set({regY: 25});
            //this.yOffset = 25;
            //this.colYOffset = 15;
            break;
        case 8:
            s = new createjs.Bitmap("assets/dirtblock.png");
            s.set({regY: -47});
            this.yOffset = -47;
            this.colYOffset = -40;
            //s.set({regY: 25});
            //this.yOffset = 25;
            //this.colYOffset = 15;
            break;
    }
    this.s = s;
    this.ready = true;
    //this.s.set({regX : 0});
    this.Draw = function Draw(stage) {
        if (this.ready) stage.addChild(this.s);
    }
    this.SetSprite = function SetSprite(dir) {
        if (dir == "topLeft") {
            this.s = new createjs.Sprite(this.darkGrassCorners, "topLeft");
        }
    }
    this.AddDecal = function AddDecal(decal) {
        this.decal = decal;
        decal.s.x = s.x + decal.xOffset;
        decal.s.y = s.y + decal.yOffset - this.yOffset;

    }

    this.UseDecal = function UseDecal() {
        this.decal.Use();
        this.decal = null;
    }
    this.Update = function Update() {

        //alpha oscillation for water tiles
        if (this.type == 3) {
            s.set({alpha: .3 + Math.sin((counter) / 50 + this.rando) / 20});
        }
    }

}