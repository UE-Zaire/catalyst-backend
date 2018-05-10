/*
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
*/

drop database if exists catalyst;
create database catalyst;
use catalyst;

create table users (
  id int primary key not null,
  user_name varchar(40) not null,
  location varchar(60) not null,
  followers int(20) not null,
  friends int(20) not null,
  tweet_count int(20) not null,
  twitter_join_date varchar(30) not null
);
