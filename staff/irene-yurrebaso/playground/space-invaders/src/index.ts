/*
State
- score
- lives
- difficulty
- level
- ship position
- invaders position
- bullets position
- game over
*/

// Constantes para todo el juego:
const constants = {
    ship: {
        dimensions: { width: 50, height: 50 }
    },
    invader: {
        dimensions: { width: 50, height: 50 }
    },
    bullet: {
        dimensions: { width: 5, height: 10 }
    },
    scene: {
        dimensions: { width: 800, height: 600 }
    }
};

//Guardamos la informacion de State en un objeto:
const state = {
    score: 0,
    lives: 3,
    difficulty: "easy",
    level: 1,
    ship: {
        position: { x: 400, y: 100 }
    },
    invaders: [{
        position: { x: 100, y: 500 },
    }, {
        position: { x: 200, y: 500 },
    }, {
        position: { x: 300, y: 500 }
    }, {
        position: { x: 400, y: 500 }
    }, {
        position: { x: 500, y: 500 }
    }, {
        position: { x: 600, y: 500 }
    }, {
        position: { x: 700, y: 500 }
    }, {
        position: { x: 100, y: 400 }
    }, {
        position: { x: 200, y: 400 }
    }, {
        position: { x: 300, y: 400 }
    }, {
        position: { x: 400, y: 400 }
    }, {
        position: { x: 500, y: 400 }
    }, {
        position: { x: 600, y: 400 }
    }, {
        position: { x: 700, y: 400 }
    }],
    bullets: [] as { position: { x: number, y: number } }[],
    gameOver: false
};

/* 
Logic:
- move ship
- move invaders
- shoot bullet
- check collision
- update score
- update lives
- update level
- reset game
*/

//Collision detection logic
function checkCollision() {
    //cálculo de dimensiones por la mitad (ya que usaremos esa mitad para calcular los vértices)
    const shipHalfWidth = constants.ship.dimensions.width / 2;
    const shipHalfHeight = constants.ship.dimensions.height / 2;
    const invaderHalfWidth = constants.invader.dimensions.width / 2;
    const invaderHalfHeight = constants.invader.dimensions.height / 2;

    //cálculo de posición de los vértices de ship usando datos de state y sus "dimensiones / 2"
    const shipVertices = {
        topLeft: { x: state.ship.position.x - shipHalfWidth, y: state.ship.position.y + shipHalfHeight },
        topRight: { x: state.ship.position.x + shipHalfWidth, y: state.ship.position.y + shipHalfHeight },
        bottomRight: { x: state.ship.position.x + shipHalfWidth, y: state.ship.position.y - shipHalfHeight },
        bottomLeft: { x: state.ship.position.x - shipHalfWidth, y: state.ship.position.y - shipHalfHeight }
    }

    //usamos método "some": recorre todo el array de invaders, y calcula si alguno(s) elemento(s) cumplen con la condición que pasamos en el callback, y devuelve true/false.
    return state.invaders.some(invader => {
        //cálculo de posición de los vértices de invader usando datos de state y sus "dimensiones / 2"
        const invaderVertices = {
            topLeft: { x: invader.position.x - invaderHalfWidth, y: invader.position.y + invaderHalfHeight },
            topRight: { x: invader.position.x + invaderHalfWidth, y: invader.position.y + invaderHalfHeight },
            bottomRight: { x: invader.position.x + invaderHalfWidth, y: invader.position.y - invaderHalfHeight },
            bottomLeft: { x: invader.position.x - invaderHalfWidth, y: invader.position.y - invaderHalfHeight }
        }

        //comparamos los vertices de ship y invader. NOTA: fijarse que en realidad solo hace falta utilizar topLeft y bottomRight para el cálculo.
        return shipVertices.topLeft.x <= invaderVertices.bottomRight.x &&
            shipVertices.bottomRight.x >= invaderVertices.topLeft.x &&
            shipVertices.topLeft.y >= invaderVertices.bottomRight.y &&
            shipVertices.bottomRight.y <= invaderVertices.topLeft.y
    })
}

/* Interface */

const scene = document.getElementById("scene") as HTMLDivElement;
scene.style.position = "relative";
scene.style.width = "800px";
scene.style.height = "600px";
scene.style.backgroundColor = "gray";

