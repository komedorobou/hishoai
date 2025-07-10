// ===================================================================
// HishoAI Enhanced - Chat System with Multiple Modes（レイアウト変更対応版）
// チャット機能の実装 - モード別対話システム（全幅レイアウト・サイドバー機能統合）
// ===================================================================

// ===== API エンドポイント定義 =====
// Vercelプロキシエンドポイント
const PROXY_ENDPOINT = 'https://hishoai.vercel.app/api/openai-proxy';
const CHAT_ENDPOINT = PROXY_ENDPOINT;
const RESPONSES_ENDPOINT = PROXY_ENDPOINT;

// ===== o3系モデル判定関数 =====
function isResponsesModel(model) {
    return /^o3/.test(model);
}

// ===== チャットモード定義 =====
const CHAT_MODES = {
    chat: {
        name: 'chat',
        displayName: '一般会話',
        icon: '💬',
        color: '#007aff',
        description: '雑談や日常的な質問に最適。自然な口調で親しみやすく応答します。',
        temperature: 0.5,
        maxTokens: 1000,
        model: 'gpt-4o',
        systemPrompt: 'あなたは親しみやすくカジュアルなAIアシスタントです。ユーザーとフレンドリーに会話し、自然な口調で応答してください。絵文字や感嘆符を適度に使い、堅苦しくない雰囲気を心がけてください。相手の気持ちに寄り添い、楽しい会話を心がけてください。',
        samples: [
            { icon: '👋', text: 'よっ！', category: '挨拶' },
            { icon: '🍵', text: '冷たい麦茶が美味しすぎて止まらない', category: '雑談' },
            { icon: '🎮', text: 'しりとりしようよ', category: 'ゲーム' }
        ]
    },
    teach: {
        name: 'teach',
        displayName: '解説',
        icon: '📚',
        color: '#34c759',
        description: '体系的な説明や手順の解説に最適。構造化された詳細な情報を提供します。',
        temperature: 0.35,
        maxTokens: 2000,
        model: 'o3',
        systemPrompt: 'あなたは知識豊富で丁寧な教師のようなAIアシスタントです。質問に対して体系的で分かりやすい説明を提供してください。必要に応じて、箇条書きや番号付きリスト、見出しなどを使って情報を構造化してください。専門用語は適切に説明し、例えや図解の説明も交えて理解しやすくしてください。',
        samples: [
            { icon: '🍺', text: '二日酔いって早く治す方法ある？', category: '健康' },
            { icon: '📱', text: 'おすすめのスマホ写真加工アプリは？', category: 'テクノロジー' },
            { icon: '🌙', text: '月って本当に地球から離れてるの？', category: '科学' }
        ]
    },
    idea: {
        name: 'idea',
        displayName: 'クリエイティブ',
        icon: '💡',
        color: '#ff9500',
        description: 'アイデア出しや創造的な発想に最適。自由で斬新な提案を行います。',
        temperature: 1.0,
        maxTokens: 800,
        model: 'gpt-4o',
        systemPrompt: 'あなたは創造的で革新的なアイデアを生み出すAIアシスタントです。ユニークで斬新な発想を提供し、既成概念にとらわれない提案をしてください。ブレインストーミングのパートナーとして、多角的な視点から様々なアイデアを出し、時にはユーモアも交えながら創造的な解決策を提示してください。',
        samples: [
            { icon: '💥', text: 'SNSでバズる企画を考えて', category: 'マーケティング' },
            { icon: '🏰', text: '異世界ものの舞台設定を作って', category: '創作' },
            { icon: '🏰', text: 'カフェの屋号案をいくつか', category: 'ビジネス' }
        ]
    }
};

// ===== DEEP RESEARCHモード定義 =====
const DEEP_RESEARCH_MODE = {
    name: 'deep-research',
    displayName: 'DEEP RESEARCH',
    icon: '🔬',
    color: '#6B46C1',
    description: '深層調査モード：複数の質問を通じて詳細な分析を実行します。',
    temperature: 0.2,
    maxTokens: 4000,
    model: 'o3-deep-research-2025-06-26',
    systemPrompt: 'あなたは深層調査専門のAIリサーチャーです。ユーザーの質問に対して、まず調査に必要な追加質問を複数行い、すべての情報を収集した後に包括的で詳細な分析結果を提供してください。学術的で客観的なアプローチを心がけ、信頼性の高い情報を基に深く掘り下げた回答を行ってください。'
};

// ===== グローバル変数 =====
let currentChatMode = 'chat';
let isDeepResearchMode = false;
let deepResearchQuestions = [];
let deepResearchAnswers = [];
// chatHistory は core.js で定義済みのため削除
let chatContextByMode = {
    chat: [],
    teach: [],
    idea: []
};

// 記憶機能用のデータストレージ
let memoryData = {
    memories: [],
    lastSaved: null
};

// ===== チャット機能初期化 =====
function initializeChatSection() {
    console.log('🚀 チャット機能初期化中（全幅レイアウト対応版）...');
    
    // モードタブの初期化
    initializeChatModes();
    
    // チャット入力の自動リサイズとEnterキー送信
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('input', autoResizeTextarea);
        chatInput.addEventListener('keydown', handleChatKeydown);
        console.log('✅ チャット入力イベントリスナー設定完了');
    }
    
    // モード情報カードの閉じるボタン
    const closeInfoBtn = document.querySelector('.close-mode-info');
    if (closeInfoBtn) {
        closeInfoBtn.addEventListener('click', closeModeInfo);
    }
    
    // 記憶データの初期化
    initializeMemorySystem();
    
    // 初期モードの設定
    switchChatMode('chat');
    
    console.log('✅ チャット機能初期化完了（全幅レイアウト対応版）');
}

