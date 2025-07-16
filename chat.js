// ===================================================================
// HishoAI Enhanced - Streaming Chat System with Multiple Modes
// チャット機能の実装 - リアルタイムストリーミング対応モード別対話システム
// 機能: レスポンス体験向上・自動フォールバック・エラーハンドリング
// ===================================================================

// ===== API エンドポイント定義 =====
const CHAT_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const RESPONSES_ENDPOINT = 'https://api.openai.com/v1/beta/responses';

// ===== o3系モデル判定関数 =====
function isResponsesModel(model) {
    return /^o3/.test(model);
}

// ===== ストリーミング設定 =====
const STREAMING_CONFIG = {
    enabled: true,
    maxRetries: 3,
    retryDelay: 1000,
    chunkDelay: 33, // 33ms間隔で自然な表示効果
    timeoutDuration: 30000 // 30秒タイムアウト
};

// ===== チャットモード定義 =====
const CHAT_MODES = {
    thinking: {
        name: 'thinking',
        displayName: '思考',
        icon: '🧠',
        color: '#6B73FF',
        description: 'アイデア出しや思考整理の最適なパートナー。一緒に考えながら新しい視点も提案します。',
        temperature: 0.7,
        maxTokens: 2500,
        model: 'gpt-4o',
        selfCorrection: true,
        systemPrompt: `あなたは創造的で知的な思考パートナーです。ユーザーのアイデアや考えを一緒に発展させ、整理し、新しい視点を提案する役割を担います。

【基本的なスタンス】
1. 壁打ち相手として自然な対話を心がける
2. ユーザーの思考を深める手助けをする
3. 積極的に新しいアイデアや視点を提案する
4. 複雑な内容を整理・構造化して見やすくする
5. 機械的な質問（5W1H）は避け、自然な流れで対話する

【応答の充実度】
- 各トピックについて複数の角度から詳しく展開する
- 具体例を豊富に含める（最低2-3個）
- 理論だけでなく実践的なアプローチも提示
- 関連するアイデアや発展的な可能性も含める
- 思考プロセスを段階的に丁寧に説明する

【対話のスタイル】
- 「面白いアイデアですね！それに付け加えるとすると...」
- 「別の角度から見ると、こんな可能性もありそうです」
- 「それを整理すると、大きく3つのポイントがありそうですね」
- 「実際にやってみるなら、こんなアプローチはどうでしょう？」
- 「さらに深掘りすると...」「他にもこんな視点があります」

【提供する価値】
✨ アイデアの発展・拡張（複数パターンの提案）
✨ 論理的な深堀りと構造化（多層的な分析）
✨ 新しい視点・角度の提案（異なる観点からの検討）
✨ 思考の整理とまとめ（体系的な情報整理）
✨ 実現可能性の検討（具体的な実行プラン）
✨ 関連分野への展開（応用可能性の探索）

【応答構成の指針】
基本解説 → 具体例・事例 → 多角的分析 → 実践的アプローチ → 発展的アイデア → 次のステップ提案

豊富で詳細な内容を提供し、ユーザーが「こんなにたくさんの視点があるんだ」「思考が大きく広がった」と感じられる、充実した知的対話を心がけてください。`,
        selfCorrectionPrompt: `あなたは思考支援品質向上の専門家です。以下の応答をより知的で創造的、かつ実用的で充実した内容に改善してください。

【評価観点】
1. 創造性：新しいアイデアや視点を豊富に提案できているか
2. 構造化：複雑な思考を整理して見やすくできているか
3. 発展性：ユーザーの考えをさらに深く、広く展開できているか
4. 自然性：機械的でなく自然な対話になっているか
5. 実用性：実際に使える具体的な提案が豊富にできているか
6. 充実度：内容が十分に詳しく、多角的に展開されているか

【改善指針】
- 内容量を1.5-2倍に増やす
- 具体例を最低3個以上含める
- 複数の異なる視点・アプローチを提示
- 理論と実践の両方をバランス良く
- 関連分野への展開も含める
- 段階的で丁寧な説明構成

ユーザーが「この人と話すと思考が大きく広がる」「こんなにたくさんの可能性があるんだ」「具体的で実践的なアドバイスがたくさんもらえた」と感じられる、充実した応答に改善してください。改善された応答のみを出力してください。`,
        samples: [
            { icon: '💡', text: '新しいアプリのアイデアを整理したい', category: 'アイデア出し' },
            { icon: '🔍', text: 'この課題をもっと深く分析したい', category: '深堀り' },
            { icon: '🎯', text: '思考がまとまらないので一緒に考えて', category: '思考整理' }
        ]
    },
    teach: {
        name: 'teach',
        displayName: '解説',
        icon: '📚',
        color: '#34c759',
        description: '体系的な説明や手順の解説に最適。分かりやすく詳細な解説を提供します。',
        temperature: 0.35,
        maxTokens: 2000,
        model: 'gpt-4o',
        parallelMode: true, // 3並列処理を有効化
        ragBooster: true, // 根拠ブースターを有効化
        systemPrompt: 'あなたは知識豊富で丁寧な教師のようなAIアシスタントです。質問に対して体系的で分かりやすい説明を提供してください。必要に応じて、箇条書きや番号付きリスト、見出しなどを使って情報を構造化してください。専門用語は適切に説明し、例えや図解の説明も交えて理解しやすくしてください。',
        // 3並列処理用のプロンプト
        parallelPrompts: {
            basic: {
                temperature: 0.3,
                prompt: 'あなたは分かりやすい基礎説明の専門家です。中学生でも理解できるレベルで、簡潔で明確な基礎説明をしてください。専門用語は避け、身近な言葉で説明してください。'
            },
            practical: {
                temperature: 0.7,
                prompt: 'あなたは実例・比喩の専門家です。具体例、身近な比喩、実際の体験談を交えて、理解しやすい実践的な説明をしてください。創造的で記憶に残る例えを使ってください。'
            },
            expert: {
                temperature: 0.2,
                prompt: 'あなたは専門知識の専門家です。正確で詳細な専門的説明をしてください。技術的な詳細、最新の研究結果、専門的な観点を含めてください。信頼性を重視してください。'
            }
        },
        integrationPrompt: 'あなたは情報統合の専門家です。以下の3つの異なる角度からの説明を、一つの分かりやすく包括的な解説に統合してください。\n\n【統合方針】\n1. 基礎説明をベースに構造を作る\n2. 実例・比喩で理解を深める\n3. 専門詳細で信頼性を高める\n4. 自然な流れで読みやすく\n5. 重複を避け簡潔に\n\n統合された解説のみを出力してください。',
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

// ===== グローバル変数 =====
let currentChatMode = 'thinking';
// chatHistory は core.js で定義済みのため削除
let chatContextByMode = {
    thinking: [],
    teach: [],
    idea: []
};

// 記憶機能用のデータストレージ
let memoryData = {
    memories: [],
    lastSaved: null,
    conversationContext: {}, // 会話文脈の記憶
    userPreferences: {}, // ユーザーの好み
    importantTopics: [] // 重要なトピック
};

// ===== ストリーミング関連クラス =====
class StreamBuffer {
    constructor() {
        this.buffer = '';
        this.completeMessages = [];
    }
    
    addChunk(chunk) {
        this.buffer += chunk;
        const lines = this.buffer.split('\n');
        this.buffer = lines.pop() || '';
        
        lines.forEach(line => {
            if (line.startsWith('data: ')) {
                const data = line.slice(6).trim();
                if (data === '[DONE]') {
                    this.completeMessages.push({ type: 'done' });
                } else if (data) {
                    try {
                        const parsed = JSON.parse(data);
                        this.completeMessages.push({ type: 'data', payload: parsed });
                    } catch (e) {
                        console.warn('JSON parse error:', e);
                    }
                }
            }
        });
    }
    
    getMessages() {
        const messages = [...this.completeMessages];
        this.completeMessages = [];
        return messages;
    }
}

class StreamingMessageRenderer {
    constructor(messageElement) {
        this.element = messageElement;
        this.content = '';
        this.renderQueue = [];
        this.isRendering = false;
        this.abortController = new AbortController();
    }
    
    appendContent(chunk) {
        this.renderQueue.push(chunk);
        if (!this.isRendering) {
            this.startRendering();
        }
    }
    
    async startRendering() {
        this.isRendering = true;
        
        while (this.renderQueue.length > 0 && !this.abortController.signal.aborted) {
            const chunk = this.renderQueue.shift();
            this.content += chunk;
            
            // リアルタイムでコンテンツを更新
            this.updateContent();
            
            // 自然な表示効果のための遅延
            await new Promise(resolve => setTimeout(resolve, STREAMING_CONFIG.chunkDelay));
        }
        
        this.isRendering = false;
    }
    
    updateContent() {
        if (this.element && this.element.querySelector('.message-bubble')) {
            const bubble = this.element.querySelector('.message-bubble');
            bubble.innerHTML = formatMessageContent(this.content);
            
            // スクロール調整
            this.element.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest'
            });
        }
    }
    
    abort() {
        this.abortController.abort();
        this.isRendering = false;
    }
    
    complete() {
        this.isRendering = false;
        this.updateContent();
        this.enableActions();
    }
    
    enableActions() {
        if (this.element) {
            const actions = this.element.querySelector('.message-actions');
            if (actions) {
                const buttons = actions.querySelectorAll('button');
                buttons.forEach(btn => btn.disabled = false);
            }
        }
    }
}

