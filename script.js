// Funções de utilidade
const select = (selector) => document.querySelector(selector);
const selectAll = (selector) => document.querySelectorAll(selector);

// Variáveis para elementos DOM frequentemente utilizados
let body, themeSwitch, navbar, navLinks, hamburger, mobileMenu, menuOverlay, closeMenu;
let progressBars, portfolioModals, viewProjectBtns, closeModalBtns;
let quickContactBtn, quickContactForm, closeQuickContact;

// Função de inicialização principal
document.addEventListener('DOMContentLoaded', function() {
    // Inicialização de elementos
    initDOMElements();

    // Configuração de manipuladores de eventos
    setupEventListeners();

    // Configuração de observadores de intersecção
    setupIntersectionObservers();

    // Inicia o efeito de digitação
    typeWriter();

    // Verifica as preferências de tema do sistema
    checkSystemThemePreference();

    // Adiciona classe CSS fade-in para cada seção
    document.querySelectorAll('section').forEach(section => {
        if (section.id !== 'home') {
            section.classList.add('animate-on-scroll');
        }
    });

    // Adiciona tratamento para imagens ausentes
    document.querySelectorAll('img').forEach(img => {
        img.onerror = function() {
            this.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22286%22%20height%3D%22180%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20286%20180%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18d7e93c1d2%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18d7e93c1d2%22%3E%3Crect%20width%3D%22286%22%20height%3D%22180%22%20fill%3D%22%23373940%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2297.41041946411133%22%20y%3D%2296.3%22%3EImagem%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
            this.alt = 'Imagem placeholder';
        };
    });
});

// Inicializa referências a elementos DOM
function initDOMElements() {
    body = document.body;
    themeSwitch = select('#theme-switch');
    navbar = select('.navbar');
    navLinks = selectAll('.nav-links a');
    hamburger = select('.hamburger');
    progressBars = selectAll('.progress-bar');
    viewProjectBtns = selectAll('.view-project');
    closeModalBtns = selectAll('.close-modal');
    quickContactBtn = select('#quickContact');
    quickContactForm = select('#quickContactForm');
    closeQuickContact = select('.close-quick-contact');
    
    // Adiciona menu mobile ao DOM
    addMobileMenuToDom();
}

// Configuração de manipuladores de eventos
function setupEventListeners() {
    // Alternância de tema
    themeSwitch.addEventListener('change', toggleTheme);

    // Rolagem para detecção de navbar
    window.addEventListener('scroll', handleScroll);
    
    // Links de navegação ativos
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            updateActiveNavLink(this);
        });
    });

    // Manipulação do menu móvel
    hamburger.addEventListener('click', toggleMobileMenu);
    closeMenu.addEventListener('click', toggleMobileMenu);
    menuOverlay.addEventListener('click', toggleMobileMenu);

    // Botões de projeto de portfólio
    viewProjectBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project');
            openProjectModal(projectId);
        });
    });

    // Fechar modais
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeProjectModal);
    });

    // Contato rápido
    quickContactBtn.addEventListener('click', toggleQuickContact);
    closeQuickContact.addEventListener('click', toggleQuickContact);

    // Manipulação de formulários
    setupFormSubmissions();
}

// Configuração de observadores de intersecção para animações
function setupIntersectionObservers() {
    // Observador para barras de progresso
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const progress = progressBar.getAttribute('data-progress');
                setTimeout(() => {
                    progressBar.style.width = `${progress}%`;
                }, 300); // Pequeno atraso para melhor efeito visual
                // Desconecta após a animação para evitar repetição
                progressObserver.unobserve(progressBar);
            }
        });
    }, { threshold: 0.2 });

    // Observar todas as barras de progresso
    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });

    // Observador para seções com fade in
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    // Observar seções principais
    selectAll('section').forEach(section => {
        if (section.id !== 'home') { // Excluir home que já tem animação
            fadeObserver.observe(section);
        }
    });
}

// Alternância de tema
function toggleTheme() {
    body.classList.toggle('light-mode');
    
    // Armazena a preferência do usuário
    const currentTheme = body.classList.contains('light-mode') ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
}

// Verificar preferência de tema do sistema
function checkSystemThemePreference() {
    // Primeiro, verificar se o usuário já escolheu um tema
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        // Aplicar tema salvo
        if (savedTheme === 'light') {
            body.classList.add('light-mode');
            themeSwitch.checked = true;
        }
    } else {
        // Verificar preferência do sistema
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        
        if (prefersDarkScheme.matches) {
            // O sistema prefere tema escuro, que já é o padrão
            // Não precisa fazer nada
        } else {
            // O sistema prefere tema claro
            body.classList.add('light-mode');
            themeSwitch.checked = true;
        }
    }
}

// Manipulador de rolagem para a navbar
function handleScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Atualiza link ativo com base na posição de rolagem
    updateNavLinkBasedOnScroll();
}

// Atualiza link ativo com base na posição de rolagem
function updateNavLinkBasedOnScroll() {
    const scrollPosition = window.scrollY + 100;
    
    // Encontra a seção atualmente visível
    const sections = selectAll('section');
    let currentSection = null;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.id;
        }
    });
    
    // Atualiza classes ativas
    if (currentSection) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
}

