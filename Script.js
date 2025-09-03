document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');

    function appendMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', type);
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll
    }

    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    async function sendMessage() {
        const messageText = messageInput.value.trim();
        if (messageText === '') return;

        appendMessage(messageText, 'sent');
        messageInput.value = '';

        // Enviar el mensaje a n8n y esperar la respuesta
        try {
            const response = await fetch('TU_URL_WEBHOOK_N8N_AQUI', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: messageText }),
            });

            if (response.ok) {
                const data = await response.json();
                // Asume que n8n devuelve un objeto con una propiedad 'response' o similar
                const n8nResponse = data.response || 'No hay respuesta de n8n.';
                appendMessage(n8nResponse, 'received');
            } else {
                appendMessage('Error al conectar con n8n.', 'received');
            }
        } catch (error) {
            console.error('Error:', error);
            appendMessage('Error de red o servidor.', 'received');
        }
    }

    // Mensaje de bienvenida inicial (opcional)
    appendMessage('¡Hola! ¿En qué puedo ayudarte hoy?', 'received');
});