// ===================================================================
// HishoAI Enhanced - Core System（買い切り完全版）
// 全機能制限なし - ライセンス管理機能を削除
// ===================================================================

// ===== グローバル変数 =====
let currentTab = 'chat';
let isApiConfigured = false;
let selectedAudioFile = null;
let selectedImageFile = null;
let selectedCompareImage = null;
let chatHistory = [];
let chatContext = [];
let pastedImageData = null;
let officeChatHistory = [];
let analysisHistory = [];
let transcriptHistory = [];
let officeConversationContext = {};

// ===== APIキー管理システム =====
const ApiKeyManager = {
    key: '',
    isInitialized: false,
    
    init() {
        if (this.isInitialized) return;
        console.log('🔧 ApiKeyManager を初期化中...');
        this.loadFromStorage();
        this.syncGlobalVariables();
        this.isInitialized = true;
        console.log('✅ ApiKeyManager 初期化完了');
    },
    
    get() {
        if (!this.isInitialized) this.init();
        return this.key;
    },
    
    set(newKey) {
        console.log('🔑 APIキーを設定中...', { 
            hasKey: !!newKey, 
            keyLength: newKey ? newKey.length : 0,
            startsWithSk: newKey ? newKey.startsWith('sk-') : false
        });
        
        this.key = newKey;
        this.syncGlobalVariables();
        
        const saved = this.saveToStorage();
        this.updateStatus();
        
        console.log('✅ APIキー設定完了', {
            saved: saved,
            isValid: this.isValid(),
            isConfigured: isApiConfigured,
            globalSync: window.OPENAI_API_KEY === newKey
        });
        
        return saved;
    },
    
    syncGlobalVariables() {
        window.OPENAI_API_KEY = this.key;
        
        if (typeof OPENAI_API_KEY !== 'undefined') {
            OPENAI_API_KEY = this.key;
        }
        
        this.notifyModules();
    },
    
    notifyModules() {
        const event = new CustomEvent('apiKeyUpdated', { 
            detail: { 
                isValid: this.isValid(),
                hasKey: !!this.key
            } 
        });
        document.dispatchEvent(event);
    },
    
    loadFromStorage() {
        try {
            const savedKey = localStorage.getItem('hishoai_openai_key');
            if (savedKey && savedKey.startsWith('sk-')) {
                this.key = savedKey;
                this.syncGlobalVariables();
                console.log('✅ APIキーをlocalStorageから読み込み成功');
            } else if (savedKey) {
                console.warn('⚠️ 無効なAPIキー形式を検出、削除します');
                localStorage.removeItem('hishoai_openai_key');
                this.key = '';
            }
        } catch (error) {
            console.error('❌ APIキー読み込みエラー:', error);
            this.key = '';
        }
        this.updateStatus();
    },
    
    saveToStorage() {
        try {
            if (this.key && this.key.length > 0) {
                localStorage.setItem('hishoai_openai_key', this.key);
                console.log('✅ APIキーをlocalStorageに保存成功');
                const verification = localStorage.getItem('hishoai_openai_key');
                return verification === this.key;
            }
            return false;
        } catch (error) {
            console.error('❌ APIキー保存エラー:', error);
            return false;
        }
    },
    
    isValid() {
        return !!(this.key && this.key.length > 40 && this.key.startsWith('sk-'));
    },
    
    updateStatus() {
        const wasConfigured = isApiConfigured;
        isApiConfigured = this.isValid();
        console.log('🔄 APIキー状態更新:', { wasConfigured, nowConfigured: isApiConfigured });
        this.updateUI();
        if (wasConfigured !== isApiConfigured && isApiConfigured) {
            this.notifyStatusChange(isApiConfigured);
        }
    },
    
    updateUI() {
        const statusElement = document.getElementById('apiKeyStatus');
        if (statusElement) {
            if (this.isValid()) {
                statusElement.innerHTML = '✅ API接続済み';
                // 親要素のクラスも更新
                const apiStatus = statusElement.closest('.api-status');
                if (apiStatus) {
                    apiStatus.classList.remove('disconnected');
                    apiStatus.classList.add('connected');
                }
            } else {
                statusElement.innerHTML = '❌ API未設定';
                const apiStatus = statusElement.closest('.api-status');
                if (apiStatus) {
                    apiStatus.classList.remove('connected');
                    apiStatus.classList.add('disconnected');
                }
            }
        }
    },
    
    notifyStatusChange(isConfigured) {
        if (isConfigured && window.showNotification) {
            showNotification('🎉 APIキーが設定されました！全機能が利用可能です', 'success');
        }
    },
    
    async test(testKey = null) {
        const keyToTest = testKey || this.key;
        if (!keyToTest || !keyToTest.startsWith('sk-')) {
            throw new Error('無効なAPIキー形式です');
        }
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            
            const response = await fetch('https://api.openai.com/v1/models', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${keyToTest}`,
                    'Content-Type': 'application/json'
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                console.log('✅ APIキーテスト成功');
                return { success: true, key: keyToTest };
            } else {
                const error = await response.text();
                console.error('❌ APIキーテスト失敗:', response.status, error);
                throw new Error(this.getErrorMessage(response.status));
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('APIテストがタイムアウトしました');
            }
            throw error;
        }
    },
    
    getErrorMessage(status) {
        switch (status) {
            case 401: return 'APIキーが無効です。正しいキーを入力してください。';
            case 429: return 'API利用制限に達しています。後ほど再試行してください。';
            case 403: return 'APIアクセスが拒否されました。アカウント設定を確認してください。';
            default: return 'API接続に失敗しました。ネットワーク接続を確認してください。';
        }
    },
    
    debug() {
        const info = {
            initialized: this.isInitialized,
            hasKey: !!this.key,
            keyLength: this.key ? this.key.length : 0,
            startsWithSk: this.key ? this.key.startsWith('sk-') : false,
            isValid: this.isValid(),
            isConfigured: isApiConfigured,
            globalKey: window.OPENAI_API_KEY ? 'Set' : 'Not set',
            globalKeyMatch: window.OPENAI_API_KEY === this.key
        };
        try {
            const stored = localStorage.getItem('hishoai_openai_key');
            info.localStorageKey = stored ? 'Set' : 'Not set';
            info.localStorageMatch = stored === this.key;
        } catch (error) {
            info.localStorageKey = 'Error: ' + error.message;
        }
        console.log('🔍 APIキー管理状態:', info);
        return info;
    }
};

// ===== 履歴管理システム =====
class HistoryManager {
    constructor(storageKey, maxItems = 100) {
        this.storageKey = storageKey;
        this.maxItems = maxItems;
        this.history = [];
        this.loadFromStorage();
    }
    
    add(item) {
        const historyItem = {
            id: Date.now() + Math.random(),
            timestamp: new Date().toISOString(),
            ...item
        };
        
        this.history.unshift(historyItem);
        
        if (this.history.length > this.maxItems) {
            this.history = this.history.slice(0, this.maxItems);
        }
        
        this.saveToStorage();
        return historyItem;
    }
    
    get(id) {
        return this.history.find(item => item.id === id);
    }
    
    getAll() {
        return this.history;
    }
    
    search(query) {
        const searchTerm = query.toLowerCase();
        return this.history.filter(item => {
            const searchableText = JSON.stringify(item).toLowerCase();
            return searchableText.includes(searchTerm);
        });
    }
    
    delete(id) {
        this.history = this.history.filter(item => item.id !== id);
        this.saveToStorage();
    }
    
    clear() {
        this.history = [];
        this.saveToStorage();
    }
    
    saveToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.history));
        } catch (error) {
            console.error('履歴の保存に失敗しました:', error);
        }
    }
    
    loadFromStorage() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                this.history = JSON.parse(saved);
            }
        } catch (error) {
            console.error('履歴の読み込みに失敗しました:', error);
            this.history = [];
        }
    }
}

// 履歴マネージャーのインスタンス作成（容量制限なし）
const chatHistoryManager = new HistoryManager('hishoai_chat_history', 100);
const analysisHistoryManager = new HistoryManager('hishoai_analysis_history', 100);
const transcriptHistoryManager = new HistoryManager('hishoai_transcript_history', 100);

// ===== ナビゲーション機能 =====
function switchTab(tabName) {
    currentTab = tabName;
    
    // 既存のコード
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // data-tab属性を使用するように変更
    const targetNavItem = document.querySelector(`.nav-item[data-tab="${tabName}"]`);
    if (targetNavItem) {
        targetNavItem.classList.add('active');
    }
    
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(tabName + 'Section');
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // ページタイトルの更新（新規追加）
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle && targetNavItem) {
        pageTitle.textContent = targetNavItem.querySelector('.nav-text').textContent;
    }
    
    // トップバーアクションの更新（新規追加）
    updateTopbarActions();
    
    showNotification(`${getTabDisplayName(tabName)}を開きました`, 'success');
}

function getTabDisplayName(tabName) {
    const names = {
        'chat': 'チャット',
        'office': 'Office支援',
        'transcript': '音声文字起こし',
        'correction': '校正AI',
        'translate': '翻訳',
        'summary': '要約',
        'analysis': 'スクショ解析'
    };
    return names[tabName] || tabName;
}

// トップバーアクション更新関数（翻訳専用クリア追加）
function updateTopbarActions() {
    const topbarActions = document.getElementById('topbarActions');
    if (!topbarActions) return;
    
    switch(currentTab) {
        case 'chat':
            topbarActions.innerHTML = `
                <button class="btn btn-ghost" onclick="showChatStats()">
                    <span>📊</span>
                    <span>統計</span>
                </button>
                <button class="btn btn-ghost" onclick="clearChat()">
                    <span>🗑️</span>
                    <span>クリア</span>
                </button>
            `;
            break;
        case 'office':
            topbarActions.innerHTML = `
                <button class="btn btn-ghost" onclick="clearOfficeChat()">
                    <span>🗑️</span>
                    <span>クリア</span>
                </button>
            `;
            break;
        case 'translate':
            topbarActions.innerHTML = `
                <button class="btn btn-ghost" onclick="toggleHistoryPanel()">
                    <span>📋</span>
                    <span>履歴</span>
                </button>
                <button class="btn btn-ghost" onclick="clearTranslationResults()">
                    <span>🗑️</span>
                    <span>クリア</span>
                </button>
            `;
            break;
        case 'transcript':
        case 'analysis':
            topbarActions.innerHTML = `
                <button class="btn btn-ghost" onclick="toggleHistoryPanel()">
                    <span>📋</span>
                    <span>履歴</span>
                </button>
                <button class="btn btn-ghost" onclick="clearCurrentResults()">
                    <span>🗑️</span>
                    <span>結果をクリア</span>
                </button>
            `;
            break;
        default:
            topbarActions.innerHTML = `
                <button class="btn btn-ghost" onclick="toggleHistoryPanel()">
                    <span>📋</span>
                    <span>履歴</span>
                </button>
            `;
    }
}

// ===== OpenAI API呼び出し機能 =====
async function callOpenAIAPI(functionType, prompt) {
    const currentApiKey = ApiKeyManager.get();
    
    if (!ApiKeyManager.isValid()) {
        throw new Error('APIキーが設定されていないか無効です');
    }

    console.log(`📤 OpenAI API呼び出し (${functionType})`, {
        hasKey: !!currentApiKey,
        keyStart: currentApiKey.substring(0, 7)
    });
    
    try {
        const response = await fetch(`${window.API_CONFIG.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${currentApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: window.DEFAULT_MODEL,
                messages: [{
                    role: 'user',
                    content: prompt
                }],
                max_tokens: window.MAX_TOKENS[functionType] || window.MAX_TOKENS.general,
                temperature: window.AI_TEMPERATURE[functionType] || window.AI_TEMPERATURE.general
            })
        });

        if (!response.ok) {
            console.error('API応答エラー:', response.status, response.statusText);
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || ApiKeyManager.getErrorMessage(response.status));
        }

        const data = await response.json();
        console.log(`✅ API応答受信 (${functionType})`);
        
        return data.choices[0].message.content.trim();
        
    } catch (error) {
        console.error(`❌ OpenAI API エラー (${functionType}):`, error);
        throw error;
    }
}

