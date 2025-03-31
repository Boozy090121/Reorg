# Netlify Deployment README

This folder contains a Netlify-ready version of the Quality Re-organization Tool. This README provides instructions for deploying the application to Netlify.

## Quick Deployment

For the simplest deployment experience:

1. Log in to your Netlify account
2. Go to the "Sites" section
3. Drag and drop this entire folder onto the Netlify dashboard
4. Wait for the deployment to complete
5. Access your site at the provided Netlify URL

That's it! Netlify will automatically detect the configuration and build the application for you.

## Manual Deployment Steps

If you prefer to use the Netlify CLI or want more control over the deployment process:

### Using Netlify CLI

1. Install the Netlify CLI if you haven't already:
   ```
   npm install -g netlify-cli
   ```

2. Log in to your Netlify account:
   ```
   netlify login
   ```

3. Navigate to this folder and initialize a new Netlify site:
   ```
   cd path/to/this/folder
   netlify init
   ```

4. Follow the prompts to create a new site or connect to an existing one

5. Deploy the site:
   ```
   netlify deploy --prod
   ```

### Using Netlify UI with Git

1. Push this folder to a Git repository (GitHub, GitLab, or Bitbucket)

2. Log in to your Netlify account

3. Click "New site from Git"

4. Select your Git provider and repository

5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `build`

6. Click "Deploy site"

## Configuration

The deployment is pre-configured with:

- `netlify.toml` - Contains build settings and redirect rules
- Optimized package.json with all required dependencies
- Proper public folder structure

## Custom Domain

To use a custom domain with your deployed application:

1. Go to your site settings in Netlify
2. Navigate to "Domain management"
3. Click "Add custom domain"
4. Follow the instructions to set up your domain

## Environment Variables

If you need to add environment variables:

1. Go to your site settings in Netlify
2. Navigate to "Build & deploy" > "Environment"
3. Click "Edit variables"
4. Add your environment variables

## Troubleshooting

If you encounter any issues during deployment:

1. Check the Netlify build logs for errors
2. Ensure all dependencies are correctly listed in package.json
3. Verify that the netlify.toml file is in the root directory
4. Make sure the public folder contains all necessary assets

For more help, refer to the Netlify documentation at https://docs.netlify.com/
