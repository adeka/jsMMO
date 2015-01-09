/**
 * Created by gramp_000 on 3/2/14.
 */
var canvas;
var stage;
var hero;
//var moving = false;

var effect;
// var wolf;
var allNPCs = {};
var allUnits = {};
var allHeroes = {};
var KEYCODE_ENTER = 13;
var KEYCODE_SPACE = 32;
var KEYCODE_UP = 38;
var KEYCODE_LEFT = 37;
var KEYCODE_RIGHT = 39;
var KEYCODE_W = 87;
var KEYCODE_S = 83;
var KEYCODE_A = 65;
var KEYCODE_D = 68;
var KEYCODE_F = 70;
var KEYCODE_I = 73;
var right = false, down = false;
var counter = 0;
var chunks = [];
var activeChunks = [];
var simplex = new SimplexNoise();
var simplex2 = new SimplexNoise();
var mapSize = 10;
var busy = false;
var mapGenerated = false;
var mouseX = 0, mouseY = 0;
var heroesRef = new Firebase("https://topdownshit-heroes.firebaseio.com/");
var messagesRef = new Firebase("https://topdownshit-chat.firebaseio.com/");
var npcsRef = new Firebase("https://topdownshit-npcs.firebaseio.com/");
var heroId;
var messageFocus = false;
var loggedIn = false;
var gui;

document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;

