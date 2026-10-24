import type { StaticImageData } from "next/image";
import culture from "@/public/awards/culture.jpg";
import peer from "@/public/awards/peer.jpg";
import appreciation from "@/public/awards/appreciation.jpg";
import special from "@/public/awards/special.jpg";

/** Sheet 05 — quarterly recognition record. q indexes into QUARTERS.
 *  Images are static imports, not path strings: Next then emits a
 *  content-hashed URL, so replacing a file actually invalidates the
 *  optimizer and browser caches, and each image carries its own real
 *  intrinsic dimensions instead of one hardcoded guess for all four. */
export const QUARTERS = ["Q4 2025", "Q1 2026", "Q2 2026", "Q3 2026"] as const;

export type Award = {
  q: number;
  name: string;
  short: string;
  t: string;
  sum: string;
  cite: string;
  img: StaticImageData;
};

export const AWARDS: Award[] = [
  { q: 0, name: "CULTURE CHAMPION", short: "CULTURE",
    t: "Workflow automation, a month early",
    sum: "Named Culture Champion for #CommitmentToExcellence and #Collaboration.",
    cite: "Kudos to Anas for his impactful contribution to delivering the workflow-automation feature ahead of expectations. As a junior team member, Anas ramped up quickly, adapting to changes including a mid-way Codex shift with remarkable ease. What truly stands out is that a feature expected to take a month was successfully delivered in just two weeks, with Anas playing a key role in making it happen.",
    img: culture },
  { q: 1, name: "PEER APPLAUSE", short: "APPLAUSE",
    t: "In-Meeting Consent Change, delivered on time",
    sum: "Peer-nominated within the IR team for a critical customer requirement.",
    cite: "Since joining the IR team as a fresher, he has consistently picked up and delivered tasks with dedication. One of his key contributions was the delivery of the In-Meeting Consent Change feature, a critical requirement for HCL. His ability to deliver this on time demonstrates strong ownership, focus, and commitment to meeting customer needs.",
    img: peer },
  { q: 2, name: "CERTIFICATE OF APPRECIATION", short: "APPRECIATION",
    t: "Shipped what the customer demo depended on",
    sum: "Built the features the demo needed under an urgent timeline, so it went out on schedule.",
    cite: "Anas played an important role in ensuring the customer demo was delivered successfully. He worked closely with the team to prepare the platform, address last-minute challenges, and keep progress aligned with customer timelines. His responsiveness and willingness to step in wherever needed strengthened coordination and kept execution seamless.",
    img: appreciation },
  { q: 3, name: "SPECIAL RECOGNITION AWARD", short: "SPECIAL",
    t: "The v8 migration, owned end to end",
    sum: "For the Workflow Tools migration — 220k lines, 21 domains, v7 to v8.",
    cite: "A huge shoutout to Md Anas for his outstanding work on the WFT migration. Throughout the process, he navigated multiple technical challenges with strong ownership, tackling each one head-on and resolving them with persistence and technical excellence rather than deferring them elsewhere. His hands-on approach and steady focus ensured a smooth migration, leaving Workflow tools running on a more modern, maintainable stack.",
    img: special },
];
