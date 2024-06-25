import type { Signal } from '@builder.io/mitosis';
import { TARGET } from '../../constants/target.js';
import type {
  BuilderContextInterface,
  RegisteredComponent,
  RegisteredComponents,
} from '../../context/types.js';
import { evaluate } from '../../functions/evaluate/index.js';
import { extractTextStyles } from '../../functions/extract-text-styles.js';
import { getProcessedBlock } from '../../functions/get-processed-block.js';
import { getStyle } from '../../functions/get-style.js';
import type { BuilderBlock } from '../../types/builder-block.js';
import type { RepeatData } from './types.js';

export const getComponent = ({
  block,
  context,
  registeredComponents,
}: {
  block: BuilderBlock;
  context: BuilderContextInterface;
  registeredComponents: RegisteredComponents;
}) => {
  const componentName = getProcessedBlock({
    block,
    localState: context.localState,
    rootState: context.rootState,
    rootSetState: context.rootSetState,
    context: context.context,
    shouldEvaluateBindings: false,
  }).component?.name;

  if (!componentName) {
    return null;
  }

  const ref = registeredComponents[componentName];

  if (!ref) {
    // TODO: Public doc page with more info about this message
    console.warn(`
      Could not find a registered component named "${componentName}". 
      If you registered it, is the file that registered it imported by the file that needs to render it?`);
    return undefined;
  } else {
    return ref;
  }
};

export const getRepeatItemData = ({
  block,
  context,
}: {
  block: BuilderBlock;
  context: BuilderContextInterface;
}): RepeatData[] | undefined => {
  /**
   * we don't use `state.processedBlock` here because the processing done within its logic includes evaluating the block's bindings,
   * which will not work if there is a repeat.
   */
  const { repeat, ...blockWithoutRepeat } = block;

  if (!repeat?.collection) {
    return undefined;
  }

  const itemsArray = evaluate({
    code: repeat.collection,
    localState: context.localState,
    rootState: context.rootState,
    rootSetState: context.rootSetState,
    context: context.context,
    enableCache: true,
  });

  if (!Array.isArray(itemsArray)) {
    return undefined;
  }

  const collectionName = repeat.collection.split('.').pop();
  const itemNameToUse =
    repeat.itemName || (collectionName ? collectionName + 'Item' : 'item');

  const repeatArray = itemsArray.map<RepeatData>((item, index) => ({
    context: {
      ...context,
      localState: {
        ...context.localState,
        $index: index,
        $item: item,
        [itemNameToUse]: item,
        [`$${itemNameToUse}Index`]: index,
      },
    },
    block: blockWithoutRepeat,
  }));

  return repeatArray;
};

export const getInheritedStyles = ({
  block,
  context,
}: {
  block: BuilderBlock;
  context: BuilderContextInterface;
}) => {
  const style = getStyle({ block, context });
  if (!style) {
    return {};
  }
  return extractTextStyles(style);
};

export const provideLinkComponent = (
  block: RegisteredComponent | null | undefined,
  linkComponent: any
) => {
  return block &&
    ((block.isRSC && TARGET === 'rsc') ||
      [
        'Core:Button',
        'Symbol',
        'Columns',
        'Form:Form',
        'Builder: Tabs',
        'Builder:Accordion',
      ].includes(block.name))
    ? { builderLinkComponent: linkComponent }
    : {};
};

export const provideRegisteredComponents = (
  block: RegisteredComponent | null | undefined,
  registeredComponents: RegisteredComponents
) => {
  return block &&
    ((block.isRSC && TARGET === 'rsc') ||
      [
        'Symbol',
        'Columns',
        'Form:Form',
        'Builder: Tabs',
        'Builder:Accordion',
      ].includes(block.name))
    ? { builderComponents: registeredComponents }
    : {};
};

export const provideBuilderBlock = (
  block: RegisteredComponent | null | undefined
) => {
  /**
   * Our built-in components frequently make use of the block, so we provide all of it under `builderBlock`
   */
  return block &&
    ((block.isRSC && TARGET === 'rsc') ||
      (TARGET === 'reactNative' && block.name === 'Text') ||
      [
        'Builder:Accordion',
        'Columns',
        'Form:Form',
        'Builder: Tabs',
        'Symbol',
        'Image',
        'Video',
      ].includes(block.name))
    ? { builderBlock: block }
    : {};
};

export const provideBuilderContext = (
  block: RegisteredComponent | null | undefined,
  context: Signal<BuilderContextInterface>
) => {
  return block &&
    ((block.isRSC && TARGET === 'rsc') ||
      [
        'Builder:Accordion',
        'Columns',
        'Form:Form',
        'Builder: Tabs',
        'Symbol',
        'Slot',
      ].includes(block.name))
    ? {
        builderContext: context,
      }
    : {};
};
