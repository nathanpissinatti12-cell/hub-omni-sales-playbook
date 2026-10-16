// Gerador de .xlsx (Excel) com várias abas, sem biblioteca externa.
//
// Um .xlsx é um ZIP de arquivos XML. O que está aqui é o mínimo que o Excel
// aceita: o mapa de tipos, as relações, a planilha de cada aba e o índice do
// ZIP. Escrevemos à mão em vez de instalar SheetJS ou ExcelJS porque é a única
// coisa do projeto que precisaria de uma dependência nova — e aqui o escopo é
// pequeno e fechado: texto e número, sem fórmula, estilo ou data.
//
// O ZIP é gravado sem compressão (método "store"). Planilha de indicador tem
// alguns milhares de células, então o arquivo fica na casa das dezenas de KB —
// não vale implementar deflate por isso.

export type Celula = string | number | null;

export type Aba = {
  /** Nome da aba. Excel não aceita : \ / ? * [ ] e corta em 31 caracteres. */
  nome: string;
  /** Primeira linha é o cabeçalho; as demais, os dados. */
  linhas: Celula[][];
};

function xml(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Nome de aba que o Excel aceita. Caractere proibido vira hífen e o nome é
 * cortado em 31 — o Excel recusa o arquivo inteiro se passar disso, em vez de
 * só renomear a aba.
 */
export function nomeDeAba(nome: string): string {
  return nome.replace(/[:\\/?*[\]]/g, "-").slice(0, 31) || "Planilha";
}

/** Referência de célula no estilo A1, B1, ... AA1. */
function referencia(coluna: number, linha: number): string {
  let n = coluna + 1;
  let letras = "";
  while (n > 0) {
    const resto = (n - 1) % 26;
    letras = String.fromCharCode(65 + resto) + letras;
    n = Math.floor((n - resto) / 26);
  }
  return `${letras}${linha + 1}`;
}

function planilhaXml(aba: Aba): string {
  const linhas = aba.linhas
    .map((celulas, i) => {
      const cs = celulas
        .map((valor, j) => {
          if (valor === null || valor === "") return "";
          const ref = referencia(j, i);
          if (typeof valor === "number") {
            return `<c r="${ref}"><v>${valor}</v></c>`;
          }
          // inlineStr evita a tabela de strings compartilhadas: um arquivo a
          // menos no ZIP e nenhum índice pra manter em sincronia.
          return `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${xml(valor)}</t></is></c>`;
        })
        .join("");
      return `<row r="${i + 1}">${cs}</row>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${linhas}</sheetData></worksheet>`;
}

// --------------------------------------------------------------------------
// ZIP
// --------------------------------------------------------------------------

const TABELA_CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(dados: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < dados.length; i++) c = TABELA_CRC[(c ^ dados[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

type ArquivoZip = { nome: string; dados: Uint8Array };

function u16(v: number): number[] {
  return [v & 0xff, (v >>> 8) & 0xff];
}

function u32(v: number): number[] {
  return [v & 0xff, (v >>> 8) & 0xff, (v >>> 16) & 0xff, (v >>> 24) & 0xff];
}

/** ZIP sem compressão, com os campos que o Excel exige para abrir o arquivo. */
function zipar(arquivos: ArquivoZip[]): ArrayBuffer {
  const locais: number[] = [];
  const central: number[] = [];
  let offset = 0;

  for (const a of arquivos) {
    const nome = Array.from(new TextEncoder().encode(a.nome));
    const crc = crc32(a.dados);
    const cabecalho = [
      ...u32(0x04034b50),
      ...u16(20), // versão mínima
      ...u16(0),
      ...u16(0), // método 0 = armazenado
      ...u16(0),
      ...u16(0), // data/hora: zeradas de propósito, o Excel não usa
      ...u32(crc),
      ...u32(a.dados.length),
      ...u32(a.dados.length),
      ...u16(nome.length),
      ...u16(0),
      ...nome,
    ];
    locais.push(...cabecalho, ...Array.from(a.dados));

    central.push(
      ...u32(0x02014b50),
      ...u16(20),
      ...u16(20),
      ...u16(0),
      ...u16(0),
      ...u16(0),
      ...u16(0),
      ...u32(crc),
      ...u32(a.dados.length),
      ...u32(a.dados.length),
      ...u16(nome.length),
      ...u16(0),
      ...u16(0),
      ...u16(0),
      ...u16(0),
      ...u32(0),
      ...u32(offset),
      ...nome
    );

    offset = locais.length;
  }

  const fim = [
    ...u32(0x06054b50),
    ...u16(0),
    ...u16(0),
    ...u16(arquivos.length),
    ...u16(arquivos.length),
    ...u32(central.length),
    ...u32(locais.length),
    ...u16(0),
  ];

  // Monta sobre um ArrayBuffer próprio: é o que o Blob do navegador aceita sem
  // conversão, e deixa o tipo fechado (Uint8Array sozinho pode estar sobre
  // memória compartilhada, que o Blob recusa).
  const bytes = [...locais, ...central, ...fim];
  const buffer = new ArrayBuffer(bytes.length);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}

/**
 * Monta o .xlsx. Devolve os bytes — quem chama decide se vira download no
 * navegador ou arquivo em disco.
 */
export function gerarXlsx(abas: Aba[]): ArrayBuffer {
  const codificar = (s: string) => new TextEncoder().encode(s);
  const nomes = abas.map((a, i) => ({ ...a, nome: nomeDeAba(a.nome) || `Aba ${i + 1}` }));

  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>${nomes
    .map(
      (_, i) =>
        `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`
    )
    .join("")}</Types>`;

  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`;

  const workbook = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${nomes
    .map((a, i) => `<sheet name="${xml(a.nome)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`)
    .join("")}</sheets></workbook>`;

  const workbookRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${nomes
    .map(
      (_, i) =>
        `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`
    )
    .join("")}</Relationships>`;

  return zipar([
    { nome: "[Content_Types].xml", dados: codificar(contentTypes) },
    { nome: "_rels/.rels", dados: codificar(rels) },
    { nome: "xl/workbook.xml", dados: codificar(workbook) },
    { nome: "xl/_rels/workbook.xml.rels", dados: codificar(workbookRels) },
    ...nomes.map((a, i) => ({
      nome: `xl/worksheets/sheet${i + 1}.xml`,
      dados: codificar(planilhaXml(a)),
    })),
  ]);
}