// Vision API呼び出し
async function callVisionAPI(prompt, imageData) {
    const currentApiKey = ApiKeyManager.get();
    
    if (!ApiKeyManager.isValid()) {
        throw new Error('APIキーが設定されていないか無効です');
    }

    console.log('📤 Vision API呼び出し');
    
    try {
        const response = await fetch(`${window.API_CONFIG.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${currentApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: window.DEFAULT_MODEL,
                messages: [{
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: prompt
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: imageData,
                                detail: window.IMAGE_SETTINGS.detail
                            }
                        }
                    ]
                }],
                max_tokens: window.MAX_TOKENS.vision || window.MAX_TOKENS.general,
                temperature: window.AI_TEMPERATURE.vision || window.AI_TEMPERATURE.general
            })
        });

        if (!response.ok) {
            console.error('Vision API応答エラー:', response.status, response.statusText);
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || ApiKeyManager.getErrorMessage(response.status));
        }

        const data = await response.json();
        console.log('✅ Vision API応答受信');
        
        return data.choices[0].message.content.trim();
        
    } catch (error) {
        console.error('❌ Vision API エラー:', error);
        throw error;
    }
}

// Whisper API呼び出し
async function callWhisperAPI(audioFile) {
    const currentApiKey = ApiKeyManager.get();
    
    if (!ApiKeyManager.isValid()) {
        throw new Error('APIキーが設定されていないか無効です');
    }

    console.log('📤 Whisper API呼び出し');
    
    try {
        const formData = new FormData();
        formData.append('file', audioFile);
        formData.append('model', 'whisper-1');
        formData.append('language', window.AUDIO_SETTINGS.defaultLanguage);
        formData.append('response_format', 'verbose_json');
        formData.append('temperature', window.AUDIO_SETTINGS.temperature);
        
        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${currentApiKey}`
            },
            body: formData
        });

        if (!response.ok) {
            console.error('Whisper API応答エラー:', response.status, response.statusText);
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || ApiKeyManager.getErrorMessage(response.status));
        }

        const data = await response.json();
        console.log('✅ Whisper API応答受信');
        
        return data;
        
    } catch (error) {
        console.error('❌ Whisper API エラー:', error);
        throw error;
    }
}