// ===== モードタブの初期化 =====
function initializeChatModes() {
    const modeContainer = document.querySelector('.chat-mode-selector');
    if (!modeContainer) return;
    
    // モードタブをクリア
    modeContainer.innerHTML = '';
    
    // 各モードのタブを作成
    Object.keys(CHAT_MODES).forEach(modeKey => {
        const mode = CHAT_MODES[modeKey];
        const button = document.createElement('button');
        button.className = `mode-tab${modeKey === currentChatMode ? ' active' : ''}`;
        button.setAttribute('data-mode', modeKey);
        button.innerHTML = `
            <span class="mode-icon">${mode.icon}</span>
            <span class="mode-name">${mode.displayName}</span>
        `;
        
        // 基本クリックイベント
        button.addEventListener('click', () => switchChatMode(modeKey));
        
        // Teachモード専用：右クリック・ダブルクリックでDEEP RESEARCH
        if (modeKey === 'teach') {
            button.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                activateDeepResearchMode();
            });
            
            button.addEventListener('dblclick', (e) => {
                e.preventDefault();
                activateDeepResearchMode();
            });
        }
        
        modeContainer.appendChild(button);
    });
}

// ===== DEEP RESEARCHモード起動 =====
function activateDeepResearchMode() {
    isDeepResearchMode = true;
    deepResearchQuestions = [];
    deepResearchAnswers = [];
    
    // 全画面モーダル表示
    showDeepResearchModal();
    
    console.log('🔬 DEEP RESEARCHモード起動');
}

