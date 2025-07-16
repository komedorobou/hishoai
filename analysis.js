// ===================================================================
// HishoAI Enhanced - 画像解析機能モジュール（買い切り完全版）
// Vision API連携、OCR、画像比較、解析履歴管理 - 全機能制限なし
// ===================================================================

// ===== 共通定数のインポート =====
// config.js から画像設定、温度設定、トークン数、UI設定、メッセージなどを参照
const {
    AI_TEMPERATURE,
    MAX_TOKENS,
    IMAGE_SETTINGS,
    UI_SETTINGS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    SAMPLE_RESPONSES
} = window;

// ===== 画像解析履歴管理クラス =====
class ImageAnalysisHistoryManager {
    constructor() {
        this.storageKey = 'hishoai_analysis_history';
        this.maxItems = 200;
        this.history = [];
        this.initialized = false;
        this.init();
    }
    
    init() {
        if (this.initialized) return;
        console.log('🔍 画像解析履歴管理を初期化中...');
        this.loadFromStorage();
        this.initialized = true;
        console.log('✅ 画像解析履歴管理初期化完了');
    }
    
    add(item) {
        const analysisItem = {
            id: Date.now() + Math.random(),
            timestamp: new Date().toISOString(),
            imageSize: item.imageSize || 0,
            analysisTime: item.analysisTime || 0,
            ...item
        };
        
        this.history.unshift(analysisItem);
        
        if (this.history.length > this.maxItems) {
            this.history = this.history.slice(0, this.maxItems);
        }
        
        this.saveToStorage();
        return analysisItem;
    }
    
    getAll() {
        return this.history;
    }
    
    get(id) {
        return this.history.find(item => item.id === id);
    }
    
    search(query) {
        const searchTerm = query.toLowerCase();
        return this.history.filter(item => {
            return item.fileName?.toLowerCase().includes(searchTerm) ||
                   item.result?.toLowerCase().includes(searchTerm) ||
                   item.mode?.toLowerCase().includes(searchTerm) ||
                   item.context?.toLowerCase().includes(searchTerm);
        });
    }
    
    getByMode(mode) {
        return this.history.filter(item => item.mode === mode);
    }
    
    getStats() {
        const modeBreakdown = this.history.reduce((acc, item) => {
            acc[item.mode] = (acc[item.mode] || 0) + 1;
            return acc;
        }, {});
        
        const avgAnalysisTime = this.history.length > 0 ? 
            Math.round(this.history.reduce((sum, item) => sum + (item.analysisTime || 0), 0) / this.history.length) : 0;
        
        return {
            totalAnalyses: this.history.length,
            modeBreakdown,
            avgAnalysisTime,
            totalImageSize: this.history.reduce((sum, item) => sum + (item.imageSize || 0), 0)
        };
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
            console.error('❌ 解析履歴の保存に失敗しました:', error);
        }
    }
    
    loadFromStorage() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                this.history = JSON.parse(saved);
            }
        } catch (error) {
            console.error('❌ 解析履歴の読み込みに失敗しました:', error);
            this.history = [];
        }
    }
}

// グローバルインスタンス
const imageAnalysisHistoryManager = new ImageAnalysisHistoryManager();

// ===== 画像解析設定と定数 =====
const ANALYSIS_MODES = {
    'error': {
        name: 'エラー解析',
        icon: '🐛',
        description: 'エラー画面やバグの原因を特定し、解決策を提案',
        prompt: 'この画面に表示されているエラーや問題を詳しく分析してください。',
        detailedPrompt: `エラー画面を分析し、以下の項目について詳しく説明してください：
1. エラーの種類と内容
2. 考えられる原因
3. 具体的な解決手順
4. 今後の予防策
5. 関連する参考情報`,
        temperature: AI_TEMPERATURE.analysis,
        maxTokens: MAX_TOKENS.analysis
    },
    'software': {
        name: 'ソフトウェア解析',
        icon: '💻',
        description: 'アプリケーションの操作方法や機能を説明',
        prompt: 'このソフトウェア画面の操作方法や機能について詳しく説明してください。',
        detailedPrompt: `ソフトウェア画面を分析し、以下について説明してください：
1. 表示されているUI要素の説明
2. 各機能の使用方法
3. 効率的な操作手順
4. 便利な機能やショートカット
5. 初心者向けのアドバイス`,
        temperature: AI_TEMPERATURE.analysis,
        maxTokens: MAX_TOKENS.analysis
    },
    'code': {
        name: 'コード解析',
        icon: '🔧',
        description: 'プログラムコードの問題点と改善案を提示',
        prompt: 'このコード画面を分析し、問題点、改善案、最適化の提案をしてください。',
        detailedPrompt: `コード画面を詳しく分析し、以下について説明してください：
1. コードの概要と機能
2. 検出された問題点やバグ
3. コード品質の評価
4. 改善提案と最適化案
5. ベストプラクティスの適用`,
        temperature: AI_TEMPERATURE.analysis,
        maxTokens: MAX_TOKENS.analysis
    },
    'ui': {
        name: 'UI/UX解析',
        icon: '🎨',
        description: 'ユーザーインターフェースのデザインを評価',
        prompt: 'このユーザーインターフェースのデザインを評価し、UX改善案を提案してください。',
        detailedPrompt: `UI/UXデザインを詳しく分析し、以下について評価してください：
1. デザインの視覚的評価
2. ユーザビリティの問題点
3. アクセシビリティの確認
4. 改善提案と具体的な修正案
5. トレンドに基づく推奨事項`,
        temperature: AI_TEMPERATURE.analysis,
        maxTokens: MAX_TOKENS.analysis
    },
    'general': {
        name: '一般解析',
        icon: '🔍',
        description: '包括的な画面解析と改善提案',
        prompt: 'この画像について詳細に分析し、重要なポイントや改善案があれば提案してください。',
        detailedPrompt: `画像を包括的に分析し、以下について説明してください：
1. 画像の内容と特徴
2. 重要なポイントの抽出
3. 改善可能な要素
4. 推奨される対応策
5. 参考情報や関連知識`,
        temperature: AI_TEMPERATURE.analysis,
        maxTokens: MAX_TOKENS.analysis
    },
    'document': {
        name: '文書解析',
        icon: '📄',
        description: '文書の内容分析と構造化',
        prompt: 'この文書の内容を分析し、要点をまとめて構造化してください。',
        detailedPrompt: `文書を詳しく分析し、以下について整理してください：
1. 文書の種類と目的
2. 主要な内容と要点
3. 構造と論理的な流れ
4. 重要な情報やデータ
5. 改善や注意点の提案`,
        temperature: AI_TEMPERATURE.analysis,
        maxTokens: MAX_TOKENS.analysis
    },
    'security': {
        name: 'セキュリティ解析',
        icon: '🔒',
        description: 'セキュリティ上の問題点を検出',
        prompt: 'この画面のセキュリティ上の問題点や改善点を分析してください。',
        detailedPrompt: `セキュリティの観点から分析し、以下について評価してください：
1. セキュリティリスクの特定
2. 脆弱性の可能性
3. 推奨されるセキュリティ対策
4. ベストプラクティスの適用
5. 緊急度の評価`,
        temperature: AI_TEMPERATURE.analysis,
        maxTokens: MAX_TOKENS.analysis
    }
};

