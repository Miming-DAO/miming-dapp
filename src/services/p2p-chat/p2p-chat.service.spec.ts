import { TestBed } from '@angular/core/testing';
import { P2pChatService } from './p2p-chat.service';

describe('P2pChatService', () => {
  let service: P2pChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(P2pChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
