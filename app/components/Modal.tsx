import React, { useState, useEffect } from 'react';
import ClientComponent from './ClientComponent';
import { fetchAccessToken } from "@humeai/voice";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
    const [accessToken, setAccessToken] = useState<string>('');
    const [showClientComponent, setShowClientComponent] = useState<boolean>(false);

    useEffect(() => {
        async function getAccessToken() {
            const token = await fetchAccessToken({
                apiKey: String(process.env.NEXT_PUBLIC_HUME_API_KEY),
                secretKey: String(process.env.NEXT_PUBLIC_HUME_SECRET_KEY),
            });
            console.log(token)
            setAccessToken(token);
        }
        getAccessToken();
    }, []);

    if (!isOpen) return null;

    const AssistClicked = () => {
        setShowClientComponent(true);
    };

    const ClosedClicked = () => {
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-white bg-opacity-20 overflow-y-auto h-full w-full flex justify-center items-center">
            <div className="modal-bg p-44 rounded-lg shadow-lg flex flex-col items-center">
                <button className="absolute top-2 right-2 text-lg" onClick={onClose}>&times;</button>
                {children}
                <div className="mt-4 w-full flex justify-around items-center pt-4">
                    {showClientComponent && <ClientComponent accessToken={accessToken} />}
                    <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white  p-4  text-xl rounded transition duration-200" onClick={AssistClicked}>Assist Me</button>
                    <button type="button" className="bg-purple-500 hover:bg-purple-600 text-white  p-4 text-xl rounded transition duration-200" onClick={ClosedClicked}>No Thanks</button>
                </div>
            </div>
        </div>
    );
};
