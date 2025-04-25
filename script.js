// Funções de utilidade
const select = (selector) => document.querySelector(selector);
const selectAll = (selector) => document.querySelectorAll(selector);

// Variáveis para elementos DOM frequentemente utilizados
let body, themeSwitch, navbar, navLinks, hamburger, mobileMenu, menuOverlay, closeMenu;
let progressBars, portfolioModals, viewProjectBtns, closeModalBtns;
let quickContactBtn, quickContactForm, closeQuickContact;
let openResumeModal, resumeModal, closeResumeModal, downloadPdfBtn;

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
    
    // Adicionar variável RGB para o accent color (para usar em transparências)
    const root = document.documentElement;
    const accentColor = getComputedStyle(root).getPropertyValue('--accent').trim();
    
    // Converter cor hex para RGB para uso em transparências
    const hexToRgb = (hex) => {
        // Remove o # se existir
        hex = hex.replace('#', '');
        
        // Converte de 3 dígitos para 6 dígitos se necessário (ex: #fff para #ffffff)
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        
        // Converte para RGB
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        return `${r}, ${g}, ${b}`;
    };
    
    // Tenta converter e definir a variável RGB
    try {
        if (accentColor && accentColor !== '') {
            const rgbValue = hexToRgb(accentColor);
            root.style.setProperty('--accent-rgb', rgbValue);
        }
    } catch (error) {
        console.warn('Erro ao converter cor para RGB:', error);
        // Valor fallback
        root.style.setProperty('--accent-rgb', '0, 255, 255');
    }
    
    // Configurar observador para animar seções do currículo quando visíveis
    if (resumeModal) {
        resumeModal.addEventListener('animationSections', animateCVSections);
        
        // Quando o modal for aberto, disparar a animação das seções após um curto delay
        const wrapper = resumeModal.querySelector('.cv-resume-wrapper');
        if (wrapper) {
            wrapper.addEventListener('scroll', function() {
                resumeModal.dispatchEvent(new CustomEvent('animationSections'));
            });
        }
    }
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
    
    // Elementos do modal do currículo
    openResumeModal = select('#openResumeModal');
    resumeModal = select('#resumeModal');
    closeResumeModal = select('#closeResumeModal');
    downloadPdfBtn = select('#downloadPdf');
    
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

    // Modal do currículo
    if (openResumeModal && resumeModal && closeResumeModal) {
        openResumeModal.addEventListener('click', openResume);
        closeResumeModal.addEventListener('click', closeResume);
        
        // Fechar ao clicar fora do conteúdo
        resumeModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeResume();
            }
        });
        
        // Fechar com tecla ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && resumeModal.style.display === 'flex') {
                closeResume();
            }
        });
    }
    
    // Geração de PDF
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', generatePDF);
    }

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
                <a href="#" id="mobileOpenResumeModal">Visualizar Currículo</a>
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
    
    // Configurar botão do currículo no menu mobile
    const mobileOpenResumeModal = select('#mobileOpenResumeModal');
    if (mobileOpenResumeModal && resumeModal) {
        mobileOpenResumeModal.addEventListener('click', function(e) {
            e.preventDefault();
            toggleMobileMenu(); // Fechar o menu mobile
            openResume(e); // Abrir o modal do currículo
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

// Abrir modal do currículo
function openResume(e) {
    e.preventDefault();
    resumeModal.style.display = 'flex';
    body.classList.add('no-scroll');
    
    // Iniciar as animações após o modal ser aberto
    setTimeout(() => {
        animateCVSections();
        // Disparar o evento para seções que ficam visíveis durante a rolagem
        resumeModal.dispatchEvent(new CustomEvent('animationSections'));
    }, 300);
}

// Fechar modal do currículo
function closeResume() {
    resumeModal.style.display = 'none';
    body.classList.remove('no-scroll');
}

// Gerar PDF
function generatePDF() {
    // Referência ao conteúdo do currículo
    const resumeContent = document.getElementById('resumeContent');
    
    // Botão que será temporariamente escondido durante a geração do PDF
    const downloadBtn = document.getElementById('downloadPdf');
    
    // Esconder o botão antes de gerar o PDF
    downloadBtn.style.display = 'none';
    
    // Configurações básicas para o PDF
    const options = {
        margin: 10,
        filename: 'Curriculo_Adeilton_Lima.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // Gerar o PDF usando html2pdf com configurações simples
    html2pdf()
        .from(resumeContent)
        .set(options)
        .save()
        .then(() => {
            // Após o PDF ser gerado, mostrar o botão novamente
            setTimeout(() => {
                downloadBtn.style.display = 'block';
            }, 1000);
        })
        .catch(err => {
            console.error('Erro ao gerar PDF:', err);
            downloadBtn.style.display = 'block';
        });
}

// Função para animar as seções do currículo
function animateCVSections() {
    const sections = document.querySelectorAll('.cv-section');
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        // Se a seção estiver visível na janela
        if (sectionTop < windowHeight * 0.85) {
            section.classList.add('animate');
        }
    });
}