import { Link } from 'react-router-dom';
import { useStoreBranding } from '@/hooks/use-store-branding';
import { whatsappUrl } from '@/lib/store-contact';
import { LegalPageShell } from './LegalPageShell';

const SUPPORT_EMAIL = 'memorinhas14+suporte@gmail.com';
const LEGAL_EMAIL = 'memorinhas14+juridico@gmail.com';

export default function TermsOfUsePage() {
  const { name, store } = useStoreBranding();
  const whatsapp = store?.settings?.contact?.whatsapp;

  return (
    <LegalPageShell title="Termos de Uso" updatedAt="21 de julho de 2026">
      <section>
        <h2>1. Aceitação</h2>
        <p>
          Ao acessar e utilizar o site da {name}, você concorda com estes Termos de Uso. Se não
          concordar, pedimos que não utilize nossos serviços.
        </p>
      </section>

      <section>
        <h2>2. Serviços</h2>
        <p>
          A {name} oferece ímãs artesanais personalizados, catálogo de produtos e ferramentas de
          customização online. Pedidos podem ser realizados pelo site ou pelos canais de atendimento
          indicados, como WhatsApp.
        </p>
      </section>

      <section>
        <h2>3. Pedidos e personalização</h2>
        <ul>
          <li>
            Você é responsável pela qualidade e pelos direitos de uso das imagens enviadas para
            personalização.
          </li>
          <li>
            Após a confirmação do pedido e do pagamento, prazos de produção e envio seguem as
            informações disponíveis no site ou comunicadas no atendimento.
          </li>
          <li>
            Produtos personalizados sob encomenda podem ter regras específicas de troca e
            cancelamento, conforme a legislação aplicável e o combinado no pedido.
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Preços e pagamento</h2>
        <p>
          Os preços exibidos podem ser atualizados a qualquer momento. O valor definitivo do pedido
          é o confirmado no momento da compra, incluindo eventuais custos de frete.
        </p>
      </section>

      <section>
        <h2>5. Uso adequado do site</h2>
        <p>
          É vedado utilizar o site de forma ilícita, tentar comprometer sua segurança ou copiar
          conteúdos sem autorização. Reservamo-nos o direito de restringir o acesso em caso de uso
          indevido.
        </p>
      </section>

      <section>
        <h2>6. Propriedade intelectual</h2>
        <p>
          Marcas, layout, textos e demais conteúdos do site pertencem à {name} ou a seus
          licenciadores. O envio de fotos para personalização não transfere a nós a titularidade
          dessas imagens, além do necessário para produzir e entregar o pedido.
        </p>
      </section>

      <section>
        <h2>7. Privacidade</h2>
        <p>
          O tratamento de dados pessoais está descrito na nossa{' '}
          <Link to="/privacidade">Política de Privacidade</Link>.
        </p>
      </section>

      <section>
        <h2>8. Contato</h2>
        <p>
          Dúvidas sobre estes termos: suporte em{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>, assuntos jurídicos em{' '}
          <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>
          {whatsapp ? (
            <>
              {' '}
              ou pelo{' '}
              <a href={whatsappUrl(whatsapp)} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </>
          ) : null}
          .
        </p>
      </section>
    </LegalPageShell>
  );
}
