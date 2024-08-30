document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const userInput = document.getElementById('user-input');
    const chatLog = document.getElementById('chat-log');

    if (userInput.value.trim() !== '') {
        const userMessage = document.createElement('div');
        userMessage.className = 'message user-message';
        userMessage.textContent = userInput.value;
        chatLog.appendChild(userMessage);

        // Scroll to the bottom after user message
        scrollToBottom();

        const userMessageText = userInput.value.trim();
        userInput.value = '';

        setTimeout(() => {
            const botMessage = document.createElement('div');
            botMessage.className = 'message bot-message';
            botMessage.textContent = generateBotResponse(userMessageText);
            chatLog.appendChild(botMessage);

            // Scroll to the bottom after bot message
            scrollToBottom();
        }, 500);
    }
}

function scrollToBottom() {
    const chatBox = document.querySelector('.chat-box');
    chatBox.scrollTop = chatBox.scrollHeight;
}

function generateBotResponse(userMessage) {
    const responses = {
        "안녕": "안녕하세요! 만나서 반가워요.",
        "잘 지내?": "네, 잘 지내고 있어요. 당신은요?",
        "이름이 뭐야?": "저는 채팅 봇이에요. 당신의 이름은 무엇인가요?",
        "무슨 일을 해?": "저는 여러분과 대화를 나누는 일을 하고 있어요.",
        "고마워": "천만에요! 도움이 되어 기뻐요.",
        "도희": "걔 공주잖아",
        "진웅": "완전 잘생긴 왕자잖아.",
        "진하": "그 왕자의 동생... 신이 되고 싶어서 자꾸 하늘에 서려고 하지",
        "민지": "완전 바보 ㅋㅋ",
        "엔트위즈": "아직도 4대 보험 안 냈대?",
    };

    const learnedResponses = JSON.parse(localStorage.getItem('learnedResponses')) || {};

    let finalResponse = "뭐라는지 모르겠어요. 저를 학습시키려면 '학습:키워드:응답' 형식으로 입력해 주세요.";

    for (let key in learnedResponses) {
        if (userMessage.includes(key)) {
            finalResponse = learnedResponses[key];
        }
    }

    for (let key in responses) {
        if (userMessage.includes(key)) {
            finalResponse = responses[key];
        }
    }

    if (userMessage.startsWith('학습:')) {
        const parts = userMessage.split(':');
        if (parts.length === 3) {
            const keyword = parts[1].trim();
            const response = parts[2].trim();
            learnedResponses[keyword] = response;
            localStorage.setItem('learnedResponses', JSON.stringify(learnedResponses));
            finalResponse = `배웠어요! "${keyword}"에 대해 이렇게 답할게요: "${response}"`;
        } else {
            finalResponse = "학습시키려면 '학습:키워드:응답' 형식으로 입력해 주세요.";
        }
    }

    return finalResponse;
}