// ===== 根拠ブースター (軽量RAG) =====
const EVIDENCE_SOURCES = {
    wikipedia: 'https://ja.wikipedia.org/api/rest_v1/page/summary/',
    weblio: 'https://www.weblio.jp/content/',
    reliable_domains: ['wikipedia.org', 'britannica.com', 'nature.com', 'sciencedirect.com', 'pubmed.ncbi.nlm.nih.gov']
};

async function searchEvidenceBooster(query) {
    try {
        // キーワード抽出（最重要1-2個）
        const keywords = extractKeywords(query);
        const evidenceResults = [];
        
        // 並列検索（複数ソース同時アクセス）
        const searchPromises = keywords.slice(0, 2).map(async keyword => {
            try {
                // 簡易Web検索（実際の実装では適切なAPIを使用）
                const searchResult = await simulateWebSearch(keyword);
                return {
                    keyword,
                    source: searchResult.source,
                    snippet: searchResult.snippet,
                    reliability: calculateReliability(searchResult.domain)
                };
            } catch (error) {
                console.warn('Evidence search failed for:', keyword);
                return null;
            }
        });
        
        const results = await Promise.allSettled(searchPromises);
        results.forEach(result => {
            if (result.status === 'fulfilled' && result.value) {
                evidenceResults.push(result.value);
            }
        });
        
        // 信頼度順にソート
        evidenceResults.sort((a, b) => b.reliability - a.reliability);
        
        return evidenceResults.slice(0, 3); // 最大3件
        
    } catch (error) {
        console.warn('Evidence booster failed:', error);
        return [];
    }
}

function extractKeywords(text) {
    // 重要キーワード抽出ロジック
    const stopWords = ['は', 'が', 'を', 'に', 'の', 'で', 'と', 'から', 'より', 'について', 'って', 'か', 'な'];
    const words = text.replace(/[？！。、]/g, ' ').split(/\s+/);
    
    return words
        .filter(word => word.length > 1 && !stopWords.includes(word))
        .slice(0, 3); // 最重要3個
}

async function simulateWebSearch(keyword) {
    // 実際の実装では適切な検索APIを使用
    // ここではサンプルデータを返す
    const sampleSources = [
        {
            domain: 'wikipedia.org',
            source: 'Wikipedia',
            snippet: `${keyword}に関する基本的な情報と概要説明です。`,
            reliability: 0.8
        },
        {
            domain: 'britannica.com',
            source: 'Encyclopedia Britannica',
            snippet: `${keyword}についての詳細な解説と歴史的背景です。`,
            reliability: 0.9
        }
    ];
    
    return sampleSources[Math.floor(Math.random() * sampleSources.length)];
}

function calculateReliability(domain) {
    const reliableDomains = {
        'wikipedia.org': 0.8,
        'britannica.com': 0.9,
        'nature.com': 0.95,
        'sciencedirect.com': 0.9,
        'pubmed.ncbi.nlm.nih.gov': 0.95
    };
    
    return reliableDomains[domain] || 0.5;
}

function createEvidenceBoostPrompt(originalPrompt, evidenceData) {
    if (!evidenceData || evidenceData.length === 0) {
        return originalPrompt;
    }
    
    let evidenceSection = '\n\n【参考情報】\n';
    evidenceData.forEach((evidence, index) => {
        evidenceSection += `${index + 1}. ${evidence.source}: ${evidence.snippet}\n`;
    });
    
    evidenceSection += '\n上記の信頼できる情報を参考に、正確性を高めた説明をしてください。';
    
    return originalPrompt + evidenceSection;
}

// ===== 3並列処理システム =====
function extractConversationMemory(userMessage, aiResponse) {
    // 重要なキーワードや情報を抽出
    const importantKeywords = [
        '好き', '嫌い', '趣味', '仕事', '家族', '住んでる', '出身', 
        '誕生日', '年齢', '学校', '会社', '専門', 'よく行く', '愛用',
        'おすすめ', 'いつも', '毎日', '週末', '休日', '最近',
        // 思考モード用の重要キーワードを追加
        'アイデア', '課題', '問題', '解決', '改善', '効率',
        '目標', '計画', '戦略', '分析', '検討', '考察',
        'プロジェクト', '企画', '提案', '方法', '手法', 'アプローチ',
        '仮説', '検証', '実験', 'テスト', '評価', '判断',
        '視点', '観点', '角度', '要因', '原因', '影響'
    ];
    
    const contextInfo = {
        timestamp: new Date().toISOString(),
        userMessage: userMessage,
        aiResponse: aiResponse,
        extractedInfo: []
    };
    
    // ユーザーメッセージから重要な情報を抽出
    importantKeywords.forEach(keyword => {
        if (userMessage.includes(keyword)) {
            contextInfo.extractedInfo.push({
                type: 'preference',
                keyword: keyword,
                context: userMessage
            });
        }
    });
    
    // 長期記憶に追加
    memoryData.conversationContext[Date.now()] = contextInfo;
    
    // 古い記憶は制限（最新100件）
    const contextKeys = Object.keys(memoryData.conversationContext);
    if (contextKeys.length > 100) {
        const oldestKey = contextKeys.sort()[0];
        delete memoryData.conversationContext[oldestKey];
    }
}

