import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Message, MessagePayload } from "../models/message.model";

@Injectable({ providedIn: 'root' })
export class MessageService {
    private apiUrl = "http://localhost:5000/api/messages";

    constructor(private http: HttpClient) { }

    // Get tout les messages liés à une annonce
    getMessages(listingId: string) {
        return this.http.get<{ messages: Message[] }>(`${this.apiUrl}/${listingId}`);
    }

    // Envoyer un nouveau message
    sendMessage(payload: MessagePayload) {
        return this.http.post<Message>(this.apiUrl, payload);
    }

    // Marquer un message comme lu
    markAsRead(messageId: string) {
        return this.http.put(`${this.apiUrl}/${messageId}/read`, {});
    }

    // Supprimer un message
    deleteMessage(messageId: string) {
        return this.http.delete(`${this.apiUrl}/${messageId}`);
    }
}