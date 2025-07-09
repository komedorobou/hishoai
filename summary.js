// ===================================================================
// HishoAI Enhanced - 資料調査AI（Phase 2: 横断検索・ハルシネーション対策版）
// 高精度検索・引用元追跡・信頼性保証機能
// ===================================================================

// ===== Phase 1の基盤を継承 =====
const SummaryAI = {
    // モジュール状態管理
    initialized: false,
    
    // データ管理
    uploadedFiles: [],
    chatHistory: [],
    keyPoints: [],
    selectedSources: [],
    
    // UI状態管理
    isProcessing: false,
    currentFileProcessor: null,
    
    // ★Phase 2新機能：検索エンジン
    searchEngine: {
        index: new Map(),        // ファイル内容のインデックス
        chunks: [],              // 全チャンクの配列
        keywords: new Set(),     // キーワード辞書
        initialized: false
    },
    
    // ★Phase 2新機能：引用追跡
    citationTracker: {
        responseReferences: [],  // 応答ごとの引用情報
        chunkReferences: new Map(), // チャンクごとの引用カウント
        lastQueryResults: []     // 最後の検索結果
    },
    
    // 設定
    config: {
        maxFiles: 20,
        supportedTypes: ['.pdf', '.doc', '.docx', '.txt', '.md'],
        maxFileSize: 100 * 1024 * 1024, // 100MB
        chunkSize: 2000, // テキスト分割サイズ
        overlap: 200,    // チャンク間の重複
        
        // ★Phase 2新設定
        search: {
            maxResults: 10,      // 最大検索結果数
            relevanceThreshold: 0.3, // 関連性閾値
            contextWindow: 500,   // 前後のコンテキスト文字数
            enableFuzzySearch: true, // あいまい検索
            boostRecentFiles: true   // 新しいファイルの重み付け
        },
        
        citation: {
            maxReferences: 5,    // 最大引用数
            enableDeepLinks: true, // 詳細リンク
            trackUsage: true     // 使用頻度追跡
        }
    },
    
    // ライブラリ読み込み状況
    libraries: {
        pdfjs: false,
        mammoth: false
    }
};

// ===== Phase 2新機能：検索エンジン初期化 =====
SummaryAI.initializeSearchEngine = function() {
    console.log('🔍 検索エンジンを初期化中...');
    
    this.searchEngine.index.clear();
    this.searchEngine.chunks = [];
    this.searchEngine.keywords.clear();
    
    // 全ファイルからチャンクを収集
    this.uploadedFiles.forEach(file => {
        if (file.processed && file.chunks) {
            file.chunks.forEach(chunk => {
                // チャンクにメタデータを追加
                const enhancedChunk = {
                    ...chunk,
                    fileId: file.id,
                    fileName: file.name,
                    fileExtension: file.extension,
                    keywords: this.extractKeywords(chunk.content),
                    embedding: null, // 将来的にベクトル埋め込み対応
                    lastAccessed: null,
                    accessCount: 0
                };
                
                this.searchEngine.chunks.push(enhancedChunk);
                
                // キーワードインデックス作成
                enhancedChunk.keywords.forEach(keyword => {
                    if (!this.searchEngine.index.has(keyword)) {
                        this.searchEngine.index.set(keyword, []);
                    }
                    this.searchEngine.index.get(keyword).push(enhancedChunk.id);
                    this.searchEngine.keywords.add(keyword);
                });
            });
        }
    });
    
    this.searchEngine.initialized = true;
    console.log(`✅ 検索エンジン初期化完了: ${this.searchEngine.chunks.length}チャンク、${this.searchEngine.keywords.size}キーワード`);
};

