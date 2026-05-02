import { PDFDocument, PDFString } from 'pdf-lib';

/**
 * Converts an uploaded image (JPG or PNG) into a PDF file with the exact same dimensions.
 * It also overlays an invisible, clickable link over the entire image.
 * 
 * @param {File} file - The image file uploaded by the user.
 * @param {string} url - The target URL that should open when the image is clicked.
 * @returns {Blob} A new PDF Blob containing the image and the clickable link.
 */
export const convertImageToPdfWithLink = async (file, url) => {
  try {
    // Convert the uploaded file into an ArrayBuffer so it can be processed
    const arrayBuffer = await file.arrayBuffer();
    
    // Create a new, blank PDF Document
    const pdfDoc = await PDFDocument.create();
    const { context } = pdfDoc;
    
    let image;
    // Check the file type and embed the image into the PDF document accordingly
    if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
      image = await pdfDoc.embedJpg(arrayBuffer);
    } else if (file.type === 'image/png') {
      image = await pdfDoc.embedPng(arrayBuffer);
    } else {
      throw new Error('Unsupported image format');
    }
    
    // Add a new page to the PDF with the exact width and height of the embedded image
    const page = pdfDoc.addPage([image.width, image.height]);
    
    // Draw the image onto the page, starting from the bottom-left corner (0,0)
    // and filling the entire width and height of the page
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
    
    // Create the Link Annotation Dictionary.
    // This tells the PDF viewer that there is a clickable area on the page.
    const linkAnnotation = context.register(
      PDFDictionary.from({
        Type: PDFName.from('Annot'),
        Subtype: PDFName.from('Link'),
        // Rect array defines the clickable area: [x_min, y_min, x_max, y_max]
        // We set it to cover the entire page (the whole image)
        Rect: PDFArray.fromArray([
          PDFNumber.fromNumber(0),
          PDFNumber.fromNumber(0),
          PDFNumber.fromNumber(image.width),
          PDFNumber.fromNumber(image.height)
        ], context),
        // Border thickness is set to 0 to make the link completely invisible
        Border: PDFArray.fromArray([
          PDFNumber.fromNumber(0),
          PDFNumber.fromNumber(0),
          PDFNumber.fromNumber(0)
        ], context),
        // The Action dictionary specifies what happens when the link is clicked
        // S: 'URI' means it should open a web link
        A: PDFDictionary.from({
          Type: PDFName.from('Action'),
          S: PDFName.from('URI'),
          URI: PDFString.of(url)
        }, context)
      }, context)
    );
    
    // Get existing annotations on the page, or create a new annotations array if none exist
    let annots = page.node.Annots();
    if (!annots) {
      // Register a new array containing our link and attach it to the page
      page.node.set(pdfDoc.context.obj('Annots'), pdfDoc.context.obj([linkAnnotation]));
    } else {
      // If there are existing annotations, just push our new link to the array
      annots.push(linkAnnotation);
    }
    
    // Save the PDF document as raw bytes
    const pdfBytes = await pdfDoc.save();
    
    // Return the bytes as a Blob, representing a downloadable PDF file
    return new Blob([pdfBytes], { type: 'application/pdf' });
  } catch (error) {
    console.error("Error converting image to PDF:", error);
    throw error;
  }
};

/**
 * Modifies an uploaded PDF file by adding an invisible, clickable link over all of its pages.
 * 
 * @param {File} file - The original PDF file uploaded by the user.
 * @param {string} url - The target URL that should open when a page is clicked.
 * @returns {Blob} A new PDF Blob containing the original pages with the added clickable links.
 */
export const embedLinkInPdf = async (file, url) => {
  try {
    // Read the original PDF file as an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the existing PDF document
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const { context } = pdfDoc;
    
    // Get all the pages from the loaded PDF
    const pages = pdfDoc.getPages();
    
    // Loop through every single page in the PDF document
    pages.forEach((page) => {
      // Get the dimensions of the current page
      const { width, height } = page.getSize();
      
      // Create a clickable link annotation covering the entire dimensions of this specific page
      const linkAnnotation = context.register(
        PDFDictionary.from({
          Type: PDFName.from('Annot'),
          Subtype: PDFName.from('Link'),
          Rect: PDFArray.fromArray([
            PDFNumber.fromNumber(0),
            PDFNumber.fromNumber(0),
            PDFNumber.fromNumber(width),
            PDFNumber.fromNumber(height)
          ], context),
          Border: PDFArray.fromArray([
            PDFNumber.fromNumber(0),
            PDFNumber.fromNumber(0),
            PDFNumber.fromNumber(0)
          ], context),
          A: PDFDictionary.from({
            Type: PDFName.from('Action'),
            S: PDFName.from('URI'),
            URI: PDFString.of(url)
          }, context)
        }, context)
      );
      
      // Add the link annotation to the current page
      let annots = page.node.Annots();
      if (!annots) {
        page.node.set(pdfDoc.context.obj('Annots'), pdfDoc.context.obj([linkAnnotation]));
      } else {
        annots.push(linkAnnotation);
      }
    });
    
    // Save the modified PDF document as raw bytes
    const pdfBytes = await pdfDoc.save();
    
    // Return the bytes as a Blob for downloading
    return new Blob([pdfBytes], { type: 'application/pdf' });
  } catch (error) {
    console.error("Error processing PDF:", error);
    throw error;
  }
};
