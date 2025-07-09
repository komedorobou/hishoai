// ===================================================================
// HishoAI Enhanced - 統合版会議ツールシステム（UIデザイン強化版・既存機能完全保持）
// 新UI：左パネル会話ビュー ｜ 右パネルAI分析結果
// ===================================================================

// ===== 状態管理クラス（統合版・既存機能完全保持） =====
class IntegratedTranscriptState {
    constructor() {
        this.audioFile = null;
        this.audioUrl = null;
        this.audioDuration = 0;
        this.currentTime = 0;
        this.isPlaying = false;
        this.playbackRate = 1.0;
        
        // 文字起こしデータ（既存機能保持）
        this.transcriptData = {
            segments: [],
            speakers: [],
            metadata: {},
            tags: []
        };
        
        // 構造化データ（既存機能保持）
        this.structuredData = {
            summary: '',
            keyPoints: [],
            questionsAnswers: [],
            actionItems: [],
            decisions: [],
            issues: [],
            tags: [],
            notes: '',
            confirmations: '',
            nextActions: ''
        };
        
        // UI状態（統合版）
        this.selectedSegments = new Set();
        this.currentHighlight = null;
        this.filterOptions = {
            speaker: 'all',
            marked: false,
            important: false,
            timeRange: null,
            tags: []
        };
        
        // 会議ツール専用状態（強化版）
        this.meetingMode = 'advanced'; // 'advanced' | 'legacy'
        this.currentMessage = null;
        this.analysisStats = {
            duration: 0,
            participants: 0,
            importantMessages: 0,
            actionItems: 0
        };
        
        // 編集状態（既存保持）
        this.editingStates = {
            summary: false,
            keyPoints: {},
            questionsAnswers: {},
            actionItems: {}
        };
        
        // UI強化用状態
        this.uiState = {
            isMobileAnalysisPanelOpen: false,
            currentlyPlayingSegment: null,
            isAutoScrollEnabled: true,
            highlightCurrentMessage: true
        };
    }
    
    // ===== 既存メソッド群（完全保持） =====
    
    // セグメント操作（既存機能保持）
    addSegment(segment) {
        const newSegment = {
            id: Date.now() + Math.random(),
            speakerId: segment.speakerId,
            text: segment.text,
            startTime: segment.startTime,
            endTime: segment.endTime,
            confidence: segment.confidence || 0.95,
            isMarked: false,
            isImportant: false,
            isChecked: false,
            tags: [],
            notes: '',
            reactions: []
        };
        this.transcriptData.segments.push(newSegment);
        this.updateAnalysisStats();
        return newSegment;
    }
    
    updateSegment(segmentId, updates) {
        const segment = this.transcriptData.segments.find(s => s.id === segmentId);
        if (segment) {
            Object.assign(segment, updates);
            this.notifySegmentUpdate(segment);
            this.updateAnalysisStats();
        }
    }
    
    toggleSegmentReaction(segmentId, reactionType) {
        const segment = this.transcriptData.segments.find(s => s.id === segmentId);
        if (segment) {
            const reactionIndex = segment.reactions.findIndex(r => r.type === reactionType);
            if (reactionIndex >= 0) {
                segment.reactions.splice(reactionIndex, 1);
            } else {
                segment.reactions.push({
                    type: reactionType,
                    timestamp: Date.now()
                });
            }
            this.notifySegmentUpdate(segment);
        }
    }
    
    // 話者管理（既存機能保持・強化版）
    addSpeaker(name, color, avatar = null) {
        const speaker = {
            id: Date.now() + Math.random(),
            name: name,
            color: color,
            avatar: avatar || this.generateAvatar(name),
            isActive: true,
            segmentCount: 0
        };
        this.transcriptData.speakers.push(speaker);
        this.updateAnalysisStats();
        return speaker;
    }
    
    updateSpeaker(speakerId, updates) {
        const speaker = this.transcriptData.speakers.find(s => s.id === speakerId);
        if (speaker) {
            Object.assign(speaker, updates);
            this.notifySpeakerUpdate(speaker);
        }
    }
    
    generateAvatar(name) {
        const colors = [
            '#3b82f6', // ブルー
            '#22c55e', // グリーン
            '#f59e0b', // アンバー
            '#ef4444', // レッド
            '#8b5cf6', // バイオレット
            '#06b6d4', // シアン
            '#f97316', // オレンジ
            '#ec4899'  // ピンク
        ];
        const initial = name.charAt(0).toUpperCase();
        const colorIndex = name.length % colors.length;
        return { initial, color: colors[colorIndex] };
    }
    
    // 構造化データ操作（既存機能保持）
    addKeyPoint(category, content, importance = 'medium', sourceSegmentId = null) {
        const keyPoint = {
            id: Date.now() + Math.random(),
            category,
            content,
            importance,
            sourceSegmentId,
            timestamp: Date.now(),
            isEditing: false,
            checked: false
        };
        this.structuredData.keyPoints.push(keyPoint);
        this.updateAnalysisStats();
        return keyPoint;
    }
    
    addQuestionAnswer(question, answer, speaker = '', sourceSegmentId = null) {
        const qa = {
            id: Date.now() + Math.random(),
            question,
            answer,
            speaker,
            sourceSegmentId,
            timestamp: Date.now(),
            isEditing: false
        };
        this.structuredData.questionsAnswers.push(qa);
        return qa;
    }
    
    addActionItem(task, assignee = '', deadline = '', priority = 'medium', sourceSegmentId = null) {
        const action = {
            id: Date.now() + Math.random(),
            task,
            assignee,
            deadline,
            priority,
            sourceSegmentId,
            completed: false,
            timestamp: Date.now(),
            isEditing: false
        };
        this.structuredData.actionItems.push(action);
        this.updateAnalysisStats();
        return action;
    }
    
    // ===== 新機能：会議ツール専用メソッド（強化版） =====
    
    // 統計情報更新（強化版）
    updateAnalysisStats() {
        this.analysisStats = {
            duration: Math.round(this.audioDuration / 60),
            participants: this.transcriptData.speakers.length,
            importantMessages: this.transcriptData.segments.filter(s => s.isImportant || s.isMarked).length,
            actionItems: this.structuredData.actionItems.length,
            completedActions: this.structuredData.actionItems.filter(a => a.completed).length,
            keyPointsCount: this.structuredData.keyPoints.length,
            questionsCount: this.structuredData.questionsAnswers.length
        };
    }
    
    // 会議メッセージ取得（新UI用・強化版）
    getMeetingMessages() {
        return this.transcriptData.segments.map(segment => {
            const speaker = this.transcriptData.speakers.find(s => s.id === segment.speakerId);
            return {
                id: segment.id,
                speaker: speaker?.name || '話者',
                avatar: speaker?.avatar?.initial || 'A',
                color: speaker?.avatar?.color || '#3b82f6',
                time: this.formatTime(segment.startTime),
                text: segment.text,
                isHighlight: segment.isImportant || segment.isMarked,
                confidence: segment.confidence,
                reactions: segment.reactions || [],
                notes: segment.notes || '',
                startTime: segment.startTime,
                endTime: segment.endTime,
                isCurrentlyPlaying: this.uiState.currentlyPlayingSegment === segment.id
            };
        });
    }
    
    // 分析データ取得（新UI用・強化版）
    getAnalysisData() {
        return {
            stats: this.analysisStats,
            summary: this.structuredData.summary,
            keyPoints: this.structuredData.keyPoints.map(point => ({
                id: point.id,
                content: point.content,
                category: point.category,
                importance: point.importance,
                checked: point.checked || false,
                sourceSegmentId: point.sourceSegmentId
            })),
            questionsAnswers: this.structuredData.questionsAnswers.map(qa => ({
                id: qa.id,
                question: qa.question,
                answer: qa.answer,
                speaker: qa.speaker,
                sourceSegmentId: qa.sourceSegmentId
            })),
            actionItems: this.structuredData.actionItems.map(action => ({
                id: action.id,
                task: action.task,
                assignee: action.assignee,
                deadline: action.deadline,
                priority: action.priority,
                completed: action.completed,
                sourceSegmentId: action.sourceSegmentId
            })),
            bookmarks: this.getBookmarks()
        };
    }
    
    // ブックマーク取得（強化版）
    getBookmarks() {
        return this.transcriptData.segments
            .filter(s => s.isMarked || s.isImportant)
            .map(s => ({
                id: s.id,
                time: this.formatTime(s.startTime),
                text: s.text.length > 50 ? s.text.substring(0, 50) + '...' : s.text,
                type: s.isImportant ? '重要' : 'マーク',
                startTime: s.startTime,
                confidence: s.confidence
            }));
    }
    
    // 現在再生中のセグメント管理
    setCurrentlyPlayingSegment(currentTime) {
        const currentSegment = this.transcriptData.segments.find(segment => 
            currentTime >= segment.startTime && currentTime <= segment.endTime
        );
        
        const previousSegmentId = this.uiState.currentlyPlayingSegment;
        this.uiState.currentlyPlayingSegment = currentSegment ? currentSegment.id : null;
        
        // セグメントが変わった場合にイベントを発火
        if (previousSegmentId !== this.uiState.currentlyPlayingSegment) {
            this.notifyCurrentSegmentChange(currentSegment);
        }
        
        return currentSegment;
    }
    
    // ===== 既存メソッド群（継続使用・完全保持） =====
    
    // フィルタリング機能（既存保持）
    getFilteredSegments() {
        return this.transcriptData.segments.filter(segment => {
            if (this.filterOptions.speaker !== 'all' && segment.speakerId !== this.filterOptions.speaker) {
                return false;
            }
            if (this.filterOptions.marked && !segment.isMarked) {
                return false;
            }
            if (this.filterOptions.important && !segment.isImportant) {
                return false;
            }
            if (this.filterOptions.timeRange) {
                const { start, end } = this.filterOptions.timeRange;
                if (segment.startTime < start || segment.endTime > end) {
                    return false;
                }
            }
            if (this.filterOptions.tags.length > 0) {
                const hasMatchingTag = this.filterOptions.tags.some(tag => 
                    segment.tags.includes(tag)
                );
                if (!hasMatchingTag) {
                    return false;
                }
            }
            return true;
        });
    }
    
    // 通知システム（既存保持・強化）
    notifySegmentUpdate(segment) {
        window.dispatchEvent(new CustomEvent('segmentUpdated', { detail: segment }));
    }
    
    notifySpeakerUpdate(speaker) {
        window.dispatchEvent(new CustomEvent('speakerUpdated', { detail: speaker }));
    }
    
    notifyCurrentSegmentChange(segment) {
        window.dispatchEvent(new CustomEvent('currentSegmentChanged', { detail: segment }));
    }
    
    // データ検索（既存保持・強化）
    searchSegments(query) {
        const searchTerm = query.toLowerCase();
        return this.transcriptData.segments.filter(segment => 
            segment.text.toLowerCase().includes(searchTerm) ||
            segment.notes.toLowerCase().includes(searchTerm) ||
            segment.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }
    
    // 統計情報（既存保持・強化）
    getStatistics() {
        const segments = this.transcriptData.segments;
        const speakers = this.transcriptData.speakers;
        
        return {
            totalSegments: segments.length,
            totalDuration: this.audioDuration,
            speakerCount: speakers.length,
            markedSegments: segments.filter(s => s.isMarked).length,
            importantSegments: segments.filter(s => s.isImportant).length,
            keyPointsCount: this.structuredData.keyPoints.length,
            questionsCount: this.structuredData.questionsAnswers.length,
            actionItemsCount: this.structuredData.actionItems.length,
            completedActionsCount: this.structuredData.actionItems.filter(a => a.completed).length,
            averageConfidence: segments.length > 0 ? 
                segments.reduce((sum, s) => sum + s.confidence, 0) / segments.length : 0,
            speakerStats: speakers.map(speaker => ({
                name: speaker.name,
                segmentCount: segments.filter(s => s.speakerId === speaker.id).length,
                totalDuration: segments
                    .filter(s => s.speakerId === speaker.id)
                    .reduce((total, s) => total + (s.endTime - s.startTime), 0),
                averageConfidence: (() => {
                    const speakerSegments = segments.filter(s => s.speakerId === speaker.id);
                    return speakerSegments.length > 0 ? 
                        speakerSegments.reduce((sum, s) => sum + s.confidence, 0) / speakerSegments.length : 0;
                })()
            }))
        };
    }
    
    // 時間フォーマット（統合版・強化）
    formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) return '0:00';
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${secs.toString().padStart(2, '0')}`;
        }
    }
    
    // UI状態管理（新機能）
    toggleMobileAnalysisPanel() {
        this.uiState.isMobileAnalysisPanelOpen = !this.uiState.isMobileAnalysisPanelOpen;
        return this.uiState.isMobileAnalysisPanelOpen;
    }
    
    setAutoScroll(enabled) {
        this.uiState.isAutoScrollEnabled = enabled;
    }
    
    setHighlightCurrentMessage(enabled) {
        this.uiState.highlightCurrentMessage = enabled;
    }
}

// ===== UIクラス（統合版・大幅強化） =====
class IntegratedTranscriptUI {
    constructor(manager) {
        this.manager = manager;
        this.container = document.querySelector('.transcript-container');
        this.editingElements = new Map();
        this.currentQuickActions = null;
        this.debounceTimers = new Map();
        this.animationFrameId = null;
        
        // UI状態管理
        this.uiState = {
            isInitialized: false,
            currentTheme: 'light',
            isMobile: window.innerWidth <= 768,
            isTablet: window.innerWidth <= 1024,
            scrollPosition: 0,
            lastUpdateTime: 0
        };
        
        // パフォーマンス最適化
        this.performanceConfig = {
            maxMessagesInView: 100,
            renderBatchSize: 20,
            scrollThrottleMs: 16,
            updateThrottleMs: 100
        };
    }
    
    render() {
        if (!this.container) {
            console.warn('transcript-container not found');
            return;
        }
        
        this.container.innerHTML = `
            <!-- 初期アップロードUI（既存保持・デザイン強化） -->
            <div class="upload-interface" id="uploadInterface">
                ${this.renderUploadArea()}
            </div>
            