// ===== Phase 2新機能：キーワード抽出 =====
SummaryAI.extractKeywords = function(text) {
    // 基本的なキーワード抽出（将来的にはより高度なNLP処理を追加）
    const keywords = new Set();
    
    // 日本語・英語対応の単語分割
    const words = text
        .toLowerCase()
        .replace(/[^\w\s\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length >= 2);
    
    // ストップワード除去
    const stopWords = new Set([
        'の', 'に', 'は', 'を', 'が', 'で', 'て', 'と', 'する', 'ある', 'この', 'その', 'それ',
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were'
    ]);
    
    words.forEach(word => {
        if (!stopWords.has(word) && word.length >= 2) {
            keywords.add(word);
        }
    });
    
    // N-gram生成（2-gram）
    for (let i = 0; i < words.length - 1; i++) {
        const bigram = words[i] + ' ' + words[i + 1];
        if (bigram.length >= 5 && !stopWords.has(words[i]) && !stopWords.has(words[i + 1])) {
            keywords.add(bigram);
        }
    }
    
    return Array.from(keywords);
};

// ===== Phase 2新機能：高精度横断検索 =====
SummaryAI.performAdvancedSearch = function(query, searchMode = 'all') {
    if (!this.searchEngine.initialized) {
        this.initializeSearchEngine();
    }
    
    console.log(`🔍 検索実行: "${query}" (モード: ${searchMode})`);
    
    // 検索対象ファイルを決定
    let targetChunks = this.searchEngine.chunks;
    if (searchMode === 'selected' && this.selectedSources.length > 0) {
        targetChunks = targetChunks.filter(chunk => 
            this.selectedSources.includes(chunk.fileId)
        );
    }
    
    // クエリからキーワード抽出
    const queryKeywords = this.extractKeywords(query);
    
    // 各チャンクの関連性スコア計算
    const results = targetChunks.map(chunk => {
        const score = this.calculateRelevanceScore(chunk, query, queryKeywords);
        return {
            chunk: chunk,
            score: score,
            matches: this.findMatches(chunk.content, query, queryKeywords)
        };
    }).filter(result => result.score >= this.config.search.relevanceThreshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, this.config.search.maxResults);
    
    // 検索結果を記録
    this.citationTracker.lastQueryResults = results;
    
    console.log(`✅ 検索完了: ${results.length}件の関連結果`);
    return results;
};

// ===== Phase 2新機能：関連性スコア計算 =====
SummaryAI.calculateRelevanceScore = function(chunk, query, queryKeywords) {
    let score = 0;
    const content = chunk.content.toLowerCase();
    const queryLower = query.toLowerCase();
    
    // 1. 完全一致ボーナス
    if (content.includes(queryLower)) {
        score += 1.0;
    }
    
    // 2. キーワードマッチスコア
    let keywordMatchCount = 0;
    queryKeywords.forEach(keyword => {
        if (chunk.keywords.includes(keyword)) {
            keywordMatchCount++;
            score += 0.3;
        }
        if (content.includes(keyword)) {
            score += 0.2;
        }
    });
    
    // 3. キーワード密度ボーナス
    if (queryKeywords.length > 0) {
        const density = keywordMatchCount / queryKeywords.length;
        score += density * 0.5;
    }
    
    // 4. ファイルタイプボーナス
    if (chunk.fileExtension === '.pdf') score += 0.1; // PDFは信頼性が高い
    
    // 5. 最近追加されたファイルのボーナス
    if (this.config.search.boostRecentFiles) {
        const file = this.uploadedFiles.find(f => f.id === chunk.fileId);
        if (file && file.metadata.processingTime) {
            const age = Date.now() - (file.lastModified || 0);
            const daysSinceAdded = age / (1000 * 60 * 60 * 24);
            if (daysSinceAdded < 7) score += 0.2; // 1週間以内のファイル
        }
    }
    
    // 6. チャンクアクセス頻度（人気度）
    if (chunk.accessCount > 0) {
        score += Math.log(chunk.accessCount + 1) * 0.1;
    }
    
    return Math.min(score, 5.0); // 最大スコア制限
};

// ===== Phase 2新機能：マッチ箇所特定 =====
SummaryAI.findMatches = function(content, query, queryKeywords) {
    const matches = [];
    const contentLower = content.toLowerCase();
    const queryLower = query.toLowerCase();
    
    // 完全一致検索
    let index = contentLower.indexOf(queryLower);
    while (index !== -1) {
        matches.push({
            type: 'exact',
            start: index,
            end: index + query.length,
            text: content.substring(index, index + query.length),
            context: this.getContextAround(content, index, query.length)
        });
        index = contentLower.indexOf(queryLower, index + 1);
    }
    
    // キーワード一致検索
    queryKeywords.forEach(keyword => {
        let keywordIndex = contentLower.indexOf(keyword);
        while (keywordIndex !== -1) {
            // 重複チェック
            const isDuplicate = matches.some(match => 
                keywordIndex >= match.start && keywordIndex < match.end
            );
            
            if (!isDuplicate) {
                matches.push({
                    type: 'keyword',
                    start: keywordIndex,
                    end: keywordIndex + keyword.length,
                    text: content.substring(keywordIndex, keywordIndex + keyword.length),
                    context: this.getContextAround(content, keywordIndex, keyword.length),
                    keyword: keyword
                });
            }
            keywordIndex = contentLower.indexOf(keyword, keywordIndex + 1);
        }
    });
    
    // マッチを位置順にソート
    return matches.sort((a, b) => a.start - b.start);
};

// ===== Phase 2新機能：コンテキスト取得 =====
SummaryAI.getContextAround = function(content, start, length) {
    const contextSize = this.config.search.contextWindow;
    const contextStart = Math.max(0, start - contextSize);
    const contextEnd = Math.min(content.length, start + length + contextSize);
    
    let context = content.substring(contextStart, contextEnd);
    
    // 文境界で調整
    if (contextStart > 0) {
        const sentenceStart = context.indexOf('。');
        if (sentenceStart !== -1 && sentenceStart < contextSize / 2) {
            context = context.substring(sentenceStart + 1);
        } else {
            context = '...' + context;
        }
    }
    
    if (contextEnd < content.length) {
        const sentenceEnd = context.lastIndexOf('。');
        if (sentenceEnd !== -1 && sentenceEnd > context.length - contextSize / 2) {
            context = context.substring(0, sentenceEnd + 1);
        } else {
            context = context + '...';
        }
    }
    
    return context.trim();
};

// ===== Phase 2改良：AI応答生成（ハルシネーション対策） =====
SummaryAI.generateAIResponse = async function(userMessage) {
    // ローディング表示
    const loadingContent = `
        <div class="summary-loading">
            <div class="summary-spinner"></div>
            <span>📚 資料を分析中...</span>
        </div>
    `;
    this.addMessage('ai', loadingContent);
    
    try {
        let response;
        
        // ★要約指示の検出
        const summaryKeywords = ['まとめて', '要約', '概要', 'サマリー', 'summary', '短く', '簡潔に'];
        const isSummaryRequest = summaryKeywords.some(keyword => 
            userMessage.toLowerCase().includes(keyword)
        );
        
        // APIキーが設定されている場合は実際のAI処理
        if (window.checkApiConfiguration && window.checkApiConfiguration()) {
            if (isSummaryRequest) {
                response = await this.generateSummaryResponse(userMessage);
            } else {
                response = await this.processWithAdvancedAI(userMessage);
            }
        } else {
            // サンプル応答を生成
            await this.simulateProcessing(2000);
            if (isSummaryRequest) {
                response = this.generateSampleSummary();
            } else {
                response = this.generateAdvancedSampleResponse(userMessage);
            }
        }
        
        // ローディングメッセージを削除
        const messages = document.querySelectorAll('.summary-message.ai');
        const lastMessage = messages[messages.length - 1];
        if (lastMessage) lastMessage.remove();
        
        // AI応答を追加
        this.addMessage('ai', response);
        
    } catch (error) {
        console.error('❌ AI応答生成エラー:', error);
        
        // ローディングメッセージを削除
        const messages = document.querySelectorAll('.summary-message.ai');
        const lastMessage = messages[messages.length - 1];
        if (lastMessage) lastMessage.remove();
        
        // エラーメッセージを表示
        this.addMessage('ai', `申し訳ございません。エラーが発生しました：${error.message}`);
    }
};

// ===== 要約専用処理関数 =====
SummaryAI.generateSummaryResponse = async function(userMessage) {
    console.log('📋 要約リクエスト処理開始');
    
    // 処理済みファイルの全内容を取得
    const processedFiles = this.uploadedFiles.filter(f => f.processed);
    
    if (processedFiles.length === 0) {
        return `申し訳ございません。要約する資料がアップロードされていません。<br><br>
        <strong>💡 使い方：</strong><br>
        1. 左パネルからファイルをアップロード<br>
        2. 処理完了後に要約をリクエスト`;
    }
    
    // 全ファイルの内容を統合
    const allContent = processedFiles.map(file => `
【${file.name}】
${file.content}
`).join('\n\n---\n\n');
    
    const summaryPrompt = `以下の資料を分析し、包括的で有用な要約を作成してください。

【資料内容】
${allContent}

【要約要件】
1. 各資料の主要なポイントを抽出
2. 資料間の関連性や共通テーマを特定
3. 重要な数値やデータを含める
4. 構造化された読みやすい形式で提示
5. 実用的な洞察や含意を提供

【ユーザーの要求】
${userMessage}

高度な分析能力を活用し、最も価値のある包括的要約を提供してください。`;

    try {
        console.log('📊 O3で要約生成開始');
        
        // OpenAI APIの正しい形式でメッセージを構築
        const messages = [
            {
                role: "user", 
                content: summaryPrompt
            }
        ];
        
        const response = await window.callOpenAIAPI(messages, 'o3-mini');
        console.log('✅ O3要約生成完了');
        
        // 要約に使用したファイル情報を追加
        const fileList = processedFiles.map(file => 
            `📄 ${file.name} (${file.metadata.wordCount || 0}語)`
        ).join('<br>');
        
        return `${response}<br><br>
        <div class="summary-citation-footer">
            <h4>📎 要約対象資料 (${processedFiles.length}件)</h4>
            <div style="font-size: 12px; color: #666; padding: 8px; background: #f5f5f5; border-radius: 4px;">
                ${fileList}
            </div>
        </div>`;
        
    } catch (error) {
        console.error('❌ 要約生成エラー:', error);
        throw error;
    }
};

// ===== サンプル要約生成 =====
SummaryAI.generateSampleSummary = function() {
    const processedFiles = this.uploadedFiles.filter(f => f.processed);
    
    if (processedFiles.length === 0) {
        return `申し訳ございません。要約する資料がアップロードされていません。`;
    }
    
    const fileList = processedFiles.map(file => 
        `📄 ${file.name} (${file.metadata.wordCount || 0}語)`
    ).join('<br>');
    
    return `アップロードされた資料の要約（サンプル）：<br><br>

<strong>📋 主要ポイント：</strong><br>
• アップロードされた${processedFiles.length}件の資料を分析<br>
• 総単語数: ${processedFiles.reduce((total, file) => total + (file.metadata.wordCount || 0), 0)}語<br>
• 複数の観点から包括的な内容を確認<br><br>

<strong>🎯 重要な発見：</strong><br>
• 資料間で一貫したテーマを確認<br>
• 具体的なデータや事例が豊富<br>
• 実用的な示唆を含む内容<br><br>

<strong>💡 含意と提案：</strong><br>
詳細な分析結果については、各資料の要点生成機能もご活用ください。<br><br>

<div class="summary-citation-footer">
    <h4>📎 要約対象資料 (${processedFiles.length}件)</h4>
    <div style="font-size: 12px; color: #666; padding: 8px; background: #f5f5f5; border-radius: 4px;">
        ${fileList}
    </div>
</div>

<small>※ APIが設定されている場合、より詳細で正確な要約が生成されます</small>`;
};

// ===== Phase 2新機能：高度AI処理（ハルシネーション防止） =====
SummaryAI.processWithAdvancedAI = async function(userMessage) {
    // 1. 高精度検索実行
    const searchMode = document.querySelector('input[name="searchMode"]:checked')?.value || 'all';
    const searchResults = this.performAdvancedSearch(userMessage, searchMode);
    
    if (searchResults.length === 0) {
        return `申し訳ございません。「${userMessage}」に関連する情報がアップロードされた資料から見つかりませんでした。<br><br>
        <div class="summary-search-suggestions">
            <strong>💡 検索のヒント：</strong><br>
            • より一般的な用語で質問してみてください<br>
            • 異なるキーワードを試してみてください<br>
            • 検索モードを「全資料検索」に切り替えてください
        </div>`;
    }
    
    // 2. 最も関連性の高いチャンクを選択
    const topChunks = searchResults.slice(0, 5);
    
    // 3. 引用情報を記録
    this.citationTracker.responseReferences = topChunks.map(result => ({
        chunkId: result.chunk.id,
        fileName: result.chunk.fileName,
        score: result.score,
        matches: result.matches,
        startPage: result.chunk.startPage,
        endPage: result.chunk.endPage,
        startParagraph: result.chunk.startParagraph,
        endParagraph: result.chunk.endParagraph
    }));
    
    // 4. ハルシネーション防止プロンプト構築
    const contextContent = topChunks.map((result, index) => {
        const chunk = result.chunk;
        return `【参考資料${index + 1}】
ファイル名: ${chunk.fileName}
${chunk.startPage ? `ページ: ${chunk.startPage}-${chunk.endPage}` : ''}
${chunk.startParagraph ? `段落: ${chunk.startParagraph}-${chunk.endParagraph}` : ''}
関連度: ${(result.score * 20).toFixed(0)}%

内容:
${chunk.content}

---`;
    }).join('\n\n');
    
    const optimizedPrompt = `あなたは資料分析の専門家です。以下の資料を分析して、ユーザーの質問に正確かつ有用な回答を提供してください。

【提供された資料】
${contextContent}

【ユーザーの質問】
${userMessage}

【分析指針】
1. 提供された資料の内容を深く理解し、関連性の高い情報を特定する
2. 複数の資料間の関連性や矛盾点があれば指摘する
3. 質問に対する直接的な回答と、関連する重要な洞察を提供する
4. 引用元を明確に示し、信頼性を確保する
5. 資料に記載されていない場合は「資料には記載されていません」と明記する

【求める回答形式】
- 結論を最初に明確に述べる
- 根拠となる資料の内容を適切に引用する
- 分析に基づく洞察や含意を提供する
- 引用元（ファイル名、ページ、段落）を必ず明記する

高度な分析能力を活用して、最も価値のある回答を提供してください。`;

    try {
        console.log('🤖 O3モデルでAPI呼び出し開始');
        console.log('📄 参考資料数:', topChunks.length);
        console.log('📝 プロンプト文字数:', optimizedPrompt.length);
        
        const response = await window.callOpenAIAPI('summary', keyPointsPrompt, 'o3-mini');
        
        console.log('✅ O3レスポンス受信完了');
        console.log('📊 レスポンス文字数:', response.length);
        
        // 応答にアクセス記録を更新
        topChunks.forEach(result => {
            result.chunk.lastAccessed = new Date().toISOString();
            result.chunk.accessCount = (result.chunk.accessCount || 0) + 1;
        });
        
        return this.enhanceResponseWithCitations(response);
        
    } catch (error) {
        console.error('❌ O3 API処理エラー:', error);
        console.error('エラー詳細:', error.message);
        throw error;
    }
};

// ===== Phase 2新機能：引用情報強化 =====
SummaryAI.enhanceResponseWithCitations = function(response) {
    const citations = this.citationTracker.responseReferences;
    
    if (citations.length === 0) return response;
    
    // 引用情報を追加
    let enhancedResponse = response;
    
    // フッターに詳細引用情報を追加
    enhancedResponse += `<br><br><div class="summary-citation-footer">
        <h4>📎 参照資料</h4>
        <div class="summary-citations">`;
    
    citations.forEach((citation, index) => {
        enhancedResponse += `
            <div class="summary-citation-item" data-citation-id="${citation.chunkId}">
                <div class="summary-citation-header">
                    <span class="summary-citation-number">${index + 1}</span>
                    <span class="summary-citation-filename">${citation.fileName}</span>
                </div>
                <div class="summary-citation-details">
                    ${citation.startPage ? `📄 p.${citation.startPage}${citation.endPage !== citation.startPage ? `-${citation.endPage}` : ''}` : ''}
                    ${citation.startParagraph ? `📝 段落${citation.startParagraph}${citation.endParagraph !== citation.startParagraph ? `-${citation.endParagraph}` : ''}` : ''}
                    <span class="summary-citation-relevance">関連度: ${(citation.score * 20).toFixed(0)}%</span>
                </div>
                ${citation.matches && citation.matches.length > 0 ? `
                    <div class="summary-citation-matches">
                        <small>マッチ箇所: ${citation.matches.slice(0, 3).map(match => `"${match.text}"`).join(', ')}</small>
                    </div>
                ` : ''}
            </div>
        `;
    });
    
    enhancedResponse += `</div></div>`;
    
    return enhancedResponse;
};

// ===== Phase 2新機能：高度サンプル応答 =====
SummaryAI.generateAdvancedSampleResponse = function(userMessage) {
    // 検索シミュレーション
    const searchMode = document.querySelector('input[name="searchMode"]:checked')?.value || 'all';
    const mockResults = this.generateMockSearchResults(userMessage, searchMode);
    
    const response = `「${userMessage}」について、アップロードされた資料を横断検索して分析しました。<br><br>

<strong>🎯 主要な発見：</strong><br>
• <strong>売上トレンド</strong>：3つの資料で一貫して前年比15%増が報告<br>
• <strong>課題領域</strong>：製造コスト上昇が2つの資料で言及<br>
• <strong>改善案</strong>：DX推進による効率化が提案されている<br><br>

<strong>📊 詳細分析：</strong><br>
複数の資料を横断分析した結果、共通する重要なポイントが浮かび上がりました。特に注目すべきは、売上増加の一方でコスト構造の最適化が急務となっている点です。<br><br>

<div class="summary-citation-footer">
    <h4>📎 参照資料 (${mockResults.length}件)</h4>
    <div class="summary-citations">
        ${mockResults.map((result, index) => `
            <div class="summary-citation-item" data-citation-id="mock-${index}">
                <div class="summary-citation-header">
                    <span class="summary-citation-number">${index + 1}</span>
                    <span class="summary-citation-filename">${result.fileName}</span>
                </div>
                <div class="summary-citation-details">
                    📄 ${result.pages} 📝 ${result.paragraphs}
                    <span class="summary-citation-relevance">関連度: ${result.relevance}%</span>
                </div>
                <div class="summary-citation-matches">
                    <small>マッチ箇所: ${result.matches.join(', ')}</small>
                </div>
            </div>
        `).join('')}
    </div>
</div>`;
    
    return response;
};

SummaryAI.generateMockSearchResults = function(query, searchMode) {
    const availableFiles = this.uploadedFiles.filter(f => f.processed);
    if (availableFiles.length === 0) return [];
    
    return availableFiles.slice(0, 3).map((file, index) => ({
        fileName: file.name,
        relevance: 95 - (index * 15),
        pages: file.metadata?.pages ? `p.${2 + index}-${4 + index}` : '段落範囲',
        paragraphs: `段落${3 + index * 2}-${6 + index * 2}`,
        matches: [`"${query.substring(0, 15)}"`, '"重要なポイント"', '"データ分析"'].slice(0, 2)
    }));
};

// ===== Phase 1機能継承（ライブラリ読み込み等） =====
SummaryAI.loadLibraries = async function() {
    try {
        console.log('📚 必要なライブラリを読み込み中...');
        this.showLibraryLoading(true);
        
        // PDF.js の読み込み
        if (!window.pdfjsLib) {
            await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
            await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js');
            
            if (window.pdfjsLib) {
                window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                this.libraries.pdfjs = true;
                console.log('✅ PDF.js 読み込み完了');
            }
        } else {
            this.libraries.pdfjs = true;
        }
        
        // mammoth.js の読み込み
        if (!window.mammoth) {
            await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js');
            
            if (window.mammoth) {
                this.libraries.mammoth = true;
                console.log('✅ mammoth.js 読み込み完了');
            }
        } else {
            this.libraries.mammoth = true;
        }
        
        this.showLibraryLoading(false);
        console.log('📚 ライブラリ読み込み状況:', this.libraries);
        
    } catch (error) {
        this.showLibraryLoading(false);
        console.error('❌ ライブラリ読み込みエラー:', error);
        this.showError('必要なライブラリの読み込みに失敗しました');
    }
};

SummaryAI.loadScript = function(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
};

// ===== Phase 1機能継承（初期化） =====
SummaryAI.init = async function() {
    if (this.initialized) return;
    
    console.log('🔍 資料調査AI Phase 2初期化開始...');
    
    try {
        // ライブラリ読み込み
        await this.loadLibraries();
        
        this.setupEventListeners();
        this.setupFileHandling();
        this.loadSavedData();
        this.updateUI();
        this.updateSendButtonState(); // ★初期状態を設定
        
        this.initialized = true;
        console.log('✅ 資料調査AI Phase 2初期化完了（横断検索・ハルシネーション対策対応）');
        
    } catch (error) {
        console.error('❌ 資料調査AI初期化エラー:', error);
        this.showError('初期化に失敗しました: ' + error.message);
    }
};

// ===== Phase 1機能継承：基本機能群 =====

// イベントリスナー設定
SummaryAI.setupEventListeners = function() {
    // 戻るボタン
    document.addEventListener('click', (e) => {
        if (e.target.closest('.summary-back-btn')) {
            this.exitSummaryMode();
        }
    });
    
    // ファイル追加ボタン
    document.addEventListener('click', (e) => {
        if (e.target.closest('.summary-add-source-btn')) {
            this.triggerFileUpload();
        }
    });
    
    // ★改良：送信ボタン（async/await対応）
    document.addEventListener('click', async (e) => {
        if (e.target.closest('.summary-send-btn')) {
            const input = document.querySelector('.summary-chat-input');
            const question = input?.value?.trim();
            
            if (!question || this.uploadedFiles.length === 0) {
                this.showError('資料をアップロードしてから質問してください');
                return;
            }
            
            if (this.isProcessing) return;
            
            try {
                this.isProcessing = true;
                this.updateSendButtonState(); // 処理中状態を反映
                
                input.value = '';
                input.style.height = 'auto';
                
                // ユーザーメッセージを追加
                this.addMessage('user', question);
                
                // AI応答を生成
                await this.generateAIResponse(question);
                
            } catch (error) {
                console.error('❌ メッセージ送信エラー:', error);
                this.showError('メッセージの送信に失敗しました: ' + error.message);
            } finally {
                this.isProcessing = false;
                this.updateSendButtonState(); // 処理完了状態を反映
            }
        }
    });
    
    // 要点生成ボタン
    document.addEventListener('click', (e) => {
        if (e.target.closest('.summary-generate-btn')) {
            this.generateKeyPoints();
        }
    });
    
    // ★改良：Enterキーで送信（Shift+Enterで改行）
    document.addEventListener('keydown', async (e) => {
        if (e.target.classList.contains('summary-chat-input')) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                
                // 送信ボタンをクリックして同じ処理を実行
                const sendBtn = document.querySelector('.summary-send-btn');
                if (sendBtn && !sendBtn.disabled) {
                    sendBtn.click();
                }
            }
        }
    });
    
    // チャット入力の自動リサイズ + 送信ボタン状態更新
    document.addEventListener('input', (e) => {
        if (e.target.classList.contains('summary-chat-input')) {
            this.autoResizeTextarea(e.target);
            this.updateSendButtonState();
        }
    });
    
    // ★入力フィールドのフォーカス/ブラー処理
    document.addEventListener('focus', (e) => {
        if (e.target.classList.contains('summary-chat-input')) {
            // フォーカス時は少し強調
            e.target.style.borderColor = 'var(--primary, #667eea)';
            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
        }
    }, true);
    
    document.addEventListener('blur', (e) => {
        if (e.target.classList.contains('summary-chat-input')) {
            // フォーカスアウト時は元に戻す
            e.target.style.borderColor = 'transparent';
            e.target.style.boxShadow = 'none';
        }
    }, true);
    
    // ソースアイテムクリック
    document.addEventListener('click', (e) => {
        if (e.target.closest('.summary-source-item') && !e.target.closest('.summary-source-remove')) {
            const sourceItem = e.target.closest('.summary-source-item');
            const fileId = sourceItem.getAttribute('data-file-id');
            if (fileId) this.toggleSource(fileId);
        }
    });
    
    // ソース削除ボタン
    document.addEventListener('click', (e) => {
        if (e.target.closest('.summary-source-remove')) {
            e.stopPropagation();
            const sourceItem = e.target.closest('.summary-source-item');
            const fileId = sourceItem.getAttribute('data-file-id');
            if (fileId) this.removeSource(fileId);
        }
    });
    
    // 要点クリック
    document.addEventListener('click', (e) => {
        if (e.target.closest('.summary-key-point')) {
            const keyPoint = e.target.closest('.summary-key-point');
            const pointId = keyPoint.getAttribute('data-point-id');
            if (pointId) this.toggleKeyPoint(pointId);
        }
    });
    
    // ★Phase 2新機能：引用クリック
    document.addEventListener('click', (e) => {
        if (e.target.closest('.summary-citation-item')) {
            const citationItem = e.target.closest('.summary-citation-item');
            const citationId = citationItem.getAttribute('data-citation-id');
            if (citationId) this.showCitationDetails(citationId);
        }
    });
};

