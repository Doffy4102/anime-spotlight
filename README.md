# Anime Spotlight

A browser extension to display information about anime.

## Features

*   Fetches and displays anime data from the Jikan API.
*   Provides a spotlight view for quick information.
*   Includes an options page for customization.

## Installation

1.  Clone this repository.
2.  Open your browser's extension management page.
3.  Enable "Developer mode".
4.  Click "Load unpacked" and select the cloned repository directory.

## How to Use

Click the extension icon in your browser to open the spotlight view.

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature`).
6.  Open a pull request.

### Adding a New Website

To add support for a new website, you will need to:

1.  **Identify the website's API or a way to extract anime information from it.**
2.  **Create a new API handler in the `api/` directory.** This handler should implement the logic to fetch and parse data from the new website.
3.  **Update the service worker in `background/service-worker.js` to use the new API handler.** You may need to add logic to determine which API to use based on the user's settings or the website they are currently visiting.
4.  **Update the UI in the `ui/` directory to display the data from the new website.** This may involve creating new HTML elements or modifying existing ones.

## License

This project is licensed under the MIT License.
