//Create variables here
var dog,sadDog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var gameState,readState;

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
bedroom=loadImage("Bed Room.png");
garden=loadImage("Garden.png");
washroom=loadImage("Wash Room.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food')
  foodStock.on("value",readStock);
  readState=database.ref("gameState");
  readState.on("value",function(data){
gameState:data.val();
  })
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);


}

function draw() {
  background(46,139,87);
  currentTime=hour();
  if(currentTime===(lastFed+1)){
    update("playing");
    foodObj.garden();
  }
  else if(currentTime===(lastFed+2)){
    update("sleeping");
    foodObj.bedroom();
  }
    else if(currentTime>(lastFed+2)&&currentTime<=(lastFed+4)){
      update("bathing");
      foodObj.washroom();
    }
     else {
        update("Hungry");
        foodObj.display();
     }
if(gameState!="Hungry"){
  feed.hide();
  addFood.hide();
  dog.remove();
}else{
  feed.show();
  addFood.show();
  dog.addImage(sadDog);
}
  


 
 
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
  function update(state){
    database.ref("/").update({gameState:state})
  }
