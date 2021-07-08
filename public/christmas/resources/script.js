// query selectors
const bt1 = document.querySelector('#bt1')
const bt2 = document.querySelector('#bt2')
const buttons = [bt1,bt2]
const main = document.querySelector('main')

const draw = document.querySelector('#draw')
const edit = document.querySelector('#edit')
const pages = [draw,edit]

const drawn = document.querySelector('#drawn')
const drawbtn = document.querySelector('#drawbtn')
const user = document.querySelector('#user')
const pwd = document.querySelector('#pwd')
const usrerr = document.querySelector('#usrerr')
const pwderr = document.querySelector('#pwderr')

const addbtn = document.querySelector('#addbtn')
const addusr = document.querySelector('#addusr')
const addpwd = document.querySelector('#addpwd')
const editlist = document.querySelector('#editlist')

// useful handler
function handleData(data,where) {
    where.innerHTML += data
}

// automatization
function pageSwitcher(page,button) {
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].className = "notclicked"
    }
    button.className = "clicked"
    for (var i = 0; i < pages.length; i++) {
        pages[i].style.display = "none"
    }
    page.style.display = "block"
}

// main
pageSwitcher(draw,bt1)
loadUsersForEdit()

// history builder
window.onpopstate = function(s) {
    if (s.state.page=="draw") {
        pageSwitcher(draw,bt1)
    }
    if (s.state.page=="edit") {
        pageSwitcher(edit,bt2)
    }
}

// event listeners
bt1.addEventListener('click', bt1Click)
function bt1Click(e) {
    history.pushState({page:'draw'},'')
    e.preventDefault()
    pageSwitcher(draw,bt1)
}
bt2.addEventListener('click', bt2Click)
function bt2Click(e) {
    history.pushState({page:'edit'},'')
    e.preventDefault()
    pageSwitcher(edit,bt2)
}
drawbtn.addEventListener('click', drawClick)
function drawClick(e) {
    e.preventDefault()
    loadUsersForSignIn(user.value,pwd.value)
}
addbtn.addEventListener('click', addClick)
function addClick(e) {
    e.preventDefault()
    loadUsersForAdd(addusr.value, addpwd.value)
}

// ajax
function loadUsersForSignIn(username,password) {
    $.ajax({
        'url': 'resources/users.json',
        'dataType': 'json',
        'success': function(data) {signIn(username, password, data)}
    });
}
function requestDraw(username, users) {
    $.ajax({
        'url': 'resources/names.json',
        'dataType': 'json',
        'success': function(data) {handleData(getDrawn(username, data), drawn)}
    });
}
function loadUsersForEdit() {
    $.ajax({
        'url': 'resources/users.json',
        'dataType': 'json',
        'success': function(data) {editUsers(data)}
    });
}
function loadUsersForAdd(username, password) {
    $.ajax({
        'url': 'resources/users.json',
        'dataType': 'json',
        'success': function(data) {addUser(username, password, data)}
    });
}
function saveUsers(data) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'saveusers.php', true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify(data));
}
function saveDraw(data) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'savedraw.php', true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify(data));
}

// func - draw
function signIn(username, password, users) {
    console.log("sign-in: "+username+" "+password)
    exists = users.some( function(element) {
        if (element['user'] == username) {
            if (element['pwd'] != password) {
                pwderr.innerHTML = "invalid password"
            } else {
                pwderr.innerHTML = ""
                usrerr.innerHTML = ""
                requestDraw(username, users)
            }
            return true
        }
    });
    if (!exists) usrerr.innerHTML = "invalid name"
}
function getDrawn(username, names) {
    return "<p>rng: "+names[username]+"</p>"
}

// func - edit
function editUsers(users) {
    editlist.innerHTML = ''
    users.forEach(element => {
        var li = document.createElement('li')
        li.innerHTML = element['user']
        editlist.appendChild(li)
    });
}
function makeGraph(users) {
    saveDraw(names)
}
function addUser(username, password, users) {
    exists = users.some( function(element) {
        if (element['user'] == username) {
            return true
        }
    });
    if (exists) loadUsersForEdit();
    let user = {}
    user['user'] = username
    user['pwd'] = password
    users.push(user)
    saveUsers(users)
    loadUsersForEdit();
} 
function deleteUser(username, users) {
    i = 0
    exists = users.some( function(element) {
        if (element['user'] == username) {
            return true
        }
        i++
    });
    if (exists) users.splice(i,1);
    saveUsers(users)
    loadUsersForEdit();
}