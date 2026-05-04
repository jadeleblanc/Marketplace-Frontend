export type ListingStatus = 'Active' | 'Reserved' | 'Sold';
export type ListingCategory = 'Vêtements' | 'Électronique' | 'Livres' | 'Meubles' | 'Sports' | 'Autres';

export interface Listing {
    _id: string;
    title: string;
    description: string;
    price: number;
    category: ListingCategory;
    images: string[];
    status: ListingStatus;
    seller: {
        _id: string;
        name: string;
        avatar?: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface ListingPayload {
    title: string;
    description: string;
    price: number;
    category: ListingCategory;
    images?: string[];
}

export interface ListingFilters {
    category?: ListingCategory;
    status?: ListingStatus;
    minPrice?: number;
    maxPrice?: number;
}