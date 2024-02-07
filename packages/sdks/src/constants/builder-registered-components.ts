import { default as Button } from '../blocks/button/button.lite.jsx';
import { componentInfo as buttonComponentInfo } from '../blocks/button/component-info.js';
import { default as Columns } from '../blocks/columns/columns.lite.jsx';
import { componentInfo as columnsComponentInfo } from '../blocks/columns/component-info.js';
import { componentInfo as formComponentInfo } from '../blocks/form/component-info.js';
import { default as Form } from '../blocks/form/form.lite.jsx';
import { componentInfo as fragmentComponentInfo } from '../blocks/fragment/component-info.js';
import { default as Fragment } from '../blocks/fragment/fragment.lite.jsx';
import { componentInfo as imageComponentInfo } from '../blocks/image/component-info.js';
import { default as Image } from '../blocks/image/image.lite.jsx';
import { componentInfo as formInputComponentInfo } from '../blocks/input/component-info.js';
import { default as FormInput } from '../blocks/input/input.lite.jsx';
import { componentInfo as sectionComponentInfo } from '../blocks/section/component-info.js';
import { default as Section } from '../blocks/section/section.lite.jsx';
import { componentInfo as slotComponentInfo } from '../blocks/slot/component-info.js';
import { default as Slot } from '../blocks/slot/slot.lite.jsx';
import { componentInfo as formSubmitButtonComponentInfo } from '../blocks/submit-button/component-info.js';
import { default as FormSubmitButton } from '../blocks/submit-button/submit-button.lite.jsx';
import { componentInfo as symbolComponentInfo } from '../blocks/symbol/component-info.js';
import { default as Symbol } from '../blocks/symbol/symbol.lite.jsx';
import { componentInfo as textComponentInfo } from '../blocks/text/component-info.js';
import { default as Text } from '../blocks/text/text.lite.jsx';
import type { RegisteredComponent } from '../context/types.js';
import { getExtraComponents } from './extra-components.js';

/**
 * Returns a list of all registered components.
 * NOTE: This needs to be a function to work around ESM circular dependencies.
 */
export const getDefaultRegisteredComponents: () => RegisteredComponent[] =
  () => [
    { component: Button, ...buttonComponentInfo },
    { component: Columns, ...columnsComponentInfo },
    { component: Form, ...formComponentInfo },
    { component: FormInput, ...formInputComponentInfo },
    { component: FormSubmitButton, ...formSubmitButtonComponentInfo },
    { component: Fragment, ...fragmentComponentInfo },
    { component: Image, ...imageComponentInfo },
    { component: Section, ...sectionComponentInfo },
    { component: Slot, ...slotComponentInfo },
    { component: Symbol, ...symbolComponentInfo },
    { component: Text, ...textComponentInfo },
    ...getExtraComponents(),
  ];
