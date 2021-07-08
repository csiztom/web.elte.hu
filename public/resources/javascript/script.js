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
            <li v-for='r in routerLinks'>
                <router-link class='file' :to='r.link'>{{ r.name }}</router-link>
            </li>
        </ul>`,
    data: function () {
        return {
            links: [
                {link: 'https://github.com/csiztom/web.elte.hu', name: 'github repo'},
                {link: '/set', name: 'set - card game'},
                {link: '/christmas', name: 'christmas chooser (under development)'}
            ],
            routerLinks: [
                {link: '/eventmaker', name: 'event maker'}
            ]
        }
    }
}

const EventMaker = { 
    template: `
        <div>
            <p>eventmaker</p>
            <p>
            name: <input type="text" v-model="name" @change="updateMessage('')">
            </p>
            <p>when are you available?</p>
            <p>
            start: <input type="date" v-model="start" @change="updateMessage('')" placeholder="yyyy-mm-dd">
            end: <input type="date" v-model="end" @change="updateMessage('')" placeholder="yyyy-mm-dd">
            </p>
            <p><button @click="submit">click to submit</button>{{ message }}</p>
            <p>you can add multiple intervals by submitting again</p>
            <p>submitting a day twice makes it free</p>
        </div>`,
    data: function () {
        return {
            name: "",
            start: "",
            end: "",
            message: ""
        }
    },
    methods: {
        submit: function () {
            $.ajax({
                type: "POST",
                url: "/resources/php/submit.php",
                data: {
                    'name': this.name,
                    'start': this.start,
                    'end': this.end
                },
                success: this.updateMessage(" success")
            });
        },
        updateMessage: function (mess) {
            this.message = mess
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
    { path: '/eventmaker', name: 'eventmaker', component: EventMaker },
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