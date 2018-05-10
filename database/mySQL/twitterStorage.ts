import knex from './SQLcon';
import { IUser, ITweet, getTweetsByUser } from '../../twitterAPI/twitterCallers';

const saveUser = async (user: IUser) => {
  const userMatch = await knex('users').select().where({ id: user.id });
  if (!userMatch.length) {
    const insertion = await knex('users').insert(user);
  } 
}

const saveTweet = async (tweet: ITweet) => {
  const tweetMatch = await knex('tweets').select().where({ id: tweet.id });
  if (!tweetMatch.length) {
    const insertion = await knex('tweets').insert(tweet);
  }
}

const updateLastTweet = async (screen_name: string) => {
  const lastTweet = await knex('tweets').select('id').where({ screen_name }).orderBy('added_at', 'desc');
  const update = await knex('users').where({ screen_name }).update({ last_tweet: lastTweet[0].id });
}

const getTweets = async (screen_name: string) => {
  const userMatch = await knex('users').select('last_tweet').where({ screen_name });
  if (!userMatch.length) {
    getTweetsByUser(screen_name);
  } else {
    getTweetsByUser(screen_name, null, userMatch[userMatch.length - 1].last_tweet);
  }
}

export {
  saveUser,
  saveTweet,
  updateLastTweet,
  getTweets
}