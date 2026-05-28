import axios from 'axios';
import * as cheerio from 'cheerio';

export interface TorrentCandidate {
  magnetLink: string;
  seeders: number;
  leechers: number;
  size: string;
  quality: string;
}

export const scrapTorrentLinks = async (
  movieName: string,
  year: number,
): Promise<TorrentCandidate[]> => {
  const torrentQualities: string[] = [
    '144p',
    '240p',
    '360p',
    '480p',
    '576p',
    '720p',
    '900p',
    '1080p',
    '1440p',
    '1600p',
    '2160p',
    '4320p',
  ];

  try {
    const res = await axios.get(
      `https://thehiddenbay.com/search/${movieName.replace('*', '')} ${year}`,
    );

    const $ = cheerio.load(res.data);

    const torrents: TorrentCandidate[] = $('table#searchResult tbody tr')
      .map(
        (_: number, element: any): TorrentCandidate => ({
          magnetLink: $(element).find('a[href^="magnet:"]').attr('href') || '',
          seeders: parseInt($(element).find('td:nth-child(3)').text()),
          leechers: parseInt($(element).find('td:nth-child(4)').text()),
          size: $(element).find('td:nth-child(2) .detDesc').text(),
          quality:
            torrentQualities.find((quality) =>
              $(element).find('.detName a').text().includes(quality),
            ) || '',
        }),
      )
      .get()
      .filter(
        (torrent: TorrentCandidate, i: number, arr: TorrentCandidate[]) =>
          Boolean(torrent.quality) &&
          arr.findIndex((t: TorrentCandidate) => t.quality === torrent.quality) === i,
      )
      .map((torrent: TorrentCandidate) => ({
        ...torrent,
        size: torrent.size
          .match(/Size.+\,/gi)?.[0]
          ?.replace('Size ', '')
          .replace(',', '') || 'Unknown',
      }));

    return torrents;
  } catch (error) {
    console.error(`Error scraping torrent links: ${error}`);
    return [];
  }
};
