# Roofing Cost Calculator

## Overview

This is a modern web-based roofing cost calculator application designed for Torrance Roofing Masters. The application provides accurate cost estimates for both residential and commercial roofing projects based on 2025 Torrance, CA pricing data. It features a dynamic React frontend with shadcn/ui components, TypeScript for type safety, and includes comprehensive calculation logic for various roofing materials, job types, and complexity factors.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type-safe component development
- **UI Library**: shadcn/ui components built on Radix UI primitives for accessible, customizable interfaces
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React hooks for local state, TanStack React Query for server state management
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **API Design**: RESTful API structure with `/api` prefix routing
- **Storage Interface**: Abstracted storage layer with in-memory implementation (MemStorage)
- **Development**: Hot module replacement and development middleware integration

### Data Storage Solutions
- **Database**: PostgreSQL configured with Drizzle ORM for type-safe database operations
- **Connection**: Neon Database serverless PostgreSQL for scalable cloud hosting
- **Migrations**: Drizzle Kit for schema management and database migrations
- **Current State**: Basic user schema implemented, expandable for roofing project data

### Form Handling & Validation
- **Forms**: React Hook Form with Zod resolvers for schema-based validation
- **Validation**: Drizzle-Zod integration for consistent validation between database and frontend
- **User Experience**: Real-time validation with accessible error messaging

### Component Architecture
- **Design System**: Comprehensive shadcn/ui component library with consistent theming
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Visualization**: Recharts integration for cost breakdown charts and data visualization

### Calculation Engine
- **Pricing Data**: 2025 Torrance, CA market rates for residential and commercial materials
- **Cost Factors**: Material type, roof complexity, job type (new/replacement/repair), add-ons
- **Material Support**: Comprehensive coverage including asphalt, metal, tile, membrane systems
- **Business Logic**: Separate calculation utilities for maintainable cost estimation algorithms

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, TypeScript support
- **Build Tools**: Vite with React plugin, ESBuild for production builds
- **Development**: tsx for TypeScript execution, Replit integration plugins

### UI and Styling
- **Component Library**: Radix UI primitives for accessible base components
- **Styling**: Tailwind CSS with PostCSS and Autoprefixer
- **Icons**: Lucide React for consistent iconography
- **Animations**: Class Variance Authority for component variants
- **Utilities**: clsx and tailwind-merge for conditional styling

### Data and Forms
- **HTTP Client**: TanStack React Query for server state management
- **Form Management**: React Hook Form with Hookform resolvers
- **Validation**: Zod for schema validation and type inference
- **Database**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Neon Database serverless PostgreSQL

### Charts and Visualization
- **Charting**: Recharts for responsive data visualization
- **Chart Types**: Pie charts for cost breakdown analysis
- **Data Presentation**: Custom chart components with consistent theming

### Utility Libraries
- **Date Handling**: date-fns for date manipulation and formatting
- **Carousel**: Embla Carousel React for interactive content presentation
- **Command Interface**: cmdk for command palette functionality
- **Session Management**: connect-pg-simple for PostgreSQL session storage

### Development and Deployment
- **Package Manager**: npm with lock file for consistent dependency resolution
- **Environment**: Node.js ES modules with proper TypeScript configuration
- **Replit Integration**: Specialized plugins for Replit development environment
- **Error Handling**: Runtime error overlay for development debugging