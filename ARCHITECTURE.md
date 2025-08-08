# Coach Unlock System - Architecture & Design

## Overview

A coach unlocking system where users spend tokens to unlock coaches, gain XP, and handle red flag warnings through a secure, rate-limited interface.

## Data Model

### Core Entities

```typescript
interface User {
  id: string;
  name: string;
  tokens: number; // Currency for unlocking coaches
  xp: number; // Experience points gained from unlocks
  unlockedCoaches: string[]; // Array of unlocked coach IDs
}

interface Coach {
  id: string;
  name: string;
  position: string;
  school: string;
  available: boolean; // Whether coach can be unlocked
  hasRedFlag: boolean; // Warning flag for problematic history
  redFlagReason?: string; // Explanation of red flag
  unlockCost: number; // Token cost to unlock
}

interface UnlockHistory {
  id: string;
  userId: string;
  coachId: string;
  timestamp: string;
  tokensSpent: number;
  xpGained: number;
  hasRedFlag: boolean; // For analytics tracking
}

interface GameConfig {
  xpPerUnlock: number; // XP awarded per unlock (currently 5)
  tokenCostPerUnlock: number; // Default cost (currently 10)
}
```

## Business Logic

### Unlock Flow Validation

```
1. User Existence Check
   ↓
2. Coach Existence Check
   ↓
3. Coach Availability Check (available: true)
   ↓
4. Duplicate Unlock Check (not in user.unlockedCoaches)
   ↓
5. Token Balance Check (user.tokens >= coach.unlockCost)
   ↓
6. Rate Limit Check (max 1 unlock per 5 seconds)
   ↓
7. Atomic Transaction:
   - Deduct tokens
   - Add XP
   - Add coach to unlocked list
   - Log to history
   ↓
8. Red Flag Handling (UI warning if hasRedFlag: true)
```

### Key Business Rules

- **Rate Limiting**: 1 unlock per 5 seconds per user+IP combination
- **Red Flags**: Don't block unlocks, only warn users
- **XP System**: Fixed 5 XP per unlock regardless of cost
- **Token Economy**: Variable costs per coach (6-15 tokens)
- **Availability**: Coaches can be temporarily unavailable
- **Audit Trail**: All unlocks logged with metadata

## State Management

### Frontend (React + React Query)

```typescript
// Server State (React Query)
const { data: coaches } = useQuery({
  queryKey: ["coaches"],
  queryFn: fetchCoaches,
});

const { data: user } = useQuery({
  queryKey: ["user", userId],
  queryFn: () => fetchUser(userId),
});

// Mutations
const unlockMutation = useMutation({
  mutationFn: (coachId) => unlockCoach(coachId, userId),
  onSuccess: (data) => {
    // Update user cache immediately
    queryClient.setQueryData(["user", userId], data.updatedUser);
  },
});

// Local UI State
const [showRedFlagModal, setShowRedFlagModal] = useState(false);
const [selectedCoach, setSelectedCoach] = useState(null);
const [cooldownRemaining, setCooldownRemaining] = useState(0);
```

**Why React Query?**

- Automatic caching and background refetching
- Optimistic updates for better UX
- Built-in loading/error states
- Cache invalidation on mutations

### Backend (NestJS + File-based Storage)

```typescript
// Service Layer
@Injectable()
export class CoachesService {
  private getDatabase(): DatabaseSchema {
    /* File I/O */
  }
  private saveDatabase(db: DatabaseSchema): void {
    /* Atomic write */
  }

  unlockCoach(userId: string, coachId: string) {
    // Validation pipeline
    // Atomic transaction
    // Return updated state
  }
}

// Controller with Rate Limiting
@Controller("coaches")
export class CoachesController {
  @Post(":coachId/unlock")
  @RateLimit({ windowMs: 5000, max: 1 })
  unlockCoach(@Param("coachId") coachId, @Body("userId") userId) {
    return this.coachesService.unlockCoach(userId, coachId);
  }
}
```

## Async Logic Handling

### Frontend Error Handling

