/**
 * Created by gramp_000 on 3/23/14.
 */
function GUI(hero) {
    this.items = [];
    this.slots = [];
    this.showInventory = false;
    this.offset = 0;
    this.currentItem;
    this.inspectionSlot;
    this.lastX;
    this.lastY;


    this.CreateItemSlots();

    var width = 67;
    var height = 100;
    var g = new createjs.Graphics();
    g.beginFill("grey");
    g.rr(0, 0, width, height, 2);
    var bg = new createjs.Shape(g);
    bg.alpha = .2;
    // bg.x = newX;
    //bg.y = newY;
    this.inspectionSlot = bg;
}


GUI.prototype.Click = function (mouseX, mouseY, stage) {
    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i] && this.items[i].isDragging) {
            if (this.items[i].item instanceof Materia && this.slotSprites) {
                for (var j = 0; j < this.slotSprites.length; j++) {
                    var rootX = this.slotSprites[j].s.x + stage.x; //- 400;
                    var rootY = this.slotSprites[j].s.y + stage.y; //- 500;
                    var width = 50;
                    var height = 50;
                    if (mouseX > rootX && mouseX < rootX + width &&
                        mouseY > rootY && mouseY < rootY + height) {
                        //this.items[i].rootSlot = this.slotSprites[j].clone();
                        this.items[i].equippedTo = this.currentItem;
                        this.items[i].slotX = this.slotSprites[j].s.x;
                        this.items[i].slotY = this.slotSprites[j].s.y;
                        this.items[i].slotIndex = this.slotSprites[j].index;
                        this.currentItem.item.materiaSlots[this.slotSprites[j].index].equippedMateria = this.items[i].item;
                        this.currentItem.item.materiaSlots[this.slotSprites[j].index].guiItem = this.items[i];
                        //console.log(this.slotSprites[j].index);
                        //console.log(this.currentItem.item.materiaSlots);

                        this.items[i].isDragging = false;
                        break;
                    }
                }
                var rootX = this.slots[i].x + stage.x; //- 400;
                var rootY = this.slots[i].y + stage.y; //- 500;
                // console.log("rootX: " + rootX + ", rootY: " + rootY + ", mouseX: " + mouseX + ", mouseY: " + mouseY);
                var width = 60;
                var height = 100;
                if (mouseX > rootX && mouseX < rootX + width &&
                    mouseY > rootY && mouseY < rootY + height) {
                    this.items[i].inspected = false;
                    this.items[i].equippedTo = null;
                    this.items[i].rootSlot = this.slots[i];

                    this.currentItem.item.materiaSlots[this.items[i].slotIndex].equippedMateria = null;
                    this.currentItem.item.materiaSlots[this.items[i].slotIndex].guiItem = null;
                    this.items[i].isDragging = false;
                    break;
                }
            }
            else {
                var rootX = this.inspectionSlot.x + stage.x; //- 400;
                var rootY = this.inspectionSlot.y + stage.y; //- 500;
                // console.log("rootX: " + rootX + ", rootY: " + rootY + ", mouseX: " + mouseX + ", mouseY: " + mouseY);
                var width = 60;
                var height = 100;
                if (mouseX > rootX && mouseX < rootX + width &&
                    mouseY > rootY && mouseY < rootY + height &&
                    this.items[i].item.materiaSlots) {
                    //this.items[i].item.materiaSlots) {
                    this.items[i].inspected = true;
                    this.items[i].rootSlot = this.inspectionSlot;
                    this.currentItem = this.items[i];
                    this.items[i].isDragging = false;
                    break;
                }
            }
        }
    }


    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].isDragging) {
            this.items[i].isDragging = false;

            for (var j = 0; j < this.slots.length; j++) {
                var rootX = this.slots[j].x + stage.x; //- 400;
                var rootY = this.slots[j].y + stage.y; //- 500;
                // console.log("rootX: " + rootX + ", rootY: " + rootY + ", mouseX: " + mouseX + ", mouseY: " + mouseY);
                var width = 60;
                var height = 100;
                if (mouseX > rootX && mouseX < rootX + width &&
                    mouseY > rootY && mouseY < rootY + height) {
                    this.items[i].inspected = true;
                    this.items[i].equippedTo = null;
                    this.items[i].rootSlot = this.slots[j];
                    if (this.currentItem && this.currentItem.item.materiaSlots[this.items[i].slotIndex]) {
                        this.currentItem.item.materiaSlots[this.items[i].slotIndex].equippedMateria = null;
                        this.currentItem.item.materiaSlots[this.items[i].slotIndex].guiItem = null;
                    }

                    if (this.items[i] && this.items[i].item === this.currentItem.item) {
                        this.currentItem = null;

                    }
                    //   this.items[j] = this.items[i];
                    //  this.items[i] = null;

                    break;

                }
            }
        }
    }

}

