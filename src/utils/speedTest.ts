/**
 * Enhanced speed test utility - Similar to speedtest.net algorithm
 * Uses progressive testing, multiple connections, and better accuracy
 */

import { LIMITS, TIMEOUTS, SPEED_TEST } from '@/constants';
import { logger } from '@/utils/logger';

interface SpeedTestResult {
  download: number; // Mbps
  upload: number;   // Mbps
  ping: number;     // ms
  jitter: number;   // ms
}

/**
 * Measures network ping and jitter using multiple reliable endpoints
 * @param urls - Array of URLs to test against (defaults to Google, Cloudflare, 1.1.1.1)
 * @returns Promise resolving to ping (ms) and jitter (ms) measurements
 */
export async function measurePing(urls: string[] = [
  'https://www.google.com',
  'https://www.cloudflare.com',
  'https://1.1.1.1'
]): Promise<{ ping: number; jitter: number }> {
  const allTimes: number[] = [];

  for (const url of urls) {
    for (let i = 0; i < LIMITS.PING_SAMPLES_PER_URL; i++) {
      const start = performance.now();
      try {
        // Use a small image or favicon for better timing
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUTS.PING_TIMEOUT);
        
        await fetch(`${url}/favicon.ico`, { 
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-cache',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        const end = performance.now();
        const duration = end - start;
        
        // Only accept reasonable ping times
        if (duration > LIMITS.PING_MIN && duration < LIMITS.PING_MAX) {
          allTimes.push(duration);
        }
      } catch (e) {
        // Log failed requests but continue
        logger.debug(`Ping measurement failed for ${url}`, e);
        continue;
      }
      // Small delay between pings
      await new Promise(resolve => setTimeout(resolve, LIMITS.PING_DELAY));
    }
  }

  if (allTimes.length === 0) {
    // Fallback if all pings fail
    logger.warn('All ping measurements failed, using fallback values');
    return { ping: 50, jitter: 5 };
  }

  const avgPing = allTimes.reduce((a, b) => a + b, 0) / allTimes.length;
  
  // Calculate jitter (standard deviation of ping times)
  const variance = allTimes.reduce((sum, time) => sum + Math.pow(time - avgPing, 2), 0) / allTimes.length;
  const jitter = Math.sqrt(variance);

  return { 
    ping: Math.round(avgPing * 10) / 10, 
    jitter: Math.round(jitter * 10) / 10 
  };
}

/**
 * Enhanced download test with progressive sizes and multiple connections
 * @param onProgress - Optional callback for progress updates (mbps, progress percentage)
 * @returns Promise resolving to download speed in Mbps
 */
export async function measureDownload(
  onProgress?: (mbps: number, progress: number) => void
): Promise<number> {
  // Progressive test sizes like speedtest.net (starts small, increases)
  const testSizes = SPEED_TEST.DOWNLOAD_SIZES;
  const results: number[] = [];
  let totalProgress = 0;
  const maxProgress = testSizes.length * 100;

  for (let idx = 0; idx < testSizes.length; idx++) {
    const sizeMB = testSizes[idx];
    const sizeBytes = sizeMB * 1024 * 1024;
    
    // Use multiple test endpoints for reliability
    const testUrls = [
      `https://speed.cloudflare.com/__down?bytes=${sizeBytes}`,
      `https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png?size=${sizeBytes}`,
    ];

    for (const testUrl of testUrls) {
      try {
        const startTime = performance.now();
        let loadedBytes = 0;
        let lastUpdate = startTime;

        const response = await fetch(testUrl, {
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });

        if (!response.ok) continue;

        const reader = response.body?.getReader();
        const contentLength = parseInt(response.headers.get('content-length') || String(sizeBytes));

        if (!reader) {
          // Fallback: use blob timing
          const blob = await response.blob();
          const endTime = performance.now();
          const duration = (endTime - startTime) / 1000;
          if (duration > 0) {
            const mbps = (blob.size * 8) / (duration * 1000000);
            if (mbps >= LIMITS.SPEED_MIN && mbps < LIMITS.SPEED_MAX) {
              results.push(mbps);
            }
          }
          continue;
        }

        // Stream and measure in real-time
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          loadedBytes += value.length;
          const now = performance.now();
          
          // Update progress every 100ms for smoother UI
          if (now - lastUpdate >= 100) {
            const elapsed = (now - startTime) / 1000;
            if (elapsed > 0) {
              const currentMbps = (loadedBytes * 8) / (elapsed * 1000000);
              const progress = contentLength > 0 
                ? (loadedBytes / contentLength) * 100 
                : (loadedBytes / sizeBytes) * 100;
              
              totalProgress += (progress / testSizes.length);
              onProgress?.(currentMbps, (totalProgress / maxProgress) * 100);
            }
            lastUpdate = now;
          }
        }

        const endTime = performance.now();
        const duration = (endTime - startTime) / 1000;
        
        if (duration > 0 && loadedBytes > 0) {
          const mbps = (loadedBytes * 8) / (duration * 1000000);
          // Sanity check: reasonable speeds
          if (mbps >= LIMITS.SPEED_MIN && mbps < LIMITS.SPEED_MAX) {
            results.push(mbps);
            // If we get a good result, we can skip remaining sizes for faster testing
            if (mbps > SPEED_TEST.DOWNLOAD_SKIP_THRESHOLD && idx >= SPEED_TEST.MIN_INDEX_FOR_SKIP) break;
          }
        }
      } catch (error) {
        // Log error but continue with next test size
        logger.debug(`Download test failed for size ${sizeMB}MB`, error);
        continue;
      }
    }
  }

  // Use the best result (highest speed) rather than average for accuracy
  // This matches speedtest.net's approach
  if (results.length === 0) {
    logger.warn('No valid download test results');
    return 0;
  }
  
  // Sort and take the top results, then use conservative estimate
  const sortedResults = results.sort((a, b) => b - a);
  const topResults = sortedResults.slice(0, Math.min(SPEED_TEST.TOP_RESULTS_COUNT, sortedResults.length));
  
  return Math.max(...topResults) * SPEED_TEST.CONSERVATIVE_MULTIPLIER;
}

