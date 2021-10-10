// ##############
// # components #
// ##############

const NavBar = Vue.component('navbar', {
    props: ['menu'],
    template: `
        <nav class='navbar'>
            <router-link v-for='btn in menu' 
            :to='"/"+btn'
            :key='btn' 
            :class='$route.name == btn ? "clicked" : "notclicked"'
            >{{ btn }}</router-link>
        </nav>`
})

const Morpher = Vue.component('morpher', {
    props: ['name'],
    template: `
        <div>
            <p v-if="content[this.name].length == 0">no content</p>
            <div v-for="c in content[this.name]">
                <img v-if="c.type == 'image'" :src="c.src" :class="'image '+c.param" loading="lazy">
                <p v-if="c.type == 'text'" v-html="c.value" class="text">{{ c.value }}</p>
                <p v-if="c.type == 'subtext'" v-html="c.value" class="subtext">{{ c.value }}</p>
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

// ##########
// # router #
// ##########

function initRouter() {
    let routes = []
    routes.push({
        path: '/',
        redirect: '/' + Object.keys(content)[0]
    })
    for (let i = 0; i < Object.keys(content).length; i++) {
        routes.push({
            path: '/' + Object.keys(content)[i],
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

// ################
// # Vue instance #
// ################

const app = new Vue({
    el: '#app',
    router,
    data: {
        menu: Object.keys(content)
    }
})