GUI.prototype.Touch = function (mouseX, mouseY, stage) {
    for (var i = 0; i < this.items.length; i++) {
        this.items[i].isDragging = false;
        var rootX = this.items[i].bg.x + stage.x; //- 400;
        var rootY = this.items[i].bg.y + stage.y; //- 500;
        // console.log("rootX: " + rootX + ", rootY: " + rootY + ", mouseX: " + mouseX + ", mouseY: " + mouseY);
        var width = 60;
        var height = 100;
        if (mouseX > rootX && mouseX < rootX + width &&
            mouseY > rootY && mouseY < rootY + height) {
            //console.log("Yea");
            if (this.items[i].item.isEquipped) {
                this.hero.Unequip(this.items[i].item);
            }
            else {
                this.hero.Equip(this.items[i].item);
            }
            break;
        }
    }
}

GUI.prototype.StartDrag = function (mouseX, mouseY, stage) {
    //if (!(this.lastX == mouseX)) {
    for (var i = 0; i < this.items.length; i++) {
        var rootX;
        var rootY;
        // console.log("rootX: " + rootX + ", rootY: " + rootY + ", mouseX: " + mouseX + ", mouseY: " + mouseY);
        var width = 60;
        var height = 100;
        if (this.items[i].equippedTo && this.currentItem && (this.currentItem.item === this.items[i].equippedTo.item)) {
            console.log(this.currentItem.item);
            console.log(this.items[i].equippedTo.item);
            rootX = this.items[i].bgMini.x + stage.x; //- 400;
            rootY = this.items[i].bgMini.y + stage.y; //- 500;
            if (mouseX > rootX && mouseX < rootX + width &&
                mouseY > rootY && mouseY < rootY + height) {
                // console.log("Yea");
                this.items[i].isDragging = true;
                break;
            }
        }
        else if (!this.items[i].equippedTo) {
            rootX = this.items[i].bg.x + stage.x; //- 400;
            rootY = this.items[i].bg.y + stage.y; //- 500;
            if (mouseX > rootX && mouseX < rootX + width &&
                mouseY > rootY && mouseY < rootY + height) {
                // console.log("Yea");
                this.items[i].isDragging = true;
                break;
            }
        }


    }
    // }

}
GUI.prototype.UpdateMove = function (mouseX, mouseY, stage) {
    this.lastX = mouseX;
    this.lastY = mouseY;
    //if(this.items.length > 0)
    for (var i = 0; i < this.items.length; i++) {
        this.items[i].bg.alpha = .2;
        this.items[i].bgMini.alpha = .2;
        var rootX;
        var rootY;
        var width;
        var height;
        if (this.items[i].equippedTo) {
            rootX = this.items[i].bgMini.x + stage.x + 0; //- 400;
            rootY = this.items[i].bgMini.y + stage.y + 0; //- 500;
            width = 40;
            height = 40;
        }
        else {
            rootX = this.items[i].bg.x + stage.x; //- 400;
            rootY = this.items[i].bg.y + stage.y; //- 500;
            width = 80;
            height = 100;
        }


        // console.log("rootX: " + rootX + ", rootY: " + rootY + ", mouseX: " + mouseX + ", mouseY: " + mouseY);

        if (mouseX > rootX && mouseX < rootX + width &&
            mouseY > rootY && mouseY < rootY + height) {
            this.items[i].bg.alpha = .4;
            this.items[i].bgMini.alpha = .4;
        }
    }
}

