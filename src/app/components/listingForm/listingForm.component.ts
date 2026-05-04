import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ListingService } from '../../services/listing.service';
import { ListingCategory, ListingPayload } from '../../models/listing.model';

@Component({
    selector: 'app-listing-form',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './listingForm.component.html',
    styleUrl: './listingForm.component.scss'
})
export class ListingFormComponent implements OnInit {
    // Données liées aux champs du formulaire
    title = '';
    description = '';
    price: number | null = null;
    category: ListingCategory | '' = '';
    imagesInput = ''; // URLs séparées par des virgules

    // Catégories disponibles
    categories: ListingCategory[] = ['Vêtements', 'Électronique', 'Livres', 'Meubles', 'Sports', 'Autres'];

    // ID de l'annonce si on est en mode édition
    listingId: string | null = null;

    // Mode édition ou création
    isEditMode = false;

    // États
    isLoading = false;
    error = '';

    constructor(
        private listingService: ListingService,
        private router: Router,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        // Vérifie si on est en mode édition via l'URL (/listings/edit/:id)
        this.listingId = this.route.snapshot.paramMap.get('id');

        if (this.listingId) {
            this.isEditMode = true;
            this.loadListing(this.listingId);
        }
    }

    loadListing(id: string) {
        this.isLoading = true;

        this.listingService.getListingById(id).subscribe({
            next: (res) => {
                // Pré-remplit le formulaire avec les données existantes
                const l = res.listing;
                this.title = l.title;
                this.description = l.description;
                this.price = l.price;
                this.category = l.category;
                this.imagesInput = l.images.join(', ');
                this.isLoading = false;
                this.cdr.detectChanges(); // Force la détection de changement pour afficher les données
            },
            error: (err) => {
                this.error = err.error?.message || 'Annonce introuvable';
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    onSubmit() {
        // Validation simple avant envoi
        if (!this.title || !this.description || !this.price || !this.category) {
            this.error = 'Veuillez remplir tous les champs obligatoires';
            return;
        }

        this.isLoading = true;
        this.error = '';

        // Convertit la string d'URLs en tableau
        const images = this.imagesInput
            .split(',')
            .map(url => url.trim())
            .filter(url => url !== '');

        const payload: ListingPayload = {
            title: this.title,
            description: this.description,
            price: this.price!,
            category: this.category as ListingCategory,
            images
        };

        if (this.isEditMode && this.listingId) {
            // Mode édition — appel PUT
            this.listingService.updateListing(this.listingId, payload).subscribe({
                next: (listing) => {
                    this.router.navigate(['/listings', listing._id]);
                },
                error: (err) => {
                    this.error = err.error?.message || 'Erreur lors de la mise à jour';
                    this.isLoading = false;
                }
            });
        } else {
            // Mode création — appel POST
            this.listingService.createListing(payload).subscribe({
                next: (listing) => {
                    this.router.navigate(['/listings', listing._id]);
                },
                error: (err) => {
                    this.error = err.error?.message || 'Erreur lors de la création';
                    this.isLoading = false;
                }
            });
        }
    }

    cancel() {
        this.router.navigate(['/listings']);
    }
}