// ===================================================================
// HishoAI Enhanced - Office Support System（バブルUI版）
// Office支援機能（Word・Excel・PowerPoint）タブ切替 + バブルチャット
// 応答モード差別化対応：手順説明 vs かんたん説明（箇条書き・短文）
// JS直埋め対応版 - データとロジックを分離
// ===================================================================

// グローバル変数の初期化
if (typeof window.officeImageData === 'undefined') {
    window.officeImageData = null;
}
if (typeof window.officeMessages === 'undefined') {
    window.officeMessages = [];
}
if (typeof window.currentOfficeMode === 'undefined') {
    window.currentOfficeMode = 'word';
}
if (typeof window.officeContextByMode === 'undefined') {
    window.officeContextByMode = {
        word: [],
        excel: [],
        powerpoint: []
    };
}
if (typeof window.officeResponseMode === 'undefined') {
    window.officeResponseMode = 'step'; // 'step', 'simple'
}

// ===== JS直埋めデータベース読み込み機能 =====
function loadOfficeSamples() {
    try {
        console.log('📁 Office質問データベースを確認中...');
        
        // window.officeSamplesDatabase が既に読み込まれているかチェック
        if (typeof window.officeSamplesDatabase !== 'undefined' && window.officeSamplesDatabase) {
            console.log('✅ Office質問データベース直接参照完了');
            
            // データ統計を計算
            const stats = calculateSamplesStats(window.officeSamplesDatabase);
            console.log(`📊 統計: Word:${stats.word}問, Excel:${stats.excel}問, PowerPoint:${stats.powerpoint}問 (合計:${stats.total}問)`);
            
            // 読み込み完了イベントを発火
            if (typeof window.onOfficeSamplesLoaded === 'function') {
                window.onOfficeSamplesLoaded(window.officeSamplesDatabase);
            }
            
            return window.officeSamplesDatabase;
        } else {
            // データベースがまだ読み込まれていない場合は少し待つ
            console.log('⏳ データベース読み込み待機中...');
            setTimeout(() => {
                loadOfficeSamples();
            }, 100);
            return null;
        }
        
    } catch (error) {
        console.error('❌ Office質問データベース読み込みエラー:', error);
        
        // フォールバック用の最小データセット
        const fallbackData = createFallbackData();
        window.officeSamplesDatabase = fallbackData;
        
        console.log('⚠️ フォールバックデータを使用します');
        return fallbackData;
    }
}

// データ統計計算
function calculateSamplesStats(data) {
    const stats = { word: 0, excel: 0, powerpoint: 0, total: 0 };
    
    Object.keys(data).forEach(mode => {
        if (data[mode] && typeof data[mode] === 'object') {
            Object.keys(data[mode]).forEach(category => {
                if (data[mode][category] && data[mode][category].samples) {
                    const count = data[mode][category].samples.length;
                    stats[mode] += count;
                    stats.total += count;
                }
            });
        }
    });
    
    return stats;
}

// フォールバック用最小データセット
function createFallbackData() {
    return {
        word: {
            basic: {
                name: "基本操作",
                icon: "📝",
                color: "#2b5797",
                samples: [
                    {
                        id: "wd001",
                        text: "フォントサイズを変更したい",
                        tags: ["フォント", "基本"],
                        difficulty: "初級",
                        popularity: 90
                    }
                ]
            }
        },
        excel: {
            basic: {
                name: "基本操作",
                icon: "📊",
                color: "#217346",
                samples: [
                    {
                        id: "ex001",
                        text: "SUM関数を使いたい",
                        tags: ["SUM", "関数"],
                        difficulty: "初級",
                        popularity: 90
                    }
                ]
            }
        },
        powerpoint: {
            basic: {
                name: "基本操作",
                icon: "📑",
                color: "#d24726",
                samples: [
                    {
                        id: "pp001",
                        text: "スライドデザインを統一したい",
                        tags: ["デザイン", "基本"],
                        difficulty: "初級",
                        popularity: 90
                    }
                ]
            }
        }
    };
}

// ===== 初期化関数 =====
(function() {
    console.log('💼 Office支援モジュール（バブルUI版・JS直埋め対応）読み込み開始...');
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initOfficeModule);
    } else {
        initOfficeModule();
    }
    
    function initOfficeModule() {
        console.log('✅ DOM読み込み完了 - Office機能初期化開始');
        
        // JS直埋めデータベース読み込み開始
        loadOfficeSamples();
        
        // グローバルペーストイベントの設定
        if (!window.officePasteListenerAdded) {
            document.addEventListener('paste', handleOfficePaste);
            window.officePasteListenerAdded = true;
            console.log('✅ グローバルペーストリスナー設定完了');
        }
        
        // Office支援タブの監視
        observeOfficeTab();
        
        // 貼り付けエリアをコンパクトに設定
        const pasteArea = document.getElementById('officePasteArea');
        if (pasteArea) {
            pasteArea.classList.add('compact');
        }
    }
})();

// ===== Office支援タブの監視と初期化 =====
function observeOfficeTab() {
    const navItems = document.querySelectorAll('.nav-item[data-tab]');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (this.getAttribute('data-tab') === 'office') {
                setTimeout(() => {
                    initOfficeUI();
                }, 100);
            }
        });
    });
    
    const officeSection = document.getElementById('officeSection');
    if (officeSection && officeSection.classList.contains('active')) {
        initOfficeUI();
    }
}

// ===== Office UI初期化 =====
function initOfficeUI() {
    console.log('💼 Office UI を初期化中...');
    
    if (window.officeUIInitialized) {
        console.log('⚠️ Office UI は既に初期化済みです');
        return;
    }
    
    // タブ切替の初期化
    initializeOfficeTabs();
    
    // Enterキー送信の設定
    setupOfficeEnterKey();
    
    // ドラッグ&ドロップの設定
    setupOfficeDragDrop();
    
    // ペーストエリアのクリックイベント
    const pasteArea = document.getElementById('officePasteArea');
    if (pasteArea) {
        pasteArea.onclick = function() {
            showNotification('📋 Ctrl+V（またはCmd+V）でスクリーンショットを貼り付けてください', 'info');
        };
        
        // ペーストエリアに直接ペーストイベントを設定
        pasteArea.addEventListener('paste', handleOfficePaste);
        console.log('✅ ペーストエリアにイベントリスナー設定完了');
    }
    
    // 入力エリアにもペーストイベントを設定
    const officeInput = document.getElementById('officeInput');
    if (officeInput) {
        officeInput.addEventListener('paste', handleOfficePaste);
        console.log('✅ 入力エリアにイベントリスナー設定完了');
    }
    
    // 初期モードの設定
    switchOfficeMode('word');
    
    // クイックアクションボタンを追加
    addQuickActionButtons();
    
    window.officeUIInitialized = true;
    console.log('✅ Office UI 初期化完了');
}

// ===== クイックアクションボタン追加 =====
function addQuickActionButtons() {
    const panels = ['word-panel', 'excel-panel', 'powerpoint-panel'];
    
    panels.forEach(panelId => {
        const panel = document.getElementById(panelId);
        if (!panel) return;
        
        // 既存のボタンをチェック
        if (panel.querySelector('.show-quick-actions-btn')) return;
        
        // サンプル表示ボタンの後にクイックアクションボタンを追加
        const sampleToggleSection = panel.querySelector('.sample-toggle-section');
        if (sampleToggleSection) {
            const quickActionBtn = document.createElement('div');
            quickActionBtn.className = 'sample-toggle-section';
            quickActionBtn.innerHTML = `
                <button class="show-quick-actions-btn" onclick="showOfficeQuickActions()">
                    <span>⚡</span>
                    <span>クイックアクション</span>
                </button>
            `;
            
            // サンプル表示ボタンの後に挿入
            sampleToggleSection.parentNode.insertBefore(quickActionBtn, sampleToggleSection.nextSibling);
        }
    });
}

