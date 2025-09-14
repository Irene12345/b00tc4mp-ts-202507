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
    //En bullets inicialmente no hay nada []. En el tipado se le dice q ese array guarda objetos con la propiedad 'position', q a su vez tiene propiedades 'x' e 'y' q son de tipo number. 
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
function checkCollisionShipVsInvaders() {
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
    const collision = state.invaders.some(invader => {
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

    if (collision) {
        state.lives -= 1
        if (state.lives <= 0) {
            state.gameOver = true
            alert("Game over")
        } else {
            alert(`You have ${state.lives} lives left`)
        }
    }
}

function checkCollisionBulletVsInvaders() {
    //coger la mitad del alto y ancho de la bala & la mitad de la altura y anchura del invader, para saber su centro y posterior calcular posicion de vertices
    const bulletHalfWidth = constants.bullet.dimensions.width / 2;
    const bulletHalfHeight = constants.bullet.dimensions.height / 2;
    const invaderHalfWidth = constants.invader.dimensions.width / 2;
    const invaderHalfHeight = constants.invader.dimensions.height / 2;

    //coge todas las balas una por una y mira la posición de sus vértices
    return state.bullets.forEach(bullet => {
        const bulletVertices = {
            topLeft: { x: bullet.position.x - bulletHalfWidth, y: bullet.position.y + bulletHalfHeight },
            topRight: { x: bullet.position.x + bulletHalfWidth, y: bullet.position.y + bulletHalfHeight },
            bottomRight: { x: bullet.position.x + bulletHalfWidth, y: bullet.position.y - bulletHalfHeight },
            bottomLeft: { x: bullet.position.x - bulletHalfWidth, y: bullet.position.y - bulletHalfHeight }
        }

        //y va mirando si coinciden con los vértices de cada invader uno por uno
        //con el 'filter' está quitando los invaders que han colisionado
        state.invaders = state.invaders.filter(invader => {
            const invaderVertices = {
                topLeft: { x: invader.position.x - invaderHalfWidth, y: invader.position.y + invaderHalfHeight },
                topRight: { x: invader.position.x + invaderHalfWidth, y: invader.position.y + invaderHalfHeight },
                bottomRight: { x: invader.position.x + invaderHalfWidth, y: invader.position.y - invaderHalfHeight },
                bottomLeft: { x: invader.position.x - invaderHalfWidth, y: invader.position.y - invaderHalfHeight }
            }

            const collision = bulletVertices.topLeft.x <= invaderVertices.bottomRight.x &&
                bulletVertices.bottomRight.x >= invaderVertices.topLeft.x &&
                bulletVertices.topLeft.y >= invaderVertices.bottomRight.y &&
                bulletVertices.bottomRight.y <= invaderVertices.topLeft.y

            if (collision) {
                state.score += 10

                //quitar el invader del DOM para que no aparezca en escena
                invadersElements.forEach((invaderElement, index) => {
                    //miramos los estados de los invaders, pedimos el índice del estado de ese invader
                    const invaderIndex = state.invaders.indexOf(invader)
                    //si el índice es el mismo, este estado pertenece a este invader, y quitamos al invader del scene
                    if (index === invaderIndex) {
                        sceneElement.removeChild(invaderElement)
                        //splice para actualizar el array que contiene los div's
                        invadersElements.splice(index, 1)
                    }
                })

                //quitar la bala que ha colisionado
                bulletsElements.forEach((bulletElement, index) => {
                    const bulletIndex = state.bullets.indexOf(bullet)

                    if (index === bulletIndex) {
                        //quita la bala del DOM
                        sceneElement.removeChild(bulletElement)
                        //actualiza array que contiene los div's
                        bulletsElements.splice(index, 1)
                        //quita la bala del state
                        state.bullets.splice(index, 1)
                    }
                })
            }

            //el negado de la colision significa 'false'
            return !collision
        })
    })
}

/* Interface */

const sceneElement = document.getElementById("scene") as HTMLDivElement;
sceneElement.style.position = "relative";
sceneElement.style.width = "800px";
sceneElement.style.height = "600px";
sceneElement.style.backgroundColor = "gray";

const shipElement = document.createElement("div") as HTMLDivElement;
//se posiciona de forma absoluta en el espacio de scene (closest positioned ancestor)
shipElement.style.position = "absolute";
shipElement.style.width = `${constants.ship.dimensions.width}px`;
shipElement.style.height = `${constants.ship.dimensions.height}px`;
shipElement.style.backgroundImage = "url(./public/images/ship.png)";
shipElement.style.backgroundSize = "cover";
shipElement.style.left = `${state.ship.position.x - constants.ship.dimensions.width / 2}px`;
shipElement.style.top = `${constants.scene.dimensions.height - (state.ship.position.y + constants.ship.dimensions.height / 2)}px`

const invadersElements = state.invaders.map(invader => {
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
sceneElement.appendChild(shipElement);
invadersElements.forEach(invader => sceneElement.appendChild(invader));

//array vacio para luego guardar los elementos div de las balas
const bulletsElements = [] as HTMLDivElement[];

//Detectar evento de presionar tecla (flechas en este caso)
document.addEventListener("keyup", event => {
    const step = 10

    //actualizamos estado de la nave
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
    shipElement.style.left = `${state.ship.position.x - constants.ship.dimensions.width / 2}px`
    shipElement.style.top = `${constants.scene.dimensions.height - (state.ship.position.y + constants.ship.dimensions.height / 2)}px`

    //crear balas si presionamos spacebar
    if (event.key === " ") {
        //shoot bullet
        const bullet = {
            position: { x: state.ship.position.x, y: state.ship.position.y + constants.ship.dimensions.height / 2 + constants.bullet.dimensions.height / 2 }
        }

        state.bullets.push(bullet)

        //pintamos bullet en DOM
        const bulletElement = document.createElement("div")
        bulletElement.style.position = "absolute"
        bulletElement.style.width = `${constants.bullet.dimensions.width}px`
        bulletElement.style.height = `${constants.bullet.dimensions.height}px`
        bulletElement.style.backgroundColor = "yellow"
        bulletElement.style.left = `${bullet.position.x - constants.bullet.dimensions.width / 2}px`
        bulletElement.style.top = `${constants.scene.dimensions.height - (bullet.position.y + constants.bullet.dimensions.height / 2)}px`

        sceneElement.appendChild(bulletElement)
        bulletsElements.push(bulletElement)
    }
})

//Game Loop: cada cierto intervalo de tiempo, ejecuta todo lo que hay dentro de la funcion setInterval() cada 200 milisegundos.
//Hacer que los invaders se muevan
setInterval(() => {
    //Si hemos terminado el juego, q no haga nada
    if (state.gameOver) return

    //Y si el juego sigue:
    state.invaders = state.invaders.map(invader => {
        // Mover invaders en el state -5 puntos
        invader.position.y -= 5

        //si están por debajo de 0 porque se han pasado, limita su posición para que no se vayan fuera de la escena
        if (invader.position.y - constants.invader.dimensions.height / 2 < 0) {
            invader.position.y = constants.scene.dimensions.height - constants.invader.dimensions.height / 2
        }

        // Pintar invaders en el DOM
        const invaderIndex = state.invaders.indexOf(invader)
        const invaderElement = invadersElements[invaderIndex]!
        invaderElement.style.left = `${invader.position.x - constants.invader.dimensions.width / 2}px`
        invaderElement.style.top = `${constants.scene.dimensions.height - (invader.position.y + constants.invader.dimensions.height / 2)}px`

        return invader
    })

    // mover las balas
    state.bullets = state.bullets.map((bullet, index) => {
        bullet.position.y += 10

        if (bullet.position.y >= constants.scene.dimensions.height - constants.bullet.dimensions.height / 2) {
            // remove bullet
            state.bullets.splice(index, 1)
            const bulletElement = bulletsElements[index]!
            sceneElement.removeChild(bulletElement)
            bulletsElements.splice(index, 1)
        } else {
            const bulletElement = bulletsElements[index]!
            bulletElement.style.left = `${bullet.position.x - constants.bullet.dimensions.width / 2}px`
            bulletElement.style.top = `${constants.scene.dimensions.height - (bullet.position.y + constants.bullet.dimensions.height / 2)}px`
        }

        return bullet
    })

    // En cada iteracion se comprueban las colisiones
    checkCollisionShipVsInvaders()
    checkCollisionBulletVsInvaders()
}, 200);

