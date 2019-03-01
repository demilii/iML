let bird;
let pipes = [];
let state = 0;
let over = false;
let start = false;

let mobilenet;
let classifier;
let video;
let label = 'test';
let normalButton;
let upButton;
let trainButton;

function modelReady() {
  console.log('Model is ready!!!');
}

function videoReady() {
  console.log('Video is ready!!!');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.hide();
  background(0);
  mobilenet = ml5.featureExtractor('MobileNet', modelReady);
  classifier = mobilenet.classification(video, videoReady);
  bird = new Bird();
  pipes.push(new Pipe());
}

function draw(){
  // start();
  measure_state();
  check_state();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function keyPressed(){
  if(key = ' '){
    bird.up();
  }
  if(key = 's'){
    start = true;
    over = false;
    console.log(start);
    console.log(state);
  }
}

//determine the state
function check_state(){
  if (state == 0){
    //train the model
  }else if(state == 1){
    //start the game
    background(0);
    bird.update();
    bird.show();
    if(frameCount % 300 == 0){
      pipes.push(new Pipe());
    }
    for(var i = 0; i <pipes.length;i++ ){
      pipes[i].show();
      pipes[i].update();
      if(pipes[i].offscreen()){
        pipes.slice(i,1);
      }

      if(pipes[i].hit(bird)){
        // game over
        pipes.slice(i,1）;
        over = true;
        start = false;
      }
    }
  }else if(state == 2){
    //game over status
    background(0);
    fill(255);
    textSize(40);
    textAlign(CENTER, CENTER);
    text("Game Over",width/2,height/2);

    for(var i = 0; i < pipes.length; i++ ){
      pipes.slice(i,1);
    }
    bird.x = 0;
  }
}

function measure_state(){
  if(start){
    state = 1;
    over = false;
  } if(over == true){
    state = 2;
    start = false;
  }
}

function Bird(){
  this.y = height/2;
  this.x = 25;


  this.gravity = 0.5;
  this.velocity = 0;
  this.lift = -15;

  this.show = function(){
    fill(255);
    ellipse(this.x,this.y,32,32);
  }
  this.update = function(){
    this.velocity += this.gravity;
    this.velocity *= 0.98;
    this.y += this.velocity;

    if(this.y > height){
      this.y = height;
      this.velocity = 0;

    }
    if(this.y < 0){
      this.y = 0;
      this.velocity = 0;

    }
  }

  this.up = function(){
    this.velocity += this.lift;
  }


}


function Pipe(){
  this.top = random(height/8,3*height/8);
  this.bottom = random(height/2);
  this.x = width;
  this.w = 60;
  this.speed = 1.5;

  this.hit = function(bird){
    if(bird.y-16< this.top || bird.y+16 > height- this.bottom){
      if(bird.x > this.x && bird.x < this.x + this.w){
        fill(255,0,0);
        return true;
      }
    }
    return false;
  }
  this.show = function(){
    fill(255);
    rect(this.x,0,this.w,this.top);
    rect(this.x,height-this.bottom,this.w,this.bottom);
  }
  this.update = function(){
    this.x -= this.speed;
  }

  this.offscreen = function(){
    if (pipes.x < -this.w){
      return true;
    }else{
      return false;
    }
  }
}