// ===== グローバル変数（analysisモジュール専用） =====
let analysisModuleState = {
    selectedImageFile: null,
    selectedCompareImage: null,
    currentImageData: null,
    compareImageData: null,
    analysisInProgress: false
};

// ===== 画像アップロード設定 =====
function setupImageUpload() {
    const dropZone = document.getElementById('imageDropZone');
    const fileInput = document.getElementById('imageFileInput');
    const compareDropZone = document.getElementById('compareImageDropZone');
    const compareFileInput = document.getElementById('compareImageFileInput');
    
    if (dropZone && fileInput) {
        // メイン画像のアップロード設定
        dropZone.addEventListener('click', () => fileInput.click());
        
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });
        
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleImageFile(files[0]);
            }
        });
        
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleImageFile(e.target.files[0]);
            }
        });
    }
    
    // 比較画像のアップロード設定
    if (compareDropZone && compareFileInput) {
        compareDropZone.addEventListener('click', () => compareFileInput.click());
        
        compareFileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleCompareImageFile(e.target.files[0]);
            }
        });
    }
    
    // 比較モードチェックボックス
    const compareCheckbox = document.getElementById('enableImageCompare');
    if (compareCheckbox) {
        compareCheckbox.addEventListener('change', toggleImageCompareMode);
    }
}

// ===== 画像ファイル処理 =====

// メイン画像ファイル処理
function handleImageFile(file) {
    if (!validateImageFile(file)) {
        return false;
    }
    
    analysisModuleState.selectedImageFile = file;
    
    // ファイル情報表示
    displayImageFileInfo(file);
    
    // プレビュー表示
    showImagePreview(file, 'main');
    
    // 処理ボタンを有効化
    enableAnalysisButtons(true);
    
    showNotification(SUCCESS_MESSAGES.imageUploaded, 'success');
    
    if (UI_SETTINGS && UI_SETTINGS.debugMode) {
        console.log('📸 画像ファイル処理完了:', {
            name: file.name,
            size: file.size,
            type: file.type
        });
    }
    
    return true;
}

// 比較画像ファイル処理
function handleCompareImageFile(file) {
    if (!validateImageFile(file)) {
        return false;
    }
    
    analysisModuleState.selectedCompareImage = file;
    
    // プレビュー表示
    showImagePreview(file, 'compare');
    
    showNotification('比較画像がアップロードされました', 'success');
    
    if (UI_SETTINGS && UI_SETTINGS.debugMode) {
        console.log('🔄 比較画像ファイル処理完了:', {
            name: file.name,
            size: file.size,
            type: file.type
        });
    }
    
    return true;
}

// 画像ファイル検証
function validateImageFile(file) {
    if (!file) {
        showNotification('ファイルが選択されていません', 'error');
        return false;
    }
    
    // ファイルタイプチェック
    if (!IMAGE_SETTINGS.supportedFormats.includes(file.type)) {
        showNotification(ERROR_MESSAGES.unsupportedImageFormat, 'error');
        return false;
    }
    
    // ファイルサイズチェック
    if (file.size > IMAGE_SETTINGS.maxFileSize * 1024 * 1024) {
        showNotification(ERROR_MESSAGES.imageTooLarge, 'error');
        return false;
    }
    
    // 画像の妥当性チェック
    if (file.size < 100) {
        showNotification('画像ファイルが小さすぎます', 'error');
        return false;
    }
    
    return true;
}

// 画像ファイル情報表示
function displayImageFileInfo(file) {
    const fileInfo = document.getElementById('imageFileInfo');
    if (!fileInfo) return;
    
    const fileName = fileInfo.querySelector('.file-name');
    const fileSize = fileInfo.querySelector('.file-size');
    
    if (fileName) fileName.textContent = file.name;
    if (fileSize) {
        const sizeMB = (file.size / 1024 / 1024).toFixed(2);
        fileSize.textContent = `サイズ: ${sizeMB} MB`;
    }
    
    fileInfo.style.display = 'flex';
}