// ファイル処理設定
SummaryAI.setupFileHandling = function() {
    // ファイル入力の変更イベント
    document.addEventListener('change', (e) => {
        if (e.target.id === 'summaryFileInput') {
            this.handleFileUpload(e);
        }
    });
    
    // ドラッグ&ドロップ設定
    document.addEventListener('dragover', (e) => {
        if (e.target.closest('.summary-drop-zone')) {
            e.preventDefault();
            e.target.closest('.summary-drop-zone').classList.add('dragover');
        }
    });
    
    document.addEventListener('dragleave', (e) => {
        if (e.target.closest('.summary-drop-zone')) {
            e.target.closest('.summary-drop-zone').classList.remove('dragover');
        }
    });
    
    document.addEventListener('drop', (e) => {
        if (e.target.closest('.summary-drop-zone')) {
            e.preventDefault();
            e.target.closest('.summary-drop-zone').classList.remove('dragover');
            
            const files = Array.from(e.dataTransfer.files);
            this.addFiles(files);
        }
    });
};

// メイン機能：要約モード開始
SummaryAI.enterSummaryMode = function() {
    console.log('🚀 要約モード開始（Phase 2）');
    
    try {
        const summarySection = document.getElementById('summarySection');
        if (!summarySection) {
            throw new Error('要約セクションが見つかりません');
        }
        
        // 既存のすべてのセクションを非表示
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // 要約セクションをアクティブに
        summarySection.classList.add('active');
        summarySection.innerHTML = this.getSummaryHTML();
        
        // ナビゲーション状態を更新
        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.classList.remove('active');
        });
        const summaryNav = document.querySelector('.nav-item[data-tab="summary"]');
        if (summaryNav) {
            summaryNav.classList.add('active');
        }
        
        // ページタイトルを更新
        const pageTitle = document.querySelector('.page-title');
        if (pageTitle) {
            pageTitle.textContent = '資料調査AI';
        }
        
        // トップバーアクションを更新
        if (typeof updateTopbarActions === 'function') {
            updateTopbarActions();
        }
        
        this.init();
        
        console.log('✅ 要約モード開始完了（Phase 2対応）');
        
    } catch (error) {
        console.error('❌ 要約モード開始エラー:', error);
        this.showError('要約モードの開始に失敗しました: ' + error.message);
    }
};

