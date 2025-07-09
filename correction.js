// ===================================================================
// HishoAI Enhanced - 進化版校正機能（美しく直感的なUI）
// 部分選択校正・方針指定・左右比較表示・変更箇所赤字強調
// ===================================================================

// ===== 共通定数の安全な参照 =====
function getConfig() {
    return {
        AI_TEMPERATURE: window.AI_TEMPERATURE || { correction: 0.2 },
        MAX_TOKENS: window.MAX_TOKENS || { correction: 10000 },
        DEFAULT_MODEL: window.DEFAULT_MODEL || 'gpt-4o',
        UI_SETTINGS: window.UI_SETTINGS || {},
        ERROR_MESSAGES: window.ERROR_MESSAGES || {},
        SUCCESS_MESSAGES: window.SUCCESS_MESSAGES || {}
    };
}

// ===== 通知表示の安全な実行 =====
function safeShowNotification(message, type) {
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    } else {
        console.log(`${type}: ${message}`);
        // 美しい通知表示
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 30px;
            right: 30px;
            background: ${type === 'error' ? 'linear-gradient(135deg, #dc2626, #b91c1c)' : 
                        type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 
                        'linear-gradient(135deg, #3b82f6, #2563eb)'};
            color: white;
            padding: 1.25rem 1.75rem;
            border-radius: 1rem;
            z-index: 10000;
            max-width: 350px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            backdrop-filter: blur(10px);
            font-weight: 600;
            animation: slideInRight 0.4s ease;
        `;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <div style="font-size: 1.25rem;">
                    ${type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️'}
                </div>
                <div>${message}</div>
            </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.4s ease';
            setTimeout(() => notification.remove(), 400);
        }, 4000);
    }
}

// ===== プロセシング表示の安全な実行 =====
function safeShowProcessing(message) {
    if (typeof window.showProcessing === 'function') {
        window.showProcessing(message);
    } else {
        console.log(`Processing: ${message}`);
        const processing = document.createElement('div');
        processing.id = 'correction-processing';
        processing.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.6);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(5px);
        `;
        processing.innerHTML = `
            <div style="
                background: white;
                padding: 3rem;
                border-radius: 2rem;
                text-align: center;
                box-shadow: 0 25px 50px rgba(0,0,0,0.3);
                max-width: 400px;
                width: 90%;
            ">
                <div style="
                    font-size: 3rem;
                    margin-bottom: 1.5rem;
                    animation: spin 2s linear infinite;
                ">⚙️</div>
                <div style="
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 0.5rem;
                ">${message}</div>
                <div style="
                    font-size: 0.875rem;
                    color: #6b7280;
                ">しばらくお待ちください...</div>
            </div>
        `;
        
        if (!document.querySelector('#processing-styles')) {
            const style = document.createElement('style');
            style.id = 'processing-styles';
            style.textContent = `
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(processing);
    }
}

function safeHideProcessing() {
    if (typeof window.hideProcessing === 'function') {
        window.hideProcessing();
    } else {
        console.log('Processing complete');
        const processing = document.getElementById('correction-processing');
        if (processing) {
            processing.remove();
        }
    }
}

// ===== API設定確認関数（安全版） =====
function checkApiConfiguration() {
    const apiKey = window.OPENAI_API_KEY || 
                   (window.ApiKeyManager && window.ApiKeyManager.get()) ||
                   '';
    
    return apiKey && apiKey.length > 40 && apiKey.startsWith('sk-');
}

// ===== エラーメッセージの安全な取得 =====
function getErrorMessage(key) {
    const config = getConfig();
    const messages = {
        emptyInput: '入力内容が空です。テキストを入力してください。',
        processingError: '処理中にエラーが発生しました。再試行してください。'
    };
    return config.ERROR_MESSAGES[key] || messages[key] || 'エラーが発生しました。';
}

// ===== 成功メッセージの安全な取得 =====
function getSuccessMessage(key) {
    const config = getConfig();
    const messages = {
        correctionComplete: '✨ 校正が完了しました！'
    };
    return config.SUCCESS_MESSAGES[key] || messages[key] || '処理が完了しました。';
}

// ===== 校正機能の初期化 =====
function initializeCorrectionSection() {
    console.log('✏️ 美しい校正機能初期化中...');
    
    removeExistingListeners();
    createBeautifulCorrectionInterface();
    
    console.log('✅ 美しい校正機能初期化完了');
}

// ===== 既存リスナー削除 =====
function removeExistingListeners() {
    const correctionInput = document.getElementById('correctionInput');
    if (correctionInput) {
        const newInput = correctionInput.cloneNode(true);
        correctionInput.parentNode.replaceChild(newInput, correctionInput);
    }
}

// ===== 美しい校正インターフェース作成 =====
function createBeautifulCorrectionInterface() {
    const correctionSection = document.getElementById('correctionSection');
    if (!correctionSection) return;
    
    const existingContainer = correctionSection.querySelector('.correction-container, .feature-container');
    if (existingContainer) {
        existingContainer.remove();
    }
    
    const beautifulInterface = document.createElement('div');
    beautifulInterface.className = 'correction-main-container';
    beautifulInterface.innerHTML = `
        <div class="correction-main-header">
            <h1 class="correction-main-title">✨ AI校正マスター</h1>
            <p class="correction-main-subtitle">テキストを選択→方針入力→一発校正で完璧な文章に</p>
        </div>
        
        <div class="correction-main-content">
            <div class="correction-steps">
                <div class="correction-step active" data-step="1">
                    <div class="step-number">1</div>
                    <div class="step-text">テキスト入力</div>
                </div>
                <div class="correction-step" data-step="2">
                    <div class="step-number">2</div>
                    <div class="step-text">範囲選択</div>
                </div>
                <div class="correction-step" data-step="3">
                    <div class="step-number">3</div>
                    <div class="step-text">方針入力</div>
                </div>
                <div class="correction-step" data-step="4">
                    <div class="step-number">4</div>
                    <div class="step-text">校正実行</div>
                </div>
            </div>
            
            <div class="correction-input-section">
                <div class="correction-input-label">
                    <div class="correction-input-icon">📝</div>
                    <div>校正したいテキストを入力してください</div>
                </div>
                <textarea 
                    id="correctionInput" 
                    class="correction-main-textarea"
                    placeholder="ここに校正したい文章を入力してください..."
                    rows="8"
                ></textarea>
                
                <div class="selection-status-modern" id="selectionStatusModern">
                    <div class="selection-icon-modern">🎯</div>
                    <div class="selection-text-modern">テキストを選択すると、その部分だけを校正できます（未選択の場合は全文校正）</div>
                </div>
            </div>
            
            <div class="correction-policy-modern">
                <div class="policy-label-modern">
                    <div class="policy-icon-modern">🎨</div>
                    <div>校正方針を入力してください</div>
                </div>
                <textarea 
                    id="correctionPolicy" 
                    class="policy-input-modern"
                    placeholder="どのように校正してほしいか具体的に入力してください..."
                    rows="3"
                ></textarea>
                
                <div class="policy-presets-modern">
                    <div class="presets-label-modern">
                        <span>💡</span> よく使われる方針（クリックで自動入力）
                    </div>
                    <div class="preset-tags-modern">
                        <button class="preset-tag-modern" onclick="setCorrectionPolicy('丁寧語に統一して、ビジネスメール風に')">
                            📧 ビジネス調
                        </button>
                        <button class="preset-tag-modern" onclick="setCorrectionPolicy('カジュアルで親しみやすい文章に')">
                            😊 カジュアル調
                        </button>
                        <button class="preset-tag-modern" onclick="setCorrectionPolicy('専門用語を平易な表現に置き換えて')">
                            📚 平易化
                        </button>
                        <button class="preset-tag-modern" onclick="setCorrectionPolicy('敬語を正しく使って、フォーマルに')">
                            🎩 フォーマル
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="correction-execute-section">
                <button class="correction-execute-btn-modern" onclick="executeCorrection()" id="correctionExecuteBtnModern">
                    <div class="btn-icon-modern">🚀</div>
                    <div class="btn-text-modern">AI校正を実行</div>
                </button>
            </div>
        </div>
    `;
    
    correctionSection.appendChild(beautifulInterface);
    setupBeautifulEventListeners();
}

// ===== 美しいイベントリスナー設定 =====
function setupBeautifulEventListeners() {
    const correctionInput = document.getElementById('correctionInput');
    if (correctionInput) {
        correctionInput.addEventListener('mouseup', handleTextSelection);
        correctionInput.addEventListener('keyup', handleTextSelection);
        correctionInput.addEventListener('input', updateStepProgress);
        correctionInput.addEventListener('focus', () => {
            updateStepStatus(1, 'active');
        });
    }
    
    const policyInput = document.getElementById('correctionPolicy');
    if (policyInput) {
        policyInput.addEventListener('input', () => {
            updateStepProgress();
            if (policyInput.value.trim()) {
                updateStepStatus(3, 'completed');
            }
        });
        policyInput.addEventListener('focus', () => {
            updateStepStatus(3, 'active');
        });
    }
}

// ===== ステップ進行更新 =====
function updateStepProgress() {
    const input = document.getElementById('correctionInput');
    const policy = document.getElementById('correctionPolicy');
    
    if (input && input.value.trim()) {
        updateStepStatus(1, 'completed');
        updateStepStatus(2, 'active');
    }
    
    if (policy && policy.value.trim()) {
        updateStepStatus(3, 'completed');
        updateStepStatus(4, 'active');
    }
}

// ===== ステップ状態更新 =====
function updateStepStatus(stepNumber, status) {
    const step = document.querySelector(`[data-step="${stepNumber}"]`);
    if (step) {
        step.classList.remove('active', 'completed');
        step.classList.add(status);
    }
}

// ===== テキスト選択処理 =====
function handleTextSelection() {
    const input = document.getElementById('correctionInput');
    if (!input) return;
    
    const selectedText = getSelectedText(input);
    const hasSelection = selectedText.length > 0;
    
    updateSelectionDisplay(selectedText, hasSelection);
    
    if (hasSelection) {
        updateStepStatus(2, 'completed');
        updateStepStatus(3, 'active');
    }
}

// ===== 選択テキスト取得 =====
function getSelectedText(element) {
    const start = element.selectionStart;
    const end = element.selectionEnd;
    
    if (start === end) {
        return '';
    }
    
    return element.value.substring(start, end);
}

// ===== 選択表示更新 =====
function updateSelectionDisplay(selectedText, hasSelection) {
    const selectionStatus = document.getElementById('selectionStatusModern');
    if (!selectionStatus) return;
    
    const icon = selectionStatus.querySelector('.selection-icon-modern');
    const text = selectionStatus.querySelector('.selection-text-modern');
    
    if (hasSelection) {
        const wordCount = selectedText.length;
        const preview = selectedText.length > 50 ? selectedText.substring(0, 50) + '...' : selectedText;
        
        icon.textContent = '✅';
        text.innerHTML = `
            <strong>${wordCount}文字を選択中:</strong><br>
            「${preview}」
        `;
        selectionStatus.classList.add('has-selection');
    } else {
        icon.textContent = '🎯';
        text.textContent = 'テキストを選択すると、その部分だけを校正できます（未選択の場合は全文校正）';
        selectionStatus.classList.remove('has-selection');
    }
}

// ===== 校正方針設定 =====
function setCorrectionPolicy(policy) {
    const policyInput = document.getElementById('correctionPolicy');
    if (policyInput) {
        policyInput.value = policy;
        policyInput.focus();
        updateStepProgress();
        
        policyInput.style.transform = 'scale(1.02)';
        setTimeout(() => {
            policyInput.style.transform = 'scale(1)';
        }, 200);
    }
}

// ===== 校正実行 =====
async function executeCorrection() {
    const input = document.getElementById('correctionInput');
    const policyInput = document.getElementById('correctionPolicy');
    const executeBtn = document.getElementById('correctionExecuteBtnModern');
    
    if (!input || !policyInput) {
        safeShowNotification('❌ 必要な要素が見つかりません', 'error');
        return;
    }
    
    const selectedText = getSelectedText(input);
    const targetText = (selectedText || input.value).trim();
    
    if (!targetText) {
        safeShowNotification('❌ 校正するテキストを入力してください', 'error');
        input.focus();
        return;
    }
    
    const policy = policyInput.value.trim();
    if (!policy) {
        safeShowNotification('❌ 校正方針を入力してください', 'error');
        policyInput.focus();
        return;
    }
    
    if (executeBtn) {
        executeBtn.disabled = true;
        executeBtn.innerHTML = `
            <div class="btn-icon-modern">⏳</div>
            <div class="btn-text-modern">AI校正中...</div>
        `;
    }
    
    try {
        safeShowProcessing('🤖 AIが文章を分析・校正中');
        
        if (checkApiConfiguration()) {
            const result = await callCorrectionAPI(targetText, policy);
            safeHideProcessing();
            showBeautifulCorrectionResult(targetText, result, selectedText.length > 0);
        } else {
            await simulateProcessing();
            safeHideProcessing();
            
            const sampleResult = generateSampleCorrectionResult(targetText, policy);
            showBeautifulCorrectionResult(targetText, sampleResult, selectedText.length > 0);
            safeShowNotification('💡 本格的な校正にはAPIキーの設定が必要です', 'info');
        }
    } catch (error) {
        safeHideProcessing();
        console.error('❌ 校正エラー:', error);
        safeShowNotification('❌ 校正処理でエラーが発生しました。再試行してください。', 'error');
    } finally {
        if (executeBtn) {
            executeBtn.disabled = false;
            executeBtn.innerHTML = `
                <div class="btn-icon-modern">🚀</div>
                <div class="btn-text-modern">AI校正を実行</div>
            `;
        }
    }
}

// ===== 校正API呼び出し =====
async function callCorrectionAPI(text, policy) {
    const currentApiKey = window.OPENAI_API_KEY || (window.ApiKeyManager && window.ApiKeyManager.get());
    
    if (!currentApiKey || !currentApiKey.startsWith('sk-')) {
        throw new Error('APIキーが設定されていないか無効です');
    }

    console.log('📤 校正API呼び出し開始');
    
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${currentApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: window.DEFAULT_MODEL || 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: `あなたは日本語の校正・校閲の超一流専門家です。指定された方針に従って、最高品質の校正を実行してください。校正後の文章のみを出力してください。`
                    },
                    {
                        role: 'user',
                        content: `【校正方針】
${policy}

【校正対象文章】
${text}

上記の方針に従って、この文章を校正してください。校正後の文章のみを出力してください。`
                    }
                ],
                max_tokens: 10000,
                temperature: 0.15
            })
        });

        if (!response.ok) {
            console.error('校正API応答エラー:', response.status, response.statusText);
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `API応答エラー: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ 校正API応答受信');
        
        return data.choices[0].message.content.trim();
        
    } catch (error) {
        console.error('❌ 校正API エラー:', error);
        throw error;
    }
}