// 画像プレビュー表示
function showImagePreview(file, type = 'main') {
    const previewId = type === 'compare' ? 'compareImagePreview' : 'imagePreview';
    const imgId = type === 'compare' ? 'comparePreviewImage' : 'previewImage';
    
    const preview = document.getElementById(previewId);
    const previewImg = document.getElementById(imgId);
    
    if (!preview || !previewImg) {
        console.warn(`⚠️ プレビュー要素が見つかりません: ${previewId}`);
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        previewImg.src = e.target.result;
        preview.style.display = 'block';
        
        if (type === 'main') {
            analysisModuleState.currentImageData = e.target.result;
        } else {
            analysisModuleState.compareImageData = e.target.result;
        }
    };
    
    reader.onerror = function() {
        console.error('❌ ファイル読み込みエラー');
        showNotification('画像の読み込みに失敗しました', 'error');
    };
    
    reader.readAsDataURL(file);
}

// 画像ファイル削除（analysis専用）
function removeAnalysisImageFile() {
    analysisModuleState.selectedImageFile = null;
    analysisModuleState.selectedCompareImage = null;
    analysisModuleState.currentImageData = null;
    analysisModuleState.compareImageData = null;
    
    // UI要素をリセット
    const fileInfo = document.getElementById('imageFileInfo');
    if (fileInfo) fileInfo.style.display = 'none';
    
    const preview = document.getElementById('imagePreview');
    if (preview) preview.style.display = 'none';
    
    const comparePreview = document.getElementById('compareImagePreview');
    if (comparePreview) comparePreview.style.display = 'none';
    
    // ファイル入力をクリア
    const fileInput = document.getElementById('imageFileInput');
    if (fileInput) fileInput.value = '';
    
    const compareFileInput = document.getElementById('compareImageFileInput');
    if (compareFileInput) compareFileInput.value = '';
    
    // ボタンを無効化
    enableAnalysisButtons(false);
    
    showNotification('画像ファイルを削除しました', 'success');
}

// 解析ボタンの有効化/無効化
function enableAnalysisButtons(enabled) {
    const analyzeBtn = document.getElementById('analyzeImageBtn');
    const ocrBtn = document.getElementById('ocrBtn');
    
    if (analyzeBtn) analyzeBtn.disabled = !enabled;
    if (ocrBtn) ocrBtn.disabled = !enabled;
}

// ===== 画像解析機能 =====

// メイン画像解析関数
async function analyzeImage() {
    if (!analysisModuleState.selectedImageFile) {
        showNotification(ERROR_MESSAGES.noImageFile, 'error');
        return;
    }
    
    if (analysisModuleState.analysisInProgress) {
        showNotification('解析が進行中です。しばらくお待ちください。', 'warning');
        return;
    }
    
    const analyzeBtn = document.getElementById('analyzeImageBtn');
    if (analyzeBtn) analyzeBtn.disabled = true;
    
    analysisModuleState.analysisInProgress = true;
    const startTime = Date.now();
    
    showProcessing('画像を解析中...');
    
    try {
        const mode = getSelectedAnalysisMode();
        const context = getAnalysisContext();
        const enableComparison = isComparisonEnabled();
        
        if (UI_SETTINGS && UI_SETTINGS.debugMode) {
            console.log('🔍 画像解析開始:', {
                mode,
                context,
                enableComparison,
                hasCompareImage: !!analysisModuleState.selectedCompareImage
            });
        }
        
        let result;
        
        if (checkApiConfiguration()) {
            // API使用時の解析
            if (enableComparison && analysisModuleState.selectedCompareImage) {
                result = await performImageComparison(
                    analysisModuleState.currentImageData, 
                    analysisModuleState.compareImageData, 
                    mode, 
                    context
                );
            } else {
                result = await performSingleImageAnalysis(
                    analysisModuleState.currentImageData, 
                    mode, 
                    context
                );
            }
            
            hideProcessing();
            
            const analysisTime = Date.now() - startTime;
            
            // 解析結果を表示
            showAnalysisResult(mode, result, enableComparison);
            
            // 履歴に保存
            imageAnalysisHistoryManager.add({
                fileName: analysisModuleState.selectedImageFile.name,
                mode: mode,
                context: context,
                result: result,
                imageSize: analysisModuleState.selectedImageFile.size,
                analysisTime: analysisTime,
                hasComparison: enableComparison,
                type: 'image_analysis'
            });
            
            if (UI_SETTINGS && UI_SETTINGS.debugMode) {
                console.log('✅ 画像解析完了:', { analysisTime, mode });
            }
            
        } else {
            // サンプル解析結果
            await simulateProcessing();
            hideProcessing();
            
            const sampleResult = getSampleAnalysisResult(mode);
            showAnalysisResult(mode, sampleResult, enableComparison);
            
            showNotification('💡 実際の画像解析にはAPIキーの設定が必要です', 'info');
        }
        
    } catch (error) {
        hideProcessing();
        console.error('❌ 画像解析エラー:', error);
        showNotification(`画像解析エラー: ${error.message}`, 'error');
    } finally {
        analysisModuleState.analysisInProgress = false;
        if (analyzeBtn) analyzeBtn.disabled = false;
    }
}

// 単一画像解析
async function performSingleImageAnalysis(imageData, mode, context) {
    try {
        const prompt = createAnalysisPrompt(mode, context);
        const result = await callVisionAPI(prompt, imageData);
        return result;
        
    } catch (error) {
        console.error('❌ 単一画像解析エラー:', error);
        throw error;
    }
}

