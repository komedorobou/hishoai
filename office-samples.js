// ===================================================================
// Office質問データベース完全版（各アプリ200問）
// 初心者100問、中級者70問、上級者30問の配分
// ===================================================================

window.officeSamplesDatabase = {
  "word": {
    "basic_input": {
      "name": "文字入力・基本編集",
      "icon": "⌨️",
      "color": "#2b5797",
      "samples": [
        {
          "id": "wd001",
          "text": "文字を入力するにはどこをクリックすればいい？",
          "tags": ["入力", "クリック", "基本"],
          "difficulty": "初級",
          "popularity": 98
        },
        {
          "id": "wd002",
          "text": "文字を削除するにはどのキーを押せばいい？",
          "tags": ["削除", "キー", "基本"],
          "difficulty": "初級",
          "popularity": 97
        },
        {
          "id": "wd003",
          "text": "間違って削除した文字を元に戻したい",
          "tags": ["元に戻す", "復元", "間違い"],
          "difficulty": "初級",
          "popularity": 95
        },
        {
          "id": "wd004",
          "text": "文字をコピーして別の場所に貼り付けたい",
          "tags": ["コピー", "貼り付け", "移動"],
          "difficulty": "初級",
          "popularity": 94
        },
        {
          "id": "wd005",
          "text": "文字を選択するにはどうすればいい？",
          "tags": ["選択", "範囲", "基本"],
          "difficulty": "初級",
          "popularity": 93
        },
        {
          "id": "wd006",
          "text": "全ての文字を一度に選択したい",
          "tags": ["全選択", "一括", "すべて"],
          "difficulty": "初級",
          "popularity": 92
        },
        {
          "id": "wd007",
          "text": "カーソル（文字の入力位置）を移動させたい",
          "tags": ["カーソル", "移動", "位置"],
          "difficulty": "初級",
          "popularity": 91
        },
        {
          "id": "wd008",
          "text": "改行するにはどのキーを押せばいい？",
          "tags": ["改行", "Enter", "行"],
          "difficulty": "初級",
          "popularity": 90
        },
        {
          "id": "wd009",
          "text": "スペース（空白）を入力したい",
          "tags": ["スペース", "空白", "間隔"],
          "difficulty": "初級",
          "popularity": 89
        },
        {
          "id": "wd010",
          "text": "日本語と英語の入力を切り替えたい",
          "tags": ["日本語", "英語", "切り替え"],
          "difficulty": "初級",
          "popularity": 88
        },
        {
          "id": "wd011",
          "text": "漢字変換がうまくいかない時の対処法は？",
          "tags": ["漢字", "変換", "問題"],
          "difficulty": "初級",
          "popularity": 87
        },
        {
          "id": "wd012",
          "text": "勝手に大文字になってしまうのを止めたい",
          "tags": ["大文字", "自動", "停止"],
          "difficulty": "初級",
          "popularity": 86
        },
        {
          "id": "wd013",
          "text": "文字を打つと後ろの文字が消えてしまう",
          "tags": ["上書き", "挿入", "モード"],
          "difficulty": "初級",
          "popularity": 85
        },
        {
          "id": "wd014",
          "text": "文字数を確認したい",
          "tags": ["文字数", "カウント", "確認"],
          "difficulty": "初級",
          "popularity": 84
        },
        {
          "id": "wd015",
          "text": "特定の文字を検索して見つけたい",
          "tags": ["検索", "検索", "見つける"],
          "difficulty": "初級",
          "popularity": 83
        },
        {
          "id": "wd016",
          "text": "文字を別の文字に一括で置き換えたい",
          "tags": ["置換", "一括", "変更"],
          "difficulty": "初級",
          "popularity": 82
        },
        {
          "id": "wd017",
          "text": "文書に今日の日付を入力したい",
          "tags": ["日付", "今日", "自動"],
          "difficulty": "初級",
          "popularity": 81
        },
        {
          "id": "wd018",
          "text": "記号や特殊文字を入力したい",
          "tags": ["記号", "特殊文字", "挿入"],
          "difficulty": "初級",
          "popularity": 80
        },
        {
          "id": "wd019",
          "text": "文字の読み方が分からない時はどうする？",
          "tags": ["読み方", "音声", "読み上げ"],
          "difficulty": "初級",
          "popularity": 79
        },
        {
          "id": "wd020",
          "text": "間違った変換を修正したい",
          "tags": ["変換", "修正", "間違い"],
          "difficulty": "初級",
          "popularity": 78
        },
        {
          "id": "wd021",
          "text": "文字を切り取って移動させたい",
          "tags": ["切り取り", "移動", "カット"],
          "difficulty": "初級",
          "popularity": 77
        },
        {
          "id": "wd022",
          "text": "一度に複数の箇所を選択したい",
          "tags": ["複数選択", "Ctrl", "範囲"],
          "difficulty": "初級",
          "popularity": 76
        },
        {
          "id": "wd023",
          "text": "文書の最初や最後に素早く移動したい",
          "tags": ["移動", "最初", "最後"],
          "difficulty": "初級",
          "popularity": 75
        },
        {
          "id": "wd024",
          "text": "音声で文字を入力したい",
          "tags": ["音声", "音声入力", "話す"],
          "difficulty": "初級",
          "popularity": 74
        },
        {
          "id": "wd025",
          "text": "スペルチェック機能を使いたい",
          "tags": ["スペル", "チェック", "確認"],
          "difficulty": "初級",
          "popularity": 73
        }
      ]
    },
    "basic_format": {
      "name": "書式設定の基本",
      "icon": "🎨",
      "color": "#4b8bbf",
      "samples": [
        {
          "id": "wd026",
          "text": "文字を太字にしたい",
          "tags": ["太字", "ボールド", "強調"],
          "difficulty": "初級",
          "popularity": 98
        },
        {
          "id": "wd027",
          "text": "文字を斜体にしたい",
          "tags": ["斜体", "イタリック", "傾ける"],
          "difficulty": "初級",
          "popularity": 95
        },
        {
          "id": "wd028",
          "text": "文字に下線を引きたい",
          "tags": ["下線", "アンダーライン", "線"],
          "difficulty": "初級",
          "popularity": 94
        },
        {
          "id": "wd029",
          "text": "文字の色を変えたい",
          "tags": ["文字色", "色", "変更"],
          "difficulty": "初級",
          "popularity": 93
        },
        {
          "id": "wd030",
          "text": "文字のサイズを大きくしたい",
          "tags": ["文字サイズ", "大きく", "フォントサイズ"],
          "difficulty": "初級",
          "popularity": 92
        },
        {
          "id": "wd031",
          "text": "フォント（文字の種類）を変更したい",
          "tags": ["フォント", "字体", "種類"],
          "difficulty": "初級",
          "popularity": 91
        },
        {
          "id": "wd032",
          "text": "文字の背景色を変えたい",
          "tags": ["背景色", "ハイライト", "マーカー"],
          "difficulty": "初級",
          "popularity": 90
        },
        {
          "id": "wd033",
          "text": "文字を中央に配置したい",
          "tags": ["中央揃え", "配置", "センター"],
          "difficulty": "初級",
          "popularity": 89
        },
        {
          "id": "wd034",
          "text": "文字を右揃えにしたい",
          "tags": ["右揃え", "配置", "右"],
          "difficulty": "初級",
          "popularity": 88
        },
        {
          "id": "wd035",
          "text": "文字を左揃えに戻したい",
          "tags": ["左揃え", "配置", "左"],
          "difficulty": "初級",
          "popularity": 87
        },
        {
          "id": "wd036",
          "text": "行間を広くしたい",
          "tags": ["行間", "間隔", "広く"],
          "difficulty": "初級",
          "popularity": 86
        },
        {
          "id": "wd037",
          "text": "段落の間隔を調整したい",
          "tags": ["段落", "間隔", "調整"],
          "difficulty": "初級",
          "popularity": 85
        },
        {
          "id": "wd038",
          "text": "文字を上付き・下付きにしたい",
          "tags": ["上付き", "下付き", "指数"],
          "difficulty": "初級",
          "popularity": 84
        },
        {
          "id": "wd039",
          "text": "文字に取り消し線を引きたい",
          "tags": ["取り消し線", "削除", "線"],
          "difficulty": "初級",
          "popularity": 83
        },
        {
          "id": "wd040",
          "text": "すべての書式を一度に解除したい",
          "tags": ["書式", "解除", "クリア"],
          "difficulty": "初級",
          "popularity": 82
        },
        {
          "id": "wd041",
          "text": "他の文字と同じ書式を適用したい",
          "tags": ["書式", "コピー", "同じ"],
          "difficulty": "初級",
          "popularity": 81
        },
        {
          "id": "wd042",
          "text": "文字を大文字・小文字に変換したい",
          "tags": ["大文字", "小文字", "変換"],
          "difficulty": "初級",
          "popularity": 80
        },
        {
          "id": "wd043",
          "text": "文字の縁取りや影をつけたい",
          "tags": ["縁取り", "影", "効果"],
          "difficulty": "初級",
          "popularity": 79
        },
        {
          "id": "wd044",
          "text": "段落の最初を字下げ（インデント）したい",
          "tags": ["字下げ", "インデント", "段落"],
          "difficulty": "初級",
          "popularity": 78
        },
        {
          "id": "wd045",
          "text": "箇条書きを作りたい",
          "tags": ["箇条書き", "リスト", "番号なし"],
          "difficulty": "初級",
          "popularity": 77
        },
        {
          "id": "wd046",
          "text": "番号付きリストを作りたい",
          "tags": ["番号", "リスト", "順序"],
          "difficulty": "初級",
          "popularity": 76
        },
        {
          "id": "wd047",
          "text": "文字をもっと目立たせたい",
          "tags": ["目立つ", "強調", "装飾"],
          "difficulty": "初級",
          "popularity": 75
        },
        {
          "id": "wd048",
          "text": "見出しらしい書式にしたい",
          "tags": ["見出し", "タイトル", "書式"],
          "difficulty": "初級",
          "popularity": 74
        },
        {
          "id": "wd049",
          "text": "書式設定を元に戻したい",
          "tags": ["書式", "元に戻す", "リセット"],
          "difficulty": "初級",
          "popularity": 73
        },
        {
          "id": "wd050",
          "text": "ページ全体の余白を調整したい",
          "tags": ["余白", "マージン", "ページ"],
          "difficulty": "初級",
          "popularity": 72
        }
      ]
    },
    "save_print": {
      "name": "保存・印刷の基本",
      "icon": "💾",
      "color": "#34a853",
      "samples": [
        {
          "id": "wd051",
          "text": "文書を保存したい",
          "tags": ["保存", "セーブ", "ファイル"],
          "difficulty": "初級",
          "popularity": 99
        },
        {
          "id": "wd052",
          "text": "別の名前で文書を保存したい",
          "tags": ["名前を付けて保存", "別名", "コピー"],
          "difficulty": "初級",
          "popularity": 96
        },
        {
          "id": "wd053",
          "text": "自動保存をオンにしたい",
          "tags": ["自動保存", "オートセーブ", "設定"],
          "difficulty": "初級",
          "popularity": 93
        },
        {
          "id": "wd054",
          "text": "文書を印刷したい",
          "tags": ["印刷", "プリント", "出力"],
          "difficulty": "初級",
          "popularity": 95
        },
        {
          "id": "wd055",
          "text": "印刷プレビューで確認したい",
          "tags": ["印刷プレビュー", "確認", "プレビュー"],
          "difficulty": "初級",
          "popularity": 92
        },
        {
          "id": "wd056",
          "text": "特定のページだけ印刷したい",
          "tags": ["ページ指定", "部分印刷", "範囲"],
          "difficulty": "初級",
          "popularity": 91
        },
        {
          "id": "wd057",
          "text": "両面印刷をしたい",
          "tags": ["両面印刷", "裏表", "両面"],
          "difficulty": "初級",
          "popularity": 90
        },
        {
          "id": "wd058",
          "text": "印刷の向きを変えたい（縦・横）",
          "tags": ["印刷向き", "縦", "横"],
          "difficulty": "初級",
          "popularity": 89
        },
        {
          "id": "wd059",
          "text": "用紙サイズを変更したい",
          "tags": ["用紙サイズ", "A4", "A3"],
          "difficulty": "初級",
          "popularity": 88
        },
        {
          "id": "wd060",
          "text": "PDFファイルとして保存したい",
          "tags": ["PDF", "変換", "保存"],
          "difficulty": "初級",
          "popularity": 87
        },
        {
          "id": "wd061",
          "text": "保存した文書を開きたい",
          "tags": ["開く", "ファイル", "読み込み"],
          "difficulty": "初級",
          "popularity": 86
        },
        {
          "id": "wd062",
          "text": "最近使った文書を開きたい",
          "tags": ["最近", "履歴", "開く"],
          "difficulty": "初級",
          "popularity": 85
        },
        {
          "id": "wd063",
          "text": "文書を別の形式で保存したい",
          "tags": ["形式", "変換", "エクスポート"],
          "difficulty": "初級",
          "popularity": 84
        },
        {
          "id": "wd064",
          "text": "印刷がうまくいかない時の対処法は？",
          "tags": ["印刷", "トラブル", "問題"],
          "difficulty": "初級",
          "popularity": 83
        },
        {
          "id": "wd065",
          "text": "文書のバックアップを作りたい",
          "tags": ["バックアップ", "複製", "安全"],
          "difficulty": "初級",
          "popularity": 82
        },
        {
          "id": "wd066",
          "text": "印刷時の文字が小さすぎる",
          "tags": ["印刷", "文字サイズ", "小さい"],
          "difficulty": "初級",
          "popularity": 81
        },
        {
          "id": "wd067",
          "text": "カラー印刷と白黒印刷を選択したい",
          "tags": ["カラー", "白黒", "印刷設定"],
          "difficulty": "初級",
          "popularity": 80
        },
        {
          "id": "wd068",
          "text": "印刷部数を指定したい",
          "tags": ["印刷部数", "コピー数", "複数"],
          "difficulty": "初級",
          "popularity": 79
        },
        {
          "id": "wd069",
          "text": "文書を他の人と共有したい",
          "tags": ["共有", "シェア", "送信"],
          "difficulty": "初級",
          "popularity": 78
        },
        {
          "id": "wd070",
          "text": "クラウドに文書を保存したい",
          "tags": ["クラウド", "OneDrive", "オンライン"],
          "difficulty": "初級",
          "popularity": 77
        }
      ]
    },
    "basic_layout": {
      "name": "基本レイアウト",
      "icon": "📐",
      "color": "#ff6d01",
      "samples": [
        {
          "id": "wd071",
          "text": "ページ番号を入れたい",
          "tags": ["ページ番号", "番号", "挿入"],
          "difficulty": "初級",
          "popularity": 94
        },
        {
          "id": "wd072",
          "text": "ページの上や下に文字を入れたい（ヘッダー・フッター）",
          "tags": ["ヘッダー", "フッター", "上下"],
          "difficulty": "初級",
          "popularity": 91
        },
        {
          "id": "wd073",
          "text": "改ページして新しいページを作りたい",
          "tags": ["改ページ", "新しいページ", "ページ区切り"],
          "difficulty": "初級",
          "popularity": 90
        },
        {
          "id": "wd074",
          "text": "文字を2段組みにしたい",
          "tags": ["段組み", "2段", "コラム"],
          "difficulty": "初級",
          "popularity": 87
        },
        {
          "id": "wd075",
          "text": "箇条書きの記号を変更したい",
          "tags": ["箇条書き", "記号", "変更"],
          "difficulty": "初級",
          "popularity": 86
        },
        {
          "id": "wd076",
          "text": "番号付きリストの番号を変更したい",
          "tags": ["番号", "リスト", "変更"],
          "difficulty": "初級",
          "popularity": 85
        },
        {
          "id": "wd077",
          "text": "文字を罫線で囲みたい",
          "tags": ["罫線", "囲む", "枠"],
          "difficulty": "初級",
          "popularity": 84
        },
        {
          "id": "wd078",
          "text": "段落の前後に空白を入れたい",
          "tags": ["段落", "空白", "間隔"],
          "difficulty": "初級",
          "popularity": 83
        },
        {
          "id": "wd079",
          "text": "文書にタイトルページを作りたい",
          "tags": ["タイトル", "表紙", "ページ"],
          "difficulty": "初級",
          "popularity": 82
        },
        {
          "id": "wd080",
          "text": "段落全体を字下げしたい",
          "tags": ["段落", "字下げ", "インデント"],
          "difficulty": "初級",
          "popularity": 81
        },
        {
          "id": "wd081",
          "text": "行間を細かく調整したい",
          "tags": ["行間", "調整", "細かく"],
          "difficulty": "初級",
          "popularity": 80
        },
        {
          "id": "wd082",
          "text": "文書の背景色を変えたい",
          "tags": ["背景色", "ページ", "色"],
          "difficulty": "初級",
          "popularity": 79
        },
        {
          "id": "wd083",
          "text": "文字と文字の間隔を調整したい",
          "tags": ["文字間隔", "調整", "スペース"],
          "difficulty": "初級",
          "popularity": 78
        },
        {
          "id": "wd084",
          "text": "縦書きにしたい",
          "tags": ["縦書き", "方向", "変更"],
          "difficulty": "初級",
          "popularity": 77
        },
        {
          "id": "wd085",
          "text": "ページの境界線を表示したい",
          "tags": ["境界線", "表示", "ページ"],
          "difficulty": "初級",
          "popularity": 76
        },
        {
          "id": "wd086",
          "text": "段落番号を自動で振りたい",
          "tags": ["段落番号", "自動", "番号"],
          "difficulty": "初級",
          "popularity": 75
        },
        {
          "id": "wd087",
          "text": "文字列を均等に配置したい",
          "tags": ["均等", "配置", "整列"],
          "difficulty": "初級",
          "popularity": 74
        },
        {
          "id": "wd088",
          "text": "タブで文字位置を揃えたい",
          "tags": ["タブ", "位置", "揃える"],
          "difficulty": "初級",
          "popularity": 73
        },
        {
          "id": "wd089",
          "text": "ページの向きを一部だけ変えたい",
          "tags": ["ページ向き", "部分", "変更"],
          "difficulty": "初級",
          "popularity": 72
        },
        {
          "id": "wd090",
          "text": "文書に透かし文字を入れたい",
          "tags": ["透かし", "背景", "文字"],
          "difficulty": "初級",
          "popularity": 71
        }
      ]
    },
    "basic_trouble": {
      "name": "日常トラブル解決",
      "icon": "🔧",
      "color": "#f44336",
      "samples": [
        {
          "id": "wd091",
          "text": "文書が開けない",
          "tags": ["開けない", "エラー", "ファイル"],
          "difficulty": "初級",
          "popularity": 89
        },
        {
          "id": "wd092",
          "text": "文字化けして読めない",
          "tags": ["文字化け", "読めない", "エンコード"],
          "difficulty": "初級",
          "popularity": 87
        },
        {
          "id": "wd093",
          "text": "Wordが突然終了してしまう",
          "tags": ["終了", "クラッシュ", "強制終了"],
          "difficulty": "初級",
          "popularity": 85
        },
        {
          "id": "wd094",
          "text": "保存できない・エラーが出る",
          "tags": ["保存", "エラー", "失敗"],
          "difficulty": "初級",
          "popularity": 84
        },
        {
          "id": "wd095",
          "text": "動作が重い・遅い",
          "tags": ["重い", "遅い", "動作"],
          "difficulty": "初級",
          "popularity": 83
        },
        {
          "id": "wd096",
          "text": "印刷したものと画面の表示が違う",
          "tags": ["印刷", "表示", "違い"],
          "difficulty": "初級",
          "popularity": 82
        },
        {
          "id": "wd097",
          "text": "勝手に書式が変わってしまう",
          "tags": ["書式", "自動変更", "勝手に"],
          "difficulty": "初級",
          "popularity": 81
        },
        {
          "id": "wd098",
          "text": "フォントが表示されない・変わってしまう",
          "tags": ["フォント", "表示", "変更"],
          "difficulty": "初級",
          "popularity": 80
        },
        {
          "id": "wd099",
          "text": "画像が表示されない",
          "tags": ["画像", "表示", "見えない"],
          "difficulty": "初級",
          "popularity": 79
        },
        {
          "id": "wd100",
          "text": "以前のバージョンのWordで開けない",
          "tags": ["バージョン", "互換性", "開けない"],
          "difficulty": "初級",
          "popularity": 78
        }
      ]
    },
    "intermediate_layout": {
      "name": "応用レイアウト・書式",
      "icon": "📊",
      "color": "#9c27b0",
      "samples": [
        {
          "id": "wd101",
          "text": "スタイル機能で書式を統一したい",
          "tags": ["スタイル", "統一", "書式"],
          "difficulty": "中級",
          "popularity": 92
        },
        {
          "id": "wd102",
          "text": "目次を自動生成したい",
          "tags": ["目次", "自動生成", "見出し"],
          "difficulty": "中級",
          "popularity": 90
        },
        {
          "id": "wd103",
          "text": "見出しの番号を自動で振りたい",
          "tags": ["見出し", "番号", "自動"],
          "difficulty": "中級",
          "popularity": 88
        },
        {
          "id": "wd104",
          "text": "セクション区切りでページ設定を変えたい",
          "tags": ["セクション", "区切り", "設定"],
          "difficulty": "中級",
          "popularity": 86
        },
        {
          "id": "wd105",
          "text": "奇数・偶数ページで異なるヘッダーを設定したい",
          "tags": ["ヘッダー", "奇数", "偶数"],
          "difficulty": "中級",
          "popularity": 84
        },
        {
          "id": "wd106",
          "text": "文書の一部だけ段組みにしたい",
          "tags": ["段組み", "部分", "一部"],
          "difficulty": "中級",
          "popularity": 82
        },
        {
          "id": "wd107",
          "text": "テキストボックスを使って自由に配置したい",
          "tags": ["テキストボックス", "自由", "配置"],
          "difficulty": "中級",
          "popularity": 80
        },
        {
          "id": "wd108",
          "text": "ドロップキャップ（大文字）で段落を始めたい",
          "tags": ["ドロップキャップ", "大文字", "段落"],
          "difficulty": "中級",
          "popularity": 78
        },
        {
          "id": "wd109",
          "text": "カスタム余白を設定したい",
          "tags": ["余白", "カスタム", "設定"],
          "difficulty": "中級",
          "popularity": 76
        },
        {
          "id": "wd110",
          "text": "文字列の方向を変更したい",
          "tags": ["文字列", "方向", "変更"],
          "difficulty": "中級",
          "popularity": 74
        },
        {
          "id": "wd111",
          "text": "段落の境界線・シェーディングを設定したい",
          "tags": ["境界線", "シェーディング", "段落"],
          "difficulty": "中級",
          "popularity": 72
        },
        {
          "id": "wd112",
          "text": "行番号を表示したい",
          "tags": ["行番号", "表示", "番号"],
          "difficulty": "中級",
          "popularity": 70
        },
        {
          "id": "wd113",
          "text": "段落を次のページから始めたい",
          "tags": ["段落", "次ページ", "改ページ"],
          "difficulty": "中級",
          "popularity": 68
        },
        {
          "id": "wd114",
          "text": "文字を図形の形に配置したい（ワードアート）",
          "tags": ["ワードアート", "図形", "文字"],
          "difficulty": "中級",
          "popularity": 66
        },
        {
          "id": "wd115",
          "text": "複数列の箇条書きを作りたい",
          "tags": ["箇条書き", "複数列", "列"],
          "difficulty": "中級",
          "popularity": 64
        },
        {
          "id": "wd116",
          "text": "タブリーダー（点線など）を設定したい",
          "tags": ["タブ", "リーダー", "点線"],
          "difficulty": "中級",
          "popularity": 62
        },
        {
          "id": "wd117",
          "text": "文字と段落の境界を可視化したい",
          "tags": ["境界", "可視化", "表示"],
          "difficulty": "中級",
          "popularity": 60
        },
        {
          "id": "wd118",
          "text": "文書保護で編集を制限したい",
          "tags": ["保護", "編集制限", "セキュリティ"],
          "difficulty": "中級",
          "popularity": 58
        },
        {
          "id": "wd119",
          "text": "ページ境界で段落が分かれないようにしたい",
          "tags": ["段落", "分割", "防止"],
          "difficulty": "中級",
          "popularity": 56
        },
        {
          "id": "wd120",
          "text": "文書のテンプレートを作成したい",
          "tags": ["テンプレート", "作成", "雛形"],
          "difficulty": "中級",
          "popularity": 54
        },
        {
          "id": "wd121",
          "text": "スタイルセットを独自に作成したい",
          "tags": ["スタイルセット", "独自", "作成"],
          "difficulty": "中級",
          "popularity": 52
        },
        {
          "id": "wd122",
          "text": "ページの背景に画像を設定したい",
          "tags": ["背景", "画像", "ページ"],
          "difficulty": "中級",
          "popularity": 50
        },
        {
          "id": "wd123",
          "text": "文字の効果をカスタマイズしたい",
          "tags": ["文字効果", "カスタマイズ", "装飾"],
          "difficulty": "中級",
          "popularity": 48
        },
        {
          "id": "wd124",
          "text": "段落の前で自動的に改ページしたい",
          "tags": ["段落", "改ページ", "自動"],
          "difficulty": "中級",
          "popularity": 46
        },
        {
          "id": "wd125",
          "text": "クイックパーツで再利用可能な部品を作りたい",
          "tags": ["クイックパーツ", "再利用", "部品"],
          "difficulty": "中級",
          "popularity": 44
        }
      ]
    },
    "intermediate_media": {
      "name": "表・図・画像の活用",
      "icon": "🖼️",
      "color": "#607d8b",
      "samples": [
        {
          "id": "wd126",
          "text": "表を挿入して編集したい",
          "tags": ["表", "挿入", "編集"],
          "difficulty": "中級",
          "popularity": 95
        },
        {
          "id": "wd127",
          "text": "表の行・列を追加・削除したい",
          "tags": ["表", "行", "列"],
          "difficulty": "中級",
          "popularity": 92
        },
        {
          "id": "wd128",
          "text": "表の罫線をカスタマイズしたい",
          "tags": ["表", "罫線", "カスタマイズ"],
          "difficulty": "中級",
          "popularity": 89
        },
        {
          "id": "wd129",
          "text": "画像を挿入してサイズ調整したい",
          "tags": ["画像", "挿入", "サイズ"],
          "difficulty": "中級",
          "popularity": 87
        },
        {
          "id": "wd130",
          "text": "画像の周りに文字を回り込ませたい",
          "tags": ["画像", "文字", "回り込み"],
          "difficulty": "中級",
          "popularity": 84
        },
        {
          "id": "wd131",
          "text": "SmartArtで図解を作成したい",
          "tags": ["SmartArt", "図解", "作成"],
          "difficulty": "中級",
          "popularity": 82
        },
        {
          "id": "wd132",
          "text": "図形を描いて文書を装飾したい",
          "tags": ["図形", "描画", "装飾"],
          "difficulty": "中級",
          "popularity": 79
        },
        {
          "id": "wd133",
          "text": "グラフを挿入してデータを表示したい",
          "tags": ["グラフ", "挿入", "データ"],
          "difficulty": "中級",
          "popularity": 77
        },
        {
          "id": "wd134",
          "text": "画像の背景を削除したい",
          "tags": ["画像", "背景", "削除"],
          "difficulty": "中級",
          "popularity": 74
        },
        {
          "id": "wd135",
          "text": "表のセルを結合・分割したい",
          "tags": ["表", "セル", "結合"],
          "difficulty": "中級",
          "popularity": 72
        },
        {
          "id": "wd136",
          "text": "図表に番号と説明文を付けたい",
          "tags": ["図表", "番号", "説明"],
          "difficulty": "中級",
          "popularity": 69
        },
        {
          "id": "wd137",
          "text": "画像にフィルター効果を適用したい",
          "tags": ["画像", "フィルター", "効果"],
          "difficulty": "中級",
          "popularity": 67
        },
        {
          "id": "wd138",
          "text": "図形を組み合わせて複雑な図を作りたい",
          "tags": ["図形", "組み合わせ", "複雑"],
          "difficulty": "中級",
          "popularity": 64
        },
        {
          "id": "wd139",
          "text": "表のデザインを一括で変更したい",
          "tags": ["表", "デザイン", "一括"],
          "difficulty": "中級",
          "popularity": 62
        },
        {
          "id": "wd140",
          "text": "画像を圧縮してファイルサイズを小さくしたい",
          "tags": ["画像", "圧縮", "ファイルサイズ"],
          "difficulty": "中級",
          "popularity": 59
        },
        {
          "id": "wd141",
          "text": "数式エディタで数学式を入力したい",
          "tags": ["数式", "エディタ", "数学"],
          "difficulty": "中級",
          "popularity": 57
        },
        {
          "id": "wd142",
          "text": "アイコンやシンボルを挿入したい",
          "tags": ["アイコン", "シンボル", "挿入"],
          "difficulty": "中級",
          "popularity": 54
        },
        {
          "id": "wd143",
          "text": "スクリーンショットを文書に挿入したい",
          "tags": ["スクリーンショット", "挿入", "画面"],
          "difficulty": "中級",
          "popularity": 52
        },
        {
          "id": "wd144",
          "text": "3Dモデルを文書に挿入したい",
          "tags": ["3D", "モデル", "挿入"],
          "difficulty": "中級",
          "popularity": 49
        },
        {
          "id": "wd145",
          "text": "オンライン画像を検索して挿入したい",
          "tags": ["オンライン", "画像", "検索"],
          "difficulty": "中級",
          "popularity": 47
        }
      ]
    },
    "intermediate_efficiency": {
      "name": "効率化・管理機能",
      "icon": "⚡",
      "color": "#ff5722",
      "samples": [
        {
          "id": "wd146",
          "text": "コメント機能で校閲したい",
          "tags": ["コメント", "校閲", "レビュー"],
          "difficulty": "中級",
          "popularity": 90
        },
        {
          "id": "wd147",
          "text": "変更履歴を記録・表示したい",
          "tags": ["変更履歴", "記録", "表示"],
          "difficulty": "中級",
          "popularity": 87
        },
        {
          "id": "wd148",
          "text": "複数の文書を比較したい",
          "tags": ["文書", "比較", "複数"],
          "difficulty": "中級",
          "popularity": 84
        },
        {
          "id": "wd149",
          "text": "文書を同時に複数人で編集したい",
          "tags": ["同時", "複数人", "編集"],
          "difficulty": "中級",
          "popularity": 82
        },
        {
          "id": "wd150",
          "text": "ハイパーリンクで他の文書や Webページにリンクしたい",
          "tags": ["ハイパーリンク", "リンク", "Web"],
          "difficulty": "中級",
          "popularity": 79
        },
        {
          "id": "wd151",
          "text": "相互参照で文書内の他の部分を参照したい",
          "tags": ["相互参照", "参照", "文書内"],
          "difficulty": "中級",
          "popularity": 76
        },
        {
          "id": "wd152",
          "text": "脚注や文末脚注を追加したい",
          "tags": ["脚注", "文末脚注", "追加"],
          "difficulty": "中級",
          "popularity": 74
        },
        {
          "id": "wd153",
          "text": "文書のプロパティ（作成者・タイトルなど）を設定したい",
          "tags": ["プロパティ", "作成者", "タイトル"],
          "difficulty": "中級",
          "popularity": 71
        },
        {
          "id": "wd154",
          "text": "文書を結合して一つにまとめたい",
          "tags": ["結合", "まとめる", "統合"],
          "difficulty": "中級",
          "popularity": 68
        },
        {
          "id": "wd155",
          "text": "ブックマークで文書内の特定位置に名前を付けたい",
          "tags": ["ブックマーク", "位置", "名前"],
          "difficulty": "中級",
          "popularity": 66
        },
        {
          "id": "wd156",
          "text": "読み取り専用で文書を開きたい",
          "tags": ["読み取り専用", "開く", "保護"],
          "difficulty": "中級",
          "popularity": 63
        },
        {
          "id": "wd157",
          "text": "文書の統計情報（文字数・ページ数など）を確認したい",
          "tags": ["統計", "文字数", "ページ数"],
          "difficulty": "中級",
          "popularity": 61
        },
        {
          "id": "wd158",
          "text": "マクロを記録して繰り返し作業を自動化したい",
          "tags": ["マクロ", "記録", "自動化"],
          "difficulty": "中級",
          "popularity": 58
        },
        {
          "id": "wd159",
          "text": "文書の閲覧制限をかけたい",
          "tags": ["閲覧制限", "制限", "セキュリティ"],
          "difficulty": "中級",
          "popularity": 56
        },
        {
          "id": "wd160",
          "text": "音声コメントを追加したい",
          "tags": ["音声", "コメント", "追加"],
          "difficulty": "中級",
          "popularity": 53
        },
        {
          "id": "wd161",
          "text": "文書のバージョン管理をしたい",
          "tags": ["バージョン", "管理", "履歴"],
          "difficulty": "中級",
          "popularity": 51
        },
        {
          "id": "wd162",
          "text": "辞書機能で単語の意味を調べたい",
          "tags": ["辞書", "意味", "調べる"],
          "difficulty": "中級",
          "popularity": 48
        },
        {
          "id": "wd163",
          "text": "翻訳機能で文書を他言語に変換したい",
          "tags": ["翻訳", "他言語", "変換"],
          "difficulty": "中級",
          "popularity": 46
        },
        {
          "id": "wd164",
          "text": "文書の印刷時にコメントも含めたい",
          "tags": ["印刷", "コメント", "含める"],
          "difficulty": "中級",
          "popularity": 43
        },
        {
          "id": "wd165",
          "text": "アウトライン表示で文書構造を確認したい",
          "tags": ["アウトライン", "表示", "構造"],
          "difficulty": "中級",
          "popularity": 41
        }
      ]
    },
    "collaboration": {
      "name": "共同作業・校閲",
      "icon": "👥",
      "color": "#795548",
      "samples": [
        {
          "id": "wd166",
          "text": "複数の校閲者からのコメントを管理したい",
          "tags": ["複数", "校閲者", "コメント管理"],
          "difficulty": "中級",
          "popularity": 85
        },
        {
          "id": "wd167",
          "text": "変更履歴の承諾・却下を効率的に行いたい",
          "tags": ["変更履歴", "承諾", "却下"],
          "difficulty": "中級",
          "popularity": 82
        },
        {
          "id": "wd168",
          "text": "文書の特定部分だけを編集可能にしたい",
          "tags": ["部分編集", "編集可能", "制限"],
          "difficulty": "中級",
          "popularity": 79
        },
        {
          "id": "wd169",
          "text": "リアルタイムで共同編集したい",
          "tags": ["リアルタイム", "共同編集", "同時"],
          "difficulty": "中級",
          "popularity": 77
        },
        {
          "id": "wd170",
          "text": "文書の最終版を確定したい",
          "tags": ["最終版", "確定", "完成"],
          "difficulty": "中級",
          "popularity": 74
        }
      ]
    },
    "advanced_automation": {
      "name": "自動化・高度機能",
      "icon": "🤖",
      "color": "#1f4e79",
      "samples": [
        {
          "id": "wd171",
          "text": "差し込み印刷で大量の個別文書を作成したい",
          "tags": ["差し込み印刷", "大量", "個別文書"],
          "difficulty": "上級",
          "popularity": 90
        },
        {
          "id": "wd172",
          "text": "Excelデータを使って自動で宛名ラベルを作成したい",
          "tags": ["Excel", "宛名ラベル", "自動"],
          "difficulty": "上級",
          "popularity": 87
        },
        {
          "id": "wd173",
          "text": "フィールドコードで動的な内容を表示したい",
          "tags": ["フィールドコード", "動的", "表示"],
          "difficulty": "上級",
          "popularity": 84
        },
        {
          "id": "wd174",
          "text": "VBAマクロで複雑な文書処理を自動化したい",
          "tags": ["VBA", "マクロ", "自動化"],
          "difficulty": "上級",
          "popularity": 81
        },
        {
          "id": "wd175",
          "text": "カスタムリボンで独自の機能ボタンを追加したい",
          "tags": ["カスタムリボン", "独自機能", "ボタン"],
          "difficulty": "上級",
          "popularity": 78
        },
        {
          "id": "wd176",
          "text": "文書テンプレートに入力フォームを作成したい",
          "tags": ["テンプレート", "入力フォーム", "作成"],
          "difficulty": "上級",
          "popularity": 75
        },
        {
          "id": "wd177",
          "text": "複数の文書から自動で情報を抽出・集約したい",
          "tags": ["複数文書", "抽出", "集約"],
          "difficulty": "上級",
          "popularity": 72
        },
        {
          "id": "wd178",
          "text": "XMLスキーマを活用した構造化文書を作成したい",
          "tags": ["XML", "スキーマ", "構造化"],
          "difficulty": "上級",
          "popularity": 69
        },
        {
          "id": "wd179",
          "text": "文書の一括変換・処理を自動化したい",
          "tags": ["一括変換", "処理", "自動化"],
          "difficulty": "上級",
          "popularity": 66
        },
        {
          "id": "wd180",
          "text": "外部データベースと連携した動的文書を作成したい",
          "tags": ["データベース", "連携", "動的"],
          "difficulty": "上級",
          "popularity": 63
        }
      ]
    },
    "advanced_document": {
      "name": "長文・専門文書",
      "icon": "📚",
      "color": "#3f51b5",
      "samples": [
        {
          "id": "wd181",
          "text": "論文・レポート用の書式テンプレートを作成したい",
          "tags": ["論文", "レポート", "テンプレート"],
          "difficulty": "上級",
          "popularity": 88
        },
        {
          "id": "wd182",
          "text": "参考文献リストを自動生成・管理したい",
          "tags": ["参考文献", "自動生成", "管理"],
          "difficulty": "上級",
          "popularity": 85
        },
        {
          "id": "wd183",
          "text": "図表目次を自動で作成したい",
          "tags": ["図表目次", "自動", "作成"],
          "difficulty": "上級",
          "popularity": 82
        },
        {
          "id": "wd184",
          "text": "索引を自動生成したい",
          "tags": ["索引", "自動生成", "インデックス"],
          "difficulty": "上級",
          "popularity": 79
        },
        {
          "id": "wd185",
          "text": "マスター文書で複数の文書を統合管理したい",
          "tags": ["マスター文書", "統合", "管理"],
          "difficulty": "上級",
          "popularity": 76
        },
        {
          "id": "wd186",
          "text": "章・節番号を自動で管理したい",
          "tags": ["章", "節番号", "自動管理"],
          "difficulty": "上級",
          "popularity": 73
        },
        {
          "id": "wd187",
          "text": "引用スタイル（APA、MLAなど）を適用したい",
          "tags": ["引用", "APA", "MLA"],
          "difficulty": "上級",
          "popularity": 70
        },
        {
          "id": "wd188",
          "text": "文書のアクセシビリティを向上させたい",
          "tags": ["アクセシビリティ", "向上", "対応"],
          "difficulty": "上級",
          "popularity": 67
        },
        {
          "id": "wd189",
          "text": "多言語文書での文字方向・書式を管理したい",
          "tags": ["多言語", "文字方向", "書式"],
          "difficulty": "上級",
          "popularity": 64
        },
        {
          "id": "wd190",
          "text": "文書のメタデータを詳細に設定・管理したい",
          "tags": ["メタデータ", "設定", "管理"],
          "difficulty": "上級",
          "popularity": 61
        }
      ]
    },
    "advanced_integration": {
      "name": "システム連携・高度活用",
      "icon": "🔗",
      "color": "#00bcd4",
      "samples": [
        {
          "id": "wd191",
          "text": "SharePointと連携したワークフロー文書を作成したい",
          "tags": ["SharePoint", "ワークフロー", "連携"],
          "difficulty": "上級",
          "popularity": 75
        },
        {
          "id": "wd192",
          "text": "Outlookと連携してメール本文を文書に挿入したい",
          "tags": ["Outlook", "メール", "挿入"],
          "difficulty": "上級",
          "popularity": 72
        },
        {
          "id": "wd193",
          "text": "Power Automateで文書処理を自動化したい",
          "tags": ["Power Automate", "文書処理", "自動化"],
          "difficulty": "上級",
          "popularity": 69
        },
        {
          "id": "wd194",
          "text": "APIを使用して外部システムとデータ連携したい",
          "tags": ["API", "外部システム", "データ連携"],
          "difficulty": "上級",
          "popularity": 66
        },
        {
          "id": "wd195",
          "text": "文書の電子署名・承認システムを構築したい",
          "tags": ["電子署名", "承認", "システム"],
          "difficulty": "上級",
          "popularity": 63
        },
        {
          "id": "wd196",
          "text": "クラウドストレージと連携した文書管理をしたい",
          "tags": ["クラウド", "ストレージ", "文書管理"],
          "difficulty": "上級",
          "popularity": 60
        },
        {
          "id": "wd197",
          "text": "機械学習を活用した文書分類・タグ付けをしたい",
          "tags": ["機械学習", "分類", "タグ付け"],
          "difficulty": "上級",
          "popularity": 57
        },
        {
          "id": "wd198",
          "text": "文書のセキュリティ・暗号化を強化したい",
          "tags": ["セキュリティ", "暗号化", "強化"],
          "difficulty": "上級",
          "popularity": 54
        },
        {
          "id": "wd199",
          "text": "大規模文書管理システムと連携したい",
          "tags": ["大規模", "文書管理", "システム連携"],
          "difficulty": "上級",
          "popularity": 51
        },
        {
          "id": "wd200",
          "text": "AIを活用した文書要約・翻訳機能を実装したい",
          "tags": ["AI", "要約", "翻訳"],
          "difficulty": "上級",
          "popularity": 48
        }
      ]
    }
  },
  "excel": {
    "basic_operation": {
      "name": "基本操作・セル操作",
      "icon": "📝",
      "color": "#2b5797",
      "samples": [
        {
          "id": "ex001",
          "text": "セルに文字や数字を入力したい",
          "tags": ["入力", "セル", "文字"],
          "difficulty": "初級",
          "popularity": 99
        },
        {
          "id": "ex002",
          "text": "セルを選択する方法は？",
          "tags": ["選択", "セル", "基本"],
          "difficulty": "初級",
          "popularity": 98
        },
        {
          "id": "ex003",
          "text": "複数のセルを一度に選択したい",
          "tags": ["複数選択", "セル", "範囲"],
          "difficulty": "初級",
          "popularity": 97
        },
        {
          "id": "ex004",
          "text": "セルの内容をコピーして貼り付けたい",
          "tags": ["コピー", "貼り付け", "セル"],
          "difficulty": "初級",
          "popularity": 96
        },
        {
          "id": "ex005",
          "text": "セルの内容を削除したい",
          "tags": ["削除", "セル", "クリア"],
          "difficulty": "初級",
          "popularity": 95
        },
        {
          "id": "ex006",
          "text": "間違って削除したセルの内容を元に戻したい",
          "tags": ["元に戻す", "復元", "間違い"],
          "difficulty": "初級",
          "popularity": 94
        },
        {
          "id": "ex007",
          "text": "セルを切り取って移動させたい",
          "tags": ["切り取り", "移動", "セル"],
          "difficulty": "初級",
          "popularity": 93
        },
        {
          "id": "ex008",
          "text": "行全体を選択したい",
          "tags": ["行", "選択", "全体"],
          "difficulty": "初級",
          "popularity": 92
        },
        {
          "id": "ex009",
          "text": "列全体を選択したい",
          "tags": ["列", "選択", "全体"],
          "difficulty": "初級",
          "popularity": 91
        },
        {
          "id": "ex010",
          "text": "行を挿入・削除したい",
          "tags": ["行", "挿入", "削除"],
          "difficulty": "初級",
          "popularity": 90
        },
        {
          "id": "ex011",
          "text": "列を挿入・削除したい",
          "tags": ["列", "挿入", "削除"],
          "difficulty": "初級",
          "popularity": 89
        },
        {
          "id": "ex012",
          "text": "列幅を調整したい",
          "tags": ["列幅", "調整", "幅"],
          "difficulty": "初級",
          "popularity": 88
        },
        {
          "id": "ex013",
          "text": "行の高さを調整したい",
          "tags": ["行", "高さ", "調整"],
          "difficulty": "初級",
          "popularity": 87
        },
        {
          "id": "ex014",
          "text": "セルを結合したい",
          "tags": ["セル", "結合", "まとめる"],
          "difficulty": "初級",
          "popularity": 86
        },
        {
          "id": "ex015",
          "text": "結合したセルを分割したい",
          "tags": ["結合", "分割", "解除"],
          "difficulty": "初級",
          "popularity": 85
        },
        {
          "id": "ex016",
          "text": "オートフィルで連続データを入力したい",
          "tags": ["オートフィル", "連続", "自動入力"],
          "difficulty": "初級",
          "popularity": 84
        },
        {
          "id": "ex017",
          "text": "同じデータを複数のセルに一度に入力したい",
          "tags": ["同じデータ", "複数", "一度に"],
          "difficulty": "初級",
          "popularity": 83
        },
        {
          "id": "ex018",
          "text": "セルに長い文字が入らない時の対処法は？",
          "tags": ["長い文字", "入らない", "対処"],
          "difficulty": "初級",
          "popularity": 82
        },
        {
          "id": "ex019",
          "text": "セルの表示形式を変更したい",
          "tags": ["表示形式", "変更", "書式"],
          "difficulty": "初級",
          "popularity": 81
        },
        {
          "id": "ex020",
          "text": "数値を通貨形式で表示したい",
          "tags": ["通貨", "表示", "¥"],
          "difficulty": "初級",
          "popularity": 80
        },
        {
          "id": "ex021",
          "text": "パーセント表示にしたい",
          "tags": ["パーセント", "%", "表示"],
          "difficulty": "初級",
          "popularity": 79
        },
        {
          "id": "ex022",
          "text": "日付の表示形式を変更したい",
          "tags": ["日付", "表示形式", "変更"],
          "difficulty": "初級",
          "popularity": 78
        },
        {
          "id": "ex023",
          "text": "小数点以下の桁数を調整したい",
          "tags": ["小数点", "桁数", "調整"],
          "difficulty": "初級",
          "popularity": 77
        },
        {
          "id": "ex024",
          "text": "セルの値をコピーして、書式なしで貼り付けたい",
          "tags": ["値のみ", "貼り付け", "書式なし"],
          "difficulty": "初級",
          "popularity": 76
        },
        {
          "id": "ex025",
          "text": "シート間でデータをコピーしたい",
          "tags": ["シート間", "コピー", "データ"],
          "difficulty": "初級",
          "popularity": 75
        },
        {
          "id": "ex026",
          "text": "新しいワークシートを追加したい",
          "tags": ["新しいシート", "追加", "ワークシート"],
          "difficulty": "初級",
          "popularity": 74
        },
        {
          "id": "ex027",
          "text": "シートの名前を変更したい",
          "tags": ["シート名", "変更", "名前"],
          "difficulty": "初級",
          "popularity": 73
        },
        {
          "id": "ex028",
          "text": "シートを削除したい",
          "tags": ["シート", "削除", "ワークシート"],
          "difficulty": "初級",
          "popularity": 72
        },
        {
          "id": "ex029",
          "text": "シートの順番を変更したい",
          "tags": ["シート", "順番", "並び替え"],
          "difficulty": "初級",
          "popularity": 71
        },
        {
          "id": "ex030",
          "text": "表全体を選択したい",
          "tags": ["表", "全体", "選択"],
          "difficulty": "初級",
          "popularity": 70
        }
      ]
    },
    "basic_calculation": {
      "name": "基本的な計算・関数",
      "icon": "🧮",
      "color": "#4b8bbf",
      "samples": [
        {
          "id": "ex031",
          "text": "足し算をしたい（+）",
          "tags": ["足し算", "加算", "+"],
          "difficulty": "初級",
          "popularity": 99
        },
        {
          "id": "ex032",
          "text": "引き算をしたい（-）",
          "tags": ["引き算", "減算", "-"],
          "difficulty": "初級",
          "popularity": 98
        },
        {
          "id": "ex033",
          "text": "掛け算をしたい（*）",
          "tags": ["掛け算", "乗算", "*"],
          "difficulty": "初級",
          "popularity": 97
        },
        {
          "id": "ex034",
          "text": "割り算をしたい（/）",
          "tags": ["割り算", "除算", "/"],
          "difficulty": "初級",
          "popularity": 96
        },
        {
          "id": "ex035",
          "text": "SUM関数で合計を計算したい",
          "tags": ["SUM", "合計", "関数"],
          "difficulty": "初級",
          "popularity": 95
        },
        {
          "id": "ex036",
          "text": "AVERAGE関数で平均を計算したい",
          "tags": ["AVERAGE", "平均", "関数"],
          "difficulty": "初級",
          "popularity": 94
        },
        {
          "id": "ex037",
          "text": "COUNT関数で数値の個数を数えたい",
          "tags": ["COUNT", "個数", "数値"],
          "difficulty": "初級",
          "popularity": 93
        },
        {
          "id": "ex038",
          "text": "MAX関数で最大値を求めたい",
          "tags": ["MAX", "最大値", "関数"],
          "difficulty": "初級",
          "popularity": 92
        },
        {
          "id": "ex039",
          "text": "MIN関数で最小値を求めたい",
          "tags": ["MIN", "最小値", "関数"],
          "difficulty": "初級",
          "popularity": 91
        },
        {
          "id": "ex040",
          "text": "セル参照（A1、B2など）の使い方は？",
          "tags": ["セル参照", "A1", "参照"],
          "difficulty": "初級",
          "popularity": 90
        },
        {
          "id": "ex041",
          "text": "数式をコピーした時に参照先がずれないようにしたい（$マーク）",
          "tags": ["絶対参照", "$", "固定"],
          "difficulty": "初級",
          "popularity": 89
        },
        {
          "id": "ex042",
          "text": "括弧（）を使って計算の順序を指定したい",
          "tags": ["括弧", "計算順序", "優先"],
          "difficulty": "初級",
          "popularity": 88
        },
        {
          "id": "ex043",
          "text": "数式がエラーになる原因と解決方法は？",
          "tags": ["数式", "エラー", "解決"],
          "difficulty": "初級",
          "popularity": 87
        },
        {
          "id": "ex044",
          "text": "今日の日付を自動で表示したい（TODAY関数）",
          "tags": ["TODAY", "今日", "日付"],
          "difficulty": "初級",
          "popularity": 86
        },
        {
          "id": "ex045",
          "text": "現在の日時を表示したい（NOW関数）",
          "tags": ["NOW", "現在", "日時"],
          "difficulty": "初級",
          "popularity": 85
        },
        {
          "id": "ex046",
          "text": "数式バーに表示される内容の意味は？",
          "tags": ["数式バー", "表示", "意味"],
          "difficulty": "初級",
          "popularity": 84
        },
        {
          "id": "ex047",
          "text": "四捨五入したい（ROUND関数）",
          "tags": ["ROUND", "四捨五入", "関数"],
          "difficulty": "初級",
          "popularity": 83
        },
        {
          "id": "ex048",
          "text": "消費税を計算したい",
          "tags": ["消費税", "計算", "税金"],
          "difficulty": "初級",
          "popularity": 82
        },
        {
          "id": "ex049",
          "text": "割引率を計算したい",
          "tags": ["割引", "割引率", "計算"],
          "difficulty": "初級",
          "popularity": 81
        },
        {
          "id": "ex050",
          "text": "2つの日付の差を計算したい",
          "tags": ["日付", "差", "計算"],
          "difficulty": "初級",
          "popularity": 80
        },
        {
          "id": "ex051",
          "text": "簡単なIF関数を使いたい",
          "tags": ["IF", "条件", "関数"],
          "difficulty": "初級",
          "popularity": 79
        },
        {
          "id": "ex052",
          "text": "COUNTA関数で空白以外のセルを数えたい",
          "tags": ["COUNTA", "空白以外", "数える"],
          "difficulty": "初級",
          "popularity": 78
        },
        {
          "id": "ex053",
          "text": "文字列を結合したい（&演算子）",
          "tags": ["文字列", "結合", "&"],
          "difficulty": "初級",
          "popularity": 77
        },
        {
          "id": "ex054",
          "text": "数式の結果が表示されず、数式そのものが表示される",
          "tags": ["数式", "表示", "結果"],
          "difficulty": "初級",
          "popularity": 76
        },
        {
          "id": "ex055",
          "text": "自動計算がオフになっている時の対処法は？",
          "tags": ["自動計算", "オフ", "対処"],
          "difficulty": "初級",
          "popularity": 75
        }
      ]
    },
    "data_input": {
      "name": "データ入力・整理",
      "icon": "📊",
      "color": "#34a853",
      "samples": [
        {
          "id": "ex056",
          "text": "データを昇順（小さい順）に並び替えたい",
          "tags": ["並び替え", "昇順", "小さい順"],
          "difficulty": "初級",
          "popularity": 95
        },
        {
          "id": "ex057",
          "text": "データを降順（大きい順）に並び替えたい",
          "tags": ["並び替え", "降順", "大きい順"],
          "difficulty": "初級",
          "popularity": 94
        },
        {
          "id": "ex058",
          "text": "複数の列を基準に並び替えたい",
          "tags": ["複数列", "並び替え", "基準"],
          "difficulty": "初級",
          "popularity": 91
        },
        {
          "id": "ex059",
          "text": "フィルター機能で特定のデータだけを表示したい",
          "tags": ["フィルター", "特定", "表示"],
          "difficulty": "初級",
          "popularity": 93
        },
        {
          "id": "ex060",
          "text": "フィルターで複数の条件を指定したい",
          "tags": ["フィルター", "複数条件", "指定"],
          "difficulty": "初級",
          "popularity": 90
        },
        {
          "id": "ex061",
          "text": "フィルターを解除してすべてのデータを表示したい",
          "tags": ["フィルター", "解除", "すべて"],
          "difficulty": "初級",
          "popularity": 89
        },
        {
          "id": "ex062",
          "text": "重複したデータを削除したい",
          "tags": ["重複", "削除", "データ"],
          "difficulty": "初級",
          "popularity": 88
        },
        {
          "id": "ex063",
          "text": "重複したデータを見つけたい",
          "tags": ["重複", "見つける", "確認"],
          "difficulty": "初級",
          "popularity": 87
        },
        {
          "id": "ex064",
          "text": "空白のセルを一度に削除したい",
          "tags": ["空白", "削除", "一度に"],
          "difficulty": "初級",
          "popularity": 86
        },
        {
          "id": "ex065",
          "text": "データの入力規則で入力制限をかけたい",
          "tags": ["入力規則", "制限", "制御"],
          "difficulty": "初級",
          "popularity": 85
        },
        {
          "id": "ex066",
          "text": "ドロップダウンリストを作成したい",
          "tags": ["ドロップダウン", "リスト", "選択"],
          "difficulty": "初級",
          "popularity": 84
        },
        {
          "id": "ex067",
          "text": "連続した数字（1,2,3...）を自動入力したい",
          "tags": ["連続", "数字", "自動入力"],
          "difficulty": "初級",
          "popularity": 83
        },
        {
          "id": "ex068",
          "text": "連続した日付を自動入力したい",
          "tags": ["連続", "日付", "自動入力"],
          "difficulty": "初級",
          "popularity": 82
        },
        {
          "id": "ex069",
          "text": "曜日を自動入力したい（月、火、水...）",
          "tags": ["曜日", "自動入力", "月火水"],
          "difficulty": "初級",
          "popularity": 81
        },
        {
          "id": "ex070",
          "text": "月名を自動入力したい（1月、2月、3月...）",
          "tags": ["月名", "自動入力", "1月2月"],
          "difficulty": "初級",
          "popularity": 80
        },
        {
          "id": "ex071",
          "text": "数値にカンマ区切りを付けたい（1,000）",
          "tags": ["カンマ", "区切り", "1000"],
          "difficulty": "初級",
          "popularity": 79
        },
        {
          "id": "ex072",
          "text": "先頭の0が消えてしまうのを防ぎたい（郵便番号など）",
          "tags": ["先頭", "0", "消える"],
          "difficulty": "初級",
          "popularity": 78
        },
        {
          "id": "ex073",
          "text": "大文字と小文字を統一したい",
          "tags": ["大文字", "小文字", "統一"],
          "difficulty": "初級",
          "popularity": 77
        },
        {
          "id": "ex074",
          "text": "セルに入力時にメッセージを表示したい",
          "tags": ["入力", "メッセージ", "表示"],
          "difficulty": "初級",
          "popularity": 76
        },
        {
          "id": "ex075",
          "text": "データのバックアップを自動で作成したい",
          "tags": ["バックアップ", "自動", "作成"],
          "difficulty": "初級",
          "popularity": 75
        },
        {
          "id": "ex076",
          "text": "CSVファイルからデータを読み込みたい",
          "tags": ["CSV", "読み込み", "インポート"],
          "difficulty": "初級",
          "popularity": 74
        },
        {
          "id": "ex077",
          "text": "テキストファイルのデータを取り込みたい",
          "tags": ["テキスト", "取り込み", "インポート"],
          "difficulty": "初級",
          "popularity": 73
        },
        {
          "id": "ex078",
          "text": "区切り文字でデータを分割したい",
          "tags": ["区切り文字", "分割", "データ"],
          "difficulty": "初級",
          "popularity": 72
        },
        {
          "id": "ex079",
          "text": "文字列から数値部分だけを抜き出したい",
          "tags": ["文字列", "数値", "抜き出し"],
          "difficulty": "初級",
          "popularity": 71
        },
        {
          "id": "ex080",
          "text": "データの形式を統一したい",
          "tags": ["データ", "形式", "統一"],
          "difficulty": "初級",
          "popularity": 70
        }
      ]
    },
    "display_print": {
      "name": "表示・印刷設定",
      "icon": "🖨️",
      "color": "#ff6d01",
      "samples": [
        {
          "id": "ex081",
          "text": "印刷時にページに収まるよう調整したい",
          "tags": ["印刷", "ページ", "調整"],
          "difficulty": "初級",
          "popularity": 95
        },
        {
          "id": "ex082",
          "text": "印刷範囲を設定したい",
          "tags": ["印刷範囲", "設定", "指定"],
          "difficulty": "初級",
          "popularity": 94
        },
        {
          "id": "ex083",
          "text": "ヘッダーとフッターに文字を入れたい",
          "tags": ["ヘッダー", "フッター", "文字"],
          "difficulty": "初級",
          "popularity": 93
        },
        {
          "id": "ex084",
          "text": "印刷時に行や列の見出しを毎ページに表示したい",
          "tags": ["見出し", "毎ページ", "印刷"],
          "difficulty": "初級",
          "popularity": 92
        },
        {
          "id": "ex085",
          "text": "改ページの位置を指定したい",
          "tags": ["改ページ", "位置", "指定"],
          "difficulty": "初級",
          "popularity": 91
        },
        {
          "id": "ex086",
          "text": "改ページプレビューで印刷範囲を確認したい",
          "tags": ["改ページ", "プレビュー", "確認"],
          "difficulty": "初級",
          "popularity": 90
        },
        {
          "id": "ex087",
          "text": "印刷の向きを変更したい（縦・横）",
          "tags": ["印刷", "向き", "縦横"],
          "difficulty": "初級",
          "popularity": 89
        },
        {
          "id": "ex088",
          "text": "余白を調整したい",
          "tags": ["余白", "調整", "マージン"],
          "difficulty": "初級",
          "popularity": 88
        },
        {
          "id": "ex089",
          "text": "用紙サイズを変更したい",
          "tags": ["用紙サイズ", "変更", "A4"],
          "difficulty": "初級",
          "popularity": 87
        },
        {
          "id": "ex090",
          "text": "印刷時に枠線（グリッド線）も印刷したい",
          "tags": ["枠線", "グリッド", "印刷"],
          "difficulty": "初級",
          "popularity": 86
        },
        {
          "id": "ex091",
          "text": "セルの幅に合わせて列幅を自動調整したい",
          "tags": ["列幅", "自動調整", "フィット"],
          "difficulty": "初級",
          "popularity": 85
        },
        {
          "id": "ex092",
          "text": "行の高さを自動調整したい",
          "tags": ["行の高さ", "自動調整", "高さ"],
          "difficulty": "初級",
          "popularity": 84
        },
        {
          "id": "ex093",
          "text": "画面の表示倍率を変更したい",
          "tags": ["表示倍率", "ズーム", "変更"],
          "difficulty": "初級",
          "popularity": 83
        },
        {
          "id": "ex094",
          "text": "ウィンドウ枠を固定して見出しを常に表示したい",
          "tags": ["ウィンドウ枠", "固定", "見出し"],
          "difficulty": "初級",
          "popularity": 82
        },
        {
          "id": "ex095",
          "text": "シートを分割して同時に異なる部分を表示したい",
          "tags": ["分割", "同時表示", "シート"],
          "difficulty": "初級",
          "popularity": 81
        },
        {
          "id": "ex096",
          "text": "セルの枠線を非表示にしたい",
          "tags": ["枠線", "非表示", "グリッド"],
          "difficulty": "初級",
          "popularity": 80
        },
        {
          "id": "ex097",
          "text": "列や行を非表示にしたい",
          "tags": ["列", "行", "非表示"],
          "difficulty": "初級",
          "popularity": 79
        },
        {
          "id": "ex098",
          "text": "非表示にした列や行を再表示したい",
          "tags": ["非表示", "再表示", "表示"],
          "difficulty": "初級",
          "popularity": 78
        },
        {
          "id": "ex099",
          "text": "印刷時に色付きセルを白黒で印刷したい",
          "tags": ["印刷", "白黒", "色付き"],
          "difficulty": "初級",
          "popularity": 77
        },
        {
          "id": "ex100",
          "text": "数式を表示させたい",
          "tags": ["数式", "表示", "確認"],
          "difficulty": "初級",
          "popularity": 76
        }
      ]
    },
    "basic_trouble": {
      "name": "基本トラブル解決",
      "icon": "🔧",
      "color": "#f44336",
      "samples": [
        {
          "id": "ex101",
          "text": "「####」が表示されて数値が見えない",
          "tags": ["####", "表示", "数値"],
          "difficulty": "初級",
          "popularity": 95
        },
        {
          "id": "ex102",
          "text": "数式が計算されない・結果が表示されない",
          "tags": ["数式", "計算されない", "結果"],
          "difficulty": "初級",
          "popularity": 94
        },
        {
          "id": "ex103",
          "text": "#VALUE!エラーが表示される",
          "tags": ["VALUE", "エラー", "表示"],
          "difficulty": "初級",
          "popularity": 93
        },
        {
          "id": "ex104",
          "text": "#DIV/0!エラーが表示される",
          "tags": ["DIV/0", "エラー", "ゼロ除算"],
          "difficulty": "初級",
          "popularity": 92
        },
        {
          "id": "ex105",
          "text": "#REF!エラーが表示される",
          "tags": ["REF", "エラー", "参照"],
          "difficulty": "初級",
          "popularity": 91
        },
        {
          "id": "ex106",
          "text": "#NAME?エラーが表示される",
          "tags": ["NAME", "エラー", "名前"],
          "difficulty": "初級",
          "popularity": 90
        },
        {
          "id": "ex107",
          "text": "#N/Aエラーが表示される",
          "tags": ["N/A", "エラー", "該当なし"],
          "difficulty": "初級",
          "popularity": 89
        },
        {
          "id": "ex108",
          "text": "Excelファイルが開けない",
          "tags": ["ファイル", "開けない", "エラー"],
          "difficulty": "初級",
          "popularity": 88
        },
        {
          "id": "ex109",
          "text": "保存できない・保存エラーが出る",
          "tags": ["保存", "エラー", "できない"],
          "difficulty": "初級",
          "popularity": 87
        },
        {
          "id": "ex110",
          "text": "Excelの動作が重い・遅い",
          "tags": ["動作", "重い", "遅い"],
          "difficulty": "初級",
          "popularity": 86
        },
        {
          "id": "ex111",
          "text": "数値が勝手に日付に変換されてしまう",
          "tags": ["数値", "日付", "変換"],
          "difficulty": "初級",
          "popularity": 85
        },
        {
          "id": "ex112",
          "text": "小数点以下が勝手に切り捨てられる",
          "tags": ["小数点", "切り捨て", "勝手に"],
          "difficulty": "初級",
          "popularity": 84
        },
        {
          "id": "ex113",
          "text": "コピー・貼り付けがうまくいかない",
          "tags": ["コピー", "貼り付け", "うまくいかない"],
          "difficulty": "初級",
          "popularity": 83
        },
        {
          "id": "ex114",
          "text": "印刷プレビューと実際の印刷結果が異なる",
          "tags": ["印刷", "プレビュー", "異なる"],
          "difficulty": "初級",
          "popularity": 82
        },
        {
          "id": "ex115",
          "text": "文字化けが発生する",
          "tags": ["文字化け", "発生", "文字"],
          "difficulty": "初級",
          "popularity": 81
        },
        {
          "id": "ex116",
          "text": "Excelが突然終了・強制終了してしまう",
          "tags": ["終了", "強制終了", "突然"],
          "difficulty": "初級",
          "popularity": 80
        },
        {
          "id": "ex117",
          "text": "セルに入力した内容が表示されない",
          "tags": ["入力", "表示されない", "内容"],
          "difficulty": "初級",
          "popularity": 79
        },
        {
          "id": "ex118",
          "text": "関数が英語で表示される",
          "tags": ["関数", "英語", "表示"],
          "difficulty": "初級",
          "popularity": 78
        },
        {
          "id": "ex119",
          "text": "ファイルのサイズが異常に大きくなる",
          "tags": ["ファイルサイズ", "大きい", "異常"],
          "difficulty": "初級",
          "popularity": 77
        },
        {
          "id": "ex120",
          "text": "以前のバージョンのExcelで開けない",
          "tags": ["バージョン", "開けない", "互換性"],
          "difficulty": "初級",
          "popularity": 76
        }
      ]
    },
    "intermediate_functions": {
      "name": "関数の活用",
      "icon": "🔢",
      "color": "#9c27b0",
      "samples": [
        {
          "id": "ex121",
          "text": "VLOOKUP関数で他の表からデータを取得したい",
          "tags": ["VLOOKUP", "取得", "データ"],
          "difficulty": "中級",
          "popularity": 95
        },
        {
          "id": "ex122",
          "text": "VLOOKUP関数でエラーが出る時の対処法は？",
          "tags": ["VLOOKUP", "エラー", "対処"],
          "difficulty": "中級",
          "popularity": 92
        },
        {
          "id": "ex123",
          "text": "IF関数で複数の条件を指定したい",
          "tags": ["IF", "複数条件", "指定"],
          "difficulty": "中級",
          "popularity": 90
        },
        {
          "id": "ex124",
          "text": "COUNTIF関数で条件に合うセルの個数を数えたい",
          "tags": ["COUNTIF", "条件", "個数"],
          "difficulty": "中級",
          "popularity": 88
        },
        {
          "id": "ex125",
          "text": "SUMIF関数で条件に合うセルの合計を計算したい",
          "tags": ["SUMIF", "条件", "合計"],
          "difficulty": "中級",
          "popularity": 86
        },
        {
          "id": "ex126",
          "text": "HLOOKUP関数で横方向に検索したい",
          "tags": ["HLOOKUP", "横方向", "検索"],
          "difficulty": "中級",
          "popularity": 84
        },
        {
          "id": "ex127",
          "text": "INDEX・MATCH関数の組み合わせを使いたい",
          "tags": ["INDEX", "MATCH", "組み合わせ"],
          "difficulty": "中級",
          "popularity": 82
        },
        {
          "id": "ex128",
          "text": "CONCATENATE関数で文字列を結合したい",
          "tags": ["CONCATENATE", "文字列", "結合"],
          "difficulty": "中級",
          "popularity": 80
        },
        {
          "id": "ex129",
          "text": "LEFT・RIGHT・MID関数で文字列の一部を抜き出したい",
          "tags": ["LEFT", "RIGHT", "MID"],
          "difficulty": "中級",
          "popularity": 78
        },
        {
          "id": "ex130",
          "text": "LEN関数で文字数を数えたい",
          "tags": ["LEN", "文字数", "数える"],
          "difficulty": "中級",
          "popularity": 76
        },
        {
          "id": "ex131",
          "text": "UPPER・LOWER・PROPER関数で大文字・小文字を変換したい",
          "tags": ["UPPER", "LOWER", "PROPER"],
          "difficulty": "中級",
          "popularity": 74
        },
        {
          "id": "ex132",
          "text": "TRIM関数で余分なスペースを削除したい",
          "tags": ["TRIM", "スペース", "削除"],
          "difficulty": "中級",
          "popularity": 72
        },
        {
          "id": "ex133",
          "text": "SUBSTITUTE・REPLACE関数で文字を置き換えたい",
          "tags": ["SUBSTITUTE", "REPLACE", "置換"],
          "difficulty": "中級",
          "popularity": 70
        },
        {
          "id": "ex134",
          "text": "YEAR・MONTH・DAY関数で日付から年月日を抜き出したい",
          "tags": ["YEAR", "MONTH", "DAY"],
          "difficulty": "中級",
          "popularity": 68
        },
        {
          "id": "ex135",
          "text": "WEEKDAY関数で曜日を求めたい",
          "tags": ["WEEKDAY", "曜日", "求める"],
          "difficulty": "中級",
          "popularity": 66
        },
        {
          "id": "ex136",
          "text": "DATEDIF関数で期間を計算したい",
          "tags": ["DATEDIF", "期間", "計算"],
          "difficulty": "中級",
          "popularity": 64
        },
        {
          "id": "ex137",
          "text": "RANK関数で順位を求めたい",
          "tags": ["RANK", "順位", "求める"],
          "difficulty": "中級",
          "popularity": 62
        },
        {
          "id": "ex138",
          "text": "IFERROR関数でエラーの時に別の値を表示したい",
          "tags": ["IFERROR", "エラー", "別の値"],
          "difficulty": "中級",
          "popularity": 60
        },
        {
          "id": "ex139",
          "text": "AND・OR関数で複数条件を組み合わせたい",
          "tags": ["AND", "OR", "複数条件"],
          "difficulty": "中級",
          "popularity": 58
        },
        {
          "id": "ex140",
          "text": "ROUND・ROUNDUP・ROUNDDOWN関数で小数点処理をしたい",
          "tags": ["ROUND", "ROUNDUP", "ROUNDDOWN"],
          "difficulty": "中級",
          "popularity": 56
        }
      ]
    },
    "intermediate_analysis": {
      "name": "データ分析・集計",
      "icon": "📈",
      "color": "#607d8b",
      "samples": [
        {
          "id": "ex141",
          "text": "ピボットテーブルを作成したい",
          "tags": ["ピボットテーブル", "作成", "集計"],
          "difficulty": "中級",
          "popularity": 95
        },
        {
          "id": "ex142",
          "text": "ピボットテーブルの行・列・値フィールドを設定したい",
          "tags": ["ピボット", "行", "列"],
          "difficulty": "中級",
          "popularity": 92
        },
        {
          "id": "ex143",
          "text": "ピボットテーブルで合計以外の集計（平均・個数など）をしたい",
          "tags": ["ピボット", "平均", "個数"],
          "difficulty": "中級",
          "popularity": 90
        },
        {
          "id": "ex144",
          "text": "ピボットテーブルをグラフにしたい",
          "tags": ["ピボット", "グラフ", "可視化"],
          "difficulty": "中級",
          "popularity": 88
        },
        {
          "id": "ex145",
          "text": "ピボットテーブルのデータを更新したい",
          "tags": ["ピボット", "更新", "データ"],
          "difficulty": "中級",
          "popularity": 86
        },
        {
          "id": "ex146",
          "text": "条件付き書式で特定の値をハイライトしたい",
          "tags": ["条件付き書式", "ハイライト", "値"],
          "difficulty": "中級",
          "popularity": 84
        },
        {
          "id": "ex147",
          "text": "条件付き書式でデータバーを表示したい",
          "tags": ["条件付き書式", "データバー", "表示"],
          "difficulty": "中級",
          "popularity": 82
        },
        {
          "id": "ex148",
          "text": "条件付き書式でカラースケールを適用したい",
          "tags": ["条件付き書式", "カラースケール", "適用"],
          "difficulty": "中級",
          "popularity": 80
        },
        {
          "id": "ex149",
          "text": "SUMIFS関数で複数条件の合計を計算したい",
          "tags": ["SUMIFS", "複数条件", "合計"],
          "difficulty": "中級",
          "popularity": 78
        },
        {
          "id": "ex150",
          "text": "COUNTIFS関数で複数条件の個数を数えたい",
          "tags": ["COUNTIFS", "複数条件", "個数"],
          "difficulty": "中級",
          "popularity": 76
        },
        {
          "id": "ex151",
          "text": "AVERAGEIFS関数で複数条件の平均を計算したい",
          "tags": ["AVERAGEIFS", "複数条件", "平均"],
          "difficulty": "中級",
          "popularity": 74
        },
        {
          "id": "ex152",
          "text": "小計機能でグループ別の集計をしたい",
          "tags": ["小計", "グループ", "集計"],
          "difficulty": "中級",
          "popularity": 72
        },
        {
          "id": "ex153",
          "text": "統合機能で複数のシートのデータをまとめたい",
          "tags": ["統合", "複数シート", "まとめる"],
          "difficulty": "中級",
          "popularity": 70
        },
        {
          "id": "ex154",
          "text": "アウトライン機能でデータをグループ化したい",
          "tags": ["アウトライン", "グループ化", "階層"],
          "difficulty": "中級",
          "popularity": 68
        },
        {
          "id": "ex155",
          "text": "スライサーでピボットテーブルを操作したい",
          "tags": ["スライサー", "ピボット", "操作"],
          "difficulty": "中級",
          "popularity": 66
        },
        {
          "id": "ex156",
          "text": "タイムライン機能で日付データを分析したい",
          "tags": ["タイムライン", "日付", "分析"],
          "difficulty": "中級",
          "popularity": 64
        },
        {
          "id": "ex157",
          "text": "What-If分析でシナリオを比較したい",
          "tags": ["What-If", "シナリオ", "比較"],
          "difficulty": "中級",
          "popularity": 62
        },
        {
          "id": "ex158",
          "text": "ゴールシークで目標値から逆算したい",
          "tags": ["ゴールシーク", "目標値", "逆算"],
          "difficulty": "中級",
          "popularity": 60
        },
        {
          "id": "ex159",
          "text": "ソルバーで最適化問題を解きたい",
          "tags": ["ソルバー", "最適化", "問題"],
          "difficulty": "中級",
          "popularity": 58
        },
        {
          "id": "ex160",
          "text": "データテーブルで複数の結果を一度に計算したい",
          "tags": ["データテーブル", "複数結果", "計算"],
          "difficulty": "中級",
          "popularity": 56
        }
      ]
    },
    "charts": {
      "name": "グラフ・可視化",
      "icon": "📊",
      "color": "#ff5722",
      "samples": [
        {
          "id": "ex161",
          "text": "棒グラフを作成したい",
          "tags": ["棒グラフ", "作成", "基本"],
          "difficulty": "中級",
          "popularity": 95
        },
        {
          "id": "ex162",
          "text": "折れ線グラフを作成したい",
          "tags": ["折れ線", "グラフ", "作成"],
          "difficulty": "中級",
          "popularity": 92
        },
        {
          "id": "ex163",
          "text": "円グラフを作成したい",
          "tags": ["円グラフ", "作成", "割合"],
          "difficulty": "中級",
          "popularity": 90
        },
        {
          "id": "ex164",
          "text": "複合グラフで異なる種類のグラフを組み合わせたい",
          "tags": ["複合グラフ", "組み合わせ", "異なる"],
          "difficulty": "中級",
          "popularity": 88
        },
        {
          "id": "ex165",
          "text": "グラフのタイトルや軸ラベルを設定したい",
          "tags": ["グラフ", "タイトル", "ラベル"],
          "difficulty": "中級",
          "popularity": 86
        },
        {
          "id": "ex166",
          "text": "グラフの色やデザインを変更したい",
          "tags": ["グラフ", "色", "デザイン"],
          "difficulty": "中級",
          "popularity": 84
        },
        {
          "id": "ex167",
          "text": "グラフに第2軸を追加したい",
          "tags": ["グラフ", "第2軸", "追加"],
          "difficulty": "中級",
          "popularity": 82
        },
        {
          "id": "ex168",
          "text": "散布図を作成したい",
          "tags": ["散布図", "作成", "相関"],
          "difficulty": "中級",
          "popularity": 80
        },
        {
          "id": "ex169",
          "text": "ヒストグラムを作成したい",
          "tags": ["ヒストグラム", "作成", "分布"],
          "difficulty": "中級",
          "popularity": 78
        },
        {
          "id": "ex170",
          "text": "グラフに近似曲線（トレンドライン）を追加したい",
          "tags": ["近似曲線", "トレンドライン", "追加"],
          "difficulty": "中級",
          "popularity": 76
        },
        {
          "id": "ex171",
          "text": "グラフのデータ範囲を変更したい",
          "tags": ["グラフ", "データ範囲", "変更"],
          "difficulty": "中級",
          "popularity": 74
        },
        {
          "id": "ex172",
          "text": "グラフを画像として保存したい",
          "tags": ["グラフ", "画像", "保存"],
          "difficulty": "中級",
          "popularity": 72
        },
        {
          "id": "ex173",
          "text": "動的なグラフ（データが追加されると自動更新）を作りたい",
          "tags": ["動的", "グラフ", "自動更新"],
          "difficulty": "中級",
          "popularity": 70
        },
        {
          "id": "ex174",
          "text": "スパークラインで小さなグラフを作成したい",
          "tags": ["スパークライン", "小さなグラフ", "作成"],
          "difficulty": "中級",
          "popularity": 68
        },
        {
          "id": "ex175",
          "text": "ウォーターフォール図を作成したい",
          "tags": ["ウォーターフォール", "図", "作成"],
          "difficulty": "中級",
          "popularity": 66
        },
        {
          "id": "ex176",
          "text": "箱ひげ図を作成したい",
          "tags": ["箱ひげ図", "作成", "統計"],
          "difficulty": "中級",
          "popularity": 64
        },
        {
          "id": "ex177",
          "text": "レーダーチャートを作成したい",
          "tags": ["レーダーチャート", "作成", "多角形"],
          "difficulty": "中級",
          "popularity": 62
        },
        {
          "id": "ex178",
          "text": "ガントチャートを作成したい",
          "tags": ["ガントチャート", "作成", "スケジュール"],
          "difficulty": "中級",
          "popularity": 60
        },
        {
          "id": "ex179",
          "text": "マップチャート（地図グラフ）を作成したい",
          "tags": ["マップ", "地図", "グラフ"],
          "difficulty": "中級",
          "popularity": 58
        },
        {
          "id": "ex180",
          "text": "3Dグラフを作成したい",
          "tags": ["3D", "グラフ", "立体"],
          "difficulty": "中級",
          "popularity": 56
        }
      ]
    },
    "excel365": {
      "name": "Excel 365新機能",
      "icon": "✨",
      "color": "#795548",
      "samples": [
        {
          "id": "ex181",
          "text": "XLOOKUP関数を使いたい",
          "tags": ["XLOOKUP", "新機能", "検索"],
          "difficulty": "中級",
          "popularity": 90
        },
        {
          "id": "ex182",
          "text": "FILTER関数でデータを絞り込みたい",
          "tags": ["FILTER", "絞り込み", "新機能"],
          "difficulty": "中級",
          "popularity": 88
        },
        {
          "id": "ex183",
          "text": "SORT関数でデータを並び替えたい",
          "tags": ["SORT", "並び替え", "新機能"],
          "difficulty": "中級",
          "popularity": 86
        },
        {
          "id": "ex184",
          "text": "UNIQUE関数で重複を除去したい",
          "tags": ["UNIQUE", "重複除去", "新機能"],
          "difficulty": "中級",
          "popularity": 84
        },
        {
          "id": "ex185",
          "text": "SEQUENCE関数で連続データを生成したい",
          "tags": ["SEQUENCE", "連続", "生成"],
          "difficulty": "中級",
          "popularity": 82
        },
        {
          "id": "ex186",
          "text": "RANDARRAY関数でランダムな配列を作成したい",
          "tags": ["RANDARRAY", "ランダム", "配列"],
          "difficulty": "中級",
          "popularity": 80
        },
        {
          "id": "ex187",
          "text": "動的配列数式を使いたい",
          "tags": ["動的配列", "数式", "スピル"],
          "difficulty": "中級",
          "popularity": 78
        },
        {
          "id": "ex188",
          "text": "LET関数で数式を読みやすくしたい",
          "tags": ["LET", "読みやすく", "変数"],
          "difficulty": "中級",
          "popularity": 76
        },
        {
          "id": "ex189",
          "text": "株価データ型を使いたい",
          "tags": ["株価", "データ型", "リアルタイム"],
          "difficulty": "中級",
          "popularity": 74
        },
        {
          "id": "ex190",
          "text": "地理データ型を使いたい",
          "tags": ["地理", "データ型", "地図"],
          "difficulty": "中級",
          "popularity": 72
        }
      ]
    },
    "advanced_powerquery": {
      "name": "Power Query・上級機能",
      "icon": "🚀",
      "color": "#1f4e79",
      "samples": [
        {
          "id": "ex191",
          "text": "Power Queryで複数のファイルからデータを取得したい",
          "tags": ["Power Query", "複数ファイル", "取得"],
          "difficulty": "上級",
          "popularity": 85
        },
        {
          "id": "ex192",
          "text": "Power Queryでデータクレンジングを自動化したい",
          "tags": ["Power Query", "クレンジング", "自動化"],
          "difficulty": "上級",
          "popularity": 82
        },
        {
          "id": "ex193",
          "text": "Power QueryでWebからデータを取得したい",
          "tags": ["Power Query", "Web", "データ取得"],
          "difficulty": "上級",
          "popularity": 80
        },
        {
          "id": "ex194",
          "text": "VBAマクロを作成して作業を自動化したい",
          "tags": ["VBA", "マクロ", "自動化"],
          "difficulty": "上級",
          "popularity": 88
        },
        {
          "id": "ex195",
          "text": "マクロを記録して繰り返し作業を効率化したい",
          "tags": ["マクロ", "記録", "効率化"],
          "difficulty": "上級",
          "popularity": 86
        },
        {
          "id": "ex196",
          "text": "ユーザー定義関数を作成したい",
          "tags": ["ユーザー定義", "関数", "作成"],
          "difficulty": "上級",
          "popularity": 78
        },
        {
          "id": "ex197",
          "text": "配列数式を使って複雑な計算をしたい",
          "tags": ["配列数式", "複雑", "計算"],
          "difficulty": "上級",
          "popularity": 76
        },
        {
          "id": "ex198",
          "text": "名前の定義を活用して数式を分かりやすくしたい",
          "tags": ["名前の定義", "分かりやすく", "数式"],
          "difficulty": "上級",
          "popularity": 74
        },
        {
          "id": "ex199",
          "text": "テーブル機能を活用してデータ管理を効率化したい",
          "tags": ["テーブル", "データ管理", "効率化"],
          "difficulty": "上級",
          "popularity": 72
        },
        {
          "id": "ex200",
          "text": "Power BIとExcelを連携させたい",
          "tags": ["Power BI", "連携", "Excel"],
          "difficulty": "上級",
          "popularity": 70
        }
      ]
    }
  },
  "powerpoint": {
    "basic_operation": {
      "name": "基本操作・スライド作成",
      "icon": "📝",
      "color": "#d24726",
      "samples": [
        {
          "id": "pp001",
          "text": "新しいプレゼンテーションを作成したい",
          "tags": ["新規作成", "プレゼンテーション", "スライド"],
          "difficulty": "初級",
          "popularity": 99
        },
        {
          "id": "pp002",
          "text": "新しいスライドを追加したい",
          "tags": ["スライド", "追加", "新規"],
          "difficulty": "初級",
          "popularity": 98
        },
        {
          "id": "pp003",
          "text": "スライドにタイトルを入力したい",
          "tags": ["タイトル", "入力", "スライド"],
          "difficulty": "初級",
          "popularity": 97
        },
        {
          "id": "pp004",
          "text": "スライドに本文テキストを入力したい",
          "tags": ["本文", "テキスト", "入力"],
          "difficulty": "初級",
          "popularity": 96
        },
        {
          "id": "pp005",
          "text": "文字の大きさを変更したい",
          "tags": ["文字サイズ", "変更", "フォント"],
          "difficulty": "初級",
          "popularity": 95
        },
        {
          "id": "pp006",
          "text": "文字の色を変更したい",
          "tags": ["文字色", "変更", "色"],
          "difficulty": "初級",
          "popularity": 94
        },
        {
          "id": "pp007",
          "text": "文字を太字にしたい",
          "tags": ["太字", "ボールド", "強調"],
          "difficulty": "初級",
          "popularity": 93
        },
        {
          "id": "pp008",
          "text": "箇条書きを作成したい",
          "tags": ["箇条書き", "リスト", "作成"],
          "difficulty": "初級",
          "popularity": 92
        },
        {
          "id": "pp009",
          "text": "番号付きリストを作成したい",
          "tags": ["番号", "リスト", "順序"],
          "difficulty": "初級",
          "popularity": 91
        },
        {
          "id": "pp010",
          "text": "スライドの順番を変更したい",
          "tags": ["順番", "変更", "並び替え"],
          "difficulty": "初級",
          "popularity": 90
        },
        {
          "id": "pp011",
          "text": "スライドを削除したい",
          "tags": ["削除", "スライド", "除去"],
          "difficulty": "初級",
          "popularity": 89
        },
        {
          "id": "pp012",
          "text": "スライドをコピーしたい",
          "tags": ["コピー", "複製", "スライド"],
          "difficulty": "初級",
          "popularity": 88
        },
        {
          "id": "pp013",
          "text": "テキストボックスを挿入したい",
          "tags": ["テキストボックス", "挿入", "文字"],
          "difficulty": "初級",
          "popularity": 87
        },
        {
          "id": "pp014",
          "text": "スライドのレイアウトを変更したい",
          "tags": ["レイアウト", "変更", "デザイン"],
          "difficulty": "初級",
          "popularity": 86
        },
        {
          "id": "pp015",
          "text": "フォント（文字の種類）を変更したい",
          "tags": ["フォント", "文字種類", "変更"],
          "difficulty": "初級",
          "popularity": 85
        },
        {
          "id": "pp016",
          "text": "文字を中央揃えにしたい",
          "tags": ["中央揃え", "配置", "文字"],
          "difficulty": "初級",
          "popularity": 84
        },
        {
          "id": "pp017",
          "text": "行間を調整したい",
          "tags": ["行間", "調整", "間隔"],
          "difficulty": "初級",
          "popularity": 83
        },
        {
          "id": "pp018",
          "text": "間違って削除したものを元に戻したい",
          "tags": ["元に戻す", "復元", "取り消し"],
          "difficulty": "初級",
          "popularity": 82
        },
        {
          "id": "pp019",
          "text": "スライドに画像を挿入したい",
          "tags": ["画像", "挿入", "写真"],
          "difficulty": "初級",
          "popularity": 81
        },
        {
          "id": "pp020",
          "text": "プレゼンテーションを保存したい",
          "tags": ["保存", "ファイル", "セーブ"],
          "difficulty": "初級",
          "popularity": 80
        },
        {
          "id": "pp021",
          "text": "間違った文字を修正したい",
          "tags": ["修正", "編集", "文字"],
          "difficulty": "初級",
          "popularity": 79
        },
        {
          "id": "pp022",
          "text": "スライドショーを開始したい",
          "tags": ["スライドショー", "開始", "プレゼン"],
          "difficulty": "初級",
          "popularity": 78
        },
        {
          "id": "pp023",
          "text": "次のスライドに進む方法は？",
          "tags": ["次", "進む", "操作"],
          "difficulty": "初級",
          "popularity": 77
        },
        {
          "id": "pp024",
          "text": "前のスライドに戻る方法は？",
          "tags": ["前", "戻る", "操作"],
          "difficulty": "初級",
          "popularity": 76
        },
        {
          "id": "pp025",
          "text": "スライドショーを終了したい",
          "tags": ["終了", "スライドショー", "停止"],
          "difficulty": "初級",
          "popularity": 75
        },
        {
          "id": "pp026",
          "text": "文字に下線を引きたい",
          "tags": ["下線", "アンダーライン", "装飾"],
          "difficulty": "初級",
          "popularity": 74
        },
        {
          "id": "pp027",
          "text": "文字を斜体にしたい",
          "tags": ["斜体", "イタリック", "傾ける"],
          "difficulty": "初級",
          "popularity": 73
        },
        {
          "id": "pp028",
          "text": "文字の背景色を変更したい",
          "tags": ["背景色", "ハイライト", "マーカー"],
          "difficulty": "初級",
          "popularity": 72
        },
        {
          "id": "pp029",
          "text": "スライドのテーマを変更したい",
          "tags": ["テーマ", "変更", "デザイン"],
          "difficulty": "初級",
          "popularity": 71
        },
        {
          "id": "pp030",
          "text": "スライドの背景色を変更したい",
          "tags": ["背景色", "スライド", "色"],
          "difficulty": "初級",
          "popularity": 70
        },
        {
          "id": "pp031",
          "text": "新しいテキストボックスのサイズを調整したい",
          "tags": ["サイズ", "調整", "テキストボックス"],
          "difficulty": "初級",
          "popularity": 69
        },
        {
          "id": "pp032",
          "text": "オブジェクトを移動させたい",
          "tags": ["移動", "オブジェクト", "位置"],
          "difficulty": "初級",
          "popularity": 68
        },
        {
          "id": "pp033",
          "text": "複数のオブジェクトを選択したい",
          "tags": ["複数選択", "オブジェクト", "まとめて"],
          "difficulty": "初級",
          "popularity": 67
        },
        {
          "id": "pp034",
          "text": "オブジェクトを削除したい",
          "tags": ["削除", "オブジェクト", "除去"],
          "difficulty": "初級",
          "popularity": 66
        },
        {
          "id": "pp035",
          "text": "文字の縁取りをしたい",
          "tags": ["縁取り", "枠線", "文字"],
          "difficulty": "初級",
          "popularity": 65
        },
        {
          "id": "pp036",
          "text": "スライドの中にタイトルと内容の位置を変更したい",
          "tags": ["位置", "変更", "レイアウト"],
          "difficulty": "初級",
          "popularity": 64
        },
        {
          "id": "pp037",
          "text": "文字を左揃え・右揃えにしたい",
          "tags": ["左揃え", "右揃え", "配置"],
          "difficulty": "初級",
          "popularity": 63
        },
        {
          "id": "pp038",
          "text": "箇条書きの記号を変更したい",
          "tags": ["箇条書き", "記号", "変更"],
          "difficulty": "初級",
          "popularity": 62
        },
        {
          "id": "pp039",
          "text": "プレゼンテーションを印刷したい",
          "tags": ["印刷", "プリント", "出力"],
          "difficulty": "初級",
          "popularity": 61
        },
        {
          "id": "pp040",
          "text": "PowerPointの基本的な使い方を覚えたい",
          "tags": ["基本", "使い方", "操作"],
          "difficulty": "初級",
          "popularity": 60
        }
      ]
    },
    "basic_media": {
      "name": "画像・図・表の基本",
      "icon": "🖼️",
      "color": "#ff6d01",
      "samples": [
        {
          "id": "pp041",
          "text": "画像のサイズを変更したい",
          "tags": ["画像", "サイズ", "変更"],
          "difficulty": "初級",
          "popularity": 95
        },
        {
          "id": "pp042",
          "text": "図形（四角形、円など）を描きたい",
          "tags": ["図形", "描画", "四角形"],
          "difficulty": "初級",
          "popularity": 93
        },
        {
          "id": "pp043",
          "text": "図形の色を変更したい",
          "tags": ["図形", "色", "変更"],
          "difficulty": "初級",
          "popularity": 91
        },
        {
          "id": "pp044",
          "text": "線（矢印）を描きたい",
          "tags": ["線", "矢印", "描画"],
          "difficulty": "初級",
          "popularity": 89
        },
        {
          "id": "pp045",
          "text": "表を挿入したい",
          "tags": ["表", "挿入", "テーブル"],
          "difficulty": "初級",
          "popularity": 87
        },
        {
          "id": "pp046",
          "text": "表に文字を入力したい",
          "tags": ["表", "文字", "入力"],
          "difficulty": "初級",
          "popularity": 85
        },
        {
          "id": "pp047",
          "text": "表の行・列を追加したい",
          "tags": ["表", "行", "列"],
          "difficulty": "初級",
          "popularity": 83
        },
        {
          "id": "pp048",
          "text": "アイコンを挿入したい",
          "tags": ["アイコン", "挿入", "シンボル"],
          "difficulty": "初級",
          "popularity": 81
        },
        {
          "id": "pp049",
          "text": "オンライン画像を検索して挿入したい",
          "tags": ["オンライン", "画像", "検索"],
          "difficulty": "初級",
          "popularity": 79
        },
        {
          "id": "pp050",
          "text": "SmartArt（図解）を挿入したい",
          "tags": ["SmartArt", "図解", "挿入"],
          "difficulty": "初級",
          "popularity": 77
        },
        {
          "id": "pp051",
          "text": "グラフを挿入したい",
          "tags": ["グラフ", "挿入", "チャート"],
          "difficulty": "初級",
          "popularity": 75
        },
        {
          "id": "pp052",
          "text": "画像を回転させたい",
          "tags": ["画像", "回転", "向き"],
          "difficulty": "初級",
          "popularity": 73
        },
        {
          "id": "pp053",
          "text": "画像をトリミング（切り抜き）したい",
          "tags": ["画像", "トリミング", "切り抜き"],
          "difficulty": "初級",
          "popularity": 71
        },
        {
          "id": "pp054",
          "text": "図形に文字を入れたい",
          "tags": ["図形", "文字", "テキスト"],
          "difficulty": "初級",
          "popularity": 69
        },
        {
          "id": "pp055",
          "text": "画像の明度・コントラストを調整したい",
          "tags": ["画像", "明度", "コントラスト"],
          "difficulty": "初級",
          "popularity": 67
        },
        {
          "id": "pp056",
          "text": "複数のオブジェクトを整列させたい",
          "tags": ["整列", "オブジェクト", "配置"],
          "difficulty": "初級",
          "popularity": 65
        },
        {
          "id": "pp057",
          "text": "オブジェクトを重ね順で前後に移動したい",
          "tags": ["重ね順", "前後", "移動"],
          "difficulty": "初級",
          "popularity": 63
        },
        {
          "id": "pp058",
          "text": "図形の枠線を変更したい",
          "tags": ["枠線", "図形", "変更"],
          "difficulty": "初級",
          "popularity": 61
        },
        {
          "id": "pp059",
          "text": "スクリーンショットを挿入したい",
          "tags": ["スクリーンショット", "挿入", "画面"],
          "difficulty": "初級",
          "popularity": 59
        },
        {
          "id": "pp060",
          "text": "画像の背景を削除したい",
          "tags": ["画像", "背景", "削除"],
          "difficulty": "初級",
          "popularity": 57
        },
        {
          "id": "pp061",
          "text": "ワードアート（装飾文字）を作成したい",
          "tags": ["ワードアート", "装飾", "文字"],
          "difficulty": "初級",
          "popularity": 55
        },
        {
          "id": "pp062",
          "text": "図形をグループ化したい",
          "tags": ["グループ化", "図形", "まとめる"],
          "difficulty": "初級",
          "popularity": 53
        },
        {
          "id": "pp063",
          "text": "表のセルを結合したい",
          "tags": ["表", "セル", "結合"],
          "difficulty": "初級",
          "popularity": 51
        },
        {
          "id": "pp064",
          "text": "3Dモデルを挿入したい",
          "tags": ["3D", "モデル", "挿入"],
          "difficulty": "初級",
          "popularity": 49
        },
        {
          "id": "pp065",
          "text": "数式を挿入したい",
          "tags": ["数式", "挿入", "数学"],
          "difficulty": "初級",
          "popularity": 47
        }
      ]
    },
    "presentation": {
      "name": "プレゼンテーション実行",
      "icon": "🎯",
      "color": "#34a853",
      "samples": [
        {
          "id": "pp066",
          "text": "発表者ビューを使いたい",
          "tags": ["発表者ビュー", "プレゼン", "発表"],
          "difficulty": "初級",
          "popularity": 94
        },
        {
          "id": "pp067",
          "text": "スライドショー中にペンで書き込みたい",
          "tags": ["ペン", "書き込み", "スライドショー"],
          "difficulty": "初級",
          "popularity": 92
        },
        {
          "id": "pp068",
          "text": "特定のスライドから開始したい",
          "tags": ["特定", "スライド", "開始"],
          "difficulty": "初級",
          "popularity": 90
        },
        {
          "id": "pp069",
          "text": "スライドショー中に画面を一時的に黒くしたい",
          "tags": ["画面", "黒", "一時停止"],
          "difficulty": "初級",
          "popularity": 88
        },
        {
          "id": "pp070",
          "text": "発表者ノートを表示・編集したい",
          "tags": ["発表者ノート", "表示", "編集"],
          "difficulty": "初級",
          "popularity": 86
        },
        {
          "id": "pp071",
          "text": "スライドの切り替え効果を設定したい",
          "tags": ["切り替え", "効果", "トランジション"],
          "difficulty": "初級",
          "popularity": 84
        },
        {
          "id": "pp072",
          "text": "自動で次のスライドに進むよう設定したい",
          "tags": ["自動", "進む", "設定"],
          "difficulty": "初級",
          "popularity": 82
        },
        {
          "id": "pp073",
          "text": "音楽や音声を再生したい",
          "tags": ["音楽", "音声", "再生"],
          "difficulty": "初級",
          "popularity": 80
        },
        {
          "id": "pp074",
          "text": "動画を挿入・再生したい",
          "tags": ["動画", "挿入", "再生"],
          "difficulty": "初級",
          "popularity": 78
        },
        {
          "id": "pp075",
          "text": "プレゼンテーション全体をループ再生したい",
          "tags": ["ループ", "再生", "繰り返し"],
          "difficulty": "初級",
          "popularity": 76
        },
        {
          "id": "pp076",
          "text": "リハーサル機能で発表時間を計測したい",
          "tags": ["リハーサル", "時間", "計測"],
          "difficulty": "初級",
          "popularity": 74
        },
        {
          "id": "pp077",
          "text": "レーザーポインター機能を使いたい",
          "tags": ["レーザーポインター", "機能", "指示"],
          "difficulty": "初級",
          "popularity": 72
        },
        {
          "id": "pp078",
          "text": "キーボードショートカットを覚えたい",
          "tags": ["ショートカット", "キーボード", "操作"],
          "difficulty": "初級",
          "popularity": 70
        },
        {
          "id": "pp079",
          "text": "アニメーション効果を設定したい",
          "tags": ["アニメーション", "効果", "動き"],
          "difficulty": "初級",
          "popularity": 68
        },
        {
          "id": "pp080",
          "text": "ハイパーリンクで他のスライドや Webページにジャンプしたい",
          "tags": ["ハイパーリンク", "ジャンプ", "リンク"],
          "difficulty": "初級",
          "popularity": 66
        },
        {
          "id": "pp081",
          "text": "スライドサムネイル表示で全体を確認したい",
          "tags": ["サムネイル", "表示", "全体"],
          "difficulty": "初級",
          "popularity": 64
        },
        {
          "id": "pp082",
          "text": "配布資料として印刷したい",
          "tags": ["配布資料", "印刷", "ハンドアウト"],
          "difficulty": "初級",
          "popularity": 62
        },
        {
          "id": "pp083",
          "text": "発表者ノートも一緒に印刷したい",
          "tags": ["発表者ノート", "印刷", "メモ"],
          "difficulty": "初級",
          "popularity": 60
        },
        {
          "id": "pp084",
          "text": "プレゼン中にズーム機能を使いたい",
          "tags": ["ズーム", "拡大", "プレゼン"],
          "difficulty": "初級",
          "popularity": 58
        },
        {
          "id": "pp085",
          "text": "QRコードを挿入したい",
          "tags": ["QR", "コード", "挿入"],
          "difficulty": "初級",
          "popularity": 56
        },
        {
          "id": "pp086",
          "text": "プレゼン中に別のアプリを開いて戻りたい",
          "tags": ["別アプリ", "戻る", "切り替え"],
          "difficulty": "初級",
          "popularity": 54
        },
        {
          "id": "pp087",
          "text": "フルスクリーンモードを解除したい",
          "tags": ["フルスクリーン", "解除", "モード"],
          "difficulty": "初級",
          "popularity": 52
        },
        {
          "id": "pp088",
          "text": "プレゼン中にメモを取りたい",
          "tags": ["メモ", "プレゼン中", "記録"],
          "difficulty": "初級",
          "popularity": 50
        },
        {
          "id": "pp089",
          "text": "複数のモニターで発表したい",
          "tags": ["複数", "モニター", "発表"],
          "difficulty": "初級",
          "popularity": 48
        },
        {
          "id": "pp090",
          "text": "緊急時のプレゼン中断・再開方法は？",
          "tags": ["緊急", "中断", "再開"],
          "difficulty": "初級",
          "popularity": 46
        }
      ]
    },
    "save_share": {
      "name": "保存・共有",
      "icon": "💾",
      "color": "#4b8bbf",
      "samples": [
        {
          "id": "pp091",
          "text": "PDFファイルとして保存したい",
          "tags": ["PDF", "保存", "変換"],
          "difficulty": "初級",
          "popularity": 96
        },
        {
          "id": "pp092",
          "text": "他の人とプレゼンテーションを共有したい",
          "tags": ["共有", "シェア", "他人"],
          "difficulty": "初級",
          "popularity": 94
        },
        {
          "id": "pp093",
          "text": "クラウドに保存したい（OneDrive）",
          "tags": ["クラウド", "OneDrive", "保存"],
          "difficulty": "初級",
          "popularity": 92
        },
        {
          "id": "pp094",
          "text": "メールでプレゼンテーションを送信したい",
          "tags": ["メール", "送信", "添付"],
          "difficulty": "初級",
          "popularity": 90
        },
        {
          "id": "pp095",
          "text": "別の形式（動画など）で保存したい",
          "tags": ["別形式", "動画", "エクスポート"],
          "difficulty": "初級",
          "popularity": 88
        },
        {
          "id": "pp096",
          "text": "テンプレートとして保存したい",
          "tags": ["テンプレート", "保存", "雛形"],
          "difficulty": "初級",
          "popularity": 86
        },
        {
          "id": "pp097",
          "text": "自動保存を設定したい",
          "tags": ["自動保存", "設定", "バックアップ"],
          "difficulty": "初級",
          "popularity": 84
        },
        {
          "id": "pp098",
          "text": "古いバージョンのPowerPointで開けるよう保存したい",
          "tags": ["古いバージョン", "互換性", "保存"],
          "difficulty": "初級",
          "popularity": 82
        },
        {
          "id": "pp099",
          "text": "パスワード保護をかけたい",
          "tags": ["パスワード", "保護", "セキュリティ"],
          "difficulty": "初級",
          "popularity": 80
        },
        {
          "id": "pp100",
          "text": "ファイルサイズを小さくしたい",
          "tags": ["ファイルサイズ", "小さく", "圧縮"],
          "difficulty": "初級",
          "popularity": 78
        }
      ]
    },
    "design_layout": {
      "name": "デザイン・レイアウト",
      "icon": "🎨",
      "color": "#9c27b0",
      "samples": [
        {
          "id": "pp101",
          "text": "スライドマスターを編集してデザインを統一したい",
          "tags": ["スライドマスター", "編集", "統一"],
          "difficulty": "中級",
          "popularity": 95
        },
        {
          "id": "pp102",
          "text": "独自のテンプレートを作成したい",
          "tags": ["独自", "テンプレート", "作成"],
          "difficulty": "中級",
          "popularity": 92
        },
        {
          "id": "pp103",
          "text": "会社のロゴをすべてのスライドに入れたい",
          "tags": ["ロゴ", "すべて", "会社"],
          "difficulty": "中級",
          "popularity": 90
        },
        {
          "id": "pp104",
          "text": "フォントを統一したい",
          "tags": ["フォント", "統一", "デザイン"],
          "difficulty": "中級",
          "popularity": 88
        },
        {
          "id": "pp105",
          "text": "色のトーンを統一したい",
          "tags": ["色", "トーン", "統一"],
          "difficulty": "中級",
          "popularity": 86
        },
        {
          "id": "pp106",
          "text": "レイアウトガイドを使って整った配置にしたい",
          "tags": ["レイアウト", "ガイド", "整列"],
          "difficulty": "中級",
          "popularity": 84
        },
        {
          "id": "pp107",
          "text": "グリッド線を表示して正確に配置したい",
          "tags": ["グリッド", "正確", "配置"],
          "difficulty": "中級",
          "popularity": 82
        },
        {
          "id": "pp108",
          "text": "複数のオブジェクトを等間隔で配置したい",
          "tags": ["等間隔", "配置", "複数"],
          "difficulty": "中級",
          "popularity": 80
        },
        {
          "id": "pp109",
          "text": "スライドの背景に画像やパターンを設定したい",
          "tags": ["背景", "画像", "パターン"],
          "difficulty": "中級",
          "popularity": 78
        },
        {
          "id": "pp110",
          "text": "デザイナー機能を使ってプロ風のデザインにしたい",
          "tags": ["デザイナー", "プロ", "機能"],
          "difficulty": "中級",
          "popularity": 76
        },
        {
          "id": "pp111",
          "text": "アイデア機能で自動デザイン提案を受けたい",
          "tags": ["アイデア", "自動", "提案"],
          "difficulty": "中級",
          "popularity": 74
        },
        {
          "id": "pp112",
          "text": "カラーパレットを独自に設定したい",
          "tags": ["カラーパレット", "独自", "設定"],
          "difficulty": "中級",
          "popularity": 72
        },
        {
          "id": "pp113",
          "text": "セクション機能でスライドをグループ分けしたい",
          "tags": ["セクション", "グループ", "分け"],
          "difficulty": "中級",
          "popularity": 70
        },
        {
          "id": "pp114",
          "text": "ヘッダー・フッターを設定したい",
          "tags": ["ヘッダー", "フッター", "設定"],
          "difficulty": "中級",
          "popularity": 68
        },
        {
          "id": "pp115",
          "text": "スライド番号を自動で挿入したい",
          "tags": ["スライド番号", "自動", "挿入"],
          "difficulty": "中級",
          "popularity": 66
        },
        {
          "id": "pp116",
          "text": "日付と時刻を自動更新で表示したい",
          "tags": ["日付", "時刻", "自動更新"],
          "difficulty": "中級",
          "popularity": 64
        },
        {
          "id": "pp117",
          "text": "複数のレイアウトを一つのプレゼンテーションで使い分けたい",
          "tags": ["複数", "レイアウト", "使い分け"],
          "difficulty": "中級",
          "popularity": 62
        },
        {
          "id": "pp118",
          "text": "図形の詳細な書式設定をしたい",
          "tags": ["図形", "詳細", "書式"],
          "difficulty": "中級",
          "popularity": 60
        },
        {
          "id": "pp119",
          "text": "グラデーション効果を適用したい",
          "tags": ["グラデーション", "効果", "適用"],
          "difficulty": "中級",
          "popularity": 58
        },
        {
          "id": "pp120",
          "text": "影やぼかし効果を追加したい",
          "tags": ["影", "ぼかし", "効果"],
          "difficulty": "中級",
          "popularity": 56
        },
        {
          "id": "pp121",
          "text": "3D効果で立体的に見せたい",
          "tags": ["3D", "立体", "効果"],
          "difficulty": "中級",
          "popularity": 54
        },
        {
          "id": "pp122",
          "text": "透明度を調整して重ね合わせたい",
          "tags": ["透明度", "重ね", "調整"],
          "difficulty": "中級",
          "popularity": 52
        },
        {
          "id": "pp123",
          "text": "カスタムレイアウトを作成したい",
          "tags": ["カスタム", "レイアウト", "作成"],
          "difficulty": "中級",
          "popularity": 50
        },
        {
          "id": "pp124",
          "text": "アクセシビリティを考慮したデザインにしたい",
          "tags": ["アクセシビリティ", "デザイン", "考慮"],
          "difficulty": "中級",
          "popularity": 48
        },
        {
          "id": "pp125",
          "text": "インフォグラフィック風のデザインを作りたい",
          "tags": ["インフォグラフィック", "デザイン", "作成"],
          "difficulty": "中級",
          "popularity": 46
        },
        {
          "id": "pp126",
          "text": "ブランドガイドラインに沿ったデザインにしたい",
          "tags": ["ブランド", "ガイドライン", "デザイン"],
          "difficulty": "中級",
          "popularity": 44
        },
        {
          "id": "pp127",
          "text": "配色理論を活用した効果的な色使いをしたい",
          "tags": ["配色", "理論", "効果的"],
          "difficulty": "中級",
          "popularity": 42
        },
        {
          "id": "pp128",
          "text": "タイポグラフィにこだわった文字デザインにしたい",
          "tags": ["タイポグラフィ", "文字", "デザイン"],
          "difficulty": "中級",
          "popularity": 40
        },
        {
          "id": "pp129",
          "text": "レスポンシブデザインで画面サイズに対応したい",
          "tags": ["レスポンシブ", "画面", "対応"],
          "difficulty": "中級",
          "popularity": 38
        },
        {
          "id": "pp130",
          "text": "印刷とスクリーン表示の両方に最適化したい",
          "tags": ["印刷", "スクリーン", "最適化"],
          "difficulty": "中級",
          "popularity": 36
        }
      ]
    },
    "animation": {
      "name": "アニメーション・効果",
      "icon": "✨",
      "color": "#607d8b",
      "samples": [
        {
          "id": "pp131",
          "text": "文字や図形にアニメーション効果をつけたい",
          "tags": ["アニメーション", "文字", "図形"],
          "difficulty": "中級",
          "popularity": 92
        },
        {
          "id": "pp132",
          "text": "アニメーションの順序を設定したい",
          "tags": ["順序", "設定", "アニメーション"],
          "difficulty": "中級",
          "popularity": 90
        },
        {
          "id": "pp133",
          "text": "アニメーションのタイミングを調整したい",
          "tags": ["タイミング", "調整", "速度"],
          "difficulty": "中級",
          "popularity": 88
        },
        {
          "id": "pp134",
          "text": "クリック時に自動でアニメーションを実行したい",
          "tags": ["クリック", "自動", "実行"],
          "difficulty": "中級",
          "popularity": 86
        },
        {
          "id": "pp135",
          "text": "アニメーションのプレビューで確認したい",
          "tags": ["プレビュー", "確認", "アニメーション"],
          "difficulty": "中級",
          "popularity": 84
        },
        {
          "id": "pp136",
          "text": "フェードイン・フェードアウト効果をつけたい",
          "tags": ["フェード", "イン", "アウト"],
          "difficulty": "中級",
          "popularity": 82
        },
        {
          "id": "pp137",
          "text": "スライドイン効果で左右から登場させたい",
          "tags": ["スライドイン", "左右", "登場"],
          "difficulty": "中級",
          "popularity": 80
        },
        {
          "id": "pp138",
          "text": "ズーム効果で拡大・縮小させたい",
          "tags": ["ズーム", "拡大", "縮小"],
          "difficulty": "中級",
          "popularity": 78
        },
        {
          "id": "pp139",
          "text": "回転アニメーションをつけたい",
          "tags": ["回転", "アニメーション", "スピン"],
          "difficulty": "中級",
          "popularity": 76
        },
        {
          "id": "pp140",
          "text": "バウンス効果で弾むような動きにしたい",
          "tags": ["バウンス", "弾む", "動き"],
          "difficulty": "中級",
          "popularity": 74
        },
        {
          "id": "pp141",
          "text": "アニメーションパスで独自の動きを作りたい",
          "tags": ["アニメーションパス", "独自", "動き"],
          "difficulty": "中級",
          "popularity": 72
        },
        {
          "id": "pp142",
          "text": "強調アニメーションで注意を引きたい",
          "tags": ["強調", "注意", "アニメーション"],
          "difficulty": "中級",
          "popularity": 70
        },
        {
          "id": "pp143",
          "text": "退場アニメーションでオブジェクトを消したい",
          "tags": ["退場", "消す", "アニメーション"],
          "difficulty": "中級",
          "popularity": 68
        },
        {
          "id": "pp144",
          "text": "複数のオブジェクトを同時にアニメーションさせたい",
          "tags": ["複数", "同時", "アニメーション"],
          "difficulty": "中級",
          "popularity": 66
        },
        {
          "id": "pp145",
          "text": "アニメーションを削除・無効化したい",
          "tags": ["削除", "無効化", "アニメーション"],
          "difficulty": "中級",
          "popularity": 64
        },
        {
          "id": "pp146",
          "text": "音響効果と組み合わせたい",
          "tags": ["音響", "効果", "組み合わせ"],
          "difficulty": "中級",
          "popularity": 62
        },
        {
          "id": "pp147",
          "text": "段落ごとに順番に表示したい",
          "tags": ["段落", "順番", "表示"],
          "difficulty": "中級",
          "popularity": 60
        },
        {
          "id": "pp148",
          "text": "モーフィング効果で滑らかに変形させたい",
          "tags": ["モーフィング", "滑らか", "変形"],
          "difficulty": "中級",
          "popularity": 58
        },
        {
          "id": "pp149",
          "text": "アニメーションの繰り返し設定をしたい",
          "tags": ["繰り返し", "設定", "ループ"],
          "difficulty": "中級",
          "popularity": 56
        },
        {
          "id": "pp150",
          "text": "3Dアニメーション効果を適用したい",
          "tags": ["3D", "アニメーション", "立体"],
          "difficulty": "中級",
          "popularity": 54
        }
      ]
    },
    "presentation_skills": {
      "name": "プレゼン技法",
      "icon": "🎤",
      "color": "#ff5722",
      "samples": [
        {
          "id": "pp151",
          "text": "効果的なスライド構成を学びたい",
          "tags": ["構成", "効果的", "学習"],
          "difficulty": "中級",
          "popularity": 90
        },
        {
          "id": "pp152",
          "text": "聴衆の注意を引くオープニングを作りたい",
          "tags": ["聴衆", "注意", "オープニング"],
          "difficulty": "中級",
          "popularity": 88
        },
        {
          "id": "pp153",
          "text": "印象に残るクロージングを作りたい",
          "tags": ["印象", "クロージング", "終わり"],
          "difficulty": "中級",
          "popularity": 86
        },
        {
          "id": "pp154",
          "text": "ストーリーテリング手法を活用したい",
          "tags": ["ストーリーテリング", "手法", "活用"],
          "difficulty": "中級",
          "popularity": 84
        },
        {
          "id": "pp155",
          "text": "データを分かりやすく視覚化したい",
          "tags": ["データ", "視覚化", "分かりやすく"],
          "difficulty": "中級",
          "popularity": 82
        },
        {
          "id": "pp156",
          "text": "複雑な内容を簡潔に伝えたい",
          "tags": ["複雑", "簡潔", "伝える"],
          "difficulty": "中級",
          "popularity": 80
        },
        {
          "id": "pp157",
          "text": "聴衆参加型のプレゼンテーションにしたい",
          "tags": ["聴衆参加", "インタラクティブ", "参加"],
          "difficulty": "中級",
          "popularity": 78
        },
        {
          "id": "pp158",
          "text": "質疑応答対策を準備したい",
          "tags": ["質疑応答", "対策", "準備"],
          "difficulty": "中級",
          "popularity": 76
        },
        {
          "id": "pp159",
          "text": "時間管理を効果的に行いたい",
          "tags": ["時間管理", "効果的", "管理"],
          "difficulty": "中級",
          "popularity": 74
        },
        {
          "id": "pp160",
          "text": "緊張せずに発表するコツを知りたい",
          "tags": ["緊張", "発表", "コツ"],
          "difficulty": "中級",
          "popularity": 72
        },
        {
          "id": "pp161",
          "text": "リモートプレゼンテーションのコツを覚えたい",
          "tags": ["リモート", "プレゼン", "コツ"],
          "difficulty": "中級",
          "popularity": 70
        },
        {
          "id": "pp162",
          "text": "多言語対応のプレゼンテーションを作りたい",
          "tags": ["多言語", "対応", "国際"],
          "difficulty": "中級",
          "popularity": 68
        },
        {
          "id": "pp163",
          "text": "業界別に適したプレゼンスタイルを学びたい",
          "tags": ["業界", "スタイル", "適用"],
          "difficulty": "中級",
          "popularity": 66
        },
        {
          "id": "pp164",
          "text": "エレベーターピッチを作成したい",
          "tags": ["エレベーター", "ピッチ", "短時間"],
          "difficulty": "中級",
          "popularity": 64
        },
        {
          "id": "pp165",
          "text": "セールスプレゼンテーションの技法を覚えたい",
          "tags": ["セールス", "技法", "営業"],
          "difficulty": "中級",
          "popularity": 62
        },
        {
          "id": "pp166",
          "text": "教育・研修用プレゼンテーションを作りたい",
          "tags": ["教育", "研修", "学習"],
          "difficulty": "中級",
          "popularity": 60
        },
        {
          "id": "pp167",
          "text": "会議での効果的な報告方法を学びたい",
          "tags": ["会議", "報告", "効果的"],
          "difficulty": "中級",
          "popularity": 58
        },
        {
          "id": "pp168",
          "text": "プレゼンテーション後のフォローアップを計画したい",
          "tags": ["フォローアップ", "計画", "後続"],
          "difficulty": "中級",
          "popularity": 56
        },
        {
          "id": "pp169",
          "text": "聴衆分析を行って内容を最適化したい",
          "tags": ["聴衆分析", "最適化", "ターゲット"],
          "difficulty": "中級",
          "popularity": 54
        },
        {
          "id": "pp170",
          "text": "プレゼンテーションスキルを継続的に向上させたい",
          "tags": ["スキル", "向上", "継続"],
          "difficulty": "中級",
          "popularity": 52
        }
      ]
    },
    "advanced_features": {
      "name": "高度な機能",
      "icon": "🚀",
      "color": "#1f4e79",
      "samples": [
        {
          "id": "pp171",
          "text": "VBAマクロでプレゼンテーション処理を自動化したい",
          "tags": ["VBA", "マクロ", "自動化"],
          "difficulty": "上級",
          "popularity": 88
        },
        {
          "id": "pp172",
          "text": "Excel・Wordとの高度な連携機能を使いたい",
          "tags": ["Excel", "Word", "連携"],
          "difficulty": "上級",
          "popularity": 85
        },
        {
          "id": "pp173",
          "text": "外部データソースとリアルタイム連携したい",
          "tags": ["外部データ", "リアルタイム", "連携"],
          "difficulty": "上級",
          "popularity": 82
        },
        {
          "id": "pp174",
          "text": "Webベースのプレゼンテーション配信システムを構築したい",
          "tags": ["Web", "配信", "システム"],
          "difficulty": "上級",
          "popularity": 79
        },
        {
          "id": "pp175",
          "text": "APIを使用して外部システムと統合したい",
          "tags": ["API", "外部システム", "統合"],
          "difficulty": "上級",
          "popularity": 76
        },
        {
          "id": "pp176",
          "text": "カスタムアドインを開発したい",
          "tags": ["カスタム", "アドイン", "開発"],
          "difficulty": "上級",
          "popularity": 73
        },
        {
          "id": "pp177",
          "text": "複雑なインタラクティブ要素を実装したい",
          "tags": ["インタラクティブ", "複雑", "実装"],
          "difficulty": "上級",
          "popularity": 70
        },
        {
          "id": "pp178",
          "text": "高度なデータ可視化（D3.js連携など）を行いたい",
          "tags": ["データ可視化", "D3.js", "高度"],
          "difficulty": "上級",
          "popularity": 67
        },
        {
          "id": "pp179",
          "text": "AIを活用した自動コンテンツ生成を実装したい",
          "tags": ["AI", "自動生成", "コンテンツ"],
          "difficulty": "上級",
          "popularity": 64
        },
        {
          "id": "pp180",
          "text": "ビッグデータ分析結果の動的プレゼンテーションを作りたい",
          "tags": ["ビッグデータ", "動的", "分析"],
          "difficulty": "上級",
          "popularity": 61
        },
        {
          "id": "pp181",
          "text": "VR・AR技術を活用したプレゼンテーションを作りたい",
          "tags": ["VR", "AR", "技術"],
          "difficulty": "上級",
          "popularity": 58
        },
        {
          "id": "pp182",
          "text": "機械学習モデルの予測結果を動的表示したい",
          "tags": ["機械学習", "予測", "動的表示"],
          "difficulty": "上級",
          "popularity": 55
        },
        {
          "id": "pp183",
          "text": "リアルタイム協業編集システムを構築したい",
          "tags": ["リアルタイム", "協業", "編集"],
          "difficulty": "上級",
          "popularity": 52
        },
        {
          "id": "pp184",
          "text": "カスタムテンプレートエンジンを開発したい",
          "tags": ["カスタム", "テンプレート", "エンジン"],
          "difficulty": "上級",
          "popularity": 49
        },
        {
          "id": "pp185",
          "text": "高度なセキュリティ機能を実装したい",
          "tags": ["セキュリティ", "高度", "実装"],
          "difficulty": "上級",
          "popularity": 46
        }
      ]
    },
    "automation": {
      "name": "自動化・効率化",
      "icon": "🤖",
      "color": "#00bcd4",
      "samples": [
        {
          "id": "pp186",
          "text": "複数のプレゼンテーションを一括処理したい",
          "tags": ["一括処理", "複数", "効率化"],
          "difficulty": "上級",
          "popularity": 85
        },
        {
          "id": "pp187",
          "text": "テンプレートベースの自動生成システムを作りたい",
          "tags": ["テンプレート", "自動生成", "システム"],
          "difficulty": "上級",
          "popularity": 82
        },
        {
          "id": "pp188",
          "text": "定期レポートの自動プレゼンテーション生成をしたい",
          "tags": ["定期レポート", "自動生成", "レポート"],
          "difficulty": "上級",
          "popularity": 79
        },
        {
          "id": "pp189",
          "text": "Power Automateとの連携で業務自動化したい",
          "tags": ["Power Automate", "連携", "業務自動化"],
          "difficulty": "上級",
          "popularity": 76
        },
        {
          "id": "pp190",
          "text": "コンテンツ管理システムとの自動連携を構築したい",
          "tags": ["CMS", "自動連携", "構築"],
          "difficulty": "上級",
          "popularity": 73
        },
        {
          "id": "pp191",
          "text": "スケジュール連動の自動プレゼンテーション配信をしたい",
          "tags": ["スケジュール", "自動配信", "連動"],
          "difficulty": "上級",
          "popularity": 70
        },
        {
          "id": "pp192",
          "text": "バージョン管理システムと連携したい",
          "tags": ["バージョン管理", "連携", "システム"],
          "difficulty": "上級",
          "popularity": 67
        },
        {
          "id": "pp193",
          "text": "マルチメディアコンテンツの自動最適化をしたい",
          "tags": ["マルチメディア", "自動最適化", "コンテンツ"],
          "difficulty": "上級",
          "popularity": 64
        },
        {
          "id": "pp194",
          "text": "プレゼンテーション品質の自動チェック機能を作りたい",
          "tags": ["品質", "自動チェック", "機能"],
          "difficulty": "上級",
          "popularity": 61
        },
        {
          "id": "pp195",
          "text": "AIアシスタント機能でコンテンツ改善提案をしたい",
          "tags": ["AI", "アシスタント", "改善提案"],
          "difficulty": "上級",
          "popularity": 58
        }
      ]
    },
    "professional": {
      "name": "プロフェッショナル活用",
      "icon": "👔",
      "color": "#795548",
      "samples": [
        {
          "id": "pp196",
          "text": "エンタープライズ環境でのセキュリティ管理をしたい",
          "tags": ["エンタープライズ", "セキュリティ", "管理"],
          "difficulty": "上級",
          "popularity": 80
        },
        {
          "id": "pp197",
          "text": "アクセシビリティ標準に完全準拠したプレゼンを作りたい",
          "tags": ["アクセシビリティ", "標準", "準拠"],
          "difficulty": "上級",
          "popularity": 76
        },
        {
          "id": "pp198",
          "text": "大規模な配信・ストリーミングシステムを構築したい",
          "tags": ["大規模", "配信", "ストリーミング"],
          "difficulty": "上級",
          "popularity": 72
        },
        {
          "id": "pp199",
          "text": "国際基準に対応した多言語・多文化プレゼンを作りたい",
          "tags": ["国際基準", "多言語", "多文化"],
          "difficulty": "上級",
          "popularity": 68
        },
        {
          "id": "pp200",
          "text": "次世代プレゼンテーション技術の導入・活用をしたい",
          "tags": ["次世代", "技術", "導入"],
          "difficulty": "上級",
          "popularity": 64
        }
      ]
    }
  }
};