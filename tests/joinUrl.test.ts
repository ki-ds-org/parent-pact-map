import { strict as assert } from "node:assert";
import { test } from "node:test";
import { getJoinUrl } from "../src/util/joinUrl.ts";
import type { Pact } from "../src/types/Pact.ts";

const pact: Pact = {
  id: "1",
  name: "Karolinerskolan",
  municipality: ["Mellerud"],
  school: "Karolinerskolan",
  coordinates: [0, 0],
  studentCount: 1,
  parentCount: 1,
};

test("includes municipality and school in the join URL", () => {
  assert.equal(
    getJoinUrl(pact),
    "https://ki-ds.org/foraldrapakten/ga-med?kommun=Mellerud&skola=Karolinerskolan"
  );
});

test("URL-encodes special characters in both values", () => {
  const url = new URL(getJoinUrl({
    ...pact,
    municipality: ["Göteborg & Co"],
    school: 'Skola "A" & B/Å',
  }));
  assert.equal(url.searchParams.get("kommun"), "Göteborg & Co");
  assert.equal(url.searchParams.get("skola"), 'Skola "A" & B/Å');
  assert.equal(
    url.search,
    "?kommun=G%C3%B6teborg+%26+Co&skola=Skola+%22A%22+%26+B%2F%C3%85"
  );
});

test("omits the school for a municipality aggregate", () => {
  const url = new URL(getJoinUrl({ ...pact, name: "Mellerud", school: undefined }));
  assert.equal(url.search, "?kommun=Mellerud");
});

test("keeps the base URL when no location is available", () => {
  assert.equal(
    getJoinUrl({ ...pact, municipality: [], school: undefined }),
    "https://ki-ds.org/foraldrapakten/ga-med"
  );
});
