/**
 * Created by gramp_000 on 3/5/14.
 */
/**
 * Created by gramp_000 on 3/5/14.
 */
function NetworkedUnit() {
    Unit.call(this);
    this.framerate = .35;
    //this.speed = 3;
    //this.originalSpeed = 3;
    this.anims = new createjs.SpriteSheet({
        "animations": {
            "down": [130, 138, "down", this.framerate],
            "up": [104, 112, "up", this.framerate],
            "right": [143, 151, "right", this.framerate],
            "left": [117, 125, "left", this.framerate],
            "attackdown": [170, 176, "attackdown", this.framerate],
            "attackup": [156, 162, "attackup", this.framerate],
            "attackright": [143, 151, "attackright", this.framerate],
            "attackleft": [195, 201, "attackleft", this.framerate]},

        "images": ["assets/hero/body/male/light.png"],

        "frames": {
            "height": 64,
            "width": 64,
            "regX": 10,
            "regY": 15,
            "count": 273

        }
    });


    this.s = new createjs.Sprite(this.anims, this.dir);

    this.gold = 0;

    this.dead = false;
}

NetworkedUnit.prototype = new Unit();
NetworkedUnit.prototype.constructor = NetworkedUnit;

NetworkedUnit.prototype.getFirebaseValue = function (id) {
    return {
        health: this.health,
        weaponAngle: this.weaponAngle,
        isAttacking: this.isAttacking,
        id: id,
        x: this.s.x,
        y: this.s.y,
        xVel: this.xVel,
        yVel: this.yVel,
        jumping: this.jumping
    };
}

NetworkedUnit.prototype.doFirebaseInit = function () {

    this.firebase_root.set({id: this.id});
    this.syncWeapon();
    this.syncPosition();
    this.syncVitals();
    this.syncInventory();
}

NetworkedUnit.prototype.syncWeapon = function () {
    if (this.s) {
        this.fb_weapon.set({
            weaponAngle: this.weaponAngle,
            isAttacking: this.isAttacking
        });
    }
}

NetworkedUnit.prototype.syncPosition = function () {
    if (this.s) {
        this.fb_pos.set({
            x: this.s.x,
            y: this.s.y,
            jumping: this.jumping
        });

        this.fb_veloc.set({
            xVel: this.xVel,
            yVel: this.yVel
        });
    }
};

NetworkedUnit.prototype.syncVitals = function () {
    if (this.s && !this.dead) {
        this.fb_vitals.set({
            hp: this.health
        });
    }
};

NetworkedUnit.prototype.syncInventory = function () {
    if (this.s && !this.dead) {
        this.fb_inventory.set({
            items: [
                {
                    name: "item_1",
                    damage: 420,
                    other_shit: "shit_other"
                },
                {
                    name: "item_2",
                    damage: 666,
                    other_shit: "fuck_balls"
                }
            ],
            gold: 0
        });
    }
}

NetworkedUnit.prototype.equals = function (other_NetworkedUnit) {
    return this.health === other_NetworkedUnit.health &&
        this.weaponAngle === other_NetworkedUnit.weaponAngle &&
        this.isAttacking === other_NetworkedUnit.isAttacking &&
        this.id === other_NetworkedUnit.id &&
        this.s.x === other_NetworkedUnit.x &&
        this.s.y === other_NetworkedUnit.y &&
        this.xVel === other_NetworkedUnit.xVel &&
        this.yVel === other_NetworkedUnit.yVel &&
        this.jumping == other_NetworkedUnit.jumping
};

NetworkedUnit.prototype.DrawLabel = function (stage) {
    var text = new createjs.Text(this.id, "12px Arial", "#ff7700");
    stage.addChild(text);
    text.x = this.s.x + 7;
    text.y = this.s.y - this.s.regY - 35;
};

NetworkedUnit.prototype.EarnLastHit = function () {
    var self = this;

    this.fb_inv_gold.transaction(function (current_value) {
        return current_value + 5;
    }, function (error, committed, snapshot) {
        console.log("sync'd the gold");
        self.gold += 5;
    });
};
