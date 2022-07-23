import { describe, expect, test } from "vitest";

import { htmlToTumblr } from "../html-to-tumblr";

describe("Handles formatting", () => {
  test("Single format, spans whole paragraph", async () => {
    const html = `<p><strong>This is a test</strong></p>`;
    expect(await htmlToTumblr(html)).toStrictEqual({
      content: [
        {
          type: "text",
          text: "This is a test",
          formatting: [
            {
              type: "bold",
              start: 0,
              end: 14,
            },
          ],
        },
      ],
    });
  });

  test("Single format, single word", async () => {
    const html = `<p>This is a <strong>test</strong>!</p>`;
    expect(await htmlToTumblr(html)).toStrictEqual({
      content: [
        {
          type: "text",
          text: "This is a test!",
          formatting: [
            {
              type: "bold",
              start: 10,
              end: 14,
            },
          ],
        },
      ],
    });
  });

  test("Nested formats", async () => {
    const html = `<p><strong>This is a <em>test</em></strong></p>`;
    expect(await htmlToTumblr(html)).toStrictEqual({
      content: [
        {
          type: "text",
          text: "This is a test",
          formatting: [
            {
              type: "bold",
              start: 0,
              end: 14,
            },
            {
              type: "italic",
              start: 10,
              end: 14,
            },
          ],
        },
      ],
    });
  });

  test("With linebreak", async () => {
    const html = `<p><strong>This is...<br /><em>...a test!</em></strong></p>`;
    expect(await htmlToTumblr(html)).toStrictEqual({
      content: [
        {
          type: "text",
          text: "This is...\n...a test!",
          formatting: [
            {
              type: "bold",
              start: 0,
              end: 21,
            },
            {
              type: "italic",
              start: 11,
              end: 21,
            },
          ],
        },
      ],
    });
  });

  test("With slashes", async () => {
    const html = `<p>But what about <strong>&bsol;n</strong>?</p>`;
    expect(await htmlToTumblr(html)).toStrictEqual({
      content: [
        {
          type: "text",
          text: "But what about \\n?",
          formatting: [
            {
              type: "bold",
              start: 15,
              end: 17,
            },
          ],
        },
      ],
    });
  });

  // See: https://www.tumblr.com/docs/npf#inline-format-types-bold-italic-strikethrough-small
  test("documentation example", async () => {
    const html = `<p>some <strong>bold</strong> and <em>italic</em> text</p>`;
    expect(await htmlToTumblr(html)).toStrictEqual({
      content: [
        {
          type: "text",
          text: "some bold and italic text",
          formatting: [
            {
              start: 5,
              end: 9,
              type: "bold",
            },
            {
              start: 14,
              end: 20,
              type: "italic",
            },
          ],
        },
      ],
    });
  });

  test("Multiple paragraphs", async () => {
    const html = `<p>Hello <strong>World</strong>! 🌎️</p><p>...and welcome to my new app*!<br><br>(*disclaimer: I didn't say <em>working</em> app.)</p>`;

    expect(await htmlToTumblr(html)).toStrictEqual({
      content: [
        {
          type: "text",
          text: "Hello World! 🌎️",
          formatting: [
            {
              start: 6,
              end: 11,
              type: "bold",
            },
          ],
        },
        {
          type: "text",
          text: "...and welcome to my new app*!\n\n(*disclaimer: I didn't say working app.)",
          formatting: [
            {
              start: 59,
              end: 66,
              type: "italic",
            },
          ],
        },
      ],
    });
  });
});
