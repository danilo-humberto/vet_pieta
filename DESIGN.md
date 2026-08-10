# Sistema visual Pietá

## Direção

Uma presença acolhedora e madura, equilibrando proximidade emocional e preparo técnico. Formas orgânicas e referências discretas ao contorno de uma casa reforçam proteção sem infantilizar a marca.

## Paleta

- Verde profundo: `#304A36`
- Verde institucional: `#5C724C`
- Verde sálvia: `#8EA17D`
- Dourado: `#D2BE87`
- Marfim: `#F7F4EB`
- Branco suave: `#FEFDF9`
- Grafite: `#28302A`
- Laranja de apoio: `#D96B32`, somente em detalhes raros

## Tipografia

- Display: EB Garamond 500 e 600.
- Interface e corpo: Inter 400, 500 e 600.
- Títulos curtos, alinhados à esquerda e com largura controlada.
- Corpo entre 16 e 18 px, máximo aproximado de 65 caracteres por linha.

## Forma

- Cantos suaves entre 18 e 28 px.
- Botões com raio de 14 px, sem cápsulas excessivas.
- Contorno de telhado como detalhe pontual.
- Cards somente quando agrupam conteúdo real.
- Nada de patas genéricas repetidas ou decoração infantil.

## Movimento

- GSAP e ScrollTrigger formam a única camada de movimento da landing page.
- O hero possui uma timeline coordenada; títulos, imagens, listas e rodapé entram conforme alcançam a viewport.
- As entradas usam atributos semânticos `data-motion` e são rearmadas somente
  depois que o usuário retorna acima do respectivo gatilho.
- Listas são animadas em lotes com `ScrollTrigger.batch()`, respeitando a quantidade de colunas de cada breakpoint.
- Parallax contínuo existe apenas no desktop, nas fotografias de diferenciais, estrutura e localização.
- Somente `transform` e `opacity` são animados, com `power4.out`, sem bounce ou elasticidade.
- GSAP controla wrappers externos sem `transition`; os componentes internos preservam os transforms e transitions de hover.
- Estados iniciais de listas são preparados antes do gatilho e animados até o estado final, evitando saltos ao entrar na viewport.
- Estilos inline das entradas são removidos ao final para preservar os estados CSS de hover.
- Nas seções claras, um gradiente ambiente acompanha ponteiros precisos usando
  `GSAP.quickTo()` e apenas `transform` e `opacity`.
- O gradiente não é exibido em dispositivos touch nem quando
  `prefers-reduced-motion` está ativo.
- No mobile, deslocamentos e staggers são menores e o parallax é desativado.
- Com `prefers-reduced-motion`, o conteúdo permanece visível e sem deslocamentos.

## Layout

- Desktop com composições assimétricas e máximo de 1440 px.
- Mobile em coluna única e sem conteúdo dependente de hover.
- Ritmo variado: blocos amplos para marca, leitura compacta para dados operacionais.

## Opções de hero

- A composição original dos três pacientes permanece como padrão.
- `?design=orbit` ativa uma segunda composição usando o Orbit Carousel do
  GodUI, adaptado à identidade Pietà.
- Na opção Orbit, Framer Motion controla somente os slides e o GSAP anima
  somente o wrapper externo durante a entrada.
- O golden inicia ao centro, não há autoplay e a rolagem vertical continua
  disponível no mobile.
