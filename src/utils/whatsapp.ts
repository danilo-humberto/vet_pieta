const WHATSAPP_NUMBER = '5581999633735'

const WHATSAPP_MESSAGE =
  'Olá! Vim pelo site da Clínica Veterinária Pietá e gostaria de agendar um atendimento para meu pet.'

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE,
)}`
