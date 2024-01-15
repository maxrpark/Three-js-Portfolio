
uniform sampler2D uSample;
uniform float uVelocity;


varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

vec3 rgbShift(sampler2D textureImage, vec2 uv, float offset) {
  vec2 rg = texture2D(textureImage, uv).rg;
  float b = texture2D(textureImage, uv + offset).b;

  return vec3(rg, b);
}

vec3 linerTosRGB(vec3 value){
 vec3 lt = vec3(lessThanEqual(value.rgb, vec3(0.0031308)));
 vec3 v1 = value * 12.92;
 vec3 v2 = pow(value.xyz, vec3(0.41666) * 1.055 - vec3(0.055));
 return mix(v2,v1,lt);
}


void main(){
vec2 uv = vUv;
  vec3 lighting = vec3(0.0);
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(cameraPosition - vPosition);
// vec2 uv = vUv * vec2(3.0 / 4.0, 1.0); // Scale the UV coordinates
// vec3 color = rgbShift(uSample, uv, uVelocity);

// diffuse 
vec3 color =texture2D(uSample, uv).rgb;




  // Diffuse (Directional Light)
  vec3 lightDirection = vec3(2.0,2.0,2.0);
  vec3 lightColor = vec3(1.0,.5,0.5);
  float dp = max(0.0,dot(lightDirection,normal));
  vec3 diffuse  =  dp * lightColor * .004;


  // vec3 diffuse = DirectionalLight(lightDirection,lightColor, .2);
 
  
  // Specular
  // vec3 specular = Specular(lightDirection,lightColor, 128.0, 1.0);
  vec3 reflection = normalize(reflect(-lightDirection,normal));
  float phongValue = max(0.0,dot(viewDir,reflection));
  phongValue = pow(phongValue,32.0);
  vec3 specular =  phongValue * lightColor * .004;



  



  // Fresnel

  float fresnel = 1.0 - max(0.0, dot(viewDir,normal));
  fresnel = pow(fresnel,2.0);
  specular *= fresnel ;


  lighting =   diffuse;
 
  color +=  lighting + specular;

  // Correction
  // color = linerTosRGB(color);


  gl_FragColor = vec4(color, 1.0);

}