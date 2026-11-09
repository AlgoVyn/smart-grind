#!/usr/bin/env python3
"""Validate SmartGrind content markdown: fences, flashcard markers, data-file mapping."""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PUB = ROOT / "website/public"
FAIL = []


def fail(msg: str) -> None:
    FAIL.append(msg)


def convert(name: str, sql: bool = False) -> str:
    cleaned = re.sub(r"[\s/()&`'+,-]+", "-", name.lower())
    cleaned = re.sub(r"-+", "-", cleaned).strip("-")
    suffixes = ("-pattern", "-sql", "-solution") if sql else (
        "-pattern",
        "-algorithm",
        "-approach",
        "-method",
        "-technique",
        "-style",
    )
    for suf in suffixes:
        if cleaned.endswith(suf):
            cleaned = cleaned[: -len(suf)]
    return cleaned


def extract_entries(ts: Path):
    text = ts.read_text(encoding="utf-8")
    matches = re.findall(
        r"id:\s*'([^']+)',\s*name:\s*(?:'([^']*)'|\"([^\"]*)\"),\s*url:\s*(?:'([^']*)'|\"([^\"]*)\")",
        text,
        flags=re.S,
    )
    return [(i, n1 or n2, u1 or u2) for i, n1, n2, u1, u2 in matches]


def extract_pattern_names(ts: Path):
    text = ts.read_text(encoding="utf-8")
    return re.findall(
        r"\{\s*name:\s*['\"]([^'\"]+)['\"],\s*(?:description:\s*['\"][^'\"]*['\"],\s*)?problems:",
        text,
        flags=re.S,
    )


def fence_balance(path: Path, text: str) -> None:
    stack = []
    for i, line in enumerate(text.splitlines(), 1):
        if line.strip() == '``"':
            fail(f"{path}:{i}: corrupted fence closer ``\"")
        m = re.match(r"^(`{3,})(.*)$", line)
        if not m:
            continue
        n = len(m.group(1))
        info = m.group(2).strip()
        if stack and stack[-1][0] <= n and not info:
            stack.pop()
        else:
            stack.append((n, i, info))
    for n, line, info in stack:
        fail(f"{path}:{line}: unclosed fence ({n} ticks, info={info!r})")


def check_flashcards() -> None:
    data = (ROOT / "website/src/data/flashcards-data.ts").read_text(encoding="utf-8")
    ids = re.findall(r"id:\s*'([^']+)'", data)
    folder = PUB / "flashcards"
    files = {p.stem for p in folder.glob("*.md")}
    for cid in ids:
        if cid not in files:
            fail(f"flashcard id {cid!r} missing flashcards/{cid}.md")
    fm, bm = "<!-- front -->", "<!-- back -->"
    for p in folder.glob("*.md"):
        text = p.read_text(encoding="utf-8")
        fence_balance(p.relative_to(ROOT), text)
        fs, bs = text.find(fm), text.find(bm)
        rel = p.relative_to(ROOT)
        if fs == -1:
            fail(f"{rel}: missing <!-- front -->")
            continue
        if bs == -1:
            fail(f"{rel}: missing <!-- back -->")
            continue
        if bs < fs:
            fail(f"{rel}: <!-- back --> appears before <!-- front -->")
            continue
        if not text[:fs].strip():
            fail(f"{rel}: empty front (nothing before <!-- front -->)")
        if not text[fs + len(fm) : bs].strip():
            fail(f"{rel}: empty back (nothing between markers)")


def check_mapped(label: str, expected_stems: set[str], folder: Path) -> None:
    files = {p.stem for p in folder.glob("*.md")}
    for stem in sorted(expected_stems):
        if stem not in files:
            fail(f"{label} maps to {folder.relative_to(ROOT)}/{stem}.md which is missing")
    for p in folder.glob("*.md"):
        fence_balance(p.relative_to(ROOT), p.read_text(encoding="utf-8"))


def main() -> int:
    problems = extract_entries(ROOT / "website/src/data/problems-data.ts")
    algos = extract_entries(ROOT / "website/src/data/algorithms-data.ts")
    sql_problems = extract_entries(ROOT / "website/src/data/sql-data.ts")
    pattern_names = extract_pattern_names(ROOT / "website/src/data/problems-data.ts")
    sql_pattern_names = extract_pattern_names(ROOT / "website/src/data/sql-data.ts")

    check_mapped("problem", {pid for pid, _, _ in problems}, PUB / "solutions")
    check_mapped(
        "algorithm",
        {re.sub(r"^algo-", "", aid) for aid, _, _ in algos},
        PUB / "algorithms",
    )
    check_mapped("pattern", {convert(n) for n in pattern_names}, PUB / "patterns")
    check_mapped(
        "SQL pattern",
        {convert(n, sql=True) for n in sql_pattern_names},
        PUB / "sql/patterns",
    )
    check_mapped(
        "SQL problem",
        {convert(name) for _, name, _ in sql_problems},
        PUB / "sql/solutions",
    )
    check_flashcards()

    if FAIL:
        print(f"{len(FAIL)} markdown content validation error(s):")
        for msg in FAIL:
            print(f"  - {msg}")
        return 1
    print("Markdown content validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
