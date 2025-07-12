// ===================================================================
// HishoAI Enhanced - 買い切り完全版設定ファイル（既存機能完全保持・10000トークン対応版）
// ===================================================================
// 🔧 このファイルは初心者が触ってOKな設定ファイルです
// 🔧 APIキーやモデル設定を変更したい場合はここを編集してください
// ===================================================================

// ===== OpenAI API設定 =====
// 🤖 使用するAIモデルの設定（将来のモデル変更はここ1行だけでOK）
window.DEFAULT_MODEL = 'gpt-4o';  // ← モデル変更はここだけ！

// 📝 利用可能なモデル一覧（参考）
// - 'gpt-4o'          : 最新の高性能モデル（Vision対応）
// - 'gpt-4'           : 高精度モデル
// - 'gpt-3.5-turbo'   : 高速・低コストモデル
// - 'gpt-4-turbo'     : バランス型モデル

// 🔑 APIキーの初期化（後でApiKeyManagerが管理）
window.OPENAI_API_KEY = '';

// APIキーの初期読み込み（安全に実行）
(function initializeApiKey() {
   try {
       const savedKey = localStorage.getItem('hishoai_openai_key');
       if (savedKey && savedKey.startsWith('sk-')) {
           window.OPENAI_API_KEY = savedKey;
           console.log('✅ 初期APIキー読み込み成功');
       } else if (savedKey) {
           console.warn('⚠️ 無効なAPIキー形式を検出、削除します');
           localStorage.removeItem('hishoai_openai_key');
       }
   } catch (error) {
       console.warn('⚠️ ローカルストレージからのAPIキー読み込みに失敗:', error.message);
   }
})();

// ===== AI機能の設定（既存機能保持・翻訳のみ強化） =====
// 🌡️ AI応答の創造性レベル（0.0 = 保守的、1.0 = 創造的）
window.AI_TEMPERATURE = {
   translation: 0.2,    // 翻訳：超高精度重視（0.3→0.2 長文一貫性強化）
   correction: 0.2,     // 校正：厳密性重視
   office: 0.3,         // Office支援：実用性重視
   vision: 0.3,         // Vision解析：正確性重視
   summary: 0.4,        // 要約：バランス重視
   transcript: 0.1,     // 音声文字起こし：超正確性重視
   analysis: 0.2,       // 画像解析：正確性重視
   general: 0.7         // 一般対話：創造性重視
};

// 📊 AI応答の最大文字数制限（翻訳のみ10000トークンに拡張）
window.MAX_TOKENS = {
   translation: 10000,  // 翻訳：業界最大級（1000→10000 長文対応強化）
   correction: 1200,    // 校正
   office: 1500,        // Office支援
   vision: 1500,        // Vision解析
   summary: 800,        // 要約
   transcript: 2000,    // 音声文字起こし（長文対応）
   analysis: 1800,      // 画像解析（詳細分析対応）
   general: 1000        // 一般
};

// ===== 音声処理設定 =====
// 🎤 Whisper API用設定
window.AUDIO_SETTINGS = {
   // サポートする音声ファイル形式
   supportedFormats: [
       'audio/mpeg',       // .mp3
       'audio/wav',        // .wav
       'audio/mp4',        // .m4a
       'audio/webm',       // .webm
       'audio/ogg',        // .ogg
       'audio/flac'        // .flac
   ],
   
   // ファイルサイズ制限（MB）
   maxFileSize: 25,     // OpenAI Whisper APIの制限
   
   // 処理言語設定
   defaultLanguage: 'ja',  // 日本語をデフォルト
   
   // 出力形式設定
   responseFormat: 'verbose_json',  // タイムスタンプ付き詳細出力
   
   // AI温度設定
   temperature: 0.1     // 音声認識の正確性重視
};

// ===== 画像解析設定 =====
// 🖼️ Vision API用設定
window.IMAGE_SETTINGS = {
   // サポートする画像ファイル形式
   supportedFormats: [
       'image/jpeg',       // .jpg, .jpeg
       'image/png',        // .png
       'image/webp',       // .webp
       'image/gif'         // .gif
   ],
   
   // ファイルサイズ制限（MB）
   maxFileSize: 20,     // Vision APIの推奨制限
   
   // 画像解析の詳細レベル
   detail: 'high',      // 'low' | 'high' | 'auto'
   
   // 解析モード設定
   analysisMode: {
       error: 'エラー画面の解析と解決策提案',
       software: 'ソフトウェア画面の使い方説明',
       code: 'コード画面のバグ検出と修正提案',
       ui: 'UI/UX改善提案',
       office: 'Office画面の操作支援',
       general: '一般的な画面解析'
   }
};

