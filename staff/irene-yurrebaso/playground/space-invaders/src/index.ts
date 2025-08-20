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

//Guardamos la informacion de State en un objeto:
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

//Collission detection logic
function checkCollision() {
    //cálculo de dimensiones por la mitad (ya que usaremos esa mitad para calcular los vértices)
    const playerHalfWidth = constants.player.dimensions.width / 2;
    const playerHalfHeight = constants.player.dimensions.height / 2;
    const enemyHalfWidth = constants.enemy.dimensions.width / 2;
    const enemyHalfHeight = constants.enemy.dimensions.height / 2;

    //cálculo de posición de los vértices de player usando datos de state y sus 'dimensiones / 2'
    const playerVertices = {
        topLeft: { x: state.player.position.x - playerHalfWidth, y: state.player.position.y + playerHalfHeight },
        topRight: { x: state.player.position.x + playerHalfWidth, y: state.player.position.y + playerHalfHeight },
        bottomRight: { x: state.player.position.x + playerHalfWidth, y: state.player.position.y - playerHalfHeight },
        bottomLeft: { x: state.player.position.x - playerHalfWidth, y: state.player.position.y - playerHalfHeight }
    }

    //usamos método 'some': recorre todo el array de enemies, y calcula si alguno/algunos elementos cumplen con la condición que pasamos en el callback, y devuelve true/false.
    return state.enemies.some(enemy => {
        //cálculo de posición de los vértices de enemy usando datos de state y sus 'dimensiones / 2'
        const enemyVertices = {
            topLeft: { x: enemy.position.x - enemyHalfWidth, y: enemy.position.y + enemyHalfHeight },
            topRight: { x: enemy.position.x + enemyHalfWidth, y: enemy.position.y + enemyHalfHeight },
            bottomRight: { x: enemy.position.x + enemyHalfWidth, y: enemy.position.y - enemyHalfHeight },
            bottomLeft: { x: enemy.position.x - enemyHalfWidth, y: enemy.position.y - enemyHalfHeight }
        }

        //comparamos los vertices de player y enemy. NOTA: fijarse que en realidad solo hace falta utilizar topLeft y bottomRight para el cálculo.
        return playerVertices.topLeft.x <= enemyVertices.bottomRight.x &&
            playerVertices.bottomRight.x >= enemyVertices.topLeft.x &&
            playerVertices.topLeft.y >= enemyVertices.bottomRight.y &&
            playerVertices.bottomRight.y <= enemyVertices.topLeft.y
    })
}


