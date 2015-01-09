// Unit = ring.create({
//     test_v : 5,
//     test_f: function() {
//         console.log("DICK FACE MCGEEZACKS");
//     }
// });

// Hero = ring.create([Unit], {
//     test_f : function() {
//         this.$super();
//         console.log("AWW YISS");
//     }
// });

function Unit() {

    this.inventory = [];
    this.attackDirX = 0;
    this.attackDirY = 0;
    this.dead = false;
    this.health = 100;
    this.maxHealth = 100;
    this.beingAttacked = false;
    this.attackTimer = 0;
    this.isAttacking = false;
    this.weaponAngle = 0;
    this.framerate = .075;
    this.yVel = 0;
    this.xVel = 0;
    this.isDrawn = false;
    this.jumping = false;
    this.falling = false;
    this.isDashing = false;
    this.jumpCounter = 0;
    this.dir = "right";
    this.currentType = 0;
    this.currentTile;
    this.lastTile;
    this.yOffset = 0;
    this.incY = 0;
    this.curOpacity = 1.0;
    this.drowning = false;
    this.sideDir = "right";
    this.originalSpeed = 1.6;
    this.speed = this.originalSpeed;
    this.nextTile;
    this.colH = false;
    this.colV = false;
    this.aquatic = false;
    this.newY = 0;
    this.shadow = new createjs.Bitmap("assets/shadow.png");
    this.updated = false;
    this.weapon;

    this.healthbar = new createjs.Bitmap("assets/healthbar.png");
    this.bgHealthbar = new createjs.Bitmap("assets/bghealthbar.png");

}
Unit.prototype.Update = function () {
    if (this.health <= 0) {
        this.dead = true;
    }
    /*
     if (!this.aquatic) {
     this.CheckDrowning();
     }
     */
    if (!this.drowning) {
        this.Animate();
        this.CalculateJump();
        this.CalculatePosition();
    }
}
Unit.prototype.Jump = function () {
    this.jumping = true;
}
Unit.prototype.CheckDrowning = function () {
    if (this.currentType == 3 && !this.jumping && !this.falling) {
        // this.drowning = true;
    }
    if (!this.jumping && !this.falling) {
        this.lastTile = this.currentTile;
    }
    if (this.curOpacity <= .1 && this.lastTile) {
        // this.rootStage.x += Math.abs(this.s.x - this.lastTile.s.x);
        // this.rootStage.y -= Math.abs(this.s.y - this.lastTile.s.y);
        this.drowning = false;
        this.jumping = false;
        this.falling = false;
        this.s.y = this.lastTile.s.y;
        this.s.x = this.lastTile.s.x;
        this.currentType = this.lastTile.type;
        this.s.set({alpha: 1});
        this.curOpacity = 1.0;
        this.shadow.set({alpha: 1});
        this.speed = this.originalSpeed;
    }

    if (this.drowning && this.currentType == 3) {
        this.curOpacity -= .05;
        this.s.y += 1;
        this.s.set({alpha: this.curOpacity});
        this.shadow.set({alpha: 0});
        this.speed = 0;
        this.xVel = 0;
        this.yVel = 0;
    }
}
Unit.prototype.Face = function (dir) {
    /*
     if(this.isAttacking){
     var x = this.s.x, y = this.s.y;
     this.s = new createjs.Sprite(this.anims, "attackup");
     this.s.x = x;
     this.s.y = y;
     //this.dir = "attack"+dir;
     }
     else{
     */
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
Unit.prototype.Animate = function () {

    if (Math.abs(this.yVel) > Math.abs(this.xVel)) {
        if (this.yVel > 0) {
            if (this.dir != "down") {
                this.Face("down");
            }
        }
        else if (this.yVel < 0) {
            if (this.dir != "up") {
                this.Face("up");
            }
        }
    }
    if (Math.abs(this.xVel) > Math.abs(this.yVel)) {
        if (this.xVel > 0) {
            if (this.dir != "right") {
                this.Face("right");
            }
            this.sideDir = "right";
        }
        else if (this.xVel < 0) {
            if (this.dir != "left") {
                this.Face("left");

            }
            this.sideDir = "left";
        }
    }
    //stop
    if (this.xVel == 0 && this.yVel == 0) {
        this.Face("stop");
    }

}
Unit.prototype.CalculatePosition = function () {

    this.s.set({regY: this.newY + this.incY});
    this.shadow.set({regY: this.yOffset});
    this.shadow.x = this.s.x - 5;
    this.shadow.y = this.s.y;
    //actually moving the hero
    if (!this.falling) {
        if (!this.colH) {
            this.s.x += this.xVel;
        }
        if (!this.colV) {
            this.s.y += this.yVel;
        }
    }
    else {
        this.s.x += this.xVel;
        this.s.y += this.yVel;
    }

    this.colH = false;
    this.colV = false;
}
Unit.prototype.CalculateJump = function () {
    if (this.incY < this.yOffset) {
        this.incY += 3;
        this.falling = true;
    }
    if (this.incY > this.yOffset) {
        this.incY -= 3;
    }
    if (this.incY == this.yOffset) {
        this.falling = false;
    }

    if (this.jumpCounter >= 15) {
        this.falling = true;
    }
    if (this.jumpCounter >= 31) {
        this.jumping = false;
        this.jumpCounter = 0;
        this.falling = false;
    }
    if (this.jumping) {

        this.jumpCounter++;
        // this.s.y++;
        this.newY = Math.sin(this.jumpCounter / 10) * 35;
        // this.s.set({regY : this.newY});

    }
}

Unit.prototype.CheckTilePair = function (tile, nextTile) {
    if (
        ((this.s.x + 18 < tile.s.x + 50) &&
            (this.s.x + 18 + 0 > tile.s.x - 0)) &&
        ((this.s.y + 45 < tile.s.y + 75 ) &&
            (this.s.y + 45 > tile.s.y + 0))
        ) {
        this.currentType = tile.type;
        this.currentTile = tile;
        this.nextTile = nextTile;
        this.yOffset = tile.yOffset;
    }
}

Unit.prototype.Draw = function (tile, stage) {
    this.isDrawn = false;
    if (tile == this.nextTile) {
        if (!this.isDrawn && !this.dead) {
            stage.addChild(this.shadow);

            if (this.weaponAngle > 0 && this.weaponAngle < 180) {
                this.DrawWeapon(stage);
                stage.addChild(this.s);
                this.DrawEquipment(stage);
            }
            else {
                stage.addChild(this.s);
                this.DrawEquipment(stage);
                this.DrawWeapon(stage);
            }

            this.DrawHealthbar(stage);
            this.isDrawn = true;
        }
    }
}
Unit.prototype.GetColH = function () {
    return this.colH;
}
Unit.prototype.SetPosition = function (x, y) {
    this.s.x = x;
    this.s.y = y;
}
Unit.prototype.SetVelocity = function (xVel, yVel) {
    this.xVel = xVel;
    this.yVel = yVel;
}
Unit.prototype.SetJumping = function (jumping) {
    this.jumping = jumping;
}
Unit.prototype.TakeDamage = function (damage) {
    this.health -= damage;
    if (this.health <= 0) {
        this.dead = true;
    }
}

Unit.prototype.DrawEquipment = function (stage) {
    for (var k in this.equipment) {
        if (this.equipment[k])
            this.equipment[k].Draw(stage, this);
    }
}
Unit.prototype.DrawWeapon = function (stage) {
    if (this.isAttacking) {
        this.attackTimer++;
        if (this.weapon)
            this.weapon.Draw(stage, this.weaponAngle, this.dir, this.s);
    }
    if (this.attackTimer > 20) {
        this.attackTimer = 0;
        this.isAttacking = false;
    }

}

Unit.prototype.UpdateWeaponAngle = function (x, y) {
    var xDir = 400 - x;
    var yDir = 300 - y;
    this.weaponAngle = Math.atan2(yDir, xDir);

    if (this instanceof Hero && this.id === hero.id) {
        var self = this;
        this.fb_weapon.transaction(function (current_value) {
            return {
                weaponAngle: self.weaponAngle,
                isAttacking: self.isAttacking
            };
        });
    }

    if (xDir > 40)
        xDir = 40;
    if (yDir > 40)
        yDir = 40;

    if (xDir < -40)
        xDir = -40;
    if (yDir < -40)
        yDir = -40;

    this.attackDirX = xDir;
    this.attackDirY = yDir;
}

Unit.prototype.DrawHealthbar = function (stage) {
    stage.addChild(this.bgHealthbar);
    stage.addChild(this.healthbar);

    this.bgHealthbar.x = this.s.x - 5;
    this.bgHealthbar.y = this.s.y - this.s.regY - 15;
    this.healthbar.x = this.s.x - 5;
    this.healthbar.y = this.s.y - this.s.regY - 15;

    this.healthbar.scaleX = this.health / this.maxHealth;
}

Unit.prototype.CheckUnitHit = function (unit) {
    if (this.weapon) {
        var self = this;
        var dx = this.weapon.s.x - this.attackDirX;
        var dy = this.weapon.s.y - this.attackDirY;
        var hx = unit.s.x + 15;
        var hy = unit.s.y + 48 - unit.yOffset;
        var distance = Math.sqrt(Math.pow(dx - hx, 2) + Math.pow(dy - hy, 2));
        if (distance < 45 && this.attackTimer > 5) {
            //unit.KnockBack( -this.attackDirX,this.attackDirY);
            AddStrikeEffect(unit.s.x - 15, unit.s.y - unit.yOffset);
            unit.fb_vitals_hp.transaction(function (_hp) {
                return _hp - 3;
            }, function (error, committed, snapshot) {
                if (committed) {
                    unit.TakeDamage(3);
                    if (unit.dead) {
                        console.log('killed the unit');
                        if (unit instanceof NPC) {
                            npcsRef.child(unit.id).remove();
                        }
                        if (self instanceof Hero && hero.equals(self.getFirebaseValue(self.id))) {
                            console.log("hero killed a unit");
                            self.EarnLastHit();
                        }
                    }
                }
            });
        }
    }
};

Unit.prototype.KnockBack = function (dx, dy) {
    //this.xVel += dx / 20;
    //this.yVel += dy / 20;
}


Unit.prototype.Equip = function (equipment) {
    if (equipment instanceof Weapon) {
        this.weapon = equipment;
    }
    else {
        this.equipment[equipment.slot] = equipment;
    }
    equipment.isEquipped = true;
}
Unit.prototype.Unequip = function (equipment) {
    if (equipment instanceof Weapon) {
        this.weapon = null;
    }
    else {
        this.equipment[equipment.slot] = null;
    }
    equipment.isEquipped = false;
}
/**
 * Created by gramp_000 on 3/2/14.
 */
Unit.prototype.CheckTileCollision = function (tile) {

    /*
     // if (this.currentTile && Math.abs(this.currentTile.yOffset - tile.yOffset) > 25) {
     if(tile.type == 3 && !this.jumping){
     if (((this.s.x + 18 + this.xVel < tile.s.x + 50) &&
     (this.s.x + 18 + this.xVel > tile.s.x - 0)) &&
     ((this.s.y < tile.s.y ) &&
     (this.s.y > tile.s.y - 50 ))) {
     this.colH = true;
     }
     if (((this.s.x + 18 < tile.s.x + 50) &&
     (this.s.x + 18 > tile.s.x - 0)) &&
     ((this.s.y + this.yVel < tile.s.y ) &&
     (this.s.y + this.yVel > tile.s.y - 50 ))) {
     this.colV = true;
     }
     }


     var aquaticOffset = 0;
     if (this.aquatic) aquaticOffset = 60;
     if ((tile.type == 0 && this.aquatic) ||
     (tile.type == 2 && this.aquatic) ||
     (tile.type == 4 && this.aquatic) ||
     (!this.aquatic &&
     (tile.type == 3 && !this.jumping && !this.drowning)
     || ((tile.yOffset > this.yOffset) && !this.jumping)
     )) {
     if (((this.s.x + 18 + this.xVel < tile.s.x + 50 + aquaticOffset / 2) &&
     (this.s.x + 18 + this.xVel > tile.s.x - 0 - aquaticOffset / 2)) &&
     ((this.s.y < tile.s.y + tile.colYOffset + aquaticOffset ) &&
     (this.s.y > tile.s.y - 50 ))) {
     this.colH = true;
     }
     if (((this.s.x + 18 < tile.s.x + 50 + aquaticOffset / 2) &&
     (this.s.x + 18 > tile.s.x - 0 - aquaticOffset / 2)) &&
     ((this.s.y + this.yVel < tile.s.y + tile.colYOffset + aquaticOffset ) &&
     (this.s.y + this.yVel > tile.s.y - 50 ))) {
     this.colV = true;
     }
     }
     */

}
Unit.prototype.CheckDecalCollision = function (tile) {
    /*
     var dx = tile.decal.s.x - tile.decal.xOffset;
     var dy = tile.decal.s.y - tile.decal.yOffset - 25 + tile.yOffset;
     var hx = this.s.x;
     var hy = this.s.y;
     var vhx = this.s.x + this.xVel;
     var vhy = this.s.y + this.yVel;
     var distance = Math.sqrt(Math.pow(dx - hx, 2) + Math.pow(dy - hy, 2));
     var xdistance = Math.sqrt(Math.pow(dx - vhx, 2) + Math.pow(dy - hy, 2));
     var ydistance = Math.sqrt(Math.pow(dx - hx, 2) + Math.pow(dy - vhy, 2));
     if (xdistance < 25) {
     this.colH = true;
     }
     if (ydistance < 25) {
     this.colV = true;
     }
     if (distance <= 25) {
     //caught
     //this.s.y += 2;
     }
     */
}