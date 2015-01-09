/**
 * Created by gramp_000 on 3/5/14.
 */
function NPC(type, id) {
    this.id = type + "_" + id
    this.firebase_url = "https://topdownshit-npcs.firebaseio.com/" + this.id;
    this.xVel = 0;
    this.yVel = 0;

    // call super constructor after having id
    NetworkedUnit.call(this);

    this.wanderTimerCap = 100 + Math.random() * 100;
    this.wanderTimer = 250;
    this.wanderX = 0;
    this.wanderY = 0;
    this.visible = false;

    this.manager = null;

    switch (type) {
        case "bunny" :
            //this.originalSpeed = 5;
            this.speed = .35;
            this.anims = new createjs.SpriteSheet({
                "animations": {
                    "down": [0, 2, "down", this.framerate],
                    "left": [3, 5, "left", this.framerate],
                    "right": [6, 8, "right", this.framerate],
                    "up": [9, 11, "up", this.framerate]},

                "images": ["assets/bunny.png"],

                "frames": {
                    "height": 31,
                    "width": 31,
                    "regX": 0,
                    "regY": -12,
                    "count": 12

                }
            });
            break;
        case "deer" :
            this.speed = .7;
            this.anims = new createjs.SpriteSheet({
                "animations": {
                    "down": [0, 2, "down", this.framerate],
                    "left": [3, 5, "left", this.framerate],
                    "right": [6, 8, "right", this.framerate],
                    "up": [9, 11, "up", this.framerate]},

                "images": ["assets/deer.png"],

                "frames": {
                    "height": 32,
                    "width": 32,
                    "regX": -4,
                    "regY": -9,
                    "count": 12

                }
            });
            break;
        case "wolf" :
            this.speed = .9;
            this.anims = new createjs.SpriteSheet({
                "animations": {
                    "down": [0, 2, "down", this.framerate],
                    "left": [3, 5, "left", this.framerate],
                    "right": [6, 8, "right", this.framerate],
                    "up": [9, 11, "up", this.framerate]},

                "images": ["assets/wolf.png"],

                "frames": {
                    "height": 35,
                    "width": 36,
                    "regX": 0,
                    "regY": -7,
                    "count": 12

                }
            });
            break;
        case "fish" :
            this.aquatic = true;
            this.speed = .5;
            this.anims = new createjs.SpriteSheet({
                "animations": {
                    "down": [0, 2, "down", this.framerate],
                    "left": [3, 5, "left", this.framerate],
                    "right": [6, 8, "right", this.framerate],
                    "up": [9, 11, "up", this.framerate]},

                "images": ["assets/fish.png"],

                "frames": {
                    "height": 31,
                    "width": 31,
                    "regX": 0,
                    "regY": -7,
                    "count": 12

                }
            });
            break;
    }

    this.s = new createjs.Sprite(this.anims, this.dir);

    this.firebase_url = "https://topdownshit-npcs.firebaseio.com/" + this.id;
    this.firebase_root = new Firebase(this.firebase_url);
    this.fb_vitals = new Firebase(this.firebase_url + '/vitals');
    this.fb_vitals_hp = new Firebase(this.firebase_url + '/vitals/hp');
//    this.fb_vitals_mp = new Firebase(this.firebase_url + '/vitals/mp');
    this.fb_pos = new Firebase(this.firebase_url + '/position');
    this.fb_pos_x = new Firebase(this.firebase_url + '/position/x');
    this.fb_pos_y = new Firebase(this.firebase_url + '/position/y');
    this.fb_veloc = new Firebase(this.firebase_url + '/veloc');
    this.fb_veloc_x = new Firebase(this.firebase_url + '/veloc/x');
    this.fb_veloc_y = new Firebase(this.firebase_url + '/veloc/y');
    this.fb_pos_jumping = new Firebase(this.firebase_url + '/position/jumping');
    this.fb_weapon = new Firebase(this.firebase_url + '/weapon');
    this.fb_inventory = new Firebase(this.firebase_url + '/inventory');
    this.fb_inv_gold = new Firebase(this.firebase_url + '/inventory/gold');

    this.fb_manager = new Firebase(this.firebase_url + '/manager');
}

NPC.prototype = new NetworkedUnit();
NPC.prototype.constructor = NPC;

NPC.prototype.SetManager = function (id) {
    if (this.manager != id) {
        this.manager = id;
        this.fb_manager.set({id: id});
    }
};

NPC.prototype.Wander = function () {
    var sleepChance;
    if (this.wanderTimer <= this.wanderTimerCap) {
        this.wanderTimer++;
    }
    if (this.GetColH()) {
        this.wanderX = -this.wanderX;
        this.wanderY = -this.wanderY;
        // console.log("col");
        this.wanderTimer += 25;
        //NPC.prototype.Jump();
        //this.jumping = true;
        //this.Jump();

    }
    if (this.wanderTimer >= 100) {
        //console.log("reset");
        this.wanderTimer = 0;
        this.wanderTimerCap = 100 + Math.random() * 100;
        sleepChance = Math.random();
        if (sleepChance > .75) {
            this.wanderX = this.s.x;
            this.wanderY = this.s.y;
        } else {
            this.wanderX = this.s.x + ( 1.0 - Math.random() * 2.0) * 300;
            this.wanderY = this.s.y + ( 1.0 - Math.random() * 2.0) * 300;
        }
    }


    if (sleepChance > .75) {
        this.xVel = 0;
        this.yVel = 0;
    } else {
        var wanderVecX = this.wanderX - this.s.x;
        var wanderVecY = this.wanderY - this.s.y;
        this.xVel = wanderVecX / 300 / this.speed;
        this.yVel = wanderVecY / 300 / this.speed;
    }

    var self = this;

    this.manager = hero.id;
    this.fb_pos.transaction(function (snapshot) {
        return {
            x: self.wanderX,
            y: self.wanderY
        }
    });
    this.fb_veloc.transaction(function (snapshot) {
        return {
            xVel: self.xVel,
            yVel: self.yVel
        }
    });
};
