import { useEffect, useState } from "react";
import SideBar from "./components/SideBar";
import LLMCreateModal from "./components/Modals/LLMCreateModal";
import AuthModal from "./components/Modals/AuthModal";
import LogoutConfirmModal from "./components/Modals/LogoutConfirmModal";
import UserSettingsModal from "./components/Modals/UserSettingsModal";
import type { Profile } from "./domain/profile";
import type { LoginDto } from "./domain/DTOs/LoginDto";
import type { RegisterDto } from "./domain/DTOs/RegisterDto";
import { authService } from "./services/authService";
import { llmsService } from "./services/llmsService";
import type { LLMDto } from "./domain/DTOs/LLMDto";
import LLMSettingsModal from "./components/Modals/LLMSettingsModal";

// Temporary variables for frontend testing
const availableModelsTemp = ["Gemini 3 Pro", "GPT-5", "Claude 3.7 Sonnet", "Grok 4"]

function App() {
  // Application states
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [llms, setLLMs] = useState<LLMDto[]>([]);
  const [selectedLLM, setSelectedLLM] = useState<LLMDto | null>(null);

  // Modal states
  const [modalStates, setModalStates] = useState({
    llmCreationModal: false,
    authModal: false,
    logoutModal: false,
    userSettingsModal: false,
    llmSettingsModal: false
  })
  type ModalKey = keyof typeof modalStates;

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

  const initializeLLMs = async () => {
    const response = await llmsService.getLLMs();
    setLLMs(response);
  }

  const createLLM = async (name: string, model: string) => {
    const newLLM: LLMDto = {
      id: "",
      name,
      model,
      inferenceConfig: null
    }

    const response = await llmsService.createLLM(newLLM);
    if (response.message) alert(response.message);
    setLLMs([...llms, response]);
  }

  const deleteLLM = async (llm: LLMDto) => {
    await llmsService.deleteLLM(llm.id);
    setLLMs(prev => prev.filter(item => item.id !== llm.id))
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

  const handleLogout = () => {
    authService.logout();
    setLoggedIn(false);
    setUserProfile(null);
    setModalStates(prev => ({ ...prev, logoutModal: false }));
    window.location.reload();
  }

  const handleModals = (modal: ModalKey, state: boolean) => {
    setModalStates(prev => {
      const updated = {
        ...prev,
        [modal]: state
      };

      if (modal === "logoutModal" && state) {
        updated.userSettingsModal = false;
      }

      return updated;
    });
  }

  useEffect(() => {
    setModalStates(prev => ({ ...prev, authModal: !loggedIn }))
    if (loggedIn) {
      initializeLLMs();
    }
    else {
      setLLMs([])
    }
  }, [loggedIn])

  if (loading) {
    return <></>;
  }

  return (
    <div className="flex">
      <LLMCreateModal isOpen={modalStates.llmCreationModal} availableModels={availableModelsTemp}
        onLLMCreate={createLLM}
        onModalClose={() => handleModals("llmCreationModal", false)}
      />

      <AuthModal isOpen={modalStates.authModal}
        onSubmit={handleAuthSubmit}
      />

      <LogoutConfirmModal isOpen={modalStates.logoutModal}
        onModalClose={() => handleModals("logoutModal", false)}
        logout={handleLogout}
      />

      <UserSettingsModal isOpen={modalStates.userSettingsModal} userprofile={userProfile}
        onModalClose={() => handleModals("userSettingsModal", false)}
        onLogout={() => handleModals("logoutModal", true)}
      />

      <LLMSettingsModal isOpen={modalStates.llmSettingsModal} selectedLLM={selectedLLM}
        onModalClose={() => handleModals("llmSettingsModal", false)}
      />

      <SideBar loggedIn={loggedIn} userprofile={userProfile} llms={llms} selectedLLM={selectedLLM}
        onSelectLLM={(llm: LLMDto) => setSelectedLLM(llm)}
        onCreateClick={() => handleModals("llmCreationModal", true)}
        onAccountClick={() => handleModals("userSettingsModal", true)}
        onLLMSettingClick={deleteLLM}
        //onLLMSettingClick={() => handleModals("llmSettingsModal", true)} 
      />
    </div>
  )
}

export default App
