export default function info(...stuff) {
  if (process.env.NODE_ENV === 'development') {
    return console.info(...stuff);
  }
}
