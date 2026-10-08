const fs = require('fs');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

async function createEmendaPdf() {
  const pdfDoc = await PDFDocument.create();
  
  // Page 1
  let page = pdfDoc.addPage([595.28, 841.89]); // A4
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const primaryColor = rgb(0.9, 0.45, 0.1);
  const darkColor = rgb(0.1, 0.12, 0.15);
  const grayColor = rgb(0.35, 0.38, 0.42);
  const lightBg = rgb(0.96, 0.97, 0.98);
  const borderColor = rgb(0.85, 0.88, 0.92);

  // Header Box
  page.drawRectangle({
    x: 40,
    y: 740,
    width: 515.28,
    height: 70,
    color: darkColor
  });

  page.drawText("TERNO MOÇAMBIQUE ESTRELA GUIA", {
    x: 55,
    y: 785,
    size: 13,
    font: fontBold,
    color: primaryColor
  });

  page.drawText("PORTAL DA TRANSPARÊNCIA — EMENDA PARLAMENTAR 2026", {
    x: 55,
    y: 768,
    size: 10,
    font: fontBold,
    color: rgb(1, 1, 1)
  });

  page.drawText("Termo de Fomento nº 998200/2026 | Ofício nº 332/2026 | Parceria com Ministério da Cultura", {
    x: 55,
    y: 752,
    size: 8,
    font: fontRegular,
    color: rgb(0.8, 0.82, 0.85)
  });

  let curY = 720;

  function drawSectionTitle(title, y) {
    page.drawRectangle({
      x: 40,
      y: y - 4,
      width: 5,
      height: 16,
      color: primaryColor
    });
    page.drawText(title, {
      x: 52,
      y: y,
      size: 10.5,
      font: fontBold,
      color: darkColor
    });
    page.drawLine({
      start: { x: 52, y: y - 4 },
      end: { x: 555, y: y - 4 },
      thickness: 0.75,
      color: borderColor
    });
    return y - 18;
  }

  function drawTextParagraph(text, x, y, size = 8.5, maxW = 505) {
    const words = text.split(' ');
    let line = '';
    let currY = y;
    for (const w of words) {
      const testLine = line ? line + ' ' + w : w;
      const width = fontRegular.widthOfTextAtSize(testLine, size);
      if (width > maxW) {
        page.drawText(line, { x, y: currY, size, font: fontRegular, color: grayColor });
        line = w;
        currY -= (size + 3.5);
      } else {
        line = testLine;
      }
    }
    if (line) {
      page.drawText(line, { x, y: currY, size, font: fontRegular, color: grayColor });
      currY -= (size + 5);
    }
    return currY;
  }

  // Identificação do Projeto Box
  curY = drawSectionTitle("DADOS GERAIS DA PARCERIA", curY);
  
  const infoRows = [
    ["Projeto:", "Raízes que Transformam – Fortalecimento da Cultura do Congado e Formação Comunitária"],
    ["Situação Atual:", "Em execução   |   Publicação: Publicado   |   SIAFI: Enviado para o SIAFI"],
    ["Código do Instrumento:", "998200   |   Número da Proposta: 008851/2026"],
    ["Processo:", "01400.007656/2026-51   |   Termo de Fomento: 998200/2026"],
    ["Órgão Concedente:", "Ministério da Cultura (MinC)"],
    ["Organização (OSC):", "Terno Moçambique Estrela Guia   |   CNPJ: 06.207.190/0001-07"],
    ["Valor Global:", "R$ 200.000,00   |   Contrapartida: R$ 0,00"],
    ["Vigência:", "26/06/2026 a 03/07/2027"],
    ["Local de Execução:", "Rua do Dólar, nº 290, Bairro São Jorge, Uberlândia/MG"]
  ];

  for (const [label, val] of infoRows) {
    page.drawText(label, { x: 45, y: curY, size: 8, font: fontBold, color: darkColor });
    page.drawText(val, { x: 155, y: curY, size: 8, font: fontRegular, color: grayColor });
    curY -= 12.5;
  }
  curY -= 6;

  curY = drawSectionTitle("OBJETO DA PARCERIA", curY);
  curY = drawTextParagraph(
    "Realizar oficinas de formação cultural voltadas à valorização dos saberes tradicionais do Congado e apoiar a realização da Festa de Reinado de São Benedito no município de Uberlândia/MG, promovendo a preservação, difusão e fortalecimento das manifestações da cultura popular afro-brasileira. (ExtratoProposta 18)",
    45, curY
  );

  curY = drawSectionTitle("PÚBLICO BENEFICIÁRIO", curY);
  curY = drawTextParagraph(
    "O projeto atenderá diretamente cerca de 60 participantes nas oficinas de formação cultural, nas áreas de cabeleireiro/barbeiro afro, estética afro, percussão e artesanato. Também envolve aproximadamente 8 profissionais na execução das atividades. Indiretamente, estima-se o alcance de 500 pessoas com a realização da Festa de Reinado do Congado, incluindo moradores da comunidade, integrantes de guardas culturais e público em geral. (ExtratoProposta 18)",
    45, curY
  );

  curY = drawSectionTitle("RECURSOS DA PARCERIA & METAS", curY);
  curY = drawTextParagraph(
    "Valor global: R$ 200.000,00 | Valor do repasse: R$ 200.000,00 | Contrapartida financeira: R$ 0,00. O cronograma de desembolso prevê parcela única no valor de R$ 200.000,00 destinada às três metas do projeto:",
    45, curY
  );

  const metas = [
    ["Meta 1 — Produção e Planejamento (R$ 27.000,00):", "Contratação de coordenador geral e produtor cultural para planejamento, organização e acompanhamento técnico."],
    ["Meta 2 — Execução das Atividades Formativas (R$ 138.000,00):", "Oficinas de coroas do Reinado, estética afro, cabeleireiro/barbeiro afro, percussão, materiais e kits lanche."],
    ["Meta 3 — Execução da Festa do Reinado do Congado (R$ 35.000,00):", "Figurinos, intérprete de Libras, transporte, som, tenda, iluminação e suporte à Festa de São Benedito."]
  ];

  for (const [mTitle, mDesc] of metas) {
    page.drawText(mTitle, { x: 50, y: curY, size: 7.5, font: fontBold, color: darkColor });
    curY -= 10;
    curY = drawTextParagraph(mDesc, 55, curY, 7.5, 495);
  }

  // Page 2: Team Remuneration & Legal Base
  const page2 = pdfDoc.addPage([595.28, 841.89]);
  
  // Header page 2
  page2.drawRectangle({
    x: 40,
    y: 770,
    width: 515.28,
    height: 40,
    color: darkColor
  });
  page2.drawText("TERNO MOÇAMBIQUE ESTRELA GUIA — TRANSPARÊNCIA", {
    x: 55,
    y: 792,
    size: 10,
    font: fontBold,
    color: primaryColor
  });
  page2.drawText("Termo de Fomento nº 998200/2026 — Remuneração da Equipe & Base Legal", {
    x: 55,
    y: 780,
    size: 8,
    font: fontRegular,
    color: rgb(1, 1, 1)
  });

  let p2Y = 745;
  p2Y = drawSectionTitle2(page2, fontBold, primaryColor, darkColor, borderColor, "REMUNERAÇÃO DA EQUIPE DE TRABALHO PAGA COM RECURSOS DA PARCERIA", p2Y);

  // Draw Table
  const tableTop = p2Y - 5;
  page2.drawRectangle({
    x: 40,
    y: tableTop - 18,
    width: 515.28,
    height: 18,
    color: rgb(0.9, 0.92, 0.95)
  });

  page2.drawText("Função / Serviço", { x: 50, y: tableTop - 13, size: 8, font: fontBold, color: darkColor });
  page2.drawText("Quantidade / Período", { x: 300, y: tableTop - 13, size: 8, font: fontBold, color: darkColor });
  page2.drawText("Valor Total", { x: 440, y: tableTop - 13, size: 8, font: fontBold, color: darkColor });

  const tableData = [
    ["Coordenador Geral", "6 meses", "R$ 15.000,00"],
    ["Produtor Cultural", "6 meses", "R$ 12.000,00"],
    ["Artesão/Oficineiro — Confecção de Coroas", "6 meses", "R$ 15.000,00"],
    ["Oficineiro — Estética Afro", "6 meses", "R$ 12.000,00"],
    ["Oficineiro — Cabeleireiro e Barbeiro Afro", "6 meses", "R$ 54.000,00"],
    ["Oficineiro — Percussão", "5 meses", "R$ 10.000,00"],
    ["Profissional para preparo de kits lanches", "5 meses", "R$ 8.000,00"],
    ["Intérprete de Libras", "5 unidades/serviços", "R$ 2.000,00"]
  ];

  let rowY = tableTop - 18;
  tableData.forEach((row, idx) => {
    rowY -= 17;
    if (idx % 2 === 1) {
      page2.drawRectangle({
        x: 40,
        y: rowY - 2,
        width: 515.28,
        height: 17,
        color: rgb(0.98, 0.98, 0.99)
      });
    }
    page2.drawLine({
      start: { x: 40, y: rowY - 2 },
      end: { x: 555.28, y: rowY - 2 },
      thickness: 0.5,
      color: borderColor
    });
    page2.drawText(row[0], { x: 50, y: rowY + 3, size: 7.5, font: fontRegular, color: darkColor });
    page2.drawText(row[1], { x: 300, y: rowY + 3, size: 7.5, font: fontRegular, color: grayColor });
    page2.drawText(row[2], { x: 440, y: rowY + 3, size: 7.5, font: fontBold, color: darkColor });
  });

  // Table Total
  rowY -= 18;
  page2.drawRectangle({
    x: 40,
    y: rowY - 2,
    width: 515.28,
    height: 18,
    color: rgb(0.94, 0.95, 0.97)
  });
  page2.drawText("TOTAL REMUNERAÇÃO DA EQUIPE:", { x: 50, y: rowY + 3, size: 8, font: fontBold, color: darkColor });
  page2.drawText("R$ 128.000,00", { x: 440, y: rowY + 3, size: 8, font: fontBold, color: primaryColor });

  p2Y = rowY - 15;
  page2.drawText(
    "Essas informações atendem ao pedido do Ministério da Cultura para divulgação da remuneração da equipe vinculada à execução do objeto e paga com recursos da parceria (Ofício nº 332/2026/MinC).",
    { x: 45, y: p2Y, size: 7, font: fontOblique, color: grayColor }
  );

  p2Y -= 25;
  p2Y = drawSectionTitle2(page2, fontBold, primaryColor, darkColor, borderColor, "BASE LEGAL & DIRETRIZES DE TRANSPARÊNCIA", p2Y);

  const legalText = "As informações desta página são disponibilizadas em atendimento às disposições de transparência aplicáveis às Organizações da Sociedade Civil, especialmente ao art. 11 da Lei nº 13.019/2014, ao Decreto nº 8.726/2016, às diretrizes de rastreabilidade das emendas parlamentares e às orientações do Ministério da Cultura. As informações permanecerão disponíveis desde a celebração da parceria até 180 dias após a apresentação da prestação de contas final.";
  p2Y = drawTextParagraph2(page2, fontRegular, legalText, 45, p2Y, 7.5, 505, grayColor);

  p2Y = drawSectionTitle2(page2, fontBold, primaryColor, darkColor, borderColor, "DADOS DA ORGANIZAÇÃO DA SOCIEDADE CIVIL (OSC)", p2Y);

  const oscInfo = [
    "Organização: Terno Moçambique Estrela Guia | CNPJ: 06.207.190/0001-07",
    "Endereço: Rua do Dólar, nº 290, Bairro São Jorge, Uberlândia/MG — CEP: 38410-168",
    "Presidente: Elenion Eurípedes Campos | Telefone: (34) 99214-1063",
    "Última atualização: 08 de outubro de 2026 (Consulta pública permanente)"
  ];

  for (const line of oscInfo) {
    page2.drawText(line, { x: 45, y: p2Y, size: 7.5, font: fontRegular, color: grayColor });
    p2Y -= 12;
  }

  // Footer on both pages
  for (const p of [page, page2]) {
    p.drawLine({
      start: { x: 40, y: 35 },
      end: { x: 555, y: 35 },
      thickness: 0.5,
      color: borderColor
    });
    p.drawText("Terno Moçambique Estrela Guia — CNPJ: 06.207.190/0001-07 — Portal da Transparência", {
      x: 45,
      y: 24,
      size: 7,
      font: fontRegular,
      color: rgb(0.5, 0.5, 0.5)
    });
  }

  function drawSectionTitle2(p, fBold, colPri, colDark, colBrd, title, y) {
    p.drawRectangle({ x: 40, y: y - 4, width: 5, height: 16, color: colPri });
    p.drawText(title, { x: 52, y: y, size: 9.5, font: fBold, color: colDark });
    p.drawLine({ start: { x: 52, y: y - 4 }, end: { x: 555, y: y - 4 }, thickness: 0.75, color: colBrd });
    return y - 18;
  }

  function drawTextParagraph2(p, fReg, text, x, y, size, maxW, color) {
    const words = text.split(' ');
    let line = '';
    let currY = y;
    for (const w of words) {
      const testLine = line ? line + ' ' + w : w;
      if (fReg.widthOfTextAtSize(testLine, size) > maxW) {
        p.drawText(line, { x, y: currY, size, font: fReg, color });
        line = w;
        currY -= (size + 3.5);
      } else {
        line = testLine;
      }
    }
    if (line) {
      p.drawText(line, { x, y: currY, size, font: fReg, color });
      currY -= (size + 5);
    }
    return currY;
  }

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('public/emenda-parlamentar-2026.pdf', pdfBytes);
  fs.writeFileSync('public/transparencia.pdf', pdfBytes);
  fs.writeFileSync('public/SEI_3158555_Oficio_332.pdf', pdfBytes);
  fs.writeFileSync('public/docs/emenda-parlamentar-2026.pdf', pdfBytes);
  fs.writeFileSync('public/docs/transparencia.pdf', pdfBytes);
  console.log("Created emenda-parlamentar-2026.pdf successfully, pages:", pdfDoc.getPageCount());
}

createEmendaPdf();
