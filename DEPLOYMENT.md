# Deployment Guide - Heroku

This guide will help you deploy your Book Store API to Heroku for production.

## Prerequisites

1. **Heroku Account** - Sign up at https://www.heroku.com
2. **Heroku CLI** - Download from https://devcenter.heroku.com/articles/heroku-cli
3. **Git** - Version control system
4. **MongoDB Atlas Account** - For cloud database (or use local MongoDB)

---

## Step 1: Prepare Your Project

### Verify package.json has correct start script

Check that your `package.json` has:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js",
  "test": "jest"
}
```

### Add a Procfile

Create a `Procfile` in your project root:

```
web: node server.js
```

This tells Heroku how to run your application.

### Update .env for Production

Create `.env.production`:
```
NODE_ENV=production
PORT=process.env.PORT (Heroku sets this automatically)
MONGODB_URI=mongodb+srv://username:password@cluster-xxx.mongodb.net/bookstore
SESSION_SECRET=your-super-secret-key
JWT_SECRET=your-jwt-secret-key
```

---

## Step 2: Set Up Git Repository

If not already done:

```bash
cd c:\Users\HP\Documents\Bookstore
git init
git add .
git commit -m "Initial commit: Book Store API with MongoDB"
```

---

## Step 3: Deploy to Heroku

### Login to Heroku

```bash
heroku login
```

This opens a browser to authenticate.

### Create Heroku App

```bash
heroku create your-app-name
```

Replace `your-app-name` with a unique name (e.g., `my-bookstore-api`).

### Set Environment Variables

```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=mongodb+srv://username:password@cluster-xxx.mongodb.net/bookstore
heroku config:set SESSION_SECRET=your-super-secret-key
heroku config:set JWT_SECRET=your-jwt-secret-key
```

### Deploy Your Code

```bash
git push heroku main
```

Or if using `master` branch:
```bash
git push heroku master
```

---

## Step 4: View Your Application

```bash
heroku open
```

This opens your app in the browser. Your API is now live!

**Example URLs:**
- Health check: `https://your-app-name.herokuapp.com/api/health`
- Get books: `https://your-app-name.herokuapp.com/api/books`
- Dashboard: `https://your-app-name.herokuapp.com/`

---

## Step 5: Monitor Logs

```bash
heroku logs --tail
```

This shows real-time logs. Useful for debugging.

---

## MongoDB Atlas Setup for Production

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get the connection string
4. In Heroku, set the `MONGODB_URI` config variable with your connection string

**Important:** Whitelist the Heroku IP addresses in MongoDB Atlas:
- Go to MongoDB Atlas Dashboard
- Click "Network Access"
- Add IP `0.0.0.0/0` (allows all IPs - not ideal for production, but works for testing)

---

## Common Issues

### "Application Error" on page load

```bash
heroku logs --tail
```

Check the logs for errors. Usually missing environment variables.

### "Cannot connect to MongoDB"

- Check `MONGODB_URI` is set correctly
- Verify IP addresses are whitelisted in MongoDB Atlas
- Ensure database name matches

### Port issues

Heroku automatically sets `process.env.PORT`. Make sure your app listens to it:

```javascript
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {...});
```

---

## Scale Your Application

As traffic grows, you may need more resources:

```bash
# View current dyno type
heroku ps

# Scale to multiple dynos
heroku ps:scale web=2

# View costs
heroku billing
```

---

## Continuous Deployment (Optional)

Connect GitHub for automatic deployments:

1. In Heroku Dashboard, go to your app
2. Click "Deploy" tab
3. Connect to GitHub
4. Select your repository
5. Enable "Automatic Deploys"

Now every push to your GitHub repo automatically deploys to Heroku!

---

## Remove/Delete App

```bash
heroku apps:destroy --app your-app-name
```

---

## Alternative Hosting Platforms

If not using Heroku, try:

- **Railway.app** - Similar to Heroku, free tier available
- **Render.com** - Easy deployment
- **AWS** - More complex but powerful
- **DigitalOcean** - Affordable VPS
- **Fly.io** - Global deployment

---

## Production Checklist

Before going live:

✅ Set `NODE_ENV=production`  
✅ Use strong SESSION_SECRET and JWT_SECRET  
✅ Configure MongoDB Atlas in production mode  
✅ Enable HTTPS (automatic on Heroku)  
✅ Set up error logging  
✅ Test all endpoints on production  
✅ Monitor performance  
✅ Set up automated backups  
✅ Configure CORS if using separate frontend  

Your Book Store API is now ready for production! 🚀