function init() {

    if (document.cookie != "") {
        document.getElementById("nameInput").value = document.cookie;
        heroId = document.cookie;
        loggedIn = true;
        console.log(allHeroes[heroId]);
        if (allHeroes[heroId]) {
            hero = allHeroes[heroId];
            console.log(hero);
        }
        else
            hero = new Hero(heroId, null);
    } else {
        heroId = Object.keys(allHeroes).length;
        hero = new Hero(heroId, null);
    }

    canvas = document.getElementById('myCanvas');
    canvas.onkeyup = handleKeyUp;
    canvas.onkeydown = handleKeyDown;

    /*
     stage.mouseMoveOutside = true;
     stage.on("stagemousemove", function (evt) {


     //console.log("stageX/Y: "+evt.stageX+","+evt.stageY); // always in bounds
     //console.log("rawX/Y: "+evt.rawX+","+evt.rawY); // could be < 0, or > width/height
     });

     stage.on("stagemousedown", function (evt) {
     //mouseX = evt.stageX;
     // mouseY = evt.stageY;
     // gui.StartDrag(mouseX, mouseY, stage);
     // hero.isAttacking = true;
     //console.log("down"); // always in bounds
     //console.log("rawX/Y: "+evt.rawX+","+evt.rawY); // could be < 0, or > width/height
     });
     stage.on("stagemouseup", function (evt) {
     //gui.Click(mouseX, mouseY, stage);
     // mouseX = evt.stageX;
     // mouseY = evt.stageY;
     // hero.isAttacking = false;
     //console.log("down"); // always in bounds
     //console.log("rawX/Y: "+evt.rawX+","+evt.rawY); // could be < 0, or > width/height
     });
     */

    var $h = Hammer;
    var doubletap = $h(canvas).on("doubletap", function (event) {
        hero.Dash(event.gesture.center.clientX + spawnOffset, event.gesture.center.clientY + spawnOffset);
    });
    var dragstart = $h(canvas).on("dragstart", function (event) {
        mouseX = event.gesture.center.clientX;//evt.stageX;
        mouseY = event.gesture.center.clientY;// evt.stageY;
        gui.StartDrag(mouseX, mouseY, stage);
    });
    var dragend = $h(canvas).on("dragend", function (event) {
        mouseX = event.gesture.center.clientX;//evt.stageX;
        mouseY = event.gesture.center.clientY;// evt.stageY;
        gui.Click(mouseX, mouseY, stage);
    });
    var drag = $h(canvas).on("drag", function (event) {
        mouseX = event.gesture.center.clientX;//evt.stageX;
        mouseY = event.gesture.center.clientY;// evt.stageY;

        gui.UpdateMove(mouseX, mouseY, stage);

    });
    var hold = $h(canvas).on("hold", function (event) {
        mouseX = event.gesture.center.clientX;//evt.stageX;
        mouseY = event.gesture.center.clientY;// evt.stageY;

        gui.Touch(mouseX, mouseY, stage);

    });
    var touch = $h(canvas).on("touch", function (event) {
        hero.isAttacking = true;

    });
    var release = $h(canvas).on("release", function (event) {
        hero.isAttacking = false;

    });
    var swiperight = $h(canvas).on("swiperight", function (event) {
        if (!gui.showInventory) gui.showInventory = true;
        else gui.showInventory = false;

    });


    width = canvas.width;
    height = canvas.height;
    var spawnOffset = -400;
    stage = new createjs.Stage(canvas);
    //hero = new NPC("deer");

    var items = [];
    items.push("longSleeve");
    items.push("tealPants");
    items.push("clothHood");
    items.push("blackShoes");
    items.push("brunetteHair");

    items.push("whiteBelt");
    items.push("chainmailHat");
    items.push("leatherCap");
    items.push("leatherPlate");
    items.push("bracers");

    for (var i = 0; i < items.length; i++) {
        var item = new Equipment(items[i]);
        hero.inventory.push(item);
    }

    var chainsaw = new Weapon("chainsaw");
    var steelSword = new Weapon("steelSword");
    var halberd = new Weapon("halberd");
    var greatSword = new Weapon("greatSword");
    var handAxe = new Weapon("handAxe");
    var axe = new Weapon("axe");
    var steelAxe = new Weapon("steelAxe");
    var fire_materia = new Materia("fire");
    var ice_materia = new Materia("ice");
    var hp_absorb = new Materia("hp absorb");
    var elemental = new Materia("elemental");
    var magic_missle = new Materia("magic missile");
    /*
     hero.Equip(items[0]);
     hero.Equip(items[1]);
     hero.Equip(items[2]);
     hero.Equip(items[3]);
     hero.Equip(items[4]);
     hero.Equip(axe);
     */

    hero.inventory.push(axe);
    hero.inventory.push(handAxe);
    hero.inventory.push(steelSword);
    hero.inventory.push(halberd);
    hero.inventory.push(greatSword);
    hero.inventory.push(steelAxe);
    hero.inventory.push(chainsaw);
    hero.inventory.push(fire_materia);
    hero.inventory.push(ice_materia);
    hero.inventory.push(hp_absorb);
    hero.inventory.push(elemental);
    hero.inventory.push(magic_missle);

    //hero.rootStage = stage;
    hero.s.x = -spawnOffset + 400;
    hero.s.y = -spawnOffset + 400;
    // stage.addChild(hero);
    // units.push(hero);
    // var b = new NPC("bunny");
    // b.s.x = -spawnOffset + 400;
    //b.s.y = -spawnOffset + 400;
    //units.push(b);

    hero.doFirebaseInit();

    //heroesRef.child(heroId).set(hero.getFirebaseValue(heroId));
    allHeroes[heroId] = hero;

    stage.alpha = 1;
    stage.x = spawnOffset;
    stage.y = spawnOffset;


    //start game timer
    if (!createjs.Ticker.hasEventListener("tick")) {
        createjs.Ticker.addEventListener("tick", tick);
    }
    //createjs.Ticker.setInterval(1);
    createjs.Ticker.setFPS(60);

    GenerateMap();

    gui = new GUI(hero);

    //console.log("done");
    for (var i = 0; i < mapSize * mapSize * 100; i++) {
        //AsyncUpdate();
    }
    //stage.update();
// chunks[0].units.push(allUnits[0]);
}
function SpawnAnimal(type) {
    for (var j = 0; j < 50; j++) {
        var rand1 = Math.random() * mapSize * 10 * 50;
        var rand2 = Math.random() * mapSize * 10 * 50;
        // for (var i = 0; i < 3; i++) {
        var animal = new NPC(type, j);

        if (!Object.keys(allUnits).contains(animal.id)) {
            allUnits[animal.id] = animal;
            animal.doFirebaseInit();
        }
//        animal.syncPosition();
//        animal.syncVitals();
        // }

        allNPCs[animal.id] = animal;
    }
}
function GenerateMap() {
    var chunkCount = mapSize * mapSize;
    var xOrigin = -10, yOrigin = -10;
    for (var i = 0; i < chunkCount; i++) {
        if (i % mapSize == 0) {
            xOrigin = -10;
            yOrigin += 10;
        }
        else {
            xOrigin += 10;
        }
        GenerateChunk(i, xOrigin, yOrigin);
    }
}
function GenerateChunk(i, xOrigin, yOrigin) {
    setTimeout(
        function () {
            //if(!busy){
            // busy = true;
            //console.log("making chunk" + i);
            var chunk = new Chunk(stage, simplex, simplex2, xOrigin, yOrigin);
            chunks[i] = chunk;
            //console.log(chunks.length);
            Update();
            // }

        }, 100
    );
}