// ===== Officeタブ初期化 =====
function initializeOfficeTabs() {
    const tabs = document.querySelectorAll('.office-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const mode = this.getAttribute('data-office-mode');
            switchOfficeMode(mode);
        });
    });
}

// ===== Officeモード切替 =====
function switchOfficeMode(mode) {
    if (!['word', 'excel', 'powerpoint'].includes(mode)) return;
    
    window.currentOfficeMode = mode;
    
    // タブのアクティブ状態を更新
    document.querySelectorAll('.office-tab').forEach(tab => {
        const isActive = tab.getAttribute('data-office-mode') === mode;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', isActive);
    });
    
    // パネルの表示切替
    document.querySelectorAll('.office-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    document.getElementById(`${mode}-panel`).classList.add('active');
    
    // メッセージ履歴を切り替え
    loadOfficeMessagesForMode(mode);
    
    // クイックアクションが表示中の場合は更新
    if (window.officeQuickActions && window.officeQuickActions.isVisible) {
        window.officeQuickActions.renderSamples();
    }
    
    console.log(`✅ Officeモード切り替え: ${mode}`);
}

// ===== モード別メッセージ履歴の読み込み =====
function loadOfficeMessagesForMode(mode) {
    const messagesContainer = document.getElementById('officeMessages');
    if (!messagesContainer) return;
    
    // 現在の履歴を保存
    if (window.officeMessages.length > 0) {
        window.officeContextByMode[window.currentOfficeMode] = [...window.officeMessages];
    }
    
    // 新しいモードの履歴を読み込み
    window.officeMessages = window.officeContextByMode[mode] || [];
    
    // メッセージエリアをクリア
    messagesContainer.innerHTML = '';
    
    if (window.officeMessages.length === 0) {
        // ウェルカムメッセージを表示
        showOfficeWelcome();
        
        // 履歴がない場合はサンプル表示ボタンを表示
        const toggleSection = document.querySelector(`#${mode}-panel .sample-toggle-section`);
        if (toggleSection) {
            toggleSection.style.display = 'block';
        }
    } else {
        // 既存の履歴を表示
        window.officeMessages.forEach(msg => {
            addOfficeMessage(msg.role, msg.content, msg.imageData, false);
        });
        
        // 履歴がある場合はサンプル表示ボタンを非表示
        const toggleSection = document.querySelector(`#${mode}-panel .sample-toggle-section`);
        if (toggleSection) {
            toggleSection.style.display = 'none';
        }
    }
}

// ===== ウェルカムメッセージ表示 =====
function showOfficeWelcome() {
    const messagesContainer = document.getElementById('officeMessages');
    if (!messagesContainer) return;
    
    const modeIcons = {
        word: '📝',
        excel: '📊',
        powerpoint: '📑'
    };
    
    const modeNames = {
        word: 'Word',
        excel: 'Excel',
        powerpoint: 'PowerPoint'
    };
    
    messagesContainer.innerHTML = `
        <div class="office-welcome">
            <div class="welcome-icon">${modeIcons[window.currentOfficeMode]}</div>
            <h3>${modeNames[window.currentOfficeMode]}支援へようこそ！</h3>
            <p>操作方法やトラブルシューティングなど、${modeNames[window.currentOfficeMode]}に関する質問にお答えします。</p>
            <p style="color: var(--primary); font-size: 0.875rem; margin-top: 0.5rem;">
                💡 スクリーンショットを貼り付けると、より具体的なサポートができます
            </p>
        </div>
    `;
}

// ===== Enterキー送信設定 =====
function setupOfficeEnterKey() {
    const officeInput = document.getElementById('officeInput');
    if (!officeInput) {
        console.warn('⚠️ officeInput が見つかりません');
        return;
    }
    
    // 既存のリスナーを削除
    const newInput = officeInput.cloneNode(true);
    officeInput.parentNode.replaceChild(newInput, officeInput);
    
    // 新しいリスナーを追加
    newInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendOfficeMessage();
        }
    });
    
    // 自動リサイズ
    newInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
    
    console.log('✅ Enterキー送信設定完了');
}

// ===== ペーストハンドラー =====
function handleOfficePaste(e) {
    // Office支援セクションがアクティブかチェック
    const officeSection = document.getElementById('officeSection');
    if (!officeSection || !officeSection.classList.contains('active')) {
        console.log('Office支援セクションが非アクティブです');
        return;
    }
    
    console.log('📋 Office支援での貼り付けイベント検出');
    
    // クリップボードデータを取得
    const clipboardData = e.clipboardData || window.clipboardData;
    if (!clipboardData) {
        console.error('クリップボードデータが取得できません');
        return;
    }
    
    const items = clipboardData.items;
    if (!items) {
        console.error('クリップボードアイテムが取得できません');
        return;
    }
    
    console.log(`クリップボードアイテム数: ${items.length}`);
    
    // 画像を探す
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        console.log(`アイテム${i}: type=${item.type}, kind=${item.kind}`);
        
        if (item.type.indexOf('image') === 0) {
            e.preventDefault();
            e.stopPropagation();
            
            const blob = item.getAsFile();
            if (blob) {
                console.log('画像ファイルを処理します');
                processOfficeImage(blob);
                return;
            } else {
                console.error('画像ファイルの取得に失敗しました');
            }
        }
    }
    
    console.log('画像が見つかりませんでした');
}

// ===== ドラッグ&ドロップ設定 =====
function setupOfficeDragDrop() {
    const pasteArea = document.getElementById('officePasteArea');
    if (!pasteArea) return;
    
    pasteArea.ondragover = function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    };
    
    pasteArea.ondragleave = function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
    };
    
    pasteArea.ondrop = function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.indexOf('image') === 0) {
            processOfficeImage(files[0]);
        } else {
            showNotification('❌ 画像ファイルをドロップしてください', 'error');
        }
    };
    
    console.log('✅ ドラッグ&ドロップ設定完了');
}

