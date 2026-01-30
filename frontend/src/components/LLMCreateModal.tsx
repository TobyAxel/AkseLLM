import { useState } from 'react';

type ModalProps = {
    availableModels: string[];
    onLLMCreate: (name: string, model: string) => void;
    onModalClose: () => void;
};

function LLMCreateModal({ availableModels, onLLMCreate, onModalClose }: ModalProps) {
    const [name, setName] = useState('');
    const [selectedModel, setSelectedModel] = useState(availableModels[0] || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && selectedModel) {
            onLLMCreate(name.trim(), selectedModel);
            onModalClose();
        }
    };

    return (
        <div className="absolute flex justify-center items-center w-full h-full z-50">
            {/* Backdrop */}
            <div
                className="absolute bg-black w-full h-full opacity-80 backdrop-blur-sm"
                onClick={onModalClose}
            />

            {/* Modal */}
            <div className="relative bg-linear-to-b from-neutral-800 via-neutral-850 to-neutral-900 w-md rounded-xl shadow-2xl border border-neutral-700/50 overflow-hidden">

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-br from-neutral-700/10 to-transparent pointer-events-none" />

                {/* Header */}
                <div className="relative p-6 pb-4 border-b border-neutral-700/50">
                    <h2 className="text-xl font-bold bg-linear-to-r from-white to-neutral-400 bg-clip-text text-white">
                        Create a new LLM model
                    </h2>
                    <div className="h-0.5 w-20 bg-linear-to-r from-neutral-600 to-transparent mt-2 rounded-full" />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="relative p-6 space-y-5">

                    {/* Name Input */}
                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-neutral-300 text-sm font-medium">
                            Name
                        </label>
                        <div className="relative">
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-neutral-900/50 text-white px-4 py-2.5 rounded-lg border border-neutral-700 focus:outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/20 transition-all placeholder:text-neutral-500"
                                placeholder="Enter model name"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Model Select */}
                    <div className="space-y-2">
                        <label htmlFor="model" className="block text-neutral-300 text-sm font-medium">
                            Model
                        </label>
                        <div className="relative">
                            <select
                                id="model"
                                value={selectedModel}
                                onChange={(e) => setSelectedModel(e.target.value)}
                                className="w-full bg-neutral-900/50 text-white px-4 py-2.5 rounded-lg border border-neutral-700 focus:outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/20 transition-all appearance-none cursor-pointer"
                            >
                                {availableModels.map((model) => (
                                    <option key={model} value={model} className="bg-neutral-800">
                                        {model}
                                    </option>
                                ))}
                            </select>

                            {/* Custom dropdown arrow */}
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onModalClose}
                            className="px-5 py-2.5 cursor-pointer bg-neutral-800/50 text-neutral-300 rounded-lg hover:bg-neutral-700/50 transition-all duration-200 font-medium border border-neutral-700/50 hover:border-neutral-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!name.trim() || !selectedModel}
                            className="px-5 py-2.5 cursor-pointer bg-linear-to-r from-neutral-700 to-neutral-600 text-white rounded-lg hover:from-neutral-600 hover:to-neutral-500 transition-all duration-200 font-medium shadow-lg shadow-neutral-900/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-neutral-700 disabled:hover:to-neutral-600"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LLMCreateModal;