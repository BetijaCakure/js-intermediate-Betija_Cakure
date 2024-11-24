import fetch from 'node-fetch';
import { ApplicationCommandOptionType, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder} from 'discord.js';

const commandHelper =  [{
    name: 'ping',
    description: 'Answers to user with PONG!',
    action: async function (interaction, options) {
        await interaction.reply({
            content: 'PONG!'
        })
    }
}, {
    name: 'anime',
    description: 'Helps user to find anime to watch',
    options: [{
        name: 'type',
        description: 'Type of anime',
        required: true,
        type: ApplicationCommandOptionType.String,
        choices: [{
            name: 'tv',
            value: 'tv'
        }, {
            name: 'ova',
            value: 'ova'
        }, {
            name: 'movie',
            value: 'movie'
        }]
    }, {
        name: 'status',
        description: 'Current status of Anime',
        required: true,
        type: ApplicationCommandOptionType.String,
        choices: [{
            name: 'airing',
            value: 'airing'
        }, {
            name: 'complete',
            value: 'complete'
        }, {
            name: 'upcoming',
            value: 'upcoming'
        }]
    }, {
        name: 'minimal_score',
        description: 'Minimal rating of anime you look. 1 - 10',
        type: ApplicationCommandOptionType.String
    }, {
        name: 'date',
        description: 'Anime start date. Ex: 2022-05-01',
        type: ApplicationCommandOptionType.String
    }],
    action: async function (interaction, options) {
        const type = options.getString('type');
        const status = options.getString('status');
        const score = options.getString('minimal_score');
        const date = options.getString('date');

        let url = `https://api.jikan.moe/v4/anime?type=${type}&status=${status}&limit=1`

        if (score) {
            url += `&min_score=${score}`
        };

        if (date) {
            url += `&start_date=${date}`
        };

        const response = await fetch(url);
        const json = await response.json();

        const emptyCard = new EmbedBuilder()
            .setTitle('Not found')
            .setDescription('Unidentified anime')
            .setTimestamp()
            .setImage('https://ih1.redbubble.net/image.1893341687.8294/fposter,small,wall_texture,product,750x1000.jpg');

        if (json.data && json.data.length > 0) {
            const foundTitles = json.pagination.last_visible_page;
            const randomPage = Math.floor(Math.random() * foundTitles);

            url += `&page=${randomPage}`;

            const response = await fetch(url);
            const result = await response.json();         

            const info = result.data[0];

            const embedCard = new EmbedBuilder()
                .setTitle(`${info.title} - Score: ${info.score}`)
                .setDescription(info.synopsis)
                .setTimestamp()
                .setImage(info.images.jpg.large_image_url)

            await interaction.reply({
                ephemeral: true,
                embeds: [embedCard]
            });
        } else {
            await interaction.reply({
                ephemeral: true,
                embeds: [emptyCard]
            });
        }
    }
}, {
    name: 'pokemon',
    description: 'Sends a matching pokemon card',
    options: [{
        name: 'name',
        description: 'Give the name',
        required: true,
        type: ApplicationCommandOptionType.String,
    }],
    action: async function (interaction, options) {
        const name = options.getString('name');

        let url = `https://api.pokemontcg.io/v2/cards?q=name:"${name}"`

        const response = await fetch(url);
        const json = await response.json();

       
        const emptyCard = new EmbedBuilder()
        .setTitle(`pokemon ${name} was not found`)
        .setDescription('Unidentified pokemon')
        .setImage('https://i.pinimg.com/originals/7e/48/a9/7e48a9c47f2380fe858daba033559b08.png');

     if (json.data && json.data.length > 0) {


        const randomcard = json.data[Math.floor(Math.random() * json.data.length)];


        const embedCard = new EmbedBuilder()
            .setTitle(`Pokemon: ${randomcard.name}`)
            .setDescription(`HP: ${randomcard.hp}\nLevel: ${randomcard.level || "N/A"}`)
            .setTimestamp()
            .setImage(randomcard.images.large)

        const randomEvolution = randomcard.evolvesTo?.length > 0 ? randomcard.evolvesTo[Math.floor(Math.random() * randomcard.evolvesTo.length)] : null;
        
        const evolveButton = new ButtonBuilder()
            .setCustomId(`fetch_evolved:${randomEvolution || 'none'}`)
            .setLabel(randomEvolution ? 'Evolve' : 'No Evolution')
            .setStyle(randomEvolution ? ButtonStyle.Primary : ButtonStyle.Secondary)
            .setDisabled(!randomEvolution);
        
        const buttonRow = new ActionRowBuilder().addComponents(evolveButton);

        await interaction.reply({
            ephemeral: true,
            embeds: [embedCard],
            components: [buttonRow]
        });
        } else {
        await interaction.reply({
            ephemeral: true,
            embeds: [emptyCard]
        });
    }
    }
    
},{
    name: 'fishing',
    description: 'Send Jayce fishing now!',
    options: [{
        name: 'count',
        required: true,
        description: 'Enter the amount of baits',
        type: ApplicationCommandOptionType.Integer
    }],
    action: async function (interaction, options) {

        const attempts = options.getInteger('count');
        const caught_fishes = 0;
    
        const embedCard = new EmbedBuilder()
        .setTitle(`Jericho Asked Jayce to go fishing!`)
        .setDescription(`You have ${attempts.toString()} attempts to fish!` )
        .setTimestamp()
        .setImage(`https://cdnb.artstation.com/p/assets/images/images/045/058/725/large/max-rose-final.jpg?1641832857`)

        const fishingButton = new ButtonBuilder()
        .setCustomId(`go_fishing:${attempts}:${caught_fishes}`)
        .setLabel(`Start fishing`)
        .setStyle(ButtonStyle.Primary)

        const buttonRow = new ActionRowBuilder().addComponents(fishingButton);

        await interaction.reply({
            ephemeral: true,
            embeds: [embedCard],
            components: [buttonRow]
        });
           
    }
},{
    name: 'find_em_lyrics',
    description: 'Jayce helps user find those lyrics and count the word occurances',
    options:[{
        name: 'artist',
        required: true,
        description: 'Jayce needs the artists name to find the lyrics',
        type: ApplicationCommandOptionType.String
    }, {
        name: 'title',
        required: true,
        description: 'Jayce needs the songs title to find the lyrics',
        type: ApplicationCommandOptionType.String
    }, {
        name: 'word',
        description: 'Enter a word an Jayce will count how many times the word is used',
        required: false,
        type: ApplicationCommandOptionType.String
    }],
    action: async function (interaction, options) {
        const artist = options.getString('artist');
        const title = options.getString('title');
        const word = options.getString('word');

        const url = `https://api.lyrics.ovh/v1/${artist}/${title}`;
        const response = await fetch(url);
        const result = await response.json();

        if (!result.lyrics) {
            await interaction.reply({
                ephemeral: true,
                content: 'Sorry! Jayce could not find the song 😓'
            });
            return;
        }
        else {
            if(!word){
                const embedCard = new EmbedBuilder()
                    .setTitle(`${artist} | ${title}`)
                    .setDescription(result.lyrics)
                    .setTimestamp()

                await interaction.reply({
                    ephemeral: true,
                    embeds: [embedCard]
                 });
            }
            else{
                const lyrics = result.lyrics;

                const regex = new RegExp(`\\b${word}\\b`, 'gi'); 
                let count = (lyrics.match(regex) || []).length;
                
                const embedCard = new EmbedBuilder()
                .setTitle(`${title} - ${artist} | Jayce counted the "${word}" ${count} times`)
                .setDescription(lyrics) 
                .setTimestamp();

                await interaction.reply({
                    ephemeral: true,
                    embeds: [embedCard]
                 });
            }

         }
    }
}];

