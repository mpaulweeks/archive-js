import fs from 'fs';
import ytdl from 'ytdl-core';
import ytmux from 'ytdl-core-muxer';

type YoutubeInfo = ytdl.videoInfo;

export class YouTube {
  async getInfo(url: string): Promise<YoutubeInfo> {
    // return new Promise((resolve, reject) => {
    //   youtubedl.getInfo(url, options, function(err, info) {
    //     if (err) throw err

    //     console.log('id:', info.id)
    //     console.log('title:', info.title)
    //     console.log('url:', info.url)
    //     console.log('thumbnail:', info.thumbnail)
    //     console.log('description:', info.description)
    //     console.log('filename:', info._filename)
    //     console.log('format id:', info.format_id)
    //   })
    // })
    const info = await ytdl.getBasicInfo(url);
    return info;
  }

  async download(url: string): Promise<string> {
    const info = await this.getInfo(url);
    const filename = `${info.videoDetails.author.name} | ${info.videoDetails.title}.mp4`;
    const readStream = ytdl(url);
    const writeStream = fs.createWriteStream(filename);
    const promise = new Promise<void>((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });
    readStream.pipe(writeStream);
    await promise;
    return filename;
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
