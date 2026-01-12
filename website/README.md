# Smart Grind - Pattern Practice Web App

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
![Web App](https://img.shields.io/badge/Platform-Web-blue)

**Smart Grind** is a web application designed to help you master coding patterns through structured practice and spaced repetition. It complements the Chrome extension by providing a comprehensive platform for tracking progress across various algorithmic patterns.

Visit the official website: [algovyn.com/smartgrind](https://algovyn.com/smartgrind)

## Features

### Core Functionality
- **Pattern-Based Learning**: Organized collection of LeetCode problems grouped by algorithmic patterns (Two Pointers, Sliding Window, etc.)
- **Spaced Repetition System**: Intelligent review scheduling based on spaced repetition intervals (1, 3, 7, 14, 30, 60 days)
- **Progress Tracking**: Visual progress bars and statistics for each pattern and overall progress
- **Custom Problem Addition**: Add your own problems to track additional practice

### Advanced Features
- **User Authentication**: Secure Google OAuth login with data synced across devices
- **Topic Organization**: Problems organized by topics (Arrays, Trees, Graphs, etc.) and specific patterns within each topic
- **Search and Filtering**: Search problems by name or notes, filter by status (All, Solved, Due for Review)
- **Notes System**: Add personal notes to problems for better retention
- **AI Integration**: Quick access to AI assistants (Gemini, Grok) with pre-filled prompts for problem explanations
- **Export Functionality**: Export your progress data as JSON for backup (includes problems, notes, and review schedules)

### Technical Details
- **Authentication**: Google OAuth 2.0 with JWT tokens
- **Data Storage**: Cloudflare Workers with KV storage for user data
- **Frontend**: Vanilla JavaScript with Tailwind CSS for styling
- **Responsive Design**: Mobile-first design with collapsible sidebar
- **Performance**: Optimized for fast loading and smooth interactions

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Cloudflare account (for deployment)

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AlgoVyn/smart-grind.git
   cd smart-grind/website
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   - Copy `wrangler.toml.example` to `wrangler.toml`
   - Set up your Cloudflare account and configure the following environment variables:
     - `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
     - `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret
     - `JWT_SECRET`: A secure secret for JWT signing
     - `KV`: Cloudflare KV namespace for data storage

4. **Start development server**:
   ```bash
   wrangler pages dev public
   ```

5. **Deploy to Cloudflare**:
   ```bash
   wrangler pages deploy public
   ```

### Environment Configuration

Create a `.env` file or configure in Cloudflare:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret
```

## Testing

The project includes comprehensive testing to ensure reliability and prevent regressions.

### Unit Tests
Run unit tests using Jest:
```bash
npm test
```

For continuous testing during development:
```bash
npm run test:watch
```

To generate coverage reports:
```bash
npm run test:coverage
```

### End-to-End Tests
End-to-end tests are implemented with Playwright for browser automation.

Run E2E tests:
```bash
npm run test:e2e
```

Run E2E tests with UI mode for debugging:
```bash
npm run test:e2e:ui
```

### Test Structure
- **Unit Tests**: Located in `tests/` directory, covering modules, utilities, and core logic
- **E2E Tests**: Located in `e2e/` directory, testing full user workflows

## Usage

### Getting Started
1. **Access the App**: Navigate to the deployed URL or run locally
2. **Sign In**: Click "Sign in with Google" to authenticate
3. **Start Practicing**: Browse topics and patterns, click on problems to solve

### Navigation
- **Sidebar**: Browse topics and view progress percentages
- **Main View**: See problems organized by patterns within topics
- **Filters**: Switch between All, Solved, and Due for Review problems
- **Search**: Use the search bar to find specific problems

### Problem Management
- **Solve Problems**: Mark problems as solved to start spaced repetition
- **Review System**: Problems due for review appear with special highlighting
- **Add Notes**: Click the notes button to add personal insights
- **Custom Problems**: Use "Add Problem" to include additional practice problems

### AI Assistance
- **Quick Prompts**: Click Gemini or Grok buttons to open AI services with pre-filled prompts
- **AI Integration**: Opens the respective AI service with pre-filled prompts
- **Prompt Content**: Automatically generates prompts asking for solution explanation, intuition, optimal approach, and complexity analysis

### Additional Features
- **Theme Toggle**: Switch between light and dark themes (top-right corner)
- **Keyboard Shortcuts**:
  - `/`: Focus search bar
  - `E`: Export progress data
  - `Escape`: Close modals
- **Export Functionality**: Download your progress as JSON for backup (press `E` or use export button)
- **URL-based Navigation**: Shareable URLs for specific categories (e.g., `/smartgrind/c/arrays-hashing`)

### Data Export/Import Format

The application supports exporting and importing user progress data in JSON format for backup and migration purposes.

**Export Format**:
```json
{
  "problems": {
    "problem_id": {
      "solved": true,
      "notes": "Personal notes for the problem",
      "reviewDate": "2024-01-15T00:00:00.000Z",
      "custom": true
    }
  },
  "deletedIds": ["removed_problem_id"],
  "exportDate": "2024-01-10T12:00:00.000Z"
}
```

**Fields**:
- `problems`: Object mapping problem IDs to progress data
  - `solved`: Boolean indicating if the problem is marked as solved
  - `notes`: String containing user notes
  - `reviewDate`: ISO string of next review date (null if not scheduled)
  - `custom`: Boolean for user-added problems
- `deletedIds`: Array of IDs for problems removed by the user
- `exportDate`: Timestamp of export

**Import**: Upload a JSON file in the above format to restore progress. Existing data will be merged, with imported data taking precedence for conflicts.
- **Mobile Responsive**: Optimized interface for mobile devices with collapsible sidebar
- **Scroll to Top**: Automatic scroll-to-top button appears when scrolling down
- **Toast Notifications**: Real-time feedback for actions like saving notes or solving problems

## Architecture

### Frontend Structure
- **HTML**: Single-page application with semantic markup
- **CSS**: Tailwind CSS for utility-first styling
- **JavaScript**: Modular ES6+ code with event-driven architecture

### Backend (Cloudflare Workers)
- **Authentication**: `/api/auth` - Google OAuth flow and JWT generation
- **User Data**: `/api/user` - CRUD operations for user progress data
- **Storage**: Cloudflare KV for persistent, low-latency data storage

### Data Flow
1. **Authentication**: User logs in via Google OAuth, receives JWT token
2. **Data Loading**: App fetches user progress data from KV storage
3. **Problem Sync**: Static problem data merged with user progress
4. **Updates**: Changes saved back to KV via authenticated API calls

### Key Components
- **Topic Sidebar**: Hierarchical navigation with progress indicators
- **Problem Cards**: Interactive cards with status, notes, and actions
- **Stats Dashboard**: Real-time progress visualization
- **Modal System**: Add problems, authentication, and confirmations

## API Reference

### Authentication Endpoints

#### GET /api/auth?action=login
Initiates Google OAuth flow.

**Query Parameters**:
- `action=login`: Required to start OAuth

**Response**: Redirects to Google OAuth consent screen.

**Errors**:
- 400 Bad Request: Invalid action parameter

#### GET /api/auth (OAuth callback)
Handles OAuth callback, generates JWT, and redirects to app.

**Query Parameters** (from Google OAuth):
- `code`: Authorization code
- `state`: State parameter for CSRF protection

**Response**: Redirects to the app with JWT token in URL fragment or cookie.

**Errors**:
- 400 Bad Request: Missing or invalid code
- 401 Unauthorized: OAuth verification failed

### User Data Endpoints

#### GET /api/user
Retrieves user progress data.

**Headers**:
- `Authorization: Bearer <jwt_token>` (required)

**Response** (200 OK):
```json
{
  "problems": {
    "problem_id_1": {
      "solved": true,
      "notes": "My solution notes",
      "reviewDate": "2024-01-15T00:00:00.000Z"
    }
  },
  "deletedIds": ["old_problem_id"]
}
```

**Errors**:
- 401 Unauthorized: Invalid or missing JWT token
- 500 Internal Server Error: KV storage error

#### POST /api/user
Updates user progress data.

**Headers**:
- `Authorization: Bearer <jwt_token>` (required)
- `Content-Type: application/json`

**Body**:
```json
{
  "data": {
    "problems": {
      "problem_id_1": {
        "solved": true,
        "notes": "Updated notes",
        "reviewDate": "2024-01-15T00:00:00.000Z"
      }
    },
    "deletedIds": ["old_problem_id"]
  }
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Data updated successfully"
}
```

**Errors**:
- 400 Bad Request: Invalid JSON or missing data
- 401 Unauthorized: Invalid or missing JWT token
- 500 Internal Server Error: KV storage error

## Contributing

We welcome contributions! Please follow these guidelines to ensure smooth collaboration.

### Development Workflow
1. **Fork the repository** and clone your fork locally
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make changes** following the code style guidelines
4. **Run tests**: Ensure all unit and E2E tests pass
5. **Test across devices**: Verify functionality on different screen sizes
6. **Commit changes**: Use clear, descriptive commit messages
7. **Submit a pull request**: Provide a detailed description of changes

### Code Style
- **JavaScript**: Use ES6+ features, consistent naming (camelCase for variables/functions)
- **HTML/CSS**: Semantic markup, Tailwind utility classes
- **Comments**: Add JSDoc comments for functions, inline comments for complex logic
- **Formatting**: Use consistent indentation (2 spaces), no trailing whitespace
- **Performance**: Optimize for mobile-first, minimize bundle size

### Commit Message Guidelines
- Use present tense: "Add feature" not "Added feature"
- Start with type: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`
- Keep first line under 50 characters
- Example: `feat: add dark mode toggle`

### Pull Request Guidelines
- **Title**: Clear and descriptive
- **Description**: Explain what and why, include screenshots for UI changes
- **Testing**: Describe how changes were tested
- **Breaking Changes**: Note any breaking changes

### Adding New Patterns
1. **Update data structure**: Modify `topicsData` in `public/modules/data.js`
2. **Unique IDs**: Ensure all problem IDs are unique across the application
3. **Problem format**:
   ```javascript
   {
     id: "unique-id",
     title: "Problem Title",
     difficulty: "Easy|Medium|Hard",
     url: "https://leetcode.com/problems/...",
     patterns: ["pattern1", "pattern2"]
   }
   ```
4. **Test thoroughly**: Verify the pattern appears in sidebar and filters work correctly
5. **Update documentation**: Add any relevant notes in this README

### Reporting Issues
- Use GitHub Issues with detailed descriptions
- Include browser/OS information
- Attach screenshots or console logs for bugs

## Troubleshooting

### Common Issues
- **Login Issues**: Check Google OAuth configuration and redirect URIs
- **Data Not Saving**: Verify JWT token validity and KV namespace setup
- **UI Problems**: Clear browser cache and check console for errors
- **Mobile Issues**: Ensure responsive design is working with browser dev tools

### Debug Mode
Enable verbose logging by setting `localStorage.debug = 'true'` in browser console.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

## Support

For questions, feedback, or support:
- Visit the official site: [algovyn.com/smartgrind](https://algovyn.com/smartgrind)
- Open an issue on this repository

Happy practicing! 🚀