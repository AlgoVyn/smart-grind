# Smart Grind - Smarter Problem Solving

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
![Chrome Extension](https://img.shields.io/badge/Platform-Chrome-blue)

**Smart Grind** is a Chrome extension designed to help you grind LeetCode and other coding problems optimally. It enhances your problem-solving experience by injecting smart features directly into supported platforms like LeetCode.

Visit the official website: [smart-grind.algovyn.com](https://smart-grind.algovyn.com)

## Features

### Core Functionality
- **Problem Ratings Display**: Replaces LeetCode's default "Easy/Medium/Hard" labels with numerical difficulty ratings on problem pages and problem lists
- **User Rating Estimation**: Calculates and displays your estimated LeetCode rating based on solved problems
- **Random Problem Selection**: Browse and select random problems within specified rating ranges and tags for targeted practice

### Advanced Features
- **Tag-Based Filtering**: Filter random problems by LeetCode tags (e.g., Array, Dynamic Programming, etc.)
- **Progress Tracking**: Automatically tracks solved problems by monitoring submission status
- **Persistent Settings**: Remembers your preferred rating ranges and tag filters between sessions
- **Cross-Page Support**: Works on individual problem pages, problem lists, and contest pages

### Technical Details
- **Data Sources**: Uses community-sourced problem ratings and official LeetCode tags
- **Storage**: Utilizes Chrome's sync and local storage for settings and cached data
- **Performance**: Lightweight implementation with minimal impact on page load times

For detailed information about data formats and sources, see [DATA_FORMAT.md](DATA_FORMAT.md).

## Installation

### From Source (Recommended for Developers)

1. Clone the repository:
   ```bash
   git clone https://github.com/AlgoVyn/smart-grind.git
   ```
2. Open Google Chrome and go to chrome://extensions/
3. Enable Developer mode (top-right toggle)
4. Click Load unpacked and select the cloned repository folder

### Future Availability
The extension may become available on the Chrome Web Store — check the official website for updates.

## Usage

### Getting Started
1. **Install the Extension**: Load the unpacked extension in Chrome developer mode
2. **Navigate to LeetCode**: Go to [leetcode.com](https://leetcode.com)
3. **Automatic Activation**: The extension activates automatically on problem pages
4. **Access Controls**: Click the SmartGrind icon in your toolbar to open the popup

### Using the Popup Interface
- **Current Rating**: View your estimated rating based on solved problems
- **Rating Range**: Set minimum and maximum rating bounds for random problem selection
- **Tag Filter**: Select specific problem tags to focus your practice
- **Get Random Problem**: Click to open a random problem matching your criteria

### Understanding Ratings
- Ratings range from approximately 0 to 3000
- Higher ratings indicate greater difficulty
- Use rating ranges to practice at appropriate difficulty levels

### Tips for Effective Use
- **Pin the Extension**: Pin SmartGrind to your toolbar for quick access
- **Grant Permissions**: Ensure activeTab permission is granted for full functionality
- **Regular Practice**: Use random problem selection to maintain consistent practice across difficulty levels
- **Track Progress**: Monitor your rating improvement over time

### Troubleshooting
- **Ratings Not Showing**: Ensure you're on a LeetCode problem page
- **Popup Not Working**: Check that the extension is enabled and permissions are granted
- **Data Not Loading**: Clear browser cache and reload the extension

## Architecture

### Extension Components
- **Manifest V3**: Modern Chrome extension structure with service worker
- **Content Script**: Injects rating display functionality into LeetCode pages
- **Popup Interface**: User interface for settings and random problem selection
- **Background Service Worker**: Handles message passing and background tasks
- **Data Files**: Static ratings and tags stored as web-accessible resources

### Data Flow
1. **Page Load**: Content script loads ratings data and modifies problem displays
2. **User Interaction**: Popup communicates with content script for problem selection
3. **Progress Tracking**: Monitors submissions to update solved problem lists
4. **Settings Persistence**: Syncs user preferences across browser sessions

### Permissions
- **activeTab**: Required for interacting with LeetCode pages
- **storage**: Used for caching data and storing user preferences
- **tabs**: Enables opening new tabs for random problems

## Contributing

Contributions are welcome!

- **Bug Reports**: Open issues for bugs or unexpected behavior
- **Feature Requests**: Suggest new functionality or improvements
- **Code Contributions**: Submit pull requests with enhancements

### Development Setup
1. Clone the repository
2. Load as unpacked extension in Chrome developer mode
3. Make changes to source files
4. Test functionality on LeetCode
5. Submit pull request with description of changes

Please follow the standard GitHub flow: fork → branch → commit → pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Support

For questions, feedback, or support:

- Visit the official site: [smart-grind.algovyn.com](https://smart-grind.algovyn.com)
- Open an issue on this repository

Happy grinding! 🚀