            <!-- メインインターフェース（新会議ツールUI・強化版） -->
            <div class="main-transcript-interface hidden" id="mainInterface">
                ${this.renderMeetingInterface()}
            </div>
            
            <!-- 処理中表示（既存保持・デザイン強化） -->
            <div class="processing-overlay hidden" id="processingOverlay">
                ${this.renderProcessingOverlay()}
            </div>
            
            <!-- モバイルオーバーレイ（新機能） -->
            <div class="mobile-overlay" id="mobileOverlay" onclick="transcriptManager.ui.closeMobileAnalysisPanel()"></div>
        `;
        
        this.setupEventListeners();
        this.setupResizeObserver();
        this.uiState.isInitialized = true;
        
        console.log('✅ IntegratedTranscriptUI レンダリング完了');
    }
    
    // ===== 既存アップロードエリア（完全保持・デザイン強化） =====
    renderUploadArea() {
        return `
            <div class="transcript-upload-section">
                <div class="upload-header">
                    <h2>🎤 音声文字起こし＋構造化メモ</h2>
                    <p>音声ファイルをアップロードして、AI powered な議事録を作成しましょう</p>
                </div>
                
                <div class="file-upload-area" id="audioDropZone">
                    <div class="upload-icon">🎵</div>
                    <div class="upload-text">
                        <strong>音声ファイルをドロップまたは選択</strong>
                        <p>MP3, WAV, M4A, MP4形式に対応（最大25MB）</p>
                        <p>会議録音、インタビュー、講演等の音声を構造化します</p>
                    </div>
                    <input type="file" id="audioFileInput" accept="audio/*" class="file-input-hidden">
                </div>
                
                <div id="audioFileInfo" class="file-info hidden">
                    <div class="file-details">
                        <div class="file-name"></div>
                        <div class="file-size"></div>
                        <div class="file-duration"></div>
                    </div>
                    <button class="remove-file-btn" onclick="removeAudioFile()">🗑️ 削除</button>
                </div>
                
                <div class="audio-options">
                    <h4>📋 処理オプション</h4>
                    <label class="option-label">
                        <input type="checkbox" id="generateStructuredMemo" checked>
                        <span>構造化メモを自動生成する</span>
                    </label>
                    <label class="option-label">
                        <input type="checkbox" id="extractActionItems" checked>
                        <span>アクションアイテムを抽出する</span>
                    </label>
                    <label class="option-label">
                        <input type="checkbox" id="identifySpeakers" checked>
                        <span>話者を自動識別する</span>
                    </label>
                    <label class="option-label">
                        <input type="checkbox" id="enableAdvancedAnalysis" checked>
                        <span>高度分析（決定事項・課題抽出）を有効にする</span>
                    </label>
                </div>
                
                <div class="button-group">
                    <button class="btn btn-primary btn-lg" id="processAudioBtn" disabled>
                        🚀 文字起こし＋構造化開始
                    </button>
                    <button class="btn btn-secondary" onclick="showAudioSample()">
                        📄 サンプル表示
                    </button>
                </div>
            </div>
        `;
    }
    
    // ===== 新会議ツールインターフェース（大幅強化） =====
    renderMeetingInterface() {
        return `
            <!-- 会議ツールヘッダー（強化版） -->
            <div class="meeting-header">
                <button class="meeting-back-btn" onclick="transcriptManager.ui.backToUpload()">
                    ← 戻る
                </button>
                <span class="meeting-title">
                    ✏️ 音声文字起こし会議
                </span>
                <div class="meeting-meta">
                    <span>📅 ${new Date().toLocaleDateString('ja-JP')}</span>
                    <span class="meeting-duration" id="meetingDuration">⏱️ --:--</span>
                    <div class="meeting-participant">
                        <div class="meeting-participant-avatar">AI</div>
                        <span>AI分析</span>
                    </div>
                    <div class="meeting-tags">
                        <span class="meeting-tag">音声</span>
                        <span class="meeting-tag">AI分析</span>
                    </div>
                </div>
            </div>

            <!-- 2パネルコンテンツ（強化版） -->
            <div class="meeting-content-layout">
                <!-- 左パネル：チャットビュー（強化版） -->
                <div class="meeting-chat-panel">
                    <div class="meeting-chat-header">
                        <h3 class="meeting-chat-title">📝 音声記録</h3>
                        <div class="meeting-export-buttons">
                            <button class="meeting-export-btn" onclick="transcriptManager.exportToWord()">
                                📄 <span>Word出力</span>
                            </button>
                            <button class="meeting-export-btn secondary" onclick="transcriptManager.copyToClipboard()">
                                📋 <span>コピー</span>
                            </button>
                            <button class="meeting-export-btn secondary" onclick="transcriptManager.ui.toggleMobileAnalysisPanel()" id="mobileToggleBtn" style="display: none;">
                                📊 <span>分析結果</span>
                            </button>
                        </div>
                    </div>

                    <div class="meeting-messages-area" id="meetingMessages">
                        ${this.renderWelcomeMessage()}
                    </div>

                    <!-- 音声プレイヤー（強化版） -->
                    <div class="meeting-audio-player">
                        <button class="meeting-play-btn" id="meetingPlayBtn" title="再生/一時停止 (Space)">
                            ▶️
                        </button>
                        <div class="meeting-progress-area">
                            <span class="meeting-time-display" id="meetingCurrentTime">0:00</span>
                            <div class="meeting-progress-bar" id="meetingProgressBar" title="クリックして再生位置を変更">
                                <div class="meeting-progress-fill" id="meetingProgressFill"></div>
                            </div>
                            <span class="meeting-time-display" id="meetingTotalTime">0:00</span>
                            <div class="meeting-speed-controls">
                                <button class="meeting-speed-btn" onclick="transcriptManager.setPlaybackRate(1.0)" title="通常速度">1x</button>
                                <button class="meeting-speed-btn active" onclick="transcriptManager.setPlaybackRate(1.5)" title="1.5倍速">1.5x</button>
                                <button class="meeting-speed-btn" onclick="transcriptManager.setPlaybackRate(2.0)" title="2倍速">2x</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 右パネル：AI分析結果（強化版） -->
                <div class="meeting-analysis-panel" id="meetingAnalysisPanel">
                    <div class="meeting-analysis-header">
                        <h3 class="meeting-analysis-title">🤖 AI分析結果</h3>
                        <button class="meeting-editor-btn" onclick="transcriptManager.ui.openEditor()" title="校正AIエディタを開く">
                            ✏️ エディタ
                        </button>
                    </div>

                    <div class="meeting-analysis-content" id="meetingAnalysisContent">
                        ${this.renderAnalysisPlaceholder()}
                    </div>
                </div>
            </div>
        `;
    }
    
    renderWelcomeMessage() {
        return `
            <div class="meeting-message">
                <div class="meeting-message-avatar" style="background: #94a3b8;">🤖</div>
                <div class="meeting-message-content">
                    <div class="meeting-message-header">
                        <span class="meeting-message-sender">AI アシスタント</span>
                        <span class="meeting-message-time">--:--</span>
                    </div>
                    <div class="meeting-message-text">
                        音声ファイルの処理が完了すると、ここに発言内容が表示されます。
                        <br><br>
                        <strong>✨ 主な機能：</strong>
                        <br>• 高精度な音声文字起こし
                        <br>• AI による要点自動抽出
                        <br>• 話者の自動識別
                        <br>• アクションアイテムの抽出
                        <br>• Word文書への出力
                    </div>
                </div>
            </div>
        `;
    }
    
    renderAnalysisPlaceholder() {
        return `
            <div class="meeting-analysis-section">
                <div class="meeting-section-header">
                    <div class="meeting-section-title">
                        <span class="meeting-status-indicator meeting-status-processing"></span>
                        📊 分析準備中
                    </div>
                </div>
                <p style="text-align: center; color: var(--gray-600); padding: 2rem;">
                    音声ファイルの処理が完了すると、<br>
                    AI による詳細な分析結果がここに表示されます。
                </p>
            </div>
        `;
    }
    
    // ===== 既存処理中表示（完全保持・デザイン強化） =====
    renderProcessingOverlay() {
        return `
            <div class="processing-content">
                <div class="processing-animation">
                    <div class="audio-wave">
                        <div class="wave-bar"></div>
                        <div class="wave-bar"></div>
                        <div class="wave-bar"></div>
                        <div class="wave-bar"></div>
                        <div class="wave-bar"></div>
                    </div>
                </div>
                <h3 id="processingTitle">音声を処理中...</h3>
                <p id="processingDescription">Whisper APIで高精度な文字起こしを実行しています</p>
                <div class="processing-steps">
                    <div class="step active" id="step1">
                        <div class="step-icon">🎵</div>
                        <div class="step-text">音声アップロード</div>
                    </div>
                    <div class="step" id="step2">
                        <div class="step-icon">🤖</div>
                        <div class="step-text">文字起こし</div>
                    </div>
                    <div class="step" id="step3">
                        <div class="step-icon">📊</div>
                        <div class="step-text">構造化分析</div>
                    </div>
                    <div class="step" id="step4">
                        <div class="step-icon">✅</div>
                        <div class="step-text">完了</div>
                    </div>
                </div>
                <div class="processing-progress">
                    <div class="progress-bar" id="progressBar"></div>
                </div>
            </div>
        `;
    }
    
    // ===== 会議メッセージ表示（大幅強化） =====
    renderMeetingMessages() {
        const messagesContainer = document.getElementById('meetingMessages');
        if (!messagesContainer) return;
        
        const messages = this.manager.state.getMeetingMessages();
        
        if (messages.length === 0) {
            messagesContainer.innerHTML = this.renderWelcomeMessage();
            return;
        }
        
        // パフォーマンス最適化：バッチレンダリング
        this.renderMessagesWithBatching(messagesContainer, messages);
    }
    
    renderMessagesWithBatching(container, messages) {
        const batchSize = this.performanceConfig.renderBatchSize;
        let currentBatch = 0;
        
        // 既存メッセージをクリア
        container.innerHTML = '';
        
        const renderBatch = () => {
            const start = currentBatch * batchSize;
            const end = Math.min(start + batchSize, messages.length);
            
            const fragment = document.createDocumentFragment();
            
            for (let i = start; i < end; i++) {
                const messageElement = this.createMessageElement(messages[i]);
                fragment.appendChild(messageElement);
            }
            
            container.appendChild(fragment);
            
            currentBatch++;
            
            // 次のバッチがある場合は続行
            if (end < messages.length) {
                requestAnimationFrame(renderBatch);
            } else {
                // レンダリング完了後の処理
                this.onMessagesRendered(container);
            }
        };
        
        renderBatch();
    }
    
    createMessageElement(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `meeting-message ${message.isHighlight ? 'highlight' : ''} ${message.isCurrentlyPlaying ? 'current' : ''}`;
        messageDiv.setAttribute('data-message-id', message.id);
        messageDiv.setAttribute('data-start-time', message.startTime);
        
        messageDiv.innerHTML = `
            <div class="meeting-message-avatar" style="background: ${message.color};" title="${message.speaker}">
                ${message.avatar}
            </div>
            <div class="meeting-message-content">
                <div class="meeting-message-header">
                    <span class="meeting-message-sender">${this.escapeHtml(message.speaker)}</span>
                    <span class="meeting-message-time" onclick="transcriptManager.seekToTime('${message.time}')" title="クリックしてこの時刻にジャンプ">
                        ${message.time}
                    </span>
                </div>
                <div class="meeting-message-text">${this.escapeHtml(message.text)}</div>
                ${message.notes ? `
                    <div class="meeting-message-notes">
                        📝 ${this.escapeHtml(message.notes)}
                    </div>
                ` : ''}
                ${message.reactions && message.reactions.length > 0 ? `
                    <div class="meeting-message-reactions">
                        ${message.reactions.map(r => `
                            <span class="meeting-reaction" title="${r.type}">
                                ${this.getReactionEmoji(r.type)}
                            </span>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
        
        return messageDiv;
    }
    
    getReactionEmoji(reactionType) {
        const emojiMap = {
            'important': '⭐',
            'question': '❓',
            'action': '✅',
            'decision': '🎯',
            'issue': '⚠️',
            'agree': '👍',
            'disagree': '👎'
        };
        return emojiMap[reactionType] || '📝';
    }
    
