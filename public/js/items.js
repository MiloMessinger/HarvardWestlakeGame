class Item {
    static registry = new Map();
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
        
        // Register the item
        Item.registry.set(id, this);
    }

    static registerItem(id, config) {
        return new Item(id, config);
    }

    static getItem(id) {
        return Item.registry.get(id);
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

// Example of how to add more items later:
/*
Item.registerItem('scissors', {
    name: 'Scissors',
    category: Item.categories.ALLOWED,
    description: 'Safety scissors',
    modifiable: true,
    useAction: (player) => {
        console.log('Cutting with scissors');
        return true;
    }
});
*/