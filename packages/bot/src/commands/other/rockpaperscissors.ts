import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import { Colors, EmbedBuilder } from 'discord.js';

@ApplyOptions<CommandOptions>({
  name: 'rockpaperscissors',
  description: 'Jogue pedra, papel e tesoura comigo!',
  preconditions: ['isCommandDisabled']
})
export class RockPaperScissorsCommand extends Command {
  public override async chatInputRun(
    interaction: Command.ChatInputCommandInteraction
  ) {
    const move = interaction.options.getString('move', true) as
      | 'pedra'
      | 'papel'
      | 'tesoura';
    const resultMessage = this.rpsLogic(move);

<<<<<<< HEAD
    const embed = new MessageEmbed()
      .setColor('RANDOM')
      .setTitle('Pedra, Papel, Tesoura')
      .setDescription(`**${resultMessage[0]}**, Eu formei ${resultMessage[1]}`);
=======
    const embed = new EmbedBuilder()
      .setColor(Colors.White)
      .setTitle('Rock, Paper, Scissors')
      .setDescription(`**${resultMessage[0]}**, I formed ${resultMessage[1]}`);
>>>>>>> upgrade-to-v14

    return await interaction.reply({ embeds: [embed] });
  }

  public override registerApplicationCommands(
    registry: Command.Registry
  ): void {
    registry.registerChatInputCommand(
<<<<<<< HEAD
      {
        name: this.name,
        description: this.description,
        options: [
          {
            name: 'move',
            type: 'STRING',
            required: true,
            description: 'Qual é o seu movimento?',
            choices: [
              { name: 'Pedra', value: 'pedra' },
              { name: 'Papel', value: 'papel' },
              { name: 'Tesoura', value: 'tesoura' }
            ]
          }
        ]
      },
=======
      builder =>
        builder
          .setName(this.name)
          .setDescription(this.description)
          .addStringOption(option =>
            option
              .setName('move')
              .setDescription('What is your move?')
              .setRequired(true)
              .addChoices(
                { name: 'Rock', value: 'rock' },
                { name: 'Paper', value: 'paper' },
                { name: 'Scissors', value: 'scissors' }
              )
          ),
>>>>>>> upgrade-to-v14
      {
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite
      }
    );
  }

  private rpsLogic(player_move: string) {
    const bot_move = ['pedra', 'papel', 'tesoura'][
      Math.floor(Math.random() * 3)
    ];

    if (player_move === 'pedra') {
      if (bot_move === 'pedra') {
        return ['Empate!', 'Pedra'];
      }
      if (bot_move === 'papel') {
        return ['Eu Ganhei!', 'Papel'];
      }
      return ['Você Ganhou!', 'Tesoura'];
    } else if (player_move === 'papel') {
      if (bot_move === 'pedra') {
        return ['Você ganhou!', 'Pedra'];
      }
      if (bot_move === 'papel') {
        return ['Empate!', 'Papel'];
      }
      return ['Eu Ganhei!', 'Tesoura'];
    } else {
      if (bot_move === 'pedra') {
        return ['Eu Ganhei!', 'Pedra'];
      }
      if (bot_move === 'papel') {
        return ['Você Ganhou!', 'Papel'];
      }
      return ['Empate!', 'Tesoura'];
    }
  }
}
