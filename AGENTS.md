You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain
- Use path aliases configured in TypeScript (e.g., `@app/*`, `@shared/*`, `@core/*`) for imports instead of long relative paths. Relative paths are fine for files in the exact same directory.

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

## Styling & Formatting

- Use SCSS for styling.
- Rely on Prettier for code formatting (printWidth: 100, singleQuote: true) alongside `eslint-config-prettier` to prevent conflicts.

### Components

- Keep components small and focused on a single responsibility
- Use `meal-planner` as the selector prefix for components (kebab-case) and directives (camelCase), as enforced by ESLint.
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Always use external templates (`.html`) and styles (`.scss`) files, even for small components.
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.
- Do not write arrow functions in templates (they are not supported).
- Use self-closing tags when elements have no content.
- Use strict equality (`===` or `!==`) in template expressions.
- Avoid casting to `any` in templates (e.g., `$any()`).
- Avoid negated async pipes (e.g., `!(obs | async)`).

## Verification Rules (AI Safeguards)

- ALWAYS update or create the corresponding `.spec.ts` testing file when modifying critical logic, services, or templates.
- ALWAYS execute `npm run test` before marking a task as explicitly completed or notifying the user. Do NOT push incomplete code that breaks unit tests.

## Git Commits

- You MUST follow the **Conventional Commits** specification (`type(scope): message`) when writing commit messages or generating commit suggestions. 
- The project has `commitlint` installed which will strictly reject any commit message that does not adhere to conventional commits (e.g., `feat:`, `fix:`, `chore:`, `refactor:`, etc.).

## Testing

- Declare mock objects at the `describe` block scope as typed variables (e.g., `let mockRepo: { getAll: ReturnType<typeof vi.fn> }`).
- Assign the mock inside `beforeEach` and pass it **directly** as `useValue` to `TestBed.configureTestingModule` or `overrideComponent`.
- **NEVER** re-fetch a mock from the injector just to get a typed reference. There is no need to call `TestBed.inject()` or `fixture.debugElement.injector.get()` on a token that you already provided as a spy — you already hold the reference.
- **NEVER** use the double-cast `as unknown as typeof mockX` pattern. It is a code smell that signals the mock wiring is wrong.
- **NEVER** use `as unknown as ServiceType` when providing a partial spy to `useValue`. TypeScript will accept a plain object literal as `useValue` because the field is typed as `any` internally.
- Use the generic `querySelector<HTMLInputElement>()` overload combined with an explicit `=== null` guard instead of type assertions, for DOM element access in tests.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection
