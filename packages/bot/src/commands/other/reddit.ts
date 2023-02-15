import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import {
  ColorResolvable,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ComponentType
} from 'discord.js';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import axios from 'axios';
import Logger from '../../lib/utils/logger';

@ApplyOptions<CommandOptions>({
  name: 'reddit',
  description: 'Obtenha postagens do reddit especificando um subreddit',
  preconditions: ['GuildOnly', 'isCommandDisabled']
})
export class RedditCommand extends Command {
  public override async chatInputRun(
    interaction: Command.ChatInputCommandInteraction
  ) {
    await interaction.deferReply();
    const channel = interaction.channel;
    if (!channel) return await interaction.reply('Something went wrong :('); // type guard
    const subreddit = interaction.options.getString('subreddit', true);
    const sort = interaction.options.getString('sort', true);

    if (['controversial', 'top'].some(val => val === sort)) {
      const row = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('top_or_controversial')
          .setPlaceholder('Selecione uma opção')
          .addOptions(optionsArray)
      );

      const menu = await channel.send({
<<<<<<< HEAD
        content: `:loud_sound: Você quer obter o ${sort} posts da hora passada/semana/mês/ano ou todos?`,
        components: [row]
=======
        content: `:loud_sound: Do you want to get the ${sort} posts from past hour/week/month/year or all?`,
        components: [
          {
            type: ComponentType.ActionRow,
            //@ts-ignore
            components: [row]
          }
        ]
>>>>>>> upgrade-to-v14
      });

      const collector = menu.createMessageComponentCollector({
        componentType: ComponentType.SelectMenu,
        time: 30000 // 30 sec
      });

      collector.on('end', () => {
        if (menu) menu.delete().catch(Logger.error);
      });

      collector.on('collect', async i => {
        if (i.user.id !== interaction.user.id) {
          i.reply({
            content: 'Este elemento não é para você!',
            ephemeral: true
          });
          return;
        } else {
          collector.stop();
          const timeFilter = i.values[0];
          this.fetchFromReddit(interaction, subreddit, sort, timeFilter);
          return;
        }
      });
    } else {
      this.fetchFromReddit(interaction, subreddit, sort);
      return;
    }
    return;
  }

  private async fetchFromReddit(
    interaction: Command.ChatInputCommandInteraction,
    subreddit: string,
    sort: string,
    timeFilter = 'day'
  ) {
    try {
      var data = await this.getData(subreddit, sort, timeFilter);
    } catch (error: any) {
      return interaction.followUp(error);
    }

    // interaction.followUp('Fetching data from reddit');

    const paginatedEmbed = new PaginatedMessage();
    for (let i = 1; i <= data.children.length; i++) {
      let color: ColorResolvable = '#FE9004';
      let redditPost = data.children[i - 1];

      if (redditPost.data.title.length > 255) {
        redditPost.data.title = redditPost.data.title.substring(0, 252) + '...'; // max title length is 256
      }

      if (redditPost.data.selftext.length > 1024) {
        redditPost.data.selftext =
          redditPost.data.selftext.substring(0, 1024) +
          `[Read More...](https://www.reddit.com${redditPost.data.permalink})`;
      }

      if (redditPost.data.over_18) color = '#CF00F'; // red - nsfw

      paginatedEmbed.addPageEmbed(embed =>
        embed
          .setColor(color)
          .setTitle(redditPost.data.title)
          .setURL(`https://www.reddit.com${redditPost.data.permalink}`)
          .setDescription(
            `${
              redditPost.data.over_18 ? '' : redditPost.data.selftext + '\n\n'
            }Upvotes: ${redditPost.data.score} :thumbsup: `
          )
          .setAuthor({ name: redditPost.data.author })
      );
    }

    return paginatedEmbed.run(interaction);
  }

  private getData(
    subreddit: string,
    sort: string,
    timeFilter: string
  ): Promise<any> {
    return new Promise(async function (resolve, reject) {
      const response = await axios.get(
        `https://www.reddit.com/r/${subreddit}/${sort}/.json?limit=10&t=${
          timeFilter ? timeFilter : 'day'
        }`
      );
      const data = response.data.data;
      if (!data) {
        reject(`**${subreddit}** é um subreddit privado!`);
      } else if (!data.children.length) {
        reject('Por favor, forneça um nome de subreddit válido!');
      }
      resolve(data);
    });
  }

  public override registerApplicationCommands(
    registry: Command.Registry
  ): void {
<<<<<<< HEAD
    registry.registerChatInputCommand({
      name: this.name,
      description: this.description,
      options: [
        {
          name: 'subreddit',
          type: 'STRING',
          required: true,
          description: 'Nome do subreddit'
        },
        {
          name: 'sort',
          type: 'STRING',
          required: true,
          description:
            'Quais posts você quer ver? Selecione de best/hot/top/new/controversial/rising',
          choices: [
            {
              name: 'Best',
              value: 'best'
            },
            {
              name: 'Hot',
              value: 'hot'
            },
            {
              name: 'New',
              value: 'new'
            },
            {
              name: 'Top',
              value: 'top'
            },
            {
              name: 'Controversial',
              value: 'controversial'
            },
            {
              name: 'Rising',
              value: 'rising'
            }
          ]
        }
      ]
    });
=======
    registry.registerChatInputCommand(builder =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption(option =>
          option
            .setName('subreddit')
            .setDescription('Subreddit name')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('sort')
            .setDescription(
              'What posts do you want to see? Select from best/hot/top/new/controversial/rising'
            )
            .setRequired(true)
            .addChoices(
              {
                name: 'Best',
                value: 'best'
              },
              {
                name: 'Hot',
                value: 'hot'
              },
              {
                name: 'New',
                value: 'new'
              },
              {
                name: 'Top',
                value: 'top'
              },
              {
                name: 'Controversial',
                value: 'controversial'
              },
              {
                name: 'Rising',
                value: 'rising'
              }
            )
        )
    );
>>>>>>> upgrade-to-v14
  }
}

const optionsArray = [
  {
    label: 'hour',
    value: 'hour'
  },
  {
    label: 'week',
    value: 'week'
  },
  {
    label: 'month',
    value: 'month'
  },
  {
    label: 'year',
    value: 'year'
  },
  {
    label: 'all',
    value: 'all'
  }
];
