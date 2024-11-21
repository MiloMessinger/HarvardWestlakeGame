class TextureLoader {
    constructor() {
        this.textures = {};  // Changed to regular object instead of Map
        this.loaded = false;
        this.totalTextures = 0;
        this.loadedTextures = 0;
    }

    loadTexture(name, path) {
        this.totalTextures++;
        const img = new Image();
        img.src = path;
        
        console.log(`Loading texture: ${name} from ${path}`);
        
        img.onload = () => {
            this.loadedTextures++;
            console.log(`Loaded texture: ${name}, ${this.loadedTextures}/${this.totalTextures}`);
            if (this.loadedTextures === this.totalTextures) {
                this.loaded = true;
                console.log("All textures loaded!");
            }
        };

        img.onerror = () => {
            console.error(`Failed to load texture: ${name} from ${path}`);
            this.loadedTextures++;
        };

        this.textures[name] = img;  // Use object notation instead of Map.set
    }

    getTexture(name) {
        const texture = this.textures[name];  // Use object notation instead of Map.get
        if (!texture) {
            console.warn(`Texture '${name}' not found!`);
        }
        return texture;
    }

    isLoaded() {
        return this.loaded;
    }

    loadAllTextures() {
        console.log("Starting texture loading...");
        
        // Floor textures
        this.loadTexture('floor-tile', 'assets/textures/floor-tile.jpg');
        this.loadTexture('hallway-floor', 'assets/textures/hallway-floor.jpg');
        
        // Wall textures
        this.loadTexture('wall-h', 'assets/textures/wall-horizontal.jpg');
        this.loadTexture('wall-v', 'assets/textures/wall-vertical.jpg');
        this.loadTexture('wall-corner', 'assets/textures/wall-corner.jpg');
        
        // Door texture
        this.loadTexture('door-closed', 'assets/textures/wall-horizontal.jpg');
        this.loadTexture('door-open', 'assets/textures/wall-horizontal.jpg');
        // this.loadTexture('door-closed', 'assets/textures/door-closed.png');
        // this.loadTexture('door-open', 'assets/textures/door-open.png');
    }
}