// ===== UI ユーティリティ関数 =====

// 通知表示
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${icons[type] || icons.info}</span>
            <span class="notification-text">${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, window.UI_SETTINGS.notificationDuration);
}

// プロセシング表示
function showProcessing(message) {
    hideProcessing();
    
    const processingDiv = document.createElement('div');
    processingDiv.id = 'globalProcessing';
    processingDiv.className = 'processing';
    processingDiv.innerHTML = `
        <div class="processing-icon">⏳</div>
        <div>${message}</div>
    `;
    
    document.body.appendChild(processingDiv);
}

// プロセシング非表示
function hideProcessing() {
    const processingDiv = document.getElementById('globalProcessing');
    if (processingDiv) {
        processingDiv.remove();
    }
}

// プロセシングシミュレーション
function simulateProcessing() {
    return new Promise(resolve => {
        setTimeout(resolve, window.UI_SETTINGS.processingDelay);
    });
}

// クリップボードコピー
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('クリップボードにコピーしました', 'success');
        }).catch(err => {
            console.error('Copy failed:', err);
            fallbackCopyTextToClipboard(text);
        });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

// フォールバックコピー
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showNotification('クリップボードにコピーしました', 'success');
        } else {
            showNotification('コピーに失敗しました', 'error');
        }
    } catch (err) {
        showNotification('コピーに失敗しました', 'error');
    }
    
    document.body.removeChild(textArea);
}

