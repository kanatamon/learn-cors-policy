# Learn CORS, How to use it, And How to Broke It

## Table of Contents (branch oriented)

I intentionally separated the source code into 2 branches

1. `main` - Basic of what it CORS and how to use it
2. `bad-example` - How to broke CORS intentionally

TODO: Add topic links

## Our Story

Let's say we would like to make a bank app where user could do 2 things

1. User could be able to see their amount of account's balance
2. User could be able to transfer their much of account's balance to another account

That's it, just 2 simple requirements, But for this learning CORS lesson. Then
we would separate the system into 2 sub-systems where each run independently.
So each of them run in different origin.

1. _http://localhost:4000_ for API's server where data's persisting
2. _http://127.0.0.1:3000_ for static'site server

For authentication, using cookie and absolutely on cross-site.

## Simple Request

Simple request is either HTTP's method `GET` or `POST` **without** modified headers.
You could see the example on _/package/web-client/src/App.ts_ when we do _fetch_
for login, logout, and getting account data.

```ts
// eg 1. Logout
await fetch(`${API_ENDPOINT}/logout`, {
  method: 'POST',
  credentials: 'include',
});

// eg 2. Getting account data
await fetch(`${API_ENDPOINT}/account`, {
  credentials: 'include',
});
```

> Note that `credentials: 'include'` would let the browser send any httpOnly cookies
> along with a request. And this is NOT modification to headers.

What differ to normal HTTP's request is that a request would fire to differ origin.
And then CORS's policy would start dominating by the browser, where the browser
is going to expect checking the responded header should include `Access-Control-Allow-Origin`
with value of the client's origin to matches with. Otherwise the browser will throw
an error with something like this **Access to fetched has been blocked by CORS policy**.

```HTTP
# This is HTTP request when a simple request fired

# When cross-site request is made
GET http://api.server HTTP/1.1

# Then the browser automatically adds an extra header to the HTTP request
# `Origin` where the value is the origin where the request came from
Origin: http://client.app
```

```HTTP
# This is HTTP response what browser expected

HTTP/1.1 200 OK

# The response should include this header with matching `Origin` fired on the first place
Access-Control-Allow-Origin: http://client.app
...
```

## Preflight Request

TODO: Add description

## Cache Preflight Request

TODO: Add description

## Set Cookies Across Origin

TODO: Add description

## Why Browser Doesn't Set Cookie Even Server Responded `Set-Cookie`'s Header ?

Normally, HTTPS is required for secured http-only while browser is trying to set
cookie for `Set-Cookie` in response's header.

But in development's environment, we often being in local machine and then
_http://localhost_ or _http://127.0.0.1_ are what we're familiar to. And you
might expect that secured http-only won't work in localhost despite to [the
specification](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite#none). But as I did experimented, it did work in localhost if we're
following either of these rules

- Connection on server and client are both localhost
- Connection on server and client are both HTTPS

And as the specification mentioned, there might be some helpful WARNING in some
browser which will give you a clue to investigate. But, if it NOT, you should know
some keyword and instructions to investigate yourself too.

TODO: Add keyword and instructions, this might be a checklist

https://stackoverflow.com/a/67001424/3741801

## References

- Concrete implementation to set secure httponly cookies with express -> [read more](https://cheatcode.co/tutorials/how-to-implement-secure-httponly-cookies-in-node-js-with-express)

- Original blog -> [read more](https://dev.to/lydiahallie/cs-visualized-cors-5b8h#cs-cors)

- Check lists to set CORS cookie 0 -> [read more](https://stackoverflow.com/a/67001424/3741801)

- Things to notice about cache CORS request -> [read more](https://httptoolkit.tech/blog/cache-your-cors/)
