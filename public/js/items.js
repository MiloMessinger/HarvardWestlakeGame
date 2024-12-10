// Debug the Map object itself
console.log("Initial Map check:", {
    mapExists: typeof Map !== 'undefined',
    mapConstructor: Map.toString(),
    isMapFunction: typeof Map === 'function'
});

// Create a simple registry object
const itemRegistry = {
    items: {},
    set: function(key, value) {
        this.items[key] = value;
    },
    get: function(key) {
        return this.items[key];
    }
};

class Item {
    static categories = {
        ALLOWED: 'allowed',
        FORBIDDEN: 'forbidden'
    };

    constructor(id, config) {
        this.id = id;
        this.name = config.name || id;
        this.category = config.category || Item.categories.ALLOWED;
        this.stackable = config.stackable ?? false;
        this.maxStack = config.maxStack || 1;
        this.description = config.description || '';
        
        // Optional properties
        this.useAction = config.useAction || null;
        this.craftable = config.craftable || false;
        this.craftingRecipe = config.craftingRecipe || null;
        this.modifiable = config.modifiable || false;
        
        // Register the item using our simple registry
        itemRegistry.set(id, this);
    }

    static registerItem(id, config) {
        return new Item(id, config);
    }

    static getItem(id) {
        return itemRegistry.get(id);
    }

    use(player) {
        if (this.useAction) {
            return this.useAction(player);
        }
        return false;
    }

    getDescription() {
        let desc = this.description;
        if (this.craftable) {
            desc += '\nCan be crafted';
        }
        if (this.modifiable) {
            desc += '\nCan be modified';
        }
        return desc;
    }
}

// Register base items
Item.registerItem('pencil', {
    name: 'Pencil',
    category: Item.categories.ALLOWED,
    description: 'A standard #2 pencil',
    modifiable: true,
    useAction: (player) => {
        console.log('Writing with pencil');
        return true;
    }
});

Item.registerItem('paper', {
    name: 'Paper',
    category: Item.categories.ALLOWED,
    stackable: true,
    maxStack: 10,
    description: 'A blank sheet of paper'
});

Item.registerItem('ruler', {
    name: 'Ruler',
    category: Item.categories.ALLOWED,
    description: 'A 12-inch ruler',
    modifiable: true
});

// Register additional items

// Allowed items
Item.registerItem('laptop', {
    name: 'Laptop',
    category: Item.categories.ALLOWED,
    description: 'A standard school-issued laptop',
    useAction: (player) => {
        console.log(`${player.name} is typing on the laptop.`);
        return true;
    }
});

Item.registerItem('notebook', {
    name: 'Notebook',
    category: Item.categories.ALLOWED,
    description: 'A spiral-bound notebook',
    stackable: true,
    maxStack: 5
});

// Forbidden items
Item.registerItem('knife', {
    name: 'Knife',
    category: Item.categories.FORBIDDEN,
    description: 'A sharp blade, potentially dangerous',
    useAction: (player) => {
        console.log(`${player.name} is wielding a knife.`);
        return true;
    }
});

Item.registerItem('explosive', {
    name: 'Explosive',
    category: Item.categories.FORBIDDEN,
    description: 'A small but powerful homemade explosive',
    useAction: (player) => {
        console.log(`${player.name} is handling an explosive!`);
        return true;
    }
});

// Craftable items
Item.registerItem('makeshift-knife', {
    name: 'Makeshift Knife',
    category: Item.categories.FORBIDDEN,
    description: 'A sharp weapon crafted from school supplies',
    craftable: true,
    craftingRecipe: ['ruler', 'pencil'],
    useAction: (player) => {
        console.log(`${player.name} crafted a makeshift knife.`);
        return true;
    }
});

Item.registerItem('chemical-explosive', {
    name: 'Chemical Explosive',
    category: Item.categories.FORBIDDEN,
    description: 'A dangerous explosive created from chemistry supplies',
    craftable: true,
    craftingRecipe: ['chemicals', 'paper'],
    useAction: (player) => {
        console.log(`${player.name} crafted a chemical explosive!`);
        return true;
    }
});

// Room-specific modification examples
Item.registerItem('chemicals', {
    name: 'Chemicals',
    category: Item.categories.ALLOWED,
    description: 'A set of basic lab chemicals',
    modifiable: true,
    useAction: (player) => {
        console.log(`${player.name} is using chemicals in the lab.`);
        return true;
    }
});

Item.registerItem('spray-paint', {
    name: 'Spray Paint',
    category: Item.categories.FORBIDDEN,
    description: 'Spray paint used for graffiti',
    modifiable: true
});

// Add new items for specialized rooms
Item.registerItem('lab-notebook', {
    name: 'Lab Notebook',
    category: Item.categories.ALLOWED,
    description: 'A specialized notebook for scientific observations',
    stackable: true,
    maxStack: 3,
    craftable: true,
    craftingRecipe: ['paper', 'pencil']
});

Item.registerItem('safety-goggles', {
    name: 'Safety Goggles',
    category: Item.categories.ALLOWED,
    description: 'Protective eyewear for lab work',
    modifiable: true,
    useAction: (player) => {
        console.log(`${player.name} puts on safety goggles`);
        return true;
    }
});

Item.registerItem('art-canvas', {
    name: 'Art Canvas',
    category: Item.categories.ALLOWED,
    description: 'A blank canvas for artistic creation',
    stackable: true,
    maxStack: 2,
    craftable: true,
    useAction: (player) => {
        console.log(`${player.name} prepares to paint`);
        return true;
    }
});

Item.registerItem('robotics-kit', {
    name: 'Robotics Kit',
    category: Item.categories.ALLOWED,
    description: 'A basic robotics component set',
    craftable: true,
    craftingRecipe: ['chemicals', 'laptop'],
    useAction: (player) => {
        console.log(`${player.name} is working on a robotics project`);
        return true;
    }
});