    onMessagesRendered(container) {
        // 自動スクロール
        if (this.manager.state.uiState.isAutoScrollEnabled) {
            container.scrollTop = container.scrollHeight;
        }
        
        // 現在再生中のメッセージをハイライト
        this.updateCurrentMessageHighlight();
        
        // パフォーマンス測定
        this.manager.state.uiState.lastUpdateTime = Date.now();
    }
    
    // ===== AI分析結果表示（大幅強化） =====
    renderAnalysisContent() {
        const analysisContainer = document.getElementById('meetingAnalysisContent');
        if (!analysisContainer) return;
        
        const analysisData = this.manager.state.getAnalysisData();
        
        analysisContainer.innerHTML = `
            <!-- 要約統計（強化版） -->
            <div class="meeting-summary-stats">
                <div class="meeting-stats-title">📊 会議概要</div>
                <div class="meeting-stats-grid">
                    <div class="meeting-stat-item">
                        <div class="meeting-stat-value">${analysisData.stats.duration}</div>
                        <div class="meeting-stat-label">分</div>
                    </div>
                    <div class="meeting-stat-item">
                        <div class="meeting-stat-value">${analysisData.stats.participants}</div>
                        <div class="meeting-stat-label">参加者</div>
                    </div>
                    <div class="meeting-stat-item">
                        <div class="meeting-stat-value">${analysisData.stats.importantMessages}</div>
                        <div class="meeting-stat-label">重要発言</div>
                    </div>
                    <div class="meeting-stat-item">
                        <div class="meeting-stat-value">${analysisData.stats.actionItems}</div>
                        <div class="meeting-stat-label">アクション</div>
                    </div>
                </div>
            </div>

            <!-- 要約セクション（新機能） -->
            ${analysisData.summary ? `
                <div class="meeting-analysis-section">
                    <div class="meeting-section-header">
                        <div class="meeting-section-title">
                            <span class="meeting-status-indicator meeting-status-completed"></span>
                            📋 会議要約
                        </div>
                        <button class="meeting-copy-btn" onclick="transcriptManager.ui.copyToClipboard('summary')" title="要約をクリップボードにコピー">
                            📋 コピー
                        </button>
                    </div>
                    <div style="padding: 1rem; background: var(--meeting-bg-main); border-radius: var(--radius-lg); line-height: 1.6;">
                        ${this.escapeHtml(analysisData.summary)}
                    </div>
                </div>
            ` : ''}

            <!-- 要点一覧（強化版） -->
            <div class="meeting-analysis-section">
                <div class="meeting-section-header">
                    <div class="meeting-section-title">
                        <span class="meeting-status-indicator meeting-status-completed"></span>
                        📌 要点一覧
                    </div>
                    <button class="meeting-copy-btn" onclick="transcriptManager.ui.copyToClipboard('keyPoints')" title="要点をクリップボードにコピー">
                        📋 コピー
                    </button>
                </div>

                <ul class="meeting-checklist">
                    ${analysisData.keyPoints.map((point, index) => `
                        <li class="meeting-checklist-item">
                            <input type="checkbox" id="keypoint_${index}" ${point.checked ? 'checked' : ''} 
                                onchange="transcriptManager.ui.toggleKeyPoint(${index}, this.checked)"
                                title="チェックして完了をマーク">
                            <label for="keypoint_${index}" title="${point.category} - 重要度: ${point.importance}">
                                <strong>[${point.category}]</strong> ${this.escapeHtml(point.content)}
                            </label>
                        </li>
                    `).join('')}
                    ${analysisData.keyPoints.length === 0 ? `
                        <li class="meeting-checklist-item">
                            <label>AI分析が完了すると要点が表示されます</label>
                        </li>
                    ` : ''}
                </ul>
            </div>

            <!-- アクションアイテム（新機能） -->
            ${analysisData.actionItems.length > 0 ? `
                <div class="meeting-analysis-section">
                    <div class="meeting-section-header">
                        <div class="meeting-section-title">
                            <span class="meeting-status-indicator meeting-status-completed"></span>
                            ✅ アクションアイテム
                        </div>
                        <button class="meeting-copy-btn" onclick="transcriptManager.ui.copyToClipboard('actionItems')" title="アクションアイテムをコピー">
                            📋 コピー
                        </button>
                    </div>

                    <ul class="meeting-checklist">
                        ${analysisData.actionItems.map((action, index) => `
                            <li class="meeting-checklist-item">
                                <input type="checkbox" id="action_${index}" ${action.completed ? 'checked' : ''} 
                                    onchange="transcriptManager.ui.toggleActionItem(${index}, this.checked)"
                                    title="チェックして完了をマーク">
                                <label for="action_${index}">
                                    <div style="font-weight: 600;">${this.escapeHtml(action.task)}</div>
                                    ${action.assignee || action.deadline ? `
                                        <div style="font-size: 12px; color: var(--gray-600); margin-top: 4px;">
                                            ${action.assignee ? `👤 ${this.escapeHtml(action.assignee)}` : ''}
                                            ${action.deadline ? ` 📅 ${this.escapeHtml(action.deadline)}` : ''}
                                            ${action.priority ? ` 🎯 ${action.priority}` : ''}
                                        </div>
                                    ` : ''}
                                </label>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}

            <!-- 質問と回答（強化版） -->
            <div class="meeting-analysis-section">
                <div class="meeting-section-header">
                    <div class="meeting-section-title">
                        <span class="meeting-status-indicator meeting-status-completed"></span>
                        ❓ 質問と回答
                    </div>
                    <button class="meeting-copy-btn" onclick="transcriptManager.ui.copyToClipboard('qa')" title="Q&Aをコピー">
                        📋 コピー
                    </button>
                </div>

                ${analysisData.questionsAnswers.map(qa => `
                    <div class="meeting-qa-item">
                        <div class="meeting-qa-question">Q: ${this.escapeHtml(qa.question)}</div>
                        <div class="meeting-qa-answer">A: ${this.escapeHtml(qa.answer)}</div>
                        ${qa.speaker ? `
                            <div class="meeting-qa-speaker">回答者: ${this.escapeHtml(qa.speaker)}</div>
                        ` : ''}
                    </div>
                `).join('')}
                ${analysisData.questionsAnswers.length === 0 ? `
                    <div class="meeting-qa-item">
                        <div class="meeting-qa-question">AI分析が完了すると質問と回答が表示されます</div>
                    </div>
                ` : ''}
            </div>

            <!-- 発言ブックマーク（強化版） -->
            <div class="meeting-analysis-section">
                <div class="meeting-section-header">
                    <div class="meeting-section-title">
                        <span class="meeting-status-indicator meeting-status-completed"></span>
                        🔖 発言ブックマーク
                    </div>
                    <button class="meeting-copy-btn" onclick="transcriptManager.ui.copyToClipboard('bookmarks')" title="ブックマークをコピー">
                        📋 コピー
                    </button>
                </div>

                ${analysisData.bookmarks.map(bookmark => `
                    <div class="meeting-bookmark-item" onclick="transcriptManager.jumpToSegment('${bookmark.id}')" title="クリックしてこの発言にジャンプ">
                        <div class="meeting-bookmark-time">${bookmark.time}</div>
                        <div class="meeting-bookmark-text">
                            <span style="font-size: 12px; color: var(--gray-500);">[${bookmark.type}]</span>
                            ${this.escapeHtml(bookmark.text)}
                        </div>
                    </div>
                `).join('')}
                ${analysisData.bookmarks.length === 0 ? `
                    <div class="meeting-bookmark-item">
                        <div class="meeting-bookmark-text">重要発言やマーク済み発言がここに表示されます</div>
                    </div>
                ` : ''}
            </div>
        `;
        
        // アニメーション効果を適用
        this.applyAnimationEffects(analysisContainer);
    }
    
    applyAnimationEffects(container) {
        const sections = container.querySelectorAll('.meeting-analysis-section');
        sections.forEach((section, index) => {
            section.style.animationDelay = `${index * 0.1}s`;
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            
            requestAnimationFrame(() => {
                section.style.transition = 'all 0.5s ease';
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            });
        });
    }
    
    // ===== 既存機能群（完全保持・強化） =====
    
    // ファイル情報表示（既存保持・強化版）
    showFileInfo(file) {
        const fileInfo = document.getElementById('audioFileInfo');
        if (!fileInfo) return;
        
        fileInfo.querySelector('.file-name').textContent = file.name;
        fileInfo.querySelector('.file-size').textContent = `サイズ: ${(file.size / 1024 / 1024).toFixed(2)} MB`;
        fileInfo.classList.remove('hidden');
        
        // ファイル情報のアニメーション
        fileInfo.style.opacity = '0';
        fileInfo.style.transform = 'translateY(-10px)';
        requestAnimationFrame(() => {
            fileInfo.style.transition = 'all 0.3s ease';
            fileInfo.style.opacity = '1';
            fileInfo.style.transform = 'translateY(0)';
        });
    }
    
    updateAudioInfo(file, duration) {
        const durationElement = document.querySelector('#audioFileInfo .file-duration');
        if (durationElement) {
            durationElement.textContent = `時間: ${this.manager.formatTime(duration)}`;
        }
    }
    
    // 処理表示制御（既存保持・強化版）
    showProcessing(title, description) {
        const overlay = document.getElementById('processingOverlay');
        if (overlay) {
            document.getElementById('processingTitle').textContent = title;
            document.getElementById('processingDescription').textContent = description;
            overlay.classList.remove('hidden');
            this.updateProcessingProgress(0);
            
            // 処理開始アニメーション
            overlay.style.opacity = '0';
            requestAnimationFrame(() => {
                overlay.style.transition = 'opacity 0.3s ease';
                overlay.style.opacity = '1';
            });
        }
    }
    
    updateProcessingStep(stepNumber, description) {
        // 前のステップを非アクティブに
        document.querySelectorAll('.step.active').forEach(step => {
            step.classList.remove('active');
        });
        
        const step = document.getElementById(`step${stepNumber}`);
        if (step) {
            step.classList.add('active');
        }
        
        document.getElementById('processingDescription').textContent = description;
        this.updateProcessingProgress(stepNumber * 25);
    }
    
    updateProcessingProgress(percentage) {
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
    }
    
    hideProcessing() {
        const overlay = document.getElementById('processingOverlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.classList.add('hidden');
            }, 300);
        }
    }
    
    showMainInterface() {
        document.getElementById('uploadInterface').classList.add('hidden');
        document.getElementById('mainInterface').classList.remove('hidden');
        
        // インターフェース切り替えアニメーション
        const mainInterface = document.getElementById('mainInterface');
        mainInterface.style.opacity = '0';
        requestAnimationFrame(() => {
            mainInterface.style.transition = 'opacity 0.5s ease';
            mainInterface.style.opacity = '1';
        });
        
        this.renderMeetingMessages();
        this.renderAnalysisContent();
        this.updateMeetingMeta();
        this.setupMobileDetection();
        this.setupPerformanceOptimizations();
    }
    
    // ===== 新機能：UI制御（大幅強化） =====
    
    updateMeetingMeta() {
        const durationElement = document.getElementById('meetingDuration');
        if (durationElement && this.manager.state.audioDuration > 0) {
            durationElement.textContent = `⏱️ ${this.manager.formatTime(this.manager.state.audioDuration)}`;
        }
        
        // 参加者数も更新
        const participants = this.manager.state.transcriptData.speakers.length;
        const participantElements = document.querySelectorAll('.meeting-participant span');
        participantElements.forEach(el => {
            el.textContent = `${participants}名参加`;
        });
    }
    