// HTMLエスケープ
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

// 結果へのスクロール
function scrollToResult(element) {
    setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// 既存結果の削除
function removeExistingResults(section) {
    const existingResults = section.querySelectorAll('.result-card, .transcript-result, .analysis-result');
    existingResults.forEach(result => result.remove());
}

// ===== API設定機能 =====
function showApiModal() {
    const modal = document.getElementById('apiModal');
    if (modal) modal.classList.add('active');
    
    const input = document.getElementById('openaiApiKey');
    if (input && ApiKeyManager.get()) {
        const key = ApiKeyManager.get();
        input.value = key.substring(0, 7) + '...';
        input.setAttribute('data-has-key', 'true');
    }
    
    showApiStatus('', '');
    
    const testBtn = document.getElementById('testBtn');
    const saveBtn = document.getElementById('saveBtn');
    
    if (testBtn) testBtn.disabled = false;
    if (saveBtn) saveBtn.disabled = !ApiKeyManager.isValid();
    
    if (input) input.focus();
}

function closeApiModal() {
    const modal = document.getElementById('apiModal');
    if (modal) modal.classList.remove('active');
    
    const input = document.getElementById('openaiApiKey');
    if (input) {
        input.value = '';
        input.removeAttribute('data-has-key');
    }
    
    showApiStatus('', '');
    delete window.tempApiKey;
}

function showApiSettings() {
    showApiModal();
}

async function testApiKey() {
    const input = document.getElementById('openaiApiKey');
    const testBtn = document.getElementById('testBtn');
    const saveBtn = document.getElementById('saveBtn');
    
    if (!input || !testBtn || !saveBtn) return;
    
    let keyValue = input.value.trim();
    
    if (input.getAttribute('data-has-key') === 'true' && keyValue.includes('...')) {
        keyValue = ApiKeyManager.get();
    }

    if (!keyValue) {
        showApiStatus('APIキーを入力してください', 'error');
        return;
    }

    if (!keyValue.startsWith('sk-')) {
        showApiStatus('有効なOpenAI APIキーを入力してください（sk-で始まる）', 'error');
        return;
    }

    testBtn.disabled = true;
    testBtn.textContent = '🔄 テスト中...';
    showApiStatus('APIキーをテスト中...', 'testing');

    try {
        const result = await ApiKeyManager.test(keyValue);
        
        if (result.success) {
            showApiStatus('✅ APIキーが正常に動作しています！', 'success');
            saveBtn.disabled = false;
            window.tempApiKey = result.key;
        }
        
    } catch (error) {
        console.error('APIキーテストエラー:', error);
        showApiStatus(`❌ ${error.message}`, 'error');
        saveBtn.disabled = true;
        delete window.tempApiKey;
        
    } finally {
        testBtn.disabled = false;
        testBtn.textContent = '🔍 接続テスト';
    }
}

function saveApiKey() {
    const input = document.getElementById('openaiApiKey');
    if (!input) return;
    
    let keyValue = input.value.trim();
    
    if (input.getAttribute('data-has-key') === 'true' && keyValue.includes('...')) {
        keyValue = ApiKeyManager.get();
    }

    if (window.tempApiKey && window.tempApiKey !== keyValue) {
        keyValue = window.tempApiKey;
    }

    if (!keyValue || !keyValue.startsWith('sk-')) {
        showNotification('有効なAPIキーを入力してください', 'error');
        return;
    }

    try {
        const saved = ApiKeyManager.set(keyValue);
        
        if (saved) {
            closeApiModal();
            showNotification('🎉 APIキーが保存されました！すべての機能が利用可能です', 'success');
            delete window.tempApiKey;
        } else {
            throw new Error('保存処理に失敗しました');
        }
        
    } catch (error) {
        console.error('❌ APIキー保存エラー:', error);
        showNotification('APIキーの保存に失敗しました: ' + error.message, 'error');
    }
}

function skipApiSetup() {
    closeApiModal();
    showNotification('📱 オフラインモードで開始しました。後で設定メニューからAPIキーを設定できます', 'info');
}

function showApiStatus(message, type) {
    const statusDiv = document.getElementById('apiStatus');
    if (statusDiv) {
        if (message) {
            statusDiv.style.display = 'block';
            statusDiv.className = `api-status ${type}`;
            statusDiv.textContent = message;
        } else {
            statusDiv.style.display = 'none';
        }
    }
}

// ===== ファイル処理ユーティリティ =====
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// ===== 履歴管理機能 =====
function toggleHistoryPanel() {
    const panel = document.getElementById('historyPanel');
    if (panel) {
        // displayプロパティで制御
        if (panel.style.display === 'none' || !panel.style.display) {
            panel.style.display = 'block';
            panel.classList.add('active');
            loadHistoryPanel();
        } else {
            panel.style.display = 'none';
            panel.classList.remove('active');
        }
    }
}

function loadHistoryPanel() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    
    historyList.innerHTML = '';
    
    const chatHistory = chatHistoryManager.getAll().slice(0, 10);
    if (chatHistory.length > 0) {
        const chatSection = document.createElement('div');
        chatSection.innerHTML = '<h4>💬 最近のチャット</h4>';
        chatHistory.forEach(item => {
            const historyItem = createHistoryItem(item, 'chat');
            chatSection.appendChild(historyItem);
        });
        historyList.appendChild(chatSection);
    }
    
    const analysisHistory = analysisHistoryManager.getAll().slice(0, 10);
    if (analysisHistory.length > 0) {
        const analysisSection = document.createElement('div');
        analysisSection.innerHTML = '<h4>🔍 最近の解析</h4>';
        analysisHistory.forEach(item => {
            const historyItem = createHistoryItem(item, 'analysis');
            analysisSection.appendChild(historyItem);
        });
        historyList.appendChild(analysisSection);
    }
    
    const transcriptHistory = transcriptHistoryManager.getAll().slice(0, 10);
    if (transcriptHistory.length > 0) {
        const transcriptSection = document.createElement('div');
        transcriptSection.innerHTML = '<h4>🎵 最近の文字起こし</h4>';
        transcriptHistory.forEach(item => {
            const historyItem = createHistoryItem(item, 'transcript');
            transcriptSection.appendChild(historyItem);
        });
        historyList.appendChild(transcriptSection);
    }
    
    if (historyList.children.length === 0) {
        historyList.innerHTML = '<p>履歴がありません</p>';
    }
}

