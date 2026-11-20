// What a visitor reads around a shared app: while the link opens, while it waits for the host,
// and in the pill over the app.
export default {
  opening: { en: "Opening the link", pt: "Abrindo o link" },
  notice: {
    en: "This page comes from someone's computer, through Hostline. Only go on if you know who sent you the link.",
    pt: "Essa página vem do computador de alguém, pelo Hostline. Só continue se você sabe quem te mandou o link.",
  },
  waiting: {
    en: "Nobody's answering this link",
    pt: "Ninguém tá respondendo esse link",
  },
  waitingText: {
    en: "The computer sharing it is offline, or the link ended. This page keeps trying.",
    pt: "O computador que compartilha tá offline, ou o link acabou. Essa página continua tentando.",
  },
  ended: { en: "This link ended", pt: "Esse link acabou" },
  endedText: {
    en: "Whoever shared it stopped Hostline. Ask them for a new link.",
    pt: "Quem compartilhou parou o Hostline. Pede um link novo pra pessoa.",
  },
  unsupported: {
    en: "This browser can't open Hostline links. A private window may be the reason: try a normal one, in Chrome, Edge, Firefox or Safari.",
    pt: "Esse navegador não abre links do Hostline. Pode ser a janela anônima: tenta numa normal, no Chrome, Edge, Firefox ou Safari.",
  },
  live: { en: "Live", pt: "Ao vivo" },
  reconnecting: { en: "Reconnecting", pt: "Reconectando" },
  ends: { en: "Ends", pt: "Acaba" },
};
