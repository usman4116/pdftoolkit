import test from "node:test";
import assert from "node:assert/strict";

function parsePageRangeString(rangeStr, totalPages) {
  const indices = new Set();
  const parts = rangeStr.split(/[\s,]+/);

  for (const part of parts) {
    if (!part) continue;
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-");
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end)) {
        const min = Math.max(1, Math.min(start, end));
        const max = Math.min(totalPages, Math.max(start, end));
        for (let p = min; p <= max; p++) {
          indices.add(p - 1);
        }
      }
    } else {
      const pageNum = parseInt(part, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        indices.add(pageNum - 1);
      }
    }
  }

  return Array.from(indices).sort((a, b) => a - b);
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

test("parsePageRangeString extracts correct zero-indexed pages", () => {
  const result1 = parsePageRangeString("1-3, 5, 8-10", 12);
  assert.deepEqual(result1, [0, 1, 2, 4, 7, 8, 9]);

  const result2 = parsePageRangeString("2", 5);
  assert.deepEqual(result2, [1]);

  const result3 = parsePageRangeString("10-15", 8); // completely out of range
  assert.deepEqual(result3, []);

  const result4 = parsePageRangeString("6-10", 8); // partially clamped (pages 6, 7, 8)
  assert.deepEqual(result4, [5, 6, 7]);
});

test("formatBytes converts sizes properly", () => {
  assert.equal(formatBytes(1024), "1 KB");
  assert.equal(formatBytes(1048576), "1 MB");
  assert.equal(formatBytes(2621440), "2.5 MB");
});

test("Compression target sizing arithmetic", () => {
  const targetMB = 2.0;
  const targetBytes = targetMB * 1024 * 1024;
  assert.equal(targetBytes, 2097152);

  const originalBytes = 12400000;
  const compressedBytes = 2180000;
  const reduction = Math.max(0, ((originalBytes - compressedBytes) / originalBytes) * 100);
  assert.equal(parseFloat(reduction.toFixed(1)), 82.4);
});
