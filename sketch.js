var PLAY = 1;
var END = 0;
var gameState = PLAY;
var tom,tom_running,tom_collided;
var ground, invisibleGround, groundImage;
var energyGroup, energyImage;
var obstaclesGroup, obstacle2, obstacle1,obstacle3;
var score=0;
var life=3
var gameOver, restart;
var backgroundImg
localStorage["HighestScore"] = 0;



function preload(){
tom_running = loadAnimation("capture4.png","capture4.png","capture4.png");
tom_collided = loadAnimation("tomDead.png");
groundImage = loadImage("backg.jpg");
energyImage = loadImage("energy.png");
obstacle2 = loadImage("obstacle2.png");
obstacle1 = loadImage("obstacle1.png");
obstacle3 = loadImage("obstacle3.png");
gameOverImg = loadImage("gameOver.png");
restartImg = loadImage("restart.png");
backgroundImg=loadImage("background.jpg") ;
}

function setup() {
createCanvas(1400,700);
  tom = createSprite(90,300,20,50);
  tom.addAnimation("running",tom_running);
  tom.scale = 1;
  
  ground = createSprite(0,600,7000,10);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  ground.visible=true;

  gameOver = createSprite(700,400);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(700,400);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  energyGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0; 
}

function draw() {
background(backgroundImg);
  textSize(40);
  fill(255);
  text("Score: "+ score,1290,80);
  text("life: "+ life , 1290,120);
  drawSprites(); 
if (gameState===PLAY){
  //score = score+Math.round(getFrameRate()/60);
  if(score >= 0){
    ground.velocityX = -5;
}else{
      ground.velocityX = -(6+ 3*score/100);
    }
  
    if(keyDown("space") && tom.y >= 400) {
      tom.velocityY = -12;
    }
  
    tom.velocityY = tom.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
   tom.collide(ground);
      
 spawnEnergy();
    if (energyGroup.isTouching(tom)){
      score=score+1
      energyGroup[0].destroy()
    } 
    spawnObstacles();
    
   if(obstaclesGroup.isTouching(tom)){
        gameState = END;
   if (life>0){
     life=life-1    
         }   
}
}
else if (gameState === END ) {
    gameOver.visible = true;
    restart.visible = true;
    tom.addAnimation("collided", tom_collided);
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    tom.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    energyGroup.setVelocityXEach(0);
    
    //change the trex animation
    tom.changeAnimation("collided",tom_collided);
    tom.scale =0.4;
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    energyGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }



  
  
}

function spawnEnergy() {
  //write code here to spawn the energy
  if (frameCount % 60 === 0) {
    var energy = createSprite(600,200,40,10);
    energy.y = Math.round(random(400,400));
    energy.addImage(energyImage);
    energy.scale = 0.2;
    energy.velocityX = -3;
    
     //assign lifetime to the variable
    energy.lifetime = 300;
    
    //adjust the depth
    energy.depth = energy.depth;
    tom.depth = tom.depth + 1;
    
    //add each energy to the group
    energyGroup.add(energy);
  }
  
}
function spawnObstacles() {
  if(frameCount % 100 === 0) {
    var obstacle = createSprite(900,565,10,40);    
    //generate random obstacles
    var rand = Math.round(random(1,3,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle2);
              break;
      case 2: obstacle.addImage(obstacle1);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
    }
        
    obstacle.velocityX = -(6 + 3*score/100);
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.2;
    obstacle.lifetime = 400;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  energyGroup.destroyEach();
  
  tom.changeAnimation("running",tom_running);
  tom.scale =1;
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  if (life<0){
    score = 0;
  }
  
  
}













