// var ambiente_processo = 'producao';
var ambiente_processo = 'desenvolvimento';

var caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev';
// Acima, temos o uso do operador ternário para definir o caminho do arquivo .env
// A sintaxe do operador ternário é: condição ? valor_se_verdadeiro : valor_se_falso

require("dotenv").config({ path: caminho_env });

var express = require("express");
var cors = require("cors");
var path = require("path");
var PORTA_APP = process.env.APP_PORT;
var HOST_APP = process.env.APP_HOST;

var app = express();

var indexRouter = require("./src/routes/index");
var usuarioRouter = require("./src/routes/usuarios");
var avisosRouter = require("./src/routes/avisos");
var medidasRouter = require("./src/routes/medidas");
var aquariosRouter = require("./src/routes/aquarios");
var empresasRouter = require("./src/routes/empresas");
var quizRouter = require("./src/routes/quiz");
var dashboardRouter = require("./src/routes/dashboard");
var preferenciasRouter = require("./src/routes/preferencias");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use("/", indexRouter);
app.use("/usuarios", usuarioRouter);
app.use("/avisos", avisosRouter);
app.use("/medidas", medidasRouter);
app.use("/aquarios", aquariosRouter);
app.use("/empresas", empresasRouter);
app.use("/quiz", quizRouter);
app.use("/dash", dashboardRouter);
app.use("/preferencias", preferenciasRouter);

// Não use app.listen quando também criamos um server HTTP e chamamos server.listen
// Isso evita erro EADDRINUSE por tentativa de escutar a mesma porta duas vezes.

const pianoRoutes = require("./src/routes/pianoRoutes");
app.use("/piano", pianoRoutes);

// criar server HTTP usando o mesmo `app`
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

// expor io para controllers
app.set('io', io);

// iniciar o servidor (substitui app.listen)
const PORT = process.env.APP_PORT || process.env.PORT || 3000;
server.listen(PORT, function () {
  console.log(`
##   ##  ######   #####             ####       ##     ######     ##              ##  ##    ####    ######  
##   ##  ##       ##  ##            ## ##     ####      ##      ####             ##  ##     ##         ##  
##   ##  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##        ##   
## # ##  ####     #####    ######   ##  ##   ######     ##     ######   ######   ##  ##     ##       ##    
#######  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##      ##     
### ###  ##       ##  ##            ## ##    ##  ##     ##     ##  ##             ####      ##     ##      
##   ##  ######   #####             ####     ##  ##     ##     ##  ##              ##      ####    ######  

Servidor rodando em http://${process.env.APP_HOST || 'localhost'}:${PORT}
`);
});
