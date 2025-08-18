/*
State
- score
- lives
- difficulty
- level
- player position
- enemies position
- bullets position
- game over
*/

// Constantes para todo el juego:
const constants = {
    player: {
        dimensions: { width: 30, height: 30 }
    },
    enemy: {
        dimensions: { width: 40, height: 20 }
    }, 
    bullet: {
        dimensions: { width: 5, height: 10 }
    }, 
    scene: {
        dimensions: { width: 800, height: 600 }
    }
}

//Cómo vamos a guardar la informacion de State? En un objeto:
const state = {
    score: 0,
    lives: 3,
    difficulty: 'easy',
    level: 1,
    player: {
        position: { x: 0, y: 0 }
    },
    enemies: [{
        position: { x: 10, y: 10 }, 
    }, {
        position: { x: 20, y: 20 },
    }, {
        position: { x: 40, y: 40 }
    }], 
    bullets: [{
        position: { x: 15, y: 15 },
        type: 'player'
    }, {
        position: { x: 25, y: 25 },
        type: 'enemy'
    }],
    gameOver: false
}

/* 
Logic
- move player
- move enemies
- shoot bullet
- check collision
- update score
- update lives
- update level
- reset game
*/

//ver si colisionan player y enemies utilizando las coordenadas de los vertices de cada uno

//vertices de player
let playerCoord = state.player.position

//vertices de cada enemy
let enemiesCoord = state.enemies

const checkCollision = () => {
    

    //comprobar si alguno de los vertices de player solapa los de alguno de los enemies (o viceversa)
}


