// Renderer
var gameport = document.getElementById("gameport");
var renderer = PIXI.autoDetectRenderer(1500, 500, {backgroundColor: 0x000033});
gameport.appendChild(renderer.view);

// Containers
var stage = new PIXI.Container();
var back = new PIXI.Container();

// Assets
var cave = new PIXI.Sprite.fromImage("cave_background.png");
var ground = new PIXI.Texture.fromImage("ground.png");
var lava = new PIXI.Texture.fromImage("lava.png");
var player = new PIXI.Sprite.fromImage("Player.png");
var enemy = new PIXI.Sprite.fromImage("big_flaming_skull.png");

// Variables to improve readability
var ground_level = 423;
var end_of_map = 1500;
var floor_position = 470;
var tile_size = 50;
var winner = false;
var offset = 0;

function init() {
	cave.anchor.x = 0;
	cave.anchor.y = 0;
	cave.position.x = 0;
	cave.position.y = 0;
	back.scale.x = end_of_map/100;
	back.scale.y = back.scale.x/3;
	back.addChild(cave);
	stage.addChild(back);

	var start_tile = new PIXI.extras.TilingSprite(ground, tile_size, tile_size);
	start_tile.position.x = 0;
	start_tile.position.y = floor_position;
	start_tile.tilePosition.x = 0;
	start_tile.tilePosition.y = 0;
	stage.addChild(start_tile);
	generateGroundTiles();

	player.position.x = 0;
	player.position.y = ground_level;
	player.interactive = true;
	document.addEventListener('keydown', keydownEventHandler);
	stage.addChild(player);
	
	enemy.position.x = end_of_map - tile_size;
	enemy.position.y = ground_level - 10;
	stage.addChild(enemy);

	requestAnimationFrame(update);
}

function generateGroundTiles() {
	offset += tile_size;
	if (offset < end_of_map) {
		addTile(offset);
		addEnemy();
		generateGroundTiles();
	}
}

function update() {
	if (player.position.y < ground_level) { movePlayer(player.position.x + (tile_size/2), ground_level); }
	if(!winner) { checkWinCondition(player, enemy); }
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
  	}

  	if (event.keyCode == 65) { // A key
		sleep(1);
   		movePlayer(player.position.x - ((3*tile_size)/2), player.position.y - tile_size);
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

function checkWinCondition (sprite_one, sprite_two) {
	var x1 = sprite_one.x;
	var x2 = sprite_two.x;
	if( x1 >= x2) {
		winner = true;
		alert("Winner!");
	}
}