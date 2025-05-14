# 10x Astro Starter

A modern, opinionated starter template for building fast, accessible, and AI-friendly web applications.

## Tech Stack

- [Astro](https://astro.build/) v5.5.5 - Modern web framework for building fast, content-focused websites
- [React](https://react.dev/) v19.0.0 - UI library for building interactive components
- [TypeScript](https://www.typescriptlang.org/) v5 - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) v4.0.17 - Utility-first CSS framework
- [Vitest](https://vitest.dev/) - Unit testing framework for React components and services
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) - Testing utilities for React
- [Playwright](https://playwright.dev/) - End-to-end testing framework

## Prerequisites

- Node.js v22.14.0 (as specified in `.nvmrc`)
- npm (comes with Node.js)

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run test` - Run unit tests with Vitest
- `npm run test:ui` - Run Vitest with UI
- `npm run test:e2e` - Run end-to-end tests with Playwright

## Project Structure

```md
.
├── src/
│ ├── layouts/ # Astro layouts
│ ├── pages/ # Astro pages
│ │ └── api/ # API endpoints
│ ├── components/ # UI components (Astro & React)
│ ├── lib/ # Services and utilities
│ │ └── **tests**/ # Unit tests for services
│ └── assets/ # Static assets
├── public/ # Public assets
├── tests/ # End-to-end tests with Playwright
```

## Deployments & Releases

This project is configured for optimal deployment with the following recommended options:

### Recommended Hosting Solutions

1. **Cloudflare Pages** - Recommended for production deployment

   - Excellent performance with global CDN
   - Generous free tier with unlimited bandwidth
   - Easy integration with Astro SSR via Workers
   - Automatic preview deployments for branches
   - Simple CI/CD pipeline with GitHub integration

2. **Vercel** - Great alternative with excellent Astro support

   - Native integration with Astro and seamless deployments
   - Free tier includes preview environments and CI/CD
   - Optimized for React applications
   - Limited to 100GB bandwidth on free tier

3. **Netlify** - Solid option with good Astro compatibility
   - Easy deployment workflow with GitHub integration
   - Preview deployments for branches
   - Similar pricing structure to Vercel

### Alternative Hosting Solutions

- **DigitalOcean App Platform** - For more control with containerization
- **Google Cloud Run** - Serverless container deployment option

### Deployment Strategy

For this project, we recommend the following deployment strategy:

1. Development: Local environment using `npm run dev`
2. Staging: Automatic preview deployments on Cloudflare Pages for feature branches
3. Production: Main branch deployment on Cloudflare Pages with custom domain

### Environment Setup

Each environment requires the following environment variables:

- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_KEY` - Supabase project API key

Additional environment variables should be documented here as they are added.

## AI Development Support

This project is configured with AI development tools to enhance the development experience, providing guidelines for:

- Project structure
- Coding practices
- Frontend development
- Styling with Tailwind
- Accessibility best practices
- Astro and React guidelines

### Cursor IDE

The project includes AI rules in `.cursor/rules/` directory that help Cursor IDE understand the project structure and provide better code suggestions.

### GitHub Copilot

AI instructions for GitHub Copilot are available in `.github/copilot-instructions.md`

### Windsurf

The `.windsurfrules` file contains AI configuration for Windsurf.

## Contributing

Please follow the AI guidelines and coding practices defined in the AI configuration files when contributing to this project.

## License

MIT