function UpdateHeroIfChanged(pre_update_hero) {
    if (hero && !hero.equals(pre_update_hero)) {
        hero.fb_pos.transaction(function (current_value) {
            return {
                x: hero.xVel + current_value.x,
                y: hero.yVel + current_value.y,
                jumping: hero.jumping
            };
        });
    }
}

//main update loop
function tick(event) {
    var pre_update_hero = JSON.parse(JSON.stringify(hero.getFirebaseValue(hero.id)));

    Update();

    UpdateHeroIfChanged(pre_update_hero);
}

function UpdateHeroesAndComplete() {
    completeUnits = allUnits;
    for (var k in allHeroes) {
        allHeroes[k].Update();
        if (!Object.keys(completeUnits).contains(k)) {
            completeUnits[k] = allHeroes[k];
        }
    }
}

function DrawChunks() {
    for (var i = 0; i < chunks.length; i++) {
        //for (var j = 0; j < allUnits.length; j++) {
        if (chunks[i].ContainsUnit(hero)) {
            // if (allUnits[j] instanceof Hero && chunks[i].ContainsUnit(allUnits[j])) {
            //draw top and adjacent chunks
            if (i - this.mapSize >= 0) activeChunks.push(chunks[i - mapSize]);
            if (i - this.mapSize + 1 >= 0) activeChunks.push(chunks[i - mapSize + 1]);
            if (i - this.mapSize - 1 >= 0) activeChunks.push(chunks[i - mapSize - 1]);
            //draw current and adjacent chunks
            if (i - 1 >= 0) activeChunks.push(chunks[i - 1]);
            if (i + 1 < chunks.length - 1) activeChunks.push(chunks[i + 1]);
            activeChunks.push(chunks[i]);
            //draw bottom and adjacent chunks
            if (i + this.mapSize - 1 <= chunks.length - 1) activeChunks.push(chunks[i + mapSize - 1]);
            if (i + this.mapSize <= chunks.length - 1) activeChunks.push(chunks[i + mapSize]);
            if (i + this.mapSize + 1 <= chunks.length - 1) activeChunks.push(chunks[i + mapSize + 1]);
        }
        // }
    }
}

function ShowActiveUnitsAndUpdateChunks() {
    for (var i = 0; i < activeChunks.length; i++) {
        for (var j in completeUnits) {
            if (activeChunks[i].ContainsUnit(completeUnits[j])) {
                if (completeUnits[j] instanceof NPC) {
                    completeUnits[j].visible = true;
                    if (completeUnits[j].manager == null) {
                        completeUnits[j].SetManager(hero.id);
                    }
                }
                if (!activeChunks[i].units.contains(completeUnits[j])) {
                    activeChunks[i].units.push(completeUnits[j]);
                    //console.log("pushing");
                }
            }
            else if (activeChunks[i].units.contains(completeUnits[j])) {
                //var index = chunks[i].units.indexOf(allUnits[j]);
                //chunks[i].units.splice(index, 1);
                activeChunks[i].units = [];
                if (completeUnits[j] instanceof NPC) {
                    console.log('instance of npc ' + completeUnits[j].id);
                    completeUnits[j].SetManager(null);
                }
            }
        }
        activeChunks[i].Update();
    }
}


