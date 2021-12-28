import escapeFile from 'escape-filename';
import fs from 'fs';
import ytdl from 'ytdl-core';
import ytmux from 'ytdl-core-muxer';

interface YoutubeInfo {
  url: string;
  file: string;
  raw: ytdl.videoInfo;
}

export class YouTube {
  async getInfo(url: string): Promise<YoutubeInfo> {
    const info = await ytdl.getBasicInfo(url);
    return {
      url,
      file: escapeFile.escape(`${info.videoDetails.author.name} | ${info.videoDetails.title}`),
      raw: info,
    };
  }

  async mux(info: YoutubeInfo): Promise<string> {
    const filename = `out/${info.file}.mp4`;
    const readStream = ytmux(info.url);
    const writeStream = fs.createWriteStream(filename);
    const promise = new Promise<void>((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });
    readStream.pipe(writeStream);
    await promise;
    return filename;
  }
}
