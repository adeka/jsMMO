/**
 * Created by gramp_000 on 3/6/14.
 */
function Chunk(stage, simplex, simplex2, xOrigin, yOrigin) {
    this.stage = stage;

    this.nextChunk;
    this.rootUnits = [];
    this.xOrigin = xOrigin;
    this.yOrigin = yOrigin;
    this.chunkSize = 11;
    this.width = this.chunkSize * 50;
    var tileCount = this.chunkSize * this.chunkSize;
    var xPos = xOrigin, yPos = yOrigin;

    this.tiles = [];
    this.units = [];

    this.rightTiles = [];

    for (var i = 0; i < tileCount; i++) {
        if (i % this.chunkSize == 0) {
            xPos = this.xOrigin;
            yPos += 1;
        }
        else {
            xPos += 1;
        }
        var type;
        var blurNoise = simplex.noise2D(xPos / 40, yPos / 40) * 10;
        var landNoise = simplex.noise2D(xPos / 20, yPos / 20) * 15;
        var noise = simplex.noise2D(xPos / 10, yPos / 10) * 10;
        var decalNoise = simplex2.noise2D(xPos / 10, yPos / 10) * 10;
        var yOffset = 0;

        if (blurNoise > 4.5 && blurNoise < 7) {
            type = 3;
            // yOffset = 75;
        }

        else if (landNoise > 6) {
            type = 4;
            //yOffset = 8 - landNoise;
        }
        else if (landNoise > 2.5) {
            type = 0;
            //yOffset = noise*3;
        }
        else if (landNoise > .3) {
            type = 1;
            //yOffset = noise*3;
        }
        else {
            type = 2;
            //yOffset = noise*3;
        }
        /*
         else if (blurNoise > 4) {
         type = 5;
         }
         else if (blurNoise > 2) {
         type = 2;
         }
         */
        // yOffset = noise*3;

        var tile = new Tile(type);

        tile.s.x = xPos * 50 + 0 + tile.xOffset;
        tile.s.y = yPos * 50 + 0 + yOffset;
        tile.xPos = xPos;
        tile.yPos = yPos;

        // tile.colYOffset =  tile.colYOffset - yOffset/2;
        if (type != 3) {
            tile.yOffset = tile.yOffset + yOffset;

            //if(decalNoise > 8){
            //chests
            //var decal = new Decal(0);
            //tile.AddDecal(decal);
            //}
            //if(landNoise > 8){
            //var decal = new Decal(2);
            //tile.AddDecal(decal);
            //}
            //if(landNoise > 5){
            //var decal = new Decal(3);
            //tile.AddDecal(decal);
            //}
            if (noise > 5) {
                var decal = new Decal(1);
                tile.AddDecal(decal);
            }
            else if (noise > 4) {
                var decal = new Decal(3);
                tile.AddDecal(decal);
            }
            else if (decalNoise > 1) {
                var decal = new Decal(4);
                tile.AddDecal(decal);
            }

            if (!tile.decal) {

            }


        }
        this.tiles.push(tile);
    }

    /*
     var t = this.tiles;
     for(var i = 0; i < this.tiles.length; i++){
     if(t[i].type == 2){
     if(
     (i > 0 && t[i - 1].type != 2) &&
     (i > this.chunkSize && t[i - this.chunkSize].type != 2) &&
     (i > this.chunkSize - 1 && t[i - this.chunkSize - 1].type != 2)
     ){
     this.tiles[i].SetSprite("topLeft");
     }
     }
     }
     */
}
Chunk.prototype.SetNextChunk = function (chunk) {
    this.nextChunk = chunk;
    var col = [];
    for (var i = 0; i < this.nextChunk.tiles.length; i += this.chunkSize) {
        col.push(this.nextChunk.tiles[i]);
    }
    this.rightTiles = col;
}

Chunk.prototype.Update = function () {

    this.CheckUnitDecalCollision();
    this.CheckUnitTileCollision();
    this.SetUnitTiles();

    //this.UpdateUnits();
    this.Draw();

    //stage.update();
}
Chunk.prototype.UpdateUnits = function () {
    for (var i = 0; i < this.units.length; i++) {
        this.units[i].Update();
        if (this.units[i] instanceof NPC) {
            this.units[i].Wander();
        }
    }
}
Chunk.prototype.Draw = function () {
    //draw everything in the right order
    var paddedTiles = this.tiles;
    for (var i = 0; i < paddedTiles.length; i++) {
        var tilex = paddedTiles[i].s.x + stage.x;
        var tiley = paddedTiles[i].s.y + stage.y;
        var distance = Math.sqrt(Math.pow(tilex - 370, 2) + Math.pow(tiley - 270, 2));
        if (distance < 525) {
            if (!(i % this.chunkSize == 0) && i <= this.tiles.length - this.chunkSize) this.tiles[i].Draw(stage);
            //this.tiles[i].Update();
            this.DrawUnits(paddedTiles[i]);
            if (i < this.tiles.length && this.tiles[i].decal != null && !(i % this.chunkSize == 0) && i <= this.tiles.length - this.chunkSize) {
                stage.addChild(this.tiles[i].decal.s);
                //this.tiles[i].decal.Update();
            }
        }
    }
}
Chunk.prototype.DrawUnits = function (tile) {
    for (var i = 0; i < this.units.length; i++) {
        this.units[i].Draw(tile, stage);
        //if(this.units[i] instanceof Hero){
        //    this.units[i].DrawWeapon(stage);
        //}
    }
}
Chunk.prototype.SetUnitTiles = function () {
    //detect the tile directly underneath the hero
    for (var i = 0; i < this.tiles.length; i++) {
        for (var j = 0; j < this.units.length; j++) {
            var nextTile;
            /*
             if((i + 1) % this.chunkSize == 0){
             // nextTile = this.nextChunk.tiles[i+ this.chunkSize];
             // nextTile = this.tiles[i];
             //  this.tiles[i].s.y = 0;
             // nextTile = this.nextChunk.GetTileByCoord(this.tiles[i].xPos + 1, this.tiles[i]);
             }
             */
            //  else{
            nextTile = this.tiles[i + 1];
            // }
            this.units[j].CheckTilePair(this.tiles[i], nextTile);
        }
    }
}
Chunk.prototype.CheckUnitDecalCollision = function () {
    //decal collisions
    for (var i = 0; i < this.tiles.length; i++) {
        if (this.tiles[i].decal && !this.tiles[i].decal.passable) {
            for (var j = 0; j < this.units.length; j++) {
                this.units[j].CheckDecalCollision(this.tiles[i]);
            }
        }
    }
}
Chunk.prototype.CheckUnitTileCollision = function () {
    //tile collision
    var paddedTiles = this.tiles;
    for (var i = 0; i < paddedTiles.length; i++) {
        for (var j = 0; j < this.units.length; j++) {
            this.units[j].CheckTileCollision(paddedTiles[i]);
        }
    }
}
Chunk.prototype.ContainsUnit = function (unit) {
    var b =
        (unit.s.x + 18 >= this.xOrigin * 50 - 0) &&
        (unit.s.x + 18 <= this.xOrigin * 50 + this.width + 75) &&
        (unit.s.y + 45 <= this.yOrigin * 50 + this.width + 75) &&
        (unit.s.y + 45 >= this.yOrigin * 50 - 0);
    return b;
}

Chunk.prototype.GetTileByCoord = function (xPos, yPos) {
    var tile;
    for (var i = 0; i < this.tiles.length; i++) {
        if (this.tiles[i].xPos == xPos && this.tiles[i].yPos == yPos) {
            tile = this.tiles[i];
        }
    }
    return tile;
}
