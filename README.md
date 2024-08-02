# Creek Software challenge

The challenge is as follow:

1. Create a nodejs express API with AWS lambda, Google Cloud, Heroku or similar
2. Make sure you have some basic security in your app that protects from incoming
   malicious requests (like a secret string)
3. Your API should have one endpoint that accepts a string parameter, fetches a
   random image from a third party service, like imgur.com or similar, applies the string to
   that image and finally sends it back to the client
4. The string must be aligned vertically and horizontally within the image. The text size
   and color are arbitrary
5. Use a 3rd party package to process the image
6. It’s ideal to see a fully deployed, live example

## Basic security

We add a Middleware which checks the secret string added by the user in the URL and compare it with the .env file one:

```javascript
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.query.secret !== secretString) {
    return res.status(401).send("Unauthorized");
  }
  next();
});
```

## Endpoint

The endpoint fetches an URL from imgur (choose the first one I saw), and uses `sharp` which is a library to manipulate images. The idea was to take a text input by the user and turn it into an SVG, then combine it with the image itself using `composite` from `sharp` and finally you send it as a response to the user.

## String aligned

We take the metadata from the image which can return the width and height, we just divide it in half to get the center of the image which is where we will locate the text. The SVG will take the whole height and width.

## Third party library

Used `sharp` since it offers different solutions for image manipulation like rotating or change using SVG which gives us a lot of room for manipulation of the string we input.

## Deploy site

Didn't use Heroku or Fly, instead I used a self-hosted domain using Cloudflare:

http://adri.brielov.com:3000/

There you can use Postman or Thunderclient in VS Code, to get the right information

The .env file you need to add should have the following:

```bash
SECRET_STRING=secret_super_secret
PORT=3000
```