// Atualiza link de navegação ativo
function updateActiveNavLink(clickedLink) {
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    clickedLink.classList.add('active');
    
    // Fecha o menu móvel se estiver aberto
    if (mobileMenu.classList.contains('active')) {
        toggleMobileMenu();
    }
}

// Adiciona o menu móvel ao DOM
function addMobileMenuToDom() {
    // Cria menu mobile e overlay
    const mobileMenuHTML = `
        <div class="mobile-menu">
            <span class="close-menu"><i class="fas fa-times"></i></span>
            <div class="mobile-menu-links">
                <a href="#home">Home</a>
                <a href="#sobre">Sobre</a>
                <a href="#habilidades">Habilidades</a>
                <a href="#servicos">Serviços</a>
                <a href="#portfolio">Portfólio</a>
                <a href="#contato">Contato</a>
            </div>
            <div class="mobile-theme-toggle">
                <span class="theme-label">Alternar Tema</span>
                <div class="theme-switch-wrapper">
                    <input type="checkbox" id="mobile-theme-switch">
                    <label for="mobile-theme-switch" class="mobile-toggle-label">
                        <i class="fas fa-moon"></i>
                        <i class="fas fa-sun"></i>
                        <span class="toggle-ball"></span>
                    </label>
                </div>
            </div>
        </div>
        <div class="menu-overlay"></div>
    `;
    
    // Inserir no body
    body.insertAdjacentHTML('beforeend', mobileMenuHTML);
    
    // Atualizar referências
    mobileMenu = select('.mobile-menu');
    menuOverlay = select('.menu-overlay');
    closeMenu = select('.close-menu');
    
    // Configurar botão de tema no menu móvel
    const mobileThemeSwitch = select('#mobile-theme-switch');
    if (mobileThemeSwitch) {
        // Sincronizar estado com o botão principal
        mobileThemeSwitch.checked = themeSwitch.checked;
        
        // Adicionar evento para alternar tema
        mobileThemeSwitch.addEventListener('change', function() {
            // Sincronizar com o botão principal
            themeSwitch.checked = this.checked;
            toggleTheme();
        });
    }
    
    // Adicionar eventos aos links do menu móvel
    const mobileLinks = selectAll('.mobile-menu-links a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            toggleMobileMenu();
        });
    });
}

// Alternar menu móvel
function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    body.classList.toggle('no-scroll');
}

// Abrir modal de projeto
function openProjectModal(projectId) {
    const modal = select(`#${projectId}-modal`);
    
    if (modal) {
        modal.classList.add('active');
        body.classList.add('no-scroll');
        
        // Adicionar manipulador de tecla Escape
        document.addEventListener('keydown', handleEscapeKey);
        
        // Adicionar manipulador de clique fora
        modal.addEventListener('click', handleOutsideClick);
    }
}

// Fechar modal de projeto
function closeProjectModal() {
    const activeModal = select('.portfolio-modal.active');
    
    if (activeModal) {
        activeModal.classList.remove('active');
        body.classList.remove('no-scroll');
        
        // Remover manipuladores de evento
        document.removeEventListener('keydown', handleEscapeKey);
        activeModal.removeEventListener('click', handleOutsideClick);
    }
}

// Manipular tecla Escape
function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        closeProjectModal();
    }
}

// Manipular clique fora do modal
function handleOutsideClick(e) {
    if (e.target.classList.contains('portfolio-modal')) {
        closeProjectModal();
    }
}

// Alternar formulário de contato rápido
function toggleQuickContact() {
    quickContactForm.classList.toggle('active');
}

// Configurar envios de formulário
function setupFormSubmissions() {
    const contactForm = select('#contactForm');
    const quickForm = select('.quick-contact form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    if (quickForm) {
        quickForm.addEventListener('submit', handleFormSubmit);
    }
}

// Manipular envio de formulário
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Aqui você adicionaria a lógica para enviar os dados do formulário
    // Por exemplo, usando fetch para enviar para um backend
    
    // Para este exemplo, apenas simularemos uma submissão bem-sucedida
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Mostrar status de envio
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    // Simular atraso de rede
    setTimeout(() => {
        // Resetar formulário e botão
        form.reset();
        submitBtn.textContent = 'Enviado!';
        
        // Restaurar texto original após algum tempo
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Se for o formulário rápido, fechá-lo
            if (form.closest('.quick-contact')) {
                toggleQuickContact();
            }
        }, 2000);
    }, 1500);
}

// Efeito de digitação para títulos
function typeWriter() {
    const nameElement = select('#name-typing');
    const titleElement = select('#title-typing');
    
    if (!nameElement || !titleElement) return;
    
    const name = nameElement.textContent;
    const title = titleElement.textContent;
    
    nameElement.innerHTML = '';
    titleElement.innerHTML = '';
    
    // Função para digitar texto
    const typeText = (element, text, i = 0) => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            setTimeout(() => typeText(element, text, i + 1), 100);
        }
    };
    
    // Iniciar digitação do nome
    typeText(nameElement, name);
    
    // Após o nome, iniciar digitação do título
    setTimeout(() => {
        typeText(titleElement, title);
    }, name.length * 100 + 500);
}

// Animar elementos ao aparecer na tela
document.addEventListener('scroll', function() {
    const animatedElements = selectAll('.animate-on-scroll:not(.animated)');
    
    animatedElements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.classList.add('animated');
        }
    });
});