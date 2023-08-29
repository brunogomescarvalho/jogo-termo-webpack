
import { acervo } from "../dominio/jogo/acervo-termo";
import { jogo, resultado } from "../dominio/jogo/jogo-termo";
import { IProgresso } from "../dominio/progresso/IProgresso";
import { Progresso } from "../dominio/progresso/progresso-termo";
import { LocalStorageService } from "../services/local-storage-service";
import './styles.css';;

class telaTermo {

    pnlTeclado: HTMLElement;
    btnEnter: HTMLButtonElement;
    btnHistorico: HTMLButtonElement;
    btnBack: HTMLButtonElement;
    pnlConteudo: HTMLElement;
    pnlTermo: HTMLElement;
    letras: HTMLElement[] = [];
    maxCol: number = 5;
    maxRow: number = 5;
    coluna: number = 0;
    linha: number = 0;
    palavra: string = "";

    constructor(private jogo: jogo, private progresso: Progresso) {
        this.atribuirEventos();
        this.pnlTermo = document.getElementById('pnlTermo') as HTMLElement;
        this.pnlConteudo = document.getElementById('pnlConteudo') as HTMLElement;
    }

    private atribuirEventos() {
        this.btnEnter = document.getElementById('btnEnter') as HTMLButtonElement;
        this.btnEnter.addEventListener('click', () => this.verificarJogada());

        this.btnBack = document.getElementById('btnBackspace') as HTMLButtonElement;
        this.btnBack.addEventListener('click', () => this.corrigirInput());

        this.pnlTeclado = document.getElementById('pnlTeclado') as HTMLElement;

        for (let i = 0; i < this.pnlTeclado.children.length; i++) {
            const tecla = this.pnlTeclado.children.item(i) as HTMLButtonElement;
            if (tecla.textContent != 'Enter' && tecla.id != 'btnBackspace')
                tecla.addEventListener('click', (sender) => this.atribuirLetra(sender));
        }

        this.btnHistorico = document.getElementById('btnHistorico') as HTMLButtonElement;
        this.btnHistorico.addEventListener('click', () => this.obterProgresso());
    }

    private atribuirLetra(sender: Event): void {
        if (this.palavra.length === this.maxCol)
            return;

        const tbLetra = this.pnlTermo
            .children[this.linha]
            .children[this.coluna] as HTMLElement;

        let letra = sender.target as (HTMLButtonElement);
        tbLetra.textContent = letra.innerText;
        this.palavra += letra.innerText;
        this.letras.push(tbLetra);
        this.coluna++;
    }

    private verificarJogada(): void {

        if (this.palavra.length !== this.maxCol)
            return;

        this.colorirletras();

        if (this.jogo.acertou(this.palavra)) {
            this.enviarMensagem(true);
            this.salvarProgresso(true, this.linha);
        }

        else {
            this.linha++;

            if (this.linha === this.maxRow) {
                this.enviarMensagem(false);
                this.salvarProgresso(false);
            }
        }

        this.limparDados();
    }

    private colorirletras() {
        let resultados: resultado[] = this.jogo.verificarJogada(this.palavra);

        for (let i = 0; i <= this.palavra.length; i++) {
            switch (resultados[i]) {
                case resultado.Acerto:
                    this.letras[i].classList.add('letra-correta');
                    break;
                case resultado.Erro:
                    this.letras[i].classList.add('letra-incorreta');
                    break;
                case resultado.Inexistente:
                    this.letras[i].classList.add('letra-inexistente');
                    break;
            }
        }
    }

    private gerarElementosMsgFinal(): HTMLSpanElement {
        this.removerMsgFinal();

        let div = document.createElement('div');
        div.id = "divMensagemFinal";
        div.classList.add('group-mensagem');
        this.pnlConteudo.appendChild(div);

        let spanMsg = document.createElement('span');
        div.appendChild(spanMsg);

        let button = document.createElement('button');
        button.classList.add('btn-reiniciar');
        button.id = "btnReiniciar";
        button.innerText = "Recomeçar";
        button.addEventListener('click', () => this.reiniciarJogo());
        div.appendChild(button);

        this.alterarStatusTeclado();

        return spanMsg;
    }

    private enviarMensagem(venceu: boolean) {
        let msg = this.gerarElementosMsgFinal();

        if (venceu) {
            msg.textContent = `Parabéns! Você acertou a palavra: ${this.jogo.getPalavra()}`
        }
        else {
            msg.textContent = `Fim de Jogo! A palavra era: ${this.jogo.getPalavra()}`
        }
    }

    private corrigirInput(): void {
        if (this.coluna == 0)
            return;

        let letra = this.letras[this.coluna - 1];
        letra.textContent = "";
        this.letras.pop();
        this.coluna--;
        this.palavra = this.palavra.substring(0, this.palavra.length - 1);
    }

    private reiniciarJogo() {
        this.limparDados();
        this.linha = 0;

        this.jogo = new jogo(new acervo());

        this.limparQuadros();
        this.removerMsgFinal();
        this.alterarStatusTeclado();
    }

    private alterarStatusTeclado() {
        for (let index = 0; index < this.pnlTeclado.children.length; index++) {
            let tecla = this.pnlTeclado.children[index] as HTMLButtonElement;
            tecla.disabled = !tecla.disabled;
        }
    }

    private limparDados() {
        this.coluna = 0;
        this.palavra = "";
        this.letras = [];
    }

    private removerMsgFinal() {
        const mensagemFinal = document.getElementById('divMensagemFinal');
        if (mensagemFinal) {
            this.pnlConteudo.removeChild(mensagemFinal);
        }
    }

    private limparQuadros() {
        for (let i = 0; i < this.pnlTermo.children.length; i++) {
            const linha = this.pnlTermo.children.item(i) as HTMLElement;
            for (let index = 0; index < linha.children.length; index++) {
                const letra = linha.children.item(index) as HTMLElement;
                letra.classList.remove('letra-correta', 'letra-incorreta', 'letra-inexistente');
                letra.textContent = '';
            }
        }
    }

    private salvarProgresso(acertou: boolean, linha?: number) {
        this.progresso.atualizarJogada(acertou, linha)
    }

    private obterProgresso() {

        const progresso = this.progresso.obterDados() as IProgresso;
        if (!progresso) return;

        console.log(progresso)

        const valores = document.getElementById('valores') as HTMLDivElement;
        valores.children[0].textContent = progresso.jogos.toString();
        valores.children[1].textContent = progresso.porcentagemVitorias.toString() + "%";
        valores.children[2].textContent = progresso.sequenciaVitorias.toString();
        valores.children[3].textContent = progresso.melhorSequencia.toString();

        const historico = document.getElementById('historico') as HTMLDivElement;
        historico.children[1].lastChild!.textContent = progresso.linhaDaJogada[0].toString();
        historico.children[2].lastChild!.textContent = progresso.linhaDaJogada[1].toString();
        historico.children[3].lastChild!.textContent = progresso.linhaDaJogada[2].toString();
        historico.children[4].lastChild!.textContent = progresso.linhaDaJogada[3].toString();
        historico.children[5].lastChild!.textContent = progresso.linhaDaJogada[4].toString();
        historico.children[6].lastChild!.textContent = progresso.erros.toString();
    }
}

window.addEventListener("load", () => new telaTermo(new jogo(new acervo()), new Progresso(new LocalStorageService())));


