// ===== DEEP RESEARCH全画面モーダル表示 =====
function showDeepResearchModal() {
    const modal = document.createElement('div');
    modal.className = 'deep-research-modal-overlay active';
    modal.innerHTML = `
        <div class="deep-research-modal">
            <div class="deep-research-header">
                <div class="deep-research-info">
                    <h2>${DEEP_RESEARCH_MODE.icon} ${DEEP_RESEARCH_MODE.displayName}</h2>
                    <p>${DEEP_RESEARCH_MODE.description}</p>
                </div>
                <button class="deep-research-close" onclick="closeDeepResearchModal()">&times;</button>
            </div>
            
            <div class="deep-research-content">
                <div class="deep-research-messages" id="deepResearchMessages">
                    <div class="deep-research-welcome">
                        <div class="welcome-icon">${DEEP_RESEARCH_MODE.icon}</div>
                        <h3>深層調査を開始します</h3>
                        <p>調査テーマを入力してください。詳細な分析のため、いくつか質問をさせていただきます。</p>
                    </div>
                </div>
                
                <div class="deep-research-input-area">
                    <div class="deep-research-input-wrapper">
                        <textarea id="deepResearchInput" placeholder="調査したいテーマを入力してください..." class="deep-research-input"></textarea>
                        <button id="deepResearchSendBtn" class="deep-research-send-btn" onclick="sendDeepResearchMessage()">
                            <span class="send-icon">🔬</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 入力エリアの初期化
    const input = document.getElementById('deepResearchInput');
    if (input) {
        input.addEventListener('input', autoResizeTextarea);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendDeepResearchMessage();
            }
        });
        input.focus();
    }
}

// ===== DEEP RESEARCHモーダル閉じる =====
function closeDeepResearchModal() {
    isDeepResearchMode = false;
    const modal = document.querySelector('.deep-research-modal-overlay');
    if (modal) {
        modal.remove();
    }
}

// ===== DEEP RESEARCHメッセージ送信 =====
async function sendDeepResearchMessage() {
    const input = document.getElementById('deepResearchInput');
    if (!input) return;
    
    const message = input.value.trim();
    if (!message) return;
    
    addDeepResearchMessage('user', message);
    input.value = '';
    input.style.height = 'auto';
    
    const sendBtn = document.getElementById('deepResearchSendBtn');
    if (sendBtn) sendBtn.disabled = true;
    
    // タイピングインジケーター表示
    const typingId = showDeepResearchTypingIndicator();
    
    try {
        const currentApiKey = ApiKeyManager.get();
        
        if (ApiKeyManager.isValid()) {
            // DEEP RESEARCHロジック
            if (deepResearchQuestions.length === 0) {
                // 初回：質問生成
                await generateDeepResearchQuestions(message, currentApiKey, typingId);
            } else if (deepResearchAnswers.length < deepResearchQuestions.length) {
                // 質問回答中
                deepResearchAnswers.push(message);
                removeDeepResearchTypingIndicator(typingId);
                
                if (deepResearchAnswers.length < deepResearchQuestions.length) {
                    // 次の質問を表示
                    addDeepResearchMessage('assistant', deepResearchQuestions[deepResearchAnswers.length]);
                } else {
                    // 全ての質問完了：最終分析実行
                    await executeDeepResearchAnalysis(currentApiKey);
                }
            }
        } else {
            // APIキー未設定時のサンプル応答
            removeDeepResearchTypingIndicator(typingId);
            await simulateProcessing();
            addDeepResearchMessage('assistant', generateSampleDeepResearchResponse(message));
        }
    } catch (error) {
        removeDeepResearchTypingIndicator(typingId);
        console.error('DEEP RESEARCHエラー:', error);
        addDeepResearchMessage('assistant', `エラーが発生しました: ${error.message}`);
    } finally {
        if (sendBtn) sendBtn.disabled = false;
    }
}

// ===== DEEP RESEARCH質問生成 =====
async function generateDeepResearchQuestions(topic, apiKey, typingId) {
    const messages = [
        {
            role: 'system',
            content: `あなたは深層調査の専門家です。与えられたテーマについて詳細な分析を行うため、重要な情報を収集する質問を3-5個生成してください。質問は具体的で、調査の精度を高めるものにしてください。

出力形式：
質問1: [質問内容]
質問2: [質問内容]
質問3: [質問内容]
...`
        },
        {
            role: 'user',
            content: `調査テーマ: ${topic}\n\nこのテーマについて深層調査を行うための質問を生成してください。`
        }
    ];
    
    // APIエンドポイントをモデルに応じて切り替え
    const url = PROXY_ENDPOINT;
    
    // ヘッダー
    const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
    };
    
    // リクエストボディをAPIに応じて切り替え
    const body = isResponsesModel(DEEP_RESEARCH_MODE.model) ? {
        endpoint: 'responses',
        model: DEEP_RESEARCH_MODE.model,
        messages,
        temperature: DEEP_RESEARCH_MODE.temperature
    } : {
        endpoint: 'chat',
        model: DEEP_RESEARCH_MODE.model,
        messages: messages,
        max_tokens: DEEP_RESEARCH_MODE.maxTokens,
        temperature: DEEP_RESEARCH_MODE.temperature
    };
    
    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
    });
    
    removeDeepResearchTypingIndicator(typingId);
    
    if (!response.ok) {
        throw new Error(ApiKeyManager.getErrorMessage(response.status));
    }
    
    const data = await response.json();
    
    // レスポンスからAIの回答を取得（APIに応じて切り替え）
    const questionsText = isResponsesModel(DEEP_RESEARCH_MODE.model)
        ? (data.output_text || data.output || '').trim()
        : (data.choices && data.choices[0] && data.choices[0].message 
            ? data.choices[0].message.content.trim()
            : '');
    
    if (questionsText) {
        // 質問を解析して配列に格納
        deepResearchQuestions = questionsText
            .split('\n')
            .filter(line => line.match(/^質問\d+:/))
            .map(line => line.replace(/^質問\d+:\s*/, ''));
        
        // 最初の質問を表示
        if (deepResearchQuestions.length > 0) {
            addDeepResearchMessage('assistant', `詳細な分析のため、${deepResearchQuestions.length}つの質問にお答えください。\n\n**質問 1/${deepResearchQuestions.length}**\n${deepResearchQuestions[0]}`);
        }
    }
}

// ===== DEEP RESEARCH最終分析実行 =====
async function executeDeepResearchAnalysis(apiKey) {
    const typingId = showDeepResearchTypingIndicator();
    
    const analysisPrompt = `調査テーマと質問回答を基に、包括的な深層分析を実行してください。

調査テーマ: ${deepResearchAnswers.length > 0 ? '前回の調査テーマ' : ''}

質問と回答:
${deepResearchQuestions.map((q, i) => `Q${i + 1}: ${q}\nA${i + 1}: ${deepResearchAnswers[i] || '未回答'}`).join('\n\n')}

以下の観点から詳細に分析してください：
1. 現状分析
2. 問題点・課題の特定
3. 原因分析
4. 解決策・改善案
5. 実行計画
6. リスク要因
7. 成功指標

分析結果は構造化して、実用的で具体的な内容にしてください。`;
    
    const messages = [
        {
            role: 'system',
            content: DEEP_RESEARCH_MODE.systemPrompt
        },
        {
            role: 'user',
            content: analysisPrompt
        }
    ];
    
    try {
        // APIエンドポイントをモデルに応じて切り替え
        const url = PROXY_ENDPOINT;
        
        // ヘッダー
        const headers = {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        };
        
        // リクエストボディをAPIに応じて切り替え
        const body = isResponsesModel(DEEP_RESEARCH_MODE.model) ? {
            endpoint: 'responses',
            model: DEEP_RESEARCH_MODE.model,
            messages,
            temperature: DEEP_RESEARCH_MODE.temperature
        } : {
            endpoint: 'chat',
            model: DEEP_RESEARCH_MODE.model,
            messages: messages,
            max_tokens: DEEP_RESEARCH_MODE.maxTokens,
            temperature: DEEP_RESEARCH_MODE.temperature
        };
        
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        });
        
        removeDeepResearchTypingIndicator(typingId);
        
        if (!response.ok) {
            throw new Error(ApiKeyManager.getErrorMessage(response.status));
        }
        
        const data = await response.json();
        
        // レスポンスからAIの回答を取得（APIに応じて切り替え）
        const analysisResult = isResponsesModel(DEEP_RESEARCH_MODE.model)
            ? (data.output_text || data.output || '分析結果の取得に失敗しました').trim()
            : (data.choices && data.choices[0] && data.choices[0].message 
                ? data.choices[0].message.content.trim()
                : '分析結果の取得に失敗しました');
        
        if (analysisResult && analysisResult !== '分析結果の取得に失敗しました') {
            addDeepResearchMessage('assistant', `## 🔬 深層分析結果\n\n${analysisResult}\n\n---\n\n✅ **分析完了** - 新しい調査を開始する場合は、再度テーマを入力してください。`);
            
            // 分析完了後の初期化
            deepResearchQuestions = [];
            deepResearchAnswers = [];
        } else {
            throw new Error('分析結果の取得に失敗しました');
        }
    } catch (error) {
        removeDeepResearchTypingIndicator(typingId);
        throw error;
    }
}

