import { Injectable } from "@angular/core";
import { io, Socket } from "socket.io-client";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket;

    constructor() {
        this.socket = io("https://marketplace-backend-oc74.onrender.com", { timeout: 5000, reconnectionAttempts: 3 });
    }

    // Rejoindre une room d'une annonce pour recevoir les messages en temps réel
    joinListing(listingId: string) {
        this.socket.emit("join:listing", listingId);
    }

    // Envoyer un message lié à une annonce
    sendMessage(listingId: string, message: any) {
        this.socket.emit("message:send", { listingId, message });
    }

    // Écouter les nouveaux message reçus pour une annonce
    onNewMessage(): Observable<any> {
        return new Observable(observer => {
            this.socket.on("message:new", data => observer.next(data));
        });
    }

    // Écouter les notifications de message lu
    onMessageRead(): Observable<any> {
        return new Observable(observer => {
            this.socket.on("message:read", data => observer.next(data));
        });
    }

    //
    onListingUpdated(): Observable<any> {
        return new Observable(observer => {
            this.socket.on("listing:updated", data => observer.next(data));
        });
    }

    onNotification(): Observable<any> {
        return new Observable(observer => {
            this.socket.on("notification:new", data => observer.next(data));
        });
    }

    disconnect() {
        this.socket.disconnect();
    }
}