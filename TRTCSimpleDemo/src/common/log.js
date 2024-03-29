export default class Log  {
  constructor(prefix) {
    this.mark = 'TRTCSimpleDemo';
    this.prefix = prefix || '';
  }

  setPrefix(param) {
    let prefix = `${getTime()} [${this.mark}`;
    if (this.prefix.length > 0) {
      prefix += `.${this.prefix}]:`;
    } else {
      prefix += ']:';
    }
    param.unshift(prefix);
  }

  log() {
    const param = Array.from(arguments);
    this.setPrefix(param);
    console.log.apply(console, param);
  }

  warn() {
    const param = Array.from(arguments);
    this.setPrefix(param);
    console.warn.apply(console, param);
  }

  error() {
    const param = Array.from(arguments);
    this.setPrefix(param);
    console.error.apply(console, param);
  }
}

function getTime() {
  const date = new Date();
  return `${date.toLocaleTimeString('en-US', {
    hour12: false,
  })}.${padMs(date.getMilliseconds())}`
}

function padMs(ms) {
  const len = ms.toString().length;
  let ret;
  switch (len) {
    case 1:
      ret = `00${ms}`;
      break;
    case 2:
      ret = `0${ms}`;
      break;
    default:
      ret = ms;
      break;
  }

  return ret;
}
