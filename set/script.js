const game = document.getElementById('game');
const rulesButton = document.getElementById('rules');
const rules = document.getElementsByClassName('show')[0];
const settings = document.getElementsByClassName('show')[1];
const span = document.getElementById('num');
const mode = document.getElementById('mode');
const start = document.getElementById('start');
const front = document.getElementById('front-page');
const toggles = document.getElementsByClassName('toggle');
const hard = document.getElementById('hard');
const topButton = document.getElementById('top');
const topTable = document.getElementById('toplist');
topTable.style.display = "none";

var modeNum = 0;
var numOfPlayers = 1;
var fill = true;

rulesButton.addEventListener('click', rulesClick);
rules.style.display = "none";
function rulesClick() {
    if (rules.style.display === "none") {
        rules.style.display = "block";
        settings.style.display = "none";
        rulesButton.className = "on"
    }
    else {
        rules.style.display = "none";
        settings.style.display = "block";
        rulesButton.className = "off"
    }
}

{
    var b1 = document.createElement('button');
    b1.innerHTML = 1;
    b1.className = "on";
    span.appendChild(b1);
    for (var i = 1; i < 10; i++) {
        var button = document.createElement('button');
        button.innerHTML = i+1;
        button.className = "off";
        span.appendChild(button);
    }
    span.addEventListener('click', numButtonClick);
    function numButtonClick(event) {
        event.preventDefault();
        if (event.target.matches("button")) {
            const button = event.target;
            for (var i = 0; i < 10; i++) {
                var but = span.children[i];
                but.className = "off";
                if (but == button) {
                    button.className = "on";
                    numOfPlayers = i+1;
                }
            }
        }
    }
}

{
    var b1 = document.createElement('button');
    b1.innerHTML = "Gyakorló";
    b1.className = "on";
    mode.appendChild(b1);
    var b2 = document.createElement('button');
    b2.innerHTML = "Verseny";
    b2.className = "off";
    mode.appendChild(b2);
    mode.addEventListener('click', modeButtonClick);
    function modeButtonClick(event) {
        event.preventDefault();
        if (event.target.matches("button")) {
            const button = event.target;
            for (var i = 0; i < 2; i++) {
                if (b2 == button) {
                    b1.className = "off";
                    b2.className = "on"
                    modeNum = 1;
                    toggles[0].checked = false;
                    toggles[1].checked = false;
                    toggles[2].checked = false;
                    toggles[0].disabled = true;
                    toggles[1].disabled = true;
                    toggles[2].disabled = true;
                }
                if (b1 == button) {
                    b1.className = "on";
                    b2.className = "off"
                    modeNum = 0;
                    toggles[0].disabled = false;
                    toggles[1].disabled = false;
                    toggles[2].disabled = false;
                }
            }
        }
    }
}

hard.addEventListener('click', hardClick);
function hardClick() {
    if (hard.innerHTML=="Haladó") {
        hard.innerHTML="Kezdő"
        fill = false;
    }
    else {
        hard.innerHTML="Haladó";
        fill = true;
    }
}

topButton.addEventListener('click',topShow);
function topShow() {
    if (topTable.style.display == "none") {
        topButton.className = "on";
        rulesButton.style.display = "none";
        settings.style.display = "none";
        topTable.style.display = "block";
    }
    else {
        topButton.className = "off";
        rulesButton.style.display = "inline-block";
        settings.style.display = "block";
        topTable.style.display = "none";
    }
}

class Card {
    constructor(form,colour,number,fill) {
        this.form = form;
        this.colour = colour;
        this.number = number;
        this.fill = fill;
    }
    notEqual(card) {
        if (
            this.form == card.form &&
            this.colour == card.colour &&
            this.number == card.number &&
            this.fill == card.fill) return false;
        return true;
    }
    check(card1,card2) {
        if (this.form == card1.form && this.form == card2.form || this.form != card1.form && this.form != card2.form && card1.form != card2.form)
            if (this.colour == card1.colour && this.colour == card2.colour || this.colour != card1.colour && this.colour != card2.colour && card1.colour != card2.colour)
                if (this.number == card1.number && this.number == card2.number || this.number != card1.number && this.number != card2.number && card1.number != card2.number)
                    if (this.fill == card1.fill && this.fill == card2.fill || this.fill != card1.fill && this.fill != card2.fill && card1.fill != card2.fill)
                        return true;
        return false;
    }
}
var gameTable = [];
var rest = [];
function resetCards(a) {
    rest = [];
    for (var i = 0; i < a; i++) {
        var card = new Card(i%3,Math.floor(i/3)%3,Math.floor(i/9)%3,Math.floor(i/27)%3)
        rest.push(card);
    }
}