// ===== DEEP RESEARCHメッセージ追加 =====
function addDeepResearchMessage(role, content) {
    const messagesContainer = document.getElementById('deepResearchMessages');
    if (!messagesContainer) return;
    
    const welcomeMessage = messagesContainer.querySelector('.deep-research-welcome');
    if (welcomeMessage) {
        welcomeMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `deep-research-message ${role}`;
    
    const avatarIcon = role === 'user' ? '👤' : DEEP_RESEARCH_MODE.icon;
    
    messageDiv.innerHTML = `
        <div class="message-avatar ${role}-avatar">
            ${avatarIcon}
        </div>
        <div class="message-content">
            <div class="message-bubble">
                ${formatMessageContent(content)}
            </div>
            <div class="message-actions">
                <button class="message-action-btn" onclick="copyMessage(this)" title="コピー">
                    📋
                </button>
                ${role === 'assistant' ? `<button class="message-action-btn memory-btn" onclick="saveToMemory(this)" title="記憶させる">
                    🧠
                </button>` : ''}
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ===== DEEP RESEARCHタイピングインジケーター =====
function showDeepResearchTypingIndicator() {
    const messagesContainer = document.getElementById('deepResearchMessages');
    if (!messagesContainer) return;
    
    const typingDiv = document.createElement('div');
    const typingId = Date.now();
    
    typingDiv.className = 'deep-research-message assistant typing';
    typingDiv.setAttribute('data-typing-id', typingId);
    typingDiv.innerHTML = `
        <div class="message-avatar assistant-avatar">${DEEP_RESEARCH_MODE.icon}</div>
        <div class="message-content">
            <div class="message-bubble">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    return typingId;
}

// ===== DEEP RESEARCHタイピングインジケーター削除 =====
function removeDeepResearchTypingIndicator(typingId) {
    const typingDiv = document.querySelector(`[data-typing-id="${typingId}"]`);
    if (typingDiv) {
        typingDiv.remove();
    }
}

// ===== 記憶システム初期化 =====
function initializeMemorySystem() {
    // ローカルストレージから記憶データを読み込み
    const savedMemory = localStorage.getItem('hishoai-memory-data');
    if (savedMemory) {
        try {
            memoryData = JSON.parse(savedMemory);
        } catch (error) {
            console.error('記憶データの読み込みに失敗:', error);
            memoryData = { memories: [], lastSaved: null };
        }
    }
}

// ===== 記憶機能（メッセージを記憶に保存） =====
function saveToMemory(button) {
    const messageElement = button.closest('.chat-message, .deep-research-message');
    if (!messageElement) return;
    
    const messageContent = messageElement.querySelector('.message-bubble');
    const text = messageContent.textContent || messageContent.innerText;
    const timestamp = new Date().toISOString();
    
    const memoryItem = {
        id: Date.now(),
        content: text,
        timestamp: timestamp,
        mode: isDeepResearchMode ? 'deep-research' : currentChatMode,
        source: isDeepResearchMode ? 'DEEP RESEARCH' : CHAT_MODES[currentChatMode].displayName
    };
    
    memoryData.memories.push(memoryItem);
    memoryData.lastSaved = timestamp;
    
    // JSONファイルとして保存
    saveMemoryDataToJson();
    
    // ローカルストレージにもバックアップ
    localStorage.setItem('hishoai-memory-data', JSON.stringify(memoryData));
    
    // ボタンの一時的な視覚フィードバック
    const originalText = button.innerHTML;
    button.innerHTML = '✅';
    button.style.background = '#22c55e';
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = '';
    }, 2000);
    
    if (typeof showNotification !== 'undefined') {
        showNotification('💾 記憶に保存しました', 'success');
    }
    
    console.log('📝 記憶に保存:', memoryItem);
}

// ===== 記憶データをJSONファイルとして保存 =====
function saveMemoryDataToJson() {
    const jsonData = JSON.stringify(memoryData, null, 2);
    const filename = `hishoai-memory-${new Date().toISOString().split('T')[0]}.json`;
    
    if (typeof downloadFile !== 'undefined') {
        downloadFile(jsonData, filename, 'application/json');
    } else {
        // フォールバック：ブラウザダウンロード
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// ===== 記憶データ表示 =====
function showMemoryData() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">🧠 記憶データ</h2>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
            </div>
            
            <div class="memory-content">
                <div class="memory-stats">
                    <p><strong>保存件数:</strong> ${memoryData.memories.length}件</p>
                    <p><strong>最終保存:</strong> ${memoryData.lastSaved ? new Date(memoryData.lastSaved).toLocaleString() : '未保存'}</p>
                </div>
                
                <div class="memory-list">
                    ${memoryData.memories.length === 0 ? 
                        '<p class="empty-memory">まだ記憶データがありません</p>' :
                        memoryData.memories.slice(-10).reverse().map(memory => `
                            <div class="memory-item">
                                <div class="memory-header">
                                    <span class="memory-source">${memory.source}</span>
                                    <span class="memory-time">${new Date(memory.timestamp).toLocaleString()}</span>
                                </div>
                                <div class="memory-content">${memory.content.substring(0, 200)}${memory.content.length > 200 ? '...' : ''}</div>
                            </div>
                        `).join('')
                    }
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="action-btn" onclick="saveMemoryDataToJson()">📥 JSONエクスポート</button>
                <button class="skip-btn" onclick="this.closest('.modal-overlay').remove()">閉じる</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// ===== チャットモード切り替え =====
function switchChatMode(mode) {
    if (!CHAT_MODES[mode]) return;
    
    currentChatMode = mode;
    const modeConfig = CHAT_MODES[mode];
    
    // タブのアクティブ状態を更新
    document.querySelectorAll('.mode-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-mode') === mode) {
            tab.classList.add('active');
        }
    });
    
    // モード情報カードを更新
    updateModeInfoCard(modeConfig);
    
    // サンプルを更新
    updateChatSamples(modeConfig.samples);
    
    // チャット履歴を切り替え
    loadChatHistoryForMode(mode);
    
    // UIのカラーテーマを更新
    updateChatTheme(modeConfig.color);
    
    console.log(`✅ チャットモード切り替え: ${mode} (API: ${modeConfig.model})`);
}

