var gameport = document.getElementById("gameport");

var renderer = PIXI.autoDetectRenderer(1200, 400, {backgroundColor: 0x000033});
gameport.appendChild(renderer.view);

var stage = new PIXI.Container();
var back = new PIXI.Container();

var cave = new PIXI.Sprite.fromImage("cave_background.png");
var ground = new PIXI.Texture.fromImage("ground.png");
var lava = new PIXI.Texture.fromImage("lava.png");

var player = new PIXI.Sprite.fromImage("Player.png");
var enemy = new PIXI.Sprite.fromImage("flaming_skull.png");


var floor_tile = new PIXI.extras.TilingSprite(ground, 50,50);
floor_tile.position.x = 0;
floor_tile.position.y = 370;
var offset = 0;


function init() {
	floor_tile.tilePosition.x = 0;
	floor_tile.tilePosition.y = 0;

	cave.anchor.x = 0;
	cave.anchor.y = 0;
	cave.position.x = 0;
	cave.position.y = 0;

	back.scale.x = 12;
	back.scale.y = 4;

	back.addChild(cave);
	
	stage.addChild(back);
	stage.addChild(floor_tile);

	player.position.x = 0;
	player.position.y = 323;
	player.interactive = true;
	stage.addChild(player);
	
	

	
	document.addEventListener('keydown', keydownEventHandler);
	requestAnimationFrame(update);

}



function update() {
	offset += 50;
	if (offset < 1200) {
		addTile(offset);
	}
	if (player.position.y < 323) {
		movePlayer(player.position.x + 25, 323);
	}
	renderer.render(stage);
	requestAnimationFrame(update);

}

function addTile(x) {
	var a_tile = new PIXI.extras.TilingSprite(ground, 50, 50);
	var b_tile = new PIXI.extras.TilingSprite(lava, 50, 50);
	var rand_num = getRand();
	if (rand_num == 1) {
		a_tile.position.x = 0 + x;
		a_tile.position.y = 370;
		stage.addChild(a_tile);
	}
	else {
		b_tile.position.x = 0 + x;
		b_tile.position.y = 370;
		stage.addChild(b_tile);
	}

}

function getRand() {
	return Math.floor((Math.random()*2) +1);
}


function keydownEventHandler(e) {

  if (e.keyCode == 68) { // D key
	movePlayer(player.position.x + 25, player.position.y - 50);
  	sleep(1);	
  }

  if (e.keyCode == 65) { // A key
   	movePlayer( player.position.x - 75, player.position.y - 50);
  	sleep(1);
  }
}

function sleep(seconds) 
{
  var e = new Date().getTime() + (seconds * 1000);
  while (new Date().getTime() <= e) {}
}

function movePlayer(new_x, new_y) {
	createjs.Tween.get(player.position).to({x: new_x, y: new_y}, 500, createjs.Ease.backOut);
}