import express from 'express';
import cookieParser from 'cookie-parser';
import { findAccount } from './account.model';

const PORT = 4000;
const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000;
const ALLOWED_ORIGIN = 'http://127.0.0.1:3000';

const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  // CORS configuration for simple request
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    // CORS configuration for preflight request
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 💡 In order to reduce the number of preflighted request, we can cache it.
    // And then the browser can use instead of sending a new preflighted request.
    //
    // ✋🏼 If you're using CDN, the caching is absolutely be differ.
    //
    // ✋🏼 Differ browser limit the caching time
    // - Firefox value to 86400 (24 hours)
    // - Chromium-based value to 7200 (2 hours)
    // Source: https://httptoolkit.tech/blog/cache-your-cors/
    res.setHeader('Access-Control-Max-Age', '86400');

    res.end();
  }

  if (req.method !== 'OPTIONS') {
    next();
  }
});

app.get('/account', (req, res) => {
  const accountName = req.cookies?.accountName ?? undefined;
  if (typeof accountName !== 'string') {
    return res.status(401).json({ errorMessage: `You've not logged in yet` });
  }

  const account = findAccount(accountName);
  if (!account) {
    return res.status(401).json({
      errorMessage: `Account '${accountName}' is not found.`,
    });
  }

  return res.json({
    data: account,
  });
});

app.post('/transfer', (req, res) => {
  // TODO: add implementation
  res.status(401).json({ errorMessage: 'No permission' });
});

app.post('/login', (req, res) => {
  const accountName = req.body?.accountName ?? undefined;
  if (typeof accountName !== 'string') {
    return res.status(400).json({
      errorMessage: `Expected 'accountName' to be in body, but there is not.`,
    });
  }

  const account = findAccount(accountName);
  if (!account) {
    return res.status(401).json({
      errorMessage: `Account '${accountName}' is not found.`,
    });
  }

  return res
    .cookie('accountName', accountName, {
      expires: new Date(Date.now() + THIRTY_DAYS_IN_MS),
      secure: true,
      httpOnly: true,
      sameSite: 'none',
    })
    .json({});
});

app.post('/logout', (req, res) => {
  return res
    .clearCookie('accountName', {
      secure: true,
      httpOnly: true,
      sameSite: 'none',
    })
    .json({});
});

app.listen(PORT, () => {
  console.log(`api-server listening at http://localhost:${PORT}`);
});
