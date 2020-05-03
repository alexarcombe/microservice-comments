function buildMakeSource({ isValidIp }) {
  return function makeSource({ ip, browser, referrer } = {}) {
    if (!ip) {
      throw new Error('Comment source must contain an IP.');
    }
    if (!isValidIp(ip)) {
      throw new RangeError('Comment source must contain a valid IP.');
    }
    return Object.freeze({
      ip,
      browser,
      referrer,
    });
  };
}

module.exports = buildMakeSource;
