import * as Babylon from 'babylonjs'

class Game {
  private canvas: HTMLCanvasElement
  private engine: Babylon.Engine
  private scene: Babylon.Scene
  private camera: Babylon.TargetCamera
  private shadowGen: Babylon.ShadowGenerator

  constructor (canvasElement: string) {
    this.canvas = document.getElementById(canvasElement) as HTMLCanvasElement
    this.engine = new Babylon.Engine(this.canvas, true)
  }

  initScene (): void {
    this.scene = new Babylon.Scene(this.engine)
    this.camera = new Babylon.ArcRotateCamera('camera', 0, 0, 0, new Babylon.Vector3(-150, 20, -150), this.scene)
    this.camera.setTarget(new Babylon.Vector3(0, 20, 0))
    this.camera.attachControl(this.canvas, true)
    const sunLight = new Babylon.DirectionalLight('sunLight', new Babylon.Vector3(1, -1, 1), this.scene)
    sunLight.position = new Babylon.Vector3(20, 200, 20)
    const sunMesh = Babylon.Mesh.CreateSphere('sunMesh', 10, 2, this.scene)
    sunMesh.position = sunLight.position
    const sunMeshMat = new Babylon.StandardMaterial('sunMeshMat', this.scene)
    sunMesh.material = sunMeshMat
    sunMeshMat.emissiveColor = new Babylon.Color3(1, 1, 0)
    this.shadowGen = new Babylon.ShadowGenerator(1024, sunLight)
    this.shadowGen.useExponentialShadowMap = true
  }

  showSimpleSphere (): void {
    const sphere = Babylon.MeshBuilder.CreateSphere(
      'sphere1',
      { segments: 16, diameter: 2 },
      this.scene
    )
    sphere.position.y = 1
    Babylon.MeshBuilder.CreateGround(
      'ground1',
      { width: 6, height: 6, subdivisions: 2},
      this.scene
    )
  }

  showPull (): void {
    this.scene.enablePhysics()

    // Create the clay
    const clay = Babylon.MeshBuilder.CreateCylinder(
      'clay',
      // 28 mm height, 108 mm diameter
      { height: 2.8, diameter: 10.8 },
      this.scene
    )
    clay.position.x = -200
    clay.position.z = -50
    clay.position.y = 1
    const clayMat = new Babylon.StandardMaterial('clayMat', this.scene)
    clay.material = clayMat
    clayMat.diffuseColor = new Babylon.Color3(1.0, 0.47, 0.0)
    this.shadowGen.addShadowCaster(clay)
    clay.physicsImpostor = new Babylon.PhysicsImpostor(
      clay,
      Babylon.PhysicsImpostor.CylinderImpostor,
      // 100g
      { mass: 0.1, restitution: 0.0 },
      this.scene
    )
    clay.physicsImpostor.setLinearVelocity(new Babylon.Vector3(120, 65, 100))
    clay.physicsImpostor.setAngularVelocity(new Babylon.Vector3(0, 20, 0))

    // And now the ground
    const ground = Babylon.MeshBuilder.CreateGround(
      'ground',
      // 100x100 meters
      { width: 10000, height: 10000, subdivisions: 2},
      this.scene
    )
    ground.receiveShadows = true
    const groundMat = new Babylon.StandardMaterial('groundMat', this.scene)
    groundMat.diffuseColor = new Babylon.Color3(0.13, 0.54, 0.13)
    groundMat.specularColor = new Babylon.Color3(0, 0, 0)
    ground.material = groundMat
    ground.physicsImpostor = new Babylon.PhysicsImpostor(
      ground,
      Babylon.PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 0.9 },
      this.scene
    )
  }

  animate (): void {
    this.engine.runRenderLoop(() => this.scene.render())
    window.addEventListener('resize', () => this.engine.resize())
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const game = new Game('renderCanvas')
  game.initScene()

  const url = new URL(window.location.href)
  if (url.searchParams.has('pull')) {
    game.showPull()
  } else {
    game.showSimpleSphere()
  }

  game.animate()
})
