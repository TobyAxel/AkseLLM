import { useEffect, useState } from "react";
import SideBar from "./components/SideBar";
import type { LLM } from "./domain/llm";
import LLMCreateModal from "./components/LLMCreateModal";
import AuthModal from "./components/AuthModal";
import LogoutConfirmModal from "./components/LogoutConfirmModal";
import UserSettingsModal from "./components/UserSettingsModal";
import type { Profile } from "./domain/profile";

// Temporary variables for frontend testing
const availableModelsTemp = ["Gemini 3 Pro", "GPT-5", "Claude 3.7 Sonnet", "Grok 4"]

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [llms, setLLMs] = useState<LLM[]>([]);
  const [selectedLLMId, setSelectedLLMId] = useState<string | null>(null);
  const [llmCreationModalOpen, setLLMCreationModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [userSettingsModalOpen, setUserSettingsModalOpen] = useState(false);

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
    console.log(data);
    setUserProfile({
      username: data.username ? data.username : data.email,
      plan: 'free',
      created_at: "12/01/2025"
    })
    setLoggedIn(true);
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
    setLogoutModalOpen(false);
    setLoggedIn(false);
    window.location.reload();
  }

  useEffect(() => {
    setAuthModalOpen(!loggedIn)
  }, [loggedIn])

  return (
    <div className="flex">
      {llmCreationModalOpen ? <LLMCreateModal availableModels={availableModelsTemp} onLLMCreate={createLLM} onModalClose={closeCreateModal} /> : null}
      {authModalOpen ? <AuthModal onSubmit={handleAuthSubmit} /> : null}
      {logoutModalOpen ? <LogoutConfirmModal onModalClose={closeLogoutModal} logout={handleLogout}/> : null}
      {userSettingsModalOpen ? (<UserSettingsModal userprofile={userProfile} onModalClose={closeUserSettingsModal} onLogout={openLogoutModal} />) : null}
      <SideBar loggedIn={loggedIn} userprofile={userProfile} llms={llms} selectedLLMId={selectedLLMId} onSelectLLM={handleLLMSelection} onCreateClick={openCreateModal} onAccountClick={openUserSettingsModal} />
    </div>
  )
}

export default App