// 画像比較解析
async function performImageComparison(imageData1, imageData2, mode, context) {
    try {
        const prompt = createComparisonPrompt(mode, context);
        
        // 比較用の特別なプロンプトを作成
        const comparisonPrompt = `${prompt}

【比較する画像】
1枚目: メイン画像
2枚目: 比較画像

【比較観点】
- 変更点や違いの詳細
- それぞれの特徴
- 改善点や問題点
- 推奨される対応策`;
        
        // 最初の画像で解析
        const result1 = await callVisionAPI(comparisonPrompt, imageData1);
        
        // 2枚目の画像も解析（簡単な実装）
        const result2 = await callVisionAPI('この画像について簡潔に分析してください。', imageData2);
        
        const combinedResult = `## 画像比較解析結果

### メイン画像の解析
${result1}

### 比較画像の解析
${result2}

### 比較まとめ
この2つの画像を比較することで、変更点や改善点をより明確に把握できます。`;
        
        return combinedResult;
        
    } catch (error) {
        console.error('❌ 画像比較解析エラー:', error);
        throw error;
    }
}

// 解析プロンプト作成
function createAnalysisPrompt(mode, context) {
    const modeInfo = ANALYSIS_MODES[mode] || ANALYSIS_MODES.general;
    
    let prompt = modeInfo.detailedPrompt || modeInfo.prompt;
    
    // コンテキストが提供されている場合は追加
    if (context && context.trim()) {
        prompt += `\n\n【追加の文脈情報】\n${context}`;
    }
    
    // モード固有の指示を追加
    switch (mode) {
        case 'error':
            prompt += '\n\n【重要】エラーコード、メッセージの詳細、ステップバイステップの解決手順を必ず含めてください。';
            break;
        case 'code':
            prompt += '\n\n【重要】コードの改善案は具体的なコード例とともに提示してください。';
            break;
        case 'ui':
            prompt += '\n\n【重要】アクセシビリティとユーザビリティの観点から具体的な改善案を提示してください。';
            break;
        case 'security':
            prompt += '\n\n【重要】セキュリティリスクは緊急度とともに評価し、具体的な対策を提示してください。';
            break;
    }
    
    return prompt;
}

// 比較用プロンプト作成
function createComparisonPrompt(mode, context) {
    const basePrompt = createAnalysisPrompt(mode, context);
    
    return `${basePrompt}

【比較解析の重点項目】
1. 2つの画像の主な違い
2. 変更による影響の評価
3. 改善点と問題点の特定
4. 推奨される次のステップ`;
}

// 選択された解析モード取得
function getSelectedAnalysisMode() {
    const selectedMode = document.querySelector('input[name="analysisMode"]:checked');
    return selectedMode ? selectedMode.value : 'general';
}

// 解析コンテキスト取得
function getAnalysisContext() {
    const contextElement = document.getElementById('analysisContext');
    return contextElement ? contextElement.value.trim() : '';
}

// 比較モード有効状態取得
function isComparisonEnabled() {
    const compareCheckbox = document.getElementById('enableImageCompare');
    return compareCheckbox ? compareCheckbox.checked : false;
}

// 比較モード切り替え
function toggleImageCompareMode() {
    const compareUpload = document.getElementById('compareImageUpload');
    const checkbox = document.getElementById('enableImageCompare');
    
    if (compareUpload && checkbox) {
        compareUpload.style.display = checkbox.checked ? 'block' : 'none';
        
        if (!checkbox.checked) {
            // 比較モード無効化時は比較画像をクリア
            analysisModuleState.selectedCompareImage = null;
            analysisModuleState.compareImageData = null;
            const comparePreview = document.getElementById('compareImagePreview');
            if (comparePreview) comparePreview.style.display = 'none';
            
            const compareFileInput = document.getElementById('compareImageFileInput');
            if (compareFileInput) compareFileInput.value = '';
        }
    }
}

// ===== OCR機能 =====

// テキスト抽出（OCR）
async function extractTextFromImage() {
    if (!analysisModuleState.selectedImageFile) {
        showNotification(ERROR_MESSAGES.noImageFile, 'error');
        return;
    }
    
    const ocrBtn = document.getElementById('ocrBtn');
    if (ocrBtn) ocrBtn.disabled = true;
    
    showProcessing('テキストを抽出中...');
    
    try {
        if (checkApiConfiguration()) {
            const prompt = `この画像に含まれているテキストをすべて正確に抽出してください。

【出力要件】
1. 画像内のテキストを完全に抽出
2. レイアウトや構造を可能な限り保持
3. 表やリストの構造も維持
4. 読み取れない部分は [判読不可] と記載
5. テキストが検出されない場合は「テキストが検出されませんでした」と明記

【出力形式】
抽出されたテキストをそのまま出力してください。`;
            
            const result = await callVisionAPI(prompt, analysisModuleState.currentImageData);
            
            hideProcessing();
            showOCRResult(result);
            
            // 履歴に保存
            imageAnalysisHistoryManager.add({
                fileName: analysisModuleState.selectedImageFile.name,
                mode: 'ocr',
                result: result,
                imageSize: analysisModuleState.selectedImageFile.size,
                type: 'ocr_extraction'
            });
            
        } else {
            await simulateProcessing();
            hideProcessing();
            
            const sampleResult = `📝 OCRテキスト抽出結果（サンプル）

抽出されたテキスト：
[サンプル表示]
実際のテキスト抽出にはAPIキーの設定が必要です。

【検出された要素】
- テキスト行数: [検出後に表示]
- 表やリスト: [検出後に表示]
- 言語: [自動検出]

💡 より正確な抽出にはAPIキーを設定してください。`;
            
            showOCRResult(sampleResult);
            showNotification('💡 実際のOCR機能にはAPIキーの設定が必要です', 'info');
        }
        
    } catch (error) {
        hideProcessing();
        console.error('❌ OCRエラー:', error);
        showNotification(`テキスト抽出エラー: ${error.message}`, 'error');
    } finally {
        if (ocrBtn) ocrBtn.disabled = false;
    }
}

