import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  ignore: ['src/shared/ui/primitives/**', 'src/routeTree.gen.ts'],
  ignoreDependencies: ['tailwindcss', 'tw-animate-css'],
  rules: {
    files: 'warn',
    dependencies: 'warn',
    devDependencies: 'warn',
    exports: 'off',
    types: 'off',
    duplicates: 'warn',
  },
}

export default config
