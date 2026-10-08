const fs = require('fs');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

async function createOficioPdf() {
  const pdfDoc = await PDFDocument.create();
  
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const black = rgb(0, 0, 0);
  const darkGray = rgb(0.15, 0.15, 0.15);
  const midGray = rgb(0.4, 0.4, 0.4);
  const borderGray = rgb(0.65, 0.65, 0.65);

  function drawWrapped(page, text, x, y, size, maxWidth, font, color, lineSpacing = 1.35) {
    const cleanText = text.replace(/\r\n/g, ' ').replace(/\n/g, ' ');
    const words = cleanText.split(' ');
    let line = '';
    let currY = y;
    for (const w of words) {
      if (!w) continue;
      const test = line ? line + ' ' + w : w;
      if (font.widthOfTextAtSize(test, size) > maxWidth) {
        page.drawText(line, { x, y: currY, size, font, color });
        line = w;
        currY -= (size * lineSpacing);
      } else {
        line = test;
      }
    }
    if (line) {
      page.drawText(line, { x, y: currY, size, font, color });
      currY -= (size * lineSpacing);
    }
    return currY;
  }

  // ================= PAGE 1 =================
  const page1 = pdfDoc.addPage([595.28, 841.89]);
  const marginX = 52;
  const contentWidth = 491.28;

  let y = 795;
  page1.drawCircle({ x: 297.64, y: y - 8, size: 9, color: rgb(0.15, 0.35, 0.65) });
  page1.drawCircle({ x: 297.64, y: y - 8, size: 6, color: rgb(0.95, 0.8, 0.1) });
  page1.drawCircle({ x: 297.64, y: y - 8, size: 3, color: rgb(0.15, 0.35, 0.65) });
  
  y -= 26;
  const headerLines = [
    "Ministério da Cultura",
    "Secretaria de Cidadania e Diversidade Cultural",
    "Diretoria da Promoção das Culturas Tradicionais e Populares",
    "Coordenação-Geral de Parcerias das Culturas Tradicionais e Populares",
    "Coordenação de Acompanhamento das Parcerias",
    "Esplanada dos Ministérios, Bloco B, - Bairro Zona Cívico Administrativa, Brasília/DF, CEP 70068-900"
  ];

  headerLines.forEach((hl, idx) => {
    const sz = idx === 0 ? 9.5 : (idx === headerLines.length - 1 ? 6.5 : 8);
    const fnt = idx === 0 ? fontBold : fontRegular;
    const w = fnt.widthOfTextAtSize(hl, sz);
    page1.drawText(hl, { x: (595.28 - w) / 2, y, size: sz, font: fnt, color: darkGray });
    y -= (sz + 2.5);
  });

  y -= 14;
  page1.drawText("OFÍCIO Nº 332/2026/COAPS/CGPCTP/DPCTP/SCDC/MinC", {
    x: marginX,
    y,
    size: 8.5,
    font: fontBold,
    color: black
  });
  const dataTxt = "Brasília, na data da assinatura eletrônica.";
  const dataW = fontRegular.widthOfTextAtSize(dataTxt, 8.5);
  page1.drawText(dataTxt, {
    x: marginX + contentWidth - dataW,
    y,
    size: 8.5,
    font: fontRegular,
    color: darkGray
  });

  y -= 24;
  page1.drawText("Ao Senhor,", { x: marginX, y, size: 8, font: fontRegular, color: black });
  y -= 11;
  page1.drawText("ELENION EURIPEDES CAMPOS", { x: marginX, y, size: 8.5, font: fontBold, color: black });
  y -= 11;
  page1.drawText("Presidente", { x: marginX, y, size: 8, font: fontRegular, color: black });
  y -= 11;
  page1.drawText("TERNO MOÇAMBIQUE ESTRELA GUIA", { x: marginX, y, size: 8, font: fontRegular, color: black });
  y -= 11;
  page1.drawText("femininal@hotmail.com", { x: marginX, y, size: 8, font: fontRegular, color: black });

  y -= 22;
  const assuntoTxt = "Assunto: Adequação dos procedimentos de Transparência do Termo de Fomento nº 998200/2026.";
  page1.drawText(assuntoTxt, { x: marginX + 30, y, size: 8.5, font: fontBold, color: black });

  y -= 18;
  const boxTop = y;
  const boxHeight = 78;
  page1.drawRectangle({
    x: marginX,
    y: boxTop - boxHeight,
    width: contentWidth,
    height: boxHeight,
    borderColor: borderGray,
    borderWidth: 0.75
  });

  page1.drawLine({
    start: { x: marginX, y: boxTop - 18 },
    end: { x: marginX + contentWidth, y: boxTop - 18 },
    thickness: 0.5,
    color: borderGray
  });
  page1.drawLine({
    start: { x: marginX, y: boxTop - 34 },
    end: { x: marginX + contentWidth, y: boxTop - 34 },
    thickness: 0.5,
    color: borderGray
  });
  page1.drawLine({
    start: { x: marginX, y: boxTop - 64 },
    end: { x: marginX + contentWidth, y: boxTop - 64 },
    thickness: 0.5,
    color: borderGray
  });

  page1.drawLine({
    start: { x: marginX + 210, y: boxTop },
    end: { x: marginX + 210, y: boxTop - 34 },
    thickness: 0.5,
    color: borderGray
  });
  page1.drawLine({
    start: { x: marginX + 350, y: boxTop },
    end: { x: marginX + 350, y: boxTop - 18 },
    thickness: 0.5,
    color: borderGray
  });
  page1.drawLine({
    start: { x: marginX + 210, y: boxTop - 64 },
    end: { x: marginX + 210, y: boxTop - boxHeight },
    thickness: 0.5,
    color: borderGray
  });

  page1.drawText("Processo SEI: 01400.007656/2026-51", { x: marginX + 4, y: boxTop - 12, size: 7, font: fontBold, color: black });
  page1.drawText("Origem: Emenda Parlamentar", { x: marginX + 214, y: boxTop - 12, size: 7, font: fontRegular, color: black });
  page1.drawText("Termo de Fomento: 998200/2026", { x: marginX + 354, y: boxTop - 12, size: 7, font: fontRegular, color: black });

  page1.drawText("Proponente: TERNO MOCAMBIQUE ESTRELA GUIA", { x: marginX + 4, y: boxTop - 27, size: 7, font: fontBold, color: black });
  page1.drawText("CNPJ: 06.207.190/0001-07", { x: marginX + 214, y: boxTop - 27, size: 7, font: fontBold, color: black });

  const objTxt = "Objeto: Realizar oficinas de formação cultural voltadas à valorização dos saberes tradicionais do Congado e apoiar a realização da Festa de Reinado de São Benedito no município de Uberlândia/MG, promovendo a preservação, difusão e fortalecimento das manifestações da cultura popular afro-brasileira.";
  drawWrapped(page1, objTxt, marginX + 4, boxTop - 44, 6.5, contentWidth - 8, fontRegular, darkGray, 1.35);

  page1.drawText("Valor do repasse: R$ 200.000,00", { x: marginX + 4, y: boxTop - 73, size: 7, font: fontBold, color: black });
  page1.drawText("Vigência: 26/06/2026 a 03/07/2027", { x: marginX + 214, y: boxTop - 73, size: 7, font: fontBold, color: black });

  y = boxTop - boxHeight - 20;

  page1.drawText("Prezado Sr. Presidente,", { x: marginX + 50, y, size: 8, font: fontBold, color: black });
  y -= 16;

  const p1 = "1.       Em atenção à Declaração de Transparência firmada em 09 de abril de 2026, por meio da qual essa Instituição se comprometeu a disponibilizar as informações relativas às parcerias celebradas com a Administração Pública em seu sítio eletrônico oficial (www.mocambiqueestrelag.wixsite.com/my-site-4/sobre), informa-se que não foi possível comprovar o cumprimento das obrigações legais de transparência ativa das Organizações da Sociedade Civil (OSCs) que recebem emendas parlamentares, de acordo com o Marco Regulatório do Terceiro Setor (MROSC - Lei nº 13.019/2014) e as recentes diretrizes estabelecidas pelo Supremo Tribunal Federal (STF) e pela Controladoria-Geral da União (CGU).";
  y = drawWrapped(page1, p1, marginX, y, 7.5, contentWidth, fontRegular, black, 1.4);
  y -= 6;

  const p2 = "2.       Nesse sentido, a legislação exige que a OSC que utilize recursos públicos mantenha as informações publicadas na internet em seu próprio site oficial institucional de forma acessível e estruturada, nos termos do art. 11 da Lei nº 13.019/2014 e do Decreto nº 8.726/2016, observando os seguintes requisitos:";
  y = drawWrapped(page1, p2, marginX, y, 7.5, contentWidth, fontRegular, black, 1.4);
  y -= 4;

  const itemA = "a) Publicação integral, clara e atualizada das informações relativas a todos os instrumentos oriundos de emendas parlamentares e recursos recebidos, incluindo:";
  page1.drawText(itemA, { x: marginX + 30, y, size: 7.5, font: fontRegular, color: black });
  y -= 13;

  const bullets = [
    "•  identificação correta do código do instrumento (EX: Termo de Fomento nº 998200/2026);",
    "•  órgão responsável;",
    "•  objeto da parceria;",
    "•  valores totais e liberados;",
    "•  situação da prestação de contas; e",
    "•  valor total da remuneração da equipe de trabalho, as funções que seus integrantes desempenham e a remuneração prevista para o respectivo exercício, quando vinculados à execução do objeto e pagos com recursos da parceria."
  ];

  for (const b of bullets) {
    if (b.length > 80) {
      y = drawWrapped(page1, b, marginX + 45, y, 7.5, contentWidth - 45, fontRegular, black, 1.35);
    } else {
      page1.drawText(b, { x: marginX + 45, y, size: 7.5, font: fontRegular, color: black });
      y -= 11.5;
    }
  }
  y -= 4;

  const itemB = "b) A manutenção dessas informações deverá observar o prazo previsto no art. 80 do Decreto nº 8.726/2016, ou seja, desde a celebração da parceria até 180 (cento e oitenta) dias após a apresentação da prestação de contas final.";
  y = drawWrapped(page1, itemB, marginX + 30, y, 7.5, contentWidth - 30, fontRegular, black, 1.35);
  y -= 6;

  const p3 = "3.       Considerando a necessidade de regularizar os procedimentos de execução do projeto e assegurar a transparência das informações, solicita-se o envio de declaração do cumprimento das obrigações assumidas no";
  y = drawWrapped(page1, p3, marginX, y, 7.5, contentWidth, fontRegular, black, 1.35);

  page1.drawText("Ofício 332 (3158555)", { x: 180, y: 25, size: 7, font: fontRegular, color: rgb(0.6, 0.6, 0.6) });
  page1.drawText("SEI 01400.007656/2026-51 / pg. 1", { x: 300, y: 25, size: 7, font: fontRegular, color: rgb(0.6, 0.6, 0.6) });

  // ================= PAGE 2 =================
  const page2 = pdfDoc.addPage([595.28, 841.89]);
  let y2 = 800;

  const p3cont = "prazo improrrogável de 30 (trinta) dias, informando o endereço do sítio eletrônico oficial da OSC, comprovando a publicação integral das informações referentes ao recebimento de recursos públicos oriundos de emendas parlamentares de qualquer modalidade.";
  y2 = drawWrapped(page2, p3cont, marginX, y2, 7.5, contentWidth, fontRegular, black, 1.4);
  y2 -= 8;

  const p4 = "4.       Ressalta-se ainda que as entidades que não proporcionem transparência adequada ou que não divulguem as informações requeridas, nos termos do Relatório da Controladoria-Geral da União (CGU) estão sujeitas à suspensão dos repasses de recursos e à inscrição dessas entidades no Cadastro de Entidades Privadas Sem Fins Lucrativos Impedidas (CEPIM) e no Cadastro Nacional de Empresas Inidôneas e Suspensas (CEIS), pelos órgãos competentes do Poder Executivo.";
  y2 = drawWrapped(page2, p4, marginX, y2, 7.5, contentWidth, fontRegular, black, 1.4);
  y2 -= 8;

  const p5 = "5.       Por fim, informa-se que esta Secretaria de Cidadania e Diversidade Cultural/SCDC fica à disposição para esclarecimentos complementares, pelo endereço eletrônico dpcp@cultura.gov.br ou pelo telefone (61) 2024-2579 (whatsapp).";
  y2 = drawWrapped(page2, p5, marginX, y2, 7.5, contentWidth, fontRegular, black, 1.4);
  y2 -= 18;

  page2.drawText("Atenciosamente,", { x: marginX + 60, y2, size: 8, font: fontRegular, color: black });
  y2 -= 40;

  const signLines = [
    "(datado e assinado eletronicamente)",
    "SANDRA CIPRIANO CHAVES",
    "Coordenadora-Geral de Parcerias das Culturas Tradicionais e Populares",
    "CGPCTP/DPCTP/SCDC/MinC"
  ];
  signLines.forEach((sl, i) => {
    const sz = i === 1 ? 8.5 : 7.5;
    const f = i === 0 ? fontOblique : (i === 1 ? fontBold : fontRegular);
    const col = i === 0 ? midGray : black;
    const w = f.widthOfTextAtSize(sl, sz);
    page2.drawText(sl, { x: (595.28 - w) / 2, y: y2, size: sz, font: f, color: col });
    y2 -= (sz + 3);
  });

  y2 -= 15;
  page2.drawRectangle({
    x: marginX,
    y: y2 - 16,
    width: contentWidth,
    height: 16,
    borderColor: borderGray,
    borderWidth: 0.5,
    color: rgb(0.98, 0.98, 0.98)
  });
  page2.drawText("Anexos: Declaração de Transparência (SEI 2843970).", {
    x: marginX + 5,
    y: y2 - 11,
    size: 7,
    font: fontRegular,
    color: black
  });

  y2 -= 35;
  const seiBoxHeight = 44;
  page2.drawRectangle({
    x: marginX,
    y: y2 - seiBoxHeight,
    width: contentWidth,
    height: seiBoxHeight,
    borderColor: borderGray,
    borderWidth: 0.75
  });

  page2.drawRectangle({
    x: marginX + 5,
    y: y2 - 35,
    width: 38,
    height: 26,
    color: rgb(0.9, 0.94, 0.98)
  });
  page2.drawText("sei!", {
    x: marginX + 9,
    y: y2 - 23,
    size: 13,
    font: fontBold,
    color: rgb(0.1, 0.35, 0.65)
  });
  page2.drawText("assinatura eletrônica", {
    x: marginX + 7,
    y: y2 - 32,
    size: 4,
    font: fontRegular,
    color: rgb(0.2, 0.4, 0.7)
  });

  const seiText = "Documento assinado eletronicamente por Sandra Cipriano Chaves, Coordenador (a)-Geral, em 29/09/2026, às 13:51, conforme horário oficial de Brasília, com fundamento no art. 30, inciso II, da Portaria nº 26/2016, de 01/04/2016, do Ministério da Cultura, Publicada no Diário Oficial da União de 04/04/2016.";
  drawWrapped(page2, seiText, marginX + 48, y2 - 12, 6.5, contentWidth - 52, fontRegular, darkGray, 1.3);

  y2 -= (seiBoxHeight + 15);

  page2.drawRectangle({
    x: marginX + 5,
    y: y2 - 45,
    width: 45,
    height: 45,
    borderColor: black,
    borderWidth: 1
  });
  page2.drawRectangle({
    x: marginX + 11,
    y: y2 - 25,
    width: 12,
    height: 12,
    color: black
  });
  page2.drawRectangle({
    x: marginX + 32,
    y: y2 - 25,
    width: 12,
    height: 12,
    color: black
  });
  page2.drawRectangle({
    x: marginX + 11,
    y: y2 - 39,
    width: 12,
    height: 12,
    color: black
  });

  const confText = "A autenticidade deste documento pode ser conferida no site https://sei.cultura.gov.br/sei/controlador_externo.php?acao=documento_conferir&id_orgao_acesso_externo=0, informando o código verificador 3158555 e o código CRC 42241DE8.";
  drawWrapped(page2, confText, marginX + 58, y2 - 14, 6.5, contentWidth - 62, fontRegular, darkGray, 1.4);

  y2 -= 65;
  page2.drawLine({
    start: { x: marginX, y: y2 },
    end: { x: marginX + contentWidth, y: y2 },
    thickness: 0.5,
    color: borderGray
  });
  page2.drawText("Referência: Caso responda este Ofício, indicar expressamente o Processo nº 01400.007656/2026-51", {
    x: marginX,
    y: y2 - 12,
    size: 6.5,
    font: fontRegular,
    color: darkGray
  });
  const seiRef = "SEI nº 3158555";
  const seiRefW = fontRegular.widthOfTextAtSize(seiRef, 6.5);
  page2.drawText(seiRef, {
    x: marginX + contentWidth - seiRefW,
    y: y2 - 12,
    size: 6.5,
    font: fontRegular,
    color: darkGray
  });

  page2.drawText("Ofício 332 (3158555)", { x: 180, y: 25, size: 7, font: fontRegular, color: rgb(0.6, 0.6, 0.6) });
  page2.drawText("SEI 01400.007656/2026-51 / pg. 2", { x: 300, y: 25, size: 7, font: fontRegular, color: rgb(0.6, 0.6, 0.6) });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('public/SEI_3158555_Oficio_332.pdf', pdfBytes);
  fs.writeFileSync('public/SEI_3158555_Oficio_332 (1).pdf', pdfBytes);
  fs.writeFileSync('public/oficio-332.pdf', pdfBytes);
  fs.writeFileSync('public/emenda-parlamentar-2026.pdf', pdfBytes);
  fs.writeFileSync('public/docs/SEI_3158555_Oficio_332.pdf', pdfBytes);
  fs.writeFileSync('public/docs/emenda-parlamentar-2026.pdf', pdfBytes);
  console.log("Created official Ofício 332 PDF successfully!");
}

createOficioPdf();