// OCR結果表示
function showOCRResult(result) {
    const targetSection = document.getElementById('analysisSection');
    if (!targetSection) {
        console.error('❌ 解析セクションが見つかりません');
        return;
    }
    
    removeExistingResults(targetSection);

    const resultDiv = document.createElement('div');
    resultDiv.className = 'analysis-result ocr-result';
    
    resultDiv.innerHTML = `
        <div class="result-header">
            <div class="result-title">📝 OCRテキスト抽出結果</div>
            <div class="result-actions">
                <button class="copy-btn" onclick="copyToClipboard(\`${result.replace(/`/g, '\\`').replace(/\$/g, '\\)}\`)" title="抽出テキストをコピー">
                    📋 コピー
                </button>
                <button class="copy-btn" onclick="downloadOCRResult('${analysisModuleState.selectedImageFile?.name || 'extracted_text'}')" title="テキストファイルとしてダウンロード">
                    💾 保存
                </button>
                <button class="copy-btn" onclick="translateOCRText()" title="抽出テキストを翻訳">
                    🌍 翻訳
                </button>
            </div>
        </div>
        
        <div class="ocr-stats">
            <div class="stat-item">
                <span class="stat-label">文字数:</span>
                <span class="stat-value">${result.length}文字</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">行数:</span>
                <span class="stat-value">${result.split('\n').length}行</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">言語:</span>
                <span class="stat-value">${detectLanguage(result)}</span>
            </div>
        </div>
        
        <div class="ocr-content">
            <h4>抽出されたテキスト</h4>
            <div class="extracted-text">${formatOCRResult(result)}</div>
        </div>
        
        <div class="ocr-actions">
            <button class="action-btn" onclick="improveOCRAccuracy()" title="OCR精度を改善">
                ✨ 精度改善
            </button>
            <button class="action-btn" onclick="structureOCRText()" title="テキストを構造化">
                📋 構造化
            </button>
            <button class="action-btn" onclick="summarizeOCRText()" title="抽出テキストを要約">
                📄 要約
            </button>
        </div>
    `;
    
    targetSection.appendChild(resultDiv);
    scrollToResult(resultDiv);
    showNotification('テキスト抽出が完了しました', 'success');
}

// OCR結果のフォーマット
function formatOCRResult(result) {
    let formatted = escapeHtml(result);
    
    // 改行の処理
    formatted = formatted.replace(/\n/g, '<br>');
    
    // タブや複数スペースの処理
    formatted = formatted.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
    formatted = formatted.replace(/  /g, '&nbsp;&nbsp;');
    
    return formatted;
}

// 言語検出（簡易版）
function detectLanguage(text) {
    const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;
    const englishRegex = /[A-Za-z]/;
    const numberRegex = /[0-9]/;
    
    if (japaneseRegex.test(text)) {
        return '日本語';
    } else if (englishRegex.test(text)) {
        return '英語';
    } else if (numberRegex.test(text)) {
        return '数値';
    } else {
        return '不明';
    }
}

// ===== 解析結果表示 =====

// 解析結果表示
function showAnalysisResult(mode, result, isComparison = false) {
    const targetSection = document.getElementById('analysisSection');
    if (!targetSection) {
        console.error('❌ 解析セクションが見つかりません');
        showNotification('解析結果を表示できません', 'error');
        return;
    }
    
    removeExistingResults(targetSection);

    const modeInfo = ANALYSIS_MODES[mode] || ANALYSIS_MODES.general;
    const resultDiv = document.createElement('div');
    resultDiv.className = 'analysis-result';
    
    const comparisonLabel = isComparison ? '（比較解析）' : '';
    
    resultDiv.innerHTML = `
        <div class="result-header">
            <div class="result-title">${modeInfo.icon} ${modeInfo.name}結果${comparisonLabel}</div>
            <div class="result-actions">
                <button class="copy-btn" onclick="copyToClipboard(\`${result.replace(/`/g, '\\`').replace(/\$/g, '\\)}\`)" title="解析結果をコピー">
                    📋 コピー
                </button>
                <button class="copy-btn" onclick="shareAnalysisResult('${mode}')" title="解析結果を共有">
                    📤 共有
                </button>
                <button class="copy-btn" onclick="saveAnalysisReport('${mode}')" title="レポートとして保存">
                    💾 保存
                </button>
            </div>
        </div>
        
        <div class="analysis-metadata">
            <div class="metadata-row">
                <div class="metadata-item">
                    <span class="metadata-label">解析モード:</span>
                    <span class="metadata-value">${modeInfo.name}</span>
                </div>
                <div class="metadata-item">
                    <span class="metadata-label">ファイル名:</span>
                    <span class="metadata-value">${analysisModuleState.selectedImageFile?.name || '不明'}</span>
                </div>
                <div class="metadata-item">
                    <span class="metadata-label">解析時刻:</span>
                    <span class="metadata-value">${new Date().toLocaleString('ja-JP')}</span>
                </div>
            </div>
        </div>
        
        ${isComparison ? createComparisonImageDisplay() : createSingleImageDisplay()}
        
        <div class="analysis-content">
            <h4>📋 解析結果</h4>
            <div class="analysis-text">${formatAnalysisResult(result)}</div>
        </div>
        
        <div class="analysis-actions">
            <button class="action-btn" onclick="getDetailedAnalysis('${mode}')" title="より詳細な解析">
                🔍 詳細解析
            </button>
            <button class="action-btn" onclick="getSolutionSteps('${mode}')" title="具体的な解決手順">
                📝 解決手順
            </button>
            <button class="action-btn" onclick="getRelatedInfo('${mode}')" title="関連情報を取得">
                📚 関連情報
            </button>
            <button class="action-btn" onclick="regenerateAnalysis('${mode}')" title="解析を再実行">
                🔄 再解析
            </button>
        </div>
    `;
    
    targetSection.appendChild(resultDiv);
    scrollToResult(resultDiv);
    showNotification(SUCCESS_MESSAGES.imageAnalysisComplete, 'success');
}

// 単一画像表示作成
function createSingleImageDisplay() {
    return `
        <div class="analysis-image-display">
            <h4>📸 解析対象画像</h4>
            <div class="image-container">
                <img src="${analysisModuleState.currentImageData}" alt="解析対象画像" class="analysis-image">
            </div>
        </div>
    `;
}

// 比較画像表示作成
function createComparisonImageDisplay() {
    return `
        <div class="comparison-image-display">
            <h4>🔄 比較解析対象画像</h4>
            <div class="image-compare-container">
                <div class="compare-image-box">
                    <div class="compare-image-label">メイン画像</div>
                    <img src="${analysisModuleState.currentImageData}" alt="メイン画像" class="compare-image">
                </div>
                <div class="compare-image-box">
                    <div class="compare-image-label">比較画像</div>
                    <img src="${analysisModuleState.compareImageData}" alt="比較画像" class="compare-image">
                </div>
            </div>
        </div>
    `;
}

// 解析結果のフォーマット
function formatAnalysisResult(result) {
    let formatted = escapeHtml(result);
    
    // セクションヘッダーの処理
    formatted = formatted.replace(/^(【.*?】|##\s+.*|#\s+.*|\*\*.*?\*\*)/gm, '<h4 class="analysis-section-header">$1</h4>');
    
    // コードブロックの処理
    formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        return `<pre class="code-block"><code class="language-${lang || 'text'}">${code.trim()}</code></pre>`;
    });
    
    // インラインコードの処理
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    
    // 箇条書きの処理
    formatted = formatted.replace(/^[•\-*]\s+(.+)$/gm, '<li class="analysis-bullet">$1</li>');
    formatted = formatted.replace(/^(\s+)[•\-*]\s+(.+)$/gm, '<li class="analysis-sub-bullet">$2</li>');
    
    // リストタグで囲む
    formatted = formatted.replace(/(<li class="analysis-bullet">.*?<\/li>(?:\s*<li class="analysis-sub-bullet">.*?<\/li>)*\s*)+/gs, 
        '<ul class="analysis-list">        const mode = getSelectedAnalysisMode();
        const context = getAnalysisContext();</ul>');
    
    // 番号付きリストの処理
    formatted = formatted.replace(/^(\d+)\.\s+(.+)$/gm, '<li class="analysis-numbered">$2</li>');
    formatted = formatted.replace(/(<li class="analysis-numbered">.*<\/li>\s*)+/g, '<ol class="analysis-numbered-list">        const mode = getSelectedAnalysisMode();
        const context = getAnalysisContext();</ol>');
    
    // 改行の処理
    formatted = formatted.replace(/\n/g, '<br>');
    
    // 強調の処理
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="analysis-emphasis">$1</strong>');
    
    // 警告やヒントの処理
    formatted = formatted.replace(/⚠️(.*?)(?=<br>|$)/g, '<div class="analysis-warning">⚠️$1</div>');
    formatted = formatted.replace(/💡(.*?)(?=<br>|$)/g, '<div class="analysis-tip">💡$1</div>');
    
    return formatted;
}

// ===== 拡張機能 =====

// 詳細解析
async function getDetailedAnalysis(mode) {
    const resultCard = event.target.closest('.analysis-result');
    if (!resultCard) return;
    
    try {
        showProcessing('詳細解析を実行中...');
        
        if (checkApiConfiguration()) {
            const modeInfo = ANALYSIS_MODES[mode] || ANALYSIS_MODES.general;
            const prompt = `この画像についてより詳細で専門的な解析を行ってください。

【詳細解析の観点】
1. 技術的な詳細分析
2. 専門知識に基づく評価
3. 潜在的な問題の深掘り
4. 高度な改善提案
5. 業界標準との比較

特に${modeInfo.name}の観点から、初回解析では触れられなかった詳細な分析を提供してください。`;
            
            const detailedResult = await callVisionAPI(prompt, analysisModuleState.currentImageData);
            
            hideProcessing();
            
            // 詳細解析結果を表示
            const detailedDiv = document.createElement('div');
            detailedDiv.className = 'detailed-analysis';
            detailedDiv.innerHTML = `
                <div class="detailed-header">
                    <h4>🔍 詳細解析結果</h4>
                    <button class="copy-btn" onclick="copyToClipboard(\`${detailedResult.replace(/`/g, '\\`')}\`)">📋 コピー</button>
                </div>
                <div class="detailed-content">${formatAnalysisResult(detailedResult)}</div>
            `;
            
            resultCard.appendChild(detailedDiv);
            
        } else {
            hideProcessing();
            showNotification('詳細解析にはAPIキーの設定が必要です', 'info');
        }
        
    } catch (error) {
        hideProcessing();
        console.error('❌ 詳細解析エラー:', error);
        showNotification(`詳細解析エラー: ${error.message}`, 'error');
    }
}

// 解決手順生成
async function getSolutionSteps(mode) {
    const resultCard = event.target.closest('.analysis-result');
    if (!resultCard) return;
    
    try {
        showProcessing('解決手順を生成中...');
        
        if (checkApiConfiguration()) {
            const prompt = `この画像で特定された問題について、具体的で実行可能な解決手順を段階的に説明してください。

【解決手順の要件】
1. ステップバイステップの詳細な手順
2. 各手順での注意点や確認事項
3. 必要なツールやリソース
4. 代替手段や回避策
5. 完了確認の方法

初心者でも理解できるよう、丁寧で具体的な説明をお願いします。`;
            
            const solutionSteps = await callVisionAPI(prompt, analysisModuleState.currentImageData);
            
            hideProcessing();
            
            // 解決手順を表示
            const stepsDiv = document.createElement('div');
            stepsDiv.className = 'solution-steps';
            stepsDiv.innerHTML = `
                <div class="steps-header">
                    <h4>📝 解決手順</h4>
                    <button class="copy-btn" onclick="copyToClipboard(\`${solutionSteps.replace(/`/g, '\\`')}\`)">📋 コピー</button>
                </div>
                <div class="steps-content">${formatAnalysisResult(solutionSteps)}</div>
            `;
            
            resultCard.appendChild(stepsDiv);
            
        } else {
            hideProcessing();
            showNotification('解決手順生成にはAPIキーの設定が必要です', 'info');
        }
        
    } catch (error) {
        hideProcessing();
        console.error('❌ 解決手順生成エラー:', error);
        showNotification(`解決手順生成エラー: ${error.message}`, 'error');
    }
}

// 関連情報取得
async function getRelatedInfo(mode) {
    const resultCard = event.target.closest('.analysis-result');
    if (!resultCard) return;
    
    try {
        showProcessing('関連情報を検索中...');
        
        if (checkApiConfiguration()) {
            const modeInfo = ANALYSIS_MODES[mode] || ANALYSIS_MODES.general;
            const prompt = `この画像の内容に関連する有用な情報を提供してください。

【関連情報の内容】
1. 類似の問題や事例
2. 参考になるドキュメントや資料
3. 関連するベストプラクティス
4. 学習リソースや参考サイト
5. 専門コミュニティや支援情報

${modeInfo.name}の文脈で特に有用な情報を重点的に提供してください。`;
            
            const relatedInfo = await callOpenAIAPI('analysis', prompt);
            
            hideProcessing();
            
            // 関連情報を表示
            const infoDiv = document.createElement('div');
            infoDiv.className = 'related-info';
            infoDiv.innerHTML = `
                <div class="info-header">
                    <h4>📚 関連情報</h4>
                    <button class="copy-btn" onclick="copyToClipboard(\`${relatedInfo.replace(/`/g, '\\`')}\`)">📋 コピー</button>
                </div>
                <div class="info-content">${formatAnalysisResult(relatedInfo)}</div>
            `;
            
            resultCard.appendChild(infoDiv);
            
        } else {
            hideProcessing();
            showNotification('関連情報取得にはAPIキーの設定が必要です', 'info');
        }
        
    } catch (error) {
        hideProcessing();
        console.error('❌ 関連情報取得エラー:', error);
        showNotification(`関連情報取得エラー: ${error.message}`, 'error');
    }
}

// 解析再実行
async function regenerateAnalysis(mode) {
    if (!confirm('解析を再実行しますか？現在の結果は上書きされます。')) {
        return;
    }
    
    await analyzeImage();
}

// ===== サンプルデータ =====

// サンプル解析結果取得
function getSampleAnalysisResult(mode) {
    const samples = {
        'error': SAMPLE_RESPONSES.analysis.error_analysis,
        'software': `💻 ソフトウェア画面解析結果（サンプル）

**🎯 画面の内容**
- アプリケーション: [自動検出]
- 画面タイプ: [分析後表示]
- 主要な機能: [識別後表示]

**📋 操作ガイド**
1. [詳細な操作手順をここに表示]
2. [ショートカット情報]
3. [効率的な使用方法]

**💡 推奨事項**
- [使いやすさの向上案]
- [効率化のヒント]

💡 実際の詳細解析にはAPIキーの設定が必要です。`,
        
        'code': `🔧 コード解析結果（サンプル）

**📊 コード概要**
- 言語: [自動検出]
- 複雑度: [分析後表示]
- 品質スコア: [評価後表示]

**⚠️ 検出された問題**
1. [具体的な問題点]
2. [改善推奨箇所]

**✨ 改善提案**
\`\`\`
// 改善されたコード例
[具体的なコード改善案]
\`\`\`

💡 実際のコード解析にはAPIキーの設定が必要です。`,
        
        'ui': SAMPLE_RESPONSES.analysis.ui_analysis,
        
        'general': `🔍 一般画像解析結果（サンプル）

**📸 画像の内容**
- [画像の主要な内容]
- [重要な特徴点]
- [注目すべき要素]

**🎯 分析結果**
- [詳細な分析内容]
- [改善可能な点]
- [推奨される対応]

**💡 提案事項**
- [具体的な改善案]
- [参考情報]

💡 実際の詳細解析にはAPIキーの設定が必要です。`,
        
        'document': `📄 文書解析結果（サンプル）

**📋 文書の種類**
- [文書タイプの自動判定]
- [構造の分析]

**📝 主要な内容**
- [重要なポイント]
- [データや数値]

**🔍 改善提案**
- [読みやすさの向上]
- [構造の最適化]

💡 実際の文書解析にはAPIキーの設定が必要です。`,
        
        'security': `🔒 セキュリティ解析結果（サンプル）

**⚠️ セキュリティ評価**
- リスクレベル: [評価後表示]
- 脆弱性: [検出後表示]

**🛡️ 推奨対策**
1. [緊急対応事項]
2. [中長期的な対策]

**📋 チェックリスト**
- [セキュリティ確認項目]

💡 実際のセキュリティ解析にはAPIキーの設定が必要です。`
    };
    
    return samples[mode] || samples.general;
}

