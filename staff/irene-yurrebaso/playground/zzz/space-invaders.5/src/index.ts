//Game, Scene, Invaders, Ship y Bullets son todos componentes, por lo que podemos crear una super clase que se extiende al resto.

class Component {
    //datos privados porque solo confieren a Component, privado evita q sean visibles fuera de la instancia de la clase
    private container: HTMLElement

    private x: number = 0
    private y: number = 0
    private width: number = 0
    private height: number = 0

    //"escuchador de movimiento": callback q permite actuar cuando hay un movimiento de cualquier componente
    private moveCallback: (() => void) | null = null

    //aquí no le permitimos q sea nulo
    //todo Component va a tener contenedor, posicionamiento y dimensiones
    constructor(container: HTMLElement, x: number, y: number, width: number, height: number) {
        if (!container) throw new Error("Container element is required")

        this.container = container

        this.getContainer().style.position = "absolute"

        this.setSize(width, height)
        this.setPosition(x, y)
    }

    public getContainer(): HTMLElement {
        return this.container
    }

    public setPosition(x: number, y: number): void {
        this.x = x
        this.y = y

        this.getContainer().style.left = `${x - this.width / 2}px`
        this.getContainer().style.bottom = `${y - this.height / 2}px`

        //si el callback existe, lo llamamos para decirle que se ha movido esta pieza. 
        if (this.moveCallback) this.moveCallback()
    }

    public getX(): number {
        return this.x
    }

    public getY(): number {
        return this.y
    }

    public setSize(width: number, height: number): void {
        this.width = width
        this.height = height

        this.getContainer().style.width = `${width}px`
        this.getContainer().style.height = `${height}px`
    }

    public getWidth(): number {
        return this.width
    }

    public getHeight(): number {
        return this.height
    }

    //añade cualquier otro componente hijo (Game, Scene, Invader, Ship...). Cualquiera que extienda de Component tendrá un container
    public add(object: Component): void {
        if (!(object instanceof Component)) throw new Error("object is not a Component")

        this.getContainer()?.appendChild(object.getContainer()!)
    }

    //quitar un componente hijo de un contenedor padre
    public remove(object: Component): void {
        if (!(object instanceof Component)) throw new Error("object is not a Component")

        this.getContainer()?.removeChild(object.getContainer()!)
    }

    // detecta colision del componente con cualquier otro Componente
    public collidesWith(object: Component): boolean {
        if (!(object instanceof Component)) throw new Error("object is not a Component")

        //logica de colision que hicimos al principio (version primera)
        return this.getX() < object.getX() + object.getWidth() &&
            this.getX() + this.getWidth() > object.getX() &&
            this.getY() < object.getY() + object.getHeight() &&
            this.getY() + this.getHeight() > object.getY()
    }

    //aqui seteamos el moveCallback
    //este callback se llamaria cuando existe en setPosition (cuando cambiamos la posicion)
    //callback es una función que no recibe parámetros (()) y no devuelve nada (void). Se le puede pasar cualquier funcion para q se ejecute en el momento adecuado. Permite reaccionar a movimientos sin tener que modificar la clase base.
    public onMove(callback: () => void): void {
        this.moveCallback = callback
    }
}

class Scene extends Component {
    constructor(x: number, y: number, width: number, height: number) {
        //al super le paso el container
        super(document.createElement("div"), x, y, width, height)

        // this.getContainer().style.overflow = "hidden"
        this.getContainer().style.backgroundColor = "gray"
    }
}

class Ship extends Component {
        constructor(x: number, y: number, width: number, height: number) {
        super(document.createElement("div"), x, y, width, height)

        this.getContainer().style.backgroundImage = "url(./public/images/ship.png"
        this.getContainer().style.backgroundSize = "cover"

    }
}

class Bullet extends Component {
    constructor(x: number, y: number, width: number, height: number) {
        super(document.createElement("div"), x, y, width, height)

        this.getContainer().style.backgroundColor = "red"

    }
}

class Alien extends Component {
    constructor(x: number, y: number, width: number, height: number) {
        super(document.createElement("div"), x, y, width, height)

        this.getContainer().style.backgroundImage = "url(./public/images/invader.png)"
        this.getContainer().style.backgroundSize = "cover"
    }
}

class Game extends Component {

    private scene: Scene
    private ship: Ship
    private bullets: Bullet[]
    private aliens: Alien[]

    private gameOver: boolean = false

