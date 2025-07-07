import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import {
  getUserPlanLimits,
  hasFeatureAccess,
  canAccessFeature,
  getUpgradeSuggestion,
  canUseDeepResearch,
  canExportPDF,
  canUsePersonalizedAnalysis,
  canUsePriorityProcessing,
  canSaveIdeas,
  canUseSpecificAPIs,
  hasEarlyAccess,
  getIdeaStorageLimit,
} from '../utils/featureAccess';

export const useFeatureAccess = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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
        } else {
          setProfile(null);
          //setUsage({ savedIdeas: 0 });
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const userPlan = profile?.plan || 'free';

  return {
    // User state
    user,
    profile,
    loading,
    userPlan,
    
    // Plan limits
    planLimits: getUserPlanLimits(userPlan),
    
    // Feature access checks
    hasFeatureAccess: (feature) => hasFeatureAccess(userPlan, feature),
    canAccessFeature: (feature) => canAccessFeature(userPlan, feature),
    getUpgradeSuggestion: (feature) => getUpgradeSuggestion(userPlan, feature),
    
    // Specific feature helpers
    canUseDeepResearch: () => canUseDeepResearch(userPlan),
    canExportPDF: () => canExportPDF(userPlan),
    canUsePersonalizedAnalysis: () => canUsePersonalizedAnalysis(userPlan),
    canUsePriorityProcessing: () => canUsePriorityProcessing(userPlan),
    canSaveIdeas: () => canSaveIdeas(userPlan),
    canUseSpecificAPIs: () => canUseSpecificAPIs(userPlan),
    hasEarlyAccess: () => hasEarlyAccess(userPlan),
    getIdeaStorageLimit: () => getIdeaStorageLimit(userPlan),
  };
}; 