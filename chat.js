// ===================================================================
// HishoAI Enhanced - Chat System with Multiple Modes（Deep Research完全版）
// チャット機能の実装 - モード別対話システム（全幅レイアウト・Deep Research強化版）
// ===================================================================

// ===== API エンドポイント定義 =====
// Vercelプロキシエンドポイント
const PROXY_ENDPOINT = 'https://hishoai.vercel.app/api/openai-proxy';
const CHAT_ENDPOINT = PROXY_ENDPOINT;
const RESPONSES_ENDPOINT = PROXY_ENDPOINT;

// ===== o3系モデル判定関数 =====
function isResponsesModel(model) {
    return /^o3/.test(model) || /deep-research/.test(model);
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
            { icon: '🏪', text: 'カフェの屋号案をいくつか', category: 'ビジネス' }
        ]
    }
};

// ===== DEEP RESEARCHモード定義（強化版） =====
const DEEP_RESEARCH_MODE = {
    name: 'deep-research',
    displayName: 'DEEP RESEARCH',
    icon: '🔬',
    color: '#6B46C1',
    description: '深層調査モード：AI研究者が包括的で詳細な分析を実行します。',
    temperature: 0.2,
    maxTokens: 100000,
    model: 'o3-deep-research-2025-06-26',
    systemPrompt: `あなたは世界最高レベルの深層調査専門のAIリサーチャーです。ユーザーの調査テーマに対して以下の構造で包括的な調査報告書を作成してください：

## 📋 調査概要
- テーマの背景と重要性
- 調査の範囲と目的
- 使用した情報源の概要

## 🔍 現状分析
- 現在の状況の詳細分析
- 関連するデータ・統計・トレンド
- 主要なステークホルダーと影響要因

## ⚠️ 課題・問題点の特定
- 特定された主要な課題
- 問題の根本原因の分析
- 影響範囲と深刻度の評価

## 💡 解決策・改善提案
- 短期的な対策案
- 中長期的な戦略
- 実装の優先順位と実現可能性

## 📊 リスクと機会の分析
- 潜在的なリスク要因
- 機会となる要素の特定
- リスク軽減策

## 🎯 推奨アクションプラン
- 具体的な行動計画
- 必要なリソースと予算
- スケジュールと成功指標
- フォローアップ計画

学術的で客観的なアプローチを心がけ、信頼性の高い情報を基に深く掘り下げた分析を行ってください。引用元は必ず明記し、データの出典を明確にしてください。`,
    
    // 調査テンプレート（新機能）
    templates: {
        business: {
            name: 'ビジネス分析',
            icon: '💼',
            prompt: '市場動向、競合状況、収益モデル、成長可能性、リスク要因、投資判断のための重要指標を中心に分析してください。'
        },
        technology: {
            name: '技術調査',
            icon: '🔧',
            prompt: '技術の現状と発展段階、主要な実装方式と課題、競合技術との比較、導入事例と成功要因、将来の技術動向予測を重点的に調査してください。'
        },
        academic: {
            name: '学術研究',
            icon: '🎓',
            prompt: '関連する先行研究の整理、理論的フレームワーク、実証的なエビデンス、研究の限界と課題、今後の研究方向性を学術的観点から調査してください。'
        },
        market: {
            name: '市場調査',
            icon: '📈',
            prompt: '市場規模と成長率、主要プレイヤーとシェア、顧客ニーズとトレンド、価格動向、将来予測を市場分析の観点から調査してください。'
        },
        problem_solving: {
            name: '問題解決',
            icon: '🎯',
            prompt: '問題の根本原因分析、影響範囲と優先順位、解決策オプションの比較、実装の実現可能性、成功指標と評価方法を問題解決の観点から分析してください。'
        }
    }
};

// ===== グローバル変数 =====
let currentChatMode = 'chat';
let isDeepResearchMode = false;
let deepResearchQuestions = [];
let deepResearchAnswers = [];
let currentDeepResearchSession = null;
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

// Deep Research使用量管理
let deepResearchUsage = {
    dailyCount: 0,
    monthlyTokens: 0,
    lastResetDate: new Date().toDateString()
};

