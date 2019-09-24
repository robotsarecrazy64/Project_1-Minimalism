// Renderer
var gameport = document.getElementById("gameport");
var renderer = PIXI.autoDetectRenderer(1500, 500, {backgroundColor: 0x000033});
gameport.appendChild(renderer.view);

// Containers
var stage = new PIXI.Container();
var back = new PIXI.Container();
var skull_a = new PIXI.Container();
var skull_b = new PIXI.Container();
var skull_c = new PIXI.Container();

// Assets
var cave = new PIXI.Sprite.fromImage("cave_background.png");
var ground = new PIXI.Texture.fromImage("ground.png");
var lava = new PIXI.Texture.fromImage("lava.png");
var player = new PIXI.Sprite.fromImage("Player.png");
var goal = new PIXI.Sprite.fromImage("door.png");
var big_skull_a = new PIXI.Sprite.fromImage("big_flaming_skull.png");
var big_skull_b = new PIXI.Sprite.fromImage("big_flaming_skull.png");
var big_skull_c = new PIXI.Sprite.fromImage("big_flaming_skull.png");

// Variables to improve readability
var ground_level = 423;
var end_of_map = 1500;
var floor_position = 470;
var tile_size = 50;
var count = 2;
var offset = 0;
var winner = false;


function init() {
	offset = 0;

	cave.anchor.x = 0;
	cave.anchor.y = 0;
	cave.position.x = 0;
	cave.position.y = 0;
	back.scale.x = end_of_map/100;
	back.scale.y = back.scale.x/3;
	back.addChild(cave);
	stage.addChild(back);

	// Generate Floor Tiles
	var start_tile = new PIXI.extras.TilingSprite(ground, tile_size, tile_size);
	start_tile.position.x = 0;
	start_tile.position.y = floor_position;
	start_tile.tilePosition.x = 0;
	start_tile.tilePosition.y = 0;
	stage.addChild(start_tile);
	var end_tile = new PIXI.extras.TilingSprite(ground, tile_size, tile_size);
	end_tile.position.x = end_of_map - tile_size;
	end_tile.position.y = floor_position;
	stage.addChild(end_tile);

	generateGroundTiles();

	// end goal
	goal.position.x = end_of_map - tile_size;
	goal.position.y = ground_level;
	stage.addChild(goal);


	// Set up Player
	player.position.x = 0;
	player.position.y = ground_level;
	player.interactive = true;
	document.addEventListener('keydown', keydownEventHandler);
	stage.addChild(player);
	
	// Set up enemies
	big_skull_a.anchor.x = 0.5;
	big_skull_a.anchor.y = 0.5;
	big_skull_a.interactive = true;
	skull_a.position.x = end_of_map/4;
	skull_a.position.y = ground_level - tile_size;
	skull_a.pivot.x = 50;
	skull_a.pivot.y = 50;
	skull_a.addChild(big_skull_a);
	stage.addChild(skull_a);

	big_skull_b.anchor.x = 0.5;
	big_skull_b.anchor.y = 0.5;
	big_skull_b.interactive = true;
	skull_b.position.x = end_of_map/2;
	skull_b.position.y = ground_level - tile_size;
	skull_b.pivot.x = 50;
	skull_b.pivot.y = 50;
	skull_b.addChild(big_skull_b);
	stage.addChild(skull_b);

	big_skull_c.anchor.x = 0.5;
	big_skull_c.anchor.y = 0.5;
	big_skull_c.interactive = true;
	skull_c.position.x = end_of_map - 250;
	skull_c.position.y = ground_level - tile_size;
	skull_c.pivot.x = 50;
	skull_c.pivot.y = 50;
	skull_c.addChild(big_skull_c);
	stage.addChild(skull_c);

	requestAnimationFrame(update);
}

function generateGroundTiles() {
	offset += tile_size;
	if (offset < (end_of_map - tile_size)) {
		addTile(offset);
		addEnemy();
		generateGroundTiles();
	}
}

function update() {
	// Updates the player status
	if (player.position.y < ground_level) { movePlayer(player.position.x + (tile_size/2), ground_level); }
	if (!winner) { checkWinCondition(); }
	if ( (player.position.x > (end_of_map - tile_size)) && winner ) { player.position.x = 0; }
	
	// Rotates the enemies
	big_skull_a.rotation -= 0.0025;
	skull_a.rotation += 0.0025;
	big_skull_b.rotation -= 0.0025;
	skull_b.rotation += 0.0025;
	big_skull_c.rotation -= 0.0025;
	skull_c.rotation += 0.0025;

	renderer.render(stage);
	requestAnimationFrame(update);
}

function addTile(x) {
	var ground_tile = new PIXI.extras.TilingSprite(ground, tile_size, tile_size);
	var lava_tile = new PIXI.extras.TilingSprite(lava, tile_size, tile_size);
	var rand_num = getRand(2);
	if (rand_num == 1) {
		ground_tile.position.x = x;
		ground_tile.position.y = floor_position;
		stage.addChild(ground_tile);
	}
	else {
		lava_tile.position.x = x;
		lava_tile.position.y = floor_position;
		stage.addChild(lava_tile);
	}

}

function getRand(max) {
	return Math.floor((Math.random() * max) + 1); // returns a random number from 1 to max
}


function keydownEventHandler(event) {

  	if (event.keyCode == 68) { // D key
		sleep(1);
		movePlayer(player.position.x + (tile_size/2), player.position.y - tile_size);	
		update();
  	}

  	if (event.keyCode == 65) { // A key
		sleep(1);
   		movePlayer(player.position.x - ((3*tile_size)/2), player.position.y - tile_size);
		update();
  	}
}

function sleep(seconds) 
{
  	var wait = new Date().getTime() + (seconds * 1000);
 	while (new Date().getTime() <= wait) {}
}

function movePlayer(new_x, new_y) {
	createjs.Tween.get(player.position).to({x: new_x, y: new_y}, 500, createjs.Ease.backOut);
}


function addEnemy() {
	var skull = new PIXI.Sprite.fromImage("flaming_skull.png");
	skull.anchor.x = 0;
	skull.anchor.y = 0;
	skull.position.x = getRand(end_of_map);
	skull.position.y = getRand(ground_level);
	stage.addChild(skull);
}

function checkWinCondition () {
	if( player.x >= goal.x ) {
		if(( count % 2 ) == 0) {
			winner = true;
			alert("You have successfully escaped the cave! Click OK to keep playing (forever).");
		}
		else {
			winner == false;
		}
		init();	
		count += 1;
	}
}