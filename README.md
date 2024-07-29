# Desafio Bulir de Node.Js
Essa API foi criada com intuito de servir de teste para ingressar na companhia Bulir-Technology como engenheiro de software sendo essa a primeira de 3 desafios.

Trata-se de uma API REASTfull feita com Node.Js para  uma plataforma onde clientes podem contratar
prestadores de serviços. 

A API deve permitir o gerenciamento de usuários (clientes e
prestadores de serviços), criação de serviços, contratação de serviços, e
gerenciamento de transações financeiras.

## Instalação e configuração da API
1. Baixar o projeto por inteiro
2. Descompactar a pasta do projeto
3. Aceder a pasta pelo terminar
4. executar o comando **npm install** ou **npm i** para instalar as dependencias necessárias

Nota: o aquiro request.http contem alguns dos testes feitos na API, pode ainda ser usado como guia

Nota2: apenas duas rotas são acessas sem autenticação a de **cadastro e login** de usuarios, as demais precisa-se passar um token de autorização via headers na posição **x-access-token**  que é dado no login do usuario.
ex: x-access-token:seuTokenDeAutorizacao 