// ===== モード情報カードの更新 =====
function updateModeInfoCard(modeConfig) {
    const infoCard = document.querySelector('.mode-info-card');
    if (!infoCard) return;
    
    infoCard.innerHTML = `
        <div class="mode-info-header">
            <div class="mode-info-title">
                <span class="mode-icon">${modeConfig.icon}</span>
                <span>${modeConfig.displayName}モード</span>
            </div>
            <button class="close-mode-info" onclick="closeModeInfo()">×</button>
        </div>
        <p class="mode-info-description">${modeConfig.description}</p>
        <p class="mode-api-info">API: ${modeConfig.model} | Temperature: ${modeConfig.temperature}</p>
    `;
    
    infoCard.style.display = 'block';
    infoCard.className = `mode-info-card ${modeConfig.name}-mode active`;
}

// ===== モード情報を閉じる =====
function closeModeInfo() {
    const infoCard = document.querySelector('.mode-info-card');
    if (infoCard) {
        infoCard.style.display = 'none';
    }
}

// ===== サンプルの更新（コンパクト版対応） =====
function updateChatSamples(samples) {
    const samplesGrid = document.querySelector('.chat-samples-grid');
    if (!samplesGrid) return;
    
    samplesGrid.innerHTML = samples.map(sample => `
        <button class="sample-card" onclick="sendQuickMessage('${sample.text.replace(/'/g, "\\'")}')">
            <span class="sample-icon">${sample.icon}</span>
            <div class="sample-content">
                <div class="sample-text">${sample.text}</div>
                <div class="sample-category">${sample.category}</div>
            </div>
        </button>
    `).join('');
}

// ===== チャットテーマの更新 =====
function updateChatTheme(color) {
    const chatContainer = document.querySelector('.chat-main-container');
    if (chatContainer) {
        chatContainer.style.setProperty('--mode-color', color);
    }
}

// ===== モード別履歴の読み込み =====
function loadChatHistoryForMode(mode) {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;
    
    // 現在の履歴を保存
    if (chatHistory.length > 0) {
        chatContextByMode[currentChatMode] = [...chatHistory];
    }
    
    // 新しいモードの履歴を読み込み
    chatHistory = chatContextByMode[mode] || [];
    
    // メッセージエリアをクリア
    messagesContainer.innerHTML = '';
    
    if (chatHistory.length === 0) {
        // ウェルカムメッセージを表示
        showChatWelcome();
    } else {
        // 既存の履歴を表示
        chatHistory.forEach(msg => {
            addMessageToChat(msg.role, msg.content, false);
        });
    }
}

// ===== ウェルカムメッセージ表示 =====
function showChatWelcome() {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;
    
    const modeConfig = CHAT_MODES[currentChatMode];
    messagesContainer.innerHTML = `
        <div class="chat-welcome">
            <div class="welcome-icon">${modeConfig.icon}</div>
            <h3>${modeConfig.displayName}モードへようこそ！</h3>
            <p>${modeConfig.description}</p>
            <p style="color: var(--mode-color, #667eea); font-size: 0.875rem; margin-top: 0.5rem;">
                💡 サンプルをクリックして会話を始めてみましょう
            </p>
            ${modeConfig.name === 'teach' ? `
                <p style="color: #6B46C1; font-size: 0.8rem; margin-top: 1rem; padding: 0.5rem; background: rgba(107, 70, 193, 0.1); border-radius: 0.5rem;">
                    🔬 <strong>DEEP RESEARCH:</strong> 解説タブを右クリックまたはダブルクリックで深層調査モードに切り替えできます
                </p>
            ` : ''}
        </div>
    `;
}

// ===== テキストエリアの自動リサイズ =====
function autoResizeTextarea(e) {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
}

// ===== キーボードショートカット =====
function handleChatKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendChatMessage();
    }
}

// ===== クイックメッセージ送信 =====
function sendQuickMessage(message) {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.value = message;
        sendChatMessage();
    }
}

