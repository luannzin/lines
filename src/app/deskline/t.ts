export default {
  meta: {
    title: {
      en: "Deskline: remote desktop with no server to run",
      pt: "Deskline: acesso remoto sem servidor pra rodar",
    },
    description: {
      en: "A free, open source remote desktop for Windows, macOS and Linux. No account and no server to run: type someone's code, they accept, and you see their screen.",
      pt: "Acesso remoto grátis e de código aberto pra Windows, macOS e Linux. Sem conta e sem servidor pra rodar: você digita o código de alguém, a pessoa aceita e você vê a tela dela.",
    },
    ogLocale: { en: "en_US", pt: "pt_BR" },
  },
  hero: {
    line: {
      en: "Remote desktop with no server to run.",
      pt: "Acesso remoto sem servidor nenhum pra rodar.",
    },
    lead: {
      en: "Every computer has a code. Type someone's code, they accept, and you see their screen. With their OK you drive their mouse and keyboard, move files and hear their sound, on the same network or across the internet.",
      pt: "Todo computador tem um código. Você digita o código de alguém, a pessoa aceita e você vê a tela dela. Com o OK dela, você usa o mouse e o teclado, passa arquivos e ouve o som, na mesma rede ou pela internet.",
    },
    sent: {
      en: "If someone sent you here",
      pt: "Se alguém te mandou aqui",
    },
    steps: {
      download: {
        en: "Download Deskline and open it.",
        pt: "Baixa o Deskline e abre.",
      },
      copy: {
        en: "Read your code out to whoever is helping you, or click Copy code and send it.",
        pt: "Lê o seu código pra quem está te ajudando, ou clica em Copiar código e manda.",
      },
      accept: {
        en: "When they connect, click Accept.",
        pt: "Quando a pessoa conectar, clica em Aceitar.",
      },
    },
    phone: {
      en: "Deskline runs on Windows, macOS and Linux, not on phones yet. Open this page on the computer that needs help, or on the one you'll help from.",
      pt: "O Deskline roda no Windows, no macOS e no Linux, ainda não no celular. Abre esta página no computador que precisa de ajuda, ou no que vai ajudar.",
    },
  },
  files: {
    windows: {
      system: { en: "Windows 10 and 11", pt: "Windows 10 e 11" },
      how: {
        en: "One file. Run it as is, or install it for everyone, with its service, from Settings, Install for all users.",
        pt: "Um arquivo só. Roda ele direto, ou instala pra todo mundo, com o serviço, em Configurações, Instalar para todos os usuários.",
      },
      first: {
        en: "The first time, Windows SmartScreen stops it: click More info, then Run anyway. The build isn't signed with a paid certificate yet.",
        pt: "Na primeira vez o SmartScreen do Windows barra: clica em Mais informações e depois em Executar assim mesmo. O Deskline ainda não é assinado com um certificado pago.",
      },
    },
    deb: {
      system: {
        en: "Ubuntu 24.04+, Debian 12+",
        pt: "Ubuntu 24.04+, Debian 12+",
      },
      how: {
        en: "Install it with sudo apt install ./deskline_amd64.deb",
        pt: "Instala com sudo apt install ./deskline_amd64.deb",
      },
    },
    portable: {
      system: { en: "Linux, portable", pt: "Linux, portátil" },
      how: {
        en: "Nothing to install: chmod +x deskline-linux-x86_64 and run it. Needs PipeWire, GStreamer and a desktop session.",
        pt: "Nada pra instalar: chmod +x deskline-linux-x86_64 e roda. Precisa de PipeWire, GStreamer e uma sessão de desktop.",
      },
    },
    dmg: {
      system: { en: "macOS 11+", pt: "macOS 11+" },
      how: {
        en: "Drag Deskline into Applications. Its home asks for Screen Recording and Accessibility: allow both.",
        pt: "Arrasta o Deskline pra Aplicativos. O início dele pede Gravação de Tela e Acessibilidade: permite as duas.",
      },
      first: {
        en: "The first time, macOS won't open it: try once, then go to System Settings, Privacy & Security, click Open Anyway and type your password. The build isn't signed with a paid certificate yet.",
        pt: "Na primeira vez o macOS não abre: tenta uma vez, depois vai em Ajustes do Sistema, Privacidade e Segurança, clica em Abrir Mesmo Assim e digita sua senha. O Deskline ainda não é assinado com um certificado pago.",
      },
      line: {
        en: "Or paste this in Terminal, and macOS opens Deskline straight away, with no Open Anyway.",
        pt: "Ou cola isto no Terminal, e o macOS abre o Deskline direto, sem Abrir Mesmo Assim.",
      },
    },
    zip: {
      system: { en: "macOS, portable", pt: "macOS, portátil" },
      how: {
        en: "Nothing to install: unzip it and open Deskline.app from anywhere. Same permissions as above.",
        pt: "Nada pra instalar: descompacta e abre o Deskline.app de onde quiser. Mesmas permissões de cima.",
      },
    },
    updates: {
      en: "Deskline updates itself: the window offers Restart to update when a new version is downloaded, and the installed Windows service updates on its own.",
      pt: "O Deskline se atualiza sozinho: a janela mostra Reiniciar pra atualizar quando baixa uma versão nova, e o serviço instalado no Windows se atualiza por conta própria.",
    },
  },
  try: {
    title: { en: "Try it here", pt: "Testa aqui" },
    lead: {
      en: "Two copies of Deskline's window, made with this page and connected for real through your browser. Type the code from the first one into the second.",
      pt: "Duas cópias da janela do Deskline, feitas nesta página e conectadas de verdade pelo seu navegador. Digita o código da primeira na segunda.",
    },
    you: { en: "You", pt: "Você" },
    helper: { en: "Whoever is helping you", pt: "Quem está te ajudando" },
    same: {
      en: "Both windows are on this computer, so the link meter is as full and warm as it gets. Across the internet its dots reach less far and stay cooler.",
      pt: "As duas janelas estão neste computador, então o medidor da ligação fica o mais cheio e quente possível. Pela internet os pontos vão menos longe e ficam mais frios.",
    },
  },
  first: {
    title: { en: "The first time", pt: "A primeira vez" },
    lead: {
      en: "What each system asks before Deskline can share a screen, so you can talk someone through it over the phone.",
      pt: "O que cada sistema pede antes do Deskline compartilhar uma tela, pra você conseguir explicar pra alguém pelo telefone.",
    },
    windows: {
      en: "SmartScreen stops a file it doesn't know yet: More info, then Run anyway. Then they read you their code. There's nothing else to allow.",
      pt: "O SmartScreen barra um arquivo que ainda não conhece: Mais informações e depois Executar assim mesmo. Aí a pessoa lê o código pra você. Não tem mais nada pra permitir.",
    },
    mac: {
      install: {
        en: "Open Terminal (Command+Space, type Terminal, Enter) and paste this line. Deskline opens straight away, with no Open Anyway.",
        pt: "Abre o Terminal (Command+Espaço, digita Terminal, Enter) e cola esta linha. O Deskline abre direto, sem Abrir Mesmo Assim.",
      },
      allow: {
        en: "Deskline's home lists two things to allow: Screen Recording, so the other person sees the screen, and Accessibility, so they can use the mouse and keyboard. Click Allow on each and switch Deskline on in the list that opens.",
        pt: "O início do Deskline mostra duas coisas pra permitir: Gravação de Tela, pra outra pessoa ver a tela, e Acessibilidade, pra ela usar o mouse e o teclado. Clica em Permitir em cada uma e liga o Deskline na lista que abrir.",
      },
      restart: {
        en: "If Screen Recording still says it isn't allowed, click Restart Deskline: macOS shows a running app the change only once it restarts.",
        pt: "Se a Gravação de Tela continuar como não permitida, clica em Reiniciar o Deskline: o macOS só mostra a mudança pra um app aberto depois que ele reinicia.",
      },
    },
    linux: {
      en: "Install the .deb and open Deskline. The first time someone connects, your system's sharing dialog asks which screens they see and whether they may control. Choose screens, on the red bar, asks again.",
      pt: "Instala o .deb e abre o Deskline. Na primeira vez que alguém conecta, o diálogo de compartilhamento do sistema pergunta quais telas a pessoa vê e se ela pode controlar. Escolher telas, na barra vermelha, pergunta de novo.",
    },
  },
  inside: {
    title: { en: "Once you're in", pt: "Depois de entrar" },
    lead: {
      en: "I started it as the smallest thing that could replace AnyDesk when I help family and friends. Then it needed the rest of what makes AnyDesk usable day to day.",
      pt: "Fiz ele pra ser a menor coisa que desse pra trocar o AnyDesk quando eu ajudo família e amigos. Depois ele precisou do resto do que faz o AnyDesk ser usável no dia a dia.",
    },
    rows: {
      control: {
        term: { en: "Mouse and keyboard", pt: "Mouse e teclado" },
        text: {
          en: "With their OK you drive both. On Windows every key goes through, Win, Alt+Tab and Print Screen included, and Ctrl+Alt+Del is in the toolbar.",
          pt: "Com o OK da pessoa você usa os dois. No Windows toda tecla passa, até Win, Alt+Tab e Print Screen, e o Ctrl+Alt+Del fica na barra.",
        },
      },
      files: {
        term: { en: "Files", pt: "Arquivos" },
        text: {
          en: "Browse their computer, download a file with a double click, send files or drop them on the window, and they land in the folder you're looking at.",
          pt: "Navega pelo computador da pessoa, baixa um arquivo com dois cliques, manda arquivos ou solta eles na janela, e eles caem na pasta que você está vendo.",
        },
      },
      clipboard: {
        term: { en: "Copy and paste", pt: "Copiar e colar" },
        text: {
          en: "Copy on one computer and paste on the other: text, and files too.",
          pt: "Copia num computador e cola no outro: texto, e arquivos também.",
        },
      },
      sound: {
        term: { en: "Sound and chat", pt: "Som e chat" },
        text: {
          en: "You hear what their speakers play, and there's a chat on both sides.",
          pt: "Você ouve o que sai das caixas de som da pessoa, e tem chat dos dois lados.",
        },
      },
      native: {
        term: { en: "Games and video", pt: "Jogos e vídeo" },
        text: {
          en: "Native mode sends their screen at its own size, up to 4K, and its own refresh rate, up to 240 frames a second. When the link can't keep up, fewer frames come; the picture never gets smaller.",
          pt: "O modo Nativo manda a tela da pessoa no tamanho dela, até 4K, e na taxa de atualização dela, até 240 frames por segundo. Quando a ligação não aguenta, chegam menos frames; a imagem nunca diminui.",
        },
      },
      unattended: {
        term: { en: "Your own computers", pt: "Seus computadores" },
        text: {
          en: "Set an unattended-access password and get in without anyone clicking Accept. Installed on Windows, it starts before anyone signs in, so the sign-in screen and UAC prompts can be clicked too.",
          pt: "Define uma senha de acesso não supervisionado e entra sem ninguém clicar em Aceitar. Instalado no Windows, ele sobe antes de alguém entrar, então dá pra clicar até na tela de login e nos avisos do UAC.",
        },
      },
    },
  },
  anydesk: {
    title: { en: "Coming from AnyDesk", pt: "Vindo do AnyDesk" },
    them: { en: "AnyDesk", pt: "AnyDesk" },
    us: { en: "Deskline", pt: "Deskline" },
    rows: {
      address: {
        them: { en: "9-digit address", pt: "Endereço de 9 dígitos" },
        us: {
          en: "Nine digits too, new each time Deskline opens, and Recent keeps the computer under a name you choose. Nobody hands them out: each computer picks its own.",
          pt: "Nove dígitos também, novos cada vez que o Deskline abre, e os Recentes guardam o computador com o nome que você escolher. Ninguém distribui: cada computador escolhe os seus.",
        },
      },
      accept: {
        them: {
          en: "Accept window with permissions",
          pt: "Janela de aceite com permissões",
        },
        us: {
          en: "Same, with Let them control and Always allow them",
          pt: "Igual, com Deixar controlar e Sempre permitir",
        },
      },
      password: {
        them: {
          en: "Unattended access password",
          pt: "Senha de acesso não supervisionado",
        },
        us: {
          en: "Settings, Unattended access",
          pt: "Configurações, Acesso não supervisionado",
        },
      },
      install: {
        them: { en: "Install AnyDesk", pt: "Instalar o AnyDesk" },
        us: {
          en: "Settings, Install for all users",
          pt: "Configurações, Instalar para todos os usuários",
        },
      },
      book: {
        them: { en: "Address book", pt: "Catálogo de endereços" },
        us: { en: "Recent, with names", pt: "Recentes, com nomes" },
      },
      privacy: {
        them: {
          en: "Privacy mode, block input",
          pt: "Modo privacidade, bloquear entrada",
        },
        us: {
          en: "Privacy (Windows 10 2004+)",
          pt: "Privacidade (Windows 10 2004+)",
        },
      },
      onprem: {
        them: { en: "AnyDesk On-Premises", pt: "AnyDesk On-Premises" },
        us: {
          en: "Run your own iroh-relay and set it under Settings, Relay server",
          pt: "Roda seu próprio iroh-relay e coloca em Configurações, Servidor de relay",
        },
      },
    },
    missing: {
      en: "Not there yet: session recording, Wake-on-LAN, TCP tunnels, phone apps, and an AI agent working on a computer once its owner clicks Accept.",
      pt: "Ainda não tem: gravação de sessão, Wake-on-LAN, túneis TCP, app de celular e um agente de IA trabalhando num computador depois que o dono clica em Aceitar.",
    },
  },
  trouble: {
    title: { en: "When something's wrong", pt: "Quando algo dá errado" },
    see: { en: "What you see", pt: "O que aparece" },
    do: { en: "What to do", pt: "O que fazer" },
    rows: {
      gatekeeper: {
        see: {
          en: "macOS says it can't check Deskline for malware, or that it's damaged",
          pt: "O macOS diz que não consegue verificar o Deskline, ou que ele está danificado",
        },
        do: {
          en: "Install it with the line in Terminal above, which macOS doesn't stop. Or try once, then System Settings, Privacy & Security, Open Anyway and your password.",
          pt: "Instala com a linha no Terminal ali em cima, que o macOS não barra. Ou tenta uma vez, depois Ajustes do Sistema, Privacidade e Segurança, Abrir Mesmo Assim e sua senha.",
        },
      },
      smartscreen: {
        see: {
          en: "Windows says it protected your PC",
          pt: "O Windows diz que protegeu o computador",
        },
        do: {
          en: "More info, then Run anyway. The build isn't signed with a paid certificate yet.",
          pt: "Mais informações e depois Executar assim mesmo. O Deskline ainda não é assinado com um certificado pago.",
        },
      },
      screen: {
        see: {
          en: "A Mac's screen doesn't come through",
          pt: "A tela de um Mac não chega",
        },
        do: {
          en: "On the Mac, Deskline's home lists what's left to allow. Allow Screen Recording, and restart Deskline if it still says it isn't allowed.",
          pt: "No Mac, o início do Deskline mostra o que falta permitir. Permite a Gravação de Tela e reinicia o Deskline se ela continuar como não permitida.",
        },
      },
      input: {
        see: {
          en: "Clicks and keys don't reach a Mac",
          pt: "Cliques e teclas não chegam no Mac",
        },
        do: {
          en: "Allow Accessibility. Deskline asks for it when the Mac accepts with Let them control ticked, and its home has the button too.",
          pt: "Permite a Acessibilidade. O Deskline pede quando o Mac aceita com Deixar controlar marcado, e o botão também fica no início dele.",
        },
      },
      update: {
        see: {
          en: "After an update, a Mac shows Deskline as allowed and nothing works",
          pt: "Depois de uma atualização, o Mac mostra o Deskline como permitido e nada funciona",
        },
        do: {
          en: "Open Deskline: after an update it clears an answer that stopped working, so its home can ask again. From 0.9.0 every release is signed the same way, so macOS keeps the answer.",
          pt: "Abre o Deskline: depois de uma atualização ele limpa uma resposta que parou de valer, pra que o início dele pergunte de novo. Desde a 0.9.0 toda versão é assinada do mesmo jeito, então o macOS guarda a resposta.",
        },
      },
      sound: {
        see: { en: "No sound from a Mac", pt: "Sem som de um Mac" },
        do: {
          en: "Sharing a Mac's sound needs macOS 14.6 or later, or a loopback device such as BlackHole.",
          pt: "Compartilhar o som de um Mac precisa do macOS 14.6 ou mais novo, ou de um dispositivo de loopback como o BlackHole.",
        },
      },
      linux: {
        see: {
          en: "On Linux, a screen is missing or control doesn't work",
          pt: "No Linux, falta uma tela ou o controle não funciona",
        },
        do: {
          en: "Your system's sharing dialog decides both. Choose screens, on the red bar, opens it again.",
          pt: "Quem decide as duas coisas é o diálogo de compartilhamento do sistema. Escolher telas, na barra vermelha, abre ele de novo.",
        },
      },
      signin: {
        see: {
          en: "The Windows sign-in screen can't be reached",
          pt: "Não dá pra chegar na tela de login do Windows",
        },
        do: {
          en: "Install Deskline on that computer, from Settings, Install for all users: its service starts before anyone signs in.",
          pt: "Instala o Deskline naquele computador, em Configurações, Instalar para todos os usuários: o serviço dele sobe antes de alguém entrar.",
        },
      },
      other: {
        see: { en: "Anything else", pt: "Qualquer outra coisa" },
        do: {
          en: "In Deskline, Settings, Report a problem: say what happened, and it adds its version and the system, never your code.",
          pt: "No Deskline, Configurações, Relatar um problema: conta o que aconteceu, e ele junta a versão e o sistema, nunca o seu código.",
        },
      },
    },
    issue: {
      en: "Or open an issue on GitHub",
      pt: "Ou abre uma issue no GitHub",
    },
  },
  news: {
    title: { en: "What's new", pt: "O que mudou" },
    releases: {
      v0100: {
        en: "Your code is nine digits you can read over the phone, new each time Deskline opens. The computer's long code is in Settings, Unattended access, for getting in with the password. Narrator, VoiceOver and Orca read the whole window, and Escape answers no to a prompt.",
        pt: "O seu código são nove dígitos que dá pra ler pelo telefone, novos cada vez que o Deskline abre. O código longo do computador fica em Configurações, Acesso não supervisionado, pra entrar com a senha. O Narrador, o VoiceOver e o Orca leem a janela inteira, e o Esc responde não a uma pergunta.",
      },
      v090: {
        en: "On a Mac, Deskline's home asks for Screen Recording and Accessibility before anyone connects, and Accessibility comes up when you accept someone who may control. Every release from here on is signed the same way, so macOS keeps those answers across updates. Settings has Report a problem, and an error has Report this beside it.",
        pt: "No Mac, o início do Deskline pede a Gravação de Tela e a Acessibilidade antes de alguém conectar, e a Acessibilidade aparece quando você aceita alguém que pode controlar. Daqui pra frente toda versão é assinada do mesmo jeito, então o macOS guarda essas respostas nas atualizações. As Configurações têm Relatar um problema, e um erro vem com Relatar isso do lado.",
      },
      v080: {
        en: "Native picture for games: their screen at its own size, up to 4K, and its own refresh rate, up to 240 frames a second. On Linux the viewer asks for other screens with a click, and when a computer refuses the mouse or keyboard, the viewer is told why.",
        pt: "Imagem Nativa pra jogos: a tela da pessoa no tamanho dela, até 4K, e na taxa de atualização dela, até 240 frames por segundo. No Linux, quem vê pede outras telas com um clique, e quando um computador recusa o mouse ou o teclado, quem vê fica sabendo o porquê.",
      },
      v070: {
        en: "Copy and paste files between the two computers, and a Files panel that reads well.",
        pt: "Copiar e colar arquivos entre os dois computadores, e um painel de Arquivos que dá pra ler direito.",
      },
      v060: {
        en: "Games at 120 frames a second, and Capture mouse for games that hide the pointer. The GPU's encoder on Linux, and on Windows the picture stays on the GPU from capture to encoder.",
        pt: "Jogos a 120 frames por segundo, e Capturar mouse pros jogos que escondem o ponteiro. O encoder da GPU no Linux, e no Windows a imagem fica na GPU da captura até o encoder.",
      },
      v040: {
        en: "A calmer window: nothing boxed, scrolling that works, and focus you can see.",
        pt: "Uma janela mais calma: nada em caixa, rolagem que funciona e foco que dá pra ver.",
      },
      v030: {
        en: "The look it has now, from luannzin.com's system, in English and Portuguese.",
        pt: "O visual de agora, do sistema do luannzin.com, em inglês e português.",
      },
      v021: {
        en: "A picture that adapts to the connection, encoding on the GPU, the pixel-art mark, and a portable macOS zip.",
        pt: "Uma imagem que se adapta à conexão, encode na GPU, a marca em pixel art e um zip portátil pro macOS.",
      },
      v020: {
        en: "The first release: send your code, accept, and the other computer sees and controls your screen.",
        pt: "A primeira versão: você manda seu código, aceita, e o outro computador vê e controla sua tela.",
      },
    },
    all: { en: "Every release on GitHub", pt: "Todas as versões no GitHub" },
  },
  safe: {
    title: { en: "Who can get in", pt: "Quem consegue entrar" },
    rows: {
      key: {
        en: "Behind the nine digits is the computer's public key. The connection is encrypted end to end with it, so nobody in between can read or change the session, the relays included.",
        pt: "Por trás dos nove dígitos tá a chave pública do computador. A conexão é criptografada de ponta a ponta com ela, então ninguém no meio consegue ler ou mudar a sessão, nem os relays.",
      },
      digits: {
        en: "Whoever overhears the nine digits could point them at another computer, so check that the screen you get is theirs. Getting in still takes their Accept.",
        pt: "Quem ouvir os nove dígitos pode apontar eles pra outro computador, então confere se a tela que chegou é da pessoa. Pra entrar, continua precisando do Aceitar dela.",
      },
      click: {
        en: "A session never starts without a click on Accept, the unattended-access password, or an Always allow you gave yourself.",
        pt: "Uma sessão nunca começa sem um clique em Aceitar, a senha de acesso não supervisionado ou um Sempre permitir que você mesmo deu.",
      },
      bar: {
        en: "While someone is in, a red bar says who and how to stop them: Stop sharing, one click away.",
        pt: "Enquanto alguém está dentro, uma barra vermelha diz quem é e como parar: Parar de compartilhar, a um clique.",
      },
      server: {
        en: "Nothing about your sessions goes to a server you don't run. Public relays help two computers find each other, the nine digits included, and carry the encrypted traffic when there's no direct path.",
        pt: "Nada das suas sessões vai pra um servidor que não é seu. Relays públicos ajudam os dois computadores a se acharem, os nove dígitos inclusive, e carregam o tráfego criptografado quando não tem caminho direto.",
      },
    },
  },
};
