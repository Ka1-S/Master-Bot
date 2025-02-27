import { ApplyOptions } from '@sapphire/decorators';
import { container, Listener, type ListenerOptions } from '@sapphire/framework';
import type { TextChannel } from 'discord.js';
import { embedButtons } from '../lib/utils/music/ButtonHandler';
import { NowPlayingEmbed } from '../lib/utils/music/NowPlayingEmbed';
import type { Song } from '../lib/utils/queue/Song';
import { manageStageChannel } from '../lib/utils/music/channelHandler';

@ApplyOptions<ListenerOptions>({
  name: 'musicSongPlayMessage'
})
export class MusicSongPlayMessageListener extends Listener {
  public override async run(channel: TextChannel, track: Song): Promise<void> {
    const { client } = container;
    const queue = client.music.queues.get(channel.guild.id);
    const tracks = await queue.tracks();
    const NowPlaying = new NowPlayingEmbed(
      track,
      queue.player.accuratePosition,
      track.length ?? 0,
      queue.player.volume,
      tracks,
      tracks.at(-1),
      queue.paused
    );
    await manageStageChannel(
      channel.guild.members.me?.voice.channel!,
      channel.guild.members.me!,
      queue
    );
    await embedButtons(await NowPlaying.NowPlayingEmbed(), queue, track);
  }
}
