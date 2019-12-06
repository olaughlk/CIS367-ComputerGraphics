/*
fibonacci-points.js
Erik Fredericks
Draw a bunch of animated points using the fibonacci sequence
*/

// Global variables we'll need
var gl;
var points;

// Generate a random VEC2 for position
function getRandomPoint(min_x, max_x, min_y, max_y) {
  var x = Math.random() * (max_x - min_x) + min_x;
  var y = Math.random() * (max_y - min_y) + min_y;
  return vec2(x, y);
}

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

// Generate a random VEC4 for color (opacity included)
function getRandomColor(min, max) {
  //var 
  return vec4(
    Math.floor(getRandomFloat(0,255)),
    Math.floor(getRandomFloat(0,255)),
    Math.floor(getRandomFloat(0,255)),
    255
  );
}

// This function executes our WebGL code AFTER the window is loaded.
// Meaning, that we wait for our canvas element to exist.
window.onload = function init() {
  // Grab the canvas object and initialize it
  var canvas = document.getElementById('gl-canvas');
  gl = WebGLUtils.setupWebGL(canvas);

  var midx = canvas.width / 2;
  var midy = canvas.height / 2;

  // Error checking
  if (!gl) { alert('WebGL unavailable'); }

  // initial vertex and color arrays
  vertices = [
    vec2(0, 0),
  ];
  colors = [
    vec4(1.0, 0.0, 0.0, 1.0),
  ];

  // randomly instantiate positions and colors for all following points
  for (var i = 0; i < 5; ++i) {
    var new_point = getRandomPoint(-0.5, 0.5, -0.5, 0.5);
    vertices.push(new_point);

    var new_color = getRandomColor(0, 255); 
    colors.push(new_color);
  }

  // configure WebGL
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.8, 0.8, 0.8, 1.0);

  // load shaders and initialize attribute buffers
  var program = initShaders(gl, 'vertex-shader', 'fragment-shader');
  gl.useProgram(program);

  var vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, 'vPosition');
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  var vColor = gl.getAttribLocation(program, 'vColor');
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  // bind other points
  for (var i = 1; i < vertices.length; ++i) {
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, i, flatten(vertices[i]));
  }

  



  /*
  // load data into GPU
  var bufferID = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferID);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  // set its position and render it
  var vPosition = gl.getAttribLocation(program, 'vPosition');
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  // set colors
  var vColor = gl.getAttribLocation(program, 'vColor');
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);
  */


  /*
  // bind colors to vertices
  for (var i = 0; i < vertices.length; i+=2) {
    var t = vec4(colors[i]);
    gl.bufferSubData(gl.ARRAY_BUFFER, i, flatten(t));
    gl.bufferSubData(gl.ARRAY_BUFFER, i+1, flatten(t));
  }
  */

  render();
};

// Render whatever is in our gl variable
function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.clearColor(0, 0, 0, 0.3);
  gl.drawArrays(gl.POINTS, 0, vertices.length);
}