var startTime;
var endTime;
start.addEventListener('click',startGame);
function startGame() {
    front.className = "hidden";
    gameTable = [];
    sumPlayerPoints = [];
    if (fill) a=81; else a=27;
    resetCards(a);
    console.log(rest);
    for (var i = 0; i < 12; i++) {
        var j = Math.floor(Math.random()*(rest.length-1));
        gameTable.push(rest[j]);
        rest.splice(j,1);
    }
    createTable();
    refreshTable();
    document.getElementById('restnum').innerHTML="Hátralevő kártyák: "+rest.length+" db";
    createPlayers();
    if(numOfPlayers==1) {
        statusbar.innerHTML = "Játékos1 választ!"
        selectedPlayer = 0;
        activePlayer = true;
        startTime = new Date();
    }
    else statusbar.innerHTML = "Válassz játékost!"
    document.getElementById('replay').style.display = "none";
    document.getElementById('cheat').style.display = "inline-block";
    document.getElementById('plus').style.display = "inline-block";
    document.getElementById('check').style.display = "inline-block";
    if (numOfPlayers==1) document.getElementById('players').hidden = true;
    else document.getElementById('players').hidden = false;
    if (toggles[1].checked) document.getElementById('cheat').style.display = "inline-block";
    else document.getElementById('cheat').style.display = "none";
    if (toggles[2].checked) document.getElementById('plus').style.display = "inline-block";
    else document.getElementById('plus').style.display = "none";
    if (toggles[0].checked) document.getElementById('check').style.display = "inline-block";
    else document.getElementById('check').style.display = "none";
    if (!toggles[2].checked) if (!checkif()) {
        while (!checkif() && rest.length>0) plus();
    }
}
document.getElementById('check').addEventListener('click',check)
document.getElementById('plus').addEventListener('click',plus)
document.getElementById('cheat').addEventListener('click',cheat)
document.getElementById('replay').addEventListener('click',replay)


game.addEventListener('click',select);
function createTable() {
    game.innerHTML = "";
    for (var i = 0; i < gameTable.length/3; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j < 3; j++) {
            var td = document.createElement('td');
            tr.appendChild(td);
        }
        game.appendChild(tr);
    }
}

function refreshTable() {
    var i = 0;
    gameTable.forEach(element => {
        var card = document.createElement('img');
        card.src = 'icons/' + element.form + element.colour + element.number + element.fill + '.svg';
        card.style.maxHeight = 60/(gameTable.length/3)+"vmin"
        game.children[Math.floor(i/3)].children[i%3].appendChild(card);
        i++;
    });
}

var playerPoints = [];
var same = false;
function createPlayers() {
    active = []
    inactive = []
    var div = document.getElementById('players');
    div.innerHTML='';
    playerPoints.length=numOfPlayers;
    playerPoints.fill(0);
    sumPlayerPoints.length=numOfPlayers;
    if (!same) sumPlayerPoints.fill(0);
    div.addEventListener('click',selectPlayer);
    for (var i = 0; i < numOfPlayers; i++) {
        var button = document.createElement('button');
        button.className = "sidebutton";
        button.innerHTML = "Játékos" + i + " points: " + playerPoints[i];
        div.appendChild(button);
        active.push(i);
    }
}

var selected = [];
function select(event) {
    if(over==true)return;
    if (cheatActivated == true) return;
    if (activePlayer==false) return
    event.preventDefault();
    if (event.target.matches("img")) {
        const img = event.target;
        if (img.className == "selected") { 
            img.className = "";
            selected = selected.filter(card => card.notEqual(gameTable[img.parentNode.cellIndex + (img.parentNode.parentNode.rowIndex)*3]));
        }
        else {
            img.className = "selected";
            selected.push(gameTable[img.parentNode.cellIndex + (img.parentNode.parentNode.rowIndex)*3]);
        }
        if (document.getElementsByClassName('selected').length>2) {
            checkSet();
            while (document.getElementsByClassName('selected').length>0) {
                document.getElementsByClassName('selected')[0].className = '';
            }
            createTable();
            refreshTable();
            document.getElementById('restnum').innerHTML="Hátralevő kártyák: "+rest.length+" db";
        }
    }
}

