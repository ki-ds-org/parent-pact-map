import { strict as assert } from "node:assert";
import { test } from "node:test";
import { isPactApiResponse } from "../src/util/pactApi.ts";

test("accepts schools without a contact URL", () => {
  assert.equal(
    isPactApiResponse({
      municipalities: [
        {
          municipality: "Mellerud",
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
