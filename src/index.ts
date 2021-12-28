import prompt from 'async-prompt';
import { YouTube } from './youtube';

// https://www.youtube.com/watch?v=LO1mTELoj6o

async function main() {
  const yt = new YouTube();
  const url = await prompt(`URL?\n`);
  const info = await yt.getInfo(url);
  console.log(info);
  const filename = await yt.download(url);
  console.log('done!', filename);
}

main();