const buttonInteractions = async function (interaction) {
    if (!interaction.isButton()) return;

    const buttonID = interaction.customId;

    if (buttonID.startsWith('fetch_evolved')) {

        const [, evolvesTo] = buttonID.split(':');

//If using evolve button that returns message that cant evolve

//    if (evolvesTo === 'none') {
//        await interaction.reply({
//            ephemeral: true,
//            content: 'Evolution not possible',
//        });
//        return;
//    }

        const url = `https://api.pokemontcg.io/v2/cards?q=name:"${evolvesTo}"`;
        const response = await fetch(url);
        const json = await response.json();
        
        if (json.data && json.data.length > 0) {

            const evolvedCard = json.data[0];

            const embedCard = new EmbedBuilder()
                .setTitle(`Evolved Pokémon: ${evolvedCard.name}`)
                .setDescription(`HP: ${evolvedCard.hp}\nLevel: ${evolvedCard.level || "N/A"}`)
                .setImage(evolvedCard.images.large);

            await interaction.reply({
                ephemeral: true,
                embeds: [embedCard],
            });
        } else {
            await interaction.reply({
                ephemeral: true,
                content: "Could not find the evolved Pokémon card.",
            });
        }
    }else if(buttonID.startsWith('go_fishing'))
    {
        const [, attempts_receivd, caught] = buttonID.split(':');

        let attempts = parseInt(attempts_receivd, 10);
        let caught_fishes = parseInt(caught, 10);
       
        let rand = Math.random() * 100;

            if(rand>40)
                {
                const url = `https://api.inaturalist.org/v1/taxa?taxon_id=47178&rank=species`;
                const response = await fetch(url);
                const data = await response.json();
    
                if (data.results && data.results.length > 0) {
                    const randomFish = data.results[Math.floor(Math.random() * data.results.length)];

                    attempts -= 1;
                    caught_fishes +=1;

                    const embedCard = new EmbedBuilder()
                        .setTitle(`🎣 Congratulations! Jayce caught: ✨${randomFish.name}✨`)
                        .setTimestamp()
                        .setImage(randomFish.default_photo.url) 
    
                    const embedCard2 = new EmbedBuilder()
                        .setTitle(`Jericho Asked Jayce to go fishing!`)
                        .setDescription(`You have ${attempts} attempts remaining.\nJayce has caught ${caught_fishes} fishes`)
                        .setTimestamp()
                        .setImage(`https://i.ytimg.com/vi/0lkTpf_hL6A/hqdefault.jpg`);
    
                    const fishingButton = new ButtonBuilder()
                        .setCustomId(`go_fishing:${attempts}:${caught_fishes}`)
                        .setLabel(`Fish again`)
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(attempts <= 0);
    
                    const buttonRow = new ActionRowBuilder().addComponents(fishingButton);
    
                    await interaction.update({
                        embeds: [embedCard2],
                        components: attempts > 0 ? [buttonRow] : [] 
                    });

                    await interaction.followUp({
                        ephemeral: true,
                        embeds: [embedCard]
                    });
    
                }
                else{
                    await interaction.reply({
                        ephemeral: true,
                        content: 'Something went wrong'
                });
                }
            }  else {
                attempts -= 1;

                const embedCard2 = new EmbedBuilder()
                .setTitle(`Jericho Asked Jayce to go fishing!`)
                .setDescription(`You have ${attempts} attempts remaining.\nJayce has caught ${caught_fishes} fishes`)
                .setTimestamp()
                .setImage(`https://64.media.tumblr.com/b1f63e1a7901e4def75ac3a50deaf73d/8ae57c7c2e6a3a6a-13/s540x810/e6e7c7c5411388f90eaf5992a7f450e2160a3fb4.gifv`);

                const fishingButton = new ButtonBuilder()
                .setCustomId(`go_fishing:${attempts}:${caught_fishes}`)
                .setLabel(`Fish again`)
                .setStyle(ButtonStyle.Primary)
                .setDisabled(attempts <= 0);

                const buttonRow = new ActionRowBuilder().addComponents(fishingButton);

                await interaction.update({
                    embeds: [embedCard2],
                    components: attempts > 0 ? [buttonRow] : [] 
                });

                await interaction.followUp({
                        ephemeral: true,
                        content: `The fish bailed 😓 🫧`
                });
            }
            
        
    }
};


export {commandHelper, buttonInteractions}