// ===== チャット機能初期化 =====
function initializeChatSection() {
    console.log('🚀 チャット機能初期化中（Deep Research完全版）...');
    
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
    
    // Deep Research使用量の初期化
    initializeDeepResearchUsage();
    
    // 初期モードの設定
    switchChatMode('chat');
    
    console.log('✅ チャット機能初期化完了（Deep Research完全版）');
}

// ===== Deep Research使用量初期化 =====
function initializeDeepResearchUsage() {
    try {
        const saved = localStorage.getItem('deepResearchUsage');
        if (saved) {
            const data = JSON.parse(saved);
            
            // 日付チェック
            const today = new Date().toDateString();
            if (data.lastResetDate !== today) {
                // 日が変わったらリセット
                deepResearchUsage.dailyCount = 0;
                deepResearchUsage.lastResetDate = today;
            } else {
                deepResearchUsage = { ...deepResearchUsage, ...data };
            }
            
            // 月チェック
            const currentMonth = new Date().getMonth();
            const savedDate = new Date(data.lastResetDate || today);
            if (savedDate.getMonth() !== currentMonth) {
                deepResearchUsage.monthlyTokens = 0;
            }
        }
    } catch (error) {
        console.warn('Deep Research使用量データの復元に失敗:', error);
    }
}

// ===== Deep Research使用量更新 =====
function updateDeepResearchUsage(tokens = 0) {
    deepResearchUsage.dailyCount++;
    deepResearchUsage.monthlyTokens += tokens;
    deepResearchUsage.lastResetDate = new Date().toDateString();
    
    localStorage.setItem('deepResearchUsage', JSON.stringify(deepResearchUsage));
}

// ===== Deep Research制限チェック =====
function checkDeepResearchLimits() {
    const config = window.DEEP_RESEARCH_CONFIG?.limits || {
        maxDailyRequests: 10,
        maxMonthlyTokens: 500000
    };
    
    return {
        canMakeRequest: deepResearchUsage.dailyCount < config.maxDailyRequests,
        dailyRemaining: Math.max(0, config.maxDailyRequests - deepResearchUsage.dailyCount),
        monthlyUsagePercent: (deepResearchUsage.monthlyTokens / config.maxMonthlyTokens) * 100
    };
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
    // 制限チェック
    const limits = checkDeepResearchLimits();
    if (!limits.canMakeRequest) {
        if (typeof showNotification !== 'undefined') {
            showNotification(`⚠️ Deep Research利用制限に達しました。明日再試行してください。（本日の残り: ${limits.dailyRemaining}回）`, 'warning');
        }
        return;
    }
    
    isDeepResearchMode = true;
    deepResearchQuestions = [];
    deepResearchAnswers = [];
    currentDeepResearchSession = {
        startTime: new Date(),
        topic: '',
        template: null,
        results: []
    };
    
    // 全画面モーダル表示
    showDeepResearchModal();
    
    console.log('🔬 DEEP RESEARCHモード起動');
}