// ===== チャットメッセージ送信 =====
async function sendChatMessage() {
    const input = document.getElementById('chatInput');
    if (!input) return;
    
    const message = input.value.trim();
    if (!message) return;
    
    // UIを更新
    addMessageToChat('user', message);
    input.value = '';
    input.style.height = 'auto';
    
    const sendBtn = document.getElementById('sendBtn');
    if (sendBtn) sendBtn.disabled = true;
    
    // タイピングインジケーター表示
    const typingId = showTypingIndicator();
    
    try {
        const currentApiKey = ApiKeyManager.get();
        
        if (ApiKeyManager.isValid()) {
            const modeConfig = CHAT_MODES[currentChatMode];
            
            // システムメッセージを含むメッセージ配列を作成
            const messages = [
                {
                    role: 'system',
                    content: modeConfig.systemPrompt
                }
            ];
            
            // モード別の会話履歴を追加（最新10件まで）
            const recentHistory = chatHistory.slice(-10);
            recentHistory.forEach(msg => {
                messages.push({
                    role: msg.role,
                    content: msg.content
                });
            });
            
            // 現在のメッセージを追加
            messages.push({
                role: 'user',
                content: message
            });
            
            console.log(`📤 ${modeConfig.model} APIに送信中 (${currentChatMode}モード)...`);
            
            // APIエンドポイントをモデルに応じて切り替え
            const url = PROXY_ENDPOINT;
            
            // ヘッダー
            const headers = {
                'Authorization': `Bearer ${currentApiKey}`,
                'Content-Type': 'application/json'
            };
            
            // リクエストボディをAPIに応じて切り替え
            const body = isResponsesModel(modeConfig.model) ? {
                endpoint: 'responses',
                model: modeConfig.model,
                messages,
                temperature: modeConfig.temperature
            } : {
                endpoint: 'chat',
                model: modeConfig.model,
                messages: messages,
                max_tokens: modeConfig.maxTokens,
                temperature: modeConfig.temperature
            };
            
            // OpenAI APIを呼び出し（モード別設定使用）
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            });

            removeTypingIndicator(typingId);

            if (!response.ok) {
                const errorData = await response.text();
                console.error('API Response Error:', {
                    status: response.status,
                    statusText: response.statusText,
                    error: errorData
                });
                
                throw new Error(ApiKeyManager.getErrorMessage(response.status));
            }

            const data = await response.json();
            console.log(`✅ ${modeConfig.model} API応答受信`);
            
            // レスポンスからAIの回答を取得（APIに応じて切り替え）
            const aiResponse = isResponsesModel(modeConfig.model) 
                ? (data.output_text || data.output || '応答の取得に失敗しました').trim()
                : (data.choices && data.choices[0] && data.choices[0].message 
                    ? data.choices[0].message.content.trim() 
                    : '応答の取得に失敗しました');
            
            if (aiResponse && aiResponse !== '応答の取得に失敗しました') {
                // AIの応答を表示
                addMessageToChat('assistant', aiResponse);
                
                // 履歴に追加
                chatHistory.push({ role: 'user', content: message });
                chatHistory.push({ role: 'assistant', content: aiResponse });
                
                // 履歴を20件に制限
                if (chatHistory.length > 20) {
                    chatHistory = chatHistory.slice(-20);
                }
                
                // モード別履歴を更新
                chatContextByMode[currentChatMode] = [...chatHistory];
                
                // 履歴マネージャーに保存
                if (typeof chatHistoryManager !== 'undefined') {
                    chatHistoryManager.add({
                        message: message,
                        response: aiResponse,
                        type: 'chat',
                        mode: currentChatMode,
                        model: modeConfig.model
                    });
                }
            } else {
                throw new Error('予期しないレスポンス形式です');
            }
            
        } else {
            // APIキー未設定時
            removeTypingIndicator(typingId);
            await simulateProcessing();
            
            let sampleResponse = generateSampleChatResponse(message, currentChatMode);
            addMessageToChat('assistant', sampleResponse);
            
            if (typeof showNotification !== 'undefined') {
                showNotification('💡 実際のAI応答にはAPIキーの設定が必要です', 'info');
            }
        }
    } catch (error) {
        removeTypingIndicator(typingId);
        console.error('チャットエラー詳細:', error);
        
        let errorMessage = `エラーが発生しました: ${error.message}`;
        if (error.message.includes('APIキー')) {
            errorMessage += '\n\n左メニューの「API設定」から正しいAPIキーを設定してください。';
        }
        
        addMessageToChat('assistant', errorMessage);
    } finally {
        if (sendBtn) sendBtn.disabled = false;
    }
}

// ===== メッセージをチャットに追加（LINEスタイル） =====
function addMessageToChat(role, content, saveToHistory = true) {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;
    
    const welcomeMessage = messagesContainer.querySelector('.chat-welcome');
    if (welcomeMessage) {
        welcomeMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${role}`;
    
    const avatarClass = role === 'user' ? 'user-avatar' : `ai-avatar ${currentChatMode}-mode`;
    const avatarIcon = role === 'user' ? '👤' : CHAT_MODES[currentChatMode].icon;
    
    messageDiv.innerHTML = `
        <div class="message-avatar ${avatarClass}">
            ${avatarIcon}
        </div>
        <div class="message-content">
            <div class="message-bubble">
                ${formatMessageContent(content)}
            </div>
            <div class="message-actions">
                <button class="message-action-btn" onclick="copyMessage(this)" title="コピー">
                    📋
                </button>
                ${role === 'assistant' ? `
                    <button class="message-action-btn" onclick="regenerateMessage(this)" title="再生成">
                        🔄
                    </button>
                    <button class="message-action-btn memory-btn" onclick="saveToMemory(this)" title="記憶させる">
                        🧠
                    </button>
                ` : ''}
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    
    // 自動スクロール処理
    if (role === 'assistant') {
        // AI回答の場合は回答開始位置にスクロール
        setTimeout(() => {
            messageDiv.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start',
                inline: 'nearest'
            });
        }, 100);
    } else {
        // ユーザーメッセージの場合は最下部にスクロール
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// ===== メッセージ内容のフォーマット =====
function formatMessageContent(content) {
    // HTMLエスケープ
    content = escapeHtml(content);
    
    // コードブロックの処理
    content = content.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        return `<pre class="code-block"><code>${code.trim()}</code></pre>`;
    });
    
    // インラインコードの処理
    content = content.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // 見出しの処理
    content = content.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, text) => {
        const level = hashes.length;
        return `<h${level}>${text}</h${level}>`;
    });
    
    // 太字の処理
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    content = content.replace(/__(.*?)__/g, '<strong>$1</strong>');
    
    // イタリックの処理
    content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
    content = content.replace(/_(.*?)_/g, '<em>$1</em>');
    
    // リンクの処理
    content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // 改行の処理
    content = content.split('\n').map(line => {
        // 箇条書きの処理
        if (line.match(/^[•\-*]\s/)) {
            return `<li>${line.replace(/^[•\-*]\s/, '')}</li>`;
        }
        // 番号付きリストの処理
        if (line.match(/^\d+\.\s/)) {
            return `<li>${line.replace(/^\d+\.\s/, '')}</li>`;
        }
        return line;
    }).join('<br>');
    
    // リストタグで囲む
    content = content.replace(/(<li>.*?<\/li>(?:<br>)?)+/g, (match) => {
        return `<ul>${match.replace(/<br>/g, '')}</ul>`;
    });
    
    // 引用の処理
    content = content.replace(/^&gt;\s(.+)$/gm, '<blockquote>$1</blockquote>');
    
    return content;
}

