var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;  
var PLAY=1;
var END=0;
var GameState=PLAY;
var gameOver, gameOverImage;
var restart, restartImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score=0;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("trex_collided", trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
    
  invisibleGround = createSprite(200,180,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  gameOver = createSprite(300,100);
  gameOver.addImage("gameOver", gameOverImage);
  restart = createSprite(300,140);
  restart.addImage("restart",restartImage);
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  gameOver.visible = false;
  restart.visible = false;
  score = 0;
}

function draw() {
  background(180);
  trex.x=camera.position.x-250;
    if(GameState === PLAY){
     camera.position.x+=6;
    //move the ground
    ground.velocityX = -(6 + 3*score/100);
    
    if (score>0 && score%100 === 0){
     // playSound("checkPoint.mp3");
    }
    
    camera.position.x+=6;

    
    if(camera.position.x>ground.width/2+300)
    {
      camera.position.x=300;
      obstaclesGroup.destroyEach();
      cloudsGroup.destroyEach();
    }
    
     //jump when the space key is pressed
     if(keyDown("space")) {
        trex.velocityY = -12;
      };
    //add gravity
    trex.velocityY = trex.velocityY + 0.8;
       trex.collide(invisibleGround)
    
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles
    spawnObstacles();
  
    //End the game when trex is touching the obstacle
    if(obstaclesGroup.isTouching(trex)){
      GameState = END;
      //playSound("die.mp3");
    }
  //scoring system    
  score = score + Math.round(getFrameRate()/60);
  }

  else if(GameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    gameOver.x=camera.position.x;
    restart.x=camera.position.x;
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("trex_collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    if(mousePressedOver(restart)){
      reset();
    }
  }
  
 
  text("Score: "+ score, 500,50);
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(camera.position.x+300,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(camera.position.x+300,165,10,40);
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}
function reset(){
  GameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  score = 0;
  camera.position.x=300;

}