import { For, Show, useStore, useTarget } from '@builder.io/mitosis';
import Blocks from '../../components/blocks/index.js';
import type { AccordionProps } from './accordion.types.js';

export default function Accordion(props: AccordionProps) {
  const state = useStore({
    open: [] as number[],
    get onlyOneAtATime() {
      return Boolean(props.grid || props.oneAtATime);
    },
    get accordionStyles() {
      const styles = useTarget({
        reactNative: {
          display: 'flex' as 'flex' | 'none',
          flexDirection: 'column' as 'row' | 'column' | 'column-reverse',
        },
        default: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          cursor: 'pointer',
        },
      });
      return Object.fromEntries(
        Object.entries(styles).filter(([_, value]) => value !== undefined)
      );
    },
  });

  return (
    <div
      class="builder-accordion"
      style={{
        display: 'flex',
        alignItems: 'stretch',
        flexDirection: 'column',
        ...(props.grid && {
          flexDirection: 'row',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }),
      }}
    >
      <For each={props.items}>
        {(item, index) => (
          <div key={index}>
            <div
              class={`builder-accordion-title builder-accordion-title-${
                state.open.includes(index) ? 'open' : 'closed'
              }`}
              style={state.accordionStyles}
              data-index={index}
              onClick={() => {
                if (state.open.includes(index)) {
                  state.open = state.onlyOneAtATime
                    ? []
                    : state.open.filter((item) => item !== index);
                } else {
                  state.open = state.onlyOneAtATime
                    ? [index]
                    : state.open.concat(index);
                }
              }}
            >
              <Blocks
                blocks={item.title}
                path={`items.${index}.title`}
                parent={props.builderBlock.id}
                context={props.builderContext}
                registeredComponents={props.builderComponents}
                linkComponent={props.builderLinkComponent}
              />
            </div>
            <Show when={state.open.includes(index)}>
              <div
                class={`builder-accordion-detail builder-accordion-detail-${
                  state.open.includes(index) ? 'open' : 'closed'
                }`}
              >
                <Blocks
                  blocks={item.detail}
                  path={`items.${index}.detail`}
                  parent={props.builderBlock.id}
                  context={props.builderContext}
                  registeredComponents={props.builderComponents}
                  linkComponent={props.builderLinkComponent}
                />
              </div>
            </Show>
          </div>
        )}
      </For>
    </div>
  );
}
