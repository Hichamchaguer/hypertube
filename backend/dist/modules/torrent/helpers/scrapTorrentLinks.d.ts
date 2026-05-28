export interface TorrentCandidate {
    magnetLink: string;
    seeders: number;
    leechers: number;
    size: string;
    quality: string;
}
export declare const scrapTorrentLinks: (movieName: string, year: number) => Promise<TorrentCandidate[]>;
//# sourceMappingURL=scrapTorrentLinks.d.ts.map