function createHistoryItem(item, type) {
    const div = document.createElement('div');
    div.className = 'history-item';
    
    const date = new Date(item.timestamp).toLocaleString('ja-JP');
    let title = '';
    let description = '';
    
    switch (type) {
        case 'chat':
            title = item.message ? item.message.substring(0, 30) + '...' : 'チャット';
            description = date;
            break;
        case 'analysis':
            title = item.fileName || '画像解析';
            description = `${item.mode} - ${date}`;
            break;
        case 'transcript':
            title = item.fileName || '音声文字起こし';
            description = date;
            break;
    }
    
    div.innerHTML = `
        <div class="history-details">
            <div class="history-title">${title}</div>
            <div class="history-meta">${description}</div>
        </div>
    `;
    
    return div;
}

// ===== エクスポート機能 =====
function showExportMenu(event) {
    event.stopPropagation();
    const menu = document.getElementById('exportMenu');
    if (menu) {
        if (menu.style.display === 'none' || !menu.style.display) {
            menu.style.display = 'block';
            menu.classList.add('active');
        } else {
            menu.style.display = 'none';
            menu.classList.remove('active');
        }
    }
}

function exportResults(format) {
    try {
        let data = {};
        
        data.chat = chatHistoryManager.getAll();
        data.analysis = analysisHistoryManager.getAll();
        data.transcript = transcriptHistoryManager.getAll();
        data.exportDate = new Date().toISOString();
        
        if (format === 'json') {
            const jsonData = JSON.stringify(data, null, 2);
            downloadFile(jsonData, 'hishoai-export.json', 'application/json');
        } else if (format === 'csv') {
            const csvData = convertToCSV(data);
            downloadFile(csvData, 'hishoai-export.csv', 'text/csv');
        }
        
        showNotification('エクスポートが完了しました', 'success');
        
    } catch (error) {
        console.error('Export error:', error);
        showNotification('エクスポートに失敗しました', 'error');
    }
    
    const menu = document.getElementById('exportMenu');
    if (menu) {
        menu.classList.remove('active');
    }
}

