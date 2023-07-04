document.addEventListener("DOMContentLoaded", function () {
  var app = new Vue({
    el: '#Exercise',
    data: {
      description: {
        value: 'A pair of warm, fuzzy socks',
      },
      Link: {
        href: 'https://www.vuemastery.com/courses/intro-to-vue-js/attribute-binding'

      },
      Title: {
        text: 'This is a Title of Link'
      },
      inSale: true
    }
  })
  Vue.config.devtools = true;
});