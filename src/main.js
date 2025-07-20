import './style.css'
import * as THREE from "three"
import waterFragmentShader from "./shaders/water/fragment.glsl"
import waterVertexShader from "./shaders/water/vertex.glsl"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * TODO
 * 1. Add Fog
 * 2. Figure if we can use these animated vertices for physics somehow
 * 3. Can we add a illusion of Foam?
 */

/**
 * Init
 */
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(0.5, 0.3, 0.6)
scene.add(camera)

const debugObject = {}
debugObject.depthColor = "#19199f"
debugObject.surfaceColor = "#9898f1"


/**
 * Plane
 */
const planeGeom = new THREE.PlaneGeometry(1, 1, 512, 512)
const planeMaterial = new THREE.ShaderMaterial({
  vertexShader: waterVertexShader,
  fragmentShader: waterFragmentShader,
  uniforms: {
    uTime: { value: 0},
    uBigWavesElevation: { value: 0.1 },
    uBigWavesFrequency: { value: new THREE.Vector2(5, 2)},
    uBigWavesSpeed: { value: 0.75 },
    uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
    uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
    uColorMultiplier: { value: 2.89 },
    uColorOffset: { value: 0.17 },
    uSmallWavesFrequency: { value: 5.0 },
    uSmallWavesIterations: { value: 3.0 },
    uSmallWavesDescalation: { value: 0.09 },
    uSmallWavesSpeed: { value: 0.25 }
  }
})
const plane = new THREE.Mesh(planeGeom, planeMaterial)
plane.rotation.x = - Math.PI * 0.5
scene.add(plane)


const gui = new GUI({ width: 400 })
gui.add(planeMaterial.uniforms.uBigWavesElevation, "value", 0.01, 1, 0.01).name("Big Waves Elevation")
gui.add(planeMaterial.uniforms.uBigWavesFrequency.value, "x", 0, 10, 0.01).name("Big Waves Freq X")
gui.add(planeMaterial.uniforms.uBigWavesFrequency.value, "y", 0, 10, 0.01).name("Big Waves Freq Y")
gui.add(planeMaterial.uniforms.uBigWavesSpeed, "value", 0.1, 10, 0.01).name("Big Waves Speed")
gui.add(planeMaterial.uniforms.uColorMultiplier, "value", 0.01, 5.0, 0.01).name("Color Multiplier")
gui.add(planeMaterial.uniforms.uColorOffset, "value", 0.01, 2.0, 0.01).name("Color Offset")
gui.addColor(debugObject, "depthColor").name("Depth Color").onChange((_value) => planeMaterial.uniforms.uDepthColor.value.set(_value))
gui.addColor(debugObject, "surfaceColor").name("Surface Color").onChange((_value) => planeMaterial.uniforms.uSurfaceColor.value.set(_value))
gui.add(planeMaterial.uniforms.uSmallWavesFrequency, "value", 0, 10, 0.01).name("Small Waves Freq")
gui.add(planeMaterial.uniforms.uSmallWavesIterations, "value", 0, 10, 1).name("Small Waves Detailing")
gui.add(planeMaterial.uniforms.uSmallWavesDescalation, "value", 0, 1, 0.01).name("Small Waves Descalation")
gui.add(planeMaterial.uniforms.uSmallWavesSpeed, "value", 0, 2, 0.01).name("Small Waves Speed")

/**
 * Renderer
 */
const canvas = document.getElementById("webgl-canvas")
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
renderer.setSize(window.innerWidth, window.innerHeight)

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})


const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const clock = new THREE.Clock()
const tick = () => {
  requestAnimationFrame(tick)

  const elapsedTime = clock.getElapsedTime()
  planeMaterial.uniforms.uTime.value = elapsedTime

  controls.update()
  renderer.render(scene, camera)
}

tick()
