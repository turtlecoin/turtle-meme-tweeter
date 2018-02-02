import Twitter from 'twit'
import Discord from 'discord.js'

import config      from './config'

const twitter = new Twitter(config.twitter),
      discord = new Discord.Client(),
      discordToken = config.discord.token


discord.on('ready', () => {
  console.log('discord client ready')
  for (let channel of discord.channels) {
    if (channel[1].name == "memes") {//401109818607140864) {
      channel[1].send('Mic check 1 two scooby doo')
    }
  }
})

discord.on('message', message => {
  if (message.channel.name == "memes" && message.attachments && message.attachments.first()) {
    console.log(message.attachments.first())
    twitter.post('/statuses/update', { status: 'test ' + message.attachments.first().url }, (err, tweet, resp) => {
      if(!err) {
        console.log("tweet successful")
      }
      else {
        console.log(err)
      }
    })
  }
})

discord.login(discordToken)

//let params = {
//  q: '#turtlecoin',
//  count: 10,
//  result_type: 'recent',
//  lang: 'en'
//}
//
//t.post('/statuses/update', { status: 'test' }, (err, tweet, resp) => {
//  if(!err) {
//    console.log(tweet)
//  }
//  else {
//    console.log(err)
//  }
//})

//t.get('search/tweets', params, (err, data, resp) => {
//  if (!err) {
//    for(let status of data.statuses) {
//      console.log(status.user.screen_name + " " + status.id_str)
//    }
//  }
//  else {
//    console.log(err);
//  }
//})

