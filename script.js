var btn = document.getElementById("btn-ajax");

btn.addEventListener("click", function() {
    $.ajax({
            method: "GET",
            url: "https://jsonplaceholder.typicode.com/posts"
        })
        .done(function(msg) {
            for (var i = 0; i < msg.length; i++) {
                var resposta = JSON.parse(JSON.stringify(msg))[i];
                $(".ul-teste").append("<li> UserId: " + resposta.userId + "</li>");
                $(".ul-teste").append("<li> Id: " + resposta.id + "</li>");
                $(".ul-teste").append("<li> Title: " + resposta.title + "</li>");
                $(".ul-teste").append("<li> Body: " + resposta.body + "</li>");
                $(".ul-teste").append("<br>");
            }
        });

});

var btn = document.getElementById("btn-local-storage");

btn.addEventListener("click", function() {
    if (localStorage.getItem('meuGato') != null) {
        alert("Existe uma chave com o nome 'meuGato' no LocalStorage e seu valor é: " + localStorage.getItem('meuGato'));
    } else {
        alert("Ainda não tinha uma chave com o nome 'meuGato' no LocalStorage");
        localStorage.setItem('meuGato', 'Tom');
    }
});


var btn = document.getElementById("btn-salvar-indexedDB");

btn.addEventListener("click", function() {
    if (!$("#nome-parceiro").val() || !$("#codigo-parceiro").val()) {
        alert("Preencha o nome e codigo do parceiro!");
        return;
    }

    var request = indexedDB.open("indexedDB-teste");

    request.onerror = function(event) {
        alert("erro");
    };

    request.onsuccess = function(event) {

        var nomeParceiro = $("#nome-parceiro").val();
        var codigoParceiro = $("#codigo-parceiro").val();

        var novoParceiro = {
            nome: nomeParceiro,
            codigo: codigoParceiro
        }

        var db = event.target.result;

        // Usando transação oncomplete para afirmar que a criação do objectStore 
        // é terminada antes de adicionar algum dado nele.
        // Armazenando valores no novo objectStore.
        var parceirosObjectStore = db.transaction("PARCEIROS", "readwrite").objectStore("PARCEIROS");
        parceirosObjectStore.add(novoParceiro);
    }

});


var btn = document.getElementById("btn-criar-indexedDB");

btn.addEventListener("click", function() {
    var db;
    var request = indexedDB.open("indexedDB-teste");
    request.onerror = function(event) {
        alert("Você não habilitou minha web app para usar IndexedDB?!");
    };
    request.onsuccess = function(event) {
        db = request.result;
    };

    request.onupgradeneeded = function(event) {
        var db = event.target.result;

        // ObjectStorage = Tabela
        var objectStoreParceiros = db.createObjectStore("PARCEIROS", {
            keyPath: "id",
            autoIncrement: true
        });

        //objectStoreParceiros.createIndex("nome", "nome", { unique: false });
        objectStoreParceiros.createIndex("codigo", "codigo", { unique: true });

        console.log("onupgradeneeded Sucess", event);
    };
});


var btn = document.getElementById("btn-criar-adicionar-indexedDB-demo");

btn.addEventListener("click", function() {
    const dbName = "clientes";

    var request = indexedDB.open(dbName);

    request.onerror = function(event) {
        // Tratar erros.
    };
    request.onupgradeneeded = function(event) {
        var db = event.target.result;

        // Cria um objectStore para conter a informação sobre nossos clientes. Nós vamos
        // usar "ssn" como key path porque sabemos que é único;
        var objectStore = db.createObjectStore("clientes", { keyPath: "ssn" });

        // Cria um índice para buscar clientes pelo nome. Podemos ter nomes
        // duplicados, então não podemos usar como índice único.
        objectStore.createIndex("nome", "nome", { unique: false });

        // Cria um índice para buscar clientes por email. Queremos ter certeza
        // que não teremos 2 clientes com o mesmo e-mail;
        objectStore.createIndex("email", "email", { unique: true });

        // Usando transação oncomplete para afirmar que a criação do objectStore 
        // é terminada antes de adicionar algum dado nele.
        objectStore.transaction.oncomplete = function(event) {
            // Armazenando valores no novo objectStore.
            var clientesObjectStore = db.transaction("clientes", "readwrite").objectStore("clientes");
            const DadosClientes = [
                { ssn: "444-44-4444", nome: "Bill", idade: 35, email: "bill@company.com" },
                { ssn: "555-55-5555", nome: "Donna", idade: 32, email: "donna@home.org" }
            ];
            clientesObjectStore.add(DadosClientes[0]);

        }
    };
});