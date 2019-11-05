/*
fibonacci-points.js
Erik Fredericks
Draw a bunch of animated points using the fibonacci sequence
*/

// Global variables we'll need
var gl;
var points;

function getRandomPoint(min_x, max_x, min_y, max_y) {
  var x = Math.random() * (max_x - min_x) + min_x;
  var y = Math.random() * (max_y - min_y) + min_y;
  return vec2(x, y);
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

  // initial vertex
  vertices = [
    vec2(-1, 0),
  ];

  // fibonacci it up!
  for (var i = 0; i < 100; ++i) {
    var new_point = getRandomPoint(-1.0, 1.0, -1.0, 1.0);
    vertices.push(new_point);
  }



  // configure WebGL
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  // load shaders and initialize attribute buffers
  var program = initShaders(gl, 'vertex-shader', 'fragment-shader');
  gl.useProgram(program);

  // load data into GPU
  var bufferID = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferID);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  // set its position and render it
  var vPosition = gl.getAttribLocation(program, 'vPosition');
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);
  render();
};

// Render whatever is in our gl variable
function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, vertices.length);
}