// ===== DEEP RESEARCH全画面モーダル表示（強化版） =====
function showDeepResearchModal() {
    const limits = checkDeepResearchLimits();
    
    const modal = document.createElement('div');
    modal.className = 'deep-research-modal-overlay active';
    modal.innerHTML = `
        <div class="deep-research-modal">
            <div class="deep-research-header">
                <div class="deep-research-info">
                    <h2>${DEEP_RESEARCH_MODE.icon} ${DEEP_RESEARCH_MODE.displayName}</h2>
                    <p>${DEEP_RESEARCH_MODE.description}</p>
                    <div class="deep-research-stats">
                        <span class="usage-info">今日の残り: ${limits.dailyRemaining}回</span>
                        <span class="usage-info">月間使用率: ${Math.round(limits.monthlyUsagePercent)}%</span>
                    </div>
                </div>
                <button class="deep-research-close" onclick="closeDeepResearchModal()">&times;</button>
            </div>
            
            <div class="deep-research-templates">
                <h3>📋 調査テンプレート</h3>
                <div class="template-grid">
                    ${Object.entries(DEEP_RESEARCH_MODE.templates).map(([key, template]) => `
                        <button class="template-card" onclick="selectResearchTemplate('${key}')">
                            <span class="template-icon">${template.icon}</span>
                            <span class="template-name">${template.name}</span>
                        </button>
                    `).join('')}
                    <button class="template-card custom" onclick="selectResearchTemplate('custom')">
                        <span class="template-icon">✨</span>
                        <span class="template-name">カスタム</span>
                    </button>
                </div>
            </div>
            
            <div class="deep-research-content">
                <div class="deep-research-messages" id="deepResearchMessages">
                    <div class="deep-research-welcome">
                        <div class="welcome-icon">${DEEP_RESEARCH_MODE.icon}</div>
                        <h3>深層調査を開始します</h3>
                        <p>調査テーマを入力してください。上記のテンプレートを選択すると、そのカテゴリに特化した分析を実行します。</p>
                        <div class="research-features">
                            <div class="feature-item">🌐 Web検索連携</div>
                            <div class="feature-item">📊 統計分析</div>
                            <div class="feature-item">💡 解決策提案</div>
                            <div class="feature-item">📝 構造化レポート</div>
                        </div>
                    </div>
                </div>
                
                <div class="deep-research-input-area">
                    <div class="deep-research-progress" id="researchProgress" style="display: none;">
                        <div class="progress-bar">
                            <div class="progress-fill" id="progressFill"></div>
                        </div>
                        <div class="progress-text" id="progressText">調査準備中...</div>
                    </div>
                    
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

// ===== 調査テンプレート選択 =====
function selectResearchTemplate(templateKey) {
    const input = document.getElementById('deepResearchInput');
    if (!input) return;
    
    if (templateKey === 'custom') {
        currentDeepResearchSession.template = null;
        input.placeholder = '調査したいテーマを入力してください...';
    } else {
        const template = DEEP_RESEARCH_MODE.templates[templateKey];
        if (template) {
            currentDeepResearchSession.template = templateKey;
            input.placeholder = `${template.name}の観点から調査したいテーマを入力してください...`;
            
            if (typeof showNotification !== 'undefined') {
                showNotification(`📋 ${template.name}テンプレートを選択しました`, 'info');
            }
        }
    }
    
    // テンプレートカードの選択状態更新
    document.querySelectorAll('.template-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    const selectedCard = document.querySelector(`[onclick="selectResearchTemplate('${templateKey}')"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    input.focus();
}

// ===== DEEP RESEARCHモーダル閉じる =====
function closeDeepResearchModal() {
    isDeepResearchMode = false;
    currentDeepResearchSession = null;
    const modal = document.querySelector('.deep-research-modal-overlay');
    if (modal) {
        modal.remove();
    }
}

// ===== 進捗表示更新 =====
function updateResearchProgress(step, progress) {
    const progressElement = document.getElementById('researchProgress');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressElement && progressFill && progressText) {
        progressElement.style.display = 'block';
        progressFill.style.width = `${progress}%`;
        progressText.textContent = step;
    }
}

// ===== 進捗表示非表示 =====
function hideResearchProgress() {
    const progressElement = document.getElementById('researchProgress');
    if (progressElement) {
        progressElement.style.display = 'none';
    }
}

// ===== DEEP RESEARCHメッセージ送信（完全版） =====
async function sendDeepResearchMessage() {
    const input = document.getElementById('deepResearchInput');
    if (!input) return;
    
    const message = input.value.trim();
    if (!message) return;
    
    // 制限チェック
    const limits = checkDeepResearchLimits();
    if (!limits.canMakeRequest) {
        addDeepResearchMessage('assistant', `⚠️ **利用制限に達しました**\n\n本日のDeep Research利用回数が上限に達しました。明日再試行してください。\n\n- 本日の残り: ${limits.dailyRemaining}回\n- 月間使用率: ${Math.round(limits.monthlyUsagePercent)}%`);
        return;
    }
    
    addDeepResearchMessage('user', message);
    currentDeepResearchSession.topic = message;
    input.value = '';
    input.style.height = 'auto';
    
    const sendBtn = document.getElementById('deepResearchSendBtn');
    if (sendBtn) sendBtn.disabled = true;
    
    // 進捗表示開始
    updateResearchProgress('調査準備中...', 10);
    
    // タイピングインジケーター表示
    const typingId = showDeepResearchTypingIndicator();
    
    try {
        const currentApiKey = ApiKeyManager.get();
        
        if (ApiKeyManager.isValid()) {
            // 新しいワンショット方式でDeep Research実行
            await executeFullDeepResearch(message, currentApiKey, typingId);
        } else {
            // APIキー未設定時のサンプル応答
            removeDeepResearchTypingIndicator(typingId);
            hideResearchProgress();
            await simulateProcessing();
            addDeepResearchMessage('assistant', generateSampleDeepResearchResponse(message));
        }
    } catch (error) {
        removeDeepResearchTypingIndicator(typingId);
        hideResearchProgress();
        console.error('DEEP RESEARCHエラー:', error);
        handleDeepResearchError(error);
    } finally {
        if (sendBtn) sendBtn.disabled = false;
    }
}

