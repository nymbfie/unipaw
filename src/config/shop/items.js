export const shopItems = [
    // ♡ 01 — small treats

    {
        id: 'commission_5_off',
        name: '5% off your next commission',
        price: 250,
        description: 'get 5% off your next commission.',
        type: 'commission_reward',
        discount: 5,
        maxQuantity: 1
    },
    {
        id: 'exclusive_accessory',
        name: 'exclusive accessory',
        price: 500,
        description: 'get an exclusive accessory from the bit shop.',
        type: 'commission_reward',
        reward: 'exclusive_accessory',
        maxQuantity: 1
    },
    {
        id: 'free_addon',
        name: 'free commission add-on',
        price: 750,
        description: 'get one free add-on with your next commission.',
        type: 'commission_reward',
        reward: 'free_addon',
        maxQuantity: 1
    },
    {
        id: 'commission_10_off',
        name: '10% off your next commission',
        price: 1000,
        description: 'get 10% off your next commission.',
        type: 'commission_reward',
        discount: 10,
        maxQuantity: 1
    },

    // ୨୧ 02 — worth saving for

    {
        id: 'free_accessory',
        name: 'free accessory',
        price: 1500,
        description: 'get one free accessory with your next commission.',
        type: 'commission_reward',
        reward: 'free_accessory',
        maxQuantity: 1
    },
    {
        id: 'premium_upgrade',
        name: 'premium commission upgrade',
        price: 2000,
        description: 'get a premium upgrade added to your next commission.',
        type: 'commission_reward',
        reward: 'premium_upgrade',
        maxQuantity: 1
    },
    {
        id: 'commission_20_off',
        name: '20% off your next commission',
        price: 2500,
        description: 'get 20% off your next commission.',
        type: 'commission_reward',
        discount: 20,
        maxQuantity: 1
    },
    {
        id: 'mini_commission',
        name: 'free mini commission',
        price: 3500,
        description: 'redeem one free mini commission.',
        type: 'commission_reward',
        reward: 'mini_commission',
        maxQuantity: 1
    },

    // ✦ 03 — big rewards

    {
        id: 'custom_accessory',
        name: 'custom accessory',
        price: 4000,
        description: 'get one custom accessory made for your commission.',
        type: 'commission_reward',
        reward: 'custom_accessory',
        maxQuantity: 1
    },
    {
        id: 'commission_30_off',
        name: '30% off your next commission',
        price: 5000,
        description: 'get 30% off your next commission.',
        type: 'commission_reward',
        discount: 30,
        maxQuantity: 1
    },
    {
        id: 'premium_upgrade_accessory',
        name: 'premium upgrade + accessory',
        price: 6000,
        description: 'get a premium commission upgrade and one free accessory.',
        type: 'commission_reward',
        reward: 'premium_upgrade_accessory',
        maxQuantity: 1
    },
    {
        id: 'full_commission',
        name: 'free full commission',
        price: 7500,
        description: 'redeem one full commission for free.',
        type: 'commission_reward',
        reward: 'full_commission',
        maxQuantity: 1
    }
];

export function getItemById(itemId) {
    return shopItems.find(item => item.id === itemId);
}

export function getItemsByType(type) {
    return shopItems.filter(item => item.type === type);
}

export function getItemPrice(itemId) {
    const item = getItemById(itemId);
    return item ? item.price : 0;
}

export function validatePurchase(itemId, userData) {
    const item = getItemById(itemId);
    if (!item) {
        return { valid: false, reason: 'Item not found' };
    }

    const inventory = userData.inventory || {};
    const upgrades = userData.upgrades || {};

    if (item.type === 'consumable' && item.maxQuantity) {
        const currentQuantity = inventory[itemId] || 0;
        if (currentQuantity >= item.maxQuantity) {
            return { 
                valid: false, 
                reason: `You can only have a maximum of ${item.maxQuantity} ${item.name}s` 
            };
        }
    }

    if (item.type === 'upgrade' && item.maxLevel) {
        
        if (upgrades[itemId]) {
            return { 
                valid: false, 
                reason: `You've already purchased ${item.name}` 
            };
        }
    }

    if (item.type === 'tool') {
        
        const currentQuantity = inventory[itemId] || 0;
        if (itemId !== 'bank_note' && currentQuantity > 0) {
            return { 
                valid: false, 
                reason: `You already have a ${item.name}` 
            };
        }
    }

    if (item.type === 'role' && item.roleId) {
        if (userData.roles?.includes(item.roleId)) {
            return { 
                valid: false, 
                reason: `You already have the ${item.name} role` 
            };
        }
    }

    return { valid: true };
}
