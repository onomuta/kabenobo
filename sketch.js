// const VIDEO = {
//   audio: false,
//   video: {
//     facingMode: {
//       exact: "environment" // リアカメラにアクセス
//     }
//   }
// };


let mode = 0;

let video;
let poseNet;
let poses = [];
let posesVal = [];
let latestPosesVal = [];

let noseX = 0;
let noseY = 0;
let eyelX = 0;
let eyelY = 0;

let sholderLX = 0;
let sholderLY = 0;
let sholderRX = 0;
let sholderRY = 0;
let elbowLX = 0;
let elbowLY = 0;
let elbowRX = 0;
let elbowRY = 0;
let wristLX = 0;
let wristLY = 0;
let wristRX = 0;
let wristRY = 0;

let _img;

let val1 = document.getElementById('val1');
let val2 = document.getElementById('val2');
let val3 = document.getElementById('val3');
let val4 = document.getElementById('val4');

let CSVbutton = document.getElementById('csv-button');

let table;

function setup() {
  setupCSV();
  createCanvas(640, 480);
  _img = createGraphics(640, 480);
  _img.colorMode(HSL, 360, 100, 100, 100);
  _img.background(0);
  video = createCapture(VIDEO);
  // video.hide();
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', gotPoses);

  for (var i = 0; i < 5; i++) {
    posesVal[i] = [];
    latestPosesVal[i] = [];
    for (var j = 0; j < 17; j++) {
      posesVal[i][j] = [];
      latestPosesVal[i][j] = [];
      for (var k = 0; k < 2; k++) {
        posesVal[i][j][k] = 0;
        latestPosesVal[i][j][k] = 0;
      }
    }
  }
}

function draw() {

}

function modelReady() {
  console.log('model ready');
  val2.innerHTML = 'model ready';
}

function gotPoses(poses) {
  // background(255);
  clear();
  noStroke();
  fill(0, 140);
  rect(0, 0, width, height);
  image(_img, 0, 0);

  noStroke();
  fill(255, 100);
  for (let i = 0; i < poses.length; i++) {
    // console.log(poses[i].pose.score);
    if (poses[i].pose.score > 0.27) {
      for (let j = 0; j < poses[i].pose.keypoints.length; j++) {
        latestPosesVal[i][j][0] = posesVal[i][j][0];
        latestPosesVal[i][j][1] = posesVal[i][j][1];
        posesVal[i][j][0] = poses[i].pose.keypoints[j].position.x;
        posesVal[i][j][1] = poses[i].pose.keypoints[j].position.y;
      }

      if (mode == 0) {
        drawMode00(poses, i);
      } else if (mode == 1) {
        drawMode01(poses, i);
      } else if (mode == 2) {
        drawMode02(poses, i);
      } else if (mode == 3) {
        drawMode03(poses, i);
      } else if (mode == 4) {
        drawMode04(poses, i);
      }

      if (showSkelton == true) {
        drawSkelton(poses, i);
      }



      if (captureCSV == true) {
        addCSV(posesVal[i][0][0], posesVal[i][0][1], posesVal[i][9][0], posesVal[i][9][1], posesVal[i][10][0], posesVal[i][10][1], posesVal[i][15][0], posesVal[i][15][1], posesVal[i][16][0], posesVal[i][16][1])
      }
    }
  }
  val4.innerHTML = frameCount;
}

// ===========================================================
function drawSkelton(poses, i) {
  noFill();
  stroke(255);
  for (let j = 0; j < poses[i].pose.keypoints.length; j++) {
    ellipse(poses[i].pose.keypoints[j].position.x, poses[i].pose.keypoints[j].position.y, 10, 10);
  }
  triangle(
    posesVal[i][0][0], posesVal[i][0][1],
    posesVal[i][3][0], posesVal[i][3][1],
    posesVal[i][4][0], posesVal[i][4][1]
  );
  triangle(
    posesVal[i][3][0], posesVal[i][3][1],
    posesVal[i][4][0], posesVal[i][4][1],
    (posesVal[i][5][0] + posesVal[i][6][0]) / 2, (posesVal[i][5][1] + posesVal[i][6][1]) / 2
  );
  line(
    posesVal[i][5][0], posesVal[i][5][1],
    posesVal[i][7][0], posesVal[i][7][1]
  )
  line(
    posesVal[i][6][0], posesVal[i][6][1],
    posesVal[i][8][0], posesVal[i][8][1]
  )
  line(
    posesVal[i][7][0], posesVal[i][7][1],
    posesVal[i][9][0], posesVal[i][9][1]
  )
  line(
    posesVal[i][8][0], posesVal[i][8][1],
    posesVal[i][10][0], posesVal[i][10][1]
  )
  quad(
    posesVal[i][5][0], posesVal[i][5][1],
    posesVal[i][6][0], posesVal[i][6][1],
    posesVal[i][12][0], posesVal[i][12][1],
    posesVal[i][11][0], posesVal[i][11][1]
  );
  line(
    posesVal[i][11][0], posesVal[i][11][1],
    posesVal[i][13][0], posesVal[i][13][1]
  )
  line(
    posesVal[i][12][0], posesVal[i][12][1],
    posesVal[i][14][0], posesVal[i][14][1]
  )
  line(
    posesVal[i][13][0], posesVal[i][13][1],
    posesVal[i][15][0], posesVal[i][15][1]
  )
  line(
    posesVal[i][14][0], posesVal[i][14][1],
    posesVal[i][16][0], posesVal[i][16][1]
  )
}