// ===== 完全なDeep Research実行（改善版） =====
async function executeFullDeepResearch(topic, apiKey, typingId) {
    try {
        updateResearchProgress('調査プロンプト作成中...', 20);
        
        // テンプレート適用
        let enhancedPrompt = topic;
        if (currentDeepResearchSession.template) {
            const template = DEEP_RESEARCH_MODE.templates[currentDeepResearchSession.template];
            if (template) {
                enhancedPrompt = `【${template.name}】調査テーマ: ${topic}\n\n${template.prompt}`;
            }
        }
        
        // Deep Research APIに最適化されたプロンプト
        const systemMessage = `${DEEP_RESEARCH_MODE.systemPrompt}

追加指示：
- 最新の信頼性の高い情報源を重点的に活用してください
- データや統計は具体的な数値で示してください
- 引用元のURLや出典を明記してください
- 実用的で実行可能な提案を心がけてください
- 複数の視点から客観的に分析してください`;

        const researchInput = [
            {
                role: "developer",
                content: [
                    {
                        type: "input_text",
                        text: systemMessage
                    }
                ]
            },
            {
                role: "user",
                content: [
                    {
                        type: "input_text",
                        text: enhancedPrompt
                    }
                ]
            }
        ];

        updateResearchProgress('Deep Research API実行中...', 40);

        // Deep Research API呼び出し
        const url = PROXY_ENDPOINT;
        const headers = {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        };

        const body = {
            endpoint: 'responses',
            model: DEEP_RESEARCH_MODE.model,
            input: researchInput,
            reasoning: { summary: "auto" },
            tools: [
                { type: "web_search_preview" }
            ],
            background: true, // バックグラウンド実行でタイムアウト回避
            temperature: DEEP_RESEARCH_MODE.temperature
        };

        console.log('🔬 Deep Research API実行中...', {
            model: DEEP_RESEARCH_MODE.model,
            template: currentDeepResearchSession.template,
            topicLength: topic.length
        });
        
        updateResearchProgress('AI調査実行中... (最大30分)', 60);
        
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        });

        updateResearchProgress('結果解析中...', 80);
        removeDeepResearchTypingIndicator(typingId);

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Deep Research API Error:', errorData);
            throw new Error(ApiKeyManager.getErrorMessage(response.status));
        }

        const data = await response.json();
        console.log('✅ Deep Research API応答受信');

        updateResearchProgress('レポート生成中...', 90);

        // レスポンス解析（改善版）
        let researchResult = '';
        let intermediateSteps = [];
        let usageStats = null;
        
        if (data.output && Array.isArray(data.output)) {
            // 中間ステップの抽出
            intermediateSteps = extractIntermediateSteps(data);
            
            // 最終出力を取得
            const finalOutput = data.output[data.output.length - 1];
            if (finalOutput && finalOutput.content && finalOutput.content[0]) {
                researchResult = finalOutput.content[0].text || '';
            }
        } else if (data.output_text) {
            // 旧形式の場合
            researchResult = data.output_text;
        } else if (data.choices && data.choices[0]) {
            // Chat Completions形式の場合（フォールバック）
            researchResult = data.choices[0].message.content;
        }

        // 使用量統計の取得
        if (data.usage) {
            usageStats = data.usage;
            updateDeepResearchUsage(data.usage.total_tokens || 0);
        }

        updateResearchProgress('完了', 100);
        
        if (researchResult) {
            // セッション結果の保存
            currentDeepResearchSession.results.push({
                topic: topic,
                template: currentDeepResearchSession.template,
                result: researchResult,
                steps: intermediateSteps,
                usage: usageStats,
                timestamp: new Date()
            });
            
            // 中間ステップの表示（オプション）
            if (intermediateSteps && intermediateSteps.length > 0 && window.DEEP_RESEARCH_CONFIG?.ui?.showIntermediateResults) {
                addDeepResearchMessage('assistant', `## 🔄 調査プロセス\n\n${intermediateSteps.join('\n\n')}\n\n---\n\n`);
            }

            // 最終結果の表示
            const templateInfo = currentDeepResearchSession.template ? 
                ` (${DEEP_RESEARCH_MODE.templates[currentDeepResearchSession.template].name}分析)` : '';
            
            addDeepResearchMessage('assistant', `## 🔬 Deep Research 調査報告書${templateInfo}\n\n${researchResult}\n\n---\n\n✅ **調査完了** - 新しい調査を開始する場合は、再度テーマを入力してください。`);
            
            // 統計情報の表示
            if (usageStats && window.DEEP_RESEARCH_CONFIG?.ui?.showUsageStats) {
                const statsText = formatUsageStats(usageStats);
                addDeepResearchMessage('assistant', `### 📊 調査統計\n${statsText}`);
            }
            
            // 調査完了の通知
            if (typeof showNotification !== 'undefined') {
                const limits = checkDeepResearchLimits();
                showNotification(`🔬 Deep Research調査完了！残り${limits.dailyRemaining}回`, 'success');
            }
            
        } else {
            throw new Error('調査結果の取得に失敗しました');
        }

    } catch (error) {
        removeDeepResearchTypingIndicator(typingId);
        hideResearchProgress();
        throw error;
    } finally {
        hideResearchProgress();
    }
}

