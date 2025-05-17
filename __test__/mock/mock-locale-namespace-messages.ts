export type MockLocaleNamespaceMessages = typeof mockLocaleNamespaceMessages;

export const mockLocaleNamespaceMessages = {
  "en-US": {
    common: {
      ok: "OK",
      cancel: "Cancel",
    },
    home: {
      title: "Welcome",
      description: "This is the homepage",
    },
    profile: {
      greeting: "Hello, {name}!",
    },
  },
  "zh-TW": {
    common: {
      ok: "確定",
      cancel: "取消",
    },
    home: {
      title: "歡迎",
      description: "這是首頁",
    },
    profile: {
      greeting: "你好，{name}！",
    },
  },
  "fr-FR": {
    common: {
      ok: "D'accord",
      cancel: "Annuler",
    },
    home: {
      title: "Bienvenue",
      description: "Ceci est la page d'accueil",
    },
    profile: {
      greeting: "Bonjour, {name}!",
    },
    test: {
      "non-exist-in-en-us": "This key only exists in fr-FR",
    },
  },
  "ja-JP": {
    common: {
      ok: "はい",
      cancel: "キャンセル",
    },
    home: {
      title: "ようこそ",
      description: "これはホームページです",
    },
    profile: {
      greeting: "こんにちは、{name}！",
    },
  },
};
