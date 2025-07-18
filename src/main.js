import './style.css'
import * as THREE from "three"
import waterFragmentShader from "./shaders/water/fragment.frag"
import waterVertexShader from "./shaders/water/vertex.vert"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

/**
 * Init
 */
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(0.7, 0.6, 0.7)
scene.add(camera)


/**
 * Plane
 */
const planeGeom = new THREE.PlaneGeometry(1, 1, 128, 128)
const planeMaterial = new THREE.ShaderMaterial({
  vertexShader: waterVertexShader,
  fragmentShader: waterFragmentShader
})
const plane = new THREE.Mesh(planeGeom, planeMaterial)
plane.rotation.x = - Math.PI * 0.5
scene.add(plane)

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


const tick = () => {
  requestAnimationFrame(tick)

  controls.update()
  renderer.render(scene, camera)
}

tick()
