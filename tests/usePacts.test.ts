import { strict as assert } from "node:assert";
import { test } from "node:test";
import { isPactApiResponse } from "../src/util/pactApi.ts";

test("accepts municipalities without schools when coordinates are available", () => {
  assert.equal(
    isPactApiResponse({
      municipalities: [
        {
          municipality: "Mellerud",
          coordinates: [58.7, 12.4],
        },
      ],
    }),
    true
  );
});

test("accepts schools without a contact URL", () => {
  assert.equal(
    isPactApiResponse({
      municipalities: [
        {
          municipality: "Mellerud",
          coordinates: [58.7, 12.4],
          schools: [
            {
              id: "1",
              school: "Karolinerskolan",
              coordinates: [58.7, 12.4],
              contact: null,
            },
          ],
        },
      ],
    }),
    true
  );
});

test("rejects malformed school contact values", () => {
  assert.equal(
    isPactApiResponse({
      municipalities: [
        {
          municipality: "Mellerud",
          coordinates: [58.7, 12.4],
          schools: [
            {
              id: "1",
              school: "Karolinerskolan",
              coordinates: [58.7, 12.4],
              contact: 1,
            },
          ],
        },
      ],
    }),
    false
  );
});
