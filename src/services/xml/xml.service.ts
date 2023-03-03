import {create} from 'xmlbuilder2';
import stream from 'stream';
import {Storage} from '@google-cloud/storage';
import crypto from 'crypto';
import slugify from 'slugify';
import {IUploadResponse} from '../upload/upload.service';

export interface IXMLObject {
  key: string;
}

const storage = new Storage();
const bucket = storage.bucket(<string>process.env.GOOGLE_STORAGE_BUCKET_NAME);

const generateXML = async (body: IXMLObject): Promise<IUploadResponse> => {
  const SERVICE_FOLDER = 'express-typescript-api-rest';
  const DIRECTORY = 'xml';
  const UUID = crypto.randomBytes(4).toString('hex');

  const {key} = body;

  const doc = create(
    {version: '1.0', encoding: 'UTF-8'},
    {
      // '?': 'xml-stylesheet type="text/xsl" href="https://storage.googleapis.com/your-bucket/assets/xml/stylesheet.xsl"',
      'p:MainXmlSubject': {
        '@': {
          'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#',
          'xmlns:p':
            'http://ivaservizi.agenziaentrate.gov.it/docs/xsd/fatture/v1.2',
          'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
          versione: 'FPR12',
        },
        Header: {
          SubHeader: {
            Key: {
              Value: 'value',
            },
          },
        },
        Body: {
          SubBody: {
            Key: {
              Value: 'value',
            },
          },
        },
      },
    }
  ).doc();

  const xmlBuffer = doc.end({headless: true, prettyPrint: true});

  const dataStreama = new stream.PassThrough();

  dataStreama.push(xmlBuffer);
  dataStreama.push(null);

  const fileName = `IT09568521000_${UUID}_${key}.xml`;

  return new Promise((resolve, reject) => {
    const blob = bucket.file(
      `${SERVICE_FOLDER}/${DIRECTORY}/${slugify(fileName)}.xml`
    );

    const blobStream = dataStreama.pipe(
      blob.createWriteStream({
        resumable: false,
        public: true,
        predefinedAcl: 'publicRead',
        metadata: {
          cacheControl: 'no-store',
          contentType: 'application/xml',
        },
      })
    );

    blobStream
      .on('finish', () => {
        const blobName = blob.name;
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        resolve({publicUrl, blobName});
      })
      .on('error', error => {
        reject(error);
      });
  });
};

export {generateXML};