// ===== 美しい校正結果表示 =====
function showBeautifulCorrectionResult(original, corrected, isPartialSelection) {
    const correctionSection = document.getElementById('correctionSection');
    if (!correctionSection) return;
    
    // 空チェック
    if (!original.trim() || !corrected.trim()) {
        return;
    }
    
    const existingResults = correctionSection.querySelectorAll('.correction-comparison-result');
    existingResults.forEach(result => result.remove());
    
    const cleanCorrected = cleanCorrectionResult(corrected);
    const changes = detectChanges(original, cleanCorrected);
    
    const comparisonHTML = `
        <div class="correction-comparison-result">
            <div class="comparison-header">
                <h3 class="comparison-title">
                    <span>✨</span>
                    校正完了！
                </h3>
                <div class="comparison-info">
                    ${isPartialSelection ? 
                        `<span class="selection-badge">📍 部分選択</span>` : 
                        `<span class="full-badge">📄 全文校正</span>`
                    }
                    <span class="changes-count">🔥 ${changes.length}箇所修正</span>
                </div>
                <div class="comparison-actions">
                    <button class="copy-btn" onclick="copyCorrectedText()">
                        <span>📋</span> 校正後をコピー
                    </button>
                    <button class="apply-btn" onclick="applyCorrectionToInput()">
                        <span>✅</span> 入力欄に反映
                    </button>
                </div>
            </div>
            
            <div class="comparison-panels">
                <div class="comparison-panel original-panel">
                    <div class="panel-header">
                        <div class="panel-icon">📋</div>
                        <div class="panel-title">校正前</div>
                    </div>
                    <div class="panel-content" id="originalText">${escapeHtml(original.trim())}</div>
                </div>
                
                <div class="comparison-panel corrected-panel">
                    <div class="panel-header">
                        <div class="panel-icon">✨</div>
                        <div class="panel-title">校正後</div>
                    </div>
                    <div class="panel-content" id="correctedText">${escapeHtml(cleanCorrected.trim())}</div>
                </div>
            </div>
        </div>
    `;
    
    const correctionMainContainer = correctionSection.querySelector('.correction-main-container');
    if (correctionMainContainer) {
        correctionMainContainer.insertAdjacentHTML('afterend', comparisonHTML);
    } else {
        correctionSection.insertAdjacentHTML('beforeend', comparisonHTML);
    }
    
    const comparisonResult = correctionSection.querySelector('.correction-comparison-result');
    if (comparisonResult) {
        setTimeout(() => {
            comparisonResult.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start',
                inline: 'nearest'
            });
        }, 200);
    }
    
    safeShowNotification(getSuccessMessage('correctionComplete'), 'success');
    updateStepStatus(4, 'completed');
}

