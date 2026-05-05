import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Listing, ListingFilters, ListingPayload } from "../models/listing.model";

@Injectable({ providedIn: 'root' })
export class ListingService {
    private apiUrl = "https://marketplace-backend-oc74.onrender.com/api/listings";

    constructor(private http: HttpClient) { }

    // Get tout les annonces avec filtres optionnels
    getListings(filters?: ListingFilters) {
        let params = new HttpParams();

        // Appliquer les filtres si présents
        if (filters?.category) params = params.set('category', filters.category);
        if (filters?.status) params = params.set('status', filters.status);
        if (filters?.minPrice) params = params.set('minPrice', filters.minPrice);
        if (filters?.maxPrice) params = params.set('maxPrice', filters.maxPrice);

        return this.http.get<{ listings: Listing[] }>(this.apiUrl, { params });
    }

    // Get annonce par ID
    getListingById(id: string) {
        return this.http.get<{ listing: Listing }>(`${this.apiUrl}/${id}`);
    }

    // Créer une nouvelle annonce
    createListing(payload: ListingPayload) {
        return this.http.post<Listing>(this.apiUrl, payload);
    }

    // Modifier une annonce existante
    updateListing(id: string, payload: Partial<ListingPayload>) {
        return this.http.put<Listing>(`${this.apiUrl}/${id}`, payload);
    }

    // Supprimer une annonce
    deleteListing(id: string) {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}