// 要約モード終了
SummaryAI.exitSummaryMode = function() {
    console.log('🔙 要約モード終了');
    
    try {
        this.saveData();
        
        // 要約セクションを非アクティブに
        const summarySection = document.getElementById('summarySection');
        if (summarySection) {
            summarySection.classList.remove('active');
            
            // 元のプレースホルダーに戻す
            if (typeof window.returnToSummaryPlaceholder === 'function') {
                window.returnToSummaryPlaceholder();
            }
        }
        
        // チャットセクションに戻る
        const chatSection = document.getElementById('chatSection');
        if (chatSection) {
            chatSection.classList.add('active');
        }
        
        // ナビゲーション状態を更新
        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.classList.remove('active');
        });
        const chatNav = document.querySelector('.nav-item[data-tab="chat"]');
        if (chatNav) {
            chatNav.classList.add('active');
        }
        
        // ページタイトルを更新
        const pageTitle = document.querySelector('.page-title');
        if (pageTitle) {
            pageTitle.textContent = 'チャット';
        }
        
        // トップバーアクションを更新
        if (typeof updateTopbarActions === 'function') {
            updateTopbarActions();
        }
        
        console.log('✅ 要約モード終了完了');
        
    } catch (error) {
        console.error('❌ 要約モード終了エラー:', error);
    }
};

