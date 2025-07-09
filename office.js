// ===================================================================
// HishoAI Enhanced - Office Support System（バブルUI版）
// Office支援機能（Word・Excel・PowerPoint）タブ切替 + バブルチャット
// 応答モード差別化対応：手順説明 vs かんたん説明（箇条書き・短文）
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

// ===== 初期化関数 =====
(function() {
    console.log('💼 Office支援モジュール（バブルUI版）読み込み開始...');
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initOfficeModule);
    } else {
        initOfficeModule();
    }
    
    function initOfficeModule() {
        console.log('✅ DOM読み込み完了 - Office機能初期化開始');
        
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
    
    window.officeUIInitialized = true;
    console.log('✅ Office UI 初期化完了');
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
    
    currentOfficeMode = mode;
    
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
    
    console.log(`✅ Officeモード切り替え: ${mode}`);
}

// ===== モード別メッセージ履歴の読み込み =====
function loadOfficeMessagesForMode(mode) {
    const messagesContainer = document.getElementById('officeMessages');
    if (!messagesContainer) return;
    
    // 現在の履歴を保存
    if (officeMessages.length > 0) {
        officeContextByMode[currentOfficeMode] = [...officeMessages];
    }
    
    // 新しいモードの履歴を読み込み
    officeMessages = officeContextByMode[mode] || [];
    
    // メッセージエリアをクリア
    messagesContainer.innerHTML = '';
    
    if (officeMessages.length === 0) {
        // ウェルカムメッセージを表示
        showOfficeWelcome();
        
        // 履歴がない場合はサンプル表示ボタンを表示
        const toggleSection = document.querySelector(`#${mode}-panel .sample-toggle-section`);
        if (toggleSection) {
            toggleSection.style.display = 'block';
        }
    } else {
        // 既存の履歴を表示
        officeMessages.forEach(msg => {
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
            <div class="welcome-icon">${modeIcons[currentOfficeMode]}</div>
            <h3>${modeNames[currentOfficeMode]}支援へようこそ！</h3>
            <p>操作方法やトラブルシューティングなど、${modeNames[currentOfficeMode]}に関する質問にお答えします。</p>
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

// ===== Officeメッセージ送信 =====
window.sendOfficeMessage = async function() {
    console.log('📤 Officeメッセージ送信開始');
    
    const input = document.getElementById('officeInput');
    if (!input) return;
    
    const message = input.value.trim();
    const hasImage = window.officeImageData !== null;
    
    if (!message && !hasImage) {
        showNotification('❌ 質問を入力するか、画像を貼り付けてください', 'error');
        return;
    }
    
    // 初回メッセージかチェック
    const isFirstMessage = officeContextByMode[currentOfficeMode].length === 0;
    
    // 初回メッセージの場合、サンプル関連要素をすべて非表示にする
    if (isFirstMessage) {
        // サンプル表示ボタンのセクションを非表示
        const toggleSection = document.querySelector(`#${currentOfficeMode}-panel .sample-toggle-section`);
        if (toggleSection) {
            toggleSection.style.display = 'none';
            console.log(`✅ ${currentOfficeMode} サンプル表示ボタンを非表示にしました`);
        }
        
        // サンプルカードも非表示（既に表示されている場合）
        const sampleCard = document.getElementById(`${currentOfficeMode}SampleCard`);
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
                window.officeSampleStates[currentOfficeMode] = false;
            }
            
            console.log(`✅ ${currentOfficeMode} サンプルカードを非表示にしました`);
        }
    }
    
    // メッセージを追加
    addOfficeMessage('user', message, window.officeImageData);
    
    // 入力をクリア
    input.value = '';
    input.style.height = 'auto';
    
    // ボタンを無効化
    const sendBtn = document.getElementById('officeSendBtn');
    if (sendBtn) sendBtn.disabled = true;
    
    // タイピングインジケーター表示
    const typingId = showOfficeTypingIndicator();
    
    try {
        // APIキーチェック
        if (!OPENAI_API_KEY || OPENAI_API_KEY === '') {
            throw new Error('APIキーが設定されていません');
        }
        
        // メッセージの構築
        const messages = buildOfficeMessages(message, hasImage);
        
        // OpenAI API呼び出し
        const response = await callOpenAIAPI(messages, hasImage);
        
        // タイピングインジケーターを削除
        removeOfficeTypingIndicator(typingId);
        
        // 応答を表示
        addOfficeMessage('assistant', response);
        
        // 画像をクリア
        if (hasImage) {
            removeOfficePreviewImage();
        }
        
        // 履歴に追加
        officeMessages.push({
            role: 'user',
            content: message,
            imageData: hasImage ? window.officeImageData : null,
            timestamp: new Date().toISOString()
        });
        officeMessages.push({
            role: 'assistant',
            content: response,
            timestamp: new Date().toISOString()
        });
        
        // モード別履歴を更新
        officeContextByMode[currentOfficeMode] = [...officeMessages];
        
    } catch (error) {
        console.error('❌ エラー:', error);
        removeOfficeTypingIndicator(typingId);
        
        let errorMessage = 'エラーが発生しました。';
        
        if (error.message.includes('APIキー')) {
            errorMessage = '❌ APIキーが設定されていません。設定画面からOpenAI APIキーを設定してください。';
        } else {
            errorMessage = `❌ ${error.message}`;
        }
        
        addOfficeMessage('assistant', errorMessage);
        
        // APIキー未設定の場合はサンプル応答も表示
        if (!OPENAI_API_KEY) {
            setTimeout(() => {
                const sampleResponse = generateOfficeSampleResponse(message, hasImage);
                addOfficeMessage('assistant', `💡 サンプル応答：\n\n${sampleResponse}`);
            }, 500);
        }
        
    } finally {
        if (sendBtn) sendBtn.disabled = false;
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
    const recentHistory = officeMessages.slice(-10);
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
    messageDiv.className = `office-message ${role} ${currentOfficeMode}-mode`;
    
    const avatarIcons = {
        word: '📝',
        excel: '📊',
        powerpoint: '📑'
    };
    
    const avatarIcon = role === 'user' ? '👤' : avatarIcons[currentOfficeMode];
    
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

// ===== タイピングインジケーター =====
function showOfficeTypingIndicator() {
    const container = document.getElementById('officeMessages');
    if (!container) return;
    
    const id = Date.now();
    const div = document.createElement('div');
    div.className = `office-message assistant typing ${currentOfficeMode}-mode`;
    div.setAttribute('data-typing-id', id);
    
    const avatarIcons = {
        word: '📝',
        excel: '📊',
        powerpoint: '📑'
    };
    
    div.innerHTML = `
        <div class="office-message-avatar">${avatarIcons[currentOfficeMode]}</div>
        <div class="office-message-content">
            <div class="office-message-bubble">
                <div class="typing-indicator">
                    <span></span><span></span><span></span>
                </div>
            </div>
        </div>
    `;
    
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    return id;
}

function removeOfficeTypingIndicator(id) {
    const element = document.querySelector(`[data-typing-id="${id}"]`);
    if (element) element.remove();
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
    
    if (officeMessages.length >= 2) {
        officeMessages = officeMessages.slice(0, -2);
    }
    
    const officeInput = document.getElementById('officeInput');
    if (officeInput) {
        officeInput.value = userMessage;
        sendOfficeMessage();
    }
};

// ===== Officeチャットクリア =====
window.clearOfficeChat = function() {
    if (confirm(`${currentOfficeMode.toUpperCase()}モードの会話履歴をクリアしますか？`)) {
        officeMessages = [];
        officeContextByMode[currentOfficeMode] = [];
        
        const messagesContainer = document.getElementById('officeMessages');
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
            showOfficeWelcome();
        }
        
        showNotification(`${currentOfficeMode.toUpperCase()}モードの履歴をクリアしました`, 'success');
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
    const response = modeResponses[currentOfficeMode][currentMode];
    
    if (hasImage) {
        return `📸 **画面を確認しました！**

スクリーンショットの内容に基づいた具体的な解決策：

${response}

**💡 実際のAI解析を使用するには、API設定からOpenAIキーを設定してください。**`;
    }
    
    return response + '\n\n**💡 より詳細な回答をご希望の場合は、APIキーを設定してください。**';
}

// OpenAI API呼び出し関数
async function callOpenAIAPI(messages, hasImage = false) {
    if (!OPENAI_API_KEY || OPENAI_API_KEY === '') {
        throw new Error('APIキーが設定されていません');
    }
    
    try {
        // 画像がある場合は必ずgpt-4oを使用（Vision対応モデル）
        let model = DEFAULT_MODEL || 'gpt-4o';
        if (hasImage) {
            // Vision APIをサポートするモデルを強制使用
            if (!model.includes('gpt-4') && !model.includes('gpt-4o')) {
                console.warn('⚠️ 画像解析にはgpt-4oが必要です。モデルを自動切り替えします。');
                model = 'gpt-4o';
            }
        }
        
        console.log(`🔄 APIリクエスト開始`);
        console.log('- モデル:', model);
        console.log('- 画像:', hasImage ? 'あり' : 'なし');
        console.log('- メッセージ数:', messages.length);
        
        const requestBody = {
            model: model,
            messages: messages,
            temperature: AI_TEMPERATURE.office || 0.7,
            max_tokens: MAX_TOKENS.office || 2000
        };
        
        // デバッグ用：リクエスト内容の確認（画像データは除く）
        if (hasImage) {
            console.log('📤 Vision API リクエスト送信中...');
        }
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify(requestBody)
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
        
        const data = await response.json();
        console.log('✅ API応答受信完了');
        
        if (hasImage) {
            console.log('🖼️ Vision API解析完了');
        }
        
        return data.choices[0].message.content;
        
    } catch (error) {
        console.error('❌ OpenAI APIエラー:', error);
        
        // エラーメッセージの改善
        if (error.message.includes('billing')) {
            throw new Error('APIの利用制限に達しました。OpenAIアカウントの請求設定を確認してください。');
        } else if (error.message.includes('rate')) {
            throw new Error('API利用制限に達しました。しばらく待ってから再試行してください。');
        }
        
        throw error;
    }
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
        }, UI_SETTINGS.notificationDuration || 5000);
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

console.log('✅ Office支援モジュール読み込み完了（バブルUI版・応答モード差別化対応）');