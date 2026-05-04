import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ListingService } from '../../services/listing.service';
import { MessageService } from '../../services/message.service';
import { SocketService } from '../../services/socket.service';
import { AuthService } from '../../services/auth.service';
import { Listing } from '../../models/listing.model';
import { Message } from '../../models/message.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-listing-detail',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './listingDetail.component.html',
    styleUrl: './listingDetail.component.scss'
})
export class ListingDetailComponent implements OnInit, OnDestroy {
    listing: Listing | null = null;
    messages: Message[] = [];
    newMessage = '';

    isLoading = false;
    isSending = false;
    error = '';

    private socketSubs: Subscription[] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private listingService: ListingService,
        private messageService: MessageService,
        private socketService: SocketService,
        public authService: AuthService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) return;

        this.loadListing(id);

        if (this.authService.isLoggedIn()) {
            this.loadMessages(id);
            this.socketService.joinListing(id);
            this.listenToSocket();
        }
    }

    loadListing(id: string) {
        this.isLoading = true;

        this.listingService.getListingById(id).subscribe({
            next: (res: any) => {
                this.listing = res.listing;
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                this.error = err.error?.message || 'Annonce introuvable';
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    loadMessages(listingId: string) {
        this.messageService.getMessages(listingId).subscribe({
            next: (res) => {
                this.messages = res.messages;
                this.cdr.detectChanges();
            },
            error: (err) => {
                this.error = err.error?.message || 'Erreur lors du chargement des messages';
                this.cdr.detectChanges();
            }
        });
    }

    sendMessage() {
        if (!this.newMessage.trim() || !this.listing) return;

        this.isSending = true;

        const payload = {
            listingId: this.listing._id,
            receiverId: this.listing.seller._id,
            content: this.newMessage.trim()
        };

        this.messageService.sendMessage(payload).subscribe({
            next: (message) => {
                this.messages.push(message);
                this.socketService.sendMessage(this.listing!._id, message);
                this.newMessage = '';
                this.isSending = false;
            },
            error: (err) => {
                this.error = err.error?.message || "Erreur lors de l'envoi";
                this.isSending = false;
            }
        });
    }

    listenToSocket() {
        const msgSub = this.socketService.onNewMessage().subscribe((message: Message) => {
            const exists = this.messages.find(m => m._id === message._id);
            if (!exists) {
                this.messages.push(message);
                this.cdr.detectChanges();
            }
        });

        const listingSub = this.socketService.onListingUpdated().subscribe((status: any) => {
            if (this.listing) {
                this.listing.status = status;
                this.cdr.detectChanges();
            }
        });

        this.socketSubs.push(msgSub, listingSub);
    }

    markAsRead(messageId: string) {
        this.messageService.markAsRead(messageId).subscribe({
            next: () => {
                const msg = this.messages.find(m => m._id === messageId);
                if (msg) msg.read = true;
            }
        });
    }

    isOwner(): boolean {
        const user = this.authService.currentUser();
        return !!user && !!this.listing && user._id === this.listing.seller._id;
    }

    deleteListing() {
        if (!this.listing) return;

        const confirmed = confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?');
        if (!confirmed) return;

        this.listingService.deleteListing(this.listing._id).subscribe({
            next: () => this.router.navigate(['/listings']),
            error: (err) => {
                this.error = err.error?.message || 'Erreur lors de la suppression';
            }
        });
    }

    ngOnDestroy() {
        this.socketSubs.forEach(sub => sub.unsubscribe());
    }
}
