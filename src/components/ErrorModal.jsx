const ErrorModal = ({ isOpen, onClose, errorMessage }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-bold mb-4">Error</h2>
                <p className="text-red-500 mb-4">{errorMessage}</p>
                <button onClick={onClose} className="px-4 py-2 bg-red-500 text-white rounded">Cerrar</button>
            </div>
        </div>
    );
};

export default ErrorModal;