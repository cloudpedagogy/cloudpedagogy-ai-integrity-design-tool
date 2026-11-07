/// <reference types="node" />
import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Batch 3: Production Build and Relative Path Compatibility', () => {
  const rootDir = path.resolve(__dirname, '../..');

  it('preserves base "./" in vite.config.ts', () => {
    const viteConfigPath = path.join(rootDir, 'vite.config.ts');
    const content = fs.readFileSync(viteConfigPath, 'utf-8');
    expect(content).toContain("base: './'");
  });

  it('uses relative asset paths in index.html with no root-absolute references', () => {
    const indexHtmlPath = path.join(rootDir, 'index.html');
    const content = fs.readFileSync(indexHtmlPath, 'utf-8');

    // Favicon should use relative path ./favicon.svg
    expect(content).toContain('href="./favicon.svg"');
    expect(content).not.toMatch(/href="\/favicon/);

    // Script entry point should use relative ./src/main.tsx
    expect(content).toContain('src="./src/main.tsx"');
    expect(content).not.toMatch(/src="\/src\/main\.tsx"/);

    // No root-absolute href or src paths
    const rootAbsoluteHref = content.match(/href="\/(?!\/)[^"]+"/g);
    const rootAbsoluteSrc = content.match(/src="\/(?!\/)[^"]+"/g);
    expect(rootAbsoluteHref).toBeNull();
    expect(rootAbsoluteSrc).toBeNull();
  });

  it('confirms the relative favicon asset exists in the public directory', () => {
    const faviconPath = path.join(rootDir, 'public', 'favicon.svg');
    expect(fs.existsSync(faviconPath)).toBe(true);
  });

  it('does not contain external third-party CDN script tags or telemetry scripts', () => {
    const indexHtmlPath = path.join(rootDir, 'index.html');
    const content = fs.readFileSync(indexHtmlPath, 'utf-8');

    expect(content).not.toMatch(/https?:\/\/cdn\./i);
    expect(content).not.toMatch(/google-analytics|googletagmanager/i);
  });

  it('generates production build with relative asset links in dist/index.html', () => {
    const distHtmlPath = path.join(rootDir, 'dist', 'index.html');
    if (fs.existsSync(distHtmlPath)) {
      const content = fs.readFileSync(distHtmlPath, 'utf-8');
      expect(content).toContain('href="./favicon.svg"');
      expect(content).toMatch(/src="\.\/assets\/index-[^"]+\.js"/);
      expect(content).toMatch(/href="\.\/assets\/index-[^"]+\.css"/);
      expect(content).not.toMatch(/src="\/assets\//);
      expect(content).not.toMatch(/href="\/assets\//);
    }
  });
});
