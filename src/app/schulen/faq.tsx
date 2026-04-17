"use client";

import { css } from "@/theme/css";
import { ChevronDownIcon } from "lucide-react";
import { Accordion } from "radix-ui";

type FaqItem = {
  question: string;
  answer: string;
};

function Item({ item }: { item: FaqItem }) {
  return (
    <Accordion.Item
      key={item.question}
      value={item.question}
      className={css({
        py: "4",
        position: "relative",
        borderTopWidth: "1px",
        _first: { borderTopWidth: "0" },
        _last: { borderBottomWidth: "0" },
      })}
    >
      <Accordion.Header>
        <Accordion.Trigger
          className={css({
            width: "full",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "4",
            backgroundColor: "[#92C5FF]",
            textAlign: "left",
            transition: "transform",
            transitionDuration: "[300ms]",
            transitionBehavior: "[cubic-bezier(0.87, 0, 0.13, 1)]",
            '&[data-state="open"] svg': {
              transform: "rotate(180deg)",
            },
          })}
        >
          <span
            className={css({
              textStyle: "heavy",
              lineHeight: "[120%]",
            })}
          >
            {item.question}
          </span>
          <ChevronDownIcon
            className={css({
              flexShrink: "0",
              transition: "transform",
              transitionDuration: "normal",
            })}
          />
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content
        className={css({
          overflow: "hidden",
          '&[data-state="open"]': {
            animationName: "radixCollapsibleSlideDown",
            animationDuration: "[300ms]",
          },
          '&[data-state="closed"]': {
            animationName: "radixCollapsibleSlideUp",
            animationDuration: "[300ms]",
          },
        })}
      >
        <p
          className={css({
            lineHeight: "[120%]",
            fontSize: "lg",
            md: { fontSize: "xl" },
          })}
        >
          {item.answer}
        </p>
      </Accordion.Content>
    </Accordion.Item>
  );
}

export async function Faq({
  title,
  items,
}: {
  title: string;
  items: FaqItem[];
}) {
  return (
    <section className={css({ my: "8" })}>
      <h2
        className={css({
          textStyle: "heavy",
          fontSize: "xl",
          md: { fontSize: "2xl" },
        })}
      >
        {title}
      </h2>

      <Accordion.Root type="multiple">
        {items.map((item, index) => (
          <Item item={item} key={index} />
        ))}
      </Accordion.Root>
    </section>
  );
}