// ===== 校正結果クリーンアップ =====
function cleanCorrectionResult(result) {
    return result.trim();
}

// ===== 変更箇所検出 =====
function detectChanges(original, corrected) {
    const changes = [];
    const originalWords = original.split(/(\s+|[。、！？\n])/).filter(segment => segment.length > 0);
    const correctedWords = corrected.split(/(\s+|[。、！？\n])/).filter(segment => segment.length > 0);
    
    let changeCount = 0;
    const maxWords = Math.max(originalWords.length, correctedWords.length);
    
    for (let i = 0; i < maxWords; i++) {
        if (originalWords[i] !== correctedWords[i]) {
            changeCount++;
        }
    }
    
    return Array(Math.min(changeCount, 20)).fill({}).map((_, i) => ({
        type: 'change',
        index: i
    }));
}

// ===== 校正後テキストコピー =====
function copyCorrectedText() {
    const correctedElement = document.getElementById('correctedText');
    if (!correctedElement) return;
    
    const text = correctedElement.textContent || correctedElement.innerText;
    copyToClipboard(text.trim());
}

// ===== 校正結果を入力欄に反映 =====
function applyCorrectionToInput() {
    const correctedElement = document.getElementById('correctedText');
    const input = document.getElementById('correctionInput');
    
    if (!correctedElement || !input) return;
    
    const correctedText = (correctedElement.textContent || correctedElement.innerText).trim();
    const selectedText = getSelectedText(input);
    
    if (selectedText.length > 0) {
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const fullText = input.value;
        
        input.value = fullText.substring(0, start) + correctedText + fullText.substring(end);
        input.setSelectionRange(start, start + correctedText.length);
    } else {
        input.value = correctedText;
    }
    
    input.focus();
    
    input.style.background = 'linear-gradient(135deg, #dcfce7, #bbf7d0)';
    setTimeout(() => {
        input.style.background = '';
    }, 1000);
    
    safeShowNotification('✅ 校正結果を入力欄に反映しました！', 'success');
}

