import { ComponentMeta, ComponentStory } from "@storybook/react";

import React from "react";
import { TweetComponent } from "../Twitter/Tweet";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Twitter",
  component: TweetComponent,
} as ComponentMeta<typeof TweetComponent>;

const Template: ComponentStory<typeof TweetComponent> = (args) => (
  <TweetComponent {...args} />
);

export const Tweet = Template.bind({});
Tweet.args = {
  id: "218439593240956928",
  author: {
    avatar_url: "https://pbs.twimg.com/profile_images/1096005346/1_normal.jpg",
    name: "Horse ebooks",
    username: "horse_ebooks",
  },
  content: {
    text: "Everything happens so much",
    created_at: 1340915032000,
  },
};
