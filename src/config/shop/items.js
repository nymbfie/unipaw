import { EmbedBuilder } from 'discord.js';

export const shopItems = [
    // ♡ 01 — small treats

    {
        id: 'commission_5_off',
        name: '5% off your next commission',
        price: 250,
        description: 'save 5% on your next commission.',
        type: 'commission_reward',
        discount: 5,
        maxQuantity: 1
    },

    {
        id: 'exclusive_accessory',
        name: 'exclusive accessory',
        price: 500,
        description: 'get an exclusive accessory with your next commission.',
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
        description: 'save 10% on your next commission.',
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
        description: 'upgrade your next commission for free.',
        type: 'commission_reward',
        reward: 'premium_upgrade',
        maxQuantity: 1
    },

    {
        id: 'commission_20_off',
        name: '20% off your next commission',
        price: 2500,
        description: 'save 20% on your next commission.',
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
        description: 'save 30% on your next commission.',
        type: 'commission_reward',
        discount: 30,
        maxQuantity: 1
    },

    {
        id: 'premium_upgrade_accessory',
        name: 'premium upgrade + accessory',
        price: 6000,
        description: 'get a premium upgrade and one free accessory.',
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


// ========================================
// GET ITEM
// ========================================

export function getItemById(itemId) {
    return shopItems.find(item => item.id === itemId);
}


// ========================================
// GET ITEMS BY TYPE
// ========================================

export function getItemsByType(type) {
    return shopItems.filter(item => item.type === type);
}


// ========================================
// GET ITEM PRICE
// ========================================

export function getItemPrice(itemId) {
    const item = getItemById(itemId);

    return item ? item.price : 0;
}


// ========================================
// SHOP EMBED
// ========================================

export function createShopEmbed(page = 0) {
    const itemsPerPage = 4;
    const totalPages = Math.ceil(shopItems.length / itemsPerPage);

    // Keep page inside the valid range
    page = Math.max(0, Math.min(page, totalPages - 1));

    const start = page * itemsPerPage;
    const items = shopItems.slice(start, start + itemsPerPage);

    const description = items
        .map(item => {
            return [
                `♡ **${item.name}**`,
                `> ${item.description}`,
                `> **${item.price.toLocaleString()} bits**`
            ].join('\n');
        })
        .join('\n\n');

    return new EmbedBuilder()
        .setTitle('shop')
        .setColor(0xE8B6C8)
        .setDescription(description)
        .setFooter({
            text: `Page ${page + 1}/${totalPages} • use /buy to redeem an item`
        });
}


// ========================================
// VALIDATE PURCHASE
// ========================================

export function validatePurchase(itemId, userData) {
    const item = getItemById(itemId);

    if (!item) {
        return {
            valid: false,
            reason: 'Item not found.'
        };
    }

    const inventory = userData.inventory || {};
    const upgrades = userData.upgrades || {};

    // Commission rewards
    if (item.type === 'commission_reward' && item.maxQuantity) {
        const currentQuantity = inventory[itemId] || 0;

        if (currentQuantity >= item.maxQuantity) {
            return {
                valid: false,
                reason: `You can only redeem ${item.name} once.`
            };
        }
    }

    // Consumables
    if (item.type === 'consumable' && item.maxQuantity) {
        const currentQuantity = inventory[itemId] || 0;

        if (currentQuantity >= item.maxQuantity) {
            return {
                valid: false,
                reason: `You can only have a maximum of ${item.maxQuantity} ${item.name}s.`
            };
        }
    }

    // Upgrades
    if (item.type === 'upgrade' && item.maxLevel) {
        if (upgrades[itemId]) {
            return {
                valid: false,
                reason: `You've already purchased ${item.name}.`
            };
        }
    }

    // Tools
    if (item.type === 'tool') {
        const currentQuantity = inventory[itemId] || 0;

        if (itemId !== 'bank_note' && currentQuantity > 0) {
            return {
                valid: false,
                reason: `You already have a ${item.name}.`
            };
        }
    }

    // Roles
    if (item.type === 'role' && item.roleId) {
        if (userData.roles?.includes(item.roleId)) {
            return {
                valid: false,
                reason: `You already have the ${item.name} role.`
            };
        }
    }

    return {
        valid: true
    };
}