    constructor(containerId: string, x: number, y: number, width: number, height: number) {
        //le tenemos que poner la admiracion ! para confirmar que el div va a estar ahi
        super(document.getElementById(containerId)!, x, y, width, height)

        this.getContainer().style.position = "relative"
        this.getContainer().style.backgroundColor = "darkgray"

        //creamos la escena y la agregamos al contenedor del Game
        this.scene = new Scene(450, 350, 800, 600)
        //Game añade la escena como hija
        this.add(this.scene)

        this.ship = new Ship(400, 50, 50, 50)
        //Escena añade como hijo al ship
        this.scene.add(this.ship)

        //Game tiene que detectar si la nava y los marcianos se han movido, para eso usamos callbacks
        //onMove es un metodo particular de ship
        this.ship.onMove(() => {
            if (this.gameOver) return

            this.aliens.forEach(alien => {
                if (this.ship.collidesWith(alien)) {
                    alert("Game Over!")

                    this.gameOver = true
                }
            })
        })

        //mueve el ship que tenemos dentro de Game
        document.addEventListener("keydown", event => {
            const step = 10
            if (event.key === "ArrowLeft") {
                this.ship.setPosition(this.ship.getX() - step, this.ship.getY())
            } else if (event.key === "ArrowRight") {
                this.ship.setPosition(this.ship.getX() + step, this.ship.getY())
                //para las bullets, se tienen que posicionar respecto al ship
            } else if (event.key === " ") {
                const bullet = new Bullet(this.ship.getX(), this.ship.getY() + this.ship.getHeight() / 2, 5, 10)
                
                //meter la bala dentro del array de balas, para actualizar despues su posicion en el setInterval
                this.bullets.push(bullet)
                //añadir a la escena para que se pinten
                this.scene.add(bullet)

                //ver si al moverse la bala colisiona con algun alien
                bullet.onMove(() => {
                    //hacer un forEach pq son varios aliens
                    this.aliens.forEach(alien => {
                        if (bullet.collidesWith(alien)) {
                            //si colisiona, eliminar el alien del array
                            let index = this.aliens.indexOf(alien)
                            this.aliens.splice(index, 1)

                            //eliminarlo de la escena
                            this.scene.remove(alien)

                            //lo mismo para la bala
                            index = this.bullets.indexOf(bullet)
                            this.bullets.splice(index, 1)

                            this.scene.remove(bullet)
                        }
                    })
                })
            }
        })

        this.bullets = []
        this.aliens = []

        // Initialize aliens in a grid
        const rows = 2
        const cols = 7
        const alienWidth = 50
        const alienHeight = 50

        //hemos puesto el width de la scene privado, por lo que no podemos acceder directamente, sino a traves de un getter
        const colSpacing = this.scene.getWidth() / cols - alienWidth
        const rowSpacing = 50

        // para cada alien va calculando la posicion x e y
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                //la x va cambiando para cada alien
                const x = col * (alienWidth + colSpacing) + colSpacing
                //y es igual para los primeros 7 aliens y luego cambia para los siguientes
                const y = this.scene.getHeight() - row  * rowSpacing - alienHeight / 2

                const alien = new Alien(x, y, alienWidth, alienHeight)
                this.aliens.push(alien) //guardamos cada alien en el array
                this.scene.add(alien) //y añadimos cada alien a la escena

                alien.onMove(() => {
                    if (this.gameOver) return
                    
                    this.aliens.forEach(alien => {
                        if (this.ship.collidesWith(alien)) {
                            alert("Game Over!")

                            this.gameOver = true
                        }
                    })
                })
            }
        }

        //un solo setInterval q cambia todos los aliens de posicion
        setInterval(() => {
            const step = 10

            //para la posicion de Y, hacemos un cálculo para q si salen de la pantalla al bajar, vuelvan a aparecer por arriba.
            this.aliens.forEach(alien => alien.setPosition(alien.getX(), alien.getY() > alienHeight / 2 ? alien.getY() - step : this.scene.getHeight() - alienHeight / 2))
        }, 300)

        //mover las balas hacia arriba, respecto a la posicion en la que esten
        setInterval(() => {
            const step = 5

            this.bullets.forEach(bullet => {
                bullet.setPosition(bullet.getX(), bullet.getY() + step)
            })

        }, 50)
    }
}

//Initialize the game
//Le paso los datos de la constructora (containerId, x, y, width, height)
const game = new Game("game", 450, 350, 900, 700)