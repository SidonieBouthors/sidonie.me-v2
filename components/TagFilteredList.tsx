"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface TaggedItem {
  content: React.ReactNode;
  tags: string[];
  slug: string;
}

interface TagFilteredListProps {
  children: TaggedItem[];
}

function SuspenseTagFilteredList({ children }: TagFilteredListProps) {
  const selectedTags = useSearchParams().get("tags")?.split(",") || [];

  let filteredItems = children;
  if (selectedTags.length > 0) {
    filteredItems = children.filter((child: TaggedItem) =>
      child.tags.some((tag) => selectedTags.includes(tag))
    );
  }

  return (
    <ul>
      <hr />
      {filteredItems.map((item: TaggedItem) => (
        <li key={item.slug}>
          {item.content}
          <hr />
        </li>
      ))}
    </ul>
  );
}

/**
 * Displays a list of items, filtering them based on the tags in the URL query.
 * @param children The items to display, each with a `content`, `tags`, and `slug` property.
 */
export default function TagFilteredList({ children }: TagFilteredListProps) {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <SuspenseTagFilteredList>{children}</SuspenseTagFilteredList>
    </Suspense>
  );
}
