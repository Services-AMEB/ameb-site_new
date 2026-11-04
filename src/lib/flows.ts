import evenementiel from '../data/flows/evenementiel.json';
import clinique from '../data/flows/clinique.json';
import msp from '../data/flows/msp.json';
import servicesPros from '../data/flows/services-pros.json';
import type { IconName } from '../components/icons/lucide';

export type FlowKey = 'evenementiel' | 'clinique' | 'msp' | 'services-pros';
export type FlowNode = { icon: IconName; fr: string; en: string };
export type Flow = { id: FlowKey; nodes: FlowNode[] };

export const FLOWS: Record<FlowKey, Flow> = {
  evenementiel: evenementiel as Flow,
  clinique: clinique as Flow,
  msp: msp as Flow,
  'services-pros': servicesPros as Flow,
};
export const FLOW_ORDER: FlowKey[] = ['services-pros', 'evenementiel', 'clinique', 'msp'];
