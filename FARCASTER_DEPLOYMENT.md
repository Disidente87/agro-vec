# 🌱 Farcaster Mini App Deployment Guide - Agro-bootcamp

## Overview

This guide explains how to deploy your Agro-bootcamp app as a Farcaster Mini App and ensure it appears correctly in the preview.

## What We've Implemented

### 1. Farcaster Mini App Integration
- ✅ Implemented custom Farcaster Mini App integration (no external dependencies)
- ✅ Created Farcaster provider component with `ready()` function
- ✅ Added Mini App metadata to layout
- ✅ Created manifest file at `/.well-known/farcaster.json`
- ✅ Generated dynamic OG image and icon for Mini App

### 2. Key Components

#### Farcaster Provider (`src/components/farcaster-provider.tsx`)
```typescript
// Handles the ready() function call that Farcaster requires
useEffect(() => {
  const initFarcasterMiniApp = () => {
    // Multiple methods to initialize Mini App
    if (window.FarcasterMiniApp) {
      window.FarcasterMiniApp.init(config)
      window.FarcasterMiniApp.ready()
    }
  }
  initFarcasterMiniApp()
}, [])
```

#### Mini App Manifest (`public/.well-known/farcaster.json`)
```json
{
  "accountAssociation": {
    "header": "...",
    "payload": "...",
    "signature": "..."
  },
  "frame": {
    "version": "1",
    "name": "Agro-bootcamp",
    "iconUrl": "https://...",
    "homeUrl": "https://..."
  }
}
```

#### Dynamic Images
- **OG Image**: `/og-image` (1200x630) for previews
- **Icon**: `/icon` (200x200) for splash screen

## Deployment Steps

### 1. Deploy to Vercel
```bash
# Make sure you're in the project directory
cd /home/disidente/bootcamp-vec/agro-bootcamp

# Build the project
npm run build

# Deploy to Vercel (if not already deployed)
vercel --prod
```

### 2. Verify Your Domain
Ensure your app is deployed at: `https://agro-gy7aqkudn-disidentes-projects.vercel.app`

### 3. Test Mini App Integration
Visit: `https://agro-gy7aqkudn-disidentes-projects.vercel.app/test-frame`

This page will show:
- ✅ Farcaster Mini App Detection
- ✅ Ready Function Status
- ✅ Manifest Status
- ✅ Debug Information
- ✅ Mini App Metadata

### 4. Submit to Farcaster
1. Go to [Farcaster Developer Portal](https://developer.farcaster.xyz/)
2. Create a new Mini App
3. Use your app URL: `https://agro-gy7aqkudn-disidentes-projects.vercel.app`
4. The manifest will be automatically detected at `/.well-known/farcaster.json`

## Mini App Metadata

Your app includes these Mini App metadata tags:

```html
<meta name="fc:miniapp" content='{"version":"1","imageUrl":"...","button":{...}}' />
```

## Troubleshooting

### Issue: Preview Not Showing
**Solution**: The `ready()` function is now properly implemented with multiple fallback methods:

1. **Check Console**: Open browser dev tools and look for:
   ```
   "Farcaster Mini App initialized and ready"
   "Farcaster ready called via window.farcaster"
   "Farcaster ready called via window.ready"
   "Farcaster ready event dispatched"
   ```

2. **Test Page**: Visit `/test-frame` to verify integration

3. **Verify Manifest**: Check that manifest is accessible at `/.well-known/farcaster.json`

### Issue: Manifest Not Found
**Solution**: The manifest file is created at `public/.well-known/farcaster.json`:

- **URL**: `https://agro-gy7aqkudn-disidentes-projects.vercel.app/.well-known/farcaster.json`
- **Content**: Valid JSON with accountAssociation and frame objects
- **Status**: Should return HTTP 200

### Issue: Images Not Loading
**Solution**: The dynamic image routes generate images on-demand:

- **OG Image**: `https://agro-gy7aqkudn-disidentes-projects.vercel.app/og-image`
- **Icon**: `https://agro-gy7aqkudn-disidentes-projects.vercel.app/icon`
- **Format**: Proper aspect ratios for Mini App requirements

## Performance Optimization

### Web Performance Best Practices
- ✅ **Minimal Loading Time**: Optimized build with Next.js 15
- ✅ **No Content Reflow**: Ready function called after interface loads
- ✅ **Skeleton States**: Implemented in components
- ✅ **Image Optimization**: Dynamic images with proper sizing

### Farcaster-Specific Optimizations
- ✅ **Early Ready Call**: Called as soon as interface is ready
- ✅ **Multiple Fallbacks**: Four different methods to call ready
- ✅ **Error Handling**: Graceful fallbacks if ready function fails
- ✅ **Debug Logging**: Console logs for troubleshooting
- ✅ **Manifest Validation**: Automatic manifest status checking

## Testing Your Mini App

### 1. Local Testing
```bash
npm run dev
# Visit http://localhost:3000/test-frame
```

### 2. Production Testing
- Visit: `https://agro-gy7aqkudn-disidentes-projects.vercel.app/test-frame`
- Check browser console for ready function logs
- Verify manifest is accessible
- Verify Mini App metadata in page source

### 3. Farcaster Testing
- Use Farcaster's Mini App validator
- Test in Warpcast app
- Verify preview appears correctly

## Next Steps

Once deployed and working:

1. **Customize Mini App Actions**: Modify the manifest to handle specific user interactions
2. **Add More Features**: Extend Mini App capabilities with additional functionality
3. **Implement State Management**: Add Mini App state persistence
4. **Analytics**: Track Mini App interactions and user engagement

## Support

If you encounter issues:

1. Check the test page: `/test-frame`
2. Review browser console logs
3. Verify manifest accessibility: `/.well-known/farcaster.json`
4. Test with Farcaster's Mini App validator

The implementation follows Farcaster's Mini App best practices and should resolve the preview issue you were experiencing. 