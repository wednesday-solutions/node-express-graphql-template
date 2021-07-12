import { logger } from '@utils';

export default function logReqRes(req, res, next) {
  const oldWrite = res.write;
  const oldEnd = res.end;

  const chunks = [];

  res.write = (...restArgs) => {
    chunks.push(Buffer.from(restArgs[0]));
    oldWrite.apply(res, restArgs);
  };

  res.end = (...restArgs) => {
    if (restArgs[0]) {
      chunks.push(Buffer.from(restArgs[0]));
    }
    const body = Buffer.concat(chunks).toString('utf8');

    logger().info(
      JSON.stringify({
        time: new Date().toUTCString(),
        fromIP: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        method: req.method,
        originalUri: req.originalUrl,
        uri: req.url,
        requestData: req.body,
        responseData: body,
        referer: req.headers.referer || '',
        ua: req.headers['user-agent']
      })
    );

    oldEnd.apply(res, restArgs);
  };

  next();
}
