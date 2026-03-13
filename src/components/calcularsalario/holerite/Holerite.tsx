// Componente para geração do PDF do holerite usando @react-pdf/renderer
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { formatarMoeda } from '../../../utils/FormatarMoeda';
import { type CalculoResponse } from '../interfaces/CalculoResposta';
import { type CalculoSalarioState } from '../interfaces/CalculoSalarioState';

// Lista dos meses do ano
const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

// Estilos do PDF - Design Clean e Moderno
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  
  // Cabeçalho
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: '3px solid #475569',
  },
  logoContainer: {
    width: 120,
  },
  logo: {
    width: 120,
    height: 'auto',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    fontFamily: 'Helvetica',
  },
  
  // Informações do Colaborador
  colaboradorSection: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderLeft: '4px solid #475569',
  },
  colaboradorNome: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  colaboradorCargo: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'Helvetica',
  },
  
  // Seção de Valores
  valuesSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  // Grid de Cards
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    border: '2px solid #e2e8f0',
  },
  cardBlue: {
    backgroundColor: '#eff6ff',
    border: '2px solid #3b82f6',
  },
  cardGreen: {
    backgroundColor: '#f0fdf4',
    border: '2px solid #22c55e',
  },
  cardRed: {
    backgroundColor: '#fef2f2',
    border: '2px solid #ef4444',
  },
  cardHighlight: {
    backgroundColor: '#1e293b',
    border: '2px solid #0f172a',
  },
  cardLabel: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 6,
    fontFamily: 'Helvetica',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardLabelWhite: {
    color: '#cbd5e1',
  },
  cardValue: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
  },
  cardValueBlue: {
    color: '#2563eb',
  },
  cardValueGreen: {
    color: '#16a34a',
  },
  cardValueRed: {
    color: '#dc2626',
  },
  cardValueWhite: {
    color: '#ffffff',
  },
  
  // Detalhes
  detailsSection: {
    padding: 18,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    border: '1px solid #e2e8f0',
  },
  detailsTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  detailItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#475569',
    marginRight: 8,
  },
  detailText: {
    fontSize: 10,
    color: '#475569',
    fontFamily: 'Helvetica',
  },
  detailValue: {
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
  },
  
  // Rodapé
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTop: '1px solid #e2e8f0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 8,
    color: '#94a3b8',
    fontFamily: 'Helvetica',
  },
});

// Props do componente
interface CalcularSalarioPdfProps {
  resultado: CalculoResponse;
  state: CalculoSalarioState;
}

function Holerite({ resultado, state }: Readonly<CalcularSalarioPdfProps>) {
  const mesReferencia = MESES[(state.mes || 1) - 1];
  const anoReferencia = new Date().getFullYear();
  const logoUrl = 'https://ik.imagekit.io/vzr6ryejm/rh/logo_rh.png?updatedAt=1730234508485';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Cabeçalho com Logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image src={logoUrl} style={styles.logo} />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>HOLERITE</Text>
            <Text style={styles.subtitle}>
              {mesReferencia} de {anoReferencia}
            </Text>
          </View>
        </View>

        {/* Informações do Colaborador */}
        <View style={styles.colaboradorSection}>
          <Text style={styles.colaboradorNome}>{state.colaborador.nome}</Text>
          <Text style={styles.colaboradorCargo}>{state.colaborador.cargo}</Text>
        </View>

        {/* Seção de Valores */}
        <View style={styles.valuesSection}>
          <Text style={styles.sectionTitle}>Resumo Financeiro</Text>
          
          {/* Linha 1: Salário Base e Horas Extras */}
          <View style={styles.row}>
            <View style={[styles.card, styles.cardBlue]}>
              <Text style={styles.cardLabel}>Salário Base</Text>
              <Text style={[styles.cardValue, styles.cardValueBlue]}>
                {formatarMoeda(resultado.salario)}
              </Text>
            </View>
            <View style={[styles.card, styles.cardGreen]}>
              <Text style={styles.cardLabel}>Horas Extras</Text>
              <Text style={[styles.cardValue, styles.cardValueGreen]}>
                {formatarMoeda(resultado.valorTotalHorasExtras)}
              </Text>
            </View>
          </View>

          {/* Linha 2: Descontos e Líquido */}
          <View style={styles.row}>
            <View style={[styles.card, styles.cardRed]}>
              <Text style={styles.cardLabel}>Total Descontos</Text>
              <Text style={[styles.cardValue, styles.cardValueRed]}>
                {formatarMoeda(resultado.totalDescontos)}
              </Text>
            </View>
            <View style={[styles.card, styles.cardHighlight]}>
              <Text style={[styles.cardLabel, styles.cardLabelWhite]}>
                Salário Líquido
              </Text>
              <Text style={[styles.cardValue, styles.cardValueWhite]}>
                {formatarMoeda(resultado.salarioLiquido)}
              </Text>
            </View>
          </View>
        </View>

        {/* Detalhes do Cálculo */}
        <View style={styles.detailsSection}>
          <Text style={styles.detailsTitle}>Detalhes do Cálculo</Text>
          
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <View style={styles.detailBullet} />
              <Text style={styles.detailText}>
                Horas extras: <Text style={styles.detailValue}>{state.totalHorasExtras}h</Text>
              </Text>
            </View>

            {state.totalHorasExtras > 0 && (
              <View style={styles.detailItem}>
                <View style={styles.detailBullet} />
                <Text style={styles.detailText}>
                  Valor/hora extra: <Text style={styles.detailValue}>
                    {formatarMoeda(resultado.valorHoraExtra)}
                  </Text>
                </Text>
              </View>
            )}

            <View style={styles.detailItem}>
              <View style={styles.detailBullet} />
              <Text style={styles.detailText}>
                INSS: <Text style={styles.detailValue}>{formatarMoeda(resultado.inss)}</Text>
              </Text>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.detailBullet} />
              <Text style={styles.detailText}>
                IRRF: <Text style={styles.detailValue}>{formatarMoeda(resultado.irrf)}</Text>
              </Text>
            </View>

            {state.descontos > 0 && (
              <View style={styles.detailItem}>
                <View style={styles.detailBullet} />
                <Text style={styles.detailText}>
                  Outros descontos: <Text style={styles.detailValue}>
                    {formatarMoeda(state.descontos)}
                  </Text>
                </Text>
              </View>
            )}

            <View style={styles.detailItem}>
              <View style={styles.detailBullet} />
              <Text style={styles.detailText}>
                Mês: <Text style={styles.detailValue}>{mesReferencia}/{anoReferencia}</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Rodapé */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Documento gerado automaticamente em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export default Holerite;