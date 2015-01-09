/**
 * Created by Ain Soph on 3/15/14.
 */
function Hero(id, equipment) {
    this.id = id;
    this.firebase_url = "https://topdownshit-heroes.firebaseio.com/" + this.id;

    NetworkedUnit.call(this);

    this.equipment = { "hair": null, "head": null, "torso": null, "legs": null, "feet": null, "back": null, "arms": null};

    // no equipment means
    this.RefreshFirebaseConnections();

    if (equipment) {
        for (var k in equipment) {
            if (equipment[k]) {
                var equipMe = new Equipment(equipment[k].name ? equipment[k].name : equipment[k]);
                equipMe.slot = k;
                this.Equip(equipMe);
            }
        }
        this.initEquip = false;
    } else {
        this.initEquip = (id == document.cookie);
    }
}

Hero.prototype = new NetworkedUnit();
Hero.prototype.constructor = Hero;

Hero.prototype.RefreshFirebaseConnections = function () {
    this.firebase_url = "https://topdownshit-heroes.firebaseio.com/" + this.id;
    this.firebase_root = new Firebase(this.firebase_url);
    this.fb_vitals = new Firebase(this.firebase_url + '/vitals');
    this.fb_vitals_hp = new Firebase(this.firebase_url + '/vitals/hp');
//    this.fb_vitals_mp = new Firebase(this.firebase_url + '/vitals/mp');
    this.fb_pos = new Firebase(this.firebase_url + '/position');
//    this.fb_pos_x = new Firebase(this.firebase_url + '/position/x');
//    this.fb_pos_y = new Firebase(this.firebase_url + '/position/y');
    this.fb_veloc = new Firebase(this.firebase_url + '/veloc');
    this.fb_veloc_x = new Firebase(this.firebase_url + '/veloc/x');
    this.fb_veloc_y = new Firebase(this.firebase_url + '/veloc/y');
//    this.fb_pos_jumping = new Firebase(this.firebase_url + '/position/jumping');
    this.fb_weapon = new Firebase(this.firebase_url + '/weapon');
    this.fb_inventory = new Firebase(this.firebase_url + '/inventory');
    this.fb_inv_gold = new Firebase(this.firebase_url + '/inventory/gold');
    this.fb_equipment = new Firebase(this.firebase_url + '/equipment');
    this.fb_equip_hair = new Firebase(this.firebase_url + '/equipment/hair');
    this.fb_equip_head = new Firebase(this.firebase_url + '/equipment/head');
    this.fb_equip_torso = new Firebase(this.firebase_url + '/equipment/torso');
    this.fb_equip_legs = new Firebase(this.firebase_url + '/equipment/legs');
    this.fb_equip_feet = new Firebase(this.firebase_url + '/equipment/feet');
    this.fb_equip_back = new Firebase(this.firebase_url + '/equipment/back');
    this.fb_equip_arms = new Firebase(this.firebase_url + '/equipment/arms');
    this.fb_equip_belt = new Firebase(this.firebase_root + '/equipment/belt');
}

Hero.prototype.doFirebaseInit = function () {
    this.firebase_root.set({id: this.id});
    this.syncWeapon();
    this.syncPosition();
    this.syncVitals();
    this.syncInventory();
    this.syncEquipment();
}

Hero.prototype.syncEquipment = function (slot) {
    if (slot) {
        console.log("fb_equip_" + slot + " " + this.equipment[slot].name);
        this["fb_equip_" + slot].set(this.equipment[slot].name);
    } else if (this.initEquip) {
        console.log(this.id + " initEquip: " + this.initEquip);
        var equipment_ids = {
            head: this.equipment.head ? this.equipment.head.name : null,
            hair: this.equipment.hair ? this.equipment.hair.name : null,
            arms: this.equipment.arms ? this.equipment.arms.name : null,
            back: this.equipment.back ? this.equipment.back.name : null,
            feet: this.equipment.feet ? this.equipment.feet.name : null,
            legs: this.equipment.legs ? this.equipment.legs.name : null,
            torso: this.equipment.torso ? this.equipment.torso.name : null
        };

        this.fb_equipment.set(equipment_ids);
    }
};

Hero.prototype.Equip = function (equipment) {

    console.log("fb_equip_" + equipment.slot);

    if (equipment instanceof Weapon) {
        this.weapon = equipment;
    }
    else {
        this.equipment[equipment.slot] = equipment;
    }
    equipment.isEquipped = true;

    equipment && this["fb_equip_" + equipment.slot] ? this["fb_equip_" + equipment.slot].set(equipment.name) : null;
};

Hero.prototype.Unequip = function (equipment) {
    if (equipment instanceof Weapon) {
        this.weapon = null;
    }
    else {
        this.equipment[equipment.slot] = null;
    }

    equipment.isEquipped = false;

    this["fb_equip_" + equipment.slot].set(null);
};

Hero.prototype.Dash = function (mouseX, mouseY) {
    this.isDashing = true;

    // check to see if the difference between these is >= some X
    // if so don't do it
    if (Math.abs(mouseX) > 50)
        this.xVel = this.attackDirX * -.1;

    if (Math.abs(mouseY) > 75)
        this.yVel = this.attackDirY * -.1;

    this.syncPosition();

    var self = this;
    setTimeout(function () {
        self.isDashing = false;
        self.xVel = 0;
        self.yVel = 0;
    }, 450);
};