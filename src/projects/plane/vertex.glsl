varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

float PI = 3.141592653589793;

uniform float uVelocity;


vec3 deformationCurve(vec3 position, vec2 uv) {


  position.x = position.x - (sin(uv.y * PI) * uVelocity);
  return position;
}

void main() {	

  vec3 newPosition = deformationCurve(position, uv);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  vUv = uv;
  vNormal = (modelMatrix * vec4(normal,0.0)).xyz;
  vPosition = (modelMatrix * vec4(newPosition, 1.0)).xyz;
}