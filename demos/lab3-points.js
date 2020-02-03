// globals
var canvas;
var gl;
var program;

var numColors         = 8;

var initialSpeed      = 0.05;
var speed             = initialSpeed;

var maxParticles      = 5000;
var initialPointSize  = 10;
var pointSize         = initialPointSize;

var time = 0;
var dt = 1;

var pointsArray = [];
var colorsArray = [];

var cBufferId;
var vBufferId;

var colors = [
  vec4(0.0, 0.0, 0.0, 1.0),
  vec4(1.0, 0.0, 0.0, 1.0),
  vec4(1.0, 0.8, 0.0, 1.0), 
  vec4(0.0, 1.0, 0.0, 1.0),
  vec4(0.0, 0.0, 1.0, 1.0),
  vec4(1.0, 0.0, 1.0, 1.0),
  vec4(0.8, 0.8, 0.8, 1.0),
  vec4(0.0, 1.0, 1.0, 1.0),
];

// get random float between min and max
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

// create a particle object, including its color, original color, velocity, and collision information
function particle() {
  var p = {};
  p.color    = vec4(0, 0, 0, 1);
  p.ocolor   = p.color;
  p.position = vec4(0, 0, 0, 1);
  p.velocity = vec4(0, 0, 0, 0);
  p.cooldown = 10;
  p.collided = false;
  return p;
}
var single_particle = particle();

window.onload = function init() {
  // setup WebGL and canvas
  canvas = document.getElementById('gl-canvas');
  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) { alert("WebGL not available"); }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  // make the point size variable if we wish
  gl.uniform1f(gl.getUniformLocation(program, 'pointSize'), pointSize);

  // setup our buffers and link to shaders
  cBufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
  gl.bufferData(gl.ARRAY_BUFFER, 16*maxParticles, gl.STATIC_DRAW);

  var vColor = gl.getAttribLocation(program, "vColor");
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  vBufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBufferId);
  gl.bufferData(gl.ARRAY_BUFFER, 16*maxParticles, gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  setupPoints();
}

// initialize our particles randomly
var setupPoints = function() {
  // position
  for (var i = 0; i < 3; i++) {
    single_particle.position[i] = getRandomArbitrary(-1.0, 1.0);
    single_particle.velocity[i] = speed * getRandomArbitrary(-1.0, 1.0);
  }
  single_particle.position[3] = 1.0; // w
  single_particle.velocity[2] = 0.0; // z velocity

  // color
  color_index = Math.floor(Math.random() * colors.length);
  single_particle.color  = colors[color_index];
  single_particle.ocolor = single_particle.color;

  pointsArray.push(single_particle.position);
  colorsArray.push(single_particle.color);

  gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(colorsArray));

  gl.bindBuffer(gl.ARRAY_BUFFER, vBufferId);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(pointsArray));

  render();
}

// update the position of our particle(s) each timestep
var update = function() {
  pointsArray = [];
  colorsArray = [];

  // update its position based on a speed/velocity calculation
  single_particle.position = add(single_particle.position, scale(speed * dt, single_particle.velocity));

  // push down each point with an associated color
  pointsArray.push(single_particle.position);
  colorsArray.push(single_particle.color);

  gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(colorsArray));

  gl.bindBuffer(gl.ARRAY_BUFFER, vBufferId);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(pointsArray));
}

// render!
var render = function() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  update();
  
  gl.drawArrays(gl.POINTS, 0, 1);
  requestAnimFrame(render);
}