GUI.prototype.UpdateInventory = function (stage, hero) {
    this.hero = hero;

    //this.items = [];

    var iconWidth = 5;
    var xPos = 0;
    var yPos = 0;
    for (var i = 0; i < this.slots.length; i++) {
        if (i % iconWidth == 0) {
            xPos = 0;
            yPos += 1;
        }
        else {
            xPos += 1;
        }
        var newX = hero.s.x - 395 + xPos * 75;
        var newY = hero.s.y - 360 + yPos * 110;
        this.slots[i].x = newX;
        this.slots[i].y = newY;
    }

    for (var i = 0; i < hero.inventory.length; i++) {
        var exists = false;

        for (var j = 0; j < this.items.length; j++) {
            if (this.items[j].item == hero.inventory[i]) {
                // this.items[j].item = hero.inventory[i];
                // this.items[j].xOffset = newX;
                //this.items[j].yOffset = newY;
                this.items[j].UpdateIcon(hero.inventory[i]);
                exists = true;
            }
        }
        if (!exists) {
            var item = new Item(hero.inventory[i]);
            this.items.push(item);
        }
    }

    for (var i = 0; i < this.slots.length; i++) {
        if (this.items[i + this.offset] && !this.items[i].isDragging && !this.items[i].inspected) {
            this.items[i + this.offset].xOffset = this.slots[i].x;
            this.items[i + this.offset].yOffset = this.slots[i].y;
            this.items[i + this.offset].rootSlot = this.slots[i];
        }
        if (this.items[i] && this.items[i].equippedTo) {
            var s;
            for (var j = 0; j < this.slotSprites.length; j++) {
                if (this.slotSprites[j].index == this.items[i].slotIndex) {
                    s = this.slotSprites[j].s;
                    break;
                }
            }
            if (this.s) {
                var x = s.x
                var y = s.y;
                this.items[i].slotX = x;
                this.items[i].slotY = y;
            }

        }
    }

}

