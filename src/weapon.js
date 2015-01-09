/**
 * Created by gramp_000 on 3/23/14.
 */
function Weapon(name) {
    this.isEquipped = false;
    this.slot = "weapon";
    this.name = name;
    var s;

    switch (name) {
        case "axe" :
            this.basePrice = 145;
            this.sellValue = 90;
            s = new createjs.Bitmap("assets/weapons/axe.png");

            break;
        case "handAxe" :
            this.basePrice = 170;
            this.sellValue = 100;
            s = new createjs.Bitmap("assets/weapons/handaxe.png");
            this.materiaSlots = [
                new MateriaSlot(), null, null,
                new MateriaSlot(), new MateriaSlot(), null,
                null, new MateriaSlot(), new MateriaSlot()
            ];
            this.vertLinks = [

            ];
            this.horzLinks = [
                [3, 4],
                [7, 8]
            ];
            break;
        case "steelAxe" :
            this.basePrice = 220;
            this.sellValue = 150;
            s = new createjs.Bitmap("assets/weapons/steelaxe.png");
            this.materiaSlots = [
                new MateriaSlot(), null, null,
                new MateriaSlot(), new MateriaSlot(), new MateriaSlot(),
                null, new MateriaSlot(), null
            ];
            this.vertLinks = [
                [0, 3]
            ];
            this.horzLinks = [
                [4, 5]
            ];
            break;
        case "chainsaw" :
            this.basePrice = 1000;
            this.sellValue = 850;
            s = new createjs.Bitmap("assets/weapons/chainsaw.png");

            break;
        case "steelSword" :
            this.basePrice = 300;
            this.sellValue = 220;
            s = new createjs.Bitmap("assets/weapons/steelsword.png");
            this.materiaSlots = [
                null, null, null,
                new MateriaSlot(), new MateriaSlot(), new MateriaSlot(),
                new MateriaSlot(), new MateriaSlot(), new MateriaSlot()
            ];
            this.vertLinks = [

            ];
            this.horzLinks = [
                [3, 4],
                [4, 5]
            ];
            break;
        case "greatSword" :
            this.basePrice = 1245;
            this.sellValue = 685;
            s = new createjs.Bitmap("assets/weapons/greatsword.png");
            this.materiaSlots = [
                null, new MateriaSlot(), null,
                null, new MateriaSlot(), null,
                new MateriaSlot(), new MateriaSlot(), new MateriaSlot()
            ];
            this.vertLinks = [
                [1, 4]
            ];
            this.horzLinks = [
                [6, 7],
                [7, 8]
            ];
            break;
        case "halberd" :
            this.basePrice = 1450;
            this.sellValue = 700;
            s = new createjs.Bitmap("assets/weapons/halberd.png");
            this.materiaSlots = [
                null, new MateriaSlot(), new MateriaSlot(),
                null, new MateriaSlot(), null,
                new MateriaSlot(), new MateriaSlot(), null
            ];
            this.vertLinks = [
                [1, 4],
                [4, 7]
            ];
            this.horzLinks = [
                [1, 2],
                [6, 7]
            ];
            break;
    }

    this.s = s;

}

Weapon.prototype.GetIcon = function () {
    return this.s;
}

Weapon.prototype.Draw = function (stage, weaponAngle, dir, rootSprite) {
    stage.addChild(this.s);

    this.s.regX = -0;
    this.s.regY = -0;

    this.s.x = rootSprite.x + 20;
    this.s.y = rootSprite.y - rootSprite.regY + 25;

    // this.weapon.set({skewY: 20});
    //this.weapon.set({skewX: 50});
    // this.weapon.set({scaleX :.5 + this.attackTimer});
    var offset = 0;
    if (dir == "right") {
        this.s.set({scaleX: -1});
        offset = 35;
    } else {
        this.s.set({scaleX: 1});
        offset = 135;
    }

    this.s.set({rotation: offset + weaponAngle * 180 / Math.PI});

}

