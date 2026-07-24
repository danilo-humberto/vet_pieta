export type NavigationItem = Readonly<{
  label: string
  href: `#${string}`
}>

export const navigationItems = [
  { label: 'Serviços', href: '#servicos' },
  { label: 'Diferenciais', href: '#diferenciais' },
  { label: 'Especialidades', href: '#especialidades' },
  { label: 'Estrutura', href: '#estrutura' },
  { label: 'Avaliações', href: '#avaliacoes' },
  { label: 'Localização', href: '#localizacao' },
] as const satisfies readonly NavigationItem[]