    updatePlayButton(isPlaying) {
        const playBtn = document.getElementById('meetingPlayBtn');
        if (playBtn) {
            playBtn.textContent = isPlaying ? '⏸️' : '▶️';
            playBtn.title = isPlaying ? '一時停止 (Space)' : '再生 (Space)';
            
            // ボタンアニメーション
            playBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                playBtn.style.transform = 'scale(1)';
            }, 100);
        }
        
        // 速度ボタンの更新
        document.querySelectorAll('.meeting-speed-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const currentRateBtn = document.querySelector(`[onclick*="${this.manager.state.playbackRate}"]`);
        if (currentRateBtn) {
            currentRateBtn.classList.add('active');
        }
    }
    
    updateTimeDisplay(currentTime, totalTime) {
        const current = document.getElementById('meetingCurrentTime');
        const total = document.getElementById('meetingTotalTime');
        
        if (current) current.textContent = this.manager.formatTime(currentTime);
        if (total) total.textContent = this.manager.formatTime(totalTime);
    }
    
    updateProgress(progress) {
        const progressFill = document.getElementById('meetingProgressFill');
        if (progressFill) {
            progressFill.style.width = `${Math.max(0, Math.min(100, progress * 100))}%`;
        }
    }
    
    updateCurrentMessageHighlight() {
        if (!this.manager.state.uiState.highlightCurrentMessage) return;
        
        const currentTime = this.manager.state.currentTime;
        const currentSegment = this.manager.state.setCurrentlyPlayingSegment(currentTime);
        
        // 既存ハイライトを削除
        document.querySelectorAll('.meeting-message.current').forEach(el => {
            el.classList.remove('current');
        });
        
        if (currentSegment) {
            const messageElement = document.querySelector(`[data-message-id="${currentSegment.id}"]`);
            if (messageElement) {
                messageElement.classList.add('current');
                
                // 自動スクロール
                if (this.manager.state.uiState.isAutoScrollEnabled) {
                    this.scrollToMessage(messageElement);
                }
            }
        }
    }
    
    scrollToMessage(messageElement) {
        if (!messageElement) return;
        
        const container = document.getElementById('meetingMessages');
        if (!container) return;
        
        const containerRect = container.getBoundingClientRect();
        const messageRect = messageElement.getBoundingClientRect();
        
        // メッセージが見えていない場合のみスクロール
        if (messageRect.top < containerRect.top || messageRect.bottom > containerRect.bottom) {
            messageElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center',
                inline: 'nearest'
            });
        }
    }
    
    // ===== モバイル対応（強化版） =====
    
    setupMobileDetection() {
        this.uiState.isMobile = window.innerWidth <= 768;
        this.uiState.isTablet = window.innerWidth <= 1024;
        
        const mobileToggleBtn = document.getElementById('mobileToggleBtn');
        if (this.uiState.isMobile && mobileToggleBtn) {
            mobileToggleBtn.style.display = 'flex';
        }
        
        // モバイル専用の最適化
        if (this.uiState.isMobile) {
            this.setupMobileOptimizations();
        }
    }
    
    setupMobileOptimizations() {
        // タッチイベントの最適化
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
        
        // ビューポートの調整
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        }
    }
    
    handleTouchStart(e) {
        // タッチフィードバックの改善
        const target = e.target.closest('.meeting-message, .meeting-bookmark-item, .meeting-checklist-item');
        if (target) {
            target.style.transform = 'scale(0.98)';
            setTimeout(() => {
                target.style.transform = '';
            }, 150);
        }
    }
    
    toggleMobileAnalysisPanel() {
        const panel = document.getElementById('meetingAnalysisPanel');
        const overlay = document.getElementById('mobileOverlay');
        
        if (panel && overlay) {
            const isOpen = this.manager.state.uiState.toggleMobileAnalysisPanel();
            
            panel.classList.toggle('open', isOpen);
            overlay.classList.toggle('active', isOpen);
            
            // フォーカス管理
            if (isOpen) {
                panel.focus();
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
    }
    
    closeMobileAnalysisPanel() {
        if (this.manager.state.uiState.isMobileAnalysisPanelOpen) {
            this.toggleMobileAnalysisPanel();
        }
    }
    
    // ===== インタラクション機能（大幅強化） =====
    
    toggleKeyPoint(index, checked) {
        const keyPoint = this.manager.state.structuredData.keyPoints[index];
        if (keyPoint) {
            keyPoint.checked = checked;
            console.log(`要点 ${index} を${checked ? 'チェック' : 'チェック解除'}しました`);
            
            // 統計更新
            this.manager.state.updateAnalysisStats();
            this.updateAnalysisStats();
        }
    }
    
    toggleActionItem(index, checked) {
        const actionItem = this.manager.state.structuredData.actionItems[index];
        if (actionItem) {
            actionItem.completed = checked;
            console.log(`アクション ${index} を${checked ? '完了' : '未完了'}に変更しました`);
            
            // 統計更新
            this.manager.state.updateAnalysisStats();
            this.updateAnalysisStats();
        }
    }
    
    updateAnalysisStats() {
        const statsElements = document.querySelectorAll('.meeting-stat-value');
        const stats = this.manager.state.analysisStats;
        
        if (statsElements[3]) {
            statsElements[3].textContent = stats.completedActions || stats.actionItems;
        }
    }
    
    copyToClipboard(type) {
        let textToCopy = '';
        const data = this.manager.state.structuredData;
        
        switch (type) {
            case 'summary':
                textToCopy = data.summary;
                break;
            case 'keyPoints':
                textToCopy = data.keyPoints.map(point => `• [${point.category}] ${point.content}`).join('\n');
                break;
            case 'qa':
                textToCopy = data.questionsAnswers.map(qa => `Q: ${qa.question}\nA: ${qa.answer}`).join('\n\n');
                break;
            case 'actionItems':
                textToCopy = data.actionItems.map(action => {
                    let text = `• ${action.task}`;
                    if (action.assignee) text += ` (担当: ${action.assignee})`;
                    if (action.deadline) text += ` (期限: ${action.deadline})`;
                    return text;
                }).join('\n');
                break;
            case 'bookmarks':
                const bookmarks = this.manager.state.getBookmarks();
                textToCopy = bookmarks.map(b => `[${b.time}] ${b.text}`).join('\n');
                break;
        }
        
        if (textToCopy && navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                showNotification('クリップボードにコピーしました', 'success');
            }).catch(err => {
                console.error('Copy failed:', err);
                showNotification('コピーに失敗しました', 'error');
            });
        } else if (textToCopy) {
            // フォールバック方式
            this.fallbackCopy(textToCopy);
        }
    }
    
    fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            showNotification('クリップボードにコピーしました', 'success');
        } catch (err) {
            showNotification('コピーに失敗しました', 'error');
        }
        
        document.body.removeChild(textArea);
    }
    
    openEditor() {
        // 既存のエディタ機能と連携
        if (window.HishoAI && window.HishoAI.Correction) {
            switchTab('correction');
            showNotification('校正AIエディタを開きました', 'info');
        } else if (typeof switchTab === 'function') {
            switchTab('correction');
            showNotification('校正AIエディタを開きました', 'info');
        } else {
            showNotification('エディタ機能を準備中です', 'info');
        }
    }
    
    backToUpload() {
        if (confirm('アップロード画面に戻りますか？現在の分析結果は保持されます。')) {
            const mainInterface = document.getElementById('mainInterface');
            const uploadInterface = document.getElementById('uploadInterface');
            
            // アニメーション付きで切り替え
            mainInterface.style.opacity = '0';
            setTimeout(() => {
                mainInterface.classList.add('hidden');
                uploadInterface.classList.remove('hidden');
                uploadInterface.style.opacity = '0';
                requestAnimationFrame(() => {
                    uploadInterface.style.transition = 'opacity 0.3s ease';
                    uploadInterface.style.opacity = '1';
                });
            }, 300);
        }
    }
    
    // ===== パフォーマンス最適化 =====
    
    setupPerformanceOptimizations() {
        // スクロールイベントのスロットリング
        const messagesArea = document.getElementById('meetingMessages');
        if (messagesArea) {
            messagesArea.addEventListener('scroll', this.throttle(
                this.handleMessagesScroll.bind(this), 
                this.performanceConfig.scrollThrottleMs
            ));
        }
        
        // リサイズイベントの最適化
        this.setupResizeObserver();
        
        // 仮想スクロールの準備（大量メッセージ対応）
        this.setupVirtualScrolling();
    }
    
    handleMessagesScroll(e) {
        const container = e.target;
        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;
        
        // 自動スクロールの停止判定
        if (scrollTop + clientHeight < scrollHeight - 50) {
            this.manager.state.setAutoScroll(false);
        }
        
        // 下部にスクロールしたら自動スクロールを再開
        if (scrollTop + clientHeight >= scrollHeight - 10) {
            this.manager.state.setAutoScroll(true);
        }
    }
    
    setupResizeObserver() {
        if (window.ResizeObserver) {
            const resizeObserver = new ResizeObserver(this.debounce(() => {
                this.handleResize();
            }, 250));
            
            resizeObserver.observe(document.body);
        } else {
            // フォールバック
            window.addEventListener('resize', this.debounce(() => {
                this.handleResize();
            }, 250));
        }
    }
    
    handleResize() {
        const wasMobile = this.uiState.isMobile;
        this.setupMobileDetection();
        
        // モバイル↔デスクトップの切り替え時の処理
        if (wasMobile !== this.uiState.isMobile) {
            this.handleViewportChange();
        }
    }
    
    handleViewportChange() {
        // ビューポート変更時の最適化
        if (this.uiState.isMobile) {
            this.closeMobileAnalysisPanel();
        }
        
        // レイアウトの再計算
        this.recalculateLayout();
    }
    
    recalculateLayout() {
        // レイアウトの強制再計算
        requestAnimationFrame(() => {
            const messagesArea = document.getElementById('meetingMessages');
            if (messagesArea) {
                messagesArea.style.height = 'auto';
                messagesArea.offsetHeight; // リフロー強制
                messagesArea.style.height = '';
            }
        });
    }
    
    setupVirtualScrolling() {
        // 将来の大量メッセージ対応のための準備
        this.virtualScrollConfig = {
            enabled: false,
            itemHeight: 100,
            bufferSize: 10,
            visibleRange: { start: 0, end: 50 }
        };
    }
    
    // ===== イベントリスナー設定（大幅強化） =====
    setupEventListeners() {
        this.setupAudioPlayerListeners();
        this.setupProgressBarListeners();
        this.setupFileHandling();
        this.setupKeyboardShortcuts();
        this.setupCustomEvents();
        this.setupAccessibilityFeatures();
    }
    
    setupAudioPlayerListeners() {
        const playBtn = document.getElementById('meetingPlayBtn');
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                this.manager.togglePlayPause();
            });
            
            // タッチデバイス対応
            playBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                playBtn.style.transform = 'scale(0.95)';
            });
            
            playBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                playBtn.style.transform = 'scale(1)';
                this.manager.togglePlayPause();
            });
        }
    }
    
    setupProgressBarListeners() {
        const progressBar = document.getElementById('meetingProgressBar');
        if (progressBar) {
            // クリックでシーク
            progressBar.addEventListener('click', (e) => {
                const rect = progressBar.getBoundingClientRect();
                const clickPosition = (e.clientX - rect.left) / rect.width;
                const seekTime = clickPosition * this.manager.state.audioDuration;
                this.manager.seekTo(seekTime);
            });
            
            // ドラッグでシーク
            let isDragging = false;
            
            progressBar.addEventListener('mousedown', (e) => {
                isDragging = true;
                progressBar.style.cursor = 'grabbing';
            });
            
            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                
                const rect = progressBar.getBoundingClientRect();
                const clickPosition = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                const seekTime = clickPosition * this.manager.state.audioDuration;
                this.manager.seekTo(seekTime);
            });
            
            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    progressBar.style.cursor = 'pointer';
                }
            });
            
            // タッチデバイス対応
            progressBar.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                const rect = progressBar.getBoundingClientRect();
                const clickPosition = (touch.clientX - rect.left) / rect.width;
                const seekTime = clickPosition * this.manager.state.audioDuration;
                this.manager.seekTo(seekTime);
            });
        }
    }
    
    setupFileHandling() {
        const dropZone = document.getElementById('audioDropZone');
        if (dropZone) {
            dropZone.addEventListener('dragover', this.handleDragOver.bind(this));
            dropZone.addEventListener('dragleave', this.handleDragLeave.bind(this));
            dropZone.addEventListener('drop', this.handleFileDrop.bind(this));
            dropZone.addEventListener('click', () => {
                document.getElementById('audioFileInput').click();
            });
        }
        
        const fileInput = document.getElementById('audioFileInput');
        if (fileInput) {
            fileInput.addEventListener('change', this.handleFileSelect.bind(this));
        }
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // 入力フィールドにフォーカスがある場合はスキップ
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            switch (e.code) {
                case 'Space':
                    e.preventDefault();
                    this.manager.togglePlayPause();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.manager.seekRelative(e.shiftKey ? -30 : -5);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.manager.seekRelative(e.shiftKey ? 30 : 5);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.adjustPlaybackRate(0.25);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.adjustPlaybackRate(-0.25);
                    break;
                case 'KeyM':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.toggleMobileAnalysisPanel();
                    }
                    break;
                case 'KeyC':
                    if (e.ctrlKey || e.metaKey) {
                        // デフォルトのコピー動作を許可
                        break;
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.closeMobileAnalysisPanel();
                    break;
            }
        });
    }
    
    adjustPlaybackRate(delta) {
        const currentRate = this.manager.state.playbackRate;
        const newRate = Math.max(0.5, Math.min(3.0, currentRate + delta));
        this.manager.setPlaybackRate(newRate);
        
        showNotification(`再生速度: ${newRate}x`, 'info');
    }
    
    setupCustomEvents() {
        // セグメント更新イベント
        window.addEventListener('segmentUpdated', (e) => {
            this.renderMeetingMessages();
            this.renderAnalysisContent();
        });
        
        // 話者更新イベント
        window.addEventListener('speakerUpdated', (e) => {
            this.renderMeetingMessages();
        });
        
        // 現在セグメント変更イベント
        window.addEventListener('currentSegmentChanged', (e) => {
            this.updateCurrentMessageHighlight();
        });
        
        // API キー更新イベント
        window.addEventListener('apiKeyUpdated', (e) => {
            console.log('API キーが更新されました:', e.detail);
        });
    }
    
    setupAccessibilityFeatures() {
        // キーボードナビゲーション
        this.setupKeyboardNavigation();
        
        // スクリーンリーダー対応
        this.setupScreenReaderSupport();
        
        // 高コントラストモード対応
        this.setupHighContrastSupport();
    }
    
    setupKeyboardNavigation() {
        // メッセージ間のナビゲーション
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            if (e.key === 'Tab') {
                // Tabキーでメッセージ間を移動
                this.handleTabNavigation(e);
            }
        });
    }
    
    handleTabNavigation(e) {
        const messages = document.querySelectorAll('.meeting-message');
        const currentFocus = document.activeElement;
        
        if (messages.length === 0) return;
        
        let currentIndex = Array.from(messages).indexOf(currentFocus.closest('.meeting-message'));
        
        if (e.shiftKey) {
            // Shift+Tab で前のメッセージ
            currentIndex = currentIndex <= 0 ? messages.length - 1 : currentIndex - 1;
        } else {
            // Tab で次のメッセージ
            currentIndex = currentIndex >= messages.length - 1 ? 0 : currentIndex + 1;
        }
        
        if (messages[currentIndex]) {
            e.preventDefault();
            messages[currentIndex].focus();
            this.scrollToMessage(messages[currentIndex]);
        }
    }
    
    setupScreenReaderSupport() {
        // ARIA属性の動的更新
        this.updateAriaAttributes();
    }
    
    updateAriaAttributes() {
        const playBtn = document.getElementById('meetingPlayBtn');
        if (playBtn) {
            playBtn.setAttribute('aria-label', 
                this.manager.state.isPlaying ? '音声を一時停止' : '音声を再生'
            );
        }
        
        const progressBar = document.getElementById('meetingProgressBar');
        if (progressBar) {
            const progress = Math.round((this.manager.state.currentTime / this.manager.state.audioDuration) * 100);
            progressBar.setAttribute('aria-valuenow', progress);
            progressBar.setAttribute('aria-valuetext', 
                `${this.manager.formatTime(this.manager.state.currentTime)} / ${this.manager.formatTime(this.manager.state.audioDuration)}`
            );
        }
    }
    
    setupHighContrastSupport() {
        // 高コントラストモードの検出
        if (window.matchMedia) {
            const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
            this.handleHighContrastChange(highContrastQuery);
            highContrastQuery.addListener(this.handleHighContrastChange.bind(this));
        }
    }
    
    handleHighContrastChange(query) {
        if (query.matches) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
    }
    
    // ===== ファイル処理（既存保持・強化） =====
    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.add('dragover');
        
        // ドラッグフィードバックの改善
        e.dataTransfer.dropEffect = 'copy';
    }
    
    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // ドラッグがコンテナから完全に出た場合のみクラスを削除
        if (!e.currentTarget.contains(e.relatedTarget)) {
            e.currentTarget.classList.remove('dragover');
        }
    }
    
    handleFileDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.manager.loadAudioFile(files[0]);
        }
    }
    
    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.manager.loadAudioFile(file);
        }
    }
    
    // ===== ユーティリティメソッド（強化版） =====
    
    escapeHtml(text) {
        if (typeof text !== 'string') return '';
        
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;',
            '/': '&#x2F;'
        };
        return text.replace(/[&<>"'/]/g, (m) => map[m]);
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // ===== エラーハンドリング =====
    
    handleError(error, context = '') {
        console.error(`❌ TranscriptUI Error${context ? ` (${context})` : ''}:`, error);
        
        const errorMessage = this.getErrorMessage(error);
        showNotification(errorMessage, 'error');
        
        // エラー復旧の試行
        this.attemptErrorRecovery(error, context);
    }
    
    getErrorMessage(error) {
        if (error.name === 'NetworkError') {
            return 'ネットワークエラーが発生しました。接続を確認してください。';
        } else if (error.name === 'TypeError') {
            return 'データの処理中にエラーが発生しました。';
        } else if (error.message) {
            return error.message;
        } else {
            return '予期しないエラーが発生しました。';
        }
    }
    
    attemptErrorRecovery(error, context) {
        switch (context) {
            case 'render':
                // レンダリングエラーの復旧
                setTimeout(() => {
                    try {
                        this.render();
                    } catch (e) {
                        console.error('復旧に失敗しました:', e);
                    }
                }, 1000);
                break;
            case 'audio':
                // 音声エラーの復旧
                this.manager.resetAudioState();
                break;
        }
    }
    
    cleanupEventListeners() {
        // 必要に応じて実装
    }
}

// ===== メインコントローラークラス（統合版・大幅強化） =====
class IntegratedTranscriptManager {
    constructor() {
        this.state = new IntegratedTranscriptState();
        this.audioElement = null;
        this.isProcessing = false;
        this.autoSyncEnabled = true;
        this.ui = new IntegratedTranscriptUI(this);
        this.exportManager = new TranscriptExportManager(this);
        
        // パフォーマンス監視
        this.performanceMonitor = {
            renderTimes: [],
            lastRenderTime: 0,
            averageRenderTime: 0
        };
        
        // エラーハンドリング
        this.errorHandler = new TranscriptErrorHandler(this);
        
        this.init();
    }
    
    init() {
        console.log('🎤 統合版会議ツールシステム（強化版）初期化中...');
        
        try {
            this.setupEventListeners();
            this.ui.render();
            this.checkApiKey();
            this.loadSettings();
            this.setupPerformanceMonitoring();
            
            console.log('✅ 統合版会議ツールシステム（強化版）初期化完了');
        } catch (error) {
            this.errorHandler.handleInitializationError(error);
        }
    }
    
    setupEventListeners() {
        this.setupCustomEvents();
        this.setupWindowEvents();
        this.setupUnloadEvents();
    }
    
    setupCustomEvents() {
        // セグメント更新イベント
        window.addEventListener('segmentUpdated', (e) => {
            this.ui.renderMeetingMessages();
            this.ui.renderAnalysisContent();
        });
        
        // 話者更新イベント
        window.addEventListener('speakerUpdated', (e) => {
            this.ui.renderMeetingMessages();
        });
        
        // 現在セグメント変更イベント
        window.addEventListener('currentSegmentChanged', (e) => {
            this.updateTimeSync();
        });
    }
    
    setupWindowEvents() {
        // ウィンドウリサイズ対応
        window.addEventListener('resize', this.ui.debounce(() => {
            this.ui.setupMobileDetection();
        }, 250));
        
        // ページ可視性変更対応
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.state.isPlaying) {
                // ページが非表示になった時の音声制御
                console.log('ページが非表示になりました');
            } else if (!document.hidden) {
                // ページが表示された時の同期
                this.syncAudioState();
            }
        });
    }
    
    setupUnloadEvents() {
        // ページ離脱時の保存
        window.addEventListener('beforeunload', (e) => {
            this.saveSettings();
            
            if (this.isProcessing) {
                e.preventDefault();
                e.returnValue = '音声処理中です。ページを離れますか？';
                return e.returnValue;
            }
        });
    }
    
    setupPerformanceMonitoring() {
        // パフォーマンス測定の開始
        this.performanceMonitor.startTime = performance.now();
        
        // メモリ使用量の監視（対応ブラウザのみ）
        if (performance.memory) {
            setInterval(() => {
                this.monitorMemoryUsage();
            }, 30000); // 30秒間隔
        }
    }
    
    monitorMemoryUsage() {
        if (performance.memory) {
            const memoryInfo = {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
            };
            
            // メモリ使用量が80%を超えた場合の警告
            if (memoryInfo.used / memoryInfo.limit > 0.8) {
                console.warn('⚠️ メモリ使用量が高くなっています:', memoryInfo);
                this.optimizeMemoryUsage();
            }
        }
    }
    
    optimizeMemoryUsage() {
        // メモリ最適化の実行
        console.log('🔧 メモリ使用量を最適化中...');
        
        // 古い履歴データの削除
        this.cleanupOldData();
        
        // 不要なイベントリスナーのクリーンアップ
        this.cleanupEventListeners();
        
        // ガベージコレクションの強制実行を試行
        if (window.gc) {
            window.gc();
        }
    }
    
    cleanupOldData() {
        // 古いセグメントデータの圧縮
        const maxSegments = 1000;
        if (this.state.transcriptData.segments.length > maxSegments) {
            this.state.transcriptData.segments = this.state.transcriptData.segments.slice(-maxSegments);
            console.log(`📊 セグメントデータを${maxSegments}件に圧縮しました`);
        }
    }
    
    cleanupEventListeners() {
        // 不要なイベントリスナーの削除
        // 実装時は具体的なクリーンアップロジックを追加
    }
    
    // ===== 既存ファイル処理（完全保持・強化） =====
    
    async loadAudioFile(file) {
        if (!this.validateAudioFile(file)) return;
        
        try {
            console.log('🎵 音声ファイル読み込み開始:', file.name);
            
            this.state.audioFile = file;
            this.state.audioUrl = URL.createObjectURL(file);
            
            await this.createAudioElement();
            this.ui.showFileInfo(file);
            this.enableProcessButton();
            
            console.log('✅ 音声ファイル読み込み完了');
            showNotification(`音声ファイル「${file.name}」を読み込みました`, 'success');
            
        } catch (error) {
            this.errorHandler.handleFileLoadError(error, file);
        }
    }
    
    async createAudioElement() {
        if (this.audioElement) {
            this.audioElement.remove();
        }
        
        return new Promise((resolve, reject) => {
            this.audioElement = new Audio(this.state.audioUrl);
            
            const handleLoadedMetadata = () => {
                this.state.audioDuration = this.audioElement.duration;
                this.ui.updateAudioInfo(this.state.audioFile, this.state.audioDuration);
                this.ui.updateTimeDisplay(0, this.state.audioDuration);
                resolve();
            };
            
            const handleError = (e) => {
                reject(new Error('音声ファイルの読み込みに失敗しました'));
            };
            
            this.audioElement.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
            this.audioElement.addEventListener('error', handleError, { once: true });
            
            this.audioElement.addEventListener('timeupdate', () => {
                this.state.currentTime = this.audioElement.currentTime;
                this.updateTimeSync();
            });
            
            this.audioElement.addEventListener('ended', () => {
                this.state.isPlaying = false;
                this.ui.updatePlayButton(false);
                showNotification('音声再生が終了しました', 'info');
            });
            
            this.audioElement.addEventListener('pause', () => {
                this.state.isPlaying = false;
                this.ui.updatePlayButton(false);
            });
            
            this.audioElement.addEventListener('play', () => {
                this.state.isPlaying = true;
                this.ui.updatePlayButton(true);
            });
            
            // エラーハンドリング
            this.audioElement.addEventListener('error', (e) => {
                this.errorHandler.handleAudioError(e.error || new Error('音声再生エラー'));
            });
            
            // 読み込み開始
            this.audioElement.preload = 'metadata';
        });
    }
    
    validateAudioFile(file) {
        const maxSize = window.AUDIO_SETTINGS?.maxFileSize * 1024 * 1024 || 25 * 1024 * 1024;
        const supportedTypes = window.AUDIO_SETTINGS?.supportedFormats || [
            'audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/webm', 'audio/ogg', 'audio/flac'
        ];
        
        if (file.size > maxSize) {
            showNotification(`ファイルサイズが大きすぎます（最大${Math.round(maxSize / 1024 / 1024)}MB）`, 'error');
            return false;
        }
        
        const isValidType = supportedTypes.includes(file.type) || 
                           file.name.match(/\.(mp3|wav|m4a|mp4|webm|ogg|flac)$/i);
        
        if (!isValidType) {
            showNotification('サポートされていない音声形式です', 'error');
            return false;
        }
        
        return true;
    }
    
    enableProcessButton() {
        const btn = document.getElementById('processAudioBtn');
        if (btn) {
            btn.disabled = false;
            btn.onclick = () => this.processAudio();
            
            // ボタンアニメーション
            btn.style.transform = 'scale(1.02)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 200);
        }
    }
    
    // ===== 音声処理（既存機能保持・大幅強化） =====
    async processAudio() {
        if (!this.state.audioFile || this.isProcessing) return;
        
        this.isProcessing = true;
        const startTime = performance.now();
        
        try {
            console.log('🚀 音声処理開始');
            this.ui.showProcessing('音声を分析中...', 'Whisper APIで高精度な文字起こしを実行しています');
            
            // ステップ1: Whisper APIで文字起こし
            this.ui.updateProcessingStep(1, '音声文字起こし中...');
            const transcriptResult = await this.callWhisperAPI(this.state.audioFile);
            
            // ステップ2: データを構造化
            this.ui.updateProcessingStep(2, 'データ構造化中...');
            await this.processTranscriptData(transcriptResult);
            
            // ステップ3: AIで要点抽出
            this.ui.updateProcessingStep(3, 'AI要点抽出中...');
            await this.extractStructuredData();
            
            // ステップ4: UIを更新
            this.ui.updateProcessingStep(4, 'インターフェース更新中...');
            await this.finalizeProcessing();
            
            // パフォーマンス測定
            const processingTime = performance.now() - startTime;
            console.log(`⏱️ 処理時間: ${Math.round(processingTime)}ms`);
            
            // 完了
            this.ui.showMainInterface();
            showNotification('✅ 文字起こしと構造化が完了しました', 'success');
            
            // 履歴に保存
            this.saveToHistory();
            
        } catch (error) {
            this.errorHandler.handleProcessingError(error);
        } finally {
            this.isProcessing = false;
            this.ui.hideProcessing();
        }
    }
    
    async callWhisperAPI(audioFile) {
        if (!window.ApiKeyManager?.isValid()) {
            console.log('🔄 APIキー未設定、サンプルデータを生成');
            return this.generateSampleTranscriptData();
        }
        
        try {
            const formData = new FormData();
            formData.append('file', audioFile);
            formData.append('model', 'whisper-1');
            formData.append('language', 'ja');
            formData.append('response_format', 'verbose_json');
            formData.append('temperature', '0.1');
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 60000); // 60秒タイムアウト
            
            const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${window.ApiKeyManager.get()}`
                },
                body: formData,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `Whisper API エラー (${response.status})`);
            }
            
            const result = await response.json();
            console.log('✅ Whisper API 応答受信');
            return result;
            
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('音声処理がタイムアウトしました');
            }
            throw error;
        }
    }
    
    generateSampleTranscriptData() {
        // より詳細なサンプルデータ（デモ用）
        return {
            text: "こんにちは、今日の会議を始めさせていただきます。まず、前回の議事録の確認をお願いします。売上については、前月比で15%の増加となっております。新しいプロジェクトについて説明いたします。スケジュールについては来月からの開始を予定しています。",
            segments: [
                {
                    start: 0,
                    end: 5,
                    text: "こんにちは、今日の会議を始めさせていただきます。",
                    confidence: 0.95
                },
                {
                    start: 5,
                    end: 12,
                    text: "まず、前回の議事録の確認をお願いします。",
                    confidence: 0.92
                },
                {
                    start: 12,
                    end: 20,
                    text: "売上については、前月比で15%の増加となっております。",
                    confidence: 0.89
                },
                {
                    start: 20,
                    end: 28,
                    text: "新しいプロジェクトについて説明いたします。",
                    confidence: 0.91
                },
                {
                    start: 28,
                    end: 35,
                    text: "スケジュールについては来月からの開始を予定しています。",
                    confidence: 0.88
                }
            ]
        };
    }
    
    async processTranscriptData(result) {
        // 話者を自動検出・作成（強化版）
        const speakerMap = new Map();
        let speakerCount = 0;
        
        if (result.segments && result.segments.length > 0) {
            for (const segment of result.segments) {
                const speakerKey = this.estimateSpeaker(segment, speakerCount);
                
                if (!speakerMap.has(speakerKey)) {
                    const speakerName = `話者${String.fromCharCode(65 + speakerCount)}`;
                    const speaker = this.state.addSpeaker(
                        speakerName, 
                        this.generateSpeakerColor(speakerCount)
                    );
                    speakerMap.set(speakerKey, speaker.id);
                    speakerCount++;
                    
                    console.log(`👤 ${speakerName} を追加しました`);
                }
                
                this.state.addSegment({
                    speakerId: speakerMap.get(speakerKey),
                    text: segment.text.trim(),
                    startTime: segment.start,
                    endTime: segment.end,
                    confidence: segment.confidence || 0.95
                });
            }
        } else {
            // シンプルな文字起こし結果の場合
            const speaker = this.state.addSpeaker('話者A', '#3b82f6');
            this.state.addSegment({
                speakerId: speaker.id,
                text: result.text,
                startTime: 0,
                endTime: this.state.audioDuration,
                confidence: 0.95
            });
        }
        
        console.log(`📝 ${this.state.transcriptData.segments.length}個のセグメントを処理しました`);
    }
    
    estimateSpeaker(segment, currentCount) {
        // より高度な話者推定ロジック
        const pauseBefore = segment.start;
        const segmentLength = segment.end - segment.start;
        
        // 長い沈黙の後は話者が変わった可能性が高い
        if (pauseBefore > 3 && currentCount < 6) {
            // セグメントの時間に基づいて話者を推定
            return `speaker_${Math.floor(segment.start / 45) % 4}`;
        }
        
        // 短いセグメントは同じ話者の可能性が高い
        if (segmentLength < 2) {
            return 'speaker_0';
        }
        
        return 'speaker_0';
    }
    
    generateSpeakerColor(index) {
        const colors = [
            '#3b82f6', // Blue
            '#22c55e', // Green  
            '#f59e0b', // Amber
            '#ef4444', // Red
            '#8b5cf6', // Violet
            '#06b6d4', // Cyan
            '#f97316', // Orange
            '#ec4899'  // Pink
        ];
        return colors[index % colors.length];
    }
    
    async extractStructuredData() {
        if (!window.callOpenAIAPI) {
            console.log('🔄 API未設定、サンプル構造化データを生成');
            this.generateSampleStructuredData();
            return;
        }
        
        try {
            const fullText = this.state.transcriptData.segments
                .map(s => {
                    const speaker = this.state.transcriptData.speakers.find(sp => sp.id === s.speakerId);
                    return `[${this.formatTime(s.startTime)}] ${speaker?.name || '話者'}: ${s.text}`;
                })
                .join('\n');
            
            const prompt = `以下の会議の文字起こしを分析し、JSON形式で構造化してください：

${fullText}

以下の形式で回答してください：
{
  "summary": "会議の要約（3-5行程度）",
  "keyPoints": [
    {"category": "決定事項", "content": "具体的な内容", "importance": "high"},
    {"category": "課題", "content": "具体的な内容", "importance": "medium"},
    {"category": "提案", "content": "具体的な内容", "importance": "low"}
  ],
  "questionsAnswers": [
    {"question": "質問内容", "answer": "回答内容", "speaker": "話者名"}
  ],
  "actionItems": [
    {"task": "やるべきこと", "assignee": "担当者", "deadline": "期限", "priority": "high"}
  ]
}`;
            
            const result = await window.callOpenAIAPI('analysis', prompt);
            const structured = JSON.parse(result);
            
            // 構造化データを状態に保存
            this.state.structuredData.summary = structured.summary || '';
            
            if (structured.keyPoints) {
                structured.keyPoints.forEach(point => {
                    this.state.addKeyPoint(point.category, point.content, point.importance);
                });
            }
            
            if (structured.questionsAnswers) {
                structured.questionsAnswers.forEach(qa => {
                    this.state.addQuestionAnswer(qa.question, qa.answer, qa.speaker);
                });
            }
            
            if (structured.actionItems) {
                structured.actionItems.forEach(action => {
                    this.state.addActionItem(action.task, action.assignee, action.deadline, action.priority);
                });
            }
            
            console.log('✅ 構造化データの抽出が完了しました');
            
        } catch (error) {
            console.warn('⚠️ 構造化分析エラー:', error);
            this.generateSampleStructuredData();
        }
    }
    
    generateSampleStructuredData() {
        this.state.structuredData.summary = 'AI分析により、会議の主要な論点と決定事項を整理しました。売上向上と新プロジェクトの開始について話し合われ、具体的なアクションプランが策定されました。';
        
        this.state.addKeyPoint('決定事項', '新システムの導入を来月から開始する', 'high');
        this.state.addKeyPoint('課題', 'リソース配分の最適化が必要', 'medium');
        this.state.addKeyPoint('提案', '定期的な進捗確認ミーティングを実施', 'low');
        this.state.addKeyPoint('成果', '前月比15%の売上増加を達成', 'high');
        
        this.state.addQuestionAnswer(
            '新システムの導入スケジュールはどうなっていますか？',
            '来月から段階的に開始し、3ヶ月で完了予定です。',
            '話者A'
        );
        
        this.state.addQuestionAnswer(
            'リソース配分の課題について具体的には？',
            '人員の再配置と予算の見直しが必要です。',
            '話者B'
        );
        
        this.state.addActionItem('システム要件の詳細確認', '話者B', '来週金曜', 'high');
        this.state.addActionItem('予算計画の見直し', '話者C', '今月末', 'medium');
        this.state.addActionItem('進捗ミーティングの日程調整', '話者A', '明日', 'low');
        
        console.log('📋 サンプル構造化データを生成しました');
    }
    
    async finalizeProcessing() {
        // 最終的な処理とクリーンアップ
        this.state.updateAnalysisStats();
        
        // メタデータの設定
        this.state.transcriptData.metadata = {
            processedAt: new Date().toISOString(),
            filename: this.state.audioFile?.name || 'unknown',
            duration: this.state.audioDuration,
            version: '4.0'
        };
        
        // UI の準備
        await new Promise(resolve => setTimeout(resolve, 500)); // UIの準備時間
    }
    
    saveToHistory() {
        try {
            const historyItem = {
                filename: this.state.audioFile?.name || 'unknown',
                duration: this.state.audioDuration,
                segments: this.state.transcriptData.segments.length,
                keyPoints: this.state.structuredData.keyPoints.length,
                actionItems: this.state.structuredData.actionItems.length,
                processedAt: new Date().toISOString()
            };
            
            window.transcriptHistoryManager?.add(historyItem);
            console.log('💾 履歴に保存しました');
            
        } catch (error) {
            console.warn('⚠️ 履歴保存エラー:', error);
        }
    }
    
    // ===== 音声制御（既存機能保持・大幅強化） =====
    
    togglePlayPause() {
        if (!this.audioElement) return;
        
        try {
            if (this.state.isPlaying) {
                this.audioElement.pause();
            } else {
                this.audioElement.play();
            }
        } catch (error) {
            this.errorHandler.handleAudioError(error);
        }
    }
    
    seekTo(time) {
        if (!this.audioElement) return;
        
        try {
            const seekTime = Math.max(0, Math.min(time, this.state.audioDuration));
            this.audioElement.currentTime = seekTime;
            this.state.currentTime = seekTime;
            this.updateTimeSync();
            
            console.log(`⏭️ シーク: ${this.formatTime(seekTime)}`);
        } catch (error) {
            this.errorHandler.handleAudioError(error);
        }
    }
    
    seekToTime(timeString) {
        const parts = timeString.split(':');
        let seconds = 0;
        
        if (parts.length === 2) {
            seconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
        } else if (parts.length === 3) {
            seconds = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
        }
        
        this.seekTo(seconds);
    }
    
    seekRelative(seconds) {
        this.seekTo(this.state.currentTime + seconds);
    }
    
    setPlaybackRate(rate) {
        if (!this.audioElement) return;
        
        try {
            const clampedRate = Math.max(0.25, Math.min(3.0, rate));
            this.state.playbackRate = clampedRate;
            this.audioElement.playbackRate = clampedRate;
            this.ui.updatePlayButton(this.state.isPlaying);
            
            console.log(`🎛️ 再生速度: ${clampedRate}x`);
        } catch (error) {
            this.errorHandler.handleAudioError(error);
        }
    }
    
    updateTimeSync() {
        if (!this.autoSyncEnabled) return;
        
        try {
            this.ui.updateTimeDisplay(this.state.currentTime, this.state.audioDuration);
            this.ui.updateProgress(this.state.currentTime / this.state.audioDuration);
            this.ui.updateCurrentMessageHighlight();
            this.ui.updateAriaAttributes();
        } catch (error) {
            console.warn('⚠️ 時間同期エラー:', error);
        }
    }
    
    syncAudioState() {
        // 音声状態の同期（ページ復帰時など）
        if (this.audioElement) {
            this.state.currentTime = this.audioElement.currentTime;
            this.state.isPlaying = !this.audioElement.paused;
            this.updateTimeSync();
        }
    }
    
    resetAudioState() {
        // 音声状態のリセット（エラー復旧用）
        try {
            if (this.audioElement) {
                this.audioElement.pause();
                this.audioElement.currentTime = 0;
            }
            
            this.state.currentTime = 0;
            this.state.isPlaying = false;
            this.ui.updatePlayButton(false);
            this.ui.updateTimeDisplay(0, this.state.audioDuration);
            this.ui.updateProgress(0);
            
            console.log('🔄 音声状態をリセットしました');
        } catch (error) {
            console.error('❌ 音声状態リセットエラー:', error);
        }
    }
    
    // ===== エクスポート機能（強化版） =====
    
    exportToWord() {
        try {
            if (this.exportManager) {
                this.exportManager.exportToWord();
            } else {
                showNotification('エクスポート機能を準備中です', 'info');
            }
        } catch (error) {
            this.errorHandler.handleExportError(error, 'Word');
        }
    }
    
    copyToClipboard() {
        try {
            if (this.exportManager) {
                this.exportManager.copyToClipboard();
            } else {
                // フォールバック処理
                const messages = this.state.getMeetingMessages();
                const text = messages.map(m => `[${m.time}] ${m.speaker}: ${m.text}`).join('\n');
                
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(text).then(() => {
                        showNotification('クリップボードにコピーしました', 'success');
                    });
                }
            }
        } catch (error) {
            this.errorHandler.handleExportError(error, 'Clipboard');
        }
    }
    
    jumpToSegment(segmentId) {
        try {
            const segment = this.state.transcriptData.segments.find(s => s.id === segmentId);
            if (segment) {
                this.seekTo(segment.startTime);
                showNotification(`${this.formatTime(segment.startTime)} にジャンプしました`, 'info');
            }
        } catch (error) {
            console.error('❌ セグメントジャンプエラー:', error);
        }
    }
    
    // ===== 設定管理（強化版） =====
    
    checkApiKey() {
        if (window.ApiKeyManager && window.ApiKeyManager.isValid()) {
            console.log('✅ APIキー確認OK - 文字起こし機能利用可能');
            return true;
        } else {
            console.warn('⚠️ APIキー未設定 - サンプルデータで動作します');
            return false;
        }
    }
    
    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('transcript_settings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                
                this.autoSyncEnabled = settings.autoSyncEnabled !== false;
                this.state.playbackRate = settings.playbackRate || 1.0;
                this.state.uiState.isAutoScrollEnabled = settings.autoScrollEnabled !== false;
                this.state.uiState.highlightCurrentMessage = settings.highlightCurrentMessage !== false;
                
                console.log('⚙️ 設定を読み込みました:', settings);
            }
        } catch (error) {
            console.warn('⚠️ 設定読み込みエラー:', error);
        }
    }
    
    saveSettings() {
        try {
            const settings = {
                autoSyncEnabled: this.autoSyncEnabled,
                playbackRate: this.state.playbackRate,
                autoScrollEnabled: this.state.uiState.isAutoScrollEnabled,
                highlightCurrentMessage: this.state.uiState.highlightCurrentMessage,
                lastSaved: new Date().toISOString()
            };
            
            localStorage.setItem('transcript_settings', JSON.stringify(settings));
            console.log('💾 設定を保存しました');
        } catch (error) {
            console.warn('⚠️ 設定保存エラー:', error);
        }
    }
    
    // ===== ユーティリティメソッド（既存保持・強化） =====
    
    formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) return '0:00';
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${secs.toString().padStart(2, '0')}`;
        }
    }
    
    getDebugInfo() {
        return {
            state: {
                audioFile: this.state.audioFile?.name || null,
                audioDuration: this.state.audioDuration,
                currentTime: this.state.currentTime,
                isPlaying: this.state.isPlaying,
                playbackRate: this.state.playbackRate,
                segments: this.state.transcriptData.segments.length,
                speakers: this.state.transcriptData.speakers.length,
                keyPoints: this.state.structuredData.keyPoints.length,
                actionItems: this.state.structuredData.actionItems.length
            },
            ui: {
                isInitialized: this.ui.uiState.isInitialized,
                isMobile: this.ui.uiState.isMobile,
                currentTheme: this.ui.uiState.currentTheme
            },
            performance: {
                averageRenderTime: this.performanceMonitor.averageRenderTime,
                lastRenderTime: this.performanceMonitor.lastRenderTime
            },
            system: {
                apiKeyConfigured: this.checkApiKey(),
                autoSyncEnabled: this.autoSyncEnabled,
                isProcessing: this.isProcessing
            }
        };
    }
    
    // ===== クリーンアップ =====
    
    destroy() {
        try {
            console.log('🧹 TranscriptManager クリーンアップ開始');
            
            // 音声要素のクリーンアップ
            if (this.audioElement) {
                this.audioElement.pause();
                this.audioElement.src = '';
                this.audioElement.remove();
                this.audioElement = null;
            }
            
            // URLオブジェクトの解放
            if (this.state.audioUrl) {
                URL.revokeObjectURL(this.state.audioUrl);
                this.state.audioUrl = null;
            }
            
            // 設定の保存
            this.saveSettings();
            
            // イベントリスナーのクリーンアップ
            this.cleanupEventListeners();
            
            console.log('✅ TranscriptManager クリーンアップ完了');
        } catch (error) {
            console.error('❌ クリーンアップエラー:', error);
        }
    }
}

