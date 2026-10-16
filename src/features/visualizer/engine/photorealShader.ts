import * as THREE from 'three';

export const PhotorealVertexShader = `
varying vec2 vUv;
varying vec3 vWorldPosition;

void main() {
  vUv = uv;
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const PhotorealFragmentShader = `
uniform sampler2D u_baseMap;
uniform sampler2D u_recolorMap;
uniform sampler2D u_selectionMask;

uniform float u_avgLuminance;
uniform float u_finish; // 0.0: Matte, 1.0: Satin, 2.0: Gloss
uniform float u_crossfade; // 0.0 to 1.0
uniform float u_splitProgress; // 0.0 to 1.0 for Before/After compare
uniform float u_detailBoost; // 0.0 to 1.0

varying vec2 vUv;
varying vec3 vWorldPosition;

// Convert sRGB to Linear space for physically accurate blending
vec3 sRGBToLinear(vec3 col) {
  return pow(col, vec3(2.2));
}

// Convert Linear space back to sRGB for display
vec3 linearTosRGB(vec3 col) {
  return pow(clamp(col, 0.0, 1.0), vec3(1.0 / 2.2));
}

// Standard ITU-R BT.709 relative luminance
float getLuminance(vec3 linearCol) {
  return dot(linearCol, vec3(0.2126, 0.7152, 0.0722));
}

void main() {
  // 1. Sample base equirectangular photograph
  vec4 baseSample = texture2D(u_baseMap, vUv);
  vec3 baseLinear = sRGBToLinear(baseSample.rgb);
  float pixelLum = getLuminance(baseLinear);

  // 2. High-pass micro-texture detail term (retains original wall plaster grain / stipple)
  float safeAvgLum = max(u_avgLuminance, 0.04);
  float highPassDetail = (pixelLum - safeAvgLum) * (0.28 * u_detailBoost);

  // 3. Sample composite recolor texture (contains target paint colors and/or wallpaper patterns)
  vec4 recolorSample = texture2D(u_recolorMap, vUv);
  vec3 targetLinear = sRGBToLinear(recolorSample.rgb);
  float maskAlpha = recolorSample.a;

  // 4. Compute luminance-preserving recolor:
  // New colour = targetColor * (pixelLuminance / surfaceAvgLuminance)
  // This preserves 100% of physical shadows, AO, corner ambient drops, and lighting gradients
  float lumRatio = clamp(pixelLum / safeAvgLum, 0.08, 2.6);
  vec3 shadedColor = targetLinear * lumRatio + highPassDetail;

  // 5. Specular / finish sheen control:
  // - Matte: purely diffuse, zero artificial highlight
  // - Satin: subtle soft highlight boost derived from original highlight luminance
  // - Gloss: crisp reflective sheen on bright specular spots
  if (u_finish > 0.5) {
    float highlightIntensity = max(pixelLum - 0.65, 0.0);
    float satinBoost = pow(highlightIntensity, 2.0) * 0.32;
    shadedColor += vec3(satinBoost);
  }
  if (u_finish > 1.5) {
    float highlightIntensity = max(pixelLum - 0.55, 0.0);
    float glossBoost = pow(highlightIntensity, 1.6) * 0.65;
    shadedColor += vec3(glossBoost);
  }

  // 6. Smooth cross-fade and anti-aliased edge blending
  float effectiveBlend = maskAlpha * clamp(u_crossfade, 0.0, 1.0);
  vec3 blendedLinear = mix(baseLinear, shadedColor, effectiveBlend);

  // 7. Before / After Comparison Split Slider
  // Left side shows custom design; right side shows original base photo
  if (vUv.x > u_splitProgress) {
    blendedLinear = baseLinear;
  }

  // 8. Soft Gold Highlight Outline on Currently Selected Wall
  float selVal = texture2D(u_selectionMask, vUv).r;
  // Edge detection for soft gold halo border
  if (selVal > 0.08 && selVal < 0.92) {
    // Subtle luxury gold outline (#D4AF37 = 0.83, 0.68, 0.21)
    blendedLinear = mix(blendedLinear, vec3(0.83, 0.68, 0.21), 0.70);
  } else if (selVal >= 0.92) {
    // Very gentle gold wash on selected surface
    blendedLinear = mix(blendedLinear, vec3(0.83, 0.68, 0.21), 0.06);
  }

  gl_FragColor = vec4(linearTosRGB(blendedLinear), 1.0);
}
`;

export interface PhotorealUniforms {
  u_baseMap: { value: THREE.Texture | null };
  u_recolorMap: { value: THREE.Texture | null };
  u_selectionMask: { value: THREE.Texture | null };
  u_avgLuminance: { value: number };
  u_finish: { value: number };
  u_crossfade: { value: number };
  u_splitProgress: { value: number };
  u_detailBoost: { value: number };
}

export function createPhotorealMaterial(uniforms: PhotorealUniforms): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: PhotorealVertexShader,
    fragmentShader: PhotorealFragmentShader,
    uniforms: uniforms as unknown as { [uniform: string]: THREE.IUniform },
    side: THREE.DoubleSide, // Always render from inside and outside without culling
    depthWrite: true,
  });
}