// ===== ユーティリティ関数 =====

// ファイルをBase64に変換
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// OCR結果をダウンロード
function downloadOCRResult(fileName) {
    const resultCard = event.target.closest('.ocr-result');
    if (!resultCard) return;
    
    const extractedText = resultCard.querySelector('.extracted-text').textContent;
    const textFileName = fileName.replace(/\.[^/.]+$/, "") + '_extracted.txt';
    
    downloadFile(extractedText, textFileName, 'text/plain');
    showNotification('テキストファイルをダウンロードしました', 'success');
}

// 解析レポート保存
function saveAnalysisReport(mode) {
    const resultCard = event.target.closest('.analysis-result');
    if (!resultCard) return;
    
    const modeInfo = ANALYSIS_MODES[mode] || ANALYSIS_MODES.general;
    const analysisText = resultCard.querySelector('.analysis-text').textContent;
    const fileName = analysisModuleState.selectedImageFile?.name || 'analysis';
    
    const reportContent = `HishoAI ${modeInfo.name}レポート
ファイル名: ${fileName}
解析日時: ${new Date().toLocaleString('ja-JP')}
解析モード: ${modeInfo.name}

===============================================

${analysisText}

===============================================
Generated by HishoAI Enhanced（買い切り完全版）`;
    
    const reportFileName = fileName.replace(/\.[^/.]+$/, "") + `_${mode}_report.txt`;
    
    downloadFile(reportContent, reportFileName, 'text/plain');
    showNotification('解析レポートを保存しました', 'success');
}

