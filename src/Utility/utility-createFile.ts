/* eslint-disable prefer-const */
import { Bucket } from '@google-cloud/storage';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import * as path from 'path';
import { restrictions } from 'src/common/constants/constants';
import * as os from 'os';

export class File {
  public static async submitFile(
    file: Express.Multer.File,
    bucket: Bucket,
  ): Promise<string> {
    return await new Promise((resolve, reject) => {
      const newFileName = `${
        file.originalname
      }_${Date.now()}_${new Date().getMilliseconds()}`;
      const fileUpload = bucket.file(newFileName);
      const blobStream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });
      let fileAddress = '';
      blobStream
        .on('finish', async () => {
          fileAddress = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
          resolve(fileAddress);
        })
        .on('error', (error) => {
          console.log(error);
          reject(error);
        });
      blobStream.end(file.buffer);
    });
  }

  public static uploadFile = async (
    files: Array<Express.Multer.File>,
    storage: Bucket,
  ): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of files) {
      let mediaUrl = await this.submitFile(file, storage);
      urls.push(mediaUrl);
    }
    return urls;
  };
  //#region  OTHER METHOD TO UPLOAD FILES
  public static submitFileAsync = async (
    file: Express.Multer.File,
    storage: Bucket,
  ): Promise<string> => {
    const uploadResponse = await storage.upload(file.originalname, {
      // // Support for HTTP requests made with `Accept-Encoding: gzip`
      // gzip: true,
      // By setting the option `destination`, you can change the name of the
      // object you are uploading to a bucket.
      destination: `/uploads/${file.filename}`,
      metadata: {
        // Enable long-lived HTTP caching headers
        // Use only if the contents of the file will never change
        // (If the contents will change, use cacheControl: 'no-cache')
        cacheControl: 'public, max-age=31536000',
      },
    });
    return uploadResponse[0].baseUrl;
  };
  //#endregion
  public static async removeFile(path: string, bucket: Bucket): Promise<void> {
    if (typeof path === undefined || typeof path === null || path === '') {
      console.error(
        'Error while sanitize photo, user uid or photo uid are missing',
      );
      return;
    }
    console.log(`Deleting photo: ${path}`);
    const urlArray = path.split('/');
    const file = bucket.file(urlArray.slice(-1).toString());
    await file
      .delete()
      .then(() => console.log(`Successfully deleted photo`))
      .catch((err) => console.error(`Failed to remove photo, error: ${err}`));
  }

  public static async validateImageContent(
    file: any,
    fileRoot: string,
    bucket: Bucket,
  ) {
    try {
      const visionClient = new ImageAnnotatorClient();
      const tmpDirectory = path.join(os.tmpdir(), file.originalname);
      const normalized = fileRoot.split('/').slice(-1).toString();
      const response = bucket.file(normalized);
      await response.download({
        destination: tmpDirectory,
      });
    } catch (e) {
      console.error(`Error al escanear la imagen: ${e}`);
      throw new Error(e);
    }
  }
  public static resultValidate(result: any) {
    return (
      result !== restrictions.POSSIBLE &&
      result !== restrictions.LIKELY &&
      result !== restrictions.VERY_LIKELY
    );
  }
}
