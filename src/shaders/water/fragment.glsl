uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorMultiplier;
uniform float uColorOffset;

varying float vElevation;

void main()
{
    float normalisedElevation = (vElevation + uColorOffset) * uColorMultiplier;
    vec3 seaColor = mix(uDepthColor, uSurfaceColor, normalisedElevation);
    gl_FragColor = vec4(seaColor, 1.0);
}