// ===== 画像処理 =====
function processOfficeImage(file) {
    console.log('📸 Office画像処理開始');
    console.log('ファイル情報:', {
        name: file.name,
        type: file.type,
        size: file.size
    });
    
    if (!file.type.match(/^image\/(png|jpeg|jpg|gif|webp)$/)) {
        showNotification('❌ PNG、JPEG、GIF、WebP形式の画像のみ対応しています', 'error');
        return;
    }
    
    if (file.size > 20 * 1024 * 1024) {
        showNotification('❌ ファイルサイズは20MB以下にしてください', 'error');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(event) {
        window.officeImageData = event.target.result;
        console.log('✅ 画像データ読み込み完了');
        console.log('データURL形式:', window.officeImageData.substring(0, 30));
        
        displayOfficeImagePreview(event.target.result);
        showNotification('✅ 画像が正常に読み込まれました', 'success');
        
        const input = document.getElementById('officeInput');
        if (input) {
            input.focus();
            input.placeholder = '画像について質問してください... (例: このエラーの解決方法は？)';
        }
    };
    
    reader.onerror = function(error) {
        console.error('❌ 画像読み込みエラー:', error);
        showNotification('❌ 画像の読み込みに失敗しました', 'error');
    };
    
    reader.readAsDataURL(file);
}

// ===== 画像プレビュー表示 =====
function displayOfficeImagePreview(dataUrl) {
    const previewArea = document.getElementById('officeImagePreviewArea');
    const previewImg = document.getElementById('officePreviewImg');
    const pasteArea = document.getElementById('officePasteArea');
    
    if (previewArea && previewImg) {
        previewImg.src = dataUrl;
        previewArea.style.display = 'block';
    }
    
    if (pasteArea) {
        pasteArea.style.display = 'none';
    }
}

// ===== プレビュー画像削除 =====
window.removeOfficePreviewImage = function() {
    const previewArea = document.getElementById('officeImagePreviewArea');
    const pasteArea = document.getElementById('officePasteArea');
    
    if (previewArea) {
        previewArea.style.display = 'none';
    }
    
    if (pasteArea) {
        pasteArea.style.display = 'block';
    }
    
    window.officeImageData = null;
    console.log('🗑️ プレビュー画像を削除しました');
};

// ===== Officeメッセージ送信（ストリーミング対応版） =====
window.sendOfficeMessage = async function() {
    console.log('📤 Officeメッセージ送信開始（ストリーミング）');
    
    const input = document.getElementById('officeInput');
    if (!input) return;
    
    const message = input.value.trim();
    const hasImage = window.officeImageData !== null;
    
    if (!message && !hasImage) {
        showNotification('❌ 質問を入力するか、画像を貼り付けてください', 'error');
        return;
    }
    
    // 初回メッセージかチェック
    const isFirstMessage = window.officeContextByMode[window.currentOfficeMode].length === 0;
    
    // 初回メッセージの場合、サンプル関連要素をすべて非表示にする
    if (isFirstMessage) {
        // サンプル表示ボタンのセクションを非表示
        const toggleSection = document.querySelector(`#${window.currentOfficeMode}-panel .sample-toggle-section`);
        if (toggleSection) {
            toggleSection.style.display = 'none';
            console.log(`✅ ${window.currentOfficeMode} サンプル表示ボタンを非表示にしました`);
        }
        
        // サンプルカードも非表示（既に表示されている場合）
        const sampleCard = document.getElementById(`${window.currentOfficeMode}SampleCard`);
        if (sampleCard) {
            if (sampleCard.classList.contains('show')) {
                // アニメーション付きで非表示
                sampleCard.classList.add('hiding');
                sampleCard.classList.remove('show');
                
                setTimeout(() => {
                    sampleCard.style.display = 'none';
                    sampleCard.classList.remove('hiding');
                }, 400);
            } else {
                // 既に非表示の場合は即座に非表示を確定
                sampleCard.style.display = 'none';
            }
            
            // 状態を更新
            if (window.officeSampleStates) {
                window.officeSampleStates[window.currentOfficeMode] = false;
            }
            
            console.log(`✅ ${window.currentOfficeMode} サンプルカードを非表示にしました`);
        }
    }
    
    // ユーザーメッセージを追加
    addOfficeMessage('user', message, window.officeImageData);
    
    // 入力をクリア
    input.value = '';
    input.style.height = 'auto';
    
    // ボタンを無効化＆キャンセルボタンを追加
    const sendBtn = document.getElementById('officeSendBtn');
    if (sendBtn) {
        sendBtn.disabled = true;
        
        // キャンセルボタンを追加
        const cancelBtn = document.createElement('button');
        cancelBtn.id = 'officeCancelBtn';
        cancelBtn.className = 'input-action-btn cancel-btn';
        cancelBtn.title = 'キャンセル';
        cancelBtn.onclick = cancelOfficeStream;
        cancelBtn.innerHTML = '<span class="cancel-icon">⏹️</span>';
        sendBtn.parentNode.insertBefore(cancelBtn, sendBtn.nextSibling);
    }
    
    // 空のアシスタントメッセージバブルを作成（ストリーミング用）
    const streamingMessageId = createOfficeStreamingMessage();
    
    try {
        // APIキーチェック
        if (!OPENAI_API_KEY || OPENAI_API_KEY === '') {
            throw new Error('APIキーが設定されていません');
        }
        
        // メッセージの構築
        const messages = buildOfficeMessages(message, hasImage);
        
        // ストリーミングAPI呼び出し
        await callOpenAIAPIStreaming(
            messages,
            hasImage,
            // onChunk: 新しい文字が来るたびに呼ばれる
            (chunk, fullResponse) => {
                updateOfficeStreamingMessage(streamingMessageId, fullResponse);
            },
            // onComplete: ストリーミング完了時
            (fullResponse) => {
                console.log('✅ ストリーミング完了');
                finalizeOfficeStreamingMessage(streamingMessageId, fullResponse);
                
                // 画像をクリア
                if (hasImage) {
                    removeOfficePreviewImage();
                }
                
                // 履歴に追加
                window.officeMessages.push({
                    role: 'user',
                    content: message,
                    imageData: hasImage ? window.officeImageData : null,
                    timestamp: new Date().toISOString()
                });
                window.officeMessages.push({
                    role: 'assistant',
                    content: fullResponse,
                    timestamp: new Date().toISOString()
                });
                
                // モード別履歴を更新
                window.officeContextByMode[window.currentOfficeMode] = [...window.officeMessages];
                
                showNotification('✅ 応答完了', 'success');
            },
            // onError: エラー時
            (error) => {
                console.error('❌ ストリーミングエラー:', error);
                removeOfficeStreamingMessage(streamingMessageId);
                
                let errorMessage = 'エラーが発生しました。';
                
                if (error.message.includes('APIキー')) {
                    errorMessage = '❌ APIキーが設定されていません。設定画面からOpenAI APIキーを設定してください。';
                } else if (error.message.includes('キャンセル')) {
                    errorMessage = '⏹️ 応答がキャンセルされました。';
                } else {
                    errorMessage = `❌ ${error.message}`;
                }
                
                addOfficeMessage('assistant', errorMessage);
                
                // APIキー未設定の場合はサンプル応答も表示
                if (!window.OPENAI_API_KEY) {
                    setTimeout(() => {
                        const sampleResponse = generateOfficeSampleResponse(message, hasImage);
                        addOfficeMessage('assistant', `💡 サンプル応答：\n\n${sampleResponse}`);
                    }, 500);
                }
            }
        );
        
    } catch (error) {
        console.error('❌ エラー:', error);
        removeOfficeStreamingMessage(streamingMessageId);
        
        let errorMessage = 'エラーが発生しました。';
        
        if (error.message.includes('APIキー')) {
            errorMessage = '❌ APIキーが設定されていません。設定画面からOpenAI APIキーを設定してください。';
        } else {
            errorMessage = `❌ ${error.message}`;
        }
        
        addOfficeMessage('assistant', errorMessage);
        
        // APIキー未設定の場合はサンプル応答も表示
        if (!window.OPENAI_API_KEY) {
            setTimeout(() => {
                const sampleResponse = generateOfficeSampleResponse(message, hasImage);
                addOfficeMessage('assistant', `💡 サンプル応答：\n\n${sampleResponse}`);
            }, 500);
        }
        
    } finally {
        // ボタンを再有効化＆キャンセルボタンを削除
        if (sendBtn) sendBtn.disabled = false;
        const cancelBtn = document.getElementById('officeCancelBtn');
        if (cancelBtn) cancelBtn.remove();
    }
};

// ===== Officeメッセージ構築（応答モード差別化強化版） =====
function buildOfficeMessages(message, hasImage) {
    const messages = [];
    
    const modePrompts = {
        word: 'あなたはMicrosoft Wordの世界最高峰の専門家です。VBA、アドイン開発、高度なマクロ、カスタムリボン、XMLマークアップ、差し込み印刷の複雑な制御、スタイルシートの完全制御、フィールドコードの高度な活用、すべてを知り尽くしています。',
        excel: 'あなたはMicrosoft Excelの神レベルの専門家です。Power Query、Power Pivot、DAX関数、配列数式、LAMBDA関数、動的配列、VBA、Office Scripts、複雑なピボットテーブル、高度な条件付き書式、カスタム関数作成、データモデル構築、すべてを完璧に使いこなします。',
        powerpoint: 'あなたはMicrosoft PowerPointの最高峰の専門家です。VBA、カスタムアニメーション、スライドマスターの完全制御、高度なトリガー設定、SVGアニメーション、埋め込みオブジェクト制御、プレゼンテーション自動化、アクセシビリティ最適化、すべてを極めています。'
    };
    
    // 大幅改善された応答モードプロンプト（明確な差別化版）
    const responsePrompts = {
        step: `
**重要指示：質問を正確に理解してから詳しい手順で回答すること**

回答スタイル：
- 自然で親しみやすい標準語の口調
- 「なるほど、〇〇ということですね！そしたら、こんな方法はいかがでしょう？」のような導入
- 実際に使える具体的な手順を、①②③の番号付きで
- 各手順内で「✅ やり方：」として詳細な操作を記載
- 「💡ポイント：」で注意点や追加のコツを説明
- ユーザーが本当に求めている機能・操作を的確に把握する

例：
「なるほど、B列の中からランダムに5人選んで、C列に出したいということですね！
そしたら、こんな方法はいかがでしょう？
① B列に名前がずらっと並んでいる前提で、まずその範囲（例：B2〜B100）を指定
② その中から5人をランダムに選ぶには、Excelなら「RAND関数」と「並べ替え」機能です！
✅ やり方：
1. C列の横（たとえばD列）に =RAND() を入れて、B列と一緒にコピー
2. B列とD列を一緒に選んで、ランダム列で並べ替え（昇順）
3. 並び替えた上位5人をC列にコピーすればOK！
💡ポイント：
・元の順番は壊れてしまうので、コピー前に別シートに複製しておくのもおすすめです
・毎回並べ替えると5人が変わるので、値貼り付けで固定するのも良いですね」`,
        
        simple: `
**重要指示：質問を正確に理解してから箇条書きで簡潔に回答すること**

回答スタイル：
- 箇条書きメイン（• で始める）
- 1行1アクション
- 専門用語は必要最小限
- 文字数を大幅削減（目安：200文字以内）
- 「サクッと解決！」の雰囲気

例：
「B列からランダム5人選択ですね！
• B列の隣にRAND関数
• 一緒に並べ替え（昇順）
• 上位5件をコピー
• 完了！」

必須ルール：
- 箇条書き以外の長文は禁止
- 説明は最小限
- 操作手順のみ記載
- 理由説明は不要`
    };
    
    // システムメッセージ
    messages.push({
        role: 'system',
        content: `${modePrompts[currentOfficeMode]}

**最重要指示：ユーザーの質問を正確に理解し、最適な機能・方法を提案すること**

質問理解のポイント：
- 「〜したい」「〜する方法」という表現に注目
- どの列・範囲・機能について聞いているかを正確に把握
- 目的に応じて最適な機能を選択（関数、機能、操作方法など）
- 質問と無関係な基本操作は説明しない

機能選択の指針：
- **Excel高度機能**: LAMBDA, LET, XLOOKUP, FILTER, SORT, UNIQUE, SEQUENCE, RANDARRAY, Power Query, Power Pivot, DAX, 動的配列数式, 配列関数の組み合わせ
- **Word高度機能**: スタイルセット完全制御, フィールドコード活用, VBA文書自動化, 差し込み印刷高度制御, カスタムXMLパーツ, コンテンツコントロール
- **PowerPoint高度機能**: スライドマスター完全制御, VBAアニメーション, トリガーベースインタラクション, 埋め込みオブジェクト制御, カスタムショー
- **VBA/マクロ**: 全アプリケーションでの自動化、カスタムリボン、イベントドリブン処理
- **Office Scripts**: クラウド対応自動化ソリューション
- **Power Platform連携**: Power Automate, Power Apps, Power BI統合

${responsePrompts[window.officeResponseMode]}

画像が提供された場合：
- 画像の内容を詳しく分析する
- 画面に表示されているエラーメッセージ、UI要素、状態を特定する
- 問題点を特定し、現在の応答モードに従って回答
- 具体的な解決策を提示する

常にOffice神レベルの知識と経験を活かし、最も効率的で高度なソリューションを提供してください。基本的な操作ではなく、プロが実際に使う高度なテクニックを中心に回答してください。日本語で回答。`
    });
    
    // 会話履歴を追加（最新5件まで）
    const recentHistory = window.officeMessages.slice(-10);
    recentHistory.forEach(item => {
        if (item.role === 'user') {
            messages.push({ role: 'user', content: item.content || '' });
        } else if (item.role === 'assistant') {
            messages.push({ role: 'assistant', content: item.content });
        }
    });
    
    // 現在の質問を追加
    if (hasImage && window.officeImageData) {
        console.log('🖼️ 画像付きメッセージを構築中...');
        console.log('画像データの先頭:', window.officeImageData.substring(0, 50));
        
        const content = [
            {
                type: 'text',
                text: message || 'この画面について説明し、操作方法や解決策を教えてください。'
            },
            {
                type: 'image_url',
                image_url: {
                    url: window.officeImageData,
                    detail: 'high'
                }
            }
        ];
        
        messages.push({
            role: 'user',
            content: content
        });
        
        console.log('✅ 画像付きメッセージ構築完了');
    } else {
        messages.push({
            role: 'user',
            content: message
        });
    }
    
    return messages;
}

// ===== メッセージ追加（バブルUI） =====
function addOfficeMessage(role, content, imageData = null, saveToHistory = true) {
    const container = document.getElementById('officeMessages');
    if (!container) return;
    
    // ウェルカムメッセージを削除
    const welcome = container.querySelector('.office-welcome');
    if (welcome) welcome.remove();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `office-message ${role} ${window.currentOfficeMode}-mode`;
    
    const avatarIcons = {
        word: '📝',
        excel: '📊',
        powerpoint: '📑'
    };
    
    const avatarIcon = role === 'user' ? '👤' : avatarIcons[window.currentOfficeMode];
    
    let imageHtml = '';
    if (imageData && role === 'user') {
        imageHtml = `<img src="${imageData}" style="max-width: 300px; max-height: 200px; border-radius: 8px; margin-bottom: 0.5rem; display: block; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">`;
    }
    
    messageDiv.innerHTML = `
        <div class="office-message-avatar">
            ${avatarIcon}
        </div>
        <div class="office-message-content">
            ${imageHtml}
            <div class="office-message-bubble">
                ${formatOfficeContent(content)}
            </div>
            <div class="office-message-actions">
                <button class="office-message-action-btn" onclick="copyOfficeMessage(this)" title="コピー">
                    📋
                </button>
                ${role === 'assistant' ? `<button class="office-message-action-btn" onclick="regenerateOfficeMessage(this)" title="再生成">
                    🔄
                </button>` : ''}
            </div>
        </div>
    `;
    
    container.appendChild(messageDiv);
    
    // 自動スクロール
    if (role === 'assistant') {
        setTimeout(() => {
            messageDiv.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start',
                inline: 'nearest'
            });
        }, 100);
    } else {
        container.scrollTop = container.scrollHeight;
    }
}

