export interface Message {
    _id: string;
    listing: string;
    sender: {
        _id: string;
        name: string;
        avatar?: string;
    };
    receiver: {
        _id: string;
        name: string;
        avatar?: string;
    };
    content: string;
    read: boolean;
    createdAt: string;
}

export interface MessagePayload {
    listingId: string;
    receiverId: string;
    content: string;
}