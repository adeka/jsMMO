/**
 * Created by gramp_000 on 3/23/14.
 */
/**
 * Created by gramp_000 on 3/23/14.
 */
function Materia(name) {
    this.type;
    this.slot = "materia";
    this.name = name;
    var s;
    switch (name) {
        case "fire" :
            this.type = "magic";
            this.basePrice = 500;
            this.sellValue = 250;
            s = new createjs.Bitmap("assets/materia/magic_materia.png");
            break;
        case "ice" :
            this.type = "magic";
            this.basePrice = 500;
            this.sellValue = 259;
            s = new createjs.Bitmap("assets/materia/magic_materia.png");
            break;
        case "elemental" :
            this.type = "support";
            this.basePrice = 700;
            this.sellValue = 499;
            s = new createjs.Bitmap("assets/materia/support.png");
            break;
        case "hp absorb" :
            this.type = "support";
            this.basePrice = 1000;
            this.sellValue = 455;
            s = new createjs.Bitmap("assets/materia/support.png");
            break;
        case "magic missile" :
            this.type = "command";
            this.basePrice = 1555;
            this.sellValue = 777;
            s = new createjs.Bitmap("assets/materia/command.png");
            break;
    }

    this.s = s;

}

Materia.prototype.GetIcon = function () {
    return this.s;
}

Materia.prototype.Draw = function (stage) {
    stage.addChild(this.s);
}