function convertToCSV(data) {
    const rows = [];
    rows.push(['Type', 'Date', 'Title', 'Content']);
    
    data.chat.forEach(item => {
        rows.push([
            'Chat',
            new Date(item.timestamp).toLocaleString('ja-JP'),
            item.message ? item.message.substring(0, 50) : '',
            item.response ? item.response.substring(0, 100) : ''
        ]);
    });
    
    data.analysis.forEach(item => {
        rows.push([
            'Analysis',
            new Date(item.timestamp).toLocaleString('ja-JP'),
            item.fileName || '',
            item.result ? item.result.substring(0, 100) : ''
        ]);
    });
    
    data.transcript.forEach(item => {
        rows.push([
            'Transcript',
            new Date(item.timestamp).toLocaleString('ja-JP'),
            item.fileName || '',
            item.transcript ? item.transcript.substring(0, 100) : ''
        ]);
    });
    
    return rows.map(row => 
        row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
}

function downloadFile(data, filename, mimeType) {
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
}

// 現在の結果をクリアする関数
function clearCurrentResults() {
    const currentSection = document.querySelector('.content-section.active');
    if (currentSection) {
        const results = currentSection.querySelectorAll('.result-card, .transcript-result, .analysis-result');
        results.forEach(result => result.remove());
        showNotification('結果をクリアしました', 'success');
    }
}

// clearOfficeChat関数の追加
function clearOfficeChat() {
    if (confirm('Office支援の会話履歴をクリアしますか？')) {
        officeChatHistory = [];
        const container = document.getElementById('officeChatMessages');
        if (container) {
            container.innerHTML = `
                <div class="office-welcome-message">
                    <div class="chat-message assistant">
                        <div class="message-avatar ai-avatar">💼</div>
                        <div class="message-bubble">
                            <p>こんにちは！Office支援AIアシスタントです。</p>
                            <p>Excel、Word、PowerPointのお困りごとをお手伝いします。</p>
                            <p><strong>💡 ヒント：</strong>スクリーンショットを貼り付けると、より具体的なアドバイスができます！</p>
                        </div>
                    </div>
                </div>
            `;
        }
        showNotification('Office支援の履歴をクリアしました', 'success');
    }
}

// ===== イベントリスナー設定 =====
function setupEventListeners() {
    document.querySelectorAll('.nav-item[data-tab]').forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    document.addEventListener('click', function(e) {
        if (e.target.closest('.feature-card')) {
            const card = e.target.closest('.feature-card');
            const feature = card.getAttribute('data-feature');
            if (feature) {
                switchTab(feature);
            }
        }
    });

    const apiSettingsBtn = document.getElementById('apiSettingsBtn');
    if (apiSettingsBtn) {
        apiSettingsBtn.addEventListener('click', function() {
            showApiSettings();
        });
    }

    const apiModal = document.getElementById('apiModal');
    if (apiModal) {
        apiModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeApiModal();
            }
        });
    }
    
    document.addEventListener('click', function(e) {
        const exportMenu = document.getElementById('exportMenu');
        if (exportMenu && exportMenu.style.display !== 'none' && 
            !exportMenu.contains(e.target) && 
            !e.target.closest('.nav-item')) {
            exportMenu.style.display = 'none';
            exportMenu.classList.remove('active');
        }
    });
    
    document.addEventListener('apiKeyUpdated', function(e) {
        console.log('📢 APIキー更新通知を受信:', e.detail);
    });
}