function CheckAttackingAndWander() {
    for (var i in completeUnits) {
        if (completeUnits[i].isAttacking) {
            for (var j in completeUnits) {
                if ((!completeUnits[j].dead) && completeUnits[i] != completeUnits[j])
                    completeUnits[i].CheckUnitHit(completeUnits[j]);
            }
        }

        if (completeUnits[i] instanceof NPC && completeUnits[i].visible && completeUnits[i].manager) {
            if (completeUnits[i].manager == hero.id) {
                if (!completeUnits[i].dead) {
                    completeUnits[i].Update();
                    completeUnits[i].Wander();
                }
            }
        }
    }
}

function DrawHeroLabel() {
    for (var k in allHeroes) {
        allHeroes[k].DrawLabel(stage);
    }
}

function DoEffectsOnFrame() {
    if (effect && effect.currentAnimationFrame < 6) {
        stage.addChild(effect);
    }
}

function Update() {
    //hero.DrawWeapon(stage, mouseX, mouseY);
    gui.UpdateInventory(stage, hero);

    // console.log(chunks.length*chunks[0].tiles.length);
    counter++;

    for (var k in allUnits) {
        if (allUnits[k] instanceof NPC) {
            allUnits[k].visible = false;
        }
    }

    // clear the active chunks
    activeChunks = [];

    UpdateHeroesAndComplete();

    DrawChunks();

    ShowActiveUnitsAndUpdateChunks();

    CheckAttackingAndWander();

    DrawHeroLabel();

    DoEffectsOnFrame();

    hero.UpdateWeaponAngle(mouseX, mouseY);

    gui.Draw(stage, hero);
    // update the stage itself
    stage.update();

    // center the camera
    CenterScreen();

    // get ready for next frame
    stage.removeAllChildren();

}
//allow for WASD and arrow control scheme
function handleKeyDown(e) {
    //cross browser issues exist
    if (!e) {
        var e = window.event;
    }
    if (stage && stage.mouseInBounds)
        switch (e.keyCode) {
            case KEYCODE_F:
                /*
                 for (var i = 0; i < tiles.length; i++) {
                 if (tiles[i].decal != null) {
                 var tilex = tiles[i].s.x + stage.x;
                 var tiley = tiles[i].s.y + stage.y;
                 var distance = Math.sqrt(Math.pow(tilex - 400, 2) + Math.pow(tiley - 400, 2));
                 if (distance < 55) {
                 tiles[i].UseDecal();
                 }
                 }
                 }
                 */
                break;
            case KEYCODE_SPACE:
                hero.Jump();
                break;
            case KEYCODE_A:

                if (!hero.isDashing) {
                    if (hero.xVel != -hero.speed) {
                        hero.fb_veloc_x.transaction(function (current_value) {
                            return -hero.speed;
                        });
                    }

                    hero.xVel = -hero.speed;
                    right = false;
                }
                break;
            case KEYCODE_D:
                if (!hero.isDashing) {
                    if (hero.xVel != hero.speed) {
                        hero.fb_veloc_x.transaction(function (current_value) {
                            return hero.speed;
                        });
                    }

                    hero.xVel = hero.speed;
                    right = true;
                }
                break;
            case KEYCODE_W:
                if (!hero.isDashing) {
                    if (hero.yVel != -hero.speed) {
                        hero.fb_veloc_y.transaction(function (current_value) {
                            return -hero.speed;
                        });
                    }

                    hero.yVel = -hero.speed;
                    down = false;
                }
                break;
            case KEYCODE_S:
                if (!hero.isDashing) {
                    if (hero.yVel != -hero.speed) {
                        hero.fb_veloc_y.transaction(function (current_value) {
                            return -hero.speed;
                        });
                    }

                    hero.yVel = hero.speed;
                    down = true;
                }
                break;
            case KEYCODE_I:
                if (!gui.showInventory) gui.showInventory = true;
                else gui.showInventory = false;
                break;
        }
}

