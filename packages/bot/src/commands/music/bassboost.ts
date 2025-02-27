import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import { container } from '@sapphire/framework';
import type { Node, Player } from 'lavaclient';

@ApplyOptions<CommandOptions>({
  name: 'bassboost',
  description: 'Boost the bass of the playing track',
  preconditions: [
    'GuildOnly',
    'isCommandDisabled',
    'inVoiceChannel',
    'playerIsPlaying',
    'inPlayerVoiceChannel'
  ]
})
export class BassboostCommand extends Command {
  public override async chatInputRun(
    interaction: Command.ChatInputCommandInteraction
  ) {
    const { client } = container;

    const player = client.music.players.get(
      interaction.guild!.id
    ) as Player<Node>;

    player.filters.equalizer = (player.bassboost = !player.bassboost)
      ? [
          { band: 0, gain: 0.55 },
          { band: 1, gain: 0.45 },
          { band: 2, gain: 0.4 },
          { band: 3, gain: 0.3 },
          { band: 4, gain: 0.15 },
          { band: 5, gain: 0 },
          { band: 6, gain: 0 }
        ]
      : undefined;

    await player.setFilters();
    return await interaction.reply(
      `Bassboost ${player.bassboost ? 'ligado!' : 'desligado!'}`
    );
  }

  public override registerApplicationCommands(
    registry: Command.Registry
  ): void {
    registry.registerChatInputCommand({
      name: this.name,
      description: this.description
    });
  }
}
