import { saveUser, saveTweet, updateLastTweet } from './../database/mySQL/twitterStorage';
import twitter from './twitterCon';
import emojiStrip from 'emoji-strip';
import fs from 'fs';
import path from 'path';

interface IUser {
  id: number,
  user_name: string,
  screen_name: string,
  description: string,
  location: string,
  followers: number,
  friends: number,
  tweet_count: number,
  favorites_count: number,
  twitter_join_date: string
}

interface ITweet {
  id: number,
  body: string,
  favorite_count: number,
  user_name: string,
  user_id: number,
  added_at: string
}

const getTweetsByUser = (user: string, max_id?: any, since_id?: any) => {
  const params = max_id ? {screen_name: user, tweet_mode: 'extended', count: 200, max_id: max_id} :
  !since_id ? {screen_name: user, tweet_mode: 'extended', count: 200} : 
  {screen_name: user, tweet_mode: 'extended', count: 200, since_id: since_id};

  twitter.get('statuses/user_timeline', params)
  .then((tweets: any) => {  
    tweets.forEach((tweet: any, i: number) => {
    if (i === 0 && !max_id) {
      const newUser: IUser = {
        id: tweet.user.id,
        user_name: tweet.user.name,
        screen_name: user,
        description: tweet.user.description,
        location: tweet.user.location,
        followers: tweet.user.followers_count,
        friends: tweet.user.friends_count,
        tweet_count: tweet.user.statuses_count,
        favorites_count: tweet.user.favourites_count,
        twitter_join_date: tweet.user.created_at
      }
      saveUser(newUser);
    }

      const singleTweet: ITweet = {
        id: tweet.id,
        body: emojiStrip(tweet.full_text),
        favorite_count: tweet.favorite_count,
        user_name: user,
        user_id: tweet.user.id,
        added_at: tweet.created_at
      }
      saveTweet(singleTweet);

      if (i === tweets.length - 1 && tweets.length > 100) {
        getTweetsByUser(user, tweet.id_str);
      } 
      if (tweets.length < 100) {
        updateLastTweet(user);
      }

    })
  })
}

const getUserFavorites = (username: string, max_id?: string) => {
  const params = max_id ? {screen_name: username, count: 200, max_id: max_id} :
  {screen_name: username, count: 200};

  twitter.get('favorites/list', params)
  .then((tweets: any) => {
    fs.appendFile(__dirname + '/dansfaves', JSON.stringify(tweets)+ ',', (err) => {
      if (!err) console.log('files written into!');
    })
    if (tweets.length >= 100) getUserFavorites(username, tweets[tweets.length-1].id_str);
  })
}

const getUserFriends = (screen_name: string) => {
  twitter.get('friends/list', { screen_name, count: 200 })
  .then((tweets: any) => {
    console.log(tweets.users.map((user: any) => {
      return {name: user.name, followers: user.followers_count}
    }))
  })
}

const getUserFollowers = (screen_name: string) => {
  return twitter.get('followers/list', { screen_name, count: 200 })
  .then((tweets: any) => {
    const nodes = tweets.users.map((user: any) => {
      return {id: user.name, followers: user.followers_count, group: 1};
    });
    const links = tweets.users.map((user: any) => {
      return {source: screen_name, target: user.name, value: user.followers_count}
    })
    return { nodes, links };
  })
  .catch((err: any) => {
    console.log(err);
    return err;
  })
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

export {
  getStreamByTopic,
  getTrendsByLocation,
  getTweetsByUser,
  IUser,
  ITweet,
  getUserFollowers
}

