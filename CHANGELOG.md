# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-15

### Added
- **Authentication System**:
  - Secure user registration and login using NextAuth.js v5.
  - Password hashing with bcrypt.
  - Protected API routes and middleware for page security.
  - User-specific data isolation (workouts and templates are private).
- **Database Integration**:
  - Migrated from local JSON storage to Vercel Postgres.
  - Implemented Drizzle ORM for type-safe database interactions.
  - Added schemas for Users, Workouts, and Exercises.
- **Workout Management**:
  - "Today" tab for tracking current workouts.
  - "History" tab (Storico) to view past workouts.
  - Support for tracking sets, reps, and weight.
- **Productivity Features**:
  - **Recent Exercises**: Automatically suggests the last 5 unique exercises used.
  - **Custom Templates**: Ability to save and reuse favorite exercise configurations (sets/reps/weight).
  - Quick-add functionality from both Recents and Templates.
- **User Interface**:
  - Modern, responsive design using Tailwind CSS and Shadcn/ui.
  - Dark mode support.
  - Dynamic user menu with Avatar and Logout functionality.
  - Toast notifications for user actions (save success, errors).

### Changed
- **Architecture**: Refactored backend API to support multi-tenancy (User ID association).
- **Performance**: Optimized database queries with Drizzle Relations for efficient data retrieval.

### Fixed
- **Deployment**: Standardized on `npm` and `package-lock.json` for reliable Vercel builds.
- **Data Integrity**: Enforced foreign key constraints to maintain database consistency.
