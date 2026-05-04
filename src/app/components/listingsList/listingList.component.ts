import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ListingService } from '../../services/listing.service';
import { Listing, ListingCategory, ListingFilters } from '../../models/listing.model';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-listing-list',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './listingList.component.html',
    styleUrl: './listingList.component.scss'
})
export class ListingsListComponent implements OnInit {
    // Liste des annonces récupérées depuis le backend
    listings: Listing[] = [];

    // État de chargement
    isLoading = false;

    // Message d'erreur
    error = '';

    // Filtres sélectionnés par l'utilisateur
    filters: ListingFilters = {};

    // Liste des catégories disponibles pour le filtre
    categories: ListingCategory[] = ['Vêtements', 'Électronique', 'Livres', 'Meubles', 'Sports', 'Autres'];

    constructor(
        private listingService: ListingService,
        public authService: AuthService
    ) { }

    ngOnInit() {
        // Charge les annonces au démarrage du composant
        this.loadListings();
    }

    loadListings() {
        this.isLoading = true;
        this.error = '';

        this.listingService.getListings(this.filters).subscribe({
            next: (res) => {
                this.listings = res.listings;
                this.isLoading = false;
            },
            error: (err) => {
                this.error = err.error?.message || 'Erreur lors du chargement des annonces';
                this.isLoading = false;
            }
        });
    }

    // Applique les filtres et recharge les annonces
    applyFilters() {
        this.loadListings();
    }

    // Réinitialise les filtres et recharge
    resetFilters() {
        this.filters = {};
        this.loadListings();
    }
}