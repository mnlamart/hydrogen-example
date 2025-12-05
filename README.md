# Shopify Hydrogen Theme with TDD, Radix UI, and shadcn/ui

A modern Shopify Hydrogen storefront built with TypeScript, Tailwind CSS, test-driven development, Radix UI primitives, and shadcn/ui components, configured for deployment to Shopify Oxygen.

## Tech Stack

- **Hydrogen**: 2025.7.0 (latest compatible version)
- **React Router**: 7.9.2
- **TypeScript**: 5.9.2
- **Tailwind CSS**: 4.1.6
- **shadcn/ui**: Latest (copy-paste component library)
- **Radix UI**: Latest primitives
- **Vitest**: Unit and integration testing
- **Playwright**: End-to-end testing

## Prerequisites

- Node.js 18.0.0 or higher (but less than 22.0.0)
- Shopify store with Storefront API access
- Shopify CLI installed (`npm install -g @shopify/cli @shopify/theme`)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

#### Option A: Link to Shopify Store (Recommended)

The easiest way to set up your environment is to link your project to a Shopify store:

```bash
shopify hydrogen link
```

This command will:
- Prompt you to select or create a Shopify store
- Automatically configure your `.env` file with the necessary credentials
- Set up the Storefront API connection

#### Option B: Manual Configuration

Alternatively, create a `.env` file manually in the root directory:

```env
PUBLIC_STOREFRONT_API_TOKEN=your-storefront-api-token-here
PUBLIC_STORE_DOMAIN=your-store.myshopify.com
PUBLIC_STOREFRONT_ID=your-storefront-id-here
SESSION_SECRET=your-session-secret-at-least-32-characters-long
```

**Note**: Never commit your `.env` file to version control. Use `.env.example` as a template.

### 3. Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Testing (TDD Workflow)

This project follows a test-driven development approach with comprehensive testing infrastructure.

### Unit Tests (Vitest)

Run unit tests:

```bash
npm run test          # Run once
npm run test:watch    # Watch mode for TDD
npm run test:ui       # UI mode with coverage
```

### Integration Tests

Integration tests are located in `tests/integration/` and run with the same Vitest commands.

### End-to-End Tests (Playwright)

Run E2E tests:

```bash
npm run test:e2e      # Run Playwright tests (headless)
npm run test:e2e:ui   # Run with UI mode
```

### Test Coverage

Coverage reports are generated automatically when running tests. View coverage in the `coverage/` directory after running tests.

### TDD Workflow

1. **Write a failing test** first (`tests/unit/`, `tests/integration/`, or `tests/e2e/`)
2. **Run the test** to confirm it fails
3. **Write the minimum code** to make the test pass
4. **Refactor** while keeping tests green
5. **Repeat**

Example test files are provided in:
- `tests/unit/components/Button.test.tsx` - Unit test example
- `tests/integration/cart.test.tsx` - Integration test example
- `tests/e2e/homepage.spec.ts` - E2E test example

## shadcn/ui Components

This project uses [shadcn/ui](https://ui.shadcn.com/), a collection of re-usable components built with Radix UI and Tailwind CSS.

### Adding Components

To add a new shadcn/ui component:

```bash
npx shadcn@latest add [component-name]
```

For example:

```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
```

### Component Configuration

Components are configured in `components.json`. The default configuration:
- **Style**: New York
- **Base Color**: Neutral
- **CSS Variables**: Enabled
- **Component Path**: `~/components/ui`
- **Utils Path**: `~/lib/utils`

### Using Components

```tsx
import {Button} from '~/components/ui/button';

export function MyComponent() {
  return <Button variant="default">Click me</Button>;
}
```

## Radix UI Integration

Radix UI primitives are installed and ready to use. Common primitives include:

- `@radix-ui/react-dialog`
- `@radix-ui/react-dropdown-menu`
- `@radix-ui/react-select`
- `@radix-ui/react-tabs`
- `@radix-ui/react-toast`
- `@radix-ui/react-tooltip`
- And many more...

Radix UI components work seamlessly with Tailwind CSS and are used as the foundation for shadcn/ui components.

## Project Structure

```
shopify-hydrogen/
├── app/
│   ├── components/          # React components
│   │   └── ui/              # shadcn/ui components
│   ├── lib/                 # Utility functions
│   │   └── utils.ts        # cn() helper for class merging
│   ├── routes/              # React Router routes
│   └── styles/              # Global styles
│       └── tailwind.css     # Tailwind with CSS variables
├── tests/
│   ├── unit/                # Unit tests
│   ├── integration/         # Integration tests
│   ├── e2e/                 # E2E tests (Playwright)
│   └── setup.ts             # Test setup file
├── components.json          # shadcn/ui configuration
├── vitest.config.ts        # Vitest configuration
├── playwright.config.ts    # Playwright configuration
└── vite.config.ts          # Vite & Hydrogen configuration
```

## Available Scripts

### Development
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run codegen` - Generate GraphQL types

### Testing
- `npm run test` - Run unit/integration tests
- `npm run test:watch` - Run tests in watch mode (TDD)
- `npm run test:ui` - Run tests with UI and coverage
- `npm run test:e2e` - Run E2E tests (headless)
- `npm run test:e2e:ui` - Run E2E tests with UI

### Code Quality
- `npm run lint` - Run ESLint
- `npm run typecheck` - Type check TypeScript

### Hydrogen CLI Commands

Additional helpful commands:

```bash
# Link to Shopify store (sets up .env automatically)
shopify hydrogen link

# Generate new route
shopify hydrogen generate route products

# Setup CSS framework
shopify hydrogen setup css --install tailwind

# Setup i18n/markets
shopify hydrogen setup markets --strategy subfolders

# Type check
shopify hydrogen check
```

## Deployment to Oxygen

### Deploy

```bash
shopify hydrogen deploy
```

### Environment Variables

Manage environment variables on Oxygen:

```bash
shopify hydrogen env pull  # Pull environment variables from Oxygen
shopify hydrogen env push  # Push local .env to Oxygen
shopify hydrogen env list  # List all environment variables
```

**Tip**: Use `shopify hydrogen link` during initial setup to automatically configure your local `.env` file, then use `shopify hydrogen env push` to sync to Oxygen.

### Deployment Configuration

The project is pre-configured for Oxygen deployment:
- `vite.config.ts` includes Oxygen plugin
- `server.ts` handles Oxygen runtime
- Environment variables are typed in `env.d.ts`

## Documentation Sources

All documentation is retrieved using context7 MCP server:
- **Hydrogen**: `/shopify/hydrogen`
- **shadcn/ui**: `/shadcn-ui/ui`
- **Radix UI**: `/radix-ui/primitives`
- **Testing**: Vitest and Playwright docs via context7

## Additional Resources

- [Hydrogen Documentation](https://shopify.dev/custom-storefronts/hydrogen)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Radix UI Documentation](https://www.radix-ui.com/)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)

## License

MIT