// ===== スクリーンショット貼り付け設定 =====
// 📷 Clipboard API用設定
window.SCREENSHOT_SETTINGS = {
   // サポートする貼り付け形式
   supportedClipboardTypes: [
       'image/png',        // スクリーンショット標準形式
       'image/jpeg',       // JPEG画像
       'image/webp',       // WebP画像
       'image/gif'         // GIF画像
   ],
   
   // 貼り付け画像の自動リサイズ設定
   autoResize: {
       enabled: true,          // 自動リサイズを有効化
       maxWidth: 1920,         // 最大幅（px）
       maxHeight: 1080,        // 最大高さ（px）
       quality: 0.9           // JPEG品質（0.1-1.0）
   },
   
   // プレビュー表示設定
   preview: {
       maxDisplayWidth: 600,   // プレビュー最大表示幅
       maxDisplayHeight: 400,  // プレビュー最大表示高さ
       showFileName: true,     // ファイル名表示
       showFileSize: true      // ファイルサイズ表示
   },
   
   // Vision API連携設定
   visionIntegration: {
       enabled: true,              // Vision API連携を有効化
       defaultPrompt: 'この画像について詳しく分析してください。',
       contextualPrompts: {
           office: 'この Office アプリケーションの画面について、操作方法や解決策を教えてください。',
           error: 'このエラー画面の内容を分析し、原因と解決策を提案してください。',
           code: 'このコード画面を分析し、問題点や改善案を提案してください。',
           ui: 'このユーザーインターフェースの改善点を分析してください。'
       }
   }
};

// ===== UI設定 =====
// 🎨 アプリケーションのテーマ設定
window.UI_SETTINGS = {
   // 通知の自動消去時間（ミリ秒）
   notificationDuration: 5000,
   
   // プロセシング表示のアニメーション速度
   processingDelay: 1500,
   
   // モーダルのアニメーション速度
   modalAnimationSpeed: 300,
   
   // デバッグモード（true = 詳細ログ表示）
   debugMode: true,
   
   // APIキー管理の設定
   apiKeyValidation: {
       minLength: 40,          // 最小文字数
       maxLength: 60,          // 最大文字数
       prefix: 'sk-',          // 必須プレフィックス
       testTimeout: 10000      // テストタイムアウト（ミリ秒）
   },
   
   // スクリーンショット貼り付けUI設定
   screenshotPaste: {
       showSuccessAnimation: true,     // 成功時のアニメーション表示
       highlightDropZone: true,        // ドロップゾーンのハイライト表示
       autoFocusTextarea: true,        // 貼り付け後に質問エリアにフォーカス
       showPreviewThumbnail: true,     // サムネイルプレビュー表示
       enableKeyboardShortcuts: true   // キーボードショートカット有効化
   }
};

// ===== 言語設定 =====
// 🌍 翻訳対応言語の定義
window.SUPPORTED_LANGUAGES = {
   'en': {
       name: '英語',
       flag: '🇺🇸',
       code: 'en'
   },
   'zh': {
       name: '中国語',
       flag: '🇨🇳',
       code: 'zh'
   },
   'ko': {
       name: '韓国語',
       flag: '🇰🇷',
       code: 'ko'
   },
   'ja': {
       name: '日本語',
       flag: '🇯🇵',
       code: 'ja'
   }
};