var statusbar = document.getElementById('status');
var inactive = [];
var timeout;
var active = []
var activePlayer = false;
var selectedPlayer;
function checkSet() {
    if (!selected[0].check(selected[1],selected[2])) {
        clearTimeout(timeout);
        if (numOfPlayers > 1) {
            inactive.push(selectedPlayer);
        }
        statusbar.innerHTML = "nem SET volt!"
        playerPoints[selectedPlayer]--;
        if (active.length==0) newRound();
    }
    else {
        clearTimeout(timeout);
        document.getElementById('players').children[selectedPlayer].style.opacity = 1;
        if (numOfPlayers > 1) {
            active.push(selectedPlayer);
        }
        statusbar.innerHTML = "SET volt!"
        if (!cheatActivated) playerPoints[selectedPlayer]++;
        for (i of selected) gameTable = gameTable.filter(e => e.notEqual(i));
        for (var i = gameTable.length; i < 12 && rest.length>0; i++) {
            var j = Math.floor(Math.random()*(rest.length-1));
            gameTable.push(rest[j]);
            rest.splice(j,1);
        }
        if (!toggles[2].checked) if (!checkif()) {
            while (!checkif() && rest.length>0) plus();
        }
        if (!cheatActivated) newRound();
    }
    selected = [];
    timeout = null;
    for (var i = 0; i < numOfPlayers; i++) {
        document.getElementById('players').children[i].innerHTML = "Játékos" + i + " points: " + playerPoints[i];
    }
    if (numOfPlayers>1) activePlayer= false;
    if (rest.length == 0 && !checkif()) gameOver();
}

function selectPlayer(event) {
    if(over==true)return;
    event.preventDefault();
    if (event.target.matches("button")) {
        if (event.target.style.opacity == 0.5) return;
        if (timeout != null) return;
        var playerBt = event.target;
        playerBt.style.opacity = 0.5;
        if (numOfPlayers > 1) timeout = setTimeout(onTimeout,10000);
        selectedPlayer = 0;
        while ((playerBt = playerBt.previousSibling) != null ) selectedPlayer++;
        active = active.filter(pl => pl!=selectedPlayer);
        statusbar.innerHTML = "Játékos"+selectedPlayer+" választ!"
        activePlayer = true;
    }
}

function onTimeout() {
    inactive.push(selectedPlayer);
    statusbar.innerHTML = "Lejárt az időd!"
    timeout = null;
    playerPoints[selectedPlayer]--;
    for (var i = 0; i < numOfPlayers; i++) {
        document.getElementById('players').children[i].innerHTML = "Játékos" + i + " points: " + playerPoints[i];
    }
    activePlayer = false;
    if (active.length==0) newRound();
}

function newRound() {
    for (a of inactive) {
        active.push(a);
    }
    inactive = [];
    for (var i = 0; i < numOfPlayers; i++) {
        document.getElementById('players').children[i].style.opacity = 1;
    }
}

function checkif() {
    var found = false;
    var i = 0;
    while (!found && i < gameTable.length) {
        var j = i+1;
        while (!found && j < gameTable.length) {
            var k = j+1;
            while (!found && k < gameTable.length) {
                found = gameTable[i].check(gameTable[j],gameTable[k]);
                k++;
            }
            j++;
        }
        i++;
    }
    return found;
}

