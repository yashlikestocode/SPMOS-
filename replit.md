# Overview

SPMOS (Smart Parking Management and Optimization System) is a full-stack web application designed to streamline parking management in Sikkim, India. The system provides real-time parking spot availability, booking functionality, and session management with a focus on the local Sikkim market. Built with React, TypeScript, Node.js, and Express, it offers a modern web interface for users to discover, book, and manage parking sessions while providing real-time updates on parking availability.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side is built with React 18 and TypeScript using Vite as the build tool. The application follows a component-based architecture with context providers for state management:

- **UI Framework**: Uses shadcn/ui components built on Radix UI primitives for consistent, accessible design
- **Styling**: Tailwind CSS with custom CSS variables for theming, supporting both light and dark modes
- **State Management**: React Context API with custom providers (AuthContext, ParkingContext) for global state
- **Data Fetching**: TanStack Query (React Query) for server state management and caching
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Routing**: Single-page application with view-based navigation managed through context state

## Backend Architecture
The server follows a RESTful API design built with Express.js and TypeScript:

- **API Structure**: RESTful endpoints organized by feature (auth, parking-spots, bookings)
- **Request Handling**: Express middleware for JSON parsing, CORS, and request logging
- **Error Management**: Centralized error handling with proper HTTP status codes
- **Development Tools**: Custom Vite integration for hot module replacement in development
- **Session Management**: In-memory storage implementation with interface-based design for future database integration

## Data Storage Solutions
Currently uses in-memory storage with a well-defined interface pattern:

- **Storage Pattern**: Interface-based storage system (IStorage) allowing easy migration to persistent databases
- **Data Models**: Strongly typed with Zod schemas for validation and TypeScript interfaces
- **Mock Data**: Initialized with Sikkim-specific parking spots and realistic pricing in Indian Rupees
- **Database Ready**: Drizzle ORM configuration present for PostgreSQL migration when needed

## Authentication and Authorization
Simple authentication system designed for ease of use:

- **Authentication Flow**: Email/password based registration and login
- **Session Persistence**: Local storage for client-side session management
- **User Management**: User profiles with full name, email, username, and phone number
- **Security**: Basic password validation, email uniqueness checks

## Key Features and Business Logic
- **Real-time Updates**: Simulated parking availability changes with status indicators (available, almost full, full)
- **Booking System**: Complete booking flow with vehicle registration, duration selection, and cost calculation
- **Session Management**: Active parking session tracking with live timers and cost updates
- **Local Focus**: Tailored for Sikkim with INR pricing, local parking spots, and regional considerations
- **Responsive Design**: Mobile-first approach with adaptive layouts for various screen sizes

# External Dependencies

## Core Framework Dependencies
- **React 18**: Frontend framework with hooks and modern features
- **TypeScript**: Type safety across client and server code
- **Express.js**: Web application framework for the backend API
- **Vite**: Build tool and development server with hot module replacement

## UI and Styling
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Radix UI**: Unstyled, accessible UI primitives
- **shadcn/ui**: Pre-built component library built on Radix UI
- **Lucide React**: Icon library for consistent iconography

## Data and State Management
- **TanStack Query**: Server state management and data fetching
- **React Hook Form**: Form state management and validation
- **Zod**: Runtime type validation and schema definition
- **Drizzle ORM**: Type-safe SQL ORM for future database integration

## Database and Storage
- **@neondatabase/serverless**: Serverless PostgreSQL driver (configured but not actively used)
- **PostgreSQL**: Target database system for production deployment

## Development Tools
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **tsx**: TypeScript execution for development server
- **esbuild**: Fast JavaScript bundler for production builds

## Utility Libraries
- **date-fns**: Date manipulation and formatting
- **clsx**: Conditional CSS class name utility
- **class-variance-authority**: Component variant management
- **nanoid**: Unique ID generation