function buildEnhancedContext(currentMessage, chatHistory) {
    // 基本の会話履歴（最新10件）
    const recentHistory = chatHistory.slice(-10);
    
    // 長期記憶から関連情報を抽出
    const relevantMemories = [];
    const contextEntries = Object.values(memoryData.conversationContext);
    
    // 現在のメッセージに関連する過去の記憶を検索
    const messageWords = currentMessage.toLowerCase().split(/\s+/);
    
    contextEntries.forEach(entry => {
        const entryWords = entry.userMessage.toLowerCase().split(/\s+/);
        const commonWords = messageWords.filter(word => 
            entryWords.includes(word) && word.length > 2
        );
        
        if (commonWords.length > 0) {
            relevantMemories.push({
                context: entry.userMessage,
                response: entry.aiResponse,
                relevance: commonWords.length,
                timestamp: entry.timestamp
            });
        }
    });
    
    // 関連度順にソート（最新3件）
    relevantMemories.sort((a, b) => b.relevance - a.relevance);
    const topMemories = relevantMemories.slice(0, 3);
    
    return {
        recentHistory,
        relevantMemories: topMemories,
        userPreferences: memoryData.userPreferences
    };
}

function createMemoryEnhancedPrompt(systemPrompt, enhancedContext) {
    let memoryPrompt = systemPrompt;
    
    // 関連する過去の記憶を追加
    if (enhancedContext.relevantMemories.length > 0) {
        memoryPrompt += '\n\n【過去の関連する会話】\n';
        enhancedContext.relevantMemories.forEach((memory, index) => {
            memoryPrompt += `${index + 1}. ユーザー: "${memory.context}"\n   AI応答: "${memory.response.substring(0, 100)}..."\n`;
        });
    }
    
    // ユーザーの好みや特徴を追加
    if (Object.keys(enhancedContext.userPreferences).length > 0) {
        memoryPrompt += '\n【ユーザーの特徴・好み】\n';
        Object.entries(enhancedContext.userPreferences).forEach(([key, value]) => {
            memoryPrompt += `- ${key}: ${value}\n`;
        });
    }
    
    memoryPrompt += '\n上記の情報を参考に、文脈を理解した自然な会話を心がけてください。';
    
    return memoryPrompt;
}

