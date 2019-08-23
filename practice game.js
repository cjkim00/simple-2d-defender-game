var myGamePiece;
var myScore;
var projectiles = [];
var enemies = [];
var radius = 285;
var centerX = 300;
var centerY = 300;
var projectileTimeFrame = 20;
var projectileSound = [];
var collisionSound;

function startGame() {
    myGameArea = new gamearea();
    myGamePiece = new component(30, 30, "red", 285, 285);
    myScore = new scoreBoard("30px", "Consolas", "black", 280, 40, "text");
    myGameArea.start();
}

function restartGame() {
    document.getElementById("myfilter").style.display = "none";
    document.getElementById("myrestartbutton").style.display = "none";
    myGameArea.stop();
    myGameArea.clear();
    myGameArea = {};
    myGamePiece = {};
    myObstacles = [];
    projectiles = [];
    enemies = [];
    myscore = {};
    document.getElementById("canvascontainer").innerHTML = "";
    startGame()

}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    }
    this.stop = function () {
        this.sound.pause();
    }
}

function gamearea() {
    this.canvas = document.createElement("canvas"),
    this.start = function () {
        this.canvas.width = 600;
        this.canvas.height = 600;
        document.getElementById("canvascontainer").appendChild(this.canvas);

        this.context = this.canvas.getContext("2d");
        //document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        //myScore.update();
        window.addEventListener('keydown', function (e) {
            e.preventDefault();
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
    }
    this.stop = function () {
        clearInterval(this.interval);
    }
    this.clear = function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type) {

    this.type = type;
    this.width = width;
    this.height = height;
    this.speed = 0;
    //used to change the angle the rectangle is at and to point the projectiles
    this.angle = 0;
    this.moveAngle = 0;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = myGameArea.context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = color;
        ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
        ctx.restore();
    }
    this.newPos = function () {
        this.angle += this.moveAngle * Math.PI / 180;
        this.x += this.speed * Math.sin(this.angle);
        this.y -= this.speed * Math.cos(this.angle);
    }

    this.crashWith = function (otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width - 5);//subtract 5 to make sure the enemy is in contact with the player's square before stopping
        var mytop = this.y;
        var mybottom = this.y + (this.height - 5);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
            (mytop > otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function scoreBoard(width, height, color, x, y, type) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.score = 0;
    this.text = "SCORE: 0";

    this.update = function () {
        ctx.font = this.width + " " + this.height;
        ctx.fillStyle = color;
        ctx.fillText(this.text, this.x, this.y);
    }
}



function projectile(width, height, color, x, y, angle, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speed = 5;
    this.x = x;
    this.y = y;
    //the angle of the projectile should be the same as the component when it was created and should never change
    this.angle = angle;
    this.update = function () {
        ctx = myGameArea.context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = color;
        ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
        ctx.restore();
    }
    this.newPos = function () {
        this.x += this.speed * Math.sin(this.angle);
        this.y -= this.speed * Math.cos(this.angle);
    }


}

function enemy(width, height, color, x, y, angle, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speed = 2;
    this.angle = angle;
    this.x = 285 + (this.speed * Math.sin(this.angle)) * 300;
    this.y = 285 - (this.speed * Math.cos(this.angle)) * 300;

    this.update = function () {
        ctx = myGameArea.context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = color;
        ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
        ctx.restore();
    }
    this.newPos = function () {
        this.x -= this.speed * Math.sin(this.angle);
        this.y += this.speed * Math.cos(this.angle);
    }

    this.crashWith = function (otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width + 3);//add 3 to make sure the enemy is in contact with the projectile
        var mytop = this.y;
        var mybottom = this.y + (this.height + 3);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width + 3);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height + 3);
        var crash = true;
        if ((mybottom < othertop) ||
            (mytop > otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function everyInterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {
        return true;
    }
    return false;
}

function updateGameArea() {
    myGameArea.clear();
    myGameArea.frameNo += 1;
    projectileTimeFrame += 1;
    myGamePiece.moveAngle = 0;
    myGamePiece.speed = 0;
    if (myGameArea.keys && myGameArea.keys[37]) { myGamePiece.moveAngle = -3; }
    if (myGameArea.keys && myGameArea.keys[39]) { myGamePiece.moveAngle = 3; }

    if (projectileTimeFrame >= 30) {

        if (myGameArea.keys && myGameArea.keys[32]) {
            projectiles.push(new projectile(5, 5, "blue", 285, 285, myGamePiece.angle));
            projectileSound = document.createElement("audio");
            projectileSound.src = "Laser Gun Sound Effect.mp3";
            projectileSound.play();
            projectileTimeFrame = 0;
        }
    }

    if (everyInterval(70)) {
        randomAngle = (Math.random() * Math.PI * 2);
        enemies.push(new enemy(20, 20, "black", (Math.cos(randomAngle) * radius) + radius,
            (Math.sin(randomAngle) * radius) + radius, randomAngle));
    }

    for (i = 0; i < enemies.length; i += 1) {
        if (myGamePiece.crashWith(enemies[i])) {
            myGameArea.stop();
            document.getElementById("myfilter").style.display = "block";
            document.getElementById("myrestartbutton").style.display = "block";
            return;


        }
        for (j = 0; j < projectiles.length; j += 1) {
            if (enemies[i].crashWith(projectiles[j])) {
                //myGameArea.stop();
                projectiles.splice(j, 1);
                enemies.splice(i, 1);
                myScore.score += 100;
                myScore.text = "SCORE: " + myScore.score;

            }
        }

        enemies[i].newPos();
        enemies[i].update();
    }

    for (i = 0; i < projectiles.length; i += 1) {
        projectiles[i].newPos();
        projectiles[i].update();
    }
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
}