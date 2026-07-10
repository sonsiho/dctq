# Firestore Security Analysis - AEVN Dashboard

Generated during dashboard implementation on 2026-07-10.

## Codebase Findings

- Framework: Angular standalone application.
- Firebase services used:
  - Authentication: anonymous sign-in through `ensureAuthenticatedUser()`.
  - Firestore: modular Web SDK.
- Collections:
  - `members/{memberId}`
- App queries:
  - `getDocs(query(collection(firestore, 'members'), orderBy('powerScore', 'desc')))`
  - `getDoc(doc(firestore, 'members', id))`
- App writes:
  - `addDoc(collection(firestore, 'members'), payload)`
  - `setDoc(doc(firestore, 'members', id), payload)` when editing a sample/nonexistent member
  - `updateDoc(doc(firestore, 'members', id), payload)` when editing an existing member
- Deletes:
  - No delete path in the UI.

## `members` Schema

Required fields:

- `registeredAt`: timestamp
- `zaloName`: string, 1-80 chars
- `gameName`: string, 1-80 chars
- `gameId`: string, 1-40 chars
- `gemLimitGold`: number, 0-999
- `gemLimitPurple`: number, 0-999
- `gemNormalGold`: number, 0-999
- `gemNormalPurple`: number, 0-999
- `gearHp`: number, 0-999999
- `gearAtk`: number, 0-999999
- `resistShu`: number, 0-100
- `resistWu`: number, 0-100
- `resistWei`: number, 0-100
- `resistQun`: number, 0-100
- `slayShu`: number, 0-100
- `slayWu`: number, 0-100
- `slayWei`: number, 0-100
- `slayQun`: number, 0-100
- `powerScore`: number, 0-9999999
- `createdAt`: timestamp, immutable after create
- `createdBy`: string UID, immutable after create
- `updatedAt`: timestamp, must equal `request.time`
- `updatedBy`: string UID, must equal `request.auth.uid`

## Access Assumptions

- This is a prototype BQT dashboard. The app currently signs users in anonymously so the UI can work without a separate login screen.
- Rules therefore require authentication and strict schema validation, but they do not yet implement a hardened BQT-only role model.
- Before broad sharing, replace anonymous write access with custom claims, a locked admin allowlist, or a separate admin workflow.

## Devil's Advocate Audit

- Public list exploit: denied because all reads require `request.auth != null`.
- Unauthorized unauthenticated read/write: denied by `isAuthenticated()`.
- Update bypass: mitigated because update calls the same `isValidMember()` validator as create.
- Ownership hijacking: `createdBy` is immutable on update; `updatedBy` must match current auth UID.
- Immutable timestamp modification: `createdAt` is immutable; `updatedAt` must be request time.
- Type juggling: mitigated with explicit string, number, and timestamp checks.
- Required field omission: mitigated with `hasAll()` for all required fields.
- Schema pollution: mitigated with `hasOnly()` for allowed fields.
- Resource exhaustion: mitigated with string length and numeric range limits.
- Negative/overflow values: mitigated with explicit numeric ranges.
- Query mismatch: app uses authenticated collection read ordered by `powerScore`, allowed by authenticated read rule and single-field index.
- Remaining risk: any authenticated user, including anonymous auth users if enabled, can read and write valid `members` documents. This is acceptable only for prototype/internal testing.