// ===== エラーハンドラークラス（新機能） =====
class TranscriptErrorHandler {
    constructor(manager) {
        this.manager = manager;
        this.errorLog = [];
        this.maxErrorLogSize = 50;
    }
    
    handleInitializationError(error) {
        console.error('❌ 初期化エラー:', error);
        this.logError('initialization', error);
        
        showNotification('システムの初期化に失敗しました。ページを再読み込みしてください。', 'error');
    }
    
    handleFileLoadError(error, file) {
        console.error('❌ ファイル読み込みエラー:', error);
        this.logError('fileLoad', error, { filename: file?.name });
        
        const message = this.getFileErrorMessage(error);
        showNotification(message, 'error');
    }
    
    handleAudioError(error) {
        console.error('❌ 音声エラー:', error);
        this.logError('audio', error);
        
        const message = this.getAudioErrorMessage(error);
        showNotification(message, 'error');
        
        // 音声状態のリセットを試行
        setTimeout(() => {
            this.manager.resetAudioState();
        }, 1000);
    }
    
    handleProcessingError(error) {
        console.error('❌ 処理エラー:', error);
        this.logError('processing', error);
        
        const message = this.getProcessingErrorMessage(error);
        showNotification(message, 'error');
        
        // 処理状態のリセット
        this.manager.isProcessing = false;
        this.manager.ui.hideProcessing();
    }
    
