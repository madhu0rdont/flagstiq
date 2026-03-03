/**
 * Runs game plan generation in a worker thread so the main event loop
 * stays free for HTTP requests. Each call spawns a fresh worker; the
 * startup overhead (~50ms) is negligible vs. the multi-minute DP computation.
 */
import { Worker } from 'node:worker_threads';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { logger } from '../logger.js';
import type { GamePlan } from './game-plan.js';
import type { Club, Shot, CourseWithHoles } from '../models/types.js';
import type { ScoringMode } from './dp-optimizer.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WORKER_SCRIPT = join(__dirname, 'generate-plan-worker.js');

export interface PlanWorkerInput {
  clubs: Club[];
  shots: Shot[];
  course: CourseWithHoles;
  teeBox: string;
  mode: ScoringMode;
  roughPenalty: number;
}

export function generatePlanInWorker(input: PlanWorkerInput): Promise<GamePlan> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(WORKER_SCRIPT);

    worker.on('message', (msg: { ok: boolean; plan?: GamePlan; error?: string }) => {
      worker.terminate();
      if (msg.ok && msg.plan) {
        resolve(msg.plan);
      } else {
        reject(new Error(msg.error ?? 'Worker failed'));
      }
    });

    worker.on('error', (err) => {
      logger.error('Plan worker crashed', { error: String(err) });
      worker.terminate();
      reject(err);
    });

    worker.postMessage(input);
  });
}
