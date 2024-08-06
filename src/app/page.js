"use client";

import { useState, useEffect } from "react";
import { generate } from "../actions/generate";
import { createUnsplashApi } from "../services/api";
import { readStreamableValue } from "ai/rsc";
import InfoApp from "../components/InfoApp";
import BlogPost from "../components/BlogPost";
import JsonDisplay from "../components/JsonDisplay";
import PromptInput from "../components/PromptInput";
import SettingsModal from "../components/SettingsModal";
import { encodeApiKey, decodeApiKey } from '../utils/encryptionUtils';
import ErrorModal from "../components/ErrorModal";

export default function Home({ userId }) {
  const [data, setPhotosResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [check, setCheck] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generation, setGeneration] = useState(null);
  const [config, setConfig] = useState({
    openaiApiKey: '',
    unsplashApiKey: '',
    temperature: 0.7,
    model: 'gpt-4o-mini',
    provider: 'openai',
  });
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  const unsplashApi = createUnsplashApi(userId, config.unsplashApiKey);

  useEffect(() => {
    const storedConfig = localStorage.getItem('appConfig');
    if (storedConfig) {
      try {
        const parsedConfig = JSON.parse(storedConfig);
        setConfig({
          ...parsedConfig,
          openaiApiKey: decodeApiKey(parsedConfig.openaiApiKey),
          unsplashApiKey: decodeApiKey(parsedConfig.unsplashApiKey),
        });
      } catch (error) {
        console.error('Error al decodificar la configuración:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (generation?.blogs?.length > 0 && generation.blogs[0]?.images) {
      getImagesAPi();
    }
  }, [generation]);

  function handleChange(e) {
    setCheck(e.target.checked);
  }

  function getImagesAPi() {
    unsplashApi.search.getPhotos({
      query: `${generation?.blogs[0]?.images}`,
      orientation: "landscape",
      perPage: 4,
    }).then((result) => {
      if (result.errors) {
        console.error('Error al obtener imágenes de Unsplash:', result.errors);
        setError('Error al obtener imágenes de Unsplash. Asegúrate de que tu API Key de Unsplash sea válida y tenga los permisos necesarios.');
      } else {
        setPhotosResponse(result);
      }
    }).catch((error) => {
      console.error('Error al obtener imágenes de Unsplash:', error);
      setError('Error al obtener imágenes de Unsplash. Asegúrate de que tu API Key de Unsplash sea válida y tenga los permisos necesarios.');
    });
  }

  const handleSubmit = async (config) => {
    setIsLoading(true);
    setError(null);

    try {
      const { object } = await generate(
        "Crea un blog sobre:" + input,
        config.openaiApiKey,
        config.temperature,
        config.model
      );
      for await (const partialObject of readStreamableValue(object)) {
        if (partialObject) {
          if (partialObject.error) {
            setError(partialObject.error);
          } else {
            setGeneration(partialObject);
          }
        }
      }
    } catch (error) {
      console.error('Error al generar contenido:', error);
      setError('Error al generar contenido. Asegúrate de que tu API Key de OpenAI sea válida y tenga los permisos necesarios.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="container mx-auto px-4">
        {!generation ? <InfoApp /> : (
          <div className="pt-12 justify-center w-full">
            <h1 className="text-center font-bold text-4xl">Blog AI</h1>
          </div>
        )}
        {generation?.blogs?.map((blog, index) => (
          <BlogPost key={index} blog={blog} data={data} />
        ))}
      </div>
      {check && (
        <JsonDisplay generation={generation} copied={copied} setCopied={setCopied} />
      )}
      <PromptInput
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
        check={check}
        setGeneration={setGeneration}
        handleChange={handleChange}
        config={config}
        setShowModal={setShowModal}
      />
      <SettingsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        setConfig={(newConfig) => {
          const encodedConfig = {
            ...newConfig,
            openaiApiKey: encodeApiKey(newConfig.openaiApiKey),
            unsplashApiKey: encodeApiKey(newConfig.unsplashApiKey),
          };
          localStorage.setItem('appConfig', JSON.stringify(encodedConfig));
          setConfig(newConfig);
        }}
      />
      <ErrorModal
        isOpen={error !== null}
        onClose={() => setError(null)}
        errorMessage={error}
      />
    </div>
  );
}