import React from "react";
import { styled } from "@linaria/react";

const Author = styled.div`
  display: grid;
  grid-template-columns: fit-content(50px) 1fr;
  grid-template-rows: 1fr 1fr;
  grid-template-areas:
    "avatar name"
    "avatar username";
  grid-column-gap: 5px;
  align-items: center;
  .avatar {
    grid-area: avatar;
  }
  .name {
    grid-area: name;
  }
  .username {
    grid-area: username;
  }
`;

interface TweetData {
  id: string;
  author: {
    username: string;
    name: string;
    avatar_url: string;
  };
  content: {
    text: string;
    // Timestamp format
    created_at: number;
  };
}

export const TweetComponent = (props: TweetData) => {
  return (
    <article>
      <Author className="author">
        <img
          className="avatar"
          src={props.author.avatar_url}
          alt="The avatar of the tweet's author"
        />
        <div className="name">{props.author.name}</div>
        <div className="username">@{props.author.username}</div>
      </Author>
      <blockquote>{props.content.text}</blockquote>
    </article>
  );
};
