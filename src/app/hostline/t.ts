// Hostline's page: every fact here comes from luannzin/hostline's README.
export default {
  meta: {
    title: {
      en: "Hostline: your localhost as a link",
      pt: "Hostline: seu localhost como link",
    },
    description: {
      en: "Share any port on your computer as a link that opens in any browser, straight from your machine. No account, no tunnel server, and the link ends when you stop it.",
      pt: "Compartilhe qualquer porta do seu computador como um link que abre em qualquer navegador, direto da sua máquina. Sem conta, sem servidor de túnel, e o link acaba quando você para.",
    },
    ogLocale: { en: "en_US", pt: "pt_BR" },
  },
  hero: {
    line: {
      en: "Your localhost as a link.",
      pt: "Seu localhost como link.",
    },
    lead: {
      en: "Let a friend try what you're building without a deploy, or open it on your phone without being on the same Wi-Fi. Hostline turns a port on your computer into a link, and whoever opens it gets your app in their browser, straight from your machine.",
      pt: "Deixa um amigo testar o que você tá fazendo sem deploy, ou abre no seu celular sem estar no mesmo Wi-Fi. O Hostline transforma uma porta do seu computador num link, e quem abre recebe o seu app no navegador, direto da sua máquina.",
    },
    phone: {
      en: "Hostline runs on the computer whose port you share: Windows, macOS or Linux. The links it makes open on any phone.",
      pt: "O Hostline roda no computador que compartilha a porta: Windows, macOS ou Linux. Os links que ele cria abrem em qualquer celular.",
    },
    use: { en: "Sharing a port", pt: "Pra compartilhar uma porta" },
    steps: {
      start: {
        en: "Start your app the way you always do.",
        pt: "Sobe o seu app do jeito de sempre.",
      },
      run: {
        en: "Run Hostline with its port:",
        pt: "Roda o Hostline com a porta dele:",
      },
      send: {
        en: "Send the link, or point your phone's camera at the QR code. The link is already copied.",
        pt: "Manda o link, ou aponta a câmera do celular pro QR code. O link já tá copiado.",
      },
    },
    npx: {
      en: "With Node, there's nothing to install:",
      pt: "Com Node, não precisa instalar nada:",
    },
  },
  files: {
    linux: {
      system: { en: "Linux, x86_64", pt: "Linux, x86_64" },
      how: {
        en: "chmod +x, then run it from a terminal.",
        pt: "chmod +x e roda pelo terminal.",
      },
      line: {
        en: "One line puts it in ~/.local/bin:",
        pt: "Uma linha coloca ele em ~/.local/bin:",
      },
    },
    arm: {
      system: { en: "Linux, arm64", pt: "Linux, arm64" },
      how: {
        en: "chmod +x, then run it from a terminal. On an arm64 machine, the line above installs this one.",
        pt: "chmod +x e roda pelo terminal. Numa máquina arm64, a linha de cima instala esse.",
      },
    },
    mac: {
      system: {
        en: "macOS, Apple silicon and Intel",
        pt: "macOS, Apple silicon e Intel",
      },
      how: {
        en: "One file for both. Downloaded in a browser, macOS stops it until you allow it in System Settings, Privacy & Security.",
        pt: "Um arquivo pros dois. Baixado pelo navegador, o macOS barra até você liberar em Ajustes do Sistema, Privacidade e Segurança.",
      },
      line: {
        en: "One line puts it in ~/.local/bin, and macOS doesn't stop it the way it stops a downloaded file:",
        pt: "Uma linha coloca ele em ~/.local/bin, e o macOS não barra como barra um arquivo baixado:",
      },
    },
    windows: {
      system: { en: "Windows 10 and 11", pt: "Windows 10 e 11" },
      how: { en: "Run it from a terminal.", pt: "Roda pelo terminal." },
      line: {
        en: "One line in PowerShell puts it on your PATH:",
        pt: "Uma linha no PowerShell coloca ele no seu PATH:",
      },
    },
    updates: {
      en: "Installed copies keep themselves up to date: when a new version is out, Hostline swaps itself for it while it runs, and the next run is the new version. npx runs the version npm picks.",
      pt: "As cópias instaladas se atualizam sozinhas: quando sai uma versão nova, o Hostline se troca por ela enquanto roda, e a próxima vez já é a nova. O npx roda a versão que o npm escolher.",
    },
  },
  try: {
    title: { en: "Try it here", pt: "Testa aqui" },
    lead: {
      en: "The computer shares a file instead of a port, and the phone opens the link. Both ends run in this page, over a real WebRTC line and Hostline's own frames. Run it, open the link, then edit the page and watch the phone.",
      pt: "O computador compartilha um arquivo em vez de uma porta, e o celular abre o link. As duas pontas rodam nesta página, numa linha WebRTC de verdade e com os próprios frames do Hostline. Roda, abre o link, depois edita a página e olha o celular.",
    },
  },
  see: {
    title: { en: "What they see", pt: "O que a pessoa vê" },
    rows: {
      before: {
        term: { en: "Before your app", pt: "Antes do seu app" },
        text: {
          en: "While the link opens, the page says it comes from someone's computer, through Hostline.",
          pt: "Enquanto o link abre, a página avisa que vem do computador de alguém, pelo Hostline.",
        },
      },
      live: {
        term: { en: "Your app", pt: "O seu app" },
        text: {
          en: "At its own path, with Live in a corner. Hot reload works through the link: you save, their page updates.",
          pt: "No path dele, com Ao vivo num canto. O hot reload funciona pelo link: você salva, a página da pessoa atualiza.",
        },
      },
      end: {
        term: { en: "When you stop", pt: "Quando você para" },
        text: {
          en: "Every page that has the link open says it ended. The next run gets a new link.",
          pt: "Toda página com o link aberto avisa que ele acabou. A próxima vez que você rodar gera um link novo.",
        },
      },
    },
  },
  use: {
    title: { en: "Running it", pt: "Rodando" },
    rows: {
      any: {
        en: "Any port, not only dev servers: vite, next dev, next start, vite preview, a Python http.server, an API with a page in front of it.",
        pt: "Qualquer porta, não só dev server: vite, next dev, next start, vite preview, um http.server do Python, uma API com uma página na frente.",
      },
      usual: {
        en: "With no port, Hostline looks at the usual ones (3000, 5173, 8080 and a dozen more) and shares the one that's listening.",
        pt: "Sem porta, o Hostline olha as de sempre (3000, 5173, 8080 e mais uma dúzia) e compartilha a que estiver ouvindo.",
      },
      for: {
        en: "hostline --for 30m ends the link after 30 minutes (s, m and h work). Without it, the link lasts until you press Ctrl+C.",
        pt: "hostline --for 30m encerra o link depois de 30 minutos (s, m e h funcionam). Sem isso, o link dura até você apertar Ctrl+C.",
      },
      who: {
        en: "Each person who opens the link shows up in your terminal: ● Safari on iPhone opened the link.",
        pt: "Cada pessoa que abre o link aparece no seu terminal: ● Safari on iPhone opened the link.",
      },
    },
  },
  inside: {
    title: { en: "How it gets there", pt: "Como chega lá" },
    rows: {
      meet: {
        term: { en: "Finding each other", pt: "Se encontrando" },
        text: {
          en: "Everything after the # in the link stays in the browser, so this site never sees it. Your computer and their browser meet in a room on public Nostr relays, named by a hash of the link's secret, and seal every message with a key made from it.",
          pt: "Tudo depois do # no link fica no navegador, então este site nunca vê. Seu computador e o navegador da pessoa se encontram numa sala em relays Nostr públicos, com o nome tirado de um hash do segredo do link, e lacram cada mensagem com uma chave feita a partir dele.",
        },
      },
      line: {
        term: { en: "The line", pt: "A linha" },
        text: {
          en: "Once they've met, it's one WebRTC data channel from their browser to your machine, encrypted. The relays drop out.",
          pt: "Depois que se encontram, é um canal de dados WebRTC do navegador da pessoa até a sua máquina, criptografado. Os relays saem da jogada.",
        },
      },
      page: {
        term: { en: "The page", pt: "A página" },
        text: {
          en: "This page opens your app in a frame, and its service worker hands every request the app makes to the line. Hostline makes the real request to your port and streams the answer back. WebSockets go the same way.",
          pt: "Esta página abre o seu app num frame, e o service worker dela passa cada request do app pra linha. O Hostline faz o request de verdade na sua porta e devolve a resposta em stream. WebSocket vai pelo mesmo caminho.",
        },
      },
      state: {
        term: { en: "Cookies and storage", pt: "Cookies e storage" },
        text: {
          en: "Cookies live in a jar on your machine, one per visitor's browser, kept across reloads until the link ends, so logins work. localStorage, sessionStorage and IndexedDB belong to the link, and go when it ends.",
          pt: "Os cookies ficam num jar na sua máquina, um por navegador que abre, guardados entre reloads até o link acabar, então login funciona. localStorage, sessionStorage e IndexedDB são do link, e somem quando ele acaba.",
        },
      },
    },
  },
  safe: {
    title: { en: "What goes where", pt: "O que vai pra onde" },
    rows: {
      key: {
        en: "Anyone with the link reaches the port you shared, and only that port, while Hostline runs. Treat it like a key to that port.",
        pt: "Quem tem o link chega na porta que você compartilhou, e só nela, enquanto o Hostline roda. Trata ele como uma chave dessa porta.",
      },
      relays: {
        en: "The relays see that two IP addresses met. They can't read the link or the connection details.",
        pt: "Os relays veem que dois endereços IP se encontraram. Eles não conseguem ler o link nem os detalhes da conexão.",
      },
      direct: {
        en: "Your app's traffic goes straight between their browser and your machine, with no server of mine in the middle. You can see each other's IP address, as in any peer-to-peer connection.",
        pt: "O tráfego do seu app vai direto entre o navegador da pessoa e a sua máquina, sem servidor meu no meio. Vocês conseguem ver o IP um do outro, como em qualquer conexão peer-to-peer.",
      },
    },
  },
  limits: {
    title: { en: "Not there yet", pt: "Ainda não" },
    rows: {
      relay: {
        en: "When both sides are behind strict networks (some mobile carriers, company firewalls), there's no direct path and it doesn't connect. There's no relay to fall back on yet.",
        pt: "Quando os dois lados tão atrás de redes restritas (algumas operadoras de celular, firewall de empresa), não tem caminho direto e não conecta. Ainda não tem relay pra cair de volta.",
      },
      worker: {
        en: "The shared app's own service worker doesn't install, and Cache Storage is shared by every link.",
        pt: "O service worker do próprio app compartilhado não instala, e o Cache Storage é o mesmo pra todo link.",
      },
      private: {
        en: "The visitor's browser needs service workers, which some private windows turn off.",
        pt: "O navegador de quem abre precisa de service worker, que algumas janelas anônimas desligam.",
      },
      tested: {
        en: "Tested so far in Chrome on Windows and Firefox on Linux.",
        pt: "Testado até agora no Chrome no Windows e no Firefox no Linux.",
      },
    },
  },
};
