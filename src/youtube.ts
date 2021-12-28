import fs from 'fs';
import ytdl from 'ytdl-core';
import ytmux from 'ytdl-core-muxer';

type YoutubeInfo = ytdl.videoInfo;

export class YouTube {
  async getInfo(url: string): Promise<YoutubeInfo> {
    const info = await ytdl.getBasicInfo(url);
    return info;
  }

  async mux(url: string): Promise<string> {
    const info = await this.getInfo(url);
    const filename = `out/${info.videoDetails.author.name} | ${info.videoDetails.title}.mp4`;
    const readStream = ytmux(url);
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
