import { MeshGeometry } from "../mesh/mesh-geometry"
import { PhysicallyBasedMaterialAlphaMode } from "./pbr-alpha"
import { PhysicallyBasedMaterialDebugMode } from "./pbr-debug"
import { PhysicallyBasedMaterial } from "./pbr-material"
import { LightingEnvironment } from "../lighting/lighting-environment"
import { Mesh3D } from "../mesh/mesh"

export namespace PhysicallyBasedFeatures {
  export function build(mesh: Mesh3D, geometry: MeshGeometry, material: PhysicallyBasedMaterial, lightingEnvironment: LightingEnvironment) {
    let features: string[] = []

    if (geometry.normals) {
      features.push("HAS_NORMALS 1")
    }
    if (geometry.uvs) {
      features.push("HAS_UV_SET1 1")
    }
    if (geometry.tangents) {
      features.push("HAS_TANGENTS 1")
    }
    if (geometry.targets) {
      for (let i = 0; i < geometry.targets.length; i++) {
        if (geometry.targets[i].positions) {
          features.push("HAS_TARGET_POSITION" + i)
        }
        if (geometry.targets[i].normals) {
          features.push("HAS_TARGET_NORMAL" + i)
        }
        if (geometry.targets[i].tangents) {
          features.push("HAS_TARGET_TANGENT" + i)
        }
      }
      if (mesh.morphWeights) {
        features.push(`WEIGHT_COUNT ${mesh.morphWeights.length}`)
        features.push("USE_MORPHING 1")
      }
    }
    if (material.unlit) {
      features.push("MATERIAL_UNLIT 1")
    }
    features.push("MATERIAL_METALLICROUGHNESS 1")
    features.push("USE_TEX_LOD 1")

    if (lightingEnvironment.lights.length > 0) {
      features.push(`LIGHT_COUNT ${lightingEnvironment.lights.length}`)
      features.push("USE_PUNCTUAL 1")
    }
    if (lightingEnvironment.imageBasedLighting) {
      if (!lightingEnvironment.imageBasedLighting.valid) {
        return undefined
      }
      features.push("USE_IBL 1")
    }
    if (material.baseColorTexture) {
      if (!material.baseColorTexture.valid) {
        return undefined
      }
      features.push("HAS_BASE_COLOR_MAP 1")
    }
    if (material.emissiveTexture) {
      if (!material.emissiveTexture.valid) {
        return undefined
      }
      features.push("HAS_EMISSIVE_MAP 1")
    }
    if (material.normalTexture) {
      if (!material.normalTexture.valid) {
        return undefined
      }
      features.push("HAS_NORMAL_MAP 1")
    }
    if (material.metallicRoughnessTexture) {
      if (!material.metallicRoughnessTexture.valid) {
        return undefined
      }
      features.push("HAS_METALLIC_ROUGHNESS_MAP 1")
    }
    if (material.occlusionTexture) {
      if (!material.occlusionTexture.valid) {
        return undefined
      }
      features.push("HAS_OCCLUSION_MAP 1")
    }
    switch (material.alphaMode) {
      case PhysicallyBasedMaterialAlphaMode.opaque: {
        features.push("ALPHAMODE_OPAQUE 1")
        break
      }
      case PhysicallyBasedMaterialAlphaMode.mask: {
        features.push("ALPHAMODE_MASK 1")
        break
      }
    }
    if (material.debugMode) {
      features.push("DEBUG_OUTPUT 1")
    }
    switch (material.debugMode) {
      case PhysicallyBasedMaterialDebugMode.alpha: {
        features.push("DEBUG_ALPHA 1")
        break
      }
      case PhysicallyBasedMaterialDebugMode.emissive: {
        features.push("DEBUG_EMISSIVE 1")
        break
      }
      case PhysicallyBasedMaterialDebugMode.f0: {
        features.push("DEBUG_F0 1")
        break
      }
      case PhysicallyBasedMaterialDebugMode.metallic: {
        features.push("DEBUG_METALLIC 1")
        break
      }
      case PhysicallyBasedMaterialDebugMode.normal: {
        features.push("DEBUG_NORMAL 1")
        break
      }
      case PhysicallyBasedMaterialDebugMode.occlusion: {
        features.push("DEBUG_OCCLUSION 1")
        break
      }
      case PhysicallyBasedMaterialDebugMode.roughness: {
        features.push("DEBUG_ROUGHNESS 1")
        break
      }
    }
    return features
  }
}