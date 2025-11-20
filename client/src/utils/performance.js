// client/src/utils/performance.js - Performance monitoring utilities

// Measure function execution time
export const measurePerformance = (fn, label = 'Function') => {
  return async (...args) => {
    const start = performance.now();
    try {
      const result = await fn(...args);
      const end = performance.now();
      console.log(`${label} took ${end - start} milliseconds`);
      return result;
    } catch (error) {
      const end = performance.now();
      console.error(`${label} failed after ${end - start} milliseconds:`, error);
      throw error;
    }
  };
};

// Monitor React component performance
export const withPerformanceMonitoring = (WrappedComponent, componentName) => {
  return (props) => {
    const startRender = performance.now();

    // Use useEffect to measure after render
    React.useEffect(() => {
      const endRender = performance.now();
      console.log(`${componentName} render time: ${endRender - startRender} ms`);
    });

    return <WrappedComponent {...props} />;
  };
};

// Monitor API calls
export const monitorApiCall = async (apiCall, endpoint) => {
  const start = performance.now();
  try {
    const result = await apiCall();
    const end = performance.now();
    console.log(`API call to ${endpoint} took ${end - start} ms`);
    return result;
  } catch (error) {
    const end = performance.now();
    console.error(`API call to ${endpoint} failed after ${end - start} ms:`, error);
    throw error;
  }
};

// Memory usage monitoring
export const logMemoryUsage = () => {
  if (performance.memory) {
    console.log('Memory Usage:', {
      used: Math.round(performance.memory.usedJSHeapSize / 1048576 * 100) / 100 + ' MB',
      total: Math.round(performance.memory.totalJSHeapSize / 1048576 * 100) / 100 + ' MB',
      limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576 * 100) / 100 + ' MB'
    });
  }
};

// Web Vitals monitoring (simplified)
export const reportWebVitals = (metric) => {
  console.log('Web Vital:', {
    name: metric.name,
    value: metric.value,
    rating: metric.rating
  });

  // Here you could send to analytics service
  // sendToAnalytics(metric);
};