'use strict';

let level = 0;
let nextLevel = 2;
let score = 0;
let mtp = 250;
let timer, duration, seconds, minutes, container;
let characterSelected = "images/char-boy.png";

// Selecionando personagem e iniciando outras funções.
$('img').click(function() {
    characterSelected = $(this).attr("src");
    player.sprite = characterSelected;
    $( '.container' ).css('opacity', '1');
    $( 'canvas' ).css('display', 'initial');
    $( 'body' ).css('background-color', '#fff');
    countdown();
    generateEnemy();
    player = new Player(200, 380, 50);
    $('.select-characters').remove();
})

// Temporizador
function countdown() {
    function startTimer(duration, display) {
        timer = duration, minutes, seconds;
        setInterval(function () {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;

            display.text(minutes + ':' + seconds);


            if (++timer < 0) {
                timer = duration;
            };

        }, 1000);
    };
    jQuery(function ($) {
        let sec = 1,
            display = $('#Timer');
        startTimer(sec, display);
    });
}

// Enemies our player must avoid
let Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.speed = speed;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;

    // quando o inimigo sai do canvas, ele retorna a posição de partida
    if (this.x > 500) {
        this.x = -100;
        this.speed = 100 + Math.floor(Math.random() * mtp);
    }

    // Checando colisão
    if (player.x < this.x + 60 && player.x + 35 > this.x && player.y < this.y + 25 && 30 + player.y > this.y) {
        player.x = 200;
        player.y = 380;
        player.life = player.life - 1
        score -= 50;
        $('#Score').text(score);

        // Diminuindo corações ao colidir
        if (player.life === 2) {
            $('#Heart-3').removeClass('fas fa-heart').addClass('far fa-heart');
        }

        else if (player.life === 1) {
            $('#Heart-2').removeClass('fas fa-heart').addClass('far fa-heart');
        }

        else if (player.life === 0) {
            allEnemies = [];
            player.sprite = 'images/blank.png';
            $('#Heart-1').removeClass('fas fa-heart').addClass('far fa-heart');
            $( '.container' ).css('filter', 'blur(5px)');
            restart();
        }
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

let Player = function(x, y, speed, life) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = characterSelected;
    this.life = 3;
}

Player.prototype.update = function() {
    if (this.y < 0) {
        this.x = 200;
        this.y = 380;
        level++;
        score += 100;
        $('#Score').text(score);
        levelUp();
    }

    if (this.y > 380) {
        this.y = 380;
    }

    if (this.x > 400) {
        this.x = 400;
    }

    if (this.x < 0) {
        this.x = 0;
    }
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(pressKey) {
    if (pressKey === 'left') {
            this.x -= this.speed + 50;
    } else if (pressKey === 'right') {
            this.x += this.speed + 50
    } else if (pressKey === 'up') {
            this.y -= this.speed + 30
    } else if (pressKey === 'down') {
            this.y += this.speed + 30
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let allEnemies = [];

// Position "y" where the enemies will are created
let enemyPosition = [60, 140, 220];
let player = new Player(200, 380, 50);
let enemy;

function generateEnemy() {
    enemyPosition.forEach(function(y) {
        enemy = new Enemy(0, y, 100 + Math.floor(Math.random() * mtp));
        allEnemies.push(enemy);
    });
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    let allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// restartando valores ao perder
function restart() {
    swal({
        title: "Game Over :(",
        text: `Time Played: ${minutes + ':' + seconds} | Score: ${score}`,
        buttons: 'RESTART',
        allowOutsideClick: false,
        closeOnClickOutside: false,
        closeOnEsc: false,
    }).then((normalMode) => {
        if (normalMode) {
            generateEnemy()
            player.sprite = characterSelected;
            player = new Player(200, 380, 50);
            $( '.container' ).css('filter', 'blur(0)');
            level = minutes = seconds = timer = 0;
            nextLevel = 2;
            score = 0;
            mtp = 250;
            player.life = 3;
            $('#Level').text(1);
            $('#Score').text(0);
            $('ul.hearts').children('li').find('*').removeClass('far fa-heart');
            $('ul.hearts').children('li').find('*').addClass('fas fa-heart');
        };
    });
}

// Aumentando level ao chegar no fim 5 vezes
function levelUp() {
    if (level % 5 === 0) {
        mtp += Math.floor(mtp * 0.05);
        $('#Level').text(nextLevel);
        nextLevel++;
    };
};