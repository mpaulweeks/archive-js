import escapeFile from 'escape-filename';
import fs from 'fs';
import fetch from 'node-fetch';
import ytdl from 'ytdl-core';
import ytmux from 'ytdl-core-muxer';
import { Auth } from './util';

interface YoutubeInfo {
  url: string;
  file: string;
  raw: ytdl.videoInfo;
}

interface ChannelInfo {
  items: {
    id: string;
    contentDetails: {
      relatedPlaylists: {
        likes: string;
        uploads: string;
      }
    }
  }[];
}

interface UploadsInfo {
  nextPageToken: string;
  items: {
    id: string;
    contentDetails: {
      videoId: string;
    };
  }[];
}

export class YouTube {
  private auth: Auth;

  constructor() {
    const authFile = fs.readFileSync('auth.json');
    this.auth = JSON.parse(authFile.toString());
  }

  async getChannelVideos(channelName: string) {
    const channelApi = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelName}&key=${this.auth.ytapi}`;
    const channelInfo: ChannelInfo = await (fetch(channelApi).then(resp => resp.json()));
    const match = channelInfo.items[0];
    if (!match) { throw new Error('channel not found: ' + channelName); }
    const channelId = match.id;
    const uploadsId = match.contentDetails.relatedPlaylists.uploads;
    const uploadsApi = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=50&playlistId=${uploadsId}&key=${this.auth.ytapi}`;
    const uploadsInfo: UploadsInfo = await (fetch(uploadsApi).then(resp => resp.json()));
    const videoIds = uploadsInfo.items.map(i => i.contentDetails.videoId);
    console.log(channelId, videoIds);
  }

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