// ===== ストリーミング専用メッセージ処理関数 =====

// 空のストリーミングメッセージを作成
function createOfficeStreamingMessage() {
    const container = document.getElementById('officeMessages');
    if (!container) return null;
    
    // ウェルカムメッセージを削除
    const welcome = container.querySelector('.office-welcome');
    if (welcome) welcome.remove();
    
    const messageId = `streaming-${Date.now()}`;
    const messageDiv = document.createElement('div');
    messageDiv.className = `office-message assistant ${window.currentOfficeMode}-mode streaming`;
    messageDiv.setAttribute('data-streaming-id', messageId);
    
    const avatarIcons = {
        word: '📝',
        excel: '📊',
        powerpoint: '📑'
    };
    
    const avatarIcon = avatarIcons[window.currentOfficeMode];
    
    messageDiv.innerHTML = `
        <div class="office-message-avatar">${avatarIcon}</div>
        <div class="office-message-content">
            <div class="office-message-bubble">
                <div class="streaming-content"></div>
                <div class="streaming-cursor">▋</div>
            </div>
            <div class="office-message-actions">
                <button class="office-message-action-btn" onclick="copyOfficeMessage(this)" title="コピー">
                    📋
                </button>
                <button class="office-message-action-btn" onclick="regenerateOfficeMessage(this)" title="再生成">
                    🔄
                </button>
            </div>
        </div>
    `;
    
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
    
    console.log(`📨 ストリーミングメッセージ作成: ${messageId}`);
    return messageId;
}