// 解析結果共有
function shareAnalysisResult(mode) {
    const resultCard = event.target.closest('.analysis-result');
    if (!resultCard) return;
    
    const modeInfo = ANALYSIS_MODES[mode] || ANALYSIS_MODES.general;
    const analysisText = resultCard.querySelector('.analysis-text').textContent;
    
    const shareText = `【HishoAI ${modeInfo.name}】

${analysisText.substring(0, 500)}...

#HishoAI #画像解析 #${modeInfo.name}`;
    
    if (navigator.share) {
        navigator.share({
            title: `HishoAI ${modeInfo.name}`,
            text: shareText
        }).catch(err => {
            console.log('共有がキャンセルされました');
        });
    } else {
        copyToClipboard(shareText);
        showNotification('解析結果をクリップボードにコピーしました', 'success');
    }
}

// 解析サンプル表示
function showAnalysisSample(mode) {
    const sampleResult = getSampleAnalysisResult(mode);
    showAnalysisResult(mode, sampleResult, false);
    showNotification('サンプル表示しました。実際の解析にはAPIキーが必要です', 'info');
}

// OCR関連の追加関数（グローバル）
window.improveOCRAccuracy = async function() {
    showNotification('OCR精度改善機能は開発中です', 'info');
};

window.structureOCRText = async function() {
    showNotification('テキスト構造化機能は開発中です', 'info');
};