// ===== 中間ステップの抽出（改善版） =====
function extractIntermediateSteps(apiResponse) {
    const steps = [];
    
    if (apiResponse.output && Array.isArray(apiResponse.output)) {
        apiResponse.output.forEach((step, index) => {
            if (step.type === 'reasoning' || step.type === 'search' || step.type === 'tool_call') {
                const content = step.content?.[0]?.text || step.text || step.message || '';
                if (content && index < apiResponse.output.length - 1) { // 最終結果以外
                    const stepTitle = step.type === 'search' ? '🔍 Web検索' : 
                                    step.type === 'reasoning' ? '🧠 分析中' : 
                                    step.type === 'tool_call' ? '🛠️ ツール実行' : '📝 処理中';
                    steps.push(`**${stepTitle} (ステップ ${index + 1}):** ${content.substring(0, 200)}...`);
                }
            }
        });
    }
    
    return steps;
}

// ===== 使用統計のフォーマット（改善版） =====
function formatUsageStats(usage) {
    const stats = [];
    
    if (usage.prompt_tokens) {
        stats.push(`📥 入力: ${usage.prompt_tokens.toLocaleString()}トークン`);
    }
    
    if (usage.completion_tokens) {
        stats.push(`📤 出力: ${usage.completion_tokens.toLocaleString()}トークン`);
    }
    
    if (usage.total_tokens) {
        stats.push(`📊 合計: ${usage.total_tokens.toLocaleString()}トークン`);
    }
    
    if (usage.total_time) {
        const seconds = Math.round(usage.total_time / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const timeStr = minutes > 0 ? `${minutes}分${remainingSeconds}秒` : `${seconds}秒`;
        stats.push(`⏱️ 処理時間: ${timeStr}`);
    }
    
    // 推定コスト（概算）
    if (usage.total_tokens) {
        const estimatedCost = (usage.total_tokens * 0.03 / 1000).toFixed(3); // 概算
        stats.push(`💰 推定コスト: ~$${estimatedCost}`);
    }
    
    return stats.join(' | ');
}

// ===== エラーハンドリング改善版 =====
function handleDeepResearchError(error) {
    let errorMessage = '🚨 **Deep Research エラー**\n\n';
    
    if (error.message.includes('timeout')) {
        errorMessage += '⏰ **タイムアウトエラー**\nDeep Research処理がタイムアウトしました。\n\n**解決策:**\n- より簡潔で具体的なテーマで再試行\n- 調査範囲を絞り込んで再実行\n- 時間をおいて再試行';
    } else if (error.message.includes('rate limit') || error.message.includes('429')) {
        errorMessage += '🚦 **利用制限エラー**\nAPI利用制限に達しました。\n\n**解決策:**\n- しばらく時間をおいて再試行\n- 明日再度実行\n- より効率的なクエリで実行';
    } else if (error.message.includes('invalid request') || error.message.includes('400')) {
        errorMessage += '❌ **リクエストエラー**\nリクエストが無効です。\n\n**解決策:**\n- テーマの内容を確認\n- より明確で具体的な質問に変更\n- 特殊文字や過度に長いテキストを避ける';
    } else if (error.message.includes('401') || error.message.includes('APIキー')) {
        errorMessage += '🔑 **認証エラー**\nAPIキーに問題があります。\n\n**解決策:**\n- 左メニューの「API設定」でキーを確認\n- 有効なOpenAI APIキーを設定\n- キーの権限を確認';
    } else {
        errorMessage += `❗ **予期しないエラー**\n${error.message}\n\n**解決策:**\n- ネットワーク接続を確認\n- しばらく時間をおいて再試行\n- 問題が続く場合は管理者に連絡`;
    }
    
    errorMessage += '\n\n---\n\n💡 **ヒント:** 単純で明確な調査テーマから始めることをお勧めします。';
    
    addDeepResearchMessage('assistant', errorMessage);
}

// ===== DEEP RESEARCHメッセージ追加（改善版） =====
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
    const timestamp = new Date().toLocaleTimeString();
    
    messageDiv.innerHTML = `
        <div class="message-avatar ${role}-avatar">
            ${avatarIcon}
        </div>
        <div class="message-content">
            <div class="message-header">
                <span class="message-role">${role === 'user' ? 'あなた' : 'Deep Research AI'}</span>
                <span class="message-timestamp">${timestamp}</span>
            </div>
            <div class="message-bubble">
                ${formatMessageContent(content)}
            </div>
            <div class="message-actions">
                <button class="message-action-btn" onclick="copyMessage(this)" title="コピー">
                    📋
                </button>
                ${role === 'assistant' ? `
                    <button class="message-action-btn memory-btn" onclick="saveToMemory(this)" title="記憶させる">
                        🧠
                    </button>
                    <button class="message-action-btn export-btn" onclick="exportResearchResult(this)" title="エクスポート">
                        📥
                    </button>
                ` : ''}
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ===== Deep Research結果のエクスポート =====
function exportResearchResult(button) {
    const messageElement = button.closest('.deep-research-message');
    if (!messageElement) return;
    
    const messageContent = messageElement.querySelector('.message-bubble');
    const text = messageContent.textContent || messageContent.innerText;
    const timestamp = new Date().toISOString().split('T')[0];
    
    const exportData = {
        title: `Deep Research Report - ${timestamp}`,
        session: currentDeepResearchSession,
        content: text,
        timestamp: new Date().toISOString(),
        usage: deepResearchUsage
    };
    
    const jsonData = JSON.stringify(exportData, null, 2);
    const filename = `deep-research-${currentDeepResearchSession?.topic?.substring(0, 20) || 'report'}-${timestamp}.json`;
    
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
    
    if (typeof showNotification !== 'undefined') {
        showNotification('📥 Deep Research結果をエクスポートしました', 'success');
    }
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
                <div class="typing-text">深層調査実行中...</div>
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
        source: isDeepResearchMode ? 'DEEP RESEARCH' : CHAT_MODES[currentChatMode].displayName,
        session: isDeepResearchMode ? currentDeepResearchSession?.topic : null
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

// ===== 記憶データ表示（改善版） =====
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
                    <div class="stat-item">
                        <span class="stat-number">${memoryData.memories.length}</span>
                        <span class="stat-label">保存件数</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${memoryData.memories.filter(m => m.mode === 'deep-research').length}</span>
                        <span class="stat-label">Deep Research</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${memoryData.memories.filter(m => m.mode !== 'deep-research').length}</span>
                        <span class="stat-label">チャット</span>
                    </div>
                </div>
                
                <div class="memory-filters">
                    <button class="filter-btn active" onclick="filterMemories('all')">すべて</button>
                    <button class="filter-btn" onclick="filterMemories('deep-research')">Deep Research</button>
                    <button class="filter-btn" onclick="filterMemories('chat')">チャット</button>
                </div>
                
                <div class="memory-list">
                    ${memoryData.memories.length === 0 ? 
                        '<p class="empty-memory">まだ記憶データがありません</p>' :
                        memoryData.memories.slice(-20).reverse().map(memory => `
                            <div class="memory-item" data-mode="${memory.mode}">
                                <div class="memory-header">
                                    <span class="memory-source">${memory.source}</span>
                                    <span class="memory-time">${new Date(memory.timestamp).toLocaleString()}</span>
                                </div>
                                ${memory.session ? `<div class="memory-session">セッション: ${memory.session}</div>` : ''}
                                <div class="memory-content">${memory.content.substring(0, 200)}${memory.content.length > 200 ? '...' : ''}</div>
                            </div>
                        `).join('')
                    }
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="action-btn" onclick="exportAllMemories()">📥 全データエクスポート</button>
                <button class="action-btn" onclick="clearMemoryData()">🗑️ データクリア</button>
                <button class="skip-btn" onclick="this.closest('.modal-overlay').remove()">閉じる</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// ===== 記憶フィルター =====
function filterMemories(filter) {
    const memoryItems = document.querySelectorAll('.memory-item');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // ボタンの状態更新
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // アイテムの表示/非表示
    memoryItems.forEach(item => {
        const mode = item.getAttribute('data-mode');
        if (filter === 'all') {
            item.style.display = 'block';
        } else if (filter === 'deep-research') {
            item.style.display = mode === 'deep-research' ? 'block' : 'none';
        } else if (filter === 'chat') {
            item.style.display = mode !== 'deep-research' ? 'block' : 'none';
        }
    });
}

// ===== 全記憶データエクスポート =====
function exportAllMemories() {
    const exportData = {
        exportDate: new Date().toISOString(),
        version: '4.0',
        memoryData: memoryData,
        deepResearchUsage: deepResearchUsage
    };
    
    const jsonData = JSON.stringify(exportData, null, 2);
    const filename = `hishoai-all-memories-${new Date().toISOString().split('T')[0]}.json`;
    
    if (typeof downloadFile !== 'undefined') {
        downloadFile(jsonData, filename, 'application/json');
    }
    
    if (typeof showNotification !== 'undefined') {
        showNotification('📥 全記憶データをエクスポートしました', 'success');
    }
}

// ===== 記憶データクリア =====
function clearMemoryData() {
    if (confirm('すべての記憶データを削除しますか？この操作は取り消せません。')) {
        memoryData = { memories: [], lastSaved: null };
        localStorage.removeItem('hishoai-memory-data');
        
        document.querySelector('.modal-overlay').remove();
        
        if (typeof showNotification !== 'undefined') {
            showNotification('🗑️ 記憶データをクリアしました', 'success');
        }
    }
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
    const limits = checkDeepResearchLimits();
    
    messagesContainer.innerHTML = `
        <div class="chat-welcome">
            <div class="welcome-icon">${modeConfig.icon}</div>
            <h3>${modeConfig.displayName}モードへようこそ！</h3>
            <p>${modeConfig.description}</p>
            <p style="color: var(--mode-color, #667eea); font-size: 0.875rem; margin-top: 0.5rem;">
                💡 サンプルをクリックして会話を始めてみましょう
            </p>
            ${modeConfig.name === 'teach' ? `
                <div style="margin-top: 1rem; padding: 1rem; background: rgba(107, 70, 193, 0.1); border-radius: 0.5rem;">
                    <p style="color: #6B46C1; font-size: 0.85rem; margin: 0;">
                        🔬 <strong>DEEP RESEARCH機能:</strong> 解説タブを右クリックまたはダブルクリックで深層調査モードに切り替えできます
                    </p>
                    <p style="color: #6B46C1; font-size: 0.75rem; margin: 0.5rem 0 0 0;">
                        本日の残り: ${limits.dailyRemaining}回 | 月間使用率: ${Math.round(limits.monthlyUsagePercent)}%
                    </p>
                </div>
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

// ===== チャットメッセージ送信（従来機能保持） =====
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
    const template = currentDeepResearchSession?.template;
    const templateInfo = template ? ` (${DEEP_RESEARCH_MODE.templates[template].name}分析)` : '';
    
    return `## 🔬 DEEP RESEARCH - サンプル応答${templateInfo}

**調査テーマ:** ${message}

### 📋 調査概要
このテーマについて包括的な深層調査を実行します。Web検索、データ分析、多角的な視点からの分析を通じて詳細なレポートを作成します。

### 🔍 分析予定項目
1. **現状分析** - 現在の状況と背景
2. **課題特定** - 主要な問題点の抽出  
3. **解決策提案** - 具体的な改善案
4. **リスク評価** - 潜在的なリスク要因
5. **推奨アクション** - 実行可能な行動計画

---

💡 **実際のDEEP RESEARCH機能にはAPIキーの設定が必要です。**
左メニューの「API設定」から設定してください。

**使用モデル:** ${DEEP_RESEARCH_MODE.model}
**調査時間:** 通常5-30分
**本日の残り回数:** ${checkDeepResearchLimits().dailyRemaining}回`;
}

// ===== サンプルチャット応答生成 =====
function generateSampleChatResponse(message, mode) {
    const lowerMessage = message.toLowerCase();
    const modeConfig = CHAT_MODES[mode];
    
    // モード別のサンプル応答（既存コード保持）
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

// ===== チャット統計情報（改善版） =====
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
        memoryCount: memoryData.memories.length,
        deepResearchUsage: deepResearchUsage
    };
    
    return stats;
}

// ===== チャット統計表示（全幅レイアウト対応版） =====
function showChatStats() {
    const stats = getChatStats();
    const limits = checkDeepResearchLimits();
    
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
                
                <h3 style="margin-top: 2rem; margin-bottom: 1rem;">Deep Research使用状況</h3>
                <div class="deep-research-stats">
                    <div class="stat-item">
                        <div class="stat-number">${stats.deepResearchUsage.dailyCount}</div>
                        <div class="stat-label">今日の利用回数</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${limits.dailyRemaining}</div>
                        <div class="stat-label">今日の残り回数</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${Math.round(limits.monthlyUsagePercent)}%</div>
                        <div class="stat-label">月間使用率</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${stats.deepResearchUsage.monthlyTokens.toLocaleString()}</div>
                        <div class="stat-label">月間トークン</div>
                    </div>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="action-btn" onclick="exportChatHistory()">📥 履歴をエクスポート</button>
                <button class="action-btn" onclick="showMemoryData()">🧠 記憶データ表示</button>
                <button class="action-btn" onclick="resetDeepResearchUsage()">🔄 使用量リセット</button>
                <button class="skip-btn" onclick="this.closest('.modal-overlay').remove()">閉じる</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// ===== Deep Research使用量リセット =====
function resetDeepResearchUsage() {
    if (confirm('Deep Research使用量をリセットしますか？')) {
        deepResearchUsage = {
            dailyCount: 0,
            monthlyTokens: 0,
            lastResetDate: new Date().toDateString()
        };
        localStorage.setItem('deepResearchUsage', JSON.stringify(deepResearchUsage));
        
        if (typeof showNotification !== 'undefined') {
            showNotification('🔄 Deep Research使用量をリセットしました', 'success');
        }
        
        // モーダルを閉じて再表示
        document.querySelector('.modal-overlay').remove();
        showChatStats();
    }
}

// ===== チャットエクスポート機能（改善版） =====
function exportChatHistory() {
    const exportData = {
        exportDate: new Date().toISOString(),
        version: '4.0 Deep Research Enhanced',
        currentMode: currentChatMode,
        modes: {},
        memoryData: memoryData,
        deepResearchUsage: deepResearchUsage,
        deepResearchSessions: currentDeepResearchSession ? [currentDeepResearchSession] : []
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
    const filename = `hishoai-chat-history-${new Date().toISOString().split('T')[0]}.json`;
    
    if (typeof downloadFile !== 'undefined') {
        downloadFile(jsonData, filename, 'application/json');
    }
    
    if (typeof showNotification !== 'undefined') {
        showNotification('📥 チャット履歴をエクスポートしました', 'success');
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
window.selectResearchTemplate = selectResearchTemplate;
window.saveToMemory = saveToMemory;
window.showMemoryData = showMemoryData;
window.filterMemories = filterMemories;
window.exportAllMemories = exportAllMemories;
window.clearMemoryData = clearMemoryData;
window.exportResearchResult = exportResearchResult;
window.resetDeepResearchUsage = resetDeepResearchUsage;
