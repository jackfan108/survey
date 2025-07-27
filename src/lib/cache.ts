import type { SurveyResultsData, TagAnalysis } from './api-client';

interface CacheEntry {
  surveyResults: SurveyResultsData;
  tagAnalysis: TagAnalysis[];
  timestamp: number;
}

// Global cache to store the current user's data
class AppCache {
  private cache: CacheEntry | null = null;
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  set(surveyResults: SurveyResultsData, tagAnalysis: TagAnalysis[]) {
    this.cache = {
      surveyResults,
      tagAnalysis,
      timestamp: Date.now()
    };
  }

  get(): { surveyResults: SurveyResultsData; tagAnalysis: TagAnalysis[] } | null {
    if (!this.cache) {
      return null;
    }

    // Check if cache is expired
    if (Date.now() - this.cache.timestamp > this.CACHE_DURATION) {
      this.cache = null;
      return null;
    }

    return {
      surveyResults: this.cache.surveyResults,
      tagAnalysis: this.cache.tagAnalysis
    };
  }

  clear() {
    this.cache = null;
  }

  has(): boolean {
    if (!this.cache) return false;
    
    // Check if expired
    if (Date.now() - this.cache.timestamp > this.CACHE_DURATION) {
      this.cache = null;
      return false;
    }
    
    return true;
  }

  // Get current user's email from cache
  getCurrentEmail(): string | null {
    const cached = this.get();
    return cached?.surveyResults.survey.email || null;
  }
}

export const appCache = new AppCache();