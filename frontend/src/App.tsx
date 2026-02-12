import { useEffect, useState } from "react";
import SideBar from "./components/SideBar";
import type { LLM } from "./domain/llm";
import LLMCreateModal from "./components/Modals/LLMCreateModal";
import AuthModal from "./components/Modals/AuthModal";
import LogoutConfirmModal from "./components/Modals/LogoutConfirmModal";
import UserSettingsModal from "./components/Modals/UserSettingsModal";
import type { Profile } from "./domain/profile";
import type { LoginDto } from "./domain/DTOs/LoginDto";
import type { RegisterDto } from "./domain/DTOs/RegisterDto";
import { authService } from "./services/authService";

// Temporary variables for frontend testing
const availableModelsTemp = ["Gemini 3 Pro", "GPT-5", "Claude 3.7 Sonnet", "Grok 4"]

function App() {
  // Application states
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [llms, setLLMs] = useState<LLM[]>([]);
  const [selectedLLMId, setSelectedLLMId] = useState<string | null>(null);

  // Modal states
  const [llmCreationModalOpen, setLLMCreationModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [userSettingsModalOpen, setUserSettingsModalOpen] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');

      if (token) {
        try {
          const response = await authService.getCurrentUser();

          setUserProfile({
            id: response.id,
            username: response.username,
            email: response.email,
            plan: response.plan,
            created_at: response.created_at
          });
          setLoggedIn(true);
        } 
        catch (error) {
          // Token might be invalid or expired
          handleLogout();
          console.error("Authentication check failed:", error);
        }
      }

      // If the request was aborted, do nothing, otherwise set loading to false
      setLoading(false);
    }

    checkAuth();
  }, []);

  // Functions
  const handleLLMSelection = (id: string) => {
    setSelectedLLMId(id);
  };

  const openCreateModal = () => {
    setLLMCreationModalOpen(true);
  };

  const closeCreateModal = () => {
    setLLMCreationModalOpen(false);
  }

  const createLLM = (name: string, model: string) => {
    // TODO: Update into database

    const newLLM = {
      id: Date.now().toString(),
      name,
      model
    }

    setLLMs(prev => [...prev, newLLM])
  }

  const handleAuthSubmit = (data: any) => {
    switch (data.type) {
      case 'login':
        handleLogin(data);
        break;
      case 'register':
        handleRegister(data);
        break;
    }
  }

  const handleLogin = async (data: LoginDto) => {
    try {
      const response = await authService.login(data);
      setUserProfile({
        id: response.user.id,
        username: response.user.username,
        email: response.user.email,
        plan: response.user.plan,
        created_at: response.user.created_at
      })
      if (response.message) alert(response.message);
      setLoggedIn(true);
    } catch (error: any) {
      alert(error.message);
      console.error("Login error:", error);
    }
  }

  const handleRegister = async (data: RegisterDto) => {
    try {
      const response = await authService.register(data);
      setUserProfile({
        id: response.user.id,
        username: response.user.username,
        email: response.user.email,
        plan: response.user.plan,
        created_at: response.user.created_at
      })
      if (response.message) alert(response.message);
      setLoggedIn(true);
    }
    catch (error: any) {
      alert(error.message);
      console.error("Registration error:", error);
    }
  }

  const openUserSettingsModal = () => {
    setUserSettingsModalOpen(true);
  }

  const closeUserSettingsModal = () => {
    setUserSettingsModalOpen(false);
  }

  const openLogoutModal = () => {
    setUserSettingsModalOpen(false);
    setLogoutModalOpen(true);
  }

  const closeLogoutModal = () => {
    setLogoutModalOpen(false);
  }

  const handleLogout = () => {
    authService.logout();
    setLoggedIn(false);
    setUserProfile(null);
    setLogoutModalOpen(false);
    window.location.reload();
  }

  useEffect(() => {
    setAuthModalOpen(!loggedIn)
  }, [loggedIn])

  if (loading) {
    return <></>;
  }

  return (
    <div className="flex">
      {llmCreationModalOpen ? <LLMCreateModal availableModels={availableModelsTemp} onLLMCreate={createLLM} onModalClose={closeCreateModal} /> : null}
      {authModalOpen ? <AuthModal onSubmit={handleAuthSubmit} /> : null}
      {logoutModalOpen ? <LogoutConfirmModal onModalClose={closeLogoutModal} logout={handleLogout} /> : null}
      {userSettingsModalOpen ? (<UserSettingsModal userprofile={userProfile} onModalClose={closeUserSettingsModal} onLogout={openLogoutModal} />) : null}
      <SideBar loggedIn={loggedIn} userprofile={userProfile} llms={llms} selectedLLMId={selectedLLMId} onSelectLLM={handleLLMSelection} onCreateClick={openCreateModal} onAccountClick={openUserSettingsModal} />
    </div>
  )
}

export default App