GUI.prototype.Draw = function (stage, hero) {
    if (this.showInventory) {
        this.DrawBackgroundMenus(stage);
        this.DrawMateriaSlots(stage);

        for (var i = 0; i < this.slots.length; i++) {
            // if(this.slots[i])
            stage.addChild(this.slots[i]);
            //if (this.items[i + this.offset])
            //    this.items[i + this.offset].Draw(stage, hero);
        }
        for (var i = 0; i < this.items.length; i++) {
            //if (this.items[i + this.offset])
            this.items[i].Update(stage, this.lastX, this.lastY);
            if (this.items[i].equippedTo && this.items[i].equippedTo === this.currentItem) {
                this.items[i].DrawMini(stage);

            }
            else if (!this.items[i].equippedTo) {
                this.items[i].Draw(stage, hero);

            }
        }


    }
}
GUI.prototype.DrawMateriaSlots = function (stage) {

    if (this.currentItem) {
        // this.currentItem.icon.scaleX = 5;
        //this.currentItem.icon.scaleY = 5;
        this.slotSprites = [];
        var slots = this.currentItem.item.materiaSlots;
        var horzLinks = this.currentItem.item.horzLinks;
        var vertLinks = this.currentItem.item.vertLinks;
        var yOff = 0;
        var xOff = 0;
        for (var i = 0; i < slots.length; i++) {
            xOff++;
            if (i % 3 == 0) {
                yOff += 1;
                xOff = 0;
            }

            if (slots[i]) {
                for (var j = 0; j < vertLinks.length; j++) {
                    if (i == vertLinks[j][0]) {
                        var link = new createjs.Bitmap("assets/materia/vertical_link.png");
                        link.x = this.inspectionSlot.x + 100 + xOff * 45;
                        link.y = this.inspectionSlot.y - 30 + yOff * 45;
                        stage.addChild(link);
                    }
                }
                for (var j = 0; j < horzLinks.length; j++) {
                    if (i == horzLinks[j][0]) {
                        var link = new createjs.Bitmap("assets/materia/horizontal_link.png");
                        link.x = this.inspectionSlot.x + 100 + xOff * 45;
                        link.y = this.inspectionSlot.y - 30 + yOff * 45;
                        stage.addChild(link);
                    }
                }
                // var s = new createjs.Bitmap("assets/materia/slot.png");
                slots[i].s.x = this.inspectionSlot.x + 100 + xOff * 45;
                slots[i].s.y = this.inspectionSlot.y - 30 + yOff * 45;
                slots[i].index = i;
                this.slotSprites.push(slots[i]);

            }
        }

        for (var i = 0; i < this.slotSprites.length; i++) {
            this.slotSprites[i].Draw(stage);
        }
    }
}
GUI.prototype.DrawBackgroundMenus = function (stage) {
    var invWidth = 510;
    var invHeight = 700;

    var g = new createjs.Graphics();
    g.beginFill("dark grey");
    g.rr(0, 0, invWidth, invHeight, 5);
    var roundedMenu = new createjs.Shape(g);
    roundedMenu.alpha = .7;
    roundedMenu.x = hero.s.x - 530;
    roundedMenu.y = hero.s.y - 350;

    var invLabel = new createjs.Text("Inventory", "16px Arial", "#FFFFFF");
    invLabel.x = hero.s.x - 240;
    invLabel.y = hero.s.y - 280;
    stage.addChild(roundedMenu);

    var matWidth = 410;
    var matHeight = 250;
    // Graphics Object to do some drawing with
    var g = new createjs.Graphics();
    g.beginFill("dark grey");
    g.rr(0, 0, matWidth, matHeight, 5);
    var matMenu = new createjs.Shape(g);
    matMenu.alpha = .7;
    matMenu.x = hero.s.x - 15;
    matMenu.y = hero.s.y - 300;

    var matWindowWidth = 280;
    var matWindowHeight = 190;
    // Graphics Object to do some drawing with
    var g = new createjs.Graphics();
    g.beginFill("grey");
    g.rr(0, 0, matWindowWidth, matWindowHeight, 5);
    var matWindow = new createjs.Shape(g);
    matWindow.alpha = .2;
    matWindow.x = hero.s.x + 80;
    matWindow.y = hero.s.y - 250;

    var matLabel = new createjs.Text("Inspect", "16px Arial", "#FFFFFF");
    matLabel.x = hero.s.x + 10;
    matLabel.y = hero.s.y - 280;

    // Add that menu to the stagee
    stage.addChild(matMenu);
    stage.addChild(matWindow);

    var statsWidth = 400;
    var statsHeight = 250;
    // Graphics Object to do some drawing with
    var g = new createjs.Graphics();
    g.beginFill("dark grey");
    g.rr(0, 0, matWidth, matHeight, 5);
    var statsMenu = new createjs.Shape(g);
    statsMenu.alpha = .7;
    statsMenu.x = hero.s.x - 20;
    statsMenu.y = hero.s.y - 10;

    var statsLabel = new createjs.Text("Stats", "16px Arial", "#FFFFFF");
    statsLabel.x = hero.s.x - 0 + invWidth / 2;
    statsLabel.y = hero.s.y;

    stage.addChild(statsMenu);
    stage.addChild(matLabel);
    stage.addChild(statsLabel);
    stage.addChild(invLabel);
    stage.addChild(this.inspectionSlot);
    this.inspectionSlot.x = hero.s.x - 0;
    this.inspectionSlot.y = hero.s.y - 250;
}

GUI.prototype.CreateItemSlots = function () {
    var iconWidth = 5;
    var xPos = 0;
    var yPos = 0;
    for (var i = 0; i < 25; i++) {
        if (i % iconWidth == 0) {
            yPos += 1;
        }
        else {
            xPos += 1;
        }
        var newX = hero.s.x - 340 + xPos * 75;
        var newY = hero.s.y - 340 + yPos * 110;

        var width = 67;
        var height = 100;
        var g = new createjs.Graphics();
        g.beginFill("grey");
        g.rr(0, 0, width, height, 2);
        var bg = new createjs.Shape(g);
        bg.alpha = .2;
        bg.x = newX;
        bg.y = newY;
        this.slots.push(bg);
    }
}