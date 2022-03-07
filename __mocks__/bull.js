export default function(msg) {
  const done = () => {
    console.log('done');
  };
  const job = {
    id: 1,
    data: {
      message: 'This is a sample job'
    }
  };
  return {
    data: msg,
    process: fn => fn(job, done),
    add: (name, repeat) => name && repeat
  };
}