// ===== サンプルデータ設定 =====
window.SAMPLE_RESPONSES = {
   translation: {
       'en': 'Hello! This is a sample AI translation. To use real translation, please set up your OpenAI API key in the settings.',
       'zh': '你好！这是示例AI翻訳。要使用真实翻訳，请在设置中配置您的OpenAI API密钥。',
       'ko': '안녕하세요! 이것은 샘플 AI 번역입니다. 실제 번역을 사용하려면 설정에서 OpenAI API 키를 설정해주세요.',
       'ja': 'こんにちは！これはサンプルAI翻訳です。実際の翻訳を使用するには、設定でOpenAI APIキーを設定してください。'
   },
   
   transcript: {
       text: `🎤 音声文字起こし（サンプル結果）

【タイムスタンプ付き】
[00:00] こんにちは、今日の会議を始めさせていただきます。
[00:05] まず最初に、前回の議事録の確認をお願いします。
[00:12] 売上については、前月比で15％の増加となっております。
[00:20] 次に、新しいプロジェクトについて説明いたします。

【要約】
- 会議開始の挨拶
- 前回議事録の確認依頼
- 売上報告（前月比15%増）
- 新プロジェクトの説明予告

💡 実際の音声文字起こしには、API設定でOpenAIキーを設定してください。`
   },
   
   analysis: {
       error_analysis: `🔍 画像解析結果（サンプル）

**🎯 検出された問題**
- エラーコード: TypeError: Cannot read property 'length' of undefined
- 発生箇所: script.js 行125
- エラータイプ: JavaScript実行時エラー

**📋 問題の詳細分析**
1. **原因**: 変数が undefined の状態で length プロパティにアクセス
2. **影響範囲**: ページの一部機能が停止
3. **緊急度**: 中程度（機能不全だが回避可能）

**🛠️ 解決策**
\`\`\`javascript
// 修正前（エラーの原因）
if (data.length > 0) {
   // 処理
}

// 修正後（安全な書き方）
if (data && data.length > 0) {
   // 処理
}
\`\`\`

**📝 予防策**
- データ存在チェックを必ず実装
- TypeScriptの導入を検討
- デバッガーツールの活用

💡 実際の画像解析には、API設定でOpenAIキーを設定してください。`,

       office_analysis: `💼 Office画面解析結果（サンプル）

**🎯 画面の内容**
- アプリケーション: Microsoft Excel
- 画面タイプ: データ入力・分析画面
- 現在の状況: グラフ作成中

**📋 検出された操作・問題点**
1. **データ範囲**: A1:E10の範囲が選択されています
2. **グラフタイプ**: 棒グラフが挿入されています
3. **可能な改善**: タイトルとラベルの追加が必要

**🛠️ 推奨される操作手順**
1. **グラフタイトルの追加**
  - グラフを選択
  - 「グラフツール」→「デザイン」→「グラフ要素を追加」
  - 「グラフタイトル」を選択

2. **軸ラベルの設定**
  - 「グラフ要素を追加」→「軸ラベル」
  - 横軸・縦軸それぞれに適切なラベルを設定

3. **データラベルの表示**
  - 「グラフ要素を追加」→「データラベル」
  - 必要に応じて値を表示

**💡 便利なショートカット**
- F11: グラフを別シートに移動
- Ctrl+1: 選択要素の書式設定
- Alt+F1: 標準グラフを挿入

💡 実際の画面解析には、API設定でOpenAIキーを設定してください。`,

       ui_analysis: `🎨 UI/UX解析結果（サンプル）

**🎯 デザイン評価**
- 全体的な印象: モダンでクリーン
- 配色: ブルー系統で統一感あり
- レイアウト: グリッドベースで整理されている

**⚠️ 改善点**
1. **コントラスト**: 一部テキストが背景に対して薄い
2. **ボタン配置**: CTAボタンがやや小さい
3. **余白**: モバイル表示で詰まって見える

**✨ 改善提案**
- ボタンサイズを1.5倍に拡大
- テキストカラーを#333に変更
- モバイル時のパディングを20pxに調整

**📊 アクセシビリティスコア**
- 現在: 78/100
- 改善後（予測）: 92/100

💡 実際のUI/UX解析には、API設定でOpenAIキーを設定してください。`
   },
   
   office: `💼 Office操作のヒント

**💡 一般的な解決方法:**
- F1キーでヘルプを開く
- リボンの検索ボックスに機能名を入力
- 右クリックメニューを確認
- Ctrl+Zで操作を元に戻す

**📚 より詳しい回答を得るには:**
API設定で OpenAI キーを設定すると、具体的で詳細な解決策を提供できます。
また、スクリーンショットを貼り付けることで、より正確な回答を得られます。`
};

// ===== エラーメッセージ設定 =====
window.ERROR_MESSAGES = {
   noApiKey: 'APIキーが設定されていません。設定画面からAPIキーを入力してください。',
   invalidApiKey: '無効なAPIキーです。正しいAPIキーを入力してください。',
   networkError: 'ネットワークエラーが発生しました。インターネット接続を確認してください。',
   rateLimitError: 'API利用制限に達しています。しばらく時間をおいて再試行してください。',
   emptyInput: '入力内容が空です。テキストを入力してください。',
   processingError: '処理中にエラーが発生しました。再試行してください。',
   
   // 音声処理用エラー
   noAudioFile: '音声ファイルを選択してください。',
   unsupportedFormat: 'サポートされていない音声形式です。MP3、WAV、M4A、WEBM、OGG、FLACファイルを選択してください。',
   fileTooLarge: 'ファイルサイズが大きすぎます。25MB以下のファイルを選択してください。',
   audioProcessingError: '音声処理中にエラーが発生しました。ファイル形式を確認して再試行してください。',
   
   // 画像解析用エラー
   noImageFile: '画像ファイルを選択してください。',
   unsupportedImageFormat: 'サポートされていない画像形式です。JPEG、PNG、WEBP、GIFファイルを選択してください。',
   imageTooLarge: 'ファイルサイズが大きすぎます。20MB以下のファイルを選択してください。',
   imageProcessingError: '画像解析中にエラーが発生しました。ファイル形式を確認して再試行してください。',
   
   // スクリーンショット関連エラー
   clipboardAccessDenied: 'クリップボードへのアクセスが拒否されました。ブラウザの設定を確認してください。',
   noImageInClipboard: 'クリップボードに画像データが見つかりません。',
   clipboardReadError: 'クリップボードの読み取りに失敗しました。',
   pasteNotSupported: 'このブラウザでは貼り付け機能がサポートされていません。'
};

