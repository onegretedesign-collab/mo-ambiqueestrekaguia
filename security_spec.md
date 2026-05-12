# Security Specification - Moçambique Estrela Guia

## 1. Data Invariants
- **Comments**: 
  - `text`: string, 1-500 chars.
  - `authorName`: string, 1-100 chars.
  - `createdAt`: server timestamp.
  - `userId`: matches `request.auth.uid` if provided.
- **Events**:
  - Read-only for everyone.
  - Write-only for admins.

## 2. The "Dirty Dozen" Payloads (To be denied)
1. Comment with 1MB text.
2. Comment with missing `authorName`.
3. Comment trying to spoof `createdAt`.
4. Anonymous user trying to write an event.
5. User trying to delete someone else's comment.
6. User trying to update an event.
7. Comment with malicious document ID (poisoning).
8. Comment with extra "isAdmin" field (Shadow Update).
9. Comment with `userId` not matching `request.auth.uid`.
10. Blanket read of events without proper query constraint (if applicable).
11. Attempting to write a comment with an array for the `text` field.
12. Attempting to write a comment with an object for `authorName`.

## 3. Test Runner
(A simplified `firestore.rules.test.ts` logic will be reflected in the final rules)
