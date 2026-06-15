export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "callout"; title: string; text: string };

export type Post = {
  slug: string;
  title: string;
  description: string;
  /** Short label shown on cards. */
  category: string;
  /** ISO date. */
  date: string;
  readingTime: string;
  keywords: string[];
  /** Punchy one-liner used on the index card. */
  excerpt: string;
  content: ContentBlock[];
};

export const POSTS: Post[] = [
  {
    slug: "track-sales-rep-performance-gohighlevel",
    title:
      "How to Track Sales Rep Performance in GoHighLevel (Without a Single Spreadsheet)",
    description:
      "A practical 2026 guide to measuring closer performance inside GoHighLevel using live opportunity data — win rate, revenue, workload, and aging — no exports required.",
    category: "Playbook",
    date: "2026-06-02",
    readingTime: "8 min read",
    keywords: [
      "gohighlevel sales reporting",
      "track sales rep performance",
      "ghl dashboard",
      "sales team kpis",
      "rep performance os",
    ],
    excerpt:
      "Your reps' performance is already sitting in GoHighLevel. Here's how to read it in a 5-second morning scan.",
    content: [
      {
        type: "p",
        text: "Most GoHighLevel agencies run their sales floor on vibes. The owner has a gut feeling about who's crushing it and who's coasting, but when you ask for the number, everyone reaches for a spreadsheet that's three days stale. The good news: every metric you need is already living in your GHL opportunities. You just have to read it the right way.",
      },
      {
        type: "h2",
        text: "Start with the right unit of analysis: rep × opportunity",
      },
      {
        type: "p",
        text: "The single biggest mistake teams make is measuring leads instead of opportunities. A lead is a contact. An opportunity is a deal with money attached, an owner, and a stage. When you pivot your thinking to 'rep × opportunity,' every question about performance becomes answerable from one snapshot.",
      },
      {
        type: "ul",
        items: [
          "Who owns the most open pipeline value right now?",
          "Whose deals are aging past 7 days without a touch?",
          "Who converts opportunities to revenue, not just activity?",
        ],
      },
      {
        type: "h2",
        text: "The four numbers that actually matter",
      },
      {
        type: "p",
        text: "You don't need 40 KPIs. You need four that you can defend in a one-on-one:",
      },
      {
        type: "ol",
        items: [
          "Win rate — won ÷ (won + lost). The cleanest measure of closing skill.",
          "Revenue closed — the sum of monetaryValue on won opportunities.",
          "Workload — open opportunities per rep, compared to the team average.",
          "Aging — opportunities untouched past 24h, 48h, and 7 days.",
        ],
      },
      {
        type: "callout",
        title: "Why aging is the silent killer",
        text: "A rep can have a great win rate and still bleed revenue if half their pipeline is rotting. Aging is the metric that turns 'busy' into 'effective.'",
      },
      {
        type: "h2",
        text: "Make it a 5-second scan, not a report",
      },
      {
        type: "p",
        text: "Reports get read once a quarter. A dashboard gets read every morning. The goal is a single screen that answers 'who makes money, who drops the ball, who's overloaded, where deals get stuck' before your coffee is cold. That's the entire premise behind a Rep Performance OS — turning GHL's raw snapshot into operational visibility.",
      },
      {
        type: "quote",
        text: "If you can't see it in five seconds, you won't act on it. Visibility is the whole product.",
      },
      {
        type: "h2",
        text: "The catch: GHL gives you a snapshot, not history",
      },
      {
        type: "p",
        text: "GoHighLevel's API returns the current state of your opportunities — not a time-series. That means trend lines and 'time-in-stage' need storage. But everything in the four-number list above is computable from a single live snapshot, which is why you can get real visibility today without a database, without exports, and without storing a thing.",
      },
    ],
  },
  {
    slug: "sales-pipeline-metrics-gohighlevel-2026",
    title:
      "The 7 Sales Pipeline Metrics Every GoHighLevel Agency Should Watch in 2026",
    description:
      "The seven snapshot-derivable pipeline metrics that predict revenue for GoHighLevel sales teams — and exactly how to calculate each one.",
    category: "Metrics",
    date: "2026-05-21",
    readingTime: "9 min read",
    keywords: [
      "sales pipeline metrics",
      "gohighlevel kpis",
      "pipeline value",
      "close rate",
      "sales dashboard 2026",
    ],
    excerpt:
      "Vanity metrics feel good. These seven actually predict next month's revenue.",
    content: [
      {
        type: "p",
        text: "There's a difference between metrics that look impressive in a deck and metrics that change what you do on Monday. For a GoHighLevel sales team, these seven belong in the second category. Every one of them can be computed from a live opportunity snapshot.",
      },
      { type: "h2", text: "1. Pipeline value" },
      {
        type: "p",
        text: "The sum of monetaryValue across all open opportunities. This is your forward-looking fuel gauge. If it's shrinking week over week, no amount of closing skill will save next quarter.",
      },
      { type: "h2", text: "2. Revenue closed" },
      {
        type: "p",
        text: "The sum of monetaryValue on won opportunities. Simple, but the one everyone agrees on. Break it down per rep and you have your leaderboard.",
      },
      { type: "h2", text: "3. Close rate" },
      {
        type: "p",
        text: "Won ÷ (won + lost). Note what's missing: open deals. A close rate that includes open opportunities is just optimism with extra steps.",
      },
      { type: "h2", text: "4. Average deal size" },
      {
        type: "p",
        text: "Revenue closed ÷ number of won deals. This tells you whether a rep wins big or wins often — two very different coaching conversations.",
      },
      { type: "h2", text: "5. Deal-cycle length" },
      {
        type: "p",
        text: "The time from createdAt to the last status change on closed deals. Shorter cycles mean faster cash and more shots on goal per month.",
      },
      { type: "h2", text: "6. Workload distribution" },
      {
        type: "p",
        text: "Open opportunities per rep versus the team average. Overloaded reps drop deals; underloaded reps cost you payroll. Both show up here.",
      },
      { type: "h2", text: "7. Aging buckets" },
      {
        type: "p",
        text: "Counts of opportunities untouched past 24h, 48h, and 7 days. This is your early-warning system for revenue you're about to lose to silence.",
      },
      {
        type: "callout",
        title: "The 80/20 rule of pipeline reporting",
        text: "If you only have time for two, watch pipeline value (are we building enough?) and aging (are we letting it rot?). Those two catch most disasters before they happen.",
      },
      {
        type: "p",
        text: "The reason these seven win in 2026: they're real-time, they require no manual data entry, and they map directly to an action. That's the bar every metric should clear.",
      },
    ],
  },
  {
    slug: "spot-overloaded-sales-reps",
    title:
      "Why Your Best Closer Might Be Your Most Overloaded Rep (And How to Spot It)",
    description:
      "Overloading your top performer quietly caps revenue and burns out your best person. Here's how to detect rep overload from GoHighLevel opportunity data.",
    category: "Coaching",
    date: "2026-05-09",
    readingTime: "6 min read",
    keywords: [
      "sales rep overload",
      "workload distribution",
      "sales burnout",
      "lead routing",
      "gohighlevel assignment",
    ],
    excerpt:
      "Rewarding your best closer with more leads is how you quietly cap your own revenue.",
    content: [
      {
        type: "p",
        text: "It's the most natural move in sales management: your best closer is winning, so you feed them more leads. It feels like optimizing. It's actually rationing your own growth — and setting up your top performer to burn out.",
      },
      { type: "h2", text: "The overload trap, in numbers" },
      {
        type: "p",
        text: "Every closer has a ceiling on how many active opportunities they can work well. Push past it and win rate quietly drops, response times stretch, and good deals go stale because there simply aren't enough hours. The revenue you gained by adding leads gets erased by the deals that rot.",
      },
      {
        type: "ul",
        items: [
          "Win rate falls as active opportunity count climbs past the comfortable ceiling.",
          "Aging spikes — more deals sit untouched past 48 hours.",
          "Average response time creeps up, especially on lower-priority deals.",
        ],
      },
      { type: "h2", text: "How to spot it from a snapshot" },
      {
        type: "p",
        text: "You don't need a survey to find an overloaded rep. Compare each rep's open opportunity count to the team average. A rep carrying 1.5–2x the team's average load, especially with rising aging numbers, is your flashing red light.",
      },
      {
        type: "callout",
        title: "The relative-to-team rule",
        text: "Don't use a fixed threshold like '50 opps.' Use relative load. Overload is always relative to what the rest of the team is carrying.",
      },
      { type: "h2", text: "What to do about it" },
      {
        type: "ol",
        items: [
          "Rebalance new assignments toward reps below the team average.",
          "Protect your top closer's aging list — clear or reassign stale deals weekly.",
          "Treat capacity as a number you manage, not a hero you lean on.",
        ],
      },
      {
        type: "quote",
        text: "Your revenue ceiling isn't your best rep's skill. It's your worst distribution decision.",
      },
    ],
  },
  {
    slug: "stale-opportunities-ghl-aging-report",
    title:
      "Stop Losing Deals to Stale Opportunities: A GoHighLevel Aging Report Guide",
    description:
      "Stale opportunities are the quietest form of lost revenue. Learn how to build an aging report from GoHighLevel data and recover deals before they die.",
    category: "Playbook",
    date: "2026-04-27",
    readingTime: "7 min read",
    keywords: [
      "stale opportunities",
      "sales aging report",
      "follow up",
      "gohighlevel pipeline",
      "deal recovery",
    ],
    excerpt:
      "The deals you lose to silence never show up in a 'lost' report. That's what makes them dangerous.",
    content: [
      {
        type: "p",
        text: "When a deal is marked lost, at least you learn something. The deals that quietly go cold — no decision, no follow-up, just silence — never make it into a lost report. They're the most expensive opportunities you'll ever own, because you paid to acquire them and then let them evaporate.",
      },
      { type: "h2", text: "What counts as 'stale'?" },
      {
        type: "p",
        text: "Staleness is about time since last meaningful action. A practical three-tier system works for almost every team:",
      },
      {
        type: "ul",
        items: [
          "Untouched 24h+ — needs a first or next touch today.",
          "Untouched 48h+ — at real risk; momentum is fading.",
          "Stagnant 7d+ — effectively cold; recover or release.",
        ],
      },
      { type: "h2", text: "Building the report from GHL" },
      {
        type: "p",
        text: "Each opportunity carries a lastActionDate (or updatedAt). Compare it to now, bucket by the thresholds above, and group by the assigned rep. The result is an actionable stale list per person — not a chart, a to-do list.",
      },
      {
        type: "callout",
        title: "Make it per-rep, not team-wide",
        text: "A team-wide aging chart is interesting. A per-rep stale list is actionable. Always give the rep the exact deals to call back today.",
      },
      { type: "h2", text: "The recovery routine" },
      {
        type: "ol",
        items: [
          "Every morning, each rep clears their 24h list first.",
          "Twice a week, work the 48h list with a different angle or channel.",
          "Weekly, make a release-or-recover decision on the 7d+ list.",
        ],
      },
      {
        type: "p",
        text: "Stale opportunities don't need a new lead source to fix. They need visibility and a routine. The agencies that win in 2026 aren't buying more leads — they're letting fewer die.",
      },
    ],
  },
  {
    slug: "revenue-attribution-gohighlevel",
    title: "Revenue Attribution in GoHighLevel: Who Actually Closed That Deal?",
    description:
      "Revenue attribution turns guesswork into a leaderboard. Here's how to attribute closed and pipeline revenue per rep using GoHighLevel opportunity data.",
    category: "Metrics",
    date: "2026-04-14",
    readingTime: "6 min read",
    keywords: [
      "revenue attribution",
      "sales leaderboard",
      "gohighlevel reporting",
      "pipeline value",
      "payroll vs output",
    ],
    excerpt:
      "If you can't say who closed the revenue, you can't reward it, coach it, or repeat it.",
    content: [
      {
        type: "p",
        text: "Attribution sounds like a marketing word, but on the sales floor it's the most political number in the building. Get it right and your comp plan, your coaching, and your hiring all sharpen. Get it wrong and your best rep starts updating their resume.",
      },
      { type: "h2", text: "Three views of revenue" },
      {
        type: "p",
        text: "A complete attribution picture has three layers, all derivable from a snapshot:",
      },
      {
        type: "ul",
        items: [
          "Closed — revenue already won, per rep. Your scoreboard.",
          "Pipeline — open opportunity value, per rep. Your forecast.",
          "Projected — pipeline weighted by stage or close rate. Your realistic outlook.",
        ],
      },
      { type: "h2", text: "Pair revenue with cost" },
      {
        type: "p",
        text: "Output without cost is only half the story. When you put each rep's closed revenue next to their cost (payroll, draw, or commission base), you see true contribution — not just who's loud in the standup.",
      },
      {
        type: "callout",
        title: "Payroll-vs-output is a private number",
        text: "This is sensitive. Keep cost inputs in the owner's view only, and never store them anywhere they don't belong. Attribution should inform decisions, not leak salaries.",
      },
      { type: "h2", text: "Why snapshot attribution is enough to start" },
      {
        type: "p",
        text: "You might worry you need full historical tracking to attribute revenue. You don't, to begin. Current closed, pipeline, and projected values come straight from today's opportunities. Historical trends are a powerful Phase 2 upgrade — but you can build the leaderboard that changes behavior today.",
      },
      {
        type: "quote",
        text: "Attribution isn't about blame. It's about being able to repeat what worked.",
      },
    ],
  },
  {
    slug: "close-rate-vs-win-rate",
    title: "Close Rate vs. Win Rate: The Sales Metric Most Teams Get Wrong",
    description:
      "Close rate and win rate are not the same — and confusing them quietly distorts your forecast. A clear breakdown for GoHighLevel sales teams.",
    category: "Metrics",
    date: "2026-03-30",
    readingTime: "5 min read",
    keywords: [
      "close rate vs win rate",
      "sales conversion rate",
      "sales metrics",
      "forecasting",
      "gohighlevel",
    ],
    excerpt:
      "Two reps, same 'conversion rate,' wildly different reality. The definition is doing the damage.",
    content: [
      {
        type: "p",
        text: "Ask five sales leaders to define 'conversion rate' and you'll get five answers. That ambiguity isn't harmless — it quietly distorts forecasts, comp plans, and coaching. Let's fix the two terms that cause the most confusion.",
      },
      { type: "h2", text: "Win rate: skill at the finish line" },
      {
        type: "p",
        text: "Win rate is won ÷ (won + lost). It only counts deals that reached a decision. It answers a clean question: when a rep gets a real shot, how often do they convert it? This is the truest measure of closing skill because it ignores deals still in flight.",
      },
      { type: "h2", text: "Close rate: the looser cousin" },
      {
        type: "p",
        text: "Close rate is often defined as won ÷ total opportunities (including open). It's useful for volume forecasting, but it punishes reps with full, healthy pipelines and flatters reps who let open deals quietly disappear.",
      },
      {
        type: "callout",
        title: "The distortion in one example",
        text: "Two reps each won 10 and lost 10 — a 50% win rate each. But one has 30 open deals and the other has 5. By 'won ÷ total,' they look completely different, even though their closing skill is identical.",
      },
      { type: "h2", text: "Which to use when" },
      {
        type: "ul",
        items: [
          "Coaching individual reps? Use win rate — it isolates skill.",
          "Forecasting volume? Use a close rate, but define it consistently.",
          "Comparing reps fairly? Win rate, every time.",
        ],
      },
      {
        type: "p",
        text: "The fix isn't picking the 'right' metric. It's defining each one explicitly and using it for the job it's good at. A dashboard that computes both — from the same live data — ends the argument for good.",
      },
    ],
  },
];

export function getAllPosts(): Post[] {
  return [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