```typescript
// API Layer
export async function unlockCoach(coachId: string, userId: string) {
  const response = await fetch(`${API_BASE}/coaches/${coachId}/unlock`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    const error = await response.text();
    if (response.status === 429) {
      // Extract wait time from server message
      const match = error.match(/Try again in (\d+) seconds/);
      const seconds = match ? parseInt(match[1]) : 5;
      throw new Error(`Rate limit exceeded. Wait ${seconds} seconds.`);
    }
    throw new Error(error || "Failed to unlock coach");
  }

  return response.json();
}

// Component Error Handling
const unlockMutation = useMutation({
  mutationFn: (coachId) => unlockCoach(coachId, userId),
  onError: (error) => {
    console.error("Unlock failed:", error);
    alert(`Failed to unlock coach: ${error.message}`);
  },
});
```

### Backend Exception Handling

```typescript
// Custom Exceptions
throw new NotFoundException('User not found');           // 404
throw new BadRequestException('Insufficient tokens');    // 400
throw new BadRequestException('Coach already unlocked'); // 400

// Rate Limiting
@RateLimit({
  windowMs: 5000,
  max: 1,
  keyGenerator: (req) => `unlock:${req.body.userId}:${req.ip}`
})
```

## Code Structure

### Backend Architecture

```
src/
├── common/
│   ├── decorators/
│   │   └── rate-limit.decorator.ts    # @RateLimit() decorator
│   └── interceptors/
│       └── rate-limit.interceptor.ts  # Rate limiting logic
├── coaches/
│   ├── coaches.controller.ts          # REST endpoints
│   ├── coaches.service.ts             # Business logic
│   └── coaches.module.ts              # Module definition
└── main.ts                            # App bootstrap + CORS
```

### Frontend Architecture

```
src/
├── api/
│   └── coaches.ts                     # API client functions
├── components/
│   ├── CoachCard.tsx                  # Individual coach display
│   └── RedFlagModal.tsx               # Warning modal
└── App.tsx                            # Main component + state
```

### Shared Types

```
packages/shared-types/
└── index.ts                           # TypeScript interfaces
```

## Design Choices & Assumptions

### Technology Decisions

**React Query over Redux**

- Simpler async state management
- Built-in caching and synchronization
- Less boilerplate for server state

**File-based Storage over Database**

- Simpler deployment and setup
- Atomic writes prevent corruption
- Easy to inspect and debug
- Production would use PostgreSQL/MongoDB

**NestJS Framework**

- TypeScript-first with decorators
- Built-in validation and error handling
- Modular architecture
- Easy testing and documentation

### Security Considerations

**Rate Limiting (Backend + Frontend)**

- Server-side: Prevents abuse (can't be bypassed)
- Client-side: Better UX (immediate feedback)
- Per user+IP combination prevents multi-account abuse

**Input Validation**

- TypeScript for compile-time safety
- NestJS validation pipes for runtime checks
- Parameterized queries prevent injection

**CORS Configuration**

- Whitelist specific origins
- Credentials support for future auth

### UX Decisions

**Optimistic Updates**

- Immediate UI feedback on success
- Rollback on error with clear messaging

**Red Flag System**

- Non-blocking warnings (users can still unlock)
- Clear modal explanation before proceeding
- Tracked in analytics for pattern detection

**Progressive Disclosure**

- Show relevant information at the right time
- Cooldown indicators prevent confusion
- Clear error messages with actionable advice

### Performance Considerations

**Frontend**

- React Query cache reduces API calls
- Background refetching keeps data fresh
- Debounced state updates for smooth animations

**Backend**

- In-memory rate limiting for speed
- Atomic file operations prevent race conditions
- Stateless design enables horizontal scaling

### Future Scalability

**Database Migration Path**

- Abstract data layer in service
- Easy to swap file storage for SQL/NoSQL
- Transaction support for complex operations

**Authentication Ready**

- User ID parameterization
- CORS configured for auth cookies
- Rate limiting by user+session

**Monitoring & Analytics**

- Unlock history for business insights
- Error logging for debugging
- Performance metrics collection points

## Testing Strategy

### Unit Tests

- Service logic validation
- Edge case handling
- Error scenarios

### Integration Tests

- API endpoint functionality
- Database operations
- Rate limiting behavior

### E2E Tests

- Complete unlock flow
- Red flag warnings
- Error handling UX

## Deployment Considerations

### Development

- Turbo for monorepo management
- Hot reload for both frontend/backend
- Shared types for consistency

### Production

- Docker containers
- Database migration
- Environment configuration
- Monitoring and logging

This architecture provides a solid foundation for a coach unlocking system that can scale from prototype to production while maintaining code quality and user experience.