// ストリーミングメッセージを更新
function updateOfficeStreamingMessage(messageId, content) {
    if (!messageId) return;
    
    const messageDiv = document.querySelector(`[data-streaming-id="${messageId}"]`);
    if (!messageDiv) return;
    
    const contentDiv = messageDiv.querySelector('.streaming-content');
    if (contentDiv) {
        contentDiv.innerHTML = formatOfficeContent(content);
    }
    
    // 自動スクロール（最下部近くにいる場合のみ）
    const container = document.getElementById('officeMessages');
    if (container) {
        const isNearBottom = container.scrollTop + container.clientHeight > container.scrollHeight - 100;
        if (isNearBottom) {
            container.scrollTop = container.scrollHeight;
        }
    }
}

// ストリーミングメッセージを完了状態にする
function finalizeOfficeStreamingMessage(messageId, finalContent) {
    if (!messageId) return;
    
    const messageDiv = document.querySelector(`[data-streaming-id="${messageId}"]`);
    if (!messageDiv) return;
    
    // ストリーミング関連のクラスとカーソルを削除
    messageDiv.classList.remove('streaming');
    messageDiv.removeAttribute('data-streaming-id');
    
    const contentDiv = messageDiv.querySelector('.streaming-content');
    const cursorDiv = messageDiv.querySelector('.streaming-cursor');
    
    if (contentDiv) {
        contentDiv.innerHTML = formatOfficeContent(finalContent);
        contentDiv.className = ''; // streaming-content クラスを削除
    }
    
    if (cursorDiv) {
        cursorDiv.remove();
    }
    
    // メッセージバブル全体を最終状態に更新
    const bubbleDiv = messageDiv.querySelector('.office-message-bubble');
    if (bubbleDiv) {
        bubbleDiv.innerHTML = formatOfficeContent(finalContent);
        
        // アクションボタンを再追加
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'office-message-actions';
        actionsDiv.innerHTML = `
            <button class="office-message-action-btn" onclick="copyOfficeMessage(this)" title="コピー">
                📋
            </button>
            <button class="office-message-action-btn" onclick="regenerateOfficeMessage(this)" title="再生成">
                🔄
            </button>
        `;
        messageDiv.querySelector('.office-message-content').appendChild(actionsDiv);
    }
    
    // 最終スクロール
    setTimeout(() => {
        messageDiv.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
        });
    }, 100);
    
    console.log(`✅ ストリーミングメッセージ完了: ${messageId}`);
}

// ストリーミングメッセージを削除（エラー時）
function removeOfficeStreamingMessage(messageId) {
    if (!messageId) return;
    
    const messageDiv = document.querySelector(`[data-streaming-id="${messageId}"]`);
    if (messageDiv) {
        messageDiv.remove();
        console.log(`🗑️ ストリーミングメッセージ削除: ${messageId}`);
    }
}

// ===== サンプル機能 =====
window.loadWordSample = function() {
    const sampleMessage = '大量の文書で差し込み印刷を効率化したいです。';
    document.getElementById('officeInput').value = sampleMessage;
    sendOfficeMessage();
};

window.loadExcelSample = function() {
    const sampleMessage = '複雑な条件でデータを抽出・集計する最適な方法は？';
    document.getElementById('officeInput').value = sampleMessage;
    sendOfficeMessage();
};

window.loadPowerPointSample = function() {
    const sampleMessage = 'プレゼンテーションにインタラクティブな要素を追加したいです。';
    document.getElementById('officeInput').value = sampleMessage;
    sendOfficeMessage();
};

