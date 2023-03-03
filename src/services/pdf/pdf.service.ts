import axios from 'axios';
import PdfPrinter from 'pdfmake';
import {Storage} from '@google-cloud/storage';
import slugify from 'slugify';
import {format} from 'util';

import {TDocumentDefinitions} from 'pdfmake/interfaces';
import {IUploadResponse} from '../upload/upload.service';

/**
 * Define the storage bucket
 */
const storage = new Storage();
const bucket = storage.bucket(<string>process.env.GOOGLE_STORAGE_BUCKET_NAME);

/**
 * Define the interface for the pdf object
 */
export interface IPDFObject {
  key: string;
}

const generatePDF = async (
  body: IPDFObject,
  directory: string
): Promise<IUploadResponse> => {
  /**
   * Desctructure the body
   */
  const {key} = body;

  /**
   * Define some constants
   */
  const TODAY_DATE = new Intl.DateTimeFormat('it-IT').format(new Date());
  const COMPANY_NAME = 'Company Name'; // replace with your own company name
  const COMPANY_LOGO = `https://storage.googleapis.com/${process.env.GOOGLE_STORAGE_BUCKET_NAME}/company-logo.png`;
  const SERVICE_FOLDER = 'express-typescript-api-rest'; // replace with your own service folder name

  /**
   * Get the logo image from the url
   */
  const LOGO_IMAGE_URL = await axios
    .get(COMPANY_LOGO, {responseType: 'arraybuffer'})
    .then(res => res.data);

  /**
   * return the array buffer for pdfmake
   */
  const LOGO_IMAGE_BASE_64 = `data:image/png;base64,${Buffer.from(
    LOGO_IMAGE_URL
  ).toString('base64')}`;

  /**
   * Define the fonts
   */
  const fonts = {
    Courier: {
      normal: 'Courier',
      bold: 'Courier-Bold',
      italics: 'Courier-Oblique',
      bolditalics: 'Courier-BoldOblique',
    },
    Helvetica: {
      normal: 'Helvetica',
      bold: 'Helvetica-Bold',
      italics: 'Helvetica-Oblique',
      bolditalics: 'Helvetica-BoldOblique',
    },
    Times: {
      normal: 'Times-Roman',
      bold: 'Times-Bold',
      italics: 'Times-Italic',
      bolditalics: 'Times-BoldItalic',
    },
    Symbol: {
      normal: 'Symbol',
    },
    ZapfDingbats: {
      normal: 'ZapfDingbats',
    },
  };

  // instantiate PDFMake
  const printer = new PdfPrinter(fonts);

  // set a general font size
  const fontSize = 12;

  /**
   * Define the document definition
   */
  const docDefinition: TDocumentDefinitions = {
    info: {
      title: 'PDF Document',
      author: 'Author Name',
      subject: 'Subject',
      keywords: 'Keywords',
    },
    header: (currentPage, pageCount, pageSize) => {
      return [
        {
          text: `Header: ${new Intl.DateTimeFormat('it-IT').format(
            new Date()
          )} - ${key}`,
          alignment: currentPage % 2 ? 'right' : 'right',
          fontSize: fontSize - 4,
          lineHeight: 1.2,
          margin: [20, 20, 30, 20],
        },
        {
          canvas: [
            {type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40},
          ],
        },
      ];
    },
    footer: (currentPage, pageCount, pageSize) => {
      // you can apply any logic and return any valid pdfmake element
      return [
        {
          text: 'This is a footer. You can apply any logic and return any valid pdfmake element',
          alignment: 'center',
          fontSize: fontSize - 6,
          lineHeight: 1.2,
          margin: [10, 10, 10, 10],
        },
        {
          canvas: [
            {type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40},
          ],
        },
      ];
    },
    content: [
      {
        image: LOGO_IMAGE_BASE_64,
        width: 150,
      },
      {
        text: `Some text here ${TODAY_DATE}`,
        fontSize: fontSize - 2,
        lineHeight: 1.3,
        margin: [10, 30, 10, 10],
        alignment: 'right',
        bold: true,
      },
    ],
    defaultStyle: {
      font: 'Helvetica',
    },
  };

  // This produce a stream already, so we don't need to create a new one
  const pdfBuffer = printer.createPdfKitDocument(docDefinition);

  pdfBuffer.end();

  /**
   * Define the file name
   */
  const fileName = `FileName_${COMPANY_NAME.replace(/ /g, '_')}.pdf`;

  /**
   * FINALLY, RETURN THE PROMISE PASSING THE STREAM AND THE FILENAME
   */
  return new Promise((resolve, reject) => {
    const blob = bucket.file(
      `${SERVICE_FOLDER}/${directory}/${slugify(fileName)}`
    );

    const blobStream = pdfBuffer.pipe(
      blob.createWriteStream({
        resumable: false,
        public: true,
        metadata: {
          contentType: 'application/pdf',
          cacheControl: 'no-store',
        },
      })
    );

    blobStream
      .on('finish', () => {
        const blobName = blob.name;
        const publicUrl = format(
          `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        );

        resolve({publicUrl, blobName});
      })
      .on('error', error => {
        reject(error || 'unable to upload file');
      });
  });
};

export {generatePDF};
