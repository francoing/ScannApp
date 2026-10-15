import { defineBoot } from '#q-app'
import { VueQueryPlugin } from '@tanstack/vue-query'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli-vite/boot-files
export default defineBoot(({ app }) => {

  VueQueryPlugin.install(app, {
    
  })
    
})
