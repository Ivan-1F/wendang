import { createContent } from 'fuma-content/bun';

export const content = await createContent();

// Register loader plugins for Bun
Bun.plugin(content.createBunPlugin());
