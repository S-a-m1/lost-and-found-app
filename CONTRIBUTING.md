# Contributing to Lost & Found

Thank you for your interest in contributing to the Lost & Found platform! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Help others learn and grow
- Focus on constructive feedback
- Respect differing viewpoints and experiences

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- A clear, descriptive title
- Steps to reproduce the bug
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Your environment (OS, browser, Node version)

### Suggesting Features

We welcome feature suggestions! Please create an issue with:
- A clear, descriptive title
- Detailed description of the feature
- Why this feature would be useful
- Any examples from other apps (if applicable)

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/S-a-m1/lost-and-found-app.git
   cd lost-and-found-app
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

3. **Make your changes**
   - Write clear, concise commit messages
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **Test your changes**
   ```bash
   npm run dev
   # Test manually in the browser
   # Ensure existing features still work
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   # or
   git commit -m "fix: resolve issue with..."
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Provide a clear description of your changes
   - Reference any related issues

## Coding Standards

### TypeScript

- Use TypeScript for all new files
- Define proper types/interfaces
- Avoid `any` type when possible
- Use meaningful variable names

### React/Next.js

- Use functional components with hooks
- Keep components small and focused
- Use Server Components where possible
- Client Components when needed (use "use client")

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons at the end of statements
- Use trailing commas in objects/arrays
- Keep lines under 100 characters when possible

### Naming Conventions

- Components: PascalCase (e.g., `ItemCard.tsx`)
- Functions: camelCase (e.g., `fetchItems`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_URL`)
- Files: kebab-case or PascalCase for components

### File Organization

```
app/
  ├── api/              # API routes
  ├── (pages)/          # Page components
  └── layout.tsx        # Layouts

components/
  ├── ui/              # Reusable UI components
  └── features/        # Feature-specific components

lib/
  ├── utils.ts         # Utility functions
  ├── validations.ts   # Zod schemas
  └── hooks/           # Custom React hooks
```

## Database Changes

When modifying the database schema:

1. Update `prisma/schema.prisma`
2. Create a migration:
   ```bash
   npx prisma migrate dev --name description-of-change
   ```
3. Update seed file if necessary
4. Document the changes

## API Changes

When adding or modifying API endpoints:

1. Follow RESTful conventions
2. Add proper error handling
3. Validate input with Zod
4. Add authentication where needed
5. Update API documentation in README

## UI/UX Guidelines

- Mobile-first responsive design
- Maintain minimalistic aesthetic
- Follow accessibility guidelines (WCAG 2.1 AA)
- Use Tailwind CSS classes
- Ensure keyboard navigation works
- Add appropriate ARIA labels
- Test on multiple screen sizes

## Testing

Currently, the project doesn't have automated tests, but:

- Manually test all changes
- Test on different browsers (Chrome, Firefox, Safari)
- Test on mobile devices
- Verify authentication still works
- Check database operations
- Test error scenarios

Future: We welcome contributions to add:
- Unit tests (Vitest/Jest)
- Integration tests
- E2E tests (Playwright)

## Documentation

When contributing, update:
- README.md for major features
- Code comments for complex logic
- API documentation for new endpoints
- DEPLOYMENT.md for deployment changes

## Commit Messages

Follow conventional commits format:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Examples:
```
feat: add email notifications for new messages
fix: resolve chat scroll issue on mobile
docs: update deployment guide with Supabase steps
```

## Need Help?

- Check existing issues and PRs
- Review the README and documentation
- Ask questions in issue comments
- Reach out to maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- Future CHANGELOG.md
- Project acknowledgments

Thank you for contributing to Lost & Found! 🎉
