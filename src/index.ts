import prompt from 'async-prompt';
import { asyncForEach, asyncMap } from './util';
import { YouTube } from './youtube';

// https://www.youtube.com/watch?v=LO1mTELoj6o

async function main() {
  const yt = new YouTube();

  // LindsayEllisVids
  // UCG1h-Wqjtwz7uUANw6gazRw

  await yt.getChannelVideos('UCG1h-Wqjtwz7uUANw6gazRw');

  const urls = [
    'https://www.youtube.com/watch?v=uTRUQ-RKfUs',
    'https://www.youtube.com/watch?v=ElPJr_tKkO4',
    'https://www.youtube.com/watch?v=Qi7t_g5QObs',
  ];
  const infos = await asyncMap(urls, u => yt.getInfo(u));

  infos.forEach(info => console.log(info.file));
  const confirm = await prompt(`Confirm? (y/n)\n> `);
  if (confirm.toLowerCase() !== 'y') { return; }

  await asyncForEach(infos, async i => {
    console.log(i.file);
    await yt.mux(i);
  })
  console.log('done!');
}

main();
