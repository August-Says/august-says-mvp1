
// PDF parsing worker
importScripts('https://unpkg.com/pdf-parse@1.1.1/build/pdf-parse.js');

self.onmessage = async function(e) {
  try {
    const { pdfData } = e.data;
    
    // Use the pdf-parse library to extract text
    const data = await PDFParse(pdfData);
    
    // Send the extracted text back to the main thread
    self.postMessage({ content: data.text });
  } catch (error) {
    self.postMessage({ error: error.message });
  }
};