const ship = document.createElement("div") as HTMLDivElement;
//se posiciona de forma absoluta en el espacio de scene (closest positioned ancestor)
ship.style.position = "absolute";
ship.style.width = `${constants.ship.dimensions.width}px`;
ship.style.height = `${constants.ship.dimensions.height}px`;
ship.style.backgroundImage = "url(./public/images/ship.png)";
ship.style.backgroundSize = "cover";
ship.style.left = `${state.ship.position.x - constants.ship.dimensions.width / 2}px`;
ship.style.top = `${constants.scene.dimensions.height - (state.ship.position.y + constants.ship.dimensions.height / 2)}px`

const invaders = state.invaders.map(invader => {
    const invaderElement = document.createElement("div") as HTMLDivElement
    invaderElement.style.position = "absolute"
    invaderElement.style.width = `${constants.invader.dimensions.width}px`
    invaderElement.style.height = `${constants.invader.dimensions.height}px`
    invaderElement.style.backgroundImage = "url(./public/images/invader.png)"
    invaderElement.style.backgroundSize = "cover"
    invaderElement.style.left = `${invader.position.x - constants.invader.dimensions.width / 2}px`
    invaderElement.style.top = `${constants.scene.dimensions.height - (invader.position.y + constants.invader.dimensions.height / 2)}px`
    return invaderElement
})

//los pintamos en el div con id "scene"
scene.appendChild(ship);
invaders.forEach(invader => scene.appendChild(invader));

//Detectar evento de presionar tecla (flechas en este caso)
document.addEventListener("keydown", event => {
    const step = 10

    //actualizamos estado
    if (event.key === "ArrowLeft") {
        // Desplaza la nave en relacion a su centro. 
        // Escoge el máximo para evitar que la nave se vaya fuera de la pantalla.
        state.ship.position.x = Math.max(state.ship.position.x - step, constants.ship.dimensions.width / 2)
    } else if (event.key === "ArrowRight") {
        state.ship.position.x = Math.min(state.ship.position.x + step, constants.scene.dimensions.width - constants.ship.dimensions.width / 2)
    } else if (event.key === "ArrowUp") {
        state.ship.position.y = Math.min(state.ship.position.y + step, constants.scene.dimensions.height - constants.ship.dimensions.height / 2)
    } else if (event.key === "ArrowDown") {
        state.ship.position.y = Math.max(state.ship.position.y - step, constants.ship.dimensions.height / 2)
    }

    //actualiza vista en DOM (left y top del div)
    ship.style.left = `${state.ship.position.x - constants.ship.dimensions.width / 2}px`
    ship.style.top = `${constants.scene.dimensions.height - (state.ship.position.y + constants.ship.dimensions.height / 2)}px`

    // Check collision at every keydown
    gameLoop()
})

    function gameLoop() {
        if (checkCollision()) {
            console.log("Game over")
            state.gameOver = true
            alert("Game over")

            // reset game
            /* 
            state.score = 0
            state.lives = 3
            state.level = 1
    
            state.ship.position = { x: constants.scene.dimensions.width / 2, y: constants.ship.dimensions.height / 2 }
            ship.style.left = `${state.ship.position.x - constants.ship.dimensions.width / 2}px`
            ship.style.top = `${constants.scene.dimensions.height - (state.ship.position.y + constants.ship.dimensions.height / 2)}px`
    
            state.gameOver = false 
            */
        }
    }

//Hacer que los invaders se muevan
setInterval(() => {
    //Si hemos terminado el juego, q no haga nada
    if (state.gameOver) return

    //Y si el juego sigue:
    // 1) Mover invaders en el state -5 puntos
    state.invaders = state.invaders.map(invader => {
        invader.position.y -= 5

        //si están por debajo de 0 porque se han pasado, limita su posición para que no se vayan fuera de la escena
        if (invader.position.y - constants.invader.dimensions.height / 2 < 0) {
            invader.position.y = constants.scene.dimensions.height - constants.invader.dimensions.height / 2
        }

        return invader
    })

    // 2) Actualizar la vista en el DOM
    invaders.forEach((invaderElement, index) => {
        //ponemos '!' para forzar a typescript a aceptar que habrá algo (q habrá un state para ese invader, ya q arriba hemos indicado que habrá tantos invader 'div' como haya invaders en el 'state'), ya que sin '!' lanza un error.
        const invader = state.invaders[index]!

        invaderElement.style.left = `${invader.position.x - constants.invader.dimensions.width / 2}px`
        invaderElement.style.top = `${constants.scene.dimensions.height - (invader.position.y + constants.invader.dimensions.height / 2)}px`
    })

    gameLoop()

}, 200);