// ===== 自己校正機能付きストリーミングチャット関数 =====
async function streamChatCompletionWithSelfCorrection(messages, model, temperature, apiKey, modeConfig, onChunk, onComplete, onError) {
    let retries = 0;
    const userMessage = messages[messages.length - 1].content;
    
    while (retries < STREAMING_CONFIG.maxRetries) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), STREAMING_CONFIG.timeoutDuration * 2);
            
            // 記憶強化：過去の文脈を構築
            const enhancedContext = buildEnhancedContext(userMessage, chatHistory);
            
            // システムプロンプトに記憶を統合
            const memoryEnhancedPrompt = createMemoryEnhancedPrompt(modeConfig.systemPrompt, enhancedContext);
            
            // 記憶強化されたメッセージを構築
            const enhancedMessages = [
                {
                    role: 'system',
                    content: memoryEnhancedPrompt
                },
                ...enhancedContext.recentHistory, // 最新の会話履歴
                {
                    role: 'user',
                    content: userMessage
                }
            ];
            
            // 第1段階：記憶強化された初期回答生成
            const firstResponse = await fetch(CHAT_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: model,
                    messages: enhancedMessages,
                    temperature: temperature,
                    stream: false
                }),
                signal: controller.signal
            });
            
            if (!firstResponse.ok) {
                throw new Error(`HTTP ${firstResponse.status}: ${await firstResponse.text()}`);
            }
            
            const firstData = await firstResponse.json();
            const initialResponse = firstData.choices?.[0]?.message?.content || '';
            
            // 自己校正が有効でない場合は初期回答をそのまま返す
            if (!modeConfig.selfCorrection) {
                // 記憶に保存
                extractConversationMemory(userMessage, initialResponse);
                onComplete(initialResponse);
                return;
            }
            
            // 自己校正プロンプトを構築（記憶情報も含める）
            const correctionMessages = [
                {
                    role: 'system',
                    content: modeConfig.selfCorrectionPrompt + '\n\n' + 
                            '【文脈情報】過去の会話履歴と関連する記憶を参考に、一貫性のある応答を心がけてください。'
                },
                {
                    role: 'user', 
                    content: `ユーザーの質問: ${userMessage}\n\n元の応答: ${initialResponse}\n\n【過去の関連情報】\n${enhancedContext.relevantMemories.map(m => `- ${m.context}`).join('\n')}`
                }
            ];
            
            // 第2段階：記憶を考慮した自己校正（ストリーミング）
            const correctionResponse = await fetch(CHAT_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: model,
                    messages: correctionMessages,
                    temperature: temperature * 0.7,
                    stream: true
                }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!correctionResponse.ok) {
                console.warn('記憶強化自己校正に失敗、初期回答を使用');
                extractConversationMemory(userMessage, initialResponse);
                onComplete(initialResponse);
                return;
            }
            
            if (!correctionResponse.body) {
                extractConversationMemory(userMessage, initialResponse);
                onComplete(initialResponse);
                return;
            }
            
            // 校正結果をストリーミング表示し、完了時に記憶に保存
            let finalResponse = '';
            await processStreamingResponse(correctionResponse.body, onChunk, (content) => {
                finalResponse = content;
                extractConversationMemory(userMessage, finalResponse);
                onComplete(content);
            });
            break;
            
        } catch (error) {
            console.error(`Memory-enhanced self-correction attempt ${retries + 1} failed:`, error);
            
            if (error.name === 'AbortError' || 
                error.message.includes('network') ||
                error.message.includes('timeout')) {
                
                retries++;
                if (retries < STREAMING_CONFIG.maxRetries) {
                    const delay = STREAMING_CONFIG.retryDelay * Math.pow(2, retries - 1);
                    console.log(`Retrying memory-enhanced correction in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
            }
            
            onError(error);
            break;
        }
    }
}

// ===== ストリーミングチャット関数 =====
async function streamChatCompletion(messages, model, temperature, apiKey, onChunk, onComplete, onError) {
    let retries = 0;
    
    while (retries < STREAMING_CONFIG.maxRetries) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), STREAMING_CONFIG.timeoutDuration);
            
            const response = await fetch(CHAT_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: model,
                    messages: messages,
                    temperature: temperature,
                    stream: true
                }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${await response.text()}`);
            }
            
            if (!response.body) {
                throw new Error('Response body is null');
            }
            
            await processStreamingResponse(response.body, onChunk, onComplete);
            break;
            
        } catch (error) {
            console.error(`Streaming attempt ${retries + 1} failed:`, error);
            
            if (error.name === 'AbortError' || 
                error.message.includes('network') ||
                error.message.includes('timeout')) {
                
                retries++;
                if (retries < STREAMING_CONFIG.maxRetries) {
                    const delay = STREAMING_CONFIG.retryDelay * Math.pow(2, retries - 1);
                    console.log(`Retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
            }
            
            // 最終的にエラーが解決しない場合はフォールバック
            onError(error);
            break;
        }
    }
}

async function processStreamingResponse(stream, onChunk, onComplete) {
    const reader = stream.pipeThrough(new TextDecoderStream()).getReader();
    const buffer = new StreamBuffer();
    let fullContent = '';
    
    try {
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            
            buffer.addChunk(value);
            const messages = buffer.getMessages();
            
            for (const message of messages) {
                if (message.type === 'data') {
                    const delta = message.payload.choices?.[0]?.delta;
                    if (delta?.content) {
                        fullContent += delta.content;
                        onChunk(delta.content);
                    }
                } else if (message.type === 'done') {
                    onComplete(fullContent);
                    return;
                }
            }
        }
        
        // ストリームが予期せず終了した場合
        onComplete(fullContent);
        
    } catch (error) {
        throw error;
    } finally {
        reader.releaseLock();
    }
}

// ===== ストリーミング対応のフォールバック関数 =====
async function fallbackToStandardChat(messages, model, temperature, apiKey, maxTokens) {
    console.log('Falling back to standard chat completion...');
    
    const response = await fetch(CHAT_ENDPOINT, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: model,
            messages: messages,
            temperature: temperature,
            max_tokens: maxTokens,
            stream: false
        })
    });
    
    if (!response.ok) {
        throw new Error(ApiKeyManager.getErrorMessage(response.status));
    }
    
    const data = await response.json();
    return data.choices?.[0]?.message?.content || '応答の取得に失敗しました';
}
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
    switchChatMode('thinking');
    
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
        
        modeContainer.appendChild(button);
    });
}

// ===== 従来のタイピングインジケーター（後方互換性維持） =====
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

function removeTypingIndicator(typingId) {
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
            const loadedData = JSON.parse(savedMemory);
            // 新しい記憶機能のフィールドを追加
            memoryData = {
                memories: loadedData.memories || [],
                lastSaved: loadedData.lastSaved || null,
                conversationContext: loadedData.conversationContext || {},
                userPreferences: loadedData.userPreferences || {},
                importantTopics: loadedData.importantTopics || []
            };
            console.log('🧠 記憶データを読み込みました:', Object.keys(memoryData.conversationContext).length + '件の会話記憶');
        } catch (error) {
            console.error('記憶データの読み込みに失敗:', error);
            memoryData = { 
                memories: [], 
                lastSaved: null,
                conversationContext: {},
                userPreferences: {},
                importantTopics: []
            };
        }
    }
}

// ===== 記憶機能（メッセージを記憶に保存） =====
function saveToMemory(button) {
    const messageElement = button.closest('.chat-message');
    if (!messageElement) return;
    
    const messageContent = messageElement.querySelector('.message-bubble');
    const text = messageContent.textContent || messageContent.innerText;
    const timestamp = new Date().toISOString();
    
    const memoryItem = {
        id: Date.now(),
        content: text,
        timestamp: timestamp,
        mode: currentChatMode,
        source: CHAT_MODES[currentChatMode].displayName
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
    const contextCount = Object.keys(memoryData.conversationContext).length;
    const preferencesCount = Object.keys(memoryData.userPreferences).length;
    
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
                    <p><strong>会話文脈:</strong> ${contextCount}件</p>
                    <p><strong>ユーザー特徴:</strong> ${preferencesCount}件</p>
                    <p><strong>最終保存:</strong> ${memoryData.lastSaved ? new Date(memoryData.lastSaved).toLocaleString() : '未保存'}</p>
                </div>
                
                <div class="memory-tabs">
                    <button class="memory-tab active" onclick="showMemoryTab('basic')">基本記憶</button>
                    <button class="memory-tab" onclick="showMemoryTab('context')">会話文脈</button>
                    <button class="memory-tab" onclick="showMemoryTab('preferences')">ユーザー特徴</button>
                </div>
                
                <div id="basic-memory" class="memory-tab-content active">
                    <div class="memory-list">
                        ${memoryData.memories.length === 0 ? 
                            '<p class="empty-memory">まだ基本記憶データがありません</p>' :
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
                
                <div id="context-memory" class="memory-tab-content">
                    <div class="memory-list">
                        ${contextCount === 0 ? 
                            '<p class="empty-memory">まだ会話文脈データがありません</p>' :
                            Object.values(memoryData.conversationContext).slice(-10).reverse().map(context => `
                                <div class="memory-item">
                                    <div class="memory-header">
                                        <span class="memory-source">会話文脈</span>
                                        <span class="memory-time">${new Date(context.timestamp).toLocaleString()}</span>
                                    </div>
                                    <div class="memory-content">
                                        <strong>質問:</strong> ${context.userMessage.substring(0, 100)}...<br>
                                        <strong>応答:</strong> ${context.aiResponse.substring(0, 100)}...
                                    </div>
                                </div>
                            `).join('')
                        }
                    </div>
                </div>
                
                <div id="preferences-memory" class="memory-tab-content">
                    <div class="memory-list">
                        ${preferencesCount === 0 ? 
                            '<p class="empty-memory">まだユーザー特徴データがありません</p>' :
                            Object.entries(memoryData.userPreferences).map(([key, value]) => `
                                <div class="memory-item">
                                    <div class="memory-header">
                                        <span class="memory-source">ユーザー特徴</span>
                                    </div>
                                    <div class="memory-content">
                                        <strong>${key}:</strong> ${value}
                                    </div>
                                </div>
                            `).join('')
                        }
                    </div>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="action-btn" onclick="saveMemoryDataToJson()">📥 JSONエクスポート</button>
                <button class="action-btn" onclick="clearMemoryData()">🗑️ 記憶クリア</button>
                <button class="skip-btn" onclick="this.closest('.modal-overlay').remove()">閉じる</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// 記憶タブ切り替え
function showMemoryTab(tabName) {
    // タブボタンの状態更新
    document.querySelectorAll('.memory-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`[onclick="showMemoryTab('${tabName}')"]`).classList.add('active');
    
    // コンテンツの表示切り替え
    document.querySelectorAll('.memory-tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`${tabName}-memory`).classList.add('active');
}

// 記憶データクリア
function clearMemoryData() {
    if (confirm('すべての記憶データをクリアしますか？この操作は取り消せません。')) {
        memoryData = {
            memories: [],
            lastSaved: null,
            conversationContext: {},
            userPreferences: {},
            importantTopics: []
        };
        localStorage.setItem('hishoai-memory-data', JSON.stringify(memoryData));
        document.querySelector('.modal-overlay').remove();
        if (typeof showNotification !== 'undefined') {
            showNotification('🧠 記憶データをクリアしました', 'success');
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
    
    // 解説モードの特別説明は削除
    const teachModeInfo = '';
    
    messagesContainer.innerHTML = `
        <div class="chat-welcome">
            <div class="welcome-icon">${modeConfig.icon}</div>
            <h3>${modeConfig.displayName}モードへようこそ！</h3>
            <p>${modeConfig.description}</p>
            <p style="color: var(--mode-color, #667eea); font-size: 0.875rem; margin-top: 0.5rem;">
                💡 サンプルをクリックして会話を始めてみましょう
            </p>
            ${teachModeInfo}
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

// ===== チャットメッセージ送信（ストリーミング対応） =====
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
    
    // ストリーミング用のAIメッセージプレースホルダーを作成
    const messageId = `ai-msg-${Date.now()}`;
    const aiMessageElement = addMessageToChat('assistant', '', true, { 
        messageId, 
        streaming: true 
    });
    
    // 直接「考え中」テキストを表示（タイピングインジケーターは使わない）
    updateMessageContent(aiMessageElement, '🤔 考え中...');
    
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
            
            console.log(`📤 ${modeConfig.model} APIにストリーミング送信中 (${currentChatMode}モード)...`);
            
            // ストリーミング対応チェック
            const useStreaming = STREAMING_CONFIG.enabled && 'ReadableStream' in window;
            
            if (useStreaming) {
                await handleStreamingResponse(messages, modeConfig, aiMessageElement, null, message);
            } else {
                await handleStandardResponse(messages, modeConfig, aiMessageElement, null, message);
            }
            
        } else {
            // APIキー未設定時
            await simulateProcessing();
            
            let sampleResponse = generateSampleChatResponse(message, currentChatMode);
            updateMessageContent(aiMessageElement, sampleResponse);
            
            // 履歴に追加
            chatHistory.push({ role: 'user', content: message });
            chatHistory.push({ role: 'assistant', content: sampleResponse });
            updateChatContext();
            
            if (typeof showNotification !== 'undefined') {
                showNotification('💡 実際のAI応答にはAPIキーの設定が必要です', 'info');
            }
        }
    } catch (error) {
        console.error('チャットエラー詳細:', error);
        
        let errorMessage = `エラーが発生しました: ${error.message}`;
        if (error.message.includes('APIキー')) {
            errorMessage += '\n\n左メニューの「API設定」から正しいAPIキーを設定してください。';
        }
        
        updateMessageContent(aiMessageElement, errorMessage);
    } finally {
        if (sendBtn) sendBtn.disabled = false;
    }
}

// ===== 解説モード専用ストリーミング処理 =====
async function handleTeachingModeStreaming(messages, modeConfig, aiMessageElement, typingId, userMessage) {
    const renderer = new StreamingMessageRenderer(aiMessageElement);
    let fullResponse = '';
    let firstChunkReceived = false;
    
    try {
        // 「考え中」表示はすでにされているので、そのまま処理開始
        
        // 根拠ブースター（並列実行）
        const evidencePromise = modeConfig.ragBooster ? 
            searchEvidenceBooster(userMessage) : 
            Promise.resolve([]);
        
        // 3並列処理と根拠ブースターを同時実行
        const [evidenceData, explanations] = await Promise.all([
            evidencePromise,
            generateParallelExplanations(userMessage, modeConfig, ApiKeyManager.get())
        ]);
        
        // 統合処理
        const integrationResponse = await integrateExplanations(
            userMessage, 
            explanations, 
            modeConfig, 
            ApiKeyManager.get()
        );
        
        // ストリーミング表示開始（考え中表示をクリア）
        updateMessageContent(aiMessageElement, '');
        
        if (integrationResponse.body) {
            await processStreamingResponse(
                integrationResponse.body,
                // onChunk
                (chunk) => {
                    if (!firstChunkReceived) {
                        firstChunkReceived = true;
                    }
                    fullResponse += chunk;
                    renderer.appendContent(chunk);
                },
                // onComplete
                (content) => {
                    console.log('✅ 解説モード完了');
                    if (content) fullResponse = content;
                    renderer.complete();
                    
                    // 根拠情報を追加表示
                    if (evidenceData.length > 0) {
                        const evidenceSection = generateEvidenceSection(evidenceData);
                        fullResponse += evidenceSection;
                        updateMessageContent(aiMessageElement, fullResponse);
                    }
                    
                    // 記憶に保存
                    extractConversationMemory(userMessage, fullResponse);
                    
                    // 履歴に追加
                    chatHistory.push({ role: 'user', content: userMessage });
                    chatHistory.push({ role: 'assistant', content: fullResponse });
                    updateChatContext();
                    
                    // 履歴マネージャーに保存
                    if (typeof chatHistoryManager !== 'undefined') {
                        chatHistoryManager.add({
                            message: userMessage,
                            response: fullResponse,
                            type: 'teach',
                            mode: currentChatMode,
                            model: modeConfig.model,
                            parallelProcessed: true,
                            evidenceBoosted: evidenceData.length > 0
                        });
                    }
                }
            );
        } else {
            // フォールバック表示
            const fallbackContent = generateFallbackExplanation(explanations);
            updateMessageContent(aiMessageElement, fallbackContent);
            renderer.complete();
        }
        
    } catch (error) {
        console.error('解説モードエラー:', error);
        
        // エラー時のフォールバック
        const errorMessage = `解説の生成中にエラーが発生しました: ${error.message}\n\n通常モードで再試行してください。`;
        updateMessageContent(aiMessageElement, errorMessage);
    }
}

function generateEvidenceSection(evidenceData) {
    if (!evidenceData || evidenceData.length === 0) return '';
    
    let section = '\n\n---\n\n### 📚 参考情報\n\n';
    evidenceData.forEach((evidence, index) => {
        const reliabilityStars = '⭐'.repeat(Math.ceil(evidence.reliability * 5));
        section += `**${evidence.source}** ${reliabilityStars}\n`;
        section += `${evidence.snippet}\n\n`;
    });
    
    return section;
}

function generateFallbackExplanation(explanations) {
    const sections = [
        { title: '## 基礎解説', content: explanations.basic?.content },
        { title: '### 具体例・比喩', content: explanations.practical?.content },
        { title: '### 詳細情報', content: explanations.expert?.content }
    ];
    
    return sections
        .filter(section => section.content && !section.content.includes('失敗しました'))
        .map(section => `${section.title}\n\n${section.content}`)
        .join('\n\n---\n\n');
}

// ===== ストリーミングレスポンス処理（更新版） =====
async function handleStreamingResponse(messages, modeConfig, aiMessageElement, typingId, userMessage) {
    const renderer = new StreamingMessageRenderer(aiMessageElement);
    let fullResponse = '';
    let firstChunkReceived = false;
    
    // 思考モードで自己校正が有効な場合
    if (currentChatMode === 'thinking' && modeConfig.selfCorrection) {
        // 「考え中」表示はすでにされているので、そのまま自己校正開始
        
        await streamChatCompletionWithSelfCorrection(
            messages,
            modeConfig.model,
            modeConfig.temperature,
            ApiKeyManager.get(),
            modeConfig,
            // onChunk
            (chunk) => {
                if (!firstChunkReceived) {
                    // 校正完了のメッセージをクリア
                    updateMessageContent(aiMessageElement, '');
                    firstChunkReceived = true;
                }
                
                fullResponse += chunk;
                renderer.appendContent(chunk);
            },
            // onComplete
            (content) => {
                console.log(`✅ ${modeConfig.model} 自己校正ストリーミング完了`);
                
                if (content) fullResponse = content;
                renderer.complete();
                
                // 履歴に追加
                chatHistory.push({ role: 'user', content: userMessage });
                chatHistory.push({ role: 'assistant', content: fullResponse });
                updateChatContext();
                
                // 履歴マネージャーに保存
                if (typeof chatHistoryManager !== 'undefined') {
                    chatHistoryManager.add({
                        message: userMessage,
                        response: fullResponse,
                        type: 'thinking',
                        mode: currentChatMode,
                        model: modeConfig.model,
                        selfCorrected: true
                    });
                }
            },
            // onError
            async (error) => {
                console.error('自己校正ストリーミングエラー、標準モードにフォールバック:', error);
                
                // 標準ストリーミングにフォールバック
                await handleStandardStreamingResponse(messages, modeConfig, aiMessageElement, typingId, userMessage, renderer, fullResponse, firstChunkReceived);
            }
        );
    } else {
        // 標準ストリーミング処理
        await handleStandardStreamingResponse(messages, modeConfig, aiMessageElement, typingId, userMessage, renderer, fullResponse, firstChunkReceived);
    }
}

// ===== 標準ストリーミングレスポンス処理 =====
async function handleStandardStreamingResponse(messages, modeConfig, aiMessageElement, typingId, userMessage, renderer, fullResponse, firstChunkReceived) {
    // 記憶強化：過去の文脈を構築
    const enhancedContext = buildEnhancedContext(userMessage, chatHistory);
    
    // システムプロンプトに記憶を統合
    const memoryEnhancedPrompt = createMemoryEnhancedPrompt(modeConfig.systemPrompt, enhancedContext);
    
    // 記憶強化されたメッセージを構築
    const enhancedMessages = [
        {
            role: 'system',
            content: memoryEnhancedPrompt
        },
        ...enhancedContext.recentHistory,
        {
            role: 'user',
            content: userMessage
        }
    ];
    
    await streamChatCompletion(
        enhancedMessages,
        modeConfig.model,
        modeConfig.temperature,
        ApiKeyManager.get(),
        // onChunk
        (chunk) => {
            if (!firstChunkReceived) {
                // 最初のチャンクで「考え中」をクリア
                updateMessageContent(aiMessageElement, '');
                firstChunkReceived = true;
            }
            
            fullResponse += chunk;
            renderer.appendContent(chunk);
        },
        // onComplete
        (content) => {
            console.log(`✅ ${modeConfig.model} 記憶強化ストリーミング完了`);
            
            if (content) fullResponse = content;
            renderer.complete();
            
            // 記憶に保存
            extractConversationMemory(userMessage, fullResponse);
            
            // 履歴に追加
            chatHistory.push({ role: 'user', content: userMessage });
            chatHistory.push({ role: 'assistant', content: fullResponse });
            updateChatContext();
            
            // 履歴マネージャーに保存
            if (typeof chatHistoryManager !== 'undefined') {
                chatHistoryManager.add({
                    message: userMessage,
                    response: fullResponse,
                    type: 'thinking',
                    mode: currentChatMode,
                    model: modeConfig.model,
                    memoryEnhanced: true
                });
            }
        },
        // onError
        async (error) => {
            console.error('記憶強化ストリーミングエラー、フォールバックを実行:', error);
            
            // フォールバック実行
            try {
                const fallbackResponse = await fallbackToStandardChat(
                    messages, // 元のメッセージを使用
                    modeConfig.model,
                    modeConfig.temperature,
                    ApiKeyManager.get(),
                    modeConfig.maxTokens
                );
                
                updateMessageContent(aiMessageElement, fallbackResponse);
                
                // 記憶に保存
                extractConversationMemory(userMessage, fallbackResponse);
                
                // 履歴に追加
                chatHistory.push({ role: 'user', content: userMessage });
                chatHistory.push({ role: 'assistant', content: fallbackResponse });
                updateChatContext();
                
            } catch (fallbackError) {
                console.error('フォールバックも失敗:', fallbackError);
                updateMessageContent(aiMessageElement, `エラーが発生しました: ${fallbackError.message}`);
            }
        }
    );
}

// ===== 標準レスポンス処理（非ストリーミング） =====
async function handleStandardResponse(messages, modeConfig, aiMessageElement, typingId, userMessage) {
    try {
        const response = await fallbackToStandardChat(
            messages,
            modeConfig.model,
            modeConfig.temperature,
            ApiKeyManager.get(),
            modeConfig.maxTokens
        );
        
        updateMessageContent(aiMessageElement, response);
        
        // 履歴に追加
        chatHistory.push({ role: 'user', content: userMessage });
        chatHistory.push({ role: 'assistant', content: response });
        updateChatContext();
        
        // 履歴マネージャーに保存
        if (typeof chatHistoryManager !== 'undefined') {
            chatHistoryManager.add({
                message: userMessage,
                response: response,
                type: 'thinking',
                mode: currentChatMode,
                model: modeConfig.model
            });
        }
        
    } catch (error) {
        throw error;
    }
}

// ===== メッセージをチャットに追加（ストリーミング対応LINEスタイル） =====
function addMessageToChat(role, content, saveToHistory = true, options = {}) {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return null;
    
    const welcomeMessage = messagesContainer.querySelector('.chat-welcome');
    if (welcomeMessage) {
        welcomeMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    const messageId = options.messageId || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    messageDiv.setAttribute('data-message-id', messageId);
    messageDiv.className = `chat-message ${role}`;
    
    const avatarClass = role === 'user' ? 'user-avatar' : `ai-avatar ${currentChatMode}-mode`;
    const avatarIcon = role === 'user' ? '👤' : CHAT_MODES[currentChatMode].icon;
    
    // ストリーミング中はアクションボタンを無効化
    const actionsDisabled = options.streaming ? 'disabled' : '';
    
    messageDiv.innerHTML = `
        <div class="message-avatar ${avatarClass}">
            ${avatarIcon}
        </div>
        <div class="message-content">
            <div class="message-bubble">
                ${formatMessageContent(content)}
            </div>
            <div class="message-actions">
                <button class="message-action-btn" onclick="copyMessage(this)" title="コピー" ${actionsDisabled}>
                    📋
                </button>
                ${role === 'assistant' ? `
                    <button class="message-action-btn" onclick="regenerateMessage(this)" title="再生成" ${actionsDisabled}>
                        🔄
                    </button>
                    <button class="message-action-btn memory-btn" onclick="saveToMemory(this)" title="記憶させる" ${actionsDisabled}>
                        🧠
                    </button>
                ` : ''}
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    
    // 自動スクロール処理
    if (role === 'assistant' && !options.streaming) {
        // 非ストリーミングの場合は従来通り
        setTimeout(() => {
            messageDiv.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start',
                inline: 'nearest'
            });
        }, 100);
    } else if (role === 'user') {
        // ユーザーメッセージの場合は最下部にスクロール
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    return messageDiv;
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

// ===== ストリーミング用ヘルパー関数 =====
function showTypingIndicatorInMessage(messageElement) {
    if (!messageElement) return null;
    
    const bubble = messageElement.querySelector('.message-bubble');
    if (bubble) {
        const typingId = Date.now();
        bubble.innerHTML = `
            <div class="typing-indicator" data-typing-id="${typingId}">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        return typingId;
    }
    return null;
}

function removeTypingIndicatorFromMessage(messageElement, typingId) {
    if (!messageElement || !typingId) return;
    
    const typingDiv = messageElement.querySelector(`[data-typing-id="${typingId}"]`);
    if (typingDiv) {
        typingDiv.remove();
    }
}

function updateMessageContent(messageElement, content) {
    if (!messageElement) return;
    
    const bubble = messageElement.querySelector('.message-bubble');
    if (bubble) {
        bubble.innerHTML = formatMessageContent(content);
        
        // アクションボタンを有効化
        const actions = messageElement.querySelector('.message-actions');
        if (actions) {
            const buttons = actions.querySelectorAll('button');
            buttons.forEach(btn => btn.disabled = false);
        }
        
        // スクロール調整
        setTimeout(() => {
            messageElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start',
                inline: 'nearest'
            });
        }, 100);
    }
}

