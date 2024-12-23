const products = {
    vegetables: [
        {
            id: 'v1',
            name: 'طماطم',
            price: 5,
            unit: 'كيلو',
            category: 'vegetables',
            image: 'https://placehold.co/300x200/green/white?text=طماطم'
        },
        {
            id: 'v2',
            name: 'خيار',
            price: 4,
            unit: 'كيلو',
            category: 'vegetables',
            image: 'https://placehold.co/300x200/green/white?text=خيار'
        },
        {
            id: 'v3',
            name: 'بطاطس',
            price: 6,
            unit: 'كيلو',
            category: 'vegetables',
            image: 'https://placehold.co/300x200/green/white?text=بطاطس'
        },
        {
            id: 'v4',
            name: 'باذنجان',
            price: 7,
            unit: 'كيلو',
            category: 'vegetables',
            image: 'https://placehold.co/300x200/green/white?text=باذنجان'
        }
    ],
    fruits: [
        {
            id: 'f1',
            name: 'تفاح',
            price: 12,
            unit: 'كيلو',
            category: 'fruits',
            image: 'https://placehold.co/300x200/red/white?text=تفاح'
        },
        {
            id: 'f2',
            name: 'موز',
            price: 8,
            unit: 'كيلو',
            category: 'fruits',
            image: 'https://placehold.co/300x200/yellow/black?text=موز'
        },
        {
            id: 'f3',
            name: 'برتقال',
            price: 10,
            unit: 'كيلو',
            category: 'fruits',
            image: 'https://placehold.co/300x200/orange/white?text=برتقال'
        },
        {
            id: 'f4',
            name: 'عنب',
            price: 15,
            unit: 'كيلو',
            category: 'fruits',
            image: 'https://placehold.co/300x200/purple/white?text=عنب'
        }
    ],
    leafy: [
        {
            id: 'l1',
            name: 'خس',
            price: 4,
            unit: 'ربطة',
            category: 'leafy',
            image: 'https://placehold.co/300x200/lightgreen/black?text=خس'
        },
        {
            id: 'l2',
            name: 'سبانخ',
            price: 5,
            unit: 'ربطة',
            category: 'leafy',
            image: 'https://placehold.co/300x200/darkgreen/white?text=سبانخ'
        },
        {
            id: 'l3',
            name: 'بقدونس',
            price: 2,
            unit: 'ربطة',
            category: 'leafy',
            image: 'https://placehold.co/300x200/green/white?text=بقدونس'
        },
        {
            id: 'l4',
            name: 'نعناع',
            price: 2,
            unit: 'ربطة',
            category: 'leafy',
            image: 'https://placehold.co/300x200/lightgreen/black?text=نعناع'
        }
    ],
    spices: [
        {
            id: 's1',
            name: 'فلفل أسود',
            price: 15,
            unit: '100 جرام',
            category: 'spices',
            image: 'https://placehold.co/300x200/black/white?text=فلفل+أسود'
        },
        {
            id: 's2',
            name: 'كمون',
            price: 12,
            unit: '100 جرام',
            category: 'spices',
            image: 'https://placehold.co/300x200/brown/white?text=كمون'
        },
        {
            id: 's3',
            name: 'كركم',
            price: 18,
            unit: '100 جرام',
            category: 'spices',
            image: 'https://placehold.co/300x200/yellow/black?text=كركم'
        },
        {
            id: 's4',
            name: 'قرفة',
            price: 20,
            unit: '100 جرام',
            category: 'spices',
            image: 'https://placehold.co/300x200/brown/white?text=قرفة'
        }
    ]
};

const specialOffers = [
    {
        id: 'offer1',
        name: 'سلة الخضراوات الأسبوعية',
        description: 'تشمل طماطم، خيار، بطاطس، بصل، وجزر',
        originalPrice: 100,
        discountedPrice: 80,
        discount: 20,
        image: 'images/vegetable-basket.jpg'
    },
    {
        id: 'offer2',
        name: 'سلة الفواكه المميزة',
        description: 'تشمل تفاح، موز، برتقال، وعنب',
        originalPrice: 120,
        discountedPrice: 102,
        discount: 15,
        image: 'images/fruit-basket.jpg'
    },
    {
        id: 'offer3',
        name: 'سلة الطبخ الأساسية',
        description: 'تشمل بصل، ثوم، طماطم، وبطاطس',
        originalPrice: 80,
        discountedPrice: 60,
        discount: 25,
        image: 'images/cooking-basket.jpg'
    }
];