function handleKeyUp(e) {
    //cross browser issues exist
    if (!e) {
        var e = window.event;
    }
    if (stage && stage.mouseInBounds && !hero.isDashing) {
        switch (e.keyCode) {
            case KEYCODE_A:
                if (!right) {

                    if (hero.xVel != 0) {
                        hero.fb_veloc_x.transaction(function (current_value) {
                            return 0;
                        });
                    }

                    hero.xVel = 0;
                }
                break;
            case KEYCODE_D:
                if (right) {

                    if (hero.xVel != 0) {
                        hero.fb_veloc_x.transaction(function (current_value) {
                            return 0;
                        });
                    }

                    hero.xVel = 0;
                }
                break;
            case KEYCODE_W:
                if (!down) {

                    if (hero.yVel != 0) {
                        hero.fb_veloc_y.transaction(function (current_value) {
                            return 0;
                        });
                    }

                    hero.yVel = 0;
                }
                break;
            case KEYCODE_S:
                if (down) {

                    if (hero.yVel != 0) {
                        hero.fb_veloc_y.transaction(function (current_value) {
                            return 0;
                        });
                    }

                    hero.yVel = 0;
                }
                break;
        }
//        hero.syncPosition();
    }
    else if (e.keyCode == KEYCODE_ENTER) {

        console.log("ENTER NIGGAS");
        var nameForm = document.getElementById("nameInput");
        var textForm = document.getElementById("messageInput");

        if (nameForm.value != "" && textForm.value != "") {
            if (document.cookie == "") {
                document.cookie = nameForm.value;
            }
            messagesRef.push({name: nameForm.value, text: textForm.value});
        }

        textForm.value = "";
    }
}

CenterScreen = function () {
    //move screen to center on hero
    if (-stage.x < hero.s.x - 400) {
        stage.x -= hero.speed;
    }
    if (-stage.y < hero.s.y - 300) {
        stage.y -= hero.speed;
    }
    if (-stage.x > hero.s.x - 400) {
        stage.x += hero.speed;
    }
    if (-stage.y > hero.s.y - 300) {
        stage.y += hero.speed;
    }
}

Array.prototype.contains = function (elem) {
    for (var i in this) {
        if (this[i] == elem) return true;
    }
    return false;
}
/*
 window.onbeforeunload = function (e) {
 console.log("a");
 };*/

window.onbeforeunload = confirmunload;
window.onunload = confirmunload;
function confirmunload() {
    console.log(loggedIn);
    if (!loggedIn) {
        heroesRef.child(heroId).remove();
    }

    for (var i in allNPCs) {
        if (allNPCs[i].manager == hero.id) {
            console.log('yup');
            allNPCs[i].SetManager(null);
        }
    }

//return "Log out?";
}

AddStrikeEffect = function (x, y) {
    var anim = new createjs.SpriteSheet({
        "animations": {
            "strike1": [0, 6, "strike1", .3],
            "strike2": [7, 13, "strike2", .5]},

        "images": ["assets/strike_effect.png"],

        "frames": {
            "height": 100,
            "width": 125,
            "regX": 0,
            "regY": 0,
            "count": 14

        }
    });
    /*
     var fire = new createjs.SpriteSheet({
     "animations": {
     "fire": [0, 6, "fire", .3]},

     "images": ["assets/fire.png"],

     "frames": {
     "height": 258,
     "width": 242,
     "regX": 0,
     "regY": 0,
     "count": 7

     }
     });
     */

    effect = new createjs.Sprite(anim, "strike1");
    effect.scaleX = .5;
    effect.scaleY = .5;
    effect.alpha = .6;
    effect.x = x;
    effect.y = y;
}
