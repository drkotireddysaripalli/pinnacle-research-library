import type { ImageMetadata } from 'astro';

/** Shared presentation accepts service-specific content; no implicit speech defaults. */
export interface ServiceContent {
  id: string;
  path: string;
  label: string;
  name: string;
  type: string;
  title: string;
  description: string;
  citations: string[];
  assessmentOffer?: { name: string; price: number; priceCurrency: string; url: string };
  image: { source: ImageMetadata; alt: string; caption: string };
  hero: { heading: string; emphasis: string; lead: string; copy: string; moments: {icon:string;label:string}[] };
  pathway: { stages: string[][]; image: ImageMetadata; alt: string; caption: string };
  concerns: {icon:string;title:string;copy:string}[];
  faqs: {question:string;answer:string}[];
}