// ===== サンプル校正結果生成 =====
function generateSampleCorrectionResult(text, policy) {
    let sample = text;
    
    if (policy.includes('丁寧') || policy.includes('ビジネス') || policy.includes('敬語')) {
        sample = sample
            .replace(/こんにちわ/g, 'こんにちは')
            .replace(/おせわ/g, 'お世話')
            .replace(/おねがい/g, 'お願い');
    }
    
    return sample.trim();
}

// ===== コピー機能の安全な実行 =====
function copyToClipboard(text) {
    if (typeof window.copyToClipboard === 'function') {
        window.copyToClipboard(text);
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            safeShowNotification('📋 クリップボードにコピーしました！', 'success');
        }).catch(err => {
            console.error('Copy failed:', err);
            fallbackCopyTextToClipboard(text);
        });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

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
            safeShowNotification('📋 クリップボードにコピーしました！', 'success');
        } else {
            safeShowNotification('❌ コピーに失敗しました', 'error');
        }
    } catch (err) {
        safeShowNotification('❌ コピーに失敗しました', 'error');
    }
    
    document.body.removeChild(textArea);
}

function simulateProcessing() {
    return new Promise(resolve => {
        setTimeout(resolve, 2000);
    });
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
        '\n': '<br>'
    };
    return text.replace(/[&<>"'\n]/g, function(m) { return map[m]; });
}

// ===== 初期化関数の重複回避 =====
if (typeof window.correctionInitialized === 'undefined') {
    window.correctionInitialized = true;
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeCorrectionSection);
    } else {
        setTimeout(initializeCorrectionSection, 100);
    }
}

// ===== グローバル関数として公開 =====
if (typeof window.executeCorrection === 'undefined') {
    window.executeCorrection = executeCorrection;
    window.setCorrectionPolicy = setCorrectionPolicy;
    window.copyCorrectedText = copyCorrectedText;
    window.applyCorrectionToInput = applyCorrectionToInput;
}

window.correctText = executeCorrection;
window.improveReadability = executeCorrection;
window.checkWritingStyle = executeCorrection;
window.checkTechnicalTerms = executeCorrection;