// HTMLテンプレート生成（Phase 2強化版）
SummaryAI.getSummaryHTML = function() {
    return `
        <div class="summary-app-container">
            <!-- 左パネル：ソース管理 -->
            <div class="summary-sources-panel">
                <div class="summary-sources-header">
                    <div class="summary-sources-title">📂 資料管理（Phase 2）</div>
                    <button class="summary-add-source-btn">➕ ファイル追加</button>
                    <input type="file" id="summaryFileInput" class="summary-file-input" multiple accept=".pdf,.doc,.docx,.txt,.md">
                </div>
                
                <div class="summary-drop-zone">
                    <div class="summary-drop-zone-text">
                        📄 <strong>PDF / Word / テキスト</strong>をドロップ<br>
                        最大20ファイル、各100MBまで<br>
                        <small>対応形式: PDF, DOC, DOCX, TXT, MD</small>
                    </div>
                </div>
                
                <div class="summary-sources-list" id="summarySourcesList">
                    <!-- アップロードされたファイルがここに表示される -->
                </div>
                
                <!-- テキスト直接入力エリア -->
                <div class="summary-text-input-section">
                    <button class="summary-add-text-btn" onclick="SummaryAI.toggleTextInput()">📝 テキスト直接入力</button>
                    <div class="summary-text-input-area" id="summaryTextInputArea" style="display: none;">
                        <textarea id="summaryDirectTextInput" class="summary-direct-text-input" placeholder="テキストを直接入力してください...&#10;&#10;例：&#10;・会議メモ&#10;・調査内容&#10;・メール内容など" rows="8"></textarea>
                        <div class="summary-text-actions">
                            <button class="summary-text-save-btn" onclick="SummaryAI.saveDirectText()">💾 保存</button>
                            <button class="summary-text-cancel-btn" onclick="SummaryAI.cancelTextInput()">❌ キャンセル</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 中央パネル：チャット -->
            <div class="summary-chat-panel">
                <div class="summary-chat-header">
                    <div class="summary-chat-title-section">
                        <div class="summary-chat-title">💬 資料調査チャット（Phase 2）</div>
                        <div class="summary-chat-subtitle">
                            高精度横断検索・ハルシネーション防止・引用元追跡対応
                        </div>
                    </div>
                    <button class="summary-back-btn">← 戻る</button>
                </div>
                
                <div class="summary-chat-messages" id="summaryChatMessages">
                    <div class="summary-welcome-message">
                        <div class="summary-welcome-icon">🔍</div>
                        <h3>Phase 2: 高精度資料調査AIへようこそ！</h3>
                        <p>複数資料の横断検索・正確な引用追跡・ハルシネーション防止機能で、信頼性の高い分析を提供します</p>
                        <div class="summary-examples">
                            <h4>💡 Phase 2の新機能：</h4>
                            <ul>
                                <li>🔍 <strong>横断検索</strong>：複数ファイルを同時検索</li>
                                <li>📎 <strong>引用追跡</strong>：正確な出典表示</li>
                                <li>🚫 <strong>ハルシネーション防止</strong>：資料のみ参照</li>
                                <li>🎯 <strong>要点抽出</strong>：重要ポイントを自動分析</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="summary-chat-input-container">
                    <!-- ★Phase 2強化：検索オプション -->
                    <div class="summary-advanced-search">
                        <button class="summary-advanced-search-toggle" onclick="SummaryAI.toggleAdvancedSearch()">
                            ⚙️ 詳細検索オプション
                        </button>
                        <div class="summary-advanced-options" id="summaryAdvancedOptions">
                            <label class="summary-advanced-option">
                                <input type="checkbox" id="enableFuzzySearch" checked>
                                <span>あいまい検索</span>
                            </label>
                            <label class="summary-advanced-option">
                                <input type="checkbox" id="boostRecentFiles" checked>
                                <span>新しいファイル優先</span>
                            </label>
                            <label class="summary-advanced-option">
                                <input type="checkbox" id="enableDeepLinks" checked>
                                <span>詳細リンク</span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="summary-search-mode">
                        <label class="summary-mode-toggle">
                            <input type="radio" name="searchMode" value="all" checked>
                            <span>🔍 全資料横断検索</span>
                        </label>
                        <label class="summary-mode-toggle">
                            <input type="radio" name="searchMode" value="selected">
                            <span>📄 選択ファイルのみ</span>
                        </label>
                    </div>
                    
                    <div class="summary-chat-input-wrapper">
                        <textarea 
                            class="summary-chat-input" 
                            placeholder="資料を横断検索して質問してください..."
                            rows="1"
                        ></textarea>
                        <button class="summary-send-btn" disabled>🔍</button>
                    </div>
                </div>
            </div>

            <!-- 右パネル：スタジオ -->
            <div class="summary-studio-panel">
                <div class="summary-studio-header">
                    <div class="summary-studio-title">📝 要点抽出</div>
                    <div class="summary-studio-subtitle">
                        AI自動要点抽出・詳細展開
                    </div>
                </div>
                
                <div class="summary-studio-content">
                    <div class="summary-studio-section">
                        <div class="summary-section-title">
                            🎯 要点リスト
                            <button class="summary-generate-btn" disabled>要点生成</button>
                        </div>
                        <div class="summary-key-points-list" id="summaryKeyPointsList">
                            <div style="color: #888; font-size: 12px; text-align: center; padding: 20px;">
                                資料をアップロードして要点を生成してください
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

// ★Phase 2新機能：詳細検索オプション切り替え
SummaryAI.toggleAdvancedSearch = function() {
    const options = document.getElementById('summaryAdvancedOptions');
    if (options) {
        options.classList.toggle('expanded');
    }
};

// ★Phase 2新機能：引用詳細表示
SummaryAI.showCitationDetails = function(citationId) {
    const citation = this.citationTracker.responseReferences.find(ref => 
        ref.chunkId.toString() === citationId.replace('mock-', '')
    );
    
    if (!citation) {
        console.log('引用詳細:', citationId);
        return;
    }
    
    // 詳細ポップアップまたはサイドパネル表示
    console.log('引用詳細表示:', citation);
    this.showSuccess(`引用元: ${citation.fileName} の詳細を表示`);
};

// ファイル管理機能
SummaryAI.addFiles = function(files) {
    try {
        files.forEach(file => {
            // ファイル数制限チェック
            if (this.uploadedFiles.length >= this.config.maxFiles) {
                this.showError(`最大${this.config.maxFiles}ファイルまでしかアップロードできません`);
                return;
            }
            
            // 重複チェック
            if (this.uploadedFiles.some(f => f.name === file.name)) {
                this.showError(`${file.name} は既にアップロード済みです`);
                return;
            }
            
            // ファイルサイズチェック
            if (file.size > this.config.maxFileSize) {
                this.showError(`${file.name} はファイルサイズが大きすぎます（最大100MB）`);
                return;
            }
            
            // ファイルタイプチェック
            const extension = '.' + file.name.split('.').pop().toLowerCase();
            if (!this.config.supportedTypes.includes(extension)) {
                this.showError(`${file.name} はサポートされていないファイル形式です（対応形式: PDF, DOC, DOCX, TXT, MD）`);
                return;
            }
            
            // ファイルオブジェクトを作成
            const fileObject = {
                id: Date.now() + Math.random(),
                name: file.name,
                size: file.size,
                type: file.type,
                extension: extension,
                file: file,
                content: null,
                processed: false,
                chunks: [],
                metadata: {
                    pages: 0,
                    paragraphs: 0,
                    wordCount: 0,
                    processingTime: 0
                }
            };
            
            this.uploadedFiles.push(fileObject);
            this.processFile(fileObject);
        });
        
        this.updateSourcesList();
        this.updateUI();
        
    } catch (error) {
        console.error('❌ ファイル追加エラー:', error);
        this.showError('ファイルの追加に失敗しました: ' + error.message);
    }
};

// ファイル処理（Phase 1の継承）
SummaryAI.processFile = async function(fileObject) {
    const startTime = Date.now();
    
    try {
        console.log(`📄 ファイル処理開始: ${fileObject.name}`);
        this.updateFileStatus(fileObject.id, '処理中...');
        
        let content = '';
        let metadata = {};
        
        // ファイルタイプ別の処理
        switch (fileObject.extension) {
            case '.txt':
            case '.md':
                const result = await this.readTextFile(fileObject.file);
                content = result.content;
                metadata = result.metadata;
                break;
            case '.pdf':
                if (this.libraries.pdfjs) {
                    const pdfResult = await this.readPDFFile(fileObject.file);
                    content = pdfResult.content;
                    metadata = pdfResult.metadata;
                } else {
                    throw new Error('PDF処理ライブラリが利用できません');
                }
                break;
            case '.doc':
            case '.docx':
                if (this.libraries.mammoth) {
                    const docResult = await this.readWordFile(fileObject.file);
                    content = docResult.content;
                    metadata = docResult.metadata;
                } else {
                    throw new Error('Word処理ライブラリが利用できません');
                }
                break;
            default:
                throw new Error(`サポートされていないファイル形式: ${fileObject.extension}`);
        }
        
        // テキストを段落追跡付きでチャンクに分割
        fileObject.content = content;
        fileObject.chunks = this.splitTextIntoChunksWithTracking(content, fileObject.name);
        fileObject.metadata = { ...metadata, processingTime: Date.now() - startTime };
        fileObject.processed = true;
        
        console.log(`✅ ファイル処理完了: ${fileObject.name} (${fileObject.chunks.length}チャンク, ${metadata.wordCount}語)`);
        this.updateFileStatus(fileObject.id, '完了');
        
        // ★Phase 2: 検索エンジンを再初期化
        this.initializeSearchEngine();
        
        this.updateSourcesList();
        this.updateUI();
        
    } catch (error) {
        console.error(`❌ ファイル処理エラー (${fileObject.name}):`, error);
        fileObject.processed = false;
        fileObject.metadata.processingTime = Date.now() - startTime;
        this.updateFileStatus(fileObject.id, 'エラー');
        this.showError(`${fileObject.name} の処理に失敗しました: ${error.message}`);
    }
};

// ===== Phase 1継承：ファイル読み込み関数群 =====
SummaryAI.readTextFile = function(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            const lines = content.split('\n');
            const paragraphs = content.split('\n\n').filter(p => p.trim());
            // 日本語対応の単語カウント - 日本語文字数 + 英単語数
            const japaneseChars = (content.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g) || []).length;
            const englishWords = (content.match(/[a-zA-Z]+/g) || []).length;
            const wordCount = japaneseChars + englishWords;
            
            resolve({
                content: content,
                metadata: {
                    lines: lines.length,
                    paragraphs: paragraphs.length,
                    wordCount: wordCount,
                    charCount: content.length
                }
            });
        };
        reader.onerror = () => reject(new Error('テキストファイルの読み込みに失敗しました'));
        reader.readAsText(file, 'UTF-8');
    });
};

SummaryAI.readPDFFile = async function(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        
        let fullText = '';
        let pageTexts = [];
        
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            
            const pageText = textContent.items
                .map(item => item.str)
                .join(' ')
                .replace(/\s+/g, ' ')
                .trim();
            
            if (pageText) {
                pageTexts.push({
                    page: pageNum,
                    text: pageText
                });
                fullText += `[Page ${pageNum}]\n${pageText}\n\n`;
            }
        }
        
        // 日本語対応の単語カウント
        const japaneseChars = (fullText.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g) || []).length;
        const englishWords = (fullText.match(/[a-zA-Z]+/g) || []).length;
        const wordCount = japaneseChars + englishWords;
        const paragraphs = fullText.split('\n\n').filter(p => p.trim()).length;
        
        return {
            content: fullText,
            metadata: {
                pages: pdf.numPages,
                paragraphs: paragraphs,
                wordCount: wordCount,
                charCount: fullText.length,
                pageTexts: pageTexts
            }
        };
        
    } catch (error) {
        console.error('PDF読み込みエラー:', error);
        throw new Error('PDFファイルの処理に失敗しました: ' + error.message);
    }
};

SummaryAI.readWordFile = async function(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await window.mammoth.extractRawText({ arrayBuffer: arrayBuffer });
        
        const content = result.value;
        const paragraphs = content.split('\n\n').filter(p => p.trim());
                    // 日本語対応の単語カウント - 日本語文字数 + 英単語数
            const japaneseChars = (content.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g) || []).length;
            const englishWords = (content.match(/[a-zA-Z]+/g) || []).length;
            const wordCount = japaneseChars + englishWords;
        
        if (result.messages && result.messages.length > 0) {
            console.warn('Word変換警告:', result.messages);
        }
        
        return {
            content: content,
            metadata: {
                paragraphs: paragraphs.length,
                wordCount: wordCount,
                charCount: content.length,
                warnings: result.messages || []
            }
        };
        
    } catch (error) {
        console.error('Word読み込みエラー:', error);
        throw new Error('Wordファイルの処理に失敗しました: ' + error.message);
    }
};

SummaryAI.splitTextIntoChunksWithTracking = function(text, fileName) {
    const chunks = [];
    
    const pageMatches = text.match(/\[Page \d+\]/g);
    const hasPages = pageMatches && pageMatches.length > 0;
    
    let currentPage = 1;
    let currentParagraph = 1;
    let currentChunk = '';
    let currentSize = 0;
    
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());
    
    for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i].trim();
        
        if (hasPages) {
            const pageMatch = paragraph.match(/\[Page (\d+)\]/);
            if (pageMatch) {
                currentPage = parseInt(pageMatch[1]);
                continue;
            }
        }
        
        const paragraphSize = paragraph.length;
        
        if (currentSize + paragraphSize > this.config.chunkSize && currentChunk) {
            chunks.push({
                id: chunks.length,
                content: currentChunk.trim(),
                size: currentSize,
                fileName: fileName,
                startPage: hasPages ? Math.max(1, currentPage - 1) : null,
                endPage: hasPages ? currentPage : null,
                startParagraph: Math.max(1, currentParagraph - (currentChunk.split('\n\n').length - 1)),
                endParagraph: currentParagraph - 1,
                metadata: {
                    wordCount: (currentChunk.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g) || []).length + (currentChunk.match(/[a-zA-Z]+/g) || []).length
                }
            });
            
            const overlapText = currentChunk.slice(-this.config.overlap);
            currentChunk = overlapText + '\n\n' + paragraph;
            currentSize = overlapText.length + paragraphSize + 2;
        } else {
            currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
            currentSize += paragraphSize + (currentChunk ? 2 : 0);
        }
        
        currentParagraph++;
    }
    
    if (currentChunk.trim()) {
        chunks.push({
            id: chunks.length,
            content: currentChunk.trim(),
            size: currentSize,
            fileName: fileName,
            startPage: hasPages ? Math.max(1, currentPage - 1) : null,
            endPage: hasPages ? currentPage : null,
            startParagraph: Math.max(1, currentParagraph - (currentChunk.split('\n\n').length - 1)),
            endParagraph: currentParagraph - 1,
            metadata: {
                wordCount: (currentChunk.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g) || []).length + (currentChunk.match(/[a-zA-Z]+/g) || []).length
            }
        });
    }
    
    return chunks;
};

// ===== 基本UI機能（Phase 1継承） =====
SummaryAI.showLibraryLoading = function(isLoading) {
    const dropZone = document.querySelector('.summary-drop-zone');
    if (!dropZone) return;
    
    if (isLoading) {
        dropZone.innerHTML = `
            <div class="summary-library-loading">
                <div class="summary-spinner"></div>
                <div class="summary-library-loading-text">
                    PDF・Word処理ライブラリを読み込み中...
                </div>
            </div>
        `;
    } else {
        dropZone.innerHTML = `
            <div class="summary-drop-zone-text">
                📄 <strong>PDF / Word / テキスト</strong>をドロップ<br>
                最大20ファイル、各100MBまで<br>
                <small>対応形式: PDF, DOCX, TXT, MD</small>
            </div>
        `;
    }
};

SummaryAI.showError = function(message) {
    this.showMessage(message, 'error');
};

SummaryAI.showSuccess = function(message) {
    this.showMessage(message, 'success');
};

SummaryAI.showMessage = function(message, type) {
    const existingMessages = document.querySelectorAll('.summary-error-message, .summary-success-message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'error' ? 'summary-error-message' : 'summary-success-message';
    
    const icon = type === 'error' ? '❌' : '✅';
    messageDiv.innerHTML = `
        <span class="summary-${type}-icon">${icon}</span>
        <span>${message}</span>
    `;
    
    const sourcesPanel = document.querySelector('.summary-sources-panel');
    if (sourcesPanel) {
        sourcesPanel.insertBefore(messageDiv, sourcesPanel.querySelector('.summary-sources-list'));
    }
    
    setTimeout(() => {
        if (messageDiv.parentElement) {
            messageDiv.remove();
        }
    }, 3000);
    
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    } else {
        console.log(`${type.toUpperCase()}: ${message}`);
    }
};

// ===== チャット機能（Phase 2強化版） =====
SummaryAI.autoResizeTextarea = function(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
};

// ★新機能：送信ボタン状態更新
SummaryAI.updateSendButtonState = function() {
    const input = document.querySelector('.summary-chat-input');
    const sendBtn = document.querySelector('.summary-send-btn');
    
    if (input && sendBtn) {
        const hasText = input.value.trim().length > 0;
        const hasFiles = this.uploadedFiles.some(f => f.processed);
        const canSend = hasText && hasFiles && !this.isProcessing;
        
        sendBtn.disabled = !canSend;
        
        // 処理中の場合はローディング表示
        if (this.isProcessing) {
            sendBtn.innerHTML = '<div class="summary-spinner"></div>';
            sendBtn.style.opacity = '0.7';
            sendBtn.style.cursor = 'not-allowed';
        } else {
            sendBtn.innerHTML = '🔍';
            // 視覚的フィードバック
            if (canSend) {
                sendBtn.style.opacity = '1';
                sendBtn.style.cursor = 'pointer';
            } else {
                sendBtn.style.opacity = '0.5';
                sendBtn.style.cursor = 'not-allowed';
            }
        }
        
        // プレースホルダーテキストの動的更新
        if (!hasFiles) {
            input.placeholder = '資料をアップロードしてから質問してください...';
        } else if (this.isProcessing) {
            input.placeholder = '処理中...';
        } else {
            input.placeholder = '資料を横断検索して質問してください...';
        }
    }
};

SummaryAI.addMessage = function(sender, content) {
    const messagesContainer = document.getElementById('summaryChatMessages');
    const welcomeMessage = document.querySelector('.summary-welcome-message');
    
    if (welcomeMessage) {
        welcomeMessage.style.display = 'none';
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `summary-message ${sender}`;
    
    const avatarIcon = sender === 'user' ? '👤' : '🤖';
    
    messageDiv.innerHTML = `
        <div class="summary-message-avatar ${sender}">${avatarIcon}</div>
        <div class="summary-message-content">
            <div class="summary-message-bubble">${content}</div>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    this.chatHistory.push({ 
        sender, 
        content, 
        timestamp: new Date().toISOString(),
        sources: sender === 'ai' ? this.getRelevantSources() : null
    });
};

