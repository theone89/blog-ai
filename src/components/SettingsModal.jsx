import React, { useState, useEffect, useRef } from 'react';

const SettingsModal = ({ isOpen, onClose, setConfig, isEdit, setIsedit }) => {
    const [openaiApiKey, setOpenaiApiKey] = useState('');
    const [unsplashApiKey, setUnsplashApiKey] = useState('');
    const [temperature, setTemperature] = useState(0.5);
    const [model, setModel] = useState('gpt-4o-mini');
    const [provider, setProvider] = useState('openai');
    const [isValid, setIsValid] = useState(false);

    const originalConfigRef = useRef(null);

    const openaiModels = [
        'gpt-4o-mini', // Asegúrate de que este modelo esté disponible y compatible
        'gpt-4',
        'gpt-4-0314',
        'gpt-4-32k',
        'gpt-4-32k-0314',
        'gpt-3.5-turbo',
        'gpt-3.5-turbo-0301',
        'text-davinci-003',
        'text-curie-001',
        'text-babbage-001',
        'text-ada-001',
        'davinci',
        'curie',
        'babbage',
        'ada'
    ];

    useEffect(() => {
        const storedConfig = localStorage.getItem('appConfig');
        if (storedConfig) {
            const config = JSON.parse(storedConfig);
            setOpenaiApiKey(config.openaiApiKey || '');
            setUnsplashApiKey(config.unsplashApiKey || '');
            setTemperature(config.temperature || 0.5);
            setModel(config.model || 'gpt-4o-mini');
            setProvider(config.provider || 'openai');
            originalConfigRef.current = config;
        }
    }, [isOpen]);

    useEffect(() => {

        setIsValid(openaiApiKey.trim() !== '' && unsplashApiKey.trim() !== '');
    }, [openaiApiKey, unsplashApiKey]);

    const handleSave = () => {
        if (isValid) {
            const updatedConfig = {
                openaiApiKey: openaiApiKey !== originalConfigRef.current?.openaiApiKey ? openaiApiKey : originalConfigRef.current?.openaiApiKey,
                unsplashApiKey: unsplashApiKey !== originalConfigRef.current?.unsplashApiKey ? unsplashApiKey : originalConfigRef.current?.unsplashApiKey,
                temperature: temperature !== originalConfigRef.current?.temperature ? temperature : originalConfigRef.current?.temperature,
                model: model !== originalConfigRef.current?.model ? model : originalConfigRef.current?.model,
                provider: provider !== originalConfigRef.current?.provider ? provider : originalConfigRef.current?.provider,
            };
            setConfig(updatedConfig);
            onClose();
        }
    };

    const handleReset = () => {
        setOpenaiApiKey('');
        setUnsplashApiKey('');
        setTemperature(0.5);
        setModel('gpt-4o-mini');
        setProvider('openai');
        setIsValid(false);
        const resetConfig = {
            openaiApiKey: '',
            unsplashApiKey: '',
            temperature: 0.5,
            model: 'gpt-4o-mini',
            provider: 'openai',
        };
        setConfig(resetConfig);
        localStorage.removeItem('appConfig');

    };
    const handleEdit = () => {
        setIsedit(false)
        setOpenaiApiKey('');
        setUnsplashApiKey('');
        setIsValid(false);
        const resetConfig = {
            openaiApiKey: '',
            unsplashApiKey: '',
            temperature: 0.5,
            model: 'gpt-4o-mini',
            provider: 'openai',
        };
        setConfig(resetConfig);
        localStorage.removeItem('appConfig');

    };
    const getTemperatureMessage = (temperature) => {
        if (temperature >= 0 && temperature < 0.2) {
            return '🧐 Estricto';
        } else if (temperature >= 0.2 && temperature < 0.4) {
            return '😐 Serio';
        } else if (temperature >= 0.4 && temperature < 0.6) {
            return '🙂 Neutro';
        } else if (temperature >= 0.6 && temperature < 0.8) {
            return '😄 Alegre';
        } else if (temperature >= 0.8 && temperature <= 1) {
            return '🤪 Locura';
        } else {
            return 'Valor de temperatura no válido';
        }
    };
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-bold mb-4">Configuración</h2>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">OpenAI API Key:</label>
                    <input
                        disabled={isEdit}
                        type="password"
                        className="w-full p-2 border rounded"
                        value={openaiApiKey}
                        onChange={(e) => setOpenaiApiKey(e.target.value)}
                    />
                    {openaiApiKey.trim() === '' && <span className="text-red-500 font-light text-xs animate-pulse">Requerido</span>}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Unsplash API Key:</label>
                    <input
                        disabled={isEdit}
                        type="password"
                        className="w-full p-2 border rounded"
                        value={unsplashApiKey}
                        onChange={(e) => setUnsplashApiKey(e.target.value)}
                    />
                    {unsplashApiKey.trim() === '' && <span className="text-red-500 font-light text-xs animate-pulse">Requerido</span>}
                </div>
                <div className="mb-4 ">
                    <label className="block text-sm font-bold mb-2">Temperatura del Modelo:</label>
                    <div className="flex">0
                        <input
                            disabled={isEdit}
                            type="range"
                            max="1"
                            min="0"
                            step="0.1"
                            className="w-full p-2 border rounded"
                            value={temperature}
                            onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        />1
                    </div>
                    <span className="text-gray-600 ">{getTemperatureMessage(temperature)}</span>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Modelo:</label>
                    <select
                        disabled={isEdit}
                        className="w-full p-2 border rounded"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                    >
                        {openaiModels.map((model) => (
                            <option key={model} value={model}>{model}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Proveedor:</label>
                    <select
                        disabled={isEdit}
                        className="w-full p-2 border rounded"
                        value={provider}
                        onChange={(e) => setProvider(e.target.value)}
                    >
                        <option value="openai">OpenAI</option>
                        <option value="otro-proveedor">Otro Proveedor</option>
                    </select>
                </div>
                <div className="flex justify-end">
                    {isValid ? (
                        <div>
                            <button
                                onClick={handleReset}
                                className="mr-2  px-4 py-2 text-white rounded bg-red-500 hover:bg-red-600"
                            >
                                Reset
                            </button>
                            <button onClick={onClose} className="mr-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded">
                                Cerrar
                            </button>
                        </div>
                    ) : (
                        <button onClick={onClose} className="mr-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded">
                            Cerrar
                        </button>
                    )}
                    {isEdit ? (
                        <button
                            onClick={handleEdit}
                            className={`px-4 py-2 text-white rounded ${!isValid ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-600'}`}
                            disabled={!isValid}
                        >
                            Editar
                        </button>) : (
                        <button
                            onClick={handleSave}
                            className={`px-4 py-2 text-white rounded ${!isValid ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'}`}
                            disabled={!isValid}
                        >
                            Guardar
                        </button>)}


                </div>
            </div>
        </div>
    );
};

export default SettingsModal;