const days = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday'
]

// ##################
// # initialization #
// ##################

function initContent() {
    let content = {}
    $.ajax({
        url: '/resources/json/main.json',
        dataType: 'json',
        async: false,
        success: function (data) {
            content = data
        }
    })
    return content
}
const content = initContent()

var timetable = {}
function initClasses() {
    $.ajax({
        url: '/resources/json/timetable.json',
        dataType: 'json',
        async: false,
        success: function (data) {
            timetable = data
        }
    })
}
initClasses()

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
                <p v-if="c.type == 'text'" class="text">{{ c.value }}</p>
                <p v-if="c.type == 'subtext'" class="subtext">{{ c.value }}</p>
                <p v-if="c.type == 'link'"><a :href="c.value.href" class="link">{{ c.value.text }}</a></p>
                <timetable v-if="c.type == 'classes'"/>
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

const Timetable = Vue.component('timetable', {
    template: `
        <div>
            <component :is="classPage!==''?'a':'div'" :href="classPage" class="timetable">
                <p class="text">{{ className }}</p>
                <p class="subtext">{{ classPlace }}</p>
                <p class="subtext">{{ classTime }}</p>
            </component>
        </div>
        `,
    data: function () {
        return {
            className: 'calculating name...',
            classPlace: 'calculating place...',
            classTime: 'calculating time...',
            classPage: ''
        }
    },
    methods: {
        stringifyDate: (start, duration) => {
            let end = start + duration
            start = (Math.floor(start / 60) + (start % 60) / 100).toFixed(2)
            end = (Math.floor(end / 60) + (end % 60) / 100).toFixed(2)
            return `${start} to ${end}`
        },
        classNow: () => {
            const date = new Date()
            const startDate = new Date(
                `${timetable.startDay[0]}-${timetable.startDay[1]}-${timetable.startDay[2]}`
            )

            const day =
                (date.getDay() - startDate.getDay() + 1) %
                timetable.numberOfDays
            const mins = date.getHours() * 60 + date.getMinutes()

            const firstOfWeek = timetable.classes.every(
                (element) =>
                    element.day < day ||
                    (element.day == day &&
                        element.start + element.duration <= mins)
            )
            const now = timetable.classes.findIndex(
                (element) =>
                    // next days first - next week
                    firstOfWeek ||
                    // today and now
                    (element.day == day &&
                        element.start + element.duration > mins &&
                        element.start < mins) ||
                    // today and next
                    (element.day == day && element.start > mins) ||
                    // next days first - same week
                    element.day > day
            )
            return now
        },
        setTimetable: (component) => {
            const i = component.classNow()
            if (i == -1) {
                component.className = 'not in class at the moment'
                component.classPlace = ''
                component.classTime = ''
                component.classPage = ''
            } else {
                const now = timetable.classes[i]
                component.className = now.name
                component.classPlace = now.place
                component.classTime = `${
                    days[now.day % 7]
                } ${component.stringifyDate(now.start, now.duration)}`
                component.classPage = now.href ? now.href : ''
            }
        }
    },
    beforeDestroy() {
        clearInterval(this.interval)
    },
    created() {
        this.setTimetable(this)
        this.interval = setInterval(() => this.setTimetable(this), 1000)
    }
})

// ##########
// # router #
// ##########

function initRouter() {
    let routes = []
    routes.push({
        path: '/',
        redirect: '/hello'
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
