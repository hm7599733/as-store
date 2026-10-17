const ipOrderAttempts = new Map<string, { count: number; resetAt: number }>();

const MAX_ORDERS = 5;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

export function checkCheckoutRateLimit(request: Request): {
  success: boolean;
  retryAfterSeconds?: number;
} {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
  const now = Date.now();

  const record = ipOrderAttempts.get(ip);

  if (!record || now > record.resetAt) {
    ipOrderAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { success: true };
  }

  if (record.count >= MAX_ORDERS) {
    const retryAfterSeconds = Math.ceil((record.resetAt - now) / 1000);
    return { success: false, retryAfterSeconds };
  }

  record.count += 1;
  return { success: true };
}
