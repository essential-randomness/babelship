import {
  ElementContent,
  Element as HastElement,
  Root,
  RootContent,
} from "hast";

import { isElement } from "hast-util-is-element";
import rehypeParse from "rehype-parse";
import rehypeRewrite from "rehype-rewrite";
import rehypeStringify from "rehype-stringify";
import { toString } from "hast-util-to-string";
import { unified } from "unified";
import { visit } from "unist-util-visit";

interface Formatting {
  start: number;
  end: number;
  type: "bold" | "italic";
}
interface TextBlock {
  type: "text";
  text: string;
  subtype?: string;
  formatting?: Formatting[];
}

type ContentBlock = TextBlock;

interface NeuePostFormat {
  content: ContentBlock[];
}

const FORMATTABLE_ELEMENTS = ["strong", "em"] as const;
interface FormattableNode extends HastElement {
  tagName: typeof FORMATTABLE_ELEMENTS[number];
}

const ELEMENT_NPF_FORMAT_MAP: Record<
  typeof FORMATTABLE_ELEMENTS[number],
  Formatting["type"]
> = {
  em: "italic",
  strong: "bold",
};

const getNpfTextFormatting = (paragraph: ElementContent): Formatting[] => {
  const formats: Formatting[] = [];
  const offsets = new Map<ElementContent, number>([[paragraph, 0]]);
  const lenghts = new Map<ElementContent, number>();

  // We visit each formattable node in the paragraph, and calculate its offset and length.
  // We then push the corresponding values to the formats array, and memoize the calculations
  // to avoid repeatedly traversing the tree.
  visit(
    paragraph,
    (node) =>
      isElement(
        node,
        [...FORMATTABLE_ELEMENTS] /* Must make mutable for TS' sake*/
      ),
    (node, _, parent) => {
      if (!isElement(parent)) {
        throw new Error("Found formattable element with non-element parent.");
      }
      let offset = offsets.get(parent);
      // Note: since this is a NLR visit, we can expect that the starting offsets and lengths
      // of the parent and previous formattable siblings have already been memoized.
      if (typeof offset === "undefined") {
        throw new Error("Found parent element with no assigned offset.");
      }
      // Iterate on all preceding siblings, calculating the length for each of them.
      // The offset of the current node is the sum of these lengths.
      for (let previousSibling of parent.children) {
        if (previousSibling == node) {
          break;
        }
        if (previousSibling.type == "text") {
          offset += previousSibling.value.length;
        }
        if (previousSibling.type == "element") {
          // Memoize the length of each element so we only call `toString` once.
          if (!lenghts.has(previousSibling)) {
            lenghts.set(previousSibling, toString(node).length);
          }
          offset += lenghts.get(previousSibling)!;
        }
      }

      // Memoize our calculations...
      const textContent = toString(node);
      lenghts.set(node, textContent.length);
      offsets.set(node, offset);

      // ...and add the formatting information to the list.
      formats.push({
        type: ELEMENT_NPF_FORMAT_MAP[(node as FormattableNode).tagName],
        start: offset,
        end: offset + textContent.length,
      });
    }
  );
  return formats;
};

const toNpfTextBlock = (paragraph: HastElement): TextBlock => {
  // First, we swap all <br />s with text nodes containing \n.
  // We don't do this with the text formatting visit because if we don't do it
  // before calculating lengths it will fuck up our lenght counts.
  const textContent = toString(paragraph);
  const formats = getNpfTextFormatting(paragraph);

  return {
    type: "text",
    text: textContent,
    formatting: formats,
  };
};

const toNeuePostFormat = (
  node: Root | RootContent | RootContent[]
): ContentBlock | ContentBlock[] => {
  if (Array.isArray(node)) {
    return node.map((node) => {
      return toNeuePostFormat(node) as ContentBlock;
    });
  }
  if (node.type == "root") {
    return toNeuePostFormat(node.children);
  }
  if (isElement(node, "p")) {
    return toNpfTextBlock(node);
  }
  throw new Error("Unsupported node type");
};

export const htmlToTumblr = async (html: string): Promise<NeuePostFormat> => {
  const htmlProcessor = await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeRewrite, {
      rewrite: (node, index, parent) => {
        if (isElement(node, "br")) {
          if (!parent) {
            throw new Error("Found <br /> tag with no parent.");
          }
          parent.children[index!] = {
            type: "text",
            value: `\n`,
          };
          return;
        }
      },
    })
    .use(rehypeStringify);
  const processedHtml = await htmlProcessor.run(htmlProcessor.parse(html));

  return {
    // @ts-expect-error
    content: toNeuePostFormat(processedHtml),
  };
};
