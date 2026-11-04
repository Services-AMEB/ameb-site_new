/**
 * Plugin Sätteri (processeur Markdown d'Astro 7) : typographie française sur
 * les nœuds texte des fichiers Markdown situés dans un dossier « fr/ ».
 * Le code, les URL et le HTML brut ne sont pas touchés (seuls les nœuds « text »).
 */
import type { MdastPluginEntry } from 'satteri';
import { typoFr } from './typo.ts';

export const typoFrPlugin: MdastPluginEntry = (ctx) => {
  const path = ctx.fileURL?.pathname ?? '';
  if (!/[\\/]fr[\\/]/.test(path)) return null;
  return {
    name: 'ameb-typo-fr',
    text(node, context) {
      const next = typoFr(node.value);
      if (next !== node.value) context.setProperty(node, 'value', next);
    },
  };
};
