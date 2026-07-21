import { type RequestHandler } from 'express';

/**
 * Example: 
 * req.headers.cookie = "accessToken=123abc; theme=dark; refreshToken=123abc"
 * Populates `req.cookies` with a key-value object for easy access.
 */
export const cookieParser: RequestHandler = (req, res, next) => {
  const cookieHeader = req.headers.cookie;
  req.cookies = {};
  if (!cookieHeader) return next();

  for (const cookie of cookieHeader.split(';')) {
    const [name, ...rest] = cookie.trim().split('=');

    // We split with "=" and take ...rest because we don't know if value itself contain "=" then it breaks
    // name = "accessToken" rest = [abc, ghi]
    // cookie values are often url encoded
    // and use decoded value "Vinod%Kumar" => "VinodKumar"
    req.cookies[name] = decodeURIComponent(rest.join('='));
  }

  next();
};
