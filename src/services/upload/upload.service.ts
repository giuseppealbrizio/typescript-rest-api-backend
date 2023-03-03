import {Storage} from '@google-cloud/storage';
import fs from 'fs';
import slugify from 'slugify';
import stream from 'stream';
import {format} from 'util';
import crypto from 'crypto';
import {CustomError} from '../../errors';
import Logger from '../../lib/logger';

export interface IUploadResponse {
  publicUrl: string;
  blobName: string;
}

const storage = new Storage();
const bucket = storage.bucket(<string>process.env.GOOGLE_STORAGE_BUCKET_NAME);
/**
 * This function create and upload a file to the local file system
 * 0. Always pass a buffer like argument otherwise will fail
 * 1. Takes a buffer argument
 * @param buffer
 * @param filename
 */
const streamBufferToLFS = async (
  buffer: Buffer,
  filename: string
): Promise<void> => {
  const file = `${filename}-${Date.now()}.xml`;
  fs.writeFile(file, buffer, err => {
    if (err) {
      console.log(err);
    } else {
      Logger.debug('The file was saved!');
    }
  });
};

/**
 * This function upload a file directly to gcs without passing buffer.
 * 0. To make this work use multer memory storage middleware
 * 1. Only instance of a file with buffer will succeed
 * 2. Return a public url
 * @param file
 * @returns
 */
const uploadFileToGCS = async (
  file: Express.Multer.File
): Promise<IUploadResponse> => {
  const RANDOM_ID = Math.random().toString(36).substring(2, 15); // replace with your own id
  const SERVICE_FOLDER = 'express-typescript-api-rest'; // replace with your own service folder name
  const DIRECTORY = `uploads/${RANDOM_ID}`; // replace with your own directory name

  return new Promise((resolve, reject) => {
    const {originalname, buffer, mimetype} = file;

    const blob = bucket.file(
      `${SERVICE_FOLDER}/${DIRECTORY}/${slugify(originalname)}`
    );

    const blobStream = blob.createWriteStream({
      resumable: false,
      public: true,
      predefinedAcl: 'publicRead',
      metadata: {
        contentType: mimetype,
        cacheControl: 'no-store',
      },
    });

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
      })
      .end(buffer);
  });
};

/**
 * This function take a pure buffer and convert to stream
 * 0. Always pass a buffer like argument otherwise will fail
 * 1. Takes a buffer argument
 * 2. Create a stream to store in memory
 * 3. Pipe the stream to Google Cloud Storage
 * 4. As soon as the file is recreated returns a public url
 * @return {Promise<void>}
 * @param buffer
 */
const streamBufferToGCS = async (buffer: Buffer): Promise<IUploadResponse> => {
  const RANDOM_ID = Math.random().toString(36).substring(2, 15); // replace with your own id
  const SERVICE_FOLDER = 'express-typescript-api-rest'; // replace with your own service folder name
  const DIRECTORY = `uploads/${RANDOM_ID}`; // replace with your own directory name
  const FILE_NAME = 'test.xml'; // replace with your own file name

  const dataStream = new stream.PassThrough();

  dataStream.push(buffer);
  dataStream.push(null);

  return new Promise((resolve, reject) => {
    const blob = bucket.file(`${SERVICE_FOLDER}/${DIRECTORY}/${FILE_NAME}`);

    const blobStream = dataStream.pipe(
      blob.createWriteStream({
        resumable: false,
        public: true,
        predefinedAcl: 'publicRead',
        metadata: {
          cacheControl: 'no-store',
        },
      })
    );

    blobStream
      .on('finish', () => {
        const publicUrl = format(
          `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        );
        resolve({publicUrl, blobName: blob.name});
      })
      .on('error', error => {
        reject(error);
      });
  });
};

/**
 * This function take an object that also contain a buffer
 * 0. Always pass an object that contains buffer otherwise will fail
 * 1. Takes also a directory like argument
 * 2. Create a stream to store in memory
 * 3. Pipe the stream to Google Cloud Storage
 * 4. As soon as the file is recreated returns a public url
 * @return {Promise<void>}
 * @param file
 * @param {string} directory
 */
const streamFileToGCS = async (
  file: Express.Multer.File,
  directory: string
): Promise<IUploadResponse> => {
  const SERVICE_FOLDER = 'express-typescript-api-rest'; // replace with your own service folder name

  // destructuring data file object
  const {originalname, buffer, mimetype} = file;

  // generate a  random uuid to avoid duplicate file name
  const uuid = crypto.randomBytes(4).toString('hex');

  // generate a file name
  const fileName = `${uuid} - ${originalname.replace(/ /g, '_')}`;

  // Instantiate a stream to read the file buffer
  const dataStream = new stream.PassThrough();

  dataStream.push(buffer);
  dataStream.push(null);

  return new Promise((resolve, reject) => {
    const blob = bucket.file(
      `${SERVICE_FOLDER}/${directory}/${slugify(fileName || uuid)}`
    );

    const blobStream = dataStream.pipe(
      blob.createWriteStream({
        resumable: false,
        public: true,
        predefinedAcl: 'publicRead',
        metadata: {
          contentType: mimetype,
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
        reject(error);
      });
  });
};

/**
 *
 * @param blobName
 * @returns
 */
const deleteFileFromGCS = async (blobName: string): Promise<void> => {
  try {
    await bucket.file(blobName).delete();
  } catch (e) {
    Logger.error(e);
    // console.log(e.toString());
    if (e instanceof CustomError) {
      throw new CustomError(
        404,
        `Failed to delete file ${blobName}: ${e.message}`
      );
    } else {
      throw new Error(`Failed to delete file ${blobName}`);
    }
  }
};

export {
  streamBufferToLFS,
  uploadFileToGCS,
  streamBufferToGCS,
  streamFileToGCS,
  deleteFileFromGCS,
};
