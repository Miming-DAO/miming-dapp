import { Injectable, inject } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ConversationHistory {
  conversation_id: string;
  messages: {
    _id: string;
    p2p_conversation_id: string;
    p2p_conversation: any;
    role: string;
    content: string;
    attachments: string[];
    read_by: string[];
    created_at: Date;
    updated_at: Date;
  }[];
  active_users: string[];
}

@Injectable({
  providedIn: 'root',
})
export class P2pChatService {
  private apiUrl = environment.apiUrl;
  private apiPrefix = 'chat';

  private socket: Socket | null = null;
  private messagesSubject = new BehaviorSubject<ConversationHistory | null>(null);
  private activeUsersSubject = new BehaviorSubject<string[]>([]);
  private userTypingSubject = new BehaviorSubject<{ user_id: string; isTyping: boolean } | null>(null);
  private connectionStatusSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  private messagesReadSubject = new BehaviorSubject<{ user_id: string; messageIds: string[] } | null>(null);

  messages$ = this.messagesSubject.asObservable();
  activeUsers$ = this.activeUsersSubject.asObservable();
  userTyping$ = this.userTypingSubject.asObservable();
  connectionStatus$ = this.connectionStatusSubject.asObservable();
  error$ = this.errorSubject.asObservable();
  messagesRead$ = this.messagesReadSubject.asObservable();

  private currentConversationId: string | null = null;
  private currentUserId: string | null = null;

  constructor() { }

  initializeSocket(): void {
    if (this.socket) return;

    const socketUrl = this.getSocketUrl();

    this.socket = io(socketUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling'],
    });

    this.setupSocketListeners();
  }

  private getSocketUrl(): string {
    return `${this.apiUrl}/${this.apiPrefix}`;
  }

  private setupSocketListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.connectionStatusSubject.next(true);
      this.errorSubject.next(null);
    });

    this.socket.on('disconnect', () => {
      this.connectionStatusSubject.next(false);
    });

    this.socket.on('connect_error', (error: any) => {
      this.errorSubject.next(`Connection error: ${error.message}`);
    });

    this.socket.on('error', (error: any) => {
      this.errorSubject.next(error.message || 'An error occurred');
    });

    this.socket.on('exception', (exception: any) => {
      this.errorSubject.next(exception.message || 'An error occurred');
    });

    this.socket.on('user-joined', (data: any) => {
      const currentActiveUsers = this.activeUsersSubject.value;
      if (!currentActiveUsers.includes(data.user_id)) {
        this.activeUsersSubject.next([...currentActiveUsers, data.user_id]);
      }
    });

    this.socket.on('conversation-history', (data: ConversationHistory) => {
      this.messagesSubject.next(data);
      this.activeUsersSubject.next(data.active_users);
    });

    this.socket.on('new-message', (data: any) => {
      const { conversation_id, message } = data;

      if (conversation_id === this.currentConversationId) {
        const current = this.messagesSubject.value;
        if (current && current.conversation_id === conversation_id) {
          const exists = current.messages.some(m => m.p2p_conversation_id === message.p2p_conversation_id && m._id === message._id);
          if (!exists) {
            this.messagesSubject.next({
              ...current,
              messages: [...current.messages, message],
            });
          }
        }
      }
    });

    this.socket.on('user-typing', (data: any) => {
      this.userTypingSubject.next({
        user_id: data.user_id,
        isTyping: data.is_typing,
      });
    });

    this.socket.on('messages-read', (data: any) => {
      this.messagesReadSubject.next({
        user_id: data.user_id,
        messageIds: data.messageIds
      });

      // Update read status in current messages
      const current = this.messagesSubject.value;
      if (current && current.conversation_id === data.conversation_id) {
        const updatedMessages = current.messages.map(msg => {
          if (data.messageIds.includes(msg._id)) {
            return {
              ...msg,
              read_by: [...(msg.read_by || []), data.user_id].filter((v, i, a) => a.indexOf(v) === i)
            };
          }
          return msg;
        });

        this.messagesSubject.next({
          ...current,
          messages: updatedMessages
        });
      }
    });

    this.socket.on('user-left', (data: any) => {
      const currentActiveUsers = this.activeUsersSubject.value;
      this.activeUsersSubject.next(currentActiveUsers.filter(id => id !== data.user_id));
    });
  }

  joinConversation(conversation_id: string, user_id: string): void {
    if (!this.socket) {
      this.errorSubject.next('Socket not initialized');
      return;
    }

    this.currentConversationId = conversation_id;
    this.currentUserId = user_id;
    this.messagesSubject.next(null);

    this.socket.emit('join-conversation', {
      conversation_id,
      user_id,
    });
  }

  leaveConversation(): void {
    if (!this.socket || !this.currentConversationId || !this.currentUserId) return;

    this.socket.emit('leave-conversation', {
      conversation_id: this.currentConversationId,
      user_id: this.currentUserId,
    });

    this.currentConversationId = null;
    this.currentUserId = null;
    this.messagesSubject.next(null);
  }

  sendMessage(conversation_id: string, user_id: string, role: string, content: string, attachments?: string[]): void {
    if (!this.socket) {
      this.errorSubject.next('Socket not initialized');
      return;
    }

    this.socket.emit('send-message', {
      conversation_id,
      user_id,
      role,
      content,
      attachments: attachments || [],
    });
  }

  emitTyping(conversation_id: string, user_id: string, isTyping: boolean): void {
    if (!this.socket) return;

    this.socket.emit('typing', {
      conversation_id,
      user_id,
      is_typing: isTyping,
    });
  }

  markMessagesAsRead(conversation_id: string, user_id: string, messageIds: string[]): void {
    if (!this.socket) return;

    this.socket.emit('mark-as-read', {
      conversation_id,
      user_id,
      messageIds,
    });
  }

  getActiveUsers(conversation_id: string): void {
    if (!this.socket) return;

    this.socket.emit('get-active-users', {
      conversation_id,
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}