// ===== タイピングインジケーター表示 =====
function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;
    
    const typingDiv = document.createElement('div');
    const typingId = Date.now();
    
    const modeConfig = CHAT_MODES[currentChatMode];
    
    typingDiv.className = 'chat-message assistant typing';
    typingDiv.setAttribute('data-typing-id', typingId);
    typingDiv.innerHTML = `
        <div class="message-avatar ai-avatar ${currentChatMode}-mode">${modeConfig.icon}</div>
        <div class="message-content">
            <div class="message-bubble">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    
    // タイピングインジケーター表示時も自動スクロール
    setTimeout(() => {
        typingDiv.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
        });
    }, 100);
    
    return typingId;
}

// ===== タイピングインジケーター削除 =====
function removeTypingIndicator(typingId) {
    const typingDiv = document.querySelector(`[data-typing-id="${typingId}"]`);
    if (typingDiv) {
        typingDiv.remove();
    }
}

// ===== メッセージコピー =====
function copyMessage(button) {
    const messageContent = button.closest('.chat-message, .deep-research-message').querySelector('.message-bubble');
    const text = messageContent.textContent || messageContent.innerText;
    if (typeof copyToClipboard !== 'undefined') {
        copyToClipboard(text);
    }
}

// ===== メッセージ再生成 =====
async function regenerateMessage(button) {
    const messageElement = button.closest('.chat-message');
    if (!messageElement || !messageElement.classList.contains('assistant')) return;
    
    // 前のユーザーメッセージを探す
    let userMessage = null;
    let prevElement = messageElement.previousElementSibling;
    
    while (prevElement) {
        if (prevElement.classList.contains('chat-message') && prevElement.classList.contains('user')) {
            const messageContent = prevElement.querySelector('.message-bubble');
            userMessage = messageContent.textContent || messageContent.innerText;
            break;
        }
        prevElement = prevElement.previousElementSibling;
    }
    
    if (!userMessage) {
        if (typeof showNotification !== 'undefined') {
            showNotification('前のメッセージが見つかりません', 'error');
        }
        return;
    }
    
    // 既存のメッセージを削除
    messageElement.remove();
    
    // 履歴から削除
    if (chatHistory.length >= 2) {
        chatHistory = chatHistory.slice(0, -2);
    }
    
    // 新しいメッセージを送信
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.value = userMessage;
        sendChatMessage();
    }
}

// ===== チャット履歴クリア =====
function clearChat() {
    if (confirm('このモードのチャット履歴をクリアしますか？')) {
        chatHistory = [];
        chatContextByMode[currentChatMode] = [];
        
        const messagesContainer = document.getElementById('chatMessages');
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
            showChatWelcome();
        }
        
        if (typeof showNotification !== 'undefined') {
            showNotification(`${CHAT_MODES[currentChatMode].displayName}モードの履歴をクリアしました`, 'success');
        }
    }
}

// ===== 全モードのチャット履歴クリア =====
function clearAllChatHistory() {
    if (confirm('すべてのモードのチャット履歴をクリアしますか？')) {
        chatHistory = [];
        chatContextByMode = {
            chat: [],
            teach: [],
            idea: []
        };
        
        const messagesContainer = document.getElementById('chatMessages');
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
            showChatWelcome();
        }
        
        if (typeof showNotification !== 'undefined') {
            showNotification('すべてのチャット履歴をクリアしました', 'success');
        }
    }
}

// ===== DEEP RESEARCHサンプル応答生成 =====
function generateSampleDeepResearchResponse(message) {
    return `## 🔬 DEEP RESEARCH - サンプル応答

**調査テーマ:** ${message}

詳細な分析のため、以下の質問にお答えください：

**質問 1/3**
このテーマについて、どのような具体的な課題や問題を感じていますか？

---

💡 **実際のDEEP RESEARCH機能にはAPIキーの設定が必要です。**
左メニューの「API設定」から設定してください。

使用モデル: ${DEEP_RESEARCH_MODE.model}`;
}

// ===== サンプルチャット応答生成 =====
function generateSampleChatResponse(message, mode) {
    const lowerMessage = message.toLowerCase();
    const modeConfig = CHAT_MODES[mode];
    
    // モード別のサンプル応答
    switch (mode) {
        case 'chat':
            if (lowerMessage.includes('よっ') || lowerMessage.includes('こんにちは')) {
                return `おー！よっ！😊
調子はどう？
今日も一日頑張ってる感じかな？`;
            }
            if (lowerMessage.includes('麦茶')) {
                return `わかる〜！冷たい麦茶最高だよね！🍵
夏は特に美味しく感じるよね〜
氷カランカラン鳴らしながら飲むのがまた良いんだよね😄`;
            }
            if (lowerMessage.includes('しりとり')) {
                return `いいよ〜！しりとりしよう！🎮
じゃあ私から始めるね！

「りんご」🍎

「ご」から始まる言葉でお願い！`;
            }
            break;
            
        case 'teach':
            if (lowerMessage.includes('二日酔い')) {
                return `## 二日酔いを早く治す方法 🍺

**1. 水分補給が最重要**
- 大量の水を飲む（できれば経口補水液）
- アルコールによる脱水を解消

**2. 電解質の補給**
- スポーツドリンクやみそ汁
- 失われたミネラルを補給

**3. 軽い食事**
- おかゆ、うどんなど消化に良いもの
- ビタミンB群を含む食品

**4. 十分な休息**
- 横になって体を休める
- 無理に動かない

**予防法:**
- 飲酒前に食事をとる
- お酒と同量の水を飲む
- 自分の適量を知る

💡 症状がひどい場合は医療機関を受診してください。`;
            }
            break;
            
        case 'idea':
            if (lowerMessage.includes('バズる企画')) {
                return `## SNSでバズる企画アイデア 💥

**1. 「〇〇チャレンジ」系**
- 10秒で描く似顔絵チャレンジ
- 利き手じゃない方で料理チャレンジ
- 目隠しメイクチャレンジ

