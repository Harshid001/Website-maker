import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { generateWebsiteFiles } from './websiteGenerator.js';

export async function downloadWebsiteZip(siteData) {
  const zip = new JSZip();
  const files = generateWebsiteFiles(siteData);

  Object.entries(files).forEach(([fileName, content]) => {
    zip.file(fileName, content);
  });

  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, 'website-export.zip');
}
