drop database if exists catalyst;
create database catalyst;
use catalyst;

create table users (
  id bigint primary key not null,
  user_name varchar(50) not null,
  screen_name varchar(60) not null,
  description varchar(160) not null,
  location varchar(60) not null,
  followers int(20) not null,
  friends int(20) not null,
  tweet_count int(20) not null,
  favorites_count int(20) not null,
  twitter_join_date varchar(30) not null,
  last_tweet bigint(50) default null
);

create table tweets (
  id bigint primary key not null,
  body text(280) not null,
  favorite_count int(30) not null,
  user_name varchar(50) not null,
  user_id bigint(50) not null,
  foreign key(user_id) references users(id) on delete cascade,
  added_at varchar(50) not null
);
