/**
 * Created by gramp_000 on 3/14/14.
 */

function Item(item) {
    this.equippedTo = null;
    this.inspected = false;
    this.isDragging = false;
    this.item = item;
    this.icon;
    this.bg;
    this.eq;
    this.name;
    this.rootSlot;
    this.slotIndex = 0;
    this.slotX = 0;
    this.slotY = 0;
    var width = 67;
    var height = 100;
    var g = new createjs.Graphics();

    g.beginFill("grey");
    g.rr(0, 0, width, height, 2);
    this.bg = new createjs.Shape(g);
    this.bg.alpha = .2;

    var g2 = new createjs.Graphics();

    g2.beginFill("grey");
    g2.rr(0, 0, 30, 40, 2);
    this.bgMini = new createjs.Shape(g2);
    this.bgMini.alpha = .2;

    if (item.materiaSlots) {
        this.slotIcon = new createjs.Bitmap("assets/materia/empty_icon.png");
        this.slotIcon.scaleX = .75;
        this.slotIcon.scaleY = .75;
        this.slotIconFull = new createjs.Bitmap("assets/materia/full_icon.png");
        this.slotIconFull.scaleX = .75;
        this.slotIconFull.scaleY = .75;
    }


    // Add that menu to the stagee
    this.icon = item.GetIcon().clone();
    if (item instanceof Materia) {
        this.slot = new createjs.Text(item.type, "12px Arial", "#FFFFFF");

    }
    else {
        this.slot = new createjs.Text(item.slot, "12px Arial", "#FFFFFF");

    }
    this.name = new createjs.Text(item.name, "12px Arial", "#FFFFFF");
    this.value = new createjs.Text(item.sellValue + " gold", "12px Arial", "gold");
}
Item.prototype.Return = function () {

}
Item.prototype.UpdateIcon = function (item) {
    this.icon = item.GetIcon().clone();
    this.icon.regX = 0;
    this.icon.regY = 0;
    this.icon.rotation = 0;
    this.icon.skewY = 0;
    this.icon.skewX = 0;
    this.icon.scaleX = 1;
}

Item.prototype.Update = function (stage, x, y) {
    if (this.isDragging) {
        this.xOffset = x - stage.x - 40;
        this.yOffset = y - stage.y - 40;
        this.slotX = x - stage.x - 15;
        this.slotY = y - stage.y - 15;
    }
    else {
        // var xOrigin = this.xOffset - this.rootSlot.x;
        // var yOrigin = this.yOffset - this.rootSlot.y;
        this.xOffset = this.rootSlot.x;
        this.yOffset = this.rootSlot.y;
    }

}

Item.prototype.Draw = function (stage, hero) {

    if (this.item == hero.equipment[this.item.slot] || (this.item instanceof Weapon && this.item == hero.weapon)) {
        this.eq = new createjs.Text("EQUIPPED", "10px Arial", "aquamarine");
        this.eq.x = this.bg.x + 5;
        this.eq.y = this.bg.y + 55;

    }
    else {
        this.eq = new createjs.Text("", "10px Arial", "white");
        this.eq.x = this.bg.x + 5;
        this.eq.y = this.bg.y + 55;
    }

    stage.addChild(this.bg);
    stage.addChild(this.icon);
    stage.addChild(this.eq);
    stage.addChild(this.name);
    stage.addChild(this.slot);
    stage.addChild(this.value);


    var x = this.xOffset;
    var y = this.yOffset;

    var xOffset = 12;
    var yOffset = 20;
    if (this.item.slot == "head") yOffset = 25;
    if (this.item.slot == "legs") yOffset = 10;
    if (this.item.slot == "feet") yOffset = 0;
    if (this.item.slot == "hair") yOffset = 30;
    if (this.item.slot == "materia") {
        yOffset = 27;
        xOffset = 25;
    }

    if (this.slotIcon && this.slotIconFull) {
        var hasMateria = false;
        if (this.item.materiaSlots) {
            for (var i = 0; i < this.item.materiaSlots.length; i++) {
                if (this.item.materiaSlots[i] && this.item.materiaSlots[i].equippedMateria) {
                    hasMateria = true;
                }
            }
        }
        if (hasMateria) {
            this.slotIconFull.x = x + 50;
            this.slotIconFull.y = y + 50;
            stage.addChild(this.slotIconFull);
        }
        else {
            this.slotIcon.x = x + 50;
            this.slotIcon.y = y + 50;
            stage.addChild(this.slotIcon);
        }

    }

    this.bg.x = x;
    this.bg.y = y;
    this.icon.x = x + xOffset;
    this.icon.y = y + yOffset;
    this.slot.x = x + 5;
    this.slot.y = y + 70;
    this.name.x = x + 5;
    this.name.y = y;
    this.value.x = x + 5;
    this.value.y = y + 86;
}
Item.prototype.DrawMini = function (stage) {
    stage.addChild(this.bgMini);
    stage.addChild(this.icon);
    stage.addChild(this.name);

    var x = this.slotX;
    var y = this.slotY;

    var xOffset = 3;
    var yOffset = 2;
    this.bgMini.x = x;
    this.bgMini.y = y;

    this.icon.x = x + xOffset;
    this.icon.y = y + yOffset;
    this.name.x = x + 8;
    this.name.y = y + 30;
}