// ===== ユーティリティ関数 =====
function formatOfficeContent(text) {
    if (!text) return '';
    
    // HTMLエスケープ
    text = text.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;')
               .replace(/"/g, '&quot;')
               .replace(/'/g, '&#039;');
    
    // マークダウン風フォーマット（Chatと同じ）
    text = text.replace(/^### (.*?)$/gm, '<h4>$1</h4>');
    text = text.replace(/^## (.*?)$/gm, '<h3>$1</h3>');
    text = text.replace(/^# (.*?)$/gm, '<h2>$1</h2>');
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    text = text.replace(/`(.*?)`/g, '<code>$1</code>');
    text = text.replace(/^\* (.*?)$/gm, '<li>$1</li>');
    text = text.replace(/(<li>.*?<\/li>\n?)+/g, '<ul>$&</ul>');
    text = text.replace(/^\d+\. (.*?)$/gm, '<li>$1</li>');
    text = text.replace(/\n/g, '<br>');
    
    return text;
}

// ===== メッセージコピー =====
window.copyOfficeMessage = function(button) {
    const messageContent = button.closest('.office-message').querySelector('.office-message-bubble');
    const text = messageContent.textContent || messageContent.innerText;
    copyToClipboard(text);
};

// ===== メッセージ再生成 =====
window.regenerateOfficeMessage = async function(button) {
    const messageElement = button.closest('.office-message');
    if (!messageElement || !messageElement.classList.contains('assistant')) return;
    
    let userMessage = null;
    let prevElement = messageElement.previousElementSibling;
    
    while (prevElement) {
        if (prevElement.classList.contains('office-message') && prevElement.classList.contains('user')) {
            const messageContent = prevElement.querySelector('.office-message-bubble');
            userMessage = messageContent.textContent || messageContent.innerText;
            break;
        }
        prevElement = prevElement.previousElementSibling;
    }
    
    if (!userMessage) {
        showNotification('前のメッセージが見つかりません', 'error');
        return;
    }
    
    messageElement.remove();
    
    if (window.officeMessages.length >= 2) {
        window.officeMessages = window.officeMessages.slice(0, -2);
    }
    
    const officeInput = document.getElementById('officeInput');
    if (officeInput) {
        officeInput.value = userMessage;
        sendOfficeMessage();
    }
};

// ===== Officeチャットクリア =====
window.clearOfficeChat = function() {
    if (confirm(`${window.currentOfficeMode.toUpperCase()}モードの会話履歴をクリアしますか？`)) {
        window.officeMessages = [];
        window.officeContextByMode[window.currentOfficeMode] = [];
        
        const messagesContainer = document.getElementById('officeMessages');
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
            showOfficeWelcome();
        }
        
        showNotification(`${window.currentOfficeMode.toUpperCase()}モードの履歴をクリアしました`, 'success');
    }
};

// ===== サンプル応答生成（応答モード差別化対応版） =====
function generateOfficeSampleResponse(message, hasImage) {
    const modeResponses = {
        word: {
            step: `📝 **差し込み印刷の効率化ですね！プロレベルのソリューションを提案します**

🚀 **最適解（VBA自動化）：**
Word VBAでデータソース処理を完全自動化
- エラーハンドリング付きバッチ処理
- PDF一括出力機能
- 進行状況表示付きプログレスバー

⚡ **Power Automate連携版：**
1. SharePointリスト→Word差し込み自動実行
2. OneDrive自動保存→メール送信自動化
3. 承認フロー組み込み可能

🔧 **高度なフィールドコード活用：**
{ IF { MERGEFIELD 条件 } = "A" "テキスト1" "テキスト2" }
ネストした条件分岐で複雑な文書制御

💡 **神テク：**
・XMLデータソース利用で階層データ対応
・スタイルセット事前定義で書式統一自動化
・カスタムリボンで操作をワンクリック化`,
            simple: `差し込み印刷効率化ですね！
• データソースを整理
• 差し込みフィールド設定
• 一括処理でPDF出力
• 完了！`
        },
        
        excel: {
            step: `📊 **複雑データ処理ですね！最新の高度機能をフル活用しましょう**

🚀 **最適解（動的配列数式）：**
\`=FILTER(SORT(UNIQUE(データ)),複雑条件)\`
XLOOKUP, FILTER, SORT, UNIQUEの組み合わせで一発処理

⚡ **Power Query版：**
1. 複数データソース統合処理
2. M言語カスタム関数作成
3. 自動更新スケジュール設定

🔧 **DAX + Power Pivot版：**
CALCULATE, SUMX, FILTER組み合わせ
メジャー定義でビジネスロジック実装

💡 **神テク：**
・LAMBDA関数で独自関数定義
・LET関数で計算過程の最適化
・SEQUENCE × FILTER で動的レンジ生成
・Office Scripts でクラウド自動化`,
            simple: `データ抽出・集計ですね！
• FILTER関数で条件指定
• SORT関数で並べ替え
• UNIQUE関数で重複削除
• 完了！`
        },
        
        powerpoint: {
            step: `📑 **インタラクティブ要素の実装ですね！高度なテクニックを駆使しましょう**

🚀 **最適解（VBAトリガー）：**
クリック・ホバーイベントでカスタムアクション
- スライド間の動的データ連携
- リアルタイム計算結果表示
- 条件分岐プレゼンテーション

⚡ **埋め込みオブジェクト版：**
1. Excel埋め込みでライブデータ表示
2. Web埋め込みでリアルタイム情報
3. フォームコントロールでユーザー入力

🔧 **スライドマスター完全制御：**
プレースホルダーのプログラム制御
レイアウト自動切替システム

💡 **神テク：**
・ハイパーリンクアクション活用
・カスタムアニメーション組み合わせ
・SVGアニメーション埋め込み
・アクセシビリティ最適化実装`,
            simple: `インタラクティブ要素追加ですね！
• ハイパーリンクでナビゲーション
• アニメーション効果設定
• トリガーでクリック動作
• 完了！`
        }
    };
    
    const currentMode = window.officeResponseMode || 'step';
    const response = modeResponses[window.currentOfficeMode][currentMode];
    
    if (hasImage) {
        return `📸 **画面を確認しました！**

スクリーンショットの内容に基づいた具体的な解決策：

${response}

**💡 実際のAI解析を使用するには、API設定からOpenAIキーを設定してください。**`;
    }
    
    return response + '\n\n**💡 より詳細な回答をご希望の場合は、APIキーを設定してください。**';
}

// ===== ストリーミング対応変数 =====
let currentStreamController = null;

// ===== OpenAI API ストリーミング呼び出し関数 =====
async function callOpenAIAPIStreaming(messages, hasImage = false, onChunk = null, onComplete = null, onError = null) {
    if (!window.OPENAI_API_KEY || window.OPENAI_API_KEY === '') {
        throw new Error('APIキーが設定されていません');
    }
    
    try {
        // 画像がある場合は必ずgpt-4oを使用（Vision対応モデル）
        let model = window.DEFAULT_MODEL || 'gpt-4o';
        if (hasImage) {
            // Vision APIをサポートするモデルを強制使用
            if (!model.includes('gpt-4') && !model.includes('gpt-4o')) {
                console.warn('⚠️ 画像解析にはgpt-4oが必要です。モデルを自動切り替えします。');
                model = 'gpt-4o';
            }
        }
        
        console.log(`🔄 ストリーミングAPIリクエスト開始`);
        console.log('- モデル:', model);
        console.log('- 画像:', hasImage ? 'あり' : 'なし');
        console.log('- メッセージ数:', messages.length);
        
        const requestBody = {
            model: model,
            messages: messages,
            temperature: window.AI_TEMPERATURE.office || 0.7,
            max_tokens: window.MAX_TOKENS.office || 2000,
            stream: true // ストリーミング有効化
        };
        
        // デバッグ用：リクエスト内容の確認（画像データは除く）
        if (hasImage) {
            console.log('📤 Vision API ストリーミングリクエスト送信中...');
        }
        
        // AbortController for cancellation
        const abortController = new AbortController();
        currentStreamController = abortController;
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.OPENAI_API_KEY}`
            },
            body: JSON.stringify(requestBody),
            signal: abortController.signal
        });
        
        if (!response.ok) {
            const error = await response.json();
            console.error('❌ APIエラー詳細:', error);
            
            // Vision API特有のエラーメッセージ
            if (hasImage && error.error?.message?.includes('model')) {
                throw new Error('画像解析にはgpt-4oモデルが必要です。API設定を確認してください。');
            }
            
            throw new Error(error.error?.message || 'API呼び出しエラー');
        }
        
        // ストリーミング処理
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';
        
        console.log('📡 ストリーミング開始...');
        
        while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
                console.log('✅ ストリーミング完了');
                if (onComplete) onComplete(fullResponse);
                break;
            }
            
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    
                    if (data === '[DONE]') {
                        console.log('🏁 ストリーミング終了信号受信');
                        continue;
                    }
                    
                    try {
                        const parsed = JSON.parse(data);
                        const content = parsed.choices?.[0]?.delta?.content;
                        
                        if (content) {
                            fullResponse += content;
                            if (onChunk) {
                                onChunk(content, fullResponse);
                            }
                        }
                    } catch (parseError) {
                        // JSON parsing error - 無視して続行
                        continue;
                    }
                }
            }
        }
        
        if (hasImage) {
            console.log('🖼️ Vision API ストリーミング解析完了');
        }
        
        return fullResponse;
        
    } catch (error) {
        console.error('❌ OpenAI API ストリーミングエラー:', error);
        
        if (error.name === 'AbortError') {
            console.log('⏹️ ストリーミングがキャンセルされました');
            if (onError) onError(new Error('ストリーミングがキャンセルされました'));
            return '';
        }
        
        // エラーメッセージの改善
        if (error.message.includes('billing')) {
            const billingError = new Error('APIの利用制限に達しました。OpenAIアカウントの請求設定を確認してください。');
            if (onError) onError(billingError);
            throw billingError;
        } else if (error.message.includes('rate')) {
            const rateError = new Error('API利用制限に達しました。しばらく待ってから再試行してください。');
            if (onError) onError(rateError);
            throw rateError;
        }
        
        if (onError) onError(error);
        throw error;
    } finally {
        currentStreamController = null;
    }
}

// ===== ストリーミングキャンセル関数 =====
function cancelOfficeStream() {
    if (currentStreamController) {
        currentStreamController.abort();
        currentStreamController = null;
        console.log('⏹️ Office ストリーミングをキャンセルしました');
        
        // キャンセルボタンを削除
        const cancelBtn = document.getElementById('officeCancelBtn');
        if (cancelBtn) {
            cancelBtn.remove();
        }
        
        // 送信ボタンを再有効化
        const sendBtn = document.getElementById('officeSendBtn');
        if (sendBtn) sendBtn.disabled = false;
        
        showNotification('⏹️ 応答がキャンセルされました', 'info');
    }
}

// 後方互換性のための従来のAPI関数（ストリーミング版を呼び出し）
async function callOpenAIAPI(messages, hasImage = false) {
    return new Promise((resolve, reject) => {
        callOpenAIAPIStreaming(
            messages,
            hasImage,
            null, // onChunk
            (fullResponse) => resolve(fullResponse), // onComplete
            (error) => reject(error) // onError
        );
    });
}

// 通知表示関数の補完
if (typeof window.showNotification === 'undefined') {
    window.showNotification = function(message, type) {
        console.log(`[${type}] ${message}`);
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            animation: slideIn 0.3s ease-out;
        `;
        
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
                <span class="notification-text">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, window.UI_SETTINGS.notificationDuration || 5000);
    };
}

// copyToClipboard関数の補完
if (typeof window.copyToClipboard === 'undefined') {
    window.copyToClipboard = async function(text) {
        try {
            await navigator.clipboard.writeText(text);
            showNotification('✅ クリップボードにコピーしました', 'success');
        } catch (err) {
            console.error('Copy failed:', err);
            showNotification('❌ コピーに失敗しました', 'error');
        }
    };
}

// グローバル変数の確認
if (typeof window.OPENAI_API_KEY === 'undefined') {
    window.OPENAI_API_KEY = '';
}
if (typeof window.DEFAULT_MODEL === 'undefined') {
    window.DEFAULT_MODEL = 'gpt-4o';
}
if (typeof window.AI_TEMPERATURE === 'undefined') {
    window.AI_TEMPERATURE = { office: 0.7 };
}
if (typeof window.MAX_TOKENS === 'undefined') {
    window.MAX_TOKENS = { office: 2000 };
}
if (typeof window.UI_SETTINGS === 'undefined') {
    window.UI_SETTINGS = { notificationDuration: 5000 };
}

// ===== 応答モード切り替え関数（更新版） =====
window.setOfficeResponseMode = function(mode) {
    if (!['step', 'simple'].includes(mode)) return;
    
    window.officeResponseMode = mode;
    
    // ボタンのアクティブ状態を更新
    document.querySelectorAll('.office-mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-response-mode') === mode);
    });
    
    console.log(`✅ Office応答モードを ${mode} に切り替えました`);
    
    // モード名の表示
    const modeNames = {
        step: '手順説明',
        simple: 'かんたん説明'
    };
    
    showNotification(`📝 ${modeNames[mode]}モードに切り替えました`, 'info');
};