// ===== 成功メッセージ設定 =====
window.SUCCESS_MESSAGES = {
   apiKeySaved: '🎉 APIキーが保存されました！すべての機能が利用可能です',
   translationComplete: '翻訳が完了しました',
   correctionComplete: '校正が完了しました',
   summaryComplete: '要約が完了しました',
   officeHelpComplete: '解決策を表示しました',
   copySuccess: 'クリップボードにコピーしました',
   appStarted: '🤖 HishoAI Enhanced が起動しました！',
   
   // 音声処理用成功メッセージ
   transcriptComplete: '音声文字起こしが完了しました',
   audioUploaded: '音声ファイルがアップロードされました',
   
   // 画像解析用成功メッセージ
   imageAnalysisComplete: '画像解析が完了しました',
   imageUploaded: '画像ファイルがアップロードされました',
   
   // スクリーンショット関連成功メッセージ
   screenshotPasted: '📷 スクリーンショットが貼り付けられました',
   
   // その他
   historySaved: '履歴に保存しました',
   exportComplete: 'エクスポートが完了しました'
};

// ===== API通信設定 =====
window.API_CONFIG = {
   baseUrl: 'https://api.openai.com/v1',
   timeout: 30000,  // 30秒でタイムアウト
   maxRetries: 3    // 最大3回まで再試行
};

// ===== セキュリティ設定 =====
window.SECURITY_CONFIG = {
   sanitizeInput: true,        // 入力のサニタイズ
   maxInputLength: 10000,      // 最大入力文字数
   allowedFileTypes: [         // 許可するファイルタイプ
       ...window.AUDIO_SETTINGS.supportedFormats,
       ...window.IMAGE_SETTINGS.supportedFormats,
       ...window.SCREENSHOT_SETTINGS.supportedClipboardTypes
   ],
   apiKeyMasking: true,        // APIキーのマスク表示
   secureStorage: true         // 安全なストレージ使用
};

// ===== 設定の検証 =====
function validateConfig() {
   const errors = [];
   const warnings = [];
   
   console.log('🔍 設定を検証中...');
   
   // モデル名の検証
   if (!window.DEFAULT_MODEL || typeof window.DEFAULT_MODEL !== 'string') {
       errors.push('Invalid model configuration');
   }
   
   // 温度設定の検証
   Object.entries(window.AI_TEMPERATURE).forEach(([key, value]) => {
       if (value < 0 || value > 1) {
           errors.push(`Invalid temperature for ${key}: ${value}`);
       }
   });
   
   // ファイルサイズ制限の検証
   if (window.AUDIO_SETTINGS.maxFileSize <= 0 || window.AUDIO_SETTINGS.maxFileSize > 50) {
       warnings.push('Audio file size limit seems unusual');
   }
   
   if (window.IMAGE_SETTINGS.maxFileSize <= 0 || window.IMAGE_SETTINGS.maxFileSize > 50) {
       warnings.push('Image file size limit seems unusual');
   }
   
   // Clipboard API の利用可能性チェック
   if (!navigator.clipboard) {
       warnings.push('Clipboard API is not available - screenshot paste may not work');
   }
   
   // 結果の出力
   if (errors.length > 0) {
       console.error('❌ Config validation errors:', errors);
       return false;
   }
   
   if (warnings.length > 0) {
       console.warn('⚠️ Config validation warnings:', warnings);
   }
   
   console.log('✅ Config validation passed');
   return true;
}

// ===== 初期化実行 =====
(function initialize() {
   console.log(`🚀 HishoAI Enhanced Config loaded`);
   console.log(`📊 Model: ${window.DEFAULT_MODEL}`);
   console.log(`🔑 API Key: ${window.OPENAI_API_KEY ? '設定済み' : '未設定'}`);
   console.log(`📱 Version: 4.0 Complete（買い切り完全版）`);
   console.log(`🌍 Translation Max Tokens: ${window.MAX_TOKENS.translation} (業界最大級)`);
   
   // 設定の検証実行
   const configValid = validateConfig();
   
   // デバッグモードの場合、詳細情報を表示
   if (window.UI_SETTINGS.debugMode) {
       console.log('🔍 設定詳細:', {
           temperatures: window.AI_TEMPERATURE,
           maxTokens: window.MAX_TOKENS,
           audioSettings: window.AUDIO_SETTINGS,
           imageSettings: window.IMAGE_SETTINGS,
           screenshotSettings: window.SCREENSHOT_SETTINGS,
           uiSettings: window.UI_SETTINGS,
           supportedLanguages: window.SUPPORTED_LANGUAGES
       });
   }
   
   console.log('✅ 設定の初期化が完了しました（既存機能完全保持・10000トークン対応版）');
})();