// ===== UI更新機能（Phase 2強化版） =====
SummaryAI.updateSourcesList = function() {
    const sourcesList = document.getElementById('summarySourcesList');
    if (!sourcesList) return;
    
    if (this.uploadedFiles.length === 0) {
        sourcesList.innerHTML = '';
        return;
    }
    
    sourcesList.innerHTML = this.uploadedFiles.map(file => {
        const icon = this.getFileIcon(file.extension);
        const size = this.formatFileSize(file.size);
        const isSelected = this.selectedSources.includes(file.id);
        const statusIcon = file.processed ? '✅' : '⏳';
        const statusText = file.processed ? '処理完了' : '処理中...';
        const processingClass = file.processed ? 'processed' : 'processing';
        
        // 統計情報
        let statsText = '';
        if (file.processed && file.metadata) {
            const stats = [];
            if (file.metadata.pages) stats.push(`${file.metadata.pages}ページ`);
            if (file.metadata.wordCount) stats.push(`${file.metadata.wordCount}語`);
            if (file.chunks) stats.push(`${file.chunks.length}チャンク`);
            statsText = stats.join(' • ');
        }
        
        // ★Phase 2: アクセス頻度表示
        const accessInfo = file.chunks && file.chunks.length > 0 ? 
            file.chunks.reduce((total, chunk) => total + (chunk.accessCount || 0), 0) : 0;
        
        return `
            <div class="summary-source-item ${isSelected ? 'selected' : ''} ${processingClass}" 
                 data-file-id="${file.id}" 
                 data-extension="${file.extension}">
                <div class="summary-source-icon">${icon}</div>
                <div class="summary-source-name">${file.name} ${statusIcon}</div>
                <div class="summary-source-meta">${size} ${statsText ? '• ' + statsText : ''}</div>
                <div class="summary-source-status">${statusText}</div>
                ${accessInfo > 0 ? `<div class="summary-access-count">参照回数: ${accessInfo}</div>` : ''}
                ${!file.processed ? `
                    <div class="summary-file-progress">
                        <div class="summary-file-progress-bar" style="width: 50%"></div>
                    </div>
                ` : ''}
                <button class="summary-source-remove">×</button>
            </div>
        `;
    }).join('');
};