function check() {
    if(over==true)return;
    var found = false;
    var i = 0;
    while (!found && i < gameTable.length) {
        var j = i+1;
        while (!found && j < gameTable.length) {
            var k = j+1;
            while (!found && k < gameTable.length) {
                found = gameTable[i].check(gameTable[j],gameTable[k]);
                k++;
            }
            j++;
        }
        i++;
    }
    if(found) statusbar.innerHTML="Van benne SET"
    else statusbar.innerHTML="Nincs benne SET"
}
function plus() {
    if(over==true)return;
    if(timeout!=null)return;
    var tmp = gameTable.length;
    for (var i = gameTable.length; i < tmp+3 && rest.length>0; i++) {
        var j = Math.floor(Math.random()*(rest.length-1));
        gameTable.push(rest[j]);
        rest.splice(j,1);
    }
    selected = [];
    createTable();
    refreshTable();
    document.getElementById('restnum').innerHTML="Hátralevő kártyák: "+rest.length+" db";
}
var cheatActivated=false;
function cheat() {
    if(timeout!=null)return;
    if(over==true)return;
    if (cheatActivated==true) {
        selectedPlayer = 0;
        checkSet();
        while (document.getElementsByClassName('selected').length>0) {
            document.getElementsByClassName('selected')[0].className = '';
        }
        createTable();
        refreshTable();
        document.getElementById('restnum').innerHTML="Hátralevő kártyák: "+rest.length+" db";
        cheatActivated=false;
        document.getElementById('cheat').innerText="Mutass";
        return;
    }
    var found = false;
    var i = 0;
    while (!found && i < gameTable.length) {
        var j = i+1;
        while (!found && j < gameTable.length) {
            var k = j+1;
            while (!found && k < gameTable.length) {
                found = gameTable[i].check(gameTable[j],gameTable[k]);
                k++;
            }
            j++;
        }
        i++;
    }
    if (found) {
        i--;
        j--;
        k--;
        cheatActivated=true;
        while (document.getElementsByClassName('selected').length>0) {
            document.getElementsByClassName('selected')[0].className = '';
        }
        selected.push(gameTable[i]);
        selected.push(gameTable[j]);
        selected.push(gameTable[k]);
        game.children[Math.floor(i/3)].children[i%3].children[0].className="selected";
        game.children[Math.floor(j/3)].children[j%3].children[0].className="selected";
        game.children[Math.floor(k/3)].children[k%3].children[0].className="selected";
        document.getElementById('cheat').innerText="OK";
    }
}

sumPlayerPoints = [];
var over = false;
function gameOver() {
    statusbar.innerHTML = "Vége a játéknak, nincs több SET!"
    document.getElementById('replay').style.display = "inline-block";
    document.getElementById('cheat').style.display = "none";
    document.getElementById('plus').style.display = "none";
    document.getElementById('check').style.display = "none";
    over = true;
    var div = document.getElementById('players');
    var j = 0;
    for (var i = 0; i < numOfPlayers; i++) {
        sumPlayerPoints[i] += playerPoints[i];
    }
    for (d of div.children) {
        d.innerText = "Játékos" + j + " points: " + playerPoints[j].toString() + ", sum: " + sumPlayerPoints[j].toString();
        j++;
    }
    if (numOfPlayers == 1) {
        endTime = new Date;
        var elapsed = endTime - startTime;
        elapsed /= 1000;
        statusbar.innerHTML = "Vége a játéknak, nincs több SET!    idő: " + elapsed + "s  pontszám: " + playerPoints[0];
    }
    refreshTop();
}
function replay() {
    tmp = sumPlayerPoints;
    over = false;
    startGame();
    sumPlayerPoints = tmp;
}

var lastMulti = []
lastMulti.length = 10;
var hardSingle = []
var easySingle = []

function saveStuff() {
    localStorage.setItem('lastMulti', JSON.stringify(lastMulti));
    localStorage.setItem('hardSingle', JSON.stringify(hardSingle));
    localStorage.setItem('easySingle', JSON.stringify(easySingle));
}

function loadStuff(obj) {
  return JSON.parse(localStorage.getItem(obj));
}

function refreshTop() {
    if(numOfPlayers==1) {
        if(fill) {
            hardSingle = loadStuff('hardSingle');
            if (hardSingle == null) {
                hardSingle = []
                hardSingle.length = 4;
                hardSingle.fill(0);
            }
            for (var i = 0; i < 4; i++) {
                if (hardSingle[i]<playerPoints[0]) {
                    var tmp = hardSingle[i];
                    hardSingle[i] = playerPoints[0];
                    playerPoints[0] = tmp;
                }
            }
            saveStuff(hardSingle);
        } else {
            easySingle = loadStuff('easySingle');
            if (easySingle == null) {
                easySingle = []
                easySingle.length = 4;
                easySingle.fill(0);
            }
            for (var i = 0; i < 4; i++) {
                if (easySingle[i]<playerPoints[0]) {
                    var tmp = easySingle[i];
                    easySingle[i] = playerPoints[0];
                    playerPoints[0] = tmp;
                }
            }
            saveStuff(easySingle);
        }
    }
    else {
        lastMulti = loadStuff('lastMulti');
        if (lastMulti==null) {
            lastMulti = []
            lastMulti.fill(null);
        }
        lastMulti.push(playerPoints);
        lastMulti.length = 10;
        saveStuff(hardSingle);
    }
}