// ===== API設定確認関数 =====
function checkApiConfiguration() {
    return ApiKeyManager.isValid();
}

// ===== アプリケーション初期化 =====
function initializeApp() {
    console.log('🚀 HishoAI Enhanced Core 初期化開始...');
    
    ApiKeyManager.init();
    setupEventListeners();
    
    if (ApiKeyManager.isValid()) {
        showNotification(window.SUCCESS_MESSAGES.appStarted, 'success');
    } else {
        setTimeout(() => {
            showApiModal();
        }, 1000);
    }
    
    loadHistoryPanel();
    
    console.log('✅ HishoAI Enhanced Core 初期化完了（買い切り完全版）');
}

// デバッグ用関数
function debug() {
    console.log('🐛 HishoAI Debug Info:');
    console.log('Current Tab:', currentTab);
    console.log('API Configured:', isApiConfigured);
    console.log('Selected Files:', {
        audio: selectedAudioFile?.name,
        image: selectedImageFile?.name,
        pastedImage: !!pastedImageData
    });
    console.log('History Counts:', {
        chat: chatHistoryManager.getAll().length,
        analysis: analysisHistoryManager.getAll().length,
        transcript: transcriptHistoryManager.getAll().length
    });
    
    const apiDebug = ApiKeyManager.debug();
    console.log('API Key Debug:', apiDebug);
    
    console.log('Global Variables:', {
        OPENAI_API_KEY: window.OPENAI_API_KEY ? 'Set' : 'Not set',
        DEFAULT_MODEL: typeof window.DEFAULT_MODEL !== 'undefined' ? window.DEFAULT_MODEL : 'Not found',
        API_CONFIG: typeof window.API_CONFIG !== 'undefined' ? window.API_CONFIG : 'Not found'
    });
}

