# Voice Commander - Offline Voice Control Web Application

## Overview
Voice Commander is a progressive web application that enables users to control their browser using voice commands. Built with React, Express, and the Web Speech API, it works entirely offline using browser-native speech recognition.

## Recent Changes
- **2025-01-11**: Initial project setup with voice command interface
  - Implemented voice recognition using Web Speech API
  - Created command palette with 6 predefined commands
  - Added command history tracking
  - Built settings panel with voice sensitivity, language, and appearance options
  - Implemented keyboard shortcuts for accessibility
  - Added offline detection and indicator

## Key Features
- **Voice Recognition**: Real-time speech-to-text using browser's Web Speech API (Chrome/Edge recommended)
- **Offline Support**: Works without internet connection (coming in Phase 3 with service workers)
- **Command Palette**: Visual grid of available commands with click alternatives
- **Command History**: Track last 10 voice commands with timestamps
- **Settings Panel**: Customize voice sensitivity, language, dark mode, and high contrast
- **Keyboard Shortcuts**: Full keyboard navigation support (Space, Esc, S, H, ?)
- **Accessibility**: ARIA labels, focus indicators, screen reader support

## Project Architecture

### Frontend (React + TypeScript)
- **Pages**: Home page with voice interface
- **Components**:
  - `VoiceInterface`: Main microphone control with real-time transcription
  - `CommandCard`: Visual command cards in grid layout
  - `CommandHistory`: Scrollable history of past commands
  - `SettingsPanel`: Slide-in drawer for preferences
  - `OfflineIndicator`: Banner when offline
  - `KeyboardShortcuts`: Modal showing available shortcuts

### Backend (Express + In-Memory Storage)
- **Storage**: In-memory storage for commands and settings
- **API Routes**: RESTful endpoints for commands and settings CRUD

### Data Models
- **VoiceCommand**: transcript, intent, confidence, executedAt
- **UserSettings**: voiceSensitivity, wakeWordEnabled, language, darkMode, highContrast

## Available Commands
1. **Go Home**: Navigate to home page
2. **Open Settings**: Open settings panel
3. **Clear History**: Delete command history
4. **Toggle Dark Mode**: Switch between light/dark themes
5. **Show Help**: Display available commands
6. **Stop Listening**: Turn off microphone

## Design System
- **Colors**: Material Design 3 inspired with primary (blue), accent (purple), and semantic colors
- **Typography**: Inter for UI, JetBrains Mono for code/commands
- **Spacing**: Consistent 4/6/8/12/16 unit system
- **Components**: Shadcn UI with custom voice interaction elements
- **Dark Mode**: Full dark mode support with toggle in settings

## Browser Compatibility
- **Chrome/Edge**: Full support (recommended)
- **Firefox**: Limited speech recognition support
- **Safari**: Partial support (iOS Safari has restrictions)

## Keyboard Shortcuts
- **Space**: Toggle microphone on/off
- **Esc**: Stop listening
- **S**: Open settings
- **H**: Clear command history
- **?**: Show keyboard shortcuts

## Development Status
- ✅ Phase 1: Frontend & Schema (Complete)
- ✅ Phase 2: Backend Implementation (Complete)
- ✅ Phase 3: Integration & Testing (Complete)

## Important Notes
- **Storage Limitation**: Command history and settings use in-memory storage and will reset when the server restarts. This is intentional for development/demo purposes. For production, consider implementing persistent storage with a database or localStorage for client-side persistence.
- **Service Worker**: Registered for offline asset caching. The app will continue to work offline once assets are cached, though API calls will fail without network connectivity.
- **Browser Support**: Best experience in Chrome/Edge. Firefox and Safari have limited Web Speech API support.

## Technical Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, Shadcn UI, TanStack Query
- **Backend**: Express.js, Node.js
- **Storage**: In-memory (MemStorage)
- **Voice**: Web Speech API (browser-native)
- **Build**: Vite

## User Preferences
- Material Design 3 aesthetic
- Minimal animations (only for feedback)
- Voice-first interaction paradigm
- Accessibility is critical
- Offline-first approach
