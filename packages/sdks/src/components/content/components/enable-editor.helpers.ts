import { TARGET } from '../../../constants/target.js';
import { isEditing } from '../../../functions/is-editing.js';
import { isPreviewing } from '../../../functions/is-previewing.js';
import type { Target } from '../../../types/targets.js';

/**
 * SDKS that use the elementRef approach to enable visual editing.
 * We don't need to render the div for other SDKs as they attach event listeners to the window.
 */
export const SDKS_USING_ELEMENT_REF_APPROACH = [
  'svelte',
  'qwik',
  'vue',
] as Target[];

export const needsElementRefDivForEditing =
  SDKS_USING_ELEMENT_REF_APPROACH.includes(TARGET) &&
  (isEditing() || isPreviewing());
