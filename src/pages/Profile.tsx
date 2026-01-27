import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { User, Mail, Bell, Loader2 } from "lucide-react";

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
  });
  
  const [preferences, setPreferences] = useState({
    receive_notifications: true,
    preferred_language: 'English',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      setShowAuthModal(true);
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchPreferences();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    
    if (data) {
      setProfile({
        full_name: data.full_name || '',
        email: data.email || user.email || '',
      });
    }
  };

  const fetchPreferences = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (data) {
      setPreferences({
        receive_notifications: data.receive_notifications ?? true,
        preferred_language: data.preferred_language || 'English',
      });
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: profile.full_name })
        .eq('id', user.id);
      
      if (profileError) throw profileError;

      const { error: prefError } = await supabase
        .from('user_preferences')
        .update({
          receive_notifications: preferences.receive_notifications,
          preferred_language: preferences.preferred_language,
        })
        .eq('user_id', user.id);
      
      if (prefError) throw prefError;

      toast({
        title: 'Profile Updated',
        description: 'Your changes have been saved successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onSignInClick={() => setShowAuthModal(true)} />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <User className="w-8 h-8 text-primary" />
            My Profile
          </h1>

          {user ? (
            <div className="space-y-6">
              {/* Profile Information */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-foreground">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="fullName"
                        value={profile.full_name}
                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                        className="pl-10 bg-background border-border text-foreground"
                        placeholder="Enter your name"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        value={profile.email}
                        disabled
                        className="pl-10 bg-muted border-border text-muted-foreground"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>
                </CardContent>
              </Card>

              {/* Preferences */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-foreground">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive booking confirmations and updates
                      </p>
                    </div>
                    <Switch
                      checked={preferences.receive_notifications}
                      onCheckedChange={(checked) => 
                        setPreferences({ ...preferences, receive_notifications: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={handleSaveProfile}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="p-12 text-center">
                <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Sign in to view your profile
                </h2>
                <p className="text-muted-foreground">
                  You need to be logged in to manage your profile.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => {
          setShowAuthModal(false);
          if (!user) navigate('/');
        }} 
      />
    </div>
  );
};

export default Profile;
