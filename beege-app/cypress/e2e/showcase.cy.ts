describe('BeeGe - Tour Demonstrativo Completo (Showcase / GIF)', () => {
  beforeEach(() => {
    // Definir viewport mobile proporcional de smartphone moderno
    cy.viewport(390, 844);
  });

  it('Executa o tour interativo por toda a plataforma BeeGe', () => {
    // 1. Início e Onboarding
    cy.visit('/onboarding');
    cy.wait(800);

    // Percorrer os 4 slides de onboarding
    cy.get('.onboarding-main-btn').click();
    cy.wait(700);
    cy.get('.onboarding-main-btn').click();
    cy.wait(700);
    cy.get('.onboarding-main-btn').click();
    cy.wait(700);
    cy.get('.onboarding-main-btn').click();
    cy.wait(900);

    // 2. Tela de Login -> Entrar
    cy.url().should('include', '/login');
    cy.get('#input-login-email').type('estudante@unb.br', { delay: 30 });
    cy.get('#input-login-password').type('calculo123', { delay: 30 });
    cy.wait(400);
    cy.get('#btn-login-submit').click();
    cy.wait(1200);

    // 3. Dashboard Principal
    cy.url().should('include', '/dashboard');
    cy.contains('BeeGe').should('be.visible');

    // Trocar dica da mascote Limia
    cy.contains('Nova dica').click({ force: true });
    cy.wait(700);
    cy.contains('Nova dica').click({ force: true });
    cy.wait(700);

    // 4. Revisão Teórica com KaTeX
    cy.contains('1. Limites Fundamentais').should('be.visible');
    cy.get('ion-button').contains('Revisar').first().click({ force: true });
    cy.wait(1000);

    // Rolar a teoria para exibir fórmulas
    cy.get('ion-content').first().scrollTo('bottom', { ensureScrollable: false, duration: 1200 });
    cy.wait(800);
    cy.get('ion-content').first().scrollTo('top', { ensureScrollable: false, duration: 800 });
    cy.wait(500);

    // 5. Prática de Exercícios e Resolução
    cy.get('ion-button').contains('Praticar').first().click({ force: true });
    cy.wait(1000);

    // Selecionar alternativa e confirmar
    cy.contains('5/2').click({ force: true });
    cy.wait(600);
    cy.contains('Confirmar Resposta').click({ force: true });
    cy.wait(1200);

    // Avançar questão
    cy.contains('Próxima Questão').click({ force: true });
    cy.wait(800);

    // 6. Fórum Comunitário
    cy.get('#tab-btn-forum').click({ force: true });
    cy.wait(1000);

    // Visualizar respostas de uma dúvida
    cy.contains('Ver Respostas').first().click({ force: true });
    cy.wait(1000);
    cy.contains('Ocultar Respostas').first().click({ force: true });
    cy.wait(500);

    // 7. Perfil do Estudante & Métricas
    cy.get('#tab-btn-perfil').click({ force: true });
    cy.wait(1000);
    cy.contains('Estatísticas de Estudo').should('be.visible');

    // 8. Troca de Instituição (Multi-Universidade)
    cy.get('#btn-trocar-universidade-perfil').click({ force: true });
    cy.wait(1000);
    cy.url().should('include', '/universidades');

    // Selecionar Universidade Federal de Minas Gerais
    cy.contains('UFMG').first().click({ force: true });
    cy.wait(1200);

    // 9. Retorno ao Dashboard com Ementa UFMG
    cy.url().should('include', '/dashboard');
    cy.contains('UFMG').should('be.visible');
    cy.wait(1500);
  });
});