    handleExportError(error, type) {
        console.error(`❌ エクスポートエラー (${type}):`, error);
        this.logError('export', error, { type });
        
        showNotification(`${type}エクスポートに失敗しました`, 'error');
    }
    
    getFileErrorMessage(error) {
        if (error.message.includes('size')) {
            return 'ファイルサイズが大きすぎます';
        } else if (error.message.includes('format')) {
            return 'サポートされていないファイル形式です';
        } else {
            return 'ファイルの読み込みに失敗しました';
        }
    }
    
    getAudioErrorMessage(error) {
        if (error.message.includes('network')) {
            return '音声の読み込みに失敗しました。ネットワーク接続を確認してください';
        } else if (error.message.includes('format')) {
            return '音声フォーマットがサポートされていません';
        } else {
            return '音声の再生に問題が発生しました';
        }
    }
    
    getProcessingErrorMessage(error) {
        if (error.message.includes('API')) {
            return 'API接続エラーです。APIキーを確認してください';
        } else if (error.message.includes('timeout')) {
            return '処理がタイムアウトしました。ファイルサイズを確認してください';
        } else {
            return '音声処理中にエラーが発生しました';
        }
    }
    
    logError(type, error, context = {}) {
        const errorEntry = {
            type,
            message: error.message,
            stack: error.stack,
            context,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };
        
        this.errorLog.push(errorEntry);
        
        // ログサイズの制限
        if (this.errorLog.length > this.maxErrorLogSize) {
            this.errorLog = this.errorLog.slice(-this.maxErrorLogSize);
        }
        
        // 開発環境でのみ詳細ログを出力
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.table(errorEntry);
        }
    }
    
    getErrorReport() {
        return {
            errors: this.errorLog,
            summary: {
                totalErrors: this.errorLog.length,
                errorTypes: [...new Set(this.errorLog.map(e => e.type))],
                lastError: this.errorLog[this.errorLog.length - 1]
            }
        };
    }
}