// グローバルからアクセス可能にする
window.ApiKeyManager = ApiKeyManager;
window.debug = debug;
window.chatHistoryManager = chatHistoryManager;
window.analysisHistoryManager = analysisHistoryManager;
window.transcriptHistoryManager = transcriptHistoryManager;
window.showNotification = showNotification;
window.callOpenAIAPI = callOpenAIAPI;
window.callVisionAPI = callVisionAPI;
window.callWhisperAPI = callWhisperAPI;

// 翻訳専用クリア関数を追加
window.clearTranslationResults = function() {
    try {
        // 入力テキストをクリア
        const translateInput = document.getElementById('translateInput');
        if (translateInput) {
            translateInput.value = '';
            // 自動サイズ調整をリセット
            translateInput.style.height = 'auto';
            translateInput.style.height = '150px';
        }
        
        // リアルタイム翻訳を停止
        if (window.HishoAI && window.HishoAI.Translation) {
            const Translation = window.HishoAI.Translation;
            if (Translation.realtimeEnabled && Translation.currentLanguage) {
                Translation.toggleRealtime(Translation.currentLanguage);
            }
            
            // 翻訳結果をクリア
            Translation.clearRealtimeResult();
            const translateSection = document.getElementById('translateSection');
            if (translateSection) {
                Translation.removeExistingResults(translateSection);
            }
            
            // ボタンを元に戻す
            Translation.restoreButtonsFromRealtime();
        }
        
        console.log('✅ 翻訳内容をクリアしました');
        showNotification('翻訳内容をクリアしました', 'success');
        
    } catch (error) {
        console.error('❌ 翻訳クリア処理エラー:', error);
        showNotification('クリア処理でエラーが発生しました', 'error');
    }
};