# Design Guidelines: Voice-Commanded Web Application

## Design Approach
**System**: Material Design 3 principles with custom voice interaction components
**Rationale**: Provides strong visual feedback patterns, accessibility foundation, and component clarity needed for voice-first interfaces where users need immediate visual confirmation of speech recognition states.

## Typography System
- **Primary Font**: Inter (Google Fonts) - excellent readability for UI labels and feedback
- **Monospace Font**: JetBrains Mono - for command syntax and technical feedback
- **Hierarchy**:
  - Voice feedback display: text-2xl md:text-3xl, font-medium
  - Section headers: text-xl, font-semibold
  - Command labels: text-base, font-medium
  - Body text: text-sm, regular
  - Help text: text-xs, text-gray-600

## Layout & Spacing System
**Tailwind Units**: Use 4, 6, 8, 12, 16 as primary spacing values (p-4, gap-6, mb-8, py-12, mt-16)
- Container: max-w-7xl mx-auto px-4 md:px-6
- Section spacing: py-12 md:py-16
- Component gaps: gap-4 for tight grouping, gap-6 for section separation
- Card padding: p-6 md:p-8

## Core Component Library

### Voice Interaction Zone (Primary Feature)
- **Voice Status Display**: Large centered area (min-h-48) showing real-time transcription
- **Microphone Button**: Prominent circular button (w-20 h-20) with pulse animation when active
- **Visual States**: 
  - Idle: Static microphone icon
  - Listening: Pulsing animation with waveform visualization
  - Processing: Spinner indicator
  - Success/Error: Brief confirmation with icon and message
- **Command History**: Scrollable list (max-h-64 overflow-y-auto) showing last 10 commands with timestamps

### Navigation & Layout
- **Top App Bar**: Fixed header (h-16) with app title, connection status indicator (online/offline), settings icon
- **Main Content Area**: Single column layout with voice zone at top, command grid below
- **Command Palette Grid**: 2 columns on mobile (grid-cols-2), 3-4 on desktop (md:grid-cols-3 lg:grid-cols-4), gap-4

### Command Cards
- Rounded cards (rounded-lg) with p-4 spacing
- Icon at top (w-12 h-12)
- Command name (text-base font-medium)
- Spoken phrase example (text-xs, monospace)
- Hover state: subtle lift effect (transition-transform hover:scale-105)

### Settings Panel
- Slide-in drawer from right (fixed inset-y-0 right-0, w-80 md:w-96)
- Sections with clear dividers (border-b)
- Toggle switches for voice sensitivity, wake word enable
- Dropdown for language/accent selection
- Save/Cancel buttons at bottom (sticky)

### Offline Indicator
- Persistent banner when offline (h-8, top of viewport)
- Subtle background with icon and "Offline Mode" text
- Does not obstruct primary interaction area

### Accessibility Features
- High contrast mode toggle in settings
- Keyboard shortcuts overlay (triggered by "?" key)
- Focus indicators on all interactive elements (ring-2 ring-offset-2)
- ARIA labels for all voice state changes
- Screen reader announcements for command recognition

## Images
**No hero image required** - this is a utility application. Focus is on functional interface with voice interaction zone as the visual anchor.

**Icons Only**:
- Microphone states (idle/active/muted) - Material Icons
- Command category icons - Material Icons
- Status indicators (online/offline, success/error) - Material Icons
- Navigation icons - Material Icons

All icons via CDN: Material Icons

## Animations (Minimal)
- Voice button pulse: Subtle scale animation when listening (0.95 to 1.05)
- Waveform visualization: SVG-based audio levels during speech input
- Command success: Brief scale-in confirmation (200ms)
- Page transitions: None - instant feedback preferred for voice UI
- Settings drawer: Slide transition (300ms ease-in-out)

**Principle**: Animations only for state feedback, never decorative. Voice interfaces require immediate visual confirmation.

## Key Layout Patterns
- **Voice-First Hierarchy**: Microphone control and transcription occupy top 40% of viewport
- **Progressive Disclosure**: Advanced settings hidden until requested
- **Command Discovery**: Always-visible command grid helps users learn available phrases
- **Dual Input**: All voice commands have visible button alternatives in the same view
- **Status Transparency**: Connection state, processing status, and error messages always visible