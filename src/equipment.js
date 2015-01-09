/**
 * Created by gramp_000 on 3/17/14.
 */
/**
 * Created by gramp_000 on 3/14/14.
 */
function Equipment(name) {
    this.droppable = true;
    this.dropped = false;
    this.isEquipped = false;
    this.framerate = .35;
    this.dir = "right";
    this.name = name;
    switch (name) {
        case "longSleeve" :
            this.basePrice = 100;
            this.sellValue = 50;
            this.slot = "torso";
            this.path = "torso/shirts/longsleeve/male/brown_longsleeve.png";
            break;
        case "tealPants" :
            this.basePrice = 135;
            this.sellValue = 70;
            this.slot = "legs";
            this.path = "legs/pants/male/teal_pants_male.png";
            break;
        case "clothHood" :
            this.basePrice = 450;
            this.sellValue = 350;
            this.slot = "head";
            this.path = "head/hoods/male/cloth_hood_male.png";
            this.materiaSlots = [
                null, null, null,
                new MateriaSlot(), new MateriaSlot(), new MateriaSlot(),
                null, null, null
            ];
            this.vertLinks = [

            ];
            this.horzLinks = [
                [3, 4],
                [4, 5]
            ];
            break;
        case "brunetteHair" :
            this.basePrice = 1000;
            this.sellValue = 0;
            this.slot = "hair";
            this.path = "hair/male/plain/brunette2.png";
            break;
        case "blackShoes" :
            this.basePrice = 100;
            this.sellValue = 50;
            this.slot = "feet";
            this.path = "feet/shoes/male/black_shoes_male.png";
            break;
        case "whiteBelt" :
            this.basePrice = 500;
            this.sellValue = 350;
            this.slot = "belt";
            this.path = "belt/cloth/male/white_cloth_male.png";
            break;
        case "redBandana" :
            this.basePrice = 155;
            this.sellValue = 145;
            this.slot = "head";
            this.path = "head/bandanas/male/red.png";
            break;
        case "chainmailHat" :
            this.basePrice = 555;
            this.sellValue = 355;
            this.slot = "head";
            this.path = "head/helms/male/chainhat_male.png";
            break;
        case "leatherCap" :
            this.basePrice = 600;
            this.sellValue = 350;
            this.slot = "head";
            this.path = "head/caps/male/leather_cap_male.png";
            break;
        case "leatherPlate" :
            this.basePrice = 700;
            this.sellValue = 350;
            this.slot = "torso";
            this.path = "torso/leather/chest_male.png";
            break;
        case "chainmail" :
            this.basePrice = 1000;
            this.sellValue = 500;
            this.slot = "torso";
            this.path = "torso/chain/mail_male.png";
            break;
        case "bracers" :
            this.basePrice = 200;
            this.sellValue = 50;
            this.slot = "arms";
            this.path = "hands/bracers/male/leather_bracers_male.png";
            this.materiaSlots = [
                new MateriaSlot(), null, new MateriaSlot(),
                new MateriaSlot(), null, new MateriaSlot(),
                null, null, null
            ];
            this.vertLinks = [
                [0, 3],
                [2, 5]
            ];
            this.horzLinks = [

            ];
            break;

    }

    this.anims = new createjs.SpriteSheet({
        "animations": {
            "down": [130, 138, "down", this.framerate],
            "up": [104, 112, "up", this.framerate],
            "right": [143, 151, "right", this.framerate],
            "left": [117, 125, "left", this.framerate]},

        "images": ["assets/hero/" + this.path],

        "frames": {
            "height": 64,
            "width": 64,
            "regX": 10,
            "regY": 15,
            "count": 273

        }
    });
    this.s = new createjs.Sprite(this.anims, this.dir);
}
Equipment.prototype.GetIcon = function () {
    return this.s;
}
Equipment.prototype.Draw = function (stage, unit) {
    this.Animate(unit);
    this.s.regY = unit.s.regY;
    this.s.x = unit.s.x;
    this.s.y = unit.s.y;
    stage.addChild(this.s);
}

Equipment.prototype.Face = function (dir) {
    // Fixes the animation freeze on from previous stop()
    if (dir == "stop") {
        if (this.dir != "stop") {
            this.s.gotoAndPlay(this.dir);
        }
    }
    else {
        this.dir = dir;
        var x = this.s.x, y = this.s.y;
        this.s = new createjs.Sprite(this.anims, dir);
        this.s.x = x;
        this.s.y = y;
    }
}
Equipment.prototype.Animate = function (unit) {
    if (Math.abs(unit.yVel) > Math.abs(unit.xVel)) {
        if (unit.yVel > 0) {
            if (this.dir != "down") {
                this.Face("down");
            }
        }
        else if (unit.yVel < 0) {
            if (this.dir != "up") {
                this.Face("up");
            }
        }
    }
    if (Math.abs(unit.xVel) > Math.abs(unit.yVel)) {
        if (unit.xVel > 0) {
            if (this.dir != "right") {
                this.Face("right");
            }
            this.sideDir = "right";
        }
        else if (unit.xVel < 0) {
            if (this.dir != "left") {
                this.Face("left");

            }
            this.sideDir = "left";
        }
    }
    //stop
    if (unit.xVel == 0 && unit.yVel == 0) {
        this.Face("stop");
    }
}