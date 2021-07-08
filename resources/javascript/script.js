// components
const Hello = { 
    template: `
        <div>
            <p>hello, i'm Csizmadia Tamás</p>
            <p>elte ik cs bsc 4th semester</p>
            <p>junior front-end web developer</p>
            <p>js, html, css, vue</p>
        </div>`
}

const Files = { 
    template: `
        <ul>
            <li v-for='f in files'>
                <a class='file' :href='f.link'>{{ f.name }}</a>
            </li>
        </ul>`,
    data: function () {
        return {
            files: [
                {link: '/file/cv.pdf', name: 'curriculum vitae'}
            ]
        }
    }
}

const Links = { 
    template: `
        <ul>
            <li v-for='l in links'>
                <a class='file' :href='l.link'>{{ l.name }}</a>
            </li>
        </ul>`,
    data: function () {
        return {
            links: [
                {link: '/set', name: 'set - card game'},
                {link: '/christmas', name: 'christmas chooser (under development)'}
            ]
        }
    }
}

const NotFound = { 
    template: `
        <div>
            <p>404 not found</p>
        </div>`
}

// router
const routes = [
    { path: '/', redirect: '/hello' },
    { path: '/hello', name: 'hello', component: Hello },
    { path: '/files', name: 'files', component: Files },
    { path: '/links', name: 'links', component: Links },
    { path: '/*', name: 'notfound', component: NotFound }
]

const router = new VueRouter({
    routes,
    mode: 'history'
})

// Vue instance
const app = new Vue({
    el: '#app',
    router,
    data: {
        menu: [
            'hello',
            'files',
            'links'
        ]
    }
})