function drawMode00(poses, i) {
  if (latestPosesVal[i][0][0] != 0) {
    _img.strokeWeight(1);
    _img.stroke(frameCount / 10 % 360, 100, 60);
    _img.fill(frameCount / 10 % 360, 100, 60);
    if (addHead == true) {
      _img.line(
        latestPosesVal[i][0][0], latestPosesVal[i][0][1],
        posesVal[i][0][0], posesVal[i][0][1]
      )
    }
    _img.line(
      latestPosesVal[i][9][0], latestPosesVal[i][9][1],
      posesVal[i][9][0], posesVal[i][9][1]
    )
    _img.line(
      latestPosesVal[i][10][0], latestPosesVal[i][10][1],
      posesVal[i][10][0], posesVal[i][10][1]
    )
    _img.line(
      latestPosesVal[i][15][0], latestPosesVal[i][15][1],
      posesVal[i][15][0], posesVal[i][15][1]
    )
    _img.line(
      latestPosesVal[i][16][0], latestPosesVal[i][16][1],
      posesVal[i][16][0], posesVal[i][16][1]
    )

  }
}

function drawMode01(poses, i) {
  if (latestPosesVal[i][0][0] != 0) {
    _img.strokeWeight(1.5);

    _img.stroke(0, 0, 60);
    if (addHead == true) {
      _img.line(
        latestPosesVal[i][0][0], latestPosesVal[i][0][1],
        posesVal[i][0][0], posesVal[i][0][1]
      )
    }

    _img.stroke(0, 80, 60);
    _img.line(
      latestPosesVal[i][9][0], latestPosesVal[i][9][1],
      posesVal[i][9][0], posesVal[i][9][1]
    )
    _img.stroke(180, 80, 60);
    _img.line(
      latestPosesVal[i][10][0], latestPosesVal[i][10][1],
      posesVal[i][10][0], posesVal[i][10][1]
    )
    _img.stroke(270, 80, 60);
    _img.line(
      latestPosesVal[i][15][0], latestPosesVal[i][15][1],
      posesVal[i][15][0], posesVal[i][15][1]
    )
    _img.stroke(90, 80, 60);
    _img.line(
      latestPosesVal[i][16][0], latestPosesVal[i][16][1],
      posesVal[i][16][0], posesVal[i][16][1]
    )
  }
}


function drawMode02(poses, i) {
    _img.strokeWeight(1.5);
  if (latestPosesVal[i][0][0] != 0) {
    _img.stroke(0, 0, 60);
    if (addHead == true) {
      _img.point(posesVal[i][0][0], posesVal[i][0][1]);
    }
    _img.stroke(0, 80, 60);
    _img.point(posesVal[i][9][0], posesVal[i][9][1]);
    _img.stroke(90, 80, 60);
    _img.point(posesVal[i][10][0], posesVal[i][10][1]);
    _img.stroke(180, 80, 60);
    _img.point(posesVal[i][15][0], posesVal[i][15][1]);
    _img.stroke(270, 80, 60);
    _img.point(posesVal[i][16][0], posesVal[i][16][1]);
  }
}


