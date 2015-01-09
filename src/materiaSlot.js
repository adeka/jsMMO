/**
 * Created by gramp_000 on 3/25/14.
 */
function MateriaSlot() {
    this.type;
    this.name;
    this.equippedMateria;
    this.guiItem;
    this.s = new createjs.Bitmap("assets/materia/slot.png");
    this.index;

}

MateriaSlot.prototype.GetIcon = function () {
    return this.s;
}

MateriaSlot.prototype.Draw = function (stage, x, y) {
    stage.addChild(this.s);
}