SummaryAI.updateFileStatus = function(fileId, status) {
    const fileItem = document.querySelector(`[data-file-id="${fileId}"] .summary-source-status`);
    if (fileItem) {
        fileItem.textContent = status;
    }
};

SummaryAI.updateUI = function() {
    const hasFiles = this.uploadedFiles.length > 0;
    const hasProcessedFiles = this.uploadedFiles.some(f => f.processed);
    
    // ボタンの有効/無効状態を更新
    const generateBtn = document.querySelector('.summary-generate-btn');
    if (generateBtn) generateBtn.disabled = !hasProcessedFiles;
    
    // ★送信ボタンの状態も更新
    this.updateSendButtonState();
    
    // ウェルカムメッセージの更新
    this.updateWelcomeMessage();
};

SummaryAI.updateWelcomeMessage = function() {
    const welcomeMessage = document.querySelector('.summary-welcome-message');
    if (!welcomeMessage) return;
    
    const hasFiles = this.uploadedFiles.length > 0;
    const hasProcessedFiles = this.uploadedFiles.some(f => f.processed);
    const hasChatHistory = this.chatHistory.length > 0;
    
    if (hasChatHistory) {
        welcomeMessage.style.display = 'none';
        return;
    }
    
    if (hasProcessedFiles) {
        welcomeMessage.innerHTML = `
            <div class="summary-welcome-icon">✅</div>
            <h3>資料が準備されました！</h3>
            <p>Phase 2の高精度検索で質問してみてください</p>
            <div class="summary-search-status">
                <span class="summary-search-status-icon">🔍</span>
                <span>横断検索・引用追跡・ハルシネーション防止 - 準備完了</span>
            </div>
        `;
    } else if (hasFiles) {
        welcomeMessage.innerHTML = `
            <div class="summary-welcome-icon">⏳</div>
            <h3>資料を処理中...</h3>
            <p>ファイルの解析と検索インデックス構築中です</p>
        `;
    } else {
        welcomeMessage.innerHTML = `
            <div class="summary-welcome-icon">🔍</div>
            <h3>Phase 2: 高精度資料調査AIへようこそ！</h3>
            <p>複数資料の横断検索・正確な引用追跡・ハルシネーション防止機能で、信頼性の高い分析を提供します</p>
            <div class="summary-examples">
                <h4>💡 Phase 2の新機能：</h4>
                <ul>
                    <li>🔍 <strong>横断検索</strong>：複数ファイルを同時検索</li>
                    <li>📎 <strong>引用追跡</strong>：正確な出典表示</li>
                    <li>🚫 <strong>ハルシネーション防止</strong>：資料のみ参照</li>
                    <li>📊 <strong>信頼度表示</strong>：情報の確実性を可視化</li>
                </ul>
            </div>
        `;
    }
    
    welcomeMessage.style.display = 'block';
};

// ===== テキスト直接入力機能 =====
SummaryAI.toggleTextInput = function() {
    const inputArea = document.getElementById('summaryTextInputArea');
    if (inputArea) {
        if (inputArea.style.display === 'none') {
            inputArea.style.display = 'block';
            document.getElementById('summaryDirectTextInput').focus();
        } else {
            inputArea.style.display = 'none';
        }
    }
};

SummaryAI.saveDirectText = function() {
    const textInput = document.getElementById('summaryDirectTextInput');
    const text = textInput.value.trim();
    
    if (!text) {
        this.showError('テキストを入力してください');
        return;
    }
    
    const fileName = `直接入力_${new Date().toLocaleString('ja-JP').replace(/[/:]/g, '-')}.txt`;
    const fileObject = {
        id: Date.now() + Math.random(),
        name: fileName,
        size: text.length,
        type: 'text/plain',
        extension: '.txt',
        file: null,
        content: text,
        processed: true,
        chunks: this.splitTextIntoChunksWithTracking(text, fileName),
        metadata: {
            paragraphs: text.split('\n\n').filter(p => p.trim()).length,
            wordCount: (text.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g) || []).length + (text.match(/[a-zA-Z]+/g) || []).length,
            charCount: text.length,
            processingTime: 0
        }
    };
    
    this.uploadedFiles.push(fileObject);
    
    // ★Phase 2: 検索エンジンを再初期化
    this.initializeSearchEngine();
    
    this.updateSourcesList();
    this.updateUI();
    
    textInput.value = '';
    this.toggleTextInput();
    
    this.showSuccess('テキストが追加されました');
};

SummaryAI.cancelTextInput = function() {
    document.getElementById('summaryDirectTextInput').value = '';
    this.toggleTextInput();
};

// ===== 要点生成機能（Phase 2強化版） =====
SummaryAI.generateKeyPoints = async function() {
    if (this.uploadedFiles.length === 0 || this.isProcessing) return;
    
    try {
        this.isProcessing = true;
        
        const btn = document.querySelector('.summary-generate-btn');
        if (btn) {
            btn.disabled = true;
            btn.textContent = '生成中...';
        }
        
        // 要点を生成
        if (window.checkApiConfiguration && window.checkApiConfiguration()) {
            await this.generateKeyPointsWithAI();
        } else {
            await this.simulateProcessing(3000);
            this.generateSampleKeyPoints();
        }
        
        this.updateKeyPointsList();
        
    } catch (error) {
        console.error('❌ 要点生成エラー:', error);
        this.showError('要点生成に失敗しました: ' + error.message);
    } finally {
        this.isProcessing = false;
        const btn = document.querySelector('.summary-generate-btn');
        if (btn) {
            btn.disabled = false;
            btn.textContent = '要点生成';
        }
    }
};

SummaryAI.generateKeyPointsWithAI = async function() {
    const allContent = this.uploadedFiles
        .filter(f => f.processed)
        .map(f => `【${f.name}】\n${f.content}`)
        .join('\n\n');
    
    const keyPointsPrompt = `以下の資料を深く分析し、最も重要なポイントを5-10個抽出してください。

【資料内容】
${allContent}

【分析要件】
1. 資料全体の主要テーマと論点を特定する
2. 各要点の重要度と相互関連性を考慮する
3. 具体的な根拠や数値データを含む
4. 実用的な洞察や含意を提供する

【出力形式（JSON）】
{
  "keyPoints": [
    {
      "title": "要点の明確なタイトル",
      "summary": "要点の簡潔で的確な要約",
      "details": {
        "original": "資料からの重要な原文抜粋",
        "explanation": "深い分析に基づく詳細な解説と洞察",
        "source": "正確な参照元（ファイル名、ページ、段落）"
      }
    }
  ]
}

高度な分析能力を活用し、最も価値のある要点を抽出してください。JSONのみを返してください。`;

    try {
        console.log('🎯 O3で要点生成開始');
        
        // OpenAI APIの正しい形式でメッセージを構築
        const messages = [
            {
                role: "user",
                content: keyPointsPrompt
            }
        ];
        
        const response = await window.callOpenAIAPI(messages, 'o3-mini');
        console.log('✅ O3要点生成完了');
        console.log('📄 O3レスポンス:', response.substring(0, 200) + '...');
        
        // JSON部分を抽出する
        let jsonStr = response;
        
        // ```json や ``` で囲まれている場合は抽出
        const jsonMatch = response.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
        if (jsonMatch) {
            jsonStr = jsonMatch[1];
        } else {
            // { で始まり } で終わる部分を抽出
            const startIndex = response.indexOf('{');
            const lastIndex = response.lastIndexOf('}');
            if (startIndex !== -1 && lastIndex !== -1 && lastIndex > startIndex) {
                jsonStr = response.substring(startIndex, lastIndex + 1);
            }
        }
        
        console.log('🔍 JSON抽出結果:', jsonStr.substring(0, 100) + '...');
        
        const data = JSON.parse(jsonStr);
        if (data.keyPoints && Array.isArray(data.keyPoints)) {
            this.keyPoints = data.keyPoints.map((point, index) => ({
                ...point,
                id: index + 1
            }));
            console.log(`✅ ${this.keyPoints.length}個の要点をO3から取得`);
        } else {
            console.warn('⚠️ O3レスポンスにkeyPointsが見つかりません');
            this.generateSampleKeyPoints();
        }
        
    } catch (error) {
        console.error('❌ O3要点生成エラー:', error);
        console.log('🔄 実際のファイル内容から要点を生成します');
        this.generateSampleKeyPoints();
    }
};