/**
 * Enhanced upload test with progressive sizes
 * @param onProgress - Optional callback for progress updates (mbps, progress percentage)
 * @returns Promise resolving to upload speed in Mbps
 */
export async function measureUpload(
  onProgress?: (mbps: number, progress: number) => void
): Promise<number> {
  // Progressive test sizes
  const testSizes = SPEED_TEST.UPLOAD_SIZES;
  const results: number[] = [];
  let totalProgress = 0;
  const maxProgress = testSizes.length * 100;

  for (let idx = 0; idx < testSizes.length; idx++) {
    const sizeMB = testSizes[idx];
    const sizeBytes = sizeMB * 1024 * 1024;
    
    // Create random data to upload
    const testData = new Uint8Array(sizeBytes);
    crypto.getRandomValues(testData);
    const blob = new Blob([testData]);

    // Use multiple upload endpoints
    const testUrls = [
      'https://speed.cloudflare.com/__up',
      'https://httpbin.org/post',
    ];

    for (const testUrl of testUrls) {
      try {
        const startTime = performance.now();
        
        // Use FormData for upload
        const formData = new FormData();
        formData.append('file', blob, 'test.bin');

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUTS.UPLOAD_TIMEOUT);

        const response = await fetch(testUrl, {
          method: 'POST',
          body: formData,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) continue;

        const endTime = performance.now();
        const duration = (endTime - startTime) / 1000;
        
        if (duration > 0) {
          const mbps = (sizeMB * 8) / duration;
          // Sanity check
          if (mbps >= LIMITS.SPEED_MIN && mbps < LIMITS.SPEED_MAX) {
            results.push(mbps);
            totalProgress += 100;
            onProgress?.(mbps, (totalProgress / maxProgress) * 100);
            
            // If we get a good result, skip remaining sizes
            if (mbps > SPEED_TEST.UPLOAD_SKIP_THRESHOLD && idx >= SPEED_TEST.MIN_INDEX_FOR_SKIP) break;
          }
        }
      } catch (error) {
        // Log error but continue with next test size
        logger.debug(`Upload test failed for size ${sizeMB}MB`, error);
        continue;
      }
    }
  }

  // Use best result approach like download
  if (results.length === 0) {
    logger.warn('No valid upload test results');
    return 0;
  }
  
  const sortedResults = results.sort((a, b) => b - a);
  const topResults = sortedResults.slice(0, Math.min(SPEED_TEST.TOP_RESULTS_COUNT, sortedResults.length));
  
  return Math.max(...topResults) * SPEED_TEST.CONSERVATIVE_MULTIPLIER;
}

/**
 * Run complete speed test with improved algorithm
 * @param onProgress - Optional callback for progress updates (stage, value, progress percentage)
 * @returns Promise resolving to complete speed test results
 */
export async function runSpeedTest(
  onProgress?: (stage: string, value: number, progress: number) => void
): Promise<SpeedTestResult> {
  try {
    // Step 1: Measure Ping & Jitter (10% of progress)
    onProgress?.('ping', 0, 5);
    const { ping, jitter } = await measurePing();
    onProgress?.('ping', ping, 15);

    // Step 2: Measure Download (60% of progress)
    onProgress?.('download', 0, 20);
    const download = await measureDownload((mbps, progress) => {
      onProgress?.('download', mbps, 20 + (progress * 0.6));
    });
    onProgress?.('download', download, 80);

    // Step 3: Measure Upload (20% of progress)
    onProgress?.('upload', 0, 80);
    const upload = await measureUpload((mbps, progress) => {
      onProgress?.('upload', mbps, 80 + (progress * 0.2));
    });
    onProgress?.('upload', upload, 100);

    return {
      download: Math.round(download * 10) / 10,
      upload: Math.round(upload * 10) / 10,
      ping: Math.round(ping * 10) / 10,
      jitter: Math.round(jitter * 10) / 10,
    };
  } catch (error) {
    logger.error('Speed test failed completely', error);
    // Return fallback values on complete failure
    return {
      download: 0,
      upload: 0,
      ping: 0,
      jitter: 0,
    };
  }
}
