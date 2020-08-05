export const originUrl = process.env.ORIGINURL || '';

export const mapUrl = process.env.MAP_URL
  ? `http://${process.env.MAP_URL}`
  : 'http://10.10.10.7:9077';