**2. Before/After系**
- 100均グッズだけで部屋改造
- 1週間で変わる〇〇習慣
- AIに描かせた自分 vs 実物

**3. 共感系**
- 「〇〇な人にしかわからないこと」
- 世代別あるある
- 地域限定ネタ

**4. 参加型企画**
- フォロワーの悩みに全力回答
- みんなの黒歴史募集
- 架空の商品レビュー大会

💡 ポイント: タイミング、ハッシュタグ、最初の3秒が勝負！`;
            }
            break;
    }
    
    // デフォルト応答
    return `【${modeConfig.displayName}モード - サンプル応答】

ご質問ありがとうございます！
「${message}」についてのお答えです。

このモードでは${modeConfig.description.toLowerCase()}

**使用API:** ${modeConfig.model}
**Temperature:** ${modeConfig.temperature}

💡 実際のAI応答にはAPIキーの設定が必要です。
左メニューの「API設定」から設定してください。`;
}

// ===== チャット統計情報 =====
function getChatStats() {
    const allMessages = [];
    Object.keys(chatContextByMode).forEach(mode => {
        allMessages.push(...chatContextByMode[mode]);
    });
    
    const stats = {
        totalMessages: allMessages.length,
        userMessages: allMessages.filter(msg => msg.role === 'user').length,
        assistantMessages: allMessages.filter(msg => msg.role === 'assistant').length,
        messagesByMode: {
            chat: chatContextByMode.chat.length,
            teach: chatContextByMode.teach.length,
            idea: chatContextByMode.idea.length
        },
        currentMode: currentChatMode,
        averageMessageLength: allMessages.reduce((sum, msg) => sum + msg.content.length, 0) / allMessages.length || 0,
        memoryCount: memoryData.memories.length
    };
    
    return stats;
}

// ===== チャット統計表示（全幅レイアウト対応版） =====
function showChatStats() {
    const stats = getChatStats();
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">📊 チャット統計</h2>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
            </div>
            
            <div class="chat-stats-content">
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-number">${stats.totalMessages}</div>
                        <div class="stat-label">総メッセージ数</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${stats.userMessages}</div>
                        <div class="stat-label">ユーザーメッセージ</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${stats.assistantMessages}</div>
                        <div class="stat-label">AI応答</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${stats.memoryCount}</div>
                        <div class="stat-label">記憶データ</div>
                    </div>
                </div>
                
                <h3 style="margin-top: 2rem; margin-bottom: 1rem;">モード別使用状況</h3>
                <div class="mode-stats">
                    <div class="mode-stat-item">
                        <span class="mode-icon">${CHAT_MODES.chat.icon}</span>
                        <span class="mode-name">一般会話 (${CHAT_MODES.chat.model}):</span>
                        <span class="mode-count">${stats.messagesByMode.chat} メッセージ</span>
                    </div>
                    <div class="mode-stat-item">
                        <span class="mode-icon">${CHAT_MODES.teach.icon}</span>
                        <span class="mode-name">解説 (${CHAT_MODES.teach.model}):</span>
                        <span class="mode-count">${stats.messagesByMode.teach} メッセージ</span>
                    </div>
                    <div class="mode-stat-item">
                        <span class="mode-icon">${CHAT_MODES.idea.icon}</span>
                        <span class="mode-name">クリエイティブ (${CHAT_MODES.idea.model}):</span>
                        <span class="mode-count">${stats.messagesByMode.idea} メッセージ</span>
                    </div>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="action-btn" onclick="exportChatHistory()">📥 履歴をエクスポート</button>
                <button class="action-btn" onclick="showMemoryData()">🧠 記憶データ表示</button>
                <button class="skip-btn" onclick="this.closest('.modal-overlay').remove()">閉じる</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// ===== チャットエクスポート機能 =====
function exportChatHistory() {
    const exportData = {
        exportDate: new Date().toISOString(),
        currentMode: currentChatMode,
        modes: {},
        memoryData: memoryData
    };
    
    Object.keys(CHAT_MODES).forEach(mode => {
        exportData.modes[mode] = {
            name: CHAT_MODES[mode].displayName,
            model: CHAT_MODES[mode].model,
            messages: chatContextByMode[mode],
            messageCount: chatContextByMode[mode].length
        };
    });
    
    const jsonData = JSON.stringify(exportData, null, 2);
    if (typeof downloadFile !== 'undefined') {
        downloadFile(jsonData, `hishoai-chat-history-${new Date().toISOString().split('T')[0]}.json`, 'application/json');
    }
}

// ===== HTMLエスケープ関数（local定義） =====
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// ===== プロセシングシミュレーション（local定義） =====
function simulateProcessing() {
    return new Promise(resolve => {
        setTimeout(resolve, window.UI_SETTINGS?.processingDelay || 1500);
    });
}

// ===== DOMContentLoaded時の初期化 =====
document.addEventListener('DOMContentLoaded', function() {
    initializeChatSection();
});

// ===== グローバル関数として公開 =====
window.sendChatMessage = sendChatMessage;
window.sendQuickMessage = sendQuickMessage;
window.clearChat = clearChat;
window.clearAllChatHistory = clearAllChatHistory;
window.copyMessage = copyMessage;
window.regenerateMessage = regenerateMessage;
window.showChatStats = showChatStats;
window.exportChatHistory = exportChatHistory;
window.switchChatMode = switchChatMode;
window.closeModeInfo = closeModeInfo;
window.activateDeepResearchMode = activateDeepResearchMode;
window.closeDeepResearchModal = closeDeepResearchModal;
window.sendDeepResearchMessage = sendDeepResearchMessage;
window.saveToMemory = saveToMemory;
window.showMemoryData = showMemoryData;
