import { Link } from 'react-router-dom';
import { useStoreBranding } from '@/hooks/use-store-branding';
import { whatsappUrl } from '@/lib/store-contact';
import { LegalPageShell } from './LegalPageShell';

const SUPPORT_EMAIL = 'memorinhas14+suporte@gmail.com';
const LEGAL_EMAIL = 'memorinhas14+juridico@gmail.com';

export default function PrivacyPolicyPage() {
  const { name, store } = useStoreBranding();
  const whatsapp = store?.settings?.contact?.whatsapp;

  return (
    <LegalPageShell title="Política de Privacidade" updatedAt="21 de julho de 2026">
      <section>
        <h2>1. Quem somos</h2>
        <p>
          Esta política descreve como a {name} trata dados pessoais no site e nos canais de
          atendimento, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº
          13.709/2018).
        </p>
      </section>

      <section>
        <h2>2. Dados que podemos coletar</h2>
        <ul>
          <li>Dados de identificação e contato: nome, e-mail, telefone e endereço de entrega.</li>
          <li>Dados do pedido: produtos, personalizações e imagens enviadas por você.</li>
          <li>
            Dados de navegação essenciais: preferências locais (como aceite de cookies e tema) e
            informações técnicas necessárias ao funcionamento do site.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. Finalidades</h2>
        <ul>
          <li>Processar e entregar pedidos de ímãs personalizados.</li>
          <li>Comunicar status do pedido e prestar atendimento (incluindo WhatsApp).</li>
          <li>Garantir o funcionamento seguro do site e melhorar a experiência de uso.</li>
          <li>Cumprir obrigações legais e defender direitos em eventuais disputas.</li>
        </ul>
      </section>

      <section>
        <h2>4. Cookies</h2>
        <p>
          Utilizamos cookies e tecnologias semelhantes essenciais ao funcionamento do site — por
          exemplo, para lembrar preferências e registrar o aceite desta política. Não utilizamos, no
          momento, cookies de marketing ou publicidade de terceiros. Ao clicar em “Aceitar” no aviso
          de cookies, você confirma ter ciência dessa prática.
        </p>
      </section>

      <section>
        <h2>5. Compartilhamento</h2>
        <p>
          Podemos compartilhar dados com prestadores necessários à operação (hospedagem, pagamento,
          logística e comunicação), sempre na medida do indispensável. Não vendemos seus dados
          pessoais.
        </p>
      </section>

      <section>
        <h2>6. Armazenamento e segurança</h2>
        <p>
          Mantemos os dados pelo tempo necessário às finalidades acima ou conforme exigido por lei.
          Adotamos medidas técnicas e organizacionais razoáveis para proteger as informações, sem
          garantir segurança absoluta em qualquer ambiente digital.
        </p>
      </section>

      <section>
        <h2>7. Seus direitos</h2>
        <p>
          Nos termos da LGPD, você pode solicitar confirmação de tratamento, acesso, correção,
          anonimização, portabilidade, eliminação de dados desnecessários, informação sobre
          compartilhamentos e revogação de consentimento, quando aplicável.
        </p>
      </section>

      <section>
        <h2>8. Contato</h2>
        <p>
          Para exercer direitos ou tirar dúvidas sobre privacidade: {' '}
          <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a> (assuntos jurídicos) ou{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> (suporte)
          {whatsapp ? (
            <>
              {' '}
              e também pelo{' '}
              <a href={whatsappUrl(whatsapp)} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </>
          ) : null}
          . Consulte também nossos <Link to="/termos">Termos de Uso</Link>.
        </p>
      </section>
    </LegalPageShell>
  );
}
