import twitter from './twitterCon';

interface Tweet {
  userId: string,
  user: string,
  body: string,
  tweetId: string,
  timeStamp: string,
  hashtags: string[],
  retweeters: any,
  likers: string[],
  location: string | null
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

const getRetweetersById = (tweetId: string) => {
  twitter.get('statuses/retweeters/ids', {id: tweetId}, (err: any, retweeter: any) => {
    if (!err) {
      console.log(retweeter);
    } 
  })
}

const getTweetsByUser = (user: string) => {
  twitter.get('statuses/user_timeline', {screen_name: user, tweet_mode: 'extended', count: 10}, (err: any, tweets: any) => {
    if (!err) {
      tweets.forEach(async (tweet:any) => {
        const retweeters = await getRetweetersById(tweet.id_str);

        const singleTweet: Tweet = {
          userId: tweet.user.id_str,
          user: user,
          body: tweet.full_text,
          tweetId: tweet.id_str,
          timeStamp: tweet.created_at,
          hashtags: tweet.entities.hashtags,
          retweeters: retweeters,
          likers: [],
          location: tweet.user.location,
        }
      })
    }
  })
}

getTweetsByUser('Dan_Abramov');

export {
  getStreamByTopic,
  getTrendsByLocation
}