# 🌱 Farcaster Deployment Guide - Agro-bootcamp

## Overview

This guide explains how to deploy your Agro-bootcamp app to Farcaster and ensure it appears correctly in the preview.

## What We've Implemented

### 1. Farcaster Frame Integration
- ✅ Installed `frames.js` package
- ✅ Created Farcaster provider component with `ready()` function
- ✅ Added frame metadata to layout
- ✅ Created API route for frame interactions
- ✅ Generated dynamic OG image for frames

### 2. Key Components

#### Farcaster Provider (`src/components/farcaster-provider.tsx`)
```typescript
// Handles the ready() function call that Farcaster requires
useEffect(() => {
  const callReady = () => {
    // Multiple methods to call ready
    if (window.farcaster) window.farcaster.ready()
    if (window.ready) window.ready()
    window.dispatchEvent(new CustomEvent("farcaster-ready"))
  }
  callReady()
}, [])
```

#### Frame API Route (`src/app/api/frame/route.ts`)
```typescript
// Handles Farcaster frame interactions
export async function POST(request: NextRequest) {
  // Process frame interactions and return responses
}
```

#### Dynamic OG Image (`src/app/og-image/route.tsx`)
```typescript
// Generates the image displayed in Farcaster frames
export async function GET() {
  return new ImageResponse(/* JSX for the image */)
}
```

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
Ensure your app is deployed at: `https://agro-bootcamp.vercel.app`

### 3. Test Farcaster Integration
Visit: `https://agro-bootcamp.vercel.app/test-frame`

This page will show:
- ✅ Farcaster Frame Detection
- ✅ Ready Function Status
- ✅ Debug Information
- ✅ Frame Metadata

### 4. Submit to Farcaster
1. Go to [Farcaster Developer Portal](https://developer.farcaster.xyz/)
2. Create a new Frame
3. Use your app URL: `https://agro-bootcamp.vercel.app`
4. The frame metadata will be automatically detected

## Frame Metadata

Your app includes these frame metadata tags:

```html
<meta property="fc:frame" content="vNext" />
<meta property="fc:frame:image" content="https://agro-bootcamp.vercel.app/og-image" />
<meta property="fc:frame:button:1" content="Ir al Dashboard" />
<meta property="fc:frame:post_url" content="https://agro-bootcamp.vercel.app/api/frame" />
```

## Troubleshooting

### Issue: Preview Not Showing
**Solution**: The `ready()` function is now properly implemented with multiple fallback methods:

1. **Check Console**: Open browser dev tools and look for:
   ```
   "Farcaster ready called via window.farcaster"
   "Farcaster ready called via window.ready"
   "Farcaster ready event dispatched"
   ```

2. **Test Page**: Visit `/test-frame` to verify integration

3. **Verify Metadata**: Check that frame metadata is present in page source

### Issue: Frame Not Responding
**Solution**: The API route handles both GET and POST requests:

- **GET**: Returns frame metadata
- **POST**: Handles user interactions and returns new frame state

### Issue: Image Not Loading
**Solution**: The dynamic OG image route generates images on-demand:

- URL: `https://agro-bootcamp.vercel.app/og-image`
- Format: 1200x630 PNG
- Content: Agro-bootcamp branding with buttons

## Performance Optimization

### Web Performance Best Practices
- ✅ **Minimal Loading Time**: Optimized build with Next.js 15
- ✅ **No Content Reflow**: Ready function called after interface loads
- ✅ **Skeleton States**: Implemented in components
- ✅ **Image Optimization**: Dynamic OG images with proper sizing

### Farcaster-Specific Optimizations
- ✅ **Early Ready Call**: Called as soon as interface is ready
- ✅ **Multiple Fallbacks**: Three different methods to call ready
- ✅ **Error Handling**: Graceful fallbacks if ready function fails
- ✅ **Debug Logging**: Console logs for troubleshooting

## Testing Your Frame

### 1. Local Testing
```bash
npm run dev
# Visit http://localhost:3000/test-frame
```

### 2. Production Testing
- Visit: `https://agro-bootcamp.vercel.app/test-frame`
- Check browser console for ready function logs
- Verify frame metadata in page source

### 3. Farcaster Testing
- Use Farcaster's frame validator
- Test in Warpcast app
- Verify preview appears correctly

## Next Steps

Once deployed and working:

1. **Customize Frame Actions**: Modify `/api/frame/route.ts` to handle specific user interactions
2. **Add More Buttons**: Extend frame metadata with additional action buttons
3. **Implement State Management**: Add frame state persistence
4. **Analytics**: Track frame interactions and user engagement

## Support

If you encounter issues:

1. Check the test page: `/test-frame`
2. Review browser console logs
3. Verify frame metadata in page source
4. Test with Farcaster's frame validator

The implementation follows Farcaster's best practices and should resolve the preview issue you were experiencing. 