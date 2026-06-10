<template>
  <div class="bg-folsom text-loriga selection:bg-solstis selection:text-folsom scroll-smooth overflow-x-hidden">
    <!-- Navigation -->
    <nav class="fixed top-0 w-full z-50 bg-folsom/80 backdrop-blur-md border-b border-outline-variant/20">
      <div class="flex justify-between items-center px-5 md:px-16 py-4 max-w-[1280px] mx-auto">
        <div class="font-display text-2xl md:text-4xl tracking-tighter text-solstis italic uppercase">
          ROCKYOURSELF
        </div>
        <div class="hidden md:flex space-x-8">
          <a href="#viaje" class="font-body text-xs tracking-[0.1em] uppercase text-halford hover:text-solstis transition-colors">El Viaje</a>
          <a href="#plan" class="font-body text-xs tracking-[0.1em] uppercase text-halford hover:text-solstis transition-colors">El Plan</a>
          <a href="#arquetipos" class="font-body text-xs tracking-[0.1em] uppercase text-halford hover:text-solstis transition-colors">Arquetipos</a>
          <a href="#faq" class="font-body text-xs tracking-[0.1em] uppercase text-halford hover:text-solstis transition-colors">FAQ</a>
        </div>
        <button 
          @click="startQuiz"
          class="bg-solstis text-folsom px-6 py-2 font-body text-xs tracking-[0.1em] uppercase hover:scale-105 transition-all duration-300 interactive-button"
        >
          <span class="button-glow"></span>
          <span class="relative z-20">{{ isAuthenticated ? 'Dashboard' : 'Get Started' }}</span>
        </button>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div class="absolute inset-0 z-0">
        <div class="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background"></div>
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.05)_0%,transparent_70%)]"></div>
      </div>
      <div class="relative z-10 text-center max-w-4xl px-5">
        <span class="hero-entrance font-body text-xs tracking-[0.4em] uppercase text-solstis block mb-6 animate-pulse" style="animation-delay: 0.2s">
          El escenario es tuyo · El micrófono está abierto
        </span>
        <h1 class="hero-entrance font-display text-4xl md:text-7xl text-loriga leading-tight mb-8" style="animation-delay: 0.4s">
          No estás perdido.<br/>
          <span class="italic text-solstis">Estás en el backstage.</span>
        </h1>
        <p class="hero-entrance font-body text-lg text-halford max-w-2xl mx-auto mb-12" style="animation-delay: 0.5s">
          Deja de operar con ideas prestadas y de ser un personaje secundario en una narrativa que no elegiste. 
          Descubre qué rockstar vive en tu alma, hackea el sistema y diseña tu propio setlist de vida.
        </p>
        <div class="hero-entrance flex flex-col md:flex-row gap-6 justify-center items-center" style="animation-delay: 0.6s">
          <button 
            @click="startQuiz"
            class="w-full md:w-auto bg-solstis text-folsom px-10 py-5 font-body text-lg hover:scale-105 transition-all duration-300 gold-glow interactive-button shadow-[0_0_15px_rgba(212,175,55,0.3)]"
          >
            <span class="button-glow"></span>
            <span class="relative z-20">🎸 Descubre tu arquetipo</span>
          </button>
          <button class="w-full md:w-auto border border-halford/30 text-halford px-10 py-5 font-body text-lg hover:bg-solstis/10 hover:border-solstis hover:text-solstis transition-all duration-300">
            Ver cómo funciona
          </button>
        </div>
      </div>
    </section>

    <!-- El Viaje Section -->
    <section class="py-20 md:py-40 px-5 md:px-16 bg-surface-container-low" id="viaje">
      <div class="max-w-[1280px] mx-auto">
        <div class="reveal flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div class="max-w-2xl">
            <h2 class="font-display text-3xl md:text-5xl mb-6">Tres acordes para romper el molde</h2>
            <p class="font-body text-lg text-halford">El viaje del rockstar no empieza en el escenario. Empieza en el backstage.</p>
          </div>
          <div class="font-mono text-solstis uppercase tracking-widest border-l-2 border-solstis pl-4">
            Fase de Preparación
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="(card, i) in viajeCards" :key="i" 
               class="reveal group bg-surface-container p-8 border border-outline-variant/20 light-leak relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-solstis/40 hover:shadow-[0_10px_30px_rgba(212,175,55,0.1)]"
               :style="`transition-delay: ${(i+1)*0.1}s`">
            <span class="material-symbols-outlined text-solstis text-4xl mb-6">{{ card.icon }}</span>
            <h3 class="font-display text-2xl md:text-3xl mb-4">{{ card.title }}</h3>
            <p class="font-body text-base text-halford mb-8">{{ card.desc }}</p>
            <div class="font-mono text-solstis/60 text-sm">{{ card.meta }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- El Plan Section -->
    <section class="py-20 md:py-40 px-5 md:px-16 bg-bocanada overflow-hidden" id="plan">
      <div class="max-w-[1280px] mx-auto relative">
        <div class="reveal text-center mb-24">
          <h2 class="font-display text-3xl md:text-5xl relative z-10">No es terapia. <span class="italic text-solstis">Es un setlist.</span></h2>
          <p class="font-body text-lg text-halford mt-4 max-w-2xl mx-auto">No venimos a arreglar lo "roto". Venimos a potenciar tu código genético.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div v-for="(pilar, i) in pilaresPlan" :key="i" class="reveal space-y-6" :style="`transition-delay: ${(i+1)*0.1}s`">
            <div class="h-1 w-20" :style="`background-color: ${pilar.color}`"></div>
            <h3 class="font-display text-2xl md:text-3xl" :style="`color: ${pilar.color}`">{{ pilar.title }}</h3>
            <p class="font-body text-base text-vegas italic">{{ pilar.subtitle }}</p>
            <p class="font-body text-base text-loriga">{{ pilar.desc }}</p>
          </div>
        </div>
        <div class="reveal mt-24 p-12 bg-surface-container border-l-4 border-solstis max-w-4xl mx-auto">
          <div class="font-mono text-solstis text-xs tracking-[0.1em] uppercase mb-4">METODOLOGÍA</div>
          <p class="font-display text-2xl md:text-3xl text-loriga italic">Semanas · Sprints · Celebraciones</p>
          <p class="font-body text-base text-halford mt-2">Porque los estadios se llenan canción por canción.</p>
        </div>
        <div class="reveal text-center mt-12">
          <button @click="startQuiz" class="bg-solstis text-folsom px-10 py-5 font-body text-lg hover:scale-105 transition-all duration-300 gold-glow interactive-button shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            <span class="button-glow"></span>
            <span class="relative z-20">Arma tu setlist</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Arquetipos Section -->
    <section class="py-20 md:py-40 px-5 md:px-16 bg-surface-container-lowest" id="arquetipos">
      <div class="max-w-[1280px] mx-auto">
        <h2 class="reveal font-display text-3xl md:text-5xl mb-16 text-center">El Supergrupo</h2>
        <p class="reveal font-body text-base text-halford text-center mb-12 max-w-2xl mx-auto">Cada tarjeta brilla con el color de su disco emblemático al pasar el mouse.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="(arq, i) in arquetipos" :key="i"
               class="reveal arquetipo-card relative group aspect-[3/4] overflow-hidden bg-surface cursor-pointer border border-outline-variant/10 transition-all duration-500 hover:-translate-y-2"
               :style="`--hover-color: ${arq.color}; transition-delay: ${(i+1)*0.1}s`">
            <div class="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90 z-20"></div>
            <div class="absolute inset-0 border-4 opacity-0 group-hover:opacity-40 transition-all duration-500 z-30" :style="`border-color: ${arq.color}`"></div>
            <div class="absolute bottom-0 left-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 z-40">
              <h4 class="font-display text-2xl md:text-3xl text-loriga">{{ arq.question }}</h4>
              <p class="font-body text-base text-halford mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">{{ arq.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-20 md:py-40 px-5 md:px-16 bg-surface" id="testimonios">
      <div class="max-w-[1280px] mx-auto">
        <h2 class="reveal font-mono text-xs tracking-[0.3em] uppercase text-solstis text-center mb-16">DESDE EL BACKSTAGE</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <blockquote v-for="(t, i) in testimonios" :key="i" 
                      class="reveal p-12 bg-surface-container relative hover:shadow-[0_10px_30px_rgba(212,175,55,0.05)] transition-all duration-500"
                      :style="`transition-delay: ${(i+1)*0.1}s`">
            <span class="material-symbols-outlined absolute top-8 left-8 text-solstis/20 text-6xl" style="font-variation-settings: 'FILL' 1;">format_quote</span>
            <p class="font-display text-xl md:text-2xl text-loriga italic relative z-10">"{{ t.text }}"</p>
            <cite class="font-mono text-solstis block mt-8 not-italic text-sm">— <strong>{{ t.name }}</strong>, {{ t.age }}, {{ t.role }}</cite>
          </blockquote>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-20 md:py-40 px-5 md:px-16 border-t border-outline-variant/10" id="faq">
      <div class="max-w-3xl mx-auto">
        <h2 class="reveal font-display text-3xl md:text-5xl text-center mb-20">Preguntas del público</h2>
        <div class="space-y-4">
          <div v-for="(faq, i) in faqs" :key="i"
               class="reveal border-b border-outline-variant/30 py-6 group cursor-pointer"
               @click="toggleFaq(i)">
            <div class="flex justify-between items-center">
              <h3 class="font-display text-xl md:text-2xl text-loriga group-hover:text-solstis transition-colors">{{ faq.q }}</h3>
              <span class="material-symbols-outlined text-solstis transition-transform duration-300"
                    :style="openFaq === i ? 'transform: rotate(180deg)' : ''">expand_more</span>
            </div>
            <div class="faq-answer bg-surface-container/50 px-4 mt-4" :class="{ open: openFaq === i }">
              <p class="py-4 font-body text-base text-halford">{{ faq.a }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="relative py-40 px-5 text-center overflow-hidden bg-bocanada">
      <div class="absolute inset-0 bg-solstis/5 -z-10"></div>
      <div class="reveal max-w-4xl mx-auto">
        <h2 class="font-display text-4xl md:text-7xl mb-12">El micrófono está <span class="italic text-solstis underline decoration-1 underline-offset-8">abierto.</span></h2>
        <p class="font-body text-lg text-halford mb-12">Sé el frontman de tu vida. No hay teloneros aquí.</p>
        <button @click="startQuiz" class="bg-solstis text-folsom px-16 py-8 font-body text-2xl hover:scale-110 transition-all duration-500 gold-glow shadow-[0_0_50px_rgba(212,175,55,0.4)] interactive-button">
          <span class="button-glow"></span>
          <span class="relative z-20">🎸 DESCUBRE TU ARQUETIPO</span>
        </button>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-folsom border-t border-outline-variant/10 py-20 px-5 md:px-16">
      <div class="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        <div class="font-mono text-halford text-sm max-w-md text-center md:text-right">
          Quien no tiene la inteligencia para transformarlo todo, solo tiene la inercia para seguir siendo una pieza de recambio. 
          <em class="text-solstis">El escenario es tuyo.</em>
        </div>
        <div class="flex gap-8">
          <a href="#" class="font-body text-xs tracking-[0.1em] uppercase text-vegas hover:text-solstis transition-colors">Instagram</a>
          <a href="#" class="font-body text-xs tracking-[0.1em] uppercase text-vegas hover:text-solstis transition-colors">Twitter/X</a>
          <a href="#" class="font-body text-xs tracking-[0.1em] uppercase text-vegas hover:text-solstis transition-colors">TikTok</a>
          <a href="#" class="font-body text-xs tracking-[0.1em] uppercase text-vegas hover:text-solstis transition-colors">Contacto</a>
        </div>
        <div>
          <div class="font-display text-3xl md:text-5xl text-solstis mb-4 italic">ROCKYOURSELF.ORG</div>
          <div class="font-mono text-halford text-sm">© 2026 ROCKYOURSELF.ORG · TODOS LOS DERECHOS RESERVADOS</div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

const startQuiz = () => {
  if (isAuthenticated.value) {
    router.push('/dashboard')
  } else {
    router.push('/quiz')
  }
}

const openFaq = ref<number | null>(null)
const toggleFaq = (i: number) => {
  openFaq.value = openFaq.value === i ? null : i
}

const viajeCards = [
  { icon: 'psychology', title: 'Cuestionario de Alma', desc: '16 preguntas sin filtros. Evaluamos tu nivel de resistencia frente al sistema y tu capacidad de rockear.', meta: '3 MINUTOS · SIN REGISTRO' },
  { icon: 'stars', title: 'Tu Arquetipo', desc: 'Cerati · Cash · Larregui · Dylan · Vegas · Bunbury · Halford. Descubre qué leyenda comparte tu caos y tu genio.', meta: 'NO ES UN TEST DE REVISTA' },
  { icon: 'album', title: 'Setlist con IA', desc: 'Tu coach de IA (blindado y sin respuestas de manual) diseña tu plan de crecimiento económico, espiritual y mental.', meta: 'SPRINTS SEMANALES · MÉTRICAS REALES' }
]

const pilaresPlan = [
  { color: '#D4AF37', title: 'La Disciplina de Cash', subtitle: '"The Man in Black"', desc: 'Ingresos, metas, blindaje de tus proyectos. Tu rockstar no vive del aire; camina la línea con una ética de hierro y cobra el valor de su autoría.' },
  { color: '#F0F5F9', title: 'La Frecuencia de Larregui', subtitle: '"El Visionario Etéreo"', desc: 'Propósito, valores, paz. Encontrar el patrón invisible y sintonizar el riff que realmente te mueve, fuera del ruido corporativo.' },
  { color: '#C0C0C0', title: 'La Arquitectura de Cerati', subtitle: '"La Arquitectura del Pop"', desc: 'Hábitos, foco, claridad. Diseñar un estado de flow tan impecable y obsesivo que tu ejecución diaria se convierta en una pieza de arte ejecutable.' }
]

const arquetipos = [
  { color: '#00d4ff', question: '¿Eres un Cerati?', desc: 'Sofisticado, perfeccionista, con una obsesión técnica implacable. Creas universos enteros donde otros solo ven bits.' },
  { color: '#ffffff', question: '¿Eres un Cash?', desc: 'Resiliente, auténtico, el que hace el trabajo sucio que otros evitan. Tu fuerza está en tu honestidad brutal.' },
  { color: '#ff0000', question: '¿Eres un Bunbury?', desc: 'El mutante maduro. Camuflas tu ego en la perfección, eres odiado por los pulcros que buscan la regla cuadrada y amado por los melodiosos que entienden tu complejidad.' },
  { color: '#e9c349', question: '¿Eres un Halford?', desc: 'El Metal God. No pides permiso para entrar a la oficina; reclamas el trono porque sabes que eres el nuevo Dios de tu área.' }
]

const testimonios = [
  { text: 'Pensé que estaba en una crisis laboral porque me robaron un proyecto. Resulta que soy un Bunbury en etapa Hellville: me reinventé, saqué algo tres veces más ambicioso y mandé al carajo su regla cuadrada.', name: 'DANTE', age: '36', role: 'DEVELOPER & ROCKSTAR' },
  { text: 'Pensé que estaba en una crisis. Resulta que soy un Cash: necesitaba dejar de pedir permiso para ser quien soy.', name: 'MARÍA', age: '34', role: 'COPYWRITER' },
  { text: 'Mi agente de IA me dijo "Charly García no planificaba, pero sí tenía disciplina creativa". Eso cambió todo.', name: 'CARLOS', age: '29', role: 'DEVELOPER' }
]

const faqs = [
  { q: '¿Es coaching motivacional tradicional?', a: 'Ni de broma. Detestamos el positivismo barato y los eufemismos de recursos humanos. Si estás actuando como un esclavo sumiso del rebaño, nuestra IA te lo va a decir con la honestidad brutal y el cinismo de Ray Loriga.' },
  { q: '¿Cuánto cuesta?', a: 'El cuestionario y el diagnóstico de tu arquetipo mutante son completamente gratis (El Backstage Pass). No cobramos por decirte quién eres ni por mostrarte en qué frecuencia estás operando. Ahora, si quieres que nuestro Agente de IA te diseñe el Setlist Personalizado para hackear tu economía, tu mente y tu espíritu con sprints semanales y métricas de alto voltaje, el pase al Escenario Principal es de pago. Tu rockstar interior no vive del aire, y nuestro código tampoco.' },
  { q: '¿Qué pasa si mi arquetipo es muy oscuro o melancólico (como Nacho Vegas)?', a: 'Como diría Nacho Vegas, no nos interesa mendigar un lugar en este mundo mediocre. Si tu arquetipo es denso, aprendes a crear tu propio lugar bajo tus reglas y con tu propia voz. Tu lado oscuro no es un bug, es tu mayor feature de combate.' }
]

// Intersection Observer for reveal animations
onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
})
</script>
