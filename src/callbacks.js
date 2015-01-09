heroesRef.on("child_added", function (snapshot) {
    var id = snapshot.val().id;
    var addedHero;

    if (!Object.keys(allHeroes).contains(id)) {
        console.log("adding hero " + id);
        addedHero = new Hero(id, snapshot.val().equipment);
        allHeroes[id] = addedHero;
    } else {
        addedHero = allHeroes[id];
    }

    if (snapshot.val().position) {
        addedHero.SetPosition(snapshot.val().position.x, snapshot.val().position.y);
    }

//    if (snapshot.val().vitals) {
//        addedHero.health = snapshot.val().vitals.hp;
//    }
});

npcsRef.on("child_added", function (snapshot) {
    var id = snapshot.val().id;
    var addedNPC;

    if (!Object.keys(allUnits).contains(id)) {
        // dat compound index
        if (id && id.split('_').length > 0) {
            addedNPC = new NPC(id.split('_')[0], id.split('_')[1]);
            allUnits[id] = addedNPC;
            allNPCs[id] = addedNPC;
            if (snapshot.val().position) {
                addedNPC.SetPosition(snapshot.val().position.x, snapshot.val().position.y);
            }
            else {
                var rand1 = Math.random() * mapSize * 10 * 50;
                var rand2 = Math.random() * mapSize * 10 * 50;
                addedNPC.SetPosition(rand1, rand2);
            }
        }
    } else {
        addedNPC = allUnits[id];
        if (snapshot.val().position) {
            addedNPC.SetPosition(snapshot.val().position.x, snapshot.val().position.y);
        }
        else {
            var rand1 = Math.random() * mapSize * 10 * 50;
            var rand2 = Math.random() * mapSize * 10 * 50;
            addedNPC.SetPosition(rand1, rand2);
        }
    }
});

heroesRef.on("child_changed", function (snapshot) {
    //console.log(snapshot.val());
    if (snapshot.val().id) {

        var id = snapshot.val().id;
        var changedHero = allHeroes[id];

        var vitals = snapshot.val().vitals;
        var x, y, xVel, yVel, jumping;

        if (changedHero) {
            // sync hero position b/c veloc is only used for main hero it seems
            if (snapshot.val().position) {
                x = snapshot.val().position.x;

                y = snapshot.val().position.y;

                jumping = snapshot.val().position.jumping;

                if (changedHero.id != hero.id) {
                    changedHero.SetPosition(x, y);
                }

                if (jumping) changedHero.Jump();
            }


            if (snapshot.val().veloc) {
                xVel = snapshot.val().veloc.xVel;

                yVel = snapshot.val().veloc.yVel;

                if (changedHero.id != hero.id) {
                    changedHero.SetVelocity(xVel, yVel);
                }
            }

            if (snapshot.val().weapon) {
                changedHero.isAttacking = snapshot.val().weapon.isAttacking;
                changedHero.weaponAngle = snapshot.val().weapon.weaponAngle;
            }

            if (snapshot.val().equipment) {
                for (var k in snapshot.val().equipment) {
                    if (changedHero.id != hero.id && changedHero.equipment && changedHero.equipment[k].name != snapshot.val().equipment[k]) {
                        console.log("setting equipment for " + changedHero.id + " " + snapshot.val().equipment[k]);
                        changedHero.equipment[k] = new Equipment(snapshot.val().equipment[k]);
                    }
                }
            }

            if (vitals) {
                changedHero.health = vitals.hp;
            }
        }
    }
});

npcsRef.on("child_changed", function (snapshot) {
    var id = snapshot.val().id;
    var changedNPC = allUnits[id];

    var vitals = snapshot.val().vitals;
    var x, y, xVel, yVel, jumping;
//    if (snapshot.val().position) {
//         x = snapshot.val().position.x;
//
//         y = snapshot.val().position.y;
//
//         jumping = snapshot.val().position.jumping;
//
//         if (changedNPC.id != hero.id){
//             changedNPC.SetPosition(x, y);
//         }
//    }

    if (snapshot.val().veloc) {
        xVel = snapshot.val().veloc.xVel;

        yVel = snapshot.val().veloc.yVel;

        if (changedNPC.id != hero.id) {
            changedNPC.SetVelocity(xVel, yVel);
        }
    }

    if (snapshot.val().manager != null) {
        changedNPC.manager = snapshot.val().manager;
    }

    if (jumping) changedNPC.Jump();
    if (vitals) {
        changedNPC.health = vitals.hp;
    }

    if (snapshot.val().manager && snapshot.val().manager.id) {
        changedNPC.manager = snapshot.val().manager.id;
    }
});

heroesRef.on("value", function (snapshot) {
    if (!hero) {
        init();
    }
});

npcsRef.on('value', function (snapshot) {
    if (Object.keys(allNPCs).length == 0) {
        console.log('spawning npcs');
        SpawnAnimal("bunny");
        SpawnAnimal("deer");
        SpawnAnimal("wolf");
    }
});

messagesRef.on('child_added', function (message) {
    var name = message.val()['name'];
    var text = message.val()['text'];
    var messagesDiv = document.getElementById("chatWrapper");
    var em = document.createElement('em');
    em.class = "message";
    em.innerHTML = text;

    var div = document.createElement('div');
    div.class = "name";
    div.innerHTML = name + ": ";

    div.appendChild(em);
    messagesDiv.appendChild(div);
    document.getElementById("chatMessages").scrollTop = 100000000;
});