function drawMode03(poses, i) {
  if (latestPosesVal[i][0][0] != 0) {
    let s;
    
    if(addHead == true){
    s = dist(latestPosesVal[i][0][0], latestPosesVal[i][0][1], posesVal[i][0][0], posesVal[i][0][1]);
    _img.stroke(0, 0, 60, 50);
    _img.strokeWeight((60 - s) / 20);
    _img.point(posesVal[i][0][0], posesVal[i][0][1]);
  }
    s = dist(latestPosesVal[i][9][0], latestPosesVal[i][9][1], posesVal[i][9][0], posesVal[i][9][1]);
    _img.stroke(0, 80, 60, 50);
    _img.strokeWeight((60 - s) / 20);
    _img.point(posesVal[i][9][0], posesVal[i][9][1]);
    s = dist(latestPosesVal[i][10][0], latestPosesVal[i][10][1], posesVal[i][10][0], posesVal[i][10][1]);
    _img.stroke(90, 80, 60, 50);
    _img.strokeWeight((60 - s) / 20);
    _img.point(posesVal[i][10][0], posesVal[i][10][1]);
    s = dist(latestPosesVal[i][15][0], latestPosesVal[i][15][1], posesVal[i][15][0], posesVal[i][15][1]);
    _img.stroke(180, 80, 60, 50);
    _img.strokeWeight((60 - s) / 20);
    _img.point(posesVal[i][15][0], posesVal[i][15][1]);
    s = dist(latestPosesVal[i][16][0], latestPosesVal[i][16][1], posesVal[i][16][0], posesVal[i][16][1]);
    _img.stroke(270, 80, 60, 50);
    _img.strokeWeight((60 - s) / 20);
    _img.point(posesVal[i][16][0], posesVal[i][16][1]);
  }
}


function drawMode04(poses, i) {
  _img.noFill();
  _img.strokeWeight(0.5);
  _img.stroke(frameCount / 6 % 360, 100, 60, 20);
  if (latestPosesVal[i][0][0] != 0) {
    _img.beginShape();
    _img.vertex(posesVal[i][9][0], posesVal[i][9][1]);
    if (addHead == true) {
      _img.vertex(posesVal[i][0][0], posesVal[i][0][1]);
    }
    _img.vertex(posesVal[i][10][0], posesVal[i][10][1]);
    _img.vertex(posesVal[i][16][0], posesVal[i][16][1]);
    _img.vertex(posesVal[i][15][0], posesVal[i][15][1]);
    _img.endShape(CLOSE);

  }
}
// ===========================================================

function mouseClicked() {
  // modeChange();
  checkBox();
}

function TouchEventFunc(e) {
  // modeChange();
  checkBox();
}

function modeChange() {
  mode++;
  mode = mode % 5;
  val1.innerHTML = "Mode:" + mode;
  // if (mode == 0) {
  //   setupMode00();
  // } else if (mode == 1) {
  //   setupMode01();
  // } else if (mode == 2) {
  //   setupMode02();
  // } else if (mode == 3) {
  //   setupMode03();
  // }


}

document.addEventListener("touchstart", TouchEventFunc);



function setupCSV() {
  table = new p5.Table();
  table.addColumn('noseX');
  table.addColumn('noseY');
  table.addColumn('leftWristX');
  table.addColumn('leftWristY');
  table.addColumn('rightWristX');
  table.addColumn('rightWristY');
  table.addColumn('leftAnkleX');
  table.addColumn('leftAnkleY');
  table.addColumn('rightAnkleX');
  table.addColumn('rightAnkleY');
}

function addCSV(p0x, p0y, p9x, p9y, p10x, p10y, p15x, p15y, p16x, p16y) {
  let newRow = table.addRow();
  newRow.setNum('noseX', Math.floor(p0x));
  newRow.setNum('noseY', Math.floor(p0y));
  newRow.setNum('leftWristX', Math.floor(p9x));
  newRow.setNum('leftWristY', Math.floor(p9y));
  newRow.setNum('rightWristX', Math.floor(p10x));
  newRow.setNum('rightWristY', Math.floor(p10y));
  newRow.setNum('leftAnkleX', Math.floor(p15x));
  newRow.setNum('leftAnkleY', Math.floor(p15y));
  newRow.setNum('rightAnkleX', Math.floor(p16x));
  newRow.setNum('rightAnkleY', Math.floor(p16y));
}

function exportCSV() {
  saveTable(table, 'hoge.csv');
}

let captureCSV = false;

function CSVControl() {
  if (captureCSV == false) {
    captureCSV = true;
    CSVbutton.value = "ExportCSV";
  } else {
    exportCSV();
    setupCSV();
    captureCSV = false;
    CSVbutton.value = "CaptureCSV";
  }
}

var bgCam = false;
var showSkelton = true;
var addHead = false;

function checkBox() {
  var u = document.querySelectorAll('.form1 .ch');
  bgCam = u[0].checked;
  if (bgCam == true) {
    _img.clear();
  } else {
    _img.background(0);
  }
  // var ch2 = u[1].checked;

  showSkelton = u[1].checked;
  addHead = u[2].checked;
}



// MODE
// 0 [ bg:white;  skelton:true; line plot

// 0	nose
// 1	leftEye
// 2	rightEye
// 3	leftEar
// 4	rightEar
// 5	leftShoulder
// 6	rightShoulder
// 7	leftElbow
// 8	rightElbow
// 9	leftWrist
// 10	rightWrist
// 11	leftHip
// 12	rightHip
// 13	leftKnee
// 14	rightKnee
// 15	leftAnkle
// 16	rightAnkle