// ===================================================================
// Office用クイックアクション機能（JS直埋め対応版）
// Word・Excel・PowerPoint別の実用的な質問集とクリック選択機能
// ===================================================================

// Office用クイックアクション機能（JS直埋め対応版）
class OfficeQuickActions {
    constructor() {
        this.currentFilter = {
            category: 'all',
            difficulty: 'all',
            search: ''
        };
        this.isVisible = false;
        this.currentMode = 'word'; // word, excel, powerpoint
    }

    // クイックアクション表示切り替え
    toggle() {
        this.isVisible = !this.isVisible;
        const existing = document.getElementById('officeQuickActions');
        
        if (this.isVisible) {
            // ① 今アクティブなパネルを取得
            const activePanel = document.querySelector('.office-panel.active');
            
            // ② まだ無い or 他パネルに付いてる場合は作り直す
            if (!existing || !activePanel.contains(existing)) {
                if (existing) existing.remove(); // 他パネルに残ってたヤツを掃除
                this.createInterface(); // アクティブパネルに新規生成
            } else {
                existing.style.display = 'block';
                existing.classList.add('show');
                
                // 既存要素表示後にスクロール
                setTimeout(() => {
                    this.scrollToQuickActions();
                }, 500);
            }
            this.updateCurrentMode();
            this.renderSamples();
        } else {
            if (existing) {
                existing.classList.remove('show');
                setTimeout(() => {
                    existing.style.display = 'none';
                }, 300);
            }
        }
    }

    // 現在のOfficeモードを取得
    updateCurrentMode() {
        this.currentMode = window.currentOfficeMode || 'word';
    }

    // インターフェース作成
    createInterface() {
        const activePanel = document.querySelector('.office-panel.active');
        if (!activePanel) return;

        const container = document.createElement('div');
        container.id = 'officeQuickActions';
        container.className = 'office-quick-actions';
        
        container.innerHTML = `
            <div class="quick-actions-header">
                <div class="quick-actions-title">
                    <span class="quick-actions-icon">⚡</span>
                    <h3 id="quickActionsTitle">Wordクイックアクション</h3>
                    <button class="quick-actions-close" onclick="officeQuickActions.toggle()">×</button>
                </div>
                <div class="quick-actions-filters">
                    <div class="filter-group">
                        <label>カテゴリ:</label>
                        <select id="officeCategoryFilter" onchange="officeQuickActions.updateFilter('category', this.value)">
                            <option value="all">すべて</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>難易度:</label>
                        <select id="officeDifficultyFilter" onchange="officeQuickActions.updateFilter('difficulty', this.value)">
                            <option value="all">すべて</option>
                            <option value="初級">初級</option>
                            <option value="中級">中級</option>
                            <option value="上級">上級</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <input type="text" id="officeSearchInput" placeholder="質問を検索..." 
                               oninput="officeQuickActions.updateFilter('search', this.value)">
                    </div>
                </div>
            </div>
            <div class="quick-actions-content">
                <div id="officeSamplesContainer" class="samples-container"></div>
            </div>
            <div class="quick-actions-stats">
                <span id="officeStatsText">質問を読み込み中...</span>
            </div>
        `;

        // 貼り付けエリアの前に挿入
        const pasteAreaContainer = activePanel.querySelector('.office-paste-area-container');
        if (pasteAreaContainer) {
            activePanel.insertBefore(container, pasteAreaContainer);
        } else {
            activePanel.appendChild(container);
        }

        // アニメーション付きで表示
        setTimeout(() => {
            container.classList.add('show');
            // 表示アニメーション完了後にスクロール
            setTimeout(() => {
                this.scrollToQuickActions();
            }, 400);
        }, 100);
    }

    // フィルター更新
    updateFilter(type, value) {
        this.currentFilter[type] = value;
        this.renderSamples();
    }

    // カテゴリフィルターを更新
    updateCategoryFilter() {
        const categoryFilter = document.getElementById('officeCategoryFilter');
        if (!categoryFilter) return;

        // JS直埋めデータが読み込まれているかチェック
        if (!window.officeSamplesDatabase || !window.officeSamplesDatabase[this.currentMode]) {
            categoryFilter.innerHTML = '<option value="all">データ読み込み中...</option>';
            return;
        }

        const modeData = window.officeSamplesDatabase[this.currentMode];
        categoryFilter.innerHTML = '<option value="all">すべて</option>';
        
        Object.keys(modeData).forEach(categoryKey => {
            const category = modeData[categoryKey];
            const option = document.createElement('option');
            option.value = categoryKey;
            option.textContent = category.name;
            categoryFilter.appendChild(option);
        });
    }

