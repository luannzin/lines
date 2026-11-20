export default {
  meta: {
    title: {
      en: "Deskline: remote desktop with no server to run",
      pt: "Deskline: acesso remoto sem servidor pra rodar",
    },
    description: {
      en: "Every computer has a code. Paste someone's code, they accept, and you see their screen. Free and open source for Windows, macOS and Linux.",
      pt: "Todo computador tem um código. Você cola o código de alguém, a pessoa aceita e você vê a tela dela. Grátis e de código aberto, pra Windows, macOS e Linux.",
    },
    ogLocale: { en: "en_US", pt: "pt_BR" },
  },
  hero: {
    line: {
      en: "Remote desktop with no server to run.",
      pt: "Acesso remoto sem servidor nenhum pra rodar.",
    },
    lead: {
      en: "Every computer has a code. Paste someone's code, they accept, and you see their screen. With their OK you drive their mouse and keyboard, move files and hear their sound, on the same network or across the internet.",
      pt: "Todo computador tem um código. Você cola o código de alguém, a pessoa aceita e você vê a tela dela. Com o OK dela, você usa o mouse e o teclado, passa arquivos e ouve o som, na mesma rede ou pela internet.",
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
        en: "Click Copy code and send the code to whoever is helping you.",
        pt: "Clica em Copiar código e manda o código pra quem está te ajudando.",
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
        en: "One file. Run it as is, or click Install Deskline on this computer to install it for everyone, with its service.",
        pt: "Um arquivo só. Roda ele direto, ou clica em Instalar o Deskline neste computador pra instalar pra todo mundo, com o serviço.",
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
        en: "Drag Deskline into Applications. Allow Screen Recording and Accessibility when it asks.",
        pt: "Arrasta o Deskline pra Aplicativos. Permite Gravação de Tela e Acessibilidade quando ele pedir.",
      },
      first: {
        en: "The first time, macOS won't open it: go to System Settings, Privacy & Security, and click Open Anyway. The build isn't signed with a paid certificate yet.",
        pt: "Na primeira vez o macOS não abre: vai em Ajustes do Sistema, Privacidade e Segurança, e clica em Abrir Mesmo Assim. O Deskline ainda não é assinado com um certificado pago.",
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
      en: "Two copies of Deskline's window, made with this page and connected for real through your browser. Copy the code in the first one and paste it in the second.",
      pt: "Duas cópias da janela do Deskline, feitas nesta página e conectadas de verdade pelo seu navegador. Copia o código da primeira e cola na segunda.",
    },
    you: { en: "You", pt: "Você" },
    helper: { en: "Whoever is helping you", pt: "Quem está te ajudando" },
    same: {
      en: "Both windows are on this computer, so the link is as good as it gets. Across the internet it reaches less far and warms less.",
      pt: "As duas janelas estão neste computador, então a ligação é a melhor possível. Pela internet ela vai menos longe e esquenta menos.",
    },
  },
  inside: {
    title: { en: "Once you're in", pt: "Depois de entrar" },
    lead: {
      en: "It started as the smallest thing that could replace AnyDesk for helping family and friends. Then it needed the rest of what makes AnyDesk usable day to day.",
      pt: "Começou como a menor coisa que desse pra trocar o AnyDesk na hora de ajudar família e amigos. Depois precisou do resto do que faz o AnyDesk ser usável no dia a dia.",
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
          pt: "O modo Nativo manda a tela da pessoa no tamanho dela, até 4K, e na taxa de atualização dela, até 240 quadros por segundo. Quando a ligação não aguenta, chegam menos quadros; a imagem nunca diminui.",
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
          en: "A 52-character code. Nobody types it: copy, paste, and it's saved in Recent under a name you choose. There's no central server handing out short numbers, which is the point.",
          pt: "Um código de 52 caracteres. Ninguém digita: copia, cola, e ele fica salvo em Recentes com o nome que você escolher. Não tem servidor central distribuindo números curtos, e a ideia é essa.",
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
          en: "Install Deskline on this computer",
          pt: "Instalar o Deskline neste computador",
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
      en: "Not there yet: session recording, Wake-on-LAN, TCP tunnels and phone apps.",
      pt: "Ainda não tem: gravação de sessão, Wake-on-LAN, túneis TCP e app de celular.",
    },
  },
  safe: {
    title: { en: "Who can get in", pt: "Quem consegue entrar" },
    rows: {
      key: {
        en: "The code is the computer's public key. The connection is encrypted end to end with it, so you reach the computer whose code you pasted and nobody in between can read or change the session, the relays included.",
        pt: "O código é a chave pública do computador. A conexão é criptografada de ponta a ponta com ela, então você chega no computador do código que colou e ninguém no meio consegue ler ou mudar a sessão, nem os relays.",
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
        en: "Nothing about your sessions goes to a server you don't run. Public relays help two computers find each other and carry the encrypted traffic when there's no direct path.",
        pt: "Nada das suas sessões vai pra um servidor que não é seu. Relays públicos ajudam os dois computadores a se acharem e carregam o tráfego criptografado quando não tem caminho direto.",
      },
    },
  },
};
