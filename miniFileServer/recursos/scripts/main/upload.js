const dialogUpload =  {
    step: 0,
    filename: null,
    extension: null,
    screens: [
        $("#container_upload_first"),
        $("#container_upload_second"),
        $("#container_upload_third")
    ],

    setName(name) {
        if (!name.includes('.')) {
            this.filename = name
            this.extension = ''
        } else {
            const sep = name.lastIndexOf('.')
            this.filename = name.slice(0, sep)
            this.extension = name.slice(sep)
        }
    },
    
    closeUpload(reset=true) {
        this.step = 0

        if (reset) {
            this.filename = null
            this.extension = null
        }

        this.screens.forEach(screen => screen.css("display", "none"))
    },

    toStep(step) {
        if (step < 0 || step >= this.screens.length) return;

        this.closeUpload(false)
        this.step = step

        // Atualização de estados por tela

        if (this.step == 1) { //tela de renomeação
            $("#input_rename_upload").val(this.filename + this.extension)
        }


        // renderizar
        this.screens[this.step].css("display", "flex")
    },

    back() {
        return this.toStep(Math.max(0, this.step - 1))
    },

    next() {
        return this.toStep(Math.min(this.screens.length-1, this.step + 1))
    }
}

//eventos de click

$("#btn_upload").click(() => {
    //fechar o upload
    if (dialogUpload.step > 0)
        return dialogUpload.closeUpload();

    //limpar variaveis e abrir upload
    dialogUpload.toStep(0)
})

$(".container_upload").click(() => {
    dialogUpload.closeUpload();
})

$(".window_upload").click((e) => e.stopPropagation())

// Passo 1 - Selecionar arquivo

$("#div_sel_file").click(() => {
    $("#inputArquivo").trigger('click')
})

$("#inputArquivo").click((event) => event.stopPropagation()) //tem que parar a propagação, pois um clique aqui, gera um clique na div pai, gerando uma recursão
$("#inputArquivo").change((value) => {
    const idx = value.target.files.length - 1
    const name = value.target.files[idx].name

    if (!name) return;

    dialogUpload.setName(name)

    dialogUpload.next()
})

// Passo 2 - Renomear arquivo e upar

$("#form_upload").submit((e) => {
    e.preventDefault()

    dialogUpload.next()
})

$("#input_rename_upload").change(() => { //trocar por: .on('input', blablabla)
    console.log("AAAA")
})

// Passo 3 - Verificar se arquivo já existe

$("#btn_alterar_nome").click(() => {
    dialogUpload.back()
})

$("#btn_substitur").click(() => {
    alert("upado")
    dialogUpload.closeUpload()
})