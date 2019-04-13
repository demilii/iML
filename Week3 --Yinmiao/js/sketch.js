let bird;
let pipes = [];
let state = 0;
let over = false;
let start = false;
let trainComplete = false;
let mobilenet;
let classifier;
let video;
let label = 'test';
let normalButton;
let upButton;
let trainButton;
let count = 0;

function modelReady() {
  console.log('Model is ready!!!');
}

function videoReady() {
  console.log('Video is ready!!!');
}

function whileTraining(loss) {
  if (loss == null) {
    console.log('Training Complete');
    trainComplete = true;
    classifier.classify(gotResults);
  } else {
  }
}

function gotResults(error,result){
  if(error){
    console.error(error);
  }else{
    label = result;
    classifier.classify(gotResults);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.hide();
  background(0);
  mobilenet = ml5.featureExtractor('MobileNet', modelReady);
  classifier = mobilenet.classification(video, videoReady);

  normalButton = createButton('Normal');
  normalButton.position(20,20)
              .size(130,30);

  normalButton.mousePressed(function(){
    classifier.addImage('normal');
  });

  upButton = createButton('Up');
  upButton.position(20,70)
          .size(130,30);
  upButton.mousePressed(function(){
    classifier.addImage('up');
  });

  trainButton = createButton('Train');
  trainButton.position(20,120)
             .size(130,30);
  trainButton.mousePressed(function(){
    classifier.train(whileTraining);
  });

  bird = new Bird();
  pipes.push(new Pipe());
}

function draw(){
  // start();
  measure_state();
  check_state();
  // console.log(label);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function keyPressed(){
  if(keyCode === UP_ARROW && trainComplete){
    bird.up();
  }
  if(keyCode === DOWN_ARROW && trainComplete){
    start = true;
    over = false;
  }
}

//determine the state
function check_state(){
  if (state == 0){
    //train the model
    image(video, 0, 0, windowWidth,windowHeight);
  }else if(state == 1){
    //start the game
    background(0);
    bird.update();
    bird.show();
    if(label === 'up'){
      count++;
      if(count < 4){
        bird.up();
      }

    }else{
      count = 0;
    }
    if(frameCount % 400 == 0){
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
        pipes.slice(i,1);
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
  this.r = 40;

  this.gravity = 0.5;
  this.velocity = 0;
  this.lift = -12;

  this.show = function(){
    fill(255);
    ellipse(this.x,this.y,this.r,this.r);
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
    if(bird.y-bird.r< this.top || bird.y+bird.r > height- this.bottom){
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
