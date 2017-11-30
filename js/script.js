var graph = {};
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");
var cycleNodes = [];
var colors = ["red", "green", "blue", "orange", "pink", "purple", "yellow", "#00E640", "#663399", "89C4F4"];

function findPositions(deg) {
  var x = 500 + 250 * Math.cos(deg);
  var y = 300 + 250 * Math.sin(deg);
  return [x.toFixed(0), y.toFixed(0)];
}

function drawLine(a, b) {
  ctx.beginPath();
  ctx.moveTo(graph[a].x, graph[a].y);

  ctx.lineTo(graph[b].x, graph[b].y);

  if (graph[a].inCycle === -1) {
    ctx.strokeStyle = "black";
  } else {
    var colorIndex = graph[b].inCycle % colors.length;
    ctx.strokeStyle = colors[colorIndex];
  }
   
  ctx.stroke();

}

function drawLines() {
  for (var key in graph) {
    drawLine(key, graph[key].neighbour); 
  }
}

function findBuddies(multiplier, numberOfPoints) {
  for (var key in graph) {
    var neighbour = (key * multiplier) % numberOfPoints;
    graph[key].neighbour = neighbour;
  }
}

function allTheMagic(numberOfPoints, ctx) {
  var deg = 2 * Math.PI/numberOfPoints;
  for (var i = 0; i < numberOfPoints; i++) {
    var pos = findPositions(deg * i);
    graph[i] = {x: pos[0], y: pos[1], neighbour: null, visited: false, inCycle: -1};
  }
         
}

function drawCircle() {
  ctx.beginPath();
  ctx.arc(500, 300,250, 0, 2*Math.PI);
  ctx.stroke();
}

function depthFirstSearch(key) {
  if (!graph[key].visited) {
    graph[key].visited = true;
    var neighbour = graph[key].neighbour
    if (graph[neighbour].visited) {
      cycleNodes.push(neighbour);
    }
    depthFirstSearch(graph[key].neighbour);
  }
}

function cycleFinder() {
  for (var key in graph) {
    depthFirstSearch(key);
  }
}

function cycleMarker(key, index) {
  if (graph[key].inCycle === -1) {
    graph[key].inCycle = index;
    cycleMarker(graph[key].neighbour, index);
  }
}

function generateModularMultiplication() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "black";
  drawCircle();
  graph = {};
  cycleNodes = [];
  var numberOfPoints = document.getElementById('points').value;
  var multiplier = document.getElementById('multiplier').value;
  allTheMagic(numberOfPoints, ctx);
  findBuddies(multiplier, numberOfPoints);
  cycleFinder();
  for (var c in cycleNodes) {
    cycleMarker(cycleNodes[c], c);
  }
  drawLines();
}

drawCircle();
