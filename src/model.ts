import * as PIXI from "pixi.js"

import { glTFParser } from "./gltf/gltf-parser"
import { glTFAsset } from "./gltf/gltf-asset"
import { Mesh3D } from "./mesh/mesh"
import { Container3D } from "./container"
import { Animation } from "./animation"
import { MaterialFactory } from "./material"

/**
 * Represents a 3D model loaded from a source. The model consists of a 
 * hierarchy of meshes and animations.
 */
export class Model3D extends Container3D {
  /**
   * Creates a new model from a source.
   * @param asset Source to create the model from.
   * @param materialFactory Factory from which to create the material for the
   * meshes of the model.
   */
  static from(asset: glTFAsset, materialFactory?: MaterialFactory) {
    return glTFParser.createModel(asset, materialFactory)
  }

  /** Animations for the model. */
  animations: Animation[] = []

  /**
   * Allows for easier access to the meshes. Note that this list and the actual 
   * childen are not automatically synchronized after the model has been loaded.
   */
  meshes: Mesh3D[] = []

  /**
   * Gets an animation by it's name.
   * @param name Name of the animation.
   */
  getAnimationByName(name: string) {
    return this.animations.find((animation) => { animation.name === name })
  }

  static getMeshByName(name: string, container: PIXI.Container) {
    for (let child of container.children) {
      if (child.name === name && child instanceof Mesh3D) {
        return child
      }
    }
    for (let child of container.children) {
      if (child instanceof PIXI.Container) {
        let result = <Mesh3D>Model3D.getMeshByName(name, child)
        if (result) {
          return result
        }
      }
    }
  }

  /**
   * Gets a mesh by it's name.
   * @param name Name of the mesh.
   */
  getMeshByName(name: string): Mesh3D | undefined {
    return Model3D.getMeshByName(name, this)
  }
}