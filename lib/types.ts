export interface Experiment {
  id: string;
  date: string;
  claim: string;
  source: string;
  methodology: string;
  runs: number;
  verdict: 'SUPPORTED' | 'REFUTED' | 'PARTIALLY_SUPPORTED' | 'INCONCLUSIVE';
  confidence: number; // 1-10
  summary: string;
  tags: string[];
}

export interface DissentEntry {
  id: string;
  date: string;
  consensus: string;
  position: string;
  falsification: string; // "I'm wrong if..."
  status: 'ACTIVE' | 'VINDICATED' | 'WRONG' | 'PARTIAL';
  resolution?: string;
  resolvedDate?: string;
  tags: string[];
}

export interface Signal {
  id: string;
  date: string;
  title: string;
  source: string;
  url: string;
  category: 'claim' | 'news' | 'research' | 'release';
  status: 'UNREVIEWED' | 'TESTING' | 'TESTED' | 'FILTERED';
  experimentId?: string; // links to experiment if tested
  score?: number; // HN score or engagement metric
  summary?: string;
  tags: string[];
}

export interface DeathWatchEntry {
  id: string;
  date: string;
  target: string;
  prediction: string;
  indicators: string[];
  status: 'WATCHING' | 'DECLINING' | 'DEAD' | 'SURVIVED';
  lastCheckin: string;
  notes: string;
  tags: string[];
}
