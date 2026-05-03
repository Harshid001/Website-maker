const buckets = new Map();

const createRateLimiter = ({ windowMs = 60 * 1000, max = 30 } = {}) => {
  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const bucket = buckets.get(key) || { count: 0, resetAt: now + windowMs };

    if (now > bucket.resetAt) {
      bucket.count = 0;
      bucket.resetAt = now + windowMs;
    }

    bucket.count += 1;
    buckets.set(key, bucket);

    if (bucket.count > max) {
      return res.status(429).json({
        success: false,
        message: 'Too many AI requests. Please wait a moment and try again.',
      });
    }

    return next();
  };
};

module.exports = { createRateLimiter };