    // タイトル更新
    updateTitle() {
        const title = document.getElementById('quickActionsTitle');
        if (title) {
            const modeNames = {
                word: 'Word',
                excel: 'Excel',
                powerpoint: 'PowerPoint'
            };
            
            let totalCount = 0;
            if (window.officeSamplesDatabase && window.officeSamplesDatabase[this.currentMode]) {
                const modeData = window.officeSamplesDatabase[this.currentMode];
                totalCount = Object.values(modeData)
                    .reduce((sum, category) => sum + (category.samples ? category.samples.length : 0), 0);
            }
            
            title.textContent = `${modeNames[this.currentMode]}クイックアクション（${totalCount}問）`;
        }
    }

    // サンプル表示
    renderSamples() {
        this.updateCurrentMode();
        this.updateTitle();
        this.updateCategoryFilter();

        const container = document.getElementById('officeSamplesContainer');
        if (!container) return;

        // JS直埋めデータが読み込まれているかチェック
        if (!window.officeSamplesDatabase) {
            container.innerHTML = `
                <div class="no-results">
                    <span class="no-results-icon">⏳</span>
                    <p>質問データベースを読み込み中...</p>
                    <small>しばらくお待ちください</small>
                </div>
            `;
            this.updateStats(0);
            return;
        }

        const filteredSamples = this.getFilteredSamples();
        
        if (filteredSamples.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <span class="no-results-icon">🔍</span>
                    <p>条件に一致する質問が見つかりませんでした</p>
                    <small>フィルターを変更してお試しください</small>
                </div>
            `;
            this.updateStats(0);
            return;
        }

        // カテゴリ別にグループ化
        const groupedSamples = {};
        filteredSamples.forEach(sample => {
            if (!groupedSamples[sample.category]) {
                groupedSamples[sample.category] = [];
            }
            groupedSamples[sample.category].push(sample);
        });

        let html = '';
        Object.keys(groupedSamples).forEach(categoryKey => {
            const categoryData = window.officeSamplesDatabase[this.currentMode][categoryKey];
            const samples = groupedSamples[categoryKey];
            
            html += `
                <div class="sample-category" style="--category-color: ${categoryData.color}">
                    <div class="category-header">
                        <span class="category-icon">${categoryData.icon}</span>
                        <h4>${categoryData.name}</h4>
                        <span class="category-count">${samples.length}問</span>
                    </div>
                    <div class="category-samples">
                        ${samples.map(sample => this.createSampleCard(sample)).join('')}
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
        this.updateStats(filteredSamples.length);
    }

    // サンプルカード作成
    createSampleCard(sample) {
        const difficultyClass = sample.difficulty === '初級' ? 'beginner' : 
                               sample.difficulty === '中級' ? 'intermediate' : 'advanced';
        
        return `
            <div class="sample-card ${difficultyClass}" onclick="officeQuickActions.selectSample('${sample.id}')">
                <div class="sample-content">
                    <div class="sample-text">${sample.text}</div>
                    <div class="sample-meta">
                        <span class="sample-difficulty ${difficultyClass}">${sample.difficulty}</span>
                        <span class="sample-popularity">人気度: ${sample.popularity}%</span>
                    </div>
                    <div class="sample-tags">
                        ${sample.tags.map(tag => `<span class="sample-tag">${tag}</span>`).join('')}
                    </div>
                </div>
                <div class="sample-action">
                    <span class="use-button">使用 →</span>
                </div>
            </div>
        `;
    }

    // フィルタリング処理
    getFilteredSamples() {
        if (!window.officeSamplesDatabase || !window.officeSamplesDatabase[this.currentMode]) {
            return [];
        }

        const modeData = window.officeSamplesDatabase[this.currentMode];
        let allSamples = [];
        
        Object.keys(modeData).forEach(categoryKey => {
            const category = modeData[categoryKey];
            if (category.samples) {
                category.samples.forEach(sample => {
                    allSamples.push({
                        ...sample,
                        category: categoryKey,
                        categoryName: category.name
                    });
                });
            }
        });

        return allSamples.filter(sample => {
            // カテゴリフィルター
            if (this.currentFilter.category !== 'all' && sample.category !== this.currentFilter.category) {
                return false;
            }

            // 難易度フィルター
            if (this.currentFilter.difficulty !== 'all' && sample.difficulty !== this.currentFilter.difficulty) {
                return false;
            }

            // 検索フィルター
            if (this.currentFilter.search) {
                const searchTerm = this.currentFilter.search.toLowerCase();
                const textMatch = sample.text.toLowerCase().includes(searchTerm);
                const tagMatch = sample.tags.some(tag => tag.toLowerCase().includes(searchTerm));
                if (!textMatch && !tagMatch) {
                    return false;
                }
            }

            return true;
        }).sort((a, b) => b.popularity - a.popularity); // 人気度順
    }

    // 統計更新
    updateStats(count) {
        const statsText = document.getElementById('officeStatsText');
        if (statsText) {
            let totalCount = 0;
            if (window.officeSamplesDatabase && window.officeSamplesDatabase[this.currentMode]) {
                const modeData = window.officeSamplesDatabase[this.currentMode];
                totalCount = Object.values(modeData)
                    .reduce((sum, category) => sum + (category.samples ? category.samples.length : 0), 0);
            }
            
            const modeName = this.currentMode === 'word' ? 'Word' : 
                            this.currentMode === 'excel' ? 'Excel' : 'PowerPoint';
            statsText.textContent = `${count}個の${modeName}質問を表示中（全${totalCount}個）`;
        }
    }

    // サンプル選択
    selectSample(sampleId) {
        if (!window.officeSamplesDatabase || !window.officeSamplesDatabase[this.currentMode]) {
            showNotification('❌ データがまだ読み込まれていません', 'error');
            return;
        }

        const modeData = window.officeSamplesDatabase[this.currentMode];

        // 現在のモードから質問を検索
        let selectedSample = null;
        for (const category of Object.values(modeData)) {
            if (category.samples) {
                selectedSample = category.samples.find(sample => sample.id === sampleId);
                if (selectedSample) break;
            }
        }

        if (selectedSample) {
            // 入力欄にセット
            const officeInput = document.getElementById('officeInput');
            if (officeInput) {
                officeInput.value = selectedSample.text;
                officeInput.focus();
                
                // 高さ調整
                officeInput.style.height = 'auto';
                officeInput.style.height = Math.min(officeInput.scrollHeight, 120) + 'px';
            }

            // クイックアクションを閉じる
            this.toggle();

            // 通知表示
            if (typeof showNotification === 'function') {
                showNotification(`✅ 質問を入力欄にセットしました: ${selectedSample.text.substring(0, 30)}...`, 'success');
            }
        }
    }

    // クイックアクションまでスクロール
    scrollToQuickActions() {
        const quickActionsElement = document.getElementById('officeQuickActions');
        if (quickActionsElement) {
            quickActionsElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            });
            console.log('📜 クイックアクションまでスクロールしました');
        }
    }
}

// グローバルインスタンス作成（JS直埋め対応版）
window.officeQuickActions = new OfficeQuickActions();

// Office用のクイックアクション表示関数
window.showOfficeQuickActions = function() {
    window.officeQuickActions.toggle();
};

// 後方互換性のため（古い参照）
window.excelQuickActions = window.officeQuickActions;
window.showExcelQuickActions = window.showOfficeQuickActions;

console.log('✅ Office支援モジュール読み込み完了（バブルUI版・JS直埋め対応・応答モード差別化対応・クイックアクション機能搭載・ストリーミングチャット対応）');
console.log('🚀 ストリーミング機能：');
console.log('   • リアルタイム文字表示');
console.log('   • キャンセル機能（⏹️ボタン）');
console.log('   • 高速応答体験');