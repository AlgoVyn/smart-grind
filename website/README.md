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
   npm run dev
   ```

5. **Deploy to Cloudflare**:
   ```bash
   npm run deploy
   ```

### Environment Configuration

Create a `.env` file or configure in Cloudflare:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret
```

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
- **Quick Prompts**: Click Gemini or Grok buttons to copy solution prompts to clipboard
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

#### GET /api/auth (OAuth callback)
Handles OAuth callback, generates JWT, and redirects to app.

### User Data Endpoints

#### GET /api/user
Retrieves user progress data.
**Headers**: `Authorization: Bearer <jwt_token>`
**Response**: `{ problems: {...}, deletedIds: [...] }`

#### POST /api/user
Updates user progress data.
**Headers**: `Authorization: Bearer <jwt_token>`
**Body**: `{ data: { problems: {...}, deletedIds: [...] } }`

## Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make changes and test locally
4. Submit a pull request

### Code Style
- Use ES6+ features
- Follow consistent naming conventions
- Add comments for complex logic
- Test functionality across devices

### Adding New Patterns
1. Update `topicsData` in `app.js` with new pattern structure
2. Ensure problem IDs are unique
3. Test the new pattern appears correctly in the UI

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