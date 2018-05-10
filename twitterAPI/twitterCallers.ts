import twitter from './twitterCon';
import fs from 'fs';
import path from 'path';

interface Tweet {
  userId: string,
  userName: string,
  tweetId: string,
  body: string,
  favoritedCount: number,
  location: string | null,
  followers: number,
  friends: number,
  timeStamp: string,
}

const getStreamByTopic = (topic: string = 'graphs') => {
  twitter.stream('statuses/filter', {track: topic},  (stream: any) => {
    stream.on('data', (tweet: any) => {
      console.log(tweet.text);
    });
  }) 
}
  
const getTrendsByLocation = (id: number = 1) => {
  twitter.get('trends/place', {id: id}, (err: any, tweets: any) => {
    if (!err) {
      console.log(tweets[0]);
    }
  })
}

const getUserNamesFromId = (ids: string) => {
  return twitter.post('users/lookup', {user_id: ids})
  .then((users: any) => {
    return users.map((user: any) => user.screen_name);
  })
  .catch((err: any) => {
    console.log(err);
  })
}

const getRetweetersById = (tweetId: string) => {
  return twitter.get('statuses/retweeters/ids', {id: tweetId})
  .then(async (retweeter: any) => {
    const idList = retweeter.ids.join(','); 
    const names = await getUserNamesFromId(idList);
    return names;
  })
  .catch((err: any) => {
    console.log(err);
  })
}

const getTweetsByUser = (user: string, max_id: any = false) => {
  const params = max_id ? {screen_name: user, tweet_mode: 'extended', count: 200, max_id: max_id} :
  {screen_name: user, tweet_mode: 'extended', count: 200};

  twitter.get('statuses/user_timeline', params)
  .then((tweets: any) => {
    tweets.forEach((tweet: any, i: number) => {

      const singleTweet: Tweet = {
        userId: tweet.user.id_str,
        userName: user,
        tweetId: tweet.id_str,
        body: tweet.full_text,
        favoritedCount: tweet.favorite_count,
        location: tweet.user.location,
        followers: tweet.user.followers_count,
        friends: tweet.user.friends_count,
        timeStamp: tweet.created_at,
      }

      if (i === tweets.length - 1 && tweets.length > 100) {
        getTweetsByUser(user, tweet.id_str);
      } 

    })
  })
  .catch((err: any) => {
    console.log(err);
  })
}

export {
  getStreamByTopic,
  getTrendsByLocation,
  getTweetsByUser
}

