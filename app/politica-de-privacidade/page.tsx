import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Política de Privacidade — App Igreja Batista Regenere",
	description:
		"Política de Privacidade do aplicativo móvel Igreja Batista Regenere (com.batista.app), em conformidade com a LGPD e os requisitos da Google Play Store.",
};

const LAST_UPDATED = "7 de junho de 2026";

function Section({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<section className="space-y-4">
			<h2 className="text-2xl font-semibold text-purple-300">{title}</h2>
			<div className="space-y-3 text-gray-300 leading-relaxed">{children}</div>
			<div className="border-b border-gray-700 pt-2" />
		</section>
	);
}

export default function PoliticaDePrivacidade() {
	return (
		<div className="min-h-screen bg-[#121212] text-white py-16 px-4">
			<div className="container mx-auto max-w-3xl">
				<header className="mb-12 text-center">
					<h1 className="text-4xl font-bold mb-4">Política de Privacidade</h1>
					<p className="text-gray-400 text-lg">
						Aplicativo móvel <strong className="text-white">Igreja Batista Regenere</strong>
					</p>
					<p className="text-sm text-gray-500 mt-2">
						Última atualização: {LAST_UPDATED}
					</p>
				</header>

				<div className="space-y-10">
					<Section title="1. Quem somos">
						<p>
							Esta Política de Privacidade descreve como a{" "}
							<strong>Igreja Batista Regenere</strong> (&quot;nós&quot;, &quot;nosso&quot; ou
							&quot;Controlador&quot;) trata os dados pessoais no aplicativo móvel{" "}
							<strong>Igreja Batista Regenere</strong> (identificador Android:{" "}
							<code className="text-purple-200">com.batista.app</code>).
						</p>
						<p>
							<strong>CNPJ:</strong> 05.745.949/0001-34
							<br />
							<strong>Sede:</strong> Avenida Coronel Tiberio Meira, 447 — Brumado/BA
							<br />
							<strong>Contato para privacidade:</strong> WhatsApp (77) 9 9966-0068
						</p>
						<p>
							Esta política aplica-se exclusivamente ao aplicativo móvel. O site institucional da
							igreja possui tratamento de dados próprio e independente.
						</p>
					</Section>

					<Section title="2. Escopo e público-alvo">
						<p>
							O aplicativo é destinado ao público em geral, membros e visitantes da comunidade da
							Igreja Batista Regenere. Não é voltado especificamente a crianças menores de 13
							anos, embora possa ser utilizado por pessoas de todas as idades sob orientação de
							responsáveis, quando aplicável.
						</p>
						<p>
							A maior parte das funcionalidades pode ser usada sem criar conta. Alguns recursos —
							como comentários no versículo do dia e áreas administrativas — exigem cadastro com
							e-mail e senha.
						</p>
					</Section>

					<Section title="3. Dados que coletamos e como os utilizamos">
						<h3 className="text-lg font-medium text-white">3.1 Dados de conta (opcional)</h3>
						<p>Quando você cria uma conta ou faz login, coletamos:</p>
						<ul className="list-disc pl-6 space-y-1">
							<li>Endereço de e-mail</li>
							<li>Senha (armazenada de forma segura pelo Firebase Authentication; não temos acesso à senha em texto claro)</li>
							<li>Cidade e estado selecionados no cadastro</li>
							<li>Identificador único do usuário (UID)</li>
							<li>Data de criação da conta</li>
						</ul>
						<p>
							<strong>Finalidade:</strong> autenticação, personalização de conteúdo regional,
							permitir comentários no versículo do dia e controle de acesso às áreas de
							administração e voluntariado.
						</p>

						<h3 className="text-lg font-medium text-white mt-6">3.2 Pedidos de oração (sem conta)</h3>
						<p>Ao enviar um pedido de oração, coletamos:</p>
						<ul className="list-disc pl-6 space-y-1">
							<li>Nome(s) para oração</li>
							<li>Texto do pedido (opcional)</li>
							<li>Município/região selecionado</li>
							<li>Identificador do usuário (apenas se estiver logado)</li>
							<li>Data e hora do envio</li>
						</ul>
						<p>
							<strong>Finalidade:</strong> registrar e organizar pedidos de oração para a equipe
							da igreja. Esses dados são acessíveis apenas a administradores e voluntários
							autorizados, conforme regras de segurança do banco de dados.
						</p>
						<p>
							<strong>Atenção:</strong> ao informar nomes de terceiros em pedidos de oração, você
							declara ter autorização para compartilhar essas informações.
						</p>

						<h3 className="text-lg font-medium text-white mt-6">3.3 Comentários no versículo do dia</h3>
						<p>Se você estiver logado e comentar o versículo do dia, coletamos:</p>
						<ul className="list-disc pl-6 space-y-1">
							<li>Texto do comentário (até 1.000 caracteres)</li>
							<li>Identificador e nome de exibição do usuário (e-mail, quando não houver nome)</li>
							<li>Referência e data do versículo comentado</li>
							<li>Data e hora do comentário</li>
						</ul>
						<p>
							<strong>Finalidade:</strong> permitir interação da comunidade sobre o versículo
							diário. Os comentários são visíveis a outros usuários do aplicativo.
						</p>

						<h3 className="text-lg font-medium text-white mt-6">3.4 Preferências no dispositivo</h3>
						<p>Armazenamos localmente no seu aparelho (sem envio ao servidor):</p>
						<ul className="list-disc pl-6 space-y-1">
							<li>Município/região selecionado para filtrar conteúdo</li>
							<li>Sessão de autenticação (para mantê-lo logado)</li>
							<li>Configurações de notificações locais agendadas</li>
						</ul>
						<p>
							<strong>Finalidade:</strong> melhorar sua experiência e lembrar suas preferências
							entre sessões.
						</p>

						<h3 className="text-lg font-medium text-white mt-6">3.5 Dados que não coletamos</h3>
						<p>O aplicativo <strong>não</strong> coleta:</p>
						<ul className="list-disc pl-6 space-y-1">
							<li>Localização GPS ou geolocalização do dispositivo (a região é escolhida manualmente por você)</li>
							<li>Fotos, vídeos ou áudio da câmera ou microfone</li>
							<li>Contatos, calendário, SMS ou histórico de chamadas</li>
							<li>Dados financeiros ou de cartão de crédito (doações via PIX são realizadas fora do app)</li>
							<li>Identificadores de publicidade ou dados de analytics comportamental</li>
							<li>Lista de outros aplicativos instalados no dispositivo</li>
						</ul>
					</Section>

					<Section title="4. Permissões do dispositivo">
						<p>O aplicativo pode solicitar as seguintes permissões:</p>
						<ul className="list-disc pl-6 space-y-2">
							<li>
								<strong>Notificações (POST_NOTIFICATIONS):</strong> para enviar lembretes locais
								do versículo do dia (às 8h) e de cultos/eventos. As notificações são geradas no
								próprio dispositivo; não utilizamos notificações push remotas.
							</li>
							<li>
								<strong>Galeria / armazenamento de mídia:</strong> apenas quando você opta por
								salvar uma imagem do versículo do dia na galeria de fotos. Não acessamos suas
								fotos existentes nem metadados de localização das imagens.
							</li>
							<li>
								<strong>Internet e estado da rede:</strong> necessários para sincronizar conteúdo
								com nossos servidores e abrir links externos (YouTube, redes sociais, WhatsApp).
							</li>
							<li>
								<strong>Receber ao iniciar (RECEIVE_BOOT_COMPLETED) e vibrar:</strong> para
								reagendar notificações locais após reinicialização do aparelho.
							</li>
						</ul>
						<p>
							Você pode revogar permissões a qualquer momento nas configurações do sistema
							operacional do seu dispositivo.
						</p>
					</Section>

					<Section title="5. Compartilhamento com terceiros">
						<p>
							Não vendemos, alugamos nem comercializamos seus dados pessoais. Compartilhamos
							informações apenas nas situações abaixo:
						</p>
						<ul className="list-disc pl-6 space-y-2">
							<li>
								<strong>Google Firebase (Google LLC):</strong> utilizamos Firebase Authentication
								e Cloud Firestore para autenticação, armazenamento de dados de conta, pedidos de
								oração, comentários e conteúdo do aplicativo. Os dados são transmitidos por
								conexão criptografada (HTTPS). A Google atua como operadora de dados conforme
								sua própria política de privacidade.
							</li>
							<li>
								<strong>Google YouTube Data API:</strong> administradores e voluntários autorizados
								utilizam a API do YouTube para importar pregações do canal da igreja. Essa
								interação ocorre apenas na área administrativa e não envolve dados pessoais dos
								usuários finais.
							</li>
							<li>
								<strong>Expo (EAS):</strong> plataforma de compilação e distribuição do aplicativo.
								Não recebe dados pessoais dos usuários durante o uso normal do app.
							</li>
							<li>
								<strong>Links externos:</strong> ao tocar em links para WhatsApp, Instagram,
								YouTube ou Facebook, você será direcionado a serviços de terceiros com políticas
								próprias de privacidade.
							</li>
						</ul>
						<p>
							Comentários no versículo do dia são visíveis a outros usuários do aplicativo e,
							portanto, constituem compartilhamento dentro da comunidade de usuários.
						</p>
					</Section>

					<Section title="6. Base legal (LGPD)">
						<p>Tratamos seus dados com base nas seguintes hipóteses da Lei Geral de Proteção de Dados (Lei nº 13.709/2018):</p>
						<ul className="list-disc pl-6 space-y-1">
							<li><strong>Consentimento:</strong> criação de conta, envio de comentários e ativação de permissões do dispositivo</li>
							<li><strong>Execução de procedimentos preliminares a pedido do titular:</strong> pedidos de oração enviados por você</li>
							<li><strong>Legítimo interesse:</strong> segurança do aplicativo, prevenção de fraudes e funcionamento das áreas administrativas</li>
						</ul>
					</Section>

					<Section title="7. Segurança dos dados">
						<p>Adotamos medidas técnicas e organizacionais para proteger seus dados, incluindo:</p>
						<ul className="list-disc pl-6 space-y-1">
							<li>Transmissão criptografada (HTTPS/TLS) em todas as comunicações com servidores</li>
							<li>Autenticação com senha gerenciada pelo Firebase Authentication</li>
							<li>Regras de acesso no banco de dados (Firestore Security Rules) que restringem leitura e escrita conforme perfil do usuário</li>
							<li>Controle de acesso por perfis (administrador, voluntário, usuário comum)</li>
							<li>Armazenamento local de sessão protegido pelo sistema operacional do dispositivo</li>
						</ul>
						<p>
							Nenhum método de transmissão ou armazenamento é 100% seguro. Em caso de incidente
							que possa afetar seus dados, comunicaremos os titulares e a Autoridade Nacional de
							Proteção de Dados (ANPD), quando exigido por lei.
						</p>
					</Section>

					<Section title="8. Retenção e exclusão de dados">
						<p>Mantemos seus dados pelo tempo necessário para as finalidades descritas nesta política:</p>
						<ul className="list-disc pl-6 space-y-1">
							<li><strong>Conta de usuário:</strong> enquanto a conta estiver ativa</li>
							<li><strong>Pedidos de oração:</strong> até solicitação de exclusão ou enquanto necessário para a finalidade pastoral</li>
							<li><strong>Comentários:</strong> enquanto permanecerem publicados ou até solicitação de exclusão</li>
							<li><strong>Eventos da agenda:</strong> removidos automaticamente após a data do evento (via função automatizada no servidor)</li>
							<li><strong>Preferências locais:</strong> permanecem no dispositivo até você desinstalar o app ou limpar os dados do aplicativo</li>
						</ul>
						<p>
							<strong>Como solicitar exclusão:</strong> entre em contato pelo WhatsApp (77) 9 9966-0068
							informando o e-mail da conta (se houver) e descrevendo os dados que deseja excluir.
							Atenderemos sua solicitação em até 15 dias úteis, salvo obrigação legal de retenção.
						</p>
						<p>
							Ao excluir sua conta, removeremos seus dados de autenticação e perfil. Comentários
							públicos podem ser anonimizados ou removidos conforme sua solicitação.
						</p>
					</Section>

					<Section title="9. Transferência internacional de dados">
						<p>
							O Google Firebase pode processar e armazenar dados em servidores localizados fora do
							Brasil, incluindo nos Estados Unidos. A Google adota cláusulas contratuais e
							mecanismos de proteção reconhecidos para transferências internacionais. Ao utilizar
							o aplicativo, você está ciente dessa possível transferência.
						</p>
					</Section>

					<Section title="10. Seus direitos (LGPD)">
						<p>Como titular de dados pessoais, você tem direito a:</p>
						<ul className="list-disc pl-6 space-y-1">
							<li>Confirmar a existência de tratamento</li>
							<li>Acessar seus dados</li>
							<li>Corrigir dados incompletos, inexatos ou desatualizados</li>
							<li>Solicitar anonimização, bloqueio ou eliminação de dados desnecessários</li>
							<li>Solicitar portabilidade dos dados</li>
							<li>Revogar o consentimento, quando aplicável</li>
							<li>Obter informações sobre compartilhamento com terceiros</li>
						</ul>
						<p>
							Para exercer seus direitos, entre em contato pelo WhatsApp (77) 9 9966-0068. Você
							também pode apresentar reclamação à ANPD (
							<a
								href="https://www.gov.br/anpd"
								target="_blank"
								rel="noopener noreferrer"
								className="text-purple-300 hover:text-purple-200 underline"
							>
								www.gov.br/anpd
							</a>
							).
						</p>
					</Section>

					<Section title="11. Crianças e adolescentes">
						<p>
							O aplicativo não coleta intencionalmente dados de crianças menores de 13 anos de
							forma direcionada. Pais ou responsáveis que identifiquem que um menor forneceu dados
							pessoais sem autorização devem entrar em contato conosco para solicitar a exclusão.
						</p>
						<p>
							Pedidos de oração podem conter nomes de menores informados por terceiros; nesses
							casos, recomendamos que o responsável autorize o envio e solicite exclusão quando
							necessário.
						</p>
					</Section>

					<Section title="12. Alterações nesta política">
						<p>
							Podemos atualizar esta Política de Privacidade periodicamente. A data da última
							revisão será indicada no topo desta página. Alterações relevantes serão comunicadas
							por meio do aplicativo ou de nossos canais oficiais. O uso continuado do aplicativo
							após a publicação de alterações constitui aceitação da política revisada.
						</p>
					</Section>

					<Section title="13. Contato">
						<p>
							Para dúvidas, solicitações ou reclamações sobre privacidade e proteção de dados
							relacionados ao aplicativo <strong>Igreja Batista Regenere</strong>:
						</p>
						<p>
							<strong>Igreja Batista Regenere</strong>
							<br />
							CNPJ: 05.745.949/0001-34
							<br />
							Endereço: Avenida Coronel Tiberio Meira, 447 — Brumado/BA
							<br />
							WhatsApp: (77) 9 9966-0068
						</p>
					</Section>
				</div>
			</div>
		</div>
	);
}
