import { findDOMNode } from 'react-dom';
import type { BuilderContextInterface } from '../context/types.js';
import type { BuilderBlock } from '../types/builder-block.js';
import { isEditing } from './is-editing.js';

export function transformBlockProperties({
  properties,
  block,
}: {
  block: BuilderBlock;
  context: BuilderContextInterface;
  properties: any;
}) {
  if (!isEditing()) {
    return properties;
  }

  const id = properties['builder-id'];

  if (!id) {
    console.warn('No builder-id found on properties', properties);
  }

  properties.ref = (ref) => {
    if (isEditing()) {
      const el = findDOMNode(ref);
      if (el && !(el instanceof Text)) {
        el.setAttribute('builder-id', id);
        el.classList.add(id);
        // Support inline text editing for React Native SDK
        if (block.component?.name === 'Text') {
          const textElement = el.querySelector('[dir="auto"]');
          if (textElement) {
            textElement.classList.add('builder-text');
            (textElement as HTMLDivElement).style.outline = 'none';
          }
        }
      }
    }
  };
  return properties;
}
