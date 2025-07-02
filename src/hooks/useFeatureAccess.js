import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import {
  getUserPlanLimits,
  hasFeatureAccess,
  canAccessFeature,
  getRemainingUsage,
  hasExceededLimit,
  getUpgradeSuggestion,
  canUseDeepResearch,
  canExportPDF,
  canUsePersonalizedAnalysis,
  canUsePriorityProcessing,
  canSaveIdeas,
  canUseSpecificAPIs,
  hasEarlyAccess,
  getQuickSearchLimit,
  getDeepSearchLimit,
  getIdeaStorageLimit,
} from '../utils/featureAccess';

export const useFeatureAccess = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usage, setUsage] = useState({
    quickSearches: 0,
    deepSearches: 0,
    savedIdeas: 0,
  });

  useEffect(() => {
    // Get current user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Get user profile with plan information
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        setProfile(profileData);
        
        // Get current usage (you'll need to implement this based on your data structure)
        await fetchCurrentUsage(user.id);
      }
      
      setLoading(false);
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          setProfile(profileData);
          await fetchCurrentUsage(session.user.id);
        } else {
          setProfile(null);
          setUsage({ quickSearches: 0, deepSearches: 0, savedIdeas: 0 });
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchCurrentUsage = async (userId) => {
    try {
      // Fetch current usage from profiles table
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('quick_searches, deep_searches')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching usage:', error);
        return;
      }
      
      // Set usage from the profiles table
      setUsage({
        quickSearches: profileData?.quick_searches || 0,
        deepSearches: profileData?.deep_searches || 0,
        savedIdeas: 0, // This will be handled separately in ProfileDashboard
      });
    } catch (error) {
      console.error('Error fetching usage:', error);
    }
  };

  const userPlan = profile?.plan || 'free';

  return {
    // User state
    user,
    profile,
    loading,
    userPlan,
    
    // Usage tracking
    usage,
    setUsage,
    
    // Plan limits
    planLimits: getUserPlanLimits(userPlan),
    
    // Feature access checks
    hasFeatureAccess: (feature) => hasFeatureAccess(userPlan, feature),
    canAccessFeature: (feature) => canAccessFeature(userPlan, feature),
    getRemainingUsage: (feature) => getRemainingUsage(userPlan, feature, usage[feature] || 0),
    hasExceededLimit: (feature) => hasExceededLimit(userPlan, feature, usage[feature] || 0),
    getUpgradeSuggestion: (feature) => getUpgradeSuggestion(userPlan, feature, usage[feature] || 0),
    
    // Specific feature helpers
    canUseDeepResearch: () => canUseDeepResearch(userPlan),
    canExportPDF: () => canExportPDF(userPlan),
    canUsePersonalizedAnalysis: () => canUsePersonalizedAnalysis(userPlan),
    canUsePriorityProcessing: () => canUsePriorityProcessing(userPlan),
    canSaveIdeas: () => canSaveIdeas(userPlan),
    canUseSpecificAPIs: () => canUseSpecificAPIs(userPlan),
    hasEarlyAccess: () => hasEarlyAccess(userPlan),
    
    // Usage limits
    getQuickSearchLimit: () => getQuickSearchLimit(userPlan),
    getDeepSearchLimit: () => getDeepSearchLimit(userPlan),
    getIdeaStorageLimit: () => getIdeaStorageLimit(userPlan),
    
    // Utility functions
    incrementUsage: (feature) => {
      setUsage(prev => ({
        ...prev,
        [feature]: (prev[feature] || 0) + 1
      }));
    },
    
    incrementUsageInDatabase: async (feature) => {
      if (!user) return;
      
      try {
        const columnName = feature === 'quickSearches' ? 'quick_searches' : 'deep_searches';
        
        // Get current value and increment
        const currentValue = usage[feature] || 0;
        const newValue = currentValue + 1;
        
        // Update the database
        const { error } = await supabase
          .from('profiles')
          .update({ [columnName]: newValue })
          .eq('id', user.id);
        
        if (error) {
          console.error('Error incrementing usage:', error);
          return;
        }
        
        // Update local state
        setUsage(prev => ({
          ...prev,
          [feature]: newValue
        }));
      } catch (error) {
        console.error('Error incrementing usage:', error);
      }
    },
    
    resetUsage: () => {
      setUsage({ quickSearches: 0, deepSearches: 0, savedIdeas: 0 });
    },
  };
}; 