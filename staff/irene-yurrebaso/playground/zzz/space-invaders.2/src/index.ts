//constructoras para ir almacenando los datos de cada elemento del juego

class Scene {
    //datos privados porque solo confieren a la escena, privado evita q sean visibles fuera de la instancia de la clase
    private width: number;
    private height: number;
    private container: HTMLElement | null = null

    constructor(width: number, height: number) {
        this.width = width
        this.height = height

        this.container = document.createElement("div")
        this.container.style.position = "relative"
        this.container.style.width = `${width}px`
        this.container.style.height = `${height}px`
        this.container.style.border = `1px solid black`
        this.container.style.overflow = "hidden"
        this.container.style.backgroundColor = "gray"
    }

    public getWidth(): number {
        return this.width
    }

    public getHeight(): number {
        return this.height
    }

    public getContainer(): HTMLElement | null {
        return this.container
    }

    //para pintar los elementos en Scene
    public add(object: Ship | Bullet | Alien): void {
        this.container?.appendChild(object.getContainer()!)
    }
    //?. means: "only call this if the thing before it isn’t null or undefined".
    //The ! is a TypeScript non-null assertion. It tells the compiler: “Trust me, this.container is not null or undefined here.” Without !, TypeScript might complain that this.container could be empty.
}

class Ship {
    private x: number = 0
    private y: number = 0
    private width: number = 0
    private height: number = 0
    private container: HTMLElement | null = null

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height

        this.container = document.createElement("div")
        this.container.style.position = "absolute"
        this.container.style.width = `${width}px`
        this.container.style.height = `${height}px`
        this.container.style.left = `${x - width / 2}px`
        this.container.style.bottom = `${y - height / 2}px`
        this.container.style.backgroundImage = "url(./public/images/ship.png"
        this.container.style.backgroundSize = "cover"
    }

    // método para hacer público el container, para que se pueda pintar en Scene
    public getContainer(): HTMLElement | null { 
        return this.container
    }
}

class Bullet {
    private x: number = 0
    private y: number = 0
    private width: number = 0
    private height: number = 0
    private container: HTMLElement | null = null

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height

        //inicializamos tambien pintar el container: cuando pasamos al bullet los datos de posicion, ancho y alto, este se pinta tambien en pantalla (lo mismo con el resto de elementos)
        this.container = document.createElement("div")
        this.container.style.position = "absolute"
        this.container.style.width = `${width}px`
        this.container.style.height = `${height}px`
        this.container.style.backgroundColor = "red"
        this.container.style.left = `${x - width / 2}px`
        this.container.style.bottom = `${y - height / 2}px`
    }

    public getContainer(): HTMLElement | null {
        return this.container
    }
}

class Alien {
    private x: number = 0
    private y: number = 0
    private width: number = 0
    private height: number = 0
    private container: HTMLElement | null = null

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height

        this.container = document.createElement("div")
        this.container.style.position = "absolute"
        this.container.style.width = `${width}px`
        this.container.style.height = `${height}px`
        this.container.style.left = `${x - width / 2}px`
        this.container.style.bottom = `${y - height / 2}px`
        this.container.style.backgroundImage = "url(./public/images/invader.png)"
        this.container.style.backgroundSize = "cover"
    }

    public getContainer(): HTMLElement | null {
        return this.container
    }
}

class Game {
    private scene: Scene
    private ship: Ship
    private bullets: Bullet[] = []
    private aliens: Alien[] = []
    private container: HTMLElement | null = null

    constructor(containerId: string) {
        //cuando le paso el containerId llamado "game" (del index.html), usando el DOM coge el containerId y lo guarda como propiedad del Game.
        this.container = document.getElementById(containerId)

        //creamos la escena y la agregamos al contenedor del Game
        this.scene = new Scene(800, 600)
        this.container?.appendChild(this.scene.getContainer()!)

        this.ship = new Ship(400, 50, 50, 50)
        this.scene.add(this.ship)

        this.bullets = []
        this.aliens = []

        // Initialize aliens in a grid
        const rows = 2
        const cols = 7
        const alienWidth = 50
        const alienHeight = 50
        
        //hemos puesto el width de la scene privado, por lo que no podemos acceder directamente, sino a traves de un getter
        const colSpacing = this.scene.getWidth() / (cols + 1)
        const rowSpacing = this.scene.getHeight() / 10
        
        // para cada alien va calculando la posicion x e y
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                //la x va cambiando para cada alien
                const x = col * (alienWidth + colSpacing) + colSpacing
                //y es igual para los primeros 7 aliens y luego cambia para los siguientes
                const y = this.scene.getHeight() - (row * (alienHeight + rowSpacing)) - 100

                const alien = new Alien(x, y, alienWidth, alienHeight)
                this.aliens.push(alien)
                this.scene.add(alien)
            }
        }
    }
}

//Initialize the game
const game = new Game("game")