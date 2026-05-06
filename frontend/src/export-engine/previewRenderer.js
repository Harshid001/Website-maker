import { generateWebsiteFiles } from './websiteGenerator.js';

export function generatePreviewHTML(siteData) {
  const files = generateWebsiteFiles(siteData);

  return files['index.html']
    .replace(
      '<link rel="stylesheet" href="./style.css" />',
      `<style>${files['style.css']}</style>`,
    )
    .replace(
      '<script src="./script.js"></script>',
      `<script>${files['script.js']}</script>`,
    );
}
