// content
function initContent() {
    let content = {}
    $.ajax({
        url: '/resources/json/main.json',
        dataType: 'json',
        async: false,
        success: function(data) {
            content = data
        }
    })
    return content
}
const content = initContent()

// components
const Morpher = Vue.component('morpher', { 
    props: ['name'],
    template: `
        <div>
            <div v-for="c in content[this.name]">
                <p v-if="c.type == 'text'" class="text">{{ c.value }}</p>
                <p v-if="c.type == 'subtext'" class="subtext">{{ c.value }}</p>
                <p v-if="c.type == 'link'"><a :href="c.value.href" class="link">{{ c.value.text }}</a></p>
            </div>
        </div>`,
    data: function () {
        return {
            content: content
        }
    }
})

const NotFound = { 
    template: `
        <div>
            <p>404 not found</p>
        </div>`
}

// router
function initRouter() {
    var routes = []
    routes.push({ 
        path: '/', 
        redirect: '/hello',
    })
    for (let i = 0; i < Object.keys(content).length; i++) {
        routes.push({ 
            path: '/'+Object.keys(content)[i], 
            name: Object.keys(content)[i], 
            component: Morpher,
            props: { name: Object.keys(content)[i] }
        })
    }
    routes.push({ 
        path: '/*', 
        name: 'notfound', 
        component: NotFound 
    })
    return routes
}
const routes = initRouter()

const router = new VueRouter({
    routes,
    mode: 'history'
})

// Vue instance
const app = new Vue({
    el: '#app',
    router,
    data: {
        menu: Object.keys(content)
    }
})