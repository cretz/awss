import * as Babylon from 'babylonjs'

class Game {
  private canvas: HTMLCanvasElement
  private engine: Babylon.Engine
  private scene: Babylon.Scene
  private camera: Babylon.FreeCamera
  private light: Babylon.Light

  constructor (canvasElement: string) {
    this.canvas = document.getElementById(canvasElement) as HTMLCanvasElement
    this.engine = new Babylon.Engine(this.canvas, true)
  }

  createScene (): void {
    this.scene = new Babylon.Scene(this.engine)
    this.camera = new Babylon.FreeCamera('camera1', new Babylon.Vector3(0, 5, -10), this.scene)
    this.camera.setTarget(Babylon.Vector3.Zero())
    this.camera.attachControl(this.canvas, false)
    this.light = new Babylon.HemisphericLight('light1', new Babylon.Vector3(0, 1, 0), this.scene)
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

  animate (): void {
    this.engine.runRenderLoop(() => this.scene.render())
    window.addEventListener('resize', () => this.engine.resize())
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const game = new Game('renderCanvas')
  game.createScene()
  game.animate()
})
