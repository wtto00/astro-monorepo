import transformerDirectives from '@unocss/transformer-directives'
import transformerVariantGroup from '@unocss/transformer-variant-group'
import { defineConfig, presetIcons, presetUno } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      cdn: 'https://esm.sh/',
      collections: {
        custom: {},
      },
      customizations: {
        iconCustomizer(collection, _icon, props) {
          if (collection === 'custom') {
            props.fill = 'currentColor'
          }
        },
      },
    }),
  ],
  theme: {
    colors: {},
  },
  transformers: [transformerVariantGroup(), transformerDirectives()],
})
