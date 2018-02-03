import Twitter      from 'twit'
import Discord      from 'discord.js'

import request      from 'request'
import fs           from 'fs'
import path         from 'path'

import config       from './config'

const twitter       = new Twitter(config.twitter),
      discord       = new Discord.Client(),
      discordToken  = config.discord.token,
      imagePath     = "./tmp/"

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
    let imageFile = path.join(__dirname, imagePath + message.attachments.first().filename)
    let status = `Submitted by ${message.author.username}. #TRTL #TurtleCoin #Cryptocurrency #Blockchain`
    downloadImage(message.attachments.first().url, (body) => {
      writeImage(imageFile, body, () => {
        uploadMedia(imageFile,(mediaId) => {
          postMediaTweet(
            { status, media_ids : [mediaId] },
            () => {fs.unlinkSync(imageFile)}
          )
        } )
      })
    })

    //    twitter.post('/statuses/update', { status: 'test ' + message.attachments.first().url }, (err, tweet, resp) => {
    //      if(!err) {
    //        console.log("tweet successful")
    //      }
    //      else {
    //        console.log(err)
    //      }
    //    })
    //  }
    //
  }
})

discord.login(config.discord.token)

const downloadImage = (url, success) => {
  request.defaults({encoding: null}).get(url, (err, resp, body) => {
    if(!err) {
      success(body)
    }
    else {
      console.log(err)
    }
  })
}

const writeImage = (path, data, success) => {
  fs.writeFile(path, data, (err) => {
    if(!err) {
      success()
    }
    else {
      console.log(err)
    }
  })
}

const uploadMedia = (file_path, success) => {
  twitter.postMediaChunked(
    { file_path },
    (err, data, resp) => {
      const media_id      = data.media_id_string,
            meta_params   = { media_id }

      if (!err) {

              console.log(media_id)
              console.log(meta_params)
              console.log(data)
              console.log(data.media_id_str)
        twitter.post(
          'media/metadata/create',
          meta_params,
          (err, data, resp) => {
            if(!err) {
              success(media_id)
            }
            else {
              console.log(err)
            }
          }
        )
      }
      else {
        console.log(error)
      }
    }
  )
}

const postMediaTweet = (statusParams, success) => {

 twitter.post(
   'statuses/update',
   statusParams,
   (err, tweet, resp) => {
     console.log('tweet successful!')
     console.log(resp)
     console.log(tweet)
       success()
   }
 )
}
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

