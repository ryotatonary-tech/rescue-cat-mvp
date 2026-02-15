export interface VersionInfo {
    version: string;
    date: string;
    changes: string[];
}

export const VERSIONS: VersionInfo[] = [
    {
        version: "1.0.1",
        date: "2026-02-15",
        changes: [
            "PCで名前変更ボタンが反応しない不具合を修正",
            "スマホ（PWA）での表示を最適化",
            "更新履歴を表示する機能を追加"
        ]
    },
    {
        version: "1.0.0",
        date: "2026-02-13",
        changes: [
            "アプリ公開！",
            "お世話機能（ごはん、遊ぶ、掃除、休む）",
            "5分ごとの自動更新システム",
            "思い出ログ機能"
        ]
    }
];