window.summarizeOCRText = async function() {
    showNotification('OCRテキスト要約機能は開発中です', 'info');
};

window.translateOCRText = async function() {
    const resultCard = event.target.closest('.ocr-result');
    if (!resultCard) return;
    
    const extractedText = resultCard.querySelector('.extracted-text').textContent;
    
    // 翻訳セクションに移動してテキストを設定
    const translateInput = document.getElementById('translateInput');
    if (translateInput) {
        translateInput.value = extractedText;
        switchTab('translate');
        showNotification('翻訳セクションに移動しました', 'info');
    }
};

// ===== 初期化 =====
document.addEventListener('DOMContentLoaded', function() {
    // 画像解析機能の初期化
    if (UI_SETTINGS && UI_SETTINGS.debugMode) {
        console.log('🔍 画像解析機能を初期化中...');
    }
    
    // 履歴管理の初期化
    imageAnalysisHistoryManager.init();
    
    // 画像アップロード設定
    setupImageUpload();
    
    if (UI_SETTINGS && UI_SETTINGS.debugMode) {
        console.log('✅ 画像解析機能初期化完了（買い切り完全版）');
    }
});

// グローバルからアクセス可能にする
window.imageAnalysisHistoryManager = imageAnalysisHistoryManager;
window.analyzeImage = analyzeImage;
window.extractTextFromImage = extractTextFromImage;
window.handleImageFile = handleImageFile;
window.handleCompareImageFile = handleCompareImageFile;
window.removeImageFile = removeAnalysisImageFile;  // 名前を変更
window.toggleImageCompareMode = toggleImageCompareMode;
window.showAnalysisSample = showAnalysisSample;
window.getDetailedAnalysis = getDetailedAnalysis;
window.getSolutionSteps = getSolutionSteps;
window.getRelatedInfo = getRelatedInfo;
window.regenerateAnalysis = regenerateAnalysis;
window.downloadOCRResult = downloadOCRResult;
window.saveAnalysisReport = saveAnalysisReport;
window.shareAnalysisResult = shareAnalysisResult;