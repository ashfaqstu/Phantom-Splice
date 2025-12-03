# The Phantom Crop - Chrome Extension

A spooky, Victorian-themed Chrome extension for removing backgrounds from images.

## Development

```bash
npm install
npm run build
```

## Load Extension in Chrome

1. Run `npm run build` to create the `dist` folder
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `dist` folder from this project

## Usage

1. Click the extension icon in Chrome toolbar
2. Drop an image or click to select one
3. The extension will process and remove the background
4. Download the result

## Backend

For real background removal, run a Flask server at `http://localhost:5000/sever` that accepts POST requests with a `file` field and returns the processed image. Toggle between Mock/Live mode in the extension.