// ===== エクスポート管理クラス（既存機能保持・強化） =====
class TranscriptExportManager {
    constructor(manager) {
        this.manager = manager;
        this.exportFormats = ['word', 'pdf', 'txt', 'json', 'csv'];
    }
    
    exportToWord() {
        try {
            const data = this.generateExportData();
            const html = this.generateWordHTML(data);
            
            const blob = new Blob([html], { 
                type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
            });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `議事録_${this.formatDate()}.doc`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            URL.revokeObjectURL(url);
            showNotification('Word文書としてエクスポートしました', 'success');
            
        } catch (error) {
            console.error('❌ Word エクスポートエラー:', error);
            showNotification('Word エクスポートに失敗しました', 'error');
        }
    }
    
    copyToClipboard() {
        try {
            const data = this.generateExportData();
            const text = this.generatePlainText(data);
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    showNotification('クリップボードにコピーしました', 'success');
                }).catch(error => {
                    console.error('❌ クリップボードコピーエラー:', error);
                    this.fallbackCopy(text);
                });
            } else {
                this.fallbackCopy(text);
            }
        } catch (error) {
            console.error('❌ クリップボードエラー:', error);
            showNotification('クリップボードコピーに失敗しました', 'error');
        }
    }
    
    fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            showNotification('クリップボードにコピーしました', 'success');
        } catch (err) {
            showNotification('コピーに失敗しました', 'error');
        }
        
        document.body.removeChild(textArea);
    }
    
    generateExportData() {
        const state = this.manager.state;
        
        return {
            metadata: {
                filename: state.audioFile?.name || '音声ファイル',
                duration: this.manager.formatTime(state.audioDuration),
                date: new Date().toLocaleString('ja-JP'),
                speakers: state.transcriptData.speakers.length,
                statistics: state.getStatistics(),
                exportedAt: new Date().toISOString(),
                version: '4.0'
            },
            summary: state.structuredData.summary,
            keyPoints: state.structuredData.keyPoints,
            questionsAnswers: state.structuredData.questionsAnswers,
            actionItems: state.structuredData.actionItems,
            transcript: state.getMeetingMessages(),
            speakers: state.transcriptData.speakers
        };
    }
    
    generateWordHTML(data) {
        return `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
            <head>
                <meta charset="utf-8">
                <title>議事録 - ${data.metadata.filename}</title>
                <style>
                    body { 
                        font-family: "ヒラギノ角ゴ Pro W3", "Hiragino Kaku Gothic Pro", "メイリオ", Meiryo, sans-serif; 
                        line-height: 1.6; 
                        margin: 40px;
                        color: #333;
                    }
                    .header { 
                        border-bottom: 3px solid #22c55e; 
                        padding-bottom: 20px; 
                        margin-bottom: 30px; 
                    }
                    .section { 
                        margin-bottom: 30px; 
                        page-break-inside: avoid; 
                    }
                    .section h3 { 
                        color: #22c55e; 
                        border-left: 5px solid #22c55e; 
                        padding-left: 15px; 
                        margin-bottom: 20px;
                        font-size: 18px;
                    }
                    .message-item { 
                        margin-bottom: 20px; 
                        padding: 15px; 
                        border-left: 4px solid #e2e8f0;
                        background: #f8fafc;
                    }
                    .speaker { 
                        font-weight: bold; 
                        color: #22c55e; 
                        margin-bottom: 5px;
                    }
                    .time { 
                        color: #666; 
                        font-size: 0.9em; 
                        font-family: monospace;
                    }
                    .statistics { 
                        background: #f0fdf4; 
                        padding: 20px; 
                        border-radius: 8px; 
                        margin: 20px 0;
                        border: 1px solid #22c55e;
                    }
                    .key-point { 
                        background: #e0f2fe; 
                        padding: 12px; 
                        margin: 8px 0; 
                        border-radius: 5px;
                        border-left: 4px solid #0ea5e9;
                    }
                    .action-item { 
                        background: #f0fdf4; 
                        padding: 12px; 
                        margin: 8px 0; 
                        border-radius: 5px;
                        border-left: 4px solid #22c55e;
                    }
                    .qa-item { 
                        background: #fef7cd; 
                        padding: 12px; 
                        margin: 8px 0; 
                        border-radius: 5px;
                        border-left: 4px solid #f59e0b;
                    }
                    .importance-high { border-left-color: #ef4444; background: #fef2f2; }
                    .importance-medium { border-left-color: #f59e0b; background: #fef3c7; }
                    .importance-low { border-left-color: #6b7280; background: #f9fafb; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>📋 会議議事録</h1>
                    <p><strong>ファイル:</strong> ${data.metadata.filename}</p>
                    <p><strong>時間:</strong> ${data.metadata.duration} | <strong>作成日:</strong> ${data.metadata.date}</p>
                    <p><strong>参加者数:</strong> ${data.metadata.speakers}名 | <strong>バージョン:</strong> ${data.metadata.version}</p>
                </div>
                
                <div class="statistics">
                    <h3>📊 会議統計</h3>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
                        <div>
                            <p><strong>総発言数:</strong> ${data.metadata.statistics.totalSegments}件</p>
                            <p><strong>重要発言:</strong> ${data.metadata.statistics.importantSegments}件</p>
                        </div>
                        <div>
                            <p><strong>抽出された要点:</strong> ${data.metadata.statistics.keyPointsCount}件</p>
                            <p><strong>アクションアイテム:</strong> ${data.metadata.statistics.actionItemsCount}件</p>
                        </div>
                    </div>
                </div>
                
                ${data.summary ? `
                    <div class="section">
                        <h3>📋 会議要約</h3>
                        <p style="background: #f8fafc; padding: 15px; border-radius: 8px; line-height: 1.8;">${data.summary}</p>
                    </div>
                ` : ''}
                
                <div class="section">
                    <h3>📌 重要ポイント</h3>
                    ${data.keyPoints.map(point => `
                        <div class="key-point importance-${point.importance}">
                            <strong>${point.category} [${point.importance === 'high' ? '高' : point.importance === 'medium' ? '中' : '低'}]:</strong> ${point.content}
                        </div>
                    `).join('')}
                    ${data.keyPoints.length === 0 ? '<p>重要ポイントが抽出されませんでした。</p>' : ''}
                </div>
                
                ${data.actionItems.length > 0 ? `
                    <div class="section">
                        <h3>✅ アクションアイテム</h3>
                        ${data.actionItems.map(action => `
                            <div class="action-item">
                                <p><strong>タスク:</strong> ${action.task}</p>
                                <p style="margin: 5px 0; font-size: 0.9em; color: #666;">
                                    <strong>担当:</strong> ${action.assignee || '未定'} | 
                                    <strong>期限:</strong> ${action.deadline || '未定'} | 
                                    <strong>優先度:</strong> ${action.priority === 'high' ? '高' : action.priority === 'medium' ? '中' : '低'}
                                </p>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                ${data.questionsAnswers.length > 0 ? `
                    <div class="section">
                        <h3>❓ 質問と回答</h3>
                        ${data.questionsAnswers.map(qa => `
                            <div class="qa-item">
                                <p><strong>Q:</strong> ${qa.question}</p>
                                <p><strong>A:</strong> ${qa.answer}</p>
                                ${qa.speaker ? `<p style="margin-top: 8px; font-size: 0.9em; color: #666;"><em>回答者: ${qa.speaker}</em></p>` : ''}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                <div class="section">
                    <h3>💬 詳細な文字起こし</h3>
                    ${data.transcript.map(item => `
                        <div class="message-item">
                            <div class="speaker">${item.speaker} <span class="time">[${item.time}]</span></div>
                            <p style="margin: 8px 0 0 0;">${item.text}</p>
                            ${item.notes ? `<p style="margin-top: 8px; padding: 8px; background: rgba(0,0,0,0.05); border-radius: 4px; font-size: 0.9em;"><strong>📝 メモ:</strong> ${item.notes}</p>` : ''}
                        </div>
                    `).join('')}
                </div>
                
                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #666; font-size: 0.9em;">
                    <p>このドキュメントは HishoAI Enhanced v${data.metadata.version} により生成されました</p>
                    <p>エクスポート日時: ${data.metadata.exportedAt}</p>
                </div>
            </body>
            </html>
        `;
    }
    
    generatePlainText(data) {
        return `
📋 会議議事録
=====================================
ファイル: ${data.metadata.filename}
時間: ${data.metadata.duration}
作成日: ${data.metadata.date}
参加者数: ${data.metadata.speakers}名

📊 会議統計
-------------------------------------
総発言数: ${data.metadata.statistics.totalSegments}件
重要発言: ${data.metadata.statistics.importantSegments}件
抽出された要点: ${data.metadata.statistics.keyPointsCount}件
アクションアイテム: ${data.metadata.statistics.actionItemsCount}件

${data.summary ? `📋 会議要約
-------------------------------------
${data.summary}

` : ''}📌 重要ポイント
-------------------------------------
${data.keyPoints.map(point => `• [${point.category}] ${point.content} (重要度: ${point.importance === 'high' ? '高' : point.importance === 'medium' ? '中' : '低'})`).join('\n')}

${data.actionItems.length > 0 ? `✅ アクションアイテム
-------------------------------------
${data.actionItems.map(action => `• ${action.task}\n  担当: ${action.assignee || '未定'} | 期限: ${action.deadline || '未定'} | 優先度: ${action.priority === 'high' ? '高' : action.priority === 'medium' ? '中' : '低'}`).join('\n\n')}

` : ''}${data.questionsAnswers.length > 0 ? `❓ 質問と回答
-------------------------------------
${data.questionsAnswers.map(qa => `Q: ${qa.question}\nA: ${qa.answer}${qa.speaker ? `\n回答者: ${qa.speaker}` : ''}`).join('\n\n')}

` : ''}💬 詳細な文字起こし
-------------------------------------
${data.transcript.map(item => `[${item.time}] ${item.speaker}: ${item.text}${item.notes ? `\n📝 ${item.notes}` : ''}`).join('\n\n')}

=====================================
このドキュメントは HishoAI Enhanced v${data.metadata.version} により生成されました
エクスポート日時: ${data.metadata.exportedAt}
        `.trim();
    }
    
    formatDate() {
        const now = new Date();
        return `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
    }
    
    // JSON エクスポート（新機能）
    exportToJSON() {
        try {
            const data = this.generateExportData();
            const jsonData = JSON.stringify(data, null, 2);
            
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `transcript_${this.formatDate()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            URL.revokeObjectURL(url);
            showNotification('JSON形式でエクスポートしました', 'success');
            
        } catch (error) {
            console.error('❌ JSON エクスポートエラー:', error);
            showNotification('JSON エクスポートに失敗しました', 'error');
        }
    }
    
    // CSV エクスポート（新機能）
    exportToCSV() {
        try {
            const data = this.generateExportData();
            const csvData = this.generateCSV(data);
            
            const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `transcript_${this.formatDate()}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            URL.revokeObjectURL(url);
            showNotification('CSV形式でエクスポートしました', 'success');
            
        } catch (error) {
            console.error('❌ CSV エクスポートエラー:', error);
            showNotification('CSV エクスポートに失敗しました', 'error');
        }
    }
    
    generateCSV(data) {
        const rows = [];
        
        // ヘッダー行
        rows.push(['時刻', '話者', '発言内容', '信頼度', 'メモ', 'カテゴリ']);
        
        // 文字起こしデータ
        data.transcript.forEach(item => {
            rows.push([
                item.time,
                item.speaker,
                `"${item.text.replace(/"/g, '""')}"`,
                item.confidence || '',
                `"${(item.notes || '').replace(/"/g, '""')}"`,
                '発言'
            ]);
        });
        
        // 要点データ
        data.keyPoints.forEach(point => {
            rows.push([
                '',
                'AI分析',
                `"${point.content.replace(/"/g, '""')}"`,
                '',
                `"重要度: ${point.importance}"`,
                `要点-${point.category}`
            ]);
        });
        
        // アクションアイテム
        data.actionItems.forEach(action => {
            rows.push([
                '',
                action.assignee || 'AI分析',
                `"${action.task.replace(/"/g, '""')}"`,
                '',
                `"期限: ${action.deadline || '未定'}, 優先度: ${action.priority}"`,
                'アクション'
            ]);
        });
        
        return rows.map(row => row.join(',')).join('\n');
    }
}

