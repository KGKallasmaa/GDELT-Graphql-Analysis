function getDomain(url) {
  let hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf('//') > -1) {
    hostname = url.split('/')[2];
  } else {
    hostname = url.split('/')[0];
  }
  //find & remove port number
  hostname = hostname.split(':')[0];
  //find & remove "?"
  hostname = hostname.split('?')[0];
  // remove wwww
  if (hostname.substring(0, 4) === 'www.') {
    hostname = hostname.substring(4, hostname.length);
  }
  return hostname;
}
exports.getDomain = getDomain;
