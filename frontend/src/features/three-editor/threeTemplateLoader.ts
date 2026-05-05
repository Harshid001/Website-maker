import { defaultThreeScene, type ThreeScenePreset } from './defaultThreeScene';
import type { Template } from '../../types/template.types';

export function loadThreeSceneFromTemplate(template?: Template | null): ThreeScenePreset {
  const scene = template?.content?.threeScene as unknown as ThreeScenePreset | undefined;

  if (!scene || !Array.isArray(scene.objects)) {
    return defaultThreeScene;
  }

  return {
    ...defaultThreeScene,
    ...scene,
    lights: scene.lights?.length ? scene.lights : defaultThreeScene.lights,
    objects: scene.objects?.length ? scene.objects : defaultThreeScene.objects,
  };
}
