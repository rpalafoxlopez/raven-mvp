<template>
  <div class="overflow-x-hidden bg-folsom text-loriga selection:bg-solstis selection:text-folsom scroll-smooth">
    <!-- Navigation -->
    <nav class="fixed top-0 z-50 w-full border-b bg-folsom/80 backdrop-blur-md border-outline-variant/20">
      <div class="flex items-center justify-between px-5 py-4 mx-auto md:px-16 max-w-[1280px]">
        
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-3">
          <img 
            src="/logo_rus.webp" 
            alt="RockYourself" 
            class="object-contain w-auto h-12 md:h-16"
          >
        </router-link>

        <!-- Links -->
        <div class="hidden space-x-8 md:flex">
          <a href="#viaje" class="font-body text-xs tracking-[0.1em] uppercase text-halford hover:text-solstis transition-colors">El Viaje</a>
          <a href="#plan" class="font-body text-xs tracking-[0.1em] uppercase text-halford hover:text-solstis transition-colors">El Plan</a>
          <a href="#arquetipos" class="font-body text-xs tracking-[0.1em] uppercase text-halford hover:text-solstis transition-colors">Arquetipos</a>
          <a href="#faq" class="font-body text-xs tracking-[0.1em] uppercase text-halford hover:text-solstis transition-colors">FAQ</a>
        </div>

        <!-- CTA Button -->
        <button 
          @click="startQuiz"
          class="btn-gold px-6 py-2 font-body text-xs tracking-[0.1em] uppercase hover:scale-105 transition-all duration-300 interactive-button"
        >
          <span class="button-glow"></span>
          <span class="relative z-20">{{ isAuthenticated ? 'Dashboard' : 'Comencemos' }}</span>
        </button>
      </div>
    </nav>


    <!-- Hero Section -->
    <section class="relative flex items-center justify-center min-h-screen pt-20 overflow-hidden">
      <!-- Imagen de fondo -->
      <div class="absolute inset-0 z-0">
        <img 
          src="./hero-bg.webp" 
          alt="Backstage" 
          class="absolute inset-0 object-cover w-full h-full opacity-40 mix-blend-luminosity animate-slow-zoom"
        >
        <div class="absolute inset-0 bg-gradient-to-b from-folsom via-transparent to-folsom"></div>
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.05)_0%,transparent_70%)]"></div>
      </div>
      
      <!-- Contenido -->
      <div class="relative z-10 max-w-4xl px-5 text-center">
        <span class="hero-entrance font-body text-xs tracking-[0.4em] uppercase text-solstis block mb-6 animate-pulse" style="animation-delay: 0.2s">
          El escenario es tuyo · El micrófono está abierto
        </span>
        <h1 class="mb-8 text-4xl leading-tight hero-entrance font-display md:text-7xl text-loriga" style="animation-delay: 0.4s">
          No estás perdido.<br/>
          <span class="italic text-solstis">Estás en el backstage.</span>
        </h1>
        <p class="max-w-2xl mx-auto mb-12 text-lg hero-entrance font-body text-halford" style="animation-delay: 0.5s">
          Deja de operar con ideas prestadas y de ser un personaje secundario en una narrativa que no elegiste. 
          Descubre qué rockstar vive en tu alma, hackea el sistema y diseña tu propio setlist de vida.
        </p>
        <div class="flex flex-col items-center justify-center gap-6 hero-entrance md:flex-row" style="animation-delay: 0.6s">
          <button 
            @click="startQuiz"
            class="w-full md:w-auto btn-gold px-10 py-5 font-body text-lg hover:scale-105 transition-all duration-300 gold-glow interactive-button shadow-[0_0_15px_rgba(212,175,55,0.3)]"
          >
            <span class="button-glow"></span>
            <span class="relative z-20">🎸 Descubre tu arquetipo</span>
          </button>
          <a href="#plan" class="w-full px-10 py-5 text-lg transition-all duration-300 border md:w-auto border-halford/30 text-halford font-body hover:bg-solstis/10 hover:border-solstis hover:text-solstis">
            Ver cómo funciona
          </a>
        </div>
      </div>
    </section>

    <!-- El Viaje Section -->
    <section class="px-5 py-20 md:py-40 md:px-16 bg-surface-container-low" id="viaje">
      <div class="max-w-[1280px] mx-auto">
        <div class="flex flex-col items-end justify-between gap-8 mb-20 reveal md:flex-row">
          <div class="max-w-2xl">
            <h2 class="mb-6 text-3xl font-display md:text-5xl">Tres acordes para romper el molde</h2>
            <p class="text-lg font-body text-halford">El viaje del rockstar no empieza en el escenario. Empieza en el backstage.</p>
          </div>
          <div class="pl-4 font-mono tracking-widest uppercase border-l-2 text-solstis border-solstis">
            Fase de Preparación
          </div>
        </div>
        <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div v-for="(card, i) in viajeCards" :key="i" 
               class="reveal group bg-surface-container p-8 border border-outline-variant/20 light-leak relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-solstis/40 hover:shadow-[0_10px_30px_rgba(212,175,55,0.1)]"
               :style="`transition-delay: ${(i+1)*0.1}s`">
            <span class="mb-6 text-4xl material-symbols-outlined text-solstis">{{ card.icon }}</span>
            <h3 class="mb-4 text-2xl font-display md:text-3xl">{{ card.title }}</h3>
            <p class="mb-8 text-base font-body text-halford">{{ card.desc }}</p>
            <div class="font-mono text-sm text-solstis/60">{{ card.meta }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- El Plan Section -->
    <section class="px-5 py-20 overflow-hidden md:py-40 md:px-16 bg-loriga-soft" id="plan">
      <div class="max-w-[1280px] mx-auto relative">
        <div class="mb-24 text-center reveal">
          <h2 class="relative z-10 text-3xl font-display md:text-5xl">No es terapia. <span class="italic text-solstis">Es un setlist.</span></h2>
          <p class="max-w-2xl mx-auto mt-4 text-lg font-body text-halford">No venimos a arreglar lo "roto". Venimos a potenciar tu código genético.</p>
        </div>
        <div class="grid grid-cols-1 gap-16 md:grid-cols-3">
          <div v-for="(pilar, i) in pilaresPlan" :key="i" class="space-y-6 reveal" :style="`transition-delay: ${(i+1)*0.1}s`">
            <div class="w-20 h-1" :style="`background-color: ${pilar.color}`"></div>
            <h3 class="text-2xl font-display md:text-3xl" :style="`color: ${pilar.color}`">{{ pilar.title }}</h3>
            <p class="text-base italic font-body text-vegas">{{ pilar.subtitle }}</p>
            <p class="text-base font-body text-loriga">{{ pilar.desc }}</p>
          </div>
        </div>
        <div class="max-w-4xl p-12 mx-auto mt-24 border-l-4 reveal bg-loriga border-solstis">
          <div class="font-mono text-solstis text-xs tracking-[0.1em] uppercase mb-4">METODOLOGÍA</div>
          <p class="text-2xl italic font-display md:text-3xl text-loriga">Semanas · Sprints · Celebraciones</p>
          <p class="mt-2 text-base font-body text-halford">Porque los estadios se llenan canción por canción.</p>
        </div>
        <div class="mt-12 text-center reveal">
          <button @click="startQuiz" class="btn-gold px-10 py-5 font-body text-lg hover:scale-105 transition-all duration-300 gold-glow interactive-button shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            <span class="button-glow"></span>
            <span class="relative z-20">Arma tu setlist</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Arquetipos Section -->
    <section class="px-5 py-20 md:py-40 md:px-16 bg-surface-container-lowest" id="arquetipos">
      <div class="max-w-[1280px] mx-auto">
        <h2 class="mb-16 text-3xl text-center reveal font-display md:text-5xl">El Supergrupo</h2>
        <p class="max-w-2xl mx-auto mb-12 text-base text-center reveal font-body text-halford">Cada tarjeta brilla con el color de su disco emblemático al pasar el mouse.</p>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div v-for="(arq, i) in arquetipos" :key="i"
               class="reveal arquetipo-card relative group aspect-[3/4] overflow-hidden bg-surface cursor-pointer border border-outline-variant/10 transition-all duration-500 hover:-translate-y-2"
               :style="`--hover-color: ${arq.color}; transition-delay: ${(i+1)*0.1}s`">
            <div class="absolute inset-0 z-20 bg-gradient-to-t from-background via-transparent to-transparent opacity-90"></div>
            <div class="absolute inset-0 z-30 transition-all duration-500 border-4 opacity-0 group-hover:opacity-40" :style="`border-color: ${arq.color}`"></div>
            <div class="absolute bottom-0 left-0 z-40 p-8 transition-transform duration-500 transform translate-y-4 group-hover:translate-y-0">
              <h4 class="text-2xl font-display md:text-3xl text-loriga">{{ arq.question }}</h4>
              <p class="mt-2 text-base transition-opacity duration-500 opacity-0 font-body text-halford group-hover:opacity-100">{{ arq.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="px-5 py-20 md:py-40 md:px-16 bg-surface" id="testimonios">
      <div class="max-w-[1280px] mx-auto">
        <h2 class="reveal font-mono text-xs tracking-[0.3em] uppercase text-solstis text-center mb-16">DESDE EL BACKSTAGE</h2>
        <div class="grid grid-cols-1 gap-12 md:grid-cols-3">
          <blockquote v-for="(t, i) in testimonios" :key="i" 
                      class="reveal p-12 bg-surface-container relative hover:shadow-[0_10px_30px_rgba(212,175,55,0.05)] transition-all duration-500"
                      :style="`transition-delay: ${(i+1)*0.1}s`">
            <span class="absolute text-6xl material-symbols-outlined top-8 left-8 text-solstis/20" style="font-variation-settings: 'FILL' 1;">format_quote</span>
            <p class="relative z-10 text-xl italic font-display md:text-2xl text-loriga">"{{ t.text }}"</p>
            <cite class="block mt-8 font-mono text-sm not-italic text-solstis">— <strong>{{ t.name }}</strong>, {{ t.age }}, {{ t.role }}</cite>
          </blockquote>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="px-5 py-20 border-t md:py-40 md:px-16 border-outline-variant/10" id="faq">
      <div class="max-w-3xl mx-auto">
        <h2 class="mb-20 text-3xl text-center reveal font-display md:text-5xl">Preguntas del público</h2>
        <div class="space-y-4">
          <div v-for="(faq, i) in faqs" :key="i"
               class="py-6 border-b cursor-pointer reveal border-outline-variant/30 group"
               @click="toggleFaq(i)">
            <div class="flex items-center justify-between gap-4">
              <h3 class="text-xl transition-colors font-display md:text-2xl text-loriga group-hover:text-solstis">{{ faq.q }}</h3>
              <span class="flex-shrink-0 transition-transform duration-300 material-symbols-outlined text-solstis"
                    :style="openFaq === i ? 'transform: rotate(180deg)' : ''">expand_more</span>
            </div>
            <div class="px-4 mt-4 faq-answer bg-surface-container/50" :class="{ open: openFaq === i }">
              <p class="py-4 text-base font-body text-halford">{{ faq.a }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="relative px-5 py-40 overflow-hidden text-center bg-loriga-soft">
      <div class="absolute inset-0 bg-solstis/5 -z-10"></div>
      <div class="max-w-4xl mx-auto reveal">
        <h2 class="mb-12 text-4xl font-display md:text-7xl">El micrófono está <span class="italic underline text-solstis decoration-1 underline-offset-8">abierto.</span></h2>
        <p class="mb-12 text-lg font-body text-halford">Sé el frontman de tu vida. No hay teloneros aquí.</p>
        <button @click="startQuiz" class="btn-gold px-16 py-8 font-body text-2xl hover:scale-110 transition-all duration-500 gold-glow shadow-[0_0_50px_rgba(212,175,55,0.4)] interactive-button">
          <span class="button-glow"></span>
          <span class="relative z-20">🎸 DESCUBRE TU ARQUETIPO</span>
        </button>
      </div>
    </section>

    <!-- Footer -->
    <footer class="px-5 py-20 border-t bg-folsom border-outline-variant/10 md:px-16">
        <div class="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <!-- Izquierda: Tagline -->
          <div class="max-w-md font-mono text-sm text-center text-halford md:text-left">
            Quien no tiene la inteligencia para transformarlo todo, solo tiene la inercia para seguir siendo una pieza de recambio. 
            <em class="text-solstis">El escenario es tuyo.</em>
          </div>

          <!-- Centro: Redes -->
          <div class="flex gap-8">
            <a href="#" class="font-body text-xs tracking-[0.1em] uppercase text-vegas hover:text-solstis transition-colors">Instagram</a>
            <a href="#" class="font-body text-xs tracking-[0.1em] uppercase text-vegas hover:text-solstis transition-colors">Twitter/X</a>
            <a href="#" class="font-body text-xs tracking-[0.1em] uppercase text-vegas hover:text-solstis transition-colors">TikTok</a>
            <a href="#" class="font-body text-xs tracking-[0.1em] uppercase text-vegas hover:text-solstis transition-colors">Contacto</a>
          </div>

          <!-- Derecha: Logo + Copyright -->
          <div class="flex flex-col items-center justify-center text-center ">
            <router-link to="/" class="flex items-center">
              <img 
                src="/logo_rus.webp" 
                alt="RockYourself" 
                class="object-contain w-auto h-12 transition-opacity md:h-16 opacity-90 hover:opacity-100"
              >
            </router-link>
            <div class="py-1 font-mono text-xs tracking-wider text-halford">
              © 2026 ROCKYOURSELF.ORG
            </div>
          </div>

        </div>
      </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

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

const openFaq = ref(null)
const toggleFaq = (i) => {
  openFaq.value = openFaq.value === i ? null : i
}

const viajeCards = [
  { icon: 'psychology', title: 'Cuestionario de Alma', desc: '32 preguntas sin filtros. Evaluamos tu nivel de resistencia frente al sistema y tu capacidad de rockear.', meta: '5 MINUTOS · SIN REGISTRO' },
  { icon: 'stars', title: 'Tu Arquetipo', desc: 'Cerati · Cash · Larregui · Dylan · Vegas · Bunbury · Halford. Descubre qué leyenda comparte tu caos y tu genio.', meta: 'NO ES UN TEST DE REVISTA' },
  { icon: 'album', title: 'Setlist con IA', desc: 'Tu coach de IA (blindado y sin respuestas de manual) diseña tu plan de crecimiento económico, espiritual y mental.', meta: 'SPRINTS SEMANALES · MÉTRICAS REALES' }
]

const pilaresPlan = [
  { color: '#C9A227', title: 'La Disciplina de Cash', subtitle: '"The Man in Black"', desc: 'Ingresos, metas, blindaje de tus proyectos. Tu rockstar no vive del aire; camina la línea con una ética de hierro y cobra el valor de su autoría.' },
  { color: '#0A0A0A', title: 'La Frecuencia de Larregui', subtitle: '"El Visionario Etéreo"', desc: 'Propósito, valores, paz. Encontrar el patrón invisible y sintonizar el riff que realmente te mueve, fuera del ruido corporativo.' },
  { color: '#5C5C54', title: 'La Arquitectura de Cerati', subtitle: '"La Arquitectura del Pop"', desc: 'Hábitos, foco, claridad. Diseñar un estado de flow tan impecable y obsesivo que tu ejecución diaria se convierta en una pieza de arte ejecutable.' }
]

const arquetipos = [
  { color: '#0A0A0A', question: '¿Eres un Cerati?', desc: 'Sofisticado, perfeccionista, con una obsesión técnica implacable. Creas universos enteros donde otros solo ven bits.' },
  { color: '#C9A227', question: '¿Eres un Cash?', desc: 'Resiliente, auténtico, el que hace el trabajo sucio que otros evitan. Tu fuerza está en tu honestidad brutal.' },
  { color: '#5C5C54', question: '¿Eres un Bunbury?', desc: 'El mutante maduro. Camuflas tu ego en la perfección, eres odiado por los pulcros que buscan la regla cuadrada y amado por los melodiosos que entienden tu complejidad.' },
  { color: '#E8D690', question: '¿Eres un Halford?', desc: 'El Metal God. No pides permiso para entrar a la oficina; reclamas el trono porque sabes que eres el nuevo Dios de tu área.' }
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

// ===== INTERACTIVE BUTTON GLOW EFFECT =====
const handleButtonMouseMove = (e) => {
  const btn = e.currentTarget
  const glow = btn.querySelector('.button-glow')
  if (!glow) return
  const rect = btn.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  glow.style.left = x + 'px'
  glow.style.top = y + 'px'
}

const attachButtonListeners = () => {
  document.querySelectorAll('.interactive-button').forEach(btn => {
    btn.addEventListener('mousemove', handleButtonMouseMove)
  })
}

const detachButtonListeners = () => {
  document.querySelectorAll('.interactive-button').forEach(btn => {
    btn.removeEventListener('mousemove', handleButtonMouseMove)
  })
}

onMounted(() => {
  // Intersection Observer for reveal animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
  
  // Attach button glow listeners
  attachButtonListeners()
})

onUnmounted(() => {
  detachButtonListeners()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@500&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');

.font-display { font-family: 'Playfair Display', serif; }
.font-body { font-family: 'Inter', sans-serif; }
.font-mono { font-family: 'JetBrains Mono', monospace; }

.bg-folsom { background-color: #FFFFFF; }
.bg-bocanada { background-color: #0A0A0A; }
.bg-surface { background-color: #FFFFFF; }
.bg-surface-container { background-color: #FAF8F3; }
.bg-surface-container-low { background-color: #F5F1E6; }
.bg-surface-container-lowest { background-color: #FFFFFF; }

.text-loriga { color: #0A0A0A; }
.text-solstis { color: #C9A227; }
.text-halford { color: #5C5C54; }
.text-vegas { color: #7A7A70; }
.text-folsom { color: #FFFFFF; }

.border-outline-variant\/10 { border-color: rgba(10, 10, 10, 0.08); }
.border-outline-variant\/20 { border-color: rgba(10, 10, 10, 0.12); }
.border-outline-variant\/30 { border-color: rgba(10, 10, 10, 0.15); }

.selection\:bg-solstis::selection { background-color: #C9A227; }
.selection\:text-folsom::selection { color: #FFFFFF; }

.gold-glow:hover {
  box-shadow: 0 0 30px rgba(201, 162, 39, 0.35);
}

.light-leak {
  background: linear-gradient(135deg, transparent 40%, rgba(201,162,39,0.12) 50%, transparent 60%);
  background-size: 300% 300%;
  transition: background-position 0.8s ease;
}
.light-leak:hover {
  background-position: 100% 100%;
}

.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}
.reveal.active {
  opacity: 1;
  transform: translateY(0);
}

.hero-entrance {
  opacity: 0;
  transform: translateY(20px);
  animation: heroFadeIn 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
@keyframes heroFadeIn {
  to { opacity: 1; transform: translateY(0); }
}

/* SLOW ZOOM FOR HERO BACKGROUND */
@keyframes slowZoom {
  0% { transform: scale(1); }
  100% { transform: scale(1.15); }
}
.animate-slow-zoom {
  animation: slowZoom 20s ease-in-out infinite alternate;
}

.interactive-button {
  position: relative;
  overflow: hidden;
}
.button-glow {
  position: absolute;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: opacity 0.3s;
  opacity: 0;
  z-index: 10;
}
.interactive-button:hover .button-glow {
  opacity: 1;
}

.arquetipo-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background-color: var(--hover-color, transparent);
  opacity: 0;
  transition: opacity 0.5s ease;
  z-index: 10;
}
.arquetipo-card:hover::before {
  opacity: 0.15;
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s ease, padding 0.5s ease;
}
.faq-answer.open {
  max-height: 500px;
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>