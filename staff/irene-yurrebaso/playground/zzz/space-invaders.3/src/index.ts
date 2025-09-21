//Game, Scene, Invaders, Ship y Bullets son todos componentes, por lo que podemos crear una super clase que se extiende al resto.

class Component {
    private container: HTMLElement

    //aquí no le permitimos q sea nulo
    constructor(container: HTMLElement) {
        if (!container) throw new Error ("Container element is required")

        this.container = container
    }

    public getContainer(): HTMLElement {
        return this.container
    }

    //añade cualquier otro componente hijo (Game, Scene, Invader, Ship...). Cualquiera que extienda de Component tendrá un container
    public add(object: Component): void {
        if(!(object instanceof Component)) throw new Error("object is not a Component")

        this.getContainer()?.appendChild(object.getContainer()!)
    }
}

class Scene extends Component {
    //datos privados porque solo confieren a la escena, privado evita q sean visibles fuera de la instancia de la clase
    private width: number;
    private height: number;

    constructor(width: number, height: number) {
        //al super le paso el container
        super(document.createElement("div"))

        this.width = width
        this.height = height

        this.getContainer().style.position = "relative"
        this.getContainer().style.width = `${width}px`
        this.getContainer().style.height = `${height}px`
        this.getContainer().style.border = `1px solid black`
        this.getContainer().style.overflow = "hidden"
        this.getContainer().style.backgroundColor = "gray"
    }

    public getWidth(): number {
        return this.width
    }

    public getHeight(): number {
        return this.height
    }
}

class Ship extends Component {
    private x: number = 0
    private y: number = 0
    private width: number = 0
    private height: number = 0

    constructor(x: number, y: number, width: number, height: number) {
        super(document.createElement("div"))

        this.x = x
        this.y = y
        this.width = width
        this.height = height

        this.getContainer().style.position = "absolute"
        this.getContainer().style.width = `${width}px`
        this.getContainer().style.height = `${height}px`
        this.getContainer().style.left = `${x - width / 2}px`
        this.getContainer().style.bottom = `${y - height / 2}px`
        this.getContainer().style.backgroundImage = "url(./public/images/ship.png"
        this.getContainer().style.backgroundSize = "cover"
    }
}

class Bullet extends Component {
    private x: number = 0
    private y: number = 0
    private width: number = 0
    private height: number = 0

    constructor(x: number, y: number, width: number, height: number) {
        super(document.createElement("div"))

        this.x = x
        this.y = y
        this.width = width
        this.height = height

        this.getContainer().style.position = "absolute"
        this.getContainer().style.width = `${width}px`
        this.getContainer().style.height = `${height}px`
        this.getContainer().style.backgroundColor = "red"
        this.getContainer().style.left = `${x - width / 2}px`
        this.getContainer().style.bottom = `${y - height / 2}px`
    }
}

class Alien extends Component {
    private x: number = 0
    private y: number = 0
    private width: number = 0
    private height: number = 0

    constructor(x: number, y: number, width: number, height: number) {
        super(document.createElement("div"))

        this.x = x
        this.y = y
        this.width = width
        this.height = height

        this.getContainer().style.position = "absolute"
        this.getContainer().style.width = `${width}px`
        this.getContainer().style.height = `${height}px`
        this.getContainer().style.left = `${x - width / 2}px`
        this.getContainer().style.bottom = `${y - height / 2}px`
        this.getContainer().style.backgroundImage = "url(./public/images/invader.png)"
        this.getContainer().style.backgroundSize = "cover"
    }
}

class Game extends Component {
    private scene: Scene
    private ship: Ship
    private bullets: Bullet[]
    private aliens: Alien[]

    constructor(containerId: string) {
        super(document.getElementById(containerId)!)

        //creamos la escena y la agregamos al contenedor del Game
        this.scene = new Scene(800, 600)
        //Game añade la escena como hija
        this.add(this.scene)

        this.ship = new Ship(400, 50, 50, 50)
        //Escena añade como hijo al ship
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
        const rowSpacing = 50
        
        // para cada alien va calculando la posicion x e y
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                //la x va cambiando para cada alien
                const x = col * (alienWidth + colSpacing) + colSpacing
                //y es igual para los primeros 7 aliens y luego cambia para los siguientes
                const y = this.scene.getHeight() - (row + 1) * rowSpacing

                const alien = new Alien(x, y, alienWidth, alienHeight)
                this.aliens.push(alien) //guardamos cada alien en el array
                this.scene.add(alien) //y añadimos cada alien a la escena
            }
        }
    }
}

//Initialize the game
const game = new Game("game")