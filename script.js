const sendChatBtn = document.querySelector("#send-btn");
const chatInput = document.querySelector(".chat-input textarea");
const chatBOX = document.querySelector(".chatbox");
const chatbottoggler = document.querySelector(".chatbot-toggler");

let userMessage;

const API_Key = "sk-your-key"; // Move this to backend for security

const createChatLi = (message, className) => {
    const chatli = document.createElement("li");
    chatli.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p>${message}</p>` : `<span class="material-symbols-outlined">smart_toy</span><p>${message}</p>`;
    chatli.innerHTML = chatContent;
    return chatli;
}

const generateResponse = (incomingChatLi) => {
    const ApI_Url = "https://api.openai.com/v1/chat/completions";
    let messageElement = incomingChatLi.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_Key}` // Secure this part in the backend
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant."
                },
                {
                    role: "user",
                    content: userMessage
                }
            ]
        })
    };

    fetch(ApI_Url, requestOptions)
        .then(res => res.json())
        .then(data => {
            messageElement.textContent = data.choices[0].message.content;
        })
        .catch(() => {
            messageElement.textContent = "Oops! Something went wrong";
        })
        .finally(() => chatBOX.scrollTop = chatBOX.scrollHeight);
}

let handleChat = () => {
    userMessage = chatInput.value.trim(); // Store message globally
    if (!userMessage) return;

    chatBOX.append(createChatLi(userMessage, "outgoing"));
    chatBOX.scrollTop = chatBOX.scrollHeight;

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatBOX.appendChild(incomingChatLi);
        generateResponse(incomingChatLi);
    }, 600);
}

sendChatBtn.addEventListener("click", handleChat);
chatbottoggler.addEventListener("click", () => document.body.classList.toggle("show-Chatbot"));
