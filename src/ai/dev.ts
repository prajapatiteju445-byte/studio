import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-incident-reports.ts';
import '@/ai/flows/suggest-thresholds.ts';
import '@/ai/flows/reason-about-notification-methods.ts';