// ===== グローバル変数とイベントリスナー（統合版・強化） =====
let transcriptManager = null;

// ページ読み込み時の初期化（強化版）
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('transcriptSection')) {
        console.log('🎤 音声文字起こしセクションを検出しました');
        
        try {
            transcriptManager = new IntegratedTranscriptManager();
            
            // グローバル関数として公開
            window.transcriptManager = transcriptManager;
            
            // ページ離脱時のクリーンアップ
            window.addEventListener('beforeunload', () => {
                if (transcriptManager) {
                    transcriptManager.destroy();
                }
            });
            
            console.log('✅ 統合版会議ツール（強化版）初期化完了');
            
        } catch (error) {
            console.error('❌ 音声文字起こしシステム初期化エラー:', error);
            showNotification('音声文字起こしシステムの初期化に失敗しました', 'error');
        }
    }
});

// ===== グローバル関数の公開（統合版・既存機能完全保持・強化） =====
if (typeof window !== 'undefined') {
    // 既存関数（完全保持・強化）
    window.processAudio = function() {
        if (transcriptManager) {
            transcriptManager.processAudio();
        } else {
            console.warn('⚠️ transcriptManager が初期化されていません');
            showNotification('システムが準備中です。しばらくお待ちください。', 'warning');
        }
    };
    
    window.removeAudioFile = function() {
        if (transcriptManager) {
            try {
                transcriptManager.state.audioFile = null;
                transcriptManager.state.audioUrl = null;
                
                const fileInfo = document.getElementById('audioFileInfo');
                const processBtn = document.getElementById('processAudioBtn');
                
                if (fileInfo) fileInfo.classList.add('hidden');
                if (processBtn) processBtn.disabled = true;
                
                if (transcriptManager.audioElement) {
                    transcriptManager.audioElement.remove();
                    transcriptManager.audioElement = null;
                }
                
                showNotification('音声ファイルを削除しました', 'success');
                
            } catch (error) {
                console.error('❌ ファイル削除エラー:', error);
                showNotification('ファイルの削除に失敗しました', 'error');
            }
        }
    };
    
    window.showAudioSample = function() {
        try {
            const sampleData = transcriptManager?.generateSampleTranscriptData();
            if (sampleData) {
                console.log('📄 サンプルデータ:', sampleData);
                showNotification('サンプルデータをコンソールに表示しました。実際の音声ファイルをアップロードして体験してください。', 'info');
            } else {
                showNotification('サンプル機能：実際の音声ファイルをアップロードして体験してください', 'info');
            }
        } catch (error) {
            console.warn('⚠️ サンプル表示エラー:', error);
            showNotification('サンプルの表示に失敗しました', 'warning');
        }
    };
    
    // 新機能（強化版）
    window.exportTranscriptToWord = function() {
        if (transcriptManager) {
            transcriptManager.exportToWord();
        } else {
            showNotification('音声処理が完了していません', 'warning');
        }
    };
    
    window.exportTranscriptToJSON = function() {
        if (transcriptManager && transcriptManager.exportManager) {
            transcriptManager.exportManager.exportToJSON();
        } else {
            showNotification('音声処理が完了していません', 'warning');
        }
    };
    
    window.exportTranscriptToCSV = function() {
        if (transcriptManager && transcriptManager.exportManager) {
            transcriptManager.exportManager.exportToCSV();
        } else {
            showNotification('音声処理が完了していません', 'warning');
        }
    };
    
    window.copyTranscriptToClipboard = function() {
        if (transcriptManager) {
            transcriptManager.copyToClipboard();
        } else {
            showNotification('音声処理が完了していません', 'warning');
        }
    };
    
    window.seekToTranscriptTime = function(timeString) {
        if (transcriptManager) {
            transcriptManager.seekToTime(timeString);
        }
    };
    
    window.toggleTranscriptPlayPause = function() {
        if (transcriptManager) {
            transcriptManager.togglePlayPause();
        }
    };
    
    window.setTranscriptPlaybackRate = function(rate) {
        if (transcriptManager) {
            transcriptManager.setPlaybackRate(rate);
        }
    };
    
    window.jumpToTranscriptSegment = function(segmentId) {
        if (transcriptManager) {
            transcriptManager.jumpToSegment(segmentId);
        }
    };
    
    // UI制御関数
    window.toggleTranscriptMobilePanel = function() {
        if (transcriptManager && transcriptManager.ui) {
            transcriptManager.ui.toggleMobileAnalysisPanel();
        }
    };
    
    window.setTranscriptAutoScroll = function(enabled) {
        if (transcriptManager) {
            transcriptManager.state.setAutoScroll(enabled);
            transcriptManager.saveSettings();
        }
    };
    
    window.setTranscriptHighlightCurrent = function(enabled) {
        if (transcriptManager) {
            transcriptManager.state.setHighlightCurrentMessage(enabled);
            transcriptManager.saveSettings();
        }
    };
    
    // 設定管理関数
    window.getTranscriptSettings = function() {
        if (transcriptManager) {
            return {
                autoSyncEnabled: transcriptManager.autoSyncEnabled,
                playbackRate: transcriptManager.state.playbackRate,
                autoScrollEnabled: transcriptManager.state.uiState.isAutoScrollEnabled,
                highlightCurrentMessage: transcriptManager.state.uiState.highlightCurrentMessage
            };
        }
        return null;
    };
    
    window.saveTranscriptSettings = function() {
        if (transcriptManager) {
            transcriptManager.saveSettings();
            showNotification('設定を保存しました', 'success');
        }
    };
    
    // デバッグ関数（強化版）
    window.debugTranscript = function() {
        if (transcriptManager) {
            const debugInfo = transcriptManager.getDebugInfo();
            console.group('🔍 統合版会議ツール（強化版）デバッグ情報');
            console.table(debugInfo.state);
            console.table(debugInfo.ui);
            console.table(debugInfo.performance);
            console.table(debugInfo.system);
            console.groupEnd();
            
            // エラーレポート
            if (transcriptManager.errorHandler) {
                const errorReport = transcriptManager.errorHandler.getErrorReport();
                if (errorReport.summary.totalErrors > 0) {
                    console.group('❌ エラーレポート');
                    console.table(errorReport.summary);
                    console.table(errorReport.errors);
                    console.groupEnd();
                }
            }
            
            return debugInfo;
        } else {
            console.warn('⚠️ transcriptManager が初期化されていません');
            return null;
        }
    };
    
    // パフォーマンス測定関数
    window.measureTranscriptPerformance = function() {
        if (transcriptManager) {
            const perf = transcriptManager.performanceMonitor;
            console.log('📊 パフォーマンス測定結果:', {
                averageRenderTime: perf.averageRenderTime,
                lastRenderTime: perf.lastRenderTime,
                renderCount: perf.renderTimes.length,
                memoryUsage: performance.memory ? {
                    used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + 'MB',
                    total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + 'MB'
                } : 'N/A'
            });
        }
    };
    
    // エラーレポート取得関数
    window.getTranscriptErrorReport = function() {
        if (transcriptManager && transcriptManager.errorHandler) {
            return transcriptManager.errorHandler.getErrorReport();
        }
        return null;
    };
    
    // クリーンアップ関数
    window.cleanupTranscript = function() {
        if (transcriptManager) {
            transcriptManager.destroy();
            transcriptManager = null;
            showNotification('音声文字起こしシステムをクリーンアップしました', 'success');
        }
    };
    
    console.log('✅ グローバル関数を公開しました（強化版）');
}