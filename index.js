function fetchSeoulWeather(callback, temperatureOnly = false) {
    const apiKey = '1e5c0425d7d6ddc50ad6768bbca7709a';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=${apiKey}&units=metric`;

    const weatherTranslations = {
        "clear sky": "맑은",
        "few clouds": "구름 조금",
        "scattered clouds": "흩어진 구름",
        "broken clouds": "조각 구름",
        "shower rain": "소나기",
        "rain": "비",
        "thunderstorm": "천둥번개",
        "snow": "눈",
        "mist": "안개",
        "overcast clouds" : "흐림",
        "light rain" : "이슬비"
    };
    const weatherTranslations2 = {
        "clear sky": "🌞",
        "few clouds": "🌤️",
        "scattered clouds": "☁️",
        "broken clouds": "☁️",
        "shower rain": "🌧️",
        "rain": "☔",
        "thunderstorm": "⛈️",
        "snow": "❄️",
        "mist": "🌫️",
        "overcast clouds" : "☁️",
        "light rain" : "☔"
    };

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const weatherDescriptionEnglish = data.weather[0].description;
            const weatherDescription = weatherTranslations[weatherDescriptionEnglish] || weatherDescriptionEnglish;
            const weatherEmoji = weatherTranslations2[weatherDescriptionEnglish] || '';
            const temperature = data.main.temp;

            const weatherMessage = `현재 서울의 날씨는 ${weatherDescription}, 온도는 ${temperature}°C 입니다.`;

            const headerWeatherSpan = document.querySelector('.header span');
            headerWeatherSpan.textContent = `${weatherEmoji}`;
            headerWeatherSpan.dataset.weather = weatherDescriptionEnglish;

            if (callback) {
                if (temperatureOnly) {
                    callback(`현재 서울의 온도는 ${temperature}°C 입니다.`);
                } else {
                    callback(weatherMessage);
                }
            }
        })
        .catch(error => {
            console.error('Error fetching the weather data:', error);
            if (callback) {
                callback("날씨 정보를 가져오는데 실패했습니다. 다시 시도해주세요.");
            }
        });
}

fetchSeoulWeather();

function fetchRandomYouTubeSong(callback, useWeatherBasedQuery = false) {
    const headerWeatherSpan = document.querySelector('.header span');
    const currentWeather = headerWeatherSpan.dataset.weather;

    let searchQuery = '쏘플';

    if (useWeatherBasedQuery && currentWeather) {
        const weatherToMusic = {
            "clear sky": "맑은 날씨에 어울리는 노래",
            "few clouds": "구름 조금 있을 때 듣기 좋은 노래",
            "scattered clouds": "흩어진 구름과 어울리는 노래",
            "broken clouds": "조각 구름과 어울리는 노래",
            "shower rain": "소나기에 어울리는 노래",
            "rain": "비오는 날에 어울리는 노래",
            "thunderstorm": "천둥번개 칠 때 듣기 좋은 노래",
            "snow": "눈 오는 날에 어울리는 노래",
            "mist": "안개 낀 날에 어울리는 노래",
        };
        searchQuery = weatherToMusic[currentWeather] || searchQuery;
    }

    const apiKey = 'AIzaSyAAoLK2aGtnwLl46EeJBzCtfIdxnuDSWh0';
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=${encodeURIComponent(searchQuery)}&type=video&videoEmbeddable=true&key=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.items && data.items.length > 0) {
                const randomIndex = Math.floor(Math.random() * data.items.length);
                const videoId = data.items[randomIndex].id.videoId;
                const videoTitle = data.items[randomIndex].snippet.title;
                const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
                
                const message = `
                    이 노래는 어떠세요?<br> ${videoTitle}<br>
                    <a href="${videoUrl}" target="_blank">☞ 클릭 하면 유튜브 채널로 이동 합니다</a><br>
                    <iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoId}" 
                    frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                `;
                
                callback(message);
            } else {
                callback("노래를 찾을 수 없었어요. 다시 시도해 주세요.");
            }
        })
        .catch(error => {
            console.error('Error fetching the YouTube data:', error);
            callback("노래 정보를 가져오는데 실패했습니다. 다시 시도해주세요.");
        });
}

document.getElementById('menu-btn').addEventListener('click', function() {
    const menu = document.querySelector('.menu');
    menu.classList.toggle('show');
});

document.querySelectorAll('.menu-item').forEach(button => {
    button.addEventListener('click', function() {
        const menu = document.querySelector('.menu');
        menu.classList.remove('show');

        if (this.getAttribute('data-text') === "현재 날씨에 따른 노래 추천받기") {
            fetchRandomYouTubeSong(displayMessage, true);
        } else {
            const userInput = document.getElementById('user-input');
            userInput.value = this.getAttribute('data-text');
            sendMessage(); // Send the message automatically
        }
    });
});

// Adding event listeners for the send button and "Enter" key
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
        displayMessage(userInput.value, true); 
        
        const userMessageText = userInput.value.trim();
        userInput.value = '';

        setTimeout(function() {
            generateBotResponse(userMessageText);
        }, 1000);
    }
}

function displayMessage(message, isUser = false) {
    const chatLog = document.getElementById('chat-log');
    
    const messageLabel = document.createElement('div');
    messageLabel.className = isUser ? 'message-label user-label' : 'message-label bot-label';
    messageLabel.textContent = isUser ? 'me' : '도희🎀';
    
    const messageElement = document.createElement('div');
    messageElement.className = isUser ? 'message user-message' : 'message bot-message';
    messageElement.innerHTML = message;

    chatLog.appendChild(messageLabel);
    chatLog.appendChild(messageElement);

    scrollToBottom();
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
        "민지": "맨날 리썰 하자고 하는 바보임",
        "오늘 몇 도야": function(callback) {
            fetchSeoulWeather(callback, true);
        },
        "날씨": function(callback) {
            fetchSeoulWeather(callback, false); 
        },
        "온도": function(callback) {
            fetchSeoulWeather(callback, true);
        },
        "몇 시야": function(callback) {
            fetchSeoulTime(callback);
        },
        "시간": function(callback) {
            fetchSeoulTime(callback);
        },
        "노래 추천": function(callback) {
            fetchRandomYouTubeSong(callback);
        },
        "노래": function(callback) {
            fetchRandomYouTubeSong(callback);
        },
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
            if (typeof responses[key] === 'function') {
                responses[key](displayMessage);
                return; 
            } else {
                finalResponse = responses[key];
            }
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

    displayMessage(finalResponse);
}
