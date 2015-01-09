function Decal(type) {
    this.type = type;
    this.isDrawn = false;
    this.passable = false;
    var s;
    this.rando = Math.random() * 2;
    switch (type) {
        case 0:
            s = new createjs.Bitmap("assets/brownchest.gif");
            this.xOffset = 10;
            this.yOffset = 0;
            break;
        case 1:
            s = new createjs.Bitmap("assets/tree.png");
            var rand = Math.random() + .8;
            //setTransform ( [x=0]  [y=0]  [scaleX=1]  [scaleY=1]  [rotation=0]  [skewX=0]  [skewY=0]  [regX=0]  [regY=0] )
            s.setTransform(0, 0, rand, rand, 0, 0, 0, 25, 80);
            this.xOffset = 25;
            this.yOffset = 30;
            break;
        case 2:
            var rand = Math.random() / 2 + .8;
            s = new createjs.Bitmap("assets/rock.png");
            s.setTransform(0, 0, rand, rand, 0, 0, 0, 10, 60);
            this.xOffset = 10;
            this.yOffset = 10;
            break;
        case 3:
            var rand = Math.random() / 2 + .9;
            s = new createjs.Bitmap("assets/pine.png");
            s.setTransform(0, 0, rand, rand, 0, 0, 0, 20, 80);
            this.xOffset = 25;
            this.yOffset = 30;
            break;
        case 4:
            this.passable = true;
            //var rand = Math.random() / 2 + .9;
            s = new createjs.Bitmap("assets/grass_decal.png");
            s.setTransform(0, 0, 1, 1, 0, 0, 0, 0, 80);
            this.xOffset = 0;
            this.yOffset = 30;
            break;
    }
    this.s = s;
    this.Use = function Use() {
        //
    }
    this.Update = function Update() {
        if (this.type == 1 || this.type == 3 || this.type == 4) {
            // s.set({regX : 25, regY : 100});
            s.set({skewX: -1 + Math.sin((counter) / 25 + this.rando) * 3});
            s.set({skewY: -1 + Math.sin((counter) / 10 + this.rando) * 2});
        }
    }
}