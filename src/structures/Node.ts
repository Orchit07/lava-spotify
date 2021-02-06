import LavasfyClient from "../Client";
import { LavalinkTrackResponse, NodeOptions } from "../typings";
import Resolver from "./Resolver";

export default class Node {
    public resolver = new Resolver(this);

    public id!: string;
    public host!: string;
    public port!: number | string;
    public password!: string;
    public secure?: string;
    
    private readonly methods = {
        album: this.resolver.getAlbum.bind(this.resolver),
        playlist: this.resolver.getPlaylist.bind(this.resolver),
        track: this.resolver.getTrack.bind(this.resolver)
    };

    public constructor(public client: LavasfyClient, options: NodeOptions) {
        Object.defineProperties(this, {
            id: { value: options.name },
            host: { value: options.host },
            port: { value: options.port },
            password: { value: options.password },
            secure: { value: options.secure }
        });
    }

    public load(url: string): Promise<LavalinkTrackResponse | null> {
        const [, type, id] = this.client.spotifyPattern.exec(url) ?? [];
        return this.methods[type as keyof Node["methods"]](id);
    }
}
