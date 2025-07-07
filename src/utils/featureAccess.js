// Feature access configuration based on subscription plans
export const FEATURE_LIMITS = {
  free: {
    quickSearchesPerMonth: 50,
    deepSearchesPerMonth: 0,
    ideaStorage: 1,
    pdfExports: false,
    priorityProcessing: false,
    personalizedAnalysis: false,
    deepResearchEngine: false,
    specificApiSelections: false,
    earlyAccessFeatures: false,
  },
  pro: {
    quickSearchesPerMonth: 200,
    deepSearchesPerMonth: 0,
    ideaStorage: 100,
    pdfExports: true,
    priorityProcessing: true,
    personalizedAnalysis: true,
    deepResearchEngine: false,
    specificApiSelections: false,
    earlyAccessFeatures: false,
  },
  founder: {
    quickSearchesPerMonth: 500,
    deepSearchesPerMonth: 50,
    ideaStorage: 500,
    pdfExports: true,
    priorityProcessing: true,
    personalizedAnalysis: true,
    deepResearchEngine: true,
    specificApiSelections: true,
    earlyAccessFeatures: true,
  },
};

// Helper function to get user's plan limits
export const getUserPlanLimits = (userPlan = 'free') => {
  return FEATURE_LIMITS[userPlan] || FEATURE_LIMITS.free;
};

// Check if user has access to a specific feature
export const hasFeatureAccess = (userPlan = 'free', feature) => {
  const limits = getUserPlanLimits(userPlan);
  return limits[feature] !== undefined ? limits[feature] : false;
};

// Check if user can access a feature (boolean check)
export const canAccessFeature = (userPlan = 'free', feature) => {
  const access = hasFeatureAccess(userPlan, feature);
  return typeof access === 'boolean' ? access : access > 0;
};

// Get remaining usage for a feature
export const getRemainingUsage = (userPlan = 'free', feature, currentUsage = 0) => {
  const limit = hasFeatureAccess(userPlan, feature);
  if (typeof limit === 'number') {
    return Math.max(0, limit - currentUsage);
  }
  return 0;
};

// Check if user has exceeded their limit
export const hasExceededLimit = (userPlan = 'free', feature, currentUsage = 0) => {
  const limit = hasFeatureAccess(userPlan, feature);
  if (typeof limit === 'number') {
    return currentUsage >= limit;
  }
  return false;
};

// Get upgrade suggestion based on current usage
export const getUpgradeSuggestion = (userPlan = 'free', feature, currentUsage = 0) => {
  if (userPlan === 'founder') return null;
  
  const currentLimit = hasFeatureAccess(userPlan, feature);
  const nextPlan = userPlan === 'free' ? 'pro' : 'founder';
  const nextLimit = hasFeatureAccess(nextPlan, feature);
  
  if (typeof currentLimit === 'number' && typeof nextLimit === 'number' && currentUsage >= currentLimit * 0.8) {
    return {
      currentPlan: userPlan,
      suggestedPlan: nextPlan,
      currentLimit,
      nextLimit,
      currentUsage,
    };
  }
  
  return null;
};

// Feature-specific helper functions
export const canUseDeepResearch = (userPlan) => canAccessFeature(userPlan, 'deepResearchEngine');
export const canExportPDF = (userPlan) => canAccessFeature(userPlan, 'pdfExports');
export const canUsePersonalizedAnalysis = (userPlan) => canAccessFeature(userPlan, 'personalizedAnalysis');
export const canUsePriorityProcessing = (userPlan) => canAccessFeature(userPlan, 'priorityProcessing');
export const canSaveIdeas = (userPlan) => canAccessFeature(userPlan, 'ideaStorage');
export const canUseSpecificAPIs = (userPlan) => canAccessFeature(userPlan, 'specificApiSelections');
export const hasEarlyAccess = (userPlan) => canAccessFeature(userPlan, 'earlyAccessFeatures');

// Usage tracking helpers
export const getQuickSearchLimit = (userPlan) => hasFeatureAccess(userPlan, 'quickSearchesPerMonth');
export const getDeepSearchLimit = (userPlan) => hasFeatureAccess(userPlan, 'deepSearchesPerMonth');
export const getIdeaStorageLimit = (userPlan) => hasFeatureAccess(userPlan, 'ideaStorage'); 