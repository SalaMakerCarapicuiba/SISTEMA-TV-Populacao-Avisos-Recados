<h1 align="center"> Back-End - Sistema de População de Avisos </h1>

<p align="center">
Este projeto é um sistema de gerenciamento de avisos para escolas, permitindo que diferentes usuários (administradores, editores e alunos) criem, editem, aprovem e visualizem avisos que são exibidos nas TVs da escola.</p>

<p align="center">
  <a href="#-tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-rotas">Rotas</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-front_end">Front-End</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#memo-licença">Licença</a>

</p>

<p align="center">
  <img alt="License" src="https://img.shields.io/static/v1?label=license&message=MIT&color=49AA26&labelColor=000000">
</p>

<br>

<p align="center">
  <img src=".github/preview.jpg" width="100%">
</p>

## 🚀 Tecnologias

Esse projeto foi desenvolvido com as seguintes tecnologias:

- Python (versão 3.12.3)
- Django (versão 5.1)
- Django REST Framework (versão 3.15.2)
- Django Simple JWT para autenticação baseada em tokens
- Django Cors Headers para lidar com Cors do navegadores
- PostgreSQL

## 🚀 Rotas

<br><table>
<thead>
<tr>
<th align="center">
<img width="180" height="1">
<p>
<small>Nome</small>
</p>
</th>
<th align="center">
<img width="180" height="1">
<p>
<small>
URL
</small>
</p>
</th>
<th align="center">
<img width="180" height="1">
<p align="center">
<small>
Método  
 </small>
</p>
</th>
<th align="center">
<img width="180" height="1">
<p align="center">
<small>
Permissão
</small>
</p>
</th>
<th align="center">
<img width="180" height="1">
<p align="center">
<small>
Descrição
</small>
</p>
</th>
</tr>
</thead>
<tbody>
<tr>
<td align="center">Registrar Usuário</td>
<td align="center">/api/register/</td>
<td align="center">POST</td>
<td align="center">Todos</td>
<td>Cria um novo usuário na aplicação, porém o usuário não será aprovado até que o administrador faça isso.</td>
</tr>
<tr>
<td  align="center">Login</td>
<td align="center">/api/login/</td>
<td align="center">POST</td>
<td align="center">Todos</td>
<td>Faz login de um usuário e retorna os tokens JWT.</td>
</tr>
<tr>
<td align="center">Listar Usuários</td>
<td align="center">/api/users/</td>
<td align="center">GET</td>
<td align="center">Somente administradores</td>
<td>Retorna a lista de todos os usuários registrados.</td>
</tr>
<tr>
<td align="center">Atualizar Usuário</td>
<td align="center">/api/users/{id}/</td>
<td align="center">PUT ou PATCH</td>
<td align="center">Administrador ou próprio usuário</td>
<td>Atualiza os detalhes de um usuário.</td>
</tr>
<tr>
<td align="center">Aprovar Usuário</td>
<td align="center">/api/users/{id}/approve/</td>
<td align="center">PATCH</td>
<td align="center">Administrador</td>
<td>Aprova ou desaprova um usuário para ter acesso sistema.</td>
</tr>
<tr>
<td align="center">Listar Avisos</td>
<td align="center">/api/notices/</td>
<td align="center">GET</td>
<td align="center">Qualquer usuário autenticado</td>
<td>Retorna a lista de todos os avisos.</td>
</tr>
<tr>
<td align="center">Criar Aviso</td>
<td align="center">/api/notices/</td>
<td align="center"> POST</td>
<td align="center"> Qualquer usuário autenticado</td>
<td>Cria um novo aviso. O aviso precisa ser aprovado por um administrador antes de ser exibido.</td>
</tr>
<tr>
<td align="center">Editar Aviso</td>
<td align="center">/api/notices/{id}/</td>
<td align="center"> PUT ou PATCH</td>
<td align="center"> Administrador ou criador do aviso (antes da aprovação)</td>
<td>Atualiza os detalhes de um aviso.</td>
</tr>
<tr>
<td align="center">Aprovar Aviso</td>
<td align="center">/api/notices/{id}/approve/</td>
<td align="center"> PATCH</td>
<td align="center">Somente administradores</td>
<td>Aprova um aviso, tornando-o visível para todos os usuários.</td>
</tr>
<tr>
<td align="center">Aprovar Aviso</td>
<td align="center">/api/notices/{id}/</td>
<td align="center">DELETE</td>
<td align="center">Administrador ou criador do aviso</td>
<td>Remove um aviso.</td>
</tr>
</tbody>

</table></p>

## 🔖 Front-end

Você pode visualizar o Front-End do projeto através [DESSE LINK](https://www.figma.com/community/file/1200070743637495660).

## :memo: Licença

Esse projeto está sob a licença MIT.

---

Feito com ♥