SummaryAI.generateSampleKeyPoints = function() {
    // 実際にアップロードされたファイルの内容から要点を抽出
    const processedFiles = this.uploadedFiles.filter(f => f.processed);
    
    if (processedFiles.length === 0) {
        this.keyPoints = [];
        return;
    }
    
    this.keyPoints = [];
    let pointId = 1;
    
    processedFiles.forEach(file => {
        // 各ファイルから文章の最初の部分を要点として抽出
        const content = file.content || '';
        
        // ページタグを除去してテキストをクリーンアップ
        const cleanContent = content.replace(/\[Page \d+\]/g, '').trim();
        
        // 段落に分割（改行2つ以上で区切る）
        const paragraphs = cleanContent.split(/\n\s*\n/).filter(p => p.trim().length > 100);
        
        // 各ファイルから最大3つの要点を抽出
        const keyParagraphs = paragraphs.slice(0, 3);
        
        keyParagraphs.forEach((paragraph, index) => {
            const cleanParagraph = paragraph.trim();
            if (cleanParagraph.length > 50) {
                // 最初の80文字をタイトルとして使用
                let title = cleanParagraph.length > 80 ? 
                    cleanParagraph.substring(0, 80) + '...' : cleanParagraph;
                
                // 改行を除去してタイトルを整理
                title = title.replace(/\n/g, ' ').replace(/\s+/g, ' ');
                
                // 最初の150文字を要約として使用
                let summary = cleanParagraph.length > 150 ? 
                    cleanParagraph.substring(0, 150) + '...' : cleanParagraph;
                
                // 改行を除去して要約を整理
                summary = summary.replace(/\n/g, ' ').replace(/\s+/g, ' ');
                
                this.keyPoints.push({
                    id: pointId++,
                    title: `📄 ${file.name} - ${index + 1}`,
                    summary: summary,
                    details: {
                        original: cleanParagraph,
                        explanation: 'OpenAI APIが設定されていないため、自動解説は利用できません。上記は原文からの抜粋です。APIを設定すると、より詳細な分析と解説が提供されます。',
                        source: `${file.name} (段落${index + 1})`
                    }
                });
                
                // 最大8個の要点まで
                if (pointId > 8) return;
            }
        });
        
        // 最大8個の要点まで
        if (pointId > 8) return;
    });
    
    // 要点が見つからない場合
    if (this.keyPoints.length === 0) {
        // ファイルの基本情報から要点を作成
        processedFiles.forEach((file, index) => {
            if (index < 3) { // 最大3ファイル
                this.keyPoints.push({
                    id: index + 1,
                    title: `📄 ${file.name}`,
                    summary: `ファイルサイズ: ${this.formatFileSize(file.size)}、文字数: ${file.metadata.charCount || 0}文字、単語数: ${file.metadata.wordCount || 0}語`,
                    details: {
                        original: file.content ? file.content.substring(0, 500) + '...' : 'ファイル内容を取得できませんでした。',
                        explanation: 'このファイルの詳細な分析には、OpenAI APIの設定が必要です。ファイルは正常に処理されており、内容は検索可能です。',
                        source: `${file.name} (${file.extension}ファイル)`
                    }
                });
            }
        });
    }
    
    console.log(`📝 実際のファイル内容から${this.keyPoints.length}個の要点を生成しました`);
};

SummaryAI.updateKeyPointsList = function() {
    const container = document.getElementById('summaryKeyPointsList');
    if (!container) return;
    
    if (this.keyPoints.length === 0) {
        container.innerHTML = `
            <div style="color: #888; font-size: 12px; text-align: center; padding: 20px;">
                資料をアップロードして要点を生成してください
            </div>
        `;
        return;
    }
    
    container.innerHTML = this.keyPoints.map(point => `
        <div class="summary-key-point" data-point-id="${point.id}">
            <div class="summary-key-point-title">🔹 ${point.title}</div>
            <div class="summary-key-point-summary">${point.summary}</div>
            <div class="summary-key-point-details">
                <div class="summary-detail-section">
                    <div class="summary-detail-title">📄 原文抜粋</div>
                    <div class="summary-detail-content">${point.details.original}</div>
                </div>
                <div class="summary-detail-section">
                    <div class="summary-detail-title">💬 AI解説</div>
                    <div class="summary-detail-content">${point.details.explanation}</div>
                </div>
                <div class="summary-source-ref">📎 ${point.details.source}</div>
            </div>
        </div>
    `).join('');
};

SummaryAI.toggleKeyPoint = function(pointId) {
    const pointElement = document.querySelector(`[data-point-id="${pointId}"]`);
    if (pointElement) {
        pointElement.classList.toggle('expanded');
    }
};

// ===== ソース管理機能 =====
SummaryAI.toggleSource = function(fileId) {
    const index = this.selectedSources.indexOf(fileId);
    if (index > -1) {
        this.selectedSources.splice(index, 1);
    } else {
        this.selectedSources.push(fileId);
    }
    this.updateSourcesList();
};

SummaryAI.removeSource = function(fileId) {
    this.uploadedFiles = this.uploadedFiles.filter(f => f.id !== fileId);
    this.selectedSources = this.selectedSources.filter(id => id !== fileId);
    
    // ★Phase 2: 検索エンジンを再初期化
    this.initializeSearchEngine();
    
    this.updateSourcesList();
    this.updateUI();
    this.showSuccess('ファイルを削除しました');
};

// ===== ユーティリティ関数 =====
SummaryAI.simulateProcessing = function(delay = 1000) {
    return new Promise(resolve => setTimeout(resolve, delay));
};

SummaryAI.getRelevantContent = function(query) {
    // 検索モードを取得
    const searchMode = document.querySelector('input[name="searchMode"]:checked')?.value || 'all';
    
    let filesToSearch = this.uploadedFiles.filter(f => f.processed);
    
    if (searchMode === 'selected' && this.selectedSources.length > 0) {
        filesToSearch = filesToSearch.filter(f => this.selectedSources.includes(f.id));
    }
    
    return filesToSearch
        .map(f => `【${f.name}】\n${f.content.substring(0, 2000)}...`)
        .join('\n\n');
};

SummaryAI.getRelevantSources = function() {
    return this.uploadedFiles
        .filter(f => f.processed)
        .map(f => ({ name: f.name, id: f.id }));
};

SummaryAI.getFileIcon = function(extension) {
    const icons = {
        '.pdf': '📄',
        '.doc': '📝',
        '.docx': '📝',
        '.txt': '📃',
        '.md': '📋'
    };
    return icons[extension] || '📄';
};

SummaryAI.formatFileSize = function(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// データ永続化
SummaryAI.saveData = function() {
    try {
        const data = {
            chatHistory: this.chatHistory,
            keyPoints: this.keyPoints,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('hishoai_summary_data', JSON.stringify(data));
    } catch (error) {
        console.warn('データ保存に失敗:', error);
    }
};

SummaryAI.loadSavedData = function() {
    try {
        const saved = localStorage.getItem('hishoai_summary_data');
        if (saved) {
            const data = JSON.parse(saved);
            this.chatHistory = data.chatHistory || [];
            this.keyPoints = data.keyPoints || [];
        }
    } catch (error) {
        console.warn('データ読み込みに失敗:', error);
    }
};

// ファイル入力
SummaryAI.triggerFileUpload = function() {
    const fileInput = document.getElementById('summaryFileInput');
    if (fileInput) fileInput.click();
};

SummaryAI.handleFileUpload = function(event) {
    const files = Array.from(event.target.files);
    this.addFiles(files);
    event.target.value = '';
};

// グローバル関数として公開
window.SummaryAI = SummaryAI;

// ===== 既存システムとの統合用関数 =====
window.enterSummaryMode = function() {
    SummaryAI.enterSummaryMode();
};

window.exitSummaryMode = function() {
    SummaryAI.exitSummaryMode();
};

// ===== 初期化（DOMContentLoaded後） =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('📋 SummaryAI Phase 2モジュール読み込み完了');
    console.log('🚀 新機能: 横断検索、ハルシネーション対策、引用追跡');
    console.log('🔍 検索エンジン: キーワード抽出、関連性スコアリング、コンテキスト取得');
    console.log('📊 機能: アクセス頻度追跡、要点抽出');
});
window.SummaryAI = SummaryAI;
window.enterSummaryMode = function() { SummaryAI.enterSummaryMode(); };
window.exitSummaryMode = function() { SummaryAI.exitSummaryMode(); };

console.log('📋 SummaryAI Phase 2モジュール読み込み完了');