function updateChatContext() {
    // 履歴を20件に制限
    if (chatHistory.length > 20) {
        chatHistory = chatHistory.slice(-20);
    }
    
    // モード別履歴を更新
    chatContextByMode[currentChatMode] = [...chatHistory];
}
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
    const messageContent = button.closest('.chat-message').querySelector('.message-bubble');
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
            thinking: [],
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

// ===== サンプルチャット応答生成 =====
function generateSampleChatResponse(message, mode) {
    const lowerMessage = message.toLowerCase();
    const modeConfig = CHAT_MODES[mode];
    
    // モード別のサンプル応答
    switch (mode) {
        case 'thinking':
            if (lowerMessage.includes('アプリ') || lowerMessage.includes('アイデア')) {
                return `新しいアプリのアイデア、面白そうですね！💡

アプリ開発って、技術的な部分だけじゃなくて、ユーザーの本当の課題を見つけることが肝心ですよね。最近は特に「毎日使われるアプリ」と「一回きりで終わるアプリ」の差が激しくなってる印象です。

**まず、アイデアを多角的に整理してみましょう：**

**🎯 ユーザー価値の深堀り**
- どんな人の、どんな瞬間の課題を解決しますか？
- その課題は「痛み」レベル？それとも「ちょっとした不便」レベル？
- 現在の解決方法と比べた時の圧倒的な優位性は？
- ユーザーが「これなしでは生活できない」と思える要素は？

**🔧 実現可能性の検討**  
- 技術的な難易度（既存技術で可能？新技術が必要？）
- 開発リソース（個人開発？チーム必要？）
- データ取得の難易度（API連携？独自データベース？）
- 法規制や許可が必要な領域か？

**🚀 ビジネスモデルの可能性**
- 収益化の方向性（サブスク？広告？手数料？）
- 競合他社の状況と差別化ポイント
- マーケットサイズと成長可能性
- 将来的な事業拡張の方向性

**💡 発展的なアイデア展開**
個人的には、成功するアプリには「習慣化の仕組み」が組み込まれてることが多いと思います。例えば：

- **ゲーミフィケーション要素**：達成感、進捗の可視化、レベルアップ
- **ソーシャル要素**：共有、競争、協力
- **パーソナライゼーション**：使えば使うほど自分専用になる
- **マイクロモーメント対応**：すき間時間での価値提供

**実践的な次のステップ提案：**
1. **プロトタイプ作成**：紙でもいいのでユーザーフローを描いてみる
2. **ターゲットユーザーヒアリング**：5-10人に課題感を確認
3. **競合分析**：似たようなアプリのレビューを読み込む
4. **MVP設計**：最小限の機能で価値を提供できる形を考える

どの角度から深掘りしてみたいですか？それとも、全く違う発想の方向性も探ってみましょうか？`;
            }
            if (lowerMessage.includes('課題') || lowerMessage.includes('分析') || lowerMessage.includes('問題')) {
                return `課題の深堀り分析、一緒にやってみましょう！🔍

複雑な課題って、表面的に見えている部分と根本的な原因が全然違うことが多いんですよね。氷山の一角現象というか。しかも、関係者それぞれが見えてる「問題」も違ったりする。

**まず、課題を多層的に構造化してみませんか？**

**📊 現状の詳細把握**
- **事象レベル**：何が実際に起きているか（数値、頻度、場所、時間）
- **影響レベル**：それによって何が困っているか（コスト、時間、品質、人間関係）
- **規模感**：どの程度の範囲に影響しているか（個人？チーム？組織？）
- **緊急度vs重要度**：今すぐ対処が必要？それとも中長期的な課題？

**🔎 原因の多角的分析**
- **直接原因**：明らかに「これが原因」と言えるもの
- **間接原因**：システムや環境、プロセスの問題
- **根本原因**：なぜその直接原因が生まれるのか
- **隠れた原因**：誰も気づいていない、前提条件の問題

**🛠️ 分析フレームワークの提案：**

**1. Why Tree分析（なぜなぜ分析）**
問題 → なぜ？ → なぜ？ → なぜ？ → なぜ？ → 真の原因
通常3〜5回「なぜ？」を繰り返すと、意外な根本原因にたどり着きます。

**2. ステークホルダー分析**
- 関係者それぞれから見た「問題」の定義
- 各人の利害関係と動機
- 解決に必要な協力者の特定

**3. システム思考アプローチ**
- 問題が発生する「システム全体」を俯瞰
- フィードバックループの特定
- 介入ポイントの発見

**4. 時系列分析**
- 問題がいつから始まったか
- 悪化のタイミングと外部要因
- 過去の対処法の効果と限界

**💡 個人的な経験から言えることは：**

「前提条件」を疑うのが一番効果的なことが多いです。例えば：
- 「当然こうあるべき」と思っている部分
- 「これは変えられない」と諦めている制約
- 「みんなが合意している」と思い込んでいる目標

**実践的な深堀りステップ：**
1. **事実と解釈を分ける**：何が客観的事実で、何が解釈・推測か
2. **複数の仮説を立てる**：原因として考えられるものを3-5個
3. **仮説を検証する方法を考える**：どうやって確かめるか
4. **短期・中期・長期の対策を分ける**：今すぐできること、将来的な改善
5. **成功指標を設定**：解決したかどうかをどう判断するか

課題の詳細を教えてもらえれば、より具体的な分析アプローチを一緒に考えられます。どの角度から攻めてみたいですか？`;
            }
            if (lowerMessage.includes('まとまらない') || lowerMessage.includes('整理') || lowerMessage.includes('考えて')) {
                return `思考の整理、お手伝いします！🎯

頭の中がごちゃごちゃしている時って、本当によくありますよね。情報が多すぎたり、複数のことを同時に考えていたり、感情と論理がごちゃ混ぜになっていたり。そういう時は、まず外に出してから整理すると、驚くほどクリアになることが多いです。

**思考整理の段階的アプローチを提案しますね：**

**🧩 第1段階：情報の全出し＆仕分け**
まず「考えていること全部」を書き出して、カテゴリ分けしましょう：

- **確実にわかっていること**（事実、データ、確定事項）
- **推測・仮説**（たぶんこうだろうと思っていること）
- **感情・直感**（なんとなく感じていること）
- **全くわからないこと**（情報不足で判断できないもの）
- **他人の意見**（誰かから聞いたこと、一般論）

**⭐ 第2段階：重要度×緊急度の整理**
アイゼンハワーマトリックスで優先順位をつける：

- **重要×緊急**：今すぐ考える必要があるもの
- **重要×非緊急**：じっくり考えるべきもの
- **非重要×緊急**：誰かに任せられるもの
- **非重要×非緊急**：実は考えなくてもいいもの

**🔄 第3段階：思考のループチェック**
同じことをぐるぐる考えていないかチェック：

- **堂々巡りポイント**：同じ悩みを何度も考えている部分
- **情報不足ポイント**：調べれば解決する部分
- **決断回避ポイント**：実は決める勇気の問題

**🎯 第4段階：構造化と関連性整理**
バラバラの要素を整理：

- **因果関係**：AがあるからBが起きる
- **並列関係**：同レベルの複数の要素
- **階層関係**：大きな目標と小さなタスク
- **時系列関係**：順番に考える必要があるもの

**💡 思考整理のコツ（個人的な経験から）：**

**1. 「とりあえず全部書き出す」が最強**
頭の中のRAMを一度クリアにする感じ。メモ帳でもスマホでも何でもいいので、思っていることを全部外に出す。

**2. 「完璧を求めない」**
最初から綺麗に整理しようとすると逆に混乱します。雑でいいからまず全体を把握。

**3. 「感情と論理を分ける」**
「やりたくない」「不安」「楽しそう」などの感情も大事な判断材料。でも論理的な要素とは分けて考える。

**4. 「他人に説明するつもりで整理」**
誰かに説明するとしたら、どういう順番で話すか考えてみる。

**🚀 実践的な整理テクニック：**

- **マインドマップ**：中心から放射状に要素を配置
- **フローチャート**：決断や手順を矢印でつなぐ
- **リスト化**：シンプルに箇条書きで整理
- **タイムライン**：時系列で並べて関係を見る
- **グルーピング**：似たものをまとめて大カテゴリを作る

どんなテーマについて整理したいか、もう少し具体的に教えてもらえれば、そのテーマに特化した整理アプローチを一緒に考えられます。仕事のこと？人生のこと？何かのプロジェクト？

頭の中を整理する時間って、実はすごく価値の高い投資だと思うんです。一緒に構造化してみましょう！`;
            }
            break;
            
        case 'teach':
            if (lowerMessage.includes('二日酔い')) {
                return `## 二日酔いを早く治す方法 🍺

### 基礎知識
二日酔いは体内のアルコール代謝で生じるアセトアルデヒドが原因です。水分と電解質の補給が最重要です。

### 具体的な対処法
**1. 水分補給が最重要**
- 大量の水を飲む（できれば経口補水液）
- アルコールによる脱水を解消

**2. 電解質の補給**
- スポーツドリンクやみそ汁
- 失われたミネラルを補給

**3. 軽い食事**
- おかゆ、うどんなど消化に良いもの
- ビタミンB群を含む食品

### 実例・比喩
例えるなら、二日酔いは「体の中で小さな火事が起きている状態」。水分補給は消火活動、電解質補給は復旧作業、休息は再建工事のようなものです。

### 予防法
- 飲酒前に食事をとる
- お酒と同量の水を飲む
- 自分の適量を知る

💡 症状がひどい場合は医療機関を受診してください。

---

📚 **参考情報**
**厚生労働省** ⭐⭐⭐⭐⭐
アルコールの健康への影響に関する公式ガイドライン`;
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
「${message}」について一緒に考えてみましょう。

**このモードについて**
${modeConfig.description}

**💡 思考パートナーとしてできること：**
- **アイデアの発展・拡張**：あなたの考えを複数の角度から広げて、新しい可能性を一緒に探します
- **論理的な深堀り・構造化**：複雑な内容を整理して、わかりやすく体系化します
- **新しい視点・角度の提案**：異なる観点から物事を見る新しいアプローチを提案します
- **思考の整理とまとめ**：散らばった情報や考えを、実用的な形に整理します
- **実現可能性の検討**：アイデアを現実的な行動計画に落とし込みます

**🔧 技術仕様**
- **使用API:** ${modeConfig.model}
- **Temperature:** ${modeConfig.temperature}（創造性と論理性のバランス調整）
- **最大トークン:** ${modeConfig.maxTokens}（充実した応答のための十分な容量）
- **自己校正機能:** 有効（より良い応答のための品質向上システム）

**📋 よくある使用例：**
- 新規事業やプロダクトのアイデア整理
- 複雑な問題の分析と解決策検討
- 学習内容の体系化と理解の深化
- プロジェクト計画の構造化
- 創作活動のコンセプト開発

💡 **実際のAI応答にはAPIキーの設定が必要です。**
左メニューの「API設定」から設定すると、本格的な思考パートナーとして機能します。

具体的にどんなことを一緒に考えたいか、お聞かせください！`;
}

// ===== チャット統計情報 =====
function getChatStats() {
    const allMessages = [];
    Object.keys(chatContextByMode).forEach(mode => {
        allMessages.push(...chatContextByMode[mode]);
    });
    
    const contextCount = Object.keys(memoryData.conversationContext).length;
    const preferencesCount = Object.keys(memoryData.userPreferences).length;
    
    const stats = {
        totalMessages: allMessages.length,
        userMessages: allMessages.filter(msg => msg.role === 'user').length,
        assistantMessages: allMessages.filter(msg => msg.role === 'assistant').length,
        messagesByMode: {
            thinking: chatContextByMode.thinking.length,
            teach: chatContextByMode.teach.length,
            idea: chatContextByMode.idea.length
        },
        currentMode: currentChatMode,
        averageMessageLength: allMessages.reduce((sum, msg) => sum + msg.content.length, 0) / allMessages.length || 0,
        memoryCount: memoryData.memories.length,
        conversationContextCount: contextCount,
        userPreferencesCount: preferencesCount,
        memoryEnhanced: currentChatMode === 'thinking', // 思考モードは記憶強化
        parallelProcessing: currentChatMode === 'teach', // 解説モードは3並列処理
        evidenceBoosted: currentChatMode === 'teach' // 解説モードは根拠ブースター
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
                        <span class="mode-icon">${CHAT_MODES.thinking.icon}</span>
                        <span class="mode-name">思考 (${CHAT_MODES.thinking.model}):</span>
                        <span class="mode-count">${stats.messagesByMode.thinking} メッセージ</span>
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
    
    // ストリーミングサポート確認
    if ('ReadableStream' in window && STREAMING_CONFIG.enabled) {
        console.log('✅ ストリーミング機能が有効です');
    } else {
        console.log('⚠️ ストリーミング機能が無効です（フォールバックモード）');
    }
    
    // 解説モード強化機能確認
    if (CHAT_MODES.teach.parallelMode) {
        console.log('⚡ 解説モード3並列処理が有効です');
    }
    
    if (CHAT_MODES.teach.ragBooster) {
        console.log('🔍 根拠ブースター(RAG)が有効です');
    }
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
window.saveToMemory = saveToMemory;
window.showMemoryData = showMemoryData;
window.showMemoryTab = showMemoryTab;
window.clearMemoryData = clearMemoryData;

// ===== ストリーミング設定関数 =====
window.setStreamingEnabled = function(enabled) {
    STREAMING_CONFIG.enabled = enabled;
    console.log(`ストリーミング機能: ${enabled ? '有効' : '無効'}`);
};

window.getStreamingConfig = function() {
    return { ...STREAMING_CONFIG };
};

window.updateStreamingConfig = function(config) {
    Object.assign(STREAMING_CONFIG, config);
    console.log('ストリーミング設定を更新しました:', STREAMING_CONFIG);
};