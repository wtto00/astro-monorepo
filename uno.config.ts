import { defineConfig, presetUno, presetIcons } from "unocss";
import transformerVariantGroup from "@unocss/transformer-variant-group";
import transformerDirectives from "@unocss/transformer-directives";

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      cdn: "https://esm.sh/",
      collections: {
        custom: {},
      },
      customizations: {
        iconCustomizer(collection, icon, props) {
          if (collection === "custom") {
            props.fill = "currentColor";
          }
        },
      },
    }),
  ],
  theme: {
    colors: {},
  },
  transformers: [transformerVariantGroup(), transformerDirectives()],
});
