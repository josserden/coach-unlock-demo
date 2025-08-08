# Coach Unlock Demo

A full-stack TypeScript application demonstrating a coach unlocking system with tokens, XP, rate limiting, and red flag warnings.

## Quick Start

```bash
# Install dependencies
npm install

# Start both frontend and backend
npm run dev
```

- **Frontend**: http://localhost:3000 (React + Vite)
- **Backend**: http://localhost:3001 (NestJS)

## Features Implemented

✅ **Token-based unlock system** - Users spend tokens to unlock coaches
✅ **XP progression** - Gain experience points from unlocks
✅ **Red flag warnings** - Modal warnings for problematic coaches
✅ **Rate limiting** - 5-second cooldown between unlocks (frontend + backend)
✅ **Real-time UI updates** - Immediate feedback with loading states
✅ **Persistent state** - Data saved to `db.json`
✅ **Error handling** - Comprehensive validation and user feedback
✅ **TypeScript** - End-to-end type safety with shared types

## Architecture Highlights

- **Monorepo** with shared TypeScript types
- **React Query** for server state management
- **NestJS** with custom rate limiting decorator
- **Atomic transactions** for data consistency
- **Optimistic updates** for better UX
- **CORS configured** for secure communication

## Project Structure

```
├── apps/
│   ├── frontend/          # React + Vite + TailwindCSS
│   └── backend/           # NestJS + TypeScript
├── packages/
│   └── shared-types/      # Shared TypeScript interfaces
├── db.json               # File-based database
├── ARCHITECTURE.md       # Detailed technical documentation
└── README.md            # This file
```

## Demo User

- **User ID**: `1` (hardcoded for demo)
- **Initial tokens**: `25`
- **Initial XP**: `115`
- **Some coaches already unlocked**

## Technology Stack

**Frontend**

- React 19 + TypeScript
- Vite for fast development
- TailwindCSS + DaisyUI for styling
- React Query for state management

**Backend**

- NestJS + TypeScript
- Custom rate limiting system
- File-based storage (production-ready for DB)
- CORS configured

**Shared**

- TypeScript interfaces
- Turbo for monorepo management
- ESLint + Prettier

## Key Implementation Details

### Rate Limiting

- **Frontend**: UI cooldown indicators
- **Backend**: Custom `@RateLimit()` decorator with interceptor
- **Strategy**: 1 unlock per 5 seconds per user+IP

### State Management

- **Server state**: React Query with automatic caching
- **Local state**: React hooks for UI interactions
- **Persistence**: JSON file with atomic writes

### Error Handling

- **Network errors**: Retry logic and user feedback
- **Business logic errors**: Clear validation messages
- **Rate limiting**: Countdown timers and wait messages

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed technical documentation.

## Development Commands

```bash
# Install dependencies
npm install

# Start development servers
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Type checking
npm run type-check
```

## Future Enhancements

- User authentication and sessions
- Real database integration (PostgreSQL/MongoDB)
- Admin panel for coach management
- Analytics dashboard
- Unit and E2E testing suite
- Docker deployment setup
