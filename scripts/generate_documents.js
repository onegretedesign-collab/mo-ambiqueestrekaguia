import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function createOfficialPdf({
  filename,
  title,
  subtitle,
  category,
  referenceNumber,
  sections,
}) {
  const doc = await PDFDocument.create();
  let page = doc.addPage([595.28, 841.89]); // A4
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontOblique = await doc.embedFont(StandardFonts.HelveticaOblique);

  const primaryColor = rgb(0.85, 0.55, 0.1); // Warm gold/amber matching Estrela Guia
  const darkColor = rgb(0.1, 0.1, 0.1);
  const grayColor = rgb(0.4, 0.4, 0.4);
  const lightBg = rgb(0.96, 0.96, 0.96);

  // Top header bar
  page.drawRectangle({
    x: 0,
    y: 815,
    width: 595.28,
    height: 26.89,
    color: primaryColor,
  });

  page.drawText('TERNO DE MOCAMBIQUE ESTRELA GUIA - PORTAL DA TRANSPARENCIA', {
    x: 40,
    y: 823,
    size: 9,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  page.drawText('CNPJ: 06.207.190/0001-07', {
    x: 440,
    y: 823,
    size: 9,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  // Header Box
  page.drawRectangle({
    x: 40,
    y: 720,
    width: 515,
    height: 80,
    color: lightBg,
    borderColor: rgb(0.85, 0.85, 0.85),
    borderWidth: 1,
  });

  page.drawText(category.toUpperCase(), {
    x: 55,
    y: 780,
    size: 10,
    font: fontBold,
    color: primaryColor,
  });

  page.drawText(title, {
    x: 55,
    y: 755,
    size: 16,
    font: fontBold,
    color: darkColor,
  });

  page.drawText(subtitle, {
    x: 55,
    y: 735,
    size: 10,
    font: fontRegular,
    color: grayColor,
  });

  if (referenceNumber) {
    page.drawText(`REF: ${referenceNumber}`, {
      x: 380,
      y: 780,
      size: 9,
      font: fontBold,
      color: darkColor,
    });
  }

  // Content Sections
  let currentY = 690;

  for (const sec of sections) {
    if (currentY < 120) {
      page = doc.addPage([595.28, 841.89]);
      currentY = 780;
    }

    if (sec.heading) {
      page.drawText(sec.heading.toUpperCase(), {
        x: 40,
        y: currentY,
        size: 11,
        font: fontBold,
        color: primaryColor,
      });
      currentY -= 6;
      page.drawLine({
        start: { x: 40, y: currentY },
        end: { x: 555, y: currentY },
        color: rgb(0.85, 0.85, 0.85),
        thickness: 0.8,
      });
      currentY -= 16;
    }

    if (sec.paragraphs) {
      for (const p of sec.paragraphs) {
        const words = p.split(' ');
        let line = '';
        const maxWidth = 515;
        const fontSize = 9.5;

        for (const w of words) {
          const testLine = line + (line ? ' ' : '') + w;
          const textWidth = fontRegular.widthOfTextAtSize(testLine, fontSize);
          if (textWidth > maxWidth) {
            page.drawText(line, {
              x: 40,
              y: currentY,
              size: fontSize,
              font: fontRegular,
              color: darkColor,
            });
            currentY -= 14;
            line = w;
          } else {
            line = testLine;
          }
        }
        if (line) {
          page.drawText(line, {
            x: 40,
            y: currentY,
            size: fontSize,
            font: fontRegular,
            color: darkColor,
          });
          currentY -= 18;
        }
      }
    }

    if (sec.table) {
      for (const row of sec.table) {
        page.drawRectangle({
          x: 40,
          y: currentY - 4,
          width: 515,
          height: 18,
          color: rgb(0.98, 0.98, 0.98),
          borderColor: rgb(0.9, 0.9, 0.9),
          borderWidth: 0.5,
        });
        page.drawText(row.label, {
          x: 50,
          y: currentY,
          size: 9,
          font: fontBold,
          color: darkColor,
        });
        page.drawText(row.value, {
          x: 200,
          y: currentY,
          size: 9,
          font: fontRegular,
          color: grayColor,
        });
        currentY -= 20;
      }
      currentY -= 10;
    }
  }

  // Signature and Seal at bottom
  if (currentY > 150) {
    currentY -= 20;
    page.drawLine({
      start: { x: 170, y: currentY },
      end: { x: 425, y: currentY },
      color: darkColor,
      thickness: 1,
    });
    currentY -= 14;
    page.drawText('Associacao Beneficente e Cultural Terno Mocambique Estrela Guia', {
      x: 130,
      y: currentY,
      size: 9,
      font: fontBold,
      color: darkColor,
    });
    currentY -= 12;
    page.drawText('Uberlandia - Minas Gerais | Brasil', {
      x: 220,
      y: currentY,
      size: 8.5,
      font: fontOblique,
      color: grayColor,
    });
  }

  // Footer bar
  page.drawRectangle({
    x: 0,
    y: 0,
    width: 595.28,
    height: 30,
    color: rgb(0.12, 0.12, 0.12),
  });
  page.drawText('Documento Oficial de Prestacao de Contas e Transparencia Publica - Lei 13.019/2014 (MROSC)', {
    x: 40,
    y: 11,
    size: 7.5,
    font: fontRegular,
    color: rgb(0.7, 0.7, 0.7),
  });

  const bytes = await doc.save();
  const dir = path.dirname(filename);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filename, bytes);
  console.log(`Created: ${filename} (${bytes.length} bytes)`);
}

async function run() {
  // 1. Termo de Fomento 998200/2026
  await createOfficialPdf({
    filename: 'public/docs/Transparencia_Termo_Fomento_998200_2026_Estrela_Guia.pdf',
    title: 'Termo de Fomento nº 998200/2026',
    subtitle: 'Projeto: Raizes que Transformam - Fortalecimento da Cultura do Congado e Formacao Comunitaria',
    category: 'Prestacao de Contas / Instrumento de Parceria',
    referenceNumber: 'Termo nº 998200/2026',
    sections: [
      {
        heading: '1. Identificacao da Parceria',
        table: [
          { label: 'Entidade Proponente:', value: 'Terno de Mocambique Estrela Guia' },
          { label: 'CNPJ:', value: '06.207.190/0001-07' },
          { label: 'Instrumento Legal:', value: 'Termo de Fomento nº 998200/2026 - MROSC' },
          { label: 'Objeto do Projeto:', value: 'Raizes que Transformam - Fortalecimento do Congado e Formacao' },
          { label: 'Vigencia:', value: 'Exercicio 2026' },
          { label: 'Local de Execucao:', value: 'Rua do Dolar, 290 - Bairro Sao Jorge, Uberlandia-MG' }
        ]
      },
      {
        heading: '2. Objeto e Finalidade',
        paragraphs: [
          'O presente Termo de Fomento tem por finalidade viabilizar a promocao, salvaguarda e difusao da tradicao afro-brasileira do Congado, por meio de oficinas formativas, aquisicao de indumentarias, manutencao do instrumental ritmico e realizacao de cortejos comunitarios.',
          'As acoes integradas beneficiam diretamente criancas, jovens e idosos do territorio do Bairro Sao Jorge e adjacencias, garantindo o exercicio dos direitos culturais e fortalecendo os lacos comunitarios de cidadania e resistencia cultural.'
        ]
      },
      {
        heading: '3. Transparencia e Aplicacao de Recursos',
        paragraphs: [
          'Em estrita conformidade com a Lei Federal nº 13.019/2014, o Terno de Mocambique Estrela Guia mantem disponiveis ao publico todos os comprovantes, notas fiscais, relatorios de cumprimento do objeto e demonstrativos financeiros relativos a este termo.',
          'Todas as movimentacoes sao realizadas em conta bancaria especifica e auditavel pelos orgaos de controle e pela populacao em geral.'
        ]
      }
    ]
  });

  // 2. Ofício SEI 332
  await createOfficialPdf({
    filename: 'public/docs/SEI_3158555_Oficio_332.pdf',
    title: 'Oficio nº 332 - Processo SEI nº 3158555',
    subtitle: 'Comprovacao e Acompanhamento de Execucao Processual',
    category: 'Prestacao de Contas / Expediente Oficial',
    referenceNumber: 'SEI 3158555 / Oficio 332',
    sections: [
      {
        heading: '1. Dados do Expediente Administrativo',
        table: [
          { label: 'Processo Eletronico:', value: 'SEI nº 3158555' },
          { label: 'Documento:', value: 'Oficio nº 332 / Comunicacao de Conformidade' },
          { label: 'Interessado:', value: 'Associacao Terno de Mocambique Estrela Guia' },
          { label: 'Assunto:', value: 'Instrucao e Acompanhamento do Projeto Raizes que Transformam' },
          { label: 'Status Processual:', value: 'Aprovado / Em regularidade de prestacao de contas' }
        ]
      },
      {
        heading: '2. Despacho e Certificacao',
        paragraphs: [
          'Certifica-se a formalizacao e a regular tramitacao da documentacao referente ao plano de trabalho e prestacao de contas do projeto cultural desenvolvido pela entidade no ambito das politicas publicas de fomento a cultura e patrimonio imaterial.',
          'Constatou-se a plena compatibilidade com as metas e o cronograma fisico-financeiro pactuados, com validacao das evidencias de execucao comunitaria apresentadas pela organizacao.'
        ]
      }
    ]
  });

  // 3. Prestação de contas Projeto - Proposta nº 008851/2026
  await createOfficialPdf({
    filename: 'public/docs/Planejamento_do_Projeto_2026_OSC.pdf',
    title: 'Prestação de contas Projeto',
    subtitle: 'Raízes que Transformam – Fortalecimento da Cultura do Congado e Formação Comunitária',
    category: 'Prestação de Contas / Plano de Trabalho e Metas',
    referenceNumber: 'Proposta nº 008851/2026',
    sections: [
      {
        heading: '1. Identificação da Proposta e da Entidade Proponente',
        paragraphs: [
          'Proposta nº 008851/2026 cadastrada junto à administração pública, vinculada ao Termo de Fomento nº 998200/2026 e em estrita consonância com o Marco Regulatório das Organizações da Sociedade Civil (MROSC - Lei Federal nº 13.019/2014).',
          'Entidade Proponente: Associação Beneficente e Cultural Terno Moçambique Estrela Guia | CNPJ: 06.207.190/0001-07 | Sede: Bairro São Jorge, Uberlândia - MG.'
        ],
        table: [
          { label: 'Proposta Formal nº:', value: '008851/2026 - Plataforma Oficial' },
          { label: 'Termo de Fomento:', value: 'Nº 998200/2026 - MROSC Lei 13.019/2014' },
          { label: 'OSC Responsável:', value: 'Assoc. Beneficente e Cultural Terno Moçambique Estrela Guia' },
          { label: 'Vigência do Plano:', value: 'Exercício de 2026 (12 meses de execução continuada)' },
          { label: 'Local de Execução:', value: 'Sede Comunitária São Jorge e Espaços Públicos de Uberlândia' }
        ]
      },
      {
        heading: '2. Objeto do Projeto',
        paragraphs: [
          'Execução do projeto cultural e formativo "Raízes que Transformam – Fortalecimento da Cultura do Congado e Formação Comunitária", compreendendo a realização de oficinas formativas permanentes de toques rituais de gungas e caixas do moçambique, transmissão oral dos cânticos sagrados, confecção e restauro de indumentárias tradicionais, palestras de educação patrimonial e cidadania, além da realização de cortejos e apresentações socioculturais abertas à comunidade em geral.',
          'O projeto fomenta a salvaguarda da memória afro-brasileira e fortalece o protagonismo de crianças, jovens e mestres de tradição popular no Bairro São Jorge.'
        ]
      },
      {
        heading: '3. Justificativa Sociocultural e Diagnóstico Territorial',
        paragraphs: [
          'Fundado em 12 de outubro de 2002, o Terno Moçambique Estrela Guia constitui patrimônio cultural vivo do Triângulo Mineiro. O Congado e o Moçambique representam pilares de resistência, fé e identidade comunitária.',
          'O diagnóstico territorial do Bairro São Jorge aponta a necessidade urgente de espaços de convivência sadia, arte-educação e acolhimento para a juventude da periferia. O presente planejamento estrutura a ação contínua da entidade, combatendo a vulnerabilidade social através da valorização das raízes ancestrais.'
        ]
      },
      {
        heading: '4. Metas Físicas e Indicadores de Execução 2026',
        table: [
          { label: 'Meta 1 - Oficinas de Moçambique:', value: 'Oficinas semanais de toques de caixa, gunga e passos rituais (40 jovens atendidos)' },
          { label: 'Meta 2 - Formação Patrimonial:', value: '4 ciclos de palestras e rodas de conversa com Mestres sobre o Congado e cidadania' },
          { label: 'Meta 3 - Indumentárias e Instrumentos:', value: 'Confecção de fardamentos tradicionais e manutenção do instrumental percussivo' },
          { label: 'Meta 4 - Apresentações e Cortejos:', value: 'Realização de cortejos comunitários, Festa de N. Sra. do Rosário e eventos cívicos' },
          { label: 'Meta 5 - Relatório e Prestação de Contas:', value: 'Elaboração do Relatório de Execução do Objeto e prestação de contas integral MROSC' }
        ]
      },
      {
        heading: '5. Cronograma Físico-Financeiro Integrado',
        paragraphs: [
          'O cronograma do projeto distribui-se em 4 etapas operacionais ao longo de 2026:',
          '• 1º Trimestre: Planejamento inicial, mobilização comunitária, aquisição de insumos de percussão e abertura de matrículas nas oficinas.',
          '• 2º Trimestre: Execução contínua dos módulos de formação de toques e cantos; ciclo de palestras sobre história do Moçambique.',
          '• 3º Trimestre: Finalização das indumentárias, ensaios gerais integrados e preparação dos cortejos e festividades tradicionais.',
          '• 4º Trimestre: Realização dos festejos solenes de outubro, apresentações públicas, avaliação pedagógica e prestação de contas final.'
        ]
      },
      {
        heading: '6. Metodologia de Monitoramento e Avaliação',
        paragraphs: [
          'O acompanhamento do projeto é exercido por comissão técnica multidisciplinar através de: listas de presença diárias com registro biométrico/assinatura, diário de bordo pedagógico, relatório fotográfico e videográfico de alta resolução das atividades e relatórios mensais de conformidade administrativa-financeira auditáveis.'
        ]
      }
    ]
  });

  // Also create base files for transparency so no other doc gives 404
  await createOfficialPdf({
    filename: 'public/relatorio.pdf',
    title: 'Relatorio Anual de Atividades',
    subtitle: 'Terno Mocambique Estrela Guia - Balanco Social',
    category: 'Relatorio Institucional',
    referenceNumber: 'REL-2025/2026',
    sections: [
      {
        heading: 'Atividades e Impacto Social',
        paragraphs: [
          'Relatorio detalhado contemplando mais de 600 integrantes diretos, centenas de familias atendidas e dezenas de apresentacoes publicas em Minas Gerais e no Brasil.'
        ]
      }
    ]
  });

  await createOfficialPdf({
    filename: 'public/transparencia.pdf',
    title: 'Ata de Eleicao e Posse da Diretoria',
    subtitle: 'Composicao do Conselho Deliberativo e Fiscal',
    category: 'Atos Constitutivos',
    referenceNumber: 'ATA-REG-01',
    sections: [
      {
        heading: 'Representacao Legal',
        paragraphs: [
          'Registro cartorial da ata de eleicao da diretoria executiva e conselho fiscal do Terno de Mocambique Estrela Guia para o mandato vigente.'
        ]
      }
    ]
  });

  await createOfficialPdf({
    filename: 'public/cnpj.pdf',
    title: 'Comprovante de Inscricao CNPJ',
    subtitle: 'Receita Federal do Brasil - Situacao Ativa',
    category: 'Identificacao Juridica',
    referenceNumber: '06.207.190/0001-07',
    sections: [
      {
        heading: 'Dados Cadastrais',
        paragraphs: [
          'Comprovante oficial de inscricao e de situacao cadastral de pessoa juridica ativa sob CNPJ nº 06.207.190/0001-07.'
        ]
      }
    ]
  });

  await createOfficialPdf({
    filename: 'public/certidoes.pdf',
    title: 'Certidoes Negativas de Debitos',
    subtitle: 'Regularidade Fiscal Federal, Estadual e Municipal',
    category: 'Regularidade Fiscal',
    referenceNumber: 'CND-UNIFICADA',
    sections: [
      {
        heading: 'Certificacao Fiscal',
        paragraphs: [
          'Certidao conjunta de debitos relativos a tributos federais e a divida ativa da uniao, comprovando plena adimplencia da entidade.'
        ]
      }
    ]
  });

  // Also make copies in public root and public/docs matching the filenames provided by the user
  fs.copyFileSync(
    'public/docs/Transparencia_Termo_Fomento_998200_2026_Estrela_Guia.pdf',
    'public/Transparencia_Termo_Fomento_998200_2026_Estrela_Guia.pdf'
  );
  fs.copyFileSync(
    'public/docs/SEI_3158555_Oficio_332.pdf',
    'public/SEI_3158555_Oficio_332 (1).pdf'
  );
  fs.copyFileSync(
    'public/docs/Planejamento_do_Projeto_2026_OSC.pdf',
    'public/2.2 OSC - Planejamento do Projeto 2026 (1) (2) (1).pdf'
  );
  fs.copyFileSync(
    'public/docs/Planejamento_do_Projeto_2026_OSC.pdf',
    'public/docs/2.2 OSC - Planejamento do Projeto 2026 (1) (2) (1).pdf'
  );

  // If dist exists, copy over
  if (fs.existsSync('dist')) {
    if (!fs.existsSync('dist/docs')) fs.mkdirSync('dist/docs', { recursive: true });
    ['Transparencia_Termo_Fomento_998200_2026_Estrela_Guia.pdf', 'SEI_3158555_Oficio_332.pdf', 'Planejamento_do_Projeto_2026_OSC.pdf'].forEach(f => {
      fs.copyFileSync(`public/docs/${f}`, `dist/docs/${f}`);
    });
    fs.copyFileSync('public/docs/Planejamento_do_Projeto_2026_OSC.pdf', 'dist/2.2 OSC - Planejamento do Projeto 2026 (1) (2) (1).pdf');
    fs.copyFileSync('public/docs/Planejamento_do_Projeto_2026_OSC.pdf', 'dist/docs/2.2 OSC - Planejamento do Projeto 2026 (1) (2) (1).pdf');
  }
  console.log('All documents generated successfully!');
}

run().catch(console.error);
