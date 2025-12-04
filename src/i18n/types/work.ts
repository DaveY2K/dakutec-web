// src/i18n/types/work.ts
export type WorkItem = {
  title: string;
  image: string;      // musí existovat v /public/work/
  tags?: string[];
  caption?: string;   // volitelný krátký popis
  placeholder?: boolean; // volitelně pro označení ukázky
};

export type WorkDict = {
  title: string;
  subtitle?: string;
  filterAll: string;
  shuffle: string;
  items: WorkItem[];
};
