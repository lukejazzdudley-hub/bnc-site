#!/usr/bin/env node

import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';


function extract(source, pattern, label) {
  const value = source.match(pattern)?.[1];
  if (!value) throw new Error(`Could not extract ${label} from native CadenceLogo source`);
  return value;
}

function run(binary, args) {
  const result = spawnSync(binary, args, { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${basename(binary)} exited ${result.status}`);
}

function cubicBezier(x1, y1, x2, y2, progress) {
  const sample = (point, a, b) => {
    const inverse = 1 - point;
    return 3 * inverse * inverse * point * a
      + 3 * inverse * point * point * b
      + point * point * point;
  };
  const slope = (point, a, b) => {
    const inverse = 1 - point;
    return 3 * inverse * inverse * a
      + 6 * inverse * point * (b - a)
      + 3 * point * point * (1 - b);
  };

  let point = progress;
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const difference = sample(point, x1, x2) - progress;
    const derivative = slope(point, x1, x2);
    if (Math.abs(difference) < 1e-7 || Math.abs(derivative) < 1e-7) break;
    point -= difference / derivative;
  }
  point = Math.min(1, Math.max(0, point));
  return sample(point, y1, y2);
}

function svgFrame({ spine, spineLength, cPath, notePath, stops, draw, drop }) {
  const dashOffset = (1 - draw) * spineLength;
  const rotation = (1 - draw) * -16;
  const noteY = (1 - drop) * -84;
  const noteOpacity = Math.min(1, Math.max(0, drop * 3));
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 120 120" fill="none">
  <defs>
    <linearGradient id="cadGrad" x1="0.15" y1="0" x2="0.85" y2="1">
      <stop offset="0" stop-color="${stops[0]}" />
      <stop offset="0.42" stop-color="${stops[1]}" />
      <stop offset="0.72" stop-color="${stops[2]}" />
      <stop offset="1" stop-color="${stops[3]}" />
    </linearGradient>
    <mask id="cMask" maskUnits="userSpaceOnUse">
      <path d="${spine}" stroke="#fff" stroke-width="34" fill="none" stroke-linecap="round" stroke-dasharray="${spineLength} ${spineLength}" stroke-dashoffset="${dashOffset}" />
    </mask>
  </defs>
  <g transform="rotate(${rotation} 52 58)" mask="url(#cMask)">
    <path d="${cPath}" fill="url(#cadGrad)" stroke="#fff" stroke-opacity="0.28" stroke-width="0.8" stroke-linejoin="round" />
  </g>
  <path d="${notePath}" transform="translate(0 ${noteY})" opacity="${noteOpacity}" fill="url(#cadGrad)" stroke="#fff" stroke-opacity="0.28" stroke-width="0.8" stroke-linejoin="round" />
</svg>`;
}

function main() {
  const [sourceArgument, outputArgument] = process.argv.slice(2);
  if (!sourceArgument || !outputArgument) {
    throw new Error('Usage: render_cadence_mark.mjs NATIVE_CADENCE_LOGO_TSX OUTPUT_DIRECTORY');
  }
  const source = readFileSync(resolve(sourceArgument), 'utf8');
  const outputDirectory = resolve(outputArgument);
  const spine = extract(source, /const SPINE = '([^']+)'/, 'SPINE');
  const spineLength = Number(extract(source, /const SPINE_LEN = (\d+)/, 'SPINE_LEN'));
  const cPath = extract(source, /const C_PATH = '([^']+)'/, 'C_PATH');
  const notePath = extract(source, /const NOTE_PATH = '([^']+)'/, 'NOTE_PATH');
  const easingMatches = [...source.matchAll(/Easing\.bezier\(([^)]+)\)/g)];
  if (easingMatches.length !== 2) throw new Error('Expected exactly two native easing curves');
  const [drawCurve, dropCurve] = easingMatches.map((match) => match[1].split(',').map(Number));
  const stops = extract(source, /const SILVER_STOPS:[^=]+=\s*\[([^\]]+)\]/, 'SILVER_STOPS')
    .match(/#[0-9A-Fa-f]{6}/g);
  if (!stops || stops.length !== 4) throw new Error('Expected four native silver stops');
  for (const lock of ['duration: 760', '* -16', 'withDelay(310', 'duration: 800']) {
    if (!source.includes(lock)) throw new Error(`Native animation lock changed: ${lock}`);
  }

  const browserBin = process.env.BROWSER_BIN
    || (process.platform === 'darwin'
      ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      : '/usr/bin/google-chrome');
  const work = mkdtempSync(join(tmpdir(), 'cadence-mark-'));
  const framePaths = [];
  try {
    const frameCount = 35;
    for (let index = 0; index < frameCount; index += 1) {
      const elapsed = Math.min(1120, index * (1000 / 30));
      const drawProgress = cubicBezier(...drawCurve, Math.min(1, elapsed / 760));
      const dropTime = Math.min(1, Math.max(0, (elapsed - 310) / 800));
      const dropProgress = cubicBezier(...dropCurve, dropTime);
      const stem = `cadence-mark-${String(index).padStart(3, '0')}`;
      const svgPath = join(work, `${stem}.svg`);
      const pngPath = join(work, `${stem}.png`);
      writeFileSync(svgPath, svgFrame({
        spine,
        spineLength,
        cPath,
        notePath,
        stops,
        draw: drawProgress,
        drop: dropProgress,
      }));
      run(browserBin, [
        '--headless',
        '--hide-scrollbars',
        '--disable-gpu',
        '--force-device-scale-factor=1',
        '--default-background-color=00000000',
        '--window-size=256,256',
        `--screenshot=${pngPath}`,
        pathToFileURL(svgPath).href,
      ]);
      framePaths.push(pngPath);
    }

    const animated = join(outputDirectory, 'cadence-mark.webp');
    const staticMark = join(outputDirectory, 'cadence-mark-static.webp');
    const animationArguments = ['-loop', '0', '-min_size'];
    for (const frame of framePaths) animationArguments.push('-d', '33', '-lossless', '-exact', frame);
    animationArguments.push('-o', animated);
    run('img2webp', animationArguments);
    run('cwebp', ['-quiet', '-lossless', '-exact', framePaths.at(-1), '-o', staticMark]);
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

main();
